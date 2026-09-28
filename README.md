# obel-ai.com

Marketing site for **Obel MS**, the hosted ISO 9001 document control and workflow system from Obel AI & Quality.

## Stack

- [Astro](https://astro.build) with static output
- Tailwind CSS v4 for the design tokens and utilities
- GSAP (ScrollTrigger, SplitText) and Lenis for scroll storytelling
- Self-hosted Syne and DM Sans fonts, the same faces the app uses

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Where things live

| Path | What |
| --- | --- |
| `src/data/site.ts` | Prices, plans, navigation and contact details. Change facts here only. |
| `src/data/demo.ts` | Synthetic demo data for the product mock-ups. Never use real client data. |
| `src/styles/global.css` | Design tokens mirrored from the app, type scale and components |
| `src/scripts/motion.ts` | The one motion engine (Lenis + GSAP) and its declarative hooks |
| `src/components/mock/AppWindow.astro` | Miniature of the real app chrome for product visuals |
| `src/components/sections/` | Home page sections |
| `src/pages/` | Routes |
| `docs/BUILD-SPEC.md` | Design rules, claims policy and contribution rules. Read it before you change anything. |

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. The repository's Pages source must be set to **GitHub Actions**. `public/CNAME` keeps the `obel-ai.com` domain. `public/og.png` is the social share image, rendered once from the site typography.

The old consulting pages (`/about.html`, `/services.html`, `/data.html`, `/chatbot.html`, `/contact.html`) redirect to their new equivalents.
