import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    base: '/pypsa-eur-map-viewer/',
    plugins: [react(), wasm(), tailwindcss()],
    build: {target: 'es2020'},
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
