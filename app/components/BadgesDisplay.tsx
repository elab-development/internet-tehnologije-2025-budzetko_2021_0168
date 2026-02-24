// components/BadgesDisplay.tsx
import React from 'react';
 
interface BadgesProps {
  badgesString: string; // Ovo dobijamo iz baze (npr. "PRVI_KORAK,BUDZET_MASTER")
}
 
// Mapiranje ključeva iz baze 
const badgeMap: Record<string, { label: string; icon: string; color: string }> = {
  PRVI_KORAK: { label: 'Prvi Korak', icon: '🛡️', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
  BUDZET_MASTER: { label: 'Budžet Master', icon: '💎', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
  KRALJ_STEDNJE: { label: 'Kralj Štednje', icon: '👑', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
  PLANER: { label: 'Planer', icon: '📅', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' },
  STEDISA: { label: "Štediša", icon: "💰", color: "#f59e0b" }
};
 
export const BadgesDisplay = ({ badgesString }: BadgesProps) => {
  if (!badgesString) return null;
 
  // Pretvaramo string u niz: "A,B" -> ["A", "B"]
  const badgeList = badgesString.split(',').filter(b => b.trim() !== "");
 
  return (
    <div className="flex flex-wrap gap-3 my-4">
      {badgeList.map((badgeKey) => {
        const badge = badgeMap[badgeKey];
        if (!badge) return null;
 
        return (
          <div
            key={badgeKey}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium shadow-lg transition-transform hover:scale-105 ${badge.color}`}
          >
            <span className="text-xl">{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
};