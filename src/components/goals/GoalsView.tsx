import React, { useState } from 'react';
import { Plus, Target, TrendingUp, Calendar, ArrowRight, ShieldCheck, Zap, MoreVertical, X } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';

export const GoalsView = () => {
  const { goals, addGoal } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();

  const onSubmit = async (data: any) => {
    const newGoal = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      currentAmount: Number(data.currentAmount) || 0,
      targetAmount: Number(data.targetAmount),
      color: data.color || '#2563eb'
    };
    await addGoal(newGoal);
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Metas Financeiras</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-all"
        >
          <Plus size={18} />
          Nova Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <motion.div 
              key={goal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card flex flex-col gap-6 relative overflow-hidden"
            >
              <div 
                className="absolute shadow-[0_0_40px_rgba(0,0,0,0.05)] -top-4 -right-4 w-24 h-24 rounded-full opacity-10"
                style={{ backgroundColor: goal.color }}
              />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: goal.color }}
                  >
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{goal.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{goal.category}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-brand"><MoreVertical size={20} /></button>
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-slate-900">{formatCurrency(goal.currentAmount)}</span>
                  <span className="text-sm font-bold text-slate-400">Objetivo: {formatCurrency(goal.targetAmount)}</span>
                </div>
                
                <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full rounded-full transition-all duration-1000 shadow-sm"
                    style={{ backgroundColor: goal.color }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Progresso</span>
                  <span style={{ color: goal.color }}>{Math.round(progress)}% Concluído</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Faltam</span>
                    <span className="text-sm font-bold text-success">{formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                  </div>
                <button className="text-brand font-bold text-xs flex items-center gap-1 hover:translate-x-1 transition-transform">
                  Detalhes <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}

         <div 
          onClick={() => setIsModalOpen(true)}
          className="premium-card border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-brand/40 hover:bg-slate-50 transition-all py-12"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-brand/10 text-slate-400 group-hover:text-brand flex items-center justify-center transition-all">
            <Plus size={32} />
          </div>
          <span className="font-bold text-slate-400 group-hover:text-slate-600">Criar nova meta</span>
        </div>
      </div>

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
                <h2 className="text-xl font-bold tracking-tight">Nova Meta</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Nome da Meta</label>
                  <input 
                    {...register('name', { required: true })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-medium focus:ring-2 focus:ring-brand/20 outline-none"
                    placeholder="Ex: Viagem, Carro Novo..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Valor Objetivo</label>
                    <input 
                      type="number"
                      {...register('targetAmount', { required: true })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-lg focus:ring-2 focus:ring-brand/20 outline-none"
                      placeholder="0,00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Valor Atual</label>
                    <input 
                      type="number"
                      {...register('currentAmount')}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-lg focus:ring-2 focus:ring-brand/20 outline-none"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Categoria</label>
                  <input 
                    {...register('category')}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-medium focus:ring-2 focus:ring-brand/20 outline-none"
                    placeholder="Ex: Viagem, Sonhos..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Cor</label>
                  <div className="flex gap-2">
                    {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => reset({ ...watch(), color })}
                          className={`w-10 h-10 rounded-full border-4 ${watch('color') === color ? 'border-brand/20' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all"
                >
                  Criar Meta
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
