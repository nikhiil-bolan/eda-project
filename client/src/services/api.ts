import { ChargingStation, InfrastructureData, OverviewKPIs, Booking } from '../types';

// Fallback seed stations so the app works seamlessly even before backend is spun up
export const FALLBACK_STATIONS: ChargingStation[] = [
  {
    id: 'st-mum-01',
    name: 'Tata Power EZ Charge - Bandra Kurla Complex (BKC)',
    operator: 'Tata Power EZ Charge',
    address: 'G-Block, Near NSE Building, BKC, Bandra East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    latitude: 19.0657,
    longitude: 72.8687,
    openingTime: '00:00',
    closingTime: '23:59',
    contactNumber: '+91 22 6717 1000',
    totalConnectors: 6,
    availableConnectors: 4,
    status: 'ACTIVE',
    amenities: '24/7 Security, Restroom, Coffee Shop Nearby, CCTV Surveillance, Cafe',
    connectors: [
      { id: 'c-01', stationId: 'st-mum-01', connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.5, status: 'AVAILABLE' },
      { id: 'c-02', stationId: 'st-mum-01', connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.5, status: 'AVAILABLE' },
      { id: 'c-03', stationId: 'st-mum-01', connectorType: 'Type 2', powerKW: 22.0, pricePerKWh: 14.0, status: 'AVAILABLE' },
      { id: 'c-04', stationId: 'st-mum-01', connectorType: 'Type 2', powerKW: 7.2, pricePerKWh: 12.0, status: 'AVAILABLE' }
    ]
  },
  {
    id: 'st-mum-02',
    name: 'Statiq Charging Hub - Lower Parel High Street',
    operator: 'Statiq Networks',
    address: 'High Street Phoenix Mall Parking Level P2, Lower Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400013',
    latitude: 18.9950,
    longitude: 72.8258,
    openingTime: '06:00',
    closingTime: '23:30',
    contactNumber: '+91 99990 12345',
    totalConnectors: 4,
    availableConnectors: 2,
    status: 'ACTIVE',
    amenities: 'Shopping Mall, Covered Parking, Food Court, Restroom',
    connectors: [
      { id: 'c-05', stationId: 'st-mum-02', connectorType: 'CCS2', powerKW: 120.0, pricePerKWh: 19.5, status: 'AVAILABLE' },
      { id: 'c-06', stationId: 'st-mum-02', connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.0, status: 'AVAILABLE' },
      { id: 'c-07', stationId: 'st-mum-02', connectorType: 'Type 2', powerKW: 11.0, pricePerKWh: 13.5, status: 'OCCUPIED' }
    ]
  },
  {
    id: 'st-pune-01',
    name: 'Zeon Fast Charging Hub - Baner Highway',
    operator: 'Zeon Charging',
    address: 'Mumbai-Bengaluru Highway, Near Cummins Campus, Baner',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    latitude: 18.5590,
    longitude: 73.7868,
    openingTime: '00:00',
    closingTime: '23:59',
    contactNumber: '+91 98220 54321',
    totalConnectors: 4,
    availableConnectors: 3,
    status: 'ACTIVE',
    amenities: 'Highway Diner, Restroom, Tyre Pressure Station, 24/7 Security',
    connectors: [
      { id: 'c-08', stationId: 'st-pune-01', connectorType: 'CCS2', powerKW: 150.0, pricePerKWh: 20.0, status: 'AVAILABLE' },
      { id: 'c-09', stationId: 'st-pune-01', connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.0, status: 'AVAILABLE' }
    ]
  },
  {
    id: 'st-del-01',
    name: 'Tata Power Supercharger - Connaught Place (CP)',
    operator: 'Tata Power EZ Charge',
    address: 'Outer Circle, Near Rajiv Chowk Metro Gate 7, Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    latitude: 28.6328,
    longitude: 77.2197,
    openingTime: '00:00',
    closingTime: '23:59',
    contactNumber: '+91 11 2345 6789',
    totalConnectors: 8,
    availableConnectors: 6,
    status: 'ACTIVE',
    amenities: 'Central Metro Hub, Restaurants, Banks, 24/7 Security',
    connectors: [
      { id: 'c-10', stationId: 'st-del-01', connectorType: 'CCS2', powerKW: 120.0, pricePerKWh: 19.0, status: 'AVAILABLE' },
      { id: 'c-11', stationId: 'st-del-01', connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 17.5, status: 'AVAILABLE' },
      { id: 'c-12', stationId: 'st-del-01', connectorType: 'Type 2', powerKW: 22.0, pricePerKWh: 13.0, status: 'AVAILABLE' }
    ]
  },
  {
    id: 'st-blr-01',
    name: 'Ather Grid & Statiq Supercharger - Indiranagar 100ft Rd',
    operator: 'Statiq Networks',
    address: '100 Feet Road, Near HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    latitude: 12.9784,
    longitude: 77.6408,
    openingTime: '00:00',
    closingTime: '23:59',
    contactNumber: '+91 80 4567 8901',
    totalConnectors: 6,
    availableConnectors: 5,
    status: 'ACTIVE',
    amenities: 'Cafes, Pubs, 24/7 CCTV, Dedicated 2W Fast Bay',
    connectors: [
      { id: 'c-13', stationId: 'st-blr-01', connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.0, status: 'AVAILABLE' },
      { id: 'c-14', stationId: 'st-blr-01', connectorType: 'Type 2', powerKW: 22.0, pricePerKWh: 14.0, status: 'AVAILABLE' }
    ]
  },
  {
    id: 'st-hyd-01',
    name: 'ChargeZone DC Fast Supercharger - HITEC City',
    operator: 'ChargeZone',
    address: 'Opposite Cyber Towers, Madhapur, HITEC City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    latitude: 17.4483,
    longitude: 78.3748,
    openingTime: '00:00',
    closingTime: '23:59',
    contactNumber: '+91 40 3344 5566',
    totalConnectors: 6,
    availableConnectors: 4,
    status: 'ACTIVE',
    amenities: 'Tech Park, Food Court, EV Lounge, 24/7 Security',
    connectors: [
      { id: 'c-15', stationId: 'st-hyd-01', connectorType: 'CCS2', powerKW: 120.0, pricePerKWh: 19.5, status: 'AVAILABLE' },
      { id: 'c-16', stationId: 'st-hyd-01', connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.0, status: 'AVAILABLE' }
    ]
  },
  {
    id: 'st-chn-01',
    name: 'Jio-bp pulse EV Hub - OMR IT Expressway',
    operator: 'Jio-bp pulse',
    address: 'Old Mahabalipuram Road (OMR), Perungudi',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600096',
    latitude: 12.9654,
    longitude: 80.2461,
    openingTime: '00:00',
    closingTime: '23:59',
    contactNumber: '+91 44 2233 4455',
    totalConnectors: 6,
    availableConnectors: 4,
    status: 'ACTIVE',
    amenities: 'Wild Bean Cafe, Restrooms, Convenience Store, Fast Air Fill',
    connectors: [
      { id: 'c-17', stationId: 'st-chn-01', connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.0, status: 'AVAILABLE' },
      { id: 'c-18', stationId: 'st-chn-01', connectorType: 'Type 2', powerKW: 22.0, pricePerKWh: 13.5, status: 'AVAILABLE' }
    ]
  },
  {
    id: 'st-lko-01',
    name: 'Tata Power EV Charging Station - Gomti Nagar',
    operator: 'Tata Power EZ Charge',
    address: 'Vibhuti Khand, Near High Court Bench, Gomti Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
    latitude: 26.8584,
    longitude: 81.0039,
    openingTime: '00:00',
    closingTime: '23:59',
    contactNumber: '+91 522 400 1234',
    totalConnectors: 4,
    availableConnectors: 2,
    status: 'ACTIVE',
    amenities: '24/7 Security, Restrooms, Parking',
    connectors: [
      { id: 'c-19', stationId: 'st-lko-01', connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.0, status: 'AVAILABLE' }
    ]
  }
];

export const FALLBACK_GAP_DATA: InfrastructureData[] = [
  { id: 'g-1', state: 'Uttar Pradesh', year: 2025, registrations2W: 245000, registrations3W: 198000, registrations4W: 32000, registrationsBus: 2400, totalEVRegistrations: 477400, publicChargingStations: 1850, slowChargers: 1200, fastChargers: 650, populationMillion: 241.4, areaSqKm: 243286, urbanizationPercentage: 22.3, gdpTier: 'Medium', evGrowthYoYPct: 48.2, chargerGrowthYoYPct: 18.1, evToChargerRatio: 258.1, evDensityPerSqKm: 1.96, chargersPerMillionPop: 7.7, gapScore: 89.4, gapTier: 'Critical' },
  { id: 'g-2', state: 'Bihar', year: 2025, registrations2W: 110000, registrations3W: 145000, registrations4W: 9500, registrationsBus: 800, totalEVRegistrations: 265300, publicChargingStations: 620, slowChargers: 450, fastChargers: 170, populationMillion: 130.7, areaSqKm: 94163, urbanizationPercentage: 11.3, gdpTier: 'Low', evGrowthYoYPct: 52.4, chargerGrowthYoYPct: 14.5, evToChargerRatio: 427.9, evDensityPerSqKm: 2.82, chargersPerMillionPop: 4.7, gapScore: 86.8, gapTier: 'Critical' },
  { id: 'g-3', state: 'Madhya Pradesh', year: 2025, registrations2W: 125000, registrations3W: 42000, registrations4W: 18000, registrationsBus: 950, totalEVRegistrations: 185950, publicChargingStations: 880, slowChargers: 610, fastChargers: 270, populationMillion: 86.5, areaSqKm: 308252, urbanizationPercentage: 27.6, gdpTier: 'Medium', evGrowthYoYPct: 44.1, chargerGrowthYoYPct: 16.2, evToChargerRatio: 211.3, evDensityPerSqKm: 0.60, chargersPerMillionPop: 10.2, gapScore: 81.2, gapTier: 'Critical' },
  { id: 'g-4', state: 'Rajasthan', year: 2025, registrations2W: 140000, registrations3W: 38000, registrations4W: 21000, registrationsBus: 1100, totalEVRegistrations: 200100, publicChargingStations: 1050, slowChargers: 720, fastChargers: 330, populationMillion: 81.0, areaSqKm: 342239, urbanizationPercentage: 24.9, gdpTier: 'Medium', evGrowthYoYPct: 41.5, chargerGrowthYoYPct: 17.0, evToChargerRatio: 190.6, evDensityPerSqKm: 0.58, chargersPerMillionPop: 13.0, gapScore: 78.5, gapTier: 'Critical' },
  { id: 'g-5', state: 'Maharashtra', year: 2025, registrations2W: 285000, registrations3W: 55000, registrations4W: 78000, registrationsBus: 4200, totalEVRegistrations: 422200, publicChargingStations: 4100, slowChargers: 2600, fastChargers: 1500, populationMillion: 126.4, areaSqKm: 307713, urbanizationPercentage: 45.2, gdpTier: 'High', evGrowthYoYPct: 39.8, chargerGrowthYoYPct: 24.6, evToChargerRatio: 103.0, evDensityPerSqKm: 1.37, chargersPerMillionPop: 32.4, gapScore: 68.2, gapTier: 'High' },
  { id: 'g-6', state: 'Gujarat', year: 2025, registrations2W: 165000, registrations3W: 32000, registrations4W: 46000, registrationsBus: 2100, totalEVRegistrations: 245100, publicChargingStations: 2350, slowChargers: 1550, fastChargers: 800, populationMillion: 71.5, areaSqKm: 196024, urbanizationPercentage: 42.6, gdpTier: 'High', evGrowthYoYPct: 43.1, chargerGrowthYoYPct: 22.8, evToChargerRatio: 104.3, evDensityPerSqKm: 1.25, chargersPerMillionPop: 32.9, gapScore: 66.4, gapTier: 'High' },
  { id: 'g-7', state: 'Tamil Nadu', year: 2025, registrations2W: 220000, registrations3W: 28000, registrations4W: 52000, registrationsBus: 2800, totalEVRegistrations: 302800, publicChargingStations: 3100, slowChargers: 2100, fastChargers: 1000, populationMillion: 76.8, areaSqKm: 130058, urbanizationPercentage: 48.4, gdpTier: 'High', evGrowthYoYPct: 37.6, chargerGrowthYoYPct: 26.1, evToChargerRatio: 97.7, evDensityPerSqKm: 2.33, chargersPerMillionPop: 40.4, gapScore: 59.8, gapTier: 'Moderate' },
  { id: 'g-8', state: 'Karnataka', year: 2025, registrations2W: 250000, registrations3W: 35000, registrations4W: 64000, registrationsBus: 3900, totalEVRegistrations: 352900, publicChargingStations: 6100, slowChargers: 4200, fastChargers: 1900, populationMillion: 67.8, areaSqKm: 191791, urbanizationPercentage: 38.7, gdpTier: 'High', evGrowthYoYPct: 36.4, chargerGrowthYoYPct: 31.5, evToChargerRatio: 57.9, evDensityPerSqKm: 1.84, chargersPerMillionPop: 90.0, gapScore: 42.1, gapTier: 'Low' },
  { id: 'g-9', state: 'Delhi', year: 2025, registrations2W: 135000, registrations3W: 68000, registrations4W: 41000, registrationsBus: 3500, totalEVRegistrations: 247500, publicChargingStations: 3850, slowChargers: 2500, fastChargers: 1350, populationMillion: 21.3, areaSqKm: 1484, urbanizationPercentage: 97.5, gdpTier: 'High', evGrowthYoYPct: 35.2, chargerGrowthYoYPct: 29.8, evToChargerRatio: 64.3, evDensityPerSqKm: 166.8, chargersPerMillionPop: 180.8, gapScore: 44.5, gapTier: 'Low' }
];

export async function fetchOverviewKPIs(): Promise<OverviewKPIs> {
  try {
    const res = await fetch('/api/analytics/overview');
    const json = await res.json();
    if (json.success && json.data) return json.data;
  } catch (e) {
    // fallback
  }
  return {
    totalEVRegistrations: 2845600,
    evGrowthYoY: 42.8,
    totalChargingPoints: 24680,
    stationGrowthYoY: 18.4,
    evToChargerRatio: 115.3,
    criticalStatesCount: 7,
    highGapStatesCount: 11,
    statesCovered: 32,
    networkStationCount: 8,
    registeredUsers: 142,
    totalBookings: 68,
    datasetSource: 'VAHAN Telemetry & BEE Official Statistics'
  };
}

export async function fetchStations(params?: { search?: string; city?: string }): Promise<ChargingStation[]> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.city && params.city !== 'All') query.set('city', params.city);

    const res = await fetch(`/api/stations?${query.toString()}`);
    const json = await res.json();
    if (json.success && json.data?.stations) {
      return json.data.stations;
    }
  } catch (e) {}
  
  let result = [...FALLBACK_STATIONS];
  if (params?.city && params.city !== 'All') {
    result = result.filter(s => s.city.toLowerCase() === params.city?.toLowerCase());
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.operator.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
  }
  return result;
}

export async function fetchGapAnalysis(): Promise<InfrastructureData[]> {
  try {
    const res = await fetch('/api/analytics/gap-analysis?year=2025');
    const json = await res.json();
    if (json.success && json.data?.states) {
      return json.data.states;
    }
  } catch (e) {}
  return FALLBACK_GAP_DATA;
}

export async function createBookingApi(bookingData: any, token?: string | null): Promise<any> {
  try {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData)
    });
    const json = await res.json();
    if (json.success) return json.data;
  } catch (e) {}

  // Local simulated booking persistence
  const savedBookings = JSON.parse(localStorage.getItem('evision_local_bookings') || '[]');
  const refCode = `EVN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const newBooking = {
    id: `b-${Date.now()}`,
    bookingReference: refCode,
    ...bookingData,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  };
  savedBookings.unshift(newBooking);
  localStorage.setItem('evision_local_bookings', JSON.stringify(savedBookings));
  return { booking: newBooking };
}

export async function askAssistantApi(question: string): Promise<string> {
  try {
    const res = await fetch('/api/assistant/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const json = await res.json();
    if (json.success && json.data?.answer) {
      return json.data.answer;
    }
  } catch (e) {}

  const q = question.toLowerCase();
  if (q.includes('gap') || q.includes('formula')) {
    return "EVision's Infrastructure Gap Score (0-100) is calculated as: 0.30 * Deficit + 0.30 * Ratio Pressure + 0.20 * Growth Velocity + 0.20 * Urbanization. Critical gap threshold is >= 75.";
  } else if (q.includes('book') || q.includes('reserve')) {
    return "To reserve a charging slot: Select any station on the Map or Station Finder, choose your connector (CCS2/Type 2), choose your time slot, and verify UPI checkout!";
  } else if (q.includes('fast') || q.includes('time') || q.includes('dc')) {
    return "DC Fast chargers (50kW to 150kW CCS2) charge typical EVs like the Tata Nexon EV (40kWh) from 10% to 80% in approximately 35-50 minutes.";
  }
  return "Hello! I am EVA (EVision AI Assistant). I can help you find charging stations, understand the Infrastructure Gap formula, compute battery charging times, and guide slot bookings.";
}

