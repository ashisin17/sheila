import React, { useState } from 'react';
import {
  User,
  Heart,
  Pill,
  Phone,
  Shield,
  Sparkles,
  Share2,
  Edit3,
  Plus,
  Flame,
  Check,
  FileText,
  AlertCircle,
  ExternalLink,
  ChefHat,
  UtensilsCrossed,
  ShieldAlert,
  Zap,
  Info,
} from 'lucide-react';
import { UserProfile, Language, HealthBoardTrigger, UserCollection } from '../types';
import { TRANSLATIONS } from '../data/initialData';

interface YouTabProps {
  language: Language;
  userProfile: UserProfile;
  onOpenSoapModal: () => void;
  onOpenEditModal: () => void;
  onOpenPassportModal: () => void;
  streakCount: number;
  onIncrementStreak: () => void;
  collections?: UserCollection[];
  onSelectCollection?: (collection: UserCollection) => void;
}

export const YouTab: React.FC<YouTabProps> = ({
  language,
  userProfile,
  onOpenSoapModal,
  onOpenEditModal,
  onOpenPassportModal,
  streakCount,
  onIncrementStreak,
  collections = [],
  onSelectCollection,
}) => {
  const t = TRANSLATIONS[language].you;
  const [markedTaken, setMarkedTaken] = useState(false);
  const [showChefModal, setShowChefModal] = useState(false);
  const [showFlareProtocolModal, setShowFlareProtocolModal] = useState(false);
  const [chefCardLang, setChefCardLang] = useState<'en' | 'es' | 'zh'>(language);

  const handleTakeMed = () => {
    onIncrementStreak();
    setMarkedTaken(true);
    setTimeout(() => setMarkedTaken(false), 2500);
  };

  return (
    <div className="space-y-4 px-4 py-3">
      {/* 1. Header */}
      <div className="px-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          YOUR HEALTH BOARD
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          {userProfile.name}, {userProfile.age}
        </h2>
      </div>

      {/* 2. 2x2 BENTO GRID MATCHING MOCKUP PIXEL FOR PIXEL */}
      <div className="grid grid-cols-2 gap-3">
        {/* CARD 1 (Top-Left): Butter Yellow "MY CARE / Primary provider" */}
        <div
          onClick={onOpenSoapModal}
          className="bg-[#EAE06D] rounded-3xl p-4 text-slate-900 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition flex flex-col justify-between min-h-[145px]"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800/80 block">
              MY CARE
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              Primary provider
            </h4>
          </div>
          <div className="mt-2 text-xs">
            <p className="font-bold text-slate-900 leading-tight">Dr. Jordan Lee</p>
            <p className="text-[11px] text-slate-700 font-medium">Wellness Clinic</p>
          </div>
        </div>

        {/* CARD 2 (Top-Right): Crisp White "IMPORTANT / Allergies" */}
        <div className="bg-white rounded-3xl p-4 text-slate-900 shadow-sm border border-purple-100/70 flex flex-col justify-between min-h-[145px]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              IMPORTANT
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              Allergies
            </h4>
          </div>
          <div className="mt-2 text-xs space-y-0.5">
            <p className="text-slate-800 font-bold text-xs">Penicillin</p>
            <p className="text-slate-600 font-medium text-[11px]">Seasonal pollen</p>
            <p className="text-rose-700 font-extrabold text-[10px]">Strict Gluten / Celiac</p>
          </div>
        </div>

        {/* CARD 3 (Bottom-Left): Soft Lavender "DAILY / Medications" */}
        <div className="bg-[#E8DFF2] rounded-3xl p-4 text-slate-900 shadow-sm border border-purple-200/60 flex flex-col justify-between min-h-[145px]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-900/80 block">
              DAILY
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              Medications
            </h4>
          </div>
          <div className="mt-2 text-xs space-y-0.5">
            <p className="font-bold text-slate-900 text-xs">Vitamin D</p>
            <p className="text-[11px] text-slate-700 font-medium">Take with breakfast</p>
            <button
              onClick={handleTakeMed}
              className={`mt-1.5 text-[9px] font-extrabold py-0.5 px-2 rounded-lg transition inline-flex items-center gap-1 ${
                markedTaken
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-purple-900 border border-purple-200 shadow-2xs'
              }`}
            >
              {markedTaken ? '✓ Taken' : 'Tap to log'}
            </button>
          </div>
        </div>

        {/* CARD 4 (Bottom-Right): Butter Yellow "CONTACT / Emergency" */}
        <div className="bg-[#EAE06D] rounded-3xl p-4 text-slate-900 shadow-sm flex flex-col justify-between min-h-[145px]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800/80 block">
              CONTACT
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              Emergency
            </h4>
          </div>
          <div className="mt-2 text-xs">
            <p className="font-bold text-slate-900 text-xs">Jamie R.</p>
            <a
              href="tel:5550140231"
              className="text-[11px] text-slate-800 font-semibold underline block"
            >
              (555) 014-0231
            </a>
          </div>
        </div>
      </div>

      {/* 3. YOUR COLLECTIONS (Matching Screenshot exactly!) */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
          YOUR COLLECTIONS
        </span>

        <div className="grid grid-cols-2 gap-3">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => onSelectCollection?.(col)}
              className="bg-white hover:bg-slate-50 border border-purple-100/80 rounded-3xl p-4 text-left shadow-sm transition hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between min-h-[110px] cursor-pointer"
            >
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <span>COLLECTION</span>
                  <FileText className="w-2.5 h-2.5" />
                </span>
                <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                  {col.title}
                </h4>
              </div>

              <div className="text-[10px] text-slate-500 font-medium">
                <p>{col.daysSaved} days saved</p>
                <p className="text-slate-400 text-[9px]">Last: {col.lastDate}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. SHOPPING LIST (Matching Screenshot exactly!) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            SHOPPING LIST 1 of 4
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            Based on your data
          </span>
        </div>

        <div className="bg-[#B6A1DA] hover:bg-purple-300 rounded-3xl p-4 text-slate-900 shadow-sm flex items-center justify-between cursor-pointer transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/40 flex items-center justify-center text-slate-900 font-bold text-lg">
              🍞
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-950/80 block">
                FOR YOUR DIET
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                Gluten-free bread
              </h4>
            </div>
          </div>
          <span className="text-lg font-bold text-slate-900">&gt;</span>
        </div>
      </div>

      {/* 5. Chef Card & Actions */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => setShowChefModal(true)}
          className="w-full bg-white hover:bg-slate-50 text-purple-950 text-xs font-extrabold py-3 px-4 rounded-full border border-purple-200 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <ChefHat className="w-4 h-4 text-purple-700" />
          <span>Show Chef / Barista Celiac Safety Card</span>
        </button>

        <button
          onClick={onOpenEditModal}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-2.5 px-4 rounded-full border border-slate-300 shadow-2xs transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>Edit Your Information</span>
        </button>

        <button
          onClick={onOpenPassportModal}
          className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold py-3 px-4 rounded-full shadow-xs transition text-xs flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-900" />
          <span>Export Health Passport</span>
        </button>
      </div>

      {/* MODAL 1: BILINGUAL "SHOW TO CHEF / BARISTA CARD" */}
      {showChefModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border-4 border-[#B6A1DA] overflow-hidden my-auto p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-[#EAE06D] flex items-center justify-center text-slate-900 font-black">
                  <ChefHat className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
                    Restaurant & Café Safety Card
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                    Show Directly to Chef / Barista
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowChefModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Language toggle for the card */}
            <div className="flex justify-center gap-1 bg-[#F3EDF7] p-1 rounded-full text-xs font-bold">
              <button
                onClick={() => setChefCardLang('en')}
                className={`px-3 py-1 rounded-full ${
                  chefCardLang === 'en' ? 'bg-[#EAE06D] text-slate-900' : 'text-slate-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setChefCardLang('es')}
                className={`px-3 py-1 rounded-full ${
                  chefCardLang === 'es' ? 'bg-[#EAE06D] text-slate-900' : 'text-slate-600'
                }`}
              >
                Español
              </button>
              <button
                onClick={() => setChefCardLang('zh')}
                className={`px-3 py-1 rounded-full ${
                  chefCardLang === 'zh' ? 'bg-[#EAE06D] text-slate-900' : 'text-slate-600'
                }`}
              >
                中文 (Chinese)
              </button>
            </div>

            {/* The High-Contrast Visual Card */}
            <div className="bg-[#EAE06D]/30 border-2 border-[#EAE06D] rounded-2xl p-4 space-y-2">
              <div className="text-[11px] font-black text-rose-800 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-700" />
                <span>Medical Celiac Alert (Not a Diet Preference)</span>
              </div>
              <p className="text-sm text-slate-900 font-bold font-serif leading-relaxed italic">
                {userProfile.chefBaristaCard[chefCardLang] || userProfile.chefBaristaCard.en}
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(userProfile.chefBaristaCard[chefCardLang]);
                alert('Card text copied to clipboard!');
              }}
              className="w-full bg-[#B6A1DA] hover:bg-purple-300 text-slate-900 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5"
            >
              <span>Copy Translation to Show on Phone</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: ACCIDENTAL GLUTEN EXPOSURE & FLARE PROTOCOL */}
      {showFlareProtocolModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border-4 border-rose-300 overflow-hidden my-auto p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-800">
                    Emergency Flare Protocol
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                    Accidental Gluten Exposure Action
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowFlareProtocolModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-800">
              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200">
                <strong className="text-rose-950 block mb-0.5">Step 1: Immediate Cytokine Flush</strong>
                <p className="leading-relaxed">{userProfile.flareProtocol.step1}</p>
              </div>

              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
                <strong className="text-purple-950 block mb-0.5">Step 2: Sublingual Nerve Shielding</strong>
                <p className="leading-relaxed">{userProfile.flareProtocol.step2}</p>
              </div>

              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200">
                <strong className="text-blue-950 block mb-0.5">Step 3: Vagus Nerve & Tachycardia Protocol</strong>
                <p className="leading-relaxed">{userProfile.flareProtocol.step3}</p>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-[11px] text-amber-950">
                <strong>⚠️ Tachycardia Warning:</strong> {userProfile.flareProtocol.tachycardiaNote}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span>Emergency Contact: <strong>{userProfile.emergencyContact.name}</strong></span>
              <a
                href={`tel:${userProfile.emergencyContact.phone.replace(/[^0-9]/g, '')}`}
                className="bg-[#EAE06D] text-slate-900 px-3 py-1.5 rounded-full font-bold shadow-2xs"
              >
                Call Emergency
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
