// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://obel-ai.com',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
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
