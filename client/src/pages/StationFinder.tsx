import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { fetchStations } from '../services/api';
import { ChargingStation } from '../types';
import {
  Search,
  MapPin,
  Filter,
  Zap,
  Navigation,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  SlidersHorizontal,
  BatteryCharging
} from 'lucide-react';

export const StationFinder: React.FC = () => {
  const { userLocation, calculateDistance, setShowLocationModal } = useLocation();

  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedConnector, setSelectedConnector] = useState('All');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(50);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchStations();
      const withDistance = data.map((s) => ({
        ...s,
        distanceKm: calculateDistance(s.latitude, s.longitude)
      }));
      setStations(withDistance);
      setLoading(false);
    }
    loadData();
  }, [userLocation]);

  const filteredStations = stations.filter((s) => {
    const matchesSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = selectedCity === 'All' || s.city.toLowerCase() === selectedCity.toLowerCase();

    const matchesConnector =
      selectedConnector === 'All' ||
      s.connectors.some((c) => {
        if (selectedConnector === 'DC Fast') return c.powerKW >= 50;
        return c.connectorType.toLowerCase() === selectedConnector.toLowerCase();
      });

    const matchesDistance = maxRadiusKm === 0 || (s.distanceKm || 0) <= maxRadiusKm;

    return matchesSearch && matchesCity && matchesConnector && matchesDistance;
  });

  // Sort by nearest first
  filteredStations.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  const cities = ['All', 'Mumbai', 'New Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Lucknow'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Find Public Charging Stations
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time availability, fast-charging connectors, and turn-by-turn routing across India
          </p>
        </div>

        {/* Live GPS badge */}
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-3 py-2 text-xs font-bold shadow-sm">
          <Navigation className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
          <span className="text-gray-700 dark:text-gray-300">
            Center: <span className="text-teal-600 dark:text-teal-400 font-extrabold">{userLocation?.city || 'Mumbai'}</span>
          </span>
          <button
            onClick={() => setShowLocationModal(true)}
            className="text-xs text-gray-400 hover:text-teal-600 underline ml-1"
          >
            Change
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by station name, operator (Tata, Statiq, Zeon), or address..."
              className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* City Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="block w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Indian Cities' : `City: ${c}`}
                </option>
              ))}
            </select>
          </div>

          {/* Max Radius Filter */}
          <div className="md:col-span-3 flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 text-xs">
              <div className="flex justify-between text-[11px] font-bold text-gray-600 dark:text-gray-400">
                <span>Radius</span>
                <span>{maxRadiusKm === 0 ? 'All India' : `< ${maxRadiusKm} km`}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={maxRadiusKm}
                onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
                className="w-full accent-teal-600 h-1 mt-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Quick Connector Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mr-1">
            Connectors:
          </span>
          {['All', 'CCS2', 'Type 2', 'DC Fast'].map((conn) => (
            <button
              key={conn}
              onClick={() => setSelectedConnector(conn)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedConnector === conn
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {conn === 'DC Fast' ? '⚡ DC Fast (>50 kW)' : conn}
            </button>
          ))}
          <span className="ml-auto text-xs font-bold text-teal-600 dark:text-teal-400">
            {filteredStations.length} Stations Found
          </span>
        </div>
      </div>

      {/* Station Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400">
          Loading certified charging network data...
        </div>
      ) : filteredStations.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
            No Stations Matching Filter
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Try expanding the search radius or selecting 'All Indian Cities' to see high-speed charging hubs.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCity('All');
              setSelectedConnector('All');
              setMaxRadiusKm(0);
            }}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStations.map((st) => (
            <div
              key={st.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:border-teal-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {st.operator}
                    </span>
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5 line-clamp-1">
                      {st.name}
                    </h3>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{st.availableConnectors}/{st.totalConnectors} Open</span>
                  </span>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  <span className="line-clamp-1">{st.address}, {st.city}</span>
                </p>

                {/* Connectors info */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Plugs Available:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {st.connectors.map((c) => (
                      <span
                        key={c.id}
                        className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 flex items-center space-x-1"
                      >
                        <Zap className="w-3 h-3 text-teal-500" />
                        <span>{c.connectorType} ({c.powerKW}kW)</span>
                        <span className="text-gray-400 font-normal">₹{c.pricePerKWh}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {st.amenities && (
                  <div className="mt-3 text-[11px] text-gray-400 truncate">
                    ✨ Amenities: {st.amenities}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between text-xs font-bold mb-3">
                  <span className="text-teal-700 dark:text-teal-400 flex items-center space-x-1">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{st.distanceKm !== undefined ? `${st.distanceKm} km from you` : 'In City'}</span>
                  </span>
                  <span className="text-gray-500">24/7 Access</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/station/${st.id}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs text-center shadow-md shadow-teal-600/20 transition-colors"
                  >
                    ⚡ Reserve Slot
                  </Link>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${st.latitude},${st.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    title="Open Navigation in Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

