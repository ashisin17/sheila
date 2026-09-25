import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  AlertCircle,
  Eye,
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
  Moon,
  Wine,
  Smile,
  CheckCircle2,
  Compass,
  Check,
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
  onAddFoodLog?: (entry: Omit<FoodLogEntry, 'id'>) => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  language,
  markedDays,
  onOpenSoapModal,
  onNavigateToProviders,
  endoscopyPlan = INITIAL_ENDOSCOPY_PLAN,
  onOpenDayView,
  foodLogs = INITIAL_FOOD_LOGS,
  onAddFoodLog,
}) => {
  const t = TRANSLATIONS[language].calendar;

  // Selected day on the calendar (defaults to today: June 12)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(12);

  // Consolidated Logging Hub State underneath White Calendar
  const [loggingTab, setLoggingTab] = useState<'body_mood' | 'food' | 'summary'>('body_mood');

  // Body & Mood State (moved from Home Tab)
  const [sleepHours, setSleepHours] = useState<number>(6);
  const [sugarIntake, setSugarIntake] = useState<'none' | 'low' | 'high'>('low');
  const [alcoholDrinks, setAlcoholDrinks] = useState<number>(0);
  const [mood, setMood] = useState<'Calm' | 'Focused' | 'Fatigued' | 'Brain Fog' | 'Anxious'>('Calm');
  const [burningFeet, setBurningFeet] = useState<number>(7);
  const [handTingling, setHandTingling] = useState<number>(8);
  const [rapidHeartbeat, setRapidHeartbeat] = useState<number>(7);
  const [tremorsAtaxia, setTremorsAtaxia] = useState<number>(5);
  const [bodyNotes, setBodyNotes] = useState<string>('');
  const [bodySavedToast, setBodySavedToast] = useState<boolean>(false);

  // Food Logging State
  const [foodMealTime, setFoodMealTime] = useState<string>('11:00 AM');
  const [foodItem, setFoodItem] = useState<string>('');
  const [foodLocation, setFoodLocation] = useState<string>('');
  const [foodSuspectedTrigger, setFoodSuspectedTrigger] = useState<boolean>(false);
  const [foodNotes, setFoodNotes] = useState<string>('');
  const [foodSavedToast, setFoodSavedToast] = useState<boolean>(false);

  // Appointment & Journey Collapsible States (toggled OFF by default for clean UX)
  const [showAppointmentDetails, setShowAppointmentDetails] = useState<boolean>(false);
  const [showJourney, setShowJourney] = useState<boolean>(false);

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

  // Handle saving body & mood log
  const handleSaveBodyLog = () => {
    setBodySavedToast(true);
    setTimeout(() => setBodySavedToast(false), 3000);
  };

  // Handle adding a food entry
  const handleSaveFoodEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItem.trim()) return;

    if (onAddFoodLog) {
      onAddFoodLog({
        day: selectedDayNumber || 12,
        dateStr: selectedDayNumber === 12 ? 'Thursday, June 12, 2025' : `June ${selectedDayNumber}, 2025`,
        time: foodMealTime,
        item: foodItem.trim(),
        location: foodLocation.trim() || undefined,
        suspectedTrigger: foodSuspectedTrigger,
        notes: foodNotes.trim() || undefined,
      });
    }

    setFoodItem('');
    setFoodLocation('');
    setFoodNotes('');
    setFoodSuspectedTrigger(false);
    setFoodSavedToast(true);
    setTimeout(() => setFoodSavedToast(false), 3000);
  };

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
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900">
              June 2025
            </h3>
            <button
              onClick={() => setSelectedDayNumber(12)}
              className="inline-flex items-center gap-1.5 text-[10px] font-black bg-[#EAE06D] text-slate-900 px-2.5 py-0.5 rounded-full border border-yellow-400 shadow-2xs hover:bg-yellow-300 transition cursor-pointer"
              title="Jump to Today (June 12)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-700 animate-pulse" />
              <span>Today: Jun 12</span>
            </button>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-purple-800 bg-[#E8DFF2] inline-block shadow-2xs" />
              <span className="text-[11px] font-black text-purple-900">Today</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-purple-500 bg-purple-50 inline-block" />
              <span className="text-[11px]">{t.marked}</span>
            </div>
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
              <div key={idx} className="flex flex-col justify-center items-center py-0.5">
                <button
                  onClick={() => setSelectedDayNumber(cell.day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition text-xs font-bold relative ${
                    isJune12
                      ? 'border-2 border-purple-900 bg-[#E8DFF2] text-purple-950 font-black ring-2 ring-purple-400/80 shadow-xs'
                      : isMarked
                      ? markedItem?.type === 'villi_recovery'
                        ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-extrabold'
                        : 'border-2 border-purple-400 bg-purple-50 text-slate-900 font-extrabold hover:bg-purple-100'
                      : isSelected
                      ? 'bg-slate-200 text-slate-900 font-bold'
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
                {isJune12 && (
                  <span className="text-[7.5px] font-black uppercase tracking-tight bg-[#EAE06D] text-slate-900 px-1 rounded-full shadow-2xs border border-yellow-400 leading-none mt-0.5">
                    TODAY
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CONSOLIDATED DAILY LOGGING HUB UNDERNEATH THE WHITE CALENDAR */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-purple-100/80 space-y-4">
        {/* Hub Header & Navigation Tabs */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-900 shrink-0">
                <HeartPulse className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
                  Daily Logging Hub · June {selectedDayNumber || 12}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                  Log Body &amp; Mood or Food
                </h3>
              </div>
            </div>

            {selectedDayNumber === 12 && (
              <span className="text-[9px] font-black bg-[#EAE06D] text-slate-900 px-2 py-0.5 rounded-full border border-yellow-400">
                Today
              </span>
            )}
          </div>

          {/* Clean Segmented Control Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#F3EDF7]/80 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setLoggingTab('body_mood')}
              className={`py-1.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                loggingTab === 'body_mood'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span className="text-[11px]">Body &amp; Mood</span>
            </button>

            <button
              onClick={() => setLoggingTab('food')}
              className={`py-1.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                loggingTab === 'food'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span className="text-[11px]">Log Food</span>
            </button>

            <button
              onClick={() => setLoggingTab('summary')}
              className={`py-1.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                loggingTab === 'summary'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">Day Summary</span>
            </button>
          </div>
        </div>

        {/* TAB 1: BODY & MOOD (Consolidated feature moved from Home) */}
        {loggingTab === 'body_mood' && (
          <div className="space-y-3.5 animate-fade-in text-xs">
            {/* 1-Tap Recovery Toggles: Sleep, Sugar, Alcohol */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
              {/* Hours Slept */}
              <div className="bg-[#F3EDF7]/60 p-2.5 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-slate-500 block flex items-center justify-center gap-1">
                  <Moon className="w-3 h-3 text-purple-700" />
                  <span>Sleep</span>
                </span>
                <div className="flex justify-center gap-1">
                  {[4.5, 6, 8].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSleepHours(h)}
                      className={`px-1.5 py-0.5 rounded-md font-extrabold transition cursor-pointer ${
                        sleepHours === h
                          ? 'bg-purple-800 text-white shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-purple-100/50'
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Sugar Intake */}
              <div className="bg-[#F3EDF7]/60 p-2.5 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-slate-500 block flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600" />
                  <span>Sugar</span>
                </span>
                <div className="flex justify-center gap-1">
                  {(['none', 'low', 'high'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSugarIntake(s)}
                      className={`px-1.5 py-0.5 rounded-md uppercase text-[9px] font-extrabold transition cursor-pointer ${
                        sugarIntake === s
                          ? 'bg-purple-800 text-white shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-purple-100/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alcohol */}
              <div className="bg-[#F3EDF7]/60 p-2.5 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-slate-500 block flex items-center justify-center gap-1">
                  <Wine className="w-3 h-3 text-rose-600" />
                  <span>Alcohol</span>
                </span>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAlcoholDrinks(a)}
                      className={`px-1.5 py-0.5 rounded-md font-extrabold transition cursor-pointer ${
                        alcoholDrinks === a
                          ? 'bg-rose-700 text-white shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-rose-100/50'
                      }`}
                    >
                      {a}dr
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mood & Energy Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-purple-700" />
                <span>Today&apos;s Mood &amp; Mental Energy</span>
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    { label: 'Calm', emoji: '😌' },
                    { label: 'Focused', emoji: '🎯' },
                    { label: 'Fatigued', emoji: '🥱' },
                    { label: 'Brain Fog', emoji: '🌫️' },
                    { label: 'Anxious', emoji: '😰' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setMood(m.label)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      mood === m.label
                        ? 'bg-purple-800 text-white shadow-2xs'
                        : 'bg-[#F3EDF7]/80 text-slate-700 hover:bg-purple-100'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Neurological & Physical Symptom Sliders */}
            <div className="bg-[#F3EDF7]/50 rounded-2xl p-3 border border-purple-200/60 space-y-2.5 text-[11px]">
              <span className="font-extrabold text-xs text-slate-900 block border-b border-purple-100 pb-1">
                How Your Body Feels Today (Sensory &amp; Neuropathy)
              </span>

              {/* Burning Feet */}
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-0.5">
                  <span>Burning feet sensation</span>
                  <span className="text-rose-700 font-extrabold">{burningFeet}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={burningFeet}
                  onChange={(e) => setBurningFeet(Number(e.target.value))}
                  className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>

              {/* Hand Tingling */}
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-0.5">
                  <span>Hand tingling &amp; numbness</span>
                  <span className="text-purple-950 font-extrabold">{handTingling}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={handTingling}
                  onChange={(e) => setHandTingling(Number(e.target.value))}
                  className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-800"
                />
              </div>

              {/* Rapid Heartbeat */}
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-0.5">
                  <span>Racing heartbeat</span>
                  <span className="text-rose-700 font-extrabold">
                    {rapidHeartbeat > 7 ? 'Spike (115+ bpm)' : `${rapidHeartbeat}/10`}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rapidHeartbeat}
                  onChange={(e) => setRapidHeartbeat(Number(e.target.value))}
                  className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>

              {/* Tremors / Ataxia */}
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-0.5">
                  <span>Shaky fingers &amp; tremors</span>
                  <span className="text-purple-950 font-extrabold">{tremorsAtaxia}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={tremorsAtaxia}
                  onChange={(e) => setTremorsAtaxia(Number(e.target.value))}
                  className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-800"
                />
              </div>

              {/* Optional Quick Reflection Notes */}
              <div className="pt-1">
                <input
                  type="text"
                  value={bodyNotes}
                  onChange={(e) => setBodyNotes(e.target.value)}
                  placeholder="Optional note (e.g. felt better after 8h sleep and chamomile tea)..."
                  className="w-full bg-white rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 border border-purple-200 focus:border-purple-400 outline-none"
                />
              </div>
            </div>

            {/* Save Body & Mood Log Button */}
            <button
              type="button"
              onClick={handleSaveBodyLog}
              className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 text-xs font-black py-2.5 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              {bodySavedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" />
                  <span>✓ Saved Today&apos;s Body &amp; Mood Log!</span>
                </>
              ) : (
                <>
                  <HeartPulse className="w-4 h-4 text-slate-900" />
                  <span>Save Body &amp; Mood Log for June {selectedDayNumber || 12}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 2: LOG FOOD & MEALS */}
        {loggingTab === 'food' && (
          <form onSubmit={handleSaveFoodEntry} className="space-y-3 animate-fade-in text-xs">
            {/* Meal Time Quick Chips */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">
                Meal / Time
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['8:30 AM', '11:00 AM', '1:00 PM', '4:30 PM', '7:30 PM'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFoodMealTime(time)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition cursor-pointer ${
                      foodMealTime === time
                        ? 'bg-purple-800 text-white'
                        : 'bg-[#F3EDF7] text-slate-700 hover:bg-purple-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Item Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                What did you eat or drink?
              </label>
              <input
                type="text"
                required
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                placeholder="e.g. Sourdough toast, Cold brew with almond milk..."
                className="w-full bg-[#F3EDF7]/60 focus:bg-white rounded-2xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 border border-purple-200/70 focus:border-purple-400 outline-none transition"
              />
            </div>

            {/* Location & Suspected Trigger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={foodLocation}
                  onChange={(e) => setFoodLocation(e.target.value)}
                  placeholder="e.g. Campus Cafe, Home"
                  className="w-full bg-[#F3EDF7]/60 focus:bg-white rounded-xl px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 border border-purple-200/70 outline-none"
                />
              </div>

              <div className="flex items-center self-end pb-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodSuspectedTrigger}
                    onChange={(e) => setFoodSuspectedTrigger(e.target.checked)}
                    className="rounded text-purple-700 focus:ring-purple-400 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-amber-900 font-extrabold">⚠️ Potential hidden gluten / flare</span>
                </label>
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <input
                type="text"
                value={foodNotes}
                onChange={(e) => setFoodNotes(e.target.value)}
                placeholder="Notes on equipment, barista questions, or how you felt..."
                className="w-full bg-[#F3EDF7]/60 focus:bg-white rounded-xl px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 border border-purple-200/70 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 text-xs font-black py-2.5 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              {foodSavedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" />
                  <span>✓ Added to Food Log!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-slate-900" />
                  <span>+ Log Meal for June {selectedDayNumber || 12}</span>
                </>
              )}
            </button>

            {/* Logged Foods for Selected Day List */}
            {selectedDayFoods.length > 0 && (
              <div className="pt-2 border-t border-purple-100 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <span>Logged Meals for June {selectedDayNumber || 12}:</span>
                  <span className="bg-purple-100 text-purple-900 px-1.5 rounded-full">{selectedDayFoods.length}</span>
                </div>
                <div className="space-y-1">
                  {selectedDayFoods.map((f) => (
                    <div
                      key={f.id}
                      className={`p-2 rounded-xl border text-[11px] flex items-center justify-between gap-2 ${
                        f.suspectedTrigger
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : 'bg-[#F3EDF7]/60 border-purple-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-slate-900">{f.time} · {f.item}</span>
                        {f.location && <span className="text-slate-500 text-[10px]"> ({f.location})</span>}
                      </div>
                      {f.suspectedTrigger && (
                        <span className="text-[8.5px] font-black bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded shrink-0">
                          Hidden Gluten
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}

        {/* TAB 3: TODAY'S CONSOLIDATED SUMMARY */}
        {loggingTab === 'summary' && (
          <div className="space-y-3 animate-fade-in text-xs">
            <div className="bg-[#F3EDF7]/70 rounded-2xl p-3 border border-purple-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-purple-950">
                  Consolidated Recovery Snapshot
                </span>
                <span className="text-[10px] bg-purple-200 text-purple-900 font-black px-2 py-0.5 rounded-full">
                  18-Day Villi Healing Streak
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-white p-2 rounded-xl border border-purple-100 space-y-0.5">
                  <span className="text-slate-400 text-[10px] block font-bold">SLEEP &amp; HABITS</span>
                  <p className="font-black text-slate-800">{sleepHours}h Sleep · {alcoholDrinks} Alcohol</p>
                  <p className="text-slate-500 text-[10px] capitalize">{sugarIntake} added sugar</p>
                </div>

                <div className="bg-white p-2 rounded-xl border border-purple-100 space-y-0.5">
                  <span className="text-slate-400 text-[10px] block font-bold">MOOD &amp; ENERGY</span>
                  <p className="font-black text-slate-800">{mood}</p>
                  <p className="text-slate-500 text-[10px]">Small fiber neuropathy active</p>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl border border-purple-100 text-[11px] space-y-1">
                <span className="text-slate-400 text-[10px] block font-bold">CURRENT SYMPTOM RATINGS</span>
                <div className="flex justify-between items-center text-[10px]">
                  <span>Burning feet: <strong className="text-rose-700">{burningFeet}/10</strong></span>
                  <span>Hand tingling: <strong className="text-purple-900">{handTingling}/10</strong></span>
                  <span>Racing heart: <strong className="text-rose-700">{rapidHeartbeat}/10</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenDayView?.(selectedDayNumber || 12)}
                className="w-full bg-white hover:bg-slate-50 text-purple-950 text-xs font-bold py-2 rounded-xl border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer mt-1"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-purple-700" />
                <span>Open Day View (Full Timeline for June {selectedDayNumber || 12})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. DAY SNAPSHOT DRAWER (when clicked from calendar) */}
      {selectedDayData && (
        <div className="bg-[#E8DFF2] rounded-3xl p-4 border border-purple-300/60 shadow-sm space-y-2.5 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-2xl bg-[#B6A1DA] text-slate-900 font-black text-xs flex items-center justify-center">
                {selectedDayData.day}
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-purple-900 flex items-center gap-1.5">
                  <span>{selectedDayData.dateStr}</span>
                  {selectedDayData.day === 12 && (
                    <span className="bg-[#EAE06D] text-slate-900 text-[8px] font-black px-1.5 py-0.2 rounded-full border border-yellow-400">
                      ★ TODAY
                    </span>
                  )}
                </span>
                <h4 className="font-bold text-sm text-slate-900 leading-tight">
                  {selectedDayData.title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setSelectedDayNumber(null)}
              className="w-6 h-6 rounded-full bg-white/70 text-slate-600 flex items-center justify-center hover:bg-white cursor-pointer"
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

      {/* 5. NEXT APPOINTMENT BUTTON (Click to view wellness check-in / visit prep) */}
      <div className="bg-[#B6A1DA] rounded-3xl p-4 text-slate-900 shadow-sm space-y-3 transition-all">
        {/* Toggleable Next Appointment Header Button */}
        <button
          type="button"
          onClick={() => setShowAppointmentDetails(!showAppointmentDetails)}
          className="w-full text-left flex items-center justify-between gap-3 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            {/* Yellow Square Badge "12" */}
            <div className="w-11 h-11 rounded-2xl bg-[#EAE06D] flex items-center justify-center font-black text-lg text-slate-900 shadow-xs shrink-0 group-hover:scale-105 transition">
              12
            </div>

            <div>
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-purple-950/80 block">
                {t.nextMarkedDay} · 10:30 AM
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                {t.wellnessCheckin}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/70 hover:bg-white text-purple-950 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition">
            <span>{showAppointmentDetails ? 'Hide Prep' : 'Visit Prep'}</span>
            {showAppointmentDetails ? (
              <ChevronUp className="w-3.5 h-3.5 text-purple-900" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-purple-900" />
            )}
          </div>
        </button>

        {/* EXPANDABLE APPOINTMENT DETAILS & PREP (when clicked) */}
        {showAppointmentDetails && (
          <div className="space-y-3 pt-1 border-t border-purple-300/40 animate-fade-in text-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
              <Clock className="w-3.5 h-3.5 text-purple-900" />
              <span>{t.appointmentTime} · Attending: Dr. Priya Shah &amp; Dr. Jordan Lee</span>
            </div>

            {/* Day 12 Food Log Highlight */}
            <div className="bg-white/70 rounded-2xl p-2.5 border border-purple-300/40 text-xs space-y-1">
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

            {/* Pre-Visit Checklist */}
            <div className="bg-white/60 rounded-2xl p-2.5 border border-purple-200 space-y-1 text-[11px]">
              <span className="font-extrabold text-purple-950 block text-[10px] uppercase tracking-wide">
                Doctor Visit Readiness Checklist:
              </span>
              <div className="space-y-1 text-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>14-month symptom timeline &amp; neuropathy cluster verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Requisition codes prepared: CPT 83516 (tTG-IgA) + CPT 82607 (B12)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>SOAP clinical memo ready to stop anxiety misdiagnosis</span>
                </div>
              </div>
            </div>

            {/* 1-Click Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenDayView?.(12)}
                className="w-full bg-white hover:bg-slate-50 text-purple-950 text-xs font-black py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-purple-700" />
                <span>Open Day View (June 12)</span>
              </button>

              <button
                type="button"
                onClick={onOpenSoapModal}
                className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 text-xs font-black py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>Doctor Visit Prep (SOAP Memo)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. ENDOSCOPY & HEALING JOURNEY BUTTON (WHEN CLICKED SHOWS PHASES, OTHERWISE TOGGLED OFF) */}
      <div className="bg-linear-to-b from-[#F3EDF7] to-white rounded-3xl p-4 sm:p-5 border-2 border-purple-200/90 shadow-sm space-y-3">
        {/* Journey Button Header */}
        <button
          type="button"
          onClick={() => setShowJourney(!showJourney)}
          className="w-full text-left flex items-center justify-between gap-3 cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EAE06D] flex items-center justify-center text-slate-900 shadow-xs shrink-0 group-hover:scale-105 transition">
              <Compass className="w-5 h-5 text-slate-900 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">
                My Endoscopy &amp; Healing Journey
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                {endoscopyPlan.procedureName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-900 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition">
            <span>{showJourney ? 'Hide Phases' : 'Show Phases (2)'}</span>
            {showJourney ? (
              <ChevronUp className="w-3.5 h-3.5 text-purple-900" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-purple-900" />
            )}
          </div>
        </button>

        {/* EXPANDABLE PHASES CONTENT (Only shown when Journey button is clicked) */}
        {showJourney && (
          <div className="space-y-3 pt-1 border-t border-purple-200/70 animate-fade-in">
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
              type="button"
              onClick={() => onNavigateToProviders(endoscopyPlan.cptCode)}
              className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold text-xs py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-slate-900" />
              <span>Shop Endoscopy Cash Pricing: ${endoscopyPlan.facilityCashPrice} vs ${endoscopyPlan.hospitalBilledAvg} Hospital</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
