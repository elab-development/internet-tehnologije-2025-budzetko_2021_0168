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

const COLORS = ['#8b5cf6', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9', '#6366f1'];

interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  createdAt: string;
  category?: { name: string };
}

export function BudgetCharts({ transactions }: { transactions: Transaction[] }) {
  const hasData = transactions.length > 0;
  const hasExpenses = transactions.some(t => t.type === 'EXPENSE');

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

  const trendData = transactions
    .slice(0, 8)
    .reverse()
    .map(t => ({
      name: new Date(t.createdAt).toLocaleDateString('sr-RS', { day: '2-digit', month: 'short' }),
      iznos: Number(t.amount),
      type: t.type
    }));

  if (!hasData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950/40 border border-slate-800/50 p-20 rounded-[3rem] flex flex-col items-center justify-center text-center backdrop-blur-sm">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full" />
            <svg className="relative" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Analitika je u mirovanju</h3>
          <p className="text-[9px] text-slate-700 uppercase mt-3 font-bold tracking-widest leading-relaxed">Sistem zahteva podatke za generisanje trendova</p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800/50 p-20 rounded-[3rem] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-slate-800 border-t-violet-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-700">
      
      {/* AREA CHART */}
      <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Kretanje kapitala</h3>
            <div className="h-0.5 w-8 bg-violet-500 rounded-full" />
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
                <span className="text-[9px] font-black text-slate-400 uppercase">Protok</span>
             </div>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }} 
                dy={15}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ stroke: '#475569', strokeWidth: 1 }}
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                        return (
                            <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl shadow-2xl backdrop-blur-md">
                                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{payload[0].payload.name}</p>
                                <p className="text-sm font-black text-white italic">
                                    {Number(payload[0].value).toLocaleString()} <span className="text-[9px] text-violet-400">RSD</span>
                                </p>
                            </div>
                        );
                    }
                    return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="iznos" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#chartGradient)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-8 rounded-[3rem] shadow-2xl flex flex-col group">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10 text-center">Distribucija troškova</h3>
        
        {!hasExpenses ? (
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center mb-4">
                    <span className="text-slate-700 font-black text-xl">!</span>
                </div>
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest text-center italic">Nema zabeleženih<br/>rashoda</p>
            </div>
        ) : (
            <>
                <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={expenseData} 
                        innerRadius={65} 
                        outerRadius={85} 
                        paddingAngle={10} 
                        dataKey="value" 
                        stroke="none"
                        animationBegin={300}
                        animationDuration={1500}
                      >
                        {expenseData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl font-violet text-slate-800/50 italic tracking-tighter">
                      %
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  {expenseData.slice(0, 4).map((item, index) => (
                    <div key={item.name} className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-800/30 transition-colors border border-transparent hover:border-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full shadow-lg" style={{ backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}` }} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate max-w-[80px]">{item.name}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-200 tracking-tighter italic">
                        {item.value.toLocaleString()} <span className="text-[8px] text-slate-600 font-bold opacity-70">RSD</span>
                      </span>
                    </div>
                  ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
}