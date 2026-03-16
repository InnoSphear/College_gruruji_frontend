import { useState } from 'react';

function RoiCalculatorPage() {
  const [fees, setFees] = useState('');
  const [salary, setSalary] = useState('');
  const roi = fees && salary ? ((Number(salary) * 3) / (Number(fees) * 4)).toFixed(2) : 0;

  return (
    <div className="max-w-xl space-y-4 rounded border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold">ROI Calculator</h1>
      <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Total Fees" value={fees} onChange={(e) => setFees(e.target.value)} />
      <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Average Package" value={salary} onChange={(e) => setSalary(e.target.value)} />
      <p className="text-lg font-semibold">Estimated ROI: {roi}</p>
    </div>
  );
}

export default RoiCalculatorPage;
