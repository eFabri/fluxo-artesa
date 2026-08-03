import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OpeningScreen } from '../../components/OpeningScreen';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      initial,
      animate,
      transition,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      initial?: unknown;
      animate?: unknown;
      transition?: unknown;
    }) => <div {...rest}>{children}</div>,
  },
  useReducedMotion: () => false,
}));

describe('OpeningScreen', () => {
  it('renders the CTA button', () => {
    render(<OpeningScreen onStart={() => {}} />);
    expect(screen.getByRole('button', { name: /descobrir meu vão/i })).toBeInTheDocument();
  });

  it('calls onStart when button clicked', async () => {
    const onStart = vi.fn();
    render(<OpeningScreen onStart={onStart} />);
    await userEvent.click(screen.getByRole('button', { name: /descobrir meu vão/i }));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('renders the headline', () => {
    render(<OpeningScreen onStart={() => {}} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the Euler attribution', () => {
    render(<OpeningScreen onStart={() => {}} />);
    expect(screen.getByText(/Euler Fabri/)).toBeInTheDocument();
  });

  it('renders the Euler image', () => {
    render(<OpeningScreen onStart={() => {}} />);
    expect(screen.getByAltText(/Euler Fabri/i)).toBeInTheDocument();
  });
});
