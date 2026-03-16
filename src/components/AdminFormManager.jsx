import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

const resourceFields = {
  colleges: [
    { key: 'name', label: 'College Name', required: true },
    { key: 'slug', label: 'Slug', required: true },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'country', label: 'Country' },
    { key: 'feesMin', label: 'Fees Min', type: 'number' },
    { key: 'feesMax', label: 'Fees Max', type: 'number' },
    { key: 'avgPackage', label: 'Avg Package', type: 'number' },
    { key: 'ranking', label: 'Ranking', type: 'number' },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'examsAccepted', label: 'Exams (comma separated)' },
    { key: 'overview', label: 'Overview', type: 'textarea' },
    { key: 'admissionProcess', label: 'Admission Process', type: 'textarea' },
    { key: 'placementStats', label: 'Placement Stats', type: 'textarea' },
    { key: 'infrastructure', label: 'Infrastructure', type: 'textarea' },
    { key: 'contact.website', label: 'Website' },
    { key: 'contact.email', label: 'Contact Email' },
    { key: 'contact.phone', label: 'Contact Phone' },
    { key: 'courses', label: 'Courses', type: 'multiselect', optionKey: 'courses' },
  ],
  courses: [
    { key: 'name', label: 'Course Name', required: true },
    { key: 'slug', label: 'Slug', required: true },
    { key: 'stream', label: 'Stream' },
    { key: 'duration', label: 'Duration' },
    { key: 'eligibility', label: 'Eligibility' },
    { key: 'careerScope', label: 'Career Scope', type: 'textarea' },
    { key: 'averageSalary', label: 'Average Salary', type: 'number' },
    { key: 'requiredExams', label: 'Required Exams (comma separated)' },
    { key: 'topColleges', label: 'Top Colleges', type: 'multiselect', optionKey: 'colleges' },
  ],
  exams: [
    { key: 'name', label: 'Exam Name', required: true },
    { key: 'code', label: 'Code', required: true },
    { key: 'slug', label: 'Slug', required: true },
    { key: 'pattern', label: 'Pattern' },
    { key: 'syllabus', label: 'Syllabus', type: 'textarea' },
    { key: 'eligibility', label: 'Eligibility' },
    { key: 'registrationLink', label: 'Registration Link' },
    { key: 'admitCardLink', label: 'Admit Card Link' },
    { key: 'resultLink', label: 'Result Link' },
  ],
  scholarships: [
    { key: 'name', label: 'Scholarship Name', required: true },
    { key: 'slug', label: 'Slug', required: true },
    { key: 'provider', label: 'Provider' },
    { key: 'eligibilityCriteria', label: 'Eligibility Criteria', type: 'textarea' },
    { key: 'amount', label: 'Amount', type: 'number' },
    { key: 'applicationDeadline', label: 'Application Deadline', type: 'date' },
    { key: 'applicationLink', label: 'Application Link' },
  ],
  'online-courses': [
    { key: 'title', label: 'Title', required: true },
    { key: 'provider', label: 'Provider' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', type: 'number' },
    { key: 'durationHours', label: 'Duration Hours', type: 'number' },
    { key: 'enrollmentLink', label: 'Enrollment Link' },
  ],
  users: [
    { key: 'name', label: 'Name', required: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', required: true },
    { key: 'password', label: 'Password', required: true },
    { key: 'role', label: 'Role (student/counselor/admin_counselor/college_admin/platform_admin)', required: true },
  ],
  leads: [
    { key: 'studentId', label: 'Student', type: 'select', optionKey: 'users' },
    { key: 'collegeId', label: 'College', type: 'select', optionKey: 'colleges' },
    { key: 'counselorId', label: 'Counselor', type: 'select', optionKey: 'users' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status (new/contacted/qualified/converted/lost)' },
  ],
  referrals: [
    { key: 'counselorId', label: 'Counselor', type: 'select', optionKey: 'users', required: true },
    { key: 'studentId', label: 'Student', type: 'select', optionKey: 'users', required: true },
    { key: 'referralCode', label: 'Referral Code', required: true },
    { key: 'status', label: 'Status (registered/applied/admitted)' },
    { key: 'commissionStatus', label: 'Commission Status (pending/approved/paid)' },
    { key: 'commissionAmount', label: 'Commission Amount', type: 'number' },
  ],
  applications: [
    { key: 'studentId', label: 'Student', type: 'select', optionKey: 'users', required: true },
    { key: 'collegeId', label: 'College', type: 'select', optionKey: 'colleges', required: true },
    { key: 'courseId', label: 'Course', type: 'select', optionKey: 'courses', required: true },
    { key: 'status', label: 'Status', required: true },
    { key: 'commissionStatus', label: 'Commission Status' },
    { key: 'commissionAmount', label: 'Commission Amount', type: 'number' },
  ],
  'crm-contacts': [
    { key: 'counselorId', label: 'Counselor', type: 'select', optionKey: 'adminCounselors', required: true },
    { key: 'name', label: 'Contact Name', required: true },
    { key: 'phone', label: 'Phone', required: true },
    { key: 'email', label: 'Email' },
    { key: 'stage', label: 'Stage (lead/warm/hot/converted/lost)' },
    { key: 'tags', label: 'Tags (comma separated)' },
    { key: 'source', label: 'Source' },
    { key: 'expectedRevenue', label: 'Expected Revenue', type: 'number' },
    { key: 'lastContactedAt', label: 'Last Contacted', type: 'date' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
  'crm-messages': [
    { key: 'counselorId', label: 'Counselor', type: 'select', optionKey: 'adminCounselors', required: true },
    { key: 'contactId', label: 'Contact', type: 'select', optionKey: 'crmContacts', required: true },
    { key: 'channel', label: 'Channel (whatsapp/sms/email)' },
    { key: 'direction', label: 'Direction (inbound/outbound)' },
    { key: 'templateName', label: 'Template Name' },
    { key: 'status', label: 'Status' },
    { key: 'content', label: 'Content', type: 'textarea', required: true },
  ],
  'crm-calls': [
    { key: 'counselorId', label: 'Counselor', type: 'select', optionKey: 'adminCounselors', required: true },
    { key: 'contactId', label: 'Contact', type: 'select', optionKey: 'crmContacts', required: true },
    { key: 'direction', label: 'Direction (inbound/outbound)' },
    { key: 'durationSec', label: 'Duration (sec)', type: 'number' },
    { key: 'status', label: 'Status (connected/missed/busy/failed)' },
    { key: 'autoDialed', label: 'Auto Dialed', type: 'checkbox' },
    { key: 'recordingUrl', label: 'Recording URL' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
  'crm-whatsapp-sessions': [
    { key: 'counselorId', label: 'Counselor', type: 'select', optionKey: 'adminCounselors', required: true },
    { key: 'whatsappNumber', label: 'WhatsApp Number', required: true },
    { key: 'status', label: 'Status (active/disconnected/pending)' },
    { key: 'qrToken', label: 'QR Token' },
    { key: 'messagesSent', label: 'Messages Sent', type: 'number' },
    { key: 'callsLogged', label: 'Calls Logged', type: 'number' },
  ],
  'crm-automation-rules': [
    { key: 'counselorId', label: 'Counselor (optional)', type: 'select', optionKey: 'adminCounselors' },
    { key: 'name', label: 'Rule Name', required: true },
    { key: 'triggerType', label: 'Trigger Type', required: true },
    { key: 'actionType', label: 'Action Type', required: true },
    { key: 'isActive', label: 'Active', type: 'checkbox' },
    { key: 'isGlobal', label: 'Global Rule', type: 'checkbox' },
  ],
  blog: [
    { key: 'title', label: 'Title', required: true },
    { key: 'slug', label: 'Slug', required: true },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'isPublished', label: 'Published', type: 'checkbox' },
  ],
};

const readOnlyResources = new Set(['audit-logs']);

const getByPath = (obj, path) => path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);

const setByPath = (obj, path, value) => {
  const keys = path.split('.');
  const last = keys.pop();
  let cursor = obj;
  keys.forEach((key) => {
    if (!cursor[key] || typeof cursor[key] !== 'object') cursor[key] = {};
    cursor = cursor[key];
  });
  cursor[last] = value;
};

function normalizeInputForEdit(resource, fields, item) {
  const result = {};
  fields.forEach((field) => {
    let value = getByPath(item, field.key);
    if (Array.isArray(value) && field.type !== 'multiselect') {
      value = value.join(', ');
    }
    if (field.type === 'multiselect') {
      value = Array.isArray(value) ? value.map((v) => (typeof v === 'string' ? v : v?._id)).filter(Boolean) : [];
    }
    if (typeof value === 'boolean') result[field.key] = value;
    else result[field.key] = value ?? '';
  });
  return result;
}

function buildPayload(fields, form) {
  const payload = {};
  fields.forEach((field) => {
    const value = form[field.key];
    if (field.type === 'multiselect') {
      payload[field.key] = value || [];
      return;
    }
    if (field.type === 'checkbox') {
      payload[field.key] = Boolean(value);
      return;
    }
    if (value === '' || value === undefined || value === null) return;
    if (field.type === 'number') {
      setByPath(payload, field.key, Number(value));
      return;
    }
    if (field.type === 'date') {
      setByPath(payload, field.key, value ? new Date(value) : undefined);
      return;
    }
    if (field.key === 'examsAccepted' || field.key === 'requiredExams' || field.key === 'tags') {
      setByPath(payload, field.key, String(value)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean));
      return;
    }
    setByPath(payload, field.key, value);
  });
  return payload;
}

function MultiSelectField({ field, form, setForm, options }) {
  const current = form[field.key] || [];

  return (
    <label className="space-y-1 text-sm md:col-span-2">
      <span className="font-medium text-slate-700">{field.label}</span>
      <div className="grid max-h-36 grid-cols-1 gap-1 overflow-auto rounded border border-slate-300 p-2 sm:grid-cols-2">
        {options.map((opt) => {
          const checked = current.includes(opt._id);
          return (
            <label key={opt._id} className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  if (e.target.checked) setForm({ ...form, [field.key]: [...current, opt._id] });
                  else setForm({ ...form, [field.key]: current.filter((x) => x !== opt._id) });
                }}
              />
              {opt.name}
            </label>
          );
        })}
      </div>
    </label>
  );
}

function AdminFormManager({ resource, title }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [options, setOptions] = useState({ colleges: [], courses: [], users: [], adminCounselors: [], crmContacts: [] });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fields = useMemo(() => resourceFields[resource] || [], [resource]);
  const isReadOnly = readOnlyResources.has(resource);

  const load = async () => {
    const { data } = await api.get(`/admin/${resource}`, { params: { q: query, limit: 30 } });
    setItems(data.data.items || []);
  };

  useEffect(() => {
    setForm({});
    setEditingId(null);
    load().catch(() => setItems([]));
  }, [resource]);

  useEffect(() => {
    api.get('/admin/colleges?limit=200').then((res) => setOptions((p) => ({ ...p, colleges: res.data.data.items || [] }))).catch(() => {});
    api.get('/admin/courses?limit=200').then((res) => setOptions((p) => ({ ...p, courses: res.data.data.items || [] }))).catch(() => {});
    api.get('/admin/users?limit=300').then((res) => {
      const users = res.data.data.items || [];
      setOptions((p) => ({
        ...p,
        users,
        adminCounselors: users.filter((u) => u.role === 'admin_counselor'),
      }));
    }).catch(() => {});
    api.get('/admin/crm-contacts?limit=400').then((res) => setOptions((p) => ({ ...p, crmContacts: res.data.data.items || [] }))).catch(() => {});
  }, []);

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm(normalizeInputForEdit(resource, fields, item));
  };

  const clearEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const submit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    const requiredMissing = fields.find((f) => f.required && !String(form[f.key] || '').trim());
    if (requiredMissing) return toast.error(`${requiredMissing.label} is required`);

    const payload = buildPayload(fields, form);
    setLoading(true);
    try {
      if (editingId) {
        await api.patch(`/admin/${resource}/${editingId}`, payload);
        toast.success('Updated');
      } else {
        await api.post(`/admin/${resource}`, payload);
        toast.success('Created');
      }
      clearEdit();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (isReadOnly) return;
    try {
      await api.delete(`/admin/${resource}/${id}`);
      toast.info('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <input className="rounded border border-slate-300 px-3 py-2 text-sm" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
          <button type="button" className="rounded bg-slate-800 px-3 py-2 text-sm text-white" onClick={load}>Search</button>
        </div>
      </div>

      {!isReadOnly && fields.length > 0 && (
        <form onSubmit={submit} className="grid gap-3 rounded border border-slate-200 p-3 md:grid-cols-2">
          {fields.map((field) => {
            if (field.type === 'multiselect') {
              return (
                <MultiSelectField
                  key={field.key}
                  field={field}
                  form={form}
                  setForm={setForm}
                  options={options[field.optionKey] || []}
                />
              );
            }

            if (field.type === 'textarea') {
              return (
                <label key={field.key} className="space-y-1 text-sm md:col-span-2">
                  <span className="font-medium text-slate-700">{field.label}{field.required ? ' *' : ''}</span>
                  <textarea className="h-28 w-full rounded border border-slate-300 px-3 py-2" value={form[field.key] || ''} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
                </label>
              );
            }

            if (field.type === 'select') {
              return (
                <label key={field.key} className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">{field.label}{field.required ? ' *' : ''}</span>
                  <select
                    value={form[field.key] || ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full rounded border border-slate-300 px-3 py-2"
                  >
                    <option value="">Select</option>
                    {(options[field.optionKey] || []).map((opt) => (
                      <option key={opt._id} value={opt._id}>{opt.name || opt.title || opt.phone || opt.email || opt.slug}</option>
                    ))}
                  </select>
                </label>
              );
            }

            if (field.type === 'checkbox') {
              return (
                <label key={field.key} className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm">
                  <input type="checkbox" checked={Boolean(form[field.key])} onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })} />
                  {field.label}
                </label>
              );
            }

            return (
              <label key={field.key} className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">{field.label}{field.required ? ' *' : ''}</span>
                <input
                  type={field.type === 'date' ? 'date' : (field.type || 'text')}
                  value={form[field.key] || ''}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>
            );
          })}

          <div className="flex gap-2 md:col-span-2">
            <button disabled={loading} className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">{loading ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="rounded border border-slate-300 px-4 py-2 text-sm" onClick={clearEdit}>Cancel Edit</button>}
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item._id} className="flex flex-col gap-2 rounded border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <p className="font-medium">{item.name || item.title || item.action || item.slug || item._id}</p>
              <p className="text-xs text-slate-500">{item.email || item.phone || item.resource || item.status || ''}</p>
            </div>
            <div className="flex gap-2">
              {!isReadOnly && <button type="button" className="rounded border border-slate-300 px-3 py-1 text-sm" onClick={() => startEdit(item)}>Edit</button>}
              {!isReadOnly && <button type="button" className="rounded border border-rose-300 px-3 py-1 text-sm text-rose-700" onClick={() => remove(item._id)}>Delete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminFormManager;
