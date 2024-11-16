export interface UrlSet {
  appstore: string;
  deeplink: string;
  website: string;
  estimate: string;
  info: string;
  scheme: string;
}

export interface Currency {
  symbol: string;
  int_symbol: string;
  decimal_places: number;
}

export interface Company {
  handle: string;
  name: string;
  logo_url: string;
  promotions: any[];
}

export interface Filters {
  features: string[];
  comfort_level: string[];
  capacity: string[];
  provider: string[];
  service_class: string[];
}

export interface ServiceFeatures {
  listed: [string, string | null][];
  featured: any[];
}

export interface Service {
  name: string;
  type: string;
  company: Company;
  filters: Filters;
  features: ServiceFeatures;
  color: string;
  description: string;
  tagline: string | null;
}

export interface Entity {
  display_name: string;
  id: number;
  service_area: string;
}

export interface Commission {
  flat_rate: number | null;
  percentage: number;
}

export interface ExtraCharge {
  explanation: string;
  charge: number;
  percentage: number | null;
  charge_text: string;
  conforming: boolean;
  rideshare_fee: boolean;
}

export interface UberServiceData {
  entity: Entity;
  service: Service;
  url_sets: {
    ios: UrlSet;
    android: UrlSet;
    web: UrlSet;
  };
  product_id: string;
  commission: Commission;
  driver_hourly_pay: number | null;
  initial_charge: number;
  metered_charge: number;
  minimum_charge: number;
  total_fare: number;
  total_fare_low: number | null;
  total_fare_high: number | null;
  current_surge: number | null;
  time_estimate: number | null;
  extracharges: ExtraCharge[];
  flatrates: any[];
  currency: Currency;
  notes: string[];
  options: null;
  discount: null;
  fare_estimate_set: number;
}

export interface ServicePriceInfo {
  basePrice: number;          // initial_charge
  totalFare: number;          // total_fare
  priceRange?: {             // for services with price ranges
    low: number | null;
    high: number | null;
  };
  minimumCharge: number;      // minimum_charge
  extraCharges: {
    explanation: string;
    amount: number;
  }[];
  rateInfo: {
    perMile?: number;
    perMinute?: number;
  };
}

export interface ServiceSummary {
  name: string;
  capacity: number;
  pricing: ServicePriceInfo;
}