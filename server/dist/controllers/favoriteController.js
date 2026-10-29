"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavorite = toggleFavorite;
exports.getUserFavorites = getUserFavorites;
const db_1 = __importDefault(require("../db"));
async function toggleFavorite(req, res) {
    try {
        const userId = req.user?.id;
        const { stationId } = req.body;
        if (!userId || !stationId) {
            return res.status(400).json({
                success: false,
                error: { code: 'MISSING_DATA', message: 'User and Station ID are required.' }
            });
        }
        const existing = await db_1.default.favoriteStation.findUnique({
            where: {
                userId_stationId: { userId, stationId }
            }
        });
        if (existing) {
            await db_1.default.favoriteStation.delete({
                where: { id: existing.id }
            });
            return res.status(200).json({
                success: true,
                data: { isFavorite: false, message: 'Station removed from favorites.' }
            });
        }
        else {
            await db_1.default.favoriteStation.create({
                data: { userId, stationId }
            });
            return res.status(201).json({
                success: true,
                data: { isFavorite: true, message: 'Station added to favorites.' }
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Unable to update favorites.' }
        });
    }
}
async function getUserFavorites(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } });
        }
        const favorites = await db_1.default.favoriteStation.findMany({
            where: { userId },
            include: {
                station: {
                    include: {
                        connectors: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json({
            success: true,
            data: { favorites }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Unable to fetch favorites.' }
        });
    }
}
