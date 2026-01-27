// components/input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1 mb-4 w-full">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input 
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black placeholder:text-gray-500"
        {...props}
      />
    </div>
  );
};