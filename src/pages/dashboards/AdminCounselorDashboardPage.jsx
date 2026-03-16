import { useEffect, useState } from 'react';
import SectionCard from '../../components/SectionCard';
import { api } from '../../lib/api';

function AdminCounselorDashboardPage() {
  const [data, setData] = useState(null);
  const [prioritized, setPrioritized] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', stage: 'lead', expectedRevenue: '' });
  const [messageForm, setMessageForm] = useState({ contactId: '', content: '', channel: 'whatsapp' });
  const [callForm, setCallForm] = useState({ contactId: '', durationSec: '', status: 'connected', autoDialed: true });

  const load = async () => {
    const [{ data: dashboard }, { data: priority }] = await Promise.all([
      api.get('/crm/dashboard/mine'),
      api.get('/crm/contacts/prioritized', { params: { limit: 8 } }),
    ]);
    setData(dashboard.data);
    setPrioritized(priority.data || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Counselor CRM</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Contacts">{data?.metrics?.contacts || 0}</SectionCard>
        <SectionCard title="Messages">{data?.metrics?.messages || 0}</SectionCard>
        <SectionCard title="Calls">{data?.metrics?.calls || 0}</SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Add CRM Contact</h3>
          <form
            className="space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              await api.post('/crm/contacts', { ...contactForm, expectedRevenue: Number(contactForm.expectedRevenue || 0) });
              setContactForm({ name: '', phone: '', email: '', stage: 'lead', expectedRevenue: '' });
              await load();
            }}
          >
            <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
            <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Phone" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
            <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
            <select className="w-full rounded border border-slate-300 px-3 py-2" value={contactForm.stage} onChange={(e) => setContactForm({ ...contactForm, stage: e.target.value })}>
              <option value="lead">Lead</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Expected Revenue" value={contactForm.expectedRevenue} onChange={(e) => setContactForm({ ...contactForm, expectedRevenue: e.target.value })} />
            <button className="w-full rounded bg-[var(--primary-color)] px-3 py-2 text-white">Create Contact</button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Log Message</h3>
          <form
            className="space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              await api.post('/crm/messages/log', messageForm);
              setMessageForm({ contactId: '', content: '', channel: 'whatsapp' });
              await load();
            }}
          >
            <select className="w-full rounded border border-slate-300 px-3 py-2" value={messageForm.contactId} onChange={(e) => setMessageForm({ ...messageForm, contactId: e.target.value })}>
              <option value="">Select Contact</option>
              {(data?.latestContacts || []).map((c) => <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>)}
            </select>
            <select className="w-full rounded border border-slate-300 px-3 py-2" value={messageForm.channel} onChange={(e) => setMessageForm({ ...messageForm, channel: e.target.value })}>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
            <textarea className="h-24 w-full rounded border border-slate-300 px-3 py-2" placeholder="Message content" value={messageForm.content} onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })} />
            <button className="w-full rounded bg-emerald-600 px-3 py-2 text-white">Log Message</button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Log Auto/Manual Call</h3>
          <form
            className="space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              await api.post('/crm/calls/log', { ...callForm, durationSec: Number(callForm.durationSec || 0) });
              setCallForm({ contactId: '', durationSec: '', status: 'connected', autoDialed: true });
              await load();
            }}
          >
            <select className="w-full rounded border border-slate-300 px-3 py-2" value={callForm.contactId} onChange={(e) => setCallForm({ ...callForm, contactId: e.target.value })}>
              <option value="">Select Contact</option>
              {(data?.latestContacts || []).map((c) => <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>)}
            </select>
            <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Duration seconds" value={callForm.durationSec} onChange={(e) => setCallForm({ ...callForm, durationSec: e.target.value })} />
            <select className="w-full rounded border border-slate-300 px-3 py-2" value={callForm.status} onChange={(e) => setCallForm({ ...callForm, status: e.target.value })}>
              <option value="connected">Connected</option>
              <option value="missed">Missed</option>
              <option value="busy">Busy</option>
              <option value="failed">Failed</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(callForm.autoDialed)} onChange={(e) => setCallForm({ ...callForm, autoDialed: e.target.checked })} />
              Auto dialed call
            </label>
            <button className="w-full rounded bg-slate-800 px-3 py-2 text-white">Log Call</button>
          </form>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">AI Lead Priority</h3>
          <div className="space-y-2 text-sm">
            {prioritized.map((row) => (
              <div key={row.contact._id} className="rounded border border-slate-200 p-2">
                <p className="font-medium">{row.contact.name} ({row.contact.phone})</p>
                <p className="text-xs text-slate-600">Stage: {row.contact.stage} | Score: {row.aiPriorityScore} | Interactions: {row.interactionCount}</p>
                <p className="text-xs text-slate-600">Expected Revenue: {row.contact.expectedRevenue || 0}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Latest Messages</h3>
          <div className="space-y-2 text-sm">{(data?.latestMessages || []).map((m) => <div key={m._id} className="rounded border border-slate-200 p-2">{m.contactId?.name || 'Contact'}: {m.content}</div>)}</div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Latest Calls</h3>
          <div className="space-y-2 text-sm">{(data?.latestCalls || []).map((c) => <div key={c._id} className="rounded border border-slate-200 p-2">{c.contactId?.name || 'Contact'} - {c.status} ({c.durationSec}s)</div>)}</div>
        </section>
      </div>
    </div>
  );
}

export default AdminCounselorDashboardPage;
