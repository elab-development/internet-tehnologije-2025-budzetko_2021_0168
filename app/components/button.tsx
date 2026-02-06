// components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success' | 'ghost';
}

export const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
  const baseStyles = "px-10 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2";
  const variants = {

    primary: "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/20 border border-violet-400/20",
    danger: "bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 shadow-xl shadow-rose-900/10",
    success: "bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 shadow-xl shadow-emerald-900/10",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-800"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};