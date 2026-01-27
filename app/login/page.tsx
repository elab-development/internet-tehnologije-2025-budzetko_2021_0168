'use client';
import { useState } from 'react';
import { Button } from "../components/button";
import { Input } from "../components/input";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Šaljemo podatke na API 
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Proveravamo da li je server odobrio pristup
      if (response.ok) {
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userId', data.user.id);
            alert(`Uspešna prijava! Dobrodošli nazad, ${data.user.name}`);
            window.location.href = '/dashboard';
        }else {
        // Ako su podaci pogresni, ispisujemo grešku koju nam je poslao backend
        alert(data.error || "Pogrešan email ili lozinka!");
      }

    } catch (error) {
      console.error("Greška pri prijavi:", error);
      alert("Serverska greška. Proverite da li je baza upaljena.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-black p-4">
      {/* Kartica za Login */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-900">Prijava 🔑</h1>
        <p className="text-gray-500 text-center mb-8">Unesite podatke da biste nastavili</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            label="Email adresa" 
            type="email" 
            placeholder="ime@primer.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Input 
            label="Lozinka" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant="success" className="w-full text-lg mt-4" type="submit">
            Prijavi se
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Nemaš nalog? </span>
          <a href="/register" className="text-blue-600 hover:underline font-bold">
            Registruj se
          </a>
        </div>
      </div>

      {/* Dugme za povratak na početnu */}
      <a href="/" className="mt-8 text-blue-900 font-medium hover:text-blue-700 transition-colors">
        ← Nazad na početnu
      </a>
    </div>
  );
  
}