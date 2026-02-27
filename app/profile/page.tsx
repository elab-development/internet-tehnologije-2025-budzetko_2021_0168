"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from "../components/navbar";

export default function ProfilePage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!userId || userRole === 'GUEST') {
      router.push('/login');
    } else {
      setName(localStorage.getItem('userName') || '');
      setEmail(localStorage.getItem('userEmail') || 'korisnik@primer.com');
      setRole(userRole || 'USER');
      setLoading(false);
    }
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: 'Slanje podataka...', type: 'info' });

    // Provera šifara na klijentu
    if (newPassword && newPassword !== confirmPassword) {
        setMessage({ text: 'Šifre se ne poklapaju!', type: 'error' });
        return;
    }

    try {
        const response = await fetch('/api/user/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              name: name,
              newPassword: newPassword || undefined,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Ažuriramo lokalno ime da korisnik odmah vidi promenu
          localStorage.setItem('userName', name);
          setMessage({ text: result.message || 'Podaci su uspešno sačuvani!', type: 'success' });
          
          // Resetujemo polja za šifru
          setNewPassword('');
          setConfirmPassword('');
          
          // Preusmeravanje nakon 2 sekunde
          setTimeout(() => router.push('/dashboard'), 2000);
        } else {
          setMessage({ text: result.message || 'Došlo je do greške', type: 'error' });
        }
    } catch (error) {
        console.error("Greška pri slanju:", error);
        setMessage({ text: 'Problem sa povezivanjem. Proverite internet ili server.', type: 'error' });
    }
  };

  const inputStyle = `w-full bg-slate-950 border border-slate-800 text-white text-sm px-5 py-4 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200 placeholder:text-slate-600 caret-violet-400 [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] [&:-webkit-autofill]:-webkit-text-fill-color-white`;

  if (loading) {
    return <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-violet-500 font-black animate-pulse uppercase italic tracking-widest">Provera pristupa...</div>;
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100">
      <Navbar userName={name} userRole={role} />
      
      <main className="p-6 max-w-2xl mx-auto pt-16 pb-20 relative">
        <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="bg-slate-900/90 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative z-10 backdrop-blur-xl">
          
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-6 w-[3px] bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Moj Profil</h1>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-4">Podešavanja Vašeg profila</p>
          </div>

          {message.text && (
            <div className={`mb-8 p-4 rounded-xl text-xs font-bold text-center border animate-in fade-in slide-in-from-top-2 ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
              message.type === 'info' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
              'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleUpdateProfile} className="space-y-10">
            <div className="space-y-6">
               <h2 className="text-[11px] font-black text-violet-400 uppercase tracking-[0.2em] border-b border-slate-800 pb-3 ml-1">Lične informacije</h2>
               <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 ml-1">Puno ime</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-2 opacity-80">
                    <label className="text-xs font-bold text-slate-500 ml-1">Email adresa (nepromenljivo)</label>
                    <input 
                      type="email" 
                      value={email}
                      disabled
                      className="w-full bg-slate-950/40 border border-slate-800/50 p-4 px-5 rounded-xl text-slate-500 cursor-not-allowed font-medium text-sm"
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-center border-b border-slate-800 pb-3 ml-1">
                  <h2 className="text-[11px] font-black text-violet-400 uppercase tracking-[0.2em] pb-3 ml-1">Bezbednost</h2>
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-bold text-slate-500 hover:text-violet-400 transition-colors uppercase tracking-widest"
                  >
                    {showPassword ? 'Sakrij' : 'Prikaži'} polja
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 ml-1">Nova šifra</label>
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 karaktera"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 ml-1">Potvrda šifre</label>
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Ponovi šifru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputStyle}
                    />
                  </div>
               </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button 
                type="submit"
                className="flex-[2] bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(124,58,237,0.2)] active:scale-[0.97]"
              >
                SAČUVAJ IZMENE
              </button>
              <button 
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm py-4 rounded-xl transition-all active:scale-[0.97]"
              >
                ODUSTANI
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}