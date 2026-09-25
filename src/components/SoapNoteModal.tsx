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
        patientName: 'Maya',
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
    const text = `CLINICAL SOAP MEMO
Patient: ${soapData.patientInfo.name} (${soapData.patientInfo.age} yo female)
Generated: ${soapData.patientInfo.dateGenerated}
Upcoming Visit: ${soapData.patientInfo.upcomingVisit}

[SUBJECTIVE]
${soapData.subjective.summary}

[OBJECTIVE]
Vitals: ${soapData.objective.vitalsSummary}
Flares Logged in June 2025: ${soapData.objective.loggedFlaresCount}
${soapData.objective.flareLogBreakdown.map(f => `- ${f.date}: ${f.event} (Trigger: ${f.trigger})`).join('\n')}

[ASSESSMENT]
${soapData.assessment.primaryImpression}
Risk Factors: ${soapData.assessment.riskFactors}

[PLAN & RECOMMENDED CPT CODES]
${soapData.plan.recommendedCptCodes.map(c => `${c.code}: ${c.name} (Fair Cash: ${c.typicalCashRate} | Hospital Avg: ${c.hospitalBilledAvg})`).join('\n')}
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
              <FileText className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                Clinical Packet · 1-Page Summary
              </span>
              <h3 className="font-extrabold text-base leading-tight">
                Doctor SOAP Memo (June 2025)
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
              <p className="font-bold text-slate-700">Synthesizing Maya's June Marked Days into SOAP Note...</p>
              <p className="text-[11px] text-slate-500">Cross-referencing CPT 86038 ANA & CPT 86140 CRP benchmarks</p>
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

              {/* S - SUBJECTIVE */}
              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                  <span className="w-5 h-5 rounded-md bg-[#B6A1DA] text-slate-900 flex items-center justify-center text-[10px] font-black">
                    S
                  </span>
                  <span>SUBJECTIVE (Patient Narrative & Timeline)</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {soapData.subjective.summary}
                </p>
                {soapData.subjective.patientQuotes && (
                  <div className="bg-slate-50 rounded-xl p-2 space-y-1 border-l-2 border-purple-400 text-[11px] italic text-slate-600">
                    {soapData.subjective.patientQuotes.map((q, i) => (
                      <p key={i}>"{q}"</p>
                    ))}
                  </div>
                )}
              </div>

              {/* O - OBJECTIVE */}
              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                  <span className="w-5 h-5 rounded-md bg-[#B6A1DA] text-slate-900 flex items-center justify-center text-[10px] font-black">
                    O
                  </span>
                  <span>OBJECTIVE (Chronological Flare Log & Photos)</span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  {soapData.objective.vitalsSummary}
                </div>

                {/* Flare Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase text-slate-600 grid grid-cols-12">
                    <span className="col-span-3">Date</span>
                    <span className="col-span-5">Logged Symptom / Event</span>
                    <span className="col-span-4">Offending Trigger</span>
                  </div>
                  {soapData.objective.flareLogBreakdown.map((log, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1.5 text-[11px] border-t border-slate-100 grid grid-cols-12 items-center hover:bg-purple-50/50"
                    >
                      <span className="col-span-3 font-bold text-purple-900">{log.date.replace(', 2025', '')}</span>
                      <span className="col-span-5 text-slate-800">{log.event}</span>
                      <span className="col-span-4 text-slate-600 text-[10px] font-semibold">{log.trigger}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* A - ASSESSMENT */}
              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                  <span className="w-5 h-5 rounded-md bg-[#B6A1DA] text-slate-900 flex items-center justify-center text-[10px] font-black">
                    A
                  </span>
                  <span>ASSESSMENT (Trigger Correlation & Differential)</span>
                </div>
                <p className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                  {soapData.assessment.primaryImpression}
                </p>
                <div className="text-[11px] text-purple-900 font-semibold bg-[#E8DFF2] p-2 rounded-xl">
                  {soapData.assessment.riskFactors}
                </div>
              </div>

              {/* P - PLAN & CPT CODES */}
              <div className="border-2 border-[#B6A1DA] rounded-2xl p-3.5 space-y-2.5 bg-purple-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                    <span className="w-5 h-5 rounded-md bg-[#EAE06D] text-slate-900 flex items-center justify-center text-[10px] font-black">
                      P
                    </span>
                    <span>PLAN & DIAGNOSTIC CPT REQUISITIONS</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-purple-800">
                    Price Transparency Enabled
                  </span>
                </div>

                {/* CPT Codes Cards */}
                <div className="space-y-1.5">
                  {soapData.plan.recommendedCptCodes.map((cpt, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-2.5 border border-purple-200 shadow-2xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-xs">
                          {cpt.code}: {cpt.name}
                        </span>
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
                    Directives for Patient
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {soapData.plan.clinicalDirectives.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button: Shop Affordable Labs & Dermatologists for These Codes */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToProviders('CPT 86038 ANA Panel');
                  }}
                  className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold py-3 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 text-xs active:scale-98"
                >
                  <span>Shop Affordable Labs & Dermatologists for These Codes</span>
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
