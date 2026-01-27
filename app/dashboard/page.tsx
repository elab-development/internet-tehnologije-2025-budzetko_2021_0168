'use client';
import { useState, useEffect } from 'react';
import { Button } from "../components/button";
import { Input } from "../components/input";

export default function DashboardPage() {
  const [userName, setUserName] = useState('Korisniče');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]); // Stanje za listu troškova

  // Funkcija koja povlači troškove iz baze
  const fetchExpenses = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await fetch(`/api/expenses?userId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setExpenses(data);
      }
    } catch (error) {
      console.error("Greška pri učitavanju:", error);
    }
  };

  // Učitaj podatke čim se otvori stranica
  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Korisniče');
    fetchExpenses();
  }, []);

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert("Greška: Korisnik nije prepoznat. Prijavite se ponovo.");
      return;
    }

    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount, userId }),
    });

    if (response.ok) {
      setDescription('');
      setAmount('');
      fetchExpenses(); // Osveži listu odmah nakon čuvanja bez refresh-a stranice
    } else {
      alert("Došlo je do greške pri čuvanju.");
    }
  };

  // Računanje ukupne sume
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Zdravo, {userName} 👋</h1>
          <p className="text-sm text-gray-500">Ukupno ste potrošili: <span className="font-bold text-red-600">{totalAmount} RSD</span></p>
        </div>
        <Button variant="primary" onClick={() => {
          localStorage.clear(); // Brišemo podatke pri odjavi
          window.location.href = '/';
        }}>Odjavi se</Button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMA ZA UNOS */}
        <form onSubmit={handleSaveExpense} className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit border border-blue-50">
          <h2 className="text-lg font-bold mb-4 text-blue-900">Dodaj trošak 💸</h2>
          <Input 
            label="Opis troška" 
            placeholder="npr. Restoran" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input 
            label="Iznos (RSD)" 
            type="number" 
            placeholder="1500" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button variant="success" className="w-full mt-4" type="submit">Sačuvaj</Button>
        </form>

        {/* LISTA TRANSKAKCIJA */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-blue-900">Poslednje transakcije</h2>
          
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <p className="text-gray-400 text-center py-10 border-2 border-dashed border-gray-50 rounded-lg">
                Još uvek nemate unetih troškova.
              </p>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">{exp.description}</p>
                    <p className="text-xs text-gray-400">{new Date(exp.createdAt).toLocaleDateString('sr-RS')}</p>
                  </div>
                  <p className="font-bold text-red-600">-{exp.amount} RSD</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}