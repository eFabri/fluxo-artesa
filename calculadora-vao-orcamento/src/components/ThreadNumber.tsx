import { useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function AnimatedCounter({ target, reduce }: { target: number; reduce: boolean | null }) {
  const motionVal = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) {
      if (ref.current) ref.current.textContent = formatBRL(target);
      return;
    }
    const controls = animate(motionVal, target, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: v => {
        if (ref.current) ref.current.textContent = formatBRL(Math.round(v));
      },
    });
    return controls.stop;
  }, [target, reduce, motionVal]);

  return <span ref={ref}>{formatBRL(0)}</span>;
}

interface ThreadNumberProps {
  mensal: number;
  anual: number;
}

export function ThreadNumber({ mensal, anual }: ThreadNumberProps) {
  const reduce = useReducedMotion();

  return (
    <div className="text-center">
      {/* stitching line above the number */}
      <div className="flex justify-center mb-2">
        <svg width="200" height="8" viewBox="0 0 200 8">
          <motion.line
            x1="0" y1="4" x2="200" y2="4"
            stroke="#B8934A"
            strokeWidth="1.5"
            strokeDasharray="5 3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 1.4, ease: 'easeOut' }}
          />
        </svg>
      </div>

      <div
        className="font-mono text-4xl font-semibold text-stitch-brick leading-none"
        data-testid="mensal-value"
      >
        <AnimatedCounter target={mensal} reduce={reduce} />
        <span className="font-body text-lg text-linen/70">/mês</span>
      </div>

      <div
        className="mt-2 font-mono text-xl text-linen/70"
        data-testid="anual-value"
      >
        <AnimatedCounter target={anual} reduce={reduce} />
        <span className="font-body text-sm text-linen/70">/ano</span>
      </div>

      <p className="mt-3 font-body text-xs text-linen/70">
        *estimativa com base nas suas respostas
      </p>

      {/* stitching line below */}
      <div className="flex justify-center mt-2">
        <svg width="200" height="8" viewBox="0 0 200 8">
          <motion.line
            x1="0" y1="4" x2="200" y2="4"
            stroke="#B8934A"
            strokeWidth="1.5"
            strokeDasharray="5 3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 1.4, delay: 0.2, ease: 'easeOut' }}
          />
        </svg>
      </div>
    </div>
  );
}
