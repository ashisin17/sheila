import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
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
  Smile,
  CheckCircle2,
  Compass,
  Check,
  Edit3,
  Sliders,
} from 'lucide-react';
import { Language, MarkedDay, EndoscopyPlan, FoodLogEntry, DailyBodyMoodLog } from '../types';
import { TRANSLATIONS, INITIAL_ENDOSCOPY_PLAN, INITIAL_FOOD_LOGS, INITIAL_BODY_MOOD_LOGS } from '../data/initialData';

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

  // Real today's date information (e.g. September 25, 2026)
  const realNow = new Date();
  const realTodayYear = realNow.getFullYear();
  const realTodayMonth = realNow.getMonth(); // 0-indexed (e.g. 8 for September)
  const realTodayDay = realNow.getDate(); // e.g. 25

  // Calendar month/year navigation state - DEFAULT TO TODAY'S REAL DATE
  const [viewYear, setViewYear] = useState<number>(realTodayYear);
  const [viewMonth, setViewMonth] = useState<number>(realTodayMonth);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(realTodayDay);

  // Section Collapsible / Toggle States (allows toggling all cards on or off)
  const [showBodyMoodHub, setShowBodyMoodHub] = useState<boolean>(true);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState<boolean>(false);
  const [showJourney, setShowJourney] = useState<boolean>(false);

  // Consolidated Logging Hub State underneath White Calendar
  const [loggingTab, setLoggingTab] = useState<'body_mood' | 'food' | 'summary'>('body_mood');

  // Daily Body & Mood Logs per dateKey
  const [dailyBodyLogs, setDailyBodyLogs] = useState<Record<string, DailyBodyMoodLog>>(INITIAL_BODY_MOOD_LOGS);
  const [isEditingBodyLog, setIsEditingBodyLog] = useState<boolean>(false);

  // Initial form inputs (synced with today)
  const todayDateKey = `${realTodayYear}-${String(realTodayMonth + 1).padStart(2, '0')}-${String(realTodayDay).padStart(2, '0')}`;
  const initialTodayLog = INITIAL_BODY_MOOD_LOGS[todayDateKey];

  const [sleepHours, setSleepHours] = useState<number>(initialTodayLog?.sleepHours ?? 7.5);
  const [sugarIntake, setSugarIntake] = useState<'none' | 'low' | 'high'>(initialTodayLog?.sugarIntake ?? 'low');
  const [mood, setMood] = useState<'Calm' | 'Focused' | 'Fatigued' | 'Brain Fog' | 'Anxious'>(initialTodayLog?.mood ?? 'Calm');
  const [burningFeet, setBurningFeet] = useState<number>(initialTodayLog?.burningFeet ?? 3);
  const [handTingling, setHandTingling] = useState<number>(initialTodayLog?.handTingling ?? 2);
  const [rapidHeartbeat, setRapidHeartbeat] = useState<number>(initialTodayLog?.rapidHeartbeat ?? 5);
  const [tremorsAtaxia, setTremorsAtaxia] = useState<number>(initialTodayLog?.tremorsAtaxia ?? 2);
  const [bodyNotes, setBodyNotes] = useState<string>(initialTodayLog?.bodyNotes ?? '');
  const [bodySavedToast, setBodySavedToast] = useState<boolean>(false);

  // Food Logging State
  const [foodMealTime, setFoodMealTime] = useState<string>('11:00 AM');
  const [foodItem, setFoodItem] = useState<string>('');
  const [foodLocation, setFoodLocation] = useState<string>('');
  const [foodSuspectedTrigger, setFoodSuspectedTrigger] = useState<boolean>(false);
  const [foodNotes, setFoodNotes] = useState<string>('');
  const [foodSavedToast, setFoodSavedToast] = useState<boolean>(false);

  // Selected date calculations
  const activeDay = selectedDayNumber || (viewYear === realTodayYear && viewMonth === realTodayMonth ? realTodayDay : (viewYear === 2025 && viewMonth === 5 ? 12 : 1));
  const selectedDateObj = new Date(viewYear, viewMonth, activeDay);
  const selectedDateStr = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const selectedDateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(activeDay).padStart(2, '0')}`;

  const isSelectedRealToday = viewYear === realTodayYear && viewMonth === realTodayMonth && activeDay === realTodayDay;
  const isSelectedJune12 = viewYear === 2025 && viewMonth === 5 && activeDay === 12;

  // Saved log for current selected date
  const currentSavedLog = dailyBodyLogs[selectedDateKey];

  // Marked day lookup (for June 2025 or marked days)
  const markedMap = new Map<number, MarkedDay>();
  if (viewYear === 2025 && viewMonth === 5) {
    markedDays.forEach((md) => {
      markedMap.set(md.day, md);
    });
  }

  const selectedDayData = selectedDayNumber && viewYear === 2025 && viewMonth === 5 ? markedMap.get(selectedDayNumber) : null;
  const selectedDayFoods = selectedDayNumber ? foodLogs.filter((f) => f.day === selectedDayNumber) : [];

  // Check if cluster detected
  const hasNeurologicalCluster = markedDays.some((d) => d.isNeurologicalCluster);

  // Dynamic calendar dates generation for current viewed month and year
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const numDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const numDaysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarCells: Array<{ day: number; inMonth: boolean }> = [];

  // Leading days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarCells.push({ day: numDaysInPrevMonth - i, inMonth: false });
  }
  // Days in current month
  for (let i = 1; i <= numDaysInMonth; i++) {
    calendarCells.push({ day: i, inMonth: true });
  }
  // Trailing days to round out the 7-column grid
  let nextDay = 1;
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push({ day: nextDay++, inMonth: false });
  }

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
    setSelectedDayNumber(1);
    setIsEditingBodyLog(false);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
    setSelectedDayNumber(1);
    setIsEditingBodyLog(false);
  };

  const handleJumpToToday = () => {
    setViewYear(realTodayYear);
    setViewMonth(realTodayMonth);
    setSelectedDayNumber(realTodayDay);
    setIsEditingBodyLog(false);
    // Load today's log if present
    const dateKey = `${realTodayYear}-${String(realTodayMonth + 1).padStart(2, '0')}-${String(realTodayDay).padStart(2, '0')}`;
    const saved = dailyBodyLogs[dateKey];
    if (saved) {
      setSleepHours(saved.sleepHours);
      setSugarIntake(saved.sugarIntake);
      setMood(saved.mood);
      setBurningFeet(saved.burningFeet);
      setHandTingling(saved.handTingling);
      setRapidHeartbeat(saved.rapidHeartbeat);
      setTremorsAtaxia(saved.tremorsAtaxia);
      setBodyNotes(saved.bodyNotes || '');
    }
  };

  const handleJumpToJune12 = () => {
    setViewYear(2025);
    setViewMonth(5);
    setSelectedDayNumber(12);
    setIsEditingBodyLog(false);
    const saved = dailyBodyLogs['2025-06-12'];
    if (saved) {
      setSleepHours(saved.sleepHours);
      setSugarIntake(saved.sugarIntake);
      setMood(saved.mood);
      setBurningFeet(saved.burningFeet);
      setHandTingling(saved.handTingling);
      setRapidHeartbeat(saved.rapidHeartbeat);
      setTremorsAtaxia(saved.tremorsAtaxia);
      setBodyNotes(saved.bodyNotes || '');
    }
  };

  // Day selection handler
  const handleSelectDay = (day: number) => {
    setSelectedDayNumber(day);
    setIsEditingBodyLog(false);
    const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const saved = dailyBodyLogs[dateKey];
    if (saved) {
      setSleepHours(saved.sleepHours);
      setSugarIntake(saved.sugarIntake);
      setMood(saved.mood);
      setBurningFeet(saved.burningFeet);
      setHandTingling(saved.handTingling);
      setRapidHeartbeat(saved.rapidHeartbeat);
      setTremorsAtaxia(saved.tremorsAtaxia);
      setBodyNotes(saved.bodyNotes || '');
    } else {
      // Baseline template for unlogged day
      setSleepHours(7);
      setSugarIntake('low');
      setMood('Calm');
      setBurningFeet(5);
      setHandTingling(5);
      setRapidHeartbeat(5);
      setTremorsAtaxia(3);
      setBodyNotes('');
    }
  };

  // Handle saving body & mood log
  const handleSaveBodyLog = () => {
    const newLog: DailyBodyMoodLog = {
      day: activeDay,
      month: viewMonth,
      year: viewYear,
      dateKey: selectedDateKey,
      dateStr: selectedDateStr,
      sleepHours,
      sugarIntake,
      mood,
      burningFeet,
      handTingling,
      rapidHeartbeat,
      tremorsAtaxia,
      bodyNotes: bodyNotes.trim() || undefined,
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDailyBodyLogs((prev) => ({
      ...prev,
      [selectedDateKey]: newLog,
    }));

    setIsEditingBodyLog(false); // Condenses the box!
    setBodySavedToast(true);
    setTimeout(() => setBodySavedToast(false), 3000);
  };

  // Handle adding a food entry
  const handleSaveFoodEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItem.trim()) return;

    if (onAddFoodLog) {
      onAddFoodLog({
        day: activeDay,
        dateStr: selectedDateStr,
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

  const monthFormatted = new Date(viewYear, viewMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

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

      {/* NEUROLOGICAL SYMPTOM CLUSTER ALERT */}
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
        {/* Month Header Navigation & Fast Jumps */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Month & Arrow Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-base font-extrabold text-slate-900 min-w-[120px] text-center">
              {monthFormatted}
            </h3>
            <button
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleJumpToToday}
              className="inline-flex items-center gap-1.5 text-[10px] font-black bg-[#EAE06D] text-slate-900 px-2.5 py-1 rounded-full border border-yellow-400 shadow-2xs hover:bg-yellow-300 transition cursor-pointer"
              title={`Jump to Today (${realNow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-700 animate-pulse" />
              <span>Today: {realNow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </button>

            <button
              onClick={handleJumpToJune12}
              className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#F3EDF7] text-purple-900 px-2.5 py-1 rounded-full border border-purple-200 hover:bg-purple-100 transition cursor-pointer"
              title="Jump to June 2025 Clinic Case Study"
            >
              <span>Jun 2025 Case</span>
            </button>
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="flex items-center justify-end gap-3 text-xs font-bold text-slate-500 pt-0.5">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border-2 border-purple-800 bg-[#E8DFF2] inline-block shadow-2xs" />
            <span className="text-[10px] font-black text-purple-900">Today</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border border-purple-400 bg-purple-100 inline-block" />
            <span className="text-[10px]">Logged</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span className="text-[10px]">Flare</span>
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
                <div key={idx} className="py-2 text-slate-300 pointer-events-none text-[11px]">
                  {cell.day}
                </div>
              );
            }

            const cellDateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
            const isMarked = markedMap.has(cell.day);
            const markedItem = markedMap.get(cell.day);
            const hasSavedLog = Boolean(dailyBodyLogs[cellDateKey]);
            const isSelected = selectedDayNumber === cell.day;
            const isCellRealToday = viewYear === realTodayYear && viewMonth === realTodayMonth && cell.day === realTodayDay;
            const isCellJune12 = viewYear === 2025 && viewMonth === 5 && cell.day === 12;

            return (
              <div key={idx} className="flex flex-col justify-center items-center py-0.5">
                <button
                  onClick={() => handleSelectDay(cell.day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition text-xs font-bold relative cursor-pointer ${
                    isCellRealToday || isCellJune12
                      ? 'border-2 border-purple-900 bg-[#E8DFF2] text-purple-950 font-black ring-2 ring-purple-400/80 shadow-xs'
                      : isSelected
                      ? 'bg-purple-800 text-white font-extrabold shadow-xs'
                      : hasSavedLog
                      ? 'border-2 border-purple-400 bg-purple-50 text-purple-950 font-bold hover:bg-purple-100'
                      : isMarked
                      ? markedItem?.type === 'villi_recovery'
                        ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-extrabold'
                        : 'border-2 border-purple-400 bg-purple-50 text-slate-900 font-extrabold hover:bg-purple-100'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cell.day}

                  {/* Marker Dot (Flare or Villi Recovery) */}
                  {isMarked && (
                    <span
                      className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-white ${
                        markedItem?.type === 'villi_recovery' ? 'bg-emerald-600' : 'bg-rose-500'
                      }`}
                    />
                  )}

                  {/* Saved Mood Indicator dot */}
                  {hasSavedLog && !isMarked && (
                    <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-purple-600" />
                  )}
                </button>

                {(isCellRealToday || isCellJune12) && (
                  <span className="text-[7px] font-black uppercase tracking-tight bg-[#EAE06D] text-slate-900 px-1 rounded-full shadow-2xs border border-yellow-400 leading-none mt-0.5">
                    TODAY
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Section Toggles Bar (Toggle all sections on or off) */}
      <div className="bg-purple-50/80 px-3.5 py-2.5 rounded-2xl border border-purple-200/60 text-xs flex items-center justify-between flex-wrap gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 text-purple-900 font-extrabold text-[11px]">
          <Sliders className="w-3.5 h-3.5 text-purple-700" />
          <span>Section Toggles:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowBodyMoodHub((v) => !v)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition cursor-pointer border flex items-center gap-1 ${
              showBodyMoodHub
                ? 'bg-purple-800 text-white border-purple-800 shadow-2xs'
                : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <span>Body &amp; Mood</span>
            <span>{showBodyMoodHub ? '▲' : '▼'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAppointmentDetails((v) => !v)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition cursor-pointer border flex items-center gap-1 ${
              showAppointmentDetails
                ? 'bg-purple-800 text-white border-purple-800 shadow-2xs'
                : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <span>Wellness Check-in</span>
            <span>{showAppointmentDetails ? '▲' : '▼'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowJourney((v) => !v)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition cursor-pointer border flex items-center gap-1 ${
              showJourney
                ? 'bg-purple-800 text-white border-purple-800 shadow-2xs'
                : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <span>Endoscopy</span>
            <span>{showJourney ? '▲' : '▼'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const allOpen = showBodyMoodHub && showAppointmentDetails && showJourney;
              setShowBodyMoodHub(!allOpen);
              setShowAppointmentDetails(!allOpen);
              setShowJourney(!allOpen);
            }}
            className="text-[10px] font-black text-purple-800 hover:text-purple-950 underline px-1.5 cursor-pointer ml-1"
          >
            {showBodyMoodHub && showAppointmentDetails && showJourney ? 'Collapse all' : 'Toggle on all'}
          </button>
        </div>
      </div>

      {/* 3. CONSOLIDATED DAILY LOGGING HUB WITH EXPAND/COLLAPSE TOGGLE */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-purple-100/80 space-y-3 transition-all">
        {/* Toggleable Hub Header */}
        <button
          type="button"
          onClick={() => setShowBodyMoodHub(!showBodyMoodHub)}
          className="w-full text-left flex items-center justify-between gap-3 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E8DFF2] flex items-center justify-center text-purple-900 shadow-xs shrink-0 group-hover:scale-105 transition">
              <HeartPulse className="w-5 h-5 text-purple-800" />
            </div>
            <div>
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-purple-700 block">
                Daily Logging Hub · {selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                Daily Body &amp; Mood or Food
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentSavedLog && !showBodyMoodHub && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                ✓ Logged
              </span>
            )}
            {(isSelectedRealToday || isSelectedJune12) && (
              <span className="text-[9px] font-black bg-[#EAE06D] text-slate-900 px-2 py-0.5 rounded-full border border-yellow-400">
                Today
              </span>
            )}
            <div className="flex items-center gap-1 bg-[#F3EDF7] hover:bg-purple-100 text-purple-950 px-2.5 py-1 rounded-full text-[11px] font-bold transition">
              <span>{showBodyMoodHub ? 'Hide Logging' : 'Open Logging'}</span>
              {showBodyMoodHub ? (
                <ChevronUp className="w-3.5 h-3.5 text-purple-900" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-purple-900" />
              )}
            </div>
          </div>
        </button>

        {/* Collapsed Teaser Snapshot if a log exists */}
        {!showBodyMoodHub && currentSavedLog && (
          <div className="bg-[#F3EDF7]/50 rounded-2xl p-2.5 text-[11px] text-slate-700 flex items-center justify-between flex-wrap gap-2 border border-purple-100/60 animate-fade-in">
            <span className="font-bold flex items-center gap-1.5 text-purple-950">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Status: {currentSavedLog.mood} · {currentSavedLog.sleepHours}h Sleep · {currentSavedLog.sugarIntake} added sugar</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Tap &apos;Open Logging&apos; to view or edit</span>
          </div>
        )}

        {/* EXPANDABLE BODY & MOOD CONTENT */}
        {showBodyMoodHub && (
          <div className="space-y-4 pt-1 border-t border-purple-100 animate-fade-in">
            {/* Segmented Control Tabs */}
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

        {/* TAB 1: BODY & MOOD */}
        {loggingTab === 'body_mood' && (
          <div className="space-y-3.5 animate-fade-in text-xs">
            {/* CONDENSED VIEW: If saved log exists and user is not actively editing */}
            {currentSavedLog && !isEditingBodyLog ? (
              <div className="bg-[#F3EDF7]/70 rounded-2xl p-4 border border-purple-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                      ✓
                    </span>
                    <div>
                      <span className="text-[11px] font-black text-purple-950 block">
                        Body &amp; Mood Log Saved for {selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {currentSavedLog.savedAt && (
                        <span className="text-[9.5px] text-slate-500 font-medium">
                          Saved at {currentSavedLog.savedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingBodyLog(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-purple-900 bg-white hover:bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200 shadow-2xs transition cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-purple-700" />
                    <span>Edit Log</span>
                  </button>
                </div>

                {/* Condensed Metrics Display (NO ALCOHOL) */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2.5 rounded-xl border border-purple-100 space-y-1">
                    <span className="text-slate-400 text-[9.5px] font-bold uppercase block">
                      Mental Energy &amp; Mood
                    </span>
                    <p className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                      <span>{currentSavedLog.mood === 'Calm' ? '😌' : currentSavedLog.mood === 'Focused' ? '🎯' : currentSavedLog.mood === 'Fatigued' ? '🥱' : currentSavedLog.mood === 'Brain Fog' ? '🌫️' : '😰'}</span>
                      <span>{currentSavedLog.mood}</span>
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-purple-100 space-y-1">
                    <span className="text-slate-400 text-[9.5px] font-bold uppercase block">
                      Rest &amp; Nutrition
                    </span>
                    <p className="font-extrabold text-slate-800 text-xs">
                      {currentSavedLog.sleepHours}h Sleep
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {currentSavedLog.sugarIntake} added sugar
                    </p>
                  </div>
                </div>

                {/* Neurological Symptoms Snapshot */}
                <div className="bg-white p-2.5 rounded-xl border border-purple-100 space-y-1.5">
                  <span className="text-slate-400 text-[9.5px] font-bold uppercase block">
                    Recorded Body Symptoms
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
                    <div>
                      <span className="text-slate-500 block text-[9.5px]">Burning feet:</span>
                      <strong className="text-rose-700 font-extrabold">{currentSavedLog.burningFeet}/10</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9.5px]">Hand tingling:</span>
                      <strong className="text-purple-950 font-extrabold">{currentSavedLog.handTingling}/10</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9.5px]">Heart rate:</span>
                      <strong className="text-rose-700 font-extrabold">
                        {currentSavedLog.rapidHeartbeat > 7 ? 'Spike (115+)' : `${currentSavedLog.rapidHeartbeat}/10`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9.5px]">Tremors / ataxia:</span>
                      <strong className="text-purple-950 font-extrabold">{currentSavedLog.tremorsAtaxia}/10</strong>
                    </div>
                  </div>
                </div>

                {currentSavedLog.bodyNotes && (
                  <div className="bg-white/90 p-2.5 rounded-xl border border-purple-100 text-[11px] text-slate-700 italic">
                    &ldquo;{currentSavedLog.bodyNotes}&rdquo;
                  </div>
                )}
              </div>
            ) : (
              /* EXPANDED LOGGING FORM (Alcohol completely removed) */
              <div className="space-y-3.5">
                {/* 1-Tap Recovery Toggles: Sleep & Sugar ONLY (No alcohol) */}
                <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
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
                          className={`px-2.5 py-0.5 rounded-md font-extrabold transition cursor-pointer ${
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
                          className={`px-2 py-0.5 rounded-md uppercase text-[9px] font-extrabold transition cursor-pointer ${
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
                      placeholder="Optional note (e.g. felt calmer after 8h sleep and electrolytes)..."
                      className="w-full bg-white rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 border border-purple-200 focus:border-purple-400 outline-none"
                    />
                  </div>
                </div>

                {/* Save Body & Mood Button */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveBodyLog}
                    className="flex-1 bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 text-xs font-black py-2.5 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    {bodySavedToast ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800" />
                        <span>✓ Saved Body &amp; Mood!</span>
                      </>
                    ) : (
                      <>
                        <HeartPulse className="w-4 h-4 text-slate-900" />
                        <span>Save Body &amp; Mood for {selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}!</span>
                      </>
                    )}
                  </button>

                  {currentSavedLog && (
                    <button
                      type="button"
                      onClick={() => setIsEditingBodyLog(false)}
                      className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
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
                placeholder="e.g. Quinoa bowl with grilled chicken, Chamomile tea..."
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
                  <span>+ Log Meal for {selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </>
              )}
            </button>

            {/* Logged Foods for Selected Day List */}
            {selectedDayFoods.length > 0 && (
              <div className="pt-2 border-t border-purple-100 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <span>Logged Meals for {selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}:</span>
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

        {/* TAB 3: CONSOLIDATED SUMMARY (NO ALCOHOL) */}
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
                  <p className="font-black text-slate-800">{sleepHours}h Sleep</p>
                  <p className="text-slate-500 text-[10px] capitalize">{sugarIntake} added sugar</p>
                </div>

                <div className="bg-white p-2 rounded-xl border border-purple-100 space-y-0.5">
                  <span className="text-slate-400 text-[10px] block font-bold">MOOD &amp; ENERGY</span>
                  <p className="font-black text-slate-800">{mood}</p>
                  <p className="text-slate-500 text-[10px]">Small fiber sensory monitoring</p>
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
                onClick={() => onOpenDayView?.(activeDay)}
                className="w-full bg-white hover:bg-slate-50 text-purple-950 text-xs font-bold py-2 rounded-xl border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer mt-1"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-purple-700" />
                <span>Open Day View (Full Timeline for {selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>
              </button>
            </div>
          </div>
        )}
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
                      ★ CASE STUDY TODAY
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

          {/* Quick Action to Open Day View */}
          <button
            onClick={() => onOpenDayView?.(activeDay)}
            className="w-full bg-white hover:bg-slate-50 text-purple-950 text-xs font-bold py-2 rounded-xl border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>Open Day View Details</span>
          </button>
        </div>
      )}

      {/* 5. NEXT APPOINTMENT / WELLNESS CHECK-IN (PURE HEALTH FOCUS, NO MEALS) */}
      <div className="bg-[#B6A1DA] rounded-3xl p-4 text-slate-900 shadow-sm space-y-3 transition-all">
        {/* Toggleable Next Appointment Header Button */}
        <button
          type="button"
          onClick={() => setShowAppointmentDetails(!showAppointmentDetails)}
          className="w-full text-left flex items-center justify-between gap-3 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            {/* Dynamic Date Badge */}
            <div className="w-11 h-11 rounded-2xl bg-[#EAE06D] flex items-center justify-center font-black text-lg text-slate-900 shadow-xs shrink-0 group-hover:scale-105 transition">
              {viewYear === 2025 && viewMonth === 5 ? 12 : activeDay}
            </div>

            <div>
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-purple-950/80 block">
                {viewYear === 2025 && viewMonth === 5
                  ? 'June 12 · 10:30 AM'
                  : isSelectedRealToday
                  ? `Today, ${selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · 10:30 AM`
                  : `${selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · 10:30 AM`}
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

        {/* EXPANDABLE APPOINTMENT DETAILS & PREP (Strictly health/appointment focused, NO MEALS) */}
        {showAppointmentDetails && (
          <div className="space-y-3 pt-1 border-t border-purple-300/40 animate-fade-in text-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
              <Clock className="w-3.5 h-3.5 text-purple-900" />
              <span>{t.appointmentTime} · Attending: Dr. Priya Shah &amp; Dr. Jordan Lee</span>
            </div>

            {/* Pure Clinical Health Vitals & Neurological Status (Replacing any logged meals) */}
            <div className="bg-white/75 rounded-2xl p-3 border border-purple-300/40 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-purple-950">
                <span className="flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-purple-800" />
                  <span>Clinical Vitals &amp; Neuropathy Status:</span>
                </span>
                <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full font-extrabold text-[9px]">
                  Sensory Flare Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-800">
                <div className="bg-white/90 p-2 rounded-xl border border-purple-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 block">SENSORY NERVES</span>
                  <p className="font-extrabold text-slate-900">Burning Feet: 7/10 · Tingling: 8/10</p>
                  <p className="text-[9.5px] text-slate-500">Small fiber peripheral pattern</p>
                </div>
                <div className="bg-white/90 p-2 rounded-xl border border-purple-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 block">AUTONOMIC / CARDIAC</span>
                  <p className="font-extrabold text-rose-700">Resting Pulse: 108–115 bpm</p>
                  <p className="text-[9.5px] text-slate-500">Autonomic reactivity post-flare</p>
                </div>
              </div>
              <p className="text-[10.5px] text-slate-700 leading-snug pt-0.5 font-medium">
                Clinical Objective: Present quantitative symptom log and secure blood requisitions (tTG-IgA, Total IgA, B12, Ferritin) prior to gluten challenge.
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
                onClick={() => onOpenDayView?.(viewYear === 2025 && viewMonth === 5 ? 12 : activeDay)}
                className="w-full bg-white hover:bg-slate-50 text-purple-950 text-xs font-black py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-purple-700" />
                <span>Open Day View ({viewYear === 2025 && viewMonth === 5 ? 'June 12' : selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>
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

      {/* 6. ENDOSCOPY & HEALING JOURNEY BUTTON (CASH PRICING REMOVED) */}
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

        {/* EXPANDABLE PHASES CONTENT */}
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

            {/* In-Network Endoscopy Specialists (Cash pricing removed) */}
            <button
              type="button"
              onClick={() => onNavigateToProviders(endoscopyPlan.cptCode)}
              className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold text-xs py-2.5 px-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-slate-900" />
              <span>Find In-Network Endoscopy Specialists &amp; Care Protocols</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
