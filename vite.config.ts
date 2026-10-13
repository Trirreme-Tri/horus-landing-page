import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  // GitHub Pages publica em https://leoeliel.github.io/horus-landing-page/
  base: command === 'build' ? '/horus-landing-page/' : '/',
  plugins: [react(), tailwindcss()],
  // libera o host do port forwarding do GitHub Codespaces
  server: { host: true, allowedHosts: ['.app.github.dev'] },
  preview: { host: true, allowedHosts: ['.app.github.dev'] },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
}))
