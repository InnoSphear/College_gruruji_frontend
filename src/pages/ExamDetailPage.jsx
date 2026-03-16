import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

function ExamDetailPage() {
  const { slug } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    api.get(`/catalog/exams/${slug}`).then((res) => setExam(res.data.data)).catch(() => setExam(null));
  }, [slug]);

  if (!exam) return <div className="rounded-xl border border-slate-200 bg-white p-6">Loading exam details...</div>;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-600 p-6 text-white">
        <h1 className="text-3xl font-bold">{exam.name}</h1>
        <p className="mt-1 text-sm">Code: {exam.code}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-semibold">Pattern</h2>
          <p className="text-sm text-slate-700">{exam.pattern || 'Pattern to be announced.'}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-semibold">Eligibility</h2>
          <p className="text-sm text-slate-700">{exam.eligibility || 'Refer official notification.'}</p>
        </article>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-2 text-lg font-semibold">Syllabus</h2>
        <p className="text-sm text-slate-700">{exam.syllabus || 'Syllabus details available soon.'}</p>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-2 text-lg font-semibold">Important Dates</h2>
        <div className="space-y-2 text-sm">
          {(exam.importantDates || []).length ? (exam.importantDates || []).map((d, i) => <p key={i}>{d.label || d.title}: {d.date ? new Date(d.date).toLocaleDateString() : 'TBA'}</p>) : <p>No dates yet.</p>}
        </div>
      </article>
    </div>
  );
}

export default ExamDetailPage;
