import React, { useState } from 'react';
import { Pill, Phone } from 'lucide-react';
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

const PROVIDER_PHONES: Record<string, string> = {
  'dr-jordan-lee': '(555) 234-8901',
  'dr-priya-shah': '(555) 482-1920',
  'dr-elena-ruiz': '(555) 619-3382',
  'dr-marcus-chen': '(555) 792-8811',
};
const PHARMACY_PHONE = '(555) 321-7654';

const toTelHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`;

// Yellow circular call button shared by every card
const CallButton: React.FC<{ phone: string; label: string }> = ({ phone, label }) => (
  <a
    href={toTelHref(phone)}
    onClick={(e) => e.stopPropagation()}
    className="w-12 h-12 rounded-full bg-[#E5DA7A] hover:bg-[#DCCF66] text-[#231A2F] flex items-center justify-center transition-all active:scale-95 shrink-0 ml-3"
    title={`Call ${label}: ${phone}`}
    aria-label={`Call ${label}`}
  >
    <Phone className="w-5 h-5" strokeWidth={1.9} />
  </a>
);

export const ProvidersTab: React.FC<ProvidersTabProps> = ({
  selectedCptFilter,
  onClearCptFilter,
}) => {
  const [pharmacyName, setPharmacyName] = useState('Lakeview Pharmacy');
  const [isEditingPharmacy, setIsEditingPharmacy] = useState(false);

  // Providers data
  const primaryDoctor = INITIAL_PROVIDERS.find((p) => p.isPrimary) || INITIAL_PROVIDERS[0];
  const recommendedDoctors = INITIAL_PROVIDERS.filter((p) => !p.isPrimary);

  const cardClass =
    'bg-white rounded-[28px] px-4 py-4 flex items-center justify-between shadow-[0_2px_10px_rgba(35,26,47,0.05)]';
  const sectionLabelClass =
    'text-[13px] font-bold tracking-[0.14em] text-[#7A7185] uppercase px-0.5';

  return (
    <div className="space-y-7 px-4 pt-8 pb-10 max-w-[420px] mx-auto text-slate-900">
      {/* 1. TOP HEADER */}
      <div className="space-y-1">
        <span className="text-[13px] font-bold tracking-[0.14em] text-[#7A7185] uppercase block">
          YOUR CARE TEAM
        </span>
        <h1 className="text-[34px] font-extrabold text-[#3F3850] tracking-tight leading-tight">
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
      <div className="space-y-3">
        <h2 className={sectionLabelClass}>YOUR PROVIDERS</h2>

        <div className={cardClass}>
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#FCF3B8] flex items-center justify-center font-bold text-[#4A4358] text-[15px] shrink-0">
              {primaryDoctor.initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-[17px] font-bold text-[#3F3850] leading-tight">
                {primaryDoctor.name}
              </h3>
              <p className="text-[14px] text-[#6B6376] mt-0.5 leading-snug">
                {primaryDoctor.specialty} · {primaryDoctor.subspecialty}
              </p>
              <p className="text-[13.5px] text-[#8A8295] mt-0.5 leading-snug">
                Next visit: {primaryDoctor.nextVisit || 'June 12'}
              </p>
            </div>
          </div>
          {PROVIDER_PHONES[primaryDoctor.id] && (
            <CallButton phone={PROVIDER_PHONES[primaryDoctor.id]} label={primaryDoctor.name} />
          )}
        </div>
      </div>

      {/* 3. SECTION: RECOMMENDED PROVIDERS */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-2 px-0.5">
          <h2 className="text-[13px] font-bold tracking-[0.14em] text-[#7A7185] uppercase">
            RECOMMENDED PROVIDERS
          </h2>
          <span className="text-[13.5px] text-[#7A7185] whitespace-nowrap">
            Dermatology near you
          </span>
        </div>

        <div className="space-y-3">
          {recommendedDoctors.map((doc) => (
            <div key={doc.id} className={cardClass}>
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-[#ECE4F7] flex items-center justify-center font-bold text-[#4A4358] text-[15px] shrink-0">
                  {doc.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-bold text-[#3F3850] leading-tight">
                    {doc.name}
                  </h3>
                  <p className="text-[14px] text-[#6B6376] mt-0.5 leading-snug">
                    {doc.specialty} · {doc.subspecialty}
                  </p>
                  <p className="text-[13.5px] text-[#8A8295] mt-0.5 leading-snug">
                    {doc.distance} · {doc.visitType}
                  </p>
                </div>
              </div>
              {PROVIDER_PHONES[doc.id] && (
                <CallButton phone={PROVIDER_PHONES[doc.id]} label={doc.name} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION: YOUR PHARMACIES */}
      <div className="space-y-3">
        <h2 className={sectionLabelClass}>YOUR PHARMACIES</h2>

        <div className={cardClass}>
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#FCF3B8] flex items-center justify-center text-[#4A4358] shrink-0">
              <Pill className="w-5 h-5" strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              {isEditingPharmacy ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    onBlur={() => setIsEditingPharmacy(false)}
                    autoFocus
                    className="text-[17px] font-bold text-[#3F3850] border-b border-purple-400 outline-none w-36"
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
                  className="text-[17px] font-bold text-[#3F3850] leading-tight cursor-pointer hover:underline"
                  title="Click to rename pharmacy"
                >
                  {pharmacyName}
                </h3>
              )}
              <p className="text-[14px] text-[#6B6376] mt-0.5 leading-snug">
                Birth control · Vitamin D
              </p>
              <p className="text-[13.5px] text-[#8A8295] mt-0.5 leading-snug">
                0.8 mi · Open until 9 PM
              </p>
            </div>
          </div>
          <CallButton phone={PHARMACY_PHONE} label={pharmacyName} />
        </div>
      </div>
    </div>
  );
};
