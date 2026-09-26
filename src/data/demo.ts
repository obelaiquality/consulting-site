/*
 * Fictional demo data for the product mock-ups. Formats and vocabulary match the real app
 * (EDC register columns, WFM record codes like wf2605170001, audit-trail "Actor action: detail").
 * Never put real customer or supplier names here.
 */

export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'grey';

export const edcDocs = [
  { file: 'FSSC22000 - Silverleaf Botanics.pdf', title: 'FSSC 22000 - Botanical Extracts - Silverleaf Botanics', type: 'FSSC 22000', product: 'Rosemary Extract', supplier: 'Silverleaf Botanics', manufacturer: 'Silverleaf Botanics', statement: '', cert: 'FSC-55210', expiry: '2027-03-14', status: 'Active', tone: 'green' as Tone },
  { file: 'Statement - Vegan - Xanthan Gum.pdf', title: 'Statement - Vegan - Xanthan Gum - Meridian', type: 'Statement', product: 'Xanthan Gum', supplier: 'Northwind Ingredients', manufacturer: 'Harbourline Chemicals', statement: 'Vegan, Vegetarian', cert: '', expiry: '2026-10-09', status: 'Expiring soon', tone: 'amber' as Tone },
  { file: 'TDS - Cocoa Powder - Umhlanga.pdf', title: 'TDS (Technical Data Sheet) - Cocoa Powder', type: 'TDS', product: 'Cocoa Powder 10/12', supplier: 'Tamarind & Vale', manufacturer: 'Tamarind & Vale', statement: '', cert: 'TDS-CP-112', expiry: '2027-06-30', status: 'Active', tone: 'green' as Tone },
  { file: 'Halal Certificate 2026.pdf', title: 'Halal Certificate - Sunflower Lecithin - Meridian', type: 'Halal Certificate', product: 'Sunflower Lecithin', supplier: 'Northwind Ingredients', manufacturer: 'Aurelia Biotech', statement: 'Halal', cert: 'HAL-60417', expiry: '2026-09-18', status: 'Expired', tone: 'red' as Tone },
  { file: 'Statement - Non-GMO - Pea Protein.pdf', title: 'Statement - Non-GMO - Pea Protein 80', type: 'Statement', product: 'Pea Protein 80', supplier: 'Northwind Ingredients', manufacturer: 'Brightwater Mills', statement: 'Non-GMO', cert: '', expiry: '2027-01-22', status: 'Active', tone: 'green' as Tone },
  { file: 'ISO 9001 Cert - Blue Crane.pdf', title: 'ISO 9001:2015 Certificate - Kestrel Packaging', type: 'ISO 9001', product: 'Glass Jars 250 ml', supplier: 'Kestrel Packaging', manufacturer: 'Kestrel Packaging', statement: '', cert: 'QMS-4471', expiry: '2028-02-01', status: 'Active', tone: 'green' as Tone },
  { file: 'Allergen Statement - Oat Fibre.pdf', title: 'Statement - Allergen - Oat Fibre', type: 'Statement', product: 'Oat Fibre 200', supplier: 'Silverleaf Botanics', manufacturer: 'Olsen Fermentation', statement: 'Allergen-free', cert: '', expiry: '', status: 'No expiry set', tone: 'grey' as Tone },
  { file: 'COA - Lot 26-044.pdf', title: 'Certificate of Analysis - Vanilla Extract', type: 'COA', product: 'Vanilla Extract', supplier: 'Tamarind & Vale', manufacturer: 'Tamarind & Vale', statement: '', cert: 'COA-26-044', expiry: '2027-04-11', status: 'Active', tone: 'green' as Tone },
];

/* EDC record statuses: Inbox -> Validated (Approve) | Rejected | Archived. Document Status (computed): Active, Expiring soon (<=30 days), Expired, No expiry set.
   EDC Folder: Supplier -> Manufacturer -> Product -> document, auto-filed from register metadata. */
export const edcTree = [
  { name: 'Silverleaf Botanics', count: 6, children: [
    { name: 'Silverleaf Botanics', count: 4, children: [
      { name: 'Rosemary Extract', count: 2, files: ['FSSC 22000 - Botanical Extracts - Silverleaf Botanics', 'Certificate of Analysis - Rosemary - Lot 26-017'] },
      { name: 'Thyme Extract', count: 2, files: ['Specification - Thyme Extract', 'Statement - Vegan - Thyme Extract'] },
    ] },
    { name: 'Olsen Fermentation', count: 2, children: [
      { name: 'Oat Fibre 200', count: 2, files: ['Statement - Allergen - Oat Fibre', 'TDS - Oat Fibre 200'] },
    ] },
  ] },
  { name: 'Northwind Ingredients', count: 11, children: [
    { name: 'Harbourline Chemicals', count: 3, children: [
      { name: 'Xanthan Gum', count: 3, files: ['Statement - Vegan - Xanthan Gum - Meridian', 'COA - Xanthan Gum - Lot 3390', 'Halal Certificate - Xanthan Gum'] },
    ] },
  ] },
  { name: 'Tamarind & Vale', count: 5, children: [] },
  { name: 'Kestrel Packaging', count: 0, children: [] },
];

/* The five standard templates the app seeds (obel-ms-saas tests/fixtures/standard_templates.json).
 * approvals = stage indexes that need sign-off. The app adds a Verification stage to four of them. */
export const wfmTemplates = [
  { name: 'Nonconformance', stages: ['Report & Record', 'Immediate Correction', 'Investigation & Severity Assessment', 'CAPA', 'Verification'], approvals: [3], verification: true },
  { name: 'CAPA', stages: ['Raise CAPA', 'Root Cause Analysis', 'Action Plan', 'Implement Actions', 'Close Out', 'Verification'], approvals: [1, 2, 4], verification: true },
  { name: 'Audit', stages: ['Plan Audit', 'Conduct Audit', 'Record Findings & Issue Report', 'CAPA & Close Out', 'Verification'], approvals: [2, 3], verification: true },
  { name: 'Change Control', stages: ['Raise Change Request', 'Impact Assessment', 'Approval', 'Implement Change', 'Verify Implementation', 'Verification'], approvals: [2, 4], verification: true },
  { name: 'Document Review', stages: ['Schedule Review', 'Conduct Review', 'Update Document', 'Approve & Issue'], approvals: [3], verification: false },
];

export const wfmRecords = [
  { code: 'wf2609140007', title: 'Mislabelled carton - batch 24-118', template: 'Nonconformance', stage: '4/5', status: 'Pending Approval', tone: 'amber' as Tone, due: '2026-09-29', agent: 'Thandi Mokoena', createdBy: 'Pieter van Wyk', overdue: false },
  { code: 'wf2609110003', title: 'Update allergen matrix for new flavour', template: 'Change Control', stage: '2/6', status: 'Active', tone: 'green' as Tone, due: '2026-10-03', agent: 'Aisha Patel', createdBy: 'Thandi Mokoena', overdue: false },
  { code: 'wf2609020011', title: 'Repeat label misprints on line 3', template: 'CAPA', stage: '2/6', status: 'Active', tone: 'green' as Tone, due: '2026-09-24', agent: 'Johan Botha', createdBy: 'Aisha Patel', overdue: true },
  { code: 'wf2608270002', title: 'Supplier COA missing moisture result', template: 'Nonconformance', stage: '5/5', status: 'Awaiting Verification', tone: 'blue' as Tone, due: '2026-12-27', agent: 'Thandi Mokoena', createdBy: 'Johan Botha', overdue: false },
  { code: 'wf2608190005', title: 'Internal audit - goods receiving', template: 'Audit', stage: '5/5', status: 'Completed', tone: 'grey' as Tone, due: '2026-08-30', agent: 'Sipho Dlamini', createdBy: 'Pieter van Wyk', overdue: false },
];

/* Audit trail rows use the app's format: bold actor, action, optional ": detail", then "YYYY-MM-DD HH:MM". */
export const auditTrail = [
  { actor: 'Pieter van Wyk', action: 'created record', detail: 'Nonconformance, Mislabelled carton - batch 24-118', at: '2026-09-14 08:12' },
  { actor: 'Pieter van Wyk', action: 'added entry', detail: '48 cartons quarantined at dispatch', at: '2026-09-14 08:31' },
  { actor: 'System', action: 'stage advanced', detail: 'Immediate Correction → Investigation & Severity Assessment', at: '2026-09-15 16:04' },
  { actor: 'Thandi Mokoena', action: 'uploaded attachment', detail: 'label-proof-v3.pdf', at: '2026-09-16 10:22' },
  { actor: 'Thandi Mokoena', action: 'submitted for approval', detail: 'Approver: Quality Manager', at: '2026-09-16 10:25' },
  { actor: 'Aisha Patel', action: 'approved stage', detail: 'Severity rated Major', at: '2026-09-16 13:47' },
  { actor: 'System', action: 'reminder sent', detail: 'Root Cause Analysis due in 2 days', at: '2026-09-18 07:00' },
  { actor: 'Thandi Mokoena', action: 'submitted for verification', detail: 'Verification due 2026-12-16', at: '2026-09-19 15:10' },
];
