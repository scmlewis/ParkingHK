export type VehicleType = 'PRIVATE_CAR' | 'MOTORCYCLE' | 'LGV' | 'HGV' | 'COACH';

export type OpeningStatus = 'OPEN' | 'CLOSED' | 'UNKNOWN';

export type FreshnessStatus = 'LIVE' | 'RECENT' | 'STALE' | 'VERY_STALE' | 'UNKNOWN';

export type VacancyStatus = 'AVAILABLE' | 'LIMITED' | 'FULL' | 'UNKNOWN';

export type Language = 'en' | 'tc';

export type ThemeMode = 'system' | 'light' | 'dark';

export type SortOption = 'recommended' | 'distance' | 'vacancy' | 'price';

export interface LocalizedString {
  en: string;
  tc: string;
}

export interface Vacancy {
  vehicleType: VehicleType;
  serviceCategory: string;
  vacancy: number | null;
  vacancyType?: string;
  updatedAt?: string;
}

export interface PricingPeriod {
  type: 'HOURLY' | 'DAY_PARKING' | 'NIGHT_PARKING' | 'SPECIAL';
  rate: number; // in HKD
  unit?: string; // e.g., 'hour', 'session'
  remarks?: LocalizedString;
  validHours?: string;
}

export interface ParkingPricing {
  hourlyRate?: number | null; // Representative base hourly rate for comparison; null = unavailable
  estimated?: boolean; // true when hourlyRate is derived from region averages, not official data
  dayRate?: number;
  nightRate?: number;
  periods?: PricingPeriod[];
  paymentMethods?: string[]; // Octopus, Visa, Mastercard, Faster Payment System, Cash, etc.
  rawRemarks?: LocalizedString;
}

export interface ParkingLot {
  id: string;
  name: LocalizedString;
  address: LocalizedString;
  district: LocalizedString;
  region: 'HK_ISLAND' | 'KOWLOON' | 'NEW_TERRITORIES' | 'OUTLYING_ISLANDS';
  latitude: number | null;
  longitude: number | null;
  openingStatus: OpeningStatus;
  contactNumber?: string;
  website?: string;
  heightLimit?: number; // in meters, e.g. 2.0
  remarks?: LocalizedString;
  photoUrl?: string;
  vehicleTypes: VehicleType[];
  vacancies: Vacancy[];
  pricing?: ParkingPricing;
  dataUpdatedAt?: string;
  totalSpaces?: number;
  facilities?: {
    evCharging?: boolean;
    disabledParking?: boolean;
    contactlessPayment?: boolean;
    covered?: boolean;
  };
}

export interface ParkingScoreBreakdown {
  totalScore: number; // 0 to 100
  availabilityScore: number; // out of 40
  distanceScore: number; // out of 25
  priceScore: number; // out of 20
  openingScore: number; // out of 10
  freshnessScore: number; // out of 5
  reasons: {
    en: string[];
    tc: string[];
  };
}

export interface ScoredParkingLot {
  lot: ParkingLot;
  distanceMeters: number | null;
  walkingMinutes: number | null;
  scoreBreakdown: ParkingScoreBreakdown;
  selectedVacancy: Vacancy | null;
  vacancyStatus: VacancyStatus;
  freshness: FreshnessStatus;
  freshnessText: LocalizedString;
}

export interface FilterState {
  vehicleType: VehicleType;
  district: string; // 'ALL' or specific district code
  region: string; // 'ALL' | 'HK_ISLAND' | 'KOWLOON' | 'NEW_TERRITORIES'
  openingStatusOnly: boolean;
  onlyWithVacancy: boolean;
  maxDistanceKm: number; // e.g. 1, 2, 5, or Infinity
  maxHourlyRate: number; // e.g. 50, or Infinity
  evChargingOnly: boolean;
  limitToMapZone: boolean; // limit search and carpark results to the zones visible in the map
}

export interface Destination {
  id: string;
  name: LocalizedString;
  district: LocalizedString;
  latitude: number;
  longitude: number;
  popular?: boolean;
}
