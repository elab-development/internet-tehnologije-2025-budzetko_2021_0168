'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  userName: string;
  userRole: string;
}

export function Navbar({ userName, userRole }: NavbarProps) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-[#02040a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/dashboard" className="flex items-center gap-4 group cursor-pointer">
            <div className="h-8 w-[3px] bg-violet-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] transition-all duration-500"></div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <h1 className="text-slate-100 text-xl font-black tracking-[-0.05em] leading-none uppercase italic">
                  Budžet<span className="text-violet-500 not-italic font-bold">ko</span>
                </h1>
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
              </div>
            </div>
          </Link>

          {/* DESNO: Profil i Logout */}
          <div className="flex items-center gap-6">
            
            <Link 
              href="/profile" 
              className="group flex items-center gap-4 py-1.5 px-3 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300"
            >
              <div className="flex flex-col items-end">
                <p className="text-xs font-bold text-slate-100 tracking-tight group-hover:text-violet-400 transition-colors">
                  {userName}
                </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-pulse"></span>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                  {userRole}
                </span>
              </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-black text-slate-300 shadow-inner group-hover:scale-105 group-hover:border-violet-500/50 group-hover:text-white transition-all">
                {userName?.charAt(0).toUpperCase()}
              </div>
            </Link>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-violet-400 hover:bg-violet-400/10 transition-all duration-300 active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MODAL ZA ODJAVU */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-md" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative z-[10000] w-full max-w-xs bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </div>
              <h3 className="text-lg font-black text-slate-100 uppercase italic">Odjava</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 mb-8">Da li ste sigurni?</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleLogout} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-[0.2em] active:scale-95">DA, ODJAVI ME</button>
                <button onClick={() => setShowLogoutConfirm(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl transition-all uppercase text-[10px] tracking-[0.2em] active:scale-95">ODUSTANI</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}