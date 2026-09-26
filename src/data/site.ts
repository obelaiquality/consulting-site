/* Single source of truth for site-wide facts. Change prices, contact details and nav here only. */

export const site = {
  name: 'Obel MS',
  company: 'Obel AI & Quality',
  url: 'https://obel-ai.com',
  tagline: 'Hosted ISO 9001 document control and workflow management.',
  description:
    'Hosted ISO 9001 document control and CAPA workflows for SMEs. Supplier certificates, expiry alerts and audit trail, hosted in South Africa, from R1,490 a month.',
  email: 'chat@obel-ai.com',
  demoMailto:
    'mailto:chat@obel-ai.com?subject=Obel%20MS%20demo%20request&body=Hi%20Obel%20team%2C%0A%0AI%27d%20like%20a%20demo%20of%20Obel%20MS.%0A%0ACompany%3A%0ARole%3A%0ATeam%20size%3A%0AStandards%20we%20work%20to%3A%0A',
  region: 'Johannesburg, South Africa (Google Cloud africa-south1)',
  appUrl: '#', // TODO: set when the hosted app has a public sign-in URL
  /*
   * Web3Forms access key (https://web3forms.com): enter chat@obel-ai.com there and it emails you a key.
   * With a key, demo and waitlist requests are delivered straight to that inbox.
   * Without a key, the forms fall back to "open in your email app / Gmail / Outlook / copy".
   * The key is safe to publish: it can only send mail to the inbox that created it.
   */
  web3formsKey: '7137c373-adc7-4cb1-a533-75eedc607469' as string,
  /*
   * Official profiles of the company elsewhere (LinkedIn, G2, Capterra, Crunchbase, Google Business Profile).
   * They go into the Organization schema as `sameAs`, which helps search engines and AI assistants
   * recognise Obel as one entity. Add each URL once the profile exists; never add a profile that is not live.
   */
  sameAs: [] as string[],
  areaServed: ['ZA', 'GB', 'EU'],
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
  { label: 'Guides', href: '/guides' },
  { label: 'Security', href: '/security' },
] as const;

export type Currency = 'ZAR' | 'USD';

/*
 * Pricing Rev B (Obel Cloud pricing review, 26 Sep 2026; chosen by Neil).
 * ZAR excludes 15% VAT, per month, billed annually. Month-to-month costs 15% more.
 * USD is for clients outside South Africa (no VAT). Until multi-tenancy is live, every plan
 * starts with "Book a demo / Start onboarding"; there is no self-serve checkout yet.
 */
export const pricingTerms = {
  vatNote: 'All ZAR prices exclude 15% VAT.',
  contract: 'Billed annually. Month-to-month costs 15% more.',
  monthlyUplift: 0.15,
  availability: '99.5% availability target, best effort.',
};

export const plans = [
  {
    id: 'lite',
    name: 'Lite',
    status: 'live' as const,
    blurb: 'Supplier certificates under control, for small teams.',
    price: { ZAR: 1490, USD: 95 },
    setup: { ZAR: 0, USD: 0, label: 'No setup fee' },
    users: '3 named users, unlimited read-only viewers',
    featured: false,
    cta: 'Start onboarding',
    features: [
      'External Document Control',
      'Expiry alerts by email and Teams',
      'Full audit trail and document versioning',
      'AI metadata extraction for digital PDFs, 100 documents a month',
      '10 GB document storage',
      'Email support within 5 business days',
      '14-day trial on a demo workspace',
    ],
  },
  {
    id: 'essentials',
    name: 'Essentials',
    status: 'live' as const,
    blurb: 'More people, more documents, faster support.',
    price: { ZAR: 3950, USD: 250 },
    setup: { ZAR: 6500, USD: 420, label: 'guided onboarding: import of up to 200 documents and 2 remote training sessions' },
    users: '10 named users, unlimited read-only viewers',
    featured: false,
    cta: 'Book a demo',
    features: [
      'Everything in Lite',
      '10 named users',
      'AI metadata extraction, 300 documents a month',
      '25 GB document storage',
      'Email support within 2 business days',
      'Guided onboarding and training',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    status: 'live' as const,
    blurb: 'Documents and the workflows around them.',
    price: { ZAR: 7950, USD: 520 },
    setup: { ZAR: 15000, USD: 980, label: 'onboarding: up to 5 workflow templates configured and migration of up to 1,000 documents' },
    users: '30 named users, unlimited read-only viewers',
    featured: true,
    cta: 'Book a demo',
    features: [
      'Everything in Essentials',
      'Workflow Manager for nonconformance, CAPA, change control, complaints and supplier deviations',
      'Approvals routed by job title and effectiveness verification',
      'AI stage and executive summaries',
      'AI assistant with a monthly usage cap (coming soon)',
      'AI metadata extraction, 1,000 documents a month',
      '100 GB document storage',
      'Next-business-day support',
      'A 1-hour review call every quarter',
    ],
  },
  {
    id: 'validated',
    name: 'Validated (GxP)',
    status: 'waitlist' as const,
    blurb: 'For regulated teams. Join the waitlist for 2027.',
    price: { ZAR: 24500, USD: 1590 },
    setup: { ZAR: 0, USD: 0, label: 'Setup agreed per project' },
    users: 'Agreed per client',
    featured: false,
    cta: 'Join the waitlist',
    features: [
      'Everything in Professional',
      'Own dedicated environment',
      'High-availability database',
      'A UAT copy and a release hold',
      'Quality agreement',
    ],
  },
] as const;

export const discounts = [
  { name: 'Two-year prepayment', value: '10% off' },
  { name: 'NGOs and academic institutions', value: '20% off' },
  { name: 'Founding customers (our first five clients)', value: '20% off year one' },
];

export const addons = [
  { name: 'Extra 5 users', price: { ZAR: 750, USD: 49 }, unit: 'a month' },
  { name: 'Extra 50 GB storage', price: { ZAR: 350, USD: 23 }, unit: 'a month' },
  { name: 'Extra 1,000 AI documents', price: { ZAR: 350, USD: 23 }, unit: 'a month' },
];

export const services = [
  { name: 'Consulting day', price: { ZAR: 9500, USD: 620 }, unit: 'a day' },
  { name: 'Consulting half day', price: { ZAR: 5500, USD: 360 }, unit: 'a half day' },
  { name: 'Remote consulting', price: { ZAR: 1250, USD: 82 }, unit: 'an hour' },
  { name: 'Audit-day support', price: { ZAR: 12500, USD: 815 }, unit: 'a day' },
];

export const managed = [
  { title: 'Hosting', body: 'We run Obel MS on Google Cloud in Johannesburg. No servers, no installs, no IT tickets.' },
  { title: 'Backups', body: 'Daily backups of your database and documents, encrypted at rest and in transit.' },
  { title: 'Updates', body: 'New features and security patches land without downtime windows you have to plan.' },
  { title: 'Migration', body: 'We import your existing registers and spreadsheets so you start with history, not a blank page.' },
  { title: 'Support', body: 'Real quality people, not a ticket bot. We speak ISO 9001 as well as we speak software.' },
  { title: 'Monitoring', body: 'Uptime, errors and storage are watched around the clock, so you hear from us first.' },
];
