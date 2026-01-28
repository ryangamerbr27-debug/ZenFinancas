
import { GoogleGenAI } from "@google/genai";
import { Expense } from "../types";

export const getFinancialInsights = async (expenses: Expense[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const expenseSummary = expenses.map(e => `${e.description}: R$ ${e.amount} (${e.category})`).join(', ');
  
  const prompt = `
    Como um consultor financeiro sênior, analise estes gastos mensais e forneça 3 dicas práticas e curtas em português para otimizar as finanças do usuário. 
    Seja amigável e motivador.
    Gastos: ${expenseSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Não foi possível gerar insights no momento. Continue acompanhando seus gastos!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com a inteligência artificial. Tente novamente mais tarde.";
  }
};
