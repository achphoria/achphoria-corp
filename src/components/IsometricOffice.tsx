import { DESK_AGENTS, SEAT_POSITIONS, avatarUrl, type DeskAgent } from '../data/agents'

type Props = {
  selectedSlug: string | null
  onSelect: (agent: DeskAgent) => void
  taskCounts: Record<string, number>
}

function AgentPin({
  agent,
  selected,
  taskCount,
  onSelect,
}: {
  agent: DeskAgent
  selected: boolean
  taskCount: number
  onSelect: () => void
}) {
  const seat = SEAT_POSITIONS[agent.slug]
  const label = `${agent.displayName} · ${agent.title}`

  return (
    <button
      type="button"
      className={`agent-pin ${agent.deskRow} ${selected ? 'selected' : ''} ${agent.isFrontDoor ? 'front-door' : ''}`}
      style={{ left: `${seat.x}%`, top: `${seat.y}%`, zIndex: Math.round(seat.y) }}
      onClick={onSelect}
      aria-label={label}
      aria-pressed={selected}
    >
      {selected ? <span className="plumbob" aria-hidden="true" /> : null}
      <span className="pin-avatar">
        <img src={avatarUrl(agent.slug)} alt="" loading="lazy" />
        {taskCount > 0 ? <span className="pin-count">{taskCount}</span> : null}
      </span>
      <span className="pin-name">{agent.displayName.replace(/^(Pak|Mbak)\s/, '')}</span>
      <span className="pin-tooltip">{label}</span>
    </button>
  )
}

export function IsometricOffice({ selectedSlug, onSelect, taskCounts }: Props) {
  return (
    <section className="lunar-office" aria-label="Kantor lunar ACHPHORIA">
      <header className="habitat-header">
        <div>
          <p className="habitat-code">ACHPHORIA · LUNAR HAB-01</p>
          <h2 className="habitat-title">Stasiun Kerja Orbit-Bulan</h2>
        </div>
        <div className="habitat-meta">
          <span className="meta-pill live">● LIVE</span>
          <span className="meta-pill">Gravitasi sim · 1 lantai</span>
          <span className="meta-pill">{DESK_AGENTS.length} kru aktif</span>
        </div>
      </header>

      <div className="scene">
        <img
          className="scene-bg"
          src={`${import.meta.env.BASE_URL}scene/lunar-office.webp`}
          alt="Interior habitat lunar ACHPHORIA: airlock, dua baris meja kerja, jendela ke permukaan bulan dan Bumi"
        />
        {DESK_AGENTS.map((agent) => (
          <AgentPin
            key={agent.slug}
            agent={agent}
            selected={selectedSlug === agent.slug}
            taskCount={taskCounts[agent.slug] ?? 0}
            onSelect={() => onSelect(agent)}
          />
        ))}
      </div>

      <p className="scene-legend">
        <span className="legend-dot klien" /> Dek klien
        <span className="legend-dot build" /> Dek build · Maya → Galih → Reza → Tia, Pak Arka
        menutup
      </p>
    </section>
  )
}
