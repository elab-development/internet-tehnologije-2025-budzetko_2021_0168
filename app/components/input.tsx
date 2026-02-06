// components/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <div className="w-full space-y-2 group">
      {label && (
        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 group-focus-within:text-violet-400 transition-colors ml-2">
          {label}
        </label>
      )}
      <input 
        className={`
          w-full bg-slate-950/50 border border-slate-800/80 text-sm px-6 py-4 rounded-2xl 
          text-slate-100 placeholder:text-slate-700 outline-none transition-all duration-300
          focus:border-violet-500/50 focus:bg-slate-900/50 focus:ring-4 focus:ring-violet-500/5
          shadow-inner
          ${className}
        `}
        {...props}
      />
    </div>
  );
};