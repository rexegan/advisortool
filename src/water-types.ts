export type ComplianceStatus = 'Current' | 'Due Soon' | 'Overdue' | 'Submitted';
export type SampleType = 'Bacteriological' | 'Chemical' | 'Nitrate' | 'Lead & Copper' | 'Radiological' | 'Disinfectant';
export type LabResult = 'Pass' | 'Fail' | 'Pending';
export type NoticeType = 'Boil Water' | 'Violation' | 'CCR' | 'Public Notification';
export type NoticeStatus = 'Draft' | 'Issued' | 'Rescinded';
export type FacilityType = 'Municipality' | 'Apartment Complex' | 'MUD' | 'Water Co-op' | 'Utility District';

export interface Facility {
  id: string;
  name: string;
  pwsId: string; // TX PWS ID e.g. TX1234567
  type: FacilityType;
  county: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  populationServed: number;
  serviceConnections: number;
}

export interface ComplianceDeadline {
  id: string;
  facilityId: string;
  title: string;
  description: string;
  dueDate: string;
  frequency: 'Monthly' | 'Quarterly' | 'Annual' | 'One-time';
  category: 'Sampling' | 'Reporting' | 'Certification' | 'Fee' | 'Inspection';
  status: ComplianceStatus;
  submittedDate?: string;
  notes: string;
  tceqFormNumber?: string;
}

export interface LabSample {
  id: string;
  facilityId: string;
  sampleType: SampleType;
  collectionDate: string;
  labReceivedDate: string;
  resultDate?: string;
  location: string;
  parameter: string;
  result?: number;
  unit: string;
  mcl?: number; // Maximum Contaminant Level
  status: LabResult;
  labName: string;
  certNumber: string;
  notes: string;
}

export interface WaterUsageRecord {
  id: string;
  facilityId: string;
  month: string; // YYYY-MM
  productionGallons: number;
  purchasedGallons: number;
  distributedGallons: number;
  billableConnections: number;
  nonRevenueWater: number;
  avgDailyGallons: number;
  notes: string;
}

export interface PublicNotice {
  id: string;
  facilityId: string;
  type: NoticeType;
  title: string;
  issuedDate: string;
  rescindedDate?: string;
  status: NoticeStatus;
  violationCode?: string;
  affectedArea: string;
  deliveryMethods: string[];
  content: string;
  attachmentUrl?: string;
}

export type ActiveView = 'dashboard' | 'calendar' | 'lab' | 'usage' | 'notices' | 'facilities';
