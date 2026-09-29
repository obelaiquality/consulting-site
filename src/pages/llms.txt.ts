/*
 * /llms.txt — a plain-Markdown map of the site for AI assistants (llmstxt.org format).
 * Low effort and low risk; search engines do not need it. Built from site.ts and guides.ts,
 * so it stays in step with the pages.
 */
import type { APIRoute } from 'astro';
import { site, plans, pricingTerms, currencyCodes, fmtMoney } from '../data/site';
import { guides } from '../data/guides';

export const GET: APIRoute = () => {
  const u = (p: string) => `${site.url}${p}`;
  const live = plans.filter((p) => p.status === 'live');
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.name} is hosted ISO 9001 document control and workflow software from ${site.company}, for small and mid-sized companies. It supports clause 7.5 (documented information) of ISO 9001:2015 and ISO 9001:2026. It is sold worldwide. Each customer's workspace is hosted on Google Cloud in the region they choose (standard regions: South Africa, the European Union, the United Kingdom, the United States and Australia; other Google Cloud regions on request), and it is maintained and supported by Obel.`,
    '',
    'Key facts:',
    '- Live modules: External Document Control (supplier certificates, specifications and statements; AI metadata extraction from digital PDFs and from scanned Latin-script documents via OCR, confirmed by a person; auto-filing by supplier, manufacturer and product; expiry tracking with email and Teams alerts) and Workflow Manager (standard templates for nonconformance, CAPA, change control, audits and document review, with approvals by job title, effectiveness verification and an audit trail).',
    '- Coming soon: Internal Document Control (SOPs, policies, work instructions).',
    `- Pricing per month, billed annually, excl. tax: ${live.map((p) => `${p.name} ${currencyCodes.map((c) => fmtMoney(p.price[c], c)).join(' / ')}`).join('; ')}. ${pricingTerms.contract}`,
    '- Software cannot be ISO 9001 certified; organisations are certified by accredited certification bodies. Obel-MS supports compliance.',
    '- Not available today: single sign-on, multi-factor authentication, e-signatures, OCR of Chinese or other non-Latin scripts.',
    `- Contact: ${site.email}`,
    '',
    '## Product',
    `- [External Document Control](${u('/product/external-document-control')}): supplier certificate and external document control.`,
    `- [Workflow Manager](${u('/product/workflow-manager')}): nonconformance, CAPA, change control, audit and document review workflows.`,
    `- [Internal Document Control](${u('/product/internal-document-control')}): coming soon, with a waitlist.`,
    `- [Pricing](${u('/pricing')}): plans, onboarding fees, add-ons and discounts.`,
    `- [ISO 9001 clause map](${u('/iso-9001')}): what each clause asks for and how Obel-MS supports it.`,
    `- [Security and hosting](${u('/security')}): hosting, encryption, backups, AI features and POPIA.`,
    '',
    '## Guides',
    ...guides.map((g) => `- [${g.title}](${u(`/guides/${g.slug}`)}): ${g.summary}`),
    '',
    '## Company',
    `- [About](${u('/about')})`,
    `- [Book a demo](${u('/contact')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
