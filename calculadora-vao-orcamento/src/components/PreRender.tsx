import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeedleIcon } from './icons/NeedleIcon';

interface PreRenderProps {
  text: string;
  icon?: 'needle';
  onDone: () => void;
  delay?: number;
}

export function PreRender({ text, icon, onDone, delay = 1500 }: PreRenderProps) {
  useEffect(() => {
    const t = setTimeout(onDone, delay);
    return () => clearTimeout(t);
  }, [onDone, delay]);

  return (
    <motion.div
      className="min-h-screen bg-linen flex flex-col items-center justify-center gap-6 px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {icon === 'needle' && <NeedleIcon size={48} />}
      <p className="font-display text-xl text-charcoal-text text-center leading-snug max-w-xs">
        {text}
      </p>
    </motion.div>
  );
}
