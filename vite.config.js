import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // On s'assure que la fonction est robuste
        manualChunks(id) {
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('react-router-dom')) return 'router';
          // Regrouper React et React-DOM ensemble
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor';
          }
          // Pour tout le reste, on laisse le comportement par défaut
          return null; 
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Augmenté un peu pour plus de sécurité
  },
  // Optionnel : Si le problème persiste, vous pouvez désactiver Rolldown 
  // (qui est en version alpha/beta dans Vite 8) pour revenir au comportement standard
})