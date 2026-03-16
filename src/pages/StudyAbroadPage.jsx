import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionCard from '../components/SectionCard';
import { api } from '../lib/api';

function StudyAbroadPage() {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    api.get('/catalog/colleges', { params: { limit: 100 } })
      .then((res) => setColleges(res.data.data.items || []))
      .catch(() => {});
  }, []);

  const countries = useMemo(() => {
    const values = new Set(colleges.map((item) => item.country).filter(Boolean));
    return [...values];
  }, [colleges]);

  const byCountry = useMemo(() => countries.map((country) => ({
    country,
    colleges: colleges.filter((item) => item.country === country).slice(0, 4),
  })), [countries, colleges]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Study Abroad</h1>
      <SectionCard title="Overview">Universities, visa requirements and entrance tests like IELTS, TOEFL, GRE, GMAT, SAT.</SectionCard>
      <div className="grid gap-3 md:grid-cols-2">
        {byCountry.map((item) => (
          <div key={item.country} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{item.country}</h2>
            <div className="mt-2 space-y-1 text-sm text-slate-600">
              {item.colleges.length ? item.colleges.map((college) => (
                <Link key={college._id} to={`/colleges/${college.slug}`} className="block hover:text-[var(--primary-color)]">
                  {college.name}
                </Link>
              )) : <p>No colleges listed yet.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyAbroadPage;
