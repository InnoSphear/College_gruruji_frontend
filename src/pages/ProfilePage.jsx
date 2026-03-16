import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../lib/api';
import SectionCard from '../components/SectionCard';

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

const studentTabs = ['overview', 'profile', 'applications', 'counseling', 'predictor', 'leads-revenue'];

function ProfilePage() {
  const user = useMemo(() => readUser(), []);
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [predictForm, setPredictForm] = useState({ entranceExamScore: '', budget: '', locationPreference: '', courseInterest: '' });
  const [predictResult, setPredictResult] = useState([]);
  const [predictSummary, setPredictSummary] = useState('');
  const [predictError, setPredictError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'en',
    marks10: '',
    marks12: '',
    preferredCourses: '',
    preferredCity: '',
    budget: '',
  });

  useEffect(() => {
    if (!token) return;
    api.get('/auth/profile').then((res) => {
      const data = res.data.data;
      setProfile(data);
      setForm({
        name: data.user?.name || '',
        email: data.user?.email || '',
        phone: data.user?.phone || '',
        language: data.user?.language || 'en',
        marks10: data.studentProfile?.marks10 || '',
        marks12: data.studentProfile?.marks12 || '',
        preferredCourses: (data.studentProfile?.preferredCourses || []).join(', '),
        preferredCity: (data.studentProfile?.preferredCity || []).join(', '),
        budget: data.studentProfile?.budget || '',
      });
    }).catch(() => {});

    if (user?.role === 'student') {
      api.get('/applications/mine').then((res) => setApplications(res.data.data || [])).catch(() => {});
      api.get('/notifications/mine').then((res) => setNotifications(res.data.data || [])).catch(() => {});
      api.get('/counseling/mine').then((res) => setSessions(res.data.data || [])).catch(() => {});
    }
  }, [token, user?.role]);

  if (!token || !user) return <Navigate to="/login" replace />;

  const profileCompletion = useMemo(() => {
    const checks = [
      Boolean(form.name),
      Boolean(form.phone),
      Boolean(form.email),
      user.role !== 'student' || Boolean(form.marks12),
      user.role !== 'student' || Boolean(form.preferredCourses),
      user.role !== 'student' || Boolean(form.preferredCity),
      user.role !== 'student' || Boolean(form.budget),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form, user.role]);

  const save = async (e) => {
    e.preventDefault();
    setMsg('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone,
        language: form.language,
      };
      if (user.role === 'student') {
        payload.studentProfile = {
          marks10: form.marks10 ? Number(form.marks10) : undefined,
          marks12: form.marks12 ? Number(form.marks12) : undefined,
          preferredCourses: form.preferredCourses ? form.preferredCourses.split(',').map((x) => x.trim()).filter(Boolean) : [],
          preferredCity: form.preferredCity ? form.preferredCity.split(',').map((x) => x.trim()).filter(Boolean) : [],
          budget: form.budget ? Number(form.budget) : undefined,
        };
      }

      const { data } = await api.patch('/auth/profile', payload);
      const freshUser = data.data.user;
      localStorage.setItem('user', JSON.stringify(freshUser));
      setProfile(data.data);
      setMsg('Profile updated successfully.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const runPredictor = async (e) => {
    e.preventDefault();
    setPredictError('');
    try {
      const payload = {
        entranceExamScore: Number(predictForm.entranceExamScore || 0),
        budget: Number(predictForm.budget || 0),
        locationPreference: predictForm.locationPreference ? predictForm.locationPreference.split(',').map((x) => x.trim()).filter(Boolean) : [],
        courseInterest: predictForm.courseInterest || undefined,
      };
      const { data } = await api.post('/recommendations/college-predictor', payload);
      setPredictResult(data.data.ranked || []);
      setPredictSummary(data.data.aiSummary || '');
    } catch (err) {
      setPredictError(err.response?.data?.message || 'Predictor failed. Please try again.');
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">{profile?.user?.name || user.name}</h1>
        <p className="mt-1 text-sm text-white/90">{user.role.replace('_', ' ')}</p>
      </section>

      {user.role === 'student' && (
        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
          {studentTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ${activeTab === tab ? 'bg-[var(--primary-color)] text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      )}

      {(user.role !== 'student' || activeTab === 'overview') && (
        <div className="grid gap-4 lg:grid-cols-4">
          <SectionCard title="Applications">{applications.length}</SectionCard>
          <SectionCard title="Unread Alerts">{notifications.filter((n) => !n.isRead).length}</SectionCard>
          <SectionCard title="Counseling Requests">{sessions.length}</SectionCard>
          <SectionCard title="Profile Completion">{profileCompletion}%</SectionCard>
        </div>
      )}

      {(user.role !== 'student' || activeTab === 'profile') && (
        <SectionCard title="Profile Settings">
          <form onSubmit={save} className="grid gap-3 md:grid-cols-2">
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
            {user.role === 'student' && (
              <>
                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="10th Marks" value={form.marks10} onChange={(e) => setForm({ ...form, marks10: e.target.value })} />
                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="12th Marks" value={form.marks12} onChange={(e) => setForm({ ...form, marks12: e.target.value })} />
                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Preferred Courses (comma separated)" value={form.preferredCourses} onChange={(e) => setForm({ ...form, preferredCourses: e.target.value })} />
                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Preferred Cities (comma separated)" value={form.preferredCity} onChange={(e) => setForm({ ...form, preferredCity: e.target.value })} />
                <input className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
              </>
            )}
            <div className="md:col-span-2">
              <button className="rounded-lg bg-[var(--primary-color)] px-4 py-2 font-semibold text-white" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              {msg && <p className="mt-2 text-sm text-slate-700">{msg}</p>}
            </div>
          </form>
        </SectionCard>
      )}

      {user.role === 'student' && activeTab === 'applications' && (
        <SectionCard title="Applications">
          <div className="space-y-2 text-sm">{applications.map((app) => <div key={app._id} className="rounded-lg border border-slate-200 p-3">{app.collegeId?.name} - {app.status}</div>)}</div>
        </SectionCard>
      )}

      {user.role === 'student' && activeTab === 'counseling' && (
        <SectionCard title="Counseling Sessions">
          <div className="space-y-2 text-sm">{sessions.map((item) => <div key={item._id} className="rounded-lg border border-slate-200 p-3">{item.mode} - {item.status}</div>)}</div>
        </SectionCard>
      )}

      {user.role === 'student' && activeTab === 'predictor' && (
        <SectionCard title="AI College Predictor">
          <form onSubmit={runPredictor} className="grid gap-2 md:grid-cols-2">
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Entrance Exam Score" value={predictForm.entranceExamScore} onChange={(e) => setPredictForm({ ...predictForm, entranceExamScore: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Budget" value={predictForm.budget} onChange={(e) => setPredictForm({ ...predictForm, budget: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Preferred Locations (comma separated)" value={predictForm.locationPreference} onChange={(e) => setPredictForm({ ...predictForm, locationPreference: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Course Interest" value={predictForm.courseInterest} onChange={(e) => setPredictForm({ ...predictForm, courseInterest: e.target.value })} />
            <button className="rounded-lg bg-[var(--primary-color)] px-3 py-2 text-white md:col-span-2">Run Predictor</button>
          </form>
          {predictError && <p className="mt-2 text-sm text-rose-600">{predictError}</p>}
          {predictSummary && <p className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{predictSummary}</p>}
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {predictResult.map((item) => (
              <div key={item.college._id || item.college.slug} className="rounded-lg border border-slate-200 p-3 text-sm">
                <p className="font-semibold">{item.college.name}</p>
                <p>Score: {item.modelScore} | Probability: {item.admissionProbability}%</p>
                <p>ROI: {item.estimatedROI}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {user.role === 'student' && activeTab === 'leads-revenue' && (
        <div className="grid gap-4 md:grid-cols-3">
          <SectionCard title="High Intent Leads">{applications.filter((a) => ['applied', 'admitted'].includes(a.status)).length}</SectionCard>
          <SectionCard title="Potential Revenue Signal">{applications.length * 2500}</SectionCard>
          <SectionCard title="Conversion Readiness">{Math.min(100, profileCompletion + applications.length * 5)}%</SectionCard>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
