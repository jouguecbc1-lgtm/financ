import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useFinanceStore } from '../store/useFinanceStore';
import { firestoreService } from '../services/firestoreService';
import { doc, getDoc } from 'firebase/firestore';

export const useSyncFirestore = () => {
  const store = useFinanceStore();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        store.setLoading(true);

        // Check if user has settings document, if not, create it with defaults
        const settingsRef = doc(db, `users/${user.uid}/profile/settings`);
        const settingsSnap = await getDoc(settingsRef);
        if (!settingsSnap.exists()) {
          await firestoreService.saveSettings(user.uid, store.settings);
        }

        // Check if user has at least one account, if not create default
        const accountsRef = doc(db, `users/${user.uid}/accounts/default`);
        const accountsSnap = await getDoc(accountsRef);
        if (!accountsSnap.exists()) {
          await firestoreService.saveAccount(user.uid, {
            id: 'default',
            name: 'Conta Principal',
            balance: 0,
            type: 'CHECKING',
          });
        }

        // Set up subscriptions
        const unsubTransactions = firestoreService.subscribeTransactions(store.setTransactions);
        const unsubAccounts = firestoreService.subscribeAccounts(store.setAccounts);
        const unsubCards = firestoreService.subscribeCards(store.setCards);
        const unsubGoals = firestoreService.subscribeGoals(store.setGoals);
        const unsubInvestments = firestoreService.subscribeInvestments(store.setInvestments);
        const unsubSettings = firestoreService.subscribeSettings(store.setSettings);

        store.setLoading(false);

        return () => {
          unsubTransactions();
          unsubAccounts();
          unsubCards();
          unsubGoals();
          unsubInvestments();
          unsubSettings();
        };
      } else {
        // Clear store or handle logout
        store.setTransactions([]);
        store.setAccounts([]);
        store.setCards([]);
        store.setGoals([]);
        store.setInvestments([]);
        store.setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);
};
