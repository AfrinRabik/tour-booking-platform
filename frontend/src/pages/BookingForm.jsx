import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById, createBooking } from '../api/api';

const CHILD_PRICE_MULTIPLIER = 0.5; // mirrors the backend's pricing rule, for live preview only

export default function BookingForm() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    travelDate: '',
    adults: 1,
    children: 0,
  });

  useEffect(() => {
    getPackageById(packageId).then((res) => setPkg(res.data)).catch(() => {});
  }, [packageId]);

  const total = pkg
    ? form.adults * pkg.price + form.children * pkg.price * CHILD_PRICE_MULTIPLIER
    : 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'adults' || name === 'children' ? Number(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await createBooking({ ...form, packageId: Number(packageId) });
      navigate(`/payment/${res.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data || {})[0]
        || 'Something went wrong creating your booking. Please check your details and try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (!pkg) return <div className="loading-state">Loading…</div>;

  return (
    <section className="container">
      <div className="page-title-block">
        <span className="section-eyebrow">Step 2 of 3</span>
        <h1>Traveller details</h1>
      </div>

      <div style={{ padding: '32px 0' }}>
        <form className="form-card" onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '20px' }}>{pkg.destination} — {pkg.duration}</h3>

          {error && <div className="alert-banner alert-error">{error}</div>}

          <div className="form-row">
            <label htmlFor="customerName">Full name</label>
            <input id="customerName" name="customerName" required value={form.customerName} onChange={handleChange} />
          </div>

          <div className="form-grid-2">
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" required value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-row">
              <label htmlFor="travelDate">Travel date</label>
              <input
                id="travelDate"
                name="travelDate"
                type="date"
                required
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                value={form.travelDate}
                onChange={handleChange}
              />
            </div>
            <div />
          </div>

          <div className="form-grid-2">
            <div className="form-row">
              <label htmlFor="adults">Adults</label>
              <input id="adults" name="adults" type="number" min={1} required value={form.adults} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label htmlFor="children">Children</label>
              <input id="children" name="children" type="number" min={0} value={form.children} onChange={handleChange} />
            </div>
          </div>

          <div className="total-summary">
            <span>Total amount</span>
            <strong>₹{total.toLocaleString('en-IN')}</strong>
          </div>

          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating booking…' : 'Continue to payment'}
          </button>
        </form>
      </div>
    </section>
  );
}
