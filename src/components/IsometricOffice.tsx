import { useEffect } from 'react'
import { DESK_AGENTS, characterUrl, type DeskAgent } from '../data/agents'
import { NODES, characterHeight } from '../data/scene'
import { useCrewSimulation, type CrewState } from '../hooks/useCrewSimulation'

type Props = {
  /** Naik setiap kali brief terkirim — Pak Arka berjalan ke airlock */
  briefSignal: number
  selectedSlug: string | null
  onSelect: (agent: DeskAgent) => void
  taskCounts: Record<string, number>
}

const DEBUG = new URLSearchParams(window.location.search).has('debug')

function CrewMember({
  agent,
  state,
  selected,
  taskCount,
  onSelect,
}: {
  agent: DeskAgent
  state: CrewState
  selected: boolean
  taskCount: number
  onSelect: () => void
}) {
  const label = `${agent.displayName} · ${agent.title}`
  const height = characterHeight(state.y)

  return (
    <button
      type="button"
      className={`crew ${agent.deskRow} ${state.walking ? 'walking' : 'idle'} ${selected ? 'selected' : ''}`}
      style={{
        left: `${state.x}%`,
        top: `${state.y}%`,
        height: `${height}%`,
        zIndex: Math.round(state.y * 10),
      }}
      onClick={onSelect}
      aria-label={label}
      aria-pressed={selected}
    >
      <span className="crew-shadow" aria-hidden="true" />
      <span className={`crew-body ${state.facingLeft ? 'flip' : ''}`}>
        <img src={characterUrl(agent.slug)} alt="" draggable={false} />
      </span>
      <span className="crew-head" aria-hidden="true">
        {selected ? <span className="plumbob" /> : null}
        {state.bubble ? <span className="crew-bubble">{state.bubble}</span> : null}
        <span className={`crew-tag ${agent.isFrontDoor ? 'front-door' : ''}`}>
          {agent.displayName.replace(/^(Pak|Mbak)\s/, '')}
          {taskCount > 0 ? <span className="crew-count">{taskCount}</span> : null}
        </span>
      </span>
      <span className="crew-tooltip">{label}</span>
    </button>
  )
}

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function IsometricOffice({ briefSignal, selectedSlug, onSelect, taskCounts }: Props) {
  const { crew, deliverBrief } = useCrewSimulation(REDUCED_MOTION)

  useEffect(() => {
    if (briefSignal > 0) deliverBrief()
  }, [briefSignal, deliverBrief])

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
          <span className="meta-pill">
            {crew.filter((c) => c.walking).length} berjalan · {DESK_AGENTS.length} kru
          </span>
        </div>
      </header>

      <div className="scene">
        <img
          className="scene-bg"
          src={`${import.meta.env.BASE_URL}scene/lunar-office.webp`}
          alt="Interior habitat lunar ACHPHORIA: airlock, dua baris meja kerja, jendela ke permukaan bulan dan Bumi"
        />
        {DEBUG
          ? Object.entries(NODES).map(([id, p]) => (
              <span key={id} className="debug-node" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                {id}
              </span>
            ))
          : null}
        {crew.map((state) => {
          const agent = DESK_AGENTS.find((a) => a.slug === state.slug)!
          return (
            <CrewMember
              key={state.slug}
              agent={agent}
              state={state}
              selected={selectedSlug === state.slug}
              taskCount={taskCounts[state.slug] ?? 0}
              onSelect={() => onSelect(agent)}
            />
          )
        })}
      </div>

      <p className="scene-legend">
        <span className="legend-dot klien" /> Dek klien
        <span className="legend-dot build" /> Dek build · Maya → Galih → Reza → Tia, Pak Arka
        menutup · klik kru untuk melihat tugas
      </p>
    </section>
  )
}
