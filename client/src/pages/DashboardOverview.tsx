import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { fetchOverviewKPIs, fetchStations } from '../services/api';
import { OverviewKPIs, ChargingStation } from '../types';
import {
  Zap,
  MapPin,
  TrendingUp,
  AlertTriangle,
  BatteryCharging,
  Navigation,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  Search,
  Compass,
  CreditCard
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const { userLocation, calculateDistance, setShowLocationModal } = useLocation();

  const [kpis, setKpis] = useState<OverviewKPIs | null>(null);
  const [nearbyStations, setNearbyStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      const [kpiData, stationData] = await Promise.all([
        fetchOverviewKPIs(),
        fetchStations()
      ]);
      setKpis(kpiData);

      // Sort stations by distance to user's live coordinates
      const withDist = stationData.map((st) => ({
        ...st,
        distanceKm: calculateDistance(st.latitude, st.longitude)
      }));
      withDist.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      setNearbyStations(withDist.slice(0, 4));
      setLoading(false);
    }
    loadDashboard();
  }, [userLocation]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Human-Centered Hero Banner */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-gradient-to-br from-teal-500/10 to-emerald-500/5 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live National Grid Telemetry Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome, {user?.name || 'Driver'} 👋
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              Real-time charging availability, spatial infrastructure deficit insights, and smart slot reservation across India.
            </p>
          </div>

          {/* Calibrated Location Status Card */}
          <div className="bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-600/20">
              <Navigation className="w-6 h-6" />
            </div>
            <div className="text-xs">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Calibrated GPS Hub</span>
              <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                {userLocation ? `${userLocation.city}, ${userLocation.state}` : 'Mumbai, Maharashtra'}
              </h4>
              <button
                onClick={() => setShowLocationModal(true)}
                className="text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center space-x-1 mt-0.5"
              >
                <span>Recalibrate Live GPS</span>
                <Compass className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>National Active EVs</span>
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {kpis ? kpis.totalEVRegistrations.toLocaleString() : '2,845,600'}
          </div>
          <div className="mt-2 flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{kpis?.evGrowthYoY || 42.8}% YoY Adoption Velocity</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Public Charging Points</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <BatteryCharging className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {kpis ? kpis.totalChargingPoints.toLocaleString() : '24,680'}
          </div>
          <div className="mt-2 flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
            <span>+{kpis?.stationGrowthYoY || 18.4}% YoY BEE Verified Growth</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>EV-to-Charger Ratio</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {kpis ? `${kpis.evToChargerRatio}:1` : '115.3:1'}
          </div>
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            High Density Pressure (Ideal benchmark: 20:1)
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Critical Deficit States</span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {kpis ? kpis.criticalStatesCount : 7} States
          </div>
          <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            Infrastructure Gap Score ≥ 75
          </div>
        </div>
      </div>

      {/* Quick Launchpad Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          to="/stations"
          className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-sky-500 hover:shadow-md transition-all text-center group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
            Find Stations
          </span>
        </Link>

        <Link
          to="/map"
          className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-sky-500 hover:shadow-md transition-all text-center group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
            Live Station Map
          </span>
        </Link>

        <Link
          to="/tableau"
          className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-sky-500 hover:shadow-md transition-all text-center group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
            Executive BI Studio
          </span>
        </Link>

        <Link
          to="/gap-analysis"
          className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-sky-500 hover:shadow-md transition-all text-center group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
            Regional Gap Index
          </span>
        </Link>

        <Link
          to="/forecasting"
          className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-sky-500 hover:shadow-md transition-all text-center group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
            Demand Projections
          </span>
        </Link>

        <Link
          to="/calculator"
          className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-sky-500 hover:shadow-md transition-all text-center group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
            Battery Calculator
          </span>
        </Link>
      </div>

      {/* Real-Time Nearest Chargers to GPS Location */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>⚡ Nearest Charging Stations</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                Calibrated to {userLocation ? userLocation.city : 'Current Hub'}
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing stations with active live slots sorted by geodesic distance
            </p>
          </div>
          <Link
            to="/stations"
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1"
          >
            <span>View All Stations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyStations.map((st) => (
            <div
              key={st.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:border-teal-500/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {st.operator}
                    </span>
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">
                      {st.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 flex-shrink-0 text-gray-400" />
                      <span className="truncate">{st.address}</span>
                    </p>
                  </div>

                  <span className="flex-shrink-0 inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{st.availableConnectors}/{st.totalConnectors} Open</span>
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-bold text-gray-700 dark:text-gray-300">
                      {st.connectors[0]?.connectorType || 'CCS2'} • {st.connectors[0]?.powerKW || 60} kW
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">
                      ₹{st.connectors[0]?.pricePerKWh || 18}/kWh
                    </span>
                  </div>

                  <div className="text-xs font-extrabold text-teal-700 dark:text-teal-300 flex items-center space-x-1">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{st.distanceKm !== undefined ? `${st.distanceKm} km away` : 'Nearby'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center space-x-2">
                <Link
                  to={`/station/${st.id}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs text-center shadow-md shadow-teal-600/20 transition-colors"
                >
                  ⚡ Book Slot Now
                </Link>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${st.latitude},${st.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors"
                >
                  Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Mismatch Diagnostic Callout */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">
              Exploratory Data Analysis Finding
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              National Infrastructure Growth Mismatch: 24.4% Gap
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Official VAHAN & BEE records show EV adoption grew at +42.8% YoY while public charging station installations expanded at only +18.4% YoY. This has created acute infrastructure pressure across Uttar Pradesh, Bihar, Rajasthan, and Madhya Pradesh.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-3">
            <Link
              to="/gap-analysis"
              className="py-3 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-gray-950 font-extrabold text-xs shadow-lg shadow-teal-500/30 transition-all flex items-center space-x-2"
            >
              <span>Explore Gap Engine</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

