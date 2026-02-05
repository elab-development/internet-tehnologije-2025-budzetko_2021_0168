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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">
      {/* Logika za Admin/User view o kojoj si razmišljala bi išla ovde 
          ako bi stranica bila zaštićena, ali Home je obično javan */}
      
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">
          Budžetko <span className="text-blue-500">💰</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">
          Vaša aplikacija za pametno upravljanje finansijama
        </p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Registracija */}
        <button 
          onClick={() => router.push('/register')}
          className="bg-white text-slate-950 font-black py-4 rounded-2xl uppercase text-[11px] tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5"
        >
          Otvori nalog
        </button>

        {/* Prijava */}
        <button 
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white font-black py-4 rounded-2xl uppercase text-[11px] tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
        >
          Prijavi se
        </button>

        {/* DEMO DUGME ZA GOSTA */}
        <button 
          onClick={startGuestMode}
          className="mt-4 bg-slate-900 text-slate-400 border border-slate-800 font-black py-4 rounded-2xl uppercase text-[11px] tracking-widest hover:bg-slate-800 hover:text-white transition-all"
        >
          Isprobaj Demo (Gost)
        </button>
      </div>

      <p className="mt-12 text-[9px] text-slate-600 uppercase font-black tracking-[0.2em]">
        Brzo • Sigurno • Transparentno
      </p>
    </div>
  );
}