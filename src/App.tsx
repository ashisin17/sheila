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
import { GoogleAccountState } from './components/GoogleAccountCard';
import { ProviderMatchingMobile } from './components/ProviderMatchingMobile';
import { Sparkles, Wifi, Battery, Signal, X } from 'lucide-react';

export default function App() {
  // Navigation & Preferences
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<'simulator' | 'showcase' | 'provider-matching'>('simulator');

  // Application Data States
  const [markedDays, setMarkedDays] = useState<MarkedDay[]>(INITIAL_MARKED_DAYS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [streakCount, setStreakCount] = useState<number>(14);
  const [selectedCptFilter, setSelectedCptFilter] = useState<string | undefined>();

  // Google Account Connection State
  const [googleAccount, setGoogleAccount] = useState<GoogleAccountState>({
    isConnected: false,
    email: 'maya.health@gmail.com',
    name: 'Maya Lin',
    syncCalendar: true,
    cloudBackup: true,
  });
  const [isConnectBannerDismissed, setIsConnectBannerDismissed] = useState(false);

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
  const handleConnectGoogle = () => {
    setGoogleAccount((prev) => ({
      ...prev,
      isConnected: true,
      email: 'maya.health@gmail.com',
      name: 'Maya Lin',
      connectedAt: new Date().toLocaleDateString(),
    }));
    showToast('✓ Connected to Google Account (maya.health@gmail.com)');
  };

  const handleDisconnectGoogle = () => {
    setGoogleAccount((prev) => ({
      ...prev,
      isConnected: false,
    }));
    showToast('Disconnected from Google Account');
  };

  const handleToggleCalendarSync = (enabled: boolean) => {
    setGoogleAccount((prev) => ({ ...prev, syncCalendar: enabled }));
    showToast(enabled ? '✓ Google Calendar visit sync enabled' : 'Google Calendar sync paused');
  };

  const handleToggleCloudBackup = (enabled: boolean) => {
    setGoogleAccount((prev) => ({ ...prev, cloudBackup: enabled }));
    showToast(enabled ? '✓ Secure Care Timeline backup enabled' : 'Timeline cloud backup paused');
  };

  const handlePinToCalendar = (newDay: MarkedDay) => {
    setMarkedDays((prev) => {
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
    <div className="min-h-screen bg-[#E5DBEE] text-slate-900 font-sans flex flex-col selection:bg-purple-200">
      {/* Global Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        streakCount={streakCount}
      />

      {/* Floating In-App Toast Message */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#231A2F] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-purple-400/40 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4">
        {viewMode === 'provider-matching' ? (
          /* Full Mobile Provider Matching Engine from PR #1 */
          <ProviderMatchingMobile onBackToCareTeam={() => setViewMode('simulator')} />
        ) : viewMode === 'showcase' ? (
          /* 4-Screen Side-by-Side Figma Showcase View */
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
          /* Interactive Pixel-Perfect Mobile Phone Simulator View */
          <div className="w-full max-w-[420px] bg-[#F3EDF7] rounded-[42px] border-8 border-slate-900 shadow-2xl overflow-hidden flex flex-col min-h-[820px] relative my-auto">
            {/* Phone Top Notch / Speaker Island */}
            <div className="pt-3 px-6 pb-1 flex items-center justify-between text-slate-800 text-[11px] font-bold shrink-0">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Prompt to Connect Google Account (Dismissible Banner) */}
            {!googleAccount.isConnected && !isConnectBannerDismissed && (
              <div className="bg-white/95 border-b border-purple-200/80 px-3.5 py-2 flex items-center justify-between gap-2 text-xs shadow-2xs animate-fade-in">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-md bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] text-slate-700 font-semibold truncate">
                    Connect Google Account to sync visits
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleConnectGoogle}
                    className="text-[10px] bg-[#231A2F] hover:bg-slate-800 text-white font-bold px-2.5 py-1 rounded-full transition shadow-xs"
                  >
                    Connect
                  </button>
                  <button
                    onClick={() => setIsConnectBannerDismissed(true)}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

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
                  onOpenProviderMatching={() => setViewMode('provider-matching')}
                  googleAccount={googleAccount}
                  onConnectGoogle={handleConnectGoogle}
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
                  googleAccount={googleAccount}
                  onConnectGoogle={handleConnectGoogle}
                  onDisconnectGoogle={handleDisconnectGoogle}
                  onToggleCalendarSync={handleToggleCalendarSync}
                  onToggleCloudBackup={handleToggleCloudBackup}
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
        language={language}
        auditResult={billAuditData}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        provider={bookingProvider}
        language={language}
        onConfirmSuccess={() => {
          showToast(`✓ Visit confirmed with ${bookingProvider?.name}!`);
        }}
      />

      <AdvocacyPassportModal
        isOpen={isPassportModalOpen}
        onClose={() => setIsPassportModalOpen(false)}
        language={language}
        userProfile={userProfile}
        markedDays={markedDays}
      />

      <EditInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={userProfile}
        language={language}
        onSave={(updated: UserProfile) => {
          setUserProfile(updated);
          showToast('✓ Profile updated successfully');
        }}
      />
    </div>
  );
}
