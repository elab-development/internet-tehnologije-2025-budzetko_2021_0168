'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "../components/button";
import { StatsCard } from "../components/statsCard";
import { TransactionTable } from "../components/transactionTable";
import { TransactionModal } from "../components/transactionModal";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('USER'); 
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [formData, setFormData] = useState({ description: '', amount: '', categoryId: '' });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole'); // USER, ADMIN ili GUEST
    
    if (!userId) {
      router.push('/login');
    } else {
      setUserName(storedName || 'Korisnik');
      setUserRole(storedRole || 'USER');
      setLoading(false);
      loadAllData(userId);
    }
  }, [router]);

  const loadAllData = async (userId: string) => {
    try {
      const [resExp, resInc, resCat] = await Promise.all([
        fetch(`/api/expenses?userId=${userId}`),
        fetch(`/api/incomes?userId=${userId}`),
        fetch(`/api/categories`)
      ]);
      
      if (resExp.ok) setExpenses(await resExp.json());
      if (resInc.ok) setIncomes(await resInc.json());
      if (resCat.ok) setCategories(await resCat.json());
    } catch (err) {
      console.error("Greška pri učitavanju:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === 'GUEST') {
      alert("Gosti ne mogu da menjaju podatke!");
      return;
    }
    
    const userId = localStorage.getItem('userId');
    const endpoint = modalMode === 'INCOME' ? '/api/incomes' : '/api/expenses';
    const finalCategoryId = formData.categoryId || categories.find(c => c.type === modalMode)?.id;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        description: formData.description,
        amount: formData.amount,
        userId: userId,
        categoryId: finalCategoryId 
      })
    });

    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ description: '', amount: '', categoryId: '' });
      if (userId) loadAllData(userId);
    }
  };

  const allTransactions = [
    ...incomes.map(i => ({ ...i, type: 'INCOME' })),
    ...expenses.map(e => ({ ...e, type: 'EXPENSE' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (loading) return <div className="flex h-screen items-center justify-center font-black italic">Učitavanje...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <nav className="bg-white p-4 flex justify-between items-center px-8 shadow-sm border-b">
        <h1 className="text-xl font-bold text-blue-900 italic flex items-center gap-2">
          Budžetko 💰 
          <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full not-italic font-black uppercase">
            {userRole}
          </span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-600 italic">Zdravo, {userName}</span>
          <Button variant="danger" onClick={() => { localStorage.clear(); router.push('/login'); }}>Odjavi se</Button>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard title="Prihodi" amount={incomes.reduce((s, i:any) => s + i.amount, 0)} type="income" />
          <StatsCard title="Troškovi" amount={expenses.reduce((s, e:any) => s + e.amount, 0)} type="expense" />
          <StatsCard title="Stanje" amount={incomes.reduce((s, i:any) => s + i.amount, 0) - expenses.reduce((s, e:any) => s + e.amount, 0)} type="balance" />
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-gray-800 tracking-tighter">
              {userRole === 'ADMIN' ? 'SVI PODACI (ADMIN PANEL)' : 'MOJE TRANSAKCIJE'}
            </h2>
            
            {/* DUGMIĆI SE NE VIDE ZA GUEST-A */}
            {userRole !== 'GUEST' && (
              <div className="flex gap-3">
                <button onClick={() => { setModalMode('INCOME'); setIsModalOpen(true); }} className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold">+ Prihod</button>
                <button onClick={() => { setModalMode('EXPENSE'); setIsModalOpen(true); }} className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold">+ Trošak</button>
              </div>
            )}
          </div>

          <TransactionTable 
            transactions={allTransactions} 
            onDelete={(id, type) => {
              if (userRole === 'GUEST') return alert("Gosti ne mogu da brišu!");
              // Ovde ide handleDelete funkcija
            }} 
          />
        </div>
      </main>

      <TransactionModal 
        isOpen={isModalOpen}
        mode={modalMode}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
      />
    </div>
  );
}