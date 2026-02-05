'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from "../components/navbar";

export default function ProfilePage() {
  const router = useRouter();
  
  // State za kontrolu pristupa
  const [loading, setLoading] = useState(true);
  
  // State za osnovne podatke
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  // State za šifru i vidljivost
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    // --- ZAŠTITA: Ako nema ID-a ili je uloga GUEST, šalji na login ---
    if (!userId || userRole === 'GUEST') {
      router.push('/login');
    } else {
      // Ako je pravi korisnik (User/Admin), učitaj podatke
      setName(localStorage.getItem('userName') || '');
      setEmail(localStorage.getItem('userEmail') || 'korisnik@primer.com');
      setRole(userRole || 'USER');
      setLoading(false); // Dozvoli prikaz stranice
    }
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: 'Slanje podataka...', type: 'info' });

    if (newPassword && newPassword !== confirmPassword) {
        setMessage({ text: 'Šifre se ne poklapaju!', type: 'error' });
        return;
    }

    try {
        const response = await fetch('/api/user/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              email: email,
              name: name,
              newPassword: newPassword || undefined,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem('userName', name);
          setMessage({ text: 'Podaci su trajno sačuvani u bazi!', type: 'success' });
          setNewPassword('');
          setConfirmPassword('');
          setTimeout(() => router.push('/dashboard'), 2000);
        } else {
          setMessage({ text: result.message || 'Došlo je do greške', type: 'error' });
        }
    } catch (error) {
        setMessage({ text: 'Serverska greška. Proverite bazu.', type: 'error' });
    }
  };

  // Dok sistem proverava da li je korisnik Gost, prikazujemo samo tamnu pozadinu
  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-black animate-pulse uppercase italic tracking-widest">Provera pristupa...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar userName={name} userRole={role} />
      
      <main className="p-8 max-w-2xl mx-auto pt-10 pb-20">
        <div className="bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />
          
          <div className="mb-10">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Moj Profil</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Upravljanje nalogom i bezbednošću</p>
          </div>

          {message.text && (
            <div className={`mb-8 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in zoom-in-95 ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
              message.type === 'info' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="space-y-4">
               <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Osnovni podaci</h2>
               <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Puno Ime</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl mt-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Email (ne može se menjati)</label>
                    <input 
                      type="email" 
                      value={email}
                      disabled
                      className="w-full bg-slate-900/30 border border-slate-800/50 p-4 rounded-2xl mt-1 text-slate-600 cursor-not-allowed font-bold"
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-4">
               <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                  <h2 className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em]">Promena šifre</h2>
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[9px] font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest flex items-center gap-2"
                  >
                    {showPassword ? 'Sakrij' : 'Prikaži'} šifru
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Nova šifra</label>
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimalno 6 karaktera"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl mt-1 focus:border-blue-500/50 outline-none transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Potvrdi novu šifru</label>
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Ponovite šifru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl mt-1 focus:border-blue-500/50 outline-none transition-all font-bold"
                    />
                  </div>
               </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button 
                type="submit"
                className="flex-[2] bg-blue-600 hover:bg-blue-500 text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                Sačuvaj sve izmene
              </button>
              <button 
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl transition-all active:scale-[0.98]"
              >
                Odustani
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}