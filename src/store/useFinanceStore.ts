import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, CreditCard, Goal, Investment, Account, Settings } from '../types';
import { firestoreService } from '../services/firestoreService';
import { auth } from '../lib/firebase';

interface FinanceState {
  transactions: Transaction[];
  cards: CreditCard[];
  goals: Goal[];
  investments: Investment[];
  accounts: Account[];
  settings: Settings;
  isLoading: boolean;
  
  // Actions to set bulk data from Firebase
  setTransactions: (t: Transaction[]) => void;
  setCards: (c: CreditCard[]) => void;
  setGoals: (g: Goal[]) => void;
  setInvestments: (i: Investment[]) => void;
  setAccounts: (a: Account[]) => void;
  setSettings: (s: Settings) => void;
  setLoading: (l: boolean) => void;

  addTransaction: (t: Transaction) => Promise<void>;
  updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  addCard: (c: CreditCard) => Promise<void>;
  updateCard: (id: string, c: Partial<CreditCard>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  
  addGoal: (g: Goal) => Promise<void>;
  updateGoal: (id: string, g: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  addInvestment: (i: Investment) => Promise<void>;
  updateInvestment: (id: string, i: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  
  updateAccount: (id: string, a: Partial<Account>) => Promise<void>;
  updateSettings: (s: Partial<Settings>) => Promise<void>;
  resetData: () => Promise<void>;
}

export const useFinanceStore = create<FinanceState>()(
  (set, get) => ({
    transactions: [],
    cards: [],
    goals: [],
    investments: [],
    accounts: [],
    isLoading: true,
    settings: {
      theme: 'light',
      currency: 'BRL',
      language: 'pt-BR',
      userName: 'Usuário',
      primaryColor: '#2563eb'
    },

    setTransactions: (transactions) => set({ transactions }),
    setCards: (cards) => set({ cards }),
    setGoals: (goals) => set({ goals }),
    setInvestments: (investments) => set({ investments }),
    setAccounts: (accounts) => set({ accounts }),
    setSettings: (settings) => set({ settings }),
    setLoading: (isLoading) => set({ isLoading }),

    addTransaction: async (t) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.saveTransaction(userId, t);
      
      // Update account balance
      const account = get().accounts.find(a => a.id === t.accountId);
      if (account) {
        await firestoreService.updateAccount(userId, account.id, {
          balance: account.balance + (t.type === 'INCOME' ? t.amount : -t.amount)
        });
      }
    },
    updateTransaction: async (id, updated) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.updateTransaction(userId, id, updated);
    },
    deleteTransaction: async (id) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.deleteTransaction(userId, id);
    },

    addCard: async (c) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.saveCard(userId, c);
    },
    updateCard: async (id, updated) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.updateCard(userId, id, updated);
    },
    deleteCard: async (id) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.deleteCard(userId, id);
    },

    addGoal: async (g) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.saveGoal(userId, g);
    },
    updateGoal: async (id, updated) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.updateGoal(userId, id, updated);
    },
    deleteGoal: async (id) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.deleteGoal(userId, id);
    },

    addInvestment: async (i) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.saveInvestment(userId, i);
    },
    updateInvestment: async (id, updated) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.updateInvestment(userId, id, updated);
    },
    deleteInvestment: async (id) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.deleteInvestment(userId, id);
    },

    updateAccount: async (id, updated) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await firestoreService.updateAccount(userId, id, updated);
    },
    updateSettings: async (updated) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const newSettings = { ...get().settings, ...updated };
      await firestoreService.saveSettings(userId, newSettings);
    },
    resetData: async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      // Ideally batch delete but let's just clear transactions and reset balances
      for (const t of get().transactions) {
        await firestoreService.deleteTransaction(userId, t.id);
      }
      for (const a of get().accounts) {
        await firestoreService.updateAccount(userId, a.id, { balance: 0 });
      }
      // Etc for other entities
    },
  })
);
