import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: path.resolve(__dirname, "../../dist/ui"),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/subscriptions': 'http://localhost:3000',
      '/calendar': 'http://localhost:3000',
      '/rules': 'http://localhost:3000',
    }
  }
})