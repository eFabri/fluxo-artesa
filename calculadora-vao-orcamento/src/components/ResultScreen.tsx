import { motion } from 'framer-motion';
import { ThreadNumber } from './ThreadNumber';
import { DoorIcon } from './icons/DoorIcon';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { VaoResult, PortasResult } from '../data/types';

const PORTAS = [
  { key: 'busca'   as const, label: 'Porta da Busca'   },
  { key: 'vitrine' as const, label: 'Porta da Vitrine' },
  { key: 'retorno' as const, label: 'Porta do Retorno' },
];

const doorVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
};

interface ResultScreenProps {
  nome: string;
  vao: VaoResult;
  portas: PortasResult;
  whatsappUrl: string;
}

export function ResultScreen({ nome, vao, portas, whatsappUrl }: ResultScreenProps) {
  const reduce = useReducedMotion();

  const fechadas = PORTAS.filter(p => !portas[p.key]).length;

  const closingCopy =
    fechadas >= 2
      ? `${nome}, seu ateliê está perdendo esse valor porque ${fechadas} das suas 3 portas estão fechadas.`
      : `${nome}, suas portas estão bem encaminhadas — o vazamento vem de outro lugar. Vale entender melhor onde.`;

  return (
    <div className="min-h-screen bg-ink-navy text-linen flex flex-col items-center px-5 pt-10 pb-10">
      {/* Heading */}
      <motion.h1
        className="font-display text-2xl font-semibold text-center mb-8 leading-snug text-linen"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {nome}, aqui está o seu diagnóstico
      </motion.h1>

      {/* Vão do Orçamento */}
      <motion.div
        className="w-full max-w-sm mb-10"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ThreadNumber mensal={vao.mensal} anual={vao.anual} />
      </motion.div>

      {/* 3 Portas */}
      <div className="w-full max-w-sm grid grid-cols-3 gap-4 mb-8">
        {PORTAS.map((p, i) => (
          <motion.div
            key={p.key}
            className="flex flex-col items-center gap-2"
            custom={i}
            variants={reduce ? undefined : doorVariants}
            initial={reduce ? undefined : 'hidden'}
            animate={reduce ? undefined : 'visible'}
          >
            <DoorIcon isOpen={portas[p.key]} size={48} />
            <span className="font-body text-xs text-linen/60 text-center leading-tight">
              {p.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Dynamic closing copy */}
      <motion.p
        className="font-body text-base text-linen/80 text-center leading-relaxed max-w-xs mb-8"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 + PORTAS.length * 0.15, duration: 0.5 }}
      >
        {closingCopy}
      </motion.p>

      {/* CTA */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-sm py-4 bg-thread-gold text-ink-navy font-body font-semibold text-lg rounded-xl text-center hover:brightness-110 active:scale-95 transition-all duration-150 block"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      >
        Quero minha análise em vídeo, grátis
      </motion.a>

      {/* Footer: Euler signature */}
      <motion.div
        className="flex items-center gap-3 mt-8"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.4 }}
      >
        <img
          src="https://res.cloudinary.com/def9lnal7/image/upload/v1785419996/ChatGPT_Image_30_de_jul._de_2026_10_58_59_1_csqp3t.webp"
          alt="Euler Fabri"
          className="w-28 h-28 rounded-full"
          loading="lazy"
        />
        <p className="font-body text-sm text-linen/80 leading-snug">
          Euler Fabri — Especialista em Presença Digital para Negócios
        </p>
      </motion.div>
    </div>
  );
}
