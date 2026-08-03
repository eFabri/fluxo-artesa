interface DoorIconProps {
  isOpen: boolean;
  size?: number;
}

export function DoorIcon({ isOpen, size = 48 }: DoorIconProps) {
  const color = isOpen ? '#7C8B6F' : '#B5503E';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={isOpen ? 'Porta aberta' : 'Porta fechada'}
    >
      {/* Frame: left post, top bar, right post */}
      <path d="M4 22 V3 H20 V22" />
      {/* Floor */}
      <line x1="2" y1="22" x2="22" y2="22" />

      {isOpen ? (
        /* Open: ajar door leaf (pushed inward) + handle visible */
        <path d="M4 3 L13 4.5 V19.5 L4 21" strokeOpacity="0.55" />
      ) : (
        /* Closed: full door leaf fills frame + handle knob */
        <>
          <rect x="4" y="3" width="16" height="19" />
          <circle cx="16.5" cy="13" r="1.2" fill={color} stroke="none" />
        </>
      )}
    </svg>
  );
}
