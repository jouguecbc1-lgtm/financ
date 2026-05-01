import React from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Plus, 
  TrendingUp,
  MoreVertical,
  ChevronRight,
  LayoutDashboard,
  ArrowUpDown,
  CreditCard,
  Target,
  PieChart,
  Settings
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { formatCurrency, cn } from '../../lib/utils';
import { useFinanceStore } from '../../store/useFinanceStore';

const SummaryCard = ({ title, value, type, trend }: { title: string, value: number, type: 'income' | 'expense' | 'balance', trend?: string }) => (
  <div className="premium-card flex flex-col gap-1">
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{title}</p>
    <h3 className={cn(
      "text-3xl font-bold",
      type === 'income' ? "text-success" : 
      type === 'expense' ? "text-danger" : "text-gray-900"
    )}>
      {formatCurrency(value)}
    </h3>
    {trend && (
      <div className="mt-4 flex items-center gap-2 text-xs font-medium">
        <span className={cn(
          "px-2 py-0.5 rounded",
          trend.startsWith('+') ? "bg-emerald-100 text-success" : "bg-rose-100 text-danger"
        )}>
          {trend} este mês
        </span>
      </div>
    )}
  </div>
);

export const Dashboard = () => {
  const { transactions, accounts, investments, goals } = useFinanceStore();

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.type === 'INCOME' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyExpenses = transactions
    .filter(t => t.type === 'EXPENSE' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0);

  const chartData = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Fev', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Abr', income: 2780, expense: 3908 },
    { name: 'Mai', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
  ];

  const categoriesData = [
    { name: 'Alimentação', value: 35, color: '#f87171' },
    { name: 'Moradia', value: 25, color: '#60a5fa' },
    { name: 'Transporte', value: 15, color: '#facc15' },
    { name: 'Lazer', value: 15, color: '#fb923c' },
    { name: 'Outros', value: 10, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Visão Geral</h2>
        </div>
        <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-all">
          <Plus size={18} />
          Nova Transação
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Saldo Total" value={totalBalance} type="balance" trend="+12%" />
        <SummaryCard title="Receitas (Março)" value={monthlyIncome} type="income" />
        <SummaryCard title="Despesas (Março)" value={monthlyExpenses} type="expense" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Evolution Chart */}
        <div className="lg:col-span-2 premium-card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Fluxo de Caixa</h3>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-brand" /> Receitas</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-400" /> Despesas</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#820ad1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#820ad1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(val) => `R$${val}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="premium-card flex flex-col gap-6">
          <h3 className="font-bold text-lg">Gastos por Categoria</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriesData} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categoriesData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
          <button className="mt-auto flex items-center justify-center gap-2 text-brand font-semibold text-sm py-3 bg-brand/5 rounded-xl hover:bg-brand/10 transition-colors">
            Ver Relatório Completo
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="premium-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Transações Recentes</h3>
            <button className="text-brand font-semibold text-sm hover:underline">Ver todas</button>
          </div>
          <div className="space-y-4">
            {transactions.length === 0 ? (
               <div className="py-8 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowUpDown className="text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Nenhuma transação recente.</p>
              </div>
            ) : (
              transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group">
                   <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      t.type === 'INCOME' ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                    )}>
                      {t.type === 'INCOME' ? <TrendingUp size={24} /> : <TrendingUp size={24} className="rotate-180" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{t.description}</h4>
                      <p className="text-xs text-slate-400 font-medium">{t.category}</p>
                    </div>
                   </div>
                   <div className="text-right">
                    <p className={cn("font-bold", t.type === 'INCOME' ? "text-emerald-500" : "text-rose-500")}>
                      {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Goals Progress */}
        <div className="premium-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Minhas Metas</h3>
            <button className="text-brand font-semibold text-sm hover:underline">Nova Meta</button>
          </div>
          <div className="space-y-6">
            {goals.map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm">{goal.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">Faltam {formatCurrency(goal.targetAmount - goal.currentAmount)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-brand">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-brand" 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
