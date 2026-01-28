
import React, { useState } from 'react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  currentUrl: string;
}

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose, onSave, currentUrl }) => {
  const [url, setUrl] = useState(currentUrl);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Código copiado! Lembre-se de criar uma 'Nova Implantação' no Google.");
  };

  const scriptCode = `function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(30000); // 30 segundos de espera para segurança total
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Financeiro');
    if (!sheet) sheet = ss.insertSheet('Financeiro');
    
    const contents = JSON.parse(e.postData.contents);
    const data = contents.data;
    
    // LIMPEZA TOTAL DA PLANILHA (Resolve o erro de duplicidade)
    sheet.clear(); 
    
    const headers = ["ID", "Data", "Descrição", "Categoria", "Pagamento", "Valor"];
    sheet.getRange(1, 1, 1, headers.length)
         .setValues([headers])
         .setBackground("#f1f5f9")
         .setFontWeight("bold");
    
    if (data && data.length > 0) {
      const rows = data.map(item => [
        item.ID, 
        item.Data, 
        item.Descricao, 
        item.Categoria, 
        item.Pagamento, 
        item.Valor
      ]);
      
      // ESCRITA EM BLOCO (Substitui tudo de uma vez)
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      
      // Formatação básica
      sheet.getRange(2, 6, rows.length, 1).setNumberFormat("R$ #,##0.00");
      sheet.setFrozenRows(1);
    }
    
    SpreadsheetApp.flush(); // Força a gravação imediata
    return ContentService.createTextOutput("Sincronizado");
  } catch (err) {
    return ContentService.createTextOutput("Erro: " + err.message);
  } finally {
    lock.releaseLock();
  }
}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Conexão com a Nuvem</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">Resolva duplicidades e sincronize seus dados.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400 dark:text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 ml-1">URL do Webhook</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://script.google.com/..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all text-sm bg-slate-50/50 dark:bg-slate-900/50 font-medium text-slate-700 dark:text-white"
              />
            </div>
            
            <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800 dark:border-slate-900">
              <div className="flex justify-between items-center px-5 py-3 bg-slate-800/50 dark:bg-slate-900/50">
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.2em]">Código do Script</span>
                <button 
                  onClick={() => copyToClipboard(scriptCode)}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1.5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Copiar Script</span>
                </button>
              </div>
              <div className="p-5 max-h-40 overflow-y-auto font-mono text-[10px] text-indigo-200/70 dark:text-indigo-400/50 leading-relaxed scrollbar-hide">
                <pre>{scriptCode}</pre>
              </div>
            </div>
            
            <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl">
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">Passo Crucial para evitar duplicatas:</h4>
                  <p className="text-xs text-rose-700/80 dark:text-rose-400/80 leading-relaxed mt-1">
                    No Google Apps Script, após colar o código, você deve clicar em 
                    <strong className="text-rose-900 dark:text-rose-200"> Implantar &gt; Nova Implantação</strong>. 
                    Se você apenas salvar ou clicar em "Atualizar", o Google continuará rodando a versão antiga que causava duplicatas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 flex justify-end space-x-4 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
          >
            Fechar
          </button>
          <button 
            onClick={() => onSave(url)}
            className="px-10 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none hover:shadow-indigo-200 transition-all active:scale-95"
          >
            Salvar e Sincronizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncModal;
