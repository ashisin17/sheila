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
import { UserProfile, Language, HealthBoardTrigger } from '../types';
import { TRANSLATIONS } from '../data/initialData';
import { GoogleAccountCard, GoogleAccountState } from './GoogleAccountCard';

interface YouTabProps {
  language: Language;
  userProfile: UserProfile;
  onOpenSoapModal: () => void;
  onOpenEditModal: () => void;
  onOpenPassportModal: () => void;
  streakCount: number;
  onIncrementStreak: () => void;
  googleAccount?: GoogleAccountState;
  onConnectGoogle?: () => void;
  onDisconnectGoogle?: () => void;
  onToggleCalendarSync?: (enabled: boolean) => void;
  onToggleCloudBackup?: (enabled: boolean) => void;
}

export const YouTab: React.FC<YouTabProps> = ({
  language,
  userProfile,
  onOpenSoapModal,
  onOpenEditModal,
  onOpenPassportModal,
  streakCount,
  onIncrementStreak,
  googleAccount,
  onConnectGoogle,
  onDisconnectGoogle,
  onToggleCalendarSync,
  onToggleCloudBackup,
}) => {
  const t = TRANSLATIONS[language].you;
  const [markedTaken, setMarkedTaken] = useState(false);
  const [showChefModal, setShowChefModal] = useState(false);
  const [showFlareProtocolModal, setShowFlareProtocolModal] = useState(false);
  const [chefCardLang, setChefCardLang] = useState<'en' | 'es' | 'zh'>(language);

  // Local fallback state if not passed from parent
  const [localAccount, setLocalAccount] = useState<GoogleAccountState>({
    isConnected: false,
    email: 'maya.health@gmail.com',
    name: 'Maya Lin',
    syncCalendar: true,
    cloudBackup: true,
  });

  const activeAccount = googleAccount || localAccount;

  const handleConnect = () => {
    if (onConnectGoogle) {
      onConnectGoogle();
    } else {
      setLocalAccount((prev) => ({
        ...prev,
        isConnected: true,
        email: 'maya.health@gmail.com',
        name: 'Maya Lin',
      }));
    }
  };

  const handleDisconnect = () => {
    if (onDisconnectGoogle) {
      onDisconnectGoogle();
    } else {
      setLocalAccount((prev) => ({
        ...prev,
        isConnected: false,
      }));
    }
  };

  const handleToggleCal = (enabled: boolean) => {
    if (onToggleCalendarSync) {
      onToggleCalendarSync(enabled);
    } else {
      setLocalAccount((prev) => ({ ...prev, syncCalendar: enabled }));
    }
  };

  const handleToggleBackup = (enabled: boolean) => {
    if (onToggleCloudBackup) {
      onToggleCloudBackup(enabled);
    } else {
      setLocalAccount((prev) => ({ ...prev, cloudBackup: enabled }));
    }
  };

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
          {t.healthBoard}
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          {userProfile.name}, {userProfile.age}
        </h2>
      </div>

      {/* 2. 2x2 BENTO GRID SOLVING CELIAC PAIN POINTS */}
      <div className="grid grid-cols-2 gap-3">
        {/* CARD 1 (Top-Left): Butter Yellow "MY CARE & VILLI HEALING STAGE" */}
        <div
          onClick={onOpenSoapModal}
          className="bg-[#EAE06D] rounded-3xl p-4 text-slate-900 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition flex flex-col justify-between min-h-[155px]"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800/80 block">
                {t.myCare}
              </span>
              <span className="text-[9px] bg-white/80 text-purple-950 font-black px-1.5 py-0.5 rounded-full">
                Stage 2 Re-growth
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              {t.primaryProvider}
            </h4>
          </div>
          <div className="mt-2 text-xs">
            <p className="font-bold text-slate-900 leading-tight">{userProfile.primaryProvider}</p>
            <div className="mt-1.5 bg-white/70 p-1.5 rounded-xl border border-yellow-300">
              <span className="text-[10px] font-black text-purple-950 block">
                🌱 Villi Healing Streak:
              </span>
              <span className="text-[11px] font-extrabold text-slate-900">
                {userProfile.villiRecoveryDays} Days 100% Gluten-Free
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2 (Top-Right): Crisp White "STRICT CELIAC & INFLAMMATORY TRIGGERS" */}
        <div className="bg-white rounded-3xl p-4 text-slate-900 shadow-sm border border-purple-100/70 flex flex-col justify-between min-h-[155px]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {t.important}
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              Strict Celiac Triggers
            </h4>
          </div>

          <div className="mt-2 space-y-1 text-xs">
            <p className="text-rose-700 font-extrabold text-[11px]">
              • Cross-Contamination (Steam wands, shared toasters)
            </p>
            <p className="text-slate-700 font-semibold text-[10px]">
              • Barley Malt, Rye & Wheat Germ Oil
            </p>
            <p className="text-slate-600 font-semibold text-[10px]">
              • Alcohol + High Sugar (Neuropathy Triggers)
            </p>

            {/* Prominent "Show to Chef / Barista Card" Button */}
            <button
              onClick={() => setShowChefModal(true)}
              className="mt-2 w-full bg-[#E8DFF2] hover:bg-purple-200 text-purple-950 text-[10px] font-black py-1.5 px-2 rounded-xl transition flex items-center justify-center gap-1 border border-purple-300/80 shadow-2xs"
            >
              <ChefHat className="w-3 h-3 text-purple-800" />
              <span>{t.showChefCard}</span>
            </button>
          </div>
        </div>

        {/* CARD 3 (Bottom-Left): Soft Lavender "MALABSORPTION REPLENISHMENT (DAILY MEDS)" */}
        <div className="bg-[#E8DFF2] rounded-3xl p-4 text-slate-900 shadow-sm border border-purple-200/60 flex flex-col justify-between min-h-[155px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900/80 block">
                {t.daily}
              </span>
              <span className="text-[10px] font-black text-purple-950 flex items-center gap-0.5">
                <span>🔥</span>
                <span>{streakCount}d streak</span>
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              {t.medications}
            </h4>
          </div>

          <div className="mt-1.5 text-xs space-y-1">
            <div className="bg-white/80 p-1.5 rounded-xl border border-purple-100">
              <p className="font-extrabold text-slate-900 text-[11px]">
                Sublingual B12 (1000mcg) + D3 + Iron
              </p>
              <p className="text-[9px] text-purple-900 font-semibold mt-0.5 leading-tight">
                Rebuilding reserves while damaged villi regenerate
              </p>
            </div>
            <button
              onClick={handleTakeMed}
              className={`w-full text-[10px] font-bold py-1 px-2 rounded-xl transition flex items-center justify-center gap-1 ${
                markedTaken
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white hover:bg-slate-50 text-purple-950 border border-purple-200 shadow-2xs'
              }`}
            >
              {markedTaken ? <Check className="w-2.5 h-2.5" /> : <Flame className="w-2.5 h-2.5 text-amber-500" />}
              <span>{markedTaken ? 'Taken Today!' : 'Log Replenishment'}</span>
            </button>
          </div>
        </div>

        {/* CARD 4 (Bottom-Right): Butter Yellow "EMERGENCY & ACCIDENTAL EXPOSURE PROTOCOL" */}
        <div className="bg-[#EAE06D] rounded-3xl p-4 text-slate-900 shadow-sm flex flex-col justify-between min-h-[155px]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800/80 block">
              {t.contact}
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              Emergency & Flare
            </h4>
          </div>

          <div className="mt-1.5 text-xs space-y-1.5">
            <div>
              <p className="font-bold text-slate-900">{userProfile.emergencyContact.name}</p>
              <a
                href={`tel:${userProfile.emergencyContact.phone.replace(/[^0-9]/g, '')}`}
                className="text-[11px] text-slate-800 font-medium underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-slate-900" />
                <span>{userProfile.emergencyContact.phone}</span>
              </a>
            </div>

            <button
              onClick={() => setShowFlareProtocolModal(true)}
              className="w-full bg-white hover:bg-yellow-50 text-slate-900 text-[10px] font-extrabold py-1.5 px-2 rounded-xl border border-yellow-400 shadow-2xs flex items-center justify-center gap-1"
            >
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              <span>Gluten Flare Protocol</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. GOOGLE ACCOUNT CONNECTION & CLOUD SYNC CARD */}
      <GoogleAccountCard
        account={activeAccount}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onToggleCalendarSync={handleToggleCal}
        onToggleCloudBackup={handleToggleBackup}
      />

      {/* Pinned Flare Triggers Detail Box */}
      {userProfile.pinnedTriggers.length > 0 && (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-purple-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="text-[10px] uppercase font-extrabold text-purple-900 tracking-wider">
              AI-Detected Cross-Contamination & Hidden Traps ({userProfile.pinnedTriggers.length})
            </span>
            <span className="text-[10px] text-purple-700">Synced from Home Scans</span>
          </div>

          <div className="space-y-1.5">
            {userProfile.pinnedTriggers.map((trig) => (
              <div
                key={trig.id}
                className="bg-[#F3EDF7] rounded-2xl p-2.5 border border-purple-200/70 flex items-start justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-xs">{trig.name}</span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                      {trig.riskBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-0.5 leading-tight">{trig.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Bottom Actions */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onOpenEditModal}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-full border border-slate-300 shadow-xs transition text-xs flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.editInfo}</span>
        </button>

        <button
          onClick={onOpenPassportModal}
          className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold py-3.5 px-4 rounded-full shadow-xs transition text-xs flex items-center justify-center gap-2 active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-slate-900" />
          <span>{t.exportPassport}</span>
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
