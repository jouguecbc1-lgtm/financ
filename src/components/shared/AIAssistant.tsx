import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Loader2, RefreshCcw } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { getFinancialAdvice } from '../../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export const AIAssistant = () => {
  const { transactions, accounts, goals, investments } = useFinanceStore();
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(transactions, accounts, goals, investments);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="premium-card bg-gradient-to-br from-brand/5 to-indigo-50 border-brand/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Assistente Finanzo AI</h3>
          <p className="text-xs text-slate-500 font-medium tracking-tight">Consultoria personalizada baseada nos seus dados.</p>
        </div>
        <button 
          onClick={fetchAdvice}
          disabled={loading}
          className="ml-auto p-2 text-brand hover:bg-brand/10 rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCcw size={20} className={cn(loading && "animate-spin")} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!advice && !loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-brand/5">
              <Sparkles className="text-brand/40" />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-6">Clique no botão para gerar uma análise inteligente das suas finanças.</p>
            <button 
              onClick={fetchAdvice}
              className="bg-brand text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 transition-all"
            >
              Analisar agora
            </button>
          </motion.div>
        ) : loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 flex flex-col items-center justify-center gap-4"
          >
            <Loader2 className="text-brand animate-spin" size={32} />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Consultando algoritmos financeiros...</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
             <div className="bg-white/60 p-6 rounded-2xl border border-white/40 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 font-medium">
                {advice}
             </div>
             <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-tighter italic">* As dicas da IA são sugestões baseadas nos dados fornecidos e não substituem consultoria profissional.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
