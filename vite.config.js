import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Lets `npm run dev` talk to `vercel dev`'s API server on :3000
      // if you run them separately. Not needed if you just use `vercel dev`.
      '/api': 'http://localhost:3000',
    },
  },
})
