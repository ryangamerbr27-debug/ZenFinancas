
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdate: (updated: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ name, photoUrl });
    alert("Perfil atualizado com sucesso!");
  };

  const PRESET_AVATARS = [
    'https://cdn-icons-png.flaticon.com/512/2617/2617304.png', // Porquinho
    'https://cdn-icons-png.flaticon.com/512/3135/3135679.png', // Carteira
    'https://cdn-icons-png.flaticon.com/512/1043/1043438.png', // Cofre
    'https://cdn-icons-png.flaticon.com/512/3201/3201521.png', // Gráfico
    'https://cdn-icons-png.flaticon.com/512/2534/2534312.png'  // Diamante
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="glass-card p-12 rounded-[3.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="w-48 h-48 rounded-[3rem] bg-white/40 dark:bg-slate-800/40 flex items-center justify-center p-8 ring-8 ring-indigo-500/10 shadow-2xl transition-transform group-hover:scale-105 overflow-hidden">
                <img 
                  src={photoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="absolute inset-0 bg-indigo-600/20 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {PRESET_AVATARS.map((url, i) => (
                <button 
                  key={i} 
                  type="button" 
                  onClick={() => setPhotoUrl(url)}
                  className={`w-12 h-12 p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border-2 transition-all flex items-center justify-center ${photoUrl === url ? 'border-indigo-600 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:bg-white dark:hover:bg-slate-800'}`}
                >
                  <img src={url} alt="preset" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter mb-2">Seu Perfil Zen</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Personalize sua identidade financeira na plataforma.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Seu Nome de Exibição</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-4 focus:ring-indigo-500/20 text-slate-800 dark:text-white font-bold"
                  placeholder="Seu nome..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Link de Ícone Personalizado (URL)</label>
                <input 
                  type="text" 
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-4 focus:ring-indigo-500/20 text-slate-400 dark:text-slate-500 font-medium text-xs"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="px-10 py-4 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  Atualizar Identidade
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-[2.5rem] border-l-4 border-indigo-500">
           <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-2">Privacidade</h4>
           <p className="text-xs text-slate-500 leading-relaxed font-medium">Todas as suas configurações de perfil são salvas apenas no seu navegador. Nós não armazenamos seus dados pessoais em servidores externos.</p>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] border-l-4 border-emerald-500">
           <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-2">Personalização</h4>
           <p className="text-xs text-slate-500 leading-relaxed font-medium">Escolha ícones inanimados para manter uma interface limpa e profissional, focada exclusivamente na clareza dos seus números.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
