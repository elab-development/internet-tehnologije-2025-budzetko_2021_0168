'use client';

interface StatsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

export function StatsCard({ title, amount, type }: StatsCardProps) {
  // Mapiranje boja i ikonica na osnovu tipa
  const config = {
    income: {
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-400/5',
      borderColor: 'border-emerald-400/20',
      label: '↑',
    },
    expense: {
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-400/5',
      borderColor: 'border-rose-400/20',
      label: '↓',
    },
    balance: {
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-500/5',
      borderColor: 'border-blue-500/20',
      label: 'Σ',
    },
  };

  const current = config[type];

  return (
    <div className={`
      relative overflow-hidden
      bg-slate-900 border ${current.borderColor} 
      p-6 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-[1.02]
    `}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl ${current.bgColor}`} />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          {title}
        </span>
        <span className={`text-lg font-bold ${current.textColor}`}>
          {current.label}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-black tracking-tighter ${current.textColor}`}>
          {amount.toLocaleString('sr-RS')}
        </span>
        <span className="text-sm font-bold text-slate-500">RSD</span>
      </div>
      
      <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full w-1/3 rounded-full ${current.textColor.replace('text', 'bg')}`} />
      </div>
    </div>
  );
}