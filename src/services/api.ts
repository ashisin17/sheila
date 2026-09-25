import { TriggerAnalysis, SoapNote, BillAuditResult, ActionType, Language, MarkedDay } from '../types';

export async function analyzeTriggerApi(params: {
  prompt?: string;
  actionType: ActionType;
  imageBase64?: string;
  imageMimeType?: string;
  hoursSlept?: number;
  sugarIntake?: 'none' | 'low' | 'high';
  alcoholDrinks?: number;
  burningFeet?: number;
  handTingling?: number;
  tremorsAtaxia?: number;
  rapidHeartbeat?: number;
  jointPain?: number;
  language: Language;
}): Promise<TriggerAnalysis> {
  const response = await fetch('/api/analyze-trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to analyze trigger: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
}

export async function generateSoapApi(params: {
  markedDays: MarkedDay[];
  language: Language;
  patientName?: string;
  age?: number;
}): Promise<SoapNote> {
  const response = await fetch('/api/generate-soap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate SOAP note: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
}

export async function auditBillApi(params: {
  billText?: string;
  billImageBase64?: string;
  language: Language;
}): Promise<BillAuditResult> {
  const response = await fetch('/api/audit-bill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to audit bill: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
}
