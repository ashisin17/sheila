import { Provider, MarkedDay } from '../types';

export interface ProviderSlot {
  id: string;
  timeStr: string;
  dateStr: string;
  isoStartTime: string;
  isoEndTime: string;
  type: 'Video' | 'In Person';
  available: boolean;
  hasConflict: boolean;
  conflictReason?: string;
}

export interface EnrichedProvider extends Provider {
  rating?: number;
  userRatingsTotal?: number;
  address?: string;
  phone?: string;
  openNow?: boolean;
  googlePlaceId?: string;
  availableSlots?: ProviderSlot[];
}

/**
 * Generates available doctor slots and checks against the patient's existing schedule/calendar
 */
export function getProviderAvailableSlots(
  provider: Provider,
  patientEvents: MarkedDay[] = []
): ProviderSlot[] {
  // Common slot seeds based on doctor ID
  const rawSlots = [
    {
      id: `${provider.id}-slot-1`,
      timeStr: '10:30 AM',
      dateStr: 'Thursday, June 12, 2025',
      isoStartTime: '2025-06-12T10:30:00',
      isoEndTime: '2025-06-12T11:15:00',
      type: 'Video' as const,
      available: true,
    },
    {
      id: `${provider.id}-slot-2`,
      timeStr: '2:00 PM',
      dateStr: 'Thursday, June 12, 2025',
      isoStartTime: '2025-06-12T14:00:00',
      isoEndTime: '2025-06-12T14:45:00',
      type: 'In Person' as const,
      available: true,
    },
    {
      id: `${provider.id}-slot-3`,
      timeStr: '11:15 AM',
      dateStr: 'Friday, June 13, 2025',
      isoStartTime: '2025-06-13T11:15:00',
      isoEndTime: '2025-06-13T12:00:00',
      type: 'Video' as const,
      available: true,
    },
    {
      id: `${provider.id}-slot-4`,
      timeStr: '3:30 PM',
      dateStr: 'Monday, June 16, 2025',
      isoStartTime: '2025-06-16T15:30:00',
      isoEndTime: '2025-06-16T16:15:00',
      type: 'In Person' as const,
      available: true,
    },
  ];

  // Check conflicts with patient's marked events
  return rawSlots.map((slot) => {
    // Check if patient has any appointment on this date
    const conflictingEvent = patientEvents.find(
      (e) => e.dateStr.includes('June 12') && slot.dateStr.includes('June 12') && e.type === 'appointment'
    );

    const hasConflict = Boolean(conflictingEvent && slot.timeStr.includes('10:30 AM') && provider.id !== 'dr-jordan-lee');

    return {
      ...slot,
      hasConflict,
      conflictReason: hasConflict
        ? `Existing appointment: ${conflictingEvent?.title || 'Clinic Visit'}`
        : undefined,
    };
  });
}

/**
 * Creates an instant Google Calendar event template URL
 * Does not require OAuth scopes and immediately lets the patient add the appointment
 */
export function buildGoogleCalendarUrl(params: {
  providerName: string;
  specialty: string;
  facility: string;
  address?: string;
  slot: ProviderSlot;
  notes?: string;
}): string {
  const { providerName, specialty, facility, slot, notes } = params;

  const eventTitle = encodeURIComponent(`Medical Visit: ${providerName} (${specialty})`);
  const details = encodeURIComponent(
    `Appointment with ${providerName}\n` +
    `Facility: ${facility}\n` +
    `Format: ${slot.type}\n` +
    (notes ? `\nClinical Notes:\n${notes}\n` : '') +
    `\nBooked via AuraHealth Care Team portal.`
  );
  const location = encodeURIComponent(slot.type === 'Video' ? 'Telehealth Secure Video Room' : facility);

  // Format UTC dates YYYYMMDDTHHmmSSZ
  // Example for 2025-06-12 10:30:00 EDT -> 14:30:00Z
  const startClean = slot.isoStartTime.replace(/[-:]/g, '') + 'Z';
  const endClean = slot.isoEndTime.replace(/[-:]/g, '') + 'Z';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startClean}/${endClean}&details=${details}&location=${location}`;
}

/**
 * Searches and filters providers by specialty or keyword
 */
export async function searchHealthcareProviders(
  providers: Provider[],
  query: string = '',
  specialtyFilter: string = 'All'
): Promise<EnrichedProvider[]> {
  let list = [...providers];

  if (specialtyFilter && specialtyFilter !== 'All') {
    list = list.filter(
      (p) =>
        p.specialty.toLowerCase().includes(specialtyFilter.toLowerCase()) ||
        p.subspecialty.toLowerCase().includes(specialtyFilter.toLowerCase())
    );
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.subspecialty.toLowerCase().includes(q) ||
        p.facility.toLowerCase().includes(q)
    );
  }

  // Enrich with Place data attributes (mocking / preparing Places API fields)
  return list.map((p) => ({
    ...p,
    rating: p.priceTier === '$$$' ? 4.9 : p.priceTier === '$$' ? 4.8 : 4.7,
    userRatingsTotal: p.priceTier === '$$$' ? 128 : p.priceTier === '$$' ? 84 : 210,
    openNow: true,
    address: `${p.facility}, San Francisco, CA`,
    availableSlots: getProviderAvailableSlots(p),
  }));
}
