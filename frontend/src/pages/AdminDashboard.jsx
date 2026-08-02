import { useEffect, useState } from 'react';
import {
  getPackages, createPackage, updatePackage, deletePackage,
  getAllBookingsAdmin, getDashboard,
} from '../api/api';

const EMPTY_FORM = {
  destination: '', price: '', duration: '', description: '', imageUrl: '',
  rating: '', hotelsIncluded: '', transportation: '', meals: '',
  touristPlaces: '', itinerary: '', cancellationPolicy: '',
};

function StatusPill({ status }) {
  const cls = {
    CONFIRMED: 'status-confirmed',
    PENDING: 'status-pending',
    CANCELLED: 'status-cancelled',
  }[status] || 'status-pending';
  return <span className={`status-pill ${cls}`}>{status}</span>;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  function loadAll() {
    getDashboard().then((res) => setDashboard(res.data)).catch(() => {});
    getPackages().then((res) => setPackages(res.data)).catch(() => {});
    getAllBookingsAdmin().then((res) => setBookings(res.data)).catch(() => {});
  }

  useEffect(loadAll, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(pkg) {
    setForm({ ...EMPTY_FORM, ...pkg });
    setEditingId(pkg.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = { ...form, price: Number(form.price), rating: Number(form.rating) };
    try {
      if (editingId) {
        await updatePackage(editingId, payload);
      } else {
        await createPackage(payload);
      }
      setShowForm(false);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this package.');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this package? This cannot be undone.')) return;
    try {
      await deletePackage(id);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete this package.');
    }
  }

  return (
    <section className="container">
      <div className="page-title-block">
        <span className="section-eyebrow">Back office</span>
        <h1>Admin dashboard</h1>
      </div>

      <div className="admin-tabs" style={{ marginTop: '28px' }}>
        <button className={`admin-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`admin-tab ${tab === 'packages' ? 'active' : ''}`} onClick={() => setTab('packages')}>Packages</button>
        <button className={`admin-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Bookings</button>
      </div>

      {tab === 'overview' && (
        <div style={{ paddingBottom: '48px' }}>
          {dashboard ? (
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-value">{dashboard.totalBookings}</div>
                <div className="stat-label">Total bookings</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{dashboard.confirmedBookings}</div>
                <div className="stat-label">Confirmed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{dashboard.pendingBookings}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{dashboard.cancelledBookings}</div>
                <div className="stat-label">Cancelled</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">₹{dashboard.totalRevenue?.toLocaleString('en-IN')}</div>
                <div className="stat-label">Revenue (paid)</div>
              </div>
            </div>
          ) : (
            <div className="loading-state">Loading stats…</div>
          )}

          {dashboard?.paymentStatusBreakdown && (
            <div className="info-block">
              <h3>Payment status breakdown</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {Object.entries(dashboard.paymentStatusBreakdown).map(([status, count]) => (
                  <span key={status} className="status-pill status-pending">{status}: {count}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'packages' && (
        <div style={{ paddingBottom: '48px' }}>
          <div className="section-head" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem' }}>Manage packages</h2>
            <button className="btn btn-primary" onClick={startCreate}>+ Add package</button>
          </div>

          {showForm && (
            <form className="form-card" onSubmit={handleSubmit} style={{ maxWidth: '100%', marginBottom: '28px' }}>
              <h3>{editingId ? 'Edit package' : 'New package'}</h3>
              {error && <div className="alert-banner alert-error">{error}</div>}

              <div className="form-grid-2">
                <div className="form-row">
                  <label>Destination</label>
                  <input name="destination" required value={form.destination} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <label>Duration</label>
                  <input name="duration" placeholder="4 Days / 3 Nights" required value={form.duration} onChange={handleChange} />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-row">
                  <label>Price (₹)</label>
                  <input name="price" type="number" required value={form.price} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <label>Rating (0–5)</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <label>Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Short description</label>
                <input name="description" value={form.description} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Hotels included</label>
                <input name="hotelsIncluded" value={form.hotelsIncluded} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Transportation</label>
                <input name="transportation" value={form.transportation} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Meals</label>
                <input name="meals" value={form.meals} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Tourist places covered</label>
                <input name="touristPlaces" value={form.touristPlaces} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Day-wise itinerary (separate days with |)</label>
                <input name="itinerary" value={form.itinerary} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Cancellation policy</label>
                <input name="cancellationPolicy" value={form.cancellationPolicy} onChange={handleChange} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" type="submit">{editingId ? 'Save changes' : 'Create package'}</button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          )}

          {packages.map((pkg) => (
            <div key={pkg.id} className="admin-package-row">
              <div className="info">
                <strong>{pkg.destination}</strong>
                <span>{pkg.duration} · ₹{pkg.price?.toLocaleString('en-IN')} · ★ {pkg.rating}</span>
              </div>
              <div className="admin-actions">
                <button className="btn btn-secondary" onClick={() => startEdit(pkg)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(pkg.id)}>Delete</button>
              </div>
            </div>
          ))}

          {packages.length === 0 && <div className="empty-state">No packages yet — add your first one.</div>}
        </div>
      )}

      {tab === 'bookings' && (
        <div style={{ overflowX: 'auto', paddingBottom: '48px' }}>
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Travel date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>BK{String(b.id).padStart(4, '0')}</td>
                  <td>{b.customerName}<br /><span className="package-meta">{b.email}</span></td>
                  <td>{b.destination}</td>
                  <td>{b.travelDate}</td>
                  <td>₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                  <td>{b.paymentStatus || 'Unpaid'}</td>
                  <td><StatusPill status={b.bookingStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <div className="empty-state">No bookings yet.</div>}
        </div>
      )}
    </section>
  );
}
