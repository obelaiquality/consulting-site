/* Single source of truth for site-wide facts. Change prices, contact details and nav here only. */

export const site = {
  name: 'Obel-MS',
  company: 'Obel AI & Quality',
  url: 'https://obel-ai.com',
  tagline: 'Every document current. Every approval on record.',
  description:
    'Hosted document control for document-heavy teams: keep certificates, contracts and policies current, run approvals and workflows, and keep a full audit trail. From R1,490 a month.',
  email: 'chat@obel-ai.com',
  demoMailto:
    'mailto:chat@obel-ai.com?subject=Obel-MS%20demo%20request&body=Hi%20Obel%20team%2C%0A%0AI%27d%20like%20a%20demo%20of%20Obel-MS.%0A%0ACompany%3A%0ARole%3A%0ATeam%20size%3A%0AStandards%20we%20work%20to%3A%0A',
  appUrl: '#', // TODO: set when the hosted app has a public sign-in URL
  /*
   * Web3Forms access key (https://web3forms.com): enter chat@obel-ai.com there and it emails you a key.
   * With a key, demo and waitlist requests are delivered straight to that inbox.
   * Without a key, the forms fall back to "open in your email app / Gmail / Outlook / copy".
   * The key is safe to publish: it can only send mail to the inbox that created it.
   */
  web3formsKey: '7137c373-adc7-4cb1-a533-75eedc607469' as string, // gitleaks:allow (public by design)
  /** hCaptcha through Web3Forms. Turn on only after enabling captcha for this key in the Web3Forms dashboard. */
  formCaptcha: false as boolean,
  /*
   * Official profiles of the company elsewhere (LinkedIn, G2, Capterra, Crunchbase, Google Business Profile).
   * They go into the Organization schema as `sameAs`, which helps search engines and AI assistants
   * recognise Obel as one entity. Add each URL once the profile exists; never add a profile that is not live.
   */
  sameAs: [] as string[],
  areaServed: 'Worldwide',
};

/*
 * Hosting: Obel-MS is sold worldwide. Each customer's workspace runs in the Google Cloud region they choose.
 * Standard regions are listed; any other region with Cloud Run, Cloud SQL and Cloud Storage is on request
 * (41 of 43 GCP regions on 29 Sep 2026; research in ~/Repos/obel-listing-kit/research/gcp-regions.md).
 */
export const hosting = {
  summary: 'Hosted on Google Cloud in the region you choose',
  regions: [
    { name: 'South Africa', label: 'South Africa (Johannesburg)', city: 'Johannesburg', id: 'africa-south1' },
    { name: 'European Union', label: 'the European Union (Belgium)', city: 'Belgium', id: 'europe-west1' },
    { name: 'United States', label: 'the United States (Iowa)', city: 'Iowa', id: 'us-central1' },
    { name: 'Australia', label: 'Australia (Sydney)', city: 'Sydney', id: 'australia-southeast1' },
  ],
  ukNote: 'UK workspaces are hosted in the EU region by default. The EU and the UK recognise each other’s data protection as adequate. In-country hosting in London is available on request.',
  more: 'Canada, Switzerland, Japan, South Korea, Singapore, India, Brazil, the Middle East and more than 30 other Google Cloud regions are available on request, with a one-off regional setup fee.',
};
export const hostingList = hosting.regions.map((r) => r.label).join(', ').replace(/, ([^,]*)$/, ' or $1');

export const nav = [
  {
    label: 'Product',
    children: [
      { label: 'External Document Control', href: '/product/external-document-control', note: 'Certificates, contracts and licences from third parties', status: 'live' },
      { label: 'Workflow Manager', href: '/product/workflow-manager', note: 'Reviews, approvals, incidents and corrective actions', status: 'live' },
      { label: 'Internal Document Control', href: '/product/internal-document-control', note: 'SOPs, policies, work instructions', status: 'soon' },
    ],
  },
  { label: 'Industries', href: '/#industries' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Guides', href: '/guides' },
  { label: 'Security', href: '/security' },
] as const;

/*
 * Currencies the site can show. The visitor's currency is picked in the browser (BaseLayout head script)
 * from ?currency=, then a saved choice, then the time zone, then the browser language. No network call.
 * Every price below has one amount per currency; the HTML carries all of them and CSS shows one.
 */
export const currencyCodes = ['ZAR', 'USD', 'EUR', 'GBP', 'AUD'] as const;
export type Currency = (typeof currencyCodes)[number];
export type Money = Record<Currency, number>;
export const currencies: Record<Currency, { symbol: string; name: string; taxNote: string }> = {
  ZAR: { symbol: 'R', name: 'South African rand', taxNote: 'ZAR prices exclude 15% VAT.' },
  USD: { symbol: '$', name: 'US dollar', taxNote: 'USD prices exclude any sales tax, VAT or GST.' },
  EUR: { symbol: '€', name: 'Euro', taxNote: 'EUR prices exclude VAT. Business customers with a valid VAT number pay no VAT (reverse charge).' },
  GBP: { symbol: '£', name: 'Pound sterling', taxNote: 'GBP prices exclude VAT. Business customers with a valid VAT number pay no VAT (reverse charge).' },
  AUD: { symbol: 'A$', name: 'Australian dollar', taxNote: 'AUD prices exclude GST. Business customers account for any GST themselves.' },
};
/**
 * Each currency's price book is set from the Google Cloud costs of its home region (GLOBAL-PRICING-NOTE, 29 Sep 2026).
 * GBP uses the EU region, which serves UK workspaces by default.
 */
export const currencyHome: Record<Currency, { region: string; place: string }> = {
  ZAR: { region: 'africa-south1', place: 'Johannesburg' },
  USD: { region: 'us-central1', place: 'Iowa' },
  EUR: { region: 'europe-west1', place: 'Belgium' },
  GBP: { region: 'europe-west1', place: 'Belgium' },
  AUD: { region: 'australia-southeast1', place: 'Sydney' },
};
export const currencyCostNote = (c: Currency) =>
  `${c} prices follow Google Cloud costs in ${currencyHome[c].place}. The price is the same in every standard region.`;
/** JSON for a <script type="application/ld+json"> block: escapes '<' so no value can close the tag. */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

export const fmtMoney = (n: number, cur: Currency) => currencies[cur].symbol + n.toLocaleString('en-US');
/** Month-to-month price: annual price plus the uplift, rounded to R5 or to 1 in other currencies. */
export const monthlyOf = (n: number, cur: Currency, uplift = 0.15) =>
  cur === 'ZAR' ? Math.round((n * (1 + uplift)) / 5) * 5 : Math.round(n * (1 + uplift));

/*
 * Pricing Rev B (Obel Cloud pricing review, 26 Sep 2026; chosen by Neil).
 * ZAR excludes 15% VAT, per month, billed annually. Month-to-month costs 15% more.
 * Price books per currency (29 Sep 2026) are checked for 50% net margin per region in a private note outside this repo.
 * Until multi-tenancy is live, every plan
 * starts with "Book a demo / Start onboarding"; there is no self-serve checkout yet.
 */
export const pricingTerms = {
  vatNote: 'All ZAR prices exclude 15% VAT.',
  contract: 'Billed annually. Month-to-month costs 15% more.',
  billing: 'Outside South Africa, we send an annual invoice in your currency, payable by bank transfer. Card payments may be charged in ZAR at the day’s exchange rate. Some countries need your local tax number on the invoice, such as a VAT number in the EU or UK, or a GSTIN in India.',
  monthlyUplift: 0.15,
  availability: '99.5% availability target, best effort.',
  aiNote: 'AI metadata extraction is included on every plan and module. Obel-MS reads digital PDFs directly. It reads scanned supplier documents in Latin-script languages with optical character recognition (OCR). The AI suggests the metadata, and a person confirms it in the Inbox.',
  fairUse: 'Each plan includes a monthly page allowance for AI extraction and OCR: 1,000 pages on Lite, 3,000 on Essentials and 10,000 on Professional. Above the allowance, you can move up a plan, or we agree a volume price with you.',
  support: 'Support covers how-to questions and faults: up to 3 hours a year on Lite, 1 hour a month on Essentials and 2 hours a month on Professional, including the quarterly review call. Configuration and data work beyond that, including larger migrations, is charged at the remote consulting rate.',
};

export const plans = [
  {
    id: 'lite',
    name: 'Lite',
    status: 'live' as 'live' | 'waitlist',
    blurb: 'Supplier certificates under control, for small teams.',
    price: { ZAR: 1490, USD: 139, EUR: 119, GBP: 109, AUD: 209 },
    setup: { ZAR: 0, USD: 0, EUR: 0, GBP: 0, AUD: 0, label: 'No setup fee' },
    users: '3 named users, unlimited read-only viewers',
    featured: false,
    cta: 'Start onboarding',
    features: [
      'External Document Control',
      'Expiry alerts by email and Teams',
      'Full audit trail and document versioning',
      'AI metadata extraction and OCR, 1,000 pages a month',
      '10 GB document storage',
      'Email support within 5 business days, up to 3 hours a year',
      '14-day trial on a demo workspace',
    ],
  },
  {
    id: 'essentials',
    name: 'Essentials',
    status: 'live' as 'live' | 'waitlist',
    blurb: 'More users and documents, with faster support.',
    price: { ZAR: 3950, USD: 269, EUR: 239, GBP: 209, AUD: 399 },
    setup: { ZAR: 6500, USD: 449, EUR: 390, GBP: 340, AUD: 650, label: 'guided onboarding of up to 2.5 hours: import of up to 100 documents and a 90-minute remote training session' },
    users: '10 named users, unlimited read-only viewers',
    featured: false,
    cta: 'Book a demo',
    features: [
      'Everything in Lite',
      '10 named users',
      'AI metadata extraction and OCR, 3,000 pages a month',
      '25 GB document storage',
      'Email support within 2 business days, up to 1 hour a month',
      'Guided onboarding and training',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    status: 'live' as 'live' | 'waitlist',
    blurb: 'Documents and the workflows around them.',
    price: { ZAR: 7950, USD: 549, EUR: 489, GBP: 439, AUD: 829 },
    setup: { ZAR: 15000, USD: 990, EUR: 890, GBP: 750, AUD: 1390, label: 'onboarding of up to 5.5 hours: 2 workflow templates set up for you, import of up to 250 documents and 2 remote training sessions' },
    users: '30 named users, unlimited read-only viewers',
    featured: true,
    cta: 'Book a demo',
    features: [
      'Everything in Essentials',
      'Workflow Manager with standard templates for nonconformance, CAPA, change control, audits and document review',
      'Approvals routed by job title and effectiveness verification',
      'AI stage and executive summaries',
      'AI assistant with a monthly usage cap (coming soon)',
      'AI metadata extraction and OCR, 10,000 pages a month',
      '100 GB document storage',
      'Next-business-day support, up to 2 hours a month',
      'A 1-hour review call every quarter',
    ],
  },
] as const;

export const discounts = [
  { name: 'Two-year prepayment', value: '10% off' },
  { name: 'NGOs and academic institutions', value: '20% off' },
  { name: 'Founding customers (our first five clients)', value: '20% off year one' },
];

export const addons = [
  { name: 'Extra 5 users', price: { ZAR: 750, USD: 49, EUR: 45, GBP: 39, AUD: 75 }, unit: 'a month' },
  { name: 'Extra 50 GB storage', price: { ZAR: 350, USD: 25, EUR: 22, GBP: 19, AUD: 35 }, unit: 'a month' },
];

export const services = [
  { name: 'Consulting day', price: { ZAR: 9500, USD: 620, EUR: 570, GBP: 490, AUD: 950 }, unit: 'a day' },
  { name: 'Consulting half day', price: { ZAR: 5500, USD: 360, EUR: 330, GBP: 290, AUD: 550 }, unit: 'a half day' },
  { name: 'Remote consulting', price: { ZAR: 1250, USD: 82, EUR: 75, GBP: 65, AUD: 125 }, unit: 'an hour' },
  { name: 'Audit-day support', price: { ZAR: 12500, USD: 815, EUR: 750, GBP: 650, AUD: 1250 }, unit: 'a day' },
];

export const managed = [
  { title: 'Hosting', body: 'We run Obel-MS on Google Cloud in the region you choose, from Johannesburg to Belgium, Iowa or Sydney. We manage the servers, installs and IT tickets, so you don’t have to.' },
  { title: 'Backups', body: 'Daily backups of your database and documents, encrypted at rest and in transit.' },
  { title: 'Updates', body: 'New features and security patches roll out automatically, and you don’t need to schedule downtime.' },
  { title: 'Migration', body: 'Onboarding on Essentials and Professional includes an import of your existing documents. We quote larger migrations by the hour.' },
  { title: 'Support', body: 'Consultants who know document control and compliance answer your questions, not a ticket queue.' },
  { title: 'Monitoring', body: 'Uptime, errors and storage are watched around the clock, so you hear from us first.' },
];

/*
 * Online checkout (Paddle Billing, merchant of record). NOT ACTIVE: `enabled` stays false until
 * Paddle approves the account, the price IDs below exist, a production region is live and the
 * subscription terms are published. The contract with the provisioning service is in
 * docs/CHECKOUT-CONTRACT.md. The client token and price IDs are public by design; no secret goes here.
 */
export type PlanId = (typeof plans)[number]['id'];
export type Billing = 'annual' | 'monthly';
export const checkout = {
  enabled: false,
  provider: 'paddle' as const,
  environment: 'sandbox' as 'sandbox' | 'production',
  clientToken: '',
  /** Obel Cloud control plane, read-only order status (CORS limited to obel-ai.com). */
  statusApi: '',
  termsUrl: '/legal/terms',
  refundUrl: '/legal/refund',
  termsVersion: '2026-09-29',
  /** One Paddle price per plan and billing period, with currency overrides that match `plans`. */
  prices: {
    lite: { annual: '', monthly: '' },
    essentials: { annual: '', monthly: '' },
    professional: { annual: '', monthly: '' },
  } as Record<PlanId, Record<Billing, string>>,
  /** One-time onboarding prices, added to the first transaction. */
  onboardingPrices: { essentials: '', professional: '' } as Partial<Record<PlanId, string>>,
  regions: [
    { id: 'za', label: 'South Africa (Johannesburg)' },
    { id: 'eu', label: 'European Union (Belgium), also for UK workspaces' },
    { id: 'us', label: 'United States (Iowa)' },
    { id: 'au', label: 'Australia (Sydney)' },
  ],
};

/*
 * Legal pages (/legal/terms, /legal/refund, /legal/privacy). Draft pending legal review (29 Sep 2026).
 * Empty fields render as a visible "[to be confirmed]" placeholder: fill them before merging.
 */
export const legal = {
  entity: 'Obelisk Property Investments (Pty) Ltd, trading as Obel AI & Quality', // CIPC COR14.3
  regNo: '2015/342921/07',
  address: '23 Allen Drive, Bellville, Cape Town, 7530, South Africa',
  informationOfficer: 'Neil Slabbert',
  updated: '29 September 2026',
  refundDays: 14,          // full refund window on the first payment
  leadRetentionMonths: 12, // contact-form requests, after the last contact
  exportDays: 30,          // after the subscription ends, before deletion
  backupDays: 90,          // deleted data leaves backups within this time
  availability: '99.5%',   // a target, not a guarantee (single-zone database at launch)
};
export const tbc = (v: string, label: string) => v || `[${label}: to be confirmed]`;

/* Sub-processors for Obel-MS and this website. Change this list and `changed` together; customers get 30 days' notice. */
export const subProcessors = {
  changed: '29 September 2026',
  list: [
    { name: 'Google Cloud', purpose: 'Hosting of Obel-MS: application, database, document storage and backups', where: 'The region the customer chooses' },
    { name: 'Paddle', purpose: 'Payments, invoices and tax, as Merchant of Record for our orders', where: 'United Kingdom and United States' },
    { name: 'Amazon Web Services (Simple Email Service)', purpose: 'Transactional email from Obel-MS, such as invitations and expiry alerts', where: 'The customer’s region where available' },
    { name: 'Google Workspace', purpose: 'Our own email and documents, including support conversations', where: 'Global' },
    { name: 'Web3Forms', purpose: 'Delivery of the forms on this website', where: 'United States' },
    { name: 'OpenAI', purpose: 'AI metadata extraction and summaries, only for workspaces whose organisation chooses it', where: 'United States by default' },
  ],
};
