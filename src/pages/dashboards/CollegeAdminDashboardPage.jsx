import { useState } from 'react';
import SectionCard from '../../components/SectionCard';
import { api } from '../../lib/api';

function CollegeAdminDashboardPage() {
  const [collegeId, setCollegeId] = useState('');
  const [data, setData] = useState(null);

  const load = async () => {
    const { data: res } = await api.get('/college-admin/dashboard', { params: { collegeId } });
    setData(res.data);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">College Admin Panel</h1>

      <div className="rounded border border-slate-200 bg-white p-4">
        <p className="mb-2 text-sm text-slate-600">Enter your college ID to load leads/applications.</p>
        <div className="flex gap-2">
          <input className="w-full rounded border border-slate-300 px-3 py-2" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} placeholder="College ID" />
          <button className="rounded bg-blue-700 px-4 py-2 text-white" onClick={load}>Load</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Lead Inbox">{data?.stats?.leads ?? 0}</SectionCard>
        <SectionCard title="Applications">{data?.stats?.applications ?? 0}</SectionCard>
        <SectionCard title="Admitted">{data?.stats?.admitted ?? 0}</SectionCard>
      </div>

      <div className="rounded border border-slate-200 bg-white p-4">
        <h3 className="mb-3 font-semibold">Recent Leads</h3>
        <div className="space-y-2 text-sm">
          {(data?.leads || []).slice(0, 20).map((lead) => (
            <div key={lead._id} className="rounded border border-slate-200 p-2">{lead.studentId?.name} - {lead.status}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollegeAdminDashboardPage;
