import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
    base: '/pypsa-eur-map-viewer/',
    plugins: [react(), wasm()],
    build: {target: 'es2020'}
});