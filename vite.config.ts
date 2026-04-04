import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(async () => {
  const plugins = [react()];
  try {
    // @ts-expect-error Optional plugin import may not exist
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {
    // Optional plugin not found, continue without it
  }
  return { plugins, base: '/' };
})
