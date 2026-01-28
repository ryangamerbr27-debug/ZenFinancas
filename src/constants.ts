
import { CategoryType, PaymentMethod, Expense } from './types';

export const COLORS = {
  [CategoryType.REVENUE]: '#10b981', // Emerald
  [CategoryType.FIXED]: '#6366f1', // Indigo
  [CategoryType.VARIABLE]: '#f59e0b', // Amber
  [CategoryType.LIFESTYLE]: '#ec4899', // Pink
  [CategoryType.INVESTMENT]: '#8b5cf6', // Violet
};

export const INITIAL_EXPENSES: Expense[] = [
  { id: '1', description: 'Salário Mensal', amount: 5000, category: CategoryType.REVENUE, paymentMethod: PaymentMethod.PIX, date: new Date().toISOString() },
  { id: '2', description: 'Aluguel', amount: 1500, category: CategoryType.FIXED, paymentMethod: PaymentMethod.PIX, date: new Date().toISOString() },
  { id: '3', description: 'Supermercado', amount: 800, category: CategoryType.VARIABLE, paymentMethod: PaymentMethod.DEBIT_CARD, date: new Date().toISOString() },
  { id: '4', description: 'Tesouro Direto', amount: 500, category: CategoryType.INVESTMENT, paymentMethod: PaymentMethod.CASH, date: new Date().toISOString() },
];
