import { Router } from 'express';
import { register, login, getMe, forgotPassword } from '../controllers/authController';
import { getStations, getStationById, getNearbyStations } from '../controllers/stationController';
import { createBooking, getUserBookings, cancelBooking } from '../controllers/bookingController';
import { toggleFavorite, getUserFavorites } from '../controllers/favoriteController';
import {
  getOverviewKPIs,
  getEVGrowthTrends,
  getGapAnalysis,
  getEDADiagnostics,
  getMLForecasts
} from '../controllers/analyticsController';
import {
  getAllUsers,
  getAllBookings,
  createStation,
  updateStationStatus,
  exportCSVReport
} from '../controllers/adminController';
import { askAssistant } from '../controllers/assistantController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);
router.post('/auth/forgot-password', forgotPassword);

// --- Stations Routes ---
router.get('/stations', getStations);
router.get('/stations/nearby', getNearbyStations);
router.get('/stations/:id', getStationById);

// --- Booking Routes ---
router.post('/bookings', authenticateToken, createBooking);
router.get('/bookings/user', authenticateToken, getUserBookings);
router.patch('/bookings/:id/cancel', authenticateToken, cancelBooking);

// --- Favorites Routes ---
router.post('/favorites/toggle', authenticateToken, toggleFavorite);
router.get('/favorites/user', authenticateToken, getUserFavorites);

// --- Analytics Routes ---
router.get('/analytics/overview', getOverviewKPIs);
router.get('/analytics/growth', getEVGrowthTrends);
router.get('/analytics/gap-analysis', getGapAnalysis);
router.get('/analytics/eda', getEDADiagnostics);
router.get('/analytics/forecast', getMLForecasts);

// --- Assistant Routes ---
router.post('/assistant/ask', askAssistant);

// --- Admin Protected Routes ---
router.get('/admin/users', authenticateToken, requireAdmin, getAllUsers);
router.get('/admin/bookings', authenticateToken, requireAdmin, getAllBookings);
router.post('/admin/stations', authenticateToken, requireAdmin, createStation);
router.patch('/admin/stations/:id/status', authenticateToken, requireAdmin, updateStationStatus);
router.get('/admin/export', authenticateToken, requireAdmin, exportCSVReport);

export default router;
