import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPackages } from '../api/api';
import PackageCard from '../components/PackageCard';

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  useEffect(() => {
    getPackages()
      .then((res) => setPackages(res.data))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = packages.filter((p) =>
    p.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="container">
      <div className="page-title-block">
        <span className="section-eyebrow">All packages</span>
        <h1>Tour packages</h1>
      </div>

      <div className="search-bar" style={{ margin: '24px 0 40px', maxWidth: '420px' }}>
        <input
          type="text"
          placeholder="Filter by destination…"
          value={search}
          onChange={(e) => setSearchParams(e.target.value ? { search: e.target.value } : {})}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading packages…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No packages match "{search}". Try a different destination.</div>
      ) : (
        <div className="package-grid" style={{ paddingBottom: '48px' }}>
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </section>
  );
}
