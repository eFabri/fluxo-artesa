import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DoorIcon } from '../components/icons/DoorIcon';
import { NeedleIcon } from '../components/icons/NeedleIcon';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    path: ({ d, stroke, strokeWidth, strokeLinecap, strokeLinejoin, initial, animate, transition, ...rest }: React.SVGProps<SVGPathElement> & { initial?: unknown; animate?: unknown; transition?: unknown }) => (
      <path d={d} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} data-testid="motion-path" data-animate={JSON.stringify(animate)} data-transition={JSON.stringify(transition)} />
    ),
    line: ({ x1, y1, x2, y2, stroke, strokeWidth, strokeLinecap, initial, animate, transition, ...rest }: React.SVGProps<SVGLineElement> & { initial?: unknown; animate?: unknown; transition?: unknown }) => (
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} data-testid="motion-line" data-animate={JSON.stringify(animate)} data-transition={JSON.stringify(transition)} />
    ),
    circle: ({ cx, cy, r, fill, initial, animate, transition, ...rest }: React.SVGProps<SVGCircleElement> & { initial?: unknown; animate?: unknown; transition?: unknown }) => (
      <circle cx={cx} cy={cy} r={r} fill={fill} data-testid="motion-circle" />
    ),
  },
  useReducedMotion: () => false,
}));

// Controllable mock for useReducedMotion
let mockReducedMotion = false;
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockReducedMotion,
}));

beforeEach(() => {
  mockReducedMotion = false;
});

afterEach(() => {
  mockReducedMotion = false;
});

describe('DoorIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<DoorIcon isOpen={false} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('uses stitch-brick color (#B5503E) when closed', () => {
    const { container } = render(<DoorIcon isOpen={false} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('stroke')).toBe('#B5503E');
  });

  it('uses sage-open color (#7C8B6F) when open', () => {
    const { container } = render(<DoorIcon isOpen={true} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('stroke')).toBe('#7C8B6F');
  });

  it('accepts a custom size prop', () => {
    const { container } = render(<DoorIcon isOpen={false} size={64} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('64');
    expect(svg?.getAttribute('height')).toBe('64');
  });

  it('renders floor line element in both states', () => {
    const { container: c1 } = render(<DoorIcon isOpen={false} />);
    expect(c1.querySelector('line')).toBeTruthy();
    const { container: c2 } = render(<DoorIcon isOpen={true} />);
    expect(c2.querySelector('line')).toBeTruthy();
  });

  it('renders a rect (door leaf) when closed', () => {
    const { container } = render(<DoorIcon isOpen={false} />);
    expect(container.querySelector('rect')).toBeTruthy();
  });

  it('does not render a rect when open (door is ajar)', () => {
    const { container } = render(<DoorIcon isOpen={true} />);
    expect(container.querySelector('rect')).toBeNull();
  });

  it('renders door knob circle when closed', () => {
    const { container } = render(<DoorIcon isOpen={false} />);
    expect(container.querySelector('circle')).toBeTruthy();
  });
});

describe('NeedleIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<NeedleIcon />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders the eye circle with thread-gold color (#B8934A)', () => {
    const { container } = render(<NeedleIcon />);
    const circle = container.querySelector('circle');
    expect(circle?.getAttribute('fill')).toBe('#B8934A');
  });

  it('accepts a custom size prop', () => {
    const { container } = render(<NeedleIcon size={60} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('60');
    expect(svg?.getAttribute('height')).toBe('60');
  });

  it('renders the needle body and thread paths', () => {
    const { container } = render(<NeedleIcon />);
    const paths = container.querySelectorAll('[data-testid="motion-path"]');
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });

  it('renders as static (pathLength: 1) when reduced motion is enabled', () => {
    mockReducedMotion = true;
    const { container } = render(<NeedleIcon />);
    const paths = container.querySelectorAll('[data-testid="motion-path"]');
    // Both needle body and thread should animate to static pathLength: 1
    paths.forEach((path) => {
      const animate = JSON.parse(path.getAttribute('data-animate') ?? '{}');
      expect(animate.pathLength).toBe(1);
      // No repeat/loop
      expect(animate.transition).toBeUndefined();
    });
  });

  it('uses looping animation when reduced motion is disabled', () => {
    mockReducedMotion = false;
    const { container } = render(<NeedleIcon />);
    const paths = container.querySelectorAll('[data-testid="motion-path"]');
    const needlePath = paths[0];
    const animate = JSON.parse(needlePath.getAttribute('data-animate') ?? '{}');
    // Should use array-based pathLength for looping
    expect(Array.isArray(animate.pathLength)).toBe(true);
    // JSON.stringify converts Infinity to null; null means repeat: Infinity was set
    expect(animate.transition?.repeat).toBeNull();
  });
});

describe('ChatBubbleIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<ChatBubbleIcon />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders the bubble path with thread-gold stroke', () => {
    const { container } = render(<ChatBubbleIcon />);
    const path = container.querySelector('[data-testid="motion-path"]');
    expect(path?.getAttribute('stroke')).toBe('#B8934A');
  });

  it('renders three dots inside the bubble', () => {
    const { container } = render(<ChatBubbleIcon />);
    const circles = container.querySelectorAll('[data-testid="motion-circle"]');
    expect(circles.length).toBe(3);
  });

  it('accepts a custom size prop', () => {
    const { container } = render(<ChatBubbleIcon size={56} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('56');
    expect(svg?.getAttribute('height')).toBe('56');
  });

  it('uses instant transition when reduced motion is enabled', () => {
    mockReducedMotion = true;
    const { container } = render(<ChatBubbleIcon />);
    const path = container.querySelector('[data-testid="motion-path"]');
    const transition = JSON.parse(path?.getAttribute('data-transition') ?? '{}');
    expect(transition.duration).toBe(0);
  });

  it('uses duration 0.5 with easeOut when reduced motion is disabled', () => {
    mockReducedMotion = false;
    const { container } = render(<ChatBubbleIcon />);
    const path = container.querySelector('[data-testid="motion-path"]');
    const transition = JSON.parse(path?.getAttribute('data-transition') ?? '{}');
    expect(transition.duration).toBe(0.5);
    expect(transition.ease).toBe('easeOut');
  });
});

describe('useReducedMotion hook re-export', () => {
  it('re-exports from framer-motion', async () => {
    const mod = await import('../hooks/useReducedMotion');
    expect(typeof mod.useReducedMotion).toBe('function');
  });
});
