'use client';

interface QuickActionsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onAddCategory: () => void;
}

export function QuickActions({ onAddIncome, onAddExpense, onAddCategory }: QuickActionsProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/50 p-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2">
        
        {/* DODAJ PRIHOD */}
        <button 
          onClick={onAddIncome}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl transition-all group"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Prihod</span>
        </button>

        <div className="w-[1px] h-6 bg-slate-800 mx-1" />

        {/* DODAJ TROŠAK */}
        <button 
          onClick={onAddExpense}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl transition-all group"
        >
          <div className="w-6 h-6 rounded-lg bg-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Trošak</span>
        </button>

        <div className="w-[1px] h-6 bg-slate-800 mx-1" />

        {/* NOVA KATEGORIJA */}
        <button 
          onClick={onAddCategory}
          className="p-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-2xl transition-all group"
          title="Nova Kategorija"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M12 10v6"/><path d="M9 13h6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}