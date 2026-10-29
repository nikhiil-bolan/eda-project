import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLocation as useGeoLocation } from './context/LocationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LiveLocationModal } from './components/LiveLocationModal';

import { AuthPage } from './pages/AuthPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { StationFinder } from './pages/StationFinder';
import { MapView } from './pages/MapView';
import { StationDetailsBooking } from './pages/StationDetailsBooking';
import { MyBookings } from './pages/MyBookings';
import { GapAnalysis } from './pages/GapAnalysis';
import { DemandForecasting } from './pages/DemandForecasting';
import { PriorityPlanner } from './pages/PriorityPlanner';
import { EDAWorkspace } from './pages/EDAWorkspace';
import { TableauBIDashboard } from './pages/TableauBIDashboard';
import { BatteryCalculator } from './pages/BatteryCalculator';
import { Marketplace } from './pages/Marketplace';
import { DoorstepCharging } from './pages/DoorstepCharging';
import { AssistantChat } from './pages/AssistantChat';
import { AdminHub } from './pages/AdminHub';

// Protected Route Guard: If not signed in or guest, redirect to /auth
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { userLocation, showLocationModal, setShowLocationModal, requestLiveLocation } = useGeoLocation();
  const location = useLocation();

  // If user is authenticated and location has never been set, trigger location modal automatically
  useEffect(() => {
    if (isAuthenticated && !userLocation && location.pathname !== '/auth') {
      setShowLocationModal(true);
      requestLiveLocation();
    }
  }, [isAuthenticated, userLocation, location.pathname]);

  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      {!isAuthPage && <Navbar />}

      {/* Global Live GPS Location Calibration Modal */}
      <LiveLocationModal />

      <main className="flex-1">
        <Routes>
          {/* Public Auth Page */}
          <Route
            path="/auth"
            element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
          />

          {/* Protected Routes (Require Authentication or Guest Session) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stations"
            element={
              <ProtectedRoute>
                <StationFinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/station/:id"
            element={
              <ProtectedRoute>
                <StationDetailsBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gap-analysis"
            element={
              <ProtectedRoute>
                <GapAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forecasting"
            element={
              <ProtectedRoute>
                <DemandForecasting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planner"
            element={
              <ProtectedRoute>
                <PriorityPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eda"
            element={
              <ProtectedRoute>
                <EDAWorkspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tableau"
            element={
              <ProtectedRoute>
                <TableauBIDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bi-dashboard"
            element={
              <ProtectedRoute>
                <TableauBIDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calculator"
            element={
              <ProtectedRoute>
                <BatteryCalculator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doorstep"
            element={
              <ProtectedRoute>
                <DoorstepCharging />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AssistantChat />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Desk */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminHub />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
};

