import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  FileText,
  DollarSign,
  AlertTriangle,
  HeartPulse,
  Scale,
} from 'lucide-react';
import { SoapNote, Language, MarkedDay } from '../types';
import { generateSoapApi } from '../services/api';

interface SoapNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  markedDays: MarkedDay[];
  onNavigateToProviders: (cptCode?: string) => void;
}

export const SoapNoteModal: React.FC<SoapNoteModalProps> = ({
  isOpen,
  onClose,
  language,
  markedDays,
  onNavigateToProviders,
}) => {
  const [soapData, setSoapData] = useState<SoapNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSoapNote();
    }
  }, [isOpen, language]);

  const loadSoapNote = async () => {
    setLoading(true);
    try {
      const data = await generateSoapApi({
        markedDays,
        language,
        patientName: 'Sheila',
        age: 28,
      });
      setSoapData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!soapData) return;
    const text = `8-DOCTOR-PROOF CLINICAL SOAP MEMO
Patient: ${soapData.patientInfo.name} (${soapData.patientInfo.age} yo female)
Generated: ${soapData.patientInfo.dateGenerated}
Upcoming Appointment: ${soapData.patientInfo.upcomingVisit}

[SUBJECTIVE - ANTI-GASLIGHTING PATIENT TIMELINE]
${soapData.subjective.summary}

[OBJECTIVE - NEUROLOGICAL & VILLI RECOVERY TIMELINE]
Vitals: ${soapData.objective.vitalsSummary}
Villi Healing Streak: ${soapData.objective.villiRecoveryDays} Days 100% Gluten-Free
Marked Episodes in June:
${soapData.objective.flareLogBreakdown.map(f => `- ${f.date}: ${f.event} (Symptoms: ${f.clusterSymptoms})`).join('\n')}

[ASSESSMENT & GASLIGHTING DEFENSE]
${soapData.assessment.primaryImpression}
Anti-Anxiety Defense:
${soapData.assessment.gaslightingDefenseNote}

[PLAN - MISSING BLOOD PANEL CODES DOCTORS FORGET TO ORDER]
${soapData.plan.recommendedCptCodes.map(c => `[${c.panelCategory}] ${c.code} ${c.name} | Fair Cash: ${c.typicalCashRate} (Hosp: ${c.hospitalBilledAvg}) - ${c.rationale}`).join('\n')}

Directives:
${soapData.plan.clinicalDirectives.map(d => `- ${d}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-purple-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#B6A1DA] px-5 py-4 flex items-center justify-between text-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAE06D] flex items-center justify-center text-slate-900 shadow-xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                Anti-Gaslighting Clinical Packet · 1-Page Summary
              </span>
              <h3 className="font-extrabold text-base leading-tight">
                "8-Doctor-Proof" SOAP Memo
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center transition"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center transition"
              title="Copy text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {loading && (
            <div className="py-12 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-purple-700 animate-spin mx-auto" />
              <p className="font-bold text-slate-700">Synthesizing Sheila's Neurological Flare Logs into SOAP Note...</p>
              <p className="text-[11px] text-slate-500">Cross-referencing CPT 83516 Celiac, CPT 82784 Total IgA, and B12/Ferritin Malabsorption</p>
            </div>
          )}

          {!loading && soapData && (
            <>
              {/* Patient Banner */}
              <div className="bg-[#F3EDF7] rounded-2xl p-3 border border-purple-200/80 grid grid-cols-2 gap-2 text-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient</span>
                  <span className="font-extrabold text-sm text-slate-900">{soapData.patientInfo.name}, {soapData.patientInfo.age}y</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Upcoming Consult</span>
                  <span className="font-bold text-xs text-purple-950">{soapData.patientInfo.upcomingVisit}</span>
                </div>
              </div>

              {/* S - SUBJECTIVE (Anti-Gaslighting Narrative) */}
              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                    <span className="w-5 h-5 rounded-md bg-[#B6A1DA] text-slate-900 flex items-center justify-center text-[10px] font-black">
                      S
                    </span>
                    <span>SUBJECTIVE (Stopping the "It's Just Anxiety" Gaslighting)</span>
                  </div>
                  <span className="text-[9px] bg-rose-100 text-rose-800 font-black px-2 py-0.5 rounded-full">
                    8 Previous Clinicians Dismissed
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {soapData.subjective.summary}
                </p>
                {soapData.subjective.patientQuotes && (
                  <div className="bg-slate-50 rounded-xl p-2.5 space-y-1 border-l-2 border-purple-400 text-[11px] italic text-slate-600">
                    {soapData.subjective.patientQuotes.map((q, i) => (
                      <p key={i}>"{q}"</p>
                    ))}
                  </div>
                )}
              </div>

              {/* O - OBJECTIVE (Neurological Cluster Timeline) */}
              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                    <span className="w-5 h-5 rounded-md bg-[#B6A1DA] text-slate-900 flex items-center justify-center text-[10px] font-black">
                      O
                    </span>
                    <span>OBJECTIVE (Villi Recovery & Neuropathy Spikes)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {soapData.objective.villiRecoveryDays} Days 100% Gluten-Free
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  {soapData.objective.vitalsSummary}
                </div>

                {/* Flare Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase text-slate-600 grid grid-cols-12">
                    <span className="col-span-3">Date</span>
                    <span className="col-span-5">Trigger / Event</span>
                    <span className="col-span-4">Neurological Metrics</span>
                  </div>
                  {soapData.objective.flareLogBreakdown.map((log, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1.5 text-[11px] border-t border-slate-100 grid grid-cols-12 items-center hover:bg-purple-50/50"
                    >
                      <span className="col-span-3 font-bold text-purple-900">{log.date.replace(', 2025', '')}</span>
                      <span className="col-span-5 text-slate-800 leading-tight pr-1">{log.event}</span>
                      <span className="col-span-4 text-slate-600 text-[10px] font-semibold">{log.clusterSymptoms}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* A - ASSESSMENT & GASLIGHTING DEFENSE NOTE */}
              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                  <span className="w-5 h-5 rounded-md bg-[#B6A1DA] text-slate-900 flex items-center justify-center text-[10px] font-black">
                    A
                  </span>
                  <span>ASSESSMENT & DOCTOR-DEFENSE TALKING POINTS</span>
                </div>
                <p className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                  {soapData.assessment.primaryImpression}
                </p>
                <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-[11px] text-purple-950 font-medium leading-relaxed">
                  <strong className="text-purple-900 block mb-0.5">🛡️ Anti-Gaslighting Clinical Directives:</strong>
                  {soapData.assessment.gaslightingDefenseNote}
                </div>
              </div>

              {/* P - PLAN & MISSING BLOOD PANEL CODES */}
              <div className="border-2 border-[#B6A1DA] rounded-2xl p-3.5 space-y-2.5 bg-purple-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                    <span className="w-5 h-5 rounded-md bg-[#EAE06D] text-slate-900 flex items-center justify-center text-[10px] font-black">
                      P
                    </span>
                    <span>MISSING BLOOD PANEL CODES DOCTORS FORGET</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-purple-800">
                    Celiac + Malabsorption
                  </span>
                </div>

                {/* CPT Codes Breakdown */}
                <div className="space-y-1.5">
                  {soapData.plan.recommendedCptCodes.map((cpt, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-2.5 border border-purple-200 shadow-2xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#E8DFF2] text-purple-950">
                            {cpt.panelCategory}
                          </span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {cpt.code}: {cpt.name}
                          </span>
                        </div>
                        <div className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Fair Cash: {cpt.typicalCashRate}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{cpt.rationale}</span>
                        <span className="line-through text-rose-500">Hosp: {cpt.hospitalBilledAvg}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Directives */}
                <div className="space-y-1 text-slate-700 text-xs pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Villi Healing Directives
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {soapData.plan.clinicalDirectives.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button: Shop Massive Blood Panel Cash Prices */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToProviders('Celiac Panel CPT 83516');
                  }}
                  className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold py-3 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 text-xs active:scale-98"
                >
                  <span>Shop Massive Blood Panel Cash Prices ($45 vs $1,500+)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
