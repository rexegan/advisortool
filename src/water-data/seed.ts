import type { Facility, ComplianceDeadline, LabSample, WaterUsageRecord, PublicNotice } from '../water-types';

export const facilities: Facility[] = [
  {
    id: 'f1',
    name: 'City of Lakewood Village',
    pwsId: 'TX0570027',
    type: 'Municipality',
    county: 'Denton',
    contactName: 'Maria Gonzalez',
    contactEmail: 'mgonzalez@lakewoodvillage.tx.gov',
    contactPhone: '(940) 555-0112',
    populationServed: 4200,
    serviceConnections: 1650,
  },
  {
    id: 'f2',
    name: 'Cypress Creek MUD #4',
    pwsId: 'TX2010045',
    type: 'MUD',
    county: 'Harris',
    contactName: 'James Tran',
    contactEmail: 'jtran@ccmud4.org',
    contactPhone: '(713) 555-0188',
    populationServed: 8900,
    serviceConnections: 3200,
  },
  {
    id: 'f3',
    name: 'Meadow Run Apartments',
    pwsId: 'TX1230884',
    type: 'Apartment Complex',
    county: 'Travis',
    contactName: 'Sandra Okonkwo',
    contactEmail: 'sokonkwo@meadowrun.com',
    contactPhone: '(512) 555-0247',
    populationServed: 960,
    serviceConnections: 320,
  },
];

const today = new Date();
const d = (offset: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().slice(0, 10);
};
const m = (offset: number) => {
  const dt = new Date(today);
  dt.setMonth(dt.getMonth() + offset);
  return dt.toISOString().slice(0, 10);
};

export const deadlines: ComplianceDeadline[] = [
  {
    id: 'd1', facilityId: 'f1',
    title: 'Monthly Bacteriological Report',
    description: 'Submit monthly total coliform/E. coli sampling results to TCEQ.',
    dueDate: d(5), frequency: 'Monthly', category: 'Reporting',
    status: 'Due Soon', notes: 'TCEQ Form 20181', tceqFormNumber: '20181',
  },
  {
    id: 'd2', facilityId: 'f1',
    title: 'Quarterly Disinfectant Residual',
    description: 'Report quarterly disinfectant residual levels and CT calculations.',
    dueDate: d(-3), frequency: 'Quarterly', category: 'Reporting',
    status: 'Overdue', notes: 'Late — contact TCEQ Region 4', tceqFormNumber: '20704',
  },
  {
    id: 'd3', facilityId: 'f2',
    title: 'Annual Water Quality Report (CCR)',
    description: 'Distribute Consumer Confidence Report to all customers by July 1.',
    dueDate: m(1), frequency: 'Annual', category: 'Reporting',
    status: 'Current', notes: '', tceqFormNumber: 'CCR-1',
  },
  {
    id: 'd4', facilityId: 'f2',
    title: 'Lead & Copper Sampling',
    description: 'Collect 30 tap samples from high-risk homes; submit to certified lab.',
    dueDate: d(18), frequency: 'Annual', category: 'Sampling',
    status: 'Current', notes: 'Coordinate with Harris County lab.',
  },
  {
    id: 'd5', facilityId: 'f3',
    title: 'TCEQ Annual Fee',
    description: 'Pay annual public water system registration fee.',
    dueDate: d(-12), frequency: 'Annual', category: 'Fee',
    status: 'Overdue', notes: 'Invoice #TX-2026-3884 outstanding.',
  },
  {
    id: 'd6', facilityId: 'f3',
    title: 'Sanitary Survey Inspection',
    description: 'TCEQ on-site sanitary survey — required every 3 years for Non-Community PWS.',
    dueDate: m(3), frequency: 'One-time', category: 'Inspection',
    status: 'Current', notes: 'Inspector: David Hill, TCEQ Region 6',
  },
  {
    id: 'd7', facilityId: 'f1',
    title: 'Operator License Renewal',
    description: 'Renew Class C Water License for lead operator through TCEQ.',
    dueDate: m(2), frequency: 'Annual', category: 'Certification',
    status: 'Due Soon', notes: 'License #TX-OPS-44821',
  },
  {
    id: 'd8', facilityId: 'f2',
    title: 'Nitrate Sampling',
    description: 'Annual nitrate sampling required; send to certified lab within 24 hrs of collection.',
    dueDate: d(30), frequency: 'Annual', category: 'Sampling',
    status: 'Current', notes: '',
  },
];

export const labSamples: LabSample[] = [
  {
    id: 'l1', facilityId: 'f1',
    sampleType: 'Bacteriological',
    collectionDate: d(-8), labReceivedDate: d(-7), resultDate: d(-5),
    location: 'Entry Point EP-01', parameter: 'Total Coliform',
    result: 0, unit: 'presence/absence', mcl: 0,
    status: 'Pass', labName: 'Texas Environmental Lab', certNumber: 'T104-0012',
    notes: 'Absent — compliant',
  },
  {
    id: 'l2', facilityId: 'f1',
    sampleType: 'Disinfectant',
    collectionDate: d(-8), labReceivedDate: d(-7), resultDate: d(-6),
    location: 'Distribution Zone A', parameter: 'Free Chlorine Residual',
    result: 0.18, unit: 'mg/L', mcl: 0.2,
    status: 'Fail', labName: 'Texas Environmental Lab', certNumber: 'T104-0012',
    notes: 'Below TCEQ minimum of 0.2 mg/L — retest ordered',
  },
  {
    id: 'l3', facilityId: 'f2',
    sampleType: 'Nitrate',
    collectionDate: d(-20), labReceivedDate: d(-19), resultDate: d(-17),
    location: 'Entry Point EP-01', parameter: 'Nitrate as N',
    result: 4.2, unit: 'mg/L', mcl: 10,
    status: 'Pass', labName: 'Accutest Labs Houston', certNumber: 'T104-0088',
    notes: '',
  },
  {
    id: 'l4', facilityId: 'f2',
    sampleType: 'Lead & Copper',
    collectionDate: d(-3), labReceivedDate: d(-2),
    location: 'Residential Tap #14', parameter: 'Lead',
    result: undefined, unit: 'µg/L', mcl: 15,
    status: 'Pending', labName: 'Accutest Labs Houston', certNumber: 'T104-0088',
    notes: 'Results expected in 5 business days',
  },
  {
    id: 'l5', facilityId: 'f3',
    sampleType: 'Bacteriological',
    collectionDate: d(-15), labReceivedDate: d(-14), resultDate: d(-12),
    location: 'Unit 101 Kitchen', parameter: 'E. coli',
    result: 0, unit: 'presence/absence', mcl: 0,
    status: 'Pass', labName: 'Central Texas Water Lab', certNumber: 'T104-0221',
    notes: '',
  },
];

export const usageRecords: WaterUsageRecord[] = [
  {
    id: 'u1', facilityId: 'f1',
    month: '2026-06', productionGallons: 4_820_000, purchasedGallons: 0,
    distributedGallons: 4_650_000, billableConnections: 1640,
    nonRevenueWater: 170_000, avgDailyGallons: 155_000, notes: '',
  },
  {
    id: 'u2', facilityId: 'f1',
    month: '2026-05', productionGallons: 4_510_000, purchasedGallons: 0,
    distributedGallons: 4_390_000, billableConnections: 1635,
    nonRevenueWater: 120_000, avgDailyGallons: 141_600, notes: 'Irrigation season started',
  },
  {
    id: 'u3', facilityId: 'f2',
    month: '2026-06', productionGallons: 0, purchasedGallons: 10_200_000,
    distributedGallons: 9_850_000, billableConnections: 3195,
    nonRevenueWater: 350_000, avgDailyGallons: 328_300, notes: 'Purchased from NW Harris Co. WSC',
  },
  {
    id: 'u4', facilityId: 'f3',
    month: '2026-06', productionGallons: 0, purchasedGallons: 975_000,
    distributedGallons: 950_000, billableConnections: 318,
    nonRevenueWater: 25_000, avgDailyGallons: 31_700, notes: '',
  },
];

export const notices: PublicNotice[] = [
  {
    id: 'n1', facilityId: 'f1',
    type: 'Boil Water',
    title: 'Precautionary Boil Water Notice — Zone B',
    issuedDate: d(-2),
    status: 'Issued',
    affectedArea: 'Zone B — Oak Street to Elm Avenue',
    deliveryMethods: ['Door hanger', 'City website', 'Local TV'],
    content: 'Due to a main line break, customers in Zone B should boil water for at least 1 minute before consuming until further notice. This does not affect Zone A or Zone C customers.',
  },
  {
    id: 'n2', facilityId: 'f2',
    type: 'Violation',
    title: 'TCR Monitoring Violation Notice',
    issuedDate: d(-45), rescindedDate: d(-30),
    status: 'Rescinded',
    violationCode: 'TCR-MON-01',
    affectedArea: 'Entire service area',
    deliveryMethods: ['Bill insert', 'TCEQ online portal'],
    content: 'Cypress Creek MUD #4 failed to collect the required number of monthly bacteriological samples. Corrective action has been completed and compliance restored.',
  },
  {
    id: 'n3', facilityId: 'f3',
    type: 'CCR',
    title: '2025 Annual Water Quality Report',
    issuedDate: m(-1),
    status: 'Issued',
    affectedArea: 'All residents',
    deliveryMethods: ['Posted in leasing office', 'Email to residents', 'Complex website'],
    content: 'Our annual Consumer Confidence Report for 2025 is now available. View it at the leasing office or request a copy from management.',
  },
];
