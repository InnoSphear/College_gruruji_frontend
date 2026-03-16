import { useEffect, useState } from 'react';
import SectionCard from '../components/SectionCard';
import { api } from '../lib/api';

function BlogPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/catalog/blog-posts', {
        params: { q: query, limit: 24 },
      });
      setItems(data.data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Blog & CMS Content</h1>
      <SectionCard title="Guides and Insights">Expert articles on exams, admissions, profile building, and career strategy.</SectionCard>
      <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Search blog articles"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="rounded bg-[var(--primary-color)] px-4 py-2 text-white" onClick={() => load(q)}>Search</button>
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading articles...</p> : null}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600 line-clamp-4">{item.content || 'Read full article from the blog detail page.'}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogPage;
