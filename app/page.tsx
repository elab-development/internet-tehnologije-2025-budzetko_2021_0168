// app/page.tsx
import { Button } from "./components/button";

//if (user.role === 'ADMIN') {
 //  return <AdminView /> // Admin vidi sve korisnike i globalnu statistiku
//} else {
 //  return <UserView />  // Običan korisnik vidi samo svoje troškove
//}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">Dobrodošli u Budžetko! 💰</h1>
      <p className="text-lg text-gray-700 mb-8">Vaša aplikacija za upravljanje finansijama.</p>
      
      <div className="flex gap-4">
        <a href="/register">
          <Button>Otvori nalog</Button>
        </a>
        <a href="/login">
          <Button variant="success">Prijavi se</Button>
        </a>
      </div>
    </div>
  );
}