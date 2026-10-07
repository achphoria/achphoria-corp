import { useMemo } from 'react'
import { DESK_AGENTS, type DeskAgent } from '../data/agents'
import { AstronautCharacter } from './AstronautCharacter'
import { buildAgentLayouts, isoToPercent } from '../data/officeLayout'

type Props = {
  selectedSlug: string | null
  onSelect: (agent: DeskAgent) => void
  taskCounts: Record<string, number>
}

function IsoDesk({
  agent,
  layout,
  selected,
  taskCount,
  onSelect,
}: {
  agent: DeskAgent
  layout: ReturnType<typeof buildAgentLayouts>[number]
  selected: boolean
  taskCount: number
  onSelect: () => void
}) {
  const pos = isoToPercent(layout.gridX, layout.gridY)
  const label = `${agent.displayName} · ${agent.title}`

  return (
    <button
      type="button"
      className={`iso-desk ${agent.deskRow} ${selected ? 'selected' : ''} ${agent.isFrontDoor ? 'airlock' : ''}`}
      style={{ left: pos.left, top: pos.top, zIndex: pos.zIndex }}
      onClick={onSelect}
      aria-label={label}
      title={label}
    >
      <div className="iso-desk-top" />
      <div className="iso-desk-side" />
      <div className="iso-console">
        <span className="iso-screen" />
      </div>
      <AstronautCharacter
        name={agent.displayName}
        suit={layout.suit}
        selected={selected}
        working={taskCount > 0}
        isFrontDoor={agent.isFrontDoor}
      />
      {agent.isFrontDoor ? <span className="iso-badge airlock-badge">Airlock · Pak Arka</span> : null}
      {taskCount > 0 ? <span className="iso-badge task-badge">{taskCount} tugas</span> : null}
      <span className="iso-hover-label">{label}</span>
      <span className="iso-activity">{layout.activity}</span>
    </button>
  )
}

export function IsometricOffice({ selectedSlug, onSelect, taskCounts }: Props) {
  const layouts = useMemo(() => buildAgentLayouts(DESK_AGENTS), [])

  return (
    <section className="iso-office" aria-label="Base lunar ACHPHORIA — tampilan isometric">
      <div className="iso-scene">
        <div className="space-backdrop" aria-hidden="true">
          <div className="stars" />
          <div className="earth-glow" />
          <div className="moon-horizon" />
        </div>

        <div className="habitat-shell">
          <header className="habitat-header">
            <div>
              <p className="habitat-code">ACHPHORIA · LUNAR HAB-01</p>
              <h2 className="habitat-title">Stasiun Kerja Orbit-Bulan</h2>
            </div>
            <div className="habitat-meta">
              <span className="meta-pill live">● LIVE</span>
              <span className="meta-pill">Gravitasi sim · 1 lantai</span>
              <span className="meta-pill">10 kru aktif</span>
            </div>
          </header>

          <div className="iso-floor-plate" aria-hidden="true">
            <div className="deck-label deck-klien">DEK KLIEN · sisi barat habitat</div>
            <div className="deck-aisle">
              <span>Lorong tekanis · oksigen stabil</span>
            </div>
            <div className="deck-label deck-build">DEK BUILD · bay engineering</div>
            <div className="window-band" />
            <div className="crater-mark crater-a" />
            <div className="crater-mark crater-b" />
          </div>

          <div className="iso-entities">
            {layouts.map((layout) => {
              const agent = DESK_AGENTS.find((a) => a.slug === layout.slug)!
              return (
                <IsoDesk
                  key={layout.slug}
                  agent={agent}
                  layout={layout}
                  selected={selectedSlug === layout.slug}
                  taskCount={taskCounts[layout.slug] ?? 0}
                  onSelect={() => onSelect(agent)}
                />
              )
            })}
          </div>

          <div className="rover-pad" aria-hidden="true">
            <span>Rover pad</span>
          </div>
        </div>

        <p className="iso-footnote">
          Gaya isometric ala simulasi kantor (Pixel Office / virtual office viral) · tema
          pesawat di permukaan bulan. Klik astronot untuk panel tugas. Chat klien hanya ke
          airlock Pak Arka.
        </p>
      </div>
    </section>
  )
}
