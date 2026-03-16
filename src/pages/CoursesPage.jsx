import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionCard from '../components/SectionCard';
import { api } from '../lib/api';

const streams = ['Engineering', 'MBA', 'Medical', 'Law', 'Arts', 'Commerce', 'Science'];

function CoursesPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [stream, setStream] = useState('');

  const load = async (params = {}) => {
    const res = await api.get('/catalog/courses?limit=50', { params });
    setItems(res.data.data.items || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Courses Discovery</h1>
      <SectionCard title="Find Courses">
        Search 1,000+ courses by stream, eligibility, salary potential and required entrance exams.
      </SectionCard>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Search course" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="rounded bg-[var(--primary-color)] px-4 py-2 text-white" onClick={() => load({ q, stream })}>Search</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className={`rounded-full px-3 py-1 text-sm ${stream === '' ? 'bg-[var(--primary-color)] text-white' : 'bg-slate-100'}`} onClick={() => { setStream(''); load({ q }); }}>All</button>
          {streams.map((item) => (
            <button key={item} className={`rounded-full px-3 py-1 text-sm ${stream === item ? 'bg-[var(--primary-color)] text-white' : 'bg-slate-100'}`} onClick={() => { setStream(item); load({ q, stream: item }); }}>{item}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-sm text-slate-600">{item.stream || 'General'} | {item.duration || 'NA'}</p>
            <p className="mt-2 text-xs text-slate-500">Eligibility: {item.eligibility || 'Check course page'}</p>
            <p className="text-xs text-slate-500">Average Salary: {item.averageSalary || '-'}</p>
            <Link to={`/courses/${item.slug}`} className="mt-3 inline-block text-xs font-semibold text-[var(--primary-color)]">View full details</Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;
