import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';

import { Expense, UserProfile } from './types';
import { INITIAL_EXPENSES } from './constants';

import ExpensesForm from './components/ExpensesForm';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsights';
import ExpenseList from './components/ExpenseList';
import Sidebar from './components/Sidebar';
import RegistrationView from './components/RegistrationView';
import RemindersView from './components/RemindersView';
import ProfileView from './components/ProfileView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<
    'dashboard' | 'registration' | 'calendar' | 'profile'
  >('dashboard');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('zenfinancas_theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('zenfinancas_profile');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Gestor Zen',
          photoUrl:
            'https://cdn-icons-png.flaticon.com/512/2617/2617304.png'
        };
  });

  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [viewDate, setViewDate] = useState(new Date());
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] =
    useState<'idle' | 'success' | 'error'>('idle');

  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);

  const syncInProgress = useRef(false);
  const formRef = useRef<HTMLDivElement>(null);

  // 🔹 CARREGAR GASTOS DO NEON AO ABRIR O APP
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const res = await fetch('/api/get_gastos');
        if (!res.ok) return;

        const data = await res.json();
        if (Array.isArray(data)) {
          setExpenses(
            data.map((g: any) => ({
              id: g.id,
              description: g.descricao,
              date: g.data,
              category: g.categoria,
              paymentMethod: g.metodo_pagamento,
              amount: Number(g.valor)
            }))
          );
        }
      } catch (err) {
        console.error('Erro ao carregar gastos:', err);
      }
    };

    loadExpenses();
  }, []);

  // 🔹 SALVAR PERFIL
  useEffect(() => {
    localStorage.setItem(
      'zenfinancas_profile',
      JSON.stringify(user)
    );
  }, [user]);

  // 🔹 TEMA
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zenfinancas_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zenfinancas_theme', 'light');
    }
  }, [isDarkMode]);

  // 🔹 FILTRO POR MÊS
  const filteredExpenses = useMemo(() => {
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();

    return expenses.filter(e => {
      const d = new Date(e.date);
      return (
        d.getMonth() === month && d.getFullYear() === year
      );
    });
  }, [expenses, viewDate]);

  // 🔹 SINCRONIZAR COM NEON
  const handleSync = useCallback(async () => {
    if (syncInProgress.current) return;

    syncInProgress.current = true;
    setSyncing(true);
    setSyncStatus('idle');

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenses)
      });

      if (!res.ok) throw new Error();

      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 4000);
    } finally {
      setSyncing(false);
      syncInProgress.current = false;
    }
  }, [expenses]);

  // 🔹 CRUD LOCAL
  const addExpense = (
    newExpense: Omit<Expense, 'id'>
  ) => {
    const item: Expense = {
      ...newExpense,
      id:
        Math.random().toString(36).slice(2) +
        Date.now().toString().slice(-4)
    };

    setExpenses(prev =>
      [item, ...prev].sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
    );
  };

  const updateExpense = (expense: Expense) => {
    setExpenses(prev =>
      prev.map(e => (e.id === expense.id ? expense : e))
    );
    setEditingExpense(null);
  };

  const deleteExpense = useCallback(
    (id: string) => {
      if (!window.confirm('Deseja excluir este gasto?'))
        return;

      setExpenses(prev =>
        prev.filter(e => e.id !== id)
      );

      if (editingExpense?.id === id) {
        setEditingExpense(null);
      }
    },
    [editingExpense]
  );

  const toggleTheme = () => setIsDarkMode(v => !v);

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return (
          <ProfileView
            user={user}
            onUpdate={setUser}
          />
        );

      case 'calendar':
        return <RemindersView expenses={expenses} />;

      case 'registration':
        return <RegistrationView />;

      default:
        return (
          <>
            <AIInsights expenses={filteredExpenses} />

            <Dashboard
              allExpenses={expenses}
              viewDate={viewDate}
              onViewDateChange={setViewDate}
              onSync={handleSync}
              isSyncing={syncing}
              syncStatus={syncStatus}
            />

            <div ref={formRef}>
              <ExpensesForm
                onAdd={addExpense}
                onUpdate={updateExpense}
                editingExpense={editingExpense}
                onCancelEdit={() =>
                  setEditingExpense(null)
                }
              />
            </div>

            <div className="mt-8">
              <ExpenseList
                expenses={filteredExpenses}
                onDelete={deleteExpense}
                onEdit={e => {
                  setEditingExpense(e);
                  formRef.current?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        user={user}
      />

      <div
        className={`flex-1 ${
          isSidebarOpen ? 'md:ml-72' : 'md:ml-24'
        }`}
      >
        <main className="max-w-6xl mx-auto px-4 py-12">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
