
import { Expense } from "../types";

export const syncToGoogleSheets = async (url: string, expenses: Expense[]): Promise<boolean> => {
  if (!url) return false;
  
  try {
    // Ordenamos por data para que a planilha fique organizada visualmente
    const sortedData = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        data: sortedData.map(e => ({
          ID: e.id,
          Data: new Date(e.date).toLocaleDateString('pt-BR'),
          Descricao: e.description,
          Categoria: e.category,
          Pagamento: e.paymentMethod,
          Valor: e.amount
        }))
      }),
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao sincronizar com Google Sheets:", error);
    return false;
  }
};
