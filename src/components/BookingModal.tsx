import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle,
  Sparkles,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { Provider, Language } from '../types';
import {
  getProviderAvailableSlots,
  buildGoogleCalendarUrl,
  ProviderSlot,
} from '../services/providerService';
import { INITIAL_MARKED_DAYS } from '../data/initialData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  language: Language;
  onConfirmSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  provider,
  language,
  onConfirmSuccess,
}) => {
  const slots: ProviderSlot[] = useMemo(() => {
    if (!provider) return [];
    return getProviderAvailableSlots(provider, INITIAL_MARKED_DAYS);
  }, [provider]);

  const [selectedSlot, setSelectedSlot] = useState<ProviderSlot | null>(null);
  const [attachSoap, setAttachSoap] = useState(true);
  const [isBooked, setIsBooked] = useState(false);

  // Set default slot
  React.useEffect(() => {
    if (slots.length > 0 && !selectedSlot) {
      setSelectedSlot(slots[0]);
    }
  }, [slots, selectedSlot]);

  if (!isOpen || !provider) return null;

  const currentSlot = selectedSlot || slots[0];

  const handleConfirm = () => {
    setIsBooked(true);
    setTimeout(() => {
      onConfirmSuccess();
    }, 1200);
  };

  const googleCalUrl = currentSlot
    ? buildGoogleCalendarUrl({
        providerName: provider.name,
        specialty: provider.specialty,
        facility: provider.facility,
        slot: currentSlot,
        notes: attachSoap
          ? "Attached Maya's June Clinical SOAP packet with logged flare timelines & CPT 86038 ANA requisition."
          : undefined,
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-purple-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-[#B6A1DA] px-5 py-4 flex items-center justify-between text-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAE06D] flex items-center justify-center text-slate-900 shadow-xs">
              <Calendar className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                Direct Booking & Availability
              </span>
              <h3 className="font-extrabold text-base leading-tight">
                Schedule with {provider.name}
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

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Doctor Overview */}
          <div className="bg-[#F3EDF7] rounded-2xl p-3.5 border border-purple-200/80 flex items-center gap-3">
            <div
              style={{ backgroundColor: provider.avatarBg }}
              className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base text-purple-950 shadow-xs shrink-0"
            >
              {provider.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-sm text-slate-900 truncate">
                {provider.name}
              </h4>
              <p className="text-[11px] text-slate-600 font-medium">
                {provider.specialty} · {provider.subspecialty}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-purple-900 font-bold mt-0.5">
                <span>{provider.distance}</span>
                <span>•</span>
                <span>{provider.facility}</span>
              </div>
            </div>
          </div>

          {/* CMS Pricing Transparency Breakdown */}
          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between text-emerald-950 font-extrabold text-xs">
              <span>CMS Published Cash Pricing:</span>
              <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded-full">
                Tier {provider.priceTier}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-emerald-900">
              <div className="bg-white/70 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Cash Evaluation</span>
                <span className="font-black text-sm text-slate-900">${provider.cashVisitPrice}</span>
              </div>
              <div className="bg-white/70 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">CPT 86038 ANA Lab</span>
                <span className="font-black text-sm text-slate-900">${provider.anaLabPrice}</span>
              </div>
            </div>
            {provider.slidingScale && (
              <p className="text-[10px] text-emerald-800 font-semibold pt-0.5">
                ✓ Sliding-scale financial assistance available for uninsured / underinsured patients.
              </p>
            )}
          </div>

          {/* Select Date & Time Slot with Conflict Detection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Live Available Slots
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">
                ✓ Calendar Conflict Checking
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {slots.map((slot) => {
                const isSelected = currentSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#E8DFF2] border-purple-500 text-purple-950 font-bold shadow-2xs'
                        : 'bg-white border-purple-100 text-slate-700 hover:bg-[#F3EDF7]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                        <span>
                          {slot.dateStr} · {slot.timeStr}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100/80 text-purple-900 font-bold">
                          {slot.type}
                        </span>
                      </div>

                      {/* Conflict Indicator */}
                      {slot.hasConflict ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-700 font-bold pl-5">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{slot.conflictReason}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium pl-5">
                          <span>✓ No schedule conflict with your marked care events</span>
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-purple-800 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attached SOAP Note Checkbox */}
          <div className="bg-[#E8DFF2]/60 rounded-2xl p-3 border border-purple-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="attachSoap"
              checked={attachSoap}
              onChange={(e) => setAttachSoap(e.target.checked)}
              className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer accent-purple-700"
            />
            <label htmlFor="attachSoap" className="cursor-pointer text-xs space-y-0.5">
              <span className="font-extrabold text-purple-950 block">
                Attach Maya's 1-Page June Clinical SOAP Memo
              </span>
              <span className="text-[11px] text-slate-600 block leading-tight">
                Automatically pre-loads your logged Methylisothiazolinone skincare flares, June marked calendar dates, and suggested CPT 86038 ANA code so {provider.name} is fully briefed before the visit.
              </span>
            </label>
          </div>

          {/* Booking Confirmation / Calendar Actions */}
          {isBooked ? (
            <div className="space-y-2.5 bg-emerald-50 rounded-2xl p-4 border border-emerald-200 animate-fade-in text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Appointment Confirmed!</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Transmitted SOAP packet to {provider.name} for {currentSlot?.dateStr} at {currentSlot?.timeStr}.
              </p>

              {/* One-Click Google Calendar Sync */}
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100/50 text-emerald-950 font-bold text-xs shadow-xs transition"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Add to Google Calendar</span>
                <ExternalLink className="w-3 h-3 text-emerald-600 ml-0.5" />
              </a>

              <button
                onClick={onClose}
                className="w-full mt-1 text-slate-500 hover:text-slate-800 text-[11px] font-bold py-1"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={handleConfirm}
                className="w-full py-3 px-4 rounded-2xl text-xs font-extrabold shadow-xs transition flex items-center justify-center gap-2 bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>Confirm Appointment & Transmit SOAP Packet</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
