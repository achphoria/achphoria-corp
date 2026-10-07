export type DeskAgent = {
  slug: string
  displayName: string
  title: string
  deskRow: 'klien' | 'build'
  sortOrder: number
  isFrontDoor: boolean
}

/** Tata letak kantor — sinkron dengan seed di supabase/schema.sql */
export const DESK_AGENTS: DeskAgent[] = [
  {
    slug: 'arka',
    displayName: 'Pak Arka',
    title: 'Principal',
    deskRow: 'klien',
    sortOrder: 1,
    isFrontDoor: true,
  },
  {
    slug: 'nisa',
    displayName: 'Mbak Nisa',
    title: 'Discovery',
    deskRow: 'klien',
    sortOrder: 2,
    isFrontDoor: false,
  },
  {
    slug: 'bima',
    displayName: 'Pak Bima',
    title: 'Solution',
    deskRow: 'klien',
    sortOrder: 3,
    isFrontDoor: false,
  },
  {
    slug: 'laras',
    displayName: 'Mbak Laras',
    title: 'Implementation',
    deskRow: 'klien',
    sortOrder: 4,
    isFrontDoor: false,
  },
  {
    slug: 'dimas',
    displayName: 'Pak Dimas',
    title: 'Data & Otomasi',
    deskRow: 'klien',
    sortOrder: 5,
    isFrontDoor: false,
  },
  {
    slug: 'sari',
    displayName: 'Mbak Sari',
    title: 'Client Desk',
    deskRow: 'klien',
    sortOrder: 6,
    isFrontDoor: false,
  },
  {
    slug: 'maya',
    displayName: 'Mbak Maya',
    title: 'UX',
    deskRow: 'build',
    sortOrder: 1,
    isFrontDoor: false,
  },
  {
    slug: 'galih',
    displayName: 'Pak Galih',
    title: 'Tech lead',
    deskRow: 'build',
    sortOrder: 2,
    isFrontDoor: false,
  },
  {
    slug: 'reza',
    displayName: 'Pak Reza',
    title: 'Builder',
    deskRow: 'build',
    sortOrder: 3,
    isFrontDoor: false,
  },
  {
    slug: 'tia',
    displayName: 'Mbak Tia',
    title: 'QC',
    deskRow: 'build',
    sortOrder: 4,
    isFrontDoor: false,
  },
]

/** Urutan build: Maya → Galih → Reza → Tia; Arka menutup */
export const BUILD_ORDER = ['maya', 'galih', 'reza', 'tia', 'arka'] as const

export const FRONT_DOOR_SLUG = 'arka'
