import { useNavigate } from 'react-router-dom';

export default function PackageCard({ pkg }) {
  const navigate = useNavigate();

  return (
    <div className="package-card" onClick={() => navigate(`/packages/${pkg.id}`)} role="button" tabIndex={0}>
      <div
        className="package-card-image"
        style={{ backgroundImage: `url(${pkg.imageUrl})` }}
      >
        {pkg.rating && (
          <div className="package-rating-stamp">★ {pkg.rating}</div>
        )}
      </div>
      <div className="package-card-body">
        <h3>{pkg.destination}</h3>
        <div className="package-meta">{pkg.duration}</div>
        <p className="package-desc">{pkg.description}</p>
        <div className="package-price-row">
          <div className="package-price">
            ₹{pkg.price?.toLocaleString('en-IN')} <span>/ person</span>
          </div>
          <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); navigate(`/packages/${pkg.id}`); }}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
