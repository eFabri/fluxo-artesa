import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function ChatBubbleIcon({ size = 40 }: { size?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <motion.path
        d="M4 4 H20 Q22 4 22 6 V14 Q22 16 20 16 H8 L4 20 V16 H4 Q2 16 2 14 V6 Q2 4 4 4 Z"
        stroke="#B8934A"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, ease: 'easeOut' }}
      />
      {/* dots */}
      {[8, 12, 16].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx} cy={10} r="1.2"
          fill="#B8934A"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 0.9 + i * 0.15, duration: 0.2 }}
        />
      ))}
    </svg>
  );
}
