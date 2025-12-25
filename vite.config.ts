
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on current mode (development/production)
  // This ensures variables from .env files or the system environment are accessible
  // Cast process to any to resolve TS error: Property 'cwd' does not exist on type 'Process'
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    base: '/',
    define: {
      // The Gemini SDK requires process.env.API_KEY specifically.
      // We inject it here so it's available in the browser.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
      // Set NODE_ENV for compatibility with various libraries
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});