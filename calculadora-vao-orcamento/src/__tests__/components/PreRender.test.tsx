import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PreRender } from '../../components/PreRender';

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
  useReducedMotion: () => false,
}));

describe('PreRender', () => {
  it('renders the text', () => {
    vi.useFakeTimers();
    render(<PreRender text="Anotado. Seguindo." onDone={() => {}} />);
    expect(screen.getByText('Anotado. Seguindo.')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('calls onDone after delay', async () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<PreRender text="msg" onDone={onDone} delay={1500} />);
    expect(onDone).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1500); });
    expect(onDone).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
