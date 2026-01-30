'use client';
import { useState } from 'react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, type: 'EXPENSE' | 'INCOME') => void;
}

// VAŽNO: Ova linija "export function" mora da postoji!
export function CategoryModal({ isOpen, onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-black">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-black mb-6 italic text-purple-900 uppercase tracking-tighter">Nova Kategorija</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Naziv kategorije</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 outline-none transition"
              placeholder="npr. Teretana, Putovanja..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tip</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as 'EXPENSE' | 'INCOME')}
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 outline-none transition"
            >
              <option value="EXPENSE">Trošak (Expense)</option>
              <option value="INCOME">Prihod (Income)</option>
            </select>
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Otkaži
            </button>
            <button 
              type="button"
              onClick={() => { 
                if(!name) return alert("Unesite ime!");
                onSave(name, type); 
                setName(''); 
                onClose(); 
              }}
              className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition"
            >
              Sačuvaj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}