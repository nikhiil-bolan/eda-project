"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStations = getStations;
exports.getStationById = getStationById;
exports.getNearbyStations = getNearbyStations;
const db_1 = __importDefault(require("../db"));
const haversine_1 = require("../utils/haversine");
async function getStations(req, res) {
    try {
        const { search, city, state, status, connectorType, maxPrice } = req.query;
        const where = {};
        if (city && typeof city === 'string' && city !== 'All') {
            where.city = { contains: city };
        }
        if (state && typeof state === 'string' && state !== 'All') {
            where.state = { contains: state };
        }
        if (status && typeof status === 'string' && status !== 'All') {
            where.status = status;
        }
        let stations = await db_1.default.chargingStation.findMany({
            where,
            include: {
                connectors: true
            },
            orderBy: { name: 'asc' }
        });
        // In-memory filter for text search across name, address, and operator
        if (search && typeof search === 'string') {
            const q = search.toLowerCase();
            stations = stations.filter(s => s.name.toLowerCase().includes(q) ||
                s.operator.toLowerCase().includes(q) ||
                s.address.toLowerCase().includes(q) ||
                s.city.toLowerCase().includes(q));
        }
        // Filter by connectorType if specified
        if (connectorType && typeof connectorType === 'string' && connectorType !== 'All') {
            stations = stations.filter(s => s.connectors.some(c => c.connectorType.toLowerCase() === connectorType.toLowerCase()));
        }
        // Filter by maxPrice
        if (maxPrice) {
            const maxP = parseFloat(maxPrice);
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
    }
    catch (error) {
        console.error('getStations error:', error);
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Unable to retrieve charging stations.' }
        });
    }
}
async function getStationById(req, res) {
    try {
        const id = req.params.id;
        const station = await db_1.default.chargingStation.findUnique({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Unable to fetch station details.' }
        });
    }
}
async function getNearbyStations(req, res) {
    try {
        const { lat, lng, radius } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                error: { code: 'MISSING_COORDINATES', message: 'Latitude and longitude query parameters are required.' }
            });
        }
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const radiusKm = radius ? parseFloat(radius) : 50.0;
        const stations = await db_1.default.chargingStation.findMany({
            include: {
                connectors: true
            }
        });
        const stationsWithDistance = stations
            .map(station => {
            const distance = (0, haversine_1.calculateHaversineDistance)(userLat, userLng, station.latitude, station.longitude);
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error computing nearby charging stations.' }
        });
    }
}
