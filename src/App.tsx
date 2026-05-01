import React, { useState, useEffect } from 'react';
import { Shell } from './components/layout/Shell';
import { Dashboard } from './components/dashboard/Dashboard';
import { TransactionView } from './components/transactions/TransactionView';
import { CardsView } from './components/cards/CardsView';
import { GoalsView } from './components/goals/GoalsView';
import { InvestmentsView } from './components/investments/InvestmentsView';
import { ReportsView } from './components/reports/ReportsView';
import { useFinanceStore } from './store/useFinanceStore';
import { AnimatePresence, motion } from 'motion/react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { AuthView } from './components/auth/AuthView';
import { useSyncFirestore } from './hooks/useSyncFirestore';

import { SettingsView } from './components/settings/SettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const { isLoading: storeLoading, settings } = useFinanceStore();
  const [authLoading, setAuthLoading] = useState(true);

  useSyncFirestore();

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  useEffect(() => {
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      // Simple darkening/lightening logic (transparent overlays are better for simplicity if CSS allowed it easily)
      // For now just set the primary. If I want dark/light versions, I can use hex manipulation or just use the primary everywhere it fits.
      document.documentElement.style.setProperty('--primary-color-dark', settings.primaryColor + 'ee'); 
      document.documentElement.style.setProperty('--primary-color-light', settings.primaryColor + '20'); 
    }
  }, [settings.primaryColor]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionView />;
      case 'cards':
        return <CardsView />;
      case 'goals':
        return <GoalsView />;
      case 'investments':
        return <InvestmentsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center flex-col gap-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full"
        />
        <p className="text-gray-500 font-medium animate-pulse">Sincronizando com o banco de dados...</p>
      </div>
    );
  }

  return (
    <Shell activeTab={activeTab} onTabChange={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}

