"use client";

import { useState } from "react";

import { Button } from "../components/button"; 
import { Input } from "../components/input";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Slanje podataka na API (route.ts)
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Uspešna registracija! Podaci su u MySQL bazi.");
      setFormData({ email: "", password: "", name: "" }); // Čisti formu
    } else {
      alert("Greška pri registraciji!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleRegister} className="p-8 bg-white shadow-xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Napravi nalog</h2>
        
        <Input 
          label="Ime i prezime" 
          placeholder="npr. Marko Marković"
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required
        />
        
        <Input 
          label="Email" 
          type="email"
          placeholder="marko@primer.com"
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required
        />
        
        <Input 
          label="Lozinka" 
          type="password" 
          placeholder="Unesite lozinku"
          value={formData.password} 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required
        />
        
        <Button type="submit" variant="primary" className="w-full mt-4">
          Registruj se
        </Button>
      </form>
    </div>
  );
}