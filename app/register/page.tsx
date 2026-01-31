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

      const data = await res.json(); // Uzimamo podatke koje nam server vrati

      if (res.ok) {
        // Automatski čuvamo podatke za profil
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', formData.name);
        
        // Ako tvoj API za registraciju vraća ID i Role, sačuvaj i njih:
        if (data.user) {
          localStorage.setItem('userId', data.user.id.toString());
          localStorage.setItem('userRole', data.user.role || 'USER');
        }

        // Šaljemo ga direktno na Dashboard jer je sada "ulogovan" u browseru
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
    text-slate-100 text-sm px-5 py-4 rounded-2xl 
    focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 
    transition-all 
    placeholder:text-slate-500 
    caret-blue-500
    
    /* Specijalna popravka za Chrome/Edge/Safari autofill */
    [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] 
    [&:-webkit-autofill]:-webkit-text-fill-color-white 
    [&:-webkit-autofill]:[text-fill-color:white]
`;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden selection:bg-blue-500/30">
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl">
          
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
               <div className="h-6 w-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
               <h1 className="text-2xl font-black text-slate-100 tracking-[-0.05em] uppercase italic">
                  Budžet<span className="text-blue-500 not-italic font-light">ko</span>
               </h1>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              Kreiraj svoj nalog
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Ime i Prezime */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Ime i Prezime
              </label>
              <input 
                type="text"
                placeholder="Marko Marković"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Email Adresa
              </label>
              <input 
                type="email"
                placeholder="marko@primer.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className={inputClass}
              />
            </div>

            {/* Lozinka sa okom */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Lozinka
              </label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-blue-400 transition-colors focus:outline-none"
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
              className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-slate-950 font-black text-sm uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Kreiranje..." : "Registruj se"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center space-y-4">
            <p className="text-xs text-slate-500">
              Već imaš nalog?{' '}
              <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition hover:underline underline-offset-4">
                Prijavi se ovde
              </Link>
            </p>
            <div>
              <Link href="/" className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-wider transition">
                ← Nazad na početnu
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}