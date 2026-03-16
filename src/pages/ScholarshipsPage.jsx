import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionCard from '../components/SectionCard';
import { api } from '../lib/api';

function ScholarshipsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');

  const load = async (params = {}) => {
    const res = await api.get('/catalog/scholarships?limit=30', { params });
    setItems(res.data.data.items || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Scholarships</h1>
      <SectionCard title="Explore Scholarships">
        Find scholarships by provider, eligibility and amount. Use search to quickly shortlist matching options.
      </SectionCard>

      <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Search scholarships" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="rounded bg-[var(--primary-color)] px-4 py-2 text-white" onClick={() => load({ q })}>Search</button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" key={item._id}>
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-sm text-slate-600">Provider: {item.provider || 'NA'}</p>
            <p className="text-xs text-slate-500">Amount: {item.amount || '-'}</p>
            <Link to={`/scholarships/${item.slug}`} className="mt-2 inline-block text-xs font-semibold text-[var(--primary-color)]">View full details</Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ScholarshipsPage;
