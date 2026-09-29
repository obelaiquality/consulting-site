// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://obel-ai.com',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      // Only real, indexable pages: no 404 and no legacy .html redirect stubs.
      filter: (page) => !page.includes('/404') && !page.includes('/checkout') && !page.endsWith('.html/') && !page.endsWith('.html'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Emit every component script as a file (no inline <script>), so the CSP allows scripts from 'self' only.
    build: { assetsInlineLimit: 0 },
    // Pre-bundle the motion libraries so the dev server never serves mismatched dep hashes.
    optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'lenis'] },
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Old consulting-site URLs keep working.
  redirects: {
    '/about.html': '/about',
    '/contact.html': '/contact',
    '/services.html': '/',
    '/data.html': '/',
    '/chatbot.html': '/',
  },
});
