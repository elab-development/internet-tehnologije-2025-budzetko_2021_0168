'use client';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  newCategory: { name: string; type: 'INCOME' | 'EXPENSE' } | undefined | null;
  setNewCategory: (data: any) => void;
}

export function CategoryModal({ isOpen, onClose, onSave, newCategory, setNewCategory }: Props) {

  if (!isOpen || !newCategory) return null;

  const inputClass = `
    w-full bg-slate-950 border border-slate-800 
    text-slate-100 text-sm px-5 py-4 rounded-2xl 
    focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 
    transition-all placeholder:text-slate-600
    [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] 
    [&:-webkit-autofill]:-webkit-text-fill-color-white
  `;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay sa zamućenjem */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        <div className={`h-2 w-full transition-colors duration-300 ${newCategory?.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        
        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-black text-slate-100 italic uppercase tracking-tighter">
              Nova Kategorija
            </h2>
          </div>

          <form onSubmit={onSave} className="space-y-6">
            {/* Naziv */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Naziv</label>
              <input 
                className={inputClass}
                placeholder="npr. Hrana, Teretana..."
                value={newCategory?.name || ""}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                required
              />
            </div>

            {/* Tip Kategorije */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tip Kategorije</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewCategory({...newCategory, type: 'INCOME'})}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    newCategory?.type === 'INCOME' 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  Prihod
                </button>
                <button
                  type="button"
                  onClick={() => setNewCategory({...newCategory, type: 'EXPENSE'})}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    newCategory?.type === 'EXPENSE' 
                    ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  Trošak
                </button>
              </div>
            </div>

            {/* Dugmad */}
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-3.5 rounded-xl transition-all text-[10px] uppercase tracking-widest"
              >
                Nazad
              </button>
              <button 
                type="submit" 
                className="flex-1 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                Sačuvaj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}