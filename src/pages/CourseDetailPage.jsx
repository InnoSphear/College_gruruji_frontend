import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.get(`/catalog/courses/${slug}`).then((res) => setCourse(res.data.data)).catch(() => setCourse(null));
  }, [slug]);

  if (!course) return <div className="rounded-xl border border-slate-200 bg-white p-6">Loading course details...</div>;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 p-6 text-white">
        <h1 className="text-3xl font-bold">{course.name}</h1>
        <p className="mt-1 text-sm">{course.stream || 'General'} | {course.duration || 'NA'}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-semibold">Eligibility</h2>
          <p className="text-sm text-slate-700">{course.eligibility || 'Eligibility details will be updated by admin.'}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-semibold">Career Scope & Salary</h2>
          <p className="text-sm text-slate-700">{course.careerScope || 'Scope details available on counselor guidance page.'}</p>
          <p className="mt-2 text-sm">Average Salary: {course.averageSalary || '-'}</p>
        </article>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold">Top Colleges Offering this Course</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(course.topColleges || []).map((college) => (
            <div key={college._id} className="rounded border border-slate-200 p-3 text-sm">
              <p className="font-medium">{college.name}</p>
              <p className="text-xs text-slate-500">{college.city}, {college.state}</p>
              <Link className="mt-2 inline-block text-xs font-semibold text-[var(--primary-color)]" to={`/colleges/${college.slug}`}>View College</Link>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export default CourseDetailPage;
