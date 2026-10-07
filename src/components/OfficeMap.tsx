import { DESK_AGENTS, type DeskAgent } from '../data/agents'

type Props = {
  selectedSlug: string | null
  onSelect: (agent: DeskAgent) => void
  taskCounts: Record<string, number>
}

function Desk({
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
  const label = `${agent.displayName} · ${agent.title}`

  return (
    <button
      type="button"
      className={`desk ${agent.deskRow} ${agent.isFrontDoor ? 'front-door' : ''} ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      aria-label={label}
      title={label}
    >
      <span className="desk-surface" aria-hidden="true">
        <span className="desk-monitor" />
        <span className="desk-chair" />
      </span>
      <span className="desk-tooltip">{label}</span>
      {taskCount > 0 ? (
        <span className="desk-badge" aria-hidden="true">
          {taskCount}
        </span>
      ) : null}
      {agent.isFrontDoor ? (
        <span className="desk-door-mark">Pintu depan</span>
      ) : null}
    </button>
  )
}

export function OfficeMap({ selectedSlug, onSelect, taskCounts }: Props) {
  const klien = DESK_AGENTS.filter((a) => a.deskRow === 'klien').sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )
  const build = DESK_AGENTS.filter((a) => a.deskRow === 'build').sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )

  return (
    <section className="office-map" aria-label="Peta kantor satu lantai">
      <div className="floor">
        <div className="floor-glow" aria-hidden="true" />
        <header className="floor-brand">
          <p className="brand-mark">ACHPHORIA CORP</p>
          <p className="brand-line">Kantor virtual · satu lantai · sepuluh meja</p>
        </header>

        <div className="row-block">
          <h2 className="row-label">Baris klien</h2>
          <div className="desk-row klien-row">
            {klien.map((agent) => (
              <Desk
                key={agent.slug}
                agent={agent}
                selected={selectedSlug === agent.slug}
                taskCount={taskCounts[agent.slug] ?? 0}
                onSelect={() => onSelect(agent)}
              />
            ))}
          </div>
        </div>

        <div className="aisle" aria-hidden="true">
          <span>Lorong</span>
        </div>

        <div className="row-block">
          <h2 className="row-label">Baris build</h2>
          <div className="desk-row build-row">
            {build.map((agent) => (
              <Desk
                key={agent.slug}
                agent={agent}
                selected={selectedSlug === agent.slug}
                taskCount={taskCounts[agent.slug] ?? 0}
                onSelect={() => onSelect(agent)}
              />
            ))}
          </div>
        </div>

        <p className="build-order-note">
          Urutan build: Maya → Galih → Reza → Tia. Pak Arka yang menutup.
        </p>
      </div>
    </section>
  )
}
