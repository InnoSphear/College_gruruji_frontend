import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionCard from '../components/SectionCard';
import { api } from '../lib/api';

const initialFilters = {
  q: '',
  city: '',
  state: '',
  country: '',
  exam: '',
  minFees: '',
  maxFees: '',
  ranking: '',
  minPackage: '',
};

function CollegesPage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);

  const queryParams = useMemo(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '') params[k] = v;
    });
    return params;
  }, [filters]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/catalog/colleges', { params: queryParams });
      setItems(res.data.data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <h1 className="text-xl font-bold">Find Colleges</h1>
        <p className="text-sm text-slate-600">Search + filter by location, fees, ranking, exam and package.</p>

        {Object.keys(initialFilters).map((key) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2"
              value={filters[key]}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              placeholder={`Enter ${key}`}
            />
          </label>
        ))}

        <div className="flex gap-2">
          <button className="w-full rounded bg-[var(--primary-color)] px-3 py-2 text-sm font-semibold text-white" onClick={load}>Apply Filters</button>
          <button className="w-full rounded border border-slate-300 px-3 py-2 text-sm" onClick={() => { setFilters(initialFilters); setTimeout(() => load().catch(() => {}), 0); }}>Reset</button>
        </div>
      </aside>

      <section className="space-y-4">
        <SectionCard title={loading ? 'Loading colleges...' : `Colleges (${items.length})`}>
          Browse college profiles with overview, fees, admission process, placement stats, ranking and contact details.
        </SectionCard>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <article key={item._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-slate-600">{item.city}, {item.state}, {item.country}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <span className="rounded bg-slate-100 px-2 py-1">Fees: {item.feesMax || '-'}</span>
                <span className="rounded bg-slate-100 px-2 py-1">Rank: {item.ranking || '-'}</span>
                <span className="rounded bg-slate-100 px-2 py-1">Avg Package: {item.avgPackage || '-'}</span>
                <span className="rounded bg-slate-100 px-2 py-1">Rating: {item.rating || '-'}</span>
              </div>
              {Array.isArray(item.courses) && item.courses.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.courses.slice(0, 4).map((course) => (
                    <span key={course._id} className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                      {course.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-sm text-slate-600">{item.overview || 'Detailed overview, admission, cutoff, placements and infrastructure available.'}</p>
              <Link to={`/colleges/${item.slug}`} className="mt-3 inline-block text-xs font-semibold text-[var(--primary-color)]">View full college page</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CollegesPage;
