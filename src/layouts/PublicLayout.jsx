import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useCms } from '../hooks/useCms';

const navLinks = [
  ['Colleges', '/colleges'],
  ['Courses', '/courses'],
  ['Exams', '/exams'],
  ['Scholarships', '/scholarships'],
  ['Study Abroad', '/study-abroad'],
  ['Online Courses', '/online-courses'],
  ['Career Guidance', '/career-guidance'],
  ['Blog', '/blog'],
  ['Compare', '/compare-colleges'],
  ['Predictor', '/college-predictor'],
];

function PublicLayout() {
  const { cms } = useCms();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }
  const token = localStorage.getItem('token');
  const rolePath = {
    student: '/profile',
    counselor: '/dashboard/counselor',
    admin_counselor: '/dashboard/admin-counselor',
    college_admin: '/dashboard/college-admin',
    platform_admin: '/dashboard/admin',
  }[user?.role] || '/profile';
  const initials = user?.name ? user.name.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase() : 'U';

  const siteName = cms?.branding?.siteName || 'CollegeGuruji';
  const tagline = cms?.branding?.tagline || 'Admissions made simple';
  const themeStyle = {
    '--primary-color': cms?.theme?.primaryColor || '#0b5ed7',
    '--accent-color': cms?.theme?.accentColor || '#ff7a18',
    '--surface-color': cms?.theme?.surfaceColor || '#f4f8ff',
  };

  return (
    <div
      className="min-h-screen bg-[var(--surface-color)] text-slate-900"
      style={themeStyle}
    >
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-sm font-bold text-white">
              K+
            </span>
            <span className="text-lg font-bold text-[var(--primary-color)]">
              {siteName}
            </span>
          </Link>

          <nav className="hidden gap-4 text-sm lg:flex">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="font-medium text-slate-700 transition hover:text-[var(--primary-color)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {token && user ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-sm font-bold text-white"
                >
                  {initials}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-xl">
                    <Link
                      to="/profile"
                      className="block rounded px-3 py-2 hover:bg-slate-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to={rolePath}
                      className="block rounded px-3 py-2 hover:bg-slate-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <button
                      type="button"
                      className="block w-full rounded px-3 py-2 text-left text-rose-700 hover:bg-rose-50"
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-4 py-2 text-sm font-semibold text-white sm:inline-flex"
              >
                Login
              </Link>
            )}
            <button
              type="button"
              className="rounded border border-slate-300 px-2 py-1 text-sm lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              Menu
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-2">
          <p className="text-xs text-slate-500">{tagline}</p>
        </div>

        {open && (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div className="grid gap-2 text-sm">
              {navLinks.map(([label, href]) => (
                <Link
                  key={href}
                  to={href}
                  className="rounded px-2 py-1 hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {token && user ? (
                <>
                  <Link
                    to="/profile"
                    className="rounded bg-slate-100 px-3 py-2 text-center font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to={rolePath}
                    className="rounded bg-slate-100 px-3 py-2 text-center font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    My Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded bg-[var(--primary-color)] px-3 py-2 text-center font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--primary-color)]">
              {siteName}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Smart admission planning platform for students, counselors, and
              colleges.
            </p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-slate-800">Explore</p>
            <div className="space-y-1">
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/colleges"
              >
                Colleges
              </Link>
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/courses"
              >
                Courses
              </Link>
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/exams"
              >
                Exams
              </Link>
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/scholarships"
              >
                Scholarships
              </Link>
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-slate-800">Tools</p>
            <div className="space-y-1">
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/college-predictor"
              >
                AI Predictor
              </Link>
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/compare-colleges"
              >
                Compare Colleges
              </Link>
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/roi-calculator"
              >
                ROI Calculator
              </Link>
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/career-guidance"
              >
                Career Guidance
              </Link>
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-slate-800">Support</p>
            <div className="space-y-1">
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/study-abroad"
              >
                Study Abroad
              </Link>
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/blog"
              >
                Blog
              </Link>
              <Link
                className="block hover:text-[var(--primary-color)]"
                to="/login"
              >
                Student / Counselor Login
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-500">
          Copyright {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
