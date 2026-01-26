'use client';
import { Button } from '../components/button';
import { Input } from '../components/input';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      {/* Ovo je bela kartica u sredini ekrana */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Budžetko 💰
        </h1>
        
        <p className="text-gray-500 text-center mb-8">Unesite svoje troškove brzo i lako!</p>

        {/* Koristimo našu novu Input komponentu */}
        <Input label="Opis troška" placeholder="npr. Kafa sa kolegama" />
        <Input label="Iznos (RSD)" type="number" placeholder="500" />
        
        {/* Koristimo tvoju Button komponentu */}
        <div className="flex gap-3 mt-6">
          <Button variant="success" className="w-full text-lg">Dodaj</Button>
          <Button variant="danger" onClick={() => alert('Poništeno')}>Otkaži</Button>
        </div>
      </div>
    </main>
  );
}