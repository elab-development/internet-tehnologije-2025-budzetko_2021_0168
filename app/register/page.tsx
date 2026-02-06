"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', formData.name);
        if (data.user) {
          localStorage.setItem('userId', data.user.id.toString());
          localStorage.setItem('userRole', data.user.role || 'USER');
        }
        router.push('/dashboard'); 
      } else {
        alert(data.error || "Greška pri registraciji!");
      }
    } catch (error) {
      alert("Serverska greška.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full bg-slate-950 border border-slate-800 
    text-white text-sm px-5 py-4 rounded-xl
    focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 
    transition-all duration-200
    placeholder:text-slate-600 
    caret-violet-400
    [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] 
    [&:-webkit-autofill]:-webkit-text-fill-color-white
  `;

  return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 p-10 rounded-3xl shadow-2xl">
          
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
               <div className="h-8 w-[3px] bg-violet-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)]"></div>
               <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                 Budžet<span className="text-violet-500 not-italic">ko</span>
               </h1>
            </div>
            <p className="text-slate-400 text-xs font-medium tracking-wide">Kreirajte vaš nalog</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Ime i Prezime</label>
              <input 
                type="text"
                placeholder="Marko Marković"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Email</label>
              <input 
                type="email"
                placeholder="ime@primer.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Lozinka</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Vaša lozinka"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.225 0 2.39.215 3.475.608M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] active:scale-95 disabled:opacity-50"
            >
              {loading ? "SAČEKAJTE..." : "REGISTRUJ SE"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center space-y-4">
            <p className="text-sm text-slate-400">
              Već imaš nalog?{' '}
              <button 
                onClick={() => router.push('/login')} 
                className="text-violet-400 font-bold hover:text-violet-300 transition"
              >
                Prijavi se
              </button>
            </p>
            <Link href="/" className="block text-xs text-slate-500 hover:text-slate-300 transition tracking-tight">
              ← Nazad na početnu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}