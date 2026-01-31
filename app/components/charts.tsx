'use client';

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'];

interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  createdAt: string;
  category?: { name: string };
}

export function BudgetCharts({ transactions }: { transactions: Transaction[] }) {
  // Provera da li ima podataka
  const hasData = transactions.length > 0;
  const hasExpenses = transactions.some(t => t.type === 'EXPENSE');

  // 1. Priprema podataka za Pie Chart
  const expenseData = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc: any[], curr) => {
      const catName = curr.category?.name || 'Ostalo';
      const existing = acc.find(i => i.name === catName);
      if (existing) {
        existing.value += Number(curr.amount);
      } else {
        acc.push({ name: catName, value: Number(curr.amount) });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // 2. Priprema podataka za Area Chart (Poslednjih 7)
  const trendData = transactions
    .slice(0, 7)
    .reverse()
    .map(t => ({
      name: new Date(t.createdAt).toLocaleDateString('sr-RS', { day: '2-digit', month: 'short' }),
      iznos: Number(t.amount),
    }));

  // Prazni podaci za "Placeholder" efekat
  const placeholderData = [
    { name: 'A', iznos: 400 }, { name: 'B', iznos: 300 }, { name: 'C', iznos: 500 },
    { name: 'D', iznos: 280 }, { name: 'E', iznos: 590 }, { name: 'F', iznos: 320 }
  ];

  if (!hasData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-60 grayscale-[0.5]">
        <div className="lg:col-span-2 bg-slate-900/20 border border-slate-800/50 p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-500/5 rounded-full flex items-center justify-center mb-4 border border-blue-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Čekamo prve podatke</h3>
          <p className="text-[9px] text-slate-600 uppercase mt-2 font-bold">Unesite transakciju da aktivirate trend analizu</p>
        </div>
        <div className="bg-slate-900/20 border border-slate-800/50 p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full border-4 border-slate-800/30 border-t-blue-500/20 animate-spin-slow mb-4"></div>
          <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Analiza strukture</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* AREA CHART - TREND */}
      <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-[2.5rem] shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Trend transakcija</h3>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-[8px] font-black uppercase text-blue-400">Uživo (RSD)</span>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                cursor={{ stroke: '#334155', strokeWidth: 2 }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                itemStyle={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="iznos" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART - STRUKTURA */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-[2.5rem] shadow-xl flex flex-col">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 text-center">Struktura troškova</h3>
        {!hasExpenses ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 italic text-[10px] text-center px-6 uppercase font-bold tracking-widest leading-loose">
                Nema registrovanih odlivnih transakcija za grafikon
            </div>
        ) : (
            <>
                <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={expenseData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                        {expenseData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Fokus</span>
                    <span className="text-sm font-black text-slate-100 italic">ODLIV</span>
                </div>
                </div>
                <div className="mt-auto space-y-3 pt-4">
                {expenseData.slice(0, 3).map((item, index) => (
                    <div key={item.name} className="flex justify-between items-center group">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-200">{item.value.toLocaleString()} RSD</span>
                    </div>
                ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
}