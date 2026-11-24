import { defineConfig } from 'vite';

// Public URL used for canonical / Open Graph tags. Change SITE_URL when moving to Vercel.
const SITE_URL = process.env.SITE_URL || 'https://madhav13dubey.github.io/MyPortfolio/';

const siteUrl = () => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
});

// VITE_BASE lets the same build work on GitHub Pages ("/MyPortfolio/") and
// Vercel / a custom domain ("/").
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [siteUrl()],
  build: { outDir: 'dist', sourcemap: false },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js'],
  },
});
