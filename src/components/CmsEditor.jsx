import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

const blankSlide = { title: '', subtitle: '', ctaLabel: '', ctaLink: '', imageUrl: '' };
const allSections = ['topColleges', 'trendingCourses', 'examCalendar', 'scholarships', 'studyAbroad', 'counselingCTA'];

function CmsEditor() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadingFor, setUploadingFor] = useState(null);
  const toast = useToast();

  useEffect(() => {
    api.get('/cms/admin').then((res) => setForm(res.data.data)).catch(() => setForm(null));
  }, []);

  const slides = useMemo(() => form?.heroSlides || [], [form]);

  const updateSlide = (idx, key, value) => {
    const next = slides.map((slide, i) => (i === idx ? { ...slide, [key]: value } : slide));
    setForm({ ...form, heroSlides: next });
  };

  const addSlide = () => setForm({ ...form, heroSlides: [...slides, blankSlide] });
  const removeSlide = (idx) => setForm({ ...form, heroSlides: slides.filter((_, i) => i !== idx) });

  const moveSlide = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const next = [...slides];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setForm({ ...form, heroSlides: next });
  };

  const handleSlideDrop = (e, toIndex) => {
    const from = Number(e.dataTransfer.getData('slide-index'));
    if (Number.isNaN(from)) return;
    moveSlide(from, toIndex);
  };

  const moveSection = (fromIndex, toIndex) => {
    const current = form?.homepageSectionOrder || allSections;
    if (toIndex < 0 || toIndex >= current.length) return;
    const next = [...current];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setForm({ ...form, homepageSectionOrder: next });
  };

  const uploadImage = async (index, file) => {
    if (!file) return;
    setUploadingFor(index);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', '/kollege/cms/hero');
      const { data } = await api.post('/integrations/imagekit/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateSlide(index, 'imageUrl', data.data.url);
      toast.success('Slide image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingFor(null);
    }
  };

  const save = async () => {
    if (!form) return;
    setMessage('');
    try {
      await api.patch('/cms/admin', form);
      setMessage('CMS saved successfully');
      toast.success('CMS updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'CMS update failed');
    }
  };

  if (!form) return <div className="rounded border border-slate-200 bg-white p-4 text-sm">Loading CMS...</div>;

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold">CMS & UI Control</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded border border-slate-300 px-3 py-2" value={form.branding?.siteName || ''} onChange={(e) => setForm({ ...form, branding: { ...form.branding, siteName: e.target.value } })} placeholder="Site Name" />
        <input className="rounded border border-slate-300 px-3 py-2" value={form.branding?.tagline || ''} onChange={(e) => setForm({ ...form, branding: { ...form.branding, tagline: e.target.value } })} placeholder="Tagline" />
        <input className="rounded border border-slate-300 px-3 py-2" value={form.theme?.primaryColor || ''} onChange={(e) => setForm({ ...form, theme: { ...form.theme, primaryColor: e.target.value } })} placeholder="Primary Color" />
        <input className="rounded border border-slate-300 px-3 py-2" value={form.theme?.accentColor || ''} onChange={(e) => setForm({ ...form, theme: { ...form.theme, accentColor: e.target.value } })} placeholder="Accent Color" />
      </div>

      <div className="grid gap-2 rounded border border-slate-200 p-3 md:grid-cols-2">
        {[
          ['showTopColleges', 'Show Top Colleges'],
          ['showTrendingCourses', 'Show Trending Courses'],
          ['showExamCalendar', 'Show Exam Calendar'],
          ['showScholarships', 'Show Scholarships'],
          ['showStudyAbroad', 'Show Study Abroad'],
          ['showCounselingCTA', 'Show Counseling CTA'],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.homepageSections?.[key])}
              onChange={(e) =>
                setForm({
                  ...form,
                  homepageSections: { ...form.homepageSections, [key]: e.target.checked },
                })
              }
            />
            {label}
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Homepage Section Order (drag up/down)</h4>
        {(form.homepageSectionOrder || allSections).map((section, idx) => (
          <div key={section} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
            <span className="text-sm font-medium">{section}</span>
            <div className="flex gap-2">
              <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => moveSection(idx, idx - 1)}>Up</button>
              <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => moveSection(idx, idx + 1)}>Down</button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Hero Slides Carousel (drag cards to reorder)</h4>
        {slides.map((slide, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('slide-index', String(idx))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleSlideDrop(e, idx)}
            className="grid gap-2 rounded border border-slate-200 p-3 md:grid-cols-2"
          >
            <input className="rounded border border-slate-300 px-2 py-1" value={slide.title || ''} onChange={(e) => updateSlide(idx, 'title', e.target.value)} placeholder="Title" />
            <input className="rounded border border-slate-300 px-2 py-1" value={slide.subtitle || ''} onChange={(e) => updateSlide(idx, 'subtitle', e.target.value)} placeholder="Subtitle" />
            <input className="rounded border border-slate-300 px-2 py-1" value={slide.ctaLabel || ''} onChange={(e) => updateSlide(idx, 'ctaLabel', e.target.value)} placeholder="CTA Label" />
            <input className="rounded border border-slate-300 px-2 py-1" value={slide.ctaLink || ''} onChange={(e) => updateSlide(idx, 'ctaLink', e.target.value)} placeholder="CTA Link" />
            <input className="rounded border border-slate-300 px-2 py-1 md:col-span-2" value={slide.imageUrl || ''} onChange={(e) => updateSlide(idx, 'imageUrl', e.target.value)} placeholder="Image URL" />

            <div className="flex flex-wrap items-center gap-2 md:col-span-2">
              <label className="rounded border border-slate-300 px-3 py-1 text-xs">
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(idx, e.target.files?.[0])} />
              </label>
              {uploadingFor === idx && <span className="text-xs text-slate-500">Uploading...</span>}
              <button type="button" onClick={() => moveSlide(idx, idx - 1)} className="rounded border border-slate-300 px-3 py-1 text-xs">Up</button>
              <button type="button" onClick={() => moveSlide(idx, idx + 1)} className="rounded border border-slate-300 px-3 py-1 text-xs">Down</button>
              <button type="button" onClick={() => removeSlide(idx)} className="rounded border border-rose-300 px-3 py-1 text-xs text-rose-700">Remove</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addSlide} className="rounded border border-slate-300 px-3 py-1 text-sm">Add Slide</button>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={save} className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Save CMS</button>
        {message && <span className="text-sm text-emerald-700">{message}</span>}
      </div>
    </div>
  );
}

export default CmsEditor;
