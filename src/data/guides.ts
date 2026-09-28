/* Registry of answer-first guides. The hub page, llms.txt and the footer read from here.
   Keep `updated` equal to the page's GuideLayout `updated` prop. */
export interface GuideMeta {
  slug: string;
  title: string; // H1
  summary: string; // one sentence for cards and llms.txt
  query: string; // primary search query the guide answers
  topic: 'Document control' | 'Suppliers' | 'Workflows' | 'Buying guide';
  updated: string;
}

export const guides: GuideMeta[] = [
  { slug: 'iso-9001-document-control', title: 'ISO 9001 document control: what clause 7.5 asks for', summary: 'What documented information ISO 9001 requires you to control, what a controlled document is, and what auditors check.', query: 'ISO 9001 document control requirements', topic: 'Document control', updated: '2026-09-26' },
  { slug: 'control-of-external-documents', title: 'Control of external documents under ISO 9001', summary: 'Which external documents you must control, how to keep a register of them, and a register template you can copy.', query: 'control of external documents ISO 9001', topic: 'Document control', updated: '2026-09-26' },
  { slug: 'document-control-procedure', title: 'ISO 9001 document control procedure: a worked example', summary: 'A complete, plain-language document control procedure for a small company, section by section.', query: 'ISO 9001 document control procedure example', topic: 'Document control', updated: '2026-09-26' },
  { slug: 'supplier-certificate-tracking', title: 'How to track supplier certificates and expiry dates', summary: 'A practical way to collect supplier certificates, track every expiry date and have the right certificate ready when an auditor asks for it.', query: 'supplier certificate expiry tracking', topic: 'Suppliers', updated: '2026-09-26' },
  { slug: 'capa-and-nonconformance', title: 'Nonconformance and corrective action for small companies', summary: 'The difference between a nonconformance, a correction and a corrective action, and a lean CAPA process that closes properly.', query: 'nonconformance and corrective action process', topic: 'Workflows', updated: '2026-09-26' },
  { slug: 'spreadsheets-vs-qms-software', title: 'Spreadsheets vs QMS software for ISO 9001', summary: 'An honest comparison of running document control in spreadsheets and shared drives against dedicated QMS software.', query: 'QMS software vs spreadsheets', topic: 'Buying guide', updated: '2026-09-26' },
  { slug: 'qms-software-cost', title: 'How much does QMS software cost?', summary: 'Typical price ranges for QMS and document control software, what drives the cost, and the hidden costs to ask about.', query: 'how much does QMS software cost', topic: 'Buying guide', updated: '2026-09-26' },
  { slug: 'iso-9001-software-south-africa', title: 'ISO 9001 software in South Africa: what to look for', summary: 'What South African SMEs should check when choosing ISO 9001 software, including data residency, POPIA and local support.', query: 'ISO 9001 software South Africa', topic: 'Buying guide', updated: '2026-09-26' },
  { slug: 'iso-9001-2026-changes', title: 'ISO 9001:2026: what changed for document control', summary: 'What ISO 9001:2026 changed, the transition timeline for your 2015 certificate, and what it means for clause 7.5 document control.', query: 'ISO 9001:2026 changes', topic: 'Document control', updated: '2026-09-26' },
];
