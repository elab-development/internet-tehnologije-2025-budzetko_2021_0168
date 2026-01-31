"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State za oko
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
        localStorage.setItem('userEmail', email); 
    
        router.push('/dashboard');
      } else {
        setError(data.error || 'Pogrešan email ili lozinka');
      }
    } catch (err) {
      setError('Greška u konekciji sa serverom');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full bg-slate-950 border border-slate-800 
    text-slate-100 text-sm px-5 py-4 rounded-2xl 
    focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 
    transition-all 
    placeholder:text-slate-500 
    caret-blue-500
    [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] 
    [&:-webkit-autofill]:-webkit-text-fill-color-white
  `;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden selection:bg-blue-500/30">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
          
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
               <div className="h-6 w-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
               <h1 className="text-2xl font-black text-slate-100 tracking-[-0.05em] uppercase italic">
                  Budžet<span className="text-blue-500 not-italic font-light">ko</span>
               </h1>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Dobrodošli nazad!</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-6 text-xs font-bold text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Adresa</label>
              <input 
                type="email"
                placeholder="marko@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Lozinka</label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-slate-950 font-black text-sm uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "PROVERA..." : "PRISTUPI PANELU"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-bold">
              Nemaš nalog?{' '}
              <span 
                onClick={() => router.push('/register')} 
                className="text-blue-400 cursor-pointer hover:text-blue-300 transition hover:underline underline-offset-4"
              >
                Registruj se
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}