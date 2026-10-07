import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Di GitHub Pages path-nya /achphoria-corp/; lokal tetap /
const base = process.env.GITHUB_PAGES === 'true' ? '/achphoria-corp/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
