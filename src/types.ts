/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  paymentMethod: string;
  accountId: string;
  cardId?: string;
  installments?: number;
  currentInstallment?: number;
  isRecurring: boolean;
  status: 'PAID' | 'PENDING';
  notes?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CreditCard {
  id: string;
  name: string;
  lastDigits: string;
  limit: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: string;
  color: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'SAVINGS' | 'CDB' | 'TREASURY' | 'STOCKS' | 'FUNDS' | 'CRYPTO';
  amount: number;
  yield: number;
  startDate: string;
  history: { date: string; value: number }[];
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'CHECKING' | 'SAVINGS' | 'CASH' | 'INVESTMENT';
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  userName: string;
  primaryColor: string;
}
