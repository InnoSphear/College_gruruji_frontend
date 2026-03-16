import { useEffect, useMemo, useState } from 'react';
import SectionCard from '../../components/SectionCard';
import { api } from '../../lib/api';
import AdminFormManager from '../../components/AdminFormManager';
import CmsEditor from '../../components/CmsEditor';

const modules = [
  { resource: 'colleges', title: 'Manage Colleges' },
  { resource: 'courses', title: 'Manage Courses' },
  { resource: 'exams', title: 'Manage Exams' },
  { resource: 'scholarships', title: 'Manage Scholarships' },
  { resource: 'online-courses', title: 'Manage Online Courses' },
  { resource: 'users', title: 'Manage Users' },
  { resource: 'leads', title: 'Manage Leads' },
  { resource: 'referrals', title: 'Manage Referrals' },
  { resource: 'applications', title: 'Manage Applications' },
  { resource: 'blog', title: 'Manage Blog' },
  { resource: 'crm-contacts', title: 'CRM Contacts' },
  { resource: 'crm-messages', title: 'CRM Messages' },
  { resource: 'crm-calls', title: 'CRM Calls' },
  { resource: 'crm-whatsapp-sessions', title: 'CRM WhatsApp Sessions' },
  { resource: 'crm-automation-rules', title: 'CRM Automation Rules' },
  { resource: 'audit-logs', title: 'Audit Logs' },
];

function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [linked, setLinked] = useState(null);
  const [collegeMap, setCollegeMap] = useState([]);
  const [crmUsage, setCrmUsage] = useState([]);
  const [newAdminCounselor, setNewAdminCounselor] = useState({ name: '', phone: '', email: '', password: '', whatsappNumber: '' });
  const [active, setActive] = useState(modules[0].resource);

  useEffect(() => {
    api.get('/admin/metrics').then((res) => setMetrics(res.data.data)).catch(() => {});
    api.get('/admin/linked-overview').then((res) => setLinked(res.data.data)).catch(() => {});
    api.get('/admin/colleges', { params: { limit: 12 } }).then((res) => setCollegeMap(res.data.data.items || [])).catch(() => {});
    api.get('/crm/superadmin/usage').then((res) => setCrmUsage(res.data.data.usage || [])).catch(() => {});
  }, []);

  const activeModule = useMemo(() => modules.find((m) => m.resource === active) || modules[0], [active]);

  const entries = metrics
    ? [
        ['Total Students', metrics.students],
        ['Total Colleges', metrics.colleges],
        ['Total Courses', metrics.courses],
        ['Total Exams', metrics.exams],
        ['Total Applications', metrics.applications],
        ['Online Courses', metrics.onlineCourses],
        ['Total Leads', metrics.leads],
        ['Conversion Rate', `${metrics.conversionRate}%`],
      ]
    : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Platform Admin Panel</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {entries.map(([label, value]) => (
          <SectionCard key={label} title={label}>{value}</SectionCard>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          {modules.map((module) => (
            <button
              key={module.resource}
              onClick={() => setActive(module.resource)}
              className={`rounded px-3 py-1 text-sm ${active === module.resource ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-800'}`}
            >
              {module.title}
            </button>
          ))}
        </div>
      </div>

      <AdminFormManager resource={activeModule.resource} title={activeModule.title} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Add Admin Counselor</h3>
          <form
            className="grid gap-2 md:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              await api.post('/crm/superadmin/admin-counselors', newAdminCounselor);
              setNewAdminCounselor({ name: '', phone: '', email: '', password: '', whatsappNumber: '' });
              const usageRes = await api.get('/crm/superadmin/usage');
              setCrmUsage(usageRes.data.data.usage || []);
            }}
          >
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Name" value={newAdminCounselor.name} onChange={(e) => setNewAdminCounselor({ ...newAdminCounselor, name: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Phone" value={newAdminCounselor.phone} onChange={(e) => setNewAdminCounselor({ ...newAdminCounselor, phone: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Email" value={newAdminCounselor.email} onChange={(e) => setNewAdminCounselor({ ...newAdminCounselor, email: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" type="password" placeholder="Password" value={newAdminCounselor.password} onChange={(e) => setNewAdminCounselor({ ...newAdminCounselor, password: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2 md:col-span-2" placeholder="WhatsApp Number" value={newAdminCounselor.whatsappNumber} onChange={(e) => setNewAdminCounselor({ ...newAdminCounselor, whatsappNumber: e.target.value })} />
            <button className="rounded bg-[var(--primary-color)] px-3 py-2 text-sm font-semibold text-white md:col-span-2">Create Admin Counselor</button>
          </form>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Admin Counselor CRM Usage</h3>
          <div className="space-y-2 text-sm">
            {crmUsage.map((row) => (
              <div key={row.counselor._id} className="rounded border border-slate-200 p-2">
                <p className="font-medium">{row.counselor.name} ({row.counselor.phone})</p>
                <p className="text-xs text-slate-600">WhatsApp: {row.whatsappSession?.whatsappNumber || row.profile?.whatsappNumber || '-'} | Status: {row.whatsappSession?.status || 'pending'}</p>
                <p className="text-xs text-slate-600">Contacts: {row.contacts} | Messages: {row.messages} | Calls: {row.calls}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Recent Applications</h3>
          <div className="space-y-2 text-xs">
            {(linked?.recentApplications || []).map((x) => (
              <div key={x._id} className="rounded border border-slate-200 p-2">{x.studentId?.name} {'->'} {x.collegeId?.name} ({x.status})</div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Recent Leads</h3>
          <div className="space-y-2 text-xs">
            {(linked?.recentLeads || []).map((x) => (
              <div key={x._id} className="rounded border border-slate-200 p-2">{x.studentId?.name || 'Guest'} {'->'} {x.collegeId?.name || 'General'} ({x.status})</div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Recent Referrals</h3>
          <div className="space-y-2 text-xs">
            {(linked?.recentReferrals || []).map((x) => (
              <div key={x._id} className="rounded border border-slate-200 p-2">{x.counselorId?.name} {'->'} {x.studentId?.name} ({x.status})</div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 font-semibold">College to Course Mapping</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {collegeMap.map((college) => (
            <div key={college._id} className="rounded border border-slate-200 p-3">
              <p className="font-medium">{college.name}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {(college.courses || []).length ? (college.courses || []).map((course) => (
                  <span key={course._id} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{course.name}</span>
                )) : <span className="text-xs text-slate-500">No course linked</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CmsEditor />
    </div>
  );
}

export default AdminDashboardPage;
