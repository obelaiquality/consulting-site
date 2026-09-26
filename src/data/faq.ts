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
    q: 'Is Obel MS ISO 9001 certified?',
    a: 'No software can be ISO 9001 certified — only your organisation’s quality management system can be, by an accredited certification body. Obel MS is built around ISO 9001:2015 Clause 7.5 (documented information) to support that certification.',
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
    a: 'There’s no long-term contract. Pay annually for the lower rate, or go month-to-month at the monthly price and cancel any time.',
    tags: ['pricing'],
  },
  {
    q: 'Is there a setup fee?',
    a: 'There’s no setup fee on Starter or Growth. Get in touch about Scale and we’ll confirm what onboarding looks like for your team.',
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
    a: 'Not yet as primary scope. ISO 13485 and GxP validation, including 21 CFR Part 11, are on our roadmap rather than current features. Talk to us about your requirements and timeline.',
    tags: ['iso'],
  },
  {
    q: 'What AI features do you use, and is our data used to train AI models?',
    a: 'AI features — metadata extraction on upload and record summaries — use OpenAI models via API, and your admin can switch them off. Under OpenAI’s API terms, API data is not used for model training.',
    tags: ['security'],
  },
  {
    q: 'Is pricing per user?',
    a: 'No. Each plan has a set number of named editors and unlimited viewers, so people who only need to view a document don’t add to your bill.',
    tags: ['pricing'],
  },
];
