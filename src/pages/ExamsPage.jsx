import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionCard from '../components/SectionCard';
import { api } from '../lib/api';

function ExamsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');

  const load = async (params = {}) => {
    const res = await api.get('/catalog/exams?limit=50', { params });
    setItems(res.data.data.items || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Entrance Exams</h1>
      <SectionCard title="Exam Calendar & Alerts">
        Track exam pattern, syllabus, important dates, registration links, admit cards, results, and cutoffs.
      </SectionCard>

      <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <input className="w-full rounded border border-slate-300 px-3 py-2" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search JEE, NEET, CAT, CLAT, CUET..." />
        <button className="rounded bg-[var(--primary-color)] px-4 py-2 text-white" onClick={() => load({ q })}>Search</button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <article key={item._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium">Code: {item.code}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{item.pattern || 'Pattern available on detail page'}</p>
            <p className="text-sm text-slate-500">Eligibility: {item.eligibility || 'See latest criteria'}</p>
            <Link to={`/exams/${item.slug}`} className="mt-2 inline-block text-xs font-semibold text-[var(--primary-color)]">View full exam page</Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ExamsPage;
