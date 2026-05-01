import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ArrowUpDown, 
  CreditCard, 
  Target, 
  TrendingUp, 
  Settings,
  Plus,
  X,
  PieChart
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
  [key: string]: any;
}

const NavItem = ({ icon: Icon, label, active, onClick, collapsed }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative w-full text-left",
      active 
        ? "nav-active font-medium" 
        : "text-gray-500 hover:bg-gray-100"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-brand" : "group-hover:text-brand")} />
    {!collapsed && <span className="whitespace-nowrap">{label}</span>}
  </button>
);

interface ShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Shell = ({ children, activeTab, onTabChange }: ShellProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'transactions', icon: ArrowUpDown, label: 'Transações' },
    { id: 'cards', icon: CreditCard, label: 'Cartões' },
    { id: 'goals', icon: Target, label: 'Metas' },
    { id: 'investments', icon: TrendingUp, label: 'Investimentos' },
    { id: 'reports', icon: PieChart, label: 'Relatórios' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-gray-200 p-4 transition-all duration-300 h-screen sticky top-0",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center gap-3 p-4 mb-4">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold">
            $
          </div>
          {!collapsed && <span className="text-xl font-bold tracking-tight">Zen Finance</span>}
        </div>

        <nav className="flex-1 space-y-1">
          {tabs.map((tab) => (
            <NavItem
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="mt-auto px-4 py-3 text-slate-400 hover:text-slate-600 flex items-center gap-3 transition-colors"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
            <ArrowUpDown className="w-5 h-5 rotate-90" />
          </motion.div>
          {!collapsed && <span className="text-sm font-medium">Recolher</span>}
        </button>
      </aside>

      {/* Mobile Page Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">$</span>
            </div>
            <span className="font-bold text-lg">Zen Finance</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
            <span className="text-xs font-bold text-slate-500">U</span>
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden p-6 pb-24 md:pb-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden glass fixed bottom-0 left-0 right-0 h-20 px-6 flex items-center justify-between z-30">
        {tabs.slice(0, 5).map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                active ? "text-brand" : "text-slate-400"
              )}
            >
              <tab.icon className={cn("w-6 h-6", active && "animate-pulse")} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      
      {/* Quick Add FAB (Mobile) */}
      <button 
        onClick={() => onTabChange('transactions')}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-brand text-white rounded-2xl shadow-xl shadow-brand/30 flex items-center justify-center z-30 hover:scale-110 active:scale-95 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};
