
import React, { useState, useEffect, useMemo } from 'react';
import { CategoryType, PaymentMethod, Expense, VoiceMapping } from '../types';
import Icon from './Icon';

interface ExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id'> | Omit<Expense, 'id'>[]) => void;
  onUpdate: (expense: Expense) => void;
  editingExpense: Expense | null;
  onCancelEdit: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd, onUpdate, editingExpense, onCancelEdit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>(CategoryType.FIXED);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState('2');
  const [isRevenueRecurring, setIsRevenueRecurring] = useState(false);
  const [revenueRecurrenceMonths, setRevenueRecurrenceMonths] = useState('12');

  const savedVoices: VoiceMapping[] = useMemo(() => {
    const saved = localStorage.getItem('zenfinancas_voices');
    return saved ? JSON.parse(saved) : [
      { description: 'Aluguel', icon: 'home' },
      { description: 'Supermercado', icon: 'cart' },
      { description: 'Salário', icon: 'cash' },
      { description: 'Lazer', icon: 'leisure' }
    ];
  }, [editingExpense]);

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setPaymentMethod(editingExpense.paymentMethod);
      setDate(new Date(editingExpense.date).toISOString().split('T')[0]);
      setIsInstallment(false);
      setIsRevenueRecurring(false);
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory(CategoryType.FIXED);
    setPaymentMethod(PaymentMethod.PIX);
    setDate(new Date().toISOString().split('T')[0]);
    setIsInstallment(false);
    setInstallmentsCount('2');
    setIsRevenueRecurring(false);
    setRevenueRecurrenceMonths('12');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;
    
    const baseAmount = parseFloat(amount);
    const startDate = new Date(date);

    if (editingExpense) {
      onUpdate({
        ...editingExpense,
        description,
        amount: baseAmount,
        category,
        paymentMethod,
        date: startDate.toISOString()
      });
      onCancelEdit();
    } else {
      if (category === CategoryType.REVENUE && isRevenueRecurring) {
        const count = Math.max(1, parseInt(revenueRecurrenceMonths) || 1);
        const recurringRevenue: Omit<Expense, 'id'>[] = [];
        for (let i = 0; i < count; i++) {
          const nextDate = new Date(startDate);
          nextDate.setMonth(startDate.getMonth() + i);
          recurringRevenue.push({
            description: i === 0 ? description : `${description} (Recorrente)`,
            amount: baseAmount,
            category,
            paymentMethod,
            date: nextDate.toISOString()
          });
        }
        onAdd(recurringRevenue);
      }
      else if (category === CategoryType.FIXED) {
        const recurringExpenses: Omit<Expense, 'id'>[] = [];
        for (let i = 0; i < 12; i++) {
          const nextDate = new Date(startDate);
          nextDate.setMonth(startDate.getMonth() + i);
          recurringExpenses.push({
            description: i === 0 ? description : `${description} (Fixo)`,
            amount: baseAmount,
            category,
            paymentMethod,
            date: nextDate.toISOString()
          });
        }
        onAdd(recurringExpenses);
      } 
      else if (isInstallment && parseInt(installmentsCount) > 1) {
        const count = parseInt(installmentsCount);
        const newExpenses: Omit<Expense, 'id'>[] = [];
        for (let i = 0; i < count; i++) {
          const installmentDate = new Date(startDate);
          installmentDate.setMonth(startDate.getMonth() + i);
          newExpenses.push({
            description: `${description} (${i + 1}/${count})`,
            amount: baseAmount / count,
            category,
            paymentMethod,
            date: installmentDate.toISOString()
          });
        }
        onAdd(newExpenses);
      } 
      else {
        onAdd({
          description,
          amount: baseAmount,
          category,
          paymentMethod,
          date: startDate.toISOString()
        });
      }
    }
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className={`glass-card p-8 rounded-[2.5rem] transition-all ${editingExpense ? 'ring-4 ring-amber-500/30 border-amber-500/50' : ''} mb-12`}>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
          {editingExpense ? 'Ajustar Lançamento' : 'Novo Lançamento'}
        </h3>
        {editingExpense && (
          <button 
            type="button" 
            onClick={() => { onCancelEdit(); resetForm(); }}
            className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-xl hover:bg-amber-500/20 uppercase tracking-widest"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="md:col-span-1">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-[0.15em] ml-1">Voz / Descrição</label>
          <select
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-slate-700/40 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none text-slate-700 dark:text-white transition-all text-sm font-bold"
          >
            <option value="" disabled className="dark:bg-slate-800">Selecione...</option>
            {editingExpense && !savedVoices.find(v => v.description === editingExpense.description) && (
              <option value={editingExpense.description} className="dark:bg-slate-800">
                {editingExpense.description} (Lançamento)
              </option>
            )}
            {savedVoices.map((voice) => (
              <option key={voice.description} value={voice.description} className="dark:bg-slate-800">
                {voice.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-[0.15em] ml-1">Valor</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-slate-700/40 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none text-slate-700 dark:text-white transition-all text-sm font-bold"
            placeholder="0,00"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-[0.15em] ml-1">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-slate-700/40 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none text-slate-700 dark:text-white transition-all text-sm font-medium"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-[0.15em] ml-1">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="w-full px-5 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-slate-700/40 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none text-slate-700 dark:text-white transition-all text-sm font-medium"
          >
            {Object.values(CategoryType).map(cat => (
              <option key={cat} value={cat} className="dark:bg-slate-800">{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-[0.15em] ml-1">Pagamento</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full px-5 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-slate-700/40 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none text-slate-700 dark:text-white transition-all text-sm font-medium"
          >
            {Object.values(PaymentMethod).map(method => (
              <option key={method} value={method} className="dark:bg-slate-800">{method}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className={`w-full h-[46px] text-white font-black rounded-2xl transition-all shadow-2xl uppercase tracking-widest text-xs active:scale-95 ${
              editingExpense 
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
            }`}
          >
            {editingExpense ? 'Atualizar' : 'Lançar'}
          </button>
        </div>
      </div>

      {/* Opções Avançadas */}
      {!editingExpense && (
        <div className="mt-8 p-4 bg-white/20 dark:bg-slate-900/30 rounded-[1.5rem] border border-white/20 dark:border-slate-800/40 min-h-[64px]">
           {/* Lógica de Recorrência e Parcelamento mantida conforme App original */}
           {category === CategoryType.REVENUE ? (
             <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
                <Icon name="cash" className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-widest">Configuração de Entrada de Capital</span>
             </div>
           ) : (
             <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
                <Icon name="chart" className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-widest">Fluxo de Saída Planejado</span>
             </div>
           )}
        </div>
      )}
    </form>
  );
};

export default ExpenseForm;
