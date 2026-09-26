/*
 * Fictional demo data for the product mock-ups. Formats and vocabulary match the real app
 * (EDC register columns, WFM record codes like wf2605170001, audit-trail "Actor action: detail").
 * Never put real customer or supplier names here.
 */

export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'grey';

export const edcDocs = [
  { file: 'FSSC22000 - Karoo Botanicals.pdf', title: 'FSSC 22000 - Dried Herbs - Karoo Botanicals', type: 'FSSC 22000', product: 'Dried Rosemary', supplier: 'Karoo Botanicals', manufacturer: 'Karoo Botanicals', statement: '', cert: 'FSSC-104882', expiry: '2027-03-14', status: 'Active', tone: 'green' as Tone },
  { file: 'Statement - Vegan - Citric Acid.pdf', title: 'Statement - Vegan - Citric Acid - Meridian', type: 'Statement', product: 'Citric Acid', supplier: 'Meridian Ingredients', manufacturer: 'Weifang Ensign', statement: 'Vegan, Vegetarian', cert: '', expiry: '2026-10-09', status: 'Expiring soon', tone: 'amber' as Tone },
  { file: 'TDS - Garlic Powder - Umhlanga.pdf', title: 'TDS (Technical Data Sheet) - Garlic Powder', type: 'TDS', product: 'Dehydrated Garlic Powder', supplier: 'Umhlanga Spice Co.', manufacturer: 'Umhlanga Spice Co.', statement: '', cert: 'TDS-DGP-07', expiry: '2027-06-30', status: 'Active', tone: 'green' as Tone },
  { file: 'Halal Certificate 2026.pdf', title: 'Halal Certificate - Ascorbic Acid - Meridian', type: 'Halal Certificate', product: 'Ascorbic Acid', supplier: 'Meridian Ingredients', manufacturer: 'Zhengzhou Ruipu', statement: 'Halal', cert: 'SANHA-22817', expiry: '2026-09-18', status: 'Expired', tone: 'red' as Tone },
  { file: 'Statement - Non-GMO - Maltol.pdf', title: 'Statement - Non-GMO - Ethyl Maltol', type: 'Statement', product: 'Ethyl Maltol', supplier: 'Meridian Ingredients', manufacturer: 'Anhui Jinhe', statement: 'Non-GMO', cert: '', expiry: '2027-01-22', status: 'Active', tone: 'green' as Tone },
  { file: 'ISO 9001 Cert - Blue Crane.pdf', title: 'ISO 9001:2015 Certificate - Blue Crane Packaging', type: 'ISO 9001', product: 'PET Jars 500 ml', supplier: 'Blue Crane Packaging', manufacturer: 'Blue Crane Packaging', statement: '', cert: 'QMS-SA-3310', expiry: '2028-02-01', status: 'Active', tone: 'green' as Tone },
  { file: 'Allergen Statement - Yeast.pdf', title: 'Statement - Allergen - Nutritional Yeast', type: 'Statement', product: 'Nutritional Yeast Flakes', supplier: 'Karoo Botanicals', manufacturer: 'Angel Yeast', statement: 'Allergen-free', cert: '', expiry: '', status: 'No expiry set', tone: 'grey' as Tone },
  { file: 'COA - Lot 24-118.pdf', title: 'Certificate of Analysis - Spice Oleoresins', type: 'COA', product: 'Spice Oleoresins', supplier: 'Umhlanga Spice Co.', manufacturer: 'Umhlanga Spice Co.', statement: '', cert: 'COA-24-118', expiry: '2027-04-11', status: 'Active', tone: 'green' as Tone },
];

/* EDC record statuses: Inbox -> Validated (Approve) | Rejected | Archived. Document Status (computed): Active, Expiring soon (<=30 days), Expired, No expiry set.
   EDC Folder: Supplier -> Manufacturer -> Product -> document, auto-filed from register metadata. */
export const edcTree = [
  { name: 'Karoo Botanicals', count: 6, children: [
    { name: 'Karoo Botanicals', count: 4, children: [
      { name: 'Dried Rosemary', count: 2, files: ['FSSC 22000 - Dried Herbs - Karoo Botanicals', 'Certificate of Analysis - Rosemary - Lot 24-091'] },
      { name: 'Dried Thyme', count: 2, files: ['Specification - Dried Thyme', 'Statement - Vegan - Dried Thyme'] },
    ] },
    { name: 'Angel Yeast', count: 2, children: [
      { name: 'Nutritional Yeast Flakes', count: 2, files: ['Statement - Allergen - Nutritional Yeast', 'TDS - Nutritional Yeast Flakes'] },
    ] },
  ] },
  { name: 'Meridian Ingredients', count: 11, children: [
    { name: 'Weifang Ensign', count: 3, children: [
      { name: 'Citric Acid', count: 3, files: ['Statement - Vegan - Citric Acid - Meridian', 'COA - Citric Acid - Lot 7781', 'Halal Certificate - Citric Acid'] },
    ] },
  ] },
  { name: 'Umhlanga Spice Co.', count: 5, children: [] },
  { name: 'Blue Crane Packaging', count: 0, children: [] },
];

export const wfmTemplates = [
  { code: 'NC-001', name: 'Nonconformance', stages: ['Report & Record', 'Immediate Correction', 'Investigation & Severity Assessment', 'Root Cause Analysis', 'Corrective & Preventive Action', 'Verification'], approvals: [2, 4], verification: true },
  { code: 'CM-001', name: 'Change Management', stages: ['Log Change', 'Review & Action Plan', 'Implement & Close', 'Verification'], approvals: [1, 2], verification: true },
  { code: 'CC-001', name: 'Customer Complaint', stages: ['Log Complaint', 'Investigation & Customer Response', 'Close or Escalate'], approvals: [], verification: false },
  { code: 'SD-001', name: 'Supplier Deviation', stages: ['Log Deviation & Submit to Supplier', 'Supplier Investigation & Root Cause', 'Supplier Corrective Action', 'Verify Implementation', 'Verification'], approvals: [2, 3], verification: true },
  { code: 'ACT-001', name: 'Action', stages: ['Log Action', 'Close Action'], approvals: [], verification: false },
];

export const wfmRecords = [
  { code: 'wf2609140007', title: 'Mislabelled carton - batch 24-118', template: 'Nonconformance', stage: '3/6', status: 'Pending Approval', tone: 'amber' as Tone, due: '2026-09-29', agent: 'Thandi Mokoena', createdBy: 'Pieter van Wyk', overdue: false },
  { code: 'wf2609110003', title: 'Update allergen matrix for new flavour', template: 'Change Management', stage: '2/4', status: 'Active', tone: 'green' as Tone, due: '2026-10-03', agent: 'Aisha Patel', createdBy: 'Thandi Mokoena', overdue: false },
  { code: 'wf2609020011', title: 'Late delivery complaint - Retail DC', template: 'Customer Complaint', stage: '2/3', status: 'Active', tone: 'green' as Tone, due: '2026-09-24', agent: 'Johan Botha', createdBy: 'Aisha Patel', overdue: true },
  { code: 'wf2608270002', title: 'Supplier COA missing moisture result', template: 'Supplier Deviation', stage: '5/5', status: 'Awaiting Verification', tone: 'blue' as Tone, due: '2026-12-27', agent: 'Thandi Mokoena', createdBy: 'Johan Botha', overdue: false },
  { code: 'wf2608190005', title: 'Calibrate check-weigher line 2', template: 'Action', stage: '2/2', status: 'Completed', tone: 'grey' as Tone, due: '2026-08-30', agent: 'Sipho Dlamini', createdBy: 'Pieter van Wyk', overdue: false },
];

/* Audit trail rows use the app's format: bold actor, action, optional ": detail", then "YYYY-MM-DD HH:MM". */
export const auditTrail = [
  { actor: 'Pieter van Wyk', action: 'created record', detail: 'Nonconformance · Mislabelled carton - batch 24-118', at: '2026-09-14 08:12' },
  { actor: 'Pieter van Wyk', action: 'added entry', detail: '48 cartons quarantined at dispatch', at: '2026-09-14 08:31' },
  { actor: 'System', action: 'stage advanced', detail: 'Immediate Correction → Investigation & Severity Assessment', at: '2026-09-15 16:04' },
  { actor: 'Thandi Mokoena', action: 'uploaded attachment', detail: 'label-proof-v3.pdf', at: '2026-09-16 10:22' },
  { actor: 'Thandi Mokoena', action: 'submitted for approval', detail: 'Approver: Quality Manager', at: '2026-09-16 10:25' },
  { actor: 'Aisha Patel', action: 'approved stage', detail: 'Severity rated Major', at: '2026-09-16 13:47' },
  { actor: 'System', action: 'reminder sent', detail: 'Root Cause Analysis due in 2 days', at: '2026-09-18 07:00' },
  { actor: 'Thandi Mokoena', action: 'submitted for verification', detail: 'Verification due 2026-12-16', at: '2026-09-19 15:10' },
];
