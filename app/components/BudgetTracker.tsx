'use client';

interface Budget {
  id: string;
  limit: number;
  categoryId: string | number; // Dozvoljavamo i string zbog "TOTAL"
  category?: {
    name: string;
    icon?: string;
  };
}

interface Expense {
  amount: number;
  categoryId: string | number;
}

interface BudgetTrackerProps {
  budgets: Budget[];
  expenses: Expense[];
  onAddBudget: () => void;
}

export function BudgetTracker({ budgets, expenses, onAddBudget }: BudgetTrackerProps) {
  
  // 1. Izračunaj ukupne troškove (sabira sve iz expenses niza)
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  // 2. Izdvoji "Ukupan budžet" (ako postoji)
  const totalBudget = budgets.find(b => String(b.categoryId) === "TOTAL" || String(b.categoryId) === "0");
  
  // 3. Izdvoji ostale budžete po kategorijama
  const categoryBudgets = budgets.filter(b => String(b.categoryId) !== "TOTAL" && String(b.categoryId) !== "0");

  // Funkcija za računanje potrošnje po specifičnoj kategoriji
  const getSpentForCategory = (categoryId: string | number) => {
    return expenses
      .filter(e => String(e.categoryId) === String(categoryId))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-[3rem] backdrop-blur-md h-full shadow-2xl relative overflow-hidden group">
      {/* Dekorativni sjaj u pozadini */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-[50px] rounded-full pointer-events-none" />

      {/* HEADER KARTICE */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Limiti</h2>
          <p className="text-lg font-black text-white italic tracking-tighter uppercase">Budžeti</p>
        </div>
        
        {/* DUGME ZA DODAVANJE (koristi prop onAddBudget) */}
        <button 
          onClick={onAddBudget}
          className="group/btn flex items-center gap-2 bg-violet-500/10 hover:bg-violet-600 border border-violet-500/20 hover:border-violet-500 px-4 py-2 rounded-xl transition-all duration-300 active:scale-95"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 group-hover/btn:text-white transition-colors">Postavi</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400 group-hover/btn:text-white transition-colors">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      <div className="space-y-6 relative z-10">
        
        {/* 1. SEKCIJA: UKUPAN MESEČNI BUDŽET (Prikazuje se samo ako je postavljen) */}
        {totalBudget && (
          <div className="mb-6 p-5 bg-violet-500/10 border border-violet-500/20 rounded-[2rem] shadow-lg shadow-violet-500/5">
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] block mb-1">
                  Ukupan Mesečni Limit
                </span>
                <p className="text-xl font-black text-white italic tracking-tighter">
                  {totalSpent.toLocaleString()} <span className="text-slate-500 text-xs not-italic">/ {totalBudget.limit.toLocaleString()} RSD</span>
                </p>
              </div>
              <span className={`text-[10px] font-black ${totalSpent > totalBudget.limit ? 'text-rose-500' : 'text-emerald-500'} bg-slate-950 px-2 py-1 rounded-md border border-slate-800`}>
                {Math.round((totalSpent / totalBudget.limit) * 100)}%
              </span>
            </div>
            
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 p-[1px]">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  totalSpent > totalBudget.limit 
                    ? 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]' 
                    : 'bg-gradient-to-r from-violet-600 to-indigo-400'
                }`}
                style={{ width: `${Math.min((totalSpent / totalBudget.limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Razdelnik ako imamo i ukupan budžet i pojedinačne kategorije */}
        {totalBudget && categoryBudgets.length > 0 && (
          <div className="h-[1px] bg-slate-800/50 w-full my-6" />
        )}

        {/* 2. SEKCIJA: BUDŽETI PO KATEGORIJAMA */}
        {budgets.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-slate-800/50 rounded-[2rem]">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Nema aktivnih budžeta</p>
          </div>
        ) : (
          categoryBudgets.map((budget) => {
            const spent = getSpentForCategory(budget.categoryId);
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const isOverBudget = spent > budget.limit;

            return (
              <div key={budget.id} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      {budget.category?.name || "Nepoznata kategorija"}
                    </span>
                    <p className="text-sm font-bold text-white">
                      {spent.toLocaleString()} <span className="text-slate-500 text-[10px]">/ {budget.limit.toLocaleString()} RSD</span>
                    </p>
                  </div>
                  <span className={`text-[10px] font-black ${isOverBudget ? 'text-rose-500' : 'text-emerald-500'} bg-slate-950 px-2 py-1 rounded-md border border-slate-800`}>
                    {Math.round((spent / budget.limit) * 100)}%
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 p-[1px]">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isOverBudget 
                        ? 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-400' // Ovde sam stavio zelenu da se razlikuje od ukupnog
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}