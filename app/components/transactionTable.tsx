interface TransactionTableProps {
  transactions: any[];
  onDelete: (id: number, type: 'INCOME' | 'EXPENSE') => void;
}

export function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-gray-400 text-[10px] uppercase font-black tracking-widest">
            <th className="p-4">Datum</th>
            <th className="p-4">Kategorija</th>
            <th className="p-4">Opis</th>
            <th className="p-4 text-right">Iznos</th>
            <th className="p-4 text-center">Akcija</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm">
          {transactions.map((item) => (
            <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 text-gray-400">
                {new Date(item.createdAt).toLocaleDateString('sr-RS')}
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                  item.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {/*Prikazujemo ime kategorije iz objekta category */}
                  {item.category?.name || 'Ostalo'} 
                </span>
              </td>
              <td className="p-4 font-bold text-gray-700">{item.description}</td>
              <td className={`p-4 text-right font-black ${
                item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.type === 'INCOME' ? '+' : '-'}{item.amount.toLocaleString()}
              </td>
              <td className="p-4 text-center">
                <button onClick={() => onDelete(item.id, item.type)} className="text-gray-300 hover:text-red-500">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}