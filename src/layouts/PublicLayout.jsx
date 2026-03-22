import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCms } from '../hooks/useCms';

const primaryNavLinks = [
  { label: 'All Streams', to: '/courses' },
  { label: 'All Courses', to: '/courses' },
  { label: 'Engineering', to: '/courses?stream=Engineering' },
  { label: 'Management', to: '/courses?stream=Management' },
  { label: 'Medical', to: '/courses?stream=Medical' },
  { label: 'Design', to: '/courses?stream=Design' },
  { label: 'Explore', to: '/colleges' },
  { label: 'Online', to: '/online-courses' },
];

const utilityNavLinks = [
  { label: 'Colleges', to: '/colleges' },
  { label: 'Exams', to: '/exams' },
  { label: 'Scholarships', to: '/scholarships' },
  { label: 'Study Abroad', to: '/study-abroad' },
  { label: 'Compare', to: '/compare-colleges' },
  { label: 'Predictor', to: '/college-predictor' },
  { label: 'ROI', to: '/roi-calculator' },
  { label: 'Career Guidance', to: '/career-guidance' },
  { label: 'Blog', to: '/blog' },
];

const footerExamLinks = [
  { label: 'JEE Main', to: '/exams' },
  { label: 'GATE', to: '/exams' },
  { label: 'CAT', to: '/exams' },
  { label: 'XAT', to: '/exams' },
  { label: 'View All Exams', to: '/exams' },
];

const footerCollegeLinks = [
  { label: 'IIMA', to: '/colleges' },
  { label: 'IIT Bombay', to: '/colleges' },
  { label: 'AIIMS Delhi', to: '/colleges' },
  { label: 'NLSIU Bangalore', to: '/colleges' },
  { label: 'View All Colleges', to: '/colleges' },
];

const footerStreamLinks = [
  { label: 'Management', to: '/courses' },
  { label: 'Engineering', to: '/courses' },
  { label: 'Medical', to: '/courses' },
  { label: 'Design', to: '/courses' },
  { label: 'Law', to: '/courses' },
  { label: 'Science', to: '/courses' },
];

const footerResourceLinks = [
  { label: 'College Comparison', to: '/compare-colleges' },
  { label: 'College Predictor', to: '/college-predictor' },
  { label: 'Exam Calendar', to: '/exams' },
  { label: 'Scholarships', to: '/scholarships' },
  { label: 'Study Abroad', to: '/study-abroad' },
  { label: 'Online Courses', to: '/online-courses' },
  { label: 'Career Guidance', to: '/career-guidance' },
  { label: 'Blog', to: '/blog' },
  { label: 'ROI Calculator', to: '/roi-calculator' },
];

const footerPredictorLinks = [
  { label: 'JEE Main Predictor', to: '/college-predictor' },
  { label: 'GATE Predictor', to: '/college-predictor' },
  { label: 'CAT Predictor', to: '/college-predictor' },
  { label: 'NEET Predictor', to: '/college-predictor' },
  { label: 'View All Predictors', to: '/college-predictor' },
];

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cms } = useCms();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState('');

  const user = readUser();
  const token = localStorage.getItem('token');
  const rolePath = {
    student: '/profile',
    counselor: '/dashboard/counselor',
    admin_counselor: '/dashboard/admin-counselor',
    college_admin: '/dashboard/college-admin',
    platform_admin: '/dashboard/admin',
  }[user?.role] || '/profile';

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : 'U';

  const siteName = cms?.branding?.siteName || 'KollegeApply';
  const tagline = cms?.branding?.tagline || 'Empowering Education';

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = headerQuery.trim();
    navigate(`/colleges${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
<<<<<<< HEAD
    <div
      className="min-h-screen bg-[var(--surface-color)] text-slate-900"
      style={themeStyle}
    >
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-sm font-bold text-white">
              CG
            </span>
            <span className="text-lg font-bold text-[var(--primary-color)]">
              {siteName}
            </span>
          </Link>
=======
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50">
        <div className="hidden bg-white/95 pb-2 backdrop-blur lg:block">
          <div className="ka-container pt-3">
            <div className="rounded-xl border border-[#4777c4] bg-[#16324f] px-6 py-4 text-white">
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2 text-nowrap">
                  <img
                    src="https://www.kollegeapply.com/new-logo.svg"
                    alt="KollegeApply logo"
                    className="h-[30px] w-[40px] object-contain"
                  />
                  <div>
                    <p className="ka-title-font text-2xl font-medium leading-tight">{siteName}</p>
                    <p className="-mt-0.5 text-[11px] text-blue-100">{tagline}</p>
                  </div>
                </Link>
>>>>>>> 52824ab (Updated some features / fixed bugs)

                <form onSubmit={handleSearch} className="relative flex flex-1 items-center overflow-hidden rounded-md bg-white">
                  <input
                    value={headerQuery}
                    onChange={(e) => setHeaderQuery(e.target.value)}
                    placeholder="Search Colleges, Courses, Exams, Questions and Articles"
                    className="h-10 w-full bg-transparent px-4 text-sm font-medium text-slate-700 placeholder:text-slate-500 focus:outline-none"
                  />
                  <button className="mr-1 rounded-md bg-[#16324f] px-4 py-1.5 text-sm font-bold text-white hover:bg-[#204469]">
                    Search
                  </button>
                </form>

                {token && user ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-sm font-bold text-white hover:bg-white/20"
                    >
                      {initials}
                    </button>
                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-xl">
                        <Link to="/profile" className="block rounded-md px-3 py-2 hover:bg-slate-100">
                          My Profile
                        </Link>
                        <Link to={rolePath} className="block rounded-md px-3 py-2 hover:bg-slate-100">
                          My Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={logout}
                          className="block w-full rounded-md px-3 py-2 text-left text-rose-700 hover:bg-rose-50"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-2 rounded-b-3xl bg-white px-8 py-3 shadow-[0_15px_10px_-15px_rgba(0,0,0,0.55)]">
              <nav className="ka-no-scrollbar overflow-x-auto">
                <ul className="flex min-w-max flex-nowrap items-center gap-x-7 text-sm font-medium text-slate-900">
                  {primaryNavLinks.map((item) => (
                    <li key={item.label}>
                      <Link to={item.to} className="whitespace-nowrap transition-colors hover:text-[#4777c4]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-2 border-t border-slate-100 pt-2">
                <nav className="ka-no-scrollbar overflow-x-auto">
                  <ul className="flex min-w-max flex-nowrap items-center gap-2">
                    {utilityNavLinks.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="inline-flex whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-[#4777c4] hover:bg-sky-50 hover:text-[#16324f]"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur lg:hidden">
          <div className="ka-container py-2">
            <div className="rounded-xl border border-[#4777c4] bg-[#16324f] px-3 py-2 text-white">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="rounded-md p-1.5 transition hover:bg-white/20"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                </button>

                <Link to="/" className="flex items-center gap-2">
                  <img
                    src="https://www.kollegeapply.com/new-logo.svg"
                    alt="KollegeApply logo"
                    className="h-5 w-6 object-contain"
                  />
                  <span className="ka-title-font text-base font-medium">{siteName}</span>
                </Link>

                {token && user ? (
                  <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-white/10 text-[10px] font-bold"
                  >
                    {initials}
                  </button>
                ) : (
                  <Link to="/login" className="rounded-md border border-white/40 px-2 py-1 text-xs font-semibold">
                    Login
                  </Link>
                )}
              </div>
              <form onSubmit={handleSearch} className="mt-2 flex items-center gap-2 rounded-md bg-white p-1">
                <input
                  value={headerQuery}
                  onChange={(e) => setHeaderQuery(e.target.value)}
                  placeholder="Search Colleges, Courses, Exams..."
                  className="h-8 w-full bg-transparent px-2 text-xs text-slate-700 placeholder:text-slate-500 focus:outline-none"
                />
                <button className="rounded bg-[#16324f] px-3 py-1.5 text-xs font-bold text-white">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-[60] bg-black/45 lg:hidden" onClick={() => setMobileOpen(false)}>
            <div className="h-full w-[78%] max-w-sm overflow-auto bg-white p-4" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <p className="ka-title-font text-xl font-semibold text-[#16324f]">{siteName}</p>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                >
                  Close
                </button>
              </div>

              <nav>
                <div className="space-y-1">
                  {primaryNavLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="block rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="mt-4 border-t border-slate-200 pt-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Popular Sections</p>
                <div className="space-y-1">
                  {utilityNavLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="block rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4">
                {token && user ? (
                  <div className="space-y-2">
                    <Link to="/profile" className="block rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800">
                      My Profile
                    </Link>
                    <Link to={rolePath} className="block rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800">
                      My Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="block w-full rounded-md bg-rose-50 px-3 py-2 text-left text-sm font-semibold text-rose-700"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="inline-flex rounded-md bg-[#16324f] px-4 py-2 text-sm font-semibold text-white">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="ka-container pb-12 pt-2 lg:pt-2">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="ka-container py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div>
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="https://www.kollegeapply.com/new-logo.svg"
                  alt="KollegeApply logo"
                  className="h-7 w-9 object-contain"
                />
                <span className="ka-title-font text-2xl font-medium text-[#16324f]">{siteName}</span>
              </Link>
              <p className="mt-1 text-xs text-blue-950">{tagline}</p>
              <div className="mt-5 space-y-1 text-sm text-[#408ee0]">
                <Link className="block hover:text-[#16324f]" to="/">About KollegeApply</Link>
                <Link className="block hover:text-[#16324f]" to="/">Contact Us</Link>
                <Link className="block hover:text-[#16324f]" to="/">Careers</Link>
                <Link className="block hover:text-[#16324f]" to="/">Terms & Conditions</Link>
                <Link className="block hover:text-[#16324f]" to="/">Privacy Policy</Link>
                <Link className="block hover:text-[#16324f]" to="/">Disclaimer</Link>
              </div>
            </div>

            <div>
              <p className="mb-2 font-semibold text-slate-900">Explore Exams</p>
              <div className="space-y-1.5 text-sm text-slate-600">
                {footerExamLinks.map((item) => (
                  <Link key={item.label} className="block hover:text-[#4777c4]" to={item.to}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-semibold text-slate-900">Top Colleges</p>
              <div className="space-y-1.5 text-sm text-slate-600">
                {footerCollegeLinks.map((item) => (
                  <Link key={item.label} className="block hover:text-[#4777c4]" to={item.to}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-semibold text-slate-900">Study Streams</p>
              <div className="space-y-1.5 text-sm text-slate-600">
                {footerStreamLinks.map((item) => (
                  <Link key={item.label} className="block hover:text-[#4777c4]" to={item.to}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-semibold text-slate-900">Resources</p>
              <div className="space-y-1.5 text-sm text-slate-600">
                {footerResourceLinks.map((item) => (
                  <Link key={item.label} className="block hover:text-[#4777c4]" to={item.to}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-semibold text-slate-900">Predictors</p>
              <div className="space-y-1.5 text-sm text-slate-600">
                {footerPredictorLinks.map((item) => (
                  <Link key={item.label} className="block hover:text-[#4777c4]" to={item.to}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 py-4">
          <div className="ka-container flex flex-col items-center justify-between gap-2 text-sm text-slate-700 lg:flex-row">
            <p>© {new Date().getFullYear()} KollegeApply</p>
            <div className="flex flex-col items-center gap-2 text-xs sm:flex-row sm:text-sm">
              <p>
                <span>Regular Helpdesk:</span>
                <span className="font-medium"> +91 95997 49001</span>
              </p>
              <span className="hidden text-slate-400 sm:inline">|</span>
              <p>
                <span>Online Helpdesk:</span>
                <span className="font-medium"> +91 97178 19001</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
