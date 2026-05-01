import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar,
  Tag,
  CreditCard as CardIcon,
  MessageSquare,
  Repeat
} from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { TransactionType, Transaction } from '../../types';
import { CATEGORIES, PAYMENT_METHODS } from '../../constants';
import { formatCurrency, cn } from '../../lib/utils';

const transactionSchema = z.object({
  description: z.string().min(3, 'Descrição muito curta'),
  amount: z.number().positive('O valor deve ser positivo'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Selecione uma categoria'),
  date: z.string(),
  paymentMethod: z.string(),
  accountId: z.string(),
  cardId: z.string().optional(),
  isRecurring: z.boolean(),
  status: z.enum(['PAID', 'PENDING']),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export const TransactionView = () => {
  const { transactions, addTransaction, deleteTransaction, accounts, cards } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'EXPENSE',
      accountId: accounts[0]?.id || '',
      isRecurring: false,
      status: 'PAID',
    }
  });

  // Update accountId when accounts load
  React.useEffect(() => {
    if (accounts.length > 0 && !watch('accountId')) {
      setValue('accountId', accounts[0].id);
    }
  }, [accounts, setValue, watch]);

  const transactionType = watch('type');

  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    try {
      const newTransaction: Transaction = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      };
      await addTransaction(newTransaction);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Transações</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-all"
          >
            <Plus size={18} />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand/20 outline-none transition-all"
          />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(['ALL', 'INCOME', 'EXPENSE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-4 py-2 rounded-md text-xs font-bold transition-all",
                filterType === type ? "bg-white text-brand shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {type === 'ALL' ? 'Tudo' : type === 'INCOME' ? 'Receitas' : 'Despesas'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-custom">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="text-gray-400 font-medium bg-gray-50/50">
                <th className="p-4 border-b border-gray-100">Data</th>
                <th className="p-4 border-b border-gray-100">Descrição</th>
                <th className="p-4 border-b border-gray-100">Categoria</th>
                <th className="p-4 border-b border-gray-100 text-right">Valor</th>
                <th className="p-4 border-b border-gray-100 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <p className="text-gray-400 font-medium">Nenhuma transação encontrada.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <span className="text-gray-600">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          t.type === 'INCOME' ? "bg-emerald-50 text-success" : "bg-rose-50 text-danger"
                        )}>
                          {t.type === 'INCOME' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                        </div>
                        <span className="font-semibold text-gray-900">{t.description}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-medium text-gray-500">{t.category}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={cn(
                        "font-bold",
                        t.type === 'INCOME' ? "text-success" : "text-danger"
                      )}>
                        {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                       <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="text-gray-300 hover:text-danger p-2 transition-all opacity-0 group-hover:opacity-100"
                       >
                         <X size={16} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Nova Transação</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                {/* Type Toggle */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setValue('type', 'EXPENSE')}
                    className={cn(
                      "flex-1 py-3 rounded-[1.25rem] text-sm font-bold transition-all",
                      transactionType === 'EXPENSE' ? "bg-white text-rose-500 shadow-sm" : "text-slate-500"
                    )}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('type', 'INCOME')}
                    className={cn(
                      "flex-1 py-3 rounded-[1.25rem] text-sm font-bold transition-all",
                      transactionType === 'INCOME' ? "bg-white text-emerald-500 shadow-sm" : "text-slate-500"
                    )}
                  >
                    Receita
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 h-full"> {/* h-full avoids overlap when error appears */}
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Valor</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        {...register('amount', { valueAsNumber: true })}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-lg focus:ring-2 focus:ring-brand/20 outline-none transition-all placeholder:text-slate-300"
                        placeholder="0,00"
                      />
                    </div>
                    {errors.amount && <p className="text-rose-500 text-[10px] font-bold uppercase pl-1">{errors.amount.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Data</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                      <input 
                        type="date" 
                        {...register('date')}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-medium focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Descrição</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input 
                      type="text" 
                      {...register('description')}
                      placeholder="Ex: Almoço, Salário, Internet..."
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-medium focus:ring-2 focus:ring-brand/20 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  {errors.description && <p className="text-rose-500 text-[10px] font-bold uppercase pl-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Categoria</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                      <select 
                        {...register('category')}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-medium appearance-none focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                      >
                        <option value="">Selecione</option>
                        {CATEGORIES[transactionType].map(cat => (
                          <option key={cat.label} value={cat.label}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                   <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Pagamento</label>
                    <div className="relative">
                      <CardIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                      <select 
                        {...register('paymentMethod')}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-medium appearance-none focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                      >
                        {PAYMENT_METHODS.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox" 
                    id="isRecurring"
                    {...register('isRecurring')}
                    className="w-5 h-5 rounded border-slate-200 text-brand focus:ring-brand"
                  />
                  <label htmlFor="isRecurring" className="text-sm font-bold text-slate-600 cursor-pointer">Lançamento recorrente?</label>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processando...
                    </>
                  ) : (
                    'Confirmar Lançamento'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
