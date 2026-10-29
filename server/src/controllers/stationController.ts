import { Request, Response } from 'express';
import prisma from '../db';
import { calculateHaversineDistance } from '../utils/haversine';

export async function getStations(req: Request, res: Response) {
  try {
    const { search, city, state, status, connectorType, maxPrice } = req.query;

    const where: any = {};

    if (city && typeof city === 'string' && city !== 'All') {
      where.city = { contains: city };
    }

    if (state && typeof state === 'string' && state !== 'All') {
      where.state = { contains: state };
    }

    if (status && typeof status === 'string' && status !== 'All') {
      where.status = status;
    }

    let stations = await prisma.chargingStation.findMany({
      where,
      include: {
        connectors: true
      },
      orderBy: { name: 'asc' }
    });

    // In-memory filter for text search across name, address, and operator
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      stations = stations.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.operator.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q)
      );
    }

    // Filter by connectorType if specified
    if (connectorType && typeof connectorType === 'string' && connectorType !== 'All') {
      stations = stations.filter(s =>
        s.connectors.some(c => c.connectorType.toLowerCase() === (connectorType as string).toLowerCase())
      );
    }

    // Filter by maxPrice
    if (maxPrice) {
      const maxP = parseFloat(maxPrice as string);
      if (!isNaN(maxP)) {
        stations = stations.filter(s => s.connectors.some(c => c.pricePerKWh <= maxP));
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        stations,
        count: stations.length
      }
    });
  } catch (error: any) {
    console.error('getStations error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Unable to retrieve charging stations.' }
    });
  }
}

export async function getStationById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const station = await prisma.chargingStation.findUnique({
      where: { id },
      include: {
        connectors: true,
        feedback: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        error: { code: 'STATION_NOT_FOUND', message: 'The requested station does not exist.' }
      });
    }

    return res.status(200).json({
      success: true,
      data: { station }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Unable to fetch station details.' }
    });
  }
}

export async function getNearbyStations(req: Request, res: Response) {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_COORDINATES', message: 'Latitude and longitude query parameters are required.' }
      });
    }

    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);
    const radiusKm = radius ? parseFloat(radius as string) : 50.0;

    const stations = await prisma.chargingStation.findMany({
      include: {
        connectors: true
      }
    });

    const stationsWithDistance = stations
      .map(station => {
        const distance = calculateHaversineDistance(userLat, userLng, station.latitude, station.longitude);
        return {
          ...station,
          distanceKm: distance
        };
      })
      .filter(station => station.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return res.status(200).json({
      success: true,
      data: {
        userLocation: { lat: userLat, lng: userLng },
        radiusKm,
        stations: stationsWithDistance,
        count: stationsWithDistance.length
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Error computing nearby charging stations.' }
    });
  }
}
