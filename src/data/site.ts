/* Single source of truth for site-wide facts. Change prices, contact details and nav here only. */

export const site = {
  name: 'Obel MS',
  company: 'Obel AI & Quality',
  url: 'https://obel-ai.com',
  tagline: 'Hosted ISO 9001 document control and workflow management.',
  description:
    'Obel MS is a hosted quality management system for growing companies. External document control and workflow management built around ISO 9001:2015 clause 7.5 — hosted, maintained and supported for you.',
  email: 'chat@obel-ai.com',
  demoMailto:
    'mailto:chat@obel-ai.com?subject=Obel%20MS%20demo%20request&body=Hi%20Obel%20team%2C%0A%0AI%27d%20like%20a%20demo%20of%20Obel%20MS.%0A%0ACompany%3A%0ARole%3A%0ATeam%20size%3A%0AStandards%20we%20work%20to%3A%0A',
  region: 'Johannesburg, South Africa (Google Cloud africa-south1)',
  appUrl: '#', // TODO: set when the hosted app has a public sign-in URL
};

export const nav = [
  {
    label: 'Product',
    children: [
      { label: 'External Document Control', href: '/product/external-document-control', note: 'Supplier certificates, standards, specs', status: 'live' },
      { label: 'Workflow Manager', href: '/product/workflow-manager', note: 'Approvals, NCRs, CAPA, change control', status: 'live' },
      { label: 'Internal Document Control', href: '/product/internal-document-control', note: 'SOPs, policies, work instructions', status: 'soon' },
    ],
  },
  { label: 'ISO 9001', href: '/iso-9001' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Security', href: '/security' },
  { label: 'About', href: '/about' },
] as const;

export type Currency = 'ZAR' | 'USD';

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    blurb: 'Get your external documents under control.',
    price: { ZAR: 1490, USD: 85 },
    annualNote: 'Billed annually. R1,790 month-to-month.',
    annualNoteUSD: 'Billed annually. $99 month-to-month.',
    users: 'Up to 5 editors, unlimited viewers',
    featured: false,
    cta: 'Start with Starter',
    features: [
      'External Document Control',
      'Supplier certificate and expiry tracking',
      'Expiry alerts by email and Teams',
      'Full audit trail',
      'Daily backups',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    blurb: 'Documents and the workflows around them.',
    price: { ZAR: 2990, USD: 165 },
    annualNote: 'Billed annually. R3,590 month-to-month.',
    annualNoteUSD: 'Billed annually. $199 month-to-month.',
    users: 'Up to 20 editors, unlimited viewers',
    featured: true,
    cta: 'Start with Growth',
    features: [
      'Everything in Starter',
      'Workflow Manager',
      'Nonconformance, change, complaint and supplier-deviation templates',
      'Approvals routed by job title',
      'AI metadata extraction on upload',
      'Effectiveness verification and PDF record reports',
      'Guided migration of your existing registers',
      'Priority support',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    blurb: 'For multi-site teams and heavier audits.',
    price: { ZAR: 5990, USD: 330 },
    annualNote: 'Billed annually. R7,190 month-to-month.',
    annualNoteUSD: 'Billed annually. $399 month-to-month.',
    users: 'Unlimited editors, unlimited viewers',
    featured: false,
    cta: 'Talk to us',
    features: [
      'Everything in Growth',
      'Internal Document Control (early access)',
      'Custom workflow templates built with you',
      'Dedicated cloud project on request',
      'Quarterly system review with a quality consultant',
      'Audit-day support',
    ],
  },
] as const;

export const managed = [
  { title: 'Hosting', body: 'We run Obel MS on Google Cloud in Johannesburg. No servers, no installs, no IT tickets.' },
  { title: 'Backups', body: 'Daily backups of your database and documents, with restores we test.' },
  { title: 'Updates', body: 'New features and security patches land without downtime windows you have to plan.' },
  { title: 'Migration', body: 'We import your existing registers and spreadsheets so you start with history, not a blank page.' },
  { title: 'Support', body: 'Real quality people, not a ticket bot. We speak ISO 9001 as well as we speak software.' },
  { title: 'Monitoring', body: 'Uptime, errors and storage are watched around the clock, so you hear from us first.' },
];
