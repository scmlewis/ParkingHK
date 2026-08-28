/** Types for the HKSAR Transport Department car park API responses */

export interface GovCarparkInfoItem {
  park_Id?: string;
  parkId?: string;
  name?: string;
  district?: string;
  displayAddress?: string;
  address?: {
    dcDistrict?: string;
  };
  latitude?: number | string;
  longitude?: number | string;
  opening_status?: string;
  contactNo?: string;
  website?: string;
  facilities?: string[];
  paymentMethods?: string[];
  heightLimits?: Array<{ height?: number }>;
  privateCar?: {
    space?: number;
    spaceEV?: number;
    spaceDIS?: number;
    hourlyCharges?: Array<{ price?: number }>;
  };
  motorCycle?: {
    space?: number;
    hourlyCharges?: Array<{ price?: number }>;
  };
  LGV?: {
    space?: number;
    hourlyCharges?: Array<{ price?: number }>;
  };
  HGV?: {
    space?: number;
    hourlyCharges?: Array<{ price?: number }>;
  };
  coach?: {
    space?: number;
    hourlyCharges?: Array<{ price?: number }>;
  };
}

export interface GovCarparkResponse {
  results?: GovCarparkInfoItem[];
}

export interface GovVacancyItem {
  park_Id?: string;
  parkId?: string;
  privateCar?: Array<{
    vacancy?: number;
    vacancy_type?: string;
    lastupdate?: string;
  }>;
  motorCycle?: Array<{
    vacancy?: number;
    vacancy_type?: string;
    lastupdate?: string;
  }>;
  LGV?: Array<{
    vacancy?: number;
    vacancy_type?: string;
    lastupdate?: string;
  }>;
  HGV?: Array<{
    vacancy?: number;
    vacancy_type?: string;
    lastupdate?: string;
  }>;
  coach?: Array<{
    vacancy?: number;
    vacancy_type?: string;
    lastupdate?: string;
  }>;
}

export interface GovVacancyResponse {
  results?: GovVacancyItem[];
}
