// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';


import sitemap from '@astrojs/sitemap';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
    site: "https://smmpanels.org",
    output: 'server',
    integrations: [sitemap({
        filter: (page) => !page.startsWith('https://smmpanels.org/admin/')
    })],
    server: {
        host: true // Or set this to '0.0.0.0'
    },
    vite: {
        plugins: [tailwindcss()],
    },
    adapter: node({
        mode: 'standalone',
    }),
});