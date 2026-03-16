import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

function ScholarshipDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.get(`/catalog/scholarships/${slug}`).then((res) => setItem(res.data.data)).catch(() => setItem(null));
  }, [slug]);

  if (!item) return <div className="rounded-xl border border-slate-200 bg-white p-6">Loading scholarship details...</div>;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-gradient-to-r from-fuchsia-700 to-indigo-600 p-6 text-white">
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="mt-1 text-sm">Provider: {item.provider || 'NA'}</p>
      </section>
      <article className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-2 text-lg font-semibold">Eligibility Criteria</h2>
        <p className="text-sm text-slate-700">{item.eligibilityCriteria || 'Eligibility details available on provider portal.'}</p>
        <p className="mt-2 text-sm">Amount: {item.amount || '-'}</p>
        <p className="text-sm">Deadline: {item.applicationDeadline ? new Date(item.applicationDeadline).toLocaleDateString() : 'TBA'}</p>
        {item.applicationLink && <a className="mt-3 inline-block rounded bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white" href={item.applicationLink} target="_blank" rel="noreferrer">Apply on Official Site</a>}
      </article>
    </div>
  );
}

export default ScholarshipDetailPage;
