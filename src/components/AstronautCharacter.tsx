type Props = {
  name: string
  suit: 'command' | 'science' | 'engineer' | 'support'
  selected: boolean
  working: boolean
  isFrontDoor: boolean
}

const SUIT_COLORS: Record<Props['suit'], { body: string; visor: string; trim: string }> = {
  command: { body: '#e8c96a', visor: '#7ee8ff', trim: '#fff3c4' },
  science: { body: '#9ad4ff', visor: '#b8ffe8', trim: '#e0f4ff' },
  engineer: { body: '#ff9a6b', visor: '#ffd4a8', trim: '#ffe8d0' },
  support: { body: '#c9b8ff', visor: '#e8dcff', trim: '#f3eeff' },
}

export function AstronautCharacter({
  name,
  suit,
  selected,
  working,
  isFrontDoor,
}: Props) {
  const c = SUIT_COLORS[suit]
  const shortName = name.replace(/^(Pak|Mbak)\s/, '')

  return (
    <div
      className={`astro-char ${selected ? 'selected' : ''} ${working ? 'working' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 64" className="astro-svg" role="presentation">
        <ellipse cx="24" cy="58" rx="14" ry="4" fill="rgba(0,0,0,0.35)" />
        <rect x="14" y="38" width="20" height="18" rx="4" fill={c.body} />
        <rect x="16" y="40" width="16" height="3" rx="1" fill={c.trim} opacity="0.8" />
        <circle cx="24" cy="22" r="14" fill={c.body} />
        <ellipse cx="24" cy="22" rx="10" ry="9" fill="#1a2840" />
        <ellipse cx="24" cy="22" rx="8" ry="7" fill={c.visor} opacity="0.85" />
        <ellipse cx="21" cy="20" rx="2" ry="1.2" fill="white" opacity="0.5" />
        {isFrontDoor ? (
          <path
            d="M8 18 L24 8 L40 18"
            fill="none"
            stroke="#ffd56a"
            strokeWidth="2"
            opacity="0.9"
          />
        ) : null}
        <rect x="10" y="42" width="6" height="10" rx="2" fill={c.body} />
        <rect x="32" y="42" width="6" height="10" rx="2" fill={c.body} />
      </svg>
      <span className="astro-nameplate">{shortName}</span>
      {working ? <span className="astro-pulse" /> : null}
    </div>
  )
}
