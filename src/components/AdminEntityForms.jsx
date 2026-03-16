import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

const initialCollege = {
  name: '',
  slug: '',
  city: '',
  state: '',
  country: 'India',
  feesMin: '',
  feesMax: '',
  avgPackage: '',
  ranking: '',
  rating: '',
  examsAccepted: '',
  courseIds: [],
};

const initialCourse = {
  name: '',
  slug: '',
  stream: '',
  duration: '',
  eligibility: '',
  averageSalary: '',
  requiredExams: '',
  collegeIds: [],
};

const initialExam = {
  name: '',
  code: '',
  slug: '',
  pattern: '',
  eligibility: '',
};

const initialScholarship = {
  name: '',
  slug: '',
  provider: '',
  amount: '',
  applicationLink: '',
};

function MultiSelect({ label, options, value, onChange }) {
  return (
    <label className="space-y-1 text-sm md:col-span-2">
      <span className="font-medium text-slate-700">{label}</span>
      <div className="grid max-h-44 grid-cols-1 gap-2 overflow-auto rounded border border-slate-300 p-2 sm:grid-cols-2">
        {options.map((opt) => (
          <label key={opt._id} className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={value.includes(opt._id)}
              onChange={(e) => {
                if (e.target.checked) onChange([...value, opt._id]);
                else onChange(value.filter((id) => id !== opt._id));
              }}
            />
            {opt.name}
          </label>
        ))}
      </div>
    </label>
  );
}

function AdminEntityForms() {
  const [resource, setResource] = useState('colleges');
  const [collegeForm, setCollegeForm] = useState(initialCollege);
  const [courseForm, setCourseForm] = useState(initialCourse);
  const [examForm, setExamForm] = useState(initialExam);
  const [scholarshipForm, setScholarshipForm] = useState(initialScholarship);
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const toast = useToast();

  const tabs = useMemo(
    () => [
      ['colleges', 'Add College'],
      ['courses', 'Add Course'],
      ['exams', 'Add Exam'],
      ['scholarships', 'Add Scholarship'],
    ],
    []
  );

  useEffect(() => {
    api.get('/admin/courses?limit=200').then((res) => setCourses(res.data.data.items || [])).catch(() => {});
    api.get('/admin/colleges?limit=200').then((res) => setColleges(res.data.data.items || [])).catch(() => {});
  }, []);

  const resetByResource = (key) => {
    if (key === 'colleges') setCollegeForm(initialCollege);
    if (key === 'courses') setCourseForm(initialCourse);
    if (key === 'exams') setExamForm(initialExam);
    if (key === 'scholarships') setScholarshipForm(initialScholarship);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      if (resource === 'colleges') {
        if (!collegeForm.name || !collegeForm.slug) return toast.error('College name and slug are required');
        const payload = {
          ...collegeForm,
          courses: collegeForm.courseIds,
          feesMin: collegeForm.feesMin ? Number(collegeForm.feesMin) : undefined,
          feesMax: collegeForm.feesMax ? Number(collegeForm.feesMax) : undefined,
          avgPackage: collegeForm.avgPackage ? Number(collegeForm.avgPackage) : undefined,
          ranking: collegeForm.ranking ? Number(collegeForm.ranking) : undefined,
          rating: collegeForm.rating ? Number(collegeForm.rating) : undefined,
          examsAccepted: collegeForm.examsAccepted
            ? collegeForm.examsAccepted.split(',').map((x) => x.trim()).filter(Boolean)
            : [],
        };
        delete payload.courseIds;
        await api.post('/admin/colleges', payload);
      }

      if (resource === 'courses') {
        if (!courseForm.name || !courseForm.slug) return toast.error('Course name and slug are required');
        const payload = {
          ...courseForm,
          averageSalary: courseForm.averageSalary ? Number(courseForm.averageSalary) : undefined,
          requiredExams: courseForm.requiredExams
            ? courseForm.requiredExams.split(',').map((x) => x.trim()).filter(Boolean)
            : [],
          topColleges: courseForm.collegeIds,
        };
        delete payload.collegeIds;
        await api.post('/admin/courses', payload);
      }

      if (resource === 'exams') {
        if (!examForm.name || !examForm.slug || !examForm.code) return toast.error('Exam name, code and slug are required');
        await api.post('/admin/exams', examForm);
      }

      if (resource === 'scholarships') {
        if (!scholarshipForm.name || !scholarshipForm.slug) return toast.error('Scholarship name and slug are required');
        await api.post('/admin/scholarships', {
          ...scholarshipForm,
          amount: scholarshipForm.amount ? Number(scholarshipForm.amount) : undefined,
        });
      }

      toast.success('Created successfully');
      setStatus('Created successfully');
      resetByResource(resource);

      // refresh options to keep linked dropdowns updated
      api.get('/admin/courses?limit=200').then((res) => setCourses(res.data.data.items || [])).catch(() => {});
      api.get('/admin/colleges?limit=200').then((res) => setColleges(res.data.data.items || [])).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold">Structured Add Forms</h3>

      <div className="flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setResource(key);
              setStatus('');
            }}
            className={`rounded px-3 py-1 text-sm ${resource === key ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-800'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        {resource === 'colleges' && (
          <>
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="College Name *" value={collegeForm.name} onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Slug *" value={collegeForm.slug} onChange={(e) => setCollegeForm({ ...collegeForm, slug: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="City" value={collegeForm.city} onChange={(e) => setCollegeForm({ ...collegeForm, city: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="State" value={collegeForm.state} onChange={(e) => setCollegeForm({ ...collegeForm, state: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Country" value={collegeForm.country} onChange={(e) => setCollegeForm({ ...collegeForm, country: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Exams Accepted (comma separated)" value={collegeForm.examsAccepted} onChange={(e) => setCollegeForm({ ...collegeForm, examsAccepted: e.target.value })} />
            <input type="number" className="rounded border border-slate-300 px-3 py-2" placeholder="Fees Min" value={collegeForm.feesMin} onChange={(e) => setCollegeForm({ ...collegeForm, feesMin: e.target.value })} />
            <input type="number" className="rounded border border-slate-300 px-3 py-2" placeholder="Fees Max" value={collegeForm.feesMax} onChange={(e) => setCollegeForm({ ...collegeForm, feesMax: e.target.value })} />
            <input type="number" className="rounded border border-slate-300 px-3 py-2" placeholder="Avg Package" value={collegeForm.avgPackage} onChange={(e) => setCollegeForm({ ...collegeForm, avgPackage: e.target.value })} />
            <input type="number" className="rounded border border-slate-300 px-3 py-2" placeholder="Ranking" value={collegeForm.ranking} onChange={(e) => setCollegeForm({ ...collegeForm, ranking: e.target.value })} />
            <input type="number" className="rounded border border-slate-300 px-3 py-2" placeholder="Rating" value={collegeForm.rating} onChange={(e) => setCollegeForm({ ...collegeForm, rating: e.target.value })} />
            <div />
            <MultiSelect label="Courses Offered" options={courses} value={collegeForm.courseIds} onChange={(v) => setCollegeForm({ ...collegeForm, courseIds: v })} />
          </>
        )}

        {resource === 'courses' && (
          <>
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Course Name *" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Slug *" value={courseForm.slug} onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Stream" value={courseForm.stream} onChange={(e) => setCourseForm({ ...courseForm, stream: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Duration" value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Eligibility" value={courseForm.eligibility} onChange={(e) => setCourseForm({ ...courseForm, eligibility: e.target.value })} />
            <input type="number" className="rounded border border-slate-300 px-3 py-2" placeholder="Average Salary" value={courseForm.averageSalary} onChange={(e) => setCourseForm({ ...courseForm, averageSalary: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Required Exams (comma separated)" value={courseForm.requiredExams} onChange={(e) => setCourseForm({ ...courseForm, requiredExams: e.target.value })} />
            <MultiSelect label="Top Colleges" options={colleges} value={courseForm.collegeIds} onChange={(v) => setCourseForm({ ...courseForm, collegeIds: v })} />
          </>
        )}

        {resource === 'exams' && (
          <>
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Exam Name *" value={examForm.name} onChange={(e) => setExamForm({ ...examForm, name: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Code *" value={examForm.code} onChange={(e) => setExamForm({ ...examForm, code: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Slug *" value={examForm.slug} onChange={(e) => setExamForm({ ...examForm, slug: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Pattern" value={examForm.pattern} onChange={(e) => setExamForm({ ...examForm, pattern: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Eligibility" value={examForm.eligibility} onChange={(e) => setExamForm({ ...examForm, eligibility: e.target.value })} />
          </>
        )}

        {resource === 'scholarships' && (
          <>
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Scholarship Name *" value={scholarshipForm.name} onChange={(e) => setScholarshipForm({ ...scholarshipForm, name: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Slug *" value={scholarshipForm.slug} onChange={(e) => setScholarshipForm({ ...scholarshipForm, slug: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2" placeholder="Provider" value={scholarshipForm.provider} onChange={(e) => setScholarshipForm({ ...scholarshipForm, provider: e.target.value })} />
            <input type="number" className="rounded border border-slate-300 px-3 py-2" placeholder="Amount" value={scholarshipForm.amount} onChange={(e) => setScholarshipForm({ ...scholarshipForm, amount: e.target.value })} />
            <input className="rounded border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Application Link" value={scholarshipForm.applicationLink} onChange={(e) => setScholarshipForm({ ...scholarshipForm, applicationLink: e.target.value })} />
          </>
        )}

        <button disabled={loading} className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white md:col-span-2">
          {loading ? 'Saving...' : `Create ${resource.slice(0, -1)}`}
        </button>
      </form>

      {status && <p className="text-sm text-emerald-700">{status}</p>}
    </div>
  );
}

export default AdminEntityForms;
