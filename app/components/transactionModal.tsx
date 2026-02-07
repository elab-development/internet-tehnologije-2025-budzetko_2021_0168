'use client';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'INCOME' | 'EXPENSE';
  formData: any;
  setFormData: (data: any) => void;
  onSave: (e: React.FormEvent) => void;
  categories: any[];
}

export function TransactionModal({ isOpen, onClose, mode, formData, setFormData, onSave, categories }: Props) {
  if (!isOpen) return null;
  const isIncome = mode === 'INCOME';
  const focusStyles = isIncome 
    ? 'focus:border-emerald-500/50 focus:ring-emerald-500/20' 
    : 'focus:border-rose-500/50 focus:ring-rose-500/20';
  const accentColor = isIncome ? 'violet-500' : 'rose-500';
  const accentEmerald = 'emerald-500';
  const activeColor = isIncome ? accentEmerald : 'rose-500';

  const inputClass = `
    w-full bg-slate-950 border border-slate-800/60 
    text-slate-100 text-sm px-6 py-4 rounded-[1.25rem] 
    focus:outline-none transition-all duration-300 placeholder:text-slate-700 font-medium
    focus:ring-1 ${focusStyles}
  `;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#02040a]/80 backdrop-blur-xl animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800/50 rounded-[3rem]
       shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 ${isIncome ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        
        <div className="p-8 md:p-12 relative z-10">
          <header className="mb-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isIncome ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'}`} />
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                  Novi {isIncome ? 'Prihod' : 'Trošak'}
                </h2>
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Unesite podatke za novu
              </p>
            </div>
            <button 
                onClick={onClose}
                className="p-2 text-slate-600 hover:text-white transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
                strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </header>

          <form onSubmit={onSave} className="space-y-8">
            {/* Opis */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-2 group-focus-within:text-violet-400 transition-colors">Detalji transakcije</label>
              <input 
                className={inputClass}
                placeholder="npr. Isplata projekta, Weekly groceries..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Iznos */}
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-2 group-focus-within:text-violet-400 transition-colors">Iznos (RSD)</label>
                  <div className="relative">
                    <input 
                        type="number"
                        className={`${inputClass} pr-14 font-mono text-lg`}
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        required
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700">RSD</span>
                  </div>
                </div>

                {/* Kategorija */}
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-2 group-focus-within:text-violet-400 transition-colors">Kategorizacija</label>
                  <div className="relative">
                    <select 
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        required
                    >
                        <option value="" className="bg-slate-900">Izaberi...</option>
                        {categories.filter(c => c.type === mode).map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-slate-900 text-slate-100">
                            {cat.name}
                        </option>
                        ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
            </div>

            {/* Dugmad */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 bg-slate-800/40 hover:bg-slate-800 text-slate-400 font-black py-5 rounded-[1.5rem] transition-all uppercase text-[10px] tracking-[0.2em] border border-slate-800/50"
                >
                  Poništi
                </button>
                
                <button 
                  type="submit" 
                  className="flex-[2] bg-violet-600 hover:bg-violet-500 text-white font-black py-5 rounded-[1.5rem] transition-all uppercase text-[10px] tracking-[0.2em] shadow-[0_0_25px_rgba(139,92,246,0.3)] active:scale-95"
                >
                  Sačuvaj {isIncome ? 'Prihod' : 'Trošak'}
                </button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}