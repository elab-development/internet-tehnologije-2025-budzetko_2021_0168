'use client';

import { useRouter } from 'next/navigation';
import { Button } from "./button";

interface NavbarProps {
  userName: string;
  userRole: string;
}

export function Navbar({ userName, userRole }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <nav className="bg-white p-4 flex justify-between items-center px-8 shadow-sm border-b sticky top-0 z-10">
      <h1 className="text-xl font-bold text-blue-900 italic flex items-center gap-2">
        Budžetko 💰 
        <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full not-italic font-black uppercase">
          {userRole}
        </span>
      </h1>
      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-600 italic">Zdravo, {userName}</span>
        <Button variant="danger" onClick={handleLogout}>Odjavi se</Button>
      </div>
    </nav>
  );
}