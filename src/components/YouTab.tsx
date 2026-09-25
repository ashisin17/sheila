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
      {/* 1. Header matching mockup */}
      <div className="px-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          {t.healthBoard}
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          {userProfile.name}, {userProfile.age}
        </h2>
      </div>

      {/* 2. 2x2 BENTO GRID MATCHING MOCKUP PIXEL FOR PIXEL */}
      <div className="grid grid-cols-2 gap-3">
        {/* CARD 1 (Top-Left): Butter Yellow "MY CARE" */}
        <div
          onClick={onOpenSoapModal}
          className="bg-[#EAE06D] rounded-3xl p-4 text-slate-900 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition flex flex-col justify-between min-h-[145px]"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800/80 block">
              {t.myCare}
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              {t.primaryProvider}
            </h4>
          </div>
          <div className="mt-2 text-xs">
            <p className="font-bold text-slate-900">{userProfile.primaryProvider}</p>
            <p className="text-[11px] text-slate-800 font-medium">{userProfile.clinic}</p>
            <span className="text-[10px] text-purple-900 font-bold mt-1 inline-flex items-center gap-0.5">
              <span>View Shared SOAP</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* CARD 2 (Top-Right): Crisp White "IMPORTANT: Allergies & AI Triggers" */}
        <div className="bg-white rounded-3xl p-4 text-slate-900 shadow-sm border border-purple-100/70 flex flex-col justify-between min-h-[145px]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {t.important}
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              Allergies & Triggers
            </h4>
          </div>

          <div className="mt-2 space-y-1 text-xs">
            {/* Standard allergies */}
            {userProfile.allergies.map((all, i) => (
              <p key={i} className="text-slate-700 font-semibold text-[11px]">
                {all}
              </p>
            ))}

            {/* AI-flagged triggers */}
            {userProfile.pinnedTriggers.map((trig) => (
              <div key={trig.id} className="pt-0.5">
                <span className="inline-block text-[9px] font-black px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-950 border border-purple-200 truncate max-w-full">
                  ⚡ {trig.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3 (Bottom-Left): Soft Lavender "DAILY: Medications" */}
        <div className="bg-[#E8DFF2] rounded-3xl p-4 text-slate-900 shadow-sm border border-purple-200/60 flex flex-col justify-between min-h-[145px]">
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

          <div className="mt-2 text-xs">
            <p className="font-bold text-slate-900">
              {userProfile.medications[0]?.name || 'Vitamin D'}
            </p>
            <p className="text-[11px] text-slate-600 font-medium">
              {userProfile.medications[0]?.instruction || t.takeWithBreakfast}
            </p>
            <button
              onClick={handleTakeMed}
              className={`mt-2 text-[10px] font-bold px-2 py-1 rounded-full transition flex items-center gap-1 ${
                markedTaken
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/80 hover:bg-white text-purple-950 border border-purple-200 shadow-2xs'
              }`}
            >
              {markedTaken ? <Check className="w-2.5 h-2.5" /> : <Flame className="w-2.5 h-2.5 text-amber-500" />}
              <span>{markedTaken ? 'Taken Tonight!' : 'Log Daily Dose'}</span>
            </button>
          </div>
        </div>

        {/* CARD 4 (Bottom-Right): Butter Yellow "CONTACT: Emergency" */}
        <div className="bg-[#EAE06D] rounded-3xl p-4 text-slate-900 shadow-sm flex flex-col justify-between min-h-[145px]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800/80 block">
              {t.contact}
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
              {t.emergency}
            </h4>
          </div>

          <div className="mt-2 text-xs">
            <p className="font-bold text-slate-900">{userProfile.emergencyContact.name}</p>
            <a
              href={`tel:${userProfile.emergencyContact.phone.replace(/[^0-9]/g, '')}`}
              className="text-[11px] text-slate-800 font-medium underline flex items-center gap-1 mt-0.5"
            >
              <Phone className="w-3 h-3 text-slate-900" />
              <span>{userProfile.emergencyContact.phone}</span>
            </a>
            <span className="text-[10px] text-slate-700 block mt-0.5">
              {userProfile.emergencyContact.relationship}
            </span>
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
              AI-Detected Offending Compounds ({userProfile.pinnedTriggers.length})
            </span>
            <span className="text-[10px] text-purple-700">Synced with Home Scans</span>
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
        {/* White button matching mockup */}
        <button
          onClick={onOpenEditModal}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-full border border-slate-300 shadow-xs transition text-xs flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.editInfo}</span>
        </button>

        {/* Yellow Action Button: "Export Patient Advocacy Passport (PDF/Share)" */}
        <button
          onClick={onOpenPassportModal}
          className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold py-3.5 px-4 rounded-full shadow-xs transition text-xs flex items-center justify-center gap-2 active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-slate-900" />
          <span>{t.exportPassport}</span>
        </button>
      </div>
    </div>
  );
};
