
import React, { useMemo } from 'react';
import { Expense, CategoryType, VoiceMapping } from '../types';
import { COLORS } from '../constants';
import Icon from './Icon';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit }) => {
  const voices: VoiceMapping[] = useMemo(() => {
    const saved = localStorage.getItem('zenfinancas_voices');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const getIconName = (description: string) => {
    // Busca por uma voz que esteja contida na descrição (ex: "Aluguel (Fixo)" contém "Aluguel")
    const voice = voices.find(v => 
      description.toLowerCase().includes(v.description.toLowerCase())
    );
    return voice ? voice.icon : 'chart';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return '--/--/----';
    }
  };

  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden transition-all shadow-xl">
      <div className="p-8 border-b border-white/20 dark:border-slate-800/40 flex justify-between items-center bg-white/5">
        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Histórico de Atividades</h3>
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-white/30 dark:bg-slate-800/30 px-3 py-1.5 rounded-xl uppercase tracking-widest">{expenses.length} registros</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/10 dark:bg-slate-900/10">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Data</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Fluxo</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Categoria</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Pagamento</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Valor</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Controle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 dark:divide-slate-800/40 font-medium">
            {expenses.map((expense) => {
              const iconName = getIconName(expense.description);
              return (
                <tr key={expense.id} className="hover:bg-white/20 dark:hover:bg-slate-700/20 transition-all group">
                  <td className="px-8 py-5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{formatDate(expense.date)}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-9 h-9 bg-white/50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                        <Icon name={iconName} size={18} />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-100 font-black">{expense.description}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border"
                      style={{ 
                        backgroundColor: `${COLORS[expense.category]}15`, 
                        color: COLORS[expense.category],
                        borderColor: `${COLORS[expense.category]}30`
                      }}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">{expense.paymentMethod}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-sm font-black tracking-tight ${
                      expense.category === CategoryType.REVENUE ? 'text-emerald-600' : 'text-slate-800 dark:text-slate-100'
                    }`}>
                      {expense.category === CategoryType.REVENUE ? '+ ' : '- '}
                      R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end space-x-4">
                      <button 
                        type="button"
                        onClick={() => onEdit(expense)}
                        title="Editar lançamento"
                        className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl hover:shadow-lg active:scale-90"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                         </svg>
                      </button>
                      <button 
                        type="button"
                        onClick={() => onDelete(expense.id)}
                        title="Excluir permanentemente"
                        className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-all p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl hover:shadow-lg active:scale-90"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {expenses.length === 0 && (
        <div className="p-20 text-center text-slate-400 dark:text-slate-600">
           <p className="text-sm font-medium italic">Nenhum registro encontrado para este período.</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
