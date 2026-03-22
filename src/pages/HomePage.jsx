import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useCms } from '../hooks/useCms';
import StudentEnrollModal from '../components/StudentEnrollModal';

const tickerLines = [
  'Search and compare colleges, courses, fees, rankings and placement insights.',
  'Track entrance exams, eligibility, cutoffs and admission updates from one place.',
  'Find scholarships and tools to shortlist your best-fit colleges faster.',
];

const topCollegeStreams = [
  'All',
  'Engineering',
  'Management',
  'Medical',
  'Design',
  'Commerce',
  'Law',
  'Science',
];

const fallbackSlides = [
  {
    title: 'IIM Ahmedabad - Indian Institute of Management',
    subtitle: 'Explore top colleges, exams, admissions, rankings and scholarships.',
    ctaLink: '/colleges',
    ctaLabel: 'Explore Colleges',
    imageUrl: 'https://www.kollegeapply.com/ad/iima.webp',
  },
  {
    title: 'IIT Delhi - Indian Institute of Technology',
    subtitle: 'Discover verified college profiles, fees, rankings and placement data.',
    ctaLink: '/colleges',
    ctaLabel: 'Browse Colleges',
    imageUrl: 'https://www.kollegeapply.com/ad/iitd.webp',
  },
  {
    title: 'Discover Programs and Exams',
    subtitle: 'Compare programs, track exam calendars and plan admissions confidently.',
    ctaLink: '/courses',
    ctaLabel: 'Explore Programs',
    imageUrl: 'https://assets.kollegeapply.com/banners/homepage-banners/banner-1-7042489-1772553922689-1772553922689.jpg',
  },
];

const resourceCards = [
  {
    title: 'All Exams',
    description: 'Get details on exam dates, preparation tips, eligibility, and more.',
    links: ['JEE Main', 'GATE', 'CAT', 'XAT'],
    cta: 'Explore all Exams',
    to: '/exams',
    tint: 'from-sky-50 to-blue-50',
    icon: 'E',
  },
  {
    title: 'All Colleges',
    description: 'Explore top colleges by location, eligibility, infrastructure, and rankings.',
    links: ['Best colleges in Bangalore', 'Best colleges in Pune'],
    cta: 'Browse All Colleges in India',
    to: '/colleges',
    tint: 'from-emerald-50 to-teal-50',
    icon: 'C',
  },
  {
    title: 'All College Predictor',
    description: 'Estimate admission chances based on your score and preferences.',
    links: ['JEE Main', 'GATE', 'CAT', 'JEE Advanced'],
    cta: 'Predict Your Admission Chances',
    to: '/college-predictor',
    tint: 'from-orange-50 to-rose-50',
    icon: 'P',
  },
  {
    title: 'All Courses',
    description: 'Discover top courses based on location, eligibility, and demand.',
    links: ['MBA', 'MCA'],
    cta: 'Explore Top Courses in India',
    to: '/courses',
    tint: 'from-violet-50 to-indigo-50',
    icon: 'R',
  },
];

const quickAccessLinks = [
  { label: 'Colleges', to: '/colleges', detail: 'Top colleges and rankings' },
  { label: 'Courses', to: '/courses', detail: 'Programs and eligibility' },
  { label: 'Exams', to: '/exams', detail: 'Calendar and updates' },
  { label: 'Scholarships', to: '/scholarships', detail: 'Funding opportunities' },
  { label: 'Study Abroad', to: '/study-abroad', detail: 'Global destinations' },
  { label: 'Online Courses', to: '/online-courses', detail: 'Skill and certification' },
  { label: 'Compare Colleges', to: '/compare-colleges', detail: 'Side-by-side compare' },
  { label: 'College Predictor', to: '/college-predictor', detail: 'AI admissions estimate' },
  { label: 'ROI Calculator', to: '/roi-calculator', detail: 'Return on investment' },
  { label: 'Career Guidance', to: '/career-guidance', detail: 'Pathway planning' },
  { label: 'Blog', to: '/blog', detail: 'Insights and guides' },
];

function formatCurrency(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

function formatFeeRange(min, max) {
  const minNum = Number(min);
  const maxNum = Number(max);
  if (Number.isFinite(minNum) && Number.isFinite(maxNum) && minNum > 0 && maxNum > 0) {
    if (minNum === maxNum) return formatCurrency(maxNum);
    return `${formatCurrency(minNum)} - ${formatCurrency(maxNum)}`;
  }
  if (Number.isFinite(maxNum) && maxNum > 0) return formatCurrency(maxNum);
  if (Number.isFinite(minNum) && minNum > 0) return formatCurrency(minNum);
  return '-';
}

function matchesTopStream(college, stream) {
  if (stream === 'All') return true;
  const text = [
    college?.name,
    college?.overview,
    ...(Array.isArray(college?.examsAccepted) ? college.examsAccepted : []),
    ...(Array.isArray(college?.courses) ? college.courses.map((course) => course?.name) : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const streamKeywords = {
    Engineering: ['engineering', 'tech', 'iit', 'b.tech', 'btech'],
    Management: ['management', 'mba', 'iim', 'pgdm', 'business'],
    Medical: ['medical', 'mbbs', 'aiims', 'nursing', 'pharma'],
    Design: ['design', 'architecture', 'fashion'],
    Commerce: ['commerce', 'b.com', 'accounting', 'finance'],
    Law: ['law', 'llb', 'juridical', 'nlu'],
    Science: ['science', 'b.sc', 'm.sc', 'research'],
  };

  const keywords = streamKeywords[stream] || [stream.toLowerCase()];
  return keywords.some((word) => text.includes(word));
}

function HomePage() {
  const navigate = useNavigate();
  const { cms } = useCms();

  const [query, setQuery] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [collegeView, setCollegeView] = useState('list');
  const [activeTopStream, setActiveTopStream] = useState('All');
  const [activeProgram, setActiveProgram] = useState('All');

  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([
      api.get('/catalog/colleges', { params: { limit: 16 } }),
      api.get('/catalog/courses', { params: { limit: 20 } }),
      api.get('/catalog/exams', { params: { limit: 8 } }),
      api.get('/catalog/scholarships', { params: { limit: 8 } }),
    ]).then((results) => {
      if (!mounted) return;

      if (results[0].status === 'fulfilled') setColleges(results[0].value.data.data.items || []);
      if (results[1].status === 'fulfilled') setCourses(results[1].value.data.data.items || []);
      if (results[2].status === 'fulfilled') setExams(results[2].value.data.data.items || []);
      if (results[3].status === 'fulfilled') setScholarships(results[3].value.data.data.items || []);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const slides = useMemo(() => {
    if (Array.isArray(cms?.heroSlides) && cms.heroSlides.length > 0) {
      return cms.heroSlides.map((slide, index) => ({
        title: slide.title || `Featured Slide ${index + 1}`,
        subtitle: slide.subtitle || 'Explore top colleges, admissions, courses, exams and scholarships.',
        imageUrl: slide.imageUrl || fallbackSlides[index % fallbackSlides.length].imageUrl,
        ctaLabel: slide.ctaLabel || 'Explore',
        ctaLink: slide.ctaLink || '/colleges',
      }));
    }
    return fallbackSlides;
  }, [cms?.heroSlides]);

  useEffect(() => {
    setHeroIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerLines.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const quickLinks = useMemo(() => cms?.quickLinks || [], [cms?.quickLinks]);

  const filteredColleges = useMemo(
    () => colleges.filter((college) => matchesTopStream(college, activeTopStream)).slice(0, 10),
    [colleges, activeTopStream]
  );

  const programTags = useMemo(() => {
    const streams = courses.map((course) => course.stream).filter(Boolean);
    return ['All', ...new Set(streams)].slice(0, 14);
  }, [courses]);

  useEffect(() => {
    if (!programTags.includes(activeProgram)) {
      setActiveProgram('All');
    }
  }, [programTags, activeProgram]);

  const filteredCourses = useMemo(() => {
    if (activeProgram === 'All') return courses.slice(0, 8);
    return courses.filter((course) => course.stream === activeProgram).slice(0, 8);
  }, [courses, activeProgram]);

  const activeSlide = slides[heroIndex] || fallbackSlides[0];
  const currentYear = new Date().getFullYear();

  const submitSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(`/colleges${trimmed ? `?q=${encodeURIComponent(trimmed)}` : ''}`);
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      <StudentEnrollModal />

      <section className="relative overflow-hidden rounded-2xl ka-shadow-2">
        <div className="relative h-[290px] sm:h-[420px] lg:h-[520px]">
          {slides.map((slide, index) => (
            <div
              key={`${slide.title}-${index}`}
              className={`absolute inset-0 transition-opacity duration-700 ${index === heroIndex ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            >
              <img src={slide.imageUrl} alt={slide.title} className="h-full w-full object-cover saturate-150" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/25" />
            </div>
          ))}

          <div className="absolute inset-0 p-3 sm:p-6 lg:p-8">
            <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
              <div className="w-full rounded-xl border border-white/35 bg-black/20 px-3 py-4 text-center text-white backdrop-blur-sm sm:px-5 sm:py-6 lg:max-w-4xl lg:px-7">
                <h1 className="ka-title-font text-lg font-semibold sm:text-3xl lg:text-[38px] lg:leading-[1.2]">
                  Explore Top Colleges, Exams, Results & More
                </h1>
                <p className="mt-1 text-[11px] text-white/90 sm:text-sm lg:text-base">{activeSlide.subtitle}</p>
                <p className="mt-1 min-h-5 text-[11px] text-white/90 sm:text-sm lg:text-base">
                  {tickerLines[tickerIndex]}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:gap-3">
                  {[
                    ['6000+', 'Institutions'],
                    ['200+', 'Exams'],
                    ['200+', 'Online Courses'],
                    ['200+', 'Courses'],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-md border border-white/25 bg-black/20 px-2 py-2 text-center text-[11px] sm:text-sm lg:px-3 lg:py-2.5"
                    >
                      <p className="font-bold lg:text-base">{value}</p>
                      <p className="text-white/85">{label}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={submitSearch} className="mx-auto mt-4 flex max-w-3xl items-center gap-2 rounded-md bg-white p-1 sm:p-1.5">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Colleges, Courses, Exams, Questions and Articles"
                    className="h-9 w-full bg-transparent px-2 text-xs text-slate-700 placeholder:font-medium placeholder:text-slate-500 focus:outline-none sm:text-sm"
                  />
                  <button className="rounded-md bg-[#16324f] px-3 py-2 text-xs font-bold text-white hover:bg-[#204469] sm:px-4 sm:text-sm lg:px-5 lg:py-2.5">
                    Search
                  </button>
                </form>

                {quickLinks.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {quickLinks.map((item) => (
                      <Link
                        key={`${item.link}-${item.label}`}
                        to={item.link}
                        className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/95 hover:bg-white/20 sm:text-xs"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setHeroIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/55 text-white transition hover:bg-slate-900/75 sm:inline-flex"
                aria-label="Previous slide"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setHeroIndex((prev) => (prev + 1) % slides.length)}
                className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/55 text-white transition hover:bg-slate-900/75 sm:inline-flex"
                aria-label="Next slide"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <Link
            to={activeSlide.ctaLink || '/colleges'}
            className="absolute bottom-4 left-1/2 max-w-[90%] -translate-x-1/2 rounded-md bg-black/20 px-3 py-1.5 text-center text-[11px] font-semibold text-white backdrop-blur-sm hover:bg-black/35 sm:left-4 sm:translate-x-0 sm:text-sm lg:bottom-5 lg:px-4 lg:py-2"
          >
            {activeSlide.title}
          </Link>

          <div className="absolute bottom-2 right-3 flex gap-1.5 sm:right-5 sm:gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setHeroIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${index === heroIndex ? 'bg-white' : 'bg-white/45'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="ka-grid-pattern rounded-xl border border-[var(--ka-border)] bg-white p-4 lg:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="ka-title-font text-xl font-semibold text-slate-900">Explore More Sections</h2>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#4777c4]">Quick Access</span>
        </div>
        <div className="ka-no-scrollbar mt-3 overflow-x-auto lg:mt-4">
          <div
            className="grid min-w-full grid-flow-col gap-2"
            style={{ gridAutoColumns: 'minmax(180px, calc((100% - 1rem) / 3))' }}
          >
            {quickAccessLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 transition hover:border-[#4777c4] hover:bg-sky-50"
              >
                <p className="text-sm font-semibold text-[#16324f]">{item.label}</p>
                <p className="text-xs text-slate-600">{item.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="ka-title-font text-2xl font-semibold text-slate-900">
            Top Colleges in India {currentYear}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setCollegeView('list')}
              className={`rounded-md px-3 py-1.5 font-medium ${collegeView === 'list' ? 'bg-[#16324f] text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              List View
            </button>
            <button
              type="button"
              onClick={() => setCollegeView('cards')}
              className={`rounded-md px-3 py-1.5 font-medium ${collegeView === 'cards' ? 'bg-[#16324f] text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Cards
            </button>
          </div>
        </div>

        <div className="ka-no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {topCollegeStreams.map((stream) => (
            <button
              key={stream}
              type="button"
              onClick={() => setActiveTopStream(stream)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${activeTopStream === stream ? 'bg-[#16324f] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {stream}
            </button>
          ))}
        </div>

        {collegeView === 'list' ? (
          <div className="overflow-hidden rounded-xl border border-[var(--ka-border)] bg-white">
            <div className="hidden grid-cols-[2fr_0.8fr_1fr_0.8fr] bg-[var(--ka-surface)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 md:grid">
              <p>Colleges</p>
              <p>Ranking</p>
              <p>Total Fees</p>
              <p>Total Courses</p>
            </div>
            <div>
              {filteredColleges.length > 0 ? (
                filteredColleges.map((college) => {
                  const courseCount = Array.isArray(college.courses)
                    ? college.courses.length
                    : college.courseCount || '-';
                  const destination = college.slug ? `/colleges/${college.slug}` : '/colleges';

                  return (
                    <article
                      key={college._id}
                      className="grid border-t border-slate-200 first:border-t-0 md:grid-cols-[2fr_0.8fr_1fr_0.8fr]"
                    >
                      <div className="flex items-start gap-3 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm font-bold text-[#16324f]">
                          {college?.name?.slice(0, 1) || 'C'}
                        </div>
                        <div>
                          <Link to={destination} className="font-semibold text-slate-900 hover:text-[#4777c4]">
                            {college.name}
                          </Link>
                          <p className="text-sm text-slate-600">
                            {college.city || 'NA'}, {college.state || 'NA'}
                          </p>
                          <p className="text-xs text-slate-600">Rating: 4.8/5</p>
                        </div>
                      </div>
                      <div className="px-4 pb-3 text-sm text-slate-700 md:px-4 md:py-4 md:text-base">
                        #{college.ranking || '-'}
                      </div>
                      <div className="px-4 pb-3 text-sm text-slate-700 md:px-4 md:py-4 md:text-base">
                        {formatFeeRange(college.feesMin, college.feesMax)}
                      </div>
                      <div className="px-4 pb-4 text-sm text-slate-700 md:px-4 md:py-4 md:text-base">
                        {courseCount}
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="p-5 text-sm text-slate-500">No colleges found for this filter.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredColleges.map((college) => (
              <article key={college._id} className="rounded-xl border border-[var(--ka-border)] bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase text-[#4777c4]">Rank #{college.ranking || '-'}</p>
                <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-slate-900">{college.name}</h3>
                <p className="text-sm text-slate-600">
                  {college.city || 'NA'}, {college.state || 'NA'}
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Total Fees: {formatFeeRange(college.feesMin, college.feesMax)}
                </p>
                <p className="text-sm text-slate-700">
                  Total Courses: {Array.isArray(college.courses) ? college.courses.length : '-'}
                </p>
                <Link
                  to={college.slug ? `/colleges/${college.slug}` : '/colleges'}
                  className="mt-3 inline-flex rounded-md bg-[#16324f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#204469]"
                >
                  Brochure
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="ka-title-font text-2xl font-semibold text-slate-900">Explore Programs</h2>
          <Link to="/courses" className="text-sm font-semibold text-[#4777c4] hover:text-[#16324f]">
            View all
          </Link>
        </div>
        <div className="ka-no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {programTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveProgram(tag)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${activeProgram === tag ? 'bg-[#16324f] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <article key={course._id} className="rounded-xl border border-[var(--ka-border)] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-[#4777c4]">{course.stream || 'General'}</p>
              <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900">{course.name}</h3>
              <p className="mt-2 text-xs text-slate-600">Duration: {course.duration || 'NA'}</p>
              <p className="text-xs text-slate-600">Average Salary: {formatCurrency(course.averageSalary)}</p>
              <Link
                to={course.slug ? `/courses/${course.slug}` : '/courses'}
                className="mt-3 inline-flex rounded-md border border-[#16324f]/20 px-3 py-1.5 text-xs font-semibold text-[#16324f] hover:bg-[#16324f] hover:text-white"
              >
                Explore
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {resourceCards.map((card) => (
          <article key={card.title} className={`rounded-xl border border-[var(--ka-border)] bg-gradient-to-br ${card.tint} p-4`}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-white text-sm font-bold text-[#16324f]">
              {card.icon}
            </div>
            <h3 className="ka-title-font text-lg font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-1 text-sm text-slate-700">{card.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {card.links.map((item) => (
                <span key={item} className="rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {item}
                </span>
              ))}
            </div>
            <Link to={card.to} className="mt-3 inline-flex text-sm font-semibold text-[#16324f] hover:text-[#4777c4]">
              {card.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-[var(--ka-border)] bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Latest Entrance Exams</h3>
            <Link to="/exams" className="text-sm font-semibold text-[#4777c4]">Explore all</Link>
          </div>
          <div className="mt-3 space-y-2">
            {exams.slice(0, 6).map((exam) => (
              <Link
                key={exam._id}
                to={exam.slug ? `/exams/${exam.slug}` : '/exams'}
                className="block rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-[#4777c4] hover:bg-sky-50"
              >
                {exam.name}
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-[var(--ka-border)] bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Scholarship Highlights</h3>
            <Link to="/scholarships" className="text-sm font-semibold text-[#4777c4]">Explore all</Link>
          </div>
          <div className="mt-3 space-y-2">
            {scholarships.slice(0, 6).map((item) => (
              <Link
                key={item._id}
                to={item.slug ? `/scholarships/${item.slug}` : '/scholarships'}
                className="block rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-[#4777c4] hover:bg-sky-50"
              >
                <span className="font-semibold">{item.name}</span>
                <span className="ml-2 text-xs text-slate-500">{item.provider || 'Provider NA'}</span>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default HomePage;
