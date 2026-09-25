import React, { useState } from 'react';
import {
  X,
  Upload,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  HeartPulse,
  Activity,
  FileText,
  DollarSign,
  ChevronRight,
  RefreshCw,
  Flame,
  Check,
} from 'lucide-react';
import {
  SymptomToggle,
  EndoscopyPlan,
  DailyRecoveryHabits,
  UserProfile,
  Language,
} from '../types';
import {
  INITIAL_SYMPTOMS,
  INITIAL_ENDOSCOPY_PLAN,
  INITIAL_HABITS,
  DEMO_AFTER_VISIT_SUMMARY_TEXT,
  DEMO_ASSETS,
} from '../data/initialData';
import { parseVisitSummaryApi } from '../services/api';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    symptoms: SymptomToggle[];
    endoscopyPlan: EndoscopyPlan;
    habits: DailyRecoveryHabits;
    patientName: string;
  }) => void;
  language: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  language,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Step 1 choices
  const [selectedCondition, setSelectedCondition] = useState<string>('Celiac Disease');
  const [summaryInputText, setSummaryInputText] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [autoFilledBySheila, setAutoFilledBySheila] = useState<boolean>(false);

  // Step 2 state (Toggles & Endoscopy Date)
  const [symptoms, setSymptoms] = useState<SymptomToggle[]>(INITIAL_SYMPTOMS);
  const [endoscopyDate, setEndoscopyDate] = useState<string>('2025-10-24');
  const [glutenChallengeAlert, setGlutenChallengeAlert] = useState<boolean>(true);
  const [patientName, setPatientName] = useState<string>('Maya');
  const [gaslightingNotice, setGaslightingNotice] = useState<string>(
    '8 previous doctors dismissed Maya’s peripheral neuropathy, hand tremors, and tachycardia as "anxiety / frat flu" because classic severe stomach cramping was absent.'
  );

  // Step 3 state (Daily habits & plan)
  const [habits, setHabits] = useState<DailyRecoveryHabits>(INITIAL_HABITS);

  if (!isOpen) return null;

  // Toggle chip selection
  const handleToggleSymptom = (id: string) => {
    setSymptoms((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  // Hackathon Demo 1-Click trigger
  const handleDemoUpload = async () => {
    setIsAnalyzing(true);
    setPreviewImage(DEMO_ASSETS.afterVisitSummary);
    setSummaryInputText(DEMO_AFTER_VISIT_SUMMARY_TEXT);
    setAutoFilledBySheila(true);

    try {
      const result = await parseVisitSummaryApi({
        summaryText: DEMO_AFTER_VISIT_SUMMARY_TEXT,
        imageBase64: DEMO_ASSETS.afterVisitSummary,
        language,
      });

      if (result && result.symptoms) {
        setSymptoms(result.symptoms);
      }
      if (result && result.patientName) {
        setPatientName(result.patientName);
      }
      if (result && result.dismissalHistory) {
        setGaslightingNotice(result.dismissalHistory);
      }
      if (result && result.upcomingProcedure && result.upcomingProcedure.scheduledDate) {
        setEndoscopyDate(result.upcomingProcedure.scheduledDate);
      }

      // Smooth step transition after AI extraction animation
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep(2);
      }, 700);
    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
      setCurrentStep(2);
    }
  };

  // Simulated Voice Recording
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsAnalyzing(true);
      setAutoFilledBySheila(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep(2);
      }, 800);
    } else {
      setIsRecording(true);
      setRecordingSeconds(0);
      const interval = setInterval(() => {
        setRecordingSeconds((sec) => {
          if (sec >= 3) {
            clearInterval(interval);
            setIsRecording(false);
            setIsAnalyzing(true);
            setAutoFilledBySheila(true);
            setTimeout(() => {
              setIsAnalyzing(false);
              setCurrentStep(2);
            }, 800);
            return 4;
          }
          return sec + 1;
        });
      }, 1000);
    }
  };

  // Final Action Plan Submission
  const handleFinishOnboarding = () => {
    const updatedPlan: EndoscopyPlan = {
      ...INITIAL_ENDOSCOPY_PLAN,
      scheduledDate: endoscopyDate,
    };

    onComplete({
      symptoms,
      endoscopyPlan: updatedPlan,
      habits,
      patientName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-purple-200 overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800">
        {/* Header Bar */}
        <div className="bg-[#B6A1DA] px-5 py-4 flex items-center justify-between text-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#EAE06D] flex items-center justify-center text-slate-900 shadow-xs">
              <Sparkles className="w-5 h-5 text-slate-900 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-950 bg-white/70 px-2 py-0.5 rounded-full">
                  15-Second Sheila Onboarding
                </span>
                <span className="text-[10px] font-bold text-slate-800">
                  Step {currentStep} of 3
                </span>
              </div>
              <h2 className="font-extrabold text-base leading-tight mt-0.5">
                {currentStep === 1 && 'Intake: Auto-Fill with Sheila'}
                {currentStep === 2 && 'Validate Your Symptoms & Endoscopy'}
                {currentStep === 3 && 'Your 4-Month Action Roadmap'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="bg-purple-100/60 h-1.5 w-full flex">
          <div
            className={`h-full bg-purple-700 transition-all duration-300 ${
              currentStep === 1 ? 'w-1/3' : currentStep === 2 ? 'w-2/3' : 'w-full'
            }`}
          />
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* ================= STEP 1: CHOOSE HOW TO START ================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Sheila AI Persona Speech Bubble */}
              <div className="bg-[#F3EDF7] rounded-2xl p-4 border border-purple-200/80 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EAE06D] flex items-center justify-center text-slate-900 font-black text-sm shrink-0 shadow-xs">
                  S
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-purple-950">Sheila</span>
                    <span className="text-[9px] bg-purple-200 text-purple-900 font-extrabold px-1.5 py-0.2 rounded-md">
                      AI Patient Advocate
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-700 leading-relaxed font-medium">
                    &ldquo;Hi Maya! Nobody wants to fill out a 20-question medical intake form when exhausted and sick.
                    Pick your condition below, or let me auto-fill your profile from your hospital After-Visit Summary or blood panel!&rdquo;
                  </p>
                </div>
              </div>

              {/* PATH B: Alternative Sign-Up with "Sheila" */}
              <div className="bg-linear-to-r from-[#EAE06D] to-[#F1E56B] rounded-2xl p-4 border border-yellow-300 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                    PATH B · Sign-Up With Sheila (Instant Stage Demo)
                  </span>
                  <span className="text-[9px] bg-slate-900 text-[#EAE06D] font-bold px-2 py-0.5 rounded-full">
                    Gemini Multimodal
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-semibold leading-snug">
                  1-Click Live Demo: Upload Maya&apos;s hospital discharge summary: watches symptom toggles light up and schedules her 4-month endoscopy!
                </p>
                <button
                  onClick={handleDemoUpload}
                  disabled={isAnalyzing}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 text-xs"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#EAE06D]" />
                      <span>Sheila is parsing Maya&apos;s After-Visit Summary...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#EAE06D]" />
                      <span>Demo: Upload Maya&apos;s After-Visit Summary</span>
                      <ArrowRight className="w-4 h-4 text-[#EAE06D]" />
                    </>
                  )}
                </button>
              </div>

              {/* Custom Upload or Voice Card */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Or Upload Real File / Speak 10s to Sheila
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <label className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition text-center">
                    <Upload className="w-5 h-5 text-purple-700" />
                    <span className="font-extrabold text-[11px] text-purple-950">
                      Upload AVS / Lab PDF
                    </span>
                    <span className="text-[9px] text-slate-500">PDF, JPG, PNG</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleDemoUpload();
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleToggleVoice}
                    className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 transition text-center ${
                      isRecording
                        ? 'border-rose-400 bg-rose-50 text-rose-800 animate-pulse'
                        : 'border-slate-200 hover:border-purple-300 bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="w-5 h-5 text-rose-600 animate-bounce" />
                    ) : (
                      <Mic className="w-5 h-5 text-purple-700" />
                    )}
                    <span className="font-extrabold text-[11px]">
                      {isRecording ? `Listening (${recordingSeconds}s)...` : 'Speak 10s to Sheila'}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {isRecording ? 'Tap to finish' : '"8 doctors dismissed my burning feet..."'}
                    </span>
                  </button>
                </div>
              </div>

              {/* PATH A: Guided Condition Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    PATH A · Step 1: Pick Your Condition or Status
                  </span>
                  <span className="text-[9px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-full">
                    Self-Guided
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Celiac Disease',
                    'Lupus',
                    "Hashimoto's",
                    'Rheumatoid Arthritis / Eczema',
                    'Undiagnosed (Still Searching for Answers)',
                  ].map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      className={`py-2.5 px-3 rounded-xl font-extrabold text-[11px] text-left transition border ${
                        selectedCondition === cond
                          ? 'bg-[#B6A1DA] border-purple-400 text-slate-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advance Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-[#B6A1DA] hover:bg-purple-300 text-slate-900 font-extrabold py-2.5 px-6 rounded-full shadow-xs transition flex items-center gap-1.5 active:scale-95"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: WHAT HAS YOUR EXPERIENCE BEEN LIKE? ================= */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Auto-filled Banner */}
              {autoFilledBySheila && (
                <div className="bg-[#EAE06D]/30 border border-yellow-400/80 rounded-2xl p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-900 shrink-0" />
                    <span className="text-xs font-extrabold text-slate-900">
                      Auto-filled by Sheila from Maya&apos;s After-Visit Summary
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-full">
                    Tap any chip to edit
                  </span>
                </div>
              )}

              {/* Subtitle & Anti-Gaslighting Context */}
              <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 space-y-1 text-rose-950">
                <div className="flex items-center gap-1.5 text-xs font-black text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>&ldquo;Here are general symptoms, but what has YOUR experience been like?&rdquo;</span>
                </div>
                <p className="text-[11px] text-rose-900/90 leading-relaxed font-medium">
                  {gaslightingNotice}
                </p>
                <span className="text-[10px] text-rose-800 font-bold block pt-0.5">
                  Neurological symptoms were dismissed as anxiety because classic stomach cramping was absent. Tap chips to toggle!
                </span>
              </div>

              {/* 1. Neurological & Systemic Toggles */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                      Neurological &amp; Systemic (Often Misdiagnosed as Anxiety)
                    </span>
                  </div>
                  <span className="text-[9px] bg-purple-100 text-purple-900 font-extrabold px-2 py-0.5 rounded-full border border-purple-200">
                    Often Missed by Doctors
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {symptoms
                    .filter((s) => s.category === 'neurological')
                    .map((symp) => (
                      <button
                        key={symp.id}
                        onClick={() => handleToggleSymptom(symp.id)}
                        className={`p-3 rounded-2xl border text-left transition flex items-start justify-between gap-2 ${
                          symp.selected
                            ? 'bg-[#F3EDF7] border-purple-400 shadow-xs'
                            : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-xs block text-slate-900 leading-tight">
                            {symp.label}
                          </span>
                          <span className="text-[10px] text-slate-500 block leading-tight">
                            {symp.description}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition ${
                            symp.selected
                              ? 'bg-purple-800 text-white font-bold text-xs'
                              : 'border border-slate-300'
                          }`}
                        >
                          {symp.selected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* 2. Gut & Malabsorption Toggles */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                      Gut &amp; Malabsorption (Flattened Intestinal Villi)
                    </span>
                  </div>
                  <span className="text-[9px] bg-yellow-100 text-yellow-900 font-bold px-2 py-0.5 rounded-full">
                    Marsh III Enteropathy
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {symptoms
                    .filter((s) => s.category === 'gut_malabsorption')
                    .map((symp) => (
                      <button
                        key={symp.id}
                        onClick={() => handleToggleSymptom(symp.id)}
                        className={`p-3 rounded-2xl border text-left transition flex items-start justify-between gap-2 ${
                          symp.selected
                            ? 'bg-[#EAE06D]/30 border-yellow-400 shadow-xs'
                            : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-extrabold text-xs block text-slate-900 leading-tight">
                              {symp.label}
                            </span>
                            {!symp.selected && symp.id === 'classic_stomach_cramping' && (
                              <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                                Absent (Atypical)
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block leading-tight">
                            {symp.description}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition ${
                            symp.selected
                              ? 'bg-yellow-500 text-slate-900 font-bold text-xs'
                              : 'border border-slate-300'
                          }`}
                        >
                          {symp.selected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* 3. Upcoming Procedures & Timeline Card */}
              <div className="bg-[#ECE6F0] rounded-2xl p-4 border border-purple-200 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#EAE06D] flex items-center justify-center text-slate-900">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-purple-900 block">
                        Step 3 · Upcoming Procedures &amp; Timeline
                      </span>
                      <h4 className="font-extrabold text-xs text-slate-900">
                        Upcoming Upper Endoscopy (GI Biopsy): In 4 Months (October)
                      </h4>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold bg-white text-purple-950 px-2 py-0.5 rounded-full border border-purple-300">
                    CPT 43239
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs bg-white/70 p-2.5 rounded-xl border border-purple-200/80">
                  <label htmlFor="endoscopyDate" className="text-slate-700 font-bold">
                    Procedure Date:
                  </label>
                  <input
                    id="endoscopyDate"
                    type="date"
                    value={endoscopyDate}
                    onChange={(e) => setEndoscopyDate(e.target.value)}
                    className="bg-white border border-purple-300 rounded-xl px-2.5 py-1 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* Catch-22 Gluten Challenge Toggle */}
                <div className="bg-white rounded-xl p-3 border border-purple-200 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="glutenChallengeToggle"
                    checked={glutenChallengeAlert}
                    onChange={(e) => setGlutenChallengeAlert(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-purple-800 rounded cursor-pointer"
                  />
                  <label htmlFor="glutenChallengeToggle" className="cursor-pointer space-y-0.5">
                    <span className="font-extrabold text-xs text-purple-950 block">
                      Send me a 1-Week Pre-Endoscopy Gluten Challenge Reminder
                    </span>
                    <span className="text-[10px] text-slate-600 block leading-tight">
                      When I must temporarily eat gluten so the biopsy accurately detects how my body reacts, with automatic flare support kit.
                    </span>
                  </label>
                </div>
              </div>

              {/* Step Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-slate-500 hover:text-slate-800 font-bold text-xs px-3 py-2"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#B6A1DA] hover:bg-purple-300 text-slate-900 font-extrabold py-2.5 px-6 rounded-full shadow-xs transition flex items-center gap-1.5 active:scale-95"
                >
                  <span>Create My Action Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: ACTION PLAN LAUNCH SCREEN ================= */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Success Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-sm text-emerald-950">
                    Maya&apos;s Personalized 3-Pillar Celiac &amp; Villi Action Plan
                  </h3>
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                    Synthesized by Sheila from your clinical history, 4-month endoscopy timeline, and CMS price transparency rights.
                  </p>
                </div>
              </div>

              {/* 3-Pillar Action Plan Cards */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Your 3 Clinical Action Pillars
                </span>

                {/* Pillar 1 */}
                <div className="bg-white rounded-2xl p-3.5 border-2 border-emerald-300 shadow-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#EAE06D] text-slate-900 font-black flex items-center justify-center text-xs">
                      1
                    </span>
                    <span className="font-extrabold text-xs text-slate-900">
                      Heal the Flattened Villi Now
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 pl-8 leading-relaxed font-medium">
                    100% strict gluten avoidance (watch out for hidden cross-contamination at coffee shops) + replenish depleted Vitamin D, B12, and Iron stores.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="bg-white rounded-2xl p-3.5 border-2 border-purple-300 shadow-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-700 text-white font-black flex items-center justify-center text-xs">
                      2
                    </span>
                    <span className="font-extrabold text-xs text-slate-900">
                      Calm Nerve &amp; Gut Inflammation
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 pl-8 leading-relaxed font-medium">
                    Prioritize 8+ hours of sleep and reduce inflammatory triggers (refined sugar and alcohol) to stop peripheral burning feet and hand tremors.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="bg-[#F3EDF7] rounded-2xl p-3.5 border-2 border-purple-400 shadow-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#EAE06D] text-slate-900 font-black flex items-center justify-center text-xs">
                      3
                    </span>
                    <span className="font-extrabold text-xs text-slate-900">
                      4-Month Endoscopy Countdown &amp; Gluten Challenge
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-950 pl-8 leading-relaxed font-medium">
                    Stay gluten-free now to recover, with an automatic Calendar alert 1 week before your endoscopy (October 10) to start the required pre-biopsy gluten challenge.
                  </p>
                </div>
              </div>

              {/* Big Launch Button */}
              <div className="pt-2">
                <button
                  onClick={handleFinishOnboarding}
                  className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-black py-3.5 px-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 active:scale-98 text-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-900" />
                  <span>Enter AuraHealth (Populate All 4 Tabs)</span>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
