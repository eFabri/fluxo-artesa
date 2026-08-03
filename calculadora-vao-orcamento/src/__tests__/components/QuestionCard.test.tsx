import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { QuestionCard } from '../../components/QuestionCard';
import { QUESTIONS } from '../../data/questions';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      initial,
      animate,
      exit,
      transition,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
    }) => <div {...rest}>{children}</div>,
    button: ({
      children,
      initial,
      animate,
      exit,
      transition,
      onClick,
      className,
      ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
    }) => <button onClick={onClick} className={className} {...rest}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));

describe('QuestionCard', () => {
  const q = QUESTIONS[0];

  it('renders question text', () => {
    render(<QuestionCard question={q} stepLabel="1 de 7" onAnswer={() => {}} onBack={() => {}} />);
    expect(screen.getByText(q.text)).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<QuestionCard question={q} stepLabel="1 de 7" onAnswer={() => {}} onBack={() => {}} />);
    q.options.forEach(o => {
      expect(screen.getByText(o.label)).toBeInTheDocument();
    });
  });

  it('calls onAnswer with option id when clicked', async () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={q} stepLabel="1 de 7" onAnswer={onAnswer} onBack={() => {}} />);
    await userEvent.click(screen.getByText(q.options[0].label));
    expect(onAnswer).toHaveBeenCalledWith(q.options[0].id);
  });

  it('calls onBack when back button clicked', async () => {
    const onBack = vi.fn();
    render(<QuestionCard question={q} stepLabel="1 de 7" onAnswer={() => {}} onBack={onBack} />);
    await userEvent.click(screen.getByRole('button', { name: /voltar/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
