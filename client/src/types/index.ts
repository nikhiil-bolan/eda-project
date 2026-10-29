export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'USER' | 'ADMIN';
  city?: string | null;
  state?: string | null;
  evModel?: string | null;
  preferredLanguage?: string;
}

export interface Connector {
  id: string;
  stationId: string;
  connectorType: string; // CCS2, Type 2, GB/T, CHAdeMO, AC-001
  powerKW: number;
  pricePerKWh: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface ChargingStation {
  id: string;
  name: string;
  operator: string;
  address: string;
  city: string;
  state: string;
  pincode?: string | null;
  latitude: number;
  longitude: number;
  openingTime: string;
  closingTime: string;
  contactNumber?: string | null;
  totalConnectors: number;
  availableConnectors: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  amenities?: string | null;
  connectors: Connector[];
  distanceKm?: number;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  stationId: string;
  connectorId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  amount: number;
  vehicleType?: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  station?: ChargingStation;
  connector?: Connector;
  createdAt?: string;
}

export interface InfrastructureData {
  id: string;
  state: string;
  year: number;
  registrations2W: number;
  registrations3W: number;
  registrations4W: number;
  registrationsBus: number;
  totalEVRegistrations: number;
  publicChargingStations: number;
  slowChargers: number;
  fastChargers: number;
  populationMillion: number;
  areaSqKm: number;
  urbanizationPercentage: number;
  gdpTier: string;
  evGrowthYoYPct: number;
  chargerGrowthYoYPct: number;
  evToChargerRatio: number;
  evDensityPerSqKm: number;
  chargersPerMillionPop: number;
  gapScore: number;
  gapTier: 'Critical' | 'High' | 'Moderate' | 'Low';
}

export interface OverviewKPIs {
  totalEVRegistrations: number;
  evGrowthYoY: number;
  totalChargingPoints: number;
  stationGrowthYoY: number;
  evToChargerRatio: number;
  criticalStatesCount: number;
  highGapStatesCount: number;
  statesCovered: number;
  networkStationCount: number;
  registeredUsers: number;
  totalBookings: number;
  datasetSource: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  city: string;
  state: string;
  accuracy?: number;
  isLive: boolean;
  capturedAt?: string;
}

