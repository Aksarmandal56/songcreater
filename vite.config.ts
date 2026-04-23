import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(async () => {
  const plugins = [react()];
  try {
    const m = await import('./vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {}
  return {
    plugins,
    base: '/',
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      allowedHosts: ['expressinmusic.in','www.expressinmusic.in','expressmusic.in','www.expressmusic.in','localhost','127.0.0.1'],
      hmr: { host: 'expressinmusic.in', protocol: 'ws', clientPort: 80 }
    }
  };
})
