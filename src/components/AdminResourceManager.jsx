import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

function AdminResourceManager({ resource, title, samplePayload }) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [payload, setPayload] = useState(JSON.stringify(samplePayload, null, 2));
  const [message, setMessage] = useState('');
  const toast = useToast();
  const readOnly = resource === 'audit-logs';

  const load = async () => {
    const { data } = await api.get(`/admin/${resource}`, { params: { q, limit: 20 } });
    setItems(data.data.items || []);
  };

  useEffect(() => {
    load().catch(() => setItems([]));
  }, [resource]);

  const createItem = async () => {
    setMessage('');
    try {
      const body = JSON.parse(payload);
      await api.post(`/admin/${resource}`, body);
      setMessage('Created successfully');
      toast.success('Created successfully');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    }
  };

  const updateItem = async (id) => {
    try {
      const body = JSON.parse(payload);
      await api.patch(`/admin/${resource}/${id}`, body);
      setMessage('Updated successfully');
      toast.success('Updated successfully');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/admin/${resource}/${id}`);
      setMessage('Deleted successfully');
      toast.info('Deleted successfully');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <input
          className="rounded border border-slate-300 px-2 py-1 text-sm"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="rounded bg-slate-800 px-3 py-1 text-sm text-white" onClick={load}>Search</button>
      </div>

      {!readOnly && (
        <>
          <textarea
            className="h-40 w-full rounded border border-slate-300 p-2 font-mono text-xs"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="rounded bg-blue-700 px-3 py-1 text-sm text-white" onClick={createItem}>Create</button>
          </div>
        </>
      )}

      {message && <p className="text-xs text-emerald-700">{message}</p>}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item._id} className="flex items-center justify-between rounded border border-slate-200 p-2 text-sm">
            <span>{item.name || item.title || item.email || item.phone || item.slug || item._id}</span>
            <div className="flex gap-2">
              {!readOnly && <button className="rounded border border-slate-300 px-2 py-1" onClick={() => updateItem(item._id)}>Update</button>}
              {!readOnly && <button className="rounded border border-rose-300 px-2 py-1 text-rose-700" onClick={() => deleteItem(item._id)}>Delete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminResourceManager;
