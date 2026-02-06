'use client';

interface StatsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

export function StatsCard({ title, amount, type }: StatsCardProps) {
  const config = {
    income: {
      textColor: 'text-emerald-400',
      glowColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 11 5-5 5 5"/><path d="M12 18V6"/></svg>
      ),
    },
    expense: {
      textColor: 'text-rose-400',
      glowColor: 'bg-rose-500/20',
      borderColor: 'border-rose-500/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12"/><path d="m7 13 5 5 5-5"/></svg>
      ),
    },
    balance: {
      textColor: 'text-violet-400', 
      glowColor: 'bg-violet-500/20',
      borderColor: 'border-violet-500/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7V5"/><path d="M5 8V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v1"/><path d="M17 16v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h1"/><path d="M21 10v4a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2Z"/></svg>
      ),
    },
  };

  const current = config[type];

  return (
    <div className={`
      relative overflow-hidden group
      bg-slate-900/50 backdrop-blur-xl 
      border ${current.borderColor} 
      p-7 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:-translate-y-1
    `}>
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${current.glowColor}`} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">
            {title}
          </span>
          <div className="h-0.5 w-6 bg-slate-800 rounded-full group-hover:w-10 transition-all duration-500" />
        </div>
        <div className={`p-2.5 rounded-2xl bg-slate-950/50 border border-slate-800/50 ${current.textColor} shadow-inner`}>
          {current.icon}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-black tracking-tighter italic ${current.textColor}`}>
            {amount.toLocaleString('sr-RS')}
          </span>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">RSD</span>
        </div>
        
        <div className="mt-6 flex items-center gap-2">
            <div className="h-1 flex-1 bg-slate-800/50 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${current.textColor.replace('text', 'bg')} opacity-60`} 
                    style={{ width: '65%' }} 
                />
            </div>
            <span className="text-[8px] font-black text-slate-700 uppercase italic">Live Data</span>
        </div>
      </div>
    </div>
  );
}