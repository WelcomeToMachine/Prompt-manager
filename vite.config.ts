import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import zipPack from "vite-plugin-zip-pack";
import manifest from './public/manifest.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),tailwindcss(),zipPack({
    outFileName: `${manifest.name.replaceAll(" ", "-")}-v${manifest.version}.zip`
  })]
})
