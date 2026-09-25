import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  AlertCircle,
  Eye,
  ChevronRight,
  Clock,
  Video,
  X,
  ShieldAlert,
  HeartPulse,
  Zap,
  CalendarCheck,
  Stethoscope,
  Info,
  Utensils,
  Plus,
} from 'lucide-react';
import { Language, MarkedDay, EndoscopyPlan, FoodLogEntry } from '../types';
import { TRANSLATIONS, INITIAL_ENDOSCOPY_PLAN, INITIAL_FOOD_LOGS } from '../data/initialData';

interface CalendarTabProps {
  language: Language;
  markedDays: MarkedDay[];
  onOpenSoapModal: () => void;
  onNavigateToProviders: (cptCodeFilter?: string) => void;
  endoscopyPlan?: EndoscopyPlan;
  onOpenDayView?: (dayNumber: number) => void;
  foodLogs?: FoodLogEntry[];
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  language,
  markedDays,
  onOpenSoapModal,
  onNavigateToProviders,
  endoscopyPlan = INITIAL_ENDOSCOPY_PLAN,
  onOpenDayView,
  foodLogs = INITIAL_FOOD_LOGS,
}) => {
  const t = TRANSLATIONS[language].calendar;

  // Selected day for the Drawer / Snapshot
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(12);
  const [showEndoscopyDetails, setShowEndoscopyDetails] = useState(false);

  // Marked day lookup
  const markedMap = new Map<number, MarkedDay>();
  markedDays.forEach((md) => {
    markedMap.set(md.day, md);
  });

  const selectedDayData = selectedDayNumber ? markedMap.get(selectedDayNumber) : null;
  const selectedDayFoods = selectedDayNumber ? foodLogs.filter((f) => f.day === selectedDayNumber) : [];

  // Check if cluster detected
  const hasNeurologicalCluster = markedDays.some((d) => d.isNeurologicalCluster);

  // Calendar dates generation for June 2025 (June 1 is Sunday, 30 days)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const calendarCells: Array<{ day: number; inMonth: boolean }> = [];

  for (let i = 1; i <= 30; i++) {
    calendarCells.push({ day: i, inMonth: true });
  }
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push({ day: calendarCells.length - 29, inMonth: false });
  }

  return (
    <div className="space-y-4 px-4 py-3">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            {t.schedule}
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            {t.title}
          </h2>
        </div>

        {/* Yellow Circle Calendar Icon */}
        <div className="w-10 h-10 rounded-full bg-[#EAE06D] flex items-center justify-center text-slate-900 shadow-xs">
          <CalendarIcon className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      {/* NEUROLOGICAL SYMPTOM CLUSTER ALERT (Stops "It's Just Anxiety") */}
      {hasNeurologicalCluster && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-4 shadow-xs space-y-1.5 animate-fade-in">
          <div className="flex items-center gap-2 text-rose-950 font-black text-xs">
            <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <span>{t.clusterAlert}</span>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed font-medium pl-8">
            {t.clusterSub}
          </p>
        </div>
      )}

      {/* 2. White Calendar Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-purple-100/70 space-y-4">
        {/* Month Header & Legend */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">
            June 2025
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-purple-500 bg-purple-50 inline-block" />
            <span>{t.marked}</span>
          </div>
        </div>

        {/* Days of Week Row */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 tracking-wider">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold">
          {calendarCells.map((cell, idx) => {
            if (!cell.inMonth) {
              return (
                <div key={idx} className="py-2 text-slate-300 pointer-events-none">
                  {cell.day}
                </div>
              );
            }

            const isMarked = markedMap.has(cell.day);
            const markedItem = markedMap.get(cell.day);
            const isSelected = selectedDayNumber === cell.day;
            const isJune12 = cell.day === 12;

            return (
              <div key={idx} className="flex justify-center items-center">
                <button
                  onClick={() => setSelectedDayNumber(cell.day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition text-xs font-bold relative ${
                    isJune12
                      ? 'border-2 border-purple-700 bg-[#E8DFF2] text-purple-950 font-black ring-2 ring-purple-300 ring-offset-1'
                      : isMarked
                      ? markedItem?.type === 'villi_recovery'
                        ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-extrabold'
                        : 'border-2 border-purple-400 bg-purple-50 text-slate-900 font-extrabold hover:bg-purple-100'
                      : isSelected
                      ? 'bg-slate-200 text-slate-900'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cell.day}
                  {isMarked && (
                    <span
                      className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-white ${
                        markedItem?.type === 'villi_recovery' ? 'bg-emerald-600' : 'bg-rose-500'
                      }`}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DAY SNAPSHOT DRAWER / MODAL (when clicked) */}
      {selectedDayData && (
        <div className="bg-[#E8DFF2] rounded-3xl p-4 border border-purple-300/60 shadow-sm space-y-2.5 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-2xl bg-[#B6A1DA] text-slate-900 font-black text-xs flex items-center justify-center">
                {selectedDayData.day}
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-purple-900">
                  {selectedDayData.dateStr}
                </span>
                <h4 className="font-bold text-sm text-slate-900 leading-tight">
                  {selectedDayData.title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setSelectedDayNumber(null)}
              className="w-6 h-6 rounded-full bg-white/70 text-slate-600 flex items-center justify-center hover:bg-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Snapshot Content with Photo & Severity */}
          <div className="flex gap-3 items-center bg-white/70 rounded-2xl p-2.5 border border-purple-100">
            {selectedDayData.imageUrl && (
              <img
                src={selectedDayData.imageUrl}
                alt="Flare preview"
                className="w-14 h-14 object-cover rounded-xl border border-purple-200 shadow-2xs shrink-0"
              />
            )}
            <div className="flex-1 text-xs space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-[11px] text-slate-900">
                  Severity:
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px]">
                  {selectedDayData.severity}/10
                </span>
                {selectedDayData.isNeurologicalCluster && (
                  <span className="text-[9px] bg-rose-200 text-rose-900 font-black px-1.5 py-0.5 rounded-full">
                    Neuropathy Cluster
                  </span>
                )}
              </div>
              <p className="text-slate-800 text-[11px] font-medium leading-relaxed">
                <strong className="text-slate-900">Trigger:</strong> {selectedDayData.triggerDetails}
              </p>
              <p className="text-slate-600 text-[10px] line-clamp-2">
                {selectedDayData.notes}
              </p>
            </div>
          </div>

          {/* Logged Foods for this Day */}
          {selectedDayFoods.length > 0 && (
            <div className="bg-white/80 rounded-2xl p-2.5 border border-purple-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
                <span className="flex items-center gap-1 text-purple-900">
                  <Utensils className="w-3 h-3 text-purple-700" />
                  <span>Logged Food &amp; Drinks</span>
                </span>
                <span className="text-[9px] bg-purple-100 text-purple-900 font-bold px-1.5 py-0.2 rounded-full">
                  {selectedDayFoods.length} items
                </span>
              </div>
              <div className="space-y-1">
                {selectedDayFoods.map((f) => (
                  <div
                    key={f.id}
                    className={`p-1.5 rounded-xl border text-[11px] flex items-start justify-between gap-1.5 ${
                      f.suspectedTrigger
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                        : 'bg-white/90 border-purple-100 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-slate-900">{f.time} · {f.item}</span>
                      {f.location && <span className="text-slate-500 text-[10px]"> ({f.location})</span>}
                      {f.notes && <p className="text-[10px] text-slate-600 mt-0.5">{f.notes}</p>}
                    </div>
                    {f.suspectedTrigger && (
                      <span className="text-[8px] font-black bg-amber-200 text-amber-950 px-1 py-0.5 rounded shrink-0">
                        Hidden Gluten
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action to Open Day View & Log Meals */}
          <button
            onClick={() => onOpenDayView?.(selectedDayNumber || 12)}
            className="w-full bg-white hover:bg-slate-50 text-purple-950 text-xs font-bold py-2 rounded-xl border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
          >
            <Utensils className="w-3.5 h-3.5 text-purple-700" />
            <span>Open Day View &amp; Log What I Ate</span>
          </button>
        </div>
      )}

      {/* 4. Actionable Bottom Purple Card ("NEXT MARKED DAY: 12") */}
      <div className="bg-[#B6A1DA] rounded-3xl p-4 text-slate-900 shadow-sm space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900/80 block">
          {t.nextMarkedDay}
        </span>

        <div className="flex items-center gap-3">
          {/* Yellow Square Badge "12" */}
          <div className="w-12 h-12 rounded-2xl bg-[#EAE06D] flex items-center justify-center font-black text-xl text-slate-900 shadow-xs shrink-0">
            12
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-sm text-slate-900 leading-snug">
              {t.wellnessCheckin}
            </h4>
            <div className="flex items-center gap-1 text-xs text-slate-800/80 mt-0.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.appointmentTime}</span>
            </div>
          </div>
        </div>

        {/* Day 12 Food Log Highlight */}
        <div className="bg-white/60 rounded-2xl p-2.5 border border-purple-300/40 text-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-purple-950">
            <span className="flex items-center gap-1">
              <Utensils className="w-3 h-3 text-purple-800" />
              <span>Logged on June 12:</span>
            </span>
            <span className="bg-[#EAE06D] text-slate-900 px-1.5 py-0.2 rounded font-extrabold text-[9px]">
              Caramel Drizzle Latte
            </span>
          </div>
          <p className="text-[11px] text-slate-800 leading-tight">
            11:00 AM at Campus Cafe · Did not know caramel syrup contains barley malt gluten.
          </p>
        </div>

        {/* 1-Click "8-Doctor-Proof" SOAP Memo Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onOpenDayView?.(12)}
            className="w-full bg-white hover:bg-slate-50 text-purple-950 text-xs font-black py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-purple-700" />
            <span>Open Day View (June 12)</span>
          </button>

          <button
            onClick={onOpenSoapModal}
            className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 text-xs font-black py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
            <span>Doctor Visit Prep</span>
          </button>
        </div>
      </div>

      {/* 5. THE 4-MONTH ENDOSCOPY WAIT & "GLUTEN CHALLENGE" SMART PLANNER */}
      <div className="bg-linear-to-b from-[#F3EDF7] to-white rounded-3xl p-4 sm:p-5 border-2 border-purple-200/90 shadow-sm space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EAE06D] flex items-center justify-center text-slate-900 shadow-xs shrink-0">
              <CalendarCheck className="w-5 h-5 text-slate-900 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">
                The 4-Month Endoscopy Wait &amp; Smart Calendar Planner
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                {endoscopyPlan.procedureName}
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-black bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full border border-purple-300">
            {endoscopyPlan.cptCode}
          </span>
        </div>

        {/* Catch-22 Clinical Context Callout */}
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 space-y-1 text-slate-800">
          <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>The Celiac Clinical Catch-22 Solved</span>
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
            When your endoscopy is booked 4 months out ({endoscopyPlan.scheduledDate}), you need to stop gluten immediately to function in school and work. However, for an accurate mucosal biopsy, you must eat gluten for 14 days right before the procedure. Sheila automatically structures your calendar into two distinct clinical phases:
          </p>
        </div>

        {/* Phase 1 Card */}
        <div className="bg-white rounded-2xl p-3.5 border-2 border-emerald-300 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                Phase 1 · Active Now (Months 1–3.5)
              </span>
            </div>
            <span className="text-[9px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full">
              Heal &amp; Function Now
            </span>
          </div>
          <h4 className="font-extrabold text-xs text-slate-900">
            {endoscopyPlan.phase1.title}
          </h4>
          <ul className="text-[11px] text-slate-700 space-y-1 font-medium pl-1">
            {endoscopyPlan.phase1.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-slate-500 italic pt-0.5">
            {endoscopyPlan.phase1.purpose}
          </p>
        </div>

        {/* Phase 2 Card */}
        <div className="bg-white rounded-2xl p-3.5 border-2 border-purple-300 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
                Phase 2 · Starts October 10, 2025 (14 Days Pre-Op)
              </span>
            </div>
            <span className="text-[9px] bg-purple-100 text-purple-900 font-extrabold px-2 py-0.5 rounded-full">
              Pre-Endoscopy Alert
            </span>
          </div>
          <h4 className="font-extrabold text-xs text-slate-900">
            {endoscopyPlan.phase2.title}
          </h4>
          <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
            <strong>Protocol:</strong> {endoscopyPlan.phase2.protocol}
          </p>
          <div className="bg-purple-50 rounded-xl p-2.5 border border-purple-200 text-[10px] text-purple-950 font-medium space-y-1">
            <span className="font-bold block text-purple-900">
              Why this is necessary:
            </span>
            <p>{endoscopyPlan.phase2.rationale}</p>
          </div>
        </div>

        {/* Link to Providers Transparent Pricing */}
        <button
          onClick={() => onNavigateToProviders(endoscopyPlan.cptCode)}
          className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold text-xs py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Stethoscope className="w-3.5 h-3.5 text-slate-900" />
          <span>Shop Endoscopy Cash Pricing: ${endoscopyPlan.facilityCashPrice} vs ${endoscopyPlan.hospitalBilledAvg} Hospital</span>
        </button>
      </div>
    </div>
  );
};
