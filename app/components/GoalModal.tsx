'use client';

import { useState } from 'react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

export function GoalModal({ isOpen, onClose, userId, onSuccess }: GoalModalProps) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await fetch('/api/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            targetAmount: parseFloat(target), 
            currentAmount: parseFloat(current || '0'), 
            userId: userId 
          }),
        });

        if (res.ok) {
          setName('');
          setTarget('');
          setCurrent('');
          onSuccess(); // Ovo će na Dashboardu pokrenuti loadAllData
          onClose();
        }
      } catch (error) {
        console.error("Greška pri čuvanju cilja", error);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
        
        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter mb-6">Novi Cilj Štednje</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Šta štediš?</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="npr. Putovanje u Pariz"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white placeholder:text-slate-700 focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cilj (RSD)</label>
              <input 
                required
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="50000"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Već imaš</label>
              <input 
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              Odustani
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
            >
              {loading ? 'Čuvanje...' : 'Sačuvaj Cilj'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}