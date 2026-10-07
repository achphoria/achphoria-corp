# ACHPHORIA CORP — Kantor Virtual

Kantor virtual satu lantai dengan sepuluh meja (baris klien & baris build). Bahasa antarmuka Indonesia. Versi pertama: peta, nama saat kursor di atas meja, panel tugas, dan formulir singkat ke **Pak Arka** (pintu depan).

## Tim

| Slug | Nama | Peran | Baris |
|------|------|-------|-------|
| arka | Pak Arka | Principal | klien (pintu depan) |
| nisa | Mbak Nisa | Discovery | klien |
| bima | Pak Bima | Solution | klien |
| laras | Mbak Laras | Implementation | klien |
| dimas | Pak Dimas | Data & Otomasi | klien |
| sari | Mbak Sari | Client Desk | klien |
| maya | Mbak Maya | UX | build |
| galih | Pak Galih | Tech lead | build |
| reza | Pak Reza | Builder | build |
| tia | Mbak Tia | QC | build |

Pengguna hanya chat ke Pak Arka. Yang lain menerima pekerjaan dari beliau. Urutan build: **Maya → Galih → Reza → Tia**; Arka yang menutup.

## Akses online (GitHub Pages)

Setelah Pages diaktifkan: **https://achphoria.github.io/achphoria-corp/**

Satu kali di GitHub repo → **Settings → Pages**:
1. Source: **GitHub Actions**
2. **Settings → Secrets and variables → Actions** → tambah:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Menjalankan aplikasi (lokal)

```bash
cp .env.example .env
# isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY dari dashboard Supabase
npm install
npm run dev
```

Buka **http://localhost:5173**.

Kunci dibaca dari environment saja — jangan menulis kunci di kode, dan jangan pakai `service_role` di klien. File `.env` diabaikan oleh `.gitignore`.

## Menjalankan SQL di Supabase

Satu file skema: [`supabase/schema.sql`](supabase/schema.sql).

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) → pilih proyek ACHPHORIA (atau buat proyek baru).
2. Masuk ke **SQL Editor** → **New query**.
3. Salin seluruh isi `supabase/schema.sql`, tempel, lalu **Run**.
4. Di **Project Settings → API**, salin **Project URL** dan **anon / public** key ke file `.env` lokal:
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`

Skema membuat tabel `ac_agents`, `ac_projects`, `ac_tasks`, `ac_messages`, `ac_activity` (masing-masing punya `id`, `created_at`, `updated_at`), men-seed 10 agen, dan memasang RLS: peran `anon` hanya boleh **membaca** agent, proyek, dan tugas; **pesan tidak boleh dibaca publik** (hanya insert untuk brief).

## Skrip

- `npm run dev` — server pengembangan
- `npm run build` — build produksi
- `npm run preview` — pratinjau build
