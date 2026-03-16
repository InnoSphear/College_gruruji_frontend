import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import SectionCard from '../components/SectionCard';
import { api } from '../lib/api';
import { useCms } from '../hooks/useCms';
import ImageCarousel from '../components/ImageCarousel';
import StudentEnrollModal from '../components/StudentEnrollModal';

const featureCards = [
  'Discover 10,000+ colleges with deep filters',
  'Compare colleges side-by-side on ROI and placements',
  'Explore 1,000+ courses and 200+ entrance exams',
  'Apply, track status, and get real-time alert updates',
  'Counseling support with call and session scheduling',
  'Referral counselor onboarding and commission tracking',
];

const spotlightCards = [
  {
    title: 'Campus Life',
    subtitle: 'Explore real campus environments and culture.',
    image:
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Career Outcomes',
    subtitle: 'Track placement stats and recruiter patterns.',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Global Opportunities',
    subtitle: 'Study abroad pathways and scholarship support.',
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
  },
];

function HomePage() {
  const navigate = useNavigate();
  const { cms } = useCms();
  const [query, setQuery] = useState('');
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    api.get('/catalog/colleges?limit=6').then((res) => setColleges(res.data.data.items || [])).catch(() => {});
    api.get('/catalog/courses?limit=6').then((res) => setCourses(res.data.data.items || [])).catch(() => {});
    api.get('/catalog/exams?limit=6').then((res) => setExams(res.data.data.items || [])).catch(() => {});
    api.get('/catalog/scholarships?limit=6').then((res) => setScholarships(res.data.data.items || [])).catch(() => {});
  }, []);

  const quickLinks = useMemo(() => cms?.quickLinks || [], [cms]);
  const slides = useMemo(() => cms?.heroSlides || [], [cms]);
  const show = cms?.homepageSections || {};

  const sectionsByKey = {
    topColleges:
      show.showTopColleges && (
        <section className="space-y-3" key="topColleges">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Top Colleges</h2>
            <Link to="/colleges" className="text-sm font-semibold text-[var(--primary-color)]">View all</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {colleges.map((college) => (
              <article key={college._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-semibold">{college.name}</h3>
                <p className="text-sm text-slate-600">{college.city}, {college.state}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">Rank {college.ranking || '-'}</span>
                  <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">Rating {college.rating || '-'}</span>
                  <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">Fees {college.feesMax || '-'}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ),
    trendingCourses:
      show.showTrendingCourses && (
        <section className="space-y-3" key="trendingCourses">
          <h2 className="text-xl font-bold">Trending Courses</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div key={course._id} className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold">{course.name}</h3>
                <p className="text-sm text-slate-600">{course.stream || 'General'} | {course.duration || 'NA'}</p>
              </div>
            ))}
          </div>
        </section>
      ),
    examCalendar:
      show.showExamCalendar && (
        <section className="space-y-3" key="examCalendar">
          <h2 className="text-xl font-bold">Entrance Exam Updates</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <div key={exam._id} className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold">{exam.name}</h3>
                <p className="text-sm text-slate-600">Pattern: {exam.pattern || 'Updated on page'}</p>
              </div>
            ))}
          </div>
        </section>
      ),
    scholarships:
      show.showScholarships && (
        <section className="space-y-3" key="scholarships">
          <h2 className="text-xl font-bold">Scholarship Alerts</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-slate-600">Provider: {item.provider || 'NA'}</p>
              </div>
            ))}
          </div>
        </section>
      ),
    studyAbroad:
      show.showStudyAbroad && (
        <section className="space-y-3" key="studyAbroad">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Study Abroad Destinations</h2>
            <Link to="/study-abroad" className="text-sm font-semibold text-[var(--primary-color)]">Explore</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['USA', 'UK', 'Canada', 'Australia'].map((country) => (
              <div key={country} className="rounded-xl border border-slate-200 bg-white p-4 text-center font-semibold">{country}</div>
            ))}
          </div>
        </section>
      ),
    counselingCTA:
      show.showCounselingCTA && (
        <section className="rounded-2xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] p-6 text-white" key="counselingCTA">
          <h2 className="text-2xl font-bold">Need Guidance?</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/90">Use AI college predictor, compare colleges, request counseling calls, and track your complete admission journey from one dashboard.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/college-predictor" className="rounded bg-white px-4 py-2 text-sm font-semibold text-slate-900">AI Predictor</Link>
            <Link to="/compare-colleges" className="rounded border border-white/60 px-4 py-2 text-sm font-semibold">Compare Colleges</Link>
            <Link to="/roi-calculator" className="rounded border border-white/60 px-4 py-2 text-sm font-semibold">ROI Calculator</Link>
          </div>
        </section>
      ),
  };

  const sectionOrder = cms?.homepageSectionOrder || ['topColleges', 'trendingCourses', 'examCalendar', 'scholarships', 'studyAbroad', 'counselingCTA'];

  return (
    <div className="space-y-8">
      <StudentEnrollModal />
      <ImageCarousel slides={slides} />

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/70 sm:p-6">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--accent-color)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-[var(--primary-color)]/20 blur-3xl" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/colleges?q=${encodeURIComponent(query)}`);
          }}
          className="relative flex flex-col gap-3 md:flex-row"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by college, city, state, exam, stream..."
            className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3"
          />
          <button className="rounded-xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-5 py-3 font-semibold text-white">Search Colleges</button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickLinks.map((item) => (
            <Link key={item.link} to={item.link} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featureCards.map((text) => (
          <SectionCard key={text} title="Platform Feature">{text}</SectionCard>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Student Spotlight</h2>
          <Link to="/career-guidance" className="text-sm font-semibold text-[var(--primary-color)]">View guidance</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {spotlightCards.map((card) => (
            <article key={card.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img src={card.image} alt={card.title} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{card.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{card.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {sectionOrder.map((key) => sectionsByKey[key]).filter(Boolean)}
    </div>
  );
}

export default HomePage;
