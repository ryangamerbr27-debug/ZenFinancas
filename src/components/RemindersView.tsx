
import React, { useState, useMemo } from 'react';
import { Expense, CategoryType, VoiceMapping } from '../types';
import { COLORS } from '../constants';
import Icon from './Icon';

interface RemindersViewProps {
  expenses: Expense[];
}

const RemindersView: React.FC<RemindersViewProps> = ({ expenses }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const voices: VoiceMapping[] = useMemo(() => {
    const saved = localStorage.getItem('zenfinancas_voices');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const getIconName = (description: string) => {
    const voice = voices.find(v => 
      description.toLowerCase().includes(v.description.toLowerCase())
    );
    return voice ? voice.icon : 'chart';
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days = [];
  const totalDays = daysInMonth(currentMonth);
  const offset = startDayOfMonth(currentMonth);

  for (let i = 0; i < offset; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const getDayExpenses = (day: number) => {
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && 
             d.getMonth() === currentMonth.getMonth() && 
             d.getFullYear() === currentMonth.getFullYear();
    });
  };

  const selectedDayExpenses = selectedDay ? getDayExpenses(selectedDay) : [];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendário */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[3rem] overflow-hidden">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
              {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
            </h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  const newDate = new Date(currentMonth);
                  newDate.setMonth(currentMonth.getMonth() - 1);
                  setCurrentMonth(newDate);
                  setSelectedDay(null);
                }} 
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-slate-500"
              >
                 <Icon name="tech" className="h-5 w-5 rotate-180" />
              </button>
              <button 
                onClick={() => {
                  const newDate = new Date(currentMonth);
                  newDate.setMonth(currentMonth.getMonth() + 1);
                  setCurrentMonth(newDate);
                  setSelectedDay(null);
                }} 
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-slate-500"
              >
                 <Icon name="tech" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{d}</div>
            ))}
            {days.map((day, idx) => {
              const dayExpenses = day ? getDayExpenses(day) : [];
              const hasRevenue = dayExpenses.some(e => e.category === CategoryType.REVENUE);
              const hasExpense = dayExpenses.some(e => e.category !== CategoryType.REVENUE);
              const isSelected = selectedDay === day;

              return (
                <button 
                  key={idx} 
                  disabled={!day}
                  onClick={() => day && setSelectedDay(day)}
                  className={`aspect-square p-2 rounded-2xl flex flex-col items-center justify-center transition-all relative outline-none ${
                    day 
                      ? isSelected 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' 
                        : 'bg-white/40 dark:bg-slate-800/40 hover:bg-indigo-500/10 border border-white/20 dark:border-slate-700/30' 
                      : 'opacity-0 cursor-default'
                  }`}
                >
                  {day && (
                    <>
                      <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>{day}</span>
                      <div className="flex space-x-1 mt-1">
                        {hasRevenue && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500 shadow-sm shadow-emerald-500/50'}`}></div>}
                        {hasExpense && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/60' : 'bg-rose-500 shadow-sm shadow-rose-500/50'}`}></div>}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalhes do Dia Selecionado */}
        <div className="glass-card p-8 rounded-[3rem] flex flex-col h-full overflow-hidden">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600">
               <Icon name="calendar" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Atividades</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {selectedDay 
                  ? `${selectedDay} ${currentMonth.toLocaleDateString('pt-BR', { month: 'short' })}` 
                  : 'Selecione Data'}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[400px] scrollbar-hide">
            {selectedDayExpenses.length > 0 ? (
              selectedDayExpenses.map(e => {
                const iconName = getIconName(e.description);
                return (
                  <div key={e.id} className="p-4 bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-white/20 dark:border-slate-700/30 group transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                         <div className="text-indigo-600 dark:text-indigo-400 opacity-70">
                           <Icon name={iconName} size={16} />
                         </div>
                         <span className="text-sm font-black text-slate-700 dark:text-slate-100 truncate w-24">{e.description}</span>
                      </div>
                      <span className={`text-xs font-black ${e.category === CategoryType.REVENUE ? 'text-emerald-600' : 'text-slate-800 dark:text-slate-200'}`}>
                        R$ {e.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                <Icon name="chart" size={48} className="text-slate-400 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Limpo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersView;
