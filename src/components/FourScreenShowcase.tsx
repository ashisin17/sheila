import React from 'react';
import { Download, Play } from 'lucide-react';
import { Language, MarkedDay, UserProfile, Provider, BillAuditResult, HealthBoardTrigger } from '../types';
import { HomeTab } from './HomeTab';
import { CalendarTab } from './CalendarTab';
import { ProvidersTab } from './ProvidersTab';
import { YouTab } from './YouTab';
import { BottomNav } from './BottomNav';

interface FourScreenShowcaseProps {
  language: Language;
  markedDays: MarkedDay[];
  userProfile: UserProfile;
  streakCount: number;
  onIncrementStreak: () => void;
  onPinToCalendar: (day: MarkedDay) => void;
  onAddToHealthBoard: (trigger: HealthBoardTrigger) => void;
  onOpenSoapModal: () => void;
  onOpenBookingModal: (provider: Provider) => void;
  onOpenBillAuditModal: (audit: BillAuditResult) => void;
  onOpenEditModal: () => void;
  onOpenPassportModal: () => void;
  onNavigateToProviders: (cptCodeFilter?: string) => void;
  selectedCptFilter?: string;
  onClearCptFilter?: () => void;
}

export const FourScreenShowcase: React.FC<FourScreenShowcaseProps> = (props) => {
  const {
    language,
    markedDays,
    userProfile,
    streakCount,
    onIncrementStreak,
    onPinToCalendar,
    onAddToHealthBoard,
    onOpenSoapModal,
    onOpenBookingModal,
    onOpenBillAuditModal,
    onOpenEditModal,
    onOpenPassportModal,
    onNavigateToProviders,
    selectedCptFilter,
    onClearCptFilter,
  } = props;

  return (
    <div className="w-full overflow-x-auto py-6 px-4">
      <div className="relative min-w-[1540px] flex items-start justify-center gap-8 mx-auto">
        {/* Floating playful "chloe" cursor marker from Figma mockup */}
        <div
          className="absolute z-30 pointer-events-none transition-all duration-300"
          style={{ left: '445px', top: '480px' }}
        >
          <div className="flex items-center gap-1">
            <svg
              className="w-5 h-5 text-emerald-600 drop-shadow-md"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.428z" />
            </svg>
            <span className="bg-emerald-800 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
              chloe
            </span>
          </div>
        </div>

        {/* SCREEN 1: HOME */}
        <div className="w-[370px] shrink-0 space-y-2">
          {/* Top Title Bar matching mockup */}
          <div className="flex items-center justify-between px-2 text-slate-700">
            <span className="font-extrabold text-sm text-slate-800">Home</span>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-600 border border-slate-300 shadow-2xs">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="flex items-center gap-1 bg-white/70 hover:bg-white text-slate-900 border border-slate-400/80 px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-2xs">
                <Play className="w-2.5 h-2.5 fill-slate-900" />
                <span>PLAY</span>
              </button>
            </div>
          </div>

          {/* Screen Card Mockup */}
          <div className="bg-[#F3EDF7] rounded-[38px] border-4 border-slate-300 shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
            <div className="flex-1 overflow-y-auto">
              <HomeTab
                language={language}
                onPinToCalendar={onPinToCalendar}
                onAddToHealthBoard={onAddToHealthBoard}
                onOpenSoapModal={onOpenSoapModal}
                streakCount={streakCount}
                onIncrementStreak={onIncrementStreak}
              />
            </div>
            <BottomNav
              activeTab="home"
              onTabChange={() => {}}
              language={language}
            />
          </div>
        </div>

        {/* SCREEN 2: CALENDAR */}
        <div className="w-[370px] shrink-0 space-y-2">
          {/* Top Title Bar matching mockup */}
          <div className="flex items-center justify-between px-2 text-slate-700">
            <span className="font-extrabold text-sm text-slate-800">Calendar</span>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-600 border border-slate-300 shadow-2xs">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="flex items-center gap-1 bg-white/70 hover:bg-white text-slate-900 border border-slate-400/80 px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-2xs">
                <Play className="w-2.5 h-2.5 fill-slate-900" />
                <span>PLAY</span>
              </button>
            </div>
          </div>

          {/* Screen Card Mockup */}
          <div className="bg-[#F3EDF7] rounded-[38px] border-4 border-slate-300 shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
            <div className="flex-1 overflow-y-auto">
              <CalendarTab
                language={language}
                markedDays={markedDays}
                onOpenSoapModal={onOpenSoapModal}
                onNavigateToProviders={onNavigateToProviders}
              />
            </div>
            <BottomNav
              activeTab="calendar"
              onTabChange={() => {}}
              language={language}
            />
          </div>
        </div>

        {/* SCREEN 3: PROVIDERS */}
        <div className="w-[370px] shrink-0 space-y-2">
          {/* Top Title Bar matching mockup */}
          <div className="flex items-center justify-between px-2 text-slate-700">
            <span className="font-extrabold text-sm text-slate-800">Providers</span>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-600 border border-slate-300 shadow-2xs">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="flex items-center gap-1 bg-white/70 hover:bg-white text-slate-900 border border-slate-400/80 px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-2xs">
                <Play className="w-2.5 h-2.5 fill-slate-900" />
                <span>PLAY</span>
              </button>
            </div>
          </div>

          {/* Screen Card Mockup */}
          <div className="bg-[#F3EDF7] rounded-[38px] border-4 border-slate-300 shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
            <div className="flex-1 overflow-y-auto">
              <ProvidersTab
                language={language}
                onOpenBookingModal={onOpenBookingModal}
                onOpenSoapModal={onOpenSoapModal}
                onOpenBillAuditModal={onOpenBillAuditModal}
                selectedCptFilter={selectedCptFilter}
                onClearCptFilter={onClearCptFilter}
              />
            </div>
            <BottomNav
              activeTab="providers"
              onTabChange={() => {}}
              language={language}
            />
          </div>
        </div>

        {/* SCREEN 4: YOU */}
        <div className="w-[370px] shrink-0 space-y-2">
          {/* Top Title Bar matching mockup */}
          <div className="flex items-center justify-between px-2 text-slate-700">
            <span className="font-extrabold text-sm text-slate-800">You</span>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-600 border border-slate-300 shadow-2xs">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="flex items-center gap-1 bg-white/70 hover:bg-white text-slate-900 border border-slate-400/80 px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-2xs">
                <Play className="w-2.5 h-2.5 fill-slate-900" />
                <span>PLAY</span>
              </button>
            </div>
          </div>

          {/* Screen Card Mockup */}
          <div className="bg-[#F3EDF7] rounded-[38px] border-4 border-slate-300 shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
            <div className="flex-1 overflow-y-auto">
              <YouTab
                language={language}
                userProfile={userProfile}
                onOpenSoapModal={onOpenSoapModal}
                onOpenEditModal={onOpenEditModal}
                onOpenPassportModal={onOpenPassportModal}
                streakCount={streakCount}
                onIncrementStreak={onIncrementStreak}
              />
            </div>
            <BottomNav
              activeTab="you"
              onTabChange={() => {}}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
