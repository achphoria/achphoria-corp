import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(
  url &&
    anonKey &&
    !url.includes('YOUR_PROJECT_REF') &&
    anonKey !== 'your_anon_or_publishable_key',
)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null

export type AcAgent = {
  id: string
  slug: string
  display_name: string
  title: string
  desk_row: 'klien' | 'build'
  sort_order: number
  is_front_door: boolean
}

export type AcTask = {
  id: string
  agent_id: string
  project_id: string
  title: string
  status: string
  sort_order: number
  created_at: string
}

export type AcProject = {
  id: string
  title: string
  brief: string
  status: string
  created_at: string
}
