import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBooking } from '../api/api';

export default function Confirmation() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    getBooking(bookingId).then((res) => setBooking(res.data)).catch(() => {});
  }, [bookingId]);

  if (!booking) return <div className="loading-state">Loading confirmation…</div>;

  const isConfirmed = booking.bookingStatus === 'CONFIRMED';

  return (
    <section className="container" style={{ padding: '56px 0' }}>
      <div className="boarding-pass">
        <div className="boarding-pass-main">
          <div className="boarding-pass-eyebrow">Booking confirmation</div>
          <h2>{booking.destination}</h2>

          <div className="pass-detail-row">
            <span>Booking ID</span>
            <span>BK{String(booking.id).padStart(4, '0')}</span>
          </div>
          <div className="pass-detail-row">
            <span>Transaction ID</span>
            <span>{booking.transactionId || '—'}</span>
          </div>
          <div className="pass-detail-row">
            <span>Traveller</span>
            <span>{booking.customerName}</span>
          </div>
          <div className="pass-detail-row">
            <span>Travel date</span>
            <span>{booking.travelDate}</span>
          </div>
          <div className="pass-detail-row">
            <span>Travellers</span>
            <span>{booking.adults} adult(s), {booking.children} child(ren)</span>
          </div>
          <div className="pass-detail-row">
            <span>Amount paid</span>
            <span>₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="boarding-pass-stub">
          <span className="stub-label">Status</span>
          <span className="stub-status">{isConfirmed ? 'Confirmed' : booking.bookingStatus}</span>
          <span className="stub-code">BK{String(booking.id).padStart(4, '0')}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link to="/my-bookings" className="btn btn-primary">View my bookings</Link>
        <Link to="/packages" className="btn btn-secondary">Browse more packages</Link>
      </div>
    </section>
  );
}
