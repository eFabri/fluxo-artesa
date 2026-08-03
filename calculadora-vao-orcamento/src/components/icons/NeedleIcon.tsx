import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function NeedleIcon({ size = 40 }: { size?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* needle body */}
      <motion.path
        d="M12 3 L6 21"
        stroke="#B8934A"
        strokeWidth="1.75"
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={
          reduce
            ? { pathLength: 1 }
            : { pathLength: [0, 1, 1, 0], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }
        }
      />
      {/* thread */}
      <motion.path
        d="M6 21 Q10 16 14 18 Q18 20 22 15"
        stroke="#B8934A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
        animate={
          reduce
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }
        }
      />
      {/* eye of needle */}
      <circle cx="12" cy="4" r="1" fill="#B8934A" />
    </svg>
  );
}
