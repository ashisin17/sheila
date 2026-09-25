export type Language = 'en' | 'es' | 'zh';

export type ActionType = 'skincare' | 'meal' | 'flare' | 'checkin';

export interface TriggerAnalysis {
  compoundName: string;
  category: string;
  riskScore: number;
  riskLevel: 'High Risk' | 'Moderate Risk' | 'Low Risk';
  concreteCorrelation: string;
  clinicalMechanism: string;
  recommendations: string[];
  calendarEventSuggestion: {
    title: string;
    date: string;
    severity: number;
    notes: string;
  };
  healthBoardTag: {
    name: string;
    riskBadge: string;
    notes: string;
  };
}

export interface MarkedDay {
  day: number;
  dateStr: string;
  title: string;
  severity: number; // 1-10
  type: 'flare' | 'checkin' | 'trigger' | 'appointment';
  triggerDetails: string;
  symptoms: string[];
  imageUrl?: string;
  notes: string;
  hasSoapNote?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  subspecialty: string;
  distance: string;
  visitType: string;
  priceTier: '$' | '$$' | '$$$';
  cashVisitPrice: number;
  anaLabPrice: number;
  slidingScale: boolean;
  languages: string[];
  avatarBg: string;
  cmsBadge: string;
  isPrimary?: boolean;
  nextVisit?: string;
  facility: string;
}

export interface CptCodeRecommendation {
  code: string;
  name: string;
  typicalCashRate: string;
  hospitalBilledAvg: string;
  rationale: string;
}

export interface SoapNote {
  patientInfo: {
    name: string;
    age: number;
    dateGenerated: string;
    primaryProvider: string;
    upcomingVisit: string;
  };
  subjective: {
    summary: string;
    patientQuotes: string[];
    symptomTimeline: string;
  };
  objective: {
    vitalsSummary: string;
    loggedFlaresCount: number;
    flareLogBreakdown: Array<{
      date: string;
      event: string;
      trigger: string;
    }>;
    physicalFindings: string;
  };
  assessment: {
    primaryImpression: string;
    riskFactors: string;
    diagnosticConfidence: string;
  };
  plan: {
    recommendedCptCodes: CptCodeRecommendation[];
    clinicalDirectives: string[];
    followUpNote: string;
  };
}

export interface BilledLineItem {
  cptCode: string;
  description: string;
  billedAmount: number;
  fairCmsRate: number;
  overcharge: number;
  violationFlag: string;
}

export interface BillAuditResult {
  facilityName: string;
  billDate: string;
  patientName: string;
  accountNumber: string;
  totalBilled: number;
  fairCashRate: number;
  overchargeAmount: number;
  overchargePercentage: number;
  lineItems: BilledLineItem[];
  legalCitations: string[];
  financialAssistanceEligibility: {
    eligible: boolean;
    thresholdDescription: string;
  };
  phoneScripts: {
    en: { title: string; script: string };
    es: { title: string; script: string };
    zh: { title: string; script: string };
  };
  formalDisputeLetter: string;
}

export interface HealthBoardTrigger {
  id: string;
  name: string;
  category: 'skincare' | 'food' | 'environmental' | 'medication';
  riskBadge: string;
  notes: string;
  dateAdded: string;
}

export interface UserProfile {
  name: string;
  age: number;
  primaryProvider: string;
  clinic: string;
  allergies: string[];
  medications: Array<{
    name: string;
    dosage: string;
    instruction: string;
    streakDays: number;
  }>;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  pinnedTriggers: HealthBoardTrigger[];
}
