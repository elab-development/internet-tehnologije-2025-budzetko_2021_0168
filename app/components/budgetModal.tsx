'use client';

import { useState, useEffect } from 'react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { categoryId: string; limit: number }) => void;
  categories: any[];
}

export function BudgetModal({ isOpen, onClose, onSave, categories }: BudgetModalProps) {
  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');

  // Filtriramo samo kategorije troškova
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-white mb-6">Postavi Limit Budžeta</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Kategorija</label>
            <select 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-violet-500 transition-all font-bold text-sm"
            >
              <option value="">Izaberi kategoriju...</option>
              <option value="TOTAL" className="font-black text-violet-400">--- UKUPAN MESEČNI LIMIT ---</option>
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Mesečni Limit (RSD)</label>
            <input 
              type="number" 
              value={limit} 
              onChange={(e) => setLimit(e.target.value)}
              placeholder="Npr. 5000"
              className="w-full bg-slate-950 border border-slate-800 text-white p-4 rounded-2xl focus:outline-none focus:border-violet-500 transition-all font-bold text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-800 transition-all">
              Odustani
            </button>
            <button 
              onClick={() => {
                if(categoryId && limit) {
                  onSave({ categoryId, limit: parseFloat(limit) });
                  setCategoryId('');
                  setLimit('');
                }
              }}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-violet-500/20"
            >
              Sačuvaj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}