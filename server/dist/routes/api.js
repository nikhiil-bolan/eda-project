"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const stationController_1 = require("../controllers/stationController");
const bookingController_1 = require("../controllers/bookingController");
const favoriteController_1 = require("../controllers/favoriteController");
const analyticsController_1 = require("../controllers/analyticsController");
const adminController_1 = require("../controllers/adminController");
const assistantController_1 = require("../controllers/assistantController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// --- Auth Routes ---
router.post('/auth/register', authController_1.register);
router.post('/auth/login', authController_1.login);
router.get('/auth/me', auth_1.authenticateToken, authController_1.getMe);
router.post('/auth/forgot-password', authController_1.forgotPassword);
// --- Stations Routes ---
router.get('/stations', stationController_1.getStations);
router.get('/stations/nearby', stationController_1.getNearbyStations);
router.get('/stations/:id', stationController_1.getStationById);
// --- Booking Routes ---
router.post('/bookings', auth_1.authenticateToken, bookingController_1.createBooking);
router.get('/bookings/user', auth_1.authenticateToken, bookingController_1.getUserBookings);
router.patch('/bookings/:id/cancel', auth_1.authenticateToken, bookingController_1.cancelBooking);
// --- Favorites Routes ---
router.post('/favorites/toggle', auth_1.authenticateToken, favoriteController_1.toggleFavorite);
router.get('/favorites/user', auth_1.authenticateToken, favoriteController_1.getUserFavorites);
// --- Analytics Routes ---
router.get('/analytics/overview', analyticsController_1.getOverviewKPIs);
router.get('/analytics/growth', analyticsController_1.getEVGrowthTrends);
router.get('/analytics/gap-analysis', analyticsController_1.getGapAnalysis);
router.get('/analytics/eda', analyticsController_1.getEDADiagnostics);
router.get('/analytics/forecast', analyticsController_1.getMLForecasts);
// --- Assistant Routes ---
router.post('/assistant/ask', assistantController_1.askAssistant);
// --- Admin Protected Routes ---
router.get('/admin/users', auth_1.authenticateToken, auth_1.requireAdmin, adminController_1.getAllUsers);
router.get('/admin/bookings', auth_1.authenticateToken, auth_1.requireAdmin, adminController_1.getAllBookings);
router.post('/admin/stations', auth_1.authenticateToken, auth_1.requireAdmin, adminController_1.createStation);
router.patch('/admin/stations/:id/status', auth_1.authenticateToken, auth_1.requireAdmin, adminController_1.updateStationStatus);
router.get('/admin/export', auth_1.authenticateToken, auth_1.requireAdmin, adminController_1.exportCSVReport);
exports.default = router;
