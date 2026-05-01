import React from 'react';
import { Plus, TrendingUp, DollarSign, PieChart, Activity, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency } from '../../lib/utils';
import { motion } from 'motion/react';

export const InvestmentsView = () => {
  const { investments } = useFinanceStore();

  const mockInvestments = [
    { title: 'Tesouro Selic 2027', value: 15430.20, yield: 10.75, type: 'Renda Fixa', color: '#10b981' },
    { title: 'Ações Itaú (ITUB4)', value: 4200.50, yield: 5.2, type: 'Ações', color: '#f59e0b' },
    { title: 'Bitcoin', value: 2500.00, yield: 120.4, type: 'Cripto', color: '#f97316' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Portfólio de Investimentos</h2>
        </div>
        <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-all">
          <Plus size={18} />
          Novo Investimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="premium-card bg-slate-900 text-white md:col-span-2 lg:col-span-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-2">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patrimônio Investido</p>
                <h2 className="text-4xl font-black">{formatCurrency(22130.70)}</h2>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                   <ArrowUpRight size={18} />
                   <span>+12.4% este ano (R$ 2.400,00)</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl text-center min-w-[120px] transition-colors">
                  <div className="text-xs text-white/60 mb-1">Rendimento</div>
                  <div className="font-bold">1.2% /mês</div>
                </button>
                 <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl text-center min-w-[120px] transition-colors">
                  <div className="text-xs text-white/60 mb-1">Status</div>
                  <div className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Lucro</div>
                </button>
              </div>
            </div>
         </div>

         {mockInvestments.map((inv, index) => (
           <motion.div 
            key={inv.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="premium-card space-y-6"
           >
             <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                   <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: inv.color }}
                  >
                    <Activity size={20} />
                  </div>
                   <div>
                      <h4 className="font-bold text-sm">{inv.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{inv.type}</p>
                   </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl text-slate-400">
                  <ExternalLink size={16} />
                </div>
             </div>

             <div>
               <p className="text-2xl font-black text-slate-900">{formatCurrency(inv.value)}</p>
               <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs mt-1">
                 <ArrowUpRight size={14} />
                 <span>+{inv.yield}% total</span>
               </div>
             </div>

             <div className="w-full h-12 flex items-end gap-1 px-1">
                {[4, 7, 5, 8, 10, 6, 9, 12, 11, 13].map((val, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-slate-100 rounded-t-sm group-hover:bg-brand/20 transition-colors"
                    style={{ height: `${val * 8}%`, backgroundColor: i === 9 ? inv.color : undefined }}
                  />
                ))}
             </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
};
