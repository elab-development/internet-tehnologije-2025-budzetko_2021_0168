'use client';

import { useRouter } from 'next/navigation';
import { Button } from "./components/button";
export default function Home() {

  const router = useRouter();
  // Funkcija koja simulira ulazak gosta
  const startGuestMode = () => {
    // Čistimo sve stare podatke da bi Dashboard prepoznao novog Gosta

    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');

    // Brišemo i cookie (za middleware)
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Idemo na dashboard koji će automatski učitati DEMO_DATA
    router.push('/dashboard');
  };

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-[#02040a] text-white p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="text-center space-y-6 mb-16 relative z-10">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
          Budžetko <span className="text-violet-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"></span>
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.5em] max-w-xs mx-auto leading-relaxed">
          Vaša aplikacija za pametno <br/> upravljanje finansijama
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm relative z-10 px-4">

        {/* Prijava */}
        <Button variant="primary" onClick={() => router.push('/login')} className="!py-6 !text-[11px] !rounded-[2.5rem] bg-violet-600 hover:bg-violet-500 text-white border-none shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(139,92,246,0.4)] transition-all duration-300 font-black uppercase tracking-widest">Prijavite se
        </Button>

        {/* Registracija */}
        <Button variant="ghost" onClick={() => router.push('/register')}
          className="!py-6 !text-[11px] !rounded-[2.5rem] bg-white/[0.03] border-slate-800 hover:border-violet-500/50 text-slate-400 hover:text-white backdrop-blur-md transition-all duration-300 font-black uppercase tracking-widest">Otvorite nalog
        </Button>

        {/* DEMO DUGME ZA GOSTA */}

        <button
          onClick={startGuestMode}
          className="mt-6 text-slate-600 hover:text-violet-400 font-black text-[9px] uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-2 group" >
          <span className="w-8 h-[1px] bg-slate-800 group-hover:bg-violet-500/50 transition-all" />
          Isprobaj Demo (Gost)
          <span className="w-8 h-[1px] bg-slate-800 group-hover:bg-violet-500/50 transition-all" />

        </button>

      </div>

      {/* FOOTER BLUR */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#02040a] to-transparent pointer-events-none" />
    </div>
  );
}