import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

const roleLinks = {
  student: [{ label: 'Student Home', to: '/dashboard/student' }],
  counselor: [{ label: 'Counselor Home', to: '/dashboard/counselor' }],
  admin_counselor: [{ label: 'CRM Counselor Home', to: '/dashboard/admin-counselor' }],
  college_admin: [{ label: 'College Admin', to: '/dashboard/college-admin' }],
  platform_admin: [{ label: 'Platform Admin', to: '/dashboard/admin' }],
};

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function DashboardLayout() {
  const location = useLocation();
  const user = readUser();

  if (!user) return <Navigate to="/login" replace />;

  const links = roleLinks[user.role] || [];
  const defaultPath = links[0]?.to || '/';

  if (location.pathname === '/dashboard') return <Navigate to={defaultPath} replace />;

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="bg-gradient-to-b from-slate-900 to-slate-800 p-6 text-white">
        <h2 className="mb-1 text-xl font-bold">{user.name}</h2>
        <p className="mb-6 text-xs uppercase tracking-wide text-slate-300">{user.role.replace('_', ' ')}</p>
        <div className="space-y-2 text-sm">
          {links.map((link) => (
            <Link key={link.to} className="block rounded bg-slate-700/70 px-3 py-2 hover:bg-slate-600" to={link.to}>
              {link.label}
            </Link>
          ))}
          <Link className="block rounded border border-slate-500 px-3 py-2" to="/">Back to Website</Link>
          <button
            type="button"
            className="w-full rounded bg-rose-600 px-3 py-2 text-left"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="bg-slate-100 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
