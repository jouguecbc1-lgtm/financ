import { GoogleGenAI } from "@google/genai";
import { Transaction, Account, Goal, Investment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getFinancialAdvice = async (
  transactions: Transaction[],
  accounts: Account[],
  goals: Goal[],
  investments: Investment[]
) => {
  if (!process.env.GEMINI_API_KEY) {
    return "Configuração AI ausente. Adicione sua chave para receber conselhos.";
  }

  const prompt = `
    Você é um assistente financeiro pessoal premium chamado Finanzo AI.
    Analise os seguintes dados e forneça 3 dicas práticas e curtas para o usuário economizar ou investir melhor. 
    Responda em Português do Brasil com um tom profissional e motivador.

    Dados Atuais:
    - Saldo em Contas: ${accounts.reduce((a, b) => a + b.balance, 0)}
    - Transações Recentes: ${transactions.slice(0, 10).map(t => `${t.description}: ${t.amount} (${t.type})`).join(', ')}
    - Metas Atuais: ${goals.map(g => `${g.name}: ${g.currentAmount}/${g.targetAmount}`).join(', ')}
    - Total Investido: ${investments.reduce((a, b) => a + b.amount, 0)}

    Formate sua resposta em 3 blocos numerados.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, tive um problema ao analisar seus dados agora. Tente novamente em breve.";
  }
};
