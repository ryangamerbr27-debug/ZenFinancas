import { Expense } from "../types";

export const syncToNeon = async (expenses: Expense[]): Promise<boolean> => {
  try {
    // Ordenamos por data
    const sortedData = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Chamamos a nossa API interna da Vercel, não o Google Sheets
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: sortedData // Enviamos os dados para a API salvar no Neon
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error("Erro ao sincronizar com Neon Tech:", error);
    return false;
  }
};
