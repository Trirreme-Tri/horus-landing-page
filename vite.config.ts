import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages publica em https://trirreme-tri.github.io/horus-landing-page/
  // O preview serve o build, então precisa do mesmo base (senão os assets dão 404).
  base: command === 'build' || isPreview ? '/horus-landing-page/' : '/',
  plugins: [react(), tailwindcss()],
  // libera o host do port forwarding do GitHub Codespaces
  server: { host: true, allowedHosts: ['.app.github.dev'] },
  preview: { host: true, allowedHosts: ['.app.github.dev'] },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
}))
