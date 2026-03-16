import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, setAuthToken } from '../lib/api';
import { useToast } from '../context/ToastContext';

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const toast = useToast();

  const referralFromUrl = searchParams.get('ref') || '';

  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
    referralCode: referralFromUrl,
  });

  const isCounselor = useMemo(() => registerForm.role === 'counselor', [registerForm.role]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setRegisterSuccess('');
    if (!loginForm.id.trim()) return toast.error('ID is required');
    if (!loginForm.password.trim()) return toast.error('Password is required');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', loginForm);
      const user = data.data.user;
      const token = data.data.token;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthToken(token);

      const rolePath = {
        student: '/profile',
        counselor: '/dashboard/counselor',
        admin_counselor: '/dashboard/admin-counselor',
        college_admin: '/dashboard/college-admin',
        platform_admin: '/dashboard/admin',
      }[user.role] || '/';

      navigate(rolePath);
      toast.success('Login successful');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setRegisterSuccess('');

    if (!registerForm.name.trim()) return toast.error('Name is required');
    if (!registerForm.phone.trim()) return toast.error('Phone is required');
    if (!/^\d{10,15}$/.test(registerForm.phone.trim())) return toast.error('Enter valid phone number');
    if (!registerForm.password.trim() || registerForm.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (registerForm.email && !/^\S+@\S+\.\S+$/.test(registerForm.email)) return toast.error('Enter valid email');

    setLoading(true);
    try {
      const payload = {
        name: registerForm.name,
        email: registerForm.email || undefined,
        phone: registerForm.phone,
        password: registerForm.password,
        role: registerForm.role,
        referralCode: registerForm.referralCode || undefined,
      };
      await api.post('/auth/register', payload);

      setRegisterSuccess('Account created successfully. Please login to continue.');
      setLoginForm({ id: registerForm.phone || registerForm.email || '', password: '' });
      setRegisterForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'student',
        referralCode: referralFromUrl,
      });
      setMode('login');
      toast.success(isCounselor ? 'Affiliate counselor account created' : 'Student account created');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <div className="mb-4 flex gap-2">
        <button onClick={() => setMode('login')} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === 'login' ? 'bg-[var(--primary-color)] text-white' : 'bg-slate-100 text-slate-700'}`}>Login</button>
        <button onClick={() => setMode('register')} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === 'register' ? 'bg-[var(--primary-color)] text-white' : 'bg-slate-100 text-slate-700'}`}>Register</button>
      </div>

      {mode === 'login' ? (
        <>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-1 text-sm text-slate-500">Use email or phone as ID.</p>
          {registerSuccess && <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{registerSuccess}</p>}
          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--primary-color)] focus:outline-none" placeholder="ID (email / phone)" value={loginForm.id} onChange={(e) => setLoginForm({ ...loginForm, id: e.target.value })} />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--primary-color)] focus:outline-none" type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="w-full rounded-lg bg-[var(--primary-color)] px-4 py-2 font-semibold text-white transition hover:opacity-90" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <button className="mt-3 text-sm font-medium text-[var(--primary-color)]" onClick={() => setMode('register')}>New student or affiliate counselor? Register here</button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="mt-1 text-sm text-slate-500">Choose Student or Affiliate Counselor account.</p>
          <form onSubmit={handleRegister} className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--primary-color)] focus:outline-none" placeholder="Full Name *" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--primary-color)] focus:outline-none" placeholder="Phone *" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--primary-color)] focus:outline-none" placeholder="Email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--primary-color)] focus:outline-none" placeholder="Password *" type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
            <select className="rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--primary-color)] focus:outline-none" value={registerForm.role} onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="counselor">Affiliate Counselor</option>
            </select>
            <input className="rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--primary-color)] focus:outline-none" placeholder="Referral Code (optional)" value={registerForm.referralCode} onChange={(e) => setRegisterForm({ ...registerForm, referralCode: e.target.value })} disabled={isCounselor} />
            {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
            <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500 md:col-span-2" disabled={loading}>{loading ? 'Creating account...' : isCounselor ? 'Register as Affiliate Counselor' : 'Register as Student'}</button>
          </form>
        </>
      )}
    </div>
  );
}

export default LoginPage;
