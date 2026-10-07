import { useCallback, useEffect, useRef, useState } from 'react'
import { DESK_AGENTS } from '../data/agents'
import { ERRANDS, NODES, findPath, type Point } from '../data/scene'

export type CrewState = {
  slug: string
  x: number
  y: number
  facingLeft: boolean
  walking: boolean
  bubble: string | null
}

type Walker = {
  slug: string
  pos: Point
  path: Point[]
  at: string
  facingLeft: boolean
  bubble: string | null
  busyUntil: number
  onArrive: (() => void) | null
  plan: number
}

/** Persen per detik — x dan y punya skala berbeda di gambar 16:9 */
const SPEED = 7
const MAX_WALKERS = 3

function displayName(slug: string) {
  return DESK_AGENTS.find((a) => a.slug === slug)?.displayName.replace(/^(Pak|Mbak)\s/, '') ?? slug
}

function snapshot(walkers: Walker[]): CrewState[] {
  return walkers.map((w) => ({
    slug: w.slug,
    x: w.pos.x,
    y: w.pos.y,
    facingLeft: w.facingLeft,
    walking: w.path.length > 0,
    bubble: w.bubble,
  }))
}

function createWalkers(): Walker[] {
  return DESK_AGENTS.map((a, i) => ({
    slug: a.slug,
    pos: { ...NODES[a.slug] },
    path: [],
    at: a.slug,
    facingLeft: false,
    bubble: null,
    // relatif terhadap waktu mulai simulasi; dikonversi di tick pertama
    busyUntil: 1500 + ((i * 1700) % 7000),
    onArrive: null,
    plan: 0,
  }))
}

export function useCrewSimulation(paused: boolean) {
  const walkersRef = useRef<Walker[]>(createWalkers())
  const startedRef = useRef(false)
  const [crew, setCrew] = useState<CrewState[]>(() => snapshot(createWalkers()))

  const sendTo = useCallback(
    (w: Walker, target: string, bubble: string | null, then: (() => void) | null) => {
      w.plan += 1
      w.path = findPath(w.at, target)
      w.at = target
      w.bubble = null
      w.onArrive = () => {
        w.bubble = bubble
        then?.()
      }
    },
    [],
  )

  const goHome = useCallback(
    (w: Walker, delay: number) => {
      w.busyUntil = performance.now() + delay
      w.onArrive = null
      const plan = w.plan
      setTimeout(() => {
        if (w.plan !== plan) return
        sendTo(w, w.slug, null, () => {
          w.busyUntil = performance.now() + 8000 + Math.random() * 14000
        })
      }, delay)
    },
    [sendTo],
  )

  /** Pak Arka menerima brief di airlock lalu mengantar ke Mbak Nisa (Discovery) */
  const deliverBrief = useCallback(() => {
    const arka = walkersRef.current.find((w) => w.slug === 'arka')
    if (!arka) return
    arka.busyUntil = Number.POSITIVE_INFINITY
    sendTo(arka, 'airlock', 'Brief masuk!', () => {
      const plan = arka.plan
      setTimeout(() => {
        if (arka.plan !== plan) return
        sendTo(arka, 't1', 'Nisa, ada brief baru', () => goHome(arka, 2500))
      }, 1800)
    })
  }, [goHome, sendTo])

  useEffect(() => {
    if (paused) return
    let raf = 0
    let last = performance.now()
    if (!startedRef.current) {
      startedRef.current = true
      for (const w of walkersRef.current) w.busyUntil += last
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const walkers = walkersRef.current

      for (const w of walkers) {
        if (w.path.length === 0) continue
        const target = w.path[0]
        const dx = target.x - w.pos.x
        const dy = (target.y - w.pos.y) * 0.5625
        const dist = Math.hypot(dx, dy)
        const step = SPEED * dt
        if (Math.abs(dx) > 0.05) w.facingLeft = dx < 0
        if (dist <= step) {
          w.pos = { ...target }
          w.path.shift()
          if (w.path.length === 0) {
            const cb = w.onArrive
            w.onArrive = null
            cb?.()
          }
        } else {
          w.pos = {
            x: w.pos.x + (dx / dist) * step,
            y: w.pos.y + (dy / dist / 0.5625) * step,
          }
        }
      }

      const activeCount = walkers.filter((w) => w.at !== w.slug || w.path.length > 0).length
      if (activeCount < MAX_WALKERS) {
        const idle = walkers.filter(
          (w) => w.at === w.slug && w.path.length === 0 && now > w.busyUntil,
        )
        if (idle.length) {
          const w = idle[Math.floor(Math.random() * idle.length)]
          w.busyUntil = Number.POSITIVE_INFINITY
          const visitColleague = Math.random() < 0.4
          if (visitColleague) {
            const others = DESK_AGENTS.filter((a) => a.slug !== w.slug)
            const mate = others[Math.floor(Math.random() * others.length)].slug
            sendTo(w, mate, `Sinkron sama ${displayName(mate)}`, () =>
              goHome(w, 3500 + Math.random() * 3000),
            )
          } else {
            const errand = ERRANDS[Math.floor(Math.random() * ERRANDS.length)]
            sendTo(w, errand.node, errand.label, () => goHome(w, 3000 + Math.random() * 3000))
          }
        }
      }

      for (const w of walkers) {
        if (w.at === w.slug && w.path.length === 0 && w.bubble) w.bubble = null
      }

      setCrew(snapshot(walkers))
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused, goHome, sendTo])

  return { crew, deliverBrief }
}
