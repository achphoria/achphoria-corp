/**
 * Graf jalur lantai untuk public/scene/lunar-office.webp.
 * Koordinat dalam persen (x dari kiri, y dari atas) = titik kaki karakter.
 */
export type Point = { x: number; y: number }

export const NODES: Record<string, Point> = {
  // posisi kerja tiap agen
  arka: { x: 56, y: 43 },
  nisa: { x: 31, y: 50 },
  bima: { x: 19, y: 62 },
  laras: { x: 41, y: 66 },
  dimas: { x: 54.7, y: 65 },
  sari: { x: 68, y: 67 },
  maya: { x: 33.7, y: 88 },
  galih: { x: 47.4, y: 88.5 },
  reza: { x: 60, y: 88.5 },
  tia: { x: 73, y: 88 },

  // tujuan
  airlock: { x: 43, y: 39 },
  coffee: { x: 35.5, y: 43 },
  pantry: { x: 69, y: 46 },
  robot: { x: 72, y: 57 },

  // lorong
  t1: { x: 33, y: 45.5 },
  t2: { x: 44, y: 44 },
  t3: { x: 58.5, y: 44.5 },
  l1: { x: 25, y: 59 },
  m1: { x: 44.5, y: 57 },
  m2: { x: 58.5, y: 57 },
  r1: { x: 75, y: 50 },
  r2: { x: 76, y: 61 },
  c25: { x: 25, y: 69.5 },
  c37: { x: 37, y: 69.5 },
  c44: { x: 44.5, y: 69.5 },
  c50: { x: 50.3, y: 69.5 },
  c58: { x: 58.5, y: 69.5 },
  c63: { x: 63.3, y: 69.5 },
  c70: { x: 70, y: 69.5 },
  c77: { x: 77, y: 67 },
  g37: { x: 37, y: 80 },
  g50: { x: 50.3, y: 80 },
  g63: { x: 63.3, y: 80 },
  g77: { x: 77.5, y: 78 },
  f37: { x: 37, y: 91 },
  f50: { x: 50.3, y: 92 },
  f63: { x: 63.3, y: 92 },
  f77: { x: 76, y: 89 },
}

const EDGES: [string, string][] = [
  ['bima', 'l1'],
  ['l1', 'nisa'],
  ['l1', 'c25'],
  ['nisa', 't1'],
  ['t1', 'coffee'],
  ['t1', 't2'],
  ['t2', 'airlock'],
  ['t2', 't3'],
  ['t3', 'arka'],
  ['t3', 'pantry'],
  ['pantry', 'r1'],
  ['r1', 'robot'],
  ['robot', 'r2'],
  ['r2', 'c77'],
  ['t2', 'm1'],
  ['m1', 'c44'],
  ['t3', 'm2'],
  ['m2', 'c58'],
  ['c25', 'c37'],
  ['c37', 'c44'],
  ['c44', 'c50'],
  ['c50', 'c58'],
  ['c58', 'c63'],
  ['c63', 'c70'],
  ['c70', 'c77'],
  ['laras', 'c37'],
  ['laras', 'c44'],
  ['dimas', 'c50'],
  ['dimas', 'c58'],
  ['sari', 'c63'],
  ['sari', 'c70'],
  ['c37', 'g37'],
  ['g37', 'f37'],
  ['c50', 'g50'],
  ['g50', 'f50'],
  ['c63', 'g63'],
  ['g63', 'f63'],
  ['c77', 'g77'],
  ['g77', 'f77'],
  ['f37', 'f50'],
  ['f50', 'f63'],
  ['f63', 'f77'],
  ['f37', 'maya'],
  ['f37', 'galih'],
  ['f50', 'galih'],
  ['f50', 'reza'],
  ['f63', 'reza'],
  ['f63', 'tia'],
  ['f77', 'tia'],
]

const ADJ: Record<string, string[]> = {}
for (const [a, b] of EDGES) {
  ;(ADJ[a] ??= []).push(b)
  ;(ADJ[b] ??= []).push(a)
}

export function findPath(from: string, to: string): Point[] {
  if (from === to) return [NODES[to]]
  const prev: Record<string, string | null> = { [from]: null }
  const queue = [from]
  while (queue.length) {
    const cur = queue.shift()!
    if (cur === to) break
    for (const next of ADJ[cur] ?? []) {
      if (!(next in prev)) {
        prev[next] = cur
        queue.push(next)
      }
    }
  }
  if (!(to in prev)) return [NODES[to]]
  const ids: string[] = []
  for (let n: string | null = to; n; n = prev[n]) ids.unshift(n)
  return ids.slice(1).map((id) => NODES[id])
}

export const ERRANDS: { node: string; label: string }[] = [
  { node: 'coffee', label: 'Ngopi dulu' },
  { node: 'airlock', label: 'Cek airlock' },
  { node: 'pantry', label: 'Ambil camilan' },
  { node: 'robot', label: 'Servis robot' },
]

/** Skala karakter mengikuti kedalaman (makin ke depan makin besar) */
export function characterHeight(y: number) {
  return 13 + y * 0.07
}
