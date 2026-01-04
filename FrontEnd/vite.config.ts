import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  base: './'  // ← AJOUTE cette ligne pour que les fichiers du build soient correctement trouvés sur Vercel
})
