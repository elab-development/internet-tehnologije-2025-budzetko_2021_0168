"use client";

import { useState } from "react";
import { Button } from "../components/button"; 
import { Input } from "../components/input";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Uspešna registracija! Podaci su u MySQL bazi.");
        setFormData({ email: "", password: "", name: "" }); 
        // prebacivanje na login nakon uspeha:
         window.location.href = '/login';
      } else {
        alert("Greška pri registraciji!");
      }
    } catch (error) {
      alert("Serverska greška.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-black p-4">
      {/* Kartica za Registraciju */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-900">Napravi nalog ✨</h1>
        <p className="text-gray-500 text-center mb-8">Pridruži se i prati svoje troškove</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <Input 
            label="Ime i prezime" 
            placeholder="npr. Marko Marković"
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required
          />
          
          <Input 
            label="Email adresa" 
            type="email"
            placeholder="marko@primer.com"
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required
          />
          
          <Input 
            label="Lozinka" 
            type="password" 
            placeholder="••••••••"
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required
          />
          
          <Button type="submit" variant="primary" className="w-full text-lg mt-4">
            Registruj se
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Već imaš nalog? </span>
          <a href="/login" className="text-blue-600 hover:underline font-bold">
            Prijavi se
          </a>
        </div>
      </div>

      {/* Dugme za povratak na početnu */}
      <a href="/" className="mt-8 text-blue-900 font-medium hover:text-blue-700 transition-colors">
        ← Nazad na početnu
      </a>
    </div>
  );
}