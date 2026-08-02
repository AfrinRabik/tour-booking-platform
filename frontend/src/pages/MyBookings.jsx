import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingHistory, cancelBooking } from '../api/api';

function StatusPill({ status }) {
  const cls = {
    CONFIRMED: 'status-confirmed',
    PENDING: 'status-pending',
    CANCELLED: 'status-cancelled',
  }[status] || 'status-pending';
  return <span className={`status-pill ${cls}`}>{status}</span>;
}

export default function MyBookings() {
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLookup(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSearched(true);
    try {
      const res = await getBookingHistory(email);
      setBookings(res.data);
    } catch {
      setError('Could not load bookings for that email.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!confirm('Cancel this booking? This cannot be undone.')) return;
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, bookingStatus: 'CANCELLED' } : b)));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel this booking.');
    }
  }

  return (
    <section className="container">
      <div className="page-title-block">
        <span className="section-eyebrow">Your trips</span>
        <h1>My bookings</h1>
      </div>

      <form onSubmit={handleLookup} className="search-bar" style={{ margin: '24px 0 32px', maxWidth: '480px' }}>
        <input
          type="email"
          placeholder="Enter the email you booked with…"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">{loading ? 'Looking…' : 'View bookings'}</button>
      </form>

      {error && <div className="alert-banner alert-error">{error}</div>}

      {searched && !loading && !error && bookings.length === 0 && (
        <div className="empty-state">No bookings found for that email.</div>
      )}

      {bookings.length > 0 && (
        <div style={{ overflowX: 'auto', paddingBottom: '48px' }}>
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Destination</th>
                <th>Travel date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>BK{String(b.id).padStart(4, '0')}</td>
                  <td>{b.destination}</td>
                  <td>{b.travelDate}</td>
                  <td>₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                  <td>{b.paymentStatus || 'Unpaid'}</td>
                  <td><StatusPill status={b.bookingStatus} /></td>
                  <td>
                    <div className="admin-actions">
                      {b.bookingStatus === 'PENDING' && (
                        <button className="btn btn-primary" onClick={() => navigate(`/payment/${b.id}`)}>Pay</button>
                      )}
                      {b.bookingStatus !== 'CANCELLED' && (
                        <button className="btn btn-danger" onClick={() => handleCancel(b.id)}>Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
