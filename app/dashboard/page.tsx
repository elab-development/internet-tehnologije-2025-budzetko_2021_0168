'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatsCard } from "../components/statsCard";
import { TransactionTable } from "../components/transactionTable";
import { TransactionModal } from "../components/transactionModal";
import { Navbar } from "../components/navbar";
import { CategoryModal } from "../components/categoryModal"; 

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('USER'); 
  
  // Podaci
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  // Modali state
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
      console.error("Greška pri učitavanju:", err);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Da li ste sigurni?")) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setUsers(users.filter((u: any) => u.id !== id));
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Da li ste sigurni? Brisanje kategorije nije moguće ako je vezana za neku transakciju.")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const resCat = await fetch('/api/categories');
        if (resCat.ok) setCategories(await resCat.json());
      } else {
        const data = await res.json();
        alert(data.error || "Greška pri brisanju.");
      }
    } catch (err) {
      console.error("Greška:", err);
    }
  };

  const handleAddCategory = async (name: string, type: 'EXPENSE' | 'INCOME') => {
    if (!name) return alert("Ime je obavezno!");

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type })
      });

      if (res.ok) {
        const resCat = await fetch('/api/categories');
        if (resCat.ok) setCategories(await resCat.json());
        alert("Kategorija uspešno dodata!");
      } else {
        alert("Greška pri čuvanju kategorije.");
      }
    } catch (err) {
      console.error("Greška:", err);
    }
  }; 

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === 'GUEST') return alert("Gosti ne mogu da menjaju podatke!");
    
    const userId = localStorage.getItem('userId');
    const endpoint = modalMode === 'INCOME' ? '/api/incomes' : '/api/expenses';
    const finalCategoryId = formData.categoryId || categories.find(c => c.type === modalMode)?.id;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        description: formData.description,
        amount: formData.amount,
        userId,
        categoryId: finalCategoryId 
      })
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
  ].sort((a: any, b: any) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const totalIncome = (incomes || []).reduce((s, i: any) => s + (Number(i.amount) || 0), 0);
  const totalExpense = (expenses || []).reduce((s, e: any) => s + (Number(e.amount) || 0), 0);

  if (loading) return <div className="flex h-screen items-center justify-center font-black italic text-blue-900">Učitavanje...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black pb-20">
      <Navbar userName={userName} userRole={userRole} />

      <main className="p-8 max-w-6xl mx-auto">
        {userRole === 'ADMIN' && (
          <section className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-2xl font-black mb-6 text-red-600 italic uppercase">🛠️ Upravljanje Korisnicima</h2>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100">
              <table className="w-full text-left">
                <thead className="bg-red-50 text-red-700 font-bold border-b border-red-100">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Ime</th>
                    <th className="p-4">Uloga</th>
                    <th className="p-4">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {(users || []).map((u: any) => (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-red-50/30 transition">
                      <td className="p-4 font-mono text-xs text-gray-400">{u.id}</td>
                      <td className="p-4 font-bold text-gray-800">{u.name} <br/><span className="text-xs font-normal text-gray-400">{u.email}</span></td>
                      <td className="p-4 uppercase text-[10px] font-black">{u.role}</td>
                      <td className="p-4">
                        {u.role !== 'ADMIN' && (
                          <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:text-red-800 font-bold text-sm underline">
                            Obriši
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard title="Prihodi" amount={totalIncome} type="income" />
          <StatsCard title="Troškovi" amount={totalExpense} type="expense" />
          <StatsCard title="Stanje" amount={totalIncome - totalExpense} type="balance" />
        </div>

        {/* --- NOVA SEKCIJA ZA UPRAVLJANJE KATEGORIJAMA --- */}
        {userRole !== 'GUEST' && (
          <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xl font-black mb-4 text-purple-700 italic uppercase tracking-tighter">📂 Upravljanje Kategorijama</h2>
            <div className="flex flex-wrap gap-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              {categories.map((cat: any) => (
                <div 
                  key={cat.id} 
                  className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 hover:border-purple-200 transition group"
                >
                  <span className="font-bold text-gray-700 text-sm">{cat.name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cat.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.type === 'INCOME' ? 'IN' : 'OUT'}
                  </span>
                  <button 
                    onClick={() => deleteCategory(cat.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setIsCatModalOpen(true)}
                className="bg-purple-50 text-purple-700 px-4 py-2 rounded-2xl font-bold hover:bg-purple-100 transition border border-dashed border-purple-200 text-sm"
              >
                + Dodaj novu
              </button>
            </div>
          </section>
        )}

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase italic">
              {userRole === 'ADMIN' ? 'Globalni Pregled' : 'Moje Transakcije'}
            </h2>
            {userRole !== 'GUEST' && (
              <div className="flex gap-3">
                <button onClick={() => { setModalMode('INCOME'); setIsModalOpen(true); }} className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold">+ Prihod</button>
                <button onClick={() => { setModalMode('EXPENSE'); setIsModalOpen(true); }} className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold">+ Trošak</button>
              </div>
            )}
          </div>
          <TransactionTable transactions={allTransactions} onDelete={() => {}} />
        </div>
      </main>

      <CategoryModal 
        isOpen={isCatModalOpen} 
        onClose={() => setIsCatModalOpen(false)} 
        onSave={handleAddCategory} 
      />

      <TransactionModal 
        isOpen={isModalOpen} mode={modalMode} formData={formData} 
        setFormData={setFormData} onSave={handleSave} 
        onClose={() => setIsModalOpen(false)} categories={categories}
      />
    </div>
  );
}