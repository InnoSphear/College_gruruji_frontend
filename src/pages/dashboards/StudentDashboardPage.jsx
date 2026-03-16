import { useEffect, useState } from 'react';
import SectionCard from '../../components/SectionCard';
import { api } from '../../lib/api';

function StudentDashboardPage() {
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [predictorForm, setPredictorForm] = useState({ marks12: '', entranceExamScore: '' });
  const [predictorResult, setPredictorResult] = useState(null);
  const [counselingForm, setCounselingForm] = useState({ mode: 'call', scheduleAt: '' });
  const [actionMsg, setActionMsg] = useState('');

  const loadDashboard = () => {
    api.get('/applications/mine').then((res) => setApplications(res.data.data || [])).catch(() => {});
    api.get('/notifications/mine').then((res) => setNotifications(res.data.data || [])).catch(() => {});
    api.get('/counseling/mine').then((res) => setSessions(res.data.data || [])).catch(() => {});
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const runScholarshipPredictor = async (e) => {
    e.preventDefault();
    setActionMsg('');
    try {
      const { data } = await api.post('/recommendations/scholarship-predictor', {
        marks12: Number(predictorForm.marks12 || 0),
        entranceExamScore: Number(predictorForm.entranceExamScore || 0),
      });
      setPredictorResult(data.data);
    } catch {
      setActionMsg('Unable to run scholarship predictor right now.');
    }
  };

  const requestCounseling = async (e) => {
    e.preventDefault();
    setActionMsg('');
    try {
      await api.post('/counseling/request', {
        mode: counselingForm.mode,
        scheduleAt: counselingForm.scheduleAt || undefined,
      });
      setCounselingForm({ mode: 'call', scheduleAt: '' });
      setActionMsg('Counseling request submitted.');
      loadDashboard();
    } catch {
      setActionMsg('Unable to submit counseling request.');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Applications">{applications.length}</SectionCard>
        <SectionCard title="Unread Alerts">{notifications.filter((n) => !n.isRead).length}</SectionCard>
        <SectionCard title="Counseling Requests">{sessions.length}</SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-semibold">Scholarship Predictor</h3>
          <form onSubmit={runScholarshipPredictor} className="grid gap-2 sm:grid-cols-2">
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="12th Marks" value={predictorForm.marks12} onChange={(e) => setPredictorForm({ ...predictorForm, marks12: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Entrance Score" value={predictorForm.entranceExamScore} onChange={(e) => setPredictorForm({ ...predictorForm, entranceExamScore: e.target.value })} />
            <button className="rounded bg-[var(--primary-color)] px-3 py-2 text-white sm:col-span-2">Check Eligibility</button>
          </form>
          {predictorResult ? <p className="mt-2 text-sm text-slate-700">Tier: <span className="font-semibold">{predictorResult.eligibilityTier}</span> | {predictorResult.recommendation}</p> : null}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-semibold">Request Counseling</h3>
          <form onSubmit={requestCounseling} className="grid gap-2 sm:grid-cols-2">
            <select className="rounded border border-slate-300 px-3 py-2" value={counselingForm.mode} onChange={(e) => setCounselingForm({ ...counselingForm, mode: e.target.value })}>
              <option value="call">Call</option>
              <option value="chat">Chat</option>
              <option value="video">Video</option>
            </select>
            <input type="datetime-local" className="rounded border border-slate-300 px-3 py-2" value={counselingForm.scheduleAt} onChange={(e) => setCounselingForm({ ...counselingForm, scheduleAt: e.target.value })} />
            <button className="rounded bg-emerald-600 px-3 py-2 text-white sm:col-span-2">Submit Request</button>
          </form>
          {actionMsg ? <p className="mt-2 text-sm text-slate-700">{actionMsg}</p> : null}
        </section>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-2 font-semibold">Recent Applications</h3>
        <div className="space-y-2 text-sm">{applications.slice(0, 20).map((app) => <div key={app._id} className="rounded border border-slate-200 p-2">{app.collegeId?.name} - {app.status}</div>)}</div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-2 font-semibold">Recent Notifications</h3>
        <div className="space-y-2 text-sm">
          {notifications.slice(0, 10).map((item) => (
            <div key={item._id} className="rounded border border-slate-200 p-2">
              <p className="font-medium">{item.title || 'Update'}</p>
              <p className="text-slate-600">{item.body || 'No details available'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardPage;
