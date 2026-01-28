
import React from 'react';
import { UserProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeView: string;
  setActiveView: (view: any) => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activeView, setActiveView, user }) => {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Início', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'calendar', 
      label: 'Calendário', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'registration', 
      label: 'Cadastros', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Meu Perfil', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 glass-card border-r border-white/20 dark:border-slate-800/40 flex flex-col ${
        isOpen ? 'w-72' : 'w-0 -translate-x-full md:w-24 md:translate-x-0'
      }`}
      onMouseEnter={() => window.innerWidth > 768 && setIsOpen(true)}
      onMouseLeave={() => window.innerWidth > 768 && setIsOpen(false)}
    >
      <div className="p-8 pb-4 flex items-center space-x-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-indigo-500/30">
          Z
        </div>
        {isOpen && <span className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">ZenFinanças</span>}
      </div>

      {/* Perfil Compacto no Menu */}
      <div className={`mt-6 px-4 mb-4 transition-all ${isOpen ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}>
        <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800/50 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-slate-700/80 p-1.5 flex items-center justify-center">
            <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-black text-slate-800 dark:text-white truncate">{user.name}</span>
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Dono da Carteira</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center p-4 rounded-2xl transition-all group ${
              activeView === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                : 'text-slate-500 hover:bg-indigo-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className={`${isOpen ? 'mr-4' : 'mx-auto'}`}>
              {item.icon}
            </div>
            {isOpen && <span className="font-bold tracking-tight text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-8 mt-auto">
        <div className={`p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center ${isOpen ? 'space-x-3' : 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Plano Pro Ativo</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
