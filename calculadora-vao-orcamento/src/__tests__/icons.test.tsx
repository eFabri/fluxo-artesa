import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DoorIcon } from '../components/icons/DoorIcon';
import { NeedleIcon } from '../components/icons/NeedleIcon';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    path: ({ d, stroke, strokeWidth, strokeLinecap, strokeLinejoin, ...rest }: React.SVGProps<SVGPathElement>) => (
      <path d={d} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} data-testid="motion-path" />
    ),
    line: ({ x1, y1, x2, y2, stroke, strokeWidth, strokeLinecap, ...rest }: React.SVGProps<SVGLineElement>) => (
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} data-testid="motion-line" />
    ),
    circle: ({ cx, cy, r, fill, ...rest }: React.SVGProps<SVGCircleElement>) => (
      <circle cx={cx} cy={cy} r={r} fill={fill} data-testid="motion-circle" />
    ),
  },
  useReducedMotion: () => false,
}));

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

  it('renders extra line element when open', () => {
    const { container } = render(<DoorIcon isOpen={true} />);
    expect(container.querySelector('line')).toBeTruthy();
  });

  it('does not render extra line element when closed', () => {
    const { container } = render(<DoorIcon isOpen={false} />);
    expect(container.querySelector('line')).toBeNull();
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
});

describe('useReducedMotion hook re-export', () => {
  it('re-exports from framer-motion', async () => {
    const mod = await import('../hooks/useReducedMotion');
    expect(typeof mod.useReducedMotion).toBe('function');
  });
});
