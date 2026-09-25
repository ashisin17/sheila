import React, { useState } from 'react';
import {
  Language,
  MarkedDay,
  UserProfile,
  Provider,
  BillAuditResult,
  HealthBoardTrigger,
} from './types';
import {
  INITIAL_MARKED_DAYS,
  INITIAL_USER_PROFILE,
  TRANSLATIONS,
} from './data/initialData';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { CalendarTab } from './components/CalendarTab';
import { ProvidersTab } from './components/ProvidersTab';
import { YouTab } from './components/YouTab';
import { SoapNoteModal } from './components/SoapNoteModal';
import { BillAuditModal } from './components/BillAuditModal';
import { BookingModal } from './components/BookingModal';
import { AdvocacyPassportModal } from './components/AdvocacyPassportModal';
import { EditInfoModal } from './components/EditInfoModal';
import { FourScreenShowcase } from './components/FourScreenShowcase';
import { Sparkles, Wifi, Battery, Signal } from 'lucide-react';

export default function App() {
  // Navigation & Preferences
  const [activeTab, setActiveTab] = useState<TabType>('providers');
  const [language, setLanguage] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<'simulator' | 'showcase'>('simulator');

  // Application Data States
  const [markedDays, setMarkedDays] = useState<MarkedDay[]>(INITIAL_MARKED_DAYS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [streakCount, setStreakCount] = useState<number>(14);
  const [selectedCptFilter, setSelectedCptFilter] = useState<string | undefined>();

  // Modals
  const [isSoapModalOpen, setIsSoapModalOpen] = useState(false);
  const [isBillAuditModalOpen, setIsBillAuditModalOpen] = useState(false);
  const [billAuditData, setBillAuditData] = useState<BillAuditResult | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingProvider, setBookingProvider] = useState<Provider | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);

  // In-app Toast Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handlePinToCalendar = (newDay: MarkedDay) => {
    setMarkedDays((prev) => {
      // Check if day already marked, replace or prepend
      const filtered = prev.filter((d) => d.day !== newDay.day);
      return [newDay, ...filtered];
    });
    showToast(`✓ Flare pinned to June ${newDay.day} on Calendar`);
  };

  const handleAddToHealthBoard = (newTrigger: HealthBoardTrigger) => {
    setUserProfile((prev) => {
      const exists = prev.pinnedTriggers.some(
        (t) => t.name.toLowerCase() === newTrigger.name.toLowerCase()
      );
      if (exists) return prev;
      return {
        ...prev,
        pinnedTriggers: [newTrigger, ...prev.pinnedTriggers],
      };
    });
    showToast(`✓ "${newTrigger.name}" saved to Health Board`);
  };

  const handleIncrementStreak = () => {
    setStreakCount((prev) => prev + 1);
    showToast('🔥 Vitamin D daily streak recorded (+1 Day)!');
  };

  const handleNavigateToProviders = (cptCode?: string) => {
    if (cptCode) {
      setSelectedCptFilter(cptCode);
    }
    setActiveTab('providers');
  };

  const handleOpenBooking = (provider: Provider) => {
    setBookingProvider(provider);
    setIsBookingModalOpen(true);
  };

  const handleOpenBillAudit = (audit: BillAuditResult) => {
    setBillAuditData(audit);
    setIsBillAuditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F3EDF7] font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 antialiased selection:bg-purple-200">
      {/* Global App Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        streakCount={streakCount}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-[#EAE06D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pb-8">
        {viewMode === 'showcase' ? (
          /* 4-Screen Side-by-Side Mockup Mode matching image.jpeg */
          <FourScreenShowcase
            language={language}
            markedDays={markedDays}
            userProfile={userProfile}
            streakCount={streakCount}
            onIncrementStreak={handleIncrementStreak}
            onPinToCalendar={handlePinToCalendar}
            onAddToHealthBoard={handleAddToHealthBoard}
            onOpenSoapModal={() => setIsSoapModalOpen(true)}
            onOpenBookingModal={handleOpenBooking}
            onOpenBillAuditModal={handleOpenBillAudit}
            onOpenEditModal={() => setIsEditModalOpen(true)}
            onOpenPassportModal={() => setIsPassportModalOpen(true)}
            onNavigateToProviders={handleNavigateToProviders}
            selectedCptFilter={selectedCptFilter}
            onClearCptFilter={() => setSelectedCptFilter(undefined)}
          />
        ) : (
          /* Mobile Phone Simulator Container */
          <div className="max-w-[420px] mx-auto sm:my-6 sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl overflow-hidden bg-[#F3EDF7] flex flex-col min-h-screen sm:min-h-[844px] relative">
            {/* Mobile Top Status Bar (simulated) */}
            <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 text-slate-900 text-[11px] font-bold shrink-0">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Active Screen Tab View */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'home' && (
                <HomeTab
                  language={language}
                  onPinToCalendar={handlePinToCalendar}
                  onAddToHealthBoard={handleAddToHealthBoard}
                  onOpenSoapModal={() => setIsSoapModalOpen(true)}
                  streakCount={streakCount}
                  onIncrementStreak={handleIncrementStreak}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarTab
                  language={language}
                  markedDays={markedDays}
                  onOpenSoapModal={() => setIsSoapModalOpen(true)}
                  onNavigateToProviders={handleNavigateToProviders}
                />
              )}

              {activeTab === 'providers' && (
                <ProvidersTab
                  language={language}
                  onOpenBookingModal={handleOpenBooking}
                  onOpenSoapModal={() => setIsSoapModalOpen(true)}
                  onOpenBillAuditModal={handleOpenBillAudit}
                  selectedCptFilter={selectedCptFilter}
                  onClearCptFilter={() => setSelectedCptFilter(undefined)}
                />
              )}

              {activeTab === 'you' && (
                <YouTab
                  language={language}
                  userProfile={userProfile}
                  onOpenSoapModal={() => setIsSoapModalOpen(true)}
                  onOpenEditModal={() => setIsEditModalOpen(true)}
                  onOpenPassportModal={() => setIsPassportModalOpen(true)}
                  streakCount={streakCount}
                  onIncrementStreak={handleIncrementStreak}
                />
              )}
            </div>

            {/* Bottom Floating Navigation */}
            <div className="sticky bottom-0 z-30">
              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                language={language}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <SoapNoteModal
        isOpen={isSoapModalOpen}
        onClose={() => setIsSoapModalOpen(false)}
        language={language}
        markedDays={markedDays}
        onNavigateToProviders={handleNavigateToProviders}
      />

      <BillAuditModal
        isOpen={isBillAuditModalOpen}
        onClose={() => setIsBillAuditModalOpen(false)}
        auditResult={billAuditData}
        language={language}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        provider={bookingProvider}
        language={language}
        onConfirmSuccess={() =>
          showToast(`✓ Booked with ${bookingProvider?.name} & SOAP memo attached`)
        }
      />

      <AdvocacyPassportModal
        isOpen={isPassportModalOpen}
        onClose={() => setIsPassportModalOpen(false)}
        userProfile={userProfile}
        markedDays={markedDays}
        language={language}
      />

      <EditInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={userProfile}
        onSave={(updated) => {
          setUserProfile(updated);
          showToast('✓ Health Board profile updated');
        }}
        language={language}
      />
    </div>
  );
}
