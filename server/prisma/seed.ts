import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting EVision Database Seeding ---');

  // 1. Clean existing records
  await prisma.notification.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.chargingHistory.deleteMany();
  await prisma.favoriteStation.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.connector.deleteMany();
  await prisma.chargingStation.deleteMany();
  await prisma.infrastructureData.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const driverPasswordHash = await bcrypt.hash('driver123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Anand Verma',
      email: 'admin@evision.gov.in',
      phone: '+91 98765 43210',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      city: 'New Delhi',
      state: 'Delhi',
      preferredLanguage: 'en'
    }
  });

  const driverUser = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'driver@evision.gov.in',
      phone: '+91 98123 45678',
      passwordHash: driverPasswordHash,
      role: 'USER',
      city: 'Mumbai',
      state: 'Maharashtra',
      evModel: 'Tata Nexon EV Max',
      preferredLanguage: 'en'
    }
  });

  console.log(`Seeded 2 Users: ${adminUser.email} (ADMIN), ${driverUser.email} (USER)`);

  // 3. Seed Master EV Dataset (192 records)
  const masterDatasetPath = path.resolve(__dirname, '../../data/processed/master_ev_dataset.csv');
  if (fs.existsSync(masterDatasetPath)) {
    const fileContent = fs.readFileSync(masterDatasetPath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(',').map(v => v.trim());
      
      const record: any = {};
      headers.forEach((header, idx) => {
        record[header] = values[idx];
      });

      records.push({
        state: record['State'],
        year: parseInt(record['Year'], 10) || 2025,
        registrations2W: parseFloat(record['Registrations_2W']) || 0,
        registrations3W: parseFloat(record['Registrations_3W']) || 0,
        registrations4W: parseFloat(record['Registrations_4W']) || 0,
        registrationsBus: parseFloat(record['Registrations_Bus']) || 0,
        totalEVRegistrations: parseFloat(record['Total_EV_Registrations']) || 0,
        publicChargingStations: parseFloat(record['Public_Charging_Stations']) || 0,
        slowChargers: parseFloat(record['Slow_Chargers']) || 0,
        fastChargers: parseFloat(record['Fast_Chargers']) || 0,
        populationMillion: parseFloat(record['Population_Million']) || 0,
        areaSqKm: parseFloat(record['Area_Sq_Km']) || 0,
        urbanizationPercentage: parseFloat(record['Urbanization_Percentage']) || 0,
        gdpTier: record['GDP_Tier'] || 'Medium',
        evGrowthYoYPct: parseFloat(record['EV_Growth_YoY_Pct']) || 0,
        chargerGrowthYoYPct: parseFloat(record['Charger_Growth_YoY_Pct']) || 0,
        evToChargerRatio: parseFloat(record['EV_to_Charger_Ratio']) || 0,
        evDensityPerSqKm: parseFloat(record['EV_Density_per_SqKm']) || 0,
        chargersPerMillionPop: parseFloat(record['Chargers_per_Million_Pop']) || 0,
        gapScore: parseFloat(record['Gap_Score']) || 0,
        gapTier: record['Gap_Tier'] || 'Moderate'
      });
    }

    await prisma.infrastructureData.createMany({
      data: records
    });

    console.log(`Seeded ${records.length} longitudinal records from master_ev_dataset.csv`);
  }

  // 4. Seed Charging Stations with Connectors
  const stationsData = [
    {
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
      amenities: '24/7 Security, Restroom, Coffee Shop Nearby, CCTV Surveillance',
      connectors: [
        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.5, status: 'AVAILABLE' },
        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.5, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 22.0, pricePerKWh: 14.0, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 7.2, pricePerKWh: 12.0, status: 'AVAILABLE' }
      ]
    },
    {
      name: 'Statiq Charging Hub - Lower Parel',
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
        { connectorType: 'CCS2', powerKW: 120.0, pricePerKWh: 19.5, status: 'AVAILABLE' },
        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.0, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 11.0, pricePerKWh: 13.5, status: 'OCCUPIED' }
      ]
    },
    {
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
      contactNumber: '+91 20 4567 8900',
      totalConnectors: 4,
      availableConnectors: 3,
      status: 'ACTIVE',
      amenities: 'Highway Eatery, 24/7 Service, Restroom, EV Tire Inflation',
      connectors: [
        { connectorType: 'CCS2', powerKW: 50.0, pricePerKWh: 17.5, status: 'AVAILABLE' },
        { connectorType: 'CCS2', powerKW: 50.0, pricePerKWh: 17.5, status: 'AVAILABLE' },
        { connectorType: 'GB/T', powerKW: 15.0, pricePerKWh: 12.5, status: 'AVAILABLE' }
      ]
    },
    {
      name: 'Ather Grid & Shell Recharge - Koramangala',
      operator: 'Shell / Ather Grid',
      address: '100 Feet Road, 4th Block, Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034',
      latitude: 12.9352,
      longitude: 77.6245,
      openingTime: '00:00',
      closingTime: '23:59',
      contactNumber: '+91 80 2553 4567',
      totalConnectors: 6,
      availableConnectors: 5,
      status: 'ACTIVE',
      amenities: '2W & 4W Fast Charging, Shell Select Store, Free WiFi, Cafe',
      connectors: [
        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 17.0, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 22.0, pricePerKWh: 13.5, status: 'AVAILABLE' },
        { connectorType: 'AC-001', powerKW: 3.3, pricePerKWh: 10.0, status: 'AVAILABLE' }
      ]
    },
    {
      name: 'ChargeZone Hypercharging Station - Whitefield',
      operator: 'ChargeZone',
      address: 'ITPL Main Road, Next to Inorbit Mall, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      latitude: 12.9847,
      longitude: 77.7289,
      openingTime: '00:00',
      closingTime: '23:59',
      contactNumber: '+91 80 6789 0123',
      totalConnectors: 8,
      availableConnectors: 6,
      status: 'ACTIVE',
      amenities: 'Hyper-Fast 150kW, Lounge, Commercial Fleet Bay, Restroom',
      connectors: [
        { connectorType: 'CCS2', powerKW: 150.0, pricePerKWh: 20.0, status: 'AVAILABLE' },
        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 17.5, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 22.0, pricePerKWh: 14.0, status: 'AVAILABLE' }
      ]
    },
    {
      name: 'Delhi Transco / Tata Power - Connaught Place',
      operator: 'Delhi Transco Limited',
      address: 'Inner Circle, Near Rajiv Chowk Gate 2, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      latitude: 28.6315,
      longitude: 77.2167,
      openingTime: '00:00',
      closingTime: '23:59',
      contactNumber: '+91 11 2341 5678',
      totalConnectors: 8,
      availableConnectors: 5,
      status: 'ACTIVE',
      amenities: 'Metro Connectivity, Subsidized Public Tariff, 24/7 Security',
      connectors: [
        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 16.0, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 7.2, pricePerKWh: 11.0, status: 'AVAILABLE' },
        { connectorType: 'AC-001', powerKW: 3.3, pricePerKWh: 9.5, status: 'AVAILABLE' }
      ]
    },
    {
      name: 'Fortum Charge & Drive - Saket District Centre',
      operator: 'Fortum India',
      address: 'Select Citywalk Parking B2, Saket District Centre',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      latitude: 28.5283,
      longitude: 77.2185,
      openingTime: '09:00',
      closingTime: '23:00',
      contactNumber: '+91 11 4567 8901',
      totalConnectors: 6,
      availableConnectors: 2,
      status: 'ACTIVE',
      amenities: 'Mall Amenities, Cinema, Food Court, Valet Parking',
      connectors: [
        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.5, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 22.0, pricePerKWh: 13.5, status: 'AVAILABLE' }
      ]
    },
    {
      name: 'Relux Electric Charging Station - Sector 62',
      operator: 'Relux Electric',
      address: 'Block B, Industrial Area, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201309',
      latitude: 28.6270,
      longitude: 77.3725,
      openingTime: '00:00',
      closingTime: '23:59',
      contactNumber: '+91 120 456 7890',
      totalConnectors: 6,
      availableConnectors: 4,
      status: 'ACTIVE',
      amenities: 'IT Park Convenience, 24/7 Guard, Filtered Water',
      connectors: [
        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 16.5, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 7.2, pricePerKWh: 11.5, status: 'AVAILABLE' }
      ]
    },
    {
      name: 'Magenta ChargeGrid - HITECH City',
      operator: 'Magenta Mobility',
      address: 'Cyber Towers Main Road, HITECH City',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      latitude: 17.4504,
      longitude: 78.3808,
      openingTime: '00:00',
      closingTime: '23:59',
      contactNumber: '+91 40 2311 0000',
      totalConnectors: 8,
      availableConnectors: 6,
      status: 'ACTIVE',
      amenities: '24/7 Open, IT Corridor, Restroom, High-Speed WiFi',
      connectors: [
        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 17.0, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 11.0, pricePerKWh: 12.5, status: 'AVAILABLE' }
      ]
    },
    {
      name: 'Zeon Charging Station - Anna Nagar',
      operator: 'Zeon Charging',
      address: '2nd Avenue, Near Tower Park, Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      latitude: 13.0850,
      longitude: 80.2101,
      openingTime: '06:00',
      closingTime: '23:00',
      contactNumber: '+91 44 2621 1234',
      totalConnectors: 4,
      availableConnectors: 3,
      status: 'ACTIVE',
      amenities: 'Park Nearby, Clean Restrooms, Coffee Vending Machine',
      connectors: [
        { connectorType: 'CCS2', powerKW: 50.0, pricePerKWh: 17.5, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 7.2, pricePerKWh: 12.0, status: 'AVAILABLE' }
      ]
    },
    {
      name: 'Jio-bp pulse Charging Station - Satellite',
      operator: 'Jio-bp pulse',
      address: 'Near Star Bazaar, Satellite Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380015',
      latitude: 23.0280,
      longitude: 72.5280,
      openingTime: '00:00',
      closingTime: '23:59',
      contactNumber: '+91 79 2692 3456',
      totalConnectors: 6,
      availableConnectors: 5,
      status: 'ACTIVE',
      amenities: 'Wild Bean Cafe, 24/7 Convenience Store, Air & Water',
      connectors: [
        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 17.0, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 22.0, pricePerKWh: 13.0, status: 'AVAILABLE' }
      ]
    },
    {
      name: 'CESC Green Energy Hub - Salt Lake Sector V',
      operator: 'CESC Limited',
      address: 'Ring Road, Near Webel Bhawan, Sector V, Salt Lake',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700091',
      latitude: 22.5800,
      longitude: 88.4350,
      openingTime: '07:00',
      closingTime: '23:00',
      contactNumber: '+91 33 2357 0000',
      totalConnectors: 4,
      availableConnectors: 3,
      status: 'ACTIVE',
      amenities: 'Solar Canopy, Tech Hub Location, Restroom',
      connectors: [
        { connectorType: 'CCS2', powerKW: 50.0, pricePerKWh: 16.0, status: 'AVAILABLE' },
        { connectorType: 'Type 2', powerKW: 7.2, pricePerKWh: 11.0, status: 'AVAILABLE' }
      ]
    }
  ];

  let seededStationCount = 0;
  let firstConnectorId = '';
  let firstStationId = '';

  for (const s of stationsData) {
    const { connectors, ...stationFields } = s;
    const station = await prisma.chargingStation.create({
      data: {
        ...stationFields,
        connectors: {
          create: connectors
        }
      },
      include: {
        connectors: true
      }
    });

    if (!firstStationId) {
      firstStationId = station.id;
      firstConnectorId = station.connectors[0].id;
    }
    seededStationCount++;
  }

  console.log(`Seeded ${seededStationCount} real Charging Stations with high-speed connectors`);

  // 5. Seed Demo Booking for Driver
  if (firstStationId && firstConnectorId) {
    const sampleBooking = await prisma.booking.create({
      data: {
        bookingReference: 'EVN-2026-849201',
        userId: driverUser.id,
        stationId: firstStationId,
        connectorId: firstConnectorId,
        bookingDate: '2026-09-20',
        startTime: '10:00',
        endTime: '11:00',
        durationHours: 1.0,
        amount: 220.0,
        vehicleType: '4-Wheeler (DC Fast)',
        status: 'CONFIRMED'
      }
    });

    await prisma.favoriteStation.create({
      data: {
        userId: driverUser.id,
        stationId: firstStationId
      }
    });

    await prisma.notification.create({
      data: {
        userId: driverUser.id,
        title: 'Booking Confirmed',
        message: 'Your slot at Tata Power EZ Charge BKC is confirmed for Sep 20, 10:00 AM.',
        type: 'BOOKING'
      }
    });

    await prisma.chargingHistory.create({
      data: {
        userId: driverUser.id,
        stationId: firstStationId,
        energyConsumed: 28.5,
        amount: 527.25,
        chargingDuration: '45 mins'
      }
    });

    console.log(`Seeded demo booking ${sampleBooking.bookingReference}, favorite, history, and notification.`);
  }

  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
