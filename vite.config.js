import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
// https://vite.dev/config/
export default defineConfig(function () {
    return {
        plugins: [
            react(),
            tailwindcss(),
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: ['favicon.svg', 'icons.svg', 'images/*.jpg', 'videos/*.mp4'],
                manifest: {
                    name: 'Saga Quiz Gallia',
                    short_name: 'Quiz Gallia',
                    description: 'Quiz interactif sur la bière Gallia',
                    theme_color: '#18181b',
                    background_color: '#18181b',
                    display: 'fullscreen',
                    orientation: 'landscape',
                    icons: [
                        {
                            src: 'favicon.svg',
                            sizes: 'any',
                            type: 'image/svg+xml',
                            purpose: 'any maskable',
                        },
                    ],
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,mp4,json}'],
                    maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // 100MB
                },
                devOptions: {
                    enabled: true,
                },
            }),
        ],
        base: '',
    };
});
