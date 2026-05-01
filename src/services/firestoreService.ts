import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { Transaction, Account, Investment, Goal, CreditCard, Settings } from '../types';

export const firestoreService = {
  // Sync functions
  subscribeTransactions: (callback: (transactions: Transaction[]) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};
    
    const q = query(collection(db, `users/${userId}/transactions`));
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => doc.data() as Transaction);
      callback(transactions);
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${userId}/transactions`));
  },

  subscribeAccounts: (callback: (accounts: Account[]) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};
    
    const q = query(collection(db, `users/${userId}/accounts`));
    return onSnapshot(q, (snapshot) => {
      const accounts = snapshot.docs.map(doc => doc.data() as Account);
      callback(accounts);
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${userId}/accounts`));
  },

  subscribeInvestments: (callback: (investments: Investment[]) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};
    
    const q = query(collection(db, `users/${userId}/investments`));
    return onSnapshot(q, (snapshot) => {
      const investments = snapshot.docs.map(doc => doc.data() as Investment);
      callback(investments);
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${userId}/investments`));
  },

  subscribeGoals: (callback: (goals: Goal[]) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};
    
    const q = query(collection(db, `users/${userId}/goals`));
    return onSnapshot(q, (snapshot) => {
      const goals = snapshot.docs.map(doc => doc.data() as Goal);
      callback(goals);
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${userId}/goals`));
  },

  subscribeCards: (callback: (cards: CreditCard[]) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};
    
    const q = query(collection(db, `users/${userId}/cards`));
    return onSnapshot(q, (snapshot) => {
      const cards = snapshot.docs.map(doc => doc.data() as CreditCard);
      callback(cards);
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${userId}/cards`));
  },

  subscribeSettings: (callback: (settings: Settings) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};
    
    return onSnapshot(doc(db, `users/${userId}/profile/settings`), (doc) => {
      if (doc.exists()) {
        callback(doc.data() as Settings);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${userId}/profile/settings`));
  },

  // Write functions
  saveTransaction: async (userId: string, t: Transaction) => {
    try {
      await setDoc(doc(db, `users/${userId}/transactions`, t.id), { ...t, userId });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${userId}/transactions/${t.id}`);
    }
  },

  updateTransaction: async (userId: string, id: string, updated: Partial<Transaction>) => {
    try {
      await updateDoc(doc(db, `users/${userId}/transactions`, id), updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}/transactions/${id}`);
    }
  },

  deleteTransaction: async (userId: string, id: string) => {
    try {
      await deleteDoc(doc(db, `users/${userId}/transactions`, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${userId}/transactions/${id}`);
    }
  },

  saveAccount: async (userId: string, a: Account) => {
    try {
      await setDoc(doc(db, `users/${userId}/accounts`, a.id), { ...a, userId });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${userId}/accounts/${a.id}`);
    }
  },

  updateAccount: async (userId: string, id: string, updated: Partial<Account>) => {
    try {
      await updateDoc(doc(db, `users/${userId}/accounts`, id), updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}/accounts/${id}`);
    }
  },

  saveInvestment: async (userId: string, i: Investment) => {
    try {
      await setDoc(doc(db, `users/${userId}/investments`, i.id), { ...i, userId });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${userId}/investments/${i.id}`);
    }
  },

  updateInvestment: async (userId: string, id: string, updated: Partial<Investment>) => {
    try {
      await updateDoc(doc(db, `users/${userId}/investments`, id), updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}/investments/${id}`);
    }
  },

  deleteInvestment: async (userId: string, id: string) => {
    try {
      await deleteDoc(doc(db, `users/${userId}/investments`, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${userId}/investments/${id}`);
    }
  },

  saveGoal: async (userId: string, g: Goal) => {
    try {
      await setDoc(doc(db, `users/${userId}/goals`, g.id), { ...g, userId });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${userId}/goals/${g.id}`);
    }
  },

  updateGoal: async (userId: string, id: string, updated: Partial<Goal>) => {
    try {
      await updateDoc(doc(db, `users/${userId}/goals`, id), updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}/goals/${id}`);
    }
  },

  deleteGoal: async (userId: string, id: string) => {
    try {
      await deleteDoc(doc(db, `users/${userId}/goals`, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${userId}/goals/${id}`);
    }
  },

  saveCard: async (userId: string, c: CreditCard) => {
    try {
      await setDoc(doc(db, `users/${userId}/cards`, c.id), { ...c, userId });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${userId}/cards/${c.id}`);
    }
  },

  updateCard: async (userId: string, id: string, updated: Partial<CreditCard>) => {
    try {
      await updateDoc(doc(db, `users/${userId}/cards`, id), updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}/cards/${id}`);
    }
  },

  deleteCard: async (userId: string, id: string) => {
    try {
      await deleteDoc(doc(db, `users/${userId}/cards`, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${userId}/cards/${id}`);
    }
  },

  saveSettings: async (userId: string, s: Settings) => {
    try {
      await setDoc(doc(db, `users/${userId}/profile/settings`), { ...s, userId });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${userId}/profile/settings`);
    }
  }
};
