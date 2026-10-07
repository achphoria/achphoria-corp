import { useCallback, useEffect, useMemo, useState } from 'react'
import { BriefForm } from './components/BriefForm'
import { IsometricOffice } from './components/IsometricOffice'
import { TaskPanel } from './components/TaskPanel'
import { DESK_AGENTS, type DeskAgent } from './data/agents'
import {
  isSupabaseConfigured,
  supabase,
  type AcAgent,
  type AcTask,
} from './lib/supabase'
import './App.css'

export default function App() {
  const [selected, setSelected] = useState<DeskAgent | null>(null)
  const [dbAgents, setDbAgents] = useState<AcAgent[]>([])
  const [allTasks, setAllTasks] = useState<AcTask[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [clock, setClock] = useState(() => new Date())
  const [briefSignal, setBriefSignal] = useState(0)

  const idToSlug = useMemo(() => {
    const map = new Map<string, string>()
    for (const a of dbAgents) map.set(a.id, a.slug)
    return map
  }, [dbAgents])

  const slugToId = useMemo(() => {
    const map = new Map<string, string>()
    for (const a of dbAgents) map.set(a.slug, a.id)
    return map
  }, [dbAgents])

  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const t of allTasks) {
      const slug = idToSlug.get(t.agent_id)
      if (!slug) continue
      counts[slug] = (counts[slug] ?? 0) + 1
    }
    return counts
  }, [allTasks, idToSlug])

  const selectedTasks = useMemo(() => {
    if (!selected) return []
    const agentId = slugToId.get(selected.slug)
    if (!agentId) return []
    return allTasks
      .filter((t) => t.agent_id === agentId)
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
  }, [selected, slugToId, allTasks])

  const loadAgentsAndTasks = useCallback(async () => {
    if (!supabase) return
    setLoadingTasks(true)
    const [{ data: agents }, { data: taskRows }] = await Promise.all([
      supabase.from('ac_agents').select('*').order('desk_row').order('sort_order'),
      supabase.from('ac_tasks').select('*').order('sort_order'),
    ])
    if (agents) setDbAgents(agents as AcAgent[])
    if (taskRows) setAllTasks(taskRows as AcTask[])
    setLoadingTasks(false)
  }, [])

  useEffect(() => {
    void loadAgentsAndTasks()
  }, [loadAgentsAndTasks])

  useEffect(() => {
    const id = window.setInterval(() => setClock(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const timeLabel = clock.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="app-shell space-theme">
      <div className="atmosphere" aria-hidden="true" />
      <header className="top-bar hud-bar">
        <div>
          <p className="top-brand">ACHPHORIA CORP</p>
          <p className="top-sub">Lunar virtual office · bahasa Indonesia · mode Sims isometric</p>
        </div>
        <div className="hud-right">
          <p className="hud-clock">{timeLabel} WIB</p>
          <p className={`db-pill ${isSupabaseConfigured ? 'on' : 'off'}`}>
            {isSupabaseConfigured ? 'Supabase · uplink OK' : 'Mode lokal · isi .env'}
          </p>
        </div>
      </header>

      <main className="layout">
        <IsometricOffice
          briefSignal={briefSignal}
          selectedSlug={selected?.slug ?? null}
          onSelect={setSelected}
          taskCounts={taskCounts}
        />
        <div className="side-stack">
          <TaskPanel
            agent={selected}
            tasks={selectedTasks}
            loading={Boolean(selected) && loadingTasks && isSupabaseConfigured}
          />
          <BriefForm
            onSubmitted={() => {
              setBriefSignal((n) => n + 1)
              void loadAgentsAndTasks()
            }}
          />
        </div>
      </main>

      <footer className="site-footer ticker-footer">
        <span className="ticker">
          {DESK_AGENTS.length} kru · dek klien &amp; build · Maya → Galih → Reza → Tia · Arka
          menutup · kirim brief ke airlock Pak Arka
        </span>
      </footer>
    </div>
  )
}
