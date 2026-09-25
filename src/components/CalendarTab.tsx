import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  ChevronRight,
  Clock,
  Video,
  X,
  Plus,
} from 'lucide-react';
import { Language, MarkedDay } from '../types';
import { TRANSLATIONS } from '../data/initialData';

interface CalendarTabProps {
  language: Language;
  markedDays: MarkedDay[];
  onOpenSoapModal: () => void;
  onNavigateToProviders: (cptCodeFilter?: string) => void;
  onAddManualDay?: (day: MarkedDay) => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  language,
  markedDays,
  onOpenSoapModal,
  onNavigateToProviders,
}) => {
  const t = TRANSLATIONS[language].calendar;

  // Selected day for the Drawer / Snapshot
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(12);

  // Marked day lookup
  const markedMap = new Map<number, MarkedDay>();
  markedDays.forEach((md) => {
    markedMap.set(md.day, md);
  });

  const selectedDayData = selectedDayNumber ? markedMap.get(selectedDayNumber) : null;

  // Calendar dates generation for June 2025 (June 1 is Sunday, 30 days)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const calendarCells: Array<{ day: number; inMonth: boolean }> = [];

  // June 1, 2025 starts on Sunday (index 0)
  for (let i = 1; i <= 30; i++) {
    calendarCells.push({ day: i, inMonth: true });
  }
  // Fill remaining cells for grid balance
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push({ day: calendarCells.length - 29, inMonth: false });
  }

  return (
    <div className="space-y-4 px-4 py-3">
      {/* 1. Header matching mockup */}
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
                      ? 'border-2 border-purple-400 bg-purple-50 text-slate-900 font-extrabold hover:bg-purple-100'
                      : isSelected
                      ? 'bg-slate-200 text-slate-900'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cell.day}
                  {isMarked && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-1 ring-white" />
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
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[11px] text-slate-900">
                  Severity:
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px]">
                  {selectedDayData.severity}/10
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">
                  ({selectedDayData.type})
                </span>
              </div>
              <p className="text-slate-800 text-[11px] font-medium leading-relaxed">
                <strong className="text-slate-900">Trigger:</strong> {selectedDayData.triggerDetails}
              </p>
              <p className="text-slate-600 text-[10px] line-clamp-2">
                {selectedDayData.notes}
              </p>
            </div>
          </div>
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
            <h4 className="font-bold text-sm text-slate-900">
              {t.wellnessCheckin}
            </h4>
            <div className="flex items-center gap-1 text-xs text-slate-800/80 mt-0.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.appointmentTime}</span>
            </div>
          </div>
        </div>

        {/* Yellow Action Button: "Generate 1-Page Doctor SOAP Memo" */}
        <button
          onClick={onOpenSoapModal}
          className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 text-xs font-extrabold py-3 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-slate-900" />
          <span>{t.generateSoapBtn}</span>
        </button>
      </div>
    </div>
  );
};
