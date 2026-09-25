/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Star,
  ShieldCheck,
  Filter,
  Heart,
  ChevronRight,
  Phone,
  Video,
  UserCheck,
  Sparkles,
  SlidersHorizontal,
  X,
  Check,
  Stethoscope,
  Building2,
  Navigation2,
  Bookmark,
  Share2,
  CalendarCheck2,
  CalendarX2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

interface AvailableSlot {
  id: string;
  timeDisplay: string;
  dateDisplay: string;
  isoStart: string;
  isoEnd: string;
  hasCalendarConflict: boolean;
  conflictReason?: string;
  type: 'in-person' | 'telehealth';
}

interface Provider {
  id: string;
  name: string;
  title: string;
  specialty: string;
  subspecialty?: string;
  clinic: string;
  address: string;
  neighborhood: string;
  distanceMiles: number;
  rating: number;
  reviewCount: number;
  matchScore: number;
  acceptingNewPatients: boolean;
  offersTelehealth: boolean;
  offersInPerson: boolean;
  insurances: string[];
  languages: string[];
  avatarUrl: string;
  bio: string;
  feeEstimate: string;
  slots: AvailableSlot[];
}

interface BookedVisit {
  id: string;
  providerName: string;
  providerSpecialty: string;
  clinic: string;
  address: string;
  slot: AvailableSlot;
  addedToGoogleCalendar: boolean;
  gcalUrl: string;
}

const SAMPLE_PROVIDERS: Provider[] = [
  {
    id: 'prov-1',
    name: 'Dr. Elena Rostova',
    title: 'MD, FACP',
    specialty: 'Primary Care',
    subspecialty: 'Internal Medicine & Women\'s Health',
    clinic: 'Mercy Midtown Health Center',
    address: '420 Lexington Ave, Suite 300, New York, NY',
    neighborhood: 'Midtown East',
    distanceMiles: 0.8,
    rating: 4.9,
    reviewCount: 142,
    matchScore: 98,
    acceptingNewPatients: true,
    offersTelehealth: true,
    offersInPerson: true,
    insurances: ['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Cigna'],
    languages: ['English', 'Spanish', 'Russian'],
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    bio: 'Specializing in preventive care, chronic condition management, and holistic patient health. Practicing with an empathetic, patient-first approach for over 12 years.',
    feeEstimate: '$25 copay or $140 self-pay',
    slots: [
      {
        id: 's1',
        dateDisplay: 'Tomorrow',
        timeDisplay: '10:15 AM - 11:00 AM',
        isoStart: '20260926T101500',
        isoEnd: '20260926T110000',
        hasCalendarConflict: true,
        conflictReason: 'Overlaps with "Product Design Sync" (10:00 - 11:00 AM)',
        type: 'in-person'
      },
      {
        id: 's2',
        dateDisplay: 'Tomorrow',
        timeDisplay: '2:30 PM - 3:15 PM',
        isoStart: '20260926T143000',
        isoEnd: '20260926T151500',
        hasCalendarConflict: false,
        type: 'telehealth'
      },
      {
        id: 's3',
        dateDisplay: 'Friday',
        timeDisplay: '11:00 AM - 11:45 AM',
        isoStart: '20260928T110000',
        isoEnd: '20260928T114500',
        hasCalendarConflict: false,
        type: 'in-person'
      }
    ]
  },
  {
    id: 'prov-2',
    name: 'Dr. Marcus Vance',
    title: 'DO',
    specialty: 'Family Medicine',
    subspecialty: 'Adolescent & Adult Care',
    clinic: 'Hudson River Community Health',
    address: '185 West End Ave, New York, NY',
    neighborhood: 'Upper West Side',
    distanceMiles: 1.4,
    rating: 4.8,
    reviewCount: 98,
    matchScore: 94,
    acceptingNewPatients: true,
    offersTelehealth: true,
    offersInPerson: true,
    insurances: ['Aetna', 'Cigna', 'Medicare', 'Medicaid', 'Oxford'],
    languages: ['English', 'French'],
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    bio: 'Dedicated to community medicine, preventative check-ups, and long-term care plans tailored to individual lifestyles.',
    feeEstimate: '$20 copay or $120 self-pay',
    slots: [
      {
        id: 's4',
        dateDisplay: 'Thursday',
        timeDisplay: '1:30 PM - 2:15 PM',
        isoStart: '20260927T133000',
        isoEnd: '20260927T141500',
        hasCalendarConflict: false,
        type: 'in-person'
      },
      {
        id: 's5',
        dateDisplay: 'Thursday',
        timeDisplay: '4:00 PM - 4:45 PM',
        isoStart: '20260927T160000',
        isoEnd: '20260927T164500',
        hasCalendarConflict: true,
        conflictReason: 'Overlaps with "Quarterly Planning" (3:30 - 5:00 PM)',
        type: 'telehealth'
      }
    ]
  },
  {
    id: 'prov-3',
    name: 'Dr. Priya Sundaram',
    title: 'MD',
    specialty: 'OB/GYN',
    subspecialty: 'Reproductive Endocrinology & Care',
    clinic: 'Central Park Women’s Health',
    address: '800 5th Avenue, Suite 7A, New York, NY',
    neighborhood: 'Lenox Hill',
    distanceMiles: 2.1,
    rating: 4.95,
    reviewCount: 215,
    matchScore: 96,
    acceptingNewPatients: true,
    offersTelehealth: true,
    offersInPerson: true,
    insurances: ['Blue Cross Blue Shield', 'Aetna', 'Empire Blue', 'UnitedHealthcare'],
    languages: ['English', 'Hindi', 'Tamil'],
    avatarUrl: 'https://images.unsplash.com/photo-1594824813583-7c37e6f30a91?auto=format&fit=crop&q=80&w=300',
    bio: 'Board-certified OB/GYN focused on compassionate care through all stages of life, wellness visits, and personalized gynecological therapies.',
    feeEstimate: '$30 copay or $165 self-pay',
    slots: [
      {
        id: 's6',
        dateDisplay: 'Friday',
        timeDisplay: '9:00 AM - 9:45 AM',
        isoStart: '20260928T090000',
        isoEnd: '20260928T094500',
        hasCalendarConflict: false,
        type: 'in-person'
      },
      {
        id: 's7',
        dateDisplay: 'Friday',
        timeDisplay: '2:15 PM - 3:00 PM',
        isoStart: '20260928T141500',
        isoEnd: '20260928T150000',
        hasCalendarConflict: false,
        type: 'telehealth'
      }
    ]
  },
  {
    id: 'prov-4',
    name: 'Dr. Julian Morales',
    title: 'MD',
    specialty: 'Pediatrics',
    subspecialty: 'General Pediatrics & Allergy Care',
    clinic: 'Chelsea Pediatric Associates',
    address: '315 9th Avenue, 2nd Fl, New York, NY',
    neighborhood: 'Chelsea',
    distanceMiles: 1.9,
    rating: 4.88,
    reviewCount: 167,
    matchScore: 91,
    acceptingNewPatients: true,
    offersTelehealth: false,
    offersInPerson: true,
    insurances: ['Blue Cross Blue Shield', 'Cigna', 'Medicaid', 'Fidelis'],
    languages: ['English', 'Spanish'],
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    bio: 'Passionate about nurturing child health from infancy through young adulthood, with special focus on preventive wellness and childhood nutrition.',
    feeEstimate: '$20 copay or $110 self-pay',
    slots: [
      {
        id: 's8',
        dateDisplay: 'Next Monday',
        timeDisplay: '11:00 AM - 11:45 AM',
        isoStart: '20260929T110000',
        isoEnd: '20260929T114500',
        hasCalendarConflict: false,
        type: 'in-person'
      }
    ]
  },
  {
    id: 'prov-5',
    name: 'Dr. Sarah Lin',
    title: 'PsyD',
    specialty: 'Mental Health',
    subspecialty: 'Cognitive Behavioral Therapy (CBT)',
    clinic: 'Flatiron Wellness & Behavioral Group',
    address: '27 W 24th St, Suite 501, New York, NY',
    neighborhood: 'Flatiron',
    distanceMiles: 1.1,
    rating: 4.92,
    reviewCount: 83,
    matchScore: 95,
    acceptingNewPatients: true,
    offersTelehealth: true,
    offersInPerson: true,
    insurances: ['Aetna', 'Cigna', 'UnitedHealthcare', 'Sliding Scale / Self-pay'],
    languages: ['English', 'Mandarin'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    bio: 'Evidence-based therapy helping individuals navigate stress, anxiety, life transitions, and building sustainable psychological resilience.',
    feeEstimate: '$35 copay or $150 sliding scale',
    slots: [
      {
        id: 's9',
        dateDisplay: 'Tomorrow',
        timeDisplay: '4:00 PM - 4:50 PM',
        isoStart: '20260926T160000',
        isoEnd: '20260926T165000',
        hasCalendarConflict: false,
        type: 'telehealth'
      }
    ]
  }
];

const SPECIALTY_OPTIONS = ['All Specialties', 'Primary Care', 'Family Medicine', 'OB/GYN', 'Pediatrics', 'Mental Health'];
const INSURANCE_OPTIONS = ['All Insurances', 'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Medicaid', 'Medicare'];
const RADIUS_OPTIONS = [5, 10, 25, 50];

export const ProviderMatchingMobile: React.FC<{ onBackToCareTeam?: () => void }> = ({ onBackToCareTeam }) => {
  // Filters & Search State
  const [zipQuery, setZipQuery] = useState('10001');
  const [maxRadius, setMaxRadius] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedInsurance, setSelectedInsurance] = useState('All Insurances');
  const [onlyAcceptingNew, setOnlyAcceptingNew] = useState(true);
  const [telehealthOnly, setTelehealthOnly] = useState(false);
  const [hideConflictedSlots, setHideConflictedSlots] = useState(false);

  // Google Calendar Integration State
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [calendarEmail] = useState('devstar4804@gcplab.me');

  // UI Navigation & View State
  const [savedProviderIds, setSavedProviderIds] = useState<string[]>(['prov-1']);
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'appointments' | 'profile'>('search');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(true);

  // Booked Visits
  const [bookedVisits, setBookedVisits] = useState<BookedVisit[]>([]);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<BookedVisit | null>(null);
  const [syncToGcalOnBooking, setSyncToGcalOnBooking] = useState(true);

  // Filter calculation
  const filteredProviders = useMemo(() => {
    return SAMPLE_PROVIDERS.filter((p) => {
      if (selectedSpecialty !== 'All Specialties' && p.specialty !== selectedSpecialty) {
        return false;
      }
      if (selectedInsurance !== 'All Insurances' && !p.insurances.includes(selectedInsurance)) {
        return false;
      }
      if (p.distanceMiles > maxRadius) {
        return false;
      }
      if (onlyAcceptingNew && !p.acceptingNewPatients) {
        return false;
      }
      if (telehealthOnly && !p.offersTelehealth) {
        return false;
      }
      if (isCalendarConnected && hideConflictedSlots) {
        const hasOpenConflictFreeSlot = p.slots.some((s) => !s.hasCalendarConflict);
        if (!hasOpenConflictFreeSlot) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesClinic = p.clinic.toLowerCase().includes(query);
        const matchesSpec = p.specialty.toLowerCase().includes(query) || (p.subspecialty && p.subspecialty.toLowerCase().includes(query));
        const matchesNeighborhood = p.neighborhood.toLowerCase().includes(query);
        if (!matchesName && !matchesClinic && !matchesSpec && !matchesNeighborhood) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      // Prioritize providers with free calendar slots if calendar is synced
      if (isCalendarConnected) {
        const aFree = a.slots.some(s => !s.hasCalendarConflict);
        const bFree = b.slots.some(s => !s.hasCalendarConflict);
        if (aFree && !bFree) return -1;
        if (!aFree && bFree) return 1;
      }
      return b.matchScore - a.matchScore;
    });
  }, [selectedSpecialty, selectedInsurance, maxRadius, onlyAcceptingNew, telehealthOnly, isCalendarConnected, hideConflictedSlots, searchQuery]);

  const toggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedProviderIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleConnectCalendar = () => {
    setIsSyncingCalendar(true);
    setTimeout(() => {
      setIsSyncingCalendar(false);
      setIsCalendarConnected(true);
      setShowConnectModal(false);
    }, 1200);
  };

  const handleDisconnectCalendar = () => {
    setIsCalendarConnected(false);
  };

  const generateGCalUrl = (provider: Provider, slot: AvailableSlot) => {
    const title = encodeURIComponent(`Medical Visit: ${provider.name} (${provider.specialty})`);
    const details = encodeURIComponent(
      `Appointment with ${provider.name}, ${provider.title}\nClinic: ${provider.clinic}\nType: ${
        slot.type === 'telehealth' ? 'Virtual Video Visit' : 'In-Person Consultation'
      }\nAddress: ${provider.address}\nBooked via Sheila Health Match.`
    );
    const location = encodeURIComponent(slot.type === 'telehealth' ? 'Telehealth Video Call' : provider.address);
    const dates = `${slot.isoStart}/${slot.isoEnd}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const handleConfirmBooking = (provider: Provider, slot: AvailableSlot) => {
    const gcalUrl = generateGCalUrl(provider, slot);
    const newVisit: BookedVisit = {
      id: `visit-${Date.now()}`,
      providerName: provider.name,
      providerSpecialty: provider.specialty,
      clinic: provider.clinic,
      address: provider.address,
      slot: slot,
      addedToGoogleCalendar: isCalendarConnected && syncToGcalOnBooking,
      gcalUrl
    };

    setBookedVisits((prev) => [newVisit, ...prev]);
    setBookingSuccessModal(newVisit);
    setSelectedProvider(null);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-0 sm:py-6 selection:bg-teal-500 selection:text-white">
      {/* Viewport switch banner for testing & presentation */}
      <header className="w-full max-w-md px-4 py-2 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 backdrop-blur border-b border-slate-800/80 mb-2 sm:rounded-xl sm:border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Sheila Care Match</span>
          <span className="text-slate-500">· Mobile Prototype</span>
        </div>
        <div className="flex items-center gap-1.5">
          {onBackToCareTeam && (
            <button
              onClick={onBackToCareTeam}
              className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700/50 rounded text-[11px] transition font-bold"
            >
              ← Care Team View
            </button>
          )}
          <button
            onClick={() => setIsMobileDeviceView(!isMobileDeviceView)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition font-medium"
          >
            {isMobileDeviceView ? 'Expand View' : 'Phone Frame'}
          </button>
        </div>
      </header>

      {/* Main Container - Mobile Shell */}
      <div
        className={`w-full transition-all duration-300 flex flex-col bg-slate-950 text-slate-100 relative ${
          isMobileDeviceView
            ? 'max-w-md sm:h-[844px] sm:rounded-[36px] sm:border-4 sm:border-slate-800 sm:shadow-2xl sm:overflow-hidden'
            : 'max-w-2xl min-h-screen sm:rounded-2xl sm:border sm:border-slate-800'
        }`}
      >
        {/* Top App Header with Location & Calendar Sync Bar */}
        <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 pt-3 pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                S
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-400" /> Patient Location
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-white">ZIP {zipQuery}</span>
                  <span className="text-slate-500 text-xs">· within {maxRadius} miles</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Google Calendar Toggle Pill */}
              <button
                onClick={() => {
                  if (isCalendarConnected) {
                    handleDisconnectCalendar();
                  } else {
                    setShowConnectModal(true);
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition ${
                  isCalendarConnected
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
                title={isCalendarConnected ? 'Google Calendar Synced - Click to disconnect' : 'Sync Google Calendar'}
              >
                <CalendarIcon className={`w-3.5 h-3.5 ${isCalendarConnected ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{isCalendarConnected ? 'Calendar Synced' : 'Sync G-Cal'}</span>
              </button>

              <button
                onClick={() => setShowFilterDrawer(true)}
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
                aria-label="Filter providers"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {(selectedSpecialty !== 'All Specialties' || selectedInsurance !== 'All Insurances' || telehealthOnly || hideConflictedSlots) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctor, clinic, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/60 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Specialty Horizontal Scroller */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1 pb-0.5">
            {SPECIALTY_OPTIONS.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedSpecialty === spec
                    ? 'bg-teal-500 text-slate-950 font-semibold'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Google Calendar Connected Status Banner */}
          {isCalendarConnected && (
            <div className="bg-blue-950/40 border border-blue-900/50 rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-300">
                  Matching against <strong className="text-blue-300">{calendarEmail}</strong>
                </span>
              </div>
              <button
                onClick={() => setHideConflictedSlots(!hideConflictedSlots)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded transition ${
                  hideConflictedSlots
                    ? 'bg-blue-500 text-slate-950'
                    : 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60'
                }`}
              >
                {hideConflictedSlots ? 'Only Free Slots' : 'Show All Slots'}
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {activeTab === 'search' && (
            <>
              {/* Active Criteria Summary */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Showing <strong className="text-white">{filteredProviders.length}</strong> verified matching providers
                </span>
                <span className="text-[11px] text-teal-400 font-medium">Sorted by Compatibility</span>
              </div>

              {/* Provider List */}
              {filteredProviders.length === 0 ? (
                <div className="py-12 text-center space-y-3 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Filter className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">No matching providers found</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Try widening your search radius or turning off the "Only Free Slots" calendar filter.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSpecialty('All Specialties');
                      setSelectedInsurance('All Insurances');
                      setMaxRadius(25);
                      setSearchQuery('');
                      setTelehealthOnly(false);
                      setHideConflictedSlots(false);
                    }}
                    className="mt-2 text-xs font-semibold px-4 py-2 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30 transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredProviders.map((provider) => {
                  const isSaved = savedProviderIds.includes(provider.id);
                  const firstSlot = provider.slots[0];

                  return (
                    <div
                      key={provider.id}
                      onClick={() => {
                        setSelectedProvider(provider);
                        setSelectedSlot(provider.slots[0] || null);
                      }}
                      className="bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/90 rounded-2xl p-4 transition shadow-sm hover:shadow cursor-pointer space-y-3"
                    >
                      {/* Top card bar: Avatar, name, match score, bookmark */}
                      <div className="flex items-start gap-3">
                        <img
                          src={provider.avatarUrl}
                          alt={provider.name}
                          className="w-13 h-13 rounded-xl object-cover border border-slate-700/60"
                          loading="lazy"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white truncate">{provider.name}</h4>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-teal-400 bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded-md">
                                {provider.matchScore}% Match
                              </span>
                              <button
                                onClick={(e) => toggleSave(provider.id, e)}
                                className="p-1 text-slate-400 hover:text-rose-400 transition"
                                aria-label="Save provider"
                              >
                                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-slate-400 mt-0.5 truncate">
                            {provider.title} · {provider.specialty}
                          </div>

                          {/* Clean unboxed metadata row */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-amber-300">
                              <Star className="w-3 h-3 fill-amber-300" />
                              {provider.rating} ({provider.reviewCount})
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <Navigation2 className="w-3 h-3 text-teal-400" />
                              {provider.distanceMiles} mi away
                            </span>
                            <span>·</span>
                            <span className="text-slate-300">{provider.neighborhood}</span>
                          </div>
                        </div>
                      </div>

                      {/* Clinic and Next Available Slot Preview */}
                      <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-2.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1.5 text-slate-400 truncate">
                            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {provider.clinic}
                          </span>
                          <span className="text-[11px] text-slate-400 shrink-0">{provider.feeEstimate}</span>
                        </div>

                        {/* Calendar-aware Slot status */}
                        {firstSlot && (
                          <div className="pt-2 border-t border-slate-800/60 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                                <Clock className="w-3 h-3 text-teal-400" />
                                {firstSlot.dateDisplay}: {firstSlot.timeDisplay}
                              </span>
                              <span className="text-slate-400 text-[10px]">
                                {firstSlot.type === 'telehealth' ? 'Virtual' : 'In-Person'}
                              </span>
                            </div>

                            {/* Google Calendar Match Indicator */}
                            {isCalendarConnected ? (
                              firstSlot.hasCalendarConflict ? (
                                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-950/30 border border-amber-800/30 rounded-lg px-2 py-1">
                                  <CalendarX2 className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{firstSlot.conflictReason}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 rounded-lg px-2 py-1">
                                  <CalendarCheck2 className="w-3 h-3 shrink-0" />
                                  <span>Free on your Google Calendar!</span>
                                </div>
                              )
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowConnectModal(true);
                                }}
                                className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                              >
                                <CalendarIcon className="w-3 h-3" /> Sync Google Calendar to check for conflicts
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action row */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          Accepts {provider.insurances.slice(0, 2).join(', ')}
                          {provider.insurances.length > 2 && ` +${provider.insurances.length - 2} more`}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProvider(provider);
                            setSelectedSlot(provider.slots[0] || null);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition"
                        >
                          View Open Times
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Saved Medical Providers</h3>
              {savedProviderIds.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  You haven't bookmarked any doctors yet.
                </div>
              ) : (
                SAMPLE_PROVIDERS.filter((p) => savedProviderIds.includes(p.id)).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProvider(p)}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.avatarUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-semibold text-white">{p.name}</h4>
                        <p className="text-[11px] text-slate-400">{p.specialty}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => toggleSave(p.id, e)}
                      className="p-2 text-rose-500 hover:text-rose-400"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Upcoming Appointments</h3>
                {isCalendarConnected && (
                  <span className="text-[11px] text-blue-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Synced with Google Calendar
                  </span>
                )}
              </div>

              {bookedVisits.length === 0 ? (
                <div className="py-12 text-center space-y-2 text-slate-400">
                  <CalendarIcon className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs">No upcoming appointments scheduled.</p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="text-xs font-semibold text-teal-400 underline underline-offset-4"
                  >
                    Find a matching provider
                  </button>
                </div>
              ) : (
                bookedVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                          Confirmed Visit
                        </span>
                        <h4 className="text-sm font-bold text-white">{visit.providerName}</h4>
                        <p className="text-xs text-slate-400">{visit.providerSpecialty} · {visit.clinic}</p>
                      </div>
                      <span className="text-xs bg-slate-950 border border-slate-800 px-2 py-1 rounded text-slate-300">
                        {visit.slot.type === 'telehealth' ? 'Virtual' : 'In-Person'}
                      </span>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{visit.slot.dateDisplay} at {visit.slot.timeDisplay}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{visit.address}</span>
                      </div>
                    </div>

                    {visit.addedToGoogleCalendar && (
                      <div className="flex items-center justify-between text-[11px] text-blue-300 bg-blue-950/30 border border-blue-900/40 rounded-lg p-2">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Added to Google Calendar
                        </span>
                        <a
                          href={visit.gcalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:underline font-semibold"
                        >
                          View in Google Calendar <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Patient Profile</h3>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-base border border-teal-500/30">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Jane Doe</h4>
                    <p className="text-slate-400">Coverage: Blue Cross Blue Shield PPO</p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Home ZIP:</span>
                    <span>10001 (Chelsea, NY)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Connected Calendar:</span>
                    <span className={isCalendarConnected ? 'text-blue-400 font-medium' : 'text-slate-500'}>
                      {isCalendarConnected ? calendarEmail : 'Not connected'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Google Calendar Management Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-white">Google Calendar Sync</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Connect your calendar to automatically highlight appointment slots that conflict with your work or personal schedule.
                </p>
                {isCalendarConnected ? (
                  <button
                    onClick={handleDisconnectCalendar}
                    className="w-full py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
                  >
                    Disconnect Google Calendar
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConnectModal(true)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Connect Google Calendar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Tab Bar (Mobile) */}
        <nav className="absolute bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur border-t border-slate-800/80 px-6 py-2 flex items-center justify-between z-20">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 py-1 text-xs font-medium transition ${
              activeTab === 'search' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Match</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center gap-1 py-1 text-xs font-medium transition relative ${
              activeTab === 'saved' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved</span>
            {savedProviderIds.length > 0 && (
              <span className="absolute top-0 right-1 w-1.5 h-1.5 rounded-full bg-teal-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex flex-col items-center gap-1 py-1 text-xs font-medium transition relative ${
              activeTab === 'appointments' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Visits</span>
            {bookedVisits.length > 0 && (
              <span className="absolute top-0 right-1 w-1.5 h-1.5 rounded-full bg-teal-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-1 text-xs font-medium transition ${
              activeTab === 'profile' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Patient</span>
          </button>
        </nav>

        {/* Prototype Google Calendar OAuth Modal */}
        {showConnectModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 max-w-sm shadow-2xl w-full">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Google Calendar Sync</h3>
                    <p className="text-[10px] text-slate-400">Prototype Integration</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p className="leading-relaxed">
                  Sheila Care will read your free/busy schedule to highlight medical appointments that fit smoothly into your week.
                </p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-200">
                    <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Account: <strong>{calendarEmail}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Only checks free/busy times; private details remain secure.</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnectCalendar}
                  disabled={isSyncingCalendar}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
                >
                  {isSyncingCalendar ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <span>Allow & Connect</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Provider Sheet with Slot Selection */}
        {selectedProvider && (
          <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end">
            <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 max-h-[90%] overflow-y-auto">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProvider.avatarUrl}
                    alt={selectedProvider.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedProvider.name}</h3>
                    <p className="text-xs text-slate-400">
                      {selectedProvider.title} · {selectedProvider.specialty}
                    </p>
                    <div className="text-[11px] text-teal-400 font-semibold mt-0.5">
                      {selectedProvider.matchScore}% Match for your area & needs
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProvider(null);
                    setSelectedSlot(null);
                  }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slot picker with Calendar Conflict badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    Available Appointment Slots
                  </h4>
                  {isCalendarConnected && (
                    <span className="text-[10px] text-blue-400 font-medium">Cross-referenced with G-Cal</span>
                  )}
                </div>

                <div className="space-y-2">
                  {selectedProvider.slots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;

                    return (
                      <div
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition space-y-1 ${
                          isSelected
                            ? 'bg-teal-950/40 border-teal-500 text-white'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-100">
                            {slot.dateDisplay} · {slot.timeDisplay}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {slot.type === 'telehealth' ? 'Virtual' : 'In-Person'}
                          </span>
                        </div>

                        {/* Calendar Status */}
                        {isCalendarConnected && (
                          <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                            {slot.hasCalendarConflict ? (
                              <span className="text-amber-400 flex items-center gap-1">
                                <CalendarX2 className="w-3 h-3" /> {slot.conflictReason}
                              </span>
                            ) : (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CalendarCheck2 className="w-3 h-3" /> No calendar conflicts
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <h4 className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">About Doctor</h4>
                <p className="leading-relaxed text-slate-300">{selectedProvider.bio}</p>
              </div>

              {/* Sync to GCal Checkbox */}
              {isCalendarConnected && (
                <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncToGcalOnBooking}
                    onChange={(e) => setSyncToGcalOnBooking(e.target.checked)}
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                  <span>Automatically add event to my Google Calendar</span>
                </label>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => toggleSave(selectedProvider.id)}
                  className="p-3 rounded-xl border border-slate-800 text-slate-300 hover:text-rose-400 transition"
                >
                  <Heart className={`w-5 h-5 ${savedProviderIds.includes(selectedProvider.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
                <button
                  disabled={!selectedSlot}
                  onClick={() => selectedSlot && handleConfirmBooking(selectedProvider, selectedSlot)}
                  className="flex-1 py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  Confirm Visit for {selectedSlot?.dateDisplay || 'Select Slot'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Drawer / Modal */}
        {showFilterDrawer && (
          <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end">
            <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-teal-400" /> Refine Patient Match
                </h3>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Area Radius */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Search Radius from {zipQuery}</label>
                <div className="grid grid-cols-4 gap-2">
                  {RADIUS_OPTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setMaxRadius(r)}
                      className={`py-2 text-xs rounded-xl font-medium border transition ${
                        maxRadius === r
                          ? 'bg-teal-500 text-slate-950 border-teal-400 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {r} miles
                    </button>
                  ))}
                </div>
              </div>

              {/* Insurance Provider */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Accepted Insurance Network</label>
                <select
                  value={selectedInsurance}
                  onChange={(e) => setSelectedInsurance(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  {INSURANCE_OPTIONS.map((ins) => (
                    <option key={ins} value={ins}>
                      {ins}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Only Accepting New Patients</span>
                  <input
                    type="checkbox"
                    checked={onlyAcceptingNew}
                    onChange={(e) => setOnlyAcceptingNew(e.target.checked)}
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Telehealth / Video Consultations</span>
                  <input
                    type="checkbox"
                    checked={telehealthOnly}
                    onChange={(e) => setTelehealthOnly(e.target.checked)}
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                </label>

                {isCalendarConnected && (
                  <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                    <span className="text-blue-300 font-medium">Hide Conflicting Timeslots (Google Calendar)</span>
                    <input
                      type="checkbox"
                      checked={hideConflictedSlots}
                      onChange={(e) => setHideConflictedSlots(e.target.checked)}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </label>
                )}
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="w-full py-3 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-teal-400 transition"
              >
                Apply Matching Filters ({filteredProviders.length} Results)
              </button>
            </div>
          </div>
        )}

        {/* Booking Confirmation Dialog */}
        {bookingSuccessModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 max-w-sm shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Your visit with <strong>{bookingSuccessModal.providerName}</strong> is reserved for{' '}
                  <span className="text-white font-medium">
                    {bookingSuccessModal.slot.dateDisplay} at {bookingSuccessModal.slot.timeDisplay}
                  </span>.
                </p>
              </div>

              {bookingSuccessModal.addedToGoogleCalendar && (
                <div className="bg-blue-950/50 border border-blue-900/60 rounded-xl p-3 text-left text-xs space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-semibold text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Synchronized to Google Calendar</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Calendar invite and SMS reminders have been registered for {calendarEmail}.
                  </p>
                  <a
                    href={bookingSuccessModal.gcalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 pt-1"
                  >
                    Open in Google Calendar <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setBookingSuccessModal(null);
                    setActiveTab('appointments');
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-medium"
                >
                  View in Visits
                </button>
                <button
                  onClick={() => setBookingSuccessModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-semibold text-xs hover:bg-teal-400 transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
