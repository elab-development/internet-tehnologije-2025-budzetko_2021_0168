'use client';

interface Props {
  transactions: any[];
  onDelete?: (id: string, type: 'INCOME' | 'EXPENSE') => void;
  onEdit?: (transaction: any) => void;
}

export function TransactionTable({ transactions, onDelete, onEdit }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-24 bg-slate-950/20 rounded-[2.5rem] border border-dashed border-slate-800 animate-in fade-in zoom-in duration-700">
        <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800 shadow-inner">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5c0-1.1.9-2 2-2h2"/><path d="M17 3h2c1.1 0 2 .9 2 2v2"/><path d="M21 17v2c0 1.1-.9 2-2 2h-2"/><path d="M7 21H5c-1.1 0-2-.9-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/></svg>
        </div>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] italic">Nema traženih podataka</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
        <div className="col-span-6">Detalji transakcije</div>
        <div className="col-span-3 text-center">Iznos</div>
        <div className="col-span-3 text-right">Vreme / Akcija</div>
      </div>

      <div className="space-y-2">
        {transactions.map((t) => (
          <div 
            key={`${t.type}-${t.id}`} 
            className="grid grid-cols-12 items-center bg-slate-950/30 border border-slate-800/40 p-4 md:p-5 rounded-[1.8rem] hover:border-violet-500/30 hover:bg-slate-900/40 transition-all duration-300 group relative overflow-hidden"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${t.type === 'INCOME' ? 'bg-emerald-500/50' : 'bg-rose-500/50'}`} />

            {/* Opis i Kategorija */}
            <div className="col-span-6 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[360deg] ${
                t.type === 'INCOME' 
                ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/10' 
                : 'bg-rose-500/5 text-rose-400 border border-rose-500/10'
              }`}>
                {t.type === 'INCOME' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                )}
              </div>
              <div className="truncate">
                <p className={`font-black text-sm tracking-tight ${t.description ? 'text-slate-100' : 'text-slate-600 italic'}`}>
                  {t.description || 'Bez opisa'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-800/50">
                    {t.category?.name || 'Opšte'}
                  </span>
                </div>
              </div>
            </div>

            {/* Iznos */}
            <div className="col-span-3 text-center">
              <span className={`font-black text-base tracking-tighter ${
                t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {t.type === 'INCOME' ? '+' : '-'} {Number(t.amount).toLocaleString('sr-RS')}
                <span className="text-[9px] ml-1.5 opacity-50 font-medium tracking-normal">RSD</span>
              </span>
            </div>

            {/* Datum i Delete */}
            <div className="col-span-3 text-right flex items-center justify-end gap-6">
              <div className="flex flex-col items-end group-hover:opacity-40 transition-opacity duration-300">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                  {new Date(t.createdAt).toLocaleDateString('sr-RS', { day: '2-digit', month: 'short' })}
                </span>
                <span className="text-[8px] text-slate-700 font-bold uppercase tracking-tighter">
                  {new Date(t.createdAt).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {onEdit && (
                <button 
                  onClick={() => onEdit(t)} 
                  className="text-slate-500 hover:text-violet-400 p-1 transition-all mr-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
              )}
              
              {onDelete && (
                <button 
                  onClick={() => onDelete(t.id, t.type)}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl bg-violet-600/10 text-violet-500 hover:bg-violet-600 hover:text-white border border-violet-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-4 shadow-[0_0_15px_rgba(139,92,246,0.15)] active:scale-90"
                  title="Ukloni transakciju"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}