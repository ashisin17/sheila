import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  DollarSign,
  Copy,
  Check,
  Printer,
  Phone,
  FileText,
  AlertTriangle,
  Scale,
  Sparkles,
} from 'lucide-react';
import { BillAuditResult, Language } from '../types';

interface BillAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: BillAuditResult | null;
  language: Language;
}

export const BillAuditModal: React.FC<BillAuditModalProps> = ({
  isOpen,
  onClose,
  auditResult,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'script' | 'letter'>('audit');
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [selectedScriptLang, setSelectedScriptLang] = useState<'en' | 'es' | 'zh'>(
    language === 'es' ? 'es' : language === 'zh' ? 'zh' : 'en'
  );

  if (!isOpen || !auditResult) return null;

  const currentScript =
    auditResult.phoneScripts[selectedScriptLang] || auditResult.phoneScripts.en;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(currentScript.script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(auditResult.formalDisputeLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-purple-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#B6A1DA] px-5 py-4 flex items-center justify-between text-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAE06D] flex items-center justify-center text-slate-900 shadow-xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                AI Medical Bill Defense
              </span>
              <h3 className="font-extrabold text-base leading-tight">
                Bill Audit & CMS Price Defense
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="bg-[#F3EDF7] px-4 pt-2 border-b border-purple-200/80 flex gap-2 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2 px-3 border-b-2 transition ${
              activeTab === 'audit'
                ? 'border-purple-800 text-purple-950 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Price Comparison (${auditResult.overchargeAmount.toFixed(0)} Overcharge)
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`pb-2 px-3 border-b-2 transition flex items-center gap-1 ${
              activeTab === 'script'
                ? 'border-purple-800 text-purple-950 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone className="w-3 h-3" />
            <span>Bilingual Phone Script</span>
          </button>
          <button
            onClick={() => setActiveTab('letter')}
            className={`pb-2 px-3 border-b-2 transition flex items-center gap-1 ${
              activeTab === 'letter'
                ? 'border-purple-800 text-purple-950 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Dispute Letter</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: AUDIT & COMPARISON */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              {/* Financial Highlight Banner */}
              <div className="bg-[#F3EDF7] rounded-2xl p-4 border border-purple-200 grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Billed</span>
                  <span className="text-base font-black text-rose-600">${auditResult.totalBilled.toFixed(2)}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">CMS Fair Rate</span>
                  <span className="text-base font-black text-emerald-700">${auditResult.fairCashRate.toFixed(2)}</span>
                </div>
                <div className="bg-[#EAE06D]/50 p-2.5 rounded-xl border border-yellow-300">
                  <span className="text-[10px] uppercase font-bold text-slate-700 block">Identified Markup</span>
                  <span className="text-base font-black text-slate-900">${auditResult.overchargeAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Facility & Account Info */}
              <div className="flex items-center justify-between text-[11px] text-slate-600 px-1 font-medium">
                <span>Facility: <strong className="text-slate-800">{auditResult.facilityName}</strong></span>
                <span>Account: <strong className="text-slate-800">{auditResult.accountNumber}</strong></span>
              </div>

              {/* Insurance Denial Alert */}
              {auditResult.denialReason && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-900 font-extrabold text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Insurance Improper Denial Flag:</span>
                  </div>
                  <p className="text-[11px] text-rose-950 font-medium leading-relaxed">
                    {auditResult.denialReason}
                  </p>
                </div>
              )}

              {/* Itemized CPT Breakdown */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                  Itemized CPT Code Disparities
                </span>
                <div className="space-y-2">
                  {auditResult.lineItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-3 border border-purple-100 shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-extrabold text-xs text-purple-950 block">
                            {item.cptCode}
                          </span>
                          <span className="text-slate-700 text-xs font-medium">
                            {item.description}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-rose-600 font-extrabold text-xs block">
                            Billed: ${item.billedAmount}
                          </span>
                          <span className="text-emerald-700 font-bold text-[10px] block">
                            CMS Fair: ${item.fairCmsRate}
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] text-amber-900 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                        {item.violationFlag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 501(r) Charity Care Eligibility */}
              <div className="bg-[#E8DFF2] rounded-2xl p-3 border border-purple-300/60 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-950 font-extrabold text-xs">
                  <Scale className="w-3.5 h-3.5 text-purple-700" />
                  <span>IRC § 501(r) Financial Assistance & Charity Care</span>
                </div>
                <p className="text-slate-800 text-[11px] leading-relaxed">
                  {auditResult.financialAssistanceEligibility.thresholdDescription}
                </p>
              </div>

              {/* Legal Citations */}
              <div className="text-[10px] text-slate-500 space-y-1 px-1">
                <span className="font-bold uppercase tracking-wider text-slate-400 block">
                  Applicable Federal Statutes
                </span>
                <ul className="list-disc list-inside space-y-0.5">
                  {auditResult.legalCitations.map((cit, i) => (
                    <li key={i}>{cit}</li>
                  ))}
                </ul>
              </div>

              {/* CTA to Script */}
              <button
                onClick={() => setActiveTab('script')}
                className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold py-3 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 active:scale-98"
              >
                <Phone className="w-4 h-4" />
                <span>View Word-For-Word Phone Script to Call Billing Dept</span>
              </button>
            </div>
          )}

          {/* TAB 2: BILINGUAL PHONE SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-3">
              {/* Language Selector for Script */}
              <div className="flex items-center justify-between bg-purple-50 p-1.5 rounded-2xl border border-purple-200">
                <span className="text-[11px] font-bold text-purple-950 pl-2">Script Language:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedScriptLang('en')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      selectedScriptLang === 'en'
                        ? 'bg-[#EAE06D] text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setSelectedScriptLang('es')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      selectedScriptLang === 'es'
                        ? 'bg-[#EAE06D] text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    Español
                  </button>
                  <button
                    onClick={() => setSelectedScriptLang('zh')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      selectedScriptLang === 'zh'
                        ? 'bg-[#EAE06D] text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    中文
                  </button>
                </div>
              </div>

              {/* Script Box */}
              <div className="bg-[#F3EDF7] rounded-2xl p-4 border border-purple-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-purple-950">
                    {currentScript.title}
                  </span>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1 text-[11px] font-bold bg-white text-purple-900 px-2.5 py-1 rounded-full border border-purple-200 shadow-2xs hover:bg-purple-50"
                  >
                    {copiedScript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-purple-100 text-xs text-slate-800 leading-relaxed font-serif whitespace-pre-line italic">
                  {currentScript.script}
                </div>
              </div>

              {/* Advice */}
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-emerald-950 space-y-1 text-[11px]">
                <span className="font-bold block">💡 Advocacy Tip When Calling:</span>
                <p>
                  Ask for a "Prompt-Pay Cash Discount" or "Self-Pay Settlement". Most non-profit hospitals have standing authority to reduce uncollected patient balances to the Medicare/CMS allowable rate ($135) immediately to close the account.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DISPUTE LETTER */}
          {activeTab === 'letter' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">
                  Ready to print or mail to Patient Accounts & Compliance
                </span>
                <button
                  onClick={handleCopyLetter}
                  className="flex items-center gap-1 text-xs font-bold bg-[#EAE06D] text-slate-900 px-3 py-1.5 rounded-full shadow-2xs hover:bg-yellow-300 transition"
                >
                  {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLetter ? 'Copied Letter' : 'Copy Dispute Letter'}</span>
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 font-mono text-[11px] text-slate-800 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
                {auditResult.formalDisputeLetter}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
