import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  Upload,
  FileText,
  BadgeDollarSign,
  Building,
  HeartHandshake,
} from 'lucide-react';
import { Provider, Language, BillAuditResult } from '../types';
import { INITIAL_PROVIDERS, DEMO_ASSETS, TRANSLATIONS } from '../data/initialData';
import { auditBillApi } from '../services/api';

interface ProvidersTabProps {
  language: Language;
  onOpenBookingModal: (provider: Provider) => void;
  onOpenSoapModal: () => void;
  onOpenBillAuditModal: (audit: BillAuditResult) => void;
  selectedCptFilter?: string;
  onClearCptFilter?: () => void;
}

export const ProvidersTab: React.FC<ProvidersTabProps> = ({
  language,
  onOpenBookingModal,
  onOpenSoapModal,
  onOpenBillAuditModal,
  selectedCptFilter,
  onClearCptFilter,
}) => {
  const t = TRANSLATIONS[language].providers;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [slidingScaleOnly, setSlidingScaleOnly] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  // Medical Bill Audit state
  const [isAuditingBill, setIsAuditingBill] = useState(false);

  // Filter providers
  const primaryProvider = INITIAL_PROVIDERS.find((p) => p.isPrimary);
  const specialists = INITIAL_PROVIDERS.filter((p) => !p.isPrimary);

  const filteredSpecialists = specialists.filter((p) => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.subspecialty.toLowerCase().includes(q) ||
        p.facility.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Price tier
    if (selectedPriceTier !== 'all' && p.priceTier !== selectedPriceTier) {
      return false;
    }

    // Sliding scale
    if (slidingScaleOnly && !p.slidingScale) {
      return false;
    }

    // Language
    if (selectedLanguage !== 'all') {
      const target =
        selectedLanguage === 'es' ? 'Español' : selectedLanguage === 'zh' ? 'Mandarin' : 'English';
      if (!p.languages.includes(target)) return false;
    }

    return true;
  });

  // Handle Bill Audit
  const handleRunBillAudit = async (useDemo = true) => {
    setIsAuditingBill(true);
    try {
      const billText = useDemo
        ? 'Dermatology consultation and ANA/CRP lab blood panel bill dated May 28, 2025. Total amount billed: $640.00 for Account #ACC-849201-DERM at Metro Specialty Health & Pathology Partners. Line items: CPT 99204 $380, CPT 86038 ANA $185, CPT 86140 CRP $75.'
        : 'Medical bill upload for review against CMS fair market prices.';

      const auditData = await auditBillApi({
        billText,
        billImageBase64: useDemo ? DEMO_ASSETS.medicalBill : undefined,
        language,
      });

      onOpenBillAuditModal(auditData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditingBill(false);
    }
  };

  return (
    <div className="space-y-4 px-4 py-3">
      {/* 1. Header */}
      <div className="px-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          {t.careTeam}
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          {t.title}
        </h2>
      </div>

      {/* 2. Search Bar matching mockup */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-white rounded-full py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 shadow-sm border border-purple-100/80 focus:border-purple-300 outline-none transition font-medium"
        />
      </div>

      {/* Active CPT Code Referral Banner (from SOAP note) */}
      {selectedCptFilter && (
        <div className="bg-[#EAE06D] rounded-2xl p-2.5 text-xs text-slate-900 flex items-center justify-between font-bold shadow-xs">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-slate-900" />
            <span>Filtering for {selectedCptFilter} from your SOAP Memo</span>
          </div>
          {onClearCptFilter && (
            <button
              onClick={onClearCptFilter}
              className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-800 hover:bg-slate-100"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}

      {/* 3. Hotel-Style Price & Access Filter Pills */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold scrollbar-none">
          {/* Price Tier Filter */}
          <div className="flex items-center bg-white rounded-full p-0.5 border border-purple-200/80 shadow-2xs shrink-0">
            <button
              onClick={() => setSelectedPriceTier('all')}
              className={`px-2.5 py-1 rounded-full transition ${
                selectedPriceTier === 'all'
                  ? 'bg-[#B6A1DA] text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setSelectedPriceTier('$')}
              className={`px-2 py-1 rounded-full transition ${
                selectedPriceTier === '$'
                  ? 'bg-[#EAE06D] text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Low Cash Tier (<$50)"
            >
              $ Low
            </button>
            <button
              onClick={() => setSelectedPriceTier('$$')}
              className={`px-2 py-1 rounded-full transition ${
                selectedPriceTier === '$$'
                  ? 'bg-[#EAE06D] text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Medium Tier ($50-$200)"
            >
              $$ Med
            </button>
            <button
              onClick={() => setSelectedPriceTier('$$$')}
              className={`px-2 py-1 rounded-full transition ${
                selectedPriceTier === '$$$'
                  ? 'bg-[#EAE06D] text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Specialty / Hospital Tier ($200+)"
            >
              $$$ High
            </button>
          </div>

          {/* Sliding Scale Toggle */}
          <button
            onClick={() => setSlidingScaleOnly(!slidingScaleOnly)}
            className={`px-3 py-1 rounded-full border shrink-0 transition flex items-center gap-1 ${
              slidingScaleOnly
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold shadow-2xs'
                : 'bg-white text-slate-600 border-purple-200/80 hover:bg-slate-50'
            }`}
          >
            <HeartHandshake className="w-3 h-3 text-emerald-700" />
            <span>{t.filterSliding}</span>
          </button>

          {/* Language Spoken */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white text-slate-700 text-[11px] font-semibold border border-purple-200/80 rounded-full px-2.5 py-1 outline-none shadow-2xs shrink-0 cursor-pointer"
          >
            <option value="all">Languages: All</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="zh">Mandarin (中文)</option>
          </select>
        </div>
      </div>

      {/* 4. "YOUR PROVIDER" Section */}
      {primaryProvider && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            {t.yourProvider}
          </span>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-purple-100/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Avatar JL in yellow circle */}
              <div
                style={{ backgroundColor: primaryProvider.avatarBg }}
                className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-slate-900 shadow-xs shrink-0"
              >
                {primaryProvider.initials}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                  {primaryProvider.name}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {primaryProvider.specialty} · {primaryProvider.subspecialty}
                </p>
                <p className="text-[10px] text-purple-800 font-bold mt-0.5">
                  Next visit: {primaryProvider.nextVisit}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSoapModal}
              className="bg-white hover:bg-purple-50 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-300 shadow-xs transition"
            >
              {t.messageBtn}
            </button>
          </div>
        </div>
      )}

      {/* 5. "DERMATOLOGISTS NEAR YOU" Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            {t.dermatologistsNearYou}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {filteredSpecialists.length} {t.found}
          </span>
        </div>

        {/* List of Dermatologists */}
        <div className="space-y-2.5">
          {filteredSpecialists.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-4 shadow-sm border border-purple-100/70 space-y-2.5 hover:border-purple-200 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar Circle in soft purple */}
                  <div
                    style={{ backgroundColor: doc.avatarBg }}
                    className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-purple-950 shadow-xs shrink-0"
                  >
                    {doc.initials}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                      {doc.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {doc.specialty} · {doc.subspecialty}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {doc.distance} · {doc.visitType}
                    </p>
                  </div>
                </div>

                {/* Yellow "Book" button matching mockup */}
                <button
                  onClick={() => onOpenBookingModal(doc)}
                  className="bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 text-xs font-extrabold px-4 py-2 rounded-full shadow-xs transition active:scale-95"
                >
                  {t.bookBtn}
                </button>
              </div>

              {/* CMS Hospital Price Transparency Badge */}
              <div className="bg-[#F3EDF7] rounded-2xl p-2.5 border border-purple-200/80 flex items-start gap-2">
                <BadgeDollarSign className="w-3.5 h-3.5 text-purple-800 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-slate-800 font-medium">
                  {doc.cmsBadge}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. "Got a Surprise Medical Bill or Denial?" Action Card */}
      <div className="bg-[#B6A1DA] rounded-3xl p-5 text-slate-900 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAE06D] flex items-center justify-center text-slate-900 shrink-0 shadow-xs">
            <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900/80 block">
              Patient Bill Defender & Price Transparency
            </span>
            <h3 className="font-extrabold text-base text-slate-900 leading-snug">
              {t.billCardTitle}
            </h3>
            <p className="text-xs text-slate-800/90 mt-1 leading-relaxed">
              {t.billCardSubtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons for Bill Audit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => handleRunBillAudit(true)}
            disabled={isAuditingBill}
            className="bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 text-xs font-extrabold py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            {isAuditingBill ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileCheck className="w-3.5 h-3.5" />
            )}
            <span>{t.demoBillBtn}</span>
          </button>

          <button
            onClick={() => handleRunBillAudit(false)}
            disabled={isAuditingBill}
            className="bg-white/90 hover:bg-white text-slate-900 text-xs font-bold py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Upload className="w-3.5 h-3.5 text-purple-700" />
            <span>Upload Bill Photo / EOB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
