import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { TrendingUp, LogIn } from 'lucide-react';

export const AuthView = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center text-center space-y-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <TrendingUp size={32} />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Zen Finance</h1>
          <p className="text-gray-500 mt-2">Seu controle financeiro pessoal, agora na nuvem.</p>
        </div>

        <div className="space-y-4 w-full">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <LogIn size={20} />
            Entrar com Google
          </button>
          
          <p className="text-xs text-gray-400">
            Seus dados são armazenados com segurança no Google Cloud.
          </p>
        </div>
      </div>
    </div>
  );
};
