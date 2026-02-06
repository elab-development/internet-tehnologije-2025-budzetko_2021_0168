'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-center overflow-hidden">
        
        {/* trougao upozorenja */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="relative drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>
        </div>

        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-3">
          {title}
        </h3>
        
        <p className="text-slate-200 text-sm font-black italic leading-relaxed mb-10 px-2">
          {message}
        </p>

        {/* Dugmad */}
        <div className="flex flex-col gap-3">
          {onConfirm ? (
            <>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="w-full py-5 rounded-[1.8rem] bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_25px_rgba(225,29,72,0.2)]"
              >
                Potvrdi brisanje
              </button>
              <button
                onClick={onClose}
                className="w-full py-5 rounded-[1.8rem] bg-slate-800 text-slate-400 hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest transition-all italic"
              >
                Odustani
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-5 rounded-[1.8rem] bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(139,92,246,0.3)]"
            >
              U redu, razumem
            </button>
          )}
        </div>
      </div>
    </div>
  );
}