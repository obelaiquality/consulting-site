# Obel-MS marketing site: build spec

This file governs every contributor, human or agent. Read all of it before you write code.

## 1. What we sell

Obel-MS is a hosted quality management system for SMEs. Obel AI & Quality hosts it, maintains it and supports it for a monthly fee.

- **Live now:** External Document Control (EDC) and Workflow Manager (WFM).
- **Coming soon:** Internal Document Control (IDC), for SOPs, policies and work instructions.
- **The pitch:** ISO 9001 document control without the enterprise price. You do not run any servers, installs or IT tickets.
- **Pricing and plan facts** live in `src/data/site.ts`. Import them from there and never hard-code prices.
- **Demo data** lives in `src/data/demo.ts`. It uses fictional suppliers and people only.
- **Never copy names or data from the app repo, its fixtures, its redesign mock-ups or the research notes.** Those contain real client documents, suppliers, manufacturers and products. Every supplier, manufacturer, product, certificate number, lot and person on the site must be synthetic. Use `demo.ts` or invent new names in the same obviously fictional style, for example Northwind Ingredients, Kestrel Packaging or Silverleaf Botanics.

## 2. Stack and project layout

- Astro 7 (static output), Tailwind v4 (`@theme` tokens in `src/styles/global.css`), GSAP 3.15 (ScrollTrigger + SplitText, free), Lenis.
- `src/scripts/motion.ts` is the single motion engine. Section scripts do:
  ```ts
  import { onReady, gsap, ScrollTrigger, reduced } from '../../scripts/motion';
  onReady(() => { if (reduced) return; /* build timelines */ });
  ```
  Never register plugins again. Never create a second Lenis. Use `gsap.matchMedia()` when an effect only suits desktop.
- Layout: `src/layouts/BaseLayout.astro` (props: `title`, `description`, `jsonLd`). It already includes the nav, the footer and the SEO tags.
- Components you can use:
  - `components/mock/AppWindow.astro` is a faithful miniature of the real app chrome (props: `title`, `eyebrow`, `tabs`, `activeTab`). Put product UI inside it.
  - `components/ui/Logo.astro` takes the `mark` or `word` prop.
- CSS utilities in `global.css`:
  - Layout: `container-x`, `section-y`.
  - Type: `t-hero`, `t-h2`, `t-h3`, `t-lead`, `t-body`, `t-label`, `tnum`, `t-num`, `label-dot`.
  - Surfaces and status: `card`, `pill` plus `pill-green`/`pill-amber`/`pill-red`/`pill-blue`/`pill-grey`, `paper-grid`, `link-u`.
  - Buttons: `btn` plus `btn-primary`/`btn-ghost`/`btn-light`/`btn-night-ghost`/`btn-sm`.
  - Tailwind colours: `bg`, `surface`, `surface-2`, `surface-3`, `line`, `ink`, `muted`, `dim`, `night`, `night-2`, `night-3`, `night-line`, `night-fg`, `night-muted`, `green`, `amber`, `blue`, `red` (plus `-bg`/`-border`/`-text`).
- Declarative motion hooks: `data-split` (masked line reveal), `data-reveal`, `data-reveal-group`, `data-count`, `data-magnetic`, `data-parallax`. Use them sparingly (see section 4).

## 3. Visual direction (locked)

The site must feel like the product. It keeps the app's warm paper, ink navbar, Syne display type, DM Sans body and status-pill palette.

- **Colour:** Paper `#f8f8f6`, Surface `#fff`, Ink `#111110`, Stone `#78786e`, Hairline `#d8d8d4`.
  - The one accent is Quality green `#166534`. It means approved, effective or live.
  - Amber, red and blue appear only as status pills and dots inside product UI.
  - Never use gradients as decoration. Never use a purple or blue gradient.
- **Type:**
  - Syne for headings, large and tight: the scale classes give negative tracking and about 1.0 leading.
  - DM Sans for everything else. There is no monospace font. For numbers, codes and dates, use `tnum`.
- **Alignment:** left-aligned, like the app. Centre text only in a short closing CTA.
- **Layout:** a 12-column feeling, a max width of 1320px (`container-x`) and generous vertical space (`section-y`). Text blocks never exceed about 65 characters.
- **Hierarchy through contrast of scale.** One huge thing per section, and everything else quiet.
- **Product proof over illustration.** Every visual is real product UI rebuilt in HTML/CSS inside `AppWindow`, or a diagram of how documents or records move. Use no stock photos, no 3D blobs and no icon-in-circle feature grids.
- **Dark sections** use `bg-night` with `text-night-fg` and `text-night-muted`. Hairlines use `border-night-line`.

## 4. Rules distilled from the design skills we researched

Sources: Anthropic frontend-design, Vercel Web Interface Guidelines, Emil Kowalski animation skills, GreenSock official skills, and Addy Osmani web-quality skills.

**Do not produce these tells:**
1. ALL-CAPS tracked eyebrow labels above headings on the marketing site. The only exception is inside `AppWindow` mocks, because the real app uses them. Use a sentence-case `label-dot` only where a label adds information.
2. A `→` arrow appended to buttons or links.
3. Meta strings joined with middle dots (`A · B · C`). Write a sentence or use a list.
4. Accenting one word of a headline with italic, colour or bold.
5. Identical rounded cards in a uniform grid with the same shadow. Vary scale and use hairline rules, whitespace and real UI instead.
6. Numbered markers (01/02/03), except when the content is a real sequence.
7. The same fade-up on every section. Each page gets one orchestrated scroll moment plus motion that answers the user's actions. Other content can simply be there, or use one quiet `data-reveal` on a heading group.
8. Emoji, colourful icon soup, carousels with dots, or fake customer logos and testimonials. We have no customers to quote yet, so do not invent any.

**Motion:**
- Animate only `transform` and `opacity`. Never use `transition: all`.
- Enter and exit use ease-out. Use `expo.out` or `power3.out` in GSAP, or `var(--ease-out)` in CSS. Never use ease-in on UI.
- UI feedback takes 100 to 250 ms. Scroll-scrubbed storytelling can be longer. Use `scrub: 0.6`.
- Put the `scrollTrigger` on the top-level timeline only. Never combine `scrub` and `toggleActions` on one trigger. Strip `markers`.
- Never use `scale(0)`. Start from 0.94 to 0.97.
- `prefers-reduced-motion`: `reduced` is exported by the motion engine. When it is true, show the final state with no scroll pinning or scrubbing. The content must still be complete and readable.
- Hover effects go only inside `@media (hover: hover) and (pointer: fine)`.
- Pinned sections: use `pin: true`, set `end` as a percentage (`+=200%`), and give a mobile layout that does not pin, with `gsap.matchMedia` at `(min-width: 1024px)`.

**Interaction and accessibility:**
- Use semantic HTML: one `h1` per page and no skipped heading levels.
- Use `<button>` for actions and `<a>` for navigation.
- Hit targets are at least 44px on touch.
- Keep the visible `:focus-visible` ring from `global.css`.
- Colour is never the only signal: pills carry text.
- Decorative mocks get `aria-hidden="true"`, or a short `aria-label` on the wrapper.
- Text contrast is at least 4.5:1. `text-muted` on `bg` passes for body text, and `text-dim` is for decoration only.
- Form inputs are at least 16px on mobile and have labels, `autocomplete` and a correct `type`.

**Performance and SEO:**
- No new npm dependencies without the orchestrator's approval.
- Keep JavaScript small. Load no third-party scripts.
- Every page passes a unique `title` and `description` to `BaseLayout`.
- Add JSON-LD only where the content is real: `SoftwareApplication` on product and pricing pages, and `FAQPage` where there is a FAQ.

## 5. Copy rules

- Write for a quality manager at a 20 to 200 person company. Use their words: supplier certificates, specs, expiry, approvals, nonconformance, audit, corrective action.
- Use sentence case, plain verbs and second person. Name exactly what a button does, for example "Book a demo" or "See pricing".
- Keep sentences short. Use no filler and no hype words such as "revolutionary", "seamless" or "unlock".
- Use South African / British spelling: organisation, colour, licence.

## 6. Facts: what we may and may not claim

**Claim freely (shipped):**
- EDC:
  - Inbox, EDC Register, EDC Folder and Archive tabs.
  - Upload, then AI metadata extraction (AI Suggestions: Accept / Edit / Dismiss), then Approve, which moves the document to the Register (status Validated).
  - Documents auto-file into a **Supplier → Manufacturer → Product** folder tree.
  - Document Status is computed as Active, Expiring soon (30 days by default, configurable), Expired or No expiry set.
  - Expiry alerts go out as an org-wide email digest and a Teams message.
  - Upload New Version keeps the version history. There are also bulk metadata edit, archive and unarchive, and a full audit log.
  - The Register grid columns are: Original Filename, Document Title, Document Type, Product, Supplier, Manufacturer, Statement Type, Catalogue No., Certificate No., Number, Issue Date, Expiration Date, Status, Document Status.
- WFM:
  - Five standard templates, no template codes: **Nonconformance** (5 stages incl. verification), **CAPA** (6 stages incl. verification), **Audit** (5 stages incl. verification), **Change Control** (6 stages incl. verification), **Document Review** (4 stages, no verification). Stage names are in `demo.ts`. Customers can also build their own templates in the template designer.
  - A template designer with drag-to-reorder stages, stage deadlines, approvals routed by job title, custom fields and template versioning ("New version" versus "Copy").
  - Record statuses: Active, Pending Approval, Awaiting Verification, Completed, Cancelled. "Overdue" is a due status, not a record status.
  - Effectiveness verification with the outcomes "Mark Effective" and "Mark Ineffective".
  - Entries and attachments of any file type up to 50 MB.
  - The audit trail shows each entry as "**Actor** action: detail" with a `YYYY-MM-DD HH:MM` time, and can be downloaded as a PDF.
  - Each record has a Report tab with a PDF.
  - AI stage and executive summaries, and AI text refinement for entries.
  - Hourly overdue monitoring with email and Teams notifications.
  - Record code format: `wf2609140007`.
- Platform:
  - Four roles: Super Admin, Master Admin, Module Admin and Navigator. They show as neutral dashed pills with no colour coding.
  - Dark mode.
  - A ⌘K command palette.

**Service commitments (what Obel promises as the operator):**
- Hosted on Google Cloud in Johannesburg (africa-south1).
- Daily backups, updates and monitoring. Onboarding on Essentials and Professional includes a capped document import; larger migrations are quoted by the hour.
- Support from quality consultants.

**Updates (26 Sep 2026):**
- Pricing is Rev B in `src/data/site.ts`: Lite, Essentials and Professional. The Validated (GxP) tier was removed. Every ZAR price is shown excl. 15% VAT, billed annually, and month-to-month costs 15% more.

**Updates (28 Sep 2026, OCR measured by Obel Cloud):**
- You may say: AI metadata extraction and OCR are included on every plan, with a monthly page allowance (1,000 / 3,000 / 10,000). Digital PDFs are read directly. Scanned supplier documents in Latin-script languages are read with OCR. The AI suggests metadata (document type, dates, lot or batch numbers, certificate numbers) and a person confirms it in the Inbox. Documents are stored in South Africa.
- Disclose the third-party model provider (OpenAI) in the security and data-handling wording, not as a headline, and offer the no-external-AI option as "available on request" (local extraction, fewer fields correct). It is a deployment-wide setting today, not a per-tenant or self-service toggle; change the wording only when Obel Cloud confirms the per-tenant setting is merged.
- Support time and onboarding hours are capped (see `pricingTerms.support` and the plan setup labels). The internal margin note lives outside this public repo.
- You may say: encrypted at rest and in transit, and "99.5% availability target, best effort".
- The AI chat assistant may appear only as "coming soon".
- ISO 9001:2026 was published on 16 September 2026, and clause 7.5 keeps its number. Write "ISO 9001" without a year, or name both editions. ISO 9001:2015 certificates stay valid through a three-year transition.
- Guides live in `src/pages/guides/` and use `GuideLayout`, with an answer-first "In short" box, question-led H2s and cited sources. Register every guide in `src/data/guides.ts`. Change `updated` only when the content really changes.

**Updates (29 Sep 2026, global offering):**
- The product name is **Obel-MS**, with the hyphen, everywhere.
- Obel-MS is sold worldwide from the outset, with no default country. Say "hosted on Google Cloud in the region you choose". Standard regions: South Africa (Johannesburg), European Union (Belgium, which also hosts UK workspaces by default), United States (Iowa), Australia (Sydney). London is in-country hosting on request (Neil, 29 Sep; EU–UK adequacy renewed to 2031). Other Google Cloud regions are "available on request, with a one-off regional setup fee". Do not claim a region is already running.
- Prices show in ZAR, USD, EUR, GBP or AUD. The browser picks the currency from the time zone (no network call). Change amounts in `src/data/site.ts` only; the margin check per currency and region lives in the private listing kit.
- AI: OpenAI processes text in the United States by default. In-region AI processing is "available on request" for EU and UK workspaces only (per-tenant provider not built yet). Never list other countries, never claim in-country AI for South Africa, and never name a model.
- Billing: we stay the seller of record. Outside South Africa we send an annual invoice in the customer's currency (bank transfer); card payments may be charged in ZAR. Do not say we add sales tax or GST.
- On-site consulting outside South Africa is quoted with travel.

**Never claim:**
- That the software is "ISO 9001 certified" or "compliant". Say "supports ISO 9001 compliance" or "built around clause 7.5". Only organisations get certified.
- SSO, SAML or MFA.
- E-signatures. Say "approvals recorded in the audit trail".
- Document distribution or acknowledgement (read-and-sign).
- A chat assistant or "ask the AI anything".
- Full-text search across all documents.
- Multi-tenant architecture.
- 21 CFR Part 11, e-signatures, "validated" or GxP compliance. The Validated plan is a waitlist only.
- OCR of Chinese or other non-Latin scripts, fully automatic or guaranteed field capture, or any accuracy percentage.
- 99.9% uptime.
- Uptime percentages, customer counts or testimonials.
- IDC as available. It is "coming soon", with a waitlist.
- Do not claim Customer Complaint, Supplier Deviation or Action templates, template codes, or escalation between records.

## 7. How to check your work

- The dev server runs at `http://localhost:4321` (the orchestrator owns it). Do not start another server. Do not run `astro build`.
- After you edit, fetch your page with `curl -s localhost:4321/<path> | head -c 3000`. Check that it returns HTML and not an Astro error overlay. Also check that the text contains your headings.
- Run `npx astro check 2>&1 | tail -20` for type errors in your files.
- Edit only the files you own (section 8). If you need a change in a shared file (`global.css`, `motion.ts`, `site.ts`, `demo.ts`, `BaseLayout`, `Nav`, `Footer`, `AppWindow`), do not make it. Report it in your result instead.

## 8. File ownership

| Owner | Files |
| --- | --- |
| Orchestrator | shared files above, `components/sections/Hero.astro`, `components/sections/EdcScene.astro`, `pages/index.astro` |
| Agent A (home flow) | `components/sections/ProblemScroll.astro`, `components/sections/ManagedStack.astro`, `components/sections/ClauseMap.astro` |
| Agent B (workflow scene) | `components/sections/WorkflowScene.astro`, `components/sections/TemplatesRail.astro` |
| Agent C (commercial) | `components/sections/PricingTable.astro`, `components/sections/Faq.astro`, `components/sections/CtaBand.astro`, `components/sections/IdcTeaser.astro`, `data/faq.ts`, `pages/pricing.astro` |
| Agent D (product pages) | `pages/product/*.astro`, `components/product/*` |
| Agent E (company pages) | `pages/iso-9001.astro`, `pages/security.astro`, `pages/about.astro`, `pages/contact.astro`, `pages/legal/privacy.astro`, `pages/404.astro`, `public/robots.txt`, `public/og.png`, `scripts/og.mjs` |
