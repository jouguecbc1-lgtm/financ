import React from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Globe, 
  Database, 
  Cloud, 
  HelpCircle,
  ChevronRight,
  LogOut,
  Trash2,
  Palette,
  Check
} from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { cn } from '../../lib/utils';

import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export const SettingsView = () => {
  const { settings, resetData, updateSettings } = useFinanceStore();
  const user = auth.currentUser;

  const themeColors = [
    { name: 'Azul Zen', value: '#2563eb' },
    { name: 'Esmeralda', value: '#059669' },
    { name: 'Roxo Real', value: '#7c3aed' },
    { name: 'Rosa Vibrante', value: '#e11d48' },
    { name: 'Laranja Solar', value: '#ea580c' },
    { name: 'Ardósia', value: '#334155' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Teal', value: '#0d9488' },
  ];

  const handleReset = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      resetData();
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const changeUserName = () => {
    const newName = prompt('Digite seu novo nome de usuário:', settings.userName);
    if (newName) updateSettings({ userName: newName });
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const changeCurrency = () => {
    const currencies = ['BRL', 'USD', 'EUR'];
    const currentIdx = currencies.indexOf(settings.currency);
    const nextIdx = (currentIdx + 1) % currencies.length;
    updateSettings({ currency: currencies[nextIdx] });
  };

  const sections = [
    { 
      title: 'Perfil', 
      items: [
        { label: 'Nome de Usuário', icon: User, value: settings.userName, action: changeUserName },
        { label: 'Alterar Email', icon: Mail, value: user?.email || '', description: 'E-mail vinculado ao Google' },
      ]
    },
    { 
      title: 'Conta', 
      items: [
        { label: 'Assinatura', icon: CreditCard, value: 'Plano Premium' },
        { label: 'Segurança e Senha', icon: Lock },
      ]
    },
    {
      title: 'Personalização',
      custom: (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-custom p-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Palette className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-semibold">Cor do Tema</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {themeColors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateSettings({ primaryColor: color.value })}
                className={cn(
                  "w-full aspect-square rounded-full flex items-center justify-center transition-all hover:scale-110",
                  settings.primaryColor === color.value ? "ring-2 ring-offset-2 ring-gray-300 shadow-lg" : "hover:shadow-md"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {settings.primaryColor === color.value && (
                  <Check size={16} className="text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>
      )
    },
    { 
      title: 'Aplicativo', 
      items: [
        { label: 'Notificações', icon: Bell, toggle: true, active: true },
        { label: 'Modo Escuro', icon: Moon, toggle: true, active: settings.theme === 'dark', action: toggleTheme },
        { label: 'Idioma', icon: Globe, value: settings.language === 'pt-BR' ? 'Português' : 'English' },
        { label: 'Moeda Principal', icon: Database, value: settings.currency, action: changeCurrency },
      ]
    },
    { 
      title: 'Avançado', 
      items: [
        { label: 'Zerar Todos os Dados', icon: Trash2, description: 'Apaga transações e reseta saldos.', danger: true, action: handleReset },
      ]
    },
    { 
      title: 'Sincronização', 
      items: [
        { label: 'Backup na Nuvem', icon: Cloud, description: 'Sincronize seus dados entre dispositivos.' },
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-2">
         <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl overflow-hidden">
           {user?.photoURL ? (
             <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
           ) : (
             <span className="text-3xl font-black text-brand">{(user?.displayName || settings.userName)[0]}</span>
           )}
         </div>
         <h2 className="text-2xl font-bold text-gray-900">{user?.displayName || settings.userName}</h2>
         <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{user?.email}</p>
      </div>

      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4">{section.title}</h3>
            {section.custom ? (
               section.custom
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-custom">
                {section.items?.map((item, idx) => (
                  <div 
                    key={item.label}
                    onClick={item.action}
                    className={cn(
                      "flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group",
                      idx !== section.items.length - 1 && "border-b border-gray-50 dark:border-gray-800"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        item.danger ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500" : "bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-brand"
                      )}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className={cn(
                          "text-sm font-semibold",
                          item.danger ? "text-rose-600 dark:text-rose-400" : "text-gray-700 dark:text-gray-200"
                        )}>{item.label}</p>
                        {item.description && <p className="text-[10px] text-gray-400 font-medium">{item.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && <span className="text-xs font-bold text-slate-400 dark:text-gray-500">{item.value}</span>}
                      {item.toggle ? (
                        <div className={cn(
                          "w-10 h-6 rounded-full transition-all relative p-1",
                          item.active ? "bg-brand" : "bg-slate-200 dark:bg-gray-700"
                        )}>
                          <div className={cn(
                            "w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                            item.active ? "ml-4" : "ml-0"
                          )} />
                        </div>
                      ) : (
                        <ChevronRight size={18} className="text-slate-200 dark:text-gray-700" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-colors"
      >
        <LogOut size={20} />
        Sair da Conta
      </button>

      <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">Zen Finance v1.0.4 • Made with ✨</p>
    </div>
  );
};
