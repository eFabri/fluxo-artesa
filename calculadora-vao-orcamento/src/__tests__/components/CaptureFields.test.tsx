import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CaptureFields } from '../../components/CaptureFields';

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
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('CaptureFields', () => {
  it('renders three input fields', () => {
    render(<CaptureFields onSubmit={() => {}} />);
    expect(screen.getByPlaceholderText(/seu nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/@seuatelie/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/sua cidade/i)).toBeInTheDocument();
  });

  it('does not submit if fields are empty', async () => {
    const onSubmit = vi.fn();
    render(<CaptureFields onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: /ver meu diagnóstico/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with trimmed values when all filled', async () => {
    const onSubmit = vi.fn();
    render(<CaptureFields onSubmit={onSubmit} />);
    await userEvent.type(screen.getByPlaceholderText(/seu nome/i), 'Ana');
    await userEvent.type(screen.getByPlaceholderText(/@seuatelie/i), 'atelie_ana');
    await userEvent.type(screen.getByPlaceholderText(/sua cidade/i), 'BH');
    await userEvent.click(screen.getByRole('button', { name: /ver meu diagnóstico/i }));
    expect(onSubmit).toHaveBeenCalledWith('Ana', 'atelie_ana', 'BH');
  });
});
