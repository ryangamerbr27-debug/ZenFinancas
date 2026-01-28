
import React, { useState, useEffect } from 'react';
import { getFinancialInsights } from '../services/geminiService';
import { Expense } from '../types';

interface AIInsightsProps {
  expenses: Expense[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ expenses }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generateInsight = async () => {
    if (expenses.length === 0) return;
    setLoading(true);
    const result = await getFinancialInsights(expenses);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    generateInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl mb-12 overflow-hidden group">
      <div className="relative glass-card bg-white/10 dark:bg-slate-900/40 p-8 rounded-[2.5rem] text-white z-10 backdrop-blur-3xl border-0">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95l.1 10.456 4.777-4.777a1 1 0 111.414 1.414l-6.5 6.5a1 1 0 01-1.414 0l-6.5-6.5a1 1 0 011.414-1.414l4.777 4.777V2a1 1 0 011-1h.036z" clipRule="evenodd" />
              <path d="M17.45 6.187l-.803.803 4.752 4.753a1 1 0 01-1.414 1.414l-4.753-4.752-.803.803a1 1 0 01-1.414 0L8.5 4.713l-.803.803a1 1 0 11-1.414-1.414l1.51-1.51a1 1 0 011.414 0L13.5 6.887l.803-.803a1 1 0 011.414 0l1.51 1.51a1 1 0 010 1.414z" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-xl tracking-tight">Estrategista Zen</h3>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Insights via Gemini AI</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center space-x-4 py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
            <p className="text-white/80 text-sm font-medium italic animate-pulse">Consultando padrões e oráculos financeiros...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-white/95 leading-relaxed text-sm font-medium whitespace-pre-line bg-white/5 p-5 rounded-3xl border border-white/10">
              {insight || "Adicione seus gastos para que eu possa traçar sua jornada financeira ideal."}
            </div>
            <button 
              onClick={generateInsight}
              className="text-[10px] font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-2xl transition-all flex items-center space-x-2 active:scale-95"
            >
              <span>Recalcular Rota</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Luzes decorativas para o efeito glass */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px]"></div>
    </div>
  );
};

export default AIInsights;