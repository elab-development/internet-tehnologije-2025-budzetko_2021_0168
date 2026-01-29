interface StatsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

export function StatsCard({ title, amount, type }: StatsCardProps) {
  const borderColors = {
    income: 'border-green-500',
    expense: 'border-red-500',
    balance: 'border-blue-500',
  };

  const textColors = {
    income: 'text-green-600',
    expense: 'text-red-600',
    balance: amount >= 0 ? 'text-blue-600' : 'text-orange-600',
  };

  const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';

  return (
    <div className={`bg-white p-6 rounded-2xl border-l-8 ${borderColors[type]} shadow-md`}>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <h2 className={`text-2xl font-black ${textColors[type]}`}>
        {prefix}{amount.toLocaleString()} RSD
      </h2>
    </div>
  );
}