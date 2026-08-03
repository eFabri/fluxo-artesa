import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import type { Question } from '../data/types';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface QuestionCardProps {
  question: Question;
  questionIndex?: number;
  stepLabel: string;
  onAnswer: (optionId: string) => void;
  onBack: () => void;
}

export function QuestionCard({ question, questionIndex = 0, stepLabel, onAnswer, onBack }: QuestionCardProps) {
  const reduce = useReducedMotion();

  const slideProps = reduce
    ? {}
    : {
        initial: { x: 50, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 },
        transition: { duration: 0.4 },
      };

  return (
    <div className="min-h-screen bg-linen flex flex-col px-5 pt-6 pb-8">
      {/* step label */}
      <p className="font-body text-xs text-charcoal-text/40 uppercase tracking-widest mb-6">
        {stepLabel}
      </p>

      {/* animated question area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={questionIndex}
          className="flex-1 flex flex-col"
          {...slideProps}
        >
          {question.icon === 'chat' && (
            <div className="mb-4">
              <ChatBubbleIcon size={36} />
            </div>
          )}
          <h2 className="font-display text-2xl font-semibold text-charcoal-text leading-snug mb-8">
            {question.text}
          </h2>

          {/* options */}
          <div className="flex flex-col gap-3">
            {question.options.map((opt, i) => (
              <motion.button
                key={opt.id}
                onClick={() => onAnswer(opt.id)}
                className="w-full text-left px-5 py-4 bg-paper-white rounded-xl border border-charcoal-text/10 font-body text-charcoal-text text-base hover:border-thread-gold hover:bg-thread-gold/5 active:scale-[0.98] transition-all duration-150"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* back */}
      <button
        onClick={onBack}
        aria-label="Voltar"
        className="flex items-center gap-1 font-body text-sm text-charcoal-text/40 hover:text-charcoal-text/70 mt-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Voltar
      </button>
    </div>
  );
}
