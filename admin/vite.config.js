import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    hmr: {
      overlay: true
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:4000',
        changeOrigin: true,
        secure: true
      }
    }
  },
  preview: {
    port: process.env.PORT || 5174,
    strictPort: true,
    host: true
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css']
  }
})