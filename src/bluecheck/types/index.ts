// ── System Classification ──────────────────────────────────────
export type SourceType = 'Groundwater' | 'Surface Water' | 'Purchased';
export type SystemClass = 'Community' | 'Non-Transient Non-Community' | 'Transient Non-Community';
export type FacilityCategory =
  | 'Municipal Water System'
  | 'Rural Water District'
  | 'Apartment Community'
  | 'Hotel / Resort'
  | 'Mobile Home Park'
  | 'School / University'
  | 'Hospital / Nursing Home'
  | 'Manufactured Housing Community'
  | 'Commercial Building'
  | 'Industrial Facility'
  | 'Church / Camp'
  | 'HOA – Private System';

export interface WaterSystem {
  id: string;
  name: string;
  pwsId: string;
  category: FacilityCategory;
  sourceType: SourceType;
  systemClass: SystemClass;
  county: string;
  state: string;
  populationServed: number;
  serviceConnections: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  operatorLicense?: string;
  operatorExpiry?: string;
  activeViolations: number;
}

// ── Compliance Calendar ────────────────────────────────────────
export type TaskFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | '3-Year' | '9-Year' | 'One-Time';
export type TaskCategory = 'Sampling' | 'Reporting' | 'Treatment' | 'Inspection' | 'Certification' | 'Fee' | 'Public Notification' | 'Training';
export type TaskStatus = 'Upcoming' | 'Due Soon' | 'Overdue' | 'Completed' | 'Waived' | 'In Progress';

export interface ComplianceTask {
  id: string;
  systemId: string;
  title: string;
  description: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  dueDate: string;
  windowStart?: string;
  windowEnd?: string;
  graceEndDate?: string;
  status: TaskStatus;
  completedDate?: string;
  completedBy?: string;
  responsiblePerson: string;
  tceqRuleRef?: string;
  tceqFormNumber?: string;
  linkedSampleId?: string;
  documents: string[];
  notes: string;
  auditTrail: AuditEvent[];
}

export interface AuditEvent {
  timestamp: string;
  actor: string;
  action: string;
}

// ── Sampling ───────────────────────────────────────────────────
export type ContaminantGroup = 'Bacteriological' | 'Chemical' | 'Nitrate/Nitrite' | 'Lead & Copper' | 'Radiological' | 'Disinfectant Residual' | 'DBP' | 'Surface Water Treatment';
export type SampleStatus = 'Scheduled' | 'Collected' | 'In Transit' | 'At Lab' | 'Results Received' | 'Violation Triggered';
export type ChainOfCustodyStatus = 'Not Started' | 'Collector Signed' | 'Lab Received';

export interface Sample {
  id: string;
  systemId: string;
  contaminantGroup: ContaminantGroup;
  parameter: string;
  collectionRequired: boolean;
  requiredFrequency: TaskFrequency;
  collectionWindowStart: string;
  collectionWindowEnd: string;
  collectorName?: string;
  collectionDate?: string;
  collectionLocation: string;
  assignedLabId?: string;
  chainOfCustody: ChainOfCustodyStatus;
  status: SampleStatus;
  result?: number;
  unit: string;
  mcl?: number;
  actionLevel?: number;
  resultDate?: string;
  violation: boolean;
  repeatSampleRequired: boolean;
  notes: string;
}

// ── Testing / Violations ───────────────────────────────────────
export type ViolationType = 'MCL' | 'MRDL' | 'TT' | 'Monitoring' | 'Reporting' | 'Public Notification';
export type ViolationStatus = 'Open' | 'In Resolution' | 'Resolved' | 'Referred';
export type NotificationLevel = 'Tier 1 (24-Hour)' | 'Tier 2 (30-Day)' | 'Tier 3 (Annual)';

export interface Violation {
  id: string;
  systemId: string;
  type: ViolationType;
  parameter: string;
  detectedDate: string;
  notificationLevel: NotificationLevel;
  status: ViolationStatus;
  noticeIssuedDate?: string;
  resolutionPlan: string;
  resolutionDueDate?: string;
  resolvedDate?: string;
  fineAmount?: number;
  finePaid?: boolean;
  linkedSampleId?: string;
  documents: string[];
  notes: string;
  repeatViolation: boolean;
}

// ── Public Notification ───────────────────────────────────────
export type NoticeType = 'Boil Water' | 'MCL Violation' | 'Monitoring Violation' | 'CCR' | 'Public Education' | 'Health Advisory';
export type NoticeStatus = 'Draft' | 'Pending Review' | 'Issued' | 'Rescinded';
export type DeliveryMethod = 'Direct Mail' | 'Door Hanger' | 'Bill Insert' | 'Email' | 'Website' | 'Local TV/Radio' | 'Newspaper' | 'Posted Notice' | 'TCEQ Portal';

export interface PublicNotice {
  id: string;
  systemId: string;
  violationId?: string;
  type: NoticeType;
  notificationLevel?: NotificationLevel;
  title: string;
  issuedDate?: string;
  deadlineDate: string;
  rescindedDate?: string;
  status: NoticeStatus;
  affectedArea: string;
  estimatedAffected: number;
  deliveryMethods: DeliveryMethod[];
  certifiedMailCount?: number;
  content: string;
  proofOfDelivery: boolean;
  certificateGenerated: boolean;
}

// ── Water Treatment ───────────────────────────────────────────
export type SourceAssetType = 'Well' | 'Surface Intake' | 'Purchase Connection' | 'Treatment Plant' | 'Booster Station' | 'Storage Tank' | 'Distribution Main';
export type ChemFeed = 'Chlorine' | 'Chloramine' | 'Fluoride' | 'Corrosion Inhibitor' | 'pH Adjustment' | 'Coagulant' | 'Sequestrant';

export interface TreatmentAsset {
  id: string;
  systemId: string;
  name: string;
  type: SourceAssetType;
  capacity?: number;
  capacityUnit?: string;
  chemicalFeeds: ChemFeed[];
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  operationalStatus: 'Online' | 'Offline' | 'Standby' | 'Maintenance';
  notes: string;
}

// ── Document Vault ────────────────────────────────────────────
export type DocCategory = 'Permit' | 'Contract' | 'Lab Report' | 'Engineering Report' | 'Inspection' | 'CCR' | 'Certificate' | 'Photo' | 'Correspondence' | 'Other';

export interface VaultDocument {
  id: string;
  systemId: string;
  name: string;
  category: DocCategory;
  uploadDate: string;
  expiryDate?: string;
  uploadedBy: string;
  fileSize: string;
  tags: string[];
}

// ── Vendors ───────────────────────────────────────────────────
export type VendorType = 'Testing Lab' | 'Engineer' | 'Operator' | 'State Agency' | 'Contractor' | 'Supplier' | 'Consultant';

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  contactName: string;
  email: string;
  phone: string;
  certNumber?: string;
  certExpiry?: string;
  serviceArea: string;
  notes: string;
}

// ── App-level ─────────────────────────────────────────────────
export type AppView = 'dashboard' | 'calendar' | 'sampling' | 'testing' | 'notifications' | 'treatment' | 'vault' | 'vendors' | 'violations' | 'audit' | 'systems';

export interface ComplianceScore {
  overall: number;
  breakdown: {
    sampling: number;
    reporting: number;
    violations: number;
    notifications: number;
    treatment: number;
  };
}
