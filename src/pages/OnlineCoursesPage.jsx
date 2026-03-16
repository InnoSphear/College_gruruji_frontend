import { useEffect, useState } from 'react';
import SectionCard from '../components/SectionCard';
import { api } from '../lib/api';

function OnlineCoursesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/catalog/online-courses?limit=20').then((res) => setItems(res.data.data.items || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Online Courses</h1>
      <SectionCard title="Overview">Certification and skill courses for remote learning.</SectionCard>
      <div className="grid gap-3 md:grid-cols-2">
        {items.slice(0, 8).map((item) => (
          <div className="rounded border border-slate-200 bg-white p-3" key={item._id}>{item.title}</div>
        ))}
      </div>
    </div>
  );
}

export default OnlineCoursesPage;
