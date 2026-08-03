import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProgressThread } from '../../components/ProgressThread';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    line: ({
      x1, y1, x2, y2,
      stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeOpacity,
      initial, animate, transition,
      ...rest
    }: React.SVGProps<SVGLineElement> & {
      initial?: unknown;
      animate?: unknown;
      transition?: unknown;
    }) => (
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap={strokeLinecap}
        strokeOpacity={strokeOpacity}
        data-testid="motion-line"
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
        {...rest}
      />
    ),
    circle: ({
      cx, cy, r, fill,
      initial, animate, transition,
      ...rest
    }: React.SVGProps<SVGCircleElement> & {
      initial?: unknown;
      animate?: unknown;
      transition?: unknown;
    }) => (
      <circle
        cx={cx} cy={cy} r={r} fill={fill}
        data-testid="motion-circle"
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
        {...rest}
      />
    ),
  },
  useReducedMotion: () => false,
}));

// Controllable mock for useReducedMotion
let mockReducedMotion = false;
vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockReducedMotion,
}));

beforeEach(() => {
  mockReducedMotion = false;
});

afterEach(() => {
  mockReducedMotion = false;
});

describe('ProgressThread', () => {
  it('renders an SVG', () => {
    const { container } = render(<ProgressThread currentStep={2} totalSteps={8} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('exposes progress ratio as data attribute', () => {
    const { container } = render(<ProgressThread currentStep={4} totalSteps={8} />);
    const el = container.firstChild as HTMLElement;
    expect(el.dataset.progress).toBe('0.5');
  });

  it('has role="progressbar" with aria attributes', () => {
    const { container } = render(<ProgressThread currentStep={3} totalSteps={8} />);
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar).toBeInTheDocument();
    expect(bar?.getAttribute('aria-valuenow')).toBe('3');
    expect(bar?.getAttribute('aria-valuemax')).toBe('8');
  });

  it('renders background track and animated progress line', () => {
    const { container } = render(<ProgressThread currentStep={2} totalSteps={8} />);
    const lines = container.querySelectorAll('line');
    // At least 2 lines: background track + animated progress line
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });

  it('renders needle dot at tip (motion.circle)', () => {
    const { container } = render(<ProgressThread currentStep={2} totalSteps={8} />);
    const dot = container.querySelector('[data-testid="motion-circle"]');
    expect(dot).toBeInTheDocument();
  });

  it('uses thread-gold color #B8934A on the progress line', () => {
    const { container } = render(<ProgressThread currentStep={2} totalSteps={8} />);
    const progressLine = container.querySelector('[data-testid="motion-line"]');
    expect(progressLine?.getAttribute('stroke')).toBe('#B8934A');
  });

  it('uses instant transition when reduced motion is enabled', () => {
    mockReducedMotion = true;
    const { container } = render(<ProgressThread currentStep={2} totalSteps={8} />);
    const progressLine = container.querySelector('[data-testid="motion-line"]');
    const transition = JSON.parse(progressLine?.getAttribute('data-transition') ?? '{}');
    expect(transition.duration).toBe(0);
  });

  it('uses animated transition when reduced motion is disabled', () => {
    mockReducedMotion = false;
    const { container } = render(<ProgressThread currentStep={2} totalSteps={8} />);
    const progressLine = container.querySelector('[data-testid="motion-line"]');
    const transition = JSON.parse(progressLine?.getAttribute('data-transition') ?? '{}');
    expect(transition.duration).toBeGreaterThan(0);
  });

  it('animates progress line x2 proportional to progress ratio', () => {
    const { container } = render(<ProgressThread currentStep={4} totalSteps={8} />);
    const progressLine = container.querySelector('[data-testid="motion-line"]');
    const animate = JSON.parse(progressLine?.getAttribute('data-animate') ?? '{}');
    // x2 should be 50% of viewBox width (300)
    expect(animate.x2).toBeCloseTo(150);
  });

  it('moves needle dot cx proportional to progress ratio', () => {
    const { container } = render(<ProgressThread currentStep={4} totalSteps={8} />);
    const dot = container.querySelector('[data-testid="motion-circle"]');
    const animate = JSON.parse(dot?.getAttribute('data-animate') ?? '{}');
    expect(animate.cx).toBeCloseTo(150);
  });

  it('uses strokeDasharray for thread (dashed) aesthetic on background track', () => {
    const { container } = render(<ProgressThread currentStep={2} totalSteps={8} />);
    // The static background line uses stroke-dasharray (SVG DOM attribute is kebab-case)
    const allLines = container.querySelectorAll('line');
    const hasDash = Array.from(allLines).some(
      (line) =>
        line.getAttribute('stroke-dasharray') != null ||
        line.getAttribute('strokeDasharray') != null
    );
    expect(hasDash).toBe(true);
  });
});
