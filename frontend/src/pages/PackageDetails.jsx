import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById } from '../api/api';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPackageById(id)
      .then((res) => setPkg(res.data))
      .catch(() => setError('This package could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state">Loading package…</div>;
  if (error) return <div className="empty-state">{error}</div>;
  if (!pkg) return null;

  return (
    <>
      <div className="details-hero" style={{ backgroundImage: `url(${pkg.imageUrl})` }}>
        <div className="container">
          <div className="details-hero-content">
            <span className="hero-eyebrow">{pkg.duration} · ★ {pkg.rating}</span>
            <h1>{pkg.destination}</h1>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="details-grid">
          <div>
            <div className="info-block">
              <h3>Overview</h3>
              <p>{pkg.description}</p>
            </div>
            {pkg.itinerary && (
              <div className="info-block">
                <h3>Day-wise itinerary</h3>
                <p>{pkg.itinerary.split('|').map((s) => s.trim()).join('\n')}</p>
              </div>
            )}
            {pkg.hotelsIncluded && (
              <div className="info-block">
                <h3>Hotels included</h3>
                <p>{pkg.hotelsIncluded}</p>
              </div>
            )}
            {pkg.transportation && (
              <div className="info-block">
                <h3>Transportation</h3>
                <p>{pkg.transportation}</p>
              </div>
            )}
            {pkg.meals && (
              <div className="info-block">
                <h3>Meals</h3>
                <p>{pkg.meals}</p>
              </div>
            )}
            {pkg.touristPlaces && (
              <div className="info-block">
                <h3>Tourist places covered</h3>
                <p>{pkg.touristPlaces}</p>
              </div>
            )}
            {pkg.cancellationPolicy && (
              <div className="info-block">
                <h3>Cancellation policy</h3>
                <p>{pkg.cancellationPolicy}</p>
              </div>
            )}
          </div>

          <div className="booking-sidebar">
            <div className="price-line">
              <strong>₹{pkg.price?.toLocaleString('en-IN')}</strong>
              <span className="package-meta">/ person</span>
            </div>
            <p className="package-desc" style={{ marginBottom: '20px' }}>
              {pkg.duration}
            </p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate(`/book/${pkg.id}`)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
