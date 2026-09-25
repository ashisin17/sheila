import React, { useState, useMemo } from 'react';
import { Pill, CheckCircle2, X, Search, Star, Clock } from 'lucide-react';
import { Provider, Language, BillAuditResult } from '../types';
import { INITIAL_PROVIDERS } from '../data/initialData';

interface ProvidersTabProps {
  language: Language;
  onOpenBookingModal: (provider: Provider) => void;
  onOpenSoapModal: () => void;
  onOpenBillAuditModal?: (audit: BillAuditResult) => void;
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
  // Pharmacy refill state
  const [refillSuccess, setRefillSuccess] = useState(false);
  const [pharmacyName, setPharmacyName] = useState('[Pharmacy name]');
  const [isEditingPharmacy, setIsEditingPharmacy] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  // Providers data
  const primaryDoctor = INITIAL_PROVIDERS.find((p) => p.isPrimary) || INITIAL_PROVIDERS[0];
  const allRecommended = INITIAL_PROVIDERS.filter((p) => !p.isPrimary);

  const filteredDoctors = useMemo(() => {
    return allRecommended.filter((doc) => {
      const matchesSpecialty =
        selectedSpecialty === 'All' ||
        doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
        doc.subspecialty.toLowerCase().includes(selectedSpecialty.toLowerCase());

      const matchesSearch =
        searchQuery.trim() === '' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subspecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.facility.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSpecialty && matchesSearch;
    });
  }, [allRecommended, selectedSpecialty, searchQuery]);

  const handleRefillClick = () => {
    setRefillSuccess(true);
    setTimeout(() => {
      setRefillSuccess(false);
    }, 4500);
  };

  return (
    <div className="space-y-6 px-4 pt-4 pb-8 max-w-[420px] mx-auto text-slate-900">
      {/* 1. TOP HEADER */}
      <div className="space-y-1">
        <span className="text-[11px] font-extrabold tracking-[0.1em] text-[#6E6377] uppercase block">
          YOUR CARE TEAM
        </span>
        <h1 className="text-[32px] font-black text-[#231A2F] tracking-tight leading-tight">
          Providers
        </h1>
      </div>

      {/* Referral filter indicator if navigated from SOAP note */}
      {selectedCptFilter && (
        <div className="bg-[#EAE06D] rounded-2xl p-2.5 text-xs text-slate-900 flex items-center justify-between font-bold shadow-xs">
          <span>Focusing on {selectedCptFilter} from your SOAP Memo</span>
          {onClearCptFilter && (
            <button
              onClick={onClearCptFilter}
              className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-800 hover:bg-slate-100"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* 2. SECTION: YOUR PROVIDERS */}
      <div className="space-y-2.5">
        <h2 className="text-[12px] font-extrabold tracking-[0.08em] text-[#6E6377] uppercase px-0.5">
          YOUR PROVIDERS
        </h2>

        {/* Primary Doctor Card (Dr. Jordan Lee) */}
        <div className="bg-white rounded-[26px] p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100/80">
          <div className="flex items-center gap-3.5">
            {/* Avatar Circle with Initials JL */}
            <div className="w-12 h-12 rounded-full bg-[#FCE881] flex items-center justify-center font-bold text-slate-900 text-sm shrink-0 shadow-2xs">
              {primaryDoctor.initials}
            </div>

            <div>
              <h3 className="text-[15px] font-bold text-[#231A2F] leading-tight">
                {primaryDoctor.name}
              </h3>
              <p className="text-[12.5px] text-[#5D5566] font-normal mt-0.5 leading-snug">
                {primaryDoctor.specialty} · {primaryDoctor.subspecialty}
              </p>
              <p className="text-[12px] text-[#7E7487] font-normal mt-0.5 leading-snug">
                Next visit: {primaryDoctor.nextVisit || 'June 12'}
              </p>
            </div>
          </div>

          {/* Message Button */}
          <button
            onClick={onOpenSoapModal}
            className="rounded-full border border-slate-300/90 bg-white hover:bg-slate-50 text-[#231A2F] font-semibold text-[13px] px-5 py-2 transition-all active:scale-95 shadow-xs shrink-0"
          >
            Message
          </button>
        </div>
      </div>

      {/* 3. SECTION: RECOMMENDED PROVIDERS WITH SEARCH & AVAILABILITY */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between px-0.5">
          <h2 className="text-[12px] font-extrabold tracking-[0.08em] text-[#6E6377] uppercase">
            RECOMMENDED PROVIDERS
          </h2>
          <span className="text-[12.5px] font-medium text-[#6E6377]">
            Dermatology near you
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search providers, specialty, clinic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {['All', 'Dermatology', 'Primary care', 'Acne'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedSpecialty(filter)}
                className={`px-3 py-1 rounded-full font-bold transition shrink-0 ${
                  selectedSpecialty === filter
                    ? 'bg-[#231A2F] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* List of recommended doctors */}
        <div className="space-y-3">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-[26px] p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100/80 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                {/* Purple Avatar Circle */}
                <div className="w-12 h-12 rounded-full bg-[#EADDFF] flex items-center justify-center font-bold text-[#21005D] text-sm shrink-0 shadow-2xs">
                  {doc.initials}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[15px] font-bold text-[#231A2F] leading-tight">
                      {doc.name}
                    </h3>
                    <span className="flex items-center text-[10px] text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline mr-0.5" />
                      4.9
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#5D5566] font-normal mt-0.5 leading-snug">
                    {doc.specialty} · {doc.subspecialty}
                  </p>
                  <p className="text-[12px] text-[#7E7487] font-normal mt-0.5 leading-snug">
                    {doc.distance} · {doc.visitType}
                  </p>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => onOpenBookingModal(doc)}
                className="rounded-full bg-[#F1E56B] hover:bg-[#E5D95C] text-[#231A2F] font-bold text-[13px] px-6 py-2 transition-all active:scale-95 shadow-xs shrink-0"
              >
                Book
              </button>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No providers found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* 4. SECTION: YOUR PHARMACIES */}
      <div className="space-y-2.5">
        <h2 className="text-[12px] font-extrabold tracking-[0.08em] text-[#6E6377] uppercase px-0.5">
          YOUR PHARMACIES
        </h2>

        {/* Pharmacy Card */}
        <div className="bg-white rounded-[26px] p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100/80">
          <div className="flex items-center gap-3.5">
            {/* Yellow Avatar Circle with Capsule Pill Icon */}
            <div className="w-12 h-12 rounded-full bg-[#FCE881] flex items-center justify-center text-slate-800 shrink-0 shadow-2xs">
              <Pill className="w-5 h-5 -rotate-45 text-slate-900" strokeWidth={2.3} />
            </div>

            <div>
              {isEditingPharmacy ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    onBlur={() => setIsEditingPharmacy(false)}
                    autoFocus
                    className="text-[15px] font-bold text-[#231A2F] border-b border-purple-400 outline-none w-36"
                  />
                  <button
                    onClick={() => setIsEditingPharmacy(false)}
                    className="text-xs text-purple-700 font-bold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <h3
                  onClick={() => setIsEditingPharmacy(true)}
                  className="text-[15px] font-bold text-[#231A2F] leading-tight cursor-pointer hover:underline"
                  title="Click to rename pharmacy"
                >
                  {pharmacyName}
                </h3>
              )}
              <p className="text-[12.5px] text-[#5D5566] font-normal mt-0.5 leading-snug">
                Birth control · Vitamin D
              </p>
              <p className="text-[12px] text-[#7E7487] font-normal mt-0.5 leading-snug">
                0.8 mi · Open until 9 PM
              </p>
            </div>
          </div>

          {/* Refill Button */}
          <button
            onClick={handleRefillClick}
            className="rounded-full bg-[#F1E56B] hover:bg-[#E5D95C] text-[#231A2F] font-bold text-[13px] px-5 py-2 transition-all active:scale-95 shadow-xs shrink-0"
          >
            Refill
          </button>
        </div>
      </div>

      {/* Refill Confirmation Banner */}
      {refillSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-3 flex items-center justify-between text-xs font-semibold shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Refill requested for Birth control & Vitamin D! Ready by 4:00 PM.</span>
          </div>
          <button
            onClick={() => setRefillSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
