import React from 'react';
import { 
  FileText, 
  Download, 
  ChevronRight, 
  FileSpreadsheet, 
  FileJson,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency } from '../../lib/utils';
import { AIAssistant } from '../shared/AIAssistant';

export const ReportsView = () => {
  const { transactions } = useFinanceStore();

  const reports = [
    { title: 'Fluxo de Caixa Mensal', description: 'Visão detalhada de entradas e saídas do mês.', icon: FileText },
    { title: 'Gastos por Categoria', description: 'Acompanhamento de onde você gasta mais.', icon: FileSpreadsheet },
    { title: 'Evolução Patrimonial', description: 'Crescimento das suas contas e investimentos.', icon: TrendingUpIcon },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Relatórios e Exportação</h2>
        </div>
      </div>

      <AIAssistant />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.title} className="premium-card group cursor-pointer border-transparent hover:border-brand/20 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 group-hover:bg-brand/5 text-slate-400 group-hover:text-brand rounded-xl flex items-center justify-center transition-colors">
                <report.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 group-hover:text-brand transition-colors">{report.title}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">{report.description}</p>
                <div className="flex gap-3 mt-4 text-[10px]">
                   <button className="bg-slate-100 p-2 rounded-xl font-bold flex items-center gap-1 hover:bg-slate-200">
                     <Download size={12} /> PDF
                   </button>
                    <button className="bg-slate-100 p-2 rounded-xl font-bold flex items-center gap-1 hover:bg-slate-200">
                     <FileSpreadsheet size={12} /> XLSX
                   </button>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-brand transition-all group-hover:translate-x-1" size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

