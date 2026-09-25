import React, { useState } from 'react';
import {
  Phone,
  Pill,
  Calendar,
  Sparkles,
  CheckCircle2,
  X,
  ExternalLink,
  Clock,
  ShieldCheck,
  FileText,
  Lock,
} from 'lucide-react';
import { Provider, Language, BillAuditResult } from '../types';
import { INITIAL_PROVIDERS } from '../data/initialData';
import { buildGoogleCalendarUrl } from '../services/providerService';
import { GoogleAccountState } from './GoogleAccountCard';

interface ProvidersTabProps {
  language: Language;
  onOpenBookingModal: (provider: Provider) => void;
  onOpenSoapModal: () => void;
  onOpenBillAuditModal?: (audit: BillAuditResult) => void;
  selectedCptFilter?: string;
  onClearCptFilter?: () => void;
  onOpenProviderMatching?: () => void;
  googleAccount?: GoogleAccountState;
  onConnectGoogle?: () => void;
}

export const ProvidersTab: React.FC<ProvidersTabProps> = ({
  language,
  onOpenBookingModal,
  onOpenSoapModal,
  onOpenBillAuditModal,
  selectedCptFilter,
  onClearCptFilter,
  onOpenProviderMatching,
  googleAccount,
  onConnectGoogle,
}) => {
  // Pharmacy state
  const [pharmacyName, setPharmacyName] = useState('[Pharmacy name]');
  const [isEditingPharmacy, setIsEditingPharmacy] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Provider Contact / Google API Action Sheet
  const [selectedContactProvider, setSelectedContactProvider] = useState<Provider | null>(null);
  const [isPharmacyContactOpen, setIsPharmacyContactOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Primary doctor
  const primaryDoctor = INITIAL_PROVIDERS.find((p) => p.isPrimary) || INITIAL_PROVIDERS[0];
  // Recommended doctors
  const recommendedDoctors = INITIAL_PROVIDERS.filter((p) => !p.isPrimary);

  // Quick 1-click Google Calendar sync link generator
  const getGoogleCalLinkForProvider = (provider: Provider) => {
    return buildGoogleCalendarUrl({
      providerName: provider.name,
      specialty: provider.specialty,
      facility: provider.facility,
      slot: {
        id: 'slot-1',
        timeStr: '10:00 AM - 10:45 AM',
        dateStr: 'Tomorrow',
        hasConflict: false,
        type: provider.visitType.includes('Video') ? 'video' : 'in-person',
      },
      notes: "Health visit scheduled via AuraHealth. Patient clinical profile & SOAP memo attached.",
    });
  };

  return (
    <div className="space-y-6 px-4 pt-4 pb-12 max-w-[420px] mx-auto text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#231A2F] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-purple-400/40 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER - EXACT MATCH TO SCREENSHOT */}
      <div className="space-y-0.5">
        <span className="text-[11px] font-extrabold tracking-[0.1em] text-[#6E6377] uppercase block">
          YOUR CARE TEAM
        </span>
        <h1 className="text-[34px] font-extrabold text-[#231A2F] tracking-tight leading-tight">
          Providers
        </h1>
      </div>

      {/* Google API Integration Status Bar */}
      <div className="bg-white/80 rounded-2xl p-2.5 border border-purple-200/70 shadow-2xs flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 p-0.5 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div className="truncate">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block leading-none">
              GOOGLE CALENDAR SYNC
            </span>
            <span className="text-[11.5px] font-bold text-slate-800 truncate block">
              {googleAccount?.isConnected
                ? `Connected (${googleAccount.email || 'maya.health@gmail.com'})`
                : 'Google Account & Calendar'}
            </span>
          </div>
        </div>

        {googleAccount?.isConnected ? (
          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Synced</span>
          </span>
        ) : (
          <button
            onClick={onConnectGoogle}
            className="text-[10.5px] font-bold text-slate-900 bg-[#EAE06D] hover:bg-yellow-300 px-2.5 py-1 rounded-full shrink-0 shadow-2xs transition"
          >
            Connect
          </button>
        )}
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
      <div className="space-y-2">
        <h2 className="text-[12px] font-extrabold tracking-[0.08em] text-[#6E6377] uppercase px-0.5">
          YOUR PROVIDERS
        </h2>

        {/* Primary Doctor Card (Dr. Jordan Lee) */}
        <div
          onClick={() => setSelectedContactProvider(primaryDoctor)}
          className="bg-white rounded-[28px] p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100/80 cursor-pointer hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Yellow Circle Avatar with Initials JL */}
            <div className="w-12 h-12 rounded-full bg-[#FCE881] flex items-center justify-center font-bold text-slate-900 text-sm shrink-0 shadow-2xs">
              {primaryDoctor.initials}
            </div>

            <div className="truncate">
              <h3 className="text-[16px] font-bold text-[#231A2F] leading-tight">
                {primaryDoctor.name}
              </h3>
              <p className="text-[13px] text-[#5D5566] font-normal mt-0.5 leading-snug">
                {primaryDoctor.specialty} · {primaryDoctor.subspecialty}
              </p>
              <p className="text-[12px] text-[#7E7487] font-normal mt-0.5 leading-snug">
                Next visit: {primaryDoctor.nextVisit || 'June 12'}
              </p>
            </div>
          </div>

          {/* Yellow Circular Phone Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedContactProvider(primaryDoctor);
            }}
            className="w-12 h-12 rounded-full bg-[#F1E56B] hover:bg-[#E5D95C] text-slate-900 flex items-center justify-center shadow-2xs active:scale-95 transition-all shrink-0 ml-2"
            title={`Call or schedule with ${primaryDoctor.name}`}
          >
            <Phone className="w-5 h-5 text-slate-900 fill-slate-900" />
          </button>
        </div>
      </div>

      {/* 3. SECTION: RECOMMENDED PROVIDERS Dermatology near you */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between px-0.5">
          <h2 className="text-[12px] font-extrabold tracking-[0.08em] text-[#6E6377] uppercase">
            RECOMMENDED PROVIDERS
          </h2>
          <span className="text-[12.5px] font-medium text-[#6E6377]">
            Dermatology near you
          </span>
        </div>

        {/* List of recommended doctors */}
        <div className="space-y-3">
          {recommendedDoctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedContactProvider(doc)}
              className="bg-white rounded-[28px] p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100/80 cursor-pointer hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Purple Circle Avatar */}
                <div className="w-12 h-12 rounded-full bg-[#EADDFF] flex items-center justify-center font-bold text-[#21005D] text-sm shrink-0 shadow-2xs">
                  {doc.initials}
                </div>

                <div className="truncate">
                  <h3 className="text-[16px] font-bold text-[#231A2F] leading-tight">
                    {doc.name}
                  </h3>
                  <p className="text-[13px] text-[#5D5566] font-normal mt-0.5 leading-snug">
                    {doc.specialty} · {doc.subspecialty}
                  </p>
                  <p className="text-[12px] text-[#7E7487] font-normal mt-0.5 leading-snug">
                    {doc.distance} · {doc.visitType}
                  </p>
                </div>
              </div>

              {/* Yellow Circular Phone Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedContactProvider(doc);
                }}
                className="w-12 h-12 rounded-full bg-[#F1E56B] hover:bg-[#E5D95C] text-slate-900 flex items-center justify-center shadow-2xs active:scale-95 transition-all shrink-0 ml-2"
                title={`Call or schedule with ${doc.name}`}
              >
                <Phone className="w-5 h-5 text-slate-900 fill-slate-900" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION: YOUR PHARMACIES */}
      <div className="space-y-2">
        <h2 className="text-[12px] font-extrabold tracking-[0.08em] text-[#6E6377] uppercase px-0.5">
          YOUR PHARMACIES
        </h2>

        {/* Pharmacy Card */}
        <div
          onClick={() => setIsPharmacyContactOpen(true)}
          className="bg-white rounded-[28px] p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100/80 cursor-pointer hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Yellow Circle Avatar with Capsule Pill Icon */}
            <div className="w-12 h-12 rounded-full bg-[#FCE881] flex items-center justify-center text-slate-900 shrink-0 shadow-2xs">
              <Pill className="w-5 h-5 -rotate-45 text-slate-900" strokeWidth={2.3} />
            </div>

            <div className="truncate">
              {isEditingPharmacy ? (
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    onBlur={() => setIsEditingPharmacy(false)}
                    autoFocus
                    className="text-[16px] font-bold text-[#231A2F] border-b border-purple-400 outline-none w-36"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingPharmacy(true);
                  }}
                  className="text-[16px] font-bold text-[#231A2F] leading-tight hover:underline"
                  title="Click to rename pharmacy"
                >
                  {pharmacyName}
                </h3>
              )}
              <p className="text-[13px] text-[#5D5566] font-normal mt-0.5 leading-snug">
                Birth control · Vitamin D
              </p>
              <p className="text-[12px] text-[#7E7487] font-normal mt-0.5 leading-snug">
                0.8 mi · Open until 9 PM
              </p>
            </div>
          </div>

          {/* Yellow Circular Phone Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPharmacyContactOpen(true);
            }}
            className="w-12 h-12 rounded-full bg-[#F1E56B] hover:bg-[#E5D95C] text-slate-900 flex items-center justify-center shadow-2xs active:scale-95 transition-all shrink-0 ml-2"
            title="Call pharmacy or request refill"
          >
            <Phone className="w-5 h-5 text-slate-900 fill-slate-900" />
          </button>
        </div>
      </div>

      {/* PR #1 Engine Link & Lab Bill Defender (Preserved underneath) */}
      <div className="pt-2 space-y-2">
        {onOpenProviderMatching && (
          <button
            onClick={onOpenProviderMatching}
            className="w-full bg-[#EADDFF]/70 hover:bg-[#EADDFF] border border-purple-200/80 rounded-2xl py-2 px-3 flex items-center justify-between text-xs transition"
          >
            <span className="font-bold text-purple-950">
              ⚡ Open Full Matching Engine (PR #1)
            </span>
            <span className="text-[11px] text-purple-700 font-semibold">
              Filter by Insurance & Radius →
            </span>
          </button>
        )}
      </div>

      {/* 5. PROVIDER CONTACT & GOOGLE API INTEGRATION MODAL */}
      {selectedContactProvider && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-purple-200 overflow-hidden my-auto flex flex-col">
            {/* Header */}
            <div className="bg-[#B6A1DA] px-5 py-4 flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs"
                  style={{
                    backgroundColor: selectedContactProvider.isPrimary ? '#FCE881' : '#EADDFF',
                    color: selectedContactProvider.isPrimary ? '#231A2F' : '#21005D',
                  }}
                >
                  {selectedContactProvider.initials}
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    {selectedContactProvider.name}
                  </h3>
                  <p className="text-[11px] text-slate-700 font-medium">
                    {selectedContactProvider.specialty} · {selectedContactProvider.subspecialty}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContactProvider(null)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3 text-xs">
              {/* Phone Call Button */}
              <a
                href={`tel:${(selectedContactProvider.phone || '(555) 234-8901').replace(/[^0-9]/g, '')}`}
                onClick={() => {
                  showToast(`Calling ${selectedContactProvider.name}...`);
                  setSelectedContactProvider(null);
                }}
                className="w-full bg-[#F1E56B] hover:bg-[#E5D95C] text-[#231A2F] font-extrabold py-3 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-2.5 active:scale-98"
              >
                <Phone className="w-4 h-4 fill-slate-900 text-slate-900" />
                <span>Call Clinic: {selectedContactProvider.phone || '(555) 234-8901'}</span>
              </a>

              {/* Google API Integration: Direct Google Calendar Sync */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-700" />
                    <span className="font-bold text-slate-900 text-xs">
                      Google Calendar Integration
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Live Sync
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug">
                  Add appointment directly to your Google Calendar with pre-filled clinic location and consultation notes.
                </p>

                <div className="pt-1 flex gap-2">
                  <a
                    href={getGoogleCalLinkForProvider(selectedContactProvider)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      showToast(`✓ Opened Google Calendar for ${selectedContactProvider.name}`);
                      setSelectedContactProvider(null);
                    }}
                    className="flex-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold py-2 px-3 rounded-xl transition text-[11px] flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>Add to Google Cal</span>
                    <ExternalLink className="w-3 h-3 text-purple-700" />
                  </a>

                  <button
                    onClick={() => {
                      const doc = selectedContactProvider;
                      setSelectedContactProvider(null);
                      onOpenBookingModal(doc);
                    }}
                    className="flex-1 bg-[#231A2F] hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl transition text-[11px] flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>Pick Time Slot</span>
                  </button>
                </div>
              </div>

              {/* Send SOAP Clinical Memo */}
              <button
                onClick={() => {
                  setSelectedContactProvider(null);
                  onOpenSoapModal();
                }}
                className="w-full bg-white hover:bg-slate-50 border border-purple-200 text-purple-950 font-bold py-2.5 px-4 rounded-2xl shadow-2xs transition flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-purple-700" />
                <span>View & Transmit Clinical SOAP Memo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. PHARMACY ACTION MODAL */}
      {isPharmacyContactOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-purple-200 overflow-hidden my-auto flex flex-col">
            <div className="bg-[#B6A1DA] px-5 py-4 flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#FCE881] flex items-center justify-center text-slate-900 shadow-xs">
                  <Pill className="w-5 h-5 -rotate-45 text-slate-900" strokeWidth={2.3} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    {pharmacyName}
                  </h3>
                  <p className="text-[11px] text-slate-700 font-medium">
                    0.8 mi · Open until 9 PM
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPharmacyContactOpen(false)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <a
                href="tel:5553217654"
                onClick={() => {
                  showToast('Calling pharmacy at (555) 321-7654...');
                  setIsPharmacyContactOpen(false);
                }}
                className="w-full bg-[#F1E56B] hover:bg-[#E5D95C] text-[#231A2F] font-extrabold py-3 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-2.5 active:scale-98"
              >
                <Phone className="w-4 h-4 fill-slate-900 text-slate-900" />
                <span>Call Pharmacy: (555) 321-7654</span>
              </a>

              {/* Google Calendar Refill Reminder */}
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  'Prescription Pickup: Birth control & Vitamin D'
                )}&dates=20260613T160000Z/20260613T163000Z&details=${encodeURIComponent(
                  `Refill ready for pickup at ${pharmacyName}. Prescriptions: Birth control, Vitamin D.`
                )}&location=${encodeURIComponent(pharmacyName)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  showToast('✓ Google Calendar pickup reminder opened');
                  setIsPharmacyContactOpen(false);
                }}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-700" />
                <span>Set Google Calendar Pickup Reminder</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>

              <button
                onClick={() => {
                  showToast('✓ Automated refill request sent to pharmacy');
                  setIsPharmacyContactOpen(false);
                }}
                className="w-full bg-[#231A2F] hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>1-Tap Refill: Birth control & Vitamin D</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
