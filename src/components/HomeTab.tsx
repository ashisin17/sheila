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
  Copy,
  Check,
  Coffee,
  Zap,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  Language,
  ActionType,
  TriggerAnalysis,
  MarkedDay,
  HealthBoardTrigger,
  DailyRecoveryHabits,
  EndoscopyPlan,
} from '../types';
import {
  INITIAL_CAROUSEL_ITEMS,
  DEMO_ASSETS,
  TRANSLATIONS,
  INITIAL_HABITS,
  INITIAL_ENDOSCOPY_PLAN,
} from '../data/initialData';
import { analyzeTriggerApi } from '../services/api';

interface HomeTabProps {
  language: Language;
  onPinToCalendar: (day: MarkedDay) => void;
  onAddToHealthBoard: (trigger: HealthBoardTrigger) => void;
  onOpenSoapModal: () => void;
  streakCount: number;
  onIncrementStreak: () => void;
  recoveryHabits?: DailyRecoveryHabits;
  onUpdateHabits?: (habits: DailyRecoveryHabits) => void;
  endoscopyPlan?: EndoscopyPlan;
  onNavigateToCalendar?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  language,
  onPinToCalendar,
  onAddToHealthBoard,
  onOpenSoapModal,
  streakCount,
  onIncrementStreak,
  recoveryHabits = INITIAL_HABITS,
  onUpdateHabits,
  endoscopyPlan = INITIAL_ENDOSCOPY_PLAN,
  onNavigateToCalendar,
}) => {
  const t = TRANSLATIONS[language].home;

  const [habitsState, setHabitsState] = useState<DailyRecoveryHabits>(recoveryHabits);
  const [habitsHistory, setHabitsHistory] = useState<DailyRecoveryHabits[]>([]);

  const toggleHabit = (key: keyof DailyRecoveryHabits) => {
    setHabitsHistory((prev) => [...prev, habitsState]);
    const updated = {
      ...habitsState,
      [key]: typeof habitsState[key] === 'boolean' ? !habitsState[key] : habitsState[key],
    };
    setHabitsState(updated);
    if (onUpdateHabits) onUpdateHabits(updated);
  };

  const handleHabitBack = () => {
    if (habitsHistory.length > 0) {
      const prevHabits = habitsHistory[habitsHistory.length - 1];
      setHabitsHistory((prev) => prev.slice(0, prev.length - 1));
      setHabitsState(prevHabits);
      if (onUpdateHabits) onUpdateHabits(prevHabits);
    } else {
      setHabitsState(INITIAL_HABITS);
      if (onUpdateHabits) onUpdateHabits(INITIAL_HABITS);
    }
  };

  // Carousel state (1 to 5 villi malabsorption nutrients)
  const [carouselIndex, setCarouselIndex] = useState(0);
  const currentCarousel = INITIAL_CAROUSEL_ITEMS[carouselIndex];

  // Check-in input state
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType>('menu_oatmilk');

  // Villi-Healing & Neurological Biometrics
  const [hoursSlept, setHoursSlept] = useState<number>(5);
  const [sugarIntake, setSugarIntake] = useState<'none' | 'low' | 'high'>('low');
  const [alcoholDrinks, setAlcoholDrinks] = useState<number>(0);

  // Neurological symptoms (1-10)
  const [burningFeet, setBurningFeet] = useState<number>(7);
  const [handTingling, setHandTingling] = useState<number>(8);
  const [tremorsAtaxia, setTremorsAtaxia] = useState<number>(6);
  const [rapidHeartbeat, setRapidHeartbeat] = useState<number>(8);
  const [jointPain, setJointPain] = useState<number>(5);

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

  // Carousel navigation
  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % INITIAL_CAROUSEL_ITEMS.length);
  };
  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + INITIAL_CAROUSEL_ITEMS.length) % INITIAL_CAROUSEL_ITEMS.length);
  };

  const handleCarouselAction = () => {
    if (currentCarousel.id === 5) {
      onOpenSoapModal();
    } else {
      onIncrementStreak();
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

    if (type === 'menu_oatmilk') {
      setSelectedImage(DEMO_ASSETS.oatMilkMenu);
      setImageName('Barista_Oat_Milk_Menu_Scan.jpg');
      setInputText('Had an iced oat milk latte at local café 16h ago. Woke up with intense burning feet and rapid heart rate.');
      setBurningFeet(8);
      setHandTingling(8);
      setRapidHeartbeat(9);
      setTremorsAtaxia(6);
      setHoursSlept(5);
    } else if (type === 'syrup_sauce') {
      setSelectedImage(DEMO_ASSETS.caramelSauce);
      setImageName('Artisan_Caramel_Syrup_Bottle.jpg');
      setInputText('Asked for caramel drizzle. Now experiencing finger tremors, ataxia, and severe brain fog.');
      setBurningFeet(6);
      setHandTingling(9);
      setTremorsAtaxia(8);
      setRapidHeartbeat(7);
      setSugarIntake('high');
    } else if (type === 'dish_restaurant') {
      setSelectedImage(DEMO_ASSETS.oatMilkMenu);
      setImageName('Restaurant_Sauce_Plate.jpg');
      setInputText('Ordered grilled salmon, but sauce tasted sweet like soy/teriyaki reduction. Knuckles and wrists throbbing.');
      setJointPain(8);
      setBurningFeet(7);
      setHandTingling(6);
    } else if (type === 'supplement_cosmetic') {
      setSelectedImage(DEMO_ASSETS.burningFeet);
      setImageName('Lip_Balm_Wheat_Germ_Label.jpg');
      setInputText('Checked lip balm ingredient list: found Triticum Vulgare (Wheat) Germ Oil. Burning lips and nausea.');
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
        prompt: inputText,
        actionType: activeAction,
        imageBase64: selectedImage || undefined,
        hoursSlept,
        sugarIntake,
        alcoholDrinks,
        burningFeet,
        handTingling,
        tremorsAtaxia,
        rapidHeartbeat,
        jointPain,
        language,
      });
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickQuestion = async (
    questionText: string,
    action: ActionType,
    image?: string,
    imgName?: string,
    symptoms?: { tremors?: number; tingling?: number; feet?: number; heart?: number }
  ) => {
    setInputText(questionText);
    setActiveAction(action);
    if (image) {
      setSelectedImage(image);
      setImageName(imgName || 'Sample.jpg');
    }
    const newTremors = symptoms?.tremors ?? tremorsAtaxia;
    const newTingling = symptoms?.tingling ?? handTingling;
    const newFeet = symptoms?.feet ?? burningFeet;
    const newHeart = symptoms?.heart ?? rapidHeartbeat;

    if (symptoms?.tremors !== undefined) setTremorsAtaxia(symptoms.tremors);
    if (symptoms?.tingling !== undefined) setHandTingling(symptoms.tingling);
    if (symptoms?.feet !== undefined) setBurningFeet(symptoms.feet);
    if (symptoms?.heart !== undefined) setRapidHeartbeat(symptoms.heart);

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setPinnedToCal(false);
    setAddedToBoard(false);

    try {
      const data = await analyzeTriggerApi({
        prompt: questionText,
        actionType: action,
        imageBase64: image || selectedImage || undefined,
        hoursSlept,
        sugarIntake,
        alcoholDrinks,
        burningFeet: newFeet,
        handTingling: newTingling,
        tremorsAtaxia: newTremors,
        rapidHeartbeat: newHeart,
        jointPain,
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
    const now = new Date();
    const todayNum = now.getDate();
    const todayDateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newDay: MarkedDay = {
      day: todayNum,
      dateStr: todayDateStr,
      title: analysisResult.calendarEventSuggestion?.title || 'Personal Health & Symptom Update',
      severity: analysisResult.riskScore || 7,
      type: 'neuropathy_spike',
      triggerDetails: analysisResult.compoundName || 'Health update',
      symptoms: [
        `Burning Feet: ${burningFeet}/10`,
        `Hand Tingling: ${handTingling}/10`,
        `Heart Rate: ${rapidHeartbeat > 7 ? 'Tachycardia Spike' : 'Monitored'}`,
      ],
      imageUrl: selectedImage || undefined,
      notes: analysisResult.concreteCorrelation || analysisResult.generalAdvice || 'Personal health check-in logged to calendar.',
      isNeurologicalCluster: true,
    };
    onPinToCalendar(newDay);
    setPinnedToCal(true);
  };

  const handleAddToBoard = () => {
    if (!analysisResult) return;
    const newTrigger: HealthBoardTrigger = {
      id: `trig-${Date.now()}`,
      name: analysisResult.healthBoardTag.name || analysisResult.compoundName,
      category: 'cross_contamination',
      riskBadge: analysisResult.healthBoardTag.riskBadge || `${analysisResult.riskLevel} (${analysisResult.riskScore}/10)`,
      notes: analysisResult.healthBoardTag.notes || analysisResult.concreteCorrelation || analysisResult.generalAdvice || '',
      dateAdded: 'Today',
    };
    onAddToHealthBoard(newTrigger);
    setAddedToBoard(true);
  };

  return (
    <div className="space-y-4 px-4 py-3">
      {/* 1. TOP CAROUSEL: 5 VILLI MALABSORPTION NUTRIENT CARDS */}
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
            title="Clinical Message & 8-Doctor-Proof SOAP Packet"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Purple Carousel Card matching mockup */}
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

            {/* Navigation Chevrons: Previous and Next */}
            <div className="flex items-center gap-1.5 self-center shrink-0">
              <button
                type="button"
                onClick={prevCarousel}
                className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/70 flex items-center justify-center text-slate-900 transition active:scale-95 cursor-pointer shadow-2xs"
                title="Previous card"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={nextCarousel}
                className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/70 flex items-center justify-center text-slate-900 transition active:scale-95 cursor-pointer shadow-2xs"
                title="Next card"
                aria-label="Next card"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
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

      {/* 2. "DAILY CHECK-IN & HIDDEN GLUTEN SCANNER" */}
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
          {/* 3 One-Tap Hidden Gluten & Inflammation Scan Buttons with Instant Demos */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center justify-between">
              <span className="uppercase tracking-wider font-extrabold text-[10px] text-purple-900">
                Hidden Gluten &amp; Inflammation Scanner:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
              <button
                onClick={() => loadDemoSample('menu_oatmilk')}
                className={`py-2 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition border cursor-pointer ${
                  activeAction === 'menu_oatmilk'
                    ? 'bg-[#E8DFF2] border-purple-400 text-purple-950 font-bold shadow-2xs'
                    : 'bg-[#F3EDF7]/60 border-transparent text-slate-600 hover:bg-[#F3EDF7]'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-purple-800 shadow-2xs">
                  ☕
                </div>
                <span className="text-[10px] leading-tight font-extrabold">Scan Coffee Shop / Menu</span>
                <span className="text-[8px] text-purple-700 font-bold">Demo: Oat Caramel Latte</span>
              </button>

              <button
                onClick={() => loadDemoSample('syrup_sauce')}
                className={`py-2 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition border cursor-pointer ${
                  activeAction === 'syrup_sauce'
                    ? 'bg-[#E8DFF2] border-purple-400 text-purple-950 font-bold shadow-2xs'
                    : 'bg-[#F3EDF7]/60 border-transparent text-slate-600 hover:bg-[#F3EDF7]'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-purple-800 shadow-2xs">
                  🍫
                </div>
                <span className="text-[10px] leading-tight font-extrabold">Scan Food / Supplement</span>
                <span className="text-[8px] text-purple-700 font-bold">Demo: Protein Bar &amp; Sauce</span>
              </button>

              <button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="py-2 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition border bg-[#F3EDF7]/60 border-transparent text-slate-600 hover:bg-[#F3EDF7] cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-purple-800 shadow-2xs">
                  📋
                </div>
                <span className="text-[10px] leading-tight font-extrabold">Upload After-Visit / Lab</span>
                <span className="text-[8px] text-purple-700 font-bold">PDF / JPG Note</span>
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
                  {imageName || 'Target Item Photo'}
                </p>
                <span className="text-[10px] text-slate-500">Ready for Hidden Gluten & Cross-Contamination OCR</span>
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

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Text Input Area with Quick Question Chips */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  handleQuickQuestion(
                    "Can I try this caramel syrup? What safe alternatives do you recommend?",
                    'syrup_sauce',
                    DEMO_ASSETS.caramelSauce,
                    'Caramel_Syrup_Bottle.jpg'
                  );
                }}
                className="text-[10px] font-bold bg-[#EAE06D]/70 hover:bg-[#EAE06D] text-slate-900 px-3 py-1.5 rounded-full transition border border-yellow-300 shadow-2xs text-left cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>☕</span>
                <span>&ldquo;Can I try this syrup? What safe alternatives do you recommend?&rdquo;</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleQuickQuestion(
                    "I'm having burning feet, tingling hands, and heart racing right now. What should I do?",
                    'checkin',
                    undefined,
                    undefined,
                    { tremors: 8, tingling: 8, feet: 8, heart: 8 }
                  );
                }}
                className="text-[10px] font-bold bg-[#E8DFF2] hover:bg-purple-200 text-purple-950 px-3 py-1.5 rounded-full transition border border-purple-300/80 shadow-2xs text-left cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>⚡</span>
                <span>&ldquo;Having burning feet &amp; tremors right now... what should I do?&rdquo;</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleQuickQuestion(
                    "Ordering an oat latte at café — what should I ask the barista?",
                    'menu_oatmilk',
                    DEMO_ASSETS.oatMilkMenu,
                    'Barista_Oat_Milk_Menu_Scan.jpg'
                  );
                }}
                className="text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 px-3 py-1.5 rounded-full transition border border-amber-300 shadow-2xs text-left cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>💬</span>
                <span>&ldquo;Ordering oat latte — what to ask barista?&rdquo;</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToCalendar?.()}
                className="text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded-full transition border border-slate-300 shadow-2xs text-left cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>🥑</span>
                <span>+ Log what I ate today into Calendar</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAnalyze();
                  }
                }}
                placeholder={t.placeholder}
                rows={3}
                className="w-full bg-[#F3EDF7]/60 focus:bg-white rounded-2xl p-3 text-xs text-slate-800 placeholder:text-slate-400 border border-transparent focus:border-purple-300 outline-none transition resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Action Row: Camera/Upload, Purple Mic, Yellow Send Button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-[#F3EDF7] hover:bg-purple-100 px-2.5 py-1.5 rounded-full transition"
                title="Upload real menu / item photo"
              >
                <Camera className="w-3.5 h-3.5 text-purple-700" />
                <span>Upload</span>
              </button>

              <button
                onClick={() => loadDemoSample('menu_oatmilk')}
                className="text-[11px] font-bold text-purple-900 bg-[#E8DFF2] hover:bg-purple-200 px-2.5 py-1.5 rounded-full transition"
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
            Cross-referencing shared mill lines, steam wand froth, and small fiber neuropathy markers.
          </p>
        </div>
      )}

      {/* 3. INSTANT ACTIONABLE AI OUTPUT */}
      {analysisResult && (() => {
        const queryLower = (inputText || '').toLowerCase();

        // Is user asking about a symptom rather than a specific item?
        const isPureSymptomQuery =
          (queryLower.includes('symptom') ||
            queryLower.includes('what to do') ||
            queryLower.includes('what should i do') ||
            queryLower.includes('having this') ||
            queryLower.includes('feel') ||
            queryLower.includes('flare') ||
            queryLower.includes('hurts') ||
            queryLower.includes('burning') ||
            queryLower.includes('tingling')) &&
          !selectedImage &&
          !queryLower.includes('syrup') &&
          !queryLower.includes('oat') &&
          !queryLower.includes('bread') &&
          !queryLower.includes('caramel') &&
          !queryLower.includes('milk') &&
          !queryLower.includes('latte') &&
          !queryLower.includes('barista');

        // Is user talking about their health / personal symptoms / body check-in?
        // "ensure nily when ur tlaking about ur health/personal things, then it says save updates to calendar?"
        const isHealthOrPersonalQuery =
          isPureSymptomQuery ||
          activeAction === 'checkin' ||
          queryLower.includes('health') ||
          queryLower.includes('symptom') ||
          queryLower.includes('body') ||
          queryLower.includes('mood') ||
          queryLower.includes('sleep') ||
          queryLower.includes('pain') ||
          queryLower.includes('nerve') ||
          queryLower.includes('neuropathy') ||
          queryLower.includes('tingling') ||
          queryLower.includes('burning') ||
          queryLower.includes('heart') ||
          queryLower.includes('beat') ||
          queryLower.includes('tired') ||
          queryLower.includes('fatigue') ||
          queryLower.includes('flare') ||
          queryLower.includes('feel') ||
          queryLower.includes('hurts') ||
          queryLower.includes('personal') ||
          queryLower.includes('anxiety') ||
          queryLower.includes('brain fog') ||
          queryLower.includes('ataxia') ||
          queryLower.includes('tremor');

        // Card 1: What to know about this item
        // "What to know about this item --> only pull up if someone is ASKING abotu the item, otherwise have LLM use the adfice and just genratle things. 
        // ex: if someoe asks having this symypl what to do? DONT pull up food informaiton"
        const showItemCard =
          analysisResult.isItemSpecific !== false &&
          !isPureSymptomQuery &&
          Boolean(analysisResult.crossContaminationTraps && analysisResult.crossContaminationTraps.trim().length > 0);

        // Card 2: WHAT TO ASK THE BARISTA OR SERVER
        // Only pull up if asking about dining out / café / barista / server / ordering / meal
        const showBaristaCard =
          analysisResult.showBaristaQuestion ??
          (!isPureSymptomQuery &&
            (queryLower.includes('barista') ||
              queryLower.includes('server') ||
              queryLower.includes('waiter') ||
              queryLower.includes('chef') ||
              queryLower.includes('order') ||
              queryLower.includes('café') ||
              queryLower.includes('restaurant') ||
              queryLower.includes('menu') ||
              queryLower.includes('latte') ||
              queryLower.includes('ask') ||
              activeAction === 'menu_oatmilk' ||
              activeAction === 'syrup_sauce' ||
              activeAction === 'dish_restaurant'));

        // Card 3: SAFE ALTERNATIVES TO ORDER INSTEAD
        // "SAFE ALTERNATIVES TO ORDER INSTEAD -> only need with food if ASKING for altneratives! want this to be SMART LLM"
        const asksAlternatives =
          analysisResult.showSafeAlternatives ??
          (queryLower.includes('alternative') ||
            queryLower.includes('instead') ||
            queryLower.includes('swap') ||
            queryLower.includes('substitute') ||
            queryLower.includes('recommend'));

        const showSafeAlternativesCard =
          asksAlternatives &&
          !isPureSymptomQuery &&
          Boolean(analysisResult.safeAlternatives && analysisResult.safeAlternatives.length > 0);

        // Advocacy question text
        const questionText =
          analysisResult.exactQuestionToAsk?.[language] ||
          analysisResult.exactQuestionToAsk?.en ||
          'I have Celiac Disease and severe nerve sensitivity; can you confirm this meal is made with fresh ingredients in clean pans with zero gluten or shared toaster/fryer contact?';

        // Comforting advice / general guidance
        const clinicalAdvice =
          analysisResult.generalAdvice ||
          (isPureSymptomQuery
            ? 'Avoid processed GF snack foods or takeout fryers today; even trace gluten or hidden malt extract can worsen intestinal inflammation and prolong your nerve flare. Your nervous system is overly sensitized and needs gentle, steady energy and mineral replenishment.'
            : analysisResult.clinicalMechanism);

        return (
          <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-[#B6A1DA] space-y-3 transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-purple-100 pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                    {isPureSymptomQuery ? 'CLINICAL GUIDANCE' : t.actionCardTitle}
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

            {/* CARD: WHAT TO ASK THE BARISTA OR SERVER */}
            {showBaristaCard && (
              <div className="bg-[#EAE06D]/30 border-2 border-[#EAE06D] rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-800 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-800" />
                    <span>WHAT TO ASK THE BARISTA OR SERVER:</span>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(questionText);
                      setCopiedQuestion(true);
                      setTimeout(() => setCopiedQuestion(false), 2000);
                    }}
                    className="bg-white text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full border border-yellow-300 shadow-2xs hover:bg-yellow-50 flex items-center gap-1 transition cursor-pointer active:scale-95"
                  >
                    {copiedQuestion ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedQuestion ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-900 font-bold font-serif italic leading-relaxed">
                  {questionText}
                </p>
              </div>
            )}

            {/* CARD: What to know about this item (ONLY when asking about the item, NEVER for symptom queries) */}
            {showItemCard && (
              <div className="bg-[#F3EDF7] rounded-2xl p-3 border border-purple-200/70 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-purple-900 block">
                  What to know about this item
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {analysisResult.crossContaminationTraps}
                </p>
              </div>
            )}

            {/* Note: "Sheila's Food Log Cross-Check" card has been completely removed as requested! */}

            {/* CARD: Clinical Guidance & Recovery Advice (General LLM advice for symptom relief or context) */}
            {clinicalAdvice && (
              <div className="bg-[#F3EDF7] rounded-2xl p-3.5 border border-purple-200/80 space-y-1.5">
                <div className="text-[10px] font-extrabold uppercase text-purple-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                  <span>Clinical Guidance &amp; Recovery Advice</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {clinicalAdvice}
                </p>
              </div>
            )}

            {/* CARD: SAFE ALTERNATIVES TO ORDER INSTEAD (ONLY when food-related AND asking for alternatives) */}
            {showSafeAlternativesCard && analysisResult.safeAlternatives && analysisResult.safeAlternatives.length > 0 && (
              <div className="bg-emerald-50/90 rounded-2xl p-3.5 border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>SAFE ALTERNATIVES TO ORDER INSTEAD</span>
                  </span>
                  <span className="text-[9px] bg-emerald-200/80 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full">
                    100% Gluten-Free
                  </span>
                </div>
                <ul className="text-xs text-slate-800 space-y-2 font-medium pl-0.5">
                  {analysisResult.safeAlternatives.map((alt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CARD: Steps to feel better right now */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/70 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
                  Steps to feel better right now
                </span>
                <ul className="text-xs text-slate-800 space-y-1.5">
                  {analysisResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-snug">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons: Only show "Save updates to calendar" when talking about health/personal things */}
            <div className={`pt-2 grid gap-2 ${isHealthOrPersonalQuery ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Only shown when user is discussing health or personal symptoms */}
              {isHealthOrPersonalQuery && (
                <button
                  onClick={handlePinCalendar}
                  disabled={pinnedToCal}
                  className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                    pinnedToCal
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#B6A1DA] hover:bg-purple-300 text-slate-900 active:scale-98'
                  }`}
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>
                    {pinnedToCal
                      ? '✓ Saved updates to calendar'
                      : '+ Save updates to calendar'}
                  </span>
                </button>
              )}

              <button
                onClick={handleAddToBoard}
                disabled={addedToBoard}
                className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                  addedToBoard
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 active:scale-98'
                }`}
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>
                  {addedToBoard
                    ? '✓ Saved to Health Board'
                    : isHealthOrPersonalQuery
                    ? '+ Save to Health Board'
                    : '+ Save Safe Swap to Board'}
                </span>
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
