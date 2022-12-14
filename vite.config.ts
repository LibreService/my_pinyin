import { execSync } from 'child_process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import { run } from 'vite-plugin-run'
import { VitePWA } from 'vite-plugin-pwa'

const plugins = [
  replace({
    __COMMIT__: execSync('git rev-parse HEAD').toString().trim(),
    __BUILD_DATE__: new Date().toLocaleString()
  }),
  VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: [
        '**/*.{js,css,html}',
        'apple-touch-icon.png',
        'rime.data',
        'rime.wasm'
      ],
      maximumFileSizeToCacheInBytes: 5242880
    },
    manifest: {
      name: 'My RIME',
      short_name: 'My RIME',
      icons: [
        {
          src: 'LibreService.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        }
      ]
    }
  }),
  vue()
]

if (process.env.NODE_ENV !== 'production') {
  plugins.push(run([
    {
      name: 'Transpile worker',
      run: ['pnpm run worker'],
      condition: file => file.includes('worker.ts')
    }
  ]))
}

export default defineConfig({
  plugins,
  server: {
    watch: {
      ignored: ['**/boost/**', '**/build/**', '**/librime/**', '**/scripts/**', '**/wasm/**'],
    },
  }
})
