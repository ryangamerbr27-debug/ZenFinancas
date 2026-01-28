
import React, { useState, useEffect } from 'react';
import { CategoryType, PaymentMethod, VoiceMapping } from '../types';
import Icon, { IconName } from './Icon';

const RegistrationView: React.FC = () => {
  const [newDesc, setNewDesc] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconName>('cart');
  const [savedVoices, setSavedVoices] = useState<VoiceMapping[]>(() => {
    const saved = localStorage.getItem('zenfinancas_voices');
    return saved ? JSON.parse(saved) : [
      { description: 'Aluguel', icon: 'home' },
      { description: 'Supermercado', icon: 'cart' },
      { description: 'Salário', icon: 'cash' },
      { description: 'Lazer', icon: 'leisure' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zenfinancas_voices', JSON.stringify(savedVoices));
  }, [savedVoices]);

  const ICON_LIST: IconName[] = [
    'home', 'cart', 'cash', 'leisure', 'food', 'health', 
    'transport', 'tech', 'energy', 'coffee', 'gift', 
    'bank', 'chart', 'fitness', 'video', 'maintenance'
  ];

  const addVoice = () => {
    if (newDesc && !savedVoices.find(v => v.description === newDesc)) {
      setSavedVoices([...savedVoices, { description: newDesc, icon: selectedIcon }]);
      setNewDesc('');
    }
  };

  const removeVoice = (desc: string) => {
    setSavedVoices(savedVoices.filter(v => v.description !== desc));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cadastro de Vozes */}
        <div className="glass-card p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">Iconografia de Vozes</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              {ICON_LIST.map(iconName => (
                <button 
                  key={iconName}
                  onClick={() => setSelectedIcon(iconName)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedIcon === iconName ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700'}`}
                  title={iconName}
                >
                  <Icon name={iconName} size={20} />
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <input 
                type="text" 
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="flex-1 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-4 focus:ring-indigo-500/20 text-sm font-bold"
                placeholder="Ex: Assinatura Netflix..."
              />
              <button 
                onClick={addVoice}
                className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all"
              >
                Cadastrar
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {savedVoices.map(voice => (
              <div key={voice.description} className="flex items-center space-x-3 bg-white dark:bg-slate-800/60 px-4 py-2 rounded-2xl text-xs font-bold border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:border-indigo-500/30">
                <div className="text-indigo-600 dark:text-indigo-400">
                  <Icon name={voice.icon} size={16} />
                </div>
                <span className="text-slate-700 dark:text-slate-200">{voice.description}</span>
                <button onClick={() => removeVoice(voice.description)} className="opacity-30 hover:opacity-100 p-0.5 text-rose-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Informações Auxiliares */}
        <div className="space-y-8">
           <div className="glass-card p-8 rounded-[2.5rem]">
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">Dica de Interface</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Selecione um ícone de interface que melhor represente sua categoria de gasto. Ícones padronizados ajudam o cérebro a identificar padrões de consumo rapidamente na sua lista principal.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationView;
