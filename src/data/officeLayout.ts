import type { DeskAgent } from './agents'

/** Posisi tile isometric (grid) — satu lantai, dua baris */
export type AgentLayout = DeskAgent & {
  gridX: number
  gridY: number
  suit: 'command' | 'science' | 'engineer' | 'support'
  activity: string
}

const SUIT: Record<string, AgentLayout['suit']> = {
  arka: 'command',
  nisa: 'science',
  bima: 'support',
  laras: 'support',
  dimas: 'science',
  sari: 'support',
  maya: 'science',
  galih: 'command',
  reza: 'engineer',
  tia: 'engineer',
}

const ACTIVITY: Record<string, string> = {
  arka: 'Menjaga pintu depan · menerima sinyal klien',
  nisa: 'Memetakan kebutuhan discovery',
  bima: 'Menyusun solusi arsitektur',
  laras: 'Implementasi modul',
  dimas: 'Pipeline data & otomasi',
  sari: 'Client desk · koordinasi',
  maya: 'Sketsa UX di holo-tablet',
  galih: 'Review tech & arah build',
  reza: 'Coding di terminal lunar',
  tia: 'QC · scan kualitas',
}

/** Baris klien y=0..5, baris build y=8..11 (lorong di y=6-7) */
export function buildAgentLayouts(agents: DeskAgent[]): AgentLayout[] {
  const klien = agents.filter((a) => a.deskRow === 'klien').sort((a, b) => a.sortOrder - b.sortOrder)
  const build = agents.filter((a) => a.deskRow === 'build').sort((a, b) => a.sortOrder - b.sortOrder)

  return [
    ...klien.map((a, i) => ({
      ...a,
      gridX: 1 + i * 2,
      gridY: 1,
      suit: SUIT[a.slug] ?? 'support',
      activity: ACTIVITY[a.slug] ?? 'Siaga di dek',
    })),
    ...build.map((a, i) => ({
      ...a,
      gridX: 2 + i * 2,
      gridY: 9,
      suit: SUIT[a.slug] ?? 'engineer',
      activity: ACTIVITY[a.slug] ?? 'Siaga di dek',
    })),
  ]
}

export function isoToPercent(gridX: number, gridY: number) {
  const x = (gridX - gridY) * 4.2 + 50
  const y = (gridX + gridY) * 2.1 + 8
  return { left: `${x}%`, top: `${y}%`, zIndex: Math.round(gridX + gridY) }
}
