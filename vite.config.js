
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    minify: false
  },

  base: './',
  plugins: [svelte(), dynamicImport()],
})