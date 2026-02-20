'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { StatsCard } from "../components/statsCard";
import { TransactionTable } from "../components/transactionTable";
import { TransactionModal } from "../components/transactionModal";
import { Navbar } from "../components/navbar";
import { CategoryModal } from "../components/categoryModal"; 
import { BudgetCharts } from "../components/charts";
import { QuickActions } from "../components/quickActions"; 
import { ConfirmModal } from "../components/confirmModal"; 
import { getExchangeRate } from '@/lib/exchangeApi';

const DEMO_DATA = {
  expenses: [
    { id: 'd1', description: 'Mesečna kirija - Stan', amount: 450, createdAt: new Date().toISOString(), category: { name: 'Stanovanje', icon: '🏠' }, type: 'EXPENSE' },
    { id: 'd2', description: 'Maxi - Nedeljna nabavka', amount: 5500, createdAt: new Date().toISOString(), category: { name: 'Hrana', icon: '🍔' }, type: 'EXPENSE' },
    { id: 'd3', description: 'Mesečna karta BusPlus', amount: 3000, createdAt: new Date(Date.now() - 86400000).toISOString(), category: { name: 'Prevoz', icon: '🚌' }, type: 'EXPENSE' },
    { id: 'd4', description: 'Netflix pretplata', amount: 1200, createdAt: new Date(Date.now() - 172800000).toISOString(), category: { name: 'Zabava', icon: '🎭' }, type: 'EXPENSE' }
  ],
  incomes: [
    { id: 'i1', description: 'Plata - Januar', amount: 120000, createdAt: new Date().toISOString(), category: { name: 'Posao', icon: '💵' }, type: 'INCOME' },
    { id: 'i2', description: 'Bonus za projekat', amount: 15000, createdAt: new Date(Date.now() - 432000000).toISOString(), category: { name: 'Honorara', icon: '💰' }, type: 'INCOME' }
  ],
  categories: [
    { id: 'c1', name: 'Hrana', type: 'EXPENSE', icon: '🍔' },
    { id: 'c2', name: 'Stanovanje', type: 'EXPENSE', icon: '🏠' },
    { id: 'c3', name: 'Prevoz', type: 'EXPENSE', icon: '🚌' },
    { id: 'c4', name: 'Zabava', type: 'EXPENSE', icon: '🎭' },
    { id: 'c5', name: 'Posao', type: 'INCOME', icon: '💵' },
    { id: 'c6', name: 'Honorara', type: 'INCOME', icon: '💰' }
  ]
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('USER'); 
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', message: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', type: 'EXPENSE' as 'INCOME' | 'EXPENSE' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false); 
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [formData, setFormData] = useState({ description: '', amount: '', categoryId: '' });

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole'); 
    
    if (!userId) {
      setCurrentUserId(null);
      setUserName('Gost');
      setUserRole('GUEST'); 
      setExpenses(DEMO_DATA.expenses);
      setIncomes(DEMO_DATA.incomes);
      setCategories(DEMO_DATA.categories);
      setLoading(false);
    } else {
      setCurrentUserId(userId);
      setUserName(storedName || 'Korisnik');
      setUserRole(storedRole || 'USER');
      loadAllData(userId, storedRole || 'USER');
    }
  }, [router]);

  const loadAllData = async (userId: string, role: string) => {
    try {
      const rate = await getExchangeRate("EUR");
      setExchangeRate(rate);

      const [resExp, resInc, resCat] = await Promise.all([
        fetch(`/api/expenses?userId=${userId}`),
        fetch(`/api/incomes?userId=${userId}`),
        fetch(`/api/categories?userId=${userId}`) 
      ]);
      
      if (resExp.ok) setExpenses(await resExp.json());
      if (resInc.ok) setIncomes(await resInc.json());
      if (resCat.ok) setCategories(await resCat.json());

      if (role === 'ADMIN') {
        const resUsers = await fetch('/api/user');
        if (resUsers.ok) setUsers(await resUsers.json());
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const allTransactions = useMemo(() => {
    return [
      ...(incomes || []).map((i: any) => ({ ...i, type: 'INCOME' })),
      ...(expenses || []).map((e: any) => ({ ...e, type: 'EXPENSE' }))
    ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [incomes, expenses]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const matchesSearch = 
        (t.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (t.category?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'ALL' || t.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [allTransactions, searchTerm, activeTab]);

  const totalIncome = incomes.reduce((s, i: any) => s + (Number(i.amount) || 0), 0);
  const totalExpense = expenses.reduce((s, e: any) => s + (Number(e.amount) || 0), 0);

  // BRISANJE TRANSAKCIJE 
  const handleDeleteTransaction = (id: string, type: 'INCOME' | 'EXPENSE') => {
    if (userRole === 'GUEST') return;

    setModalConfig({
      isOpen: true,
      title: 'Ukloniti stavku?',
      message: 'Ova akcija će trajno obrisati transakciju iz baze podataka.',
      onConfirm: async () => {
        const endpoint = type === 'INCOME' ? `/api/incomes?id=${id}` : `/api/expenses?id=${id}`;
        const res = await fetch(endpoint, { method: 'DELETE' });
        if (res.ok) {
          if (type === 'INCOME') setIncomes(prev => prev.filter(i => i.id !== id));
          else setExpenses(prev => prev.filter(e => e.id !== id));
        }
      }
    });
  };

  // BRISANJE KATEGORIJE
  const deleteCategory = async (id: string) => {
    if (userRole === 'GUEST') return;

    setModalConfig({
      isOpen: true,
      title: 'Brisanje kategorije',
      message: 'Da li ste sigurni? Brisanje kategorije nije moguće ako u njoj postoje troškovi ili prihodi.',
      onConfirm: async () => {
        const userId = localStorage.getItem('userId');
        try {
          const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (res.ok) {
            const resCat = await fetch(`/api/categories?userId=${userId}`);
            if (resCat.ok) setCategories(await resCat.json());
          } else {
            setModalConfig({
              isOpen: true,
              title: 'Sistemska greška!',
              message: data.error || "Došlo je do greške pri brisanju."
            });
          }
        } catch (err) { console.error("Greška:", err); }
      }
    });
  };

  // BRISANJE KORISNIKA 
  const handleDeleteUser = (user: any) => {
    setModalConfig({
      isOpen: true,
      title: 'Brisanje naloga',
      message: `Svi podaci povezani sa korisnikom ${user.name} biće trajno izbrisani.`,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const res = await fetch(`/api/user?id=${user.id}`, { method: 'DELETE' });
          if (res.ok) {
            setUsers(prev => prev.filter(u => u.id !== user.id));
          }
        } catch (err) { console.error(err); } finally { setIsDeleting(false); }
      }
    });
  };
const handleStartEditTransaction = (t: any) => {
  if (userRole === 'GUEST') return;
  
  // 1. Postavi mod (INCOME/EXPENSE)
  setModalMode(t.type); 
  
  // 2. Popuni formu podacima iz baze
  setFormData({
    description: t.description || '',
    amount: t.amount?.toString() || '',
    // Proveravamo oba mesta gde ID kategorije može biti sakriven
    categoryId: (t.categoryId || t.category?.id || '').toString()
  });

  // 3. Postavi ID koji kaže "Ovo je edit, a ne novi unos"
  setEditingTransactionId(t.id);
  setIsModalOpen(true);
};
const handleSaveTransaction = async (e: React.FormEvent) => {
  if (userRole === 'GUEST') return;
  e.preventDefault();
  
  const userId = localStorage.getItem('userId');
  const isEditing = Boolean(editingTransactionId); // Provera da li editujemo

  const method = isEditing ? 'PATCH' : 'POST';
  
  // Endpoint mora imati ID u URL-u ako je PATCH
  const baseUrl = modalMode === 'INCOME' ? '/api/incomes' : '/api/expenses';
  const endpoint = isEditing ? `${baseUrl}?id=${editingTransactionId}` : baseUrl;

  try {
    const res = await fetch(endpoint, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        description: formData.description,
        amount: parseFloat(formData.amount), // Mora biti Float/Number
        categoryId: parseInt(formData.categoryId), // Mora biti Int/Number
        userId: userId ? parseInt(userId) : null
      })
    });

    if (res.ok) {
      // Uspeh - zatvori i očisti
      setIsModalOpen(false);
      setEditingTransactionId(null);
      setFormData({ description: '', amount: '', categoryId: '' });
      if (userId) loadAllData(userId, userRole);
    } else {
      const errorMsg = await res.text();
      console.error("Server Error:", errorMsg);
      alert("Greška sa servera: " + errorMsg);
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  }
};

  const updateUserRole = async (userId: number, newRole: string) => {
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newRole })
    });
    if (res.ok) {
      const resUsers = await fetch('/api/user');
      if (resUsers.ok) setUsers(await resUsers.json());
    }
  };

  const handleStartEditCategory = (cat: any) => {
    if (userRole === 'GUEST') return;
    setNewCategory({ name: cat.name, type: cat.type });
    setEditingCategoryId(cat.id);
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    if (userRole === 'GUEST') return;
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    
    // Ako imamo editingCategoryId, koristimo PATCH, inače POST
    const method = editingCategoryId ? 'PATCH' : 'POST';
    const endpoint = editingCategoryId 
      ? `/api/categories?id=${editingCategoryId}` 
      : '/api/categories';

    const res = await fetch(endpoint, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCategory, userId })
    });

    if (res.ok) {
      setIsCatModalOpen(false);
      setEditingCategoryId(null); // Ovo je ključno da se resetuje!
      setNewCategory({ name: '', type: 'EXPENSE' });
      
      // Osvežavanje liste
      const resCat = await fetch(`/api/categories?userId=${userId}`);
      if (resCat.ok) setCategories(await resCat.json());
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#02040a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500/10 border-t-violet-500 rounded-full animate-spin"></div>
        <p className="text-violet-500 font-black uppercase italic tracking-[0.3em] animate-pulse">Učitavanje...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 selection:bg-violet-500/30 font-sans">
      <Navbar userName={userName} userRole={userRole} />

      <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 relative pb-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          <StatsCard title="Prihod" amount={totalIncome} type="income" />
          <StatsCard title="Trošak" amount={totalExpense} type="expense" />
          <StatsCard title="Bilans" amount={totalIncome - totalExpense} type="balance" />

    <div className="bg-slate-900/40 border border-violet-500/20 p-6 rounded-[2rem] backdrop-blur-md shadow-2xl hover:border-violet-500/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <span className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20 text-violet-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M15 9H9"/><path d="M15 15H9"/></svg>
        </span>
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">External API</span>
      </div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-1">Vrednost u EUR</h3>
      <p className="text-2xl font-black text-white italic">
        {exchangeRate ? ((totalIncome - totalExpense) * exchangeRate).toFixed(2) : "0.00"} €
      </p>
      <p className="text-[9px] text-violet-500/60 font-bold mt-2 truncate">
        Kurs: 1 RSD = {exchangeRate?.toFixed(5)} EUR
      </p>
    </div>
        </div>

        {userRole === 'ADMIN' && users.length > 0 && (
          <section className="bg-slate-900/40 border border-slate-800/50 p-8 md:p-10 rounded-[3rem] relative shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-4 mb-10">
              <span className="p-2 bg-violet-500/10 rounded-xl border border-violet-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Panel za admine</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.filter(u => String(u.id) !== currentUserId).map((u: any) => (
                <div key={u.id} className="bg-slate-950/50 p-6 rounded-[2.5rem] border border-slate-800/80 group hover:border-violet-500/40 transition-all duration-500 shadow-inner">
                  <div className="flex justify-between items-start mb-6">
                    <div className="pr-4">
                      <p className="text-md font-black uppercase italic tracking-tight text-white leading-tight">{u.name}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">{u.email}</p>
                    </div>
                    <button onClick={() => handleDeleteUser(u)} className="p-2.5 bg-violet-500/5 rounded-xl text-violet-500 hover:bg-violet-500 hover:text-white transition-all duration-300 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)] active:scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                  <div className="flex gap-4 border-y border-slate-800/50 py-4 mb-6">
                    <div className="flex-1"><p className="text-[8px] text-slate-500 uppercase font-black mb-1 text-rose-500">Rashodi</p><p className="text-sm font-bold text-white/80">{u._count?.expenses || 0}</p></div>
                    <div className="flex-1 border-l border-slate-800/50 pl-4"><p className="text-[8px] text-slate-500 uppercase font-black mb-1 text-emerald-500">Prihodi</p><p className="text-sm font-bold text-white/80">{u._count?.incomes || 0}</p></div>
                  </div>
                  <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
                    {['USER', 'ADMIN'].map((r) => (
                      <button key={r} onClick={() => updateUserRole(u.id, r)} className={`flex-1 text-[9px] font-black py-2.5 rounded-xl transition-all duration-300 ${u.role === r ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>{r}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="relative z-10">
          <BudgetCharts transactions={allTransactions} />
        </section>

        <section className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/60 rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
          <div className="p-8 md:p-10 border-b border-slate-800/50 space-y-8 bg-slate-900/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Istorija transakcija</h2>
                <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] font-black text-violet-400 uppercase tracking-widest">{filteredTransactions.length} unosa</div>
              </div>
              {userRole !== 'GUEST' && (
                <div className="flex gap-4 w-full sm:w-auto">
                  <button onClick={() => { setModalMode('INCOME'); setIsModalOpen(true); }} className="flex-1 sm:flex-none bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-500 text-emerald-500 hover:text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.05)]"> + Prihod </button>
                  <button onClick={() => { setModalMode('EXPENSE'); setIsModalOpen(true); }} className="flex-1 sm:flex-none bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-500 hover:text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(244,63,94,0.05)]"> + Trošak</button>
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center pt-2">
               <div className="relative w-full lg:max-w-xs group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                 </div>
                 <input type="text" placeholder="Traži..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-950/40 border border-slate-800/80 text-xs pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-violet-500/50 transition-all font-bold" />
               </div>
               <div className="flex p-1 bg-slate-950/60 rounded-2xl border border-slate-800/80 w-full lg:w-auto">
                 {(['ALL', 'INCOME', 'EXPENSE'] as const).map((tab) => (
                   <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-800 text-violet-400' : 'text-slate-600 hover:text-slate-400'}`}>
                     {tab === 'ALL' ? 'Sve' : tab === 'INCOME' ? 'Priliv' : 'Odliv'}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <div className="p-4 md:p-8">
            <TransactionTable 
              transactions={filteredTransactions} 
              onDelete={userRole !== 'GUEST' ? handleDeleteTransaction : undefined}
              onEdit={userRole !== 'GUEST' ? handleStartEditTransaction : undefined} 
            />
          </div>
        </section>

        <section className="bg-slate-900/10 border border-slate-800/40 p-10 rounded-[3rem]">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-600">📂 Upravljanje kategorijama</h2>
            {userRole !== 'GUEST' && (
              <button onClick={() => setIsCatModalOpen(true)} className="text-violet-400 hover:text-violet-300 text-[10px] font-black uppercase tracking-widest transition-all"> + Nova Kategorija </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
      {categories.map((cat: any) => (
        <div key={cat.id} className="flex items-center gap-3 bg-slate-900/50 border border-slate-800/50 px-5 py-3 rounded-2xl group hover:border-violet-500/30 transition-all">
          {/* Tačkica za tip */}
          <div className={`w-1 h-1 rounded-full ${cat.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          
          {/* Naziv kategorije */}
          <span className="text-xs font-bold text-slate-300 group-hover:text-white">{cat.name}</span>
          
          {userRole !== 'GUEST' && (
            <div className="flex gap-2 ml-1">
              {/* DUGME ZA IZMENU (Olovka) - Vidljivo samo na hover */}
              <button 
                onClick={() => handleStartEditCategory(cat)} 
                className="text-slate-500 hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </button>

              {/* DUGME ZA BRISANJE (X)*/}
              <button 
                onClick={() => deleteCategory(cat.id)} 
                className="text-slate-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          )}
        </div>
      ))}
          </div>
        </section>
      </main>

      {userRole !== 'GUEST' && (
        <QuickActions 
          onAddIncome={() => { setModalMode('INCOME'); setIsModalOpen(true); }} 
          onAddExpense={() => { setModalMode('EXPENSE'); setIsModalOpen(true); }} 
          onAddCategory={() => setIsCatModalOpen(true)} 
        />
      )}

      {/* MODALI */}
      <CategoryModal
        isOpen={isCatModalOpen}
        isEditing={Boolean(editingCategoryId)} // DODAJ OVU LINIJU
        onClose={() => {
          setIsCatModalOpen(false);
          setEditingCategoryId(null); // Resetuj ID kad zatvoriš
        }}
        onSave={handleSaveCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
      />
      <TransactionModal 
        isOpen={isModalOpen} 
        mode={modalMode} 
        formData={formData} 
        setFormData={setFormData} 
        onSave={handleSaveTransaction} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransactionId(null);
          setFormData({ description: '', amount: '', categoryId: '' });
        }} 
        categories={categories} 
      />
      
      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
}