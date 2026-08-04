import { useRef, useEffect } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';
import { Check } from 'lucide-react';
import { ThreadNumber } from './ThreadNumber';
import { DoorIcon } from './icons/DoorIcon';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { VaoResult, PortasResult } from '../data/types';

const PROOF_IMAGES = [
  {
    src: 'https://res.cloudinary.com/def9lnal7/image/upload/v1785843640/compressed_Instagram_bio_page_Mimo_Berc%CC%A7o_202608040835_brkgxk.webp',
    alt: 'Perfil do Instagram do Mimo & Berço Enxovais, com 5,4 mil seguidores',
  },
  {
    src: 'https://res.cloudinary.com/def9lnal7/image/upload/v1785843640/compressed_Mobile_mockup_Instagram_Bio_page_202608040832_xub5sx.webp',
    alt: 'Perfil do Instagram do Ateliê Pequeno Urso, com 15,2 mil seguidores',
  },
  {
    src: 'https://res.cloudinary.com/def9lnal7/image/upload/v1785843640/compressed_Captura_de_Tela_2026-08-04_a%CC%80s_08_r9sjch.webp',
    alt: 'Perfil do Instagram do Ateliê Maria Barcelos, com 22,1 mil seguidores',
  },
  {
    src: 'https://res.cloudinary.com/def9lnal7/image/upload/v1785843640/compressed_Instagram_bio_mockup_screen_202608040832_jnxqpx.webp',
    alt: 'Perfil do Instagram do Ateliê Doce Ninho, com 15,4 mil seguidores',
  },
];

const VIDEO_BULLETS = [
  'Qual das suas portas abrir primeiro pra parar a perda esse mês',
  'Um plano específico pro SEU ateliê — não genérico',
  'Quanto tempo leva pra reverter isso, sem enrolação',
];

const PORTAS = [
  {
    key: 'busca' as const,
    label: 'Porta da Busca',
    descFechada: 'seu ateliê não aparece quando alguém procura no Google',
    descAberta:  'você aparece quando alguém procura no Google',
  },
  {
    key: 'vitrine' as const,
    label: 'Porta da Vitrine',
    descFechada: 'sua cliente não vê preço e modelo sem falar com você',
    descAberta:  'sua cliente já vê tudo sozinha, sem te chamar',
  },
  {
    key: 'retorno' as const,
    label: 'Porta do Retorno',
    descFechada: 'quem olhou e não comprou, você nunca mais alcança',
    descAberta:  'quem olhou e não comprou, você consegue reimpactar',
  },
];

// w-56 = 224px, gap-3 = 12px → each "slot" = 236px → 4 slots = 944px
const MARQUEE_DIST = PROOF_IMAGES.length * 236;

function ProofCarousel() {
  const reduce = useReducedMotion();
  const doubled = [...PROOF_IMAGES, ...PROOF_IMAGES];
  const xVal = useMotionValue(0);
  const controlsRef = useRef<{ pause(): void; play(): void; stop(): void } | null>(null);

  useEffect(() => {
    if (reduce !== false) return;
    const ctrl = animate(xVal, [0, -MARQUEE_DIST], {
      duration: 35,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });
    controlsRef.current = ctrl;
    return () => ctrl.stop();
  }, [reduce, xVal]);

  if (reduce !== false) {
    return (
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-3">
        {PROOF_IMAGES.map((img) => (
          <div key={img.src} className="snap-start shrink-0 w-56 h-44 rounded-lg overflow-hidden">
            <img src={img.src} alt={img.alt} className="h-full w-full object-contain" loading="lazy" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => controlsRef.current?.pause()}
      onMouseLeave={() => controlsRef.current?.play()}
      onTouchStart={() => controlsRef.current?.pause()}
      onTouchEnd={() => controlsRef.current?.play()}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-gradient-to-r from-ink-navy to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l from-ink-navy to-transparent" />
      <motion.div className="flex gap-3" style={{ x: xVal }}>
        {doubled.map((img, i) => (
          <div key={`${img.src}-${i}`} className="shrink-0 w-56 h-44 rounded-lg overflow-hidden">
            <img src={img.src} alt={img.alt} className="h-full w-full object-contain" loading="lazy" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

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
    fechadas === 3
      ? `${nome}, as 3 portas do seu ateliê estão fechadas — é por isso que esse valor está escapando todo mês.`
      : fechadas >= 1
        ? `${nome}, ${fechadas} das suas portas estão fechadas — é por ali que esse valor está escapando.`
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
        {nome}, descobrimos por que esse valor está escapando
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
      <div className="w-full max-w-sm grid grid-cols-3 gap-2 mb-10">
        {PORTAS.map((p, i) => {
          const isOpen = portas[p.key];
          const statusLabel = isOpen ? 'Aberta' : 'Fechada';
          const desc = isOpen ? p.descAberta : p.descFechada;
          return (
            <motion.div
              key={p.key}
              className="flex flex-col items-center gap-1 text-center"
              custom={i}
              variants={reduce ? undefined : doorVariants}
              initial={reduce ? undefined : 'hidden'}
              animate={reduce ? undefined : 'visible'}
            >
              <DoorIcon isOpen={isOpen} size={44} />
              <span className="font-body text-xs text-linen/60 leading-tight mt-1">
                {p.label}
              </span>
              <span
                className={`font-body text-xs font-semibold leading-none ${
                  isOpen ? 'text-sage-open' : 'text-stitch-brick'
                }`}
              >
                {statusLabel}
              </span>
              <span className="font-body text-xs text-linen/60 leading-snug">
                {desc}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-full max-w-sm border-t border-linen/20 mb-8" />

      {/* Dynamic closing copy */}
      <motion.p
        className="font-body text-base text-linen/80 text-center leading-relaxed max-w-xs mb-4"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 + PORTAS.length * 0.15, duration: 0.5 }}
      >
        {closingCopy}
      </motion.p>

      {/* Strategy promise — gradient text */}
      <motion.p
        className="font-display text-lg font-semibold text-center mb-6 max-w-xs leading-snug bg-gradient-to-r from-thread-gold to-sage-open bg-clip-text text-transparent"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 + PORTAS.length * 0.15, duration: 0.5 }}
      >
        Vou criar uma estratégia para seu Ateliê começar a ter novos pedidos todos os dias de clientes novos!
      </motion.p>

      {/* Value summary */}
      <motion.div
        className="w-full max-w-xs mb-8"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 + PORTAS.length * 0.15, duration: 0.5 }}
      >
        <p className="font-body text-xs uppercase tracking-wide text-linen/50 mb-3">
          No vídeo você vai descobrir:
        </p>
        <ul className="flex flex-col gap-2">
          {VIDEO_BULLETS.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <Check size={16} className="text-thread-gold shrink-0 mt-0.5" />
              <span className="font-body text-sm text-linen/80">{bullet}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Social proof carousel */}
      <motion.div
        className="w-full max-w-sm mb-8"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 + PORTAS.length * 0.15, duration: 0.5 }}
      >
        <p className="font-body text-xs uppercase tracking-wide text-linen/50 text-center mb-3">
          Ateliês que já têm vitrine e identidade sólida:
        </p>
        <ProofCarousel />
      </motion.div>

      {/* Result promise */}
      <motion.p
        className="font-body text-sm text-linen/70 text-center leading-relaxed max-w-xs mx-auto mb-4"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.05 + PORTAS.length * 0.15, duration: 0.5 }}
      >
        Todo ateliê que passa pelo diagnóstico e aplica o plano começa a receber pedidos no automático, sem depender só do WhatsApp.
      </motion.p>

      {/* Urgency */}
      <motion.p
        className="font-body text-xs text-linen/60 text-center mb-3"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 + PORTAS.length * 0.15, duration: 0.5 }}
      >
        Gravo essa análise pra 8 ateliês por semana — respondo por ordem de chegada.
      </motion.p>

      {/* CTA */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-sm py-4 bg-thread-gold text-ink-navy font-body font-semibold text-lg rounded-xl text-center hover:brightness-110 active:scale-95 transition-all duration-150 block"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 + PORTAS.length * 0.15, duration: 0.4 }}
      >
        Quero minha análise em vídeo, grátis
      </motion.a>

      {/* P.S. */}
      <motion.p
        className="font-body text-xs text-linen/50 text-center italic mt-4"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35 + PORTAS.length * 0.15, duration: 0.4 }}
      >
        P.S. — quanto mais cedo você começar, menos meses desse valor você perde.
      </motion.p>

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
