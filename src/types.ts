
export enum CategoryType {
  REVENUE = 'Receita',
  FIXED = 'Fixo',
  VARIABLE = 'Variável',
  LIFESTYLE = 'Diversos',
  INVESTMENT = 'Investimento'
}

export enum PaymentMethod {
  CASH = 'Dinheiro',
  PIX = 'Pix',
  CREDIT_CARD = 'Cartão de Crédito',
  DEBIT_CARD = 'Cartão de Débito'
}

export interface UserProfile {
  name: string;
  photoUrl: string;
}

export interface VoiceMapping {
  description: string;
  icon: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: CategoryType;
  paymentMethod: PaymentMethod;
  date: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
}
