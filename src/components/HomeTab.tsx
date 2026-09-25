import React, { useState, useRef } from 'react';
import {
  Pill,
  ChevronRight,
  MessageCircle,
  Mic,
  Send,
  Play,
  Pause,
  Download,
  Camera,
  X,
  Sparkles,
  AlertTriangle,
  Copy,
  Check,
  HeartPulse,
  Moon,
  Wine,
  HelpCircle,
  CalendarPlus,
  BookmarkPlus,
  Coffee,
  Activity,
  SlidersHorizontal,
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

  // Reminder Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const currentReminder = INITIAL_CAROUSEL_ITEMS[carouselIndex];

  // Voice playback tour state (for PLAY button in top subheader)
  const [isPlayingTour, setIsPlayingTour] = useState(false);

  // Check-in input state
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType>('menu_oatmilk');

  // Lifestyle & Metabolic factors
  const [hoursSlept, setHoursSlept] = useState<number>(7);
  const [sugarIntake, setSugarIntake] = useState<'none' | 'low' | 'high'>('low');
  const [alcoholDrinks, setAlcoholDrinks] = useState<number>(0);

  // Neurological flare symptom scores (1 to 10)
  const [burningFeet, setBurningFeet] = useState<number>(6);
  const [handTingling, setHandTingling] = useState<number>(5);
  const [rapidHeartbeat, setRapidHeartbeat] = useState<number>(6);
  const [tremorsAtaxia, setTremorsAtaxia] = useState<number>(4);

  // Image Upload / Preview state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis result state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TriggerAnalysis | null>(null);
  const [pinnedToCal, setPinnedToCal] = useState(false);
  const [addedToBoard, setAddedToBoard] = useState(false);
  const [copiedQuestion, setCopiedQuestion] = useState(false);
  const [toastNote, setToastNote] = useState<string | null>(null);

  const showQuickToast = (msg: string) => {
    setToastNote(msg);
    setTimeout(() => setToastNote(null), 3000);
  };

  // Carousel navigation
  const nextReminder = () => {
    setCarouselIndex((prev) => (prev + 1) % INITIAL_CAROUSEL_ITEMS.length);
  };

  const handleReminderTap = () => {
    onIncrementStreak();
    showQuickToast(`✓ Logged: ${currentReminder.title} (Streak: ${streakCount + 1} days)`);
    nextReminder();
  };

  // Play audio greeting using browser SpeechSynthesis or friendly chime
  const handlePlayVoiceTour = () => {
    if (isPlayingTour) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingTour(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const message =
        language === 'es'
          ? 'Hola querida, soy Sheila, tu defensora de salud. Cuéntame cómo te sientes hoy o revisa tus sensores de inflamación.'
          : language === 'zh'
          ? '亲爱的你好，我是你的AI健康伙伴 Sheila。记录你今天的身体感受，或核查任何餐食与麸质隐患。'
          : "Hey lovely, I'm Sheila, your health advocate. Share what's on your mind, or check your inflammation sensors below.";

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsPlayingTour(false);
      utterance.onerror = () => setIsPlayingTour(false);
      setIsPlayingTour(true);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingTour(true);
      setTimeout(() => setIsPlayingTour(false), 2500);
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
        showQuickToast(`Attached image: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  // 1-Click Load Demo Samples
  const loadDemoSample = (type: ActionType) => {
    setActiveAction(type);
    setPinnedToCal(false);
    setAddedToBoard(false);

    if (type === 'menu_oatmilk') {
      setSelectedImage(DEMO_ASSETS.oatMilkMenu);
      setImageName('Barista_Oat_Milk_Menu_Scan.jpg');
      setInputText(
        'Had an iced oat milk latte at local café 16h ago. Woke up with burning feet, hand tingling, and heart palpitations.'
      );
      setBurningFeet(8);
      setHandTingling(8);
      setRapidHeartbeat(9);
      setTremorsAtaxia(6);
      setHoursSlept(5);
    } else if (type === 'syrup_sauce') {
      setSelectedImage(DEMO_ASSETS.caramelSauce);
      setImageName('Artisan_Caramel_Syrup_Bottle.jpg');
      setInputText(
        'Had caramel drizzle in my afternoon drink. Now feeling sudden finger tremors and brain fog.'
      );
      setBurningFeet(6);
      setHandTingling(8);
      setTremorsAtaxia(8);
      setRapidHeartbeat(7);
      setSugarIntake('high');
    } else if (type === 'dish_restaurant') {
      setSelectedImage(DEMO_ASSETS.oatMilkMenu);
      setImageName('Restaurant_Sauce_Plate.jpg');
      setInputText(
        'Ordered grilled salmon with house glaze. Knuckles and wrists aching, feeling flushed.'
      );
      setBurningFeet(7);
      setHandTingling(6);
      setRapidHeartbeat(7);
    } else if (type === 'supplement_cosmetic') {
      setSelectedImage(DEMO_ASSETS.burningFeet);
      setImageName('Lip_Balm_Wheat_Germ_Label.jpg');
      setInputText(
        'Noticed Triticum Vulgare (Wheat) Germ Oil in my new lip balm. Lips stinging and skin tingling.'
      );
      setBurningFeet(5);
      setHandTingling(5);
    }
  };

  // Voice dictation
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsListening(true);
      setTimeout(() => {
        setInputText(
          language === 'es'
            ? 'Tomé un café con leche de avena hace 16 horas. Mis pies están ardiendo y mis manos tiemblan con taquicardia.'
            : language === 'zh'
            ? '昨天在咖啡店喝了燕麦奶拿铁，现在双脚灼热发烫，手指刺痛发麻并且心跳过速。'
            : 'Had an iced oat latte yesterday. Feet are burning, hands are tingling, and heart is racing.'
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
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Run Analysis
  const handleAnalyze = async () => {
    if (!inputText && !selectedImage) {
      setInputText('Auditing coffee shop menu and oats for hidden gluten traps.');
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setPinnedToCal(false);
    setAddedToBoard(false);

    try {
      const data = await analyzeTriggerApi({
        prompt: inputText || 'Evaluating symptoms and flare triggers',
        actionType: activeAction,
        imageBase64: selectedImage || undefined,
        hoursSlept,
        sugarIntake,
        alcoholDrinks,
        burningFeet,
        handTingling,
        tremorsAtaxia,
        rapidHeartbeat,
        jointPain: 5,
        language,
      });
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyQuestion = () => {
    if (!analysisResult) return;
    const q = analysisResult.exactQuestionToAsk[language] || analysisResult.exactQuestionToAsk.en;
    navigator.clipboard.writeText(q);
    setCopiedQuestion(true);
    setTimeout(() => setCopiedQuestion(false), 2000);
  };

  const handlePinCalendar = () => {
    if (!analysisResult) return;
    const newDay: MarkedDay = {
      day: Math.floor(Math.random() * 20) + 9,
      dateStr: analysisResult.calendarEventSuggestion.date || 'June 9, 2025',
      title: analysisResult.calendarEventSuggestion.title || 'Hidden Gluten Flare',
      severity: analysisResult.riskScore || 8,
      type: 'gluten_exposure',
      triggerDetails: analysisResult.compoundName,
      symptoms: [
        `Burning Feet: ${burningFeet}/10`,
        `Hand Tingling: ${handTingling}/10`,
        `Heart Rate: ${rapidHeartbeat > 7 ? 'Tachycardia' : 'Elevated'}`,
      ],
      imageUrl: selectedImage || undefined,
      notes: analysisResult.concreteCorrelation,
      isNeurologicalCluster: true,
    };
    onPinToCalendar(newDay);
    setPinnedToCal(true);
    showQuickToast('✓ Flare pinned to your Calendar!');
  };

  const handleAddToBoard = () => {
    if (!analysisResult) return;
    const newTrigger: HealthBoardTrigger = {
      id: `trig-${Date.now()}`,
      name: analysisResult.healthBoardTag.name || analysisResult.compoundName,
      category: 'cross_contamination',
      riskBadge: analysisResult.healthBoardTag.riskBadge || `${analysisResult.riskLevel} (${analysisResult.riskScore}/10)`,
      notes: analysisResult.healthBoardTag.notes || analysisResult.concreteCorrelation,
      dateAdded: 'Today',
    };
    onAddToHealthBoard(newTrigger);
    setAddedToBoard(true);
    showQuickToast('✓ Saved to Health Board!');
  };

  return (
    <div className="space-y-4 px-4 py-3 pb-24 text-slate-800">
      {/* Toast notification */}
      {toastNote && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#231A2F] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-purple-300/40 animate-fade-in">
          {toastNote}
        </div>
      )}

      {/* TOP SUBHEADER (Matches Mockup: "Home" on left, Download & PLAY on right) */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <h1 className="text-sm font-semibold text-slate-700 tracking-tight">Home</h1>
        <div className="flex items-center gap-2">
          {/* Download / Export summary icon */}
          <button
            onClick={() => onOpenSoapModal()}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition cursor-pointer"
            title="Download / View Advocacy Summary"
          >
            <Download className="w-4 h-4 stroke-[1.8]" />
          </button>

          {/* PLAY button */}
          <button
            onClick={handlePlayVoiceTour}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold transition cursor-pointer ${
              isPlayingTour
                ? 'bg-purple-200 border-purple-400 text-purple-900 animate-pulse'
                : 'border-slate-600/70 text-slate-800 hover:bg-slate-200/60'
            }`}
            title="Listen to Sheila's voice guidance"
          >
            {isPlayingTour ? (
              <Pause className="w-2.5 h-2.5 fill-current" />
            ) : (
              <Play className="w-2.5 h-2.5 fill-current" />
            )}
            <span>PLAY</span>
          </button>
        </div>
      </div>

      {/* REMINDER CARD (Soft muted lavender card matching mockup, NO "today 1 of 5" text) */}
      <div className="relative">
        {/* Floating Message Bubble Icon on top right */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => onOpenSoapModal()}
            className="w-8 h-8 rounded-full bg-[#ECE2F2] hover:bg-[#E3D6EA] text-purple-950 flex items-center justify-center transition shadow-2xs cursor-pointer"
            title="Open Clinical Chat & SOAP Note"
          >
            <MessageCircle className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Soft Lavender Card */}
        <div
          onClick={handleReminderTap}
          className="relative bg-[#B3A1C9] rounded-3xl p-5 text-slate-900 shadow-xs cursor-pointer transition-all hover:brightness-105 active:scale-[0.99] select-none"
        >
          <div className="flex items-center justify-between gap-3">
            {/* Soft Yellow Circle with Pill Icon */}
            <div className="w-11 h-11 rounded-full bg-[#F6EE9B] flex items-center justify-center shrink-0 text-slate-900 shadow-2xs">
              <Pill className="w-5 h-5 -rotate-45 stroke-[2.2]" />
            </div>

            {/* Content Text */}
            <div className="flex-1 min-w-0 pr-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-800/80 mb-0.5">
                {t.reminder}
              </span>
              <h2 className="font-bold text-base md:text-lg leading-snug text-slate-900 tracking-tight">
                {currentReminder.title}
              </h2>
            </div>

            {/* Subtle Right Chevron */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextReminder();
              }}
              className="text-slate-800/60 hover:text-slate-900 transition p-1"
              title="Next reminder"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {INITIAL_CAROUSEL_ITEMS.map((_, idx) => (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  carouselIndex === idx ? 'w-5 h-1.5 bg-slate-900' : 'w-1.5 h-1.5 bg-slate-700/35'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CHECK IN SECTION HEADER ("Hey lovely, how are you feeling?") */}
      <div className="pt-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
          {t.checkIn}
        </span>
        <h2 className="text-2xl sm:text-[27px] font-extrabold text-slate-900 tracking-tight leading-tight">
          {t.headline}
        </h2>
      </div>

      {/* CLEAN WHITE CHECK-IN CARD (Matching Mockup with textarea, purple mic, and yellow send button) */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-purple-100/70 flex flex-col justify-between min-h-[220px] transition-all">
        {/* Clean Textarea */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.placeholder}
          rows={4}
          className="w-full text-slate-800 placeholder:text-slate-400 text-sm md:text-base leading-relaxed outline-none resize-none bg-transparent"
        />

        {/* Selected Image Badge (Clean & Unobtrusive) */}
        {selectedImage && (
          <div className="my-2 p-2 bg-[#F3EDF7] rounded-2xl flex items-center justify-between gap-2 border border-purple-200">
            <div className="flex items-center gap-2 truncate">
              <img
                src={selectedImage}
                alt="Selected item"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-xs font-semibold text-slate-700 truncate">
                {imageName || 'Menu / Food Photo Attached'}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedImage(null);
                setImageName('');
              }}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Bottom Actions Row inside the white card */}
        <div className="flex items-center justify-between pt-2">
          {/* Left: Quick Upload trigger */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-purple-900 bg-slate-50 hover:bg-purple-50 px-2.5 py-1.5 rounded-full border border-slate-200/70 transition cursor-pointer"
              title="Attach photo of menu or ingredients"
            >
              <Camera className="w-3.5 h-3.5 text-purple-700" />
              <span>Attach</span>
            </button>
          </div>

          {/* Right: Purple Mic and Yellow Send Buttons matching mockup */}
          <div className="flex items-center gap-2">
            {/* Purple Microphone Button */}
            <button
              onClick={handleMicClick}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-[#9E8BBF] hover:bg-[#8F7BAE] text-white'
              }`}
              title="Dictate symptoms by voice"
            >
              <Mic className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Buttery Yellow Send Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-11 h-11 rounded-full bg-[#F6EE9B] hover:bg-[#ECE387] text-slate-800 flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              title="Analyze with AI"
            >
              {isAnalyzing ? (
                <Sparkles className="w-4 h-4 animate-spin text-slate-800" />
              ) : (
                <Send className="w-4 h-4 stroke-[2.2] -rotate-12" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* QUICK FOOD & FLARE SAMPLE SHORTCUTS (Clean single-line horizontal scroll) */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block px-1">
          Quick Flare Scenarios:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => loadDemoSample('menu_oatmilk')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${
              activeAction === 'menu_oatmilk'
                ? 'bg-purple-100 border-purple-300 text-purple-900 font-semibold'
                : 'bg-white border-purple-100 text-slate-600 hover:bg-purple-50/60'
            }`}
          >
            ☕ Oat Milk & Cafe
          </button>
          <button
            onClick={() => loadDemoSample('syrup_sauce')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${
              activeAction === 'syrup_sauce'
                ? 'bg-purple-100 border-purple-300 text-purple-900 font-semibold'
                : 'bg-white border-purple-100 text-slate-600 hover:bg-purple-50/60'
            }`}
          >
            🍯 Caramel & Syrups
          </button>
          <button
            onClick={() => loadDemoSample('dish_restaurant')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${
              activeAction === 'dish_restaurant'
                ? 'bg-purple-100 border-purple-300 text-purple-900 font-semibold'
                : 'bg-white border-purple-100 text-slate-600 hover:bg-purple-50/60'
            }`}
          >
            🍽️ Restaurant Dish
          </button>
          <button
            onClick={() => loadDemoSample('supplement_cosmetic')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${
              activeAction === 'supplement_cosmetic'
                ? 'bg-purple-100 border-purple-300 text-purple-900 font-semibold'
                : 'bg-white border-purple-100 text-slate-600 hover:bg-purple-50/60'
            }`}
          >
            💄 Balm / Supplement
          </button>
        </div>
      </div>

      {/* INFLAMMATION & SENSORS SECTION (Spacious, Roomy, Scrollable, Zero Overlapping) */}
      <div className="bg-white rounded-3xl p-5 border border-purple-100/70 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-purple-50 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Inflammation & Flare Sensors</h3>
              <p className="text-[11px] text-slate-500">Track physical cues, sleep, and nerve irritation</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
            Biometrics
          </span>
        </div>

        {/* Lifestyle Factors: Sleep, Sugar, Alcohol */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Lifestyle Factors
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Sleep */}
            <div className="p-3 rounded-2xl bg-[#F8F5FA] border border-purple-100/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <Moon className="w-3.5 h-3.5 text-purple-700" />
                <span>Sleep Duration</span>
              </div>
              <div className="flex gap-1.5">
                {[5, 7, 8].map((h) => (
                  <button
                    key={h}
                    onClick={() => setHoursSlept(h)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[38px] ${
                      hoursSlept === h
                        ? 'bg-purple-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-purple-100/60 border border-slate-200/50'
                    }`}
                  >
                    {h}h{h === 8 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Added Sugar */}
            <div className="p-3 rounded-2xl bg-[#F8F5FA] border border-purple-100/60">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                <span>Added Sugar</span>
              </div>
              <div className="flex gap-1.5">
                {(['none', 'low', 'high'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSugarIntake(s)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold uppercase transition cursor-pointer min-h-[38px] ${
                      sugarIntake === s
                        ? 'bg-purple-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-purple-100/60 border border-slate-200/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Alcohol */}
            <div className="p-3 rounded-2xl bg-[#F8F5FA] border border-purple-100/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <Wine className="w-3.5 h-3.5 text-rose-600" />
                <span>Alcohol Drinks</span>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAlcoholDrinks(a)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[38px] ${
                      alcoholDrinks === a
                        ? 'bg-rose-700 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-rose-50 border border-slate-200/50'
                    }`}
                  >
                    {a === 2 ? '2+' : a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Neurological & Autoimmune Sliders (Generous vertical spacing, no cramped overlap) */}
        <div className="space-y-4 pt-2 border-t border-purple-50">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Neurological Flare Markers (1–10)
          </span>

          {/* Burning Feet */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Burning Feet (Small Fiber Neuropathy)</span>
              <span className={`px-2 py-0.5 rounded-md ${burningFeet >= 7 ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-900'}`}>
                {burningFeet}/10 · {burningFeet >= 7 ? 'Acute' : burningFeet >= 4 ? 'Moderate' : 'Mild'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={burningFeet}
              onChange={(e) => setBurningFeet(Number(e.target.value))}
              className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-800"
            />
          </div>

          {/* Hand Tingling */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Hand Tingling & Finger Numbness</span>
              <span className={`px-2 py-0.5 rounded-md ${handTingling >= 7 ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-900'}`}>
                {handTingling}/10 · {handTingling >= 7 ? 'High' : 'Normal'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={handTingling}
              onChange={(e) => setHandTingling(Number(e.target.value))}
              className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-800"
            />
          </div>

          {/* Rapid Heartbeat */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Post-Meal Rapid Heartbeat (Autonomic)</span>
              <span className={`px-2 py-0.5 rounded-md ${rapidHeartbeat >= 7 ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-900'}`}>
                {rapidHeartbeat >= 7 ? '115+ bpm (Spike)' : `${rapidHeartbeat * 10 + 40} bpm`}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={rapidHeartbeat}
              onChange={(e) => setRapidHeartbeat(Number(e.target.value))}
              className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-rose-700"
            />
          </div>

          {/* Finger Tremors & Motor Ataxia */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Finger Tremors & Motor Ataxia</span>
              <span className={`px-2 py-0.5 rounded-md ${tremorsAtaxia >= 7 ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-900'}`}>
                {tremorsAtaxia}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={tremorsAtaxia}
              onChange={(e) => setTremorsAtaxia(Number(e.target.value))}
              className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-800"
            />
          </div>
        </div>
      </div>

      {/* AI ANALYSIS LOADING STATE */}
      {isAnalyzing && (
        <div className="bg-[#E8DFF2] rounded-3xl p-5 text-center border border-purple-300/50 shadow-xs animate-pulse">
          <div className="w-9 h-9 rounded-full bg-[#B3A1C9] text-slate-900 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <h4 className="font-extrabold text-sm text-purple-950">{t.analyzing}</h4>
          <p className="text-xs text-purple-800 mt-1">
            Auditing cross-contamination points, oat mill lines, and neurological correlation markers.
          </p>
        </div>
      )}

      {/* AI ANALYSIS RESULT CARD */}
      {analysisResult && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-purple-300 space-y-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-purple-100 pb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                  AI Risk Audit
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  {analysisResult.riskLevel} ({analysisResult.riskScore}/10)
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900">
                {analysisResult.compoundName}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F6EE9B] flex items-center justify-center text-slate-900 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          {/* EXACT QUESTION TO ASK BARISTA / WAITER */}
          <div className="bg-[#FAF7DA] border border-[#ECE070] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-800 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-purple-800" />
                <span>Exact 1-Sentence Script to Ask:</span>
              </span>
              <button
                onClick={handleCopyQuestion}
                className="bg-white text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full border border-yellow-300 shadow-2xs hover:bg-yellow-50 flex items-center gap-1 transition cursor-pointer"
              >
                {copiedQuestion ? (
                  <Check className="w-3 h-3 text-emerald-700" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedQuestion ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-900 font-semibold italic leading-relaxed">
              “{analysisResult.exactQuestionToAsk[language] || analysisResult.exactQuestionToAsk.en}”
            </p>
          </div>

          {/* Clinical & Cross Contamination Breakdown */}
          <div className="bg-[#F8F5FA] rounded-2xl p-3 border border-purple-100 space-y-1.5 text-xs">
            <span className="font-bold text-purple-950 block">Hidden Trap Mechanism:</span>
            <p className="text-slate-700 leading-relaxed">
              {analysisResult.crossContaminationTraps[0] || analysisResult.concreteCorrelation}
            </p>
          </div>

          {/* Action Buttons: Pin to Calendar & Add to Board */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handlePinCalendar}
              disabled={pinnedToCal}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                pinnedToCal
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-purple-900 hover:bg-purple-800 text-white'
              }`}
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>{pinnedToCal ? 'Pinned to Calendar' : '+ Pin to Calendar'}</span>
            </button>

            <button
              onClick={handleAddToBoard}
              disabled={addedToBoard}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-xs ${
                addedToBoard
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-[#F6EE9B] hover:bg-[#ECE387] text-slate-900 border-yellow-300'
              }`}
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{addedToBoard ? 'Saved to Board' : '+ Save to Board'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
