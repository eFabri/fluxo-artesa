import { motion, useReducedMotion } from 'framer-motion';

interface OpeningScreenProps {
  onStart: () => void;
}

export function OpeningScreen({ onStart }: OpeningScreenProps) {
  const reduce = useReducedMotion();

  const fadeIn = reduce
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 } };

  return (
    <div className="min-h-screen bg-ink-navy flex flex-col items-center justify-between px-6 py-10 text-linen">
      {/* Top: Euler image + headline */}
      <div className="w-full max-w-md flex flex-col items-center gap-6 pt-4">
        <div className="relative w-64 h-64 overflow-hidden rounded-2xl shadow-2xl">
          <img
            src="https://res.cloudinary.com/def9lnal7/image/upload/v1785419996/ChatGPT_Image_30_de_jul._de_2026_10_59_00_3_qgsgnx.webp"
            alt="Euler Fabri"
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <motion.div
          className="text-center"
          {...fadeIn}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-semibold leading-tight text-linen">
            Quanto dinheiro seu ateliê está{' '}
            <em className="not-italic text-thread-gold">perdendo</em>{' '}
            por mês?
          </h1>
          <p className="mt-3 font-body text-linen/70 text-base leading-relaxed">
            Responda 7 perguntas e descubra o seu Vão do Orçamento — a diferença entre o que você
            fatura e o que poderia faturar.
          </p>
        </motion.div>
      </div>

      {/* Bottom: CTA */}
      <motion.div
        className="w-full max-w-md"
        {...fadeIn}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <button
          onClick={onStart}
          className="w-full py-4 bg-thread-gold text-ink-navy font-body font-semibold text-lg rounded-xl hover:brightness-110 active:scale-95 transition-all duration-150"
        >
          Descobrir meu Vão do Orçamento
        </button>
        <p className="mt-3 text-center font-body text-linen/40 text-xs">
          por Euler Fabri — Especialista em Presença Digital para Negócios
        </p>
      </motion.div>
    </div>
  );
}
