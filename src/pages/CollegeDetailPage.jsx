import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

function CollegeDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [college, setCollege] = useState(null);
  const [form, setForm] = useState({ courseId: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/catalog/colleges/${slug}`).then((res) => {
      const data = res.data.data;
      setCollege(data);
      setForm((prev) => ({ ...prev, courseId: data?.courses?.[0]?._id || '' }));
    }).catch(() => setCollege(null));
  }, [slug]);

  const isStudent = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return user?.role === 'student';
    } catch {
      return false;
    }
  }, []);

  const apply = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      toast.error('Login as student to apply');
      navigate('/login');
      return;
    }
    if (!form.courseId) return toast.error('Select a course');

    setSubmitting(true);
    try {
      await api.post('/applications', {
        collegeId: college._id,
        courseId: form.courseId,
        formData: { notes: form.notes },
      });
      toast.success('Application submitted successfully');
      setForm({ ...form, notes: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!college) return <div className="rounded-xl border border-slate-200 bg-white p-6">Loading college details...</div>;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-gradient-to-r from-[var(--primary-color)] to-sky-600 p-6 text-white">
        <h1 className="text-3xl font-bold">{college.name}</h1>
        <p className="mt-1 text-sm text-white/90">{college.city}, {college.state}, {college.country}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Overview</h2>
            <p className="text-sm text-slate-700">{college.overview || 'College overview, infrastructure, placements and rankings are listed here.'}</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Courses Offered</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {(college.courses || []).map((course) => (
                <div key={course._id} className="rounded border border-slate-200 p-3 text-sm">
                  <p className="font-medium">{course.name}</p>
                  <p className="text-xs text-slate-500">{course.stream || 'General'}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Admission & Placement Snapshot</h2>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p>Fees Range: {college.feesMin || '-'} - {college.feesMax || '-'}</p>
              <p>Avg Package: {college.avgPackage || '-'}</p>
              <p>Ranking: {college.ranking || '-'}</p>
              <p>Rating: {college.rating || '-'}</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">Admission Process: {college.admissionProcess || 'Check official updates for latest admission process.'}</p>
            <p className="text-sm text-slate-600">Placement Stats: {college.placementStats || 'Latest placements and recruiters details available.'}</p>
          </article>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Apply Now</h3>
            {isStudent ? (
              <form onSubmit={apply} className="space-y-3">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Select Course</span>
                  <select className="w-full rounded border border-slate-300 px-3 py-2" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
                    {(college.courses || []).map((course) => (
                      <option key={course._id} value={course._id}>{course.name}</option>
                    ))}
                  </select>
                </label>
                <textarea className="h-24 w-full rounded border border-slate-300 px-3 py-2" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <button disabled={submitting} className="w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white">{submitting ? 'Submitting...' : 'Submit Application'}</button>
              </form>
            ) : (
              <p className="text-sm text-slate-600">Login as student to apply directly.</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm">
            <h3 className="mb-2 font-semibold">Contact</h3>
            <p>Website: {college.contact?.website || 'NA'}</p>
            <p>Email: {college.contact?.email || 'NA'}</p>
            <p>Phone: {college.contact?.phone || 'NA'}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CollegeDetailPage;
