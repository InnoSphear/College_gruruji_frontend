import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

function StudentEnrollModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredCourse: '',
    preferredCity: '',
    budget: '',
    referralCode: '',
  });
  const toast = useToast();

  useEffect(() => {
    const seen = localStorage.getItem('enroll-popup-seen');
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const close = () => {
    localStorage.setItem('enroll-popup-seen', '1');
    setOpen(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    if (!/^\d{10,15}$/.test(form.phone.trim())) return toast.error('Enter a valid phone number');
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return toast.error('Enter a valid email');

    setLoading(true);
    try {
      await api.post('/auth/enroll-interest', {
        ...form,
        budget: form.budget ? Number(form.budget) : undefined,
      });
      toast.success('Enrollment submitted. Our counselor will contact you soon.');
      close();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Get Personalized Admission Help</h2>
            <p className="text-sm text-slate-600">Enroll now to get college shortlist, counseling and updates.</p>
          </div>
          <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={close}>Close</button>
        </div>

        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-slate-300 px-3 py-2" placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="rounded border border-slate-300 px-3 py-2" placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="rounded border border-slate-300 px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="rounded border border-slate-300 px-3 py-2" placeholder="Preferred Course" value={form.preferredCourse} onChange={(e) => setForm({ ...form, preferredCourse: e.target.value })} />
          <input className="rounded border border-slate-300 px-3 py-2" placeholder="Preferred City" value={form.preferredCity} onChange={(e) => setForm({ ...form, preferredCity: e.target.value })} />
          <input className="rounded border border-slate-300 px-3 py-2" placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          <input className="rounded border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Referral Code (optional)" value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value })} />
          <button disabled={loading} className="rounded bg-[var(--primary-color)] px-4 py-2 font-semibold text-white md:col-span-2">{loading ? 'Submitting...' : 'Enroll Now'}</button>
        </form>
      </div>
    </div>
  );
}

export default StudentEnrollModal;
