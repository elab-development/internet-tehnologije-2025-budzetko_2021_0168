import { Button } from '../components/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">
        Budžetko
      </h1>
      
      <p className="mb-6 text-gray-600 italic">
        Lako upravljaj svojim finansijama!
      </p>

      <div className="flex gap-4">
        <Button variant="primary">Početna</Button>
        <Button variant="success">Sačuvaj</Button>
        <Button variant="danger">Obriši</Button>
      </div>
    </main>
  );
}