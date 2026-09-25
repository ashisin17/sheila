import React, { useState } from 'react';
import {
  X,
  Printer,
  Share2,
  Check,
  ShieldCheck,
  QrCode,
  FileText,
  User,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { UserProfile, Language, MarkedDay } from '../types';

interface AdvocacyPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  markedDays: MarkedDay[];
  language: Language;
}

export const AdvocacyPassportModal: React.FC<AdvocacyPassportModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  markedDays,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    const text = `PATIENT ADVOCACY PASSPORT - ${userProfile.name}, ${userProfile.age}
Primary Care: ${userProfile.primaryProvider} (${userProfile.clinic})
Emergency Contact: ${userProfile.emergencyContact.name} - ${userProfile.emergencyContact.phone}
Allergies: ${userProfile.allergies.join(', ')}
AI Flagged Triggers: ${userProfile.pinnedTriggers.map(t => `${t.name} (${t.riskBadge})`).join(', ')}
Total Flares Logged in June 2025: ${markedDays.length}
Target Diagnostic Requisitions: CPT 86038 ANA Panel, CPT 86140 CRP
Price Transparency Rights: Protected under CMS Hospital Price Transparency Rule (45 CFR § 180) & No Surprises Act`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-purple-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#B6A1DA] px-5 py-4 flex items-center justify-between text-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAE06D] flex items-center justify-center text-slate-900 shadow-xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                Official Clinical Export
              </span>
              <h3 className="font-extrabold text-base leading-tight">
                Patient Advocacy Passport
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center transition"
              title="Print Passport"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center transition"
              title="Share / Copy"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
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
          {/* Card Presentation Container */}
          <div className="bg-linear-to-b from-[#F3EDF7] to-white rounded-3xl p-5 border-2 border-[#B6A1DA] shadow-sm space-y-4">
            {/* Top Identity Row */}
            <div className="flex items-start justify-between border-b border-purple-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-900">
                  Sheila Self-Advocate ID
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  {userProfile.name}, {userProfile.age}
                </h2>
                <p className="text-[11px] text-slate-600 font-medium">
                  Primary Clinic: {userProfile.primaryProvider} ({userProfile.clinic})
                </p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl border border-purple-200 p-1 flex items-center justify-center shadow-2xs">
                <QrCode className="w-10 h-10 text-purple-950" />
              </div>
            </div>

            {/* Health Board Summary */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Documented Allergies
                </span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {userProfile.allergies.join(', ')}
                </p>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Daily Regimen
                </span>
                <p className="font-bold text-slate-800 mt-0.5">
                  Vitamin D 2000 IU (14d streak 🔥)
                </p>
              </div>
            </div>

            {/* AI Flagged Triggers & Chemical Compounds */}
            <div className="bg-white/80 p-3 rounded-2xl border border-purple-100 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-purple-900 block">
                Multimodal AI-Detected Inflammatory Triggers
              </span>
              <div className="space-y-1 text-slate-800 text-[11px]">
                {userProfile.pinnedTriggers.map((trig) => (
                  <div key={trig.id} className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">• {trig.name}</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                      {trig.riskBadge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* June 2025 Flare Timeline Summary */}
            <div className="bg-white/80 p-3 rounded-2xl border border-purple-100 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-purple-900">
                <span>June 2025 Recovery Timeline</span>
                <span>{userProfile.villiRecoveryDays} Days Villi Healing Streak</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                Documented neurological cluster (burning feet, hand tingling, post-gluten tachycardia 118 bpm, tremors/ataxia) after barista oat milk and barley malt caramel exposures. Significant recovery on 100% strict gluten elimination and sublingual B12.
              </p>
            </div>

            {/* Diagnostic Directives & Fair Pricing Rights */}
            <div className="bg-[#EAE06D]/40 p-3 rounded-2xl border border-yellow-300 space-y-1 text-[11px] text-slate-900">
              <span className="font-extrabold uppercase text-[10px] tracking-wider block text-slate-800">
                Statutory Rights & Missing Celiac Blood Panel Requisitions
              </span>
              <p className="leading-relaxed">
                Patient is requesting the specific missing Celiac & Malabsorption panel: <strong>CPT 83516 tTG-IgA ($45)</strong>, <strong>CPT 82784 Total Serum IgA ($25)</strong>, <strong>CPT 82607 Vitamin B12 ($20)</strong>, <strong>CPT 82306 Vitamin D ($30)</strong>, and <strong>CPT 82728 Ferritin ($22)</strong>. Protected under CMS Hospital Price Transparency rules (45 CFR § 180) against inflated laboratory charges.
              </p>
            </div>

            {/* Emergency Contact */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-purple-200">
              <span>Emergency: <strong>{userProfile.emergencyContact.name}</strong></span>
              <span>Tel: <strong>{userProfile.emergencyContact.phone}</strong></span>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-slate-50 text-slate-900 font-bold py-2.5 px-3 rounded-2xl border border-slate-300 shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Passport' : 'Share Passport'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
