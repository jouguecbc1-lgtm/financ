import React, { useState } from 'react';
import { Plus, CreditCard as CardIcon, Calendar, ArrowRight, ShieldCheck, Zap, X } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';

export const CardsView = () => {
  const { cards, addCard } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();

  const onSubmit = async (data: any) => {
    const newCard = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      limit: Number(data.limit),
      availableLimit: Number(data.limit), // Initial available limit is the same
      closingDay: Number(data.closingDay),
      dueDay: Number(data.dueDay),
      color: data.color || '#820ad1'
    };
    await addCard(newCard);
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meus Cartões</h1>
          <p className="text-slate-500 font-medium text-sm">Gerencie seus limites e faturas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-brand/20 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          Novo Cartão
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <motion.div 
            key={card.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Visual Card */}
             <div 
              style={{ backgroundColor: card.color }}
              className="aspect-[1.58/1] w-full rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <span className="font-medium text-lg uppercase tracking-widest opacity-80">{card.name}</span>
                <CardIcon size={32} strokeWidth={1.5} />
              </div>

              <div className="space-y-1 relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Número do Cartão</p>
                <p className="text-2xl font-mono tracking-[0.2em]">•••• •••• •••• {card.lastDigits}</p>
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Limite Disponível</p>
                  <p className="text-xl font-bold">{formatCurrency(card.availableLimit)}</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Vence dia</p>
                    <p className="text-sm font-bold">{card.dueDay}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="premium-card p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Limite Total</span>
                <span className="font-bold text-slate-900">{formatCurrency(card.limit)}</span>
              </div>
              <div className="premium-card p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comprometido</span>
                <span className="font-bold text-rose-500">{formatCurrency(card.limit - card.availableLimit)}</span>
              </div>
            </div>

            {/* Card Actions/Status */}
            <div className="premium-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                   <h4 className="font-bold text-sm">Fatura Aberta</h4>
                   <p className="text-xs text-slate-400 font-medium">Vencimento em {card.dueDay}/05</p>
                </div>
                <button className="ml-auto text-brand font-bold text-sm">Detalhes</button>
              </div>
              <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-1000" 
                  style={{ width: `${(card.availableLimit / card.limit) * 100}%` }} 
                />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Card Placeholder */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="aspect-[1.58/1] w-full rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-brand/40 hover:bg-slate-50 transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-brand/10 text-slate-400 group-hover:text-brand flex items-center justify-center transition-all">
            <Plus size={32} />
          </div>
          <span className="font-bold text-slate-400 group-hover:text-slate-600">Adicionar novo cartão</span>
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
                <h2 className="text-xl font-bold tracking-tight">Novo Cartão</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Nome do Cartão (Apelido)</label>
                  <input 
                    {...register('name', { required: true })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-medium focus:ring-2 focus:ring-brand/20 outline-none"
                    placeholder="Ex: Nubank, Inter..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Últimos 4 Dígitos</label>
                    <input 
                      {...register('lastDigits', { required: true, maxLength: 4 })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-lg focus:ring-2 focus:ring-brand/20 outline-none"
                      placeholder="1234"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Limite Total</label>
                    <input 
                      type="number"
                      {...register('limit', { required: true })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-lg focus:ring-2 focus:ring-brand/20 outline-none"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Dia de Fechamento</label>
                    <input 
                      type="number"
                      {...register('closingDay', { required: true, min: 1, max: 31 })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-brand/20 outline-none"
                      placeholder="Ex: 5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Dia de Vencimento</label>
                    <input 
                      type="number"
                      {...register('dueDay', { required: true, min: 1, max: 31 })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-brand/20 outline-none"
                      placeholder="Ex: 12"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Cor do Cartão</label>
                  <div className="flex gap-2">
                    {['#820ad1', '#ff5f00', '#2563eb', '#109310', '#000000'].map(color => (
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
                  Criar Cartão
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
