'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "../components/button";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userId', data.user.id.toString());
        localStorage.setItem('userName', data.user.name || 'Korisnik');
        localStorage.setItem('userRole', data.user.role); 
        router.push('/dashboard');
      } else {
        setError(data.error || 'Pogrešan email ili lozinka');
      }
    } catch (err) {
      setError('Greška u konekciji sa serverom');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-black">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-blue-900 italic tracking-tighter">Budžetko 💰</h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">Prijavi se na svoj nalog</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Email Adresa</label>
            <input 
              type="email"
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-black"
              placeholder="primer@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Lozinka</label>
            <input 
              type="password"
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-black"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all">
            PRISTUPI PANELU
          </Button>
        </form>

        {/* povratak na registraciju */}
        <p className="text-center mt-8 text-sm font-bold text-gray-400">
          Nemaš nalog?{' '}
          <span 
            onClick={() => router.push('/register')} 
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Registruj se
          </span>
        </p>
      </div>
    </div>
  );
}