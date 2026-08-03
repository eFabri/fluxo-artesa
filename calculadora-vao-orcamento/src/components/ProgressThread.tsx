import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ProgressThreadProps {
  currentStep: number;
  totalSteps: number;
}

const VIEWBOX_WIDTH = 300;

export function ProgressThread({ currentStep, totalSteps }: ProgressThreadProps) {
  const reduce = useReducedMotion();
  const progress = currentStep / totalSteps;
  const progressX2 = progress * VIEWBOX_WIDTH;

  const transition: Transition = reduce
    ? { duration: 0 }
    : { duration: 0.4, ease: 'easeOut' };

  return (
    <div
      className="w-full px-6 pt-4"
      data-progress={progress}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemax={totalSteps}
      aria-label={`Passo ${currentStep} de ${totalSteps}`}
    >
      <svg
        width="100%"
        height="12"
        viewBox={`0 0 ${VIEWBOX_WIDTH} 12`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Background track */}
        <line
          x1="0"
          y1="6"
          x2={VIEWBOX_WIDTH}
          y2="6"
          stroke="#B8934A"
          strokeOpacity="0.2"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        {/* Animated progress thread */}
        <motion.line
          x1="0"
          y1="6"
          y2="6"
          stroke="#B8934A"
          strokeWidth="2"
          strokeDasharray="4 6"
          strokeLinecap="round"
          initial={{ x2: 0 }}
          animate={{ x2: progressX2 }}
          transition={transition}
        />
        {/* Needle dot at tip */}
        <motion.circle
          cy="6"
          r="3"
          fill="#B8934A"
          initial={{ cx: 0 }}
          animate={{ cx: progressX2 }}
          transition={transition}
        />
      </svg>
    </div>
  );
}
