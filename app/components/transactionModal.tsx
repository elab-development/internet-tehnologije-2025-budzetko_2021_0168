import { Input } from "./input";

interface ModalProps {
  isOpen: boolean;
  mode: 'INCOME' | 'EXPENSE';
  formData: any;
  setFormData: (data: any) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
  categories: any[];
}

export function TransactionModal({ isOpen, mode, formData, setFormData, onSave, onClose, categories }: ModalProps) {
  if (!isOpen) return null;

  // Filtriramo samo kategorije koje odgovaraju modu (npr. samo troškovi za trošak)
  const filteredCategories = categories.filter(c => c.type === mode);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md">
        <h2 className={`text-3xl font-black mb-6 text-center ${mode === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
          {mode === 'INCOME' ? 'Novi Prihod 💰' : 'Novi Trošak 💸'}
        </h2>
        <form onSubmit={onSave} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Kategorija</label>
            <select 
              className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none" 
              value={formData.categoryId} 
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              required
            >
              <option value="">Izaberi kategoriju...</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <Input label="Opis" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
          <Input label="Iznos" type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
          <div className="flex gap-4 pt-6">
            <button type="submit" className={`flex-1 py-4 rounded-2xl text-white font-black ${mode === 'INCOME' ? 'bg-green-600' : 'bg-red-600'}`}>SAČUVAJ</button>
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-400 font-black">NAZAD</button>
          </div>
        </form>
      </div>
    </div>
  );
}