export type Language = 'en' | 'es' | 'zh';

export type ActionType = 'menu_oatmilk' | 'syrup_sauce' | 'dish_restaurant' | 'supplement_cosmetic' | 'checkin';

export interface TriggerAnalysis {
  compoundName: string;
  category: string;
  riskScore: number;
  riskLevel: 'High Risk' | 'Moderate Risk' | 'Low Risk';
  isItemSpecific?: boolean;
  showBaristaQuestion?: boolean;
  showSafeAlternatives?: boolean;
  crossContaminationTraps?: string;
  concreteCorrelation?: string;
  clinicalMechanism?: string;
  generalAdvice?: string;
  exactQuestionToAsk: {
    en: string;
    es: string;
    zh: string;
  };
  recommendations: string[];
  safeAlternatives?: string[];
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

export interface DailyBodyMoodLog {
  id?: string;
  day: number;
  month: number;
  year: number;
  dateKey: string; // e.g. "2025-06-12" or "2026-09-25"
  dateStr: string;
  sleepHours: number;
  sugarIntake: 'none' | 'low' | 'high';
  mood: 'Calm' | 'Focused' | 'Fatigued' | 'Brain Fog' | 'Anxious';
  burningFeet: number;
  handTingling: number;
  rapidHeartbeat: number;
  tremorsAtaxia: number;
  bodyNotes?: string;
  savedAt?: string;
}

export interface NeurologicalMetrics {
  hoursSlept: number; // e.g. 5
  sugarIntake: 'none' | 'low' | 'high';
  alcoholDrinks?: number; // optional legacy
  burningFeet: number; // 1-10
  handTingling: number; // 1-10
  tremorsAtaxia: number; // 1-10
  rapidHeartbeat: number; // 1-10
  jointPain: number; // 1-10
}

export interface MarkedDay {
  day: number;
  dateStr: string;
  title: string;
  severity: number; // 1-10
  type: 'gluten_exposure' | 'neuropathy_spike' | 'villi_recovery' | 'appointment';
  triggerDetails: string;
  symptoms: string[];
  imageUrl?: string;
  notes: string;
  isNeurologicalCluster?: boolean;
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
  celiacPanelPrice: number;
  malabsorptionPanelPrice: number;
  slidingScale: boolean;
  languages: string[];
  avatarBg: string;
  cmsBadge: string;
  isPrimary?: boolean;
  nextVisit?: string;
  facility: string;
  celiacLiterate: boolean;
  phone?: string;
}

export interface CptCodeRecommendation {
  code: string;
  name: string;
  typicalCashRate: string;
  hospitalBilledAvg: string;
  rationale: string;
  panelCategory: 'Celiac Panel' | 'Malabsorption / Neuropathy' | 'Differential';
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
    neurologicalClusterDetected: boolean;
  };
  objective: {
    vitalsSummary: string;
    loggedFlaresCount: number;
    villiRecoveryDays: number;
    flareLogBreakdown: Array<{
      date: string;
      event: string;
      trigger: string;
      clusterSymptoms: string;
    }>;
    physicalFindings: string;
  };
  assessment: {
    primaryImpression: string;
    gaslightingDefenseNote: string;
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
  denialReason: string;
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
  category: 'gluten' | 'cross_contamination' | 'neuropathy_trigger' | 'supplement';
  riskBadge: string;
  notes: string;
  dateAdded: string;
}

export interface SymptomToggle {
  id: string;
  label: string;
  description: string;
  category: 'neurological' | 'gut_malabsorption';
  selected: boolean;
  isGaslightedFlag?: boolean;
}

export interface EndoscopyPlan {
  procedureName: string;
  cptCode: string;
  scheduledDate: string; // e.g. "2025-10-24"
  monthsOut: number; // 4
  facilityCashPrice: number;
  hospitalBilledAvg: number;
  phase1: {
    title: string;
    rules: string[];
    purpose: string;
  };
  phase2: {
    title: string;
    startDate: string;
    challengeDuration: string;
    protocol: string;
    rationale: string;
    flareProtectionKit: string[];
  };
}

export interface DailyRecoveryHabits {
  glutenFreeStrict: boolean;
  sleepHours: number;
  zeroAlcohol: boolean;
  lowSugar: boolean;
}

export interface FoodLogEntry {
  id: string;
  time: string; // e.g. "11:00 AM"
  dateStr: string; // e.g. "Thursday, June 12"
  day: number; // 12
  item: string; // e.g. "Iced Latte with caramel drizzle"
  location?: string; // e.g. "Campus Cafe"
  photoUrl?: string;
  suspectedTrigger?: boolean;
  notes?: string;
}

export interface CollectionCard {
  id: string;
  dayLabel: string; // "TUE · JUNE 3"
  type: string; // "Photo check-in", "Wellness check-in", "Journal", "Food log", "After lunch"
  meta?: string; // "2 photos", "Video visit", "1 photo of meal"
  content: string; // "More shedding after showers.", "Asked about iron levels."
  cardBg: 'yellow' | 'white' | 'lavender';
  photosCount?: number;
}

export interface UserCollection {
  id: string;
  title: string; // "Tracking hair loss" or "Celiac symptoms"
  daysSaved: number;
  lastDate: string; // "June 24", "June 28"
  cards: CollectionCard[];
}

export interface UserProfile {
  name: string;
  age: number;
  primaryProvider: string;
  clinic: string;
  villiRecoveryDays: number; // e.g. 42
  allergies: string[];
  medications: Array<{
    name: string;
    dosage: string;
    instruction: string;
    purpose: string;
    streakDays: number;
  }>;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  flareProtocol: {
    step1: string;
    step2: string;
    step3: string;
    tachycardiaNote: string;
  };
  chefBaristaCard: {
    en: string;
    es: string;
    zh: string;
  };
  pinnedTriggers: HealthBoardTrigger[];
  endoscopyPlan?: EndoscopyPlan;
  activeSymptoms?: SymptomToggle[];
  recoveryHabits?: DailyRecoveryHabits;
}
