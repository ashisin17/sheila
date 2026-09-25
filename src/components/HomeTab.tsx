import React, { useState, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Link2,
  Mic,
  Send,
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  CalendarPlus,
  BookmarkPlus,
  Sliders,
  CheckCircle,
  Activity,
  Flame,
  X,
  FileText,
} from 'lucide-react';
import { Language, ActionType, TriggerAnalysis, MarkedDay, HealthBoardTrigger } from '../types';
import { INITIAL_CAROUSEL_ITEMS, DEMO_ASSETS, TRANSLATIONS } from '../data/initialData';
import { analyzeTriggerApi } from '../services/api';

interface HomeTabProps {
  language: Language;
  onPinToCalendar: (day: MarkedDay) => void;
  onAddToHealthBoard: (trigger: HealthBoardTrigger) => void;
  onOpenSoapModal: () => void;
  streakCount: number;
  onIncrementStreak: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  language,
  onPinToCalendar,
  onAddToHealthBoard,
  onOpenSoapModal,
  streakCount,
  onIncrementStreak,
}) => {
  const t = TRANSLATIONS[language].home;

  // Carousel state (1 to 5)
  const [carouselIndex, setCarouselIndex] = useState(0);
  const currentCarousel = INITIAL_CAROUSEL_ITEMS[carouselIndex];

  // Check-in input state
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType>('skincare');
  const [showSliders, setShowSliders] = useState(false);

  // Sliders: 1 - 10
  const [jointPain, setJointPain] = useState(6);
  const [skinRedness, setSkinRedness] = useState(8);
  const [fatigue, setFatigue] = useState(7);

  // Image Upload / Preview state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis result state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TriggerAnalysis | null>(null);
  const [pinnedToCal, setPinnedToCal] = useState(false);
  const [addedToBoard, setAddedToBoard] = useState(false);

  // Carousel navigation
  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % INITIAL_CAROUSEL_ITEMS.length);
  };
  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + INITIAL_CAROUSEL_ITEMS.length) % INITIAL_CAROUSEL_ITEMS.length);
  };

  // Handle Carousel Card Action
  const handleCarouselAction = () => {
    if (currentCarousel.id === 1) {
      onIncrementStreak();
    } else if (currentCarousel.id === 5) {
      onOpenSoapModal();
    } else if (currentCarousel.id === 2) {
      loadDemoSample('skincare');
    } else if (currentCarousel.id === 3) {
      loadDemoSample('meal');
    } else {
      setShowSliders(true);
    }
  };

  // File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 1-Click Load Demo Samples
  const loadDemoSample = (type: ActionType) => {
    setActiveAction(type);
    setPinnedToCal(false);
    setAddedToBoard(false);

    if (type === 'skincare') {
      setSelectedImage(DEMO_ASSETS.serumBottle);
      setImageName('CeraGlow_Facial_Serum_Label.jpg');
      setInputText('Applied 4 drops of new CeraGlow facial serum last night. Woke up with burning cheek erythema.');
      setSkinRedness(9);
      setJointPain(3);
      setFatigue(5);
    } else if (type === 'meal') {
      setSelectedImage(DEMO_ASSETS.pastaBowl);
      setImageName('Arrabbiata_Nightshade_Pasta.jpg');
      setInputText('Had spicy tomato arrabbiata pasta with roasted chili peppers. Morning knuckles feel stiff and swollen.');
      setSkinRedness(5);
      setJointPain(8);
      setFatigue(7);
    } else if (type === 'flare') {
      setSelectedImage(DEMO_ASSETS.cheekFlare);
      setImageName('Cheek_Malar_Erythema_Photo.jpg');
      setInputText('Facial malar rash flare with hot burning sensation sparing nasolabial fold.');
      setSkinRedness(9);
      setJointPain(6);
      setFatigue(8);
    }
  };

  // Voice dictation simulation / Speech API
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // High fidelity simulation if browser speech recognition not available in sandbox
      setIsListening(true);
      setTimeout(() => {
        setInputText(
          language === 'es'
            ? 'Siento las mejillas muy calientes y ardorosas tras usar el sérum facial ayer.'
            : language === 'zh'
            ? '昨天晚上用了新买的抗敏精华液，今天两颊有灼烧感并且泛红严重。'
            : 'My cheeks have a hot burning sensation and bilateral redness 20 hours after using the facial serum.'
        );
        setIsListening(false);
      }, 1200);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'es' ? 'es-ES' : language === 'zh' ? 'zh-CN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Execute Analysis
  const handleAnalyze = async () => {
    if (!inputText && !selectedImage) {
      setInputText('Checking in on daily symptoms and skin status.');
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setPinnedToCal(false);
    setAddedToBoard(false);

    try {
      const data = await analyzeTriggerApi({
        prompt: inputText,
        actionType: activeAction,
        imageBase64: selectedImage || undefined,
        jointPain,
        skinRedness,
        fatigue,
        language,
      });
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Pin Trigger & Flare to Calendar
  const handlePinCalendar = () => {
    if (!analysisResult) return;
    const newDay: MarkedDay = {
      day: Math.floor(Math.random() * 20) + 9, // dynamic date in June
      dateStr: analysisResult.calendarEventSuggestion.date || 'June 10, 2025',
      title: analysisResult.calendarEventSuggestion.title || 'AI Logged Flare Event',
      severity: analysisResult.riskScore || 8,
      type: 'flare',
      triggerDetails: analysisResult.compoundName,
      symptoms: [
        `Skin Redness: ${skinRedness}/10`,
        `Joint Pain: ${jointPain}/10`,
        `Fatigue: ${fatigue}/10`,
      ],
      imageUrl: selectedImage || undefined,
      notes: analysisResult.concreteCorrelation,
    };
    onPinToCalendar(newDay);
    setPinnedToCal(true);
  };

  // Add Trigger to Health Board
  const handleAddToBoard = () => {
    if (!analysisResult) return;
    const newTrigger: HealthBoardTrigger = {
      id: `trig-${Date.now()}`,
      name: analysisResult.healthBoardTag.name || analysisResult.compoundName,
      category: activeAction === 'meal' ? 'food' : 'skincare',
      riskBadge: analysisResult.healthBoardTag.riskBadge || `${analysisResult.riskLevel} (${analysisResult.riskScore}/10)`,
      notes: analysisResult.healthBoardTag.notes || analysisResult.concreteCorrelation,
      dateAdded: 'Today',
    };
    onAddToHealthBoard(newTrigger);
    setAddedToBoard(true);
  };

  return (
    <div className="space-y-4 px-4 py-3">
      {/* 1. TOP CAROUSEL CARD ("TODAY 1 of 5") */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 px-1">
          <div className="flex items-center gap-1.5 uppercase tracking-wider">
            <span>
              {t.today} {carouselIndex + 1} {t.of} {INITIAL_CAROUSEL_ITEMS.length}
            </span>
          </div>
          <button
            onClick={() => onOpenSoapModal()}
            className="w-7 h-7 rounded-full bg-white shadow-xs border border-purple-200/60 flex items-center justify-center text-purple-700 hover:bg-purple-50 transition"
            title="Clinical Message & SOAP Notes"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Purple Carousel Card */}
        <div className="relative bg-[#B6A1DA] rounded-3xl p-5 text-slate-900 shadow-sm transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            {/* Yellow Circle Icon */}
            <div className="w-10 h-10 rounded-full bg-[#EAE06D] flex items-center justify-center shrink-0 text-slate-900 shadow-xs">
              <Link2 className="w-5 h-5 stroke-[2.2]" />
            </div>

            {/* Content */}
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900/80">
                  {currentCarousel.tag}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 text-slate-900">
                  {currentCarousel.badge}
                </span>
              </div>
              <h3 className="font-bold text-sm leading-snug text-slate-900">
                {currentCarousel.title}
              </h3>
              <p className="text-xs text-slate-800/85 mt-1 leading-relaxed">
                {currentCarousel.detail}
              </p>

              {/* 1-Tap Action Pill inside carousel */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleCarouselAction}
                  className="bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full transition shadow-xs flex items-center gap-1 active:scale-95"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{currentCarousel.actionText}</span>
                </button>
              </div>
            </div>

            {/* Navigation Chevron */}
            <button
              onClick={nextCarousel}
              className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-slate-900 transition self-center"
              title="Next notification"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {INITIAL_CAROUSEL_ITEMS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  carouselIndex === idx
                    ? 'w-5 h-1.5 bg-slate-900'
                    : 'w-1.5 h-1.5 bg-slate-700/40 hover:bg-slate-700/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. "CHECK IN" SECTION */}
      <div>
        <div className="mb-2 px-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            {t.checkIn}
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            {t.headline}
          </h2>
        </div>

        {/* Actionable Check-in Container Card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-purple-100/70 space-y-3">
          {/* Multimodal Action Pills with 1-Tap Load Demos */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center justify-between">
              <span>MULTIMODAL SENSORS:</span>
              <span className="text-purple-700 font-semibold text-[10px]">
                Tap to load live demo
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
              <button
                onClick={() => loadDemoSample('skincare')}
                className={`py-2 px-1.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition border ${
                  activeAction === 'skincare'
                    ? 'bg-[#E8DFF2] border-purple-400 text-purple-950 font-bold shadow-2xs'
                    : 'bg-[#F3EDF7]/60 border-transparent text-slate-600 hover:bg-[#F3EDF7]'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-purple-800 shadow-2xs">
                  🔬
                </div>
                <span className="text-[10px] leading-tight">Scan Skincare</span>
              </button>

              <button
                onClick={() => loadDemoSample('meal')}
                className={`py-2 px-1.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition border ${
                  activeAction === 'meal'
                    ? 'bg-[#E8DFF2] border-purple-400 text-purple-950 font-bold shadow-2xs'
                    : 'bg-[#F3EDF7]/60 border-transparent text-slate-600 hover:bg-[#F3EDF7]'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-purple-800 shadow-2xs">
                  🥗
                </div>
                <span className="text-[10px] leading-tight">Snap Meal</span>
              </button>

              <button
                onClick={() => loadDemoSample('flare')}
                className={`py-2 px-1.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition border ${
                  activeAction === 'flare'
                    ? 'bg-[#E8DFF2] border-purple-400 text-purple-950 font-bold shadow-2xs'
                    : 'bg-[#F3EDF7]/60 border-transparent text-slate-600 hover:bg-[#F3EDF7]'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-purple-800 shadow-2xs">
                  📸
                </div>
                <span className="text-[10px] leading-tight">Log Skin Flare</span>
              </button>
            </div>
          </div>

          {/* Image Preview if loaded */}
          {selectedImage && (
            <div className="relative rounded-2xl overflow-hidden border border-purple-200 bg-[#F3EDF7] p-2 flex items-center gap-3">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-16 h-16 object-cover rounded-xl border border-white shadow-2xs"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-purple-800">
                  Target Sample Attached
                </span>
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {imageName || 'Multimodal Image'}
                </p>
                <span className="text-[10px] text-slate-500">Ready for Gemini Vision OCR</span>
              </div>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setImageName('');
                }}
                className="w-6 h-6 rounded-full bg-white text-slate-500 flex items-center justify-center hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Real File Upload Input (hidden trigger) */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Text Input Area */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.placeholder}
              rows={3}
              className="w-full bg-[#F3EDF7]/60 focus:bg-white rounded-2xl p-3 text-xs text-slate-800 placeholder:text-slate-400 border border-transparent focus:border-purple-300 outline-none transition resize-none leading-relaxed"
            />
          </div>

          {/* Collapsible Symptom Severity Sliders */}
          <div className="border-t border-purple-100 pt-2">
            <button
              onClick={() => setShowSliders(!showSliders)}
              className="flex items-center justify-between w-full text-xs font-bold text-slate-700 py-1"
            >
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-700" />
                <span>Symptom Severity Biometrics (1-10)</span>
              </div>
              <span className="text-[11px] text-purple-700 font-semibold">
                {showSliders ? 'Hide Sliders ▲' : 'Adjust Sliders ▼'}
              </span>
            </button>

            {showSliders && (
              <div className="space-y-2.5 pt-2 pb-1 text-xs">
                {/* Skin Redness */}
                <div>
                  <div className="flex justify-between font-bold text-[11px] text-slate-600 mb-1">
                    <span>{t.skinRedness}</span>
                    <span className="text-purple-900 font-extrabold">{skinRedness}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={skinRedness}
                    onChange={(e) => setSkinRedness(Number(e.target.value))}
                    className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                  />
                </div>

                {/* Joint Pain */}
                <div>
                  <div className="flex justify-between font-bold text-[11px] text-slate-600 mb-1">
                    <span>{t.jointPain}</span>
                    <span className="text-purple-900 font-extrabold">{jointPain}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={jointPain}
                    onChange={(e) => setJointPain(Number(e.target.value))}
                    className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                  />
                </div>

                {/* Fatigue */}
                <div>
                  <div className="flex justify-between font-bold text-[11px] text-slate-600 mb-1">
                    <span>{t.fatigue}</span>
                    <span className="text-purple-900 font-extrabold">{fatigue}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={fatigue}
                    onChange={(e) => setFatigue(Number(e.target.value))}
                    className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Row: Camera/Upload, Purple Mic, Yellow Send Button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-[#F3EDF7] hover:bg-purple-100 px-2.5 py-1.5 rounded-full transition"
                title="Upload real photo"
              >
                <Camera className="w-3.5 h-3.5 text-purple-700" />
                <span>Upload</span>
              </button>

              <button
                onClick={() => loadDemoSample('skincare')}
                className="text-[11px] font-bold text-purple-800 bg-[#E8DFF2] hover:bg-purple-200 px-2.5 py-1.5 rounded-full transition"
              >
                {t.demoButton}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Purple Microphone Button */}
              <button
                onClick={handleMicClick}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-xs ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-[#B6A1DA] text-slate-900 hover:bg-purple-400'
                }`}
                title="Dictate symptoms (voice input)"
              >
                <Mic className="w-4 h-4 stroke-[2.4]" />
              </button>

              {/* Yellow Send Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-10 h-10 rounded-full bg-[#EAE06D] text-slate-900 flex items-center justify-center shadow-xs hover:bg-yellow-300 active:scale-95 transition disabled:opacity-50"
                title="Run Gemini Multimodal Analysis"
              >
                {isAnalyzing ? (
                  <Sparkles className="w-4 h-4 animate-spin text-slate-900" />
                ) : (
                  <Send className="w-4 h-4 stroke-[2.4]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {isAnalyzing && (
        <div className="bg-[#E8DFF2] rounded-3xl p-4 text-center border border-purple-300/50 shadow-xs animate-pulse">
          <div className="w-8 h-8 rounded-full bg-[#B6A1DA] text-slate-900 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <h4 className="font-extrabold text-sm text-purple-950">{t.analyzing}</h4>
          <p className="text-xs text-purple-800 mt-0.5">
            Cross-referencing cosmetic allergens, dietary solanine, and malar rash history.
          </p>
        </div>
      )}

      {/* 3. INSTANT ACTIONABLE AI OUTPUT ("TRIGGER & FLARE ACTION CARD") */}
      {analysisResult && (
        <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-[#B6A1DA] space-y-3 transition-all duration-300">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-purple-100 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                  {t.actionCardTitle}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  {analysisResult.riskLevel} ({analysisResult.riskScore}/10)
                </span>
              </div>
              <h3 className="font-black text-base text-slate-900 mt-1">
                {analysisResult.compoundName}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#EAE06D] flex items-center justify-center text-slate-900 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          {/* Concrete Correlation Callout */}
          <div className="bg-[#F3EDF7] rounded-2xl p-3 border border-purple-200/70">
            <div className="text-[11px] font-extrabold uppercase text-purple-900 flex items-center gap-1 mb-1">
              <Activity className="w-3.5 h-3.5 text-purple-700" />
              <span>Concrete Flare Correlation</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {analysisResult.concreteCorrelation}
            </p>
          </div>

          {/* Clinical Mechanism */}
          <div className="text-xs text-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clinical Mechanism
            </span>
            <p className="leading-relaxed">{analysisResult.clinicalMechanism}</p>
          </div>

          {/* Clinical Directives */}
          {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Action Directives
              </span>
              <ul className="text-xs text-slate-800 space-y-1">
                {analysisResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 2 One-Click Action Buttons */}
          <div className="pt-2 grid grid-cols-1 gap-2">
            {/* 1) Pin Flare & Trigger to June Calendar */}
            <button
              onClick={handlePinCalendar}
              disabled={pinnedToCal}
              className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                pinnedToCal
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-[#B6A1DA] hover:bg-purple-300 text-slate-900 active:scale-98'
              }`}
            >
              <CalendarPlus className="w-4 h-4" />
              <span>
                {pinnedToCal
                  ? '✓ Pinned to June Calendar (See Calendar Tab)'
                  : t.pinToCalendar}
              </span>
            </button>

            {/* 2) Add Flagged Ingredient to My Health Board */}
            <button
              onClick={handleAddToBoard}
              disabled={addedToBoard}
              className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                addedToBoard
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 active:scale-98'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>
                {addedToBoard
                  ? '✓ Added to Health Board (See You Tab)'
                  : t.addToHealthBoard}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
