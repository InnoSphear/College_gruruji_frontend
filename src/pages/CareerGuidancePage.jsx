import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionCard from '../components/SectionCard';
import { api } from '../lib/api';

function CareerGuidancePage() {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [onlineCourses, setOnlineCourses] = useState([]);

  useEffect(() => {
    api.get('/catalog/courses', { params: { limit: 6 } }).then((res) => setCourses(res.data.data.items || [])).catch(() => {});
    api.get('/catalog/exams', { params: { limit: 6 } }).then((res) => setExams(res.data.data.items || [])).catch(() => {});
    api.get('/catalog/online-courses', { params: { limit: 6 } }).then((res) => setOnlineCourses(res.data.data.items || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Career Guidance</h1>
      <SectionCard title="Overview">Career strategy, exam planning, and course-pathway guidance with actionable next steps.</SectionCard>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Popular Pathways</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {courses.map((course) => (
            <Link key={course._id} className="rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200" to={`/courses/${course.slug}`}>
              {course.name}
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold">Relevant Exams</h3>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            {exams.map((exam) => <Link key={exam._id} className="block hover:text-[var(--primary-color)]" to={`/exams/${exam.slug}`}>{exam.name}</Link>)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold">Skill Building</h3>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            {onlineCourses.map((item) => <p key={item._id}>{item.title}</p>)}
          </div>
        </div>
      </section>
      <section className="rounded-xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] p-5 text-white">
        <h3 className="text-xl font-semibold">Need a personalized plan?</h3>
        <p className="mt-1 text-sm text-white/90">Use the AI college predictor and compare tools, then request counseling from your dashboard.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="rounded bg-white px-3 py-2 text-sm font-semibold text-slate-900" to="/college-predictor">Try Predictor</Link>
          <Link className="rounded border border-white/70 px-3 py-2 text-sm font-semibold" to="/compare-colleges">Compare Colleges</Link>
        </div>
      </section>
    </div>
  );
}

export default CareerGuidancePage;
