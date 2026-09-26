/*
 * FAQ content for the marketing site. Answers are drawn strictly from docs/BUILD-SPEC.md
 * section 6 (what we may and may not claim). Do not add a claim here that isn't in that list.
 */

export type FaqTag = 'general' | 'pricing' | 'security' | 'iso';

export interface FaqItem {
  q: string;
  a: string;
  tags: FaqTag[];
}

export const faqs: FaqItem[] = [
  {
    q: 'Does Obel MS support ISO 9001:2026?',
    a: 'Yes. ISO 9001:2026 was published on 16 September 2026 and keeps clause 7.5 on documented information, so the controls in Obel MS apply to both editions. Certificates to ISO 9001:2015 stay valid through a three-year transition, so you can move at the pace your certification body agrees.',
    tags: ['iso', 'general'],
  },
  {
    q: 'Is Obel MS ISO 9001 certified?',
    a: 'No software can be ISO 9001 certified — only your organisation’s quality management system can be, by an accredited certification body. Obel MS is built around clause 7.5 (documented information), which is in both ISO 9001:2015 and the new ISO 9001:2026, to support that certification.',
    tags: ['iso'],
  },
  {
    q: 'Where is our data hosted?',
    a: 'On Google Cloud in Johannesburg (africa-south1). Your documents, records and backups stay in South Africa.',
    tags: ['security'],
  },
  {
    q: 'Can you migrate our spreadsheets?',
    a: 'Yes. As part of onboarding we import your existing registers and spreadsheets, so you start with your document and supplier history already in place, not a blank system.',
    tags: ['general'],
  },
  {
    q: 'Do you support SSO?',
    a: 'Not yet. Single sign-on is on our roadmap. Today every person signs in with their own account, and every action is recorded in the audit trail.',
    tags: ['security'],
  },
  {
    q: 'What about Internal Document Control?',
    a: 'Internal Document Control, for your own SOPs, policies and work instructions, is coming soon. Join the waitlist on the Internal Document Control page and we’ll let you know when it’s ready.',
    tags: ['general'],
  },
  {
    q: 'Is there a contract, or can we cancel?',
    a: 'Plans are billed annually. If you prefer month-to-month, it costs 15% more. A two-year prepayment gets 10% off. All ZAR prices exclude 15% VAT.',
    tags: ['pricing'],
  },
  {
    q: 'Is there a setup fee?',
    a: 'Lite has no setup fee. Essentials includes guided onboarding for a once-off R6,500 (import of up to 200 documents and two remote training sessions). Professional onboarding is a once-off R15,000 (up to five workflow templates configured and migration of up to 1,000 documents). All ZAR prices exclude 15% VAT.',
    tags: ['pricing'],
  },
  {
    q: 'How long does setup take?',
    a: 'We agree a go-live date with you during onboarding, based on how many registers and documents you’re bringing across.',
    tags: ['general'],
  },
  {
    q: 'Do we need our own IT team?',
    a: 'No. Obel MS is hosted, so there’s nothing to install or maintain. You sign in and use it; we run the servers, backups and updates.',
    tags: ['general'],
  },
  {
    q: 'Who owns our data, and can we export it?',
    a: 'Your data is yours. You can request a full export of your documents, metadata and audit history at any time.',
    tags: ['security'],
  },
  {
    q: 'How do supplier expiry alerts work?',
    a: 'Each document’s status — Active, Expiring soon, Expired or No expiry set — is calculated automatically, with a default 30-day expiring-soon window you can change. Alerts go out as an org-wide digest by email and in Teams.',
    tags: ['general'],
  },
  {
    q: 'Does Obel MS work for ISO 13485 or GxP environments?',
    a: 'Obel MS is built for ISO 9001 today. A Validated (GxP) plan for regulated teams, with a dedicated environment and a quality agreement, is planned for 2027. Join the waitlist from the pricing page and we will talk you through what it will cover.',
    tags: ['iso'],
  },
  {
    q: 'What AI features do you use, and is our data used to train AI models?',
    a: 'AI features — metadata extraction on upload and record summaries — use OpenAI models via API, and your admin can switch them off. Under OpenAI’s API terms, API data is not used for model training.',
    tags: ['security'],
  },
  {
    q: 'Is pricing per user?',
    a: 'Each plan includes a set number of named users (3, 10 or 30) and unlimited read-only viewers, so people who only need to read a document do not add to your bill. You can add 5 more users for R750 a month.',
    tags: ['pricing'],
  },
];
