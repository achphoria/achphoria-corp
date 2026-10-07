import { useState, type FormEvent } from 'react'
import { FRONT_DOOR_SLUG } from '../data/agents'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type Props = {
  onSubmitted: () => void
}

export function BriefForm({ onSubmitted }: Props) {
  const [nama, setNama] = useState('')
  const [judul, setJudul] = useState('')
  const [brief, setBrief] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [pesan, setPesan] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!judul.trim() || !brief.trim()) {
      setStatus('error')
      setPesan('Judul dan brief wajib diisi.')
      return
    }

    if (!isSupabaseConfigured || !supabase) {
      setStatus('error')
      setPesan(
        'Supabase belum dikonfigurasi. Salin .env.example ke .env dan isi URL serta kunci anon.',
      )
      return
    }

    setStatus('loading')
    setPesan('')

    const { data: arka, error: agentError } = await supabase
      .from('ac_agents')
      .select('id')
      .eq('slug', FRONT_DOOR_SLUG)
      .single()

    if (agentError || !arka) {
      setStatus('error')
      setPesan(
        'Tidak menemukan Pak Arka di database. Pastikan supabase/schema.sql sudah dijalankan.',
      )
      return
    }

    const { data: project, error: projectError } = await supabase
      .from('ac_projects')
      .insert({
        title: judul.trim(),
        brief: brief.trim(),
        status: 'baru',
      })
      .select('id')
      .single()

    if (projectError || !project) {
      setStatus('error')
      setPesan(projectError?.message ?? 'Gagal membuat proyek.')
      return
    }

    const sender = nama.trim() || 'klien'
    const { error: messageError } = await supabase.from('ac_messages').insert({
      agent_id: arka.id,
      project_id: project.id,
      sender_label: sender,
      body: brief.trim(),
    })

    if (messageError) {
      setStatus('error')
      setPesan(messageError.message)
      return
    }

    await supabase.from('ac_activity').insert({
      project_id: project.id,
      agent_id: arka.id,
      kind: 'brief_masuk',
      detail: `${sender} mengirim brief: ${judul.trim()}`,
    })

    setStatus('ok')
    setPesan('Brief diterima Pak Arka. Tim akan diarahkan dari pintu depan.')
    setNama('')
    setJudul('')
    setBrief('')
    onSubmitted()
  }

  return (
    <section className="brief-form" aria-label="Formulir singkat ke Pak Arka">
      <h2>Kirim brief ke Pak Arka</h2>
      <p className="form-lead">
        Sinyal klien masuk lewat airlock Pak Arka. Kru lain bekerja dari arahan beliau di
        habitat bulan.
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Nama Anda
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Opsional"
            autoComplete="name"
          />
        </label>
        <label>
          Judul proyek
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Ringkas saja"
            required
          />
        </label>
        <label>
          Brief singkat
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Apa yang perlu dibangun atau diselesaikan?"
            rows={4}
            required
          />
        </label>
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Mengirim…' : 'Kirim ke Pak Arka'}
        </button>
      </form>
      {pesan ? (
        <p className={`form-status ${status === 'ok' ? 'ok' : 'error'}`} role="status">
          {pesan}
        </p>
      ) : null}
    </section>
  )
}
