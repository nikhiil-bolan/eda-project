import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import {
  Zap,
  Navigation,
  Clock,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Car,
  AlertCircle,
  Truck
} from 'lucide-react';

export const DoorstepCharging: React.FC = () => {
  const { userLocation } = useLocation();
  const [vehicleNumber, setVehicleNumber] = useState('MH 02 EQ 8821');
  const [boostKwh, setBoostKwh] = useState(15);
  const [isDispatched, setIsDispatched] = useState(false);

  const totalCost = 450 + boostKwh * 20;

  const handleRequestVan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatched(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 mb-2">
          <Truck className="w-3.5 h-3.5 text-rose-600" />
          <span>On-Demand Mobile Grid Rescue</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Doorstep Emergency EV Charging Concierge
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
          Stranded with a low battery? Dispatch a certified mobile high-speed DC charging van directly to your live GPS coordinates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Request Form or Live Dispatch Status */}
        <div className="md:col-span-7">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            {!isDispatched ? (
              <form onSubmit={handleRequestVan} className="space-y-5">
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  Dispatch Request Details
                </h3>

                {/* Live GPS destination */}
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 dark:text-teal-300">
                    <Navigation className="w-4 h-4 text-teal-600 animate-pulse" />
                    <span>Destination Calibrated to Your Live GPS:</span>
                  </div>
                  <div className="font-extrabold text-sm text-gray-900 dark:text-white">
                    {userLocation ? `${userLocation.city}, ${userLocation.state}` : 'Mumbai Hub'}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Coordinates: {userLocation?.lat.toFixed(4) || '19.0760'}°N, {userLocation?.lng.toFixed(4) || '72.8777'}°E
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Emergency Charge Boost Requirement
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 15, 25].map((kwh) => (
                      <button
                        type="button"
                        key={kwh}
                        onClick={() => setBoostKwh(kwh)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          boostKwh === kwh
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        +{kwh} kWh Boost
                        <span className="block text-[10px] text-gray-400 font-normal">
                          (~{kwh * 7} km range)
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cost breakdown */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Base Callout & Van Dispatch</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">₹450.00</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>DC Fast Power ({boostKwh} kWh @ ₹20/kWh)</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">₹{boostKwh * 20}.00</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-extrabold text-sm text-gray-900 dark:text-white">
                    <span>Total Emergency Charge</span>
                    <span className="text-teal-600 dark:text-teal-400">₹{totalCost}.00</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Dispatch Mobile Fast-Charging Van Now</span>
                </button>
              </form>
            ) : (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    Mobile Van Dispatched
                  </span>
                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                    ETA: 18 Minutes
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Driver is en-route with a 60kW DC CCS2 mobile generator.
                  </p>
                </div>

                {/* Van telemetry box */}
                <div className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl p-4 text-left text-xs space-y-2 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500">Rescue Van:</span>
                    <span className="text-gray-900 dark:text-white">Tata Intra EV Van (MH 01 EN 4092)</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500">Technician:</span>
                    <span className="text-gray-900 dark:text-white">Sandeep Patil (+91 98200 11223)</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500">Destination:</span>
                    <span className="text-teal-600">{userLocation?.city || 'Mumbai'} Live GPS</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsDispatched(false)}
                  className="py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                >
                  Cancel / Return
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Informational Column */}
        <div className="md:col-span-5 space-y-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
              How Doorstep EV Rescue Works
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <p className="text-gray-600 dark:text-gray-400">
                  <b>Real-Time GPS Localization:</b> We identify your exact position with browser Geolocation telemetry.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <p className="text-gray-600 dark:text-gray-400">
                  <b>High-Speed DC Boost:</b> The van plugs in via CCS2 and delivers 15 kWh in ~15 minutes.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <p className="text-gray-600 dark:text-gray-400">
                  <b>Drive on with Confidence:</b> Sufficient charge to reach any highway supercharging station.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

