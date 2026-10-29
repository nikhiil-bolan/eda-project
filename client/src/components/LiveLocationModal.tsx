import React from 'react';
import { useLocation, CITY_PRESETS } from '../context/LocationContext';
import { MapPin, Navigation, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

export const LiveLocationModal: React.FC = () => {
  const {
    userLocation,
    isCapturing,
    locationError,
    requestLiveLocation,
    setManualLocation,
    showLocationModal,
    setShowLocationModal
  } = useLocation();

  if (!showLocationModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative overflow-hidden">
        {/* Header graphic banner */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Capture Live GPS Location
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              EVision calibrates real-time distance to thousands of charging stations
            </p>
          </div>
        </div>

        {/* Current status */}
        {userLocation && (
          <div className="bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 rounded-xl p-3.5 mb-5 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-teal-900 dark:text-teal-200">Current Calibrated Hub:</span>{' '}
              <span className="font-bold text-gray-900 dark:text-white">
                {userLocation.city}, {userLocation.state}
              </span>
              <div className="text-gray-500 dark:text-gray-400 mt-0.5">
                Coordinates: {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E{' '}
                {userLocation.isLive ? '(Live GPS Active)' : '(Metro Preset)'}
              </div>
            </div>
          </div>
        )}

        {locationError && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 mb-4 flex items-center space-x-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Action Button 1: Live GPS */}
        <button
          onClick={() => requestLiveLocation()}
          disabled={isCapturing}
          className="w-full mb-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 ${isCapturing ? 'animate-spin' : ''}`} />
          <span>{isCapturing ? 'Acquiring GPS Fix via Browser...' : 'Detect Exact Live Location Now'}</span>
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="flex-shrink mx-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Or Pick Metro City Preset
          </span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {/* Action Button 2: City Presets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto pr-1">
          {CITY_PRESETS.map((p) => {
            const isSelected = userLocation?.city === p.city;
            return (
              <button
                key={p.city}
                onClick={() => setManualLocation(p.city, p.state, p.lat, p.lng)}
                className={`flex items-center space-x-2 text-left p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'}`} />
                <span className="truncate">{p.city}</span>
              </button>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => setShowLocationModal(false)}
            className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Done & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

