import React, { useState } from 'react';
import {
  Language,
  MarkedDay,
  UserProfile,
  Provider,
  BillAuditResult,
  HealthBoardTrigger,
  SymptomToggle,
  EndoscopyPlan,
  DailyRecoveryHabits,
} from './types';
import {
  INITIAL_MARKED_DAYS,
  INITIAL_USER_PROFILE,
  INITIAL_SYMPTOMS,
  INITIAL_ENDOSCOPY_PLAN,
  INITIAL_HABITS,
  TRANSLATIONS,
} from './data/initialData';
import { Header, ConditionPreset } from './components/Header';
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
import { OnboardingModal } from './components/OnboardingModal';
import { FourScreenShowcase } from './components/FourScreenShowcase';
import { Sparkles, Wifi, Battery, Signal } from 'lucide-react';

export default function App() {
  // Navigation & Preferences
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<'simulator' | 'showcase'>('simulator');

  // Presentation Top Bar States
  const [activeDemoView, setActiveDemoView] = useState<'onboarding' | 'main'>('main');
  const [selectedPreset, setSelectedPreset] = useState<ConditionPreset>('celiac');

  // Application Data States
  const [markedDays, setMarkedDays] = useState<MarkedDay[]>(INITIAL_MARKED_DAYS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [streakCount, setStreakCount] = useState<number>(18);
  const [selectedCptFilter, setSelectedCptFilter] = useState<string | undefined>();
  const [endoscopyPlan, setEndoscopyPlan] = useState<EndoscopyPlan>(INITIAL_ENDOSCOPY_PLAN);
  const [recoveryHabits, setRecoveryHabits] = useState<DailyRecoveryHabits>(INITIAL_HABITS);

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

  // Condition preset handler
  const handleSelectPreset = (preset: ConditionPreset) => {
    setSelectedPreset(preset);
    if (preset === 'celiac') {
      setUserProfile((prev) => ({
        ...prev,
        allergies: ['Gluten (Strict Celiac)', 'Barley Malt', 'Rye', 'Cross-Contaminated Oats'],
        pinnedTriggers: [
          {
            id: 'oat-milk-cross',
            name: 'Cross-Contaminated Oat Milk',
            category: 'cross_contamination',
            riskBadge: 'HIGH RISK (9/10)',
            dateAdded: 'June 3, 2025',
            notes: 'Shared steam wand cross-contact',
          },
          {
            id: 'barley-malt-caramel',
            name: 'Barley Malt Caramel Syrup',
            category: 'gluten',
            riskBadge: 'HIGH RISK (8.5/10)',
            dateAdded: 'June 7, 2025',
            notes: 'Hidden gluten thickener',
          },
          {
            id: 'sugar-alcohol-neuropathy',
            name: 'High Refined Sugar + Alcohol',
            category: 'neuropathy_trigger',
            riskBadge: 'NEURO TRIGGER (7/10)',
            dateAdded: 'June 18, 2025',
            notes: 'Direct small fiber neuropathy trigger',
          },
        ],
      }));
      showToast('Loaded preset: Celiac Disease (Neurological & Gut Enteropathy)');
    } else if (preset === 'lupus') {
      setUserProfile((prev) => ({
        ...prev,
        allergies: ['UV Radiation (Photosensitive)', 'Sulfa Drugs', 'Alfalfa Sprouts'],
        pinnedTriggers: [
          {
            id: 'uv-radiation',
            name: 'Direct Sunlight / UV > 5',
            category: 'neuropathy_trigger',
            riskBadge: 'HIGH RISK (9/10)',
            dateAdded: 'June 2, 2025',
            notes: 'Triggers malar flare & joint fatigue',
          },
          {
            id: 'skincare-mi',
            name: 'Methylisothiazolinone in Skincare',
            category: 'cross_contamination',
            riskBadge: 'ALLERGEN (8/10)',
            dateAdded: 'June 10, 2025',
            notes: 'Contact dermatitis trigger',
          },
          {
            id: 'sleep-deprivation',
            name: 'Sleep Deprivation (<6h)',
            category: 'neuropathy_trigger',
            riskBadge: 'INFLAMMATION (6.5/10)',
            dateAdded: 'June 16, 2025',
            notes: 'Systemic inflammation surge',
          },
        ],
      }));
      showToast('Loaded preset: Lupus & Cutaneous Eczema Flares');
    } else if (preset === 'undiagnosed') {
      setUserProfile((prev) => ({
        ...prev,
        pinnedTriggers: [
          {
            id: 'post-meal-tachycardia',
            name: 'Post-Meal Tachycardia',
            category: 'neuropathy_trigger',
            riskBadge: 'AUTONOMIC (8/10)',
            dateAdded: 'June 4, 2025',
            notes: 'HR spikes to 120 bpm after eating',
          },
          {
            id: 'burning-feet-tremors',
            name: 'Burning Feet & Hand Tremors',
            category: 'neuropathy_trigger',
            riskBadge: 'SMALL FIBER (8.5/10)',
            dateAdded: 'June 8, 2025',
            notes: 'Dismissed by 8 clinicians as anxiety',
          },
          {
            id: 'restaurant-unfiltered',
            name: 'Unfiltered Restaurant Meals',
            category: 'cross_contamination',
            riskBadge: 'CROSS-CONTACT (7/10)',
            dateAdded: 'June 15, 2025',
            notes: 'Suspected autoimmune malabsorption',
          },
        ],
      }));
      showToast('Loaded preset: Undiagnosed Autoimmune (8+ Doctors Dismissed)');
    }
  };

  // Handlers
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

  // Onboarding completion
  const handleCompleteOnboarding = (data: {
    symptoms: SymptomToggle[];
    endoscopyPlan: EndoscopyPlan;
    habits: DailyRecoveryHabits;
    patientName: string;
  }) => {
    setEndoscopyPlan(data.endoscopyPlan);
    setRecoveryHabits(data.habits);
    setUserProfile((prev) => ({
      ...prev,
      name: data.patientName || 'Maya',
      endoscopyPlan: data.endoscopyPlan,
      activeSymptoms: data.symptoms,
      recoveryHabits: data.habits,
    }));
    setActiveDemoView('main');
    showToast(`✓ Welcome ${data.patientName || 'Maya'}! 4-Tab Action Plan populated.`);
  };

  return (
    <div className="min-h-screen bg-[#F3EDF7] font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 antialiased selection:bg-purple-200">
      {/* Global App Header with Hackathon Top Demo Bar */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        streakCount={streakCount}
        activeDemoView={activeDemoView}
        onDemoViewChange={setActiveDemoView}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
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
                  recoveryHabits={recoveryHabits}
                  onUpdateHabits={setRecoveryHabits}
                  endoscopyPlan={endoscopyPlan}
                  onNavigateToCalendar={() => setActiveTab('calendar')}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarTab
                  language={language}
                  markedDays={markedDays}
                  onOpenSoapModal={() => setIsSoapModalOpen(true)}
                  onNavigateToProviders={handleNavigateToProviders}
                  endoscopyPlan={endoscopyPlan}
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

      {/* Onboarding & Sheila Intake Modal (Can be opened from Top Demo Bar or Sheila button) */}
      <OnboardingModal
        isOpen={activeDemoView === 'onboarding'}
        onClose={() => setActiveDemoView('main')}
        onComplete={handleCompleteOnboarding}
        language={language}
      />

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
        language={language}
        onSave={(updated: UserProfile) => {
          setUserProfile(updated);
          showToast('✓ Health Board profile updated');
        }}
      />
    </div>
  );
}
