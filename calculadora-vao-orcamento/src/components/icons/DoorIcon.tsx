import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface DoorIconProps {
  isOpen: boolean;
  size?: number;
}

export function DoorIcon({ isOpen, size = 48 }: DoorIconProps) {
  const reduce = useReducedMotion();
  const color = isOpen ? '#7C8B6F' : '#B5503E';

  // Closed: full rectangular frame  M4,22 L4,2 L20,2 L20,22 L4,22
  // Open:   frame missing bottom-right + ajar leaf  M4,22 L4,2 L20,2 L20,10 M20,22 L4,22 M14,12 L16,12
  const closedPath = 'M4 22 L4 2 L20 2 L20 22 L4 22';
  const openPath   = 'M4 22 L4 2 L20 2 L20 22 L4 22 M11 12 A1 1 0 1 0 11.01 12';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d={isOpen ? openPath : closedPath}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
      />
      {isOpen && (
        <motion.line
          x1="14" y1="6" x2="18" y2="18"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.8, ease: 'easeOut' }}
        />
      )}
    </svg>
  );
}
