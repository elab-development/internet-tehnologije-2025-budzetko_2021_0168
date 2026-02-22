'use client';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

interface SavingsGoalsProps {
  goals: Goal[];
  onAddGoal: () => void;
  onUpdate: () => void;
}

export function SavingsGoals({ goals, onAddGoal, onUpdate }: SavingsGoalsProps) {
  // Dodaj ovo unutar SavingsGoals komponente, iznad return-a
const handleAddMoney = async (goalId: string, currentAmount: number, targetAmount: number) => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const newAmount = currentAmount + 1000; // Dodajemo po 1000 RSD, možeš staviti koliko želiš

      try {
        const res = await fetch('/api/goals', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: goalId,
            currentAmount: newAmount,
            userId: userId
          }),
        });

        if (res.ok) {
          onUpdate(); 
        }
      } catch (err) {
        console.error("Greška pri uplati:", err);
      }
  };
  return (
    <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-[3rem] backdrop-blur-md h-full shadow-2xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Planiranje</h2>
          <p className="text-lg font-black text-white italic tracking-tighter uppercase">Ciljevi Štednje</p>
        </div>
        
        <button 
          onClick={onAddGoal}
          className="bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 p-2 rounded-xl transition-all active:scale-95 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-400 group-hover:text-white">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      <div className="space-y-6 relative z-10 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {goals.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-slate-800/30 rounded-[2.5rem]">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Postavi svoj prvi cilj</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            return (
              <div key={goal.id} className="bg-white/5 border border-white/5 p-5 rounded-[2rem] hover:bg-white/[0.08] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-sm uppercase tracking-tight">{goal.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest">
                      PREOSTALO: {(goal.targetAmount - goal.currentAmount).toLocaleString()} RSD
                    </p>
                    <button 
                        onClick={() => handleAddMoney(goal.id, goal.currentAmount, goal.targetAmount)}
                        disabled={goal.currentAmount >= goal.targetAmount}
                        className={`mt-3 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-black/20
                          ${goal.currentAmount >= goal.targetAmount 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' 
                            : 'bg-emerald-500 text-white hover:bg-emerald-400 active:scale-90'}`}
                      >
                        {goal.currentAmount >= goal.targetAmount ? '✅ ISPUNJENO' : '+ DODAJ 1000 RSD'}
                    </button>
                  </div>
                  <div className="text-right">
                    <span className={`font-black text-xs italic ${progress >= 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {progress >= 100 ? 'ISPUNJENO 🏆' : `${Math.round(progress)}%`}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      progress >= 100 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between mt-3 text-[10px] font-bold">
                  <span className="text-slate-500">{goal.currentAmount.toLocaleString()} RSD</span>
                  <span className="text-slate-300">{goal.targetAmount.toLocaleString()} RSD</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}