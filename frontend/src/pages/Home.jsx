import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPackages } from '../api/api';
import PackageCard from '../components/PackageCard';

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPackages()
      .then((res) => setPackages(res.data))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = packages.slice(0, 3);
  const destinations = [...new Set(packages.map((p) => p.destination.split(' ')[0]))].slice(0, 6);

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/packages?search=${encodeURIComponent(query)}` : '/packages');
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">Boarding pass to anywhere</div>
          <h1>Book the trip, skip the phone calls.</h1>
          <p>
            Browse curated tour packages, lock in your dates, and pay in a couple of
            clicks — no back-and-forth with an agent required.
          </p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search a destination — Goa, Kerala, Ladakh…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Handpicked</span>
            <h2>Featured packages</h2>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/packages')}>
            View all
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading packages…</div>
        ) : featured.length === 0 ? (
          <div className="empty-state">No packages available yet — check back soon.</div>
        ) : (
          <div className="package-grid">
            {featured.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </section>

      {destinations.length > 0 && (
        <section className="section container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Where to next</span>
              <h2>Popular destinations</h2>
            </div>
          </div>
          <div className="package-grid">
            {destinations.map((d) => (
              <div
                key={d}
                className="package-card"
                style={{ padding: '28px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => navigate(`/packages?search=${encodeURIComponent(d)}`)}
              >
                <h3 style={{ marginBottom: 0 }}>{d}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Word on the road</span>
            <h2>What travellers say</h2>
          </div>
        </div>
        <div className="package-grid">
          {[
            { name: 'Ananya R.', text: 'Booking took five minutes and the confirmation was instant — a big step up from calling the agency.' },
            { name: 'Vikram S.', text: 'The itinerary breakdown before booking meant zero surprises once we landed.' },
            { name: 'Priya M.', text: 'Cancelled a booking last minute and it was painless — no phone tag needed.' },
          ].map((r) => (
            <div key={r.name} className="package-card" style={{ padding: '24px' }}>
              <p className="package-desc" style={{ fontStyle: 'italic' }}>&ldquo;{r.text}&rdquo;</p>
              <div className="package-meta" style={{ marginTop: '12px' }}>— {r.name}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
