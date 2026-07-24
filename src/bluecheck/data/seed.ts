import type {
  WaterSystem, ComplianceTask, Sample, Violation,
  PublicNotice, TreatmentAsset, VaultDocument, Vendor,
} from '../types';

const today = new Date();
const d = (offset: number) => { const dt = new Date(today); dt.setDate(dt.getDate() + offset); return dt.toISOString().slice(0, 10); };
const m = (offset: number) => { const dt = new Date(today); dt.setMonth(dt.getMonth() + offset); return dt.toISOString().slice(0, 10); };

// ── Water Systems ─────────────────────────────────────────────
export const systems: WaterSystem[] = [
  {
    id: 's1', name: 'City of Lakewood Village', pwsId: 'TX0570027',
    category: 'Municipal Water System', sourceType: 'Groundwater', systemClass: 'Community',
    county: 'Denton', state: 'TX', populationServed: 4200, serviceConnections: 1650,
    contactName: 'Maria Gonzalez', contactEmail: 'mgonzalez@lakewoodvillage.tx.gov', contactPhone: '(940) 555-0112',
    operatorLicense: 'TX-OPS-44821', operatorExpiry: m(2), activeViolations: 1,
  },
  {
    id: 's2', name: 'Cypress Creek MUD #4', pwsId: 'TX2010045',
    category: 'Municipal Water System', sourceType: 'Purchased', systemClass: 'Community',
    county: 'Harris', state: 'TX', populationServed: 8900, serviceConnections: 3200,
    contactName: 'James Tran', contactEmail: 'jtran@ccmud4.org', contactPhone: '(713) 555-0188',
    activeViolations: 0,
  },
  {
    id: 's3', name: 'Meadow Run Apartments', pwsId: 'TX1230884',
    category: 'Apartment Community', sourceType: 'Purchased', systemClass: 'Non-Transient Non-Community',
    county: 'Travis', state: 'TX', populationServed: 960, serviceConnections: 320,
    contactName: 'Sandra Okonkwo', contactEmail: 'sokonkwo@meadowrun.com', contactPhone: '(512) 555-0247',
    activeViolations: 1,
  },
  {
    id: 's4', name: 'Pines Camp & Conference Center', pwsId: 'TX3310092',
    category: 'Church / Camp', sourceType: 'Groundwater', systemClass: 'Transient Non-Community',
    county: 'Walker', state: 'TX', populationServed: 250, serviceConnections: 12,
    contactName: 'Rev. Michael Brooks', contactEmail: 'mbrooks@pinescampttx.org', contactPhone: '(936) 555-0341',
    activeViolations: 0,
  },
];

// ── Compliance Tasks ──────────────────────────────────────────
export const tasks: ComplianceTask[] = [
  { id: 't1', systemId: 's1', title: 'Monthly Bacteriological Sampling Report', description: 'Submit total coliform/E. coli results to TCEQ via NetDMR.', category: 'Reporting', frequency: 'Monthly', dueDate: d(5), status: 'Due Soon', responsiblePerson: 'Maria Gonzalez', tceqFormNumber: '20181', tceqRuleRef: '30 TAC §290.109', documents: [], notes: '', auditTrail: [] },
  { id: 't2', systemId: 's1', title: 'Quarterly Disinfectant Residual Report', description: 'Report avg/min free chlorine residuals and CT calculations.', category: 'Reporting', frequency: 'Quarterly', dueDate: d(-3), status: 'Overdue', responsiblePerson: 'Maria Gonzalez', tceqFormNumber: '20704', tceqRuleRef: '30 TAC §290.110', documents: [], notes: 'Late — contact TCEQ Region 4 to discuss extension.', auditTrail: [{ timestamp: d(-3), actor: 'System', action: 'Status changed to Overdue' }] },
  { id: 't3', systemId: 's1', title: 'Collect Monthly Bacteriological Samples', description: '5 samples required — entry point + 4 distribution sites.', category: 'Sampling', frequency: 'Monthly', dueDate: d(3), windowStart: d(1), windowEnd: d(10), status: 'Due Soon', responsiblePerson: 'Maria Gonzalez', tceqRuleRef: '30 TAC §290.109(b)', documents: [], notes: '', auditTrail: [] },
  { id: 't4', systemId: 's1', title: 'Operator License Renewal', description: 'Renew Class C Water License through TCEQ Professional Licensing.', category: 'Certification', frequency: 'Annual', dueDate: m(2), status: 'Upcoming', responsiblePerson: 'Maria Gonzalez', documents: [], notes: 'License #TX-OPS-44821', auditTrail: [] },
  { id: 't5', systemId: 's2', title: 'Consumer Confidence Report (CCR)', description: 'Distribute annual water quality report to all customers by July 1.', category: 'Reporting', frequency: 'Annual', dueDate: m(1), status: 'Upcoming', responsiblePerson: 'James Tran', tceqFormNumber: 'CCR-1', documents: [], notes: '', auditTrail: [] },
  { id: 't6', systemId: 's2', title: 'Lead & Copper Sampling — 30 Tap Sites', description: 'Collect first-draw tap samples from Tier 1 high-risk sites.', category: 'Sampling', frequency: 'Annual', dueDate: d(18), windowStart: d(10), windowEnd: d(25), status: 'Upcoming', responsiblePerson: 'James Tran', tceqRuleRef: '30 TAC §290.117', documents: [], notes: '', auditTrail: [] },
  { id: 't7', systemId: 's2', title: 'Nitrate Annual Sampling', description: 'Annual nitrate/nitrite sampling at entry point; 24-hour turnaround to lab.', category: 'Sampling', frequency: 'Annual', dueDate: d(30), status: 'Upcoming', responsiblePerson: 'James Tran', documents: [], notes: '', auditTrail: [] },
  { id: 't8', systemId: 's3', title: 'TCEQ Annual PWS Registration Fee', description: 'Pay annual public water system fee via TCEQ Financial Administration.', category: 'Fee', frequency: 'Annual', dueDate: d(-12), status: 'Overdue', responsiblePerson: 'Sandra Okonkwo', documents: [], notes: 'Invoice #TX-2026-3884 — $180 outstanding.', auditTrail: [] },
  { id: 't9', systemId: 's3', title: 'Sanitary Survey Preparation', description: 'Prepare documentation package for TCEQ triennial on-site inspection.', category: 'Inspection', frequency: '3-Year', dueDate: m(3), status: 'Upcoming', responsiblePerson: 'Sandra Okonkwo', documents: [], notes: 'Inspector: David Hill, TCEQ Region 6', auditTrail: [] },
  { id: 't10', systemId: 's4', title: 'Nitrate Sampling — Transient PWS', description: 'Annual nitrate sample required even for transient non-community systems.', category: 'Sampling', frequency: 'Annual', dueDate: d(45), status: 'Upcoming', responsiblePerson: 'Rev. Michael Brooks', documents: [], notes: '', auditTrail: [] },
  { id: 't11', systemId: 's1', title: 'Monthly Disinfectant Residual Monitoring', description: 'Daily minimum residual checks at entry point and distribution extremities.', category: 'Treatment', frequency: 'Monthly', dueDate: d(1), status: 'In Progress', responsiblePerson: 'Maria Gonzalez', tceqRuleRef: '30 TAC §290.110', documents: [], notes: '', auditTrail: [] },
  { id: 't12', systemId: 's2', title: 'DBP Stage 2 Quarterly Monitoring', description: 'LRAA monitoring for TTHM and HAA5 at 4 distribution sites.', category: 'Sampling', frequency: 'Quarterly', dueDate: d(22), status: 'Upcoming', responsiblePerson: 'James Tran', tceqRuleRef: '30 TAC §290.116', documents: [], notes: '', auditTrail: [] },
  { id: 't13', systemId: 's1', title: 'Backflow Prevention Device Testing', description: 'Annual testing of all backflow prevention assemblies by certified tester.', category: 'Inspection', frequency: 'Annual', dueDate: m(4), status: 'Upcoming', responsiblePerson: 'Maria Gonzalez', documents: [], notes: '', auditTrail: [] },
  { id: 't14', systemId: 's3', title: 'Post-Violation Public Notification', description: 'Issue Tier 2 public notice for monitoring violation within 30 days.', category: 'Public Notification', frequency: 'One-Time', dueDate: d(8), status: 'Due Soon', responsiblePerson: 'Sandra Okonkwo', documents: [], notes: 'Related to missed bacteriological sample Q1.', auditTrail: [] },
];

// ── Samples ───────────────────────────────────────────────────
export const samples: Sample[] = [
  { id: 'sp1', systemId: 's1', contaminantGroup: 'Bacteriological', parameter: 'Total Coliform', collectionRequired: true, requiredFrequency: 'Monthly', collectionWindowStart: d(1), collectionWindowEnd: d(10), collectionLocation: 'Entry Point EP-01', collectorName: 'Maria Gonzalez', collectionDate: d(-8), assignedLabId: 'v1', chainOfCustody: 'Lab Received', status: 'Results Received', result: 0, unit: 'presence/absence', mcl: 0, resultDate: d(-5), violation: false, repeatSampleRequired: false, notes: 'Absent — compliant' },
  { id: 'sp2', systemId: 's1', contaminantGroup: 'Disinfectant Residual', parameter: 'Free Chlorine', collectionRequired: true, requiredFrequency: 'Monthly', collectionWindowStart: d(1), collectionWindowEnd: d(10), collectionLocation: 'Distribution Zone A', collectorName: 'Maria Gonzalez', collectionDate: d(-8), assignedLabId: 'v1', chainOfCustody: 'Lab Received', status: 'Violation Triggered', result: 0.18, unit: 'mg/L', mcl: 0.2, resultDate: d(-6), violation: true, repeatSampleRequired: true, notes: 'Below TCEQ minimum 0.2 mg/L — retest ordered' },
  { id: 'sp3', systemId: 's2', contaminantGroup: 'Nitrate/Nitrite', parameter: 'Nitrate as N', collectionRequired: true, requiredFrequency: 'Annual', collectionWindowStart: d(-30), collectionWindowEnd: d(-1), collectionLocation: 'Entry Point EP-01', collectionDate: d(-20), assignedLabId: 'v2', chainOfCustody: 'Lab Received', status: 'Results Received', result: 4.2, unit: 'mg/L', mcl: 10, resultDate: d(-17), violation: false, repeatSampleRequired: false, notes: '' },
  { id: 'sp4', systemId: 's2', contaminantGroup: 'Lead & Copper', parameter: 'Lead', collectionRequired: true, requiredFrequency: 'Annual', collectionWindowStart: d(10), collectionWindowEnd: d(25), collectionLocation: 'Residential Tap #14', assignedLabId: 'v2', chainOfCustody: 'Not Started', status: 'Scheduled', unit: 'µg/L', actionLevel: 15, violation: false, repeatSampleRequired: false, notes: 'Tier 1 site — first-draw, standing overnight' },
  { id: 'sp5', systemId: 's3', contaminantGroup: 'Bacteriological', parameter: 'Total Coliform', collectionRequired: true, requiredFrequency: 'Monthly', collectionWindowStart: d(1), collectionWindowEnd: d(10), collectionLocation: 'Unit 101 Kitchen Tap', chainOfCustody: 'Not Started', status: 'Scheduled', unit: 'presence/absence', mcl: 0, violation: false, repeatSampleRequired: false, notes: '' },
];

// ── Violations ────────────────────────────────────────────────
export const violations: Violation[] = [
  { id: 'viol1', systemId: 's1', type: 'MCL', parameter: 'Free Chlorine Residual', detectedDate: d(-6), notificationLevel: 'Tier 2 (30-Day)', status: 'In Resolution', noticeIssuedDate: undefined, resolutionPlan: 'Increase chlorine dosage at booster station. Retest within 24 hours of fix.', resolutionDueDate: d(3), fineAmount: undefined, finePaid: false, linkedSampleId: 'sp2', documents: [], notes: 'Booster station feed pump was undersized. Replacement ordered.', repeatViolation: false },
  { id: 'viol2', systemId: 's3', type: 'Monitoring', parameter: 'Bacteriological — Q1 Sample Missed', detectedDate: d(-45), notificationLevel: 'Tier 2 (30-Day)', status: 'In Resolution', noticeIssuedDate: d(-30), resolutionPlan: 'Implement calendar reminder system. Collect makeup sample.', resolutionDueDate: d(8), fineAmount: 500, finePaid: false, documents: [], notes: '', repeatViolation: false },
];

// ── Public Notices ────────────────────────────────────────────
export const notices: PublicNotice[] = [
  { id: 'pn1', systemId: 's1', violationId: 'viol1', type: 'MCL Violation', notificationLevel: 'Tier 2 (30-Day)', title: 'Notice of Low Disinfectant Residual — Zone A', deadlineDate: d(24), status: 'Draft', affectedArea: 'Zone A Distribution', estimatedAffected: 1200, deliveryMethods: [], content: 'Our water system recently found that the disinfectant residual in Zone A fell below the required level of 0.2 mg/L free chlorine. Although this is not an emergency, as our customers, you have a right to know what happened...', proofOfDelivery: false, certificateGenerated: false },
  { id: 'pn2', systemId: 's3', violationId: 'viol2', type: 'Monitoring Violation', notificationLevel: 'Tier 2 (30-Day)', title: 'Notice of Monitoring Violation — Missed Sample', deadlineDate: d(8), status: 'Pending Review', issuedDate: d(-2), affectedArea: 'All residents', estimatedAffected: 960, deliveryMethods: ['Posted Notice', 'Email'], content: 'We are required to monitor your drinking water for specific contaminants on a set schedule. Results of regular monitoring are an indicator of whether or not our drinking water meets health standards. We missed required monitoring...', proofOfDelivery: false, certificateGenerated: false },
];

// ── Treatment Assets ──────────────────────────────────────────
export const assets: TreatmentAsset[] = [
  { id: 'a1', systemId: 's1', name: 'Well #1 — Oak Street', type: 'Well', capacity: 800, capacityUnit: 'GPM', chemicalFeeds: ['Chlorine', 'Fluoride'], lastInspectionDate: m(-6), nextInspectionDate: m(6), operationalStatus: 'Online', notes: 'Primary production well' },
  { id: 'a2', systemId: 's1', name: 'Booster Station — Elm Ave', type: 'Booster Station', chemicalFeeds: ['Chlorine'], operationalStatus: 'Online', notes: 'Chlorine feed pump replaced 2024' },
  { id: 'a3', systemId: 's2', name: 'Purchase Meter — NW Harris WSC', type: 'Purchase Connection', capacity: 3_000_000, capacityUnit: 'GPD', chemicalFeeds: [], operationalStatus: 'Online', notes: 'Master meter #HC-2014' },
];

// ── Document Vault ────────────────────────────────────────────
export const documents: VaultDocument[] = [
  { id: 'doc1', systemId: 's1', name: 'TCEQ Operating Permit 2024', category: 'Permit', uploadDate: m(-12), expiryDate: m(24), uploadedBy: 'Maria Gonzalez', fileSize: '1.2 MB', tags: ['permit', 'TCEQ'] },
  { id: 'doc2', systemId: 's1', name: 'CCR 2025 — Final', category: 'CCR', uploadDate: m(-1), uploadedBy: 'Maria Gonzalez', fileSize: '840 KB', tags: ['ccr', 'annual'] },
  { id: 'doc3', systemId: 's2', name: 'Sanitary Survey Report 2023', category: 'Inspection', uploadDate: m(-18), uploadedBy: 'James Tran', fileSize: '3.4 MB', tags: ['survey', 'inspection'] },
  { id: 'doc4', systemId: 's3', name: 'Q1 Violation Notice — Signed', category: 'Correspondence', uploadDate: d(-30), uploadedBy: 'Sandra Okonkwo', fileSize: '210 KB', tags: ['violation', 'notice'] },
];

// ── Vendors ───────────────────────────────────────────────────
export const vendors: Vendor[] = [
  { id: 'v1', name: 'Texas Environmental Lab', type: 'Testing Lab', contactName: 'Rachel Kim', email: 'rkim@txenvlab.com', phone: '(512) 555-0880', certNumber: 'T104-0012', certExpiry: m(8), serviceArea: 'Statewide', notes: 'NELAC certified; 24-hr turnaround for coliforms' },
  { id: 'v2', name: 'Accutest Labs Houston', type: 'Testing Lab', contactName: 'David Patel', email: 'dpatel@accutest.com', phone: '(713) 555-0440', certNumber: 'T104-0088', certExpiry: m(14), serviceArea: 'Southeast TX', notes: 'Specializes in L&C, VOCs, radiologicals' },
  { id: 'v3', name: 'Lone Star Water Engineering', type: 'Engineer', contactName: 'Carla Mendez, PE', email: 'cmendez@lsweng.com', phone: '(972) 555-0231', certNumber: 'TX-PE-91234', certExpiry: m(6), serviceArea: 'North TX', notes: 'Sanitary surveys, design, TCEQ submittals' },
  { id: 'v4', name: 'TCEQ Region 4 Office', type: 'State Agency', contactName: 'Region 4 Compliance', email: 'region4@tceq.texas.gov', phone: '(972) 226-2553', serviceArea: 'North Central TX', notes: 'Primary regulatory contact' },
];
