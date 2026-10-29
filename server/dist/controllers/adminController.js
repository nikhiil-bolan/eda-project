"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getAllBookings = getAllBookings;
exports.createStation = createStation;
exports.updateStationStatus = updateStationStatus;
exports.exportCSVReport = exportCSVReport;
const db_1 = __importDefault(require("../db"));
async function getAllUsers(req, res) {
    try {
        const users = await db_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                city: true,
                state: true,
                evModel: true,
                createdAt: true,
                _count: {
                    select: {
                        bookings: true,
                        favorites: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json({
            success: true,
            data: { users }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Unable to retrieve users.' }
        });
    }
}
async function getAllBookings(req, res) {
    try {
        const { status, stationId } = req.query;
        const where = {};
        if (status && typeof status === 'string' && status !== 'All') {
            where.status = status;
        }
        if (stationId && typeof stationId === 'string') {
            where.stationId = stationId;
        }
        const bookings = await db_1.default.booking.findMany({
            where,
            include: {
                user: {
                    select: { name: true, email: true, phone: true }
                },
                station: {
                    select: { name: true, city: true }
                },
                connector: {
                    select: { connectorType: true, powerKW: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json({
            success: true,
            data: { bookings }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Unable to fetch admin bookings.' }
        });
    }
}
async function createStation(req, res) {
    try {
        const { name, operator, address, city, state, pincode, latitude, longitude, openingTime, closingTime, contactNumber, amenities, connectors } = req.body;
        if (!name || !operator || !city || !state || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: { code: 'MISSING_FIELDS', message: 'Name, operator, city, state, latitude, and longitude are required.' }
            });
        }
        const station = await db_1.default.chargingStation.create({
            data: {
                name,
                operator,
                address: address || '',
                city,
                state,
                pincode: pincode || '',
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                openingTime: openingTime || '00:00',
                closingTime: closingTime || '23:59',
                contactNumber: contactNumber || '',
                amenities: amenities || '',
                connectors: {
                    create: connectors && connectors.length ? connectors : [
                        { connectorType: 'CCS2', powerKW: 60.0, pricePerKWh: 18.0, status: 'AVAILABLE' }
                    ]
                }
            },
            include: { connectors: true }
        });
        return res.status(201).json({
            success: true,
            data: { station }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to create charging station.' }
        });
    }
}
async function updateStationStatus(req, res) {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (!['ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_STATUS', message: 'Status must be ACTIVE, INACTIVE, or MAINTENANCE.' }
            });
        }
        const updated = await db_1.default.chargingStation.update({
            where: { id },
            data: { status }
        });
        return res.status(200).json({
            success: true,
            data: { station: updated }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Unable to update station status.' }
        });
    }
}
async function exportCSVReport(req, res) {
    try {
        const { type } = req.query;
        if (type === 'stations') {
            const stations = await db_1.default.chargingStation.findMany({
                include: { connectors: true }
            });
            let csv = 'ID,Name,Operator,City,State,Status,Connectors,Latitude,Longitude\n';
            stations.forEach(s => {
                const connTypes = s.connectors.map(c => c.connectorType).join(';');
                csv += `"${s.id}","${s.name}","${s.operator}","${s.city}","${s.state}","${s.status}","${connTypes}",${s.latitude},${s.longitude}\n`;
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="evision_stations_report.csv"');
            return res.send(csv);
        }
        else {
            // Default: Infrastructure master data
            const infra = await db_1.default.infrastructureData.findMany({
                where: { year: 2025 }
            });
            let csv = 'State,Year,EV_Registrations,Charging_Stations,EV_to_Charger_Ratio,Gap_Score,Gap_Tier\n';
            infra.forEach(r => {
                csv += `"${r.state}",${r.year},${r.totalEVRegistrations},${r.publicChargingStations},${r.evToChargerRatio},${r.gapScore},"${r.gapTier}"\n`;
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="evision_infrastructure_2025.csv"');
            return res.send(csv);
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to generate CSV export.' }
        });
    }
}
