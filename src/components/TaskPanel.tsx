import { characterUrl, type DeskAgent } from '../data/agents'
import type { AcTask } from '../lib/supabase'

type Props = {
  agent: DeskAgent | null
  tasks: AcTask[]
  loading: boolean
}

const STATUS_LABEL: Record<string, string> = {
  antrian: 'Antrian',
  proses: 'Proses',
  selesai: 'Selesai',
  ditahan: 'Ditahan',
}

export function TaskPanel({ agent, tasks, loading }: Props) {
  return (
    <aside className="task-panel" aria-label="Panel tugas">
      <h2>Panel tugas</h2>
      {!agent ? (
        <p className="panel-empty">
          Arahkan kursor ke kru untuk melihat nama, lalu klik untuk memuat tugas.
        </p>
      ) : (
        <>
          <div className="panel-agent">
            <span className="panel-avatar">
              <img src={characterUrl(agent.slug)} alt="" />
            </span>
            <p className="panel-agent-text">
              <span className="panel-agent-name">{agent.displayName}</span>
              <span className="panel-agent-title">{agent.title}</span>
            </p>
          </div>
          {agent.isFrontDoor ? (
            <p className="panel-hint">
              Airlock · pintu depan habitat. Kirim brief lewat formulir — kru lain menerima
              arahan dari beliau.
            </p>
          ) : (
            <p className="panel-hint">
              Kru dek lunar. Menerima pekerjaan dari Pak Arka. Chat klien hanya ke airlock.
            </p>
          )}
          {loading ? (
            <p className="panel-empty">Memuat tugas…</p>
          ) : tasks.length === 0 ? (
            <p className="panel-empty">Belum ada tugas di meja ini.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id}>
                  <span className="task-title">{task.title}</span>
                  <span className={`task-status status-${task.status}`}>
                    {STATUS_LABEL[task.status] ?? task.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </aside>
  )
}
