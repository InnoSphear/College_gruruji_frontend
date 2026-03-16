import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

function CompareCollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [selected, setSelected] = useState([]);
  const [table, setTable] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/catalog/colleges', { params: { limit: 100 } })
      .then((res) => setColleges(res.data.data.items || []))
      .catch(() => setError('Unable to load colleges right now.'));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return colleges;
    return colleges.filter((c) => `${c.name} ${c.city} ${c.state}`.toLowerCase().includes(query));
  }, [colleges, search]);

  const toggleCollege = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id].slice(0, 4)));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (selected.length < 2) {
      setError('Select at least 2 colleges to compare.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/compare-colleges', { collegeIds: selected });
      setTable(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Compare Colleges</h1>
      <form onSubmit={submit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search colleges by name or city"
        />
        <div className="max-h-64 overflow-auto rounded-lg border border-slate-200 p-2">
          <div className="grid gap-2 sm:grid-cols-2">
            {filtered.map((college) => (
              <label key={college._id} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-2 py-2 text-sm hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selected.includes(college._id)}
                  onChange={() => toggleCollege(college._id)}
                  disabled={!selected.includes(college._id) && selected.length >= 4}
                />
                <span>{college.name} ({college.city})</span>
              </label>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500">Select 2 to 4 colleges.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="rounded-lg bg-[var(--primary-color)] px-4 py-2 text-white" disabled={loading}>
          {loading ? 'Comparing...' : 'Compare'}
        </button>
      </form>
      {table.length > 0 && (
        <div className="overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2">College</th><th className="p-2">Fees</th><th className="p-2">Package</th><th className="p-2">Ranking</th><th className="p-2">Rating</th></tr></thead>
            <tbody>{table.map((row) => <tr key={row.college} className="border-t border-slate-200"><td className="p-2">{row.college}</td><td className="p-2">{row.fees || '-'}</td><td className="p-2">{row.avgPackage || '-'}</td><td className="p-2">{row.ranking || '-'}</td><td className="p-2">{row.reviews || '-'}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CompareCollegesPage;
