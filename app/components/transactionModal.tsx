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

  const inputClass = `
    w-full bg-slate-950 border border-slate-800 
    text-slate-100 text-sm px-5 py-4 rounded-2xl 
    focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 
    transition-all placeholder:text-slate-600
  `;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay - Zatamnjenje pozadine sa zamućenjem */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Dekorativna linija na vrhu koja menja boju */}
        <div className={`h-2 w-full ${mode === 'INCOME' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`} />
        
        <div className="p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-100 italic uppercase tracking-tighter">
              Novi {mode === 'INCOME' ? 'Prihod' : 'Trošak'}
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
              Popunite podatke o transakciji
            </p>
          </div>

          <form onSubmit={onSave} className="space-y-6">
            {/* Opis */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Opis transakcije</label>
              <input 
                className={inputClass}
                placeholder="npr. Plata, Namirnice, Bonus..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            {/* Iznos */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Iznos (RSD)</label>
              <input 
                type="number"
                className={inputClass}
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>

            {/* Kategorija */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Kategorija</label>
              <select 
                className={`${inputClass} appearance-none`}
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                required
              >
                <option value="" className="bg-slate-900">Izaberi kategoriju</option>
                {categories.filter(c => c.type === mode).map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-slate-100">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Akcije */}
            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-4 rounded-2xl transition-all uppercase text-xs tracking-widest"
              >
                Odustani
              </button>
              <button 
                type="submit" 
                className={`flex-1 font-black py-4 rounded-2xl transition-all shadow-lg text-slate-950 uppercase text-xs tracking-widest ${
                  mode === 'INCOME' 
                    ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20' 
                    : 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/20'
                }`}
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