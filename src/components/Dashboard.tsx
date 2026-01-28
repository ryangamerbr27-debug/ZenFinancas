
import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { Expense, CategoryType } from '../types';
import { COLORS } from '../constants';

interface DashboardProps {
  allExpenses: Expense[];
  viewDate: Date;
  onViewDateChange: (date: Date) => void;
  onSync: () => void;
  isSyncing: boolean;
  syncStatus: 'idle' | 'success' | 'error';
}

const Dashboard: React.FC<DashboardProps> = ({ 
  allExpenses, 
  viewDate, 
  onViewDateChange, 
  onSync, 
  isSyncing, 
  syncStatus 
}) => {
  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    onViewDateChange(newDate);
  };

  const currentMonthLabel = viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Dados filtrados para o mês atual
  const currentMonthExpenses = useMemo(() => {
    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();
    return allExpenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [allExpenses, viewDate]);

  const expenseData = useMemo(() => {
    return Object.values(CategoryType)
      .filter(cat => cat !== CategoryType.REVENUE)
      .map(cat => ({
        name: cat,
        value: currentMonthExpenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0)
      }));
  }, [currentMonthExpenses]);

  const totalRevenue = useMemo(() => {
    return currentMonthExpenses
      .filter(e => e.category === CategoryType.REVENUE)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [currentMonthExpenses]);

  const totalExpenses = useMemo(() => {
    return currentMonthExpenses
      .filter(e => e.category !== CategoryType.REVENUE)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [currentMonthExpenses]);

  const balance = totalRevenue - totalExpenses;
  const hasData = expenseData.some(d => d.value > 0);

  // Dados para o Gráfico de Tendência (Últimos 6 meses)
  const trendData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(viewDate);
      d.setMonth(d.getMonth() - i);
      const month = d.getMonth();
      const year = d.getFullYear();
      const label = d.toLocaleDateString('pt-BR', { month: 'short' });

      const monthExpenses = allExpenses.filter(e => {
        const ed = new Date(e.date);
        return ed.getMonth() === month && ed.getFullYear() === year;
      });

      const revenue = monthExpenses
        .filter(e => e.category === CategoryType.REVENUE)
        .reduce((acc, curr) => acc + curr.amount, 0);

      const expenses = monthExpenses
        .filter(e => e.category !== CategoryType.REVENUE)
        .reduce((acc, curr) => acc + curr.amount, 0);

      months.push({
        name: label,
        Receitas: parseFloat(revenue.toFixed(2)),
        Despesas: parseFloat(expenses.toFixed(2)),
      });
    }
    return months;
  }, [allExpenses, viewDate]);

  return (
    <div className="space-y-8 mb-12">
      {/* Seletor de Período Glass */}
      <div className="flex items-center justify-between glass-card p-5 rounded-[2rem] transition-all">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-3 bg-white/40 dark:bg-slate-700/40 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all border border-white/40 dark:border-slate-600/40 text-slate-500 dark:text-slate-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-black text-slate-800 dark:text-white capitalize w-56 text-center tracking-tight">
            {currentMonthLabel}
          </h2>
          <button 
            onClick={() => changeMonth(1)}
            className="p-3 bg-white/40 dark:bg-slate-700/40 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all border border-white/40 dark:border-slate-600/40 text-slate-500 dark:text-slate-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="hidden md:block">
           <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Visão Geral</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Tendência Glass */}
        <div className="glass-card p-8 rounded-[2.5rem] flex flex-col min-h-[420px] transition-all relative">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8 tracking-tight">Tendência Semestral</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: '#1e293b'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar dataKey="Receitas" fill={COLORS[CategoryType.REVENUE]} radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Despesas" fill={COLORS[CategoryType.FIXED]} radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza Glass */}
        <div className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center min-h-[420px] transition-all relative">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8 self-start tracking-tight">Gastos por Categoria</h3>
          {hasData ? (
            <>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as CategoryType]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                      contentStyle={{ 
                        borderRadius: '20px', 
                        border: 'none', 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        color: '#1e293b'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-6 w-full mt-6">
                {expenseData.map(item => (
                  <div key={item.name} className="flex items-center space-x-3 bg-white/20 dark:bg-slate-700/20 p-3 rounded-2xl">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[item.name as CategoryType] }} />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{item.name}</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-100">R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 opacity-50 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm font-medium italic">Nenhum gasto registrado este mês</p>
            </div>
          )}
        </div>

        {/* Resumo de Caixa Glass */}
        <div className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-between transition-all lg:col-span-2">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Fluxo de Caixa</h3>
              <div className="p-2 bg-indigo-600/10 text-indigo-600 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-3xl flex justify-between items-center border border-emerald-500/20">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">Entradas</span>
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Receitas</span>
                  </div>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-xl">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-5 bg-rose-500/10 dark:bg-rose-500/5 rounded-3xl flex justify-between items-center border border-rose-500/20">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-rose-500 dark:text-rose-400 font-black uppercase tracking-widest">Saídas</span>
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Gastos Totais</span>
                  </div>
                </div>
                <span className="text-rose-500 dark:text-rose-400 font-black text-xl">
                  R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/20 dark:border-slate-700/40 flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Disponível no Mês</span>
              <span className={`text-4xl font-black tracking-tighter ${balance >= 0 ? 'text-slate-800 dark:text-white' : 'text-rose-600'}`}>
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all duration-700 ${balance >= 0 ? 'bg-indigo-600 shadow-indigo-500/40 scale-110' : 'bg-rose-500 shadow-rose-500/40'}`}>
              {balance >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;