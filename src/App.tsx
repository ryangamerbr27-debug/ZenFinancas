
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Expense, CategoryType, UserProfile } from './types';
import { INITIAL_EXPENSES } from './constants';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsights';
import ExpenseList from './components/ExpenseList';
import SyncModal from './components/SyncModal';
import Sidebar from './components/Sidebar';
import RegistrationView from './components/RegistrationView';
import RemindersView from './components/RemindersView';
import ProfileView from './components/ProfileView';
import { syncToGoogleSheets } from './services/sheetService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'registration' | 'calendar' | 'profile'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('zenfinancas_theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('zenfinancas_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Gestor Zen',
      photoUrl: 'https://cdn-icons-png.flaticon.com/512/2617/2617304.png'
    };
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('zenfinancas_expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_EXPENSES;
      }
    }
    return INITIAL_EXPENSES;
  });

  const [viewDate, setViewDate] = useState(new Date());
  const [sheetUrl, setSheetUrl] = useState(() => localStorage.getItem('zenfinancas_sheet_url') || '');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const syncInProgress = useRef(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('zenfinancas_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zenfinancas_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zenfinancas_theme', 'light');
    }
  }, [isDarkMode]);

  const filteredExpenses = useMemo(() => {
    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [expenses, viewDate]);

  useEffect(() => {
    localStorage.setItem('zenfinancas_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('zenfinancas_sheet_url', sheetUrl);
  }, [sheetUrl]);

  const handleSync = useCallback(async (manual: boolean = false) => {
    if (!sheetUrl || syncInProgress.current) return;
    syncInProgress.current = true;
    setSyncing(true);
    setSyncStatus('idle');
    try {
      const success = await syncToGoogleSheets(sheetUrl, expenses);
      if (success) {
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 4000);
      }
    } catch (err) {
      setSyncStatus('error');
    } finally {
      setSyncing(false);
      syncInProgress.current = false;
    }
  }, [sheetUrl, expenses]);

  const addExpense = (newExpenseData: Omit<Expense, 'id'> | Omit<Expense, 'id'>[]) => {
    const dataArray = Array.isArray(newExpenseData) ? newExpenseData : [newExpenseData];
    const newItems: Expense[] = dataArray.map(item => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString().substr(-4)
    }));
    setExpenses(prev => [...newItems, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    setEditingExpense(null);
  };

  const deleteExpense = useCallback((id: string) => {
    if (window.confirm('Deseja realmente excluir este lançamento do seu histórico?')) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      if (editingExpense && editingExpense.id === id) {
        setEditingExpense(null);
      }
    }
  }, [editingExpense]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const renderContent = () => {
    switch(activeView) {
      case 'profile':
        return <ProfileView user={user} onUpdate={setUser} />;
      case 'calendar':
        return <RemindersView expenses={expenses} />;
      case 'registration':
        return <RegistrationView />;
      case 'dashboard':
      default:
        return (
          <>
            <AIInsights expenses={filteredExpenses} />
            <Dashboard 
              allExpenses={expenses} 
              viewDate={viewDate}
              onViewDateChange={setViewDate}
              onSync={() => handleSync(true)}
              isSyncing={syncing}
              syncStatus={syncStatus}
            />
            <div ref={formRef}>
              <ExpenseForm 
                onAdd={addExpense} 
                onUpdate={updateExpense} 
                editingExpense={editingExpense} 
                onCancelEdit={() => setEditingExpense(null)}
              />
            </div>
            <div className="mt-8">
               <ExpenseList 
                 expenses={filteredExpenses} 
                 onDelete={deleteExpense} 
                 onEdit={(e) => {
                   setEditingExpense(e);
                   formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                 }} 
               />
            </div>
          </>
        );
    }
  };

  const getViewTitle = () => {
    switch(activeView) {
      case 'calendar': return 'Calendário';
      case 'registration': return 'Cadastros';
      case 'profile': return 'Meu Perfil';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen transition-colors duration-500 overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeView={activeView} 
        setActiveView={setActiveView}
        user={user}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-24'}`}>
        <SyncModal 
          isOpen={isSyncModalOpen} 
          onClose={() => setIsSyncModalOpen(false)} 
          onSave={(url) => { setSheetUrl(url); setIsSyncModalOpen(false); handleSync(true); }}
          currentUrl={sheetUrl}
        />

        <header className="glass-header sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 md:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <span className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">
                {getViewTitle()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
               <div className="flex flex-col items-end mr-2 hidden sm:flex">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestão de Finanças</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{user.name.split(' ')[0]}</span>
               </div>

              <button 
                onClick={toggleTheme}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
                title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button 
                onClick={() => setIsSyncModalOpen(true)}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          {renderContent()}
        </main>

        <footer className="mt-24 py-12 text-center text-slate-400 dark:text-slate-600 text-sm border-t border-white/10">
          <p className="font-medium tracking-tight">ZenFinanças &copy; 2024 - Clarity in your pocket.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
