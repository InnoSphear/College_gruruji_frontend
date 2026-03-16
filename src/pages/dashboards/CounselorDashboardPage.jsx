import { useEffect, useState } from 'react';
import SectionCard from '../../components/SectionCard';
import { api } from '../../lib/api';

function CounselorDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/referrals/dashboard').then((res) => setData(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Counselor Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Referral Link">{data?.referralLink || 'site.com/register?ref=YOUR_CODE'}</SectionCard>
        <SectionCard title="Referrals">{data?.stats?.referrals || 0}</SectionCard>
        <SectionCard title="Commission Paid">{data?.stats?.paid || 0}</SectionCard>
      </div>
      <div className="rounded border border-slate-200 bg-white p-4">
        <h3 className="mb-2 font-semibold">Recent Referrals</h3>
        <div className="space-y-2 text-sm">{(data?.referrals || []).slice(0, 20).map((row) => <div key={row._id} className="rounded border border-slate-200 p-2">{row.studentId?.name} - {row.status} - {row.commissionStatus}</div>)}</div>
      </div>
    </div>
  );
}

export default CounselorDashboardPage;
