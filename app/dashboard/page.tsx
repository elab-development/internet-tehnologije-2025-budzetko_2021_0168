'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatsCard } from "../components/statsCard";
import { TransactionTable } from "../components/transactionTable";
import { TransactionModal } from "../components/transactionModal";
import { Navbar } from "../components/navbar";
import { CategoryModal } from "../components/categoryModal"; 
import { BudgetCharts } from "../components/charts";
import { QuickActions } from "../components/quickActions"; 

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('USER'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [newCategory, setNewCategory] = useState({ name: '', type: 'EXPENSE' as 'INCOME' | 'EXPENSE' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false); 
  const [modalMode, setModalMode] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [formData, setFormData] = useState({ description: '', amount: '', categoryId: '' });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole'); 
    
    if (!userId) {
      router.push('/login');
    } else {
      setUserName(storedName || 'Korisnik');
      setUserRole(storedRole || 'USER');
      setLoading(false);
      loadAllData(userId, storedRole);
    }
  }, [router]);

  const loadAllData = async (userId: string, role: string | null) => {
    try {
      const [resExp, resInc, resCat] = await Promise.all([
        fetch(`/api/expenses?userId=${userId}`),
        fetch(`/api/incomes?userId=${userId}`),
        fetch(`/api/categories`)
      ]);
      
      if (resExp.ok) setExpenses(await resExp.json());
      if (resInc.ok) setIncomes(await resInc.json());
      if (resCat.ok) setCategories(await resCat.json());

      if (role === 'ADMIN') {
        const resUsers = await fetch('/api/users');
        if (resUsers.ok) setUsers(await resUsers.json());
      }
    } catch (err) {
      console.error("Greška pri učitavanju podataka:", err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });

      if (res.ok) {
        setIsCatModalOpen(false);
        setNewCategory({ name: '', type: 'EXPENSE' });
        const resCat = await fetch('/api/categories');
        if (resCat.ok) setCategories(await resCat.json());
      }
    } catch (err) {
      console.error("Greška kod kategorije:", err);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Obrisati kategoriju?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const resCat = await fetch('/api/categories');
        if (resCat.ok) setCategories(await resCat.json());
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteTransaction = async (id: string, type: 'INCOME' | 'EXPENSE') => {
    if (!confirm("Obrisati ovu transakciju?")) return;
    const endpoint = type === 'INCOME' ? `/api/incomes/${id}` : `/api/expenses/${id}`;
    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        const userId = localStorage.getItem('userId');
        if (userId) loadAllData(userId, userRole);
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const endpoint = modalMode === 'INCOME' ? '/api/incomes' : '/api/expenses';
    const finalCategoryId = formData.categoryId || categories.find(c => c.type === modalMode)?.id;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, userId, categoryId: finalCategoryId })
    });

    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ description: '', amount: '', categoryId: '' });
      if (userId) loadAllData(userId, userRole);
    }
  };

  const allTransactions = [
    ...(incomes || []).map((i: any) => ({ ...i, type: 'INCOME' })),
    ...(expenses || []).map((e: any) => ({ ...e, type: 'EXPENSE' }))
  ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filtriranje transakcija na osnovu pretrage
  const filteredTransactions = allTransactions.filter(t => 
    (t.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (t.category?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const totalIncome = (incomes || []).reduce((s, i: any) => s + (Number(i.amount) || 0), 0);
  const totalExpense = (expenses || []).reduce((s, e: any) => s + (Number(e.amount) || 0), 0);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-blue-500 font-bold tracking-tighter italic animate-pulse">
      SISTEM SE UCITAVA...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      <Navbar userName={userName} userRole={userRole} />

      <main className="p-8 max-w-6xl mx-auto space-y-12 relative pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-600/5 blur-[120px] pointer-events-none" />

        {/* ADMIN SEKCIJA */}
        {userRole === 'ADMIN' && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-700 relative z-10">
            <h2 className="text-sm font-black mb-4 text-rose-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              Admin Kontrola
            </h2>
            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/30 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <tr>
                    <th className="p-4">Korisnik</th>
                    <th className="p-4">Rola</th>
                    <th className="p-4 text-right">Upravljanje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-blue-500/5 transition">
                      <td className="p-4">
                        <span className="font-bold block text-slate-200">{u.name}</span>
                        <span className="text-xs text-slate-500 italic">{u.email}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[9px] font-black tracking-tighter ${u.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'ADMIN' && (
                          <button className="text-rose-400 hover:text-rose-300 transition text-xs font-bold uppercase tracking-tighter">Deaktiviraj</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* STATS KARTICE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <StatsCard title="Prihod" amount={totalIncome} type="income" />
          <StatsCard title="Trošak" amount={totalExpense} type="expense" />
          <StatsCard title="Bilans" amount={totalIncome - totalExpense} type="balance" />
        </div>

        {/* GRAFIKONI */}
        <section className="relative z-10">
          <BudgetCharts transactions={allTransactions} />
        </section>

        {/* UPRAVLJANJE KATEGORIJAMA */}
        {userRole !== 'GUEST' && (
          <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative z-10">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">📂 Moje Kategorije</h2>
               <button 
                onClick={() => setIsCatModalOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-700"
               >
                + Dodaj novu
               </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat: any) => (
                <div key={cat.id} className="flex items-center gap-3 bg-slate-950 border border-slate-800/50 px-4 py-2.5 rounded-2xl group hover:border-blue-500/30 transition duration-300 shadow-sm">
                  <span className="text-sm font-bold text-slate-300">{cat.name}</span>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${cat.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {cat.type === 'INCOME' ? 'PRIHOD' : 'TROŠAK'}
                  </span>
                  <button onClick={() => deleteCategory(cat.id)} className="text-slate-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all ml-1">✕</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TRANSAKCIJE TABELA SA FILTEROM */}
        <section className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
          <div className="p-10 border-b border-slate-800/50 space-y-8">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                  <h2 className="text-3xl font-black text-slate-100 tracking-tighter italic uppercase">Istorija transakcija</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold mt-1">Sve tvoje finansijske kretnje</p>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => { setModalMode('INCOME'); setIsModalOpen(true); }} 
                    className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    + Dodaj Prihod
                  </button>
                  <button 
                    onClick={() => { setModalMode('EXPENSE'); setIsModalOpen(true); }} 
                    className="flex-1 sm:flex-none bg-rose-500 hover:bg-rose-400 text-slate-950 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-rose-500/20 active:scale-95"
                  >
                    + Dodaj Trošak
                  </button>
              </div>
            </div>

            <div className="relative group max-w-xl">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input 
                type="text"
                placeholder="PRETRAŽI PO OPISU ILI KATEGORIJI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/40 border border-slate-800 text-slate-100 pl-12 pr-4 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-600 shadow-inner"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <span className="text-[9px] font-black uppercase tracking-tighter italic">Očisti ×</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <TransactionTable transactions={filteredTransactions} onDelete={handleDeleteTransaction} />
            
            {filteredTransactions.length === 0 && (
              <div className="py-20 text-center animate-in fade-in duration-500">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/30 mb-4 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">Nema rezultata za: <span className="text-blue-400">"{searchTerm}"</span></p>
              </div>
            )}
          </div>
        </section>
      </main>

      <QuickActions 
        onAddIncome={() => { setModalMode('INCOME'); setIsModalOpen(true); }}
        onAddExpense={() => { setModalMode('EXPENSE'); setIsModalOpen(true); }}
        onAddCategory={() => setIsCatModalOpen(true)}
      />

      <CategoryModal 
        isOpen={isCatModalOpen} 
        onClose={() => setIsCatModalOpen(false)} 
        onSave={handleAddCategory} 
        newCategory={newCategory}
        setNewCategory={setNewCategory}
      />
      
      <TransactionModal 
        isOpen={isModalOpen} 
        mode={modalMode} 
        formData={formData} 
        setFormData={setFormData} 
        onSave={handleSaveTransaction} 
        onClose={() => setIsModalOpen(false)} 
        categories={categories}
      />
    </div>
  );
}