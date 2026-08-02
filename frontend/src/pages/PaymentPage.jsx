import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooking, processPayment } from '../api/api';

const METHODS = [
  { value: 'UPI', label: 'UPI' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'NET_BANKING', label: 'Net Banking' },
];

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [method, setMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getBooking(bookingId).then((res) => setBooking(res.data)).catch(() => {});
  }, [bookingId]);

  async function handlePay() {
    setError('');
    setProcessing(true);
    try {
      await processPayment({ bookingId: Number(bookingId), paymentMethod: method });
      navigate(`/confirmation/${bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment could not be processed. Please try again.');
      setProcessing(false);
    }
  }

  if (!booking) return <div className="loading-state">Loading booking…</div>;

  return (
    <section className="container">
      <div className="page-title-block">
        <span className="section-eyebrow">Step 3 of 3</span>
        <h1>Payment</h1>
      </div>

      <div style={{ padding: '32px 0' }}>
        <div className="form-card">
          <h3>{booking.destination}</h3>
          <p className="package-meta" style={{ marginBottom: '20px' }}>
            Travel date: {booking.travelDate} · {booking.adults} adult(s), {booking.children} child(ren)
          </p>

          {error && <div className="alert-banner alert-error">{error}</div>}

          <div className="total-summary">
            <span>Amount to pay</span>
            <strong>₹{booking.totalAmount?.toLocaleString('en-IN')}</strong>
          </div>

          <label style={{ display: 'block', fontWeight: 600, marginBottom: '10px', color: 'var(--ink)', fontSize: '0.85rem' }}>
            Choose payment method
          </label>
          <div className="payment-methods">
            {METHODS.map((m) => (
              <button
                type="button"
                key={m.value}
                className={`payment-method-option ${method === m.value ? 'selected' : ''}`}
                onClick={() => setMethod(m.value)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button className="btn btn-primary btn-block" onClick={handlePay} disabled={processing}>
            {processing ? 'Processing payment…' : `Pay ₹${booking.totalAmount?.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>
    </section>
  );
}
