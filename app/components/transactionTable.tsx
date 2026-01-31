'use client';

interface Props {
  transactions: any[];
  onDelete: (id: string, type: 'INCOME' | 'EXPENSE') => void;
}

export function TransactionTable({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-950/50 rounded-[2rem] border border-dashed border-slate-800">
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Nema zabeleženih transakcija</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header za tabelu - suptilan */}
      <div className="grid grid-cols-4 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
        <div className="col-span-2 text-left">Opis i Kategorija</div>
        <div className="text-center">Iznos</div>
        <div className="text-right">Datum</div>
      </div>

      {/* Lista transakcija */}
      {transactions.map((t) => (
        <div 
          key={t.id} 
          className="grid grid-cols-4 items-center bg-slate-950/40 border border-slate-800/50 p-5 rounded-2xl hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300 group"
        >
          {/* Opis i Kategorija */}
          <div className="col-span-2 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
              t.type === 'INCOME' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {t.type === 'INCOME' ? '↑' : '↓'}
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">{t.description}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                {t.category?.name || 'Ostalo'}
              </p>
            </div>
          </div>

          {/* Iznos */}
          <div className="text-center">
            <span className={`font-black text-sm tracking-tighter ${
              t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {t.type === 'INCOME' ? '+' : '-'} {Number(t.amount).toLocaleString()} <span className="text-[10px] ml-0.5">RSD</span>
            </span>
          </div>

          {/* Datum i Delete */}
          <div className="text-right flex items-center justify-end gap-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              {new Date(t.createdAt).toLocaleDateString('sr-RS', { day: '2-digit', month: 'short' })}
            </span>
            <button 
              onClick={() => onDelete(t.id, t.type)}
              className="text-slate-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}