import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';

// Mock framer-motion so AnimatePresence, motion.*, hooks are transparent / no-ops
vi.mock('framer-motion', () => {
  const React = require('react');

  function strip(props: Record<string, unknown>) {
    const { children, initial, animate, exit, variants, transition, custom, whileHover, whileTap, ...rest } = props;
    return { children, rest };
  }

  function makeEl(tag: string) {
    return React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
      const { children, rest } = strip(props);
      return React.createElement(tag, { ref, ...rest }, children);
    });
  }

  return {
    motion: {
      div: makeEl('div'),
      span: makeEl('span'),
      a: makeEl('a'),
      button: makeEl('button'),
      h1: makeEl('h1'),
      h2: makeEl('h2'),
      p: makeEl('p'),
      path: makeEl('path'),
      line: makeEl('line'),
      circle: makeEl('circle'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useReducedMotion: () => true,
    useMotionValue: (initial: number) => ({
      get: () => initial,
      set: () => {},
      on: () => () => {},
    }),
    animate: (_from: unknown, _to: unknown, opts: { onUpdate?: (v: number) => void }) => {
      // immediately invoke onUpdate with the target value so counter resolves
      if (opts?.onUpdate && typeof _to === 'number') opts.onUpdate(_to);
      return { stop: () => {} };
    },
  };
});

describe('App — full quiz flow', () => {
  it('walks through opening → all 7 questions → capture → result', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const user = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) });

    render(<App />);

    // Opening screen
    expect(screen.getByRole('button', { name: /descobrir meu vão/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /descobrir meu vão/i }));

    // Answer all 7 questions (pick first option each time, advance past pre-renders)
    for (let i = 0; i < 7; i++) {
      // Question should be visible now — QuestionCard has a "Voltar" button
      expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();

      // Click first option (not Voltar, not Descobrir)
      const optionBtns = screen.getAllByRole('button').filter(
        b => b.textContent !== 'Voltar' && !b.textContent?.includes('Descobrir')
      );
      await user.click(optionBtns[0]);

      // Advance past pre-render delay (longest is 2500ms)
      await act(async () => { vi.advanceTimersByTime(3000); });
    }

    // After 7 questions + prerender advances, should be on capture screen
    expect(screen.getByPlaceholderText(/seu nome/i)).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(/seu nome/i), 'Ana');
    await user.type(screen.getByPlaceholderText(/@seuatelie/i), 'atelie_ana');
    await user.type(screen.getByPlaceholderText(/sua cidade/i), 'BH');
    await user.click(screen.getByRole('button', { name: /ver meu diagnóstico/i }));

    // Final pre-render
    await act(async () => { vi.advanceTimersByTime(3000); });

    // Result screen
    expect(screen.getByText(/Ana, descobrimos por que esse valor está escapando/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /minha análise em vídeo/i })).toBeInTheDocument();

    vi.useRealTimers();
  });
});
