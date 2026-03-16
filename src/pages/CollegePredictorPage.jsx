import { useState } from 'react';
import { api } from '../lib/api';

function CollegePredictorPage() {
  const [form, setForm] = useState({ marks: 0, entranceExamScore: 0, budget: 0, locationPreference: 'Delhi', courseInterest: 'Engineering' });
  const [result, setResult] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      marks: Number(form.marks),
      entranceExamScore: Number(form.entranceExamScore),
      budget: Number(form.budget),
      locationPreference: form.locationPreference.split(',').map((x) => x.trim()).filter(Boolean),
      courseInterest: form.courseInterest,
    };
    try {
      const { data } = await api.post('/recommendations/college-predictor', payload);
      setResult(data.data.ranked || []);
      setAiSummary(data.data.aiSummary || '');
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Please login with a student account to use the predictor.');
      } else {
        setError(err.response?.data?.message || 'Prediction failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">AI College Predictor</h1>
      <form onSubmit={submit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <input className="rounded border border-slate-300 px-3 py-2" placeholder="Marks" onChange={(e) => setForm({ ...form, marks: e.target.value })} />
        <input className="rounded border border-slate-300 px-3 py-2" placeholder="Exam Score" onChange={(e) => setForm({ ...form, entranceExamScore: e.target.value })} />
        <input className="rounded border border-slate-300 px-3 py-2" placeholder="Budget" onChange={(e) => setForm({ ...form, budget: e.target.value })} />
        <input className="rounded border border-slate-300 px-3 py-2" placeholder="Preferred Locations" onChange={(e) => setForm({ ...form, locationPreference: e.target.value })} />
        <input className="rounded border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Course Interest" onChange={(e) => setForm({ ...form, courseInterest: e.target.value })} />
        {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
        <button className="rounded-lg bg-[var(--primary-color)] px-4 py-2 text-white md:col-span-2" disabled={loading}>{loading ? 'Predicting...' : 'Predict'}</button>
      </form>
      {aiSummary && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">Counseling Summary</p>
          <p className="mt-1 whitespace-pre-line">{aiSummary}</p>
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">{result.map((item) => <div key={item.college._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-semibold">{item.college.name}</h2><p>Match Score: {item.modelScore}</p><p>Probability: {item.admissionProbability}%</p><p>ROI: {item.estimatedROI}</p></div>)}</div>
      {!loading && !error && result.length === 0 && <p className="text-sm text-slate-600">No ranked colleges available yet. Please try different inputs.</p>}
    </div>
  );
}

export default CollegePredictorPage;
