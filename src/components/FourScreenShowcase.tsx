import React from 'react';
import { Download, Play } from 'lucide-react';
import {
  Language,
  MarkedDay,
  UserProfile,
  Provider,
  BillAuditResult,
  HealthBoardTrigger,
  FoodLogEntry,
  UserCollection,
  CollectionCard,
} from '../types';
import { HomeTab } from './HomeTab';
import { CalendarTab } from './CalendarTab';
import { ProvidersTab } from './ProvidersTab';
import { YouTab } from './YouTab';
import { DayView } from './DayView';
import { CollectionDetailView } from './CollectionDetailView';
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
  foodLogs: FoodLogEntry[];
  onAddFoodLog: (entry: Omit<FoodLogEntry, 'id'>) => void;
  collections: UserCollection[];
  onAddToCollection: (collectionId: string, dayLabel: string, content: string, type: string) => void;
  onAddCardToCollection: (collectionId: string, newCard: Omit<CollectionCard, 'id'>) => void;
  onOpenDayView?: (day: number) => void;
  onSelectCollection?: (col: UserCollection) => void;
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
    foodLogs,
    onAddFoodLog,
    collections,
    onAddToCollection,
    onAddCardToCollection,
    onOpenDayView,
    onSelectCollection,
  } = props;

  const hairLossCol = collections.find((c) => c.id === 'hair-loss') || collections[0];
  const celiacCol = collections.find((c) => c.id === 'celiac-symptoms') || collections[1];

  return (
    <div className="w-full overflow-x-auto py-6 px-4 space-y-10">
      {/* ROW 1: THE 4 CORE APP SCREENS (Home, Calendar, Providers, You) */}
      <div>
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 px-2 flex items-center justify-between">
          <span>Row 1 · Primary Navigation Screens (Pixel-Accurate to Mockup)</span>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-purple-200">
            Chloe, 22 · Sheila AI
          </span>
        </div>

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

            <div className="bg-[#F3EDF7] rounded-[38px] border-4 border-slate-300 shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
              <div className="flex-1 overflow-y-auto">
                <HomeTab
                  language={language}
                  onPinToCalendar={onPinToCalendar}
                  onAddToHealthBoard={onAddToHealthBoard}
                  onOpenSoapModal={onOpenSoapModal}
                  streakCount={streakCount}
                  onIncrementStreak={onIncrementStreak}
                  onNavigateToCalendar={() => onOpenDayView?.(12)}
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

            <div className="bg-[#F3EDF7] rounded-[38px] border-4 border-slate-300 shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
              <div className="flex-1 overflow-y-auto">
                <CalendarTab
                  language={language}
                  markedDays={markedDays}
                  onOpenSoapModal={onOpenSoapModal}
                  onNavigateToProviders={onNavigateToProviders}
                  onOpenDayView={onOpenDayView}
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
                  collections={collections}
                  onSelectCollection={onSelectCollection}
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

      {/* ROW 2: DAY VIEW & COLLECTIONS (Directly from Mockup Screenshot Row 2) */}
      <div>
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 px-2 flex items-center justify-between">
          <span>Row 2 · Day &amp; Collection Detail Screens (From Figma Screenshots)</span>
          <span className="text-[10px] text-purple-700 font-bold">
            Interactive food log &amp; symptom collections
          </span>
        </div>

        <div className="relative min-w-[1150px] flex items-start justify-center gap-8 mx-auto">
          {/* SCREEN 5: DAY VIEW (Thursday, June 12) */}
          <div className="w-[370px] shrink-0 space-y-2">
            <div className="flex items-center justify-between px-2 text-slate-700">
              <span className="font-extrabold text-sm text-slate-800">Day</span>
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

            <div className="bg-[#F3EDF7] rounded-[38px] border-4 border-slate-300 shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
              <div className="flex-1 overflow-y-auto">
                <DayView
                  onBackToCalendar={() => {}}
                  foodLogs={foodLogs}
                  onAddFoodLog={onAddFoodLog}
                  onOpenSoapModal={onOpenSoapModal}
                  collections={collections}
                  onAddToCollection={onAddToCollection}
                />
              </div>
              <BottomNav
                activeTab="calendar"
                onTabChange={() => {}}
                language={language}
              />
            </div>
          </div>

          {/* SCREEN 6: COLLECTION · TRACKING HAIR LOSS */}
          {hairLossCol && (
            <div className="w-[370px] shrink-0 space-y-2">
              <div className="flex items-center justify-between px-2 text-slate-700">
                <span className="font-extrabold text-sm text-slate-800 truncate max-w-[200px]">
                  Collection · Tracking hair loss
                </span>
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

              <div className="bg-[#F3EDF7] rounded-[38px] border-4 border-slate-300 shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
                <div className="flex-1 overflow-y-auto">
                  <CollectionDetailView
                    collection={hairLossCol}
                    onBackToYou={() => {}}
                    onAddCard={onAddCardToCollection}
                  />
                </div>
                <BottomNav
                  activeTab="you"
                  onTabChange={() => {}}
                  language={language}
                />
              </div>
            </div>
          )}

          {/* SCREEN 7: COLLECTION · CELIAC SYMPTOMS */}
          {celiacCol && (
            <div className="w-[370px] shrink-0 space-y-2">
              <div className="flex items-center justify-between px-2 text-slate-700">
                <span className="font-extrabold text-sm text-slate-800 truncate max-w-[200px]">
                  Collection · Celiac symptoms
                </span>
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

              <div className="bg-[#F3EDF7] rounded-[38px] border-4 border-slate-300 shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
                <div className="flex-1 overflow-y-auto">
                  <CollectionDetailView
                    collection={celiacCol}
                    onBackToYou={() => {}}
                    onAddCard={onAddCardToCollection}
                  />
                </div>
                <BottomNav
                  activeTab="you"
                  onTabChange={() => {}}
                  language={language}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
