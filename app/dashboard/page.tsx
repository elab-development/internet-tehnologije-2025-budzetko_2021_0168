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

// --- LAŽNI PODACI ZA GOSTA (Frontend samo) ---
const DEMO_DATA = {
  expenses: [
    { id: 'd1', description: 'Primer: Stanarina', amount: 35000, createdAt: new Date().toISOString(), category: { name: 'Stanovanje' }, type: 'EXPENSE' },
    { id: 'd2', description: 'Primer: Namirnice', amount: 4500, createdAt: new Date().toISOString(), category: { name: 'Hrana' }, type: 'EXPENSE' }
  ],
  incomes: [
    { id: 'i1', description: 'Primer: Plata', amount: 95000, createdAt: new Date().toISOString(), category: { name: 'Posao' }, type: 'INCOME' }
  ],
  categories: [
    { id: 'c1', name: 'Hrana', type: 'EXPENSE' },
    { id: 'c2', name: 'Stanovanje', type: 'EXPENSE' },
    { id: 'c3', name: 'Posao', type: 'INCOME' }
  ]
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('USER'); 
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, type: 'INCOME' | 'EXPENSE' } | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      // GOST REŽIM - Ne šalje ništa bazi
      setCurrentUserId(null);
      setUserName('Gost');
      setUserRole('GUEST'); 
      setExpenses(DEMO_DATA.expenses);
      setIncomes(DEMO_DATA.incomes);
      setCategories(DEMO_DATA.categories);
      setLoading(false);
    } else {
      // REGISTROVAN KORISNIK - Čitamo iz baze
      setCurrentUserId(userId);
      setUserName(storedName || 'Korisnik');
      setUserRole(storedRole || 'USER');
      loadAllData(userId, storedRole || 'USER');
    }
  }, [router]);

  const loadAllData = async (userId: string, role: string) => {
    try {
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

  const updateUserRole = async (userId: number, newRole: string) => {
    // Ovde sada dolaze samo 'USER' ili 'ADMIN'
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

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/user?id=${userToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        setUserToDelete(null);
      }
    } catch (err) { console.error(err); } finally { setIsDeleting(false); }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    if (userRole === 'GUEST') return;
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCategory, userId })
    });
    if (res.ok) {
      setIsCatModalOpen(false);
      setNewCategory({ name: '', type: 'EXPENSE' });
      const resCat = await fetch(`/api/categories?userId=${userId}`);
      if (resCat.ok) setCategories(await resCat.json());
    }
  };

const deleteCategory = async (id: string) => {
    // 1. Provera uloge (Gost ne može da briše)
    if (userRole === 'GUEST') return;

    // 2. Potvrda od strane korisnika
    if (!confirm("Da li ste sigurni? Brisanje kategorije nije moguće ako u njoj postoje troškovi ili prihodi.")) return;

    const userId = localStorage.getItem('userId');
    
    try {
      // 3. Slanje DELETE zahteva
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      
      // 4. Preuzimanje odgovora sa servera (bilo da je uspeh ili greška)
      const data = await res.json();

      if (res.ok) {
        // Ako je brisanje uspelo, osveži listu kategorija
        const resCat = await fetch(`/api/categories?userId=${userId}`);
        if (resCat.ok) setCategories(await resCat.json());
      } else {
        // 5. OVDE JE REŠENJE: Prikazujemo poruku koju je poslao API (npr. greška P2003)
        alert(data.error || "Došlo je do greške pri brisanju.");
      }
    } catch (err) {
      console.error("Greška:", err);
      alert("Serverska greška. Proverite internet konekciju.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm || userRole === 'GUEST') return;
    setIsDeleting(true);
    const { id, type } = deleteConfirm;
    const endpoint = type === 'INCOME' ? `/api/incomes?id=${id}` : `/api/expenses?id=${id}`;
    const res = await fetch(endpoint, { method: 'DELETE' });
    if (res.ok) {
      if (type === 'INCOME') setIncomes(prev => prev.filter(i => i.id !== id));
      else setExpenses(prev => prev.filter(e => e.id !== id));
      setDeleteConfirm(null);
    }
    setIsDeleting(false);
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    if (userRole === 'GUEST') return;
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

  const filteredTransactions = allTransactions.filter(t => 
    (t.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const totalIncome = incomes.reduce((s, i: any) => s + (Number(i.amount) || 0), 0);
  const totalExpense = expenses.reduce((s, e: any) => s + (Number(e.amount) || 0), 0);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-blue-500 font-black animate-pulse uppercase italic">Sistem se učitava...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      <Navbar userName={userName} userRole={userRole} />

      <main className="p-8 max-w-6xl mx-auto space-y-12 relative pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Prihod" amount={totalIncome} type="income" />
          <StatsCard title="Trošak" amount={totalExpense} type="expense" />
          <StatsCard title="Bilans" amount={totalIncome - totalExpense} type="balance" />
        </div>

        {userRole === 'ADMIN' && users.length > 0 && (
          <section className="bg-blue-500/5 border border-blue-500/20 p-10 rounded-[3rem] relative shadow-2xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-10 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" /> 
              Upravljanje Korisnicima
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.filter(u => String(u.id) !== currentUserId).map((u: any) => (
                <div key={u.id} className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800/50 relative group hover:border-blue-500/30 transition-all duration-500">
                  <button onClick={() => setUserToDelete(u)} className="absolute top-6 right-6 text-slate-700 hover:text-rose-500 transition-all scale-100 hover:scale-125">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                  <div className="mb-6">
                    <p className="text-lg font-black uppercase italic tracking-tight text-slate-100">{u.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{u.email}</p>
                  </div>
                  <div className="flex gap-6 border-y border-slate-800/30 py-4 mb-6">
                    <div className="flex-1">
                      <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Troškovi</p>
                      <p className="text-sm font-bold text-rose-500">{u._count?.expenses || 0}</p>
                    </div>
                    <div className="flex-1 border-l border-slate-800/30 pl-6">
                      <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Prihodi</p>
                      <p className="text-sm font-bold text-emerald-500">{u._count?.incomes || 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* FIKS: Samo USER i ADMIN opcije ovde */}
                    {['USER', 'ADMIN'].map((r) => (
                      <button 
                        key={r} 
                        onClick={() => updateUserRole(u.id, r)} 
                        className={`flex-1 text-[9px] font-black py-3 rounded-xl transition-all duration-300 ${u.role === r ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section><BudgetCharts transactions={allTransactions} /></section>

        <section className="bg-slate-900/80 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Istorija</h2>
                {userRole === 'GUEST' && (
                    <span className="text-[10px] bg-slate-800 text-slate-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Samo za čitanje</span>
                )}
            </div>
            {userRole !== 'GUEST' && (
              <div className="flex gap-3">
                <button onClick={() => { setModalMode('INCOME'); setIsModalOpen(true); }} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all shadow-lg shadow-emerald-500/20"> + Prihod</button>
                <button onClick={() => { setModalMode('EXPENSE'); setIsModalOpen(true); }} className="bg-rose-500 hover:bg-rose-400 text-slate-950 px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all shadow-lg shadow-rose-500/20"> + Trošak</button>
              </div>
            )}
          </div>
          <div className="p-6">
            <TransactionTable 
                transactions={filteredTransactions} 
                onDelete={userRole !== 'GUEST' ? (id, type) => setDeleteConfirm({ id, type }) : undefined} 
            />
          </div>
        </section>

        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative z-10">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 font-bold">📂 Kategorije</h2>
             {userRole !== 'GUEST' && (
               <button onClick={() => setIsCatModalOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-700">
                + Dodaj novu
               </button>
             )}
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat: any) => (
              <div key={cat.id} className="flex items-center gap-3 bg-slate-950 border border-slate-800/50 px-4 py-2.5 rounded-2xl group hover:border-blue-500/30 transition shadow-sm">
                <span className="text-sm font-bold text-slate-300">{cat.name}</span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${cat.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{cat.type}</span>
                {cat.userId && userRole !== 'GUEST' && (
                  <button onClick={() => deleteCategory(cat.id)} className="text-slate-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all ml-1">✕</button>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* MODALI I AKCIJE */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3rem] max-w-sm w-full text-center">
            <h3 className="text-xl font-black uppercase italic mb-6">Brisanje stavke?</h3>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-black text-[10px] uppercase transition-all">Nazad</button>
              <button onClick={handleConfirmDelete} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase transition-all shadow-lg shadow-rose-600/20">Obriši</button>
            </div>
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4">
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] max-w-md w-full text-center shadow-2xl">
            <h3 className="text-2xl font-black uppercase italic mb-4">OBRISATI KORISNIKA?</h3>
            <div className="bg-slate-950/50 p-4 rounded-2xl mb-8 border border-slate-800 text-blue-400 font-black italic">
                {userToDelete.name}
            </div>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-10 leading-relaxed px-6">
                Brisanjem naloga brišu se SVI njegovi prihodi i troškovi trajno.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setUserToDelete(null)} className="flex-1 py-5 bg-slate-800 rounded-3xl font-black text-[10px] uppercase transition-all">Poništi</button>
              <button onClick={handleConfirmDeleteUser} disabled={isDeleting} className="flex-1 py-5 bg-rose-600 text-white rounded-3xl font-black text-[10px] uppercase transition-all shadow-xl shadow-rose-600/30">
                {isDeleting ? 'BRISANJE...' : 'POTVRDI BRISANJE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {userRole !== 'GUEST' && (
        <QuickActions onAddIncome={() => { setModalMode('INCOME'); setIsModalOpen(true); }} onAddExpense={() => { setModalMode('EXPENSE'); setIsModalOpen(true); }} onAddCategory={() => setIsCatModalOpen(true)} />
      )}

      <CategoryModal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} onSave={handleAddCategory} newCategory={newCategory} setNewCategory={setNewCategory} />
      <TransactionModal isOpen={isModalOpen} mode={modalMode} formData={formData} setFormData={setFormData} onSave={handleSaveTransaction} onClose={() => setIsModalOpen(false)} categories={categories} />
    </div>
  );
}