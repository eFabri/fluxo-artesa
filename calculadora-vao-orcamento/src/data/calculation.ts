import type { VaoResult, PortasResult } from './types';

const P2: Record<string, number> = {
  nenhuma: 0, '1_a_3': 2, '4_a_10': 7, mais_de_10: 12, perdi_conta: 10,
};
const P3: Record<string, number> = {
  ate_200: 150, '200_500': 350, '500_1000': 750, acima_1000: 1200,
};

export function calcularVao(p2: string, p3: string): VaoResult {
  const mensal = (P2[p2] ?? 0) * (P3[p3] ?? 0);
  return { mensal, anual: mensal * 12 };
}

export function calcularPortas(p4: string, p5: string): PortasResult {
  const temSite = p5 === 'site_proprio';
  return {
    busca:   p4 === 'meu_atelie',
    vitrine: temSite,
    retorno: temSite,
  };
}

export function gerarLinkWhatsApp(
  nome: string,
  instagram: string,
  cidade: string,
  vaoMensal: number,
): string {
  const handle = instagram.startsWith('@') ? instagram.slice(1) : instagram;
  const msg =
    `Oi, Euler! Sou ${nome}, do ateliê @${handle}, de ${cidade}.\n\n` +
    `Acabei de fazer o diagnóstico e meu Vão do Orçamento deu R$ ${vaoMensal}/mês.\n\n` +
    `Quero receber minha análise em vídeo!`;
  return `https://wa.me/5531986753530?text=${encodeURIComponent(msg)}`;
}
