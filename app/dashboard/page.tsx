'use client';
import { useState, useEffect } from 'react';
import { Button } from "../components/button";
import { Input } from "../components/input";

export default function DashboardPage() {
  const [userName, setUserName] = useState('Korisniče');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

  const fetchExpenses = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const response = await fetch(`/api/expenses?userId=${userId}`);
      const data = await response.json();
      if (response.ok) setExpenses(data);
    } catch (error) {
      console.error("Greška:", error);
    }
  };

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Korisniče');
    fetchExpenses();
  }, []);

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount, userId }),
    });
    if (response.ok) {
      setDescription('');
      setAmount('');
      fetchExpenses();
    }
  };

  const openDeleteModal = (id: number) => {
    setExpenseToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    const response = await fetch(`/api/expenses?id=${expenseToDelete}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fetchExpenses();
      setIsModalOpen(false);
      setExpenseToDelete(null);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black relative">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Zdravo, {userName} 👋</h1>
          <p className="text-sm text-gray-500">Ukupno: <span className="font-bold text-red-600">{totalAmount} RSD</span></p>
        </div>
        <Button variant="primary" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Odjavi se</Button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSaveExpense} className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit border border-blue-50">
          <h2 className="text-lg font-bold mb-4 text-blue-900">Dodaj trošak 💸</h2>
          <Input label="Opis" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input label="Iznos" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button variant="success" className="w-full mt-4" type="submit">Sačuvaj</Button>
        </form>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-blue-900">Poslednje transakcije</h2>
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <p className="text-gray-400 text-center py-10">Nema troškova.</p>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg group transition-colors hover:bg-white border border-transparent hover:border-blue-100">
                  <div>
                    <p className="font-semibold text-gray-800">{exp.description}</p>
                    <p className="text-xs text-gray-400">{new Date(exp.createdAt).toLocaleDateString('sr-RS')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-red-600">-{exp.amount} RSD</p>
                    <button onClick={() => openDeleteModal(exp.id)} className="text-gray-400 hover:text-red-600 text-xl">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4 text-center">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Potvrda brisanja</h3>
              <p className="text-gray-500 mb-6">Da li ste sigurni da želite da obrišete ovaj trošak?</p>
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Odustani</button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Obriši</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}