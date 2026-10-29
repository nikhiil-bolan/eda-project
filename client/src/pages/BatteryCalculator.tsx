import React, { useState } from 'react';
import { BatteryCharging, Zap, Clock, IndianRupee, Leaf, Sparkles, Sliders } from 'lucide-react';

interface EVProfile {
  name: string;
  batteryKWh: number;
  maxRangeKm: number;
  efficiencyKmPerKwh: number;
}

const EV_PROFILES: EVProfile[] = [
  { name: 'Tata Nexon EV Max', batteryKWh: 40.5, maxRangeKm: 453, efficiencyKmPerKwh: 8.5 },
  { name: 'Tata Punch EV Long Range', batteryKWh: 35.0, maxRangeKm: 421, efficiencyKmPerKwh: 9.0 },
  { name: 'Tata Tiago EV', batteryKWh: 24.0, maxRangeKm: 315, efficiencyKmPerKwh: 10.2 },
  { name: 'MG ZS EV Excite', batteryKWh: 50.3, maxRangeKm: 461, efficiencyKmPerKwh: 8.0 },
  { name: 'BYD Atto 3 Superior', batteryKWh: 60.5, maxRangeKm: 521, efficiencyKmPerKwh: 7.8 },
  { name: 'Mahindra XUV400 EL Pro', batteryKWh: 39.4, maxRangeKm: 456, efficiencyKmPerKwh: 8.4 },
  { name: 'Ola S1 Pro (2W Scooter)', batteryKWh: 4.0, maxRangeKm: 181, efficiencyKmPerKwh: 35.0 },
  { name: 'Ather 450X (2W Scooter)', batteryKWh: 3.7, maxRangeKm: 150, efficiencyKmPerKwh: 32.0 }
];

export const BatteryCalculator: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('Tata Nexon EV Max');
  const [currentSoc, setCurrentSoc] = useState<number>(20);
  const [targetSoc, setTargetSoc] = useState<number>(85);
  const [chargerKw, setChargerKw] = useState<number>(60);
  const [tariffInr, setTariffInr] = useState<number>(18.0);

  const vehicle = EV_PROFILES.find((v) => v.name === selectedModel) || EV_PROFILES[0];

  const deltaPct = Math.max(0, targetSoc - currentSoc);
  const energyKwhNeeded = (deltaPct / 100) * vehicle.batteryKWh;

  // Charging time calculation (with realistic taper curve past 80%)
  const effectiveChargerKw = targetSoc > 80 ? chargerKw * 0.75 : chargerKw;
  const chargingHours = energyKwhNeeded / Math.max(effectiveChargerKw, 1.0);
  const totalMins = Math.round(chargingHours * 60);
  const hoursDisplay = Math.floor(totalMins / 60);
  const minsDisplay = totalMins % 60;

  // Added range and financials
  const addedKm = Math.round(energyKwhNeeded * vehicle.efficiencyKmPerKwh);
  const totalCost = Math.round(energyKwhNeeded * tariffInr);

  // Petrol comparison (₹9.0 per km petrol vs EV)
  const petrolCostEquivalent = Math.round(addedKm * 8.5);
  const moneySaved = Math.max(0, petrolCostEquivalent - totalCost);
  const co2AvoidedKg = Math.round(addedKm * 0.12); // ~120g CO2 per km for petrol car

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 mb-2">
          <BatteryCharging className="w-3.5 h-3.5 text-teal-600" />
          <span>Battery Analytics & Financial Estimator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          EV Battery Range & Charging Time Calculator
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
          Compute charging session duration, electricity cost in ₹, range added, and petrol savings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
            1. Select Vehicle & Charging Specifications
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Vehicle Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white"
            >
              {EV_PROFILES.map((ev) => (
                <option key={ev.name} value={ev.name}>
                  {ev.name} ({ev.batteryKWh} kWh Battery)
                </option>
              ))}
            </select>
          </div>

          {/* Current State of Charge Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-700 dark:text-gray-300">Current Battery Level</span>
              <span className="text-teal-600 font-mono text-sm">{currentSoc}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              value={currentSoc}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCurrentSoc(val);
                if (val >= targetSoc) setTargetSoc(Math.min(100, val + 10));
              }}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Target State of Charge Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-700 dark:text-gray-300">Target Charge Level</span>
              <span className="text-teal-600 font-mono text-sm">{targetSoc}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={targetSoc}
              onChange={(e) => setTargetSoc(Math.max(currentSoc + 5, Number(e.target.value)))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <span className="text-[11px] text-gray-400 block">
              💡 Tip: Charging from 20% to 80% takes full advantage of fast-charging DC speeds.
            </span>
          </div>

          {/* Charger Power Type Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Charger Power Rating
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: '3.3 kW Home AC', kw: 3.3 },
                { label: '7.2 kW Fast AC', kw: 7.2 },
                { label: '22 kW AC Hub', kw: 22 },
                { label: '30 kW DC Fast', kw: 30 },
                { label: '60 kW DC CCS2', kw: 60 },
                { label: '120 kW Supercharger', kw: 120 }
              ].map((c) => (
                <button
                  type="button"
                  key={c.kw}
                  onClick={() => setChargerKw(c.kw)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    chargerKw === c.kw
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Electricity Tariff Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Electricity Tariff Rate (₹ per kWh)
            </label>
            <input
              type="number"
              step="0.5"
              value={tariffInr}
              onChange={(e) => setTariffInr(Number(e.target.value))}
              className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Results Output Cards Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
              2. Calculated Charging Metrics
            </h3>

            {/* Time Required Card */}
            <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Estimated Charging Duration</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-950 dark:text-teal-100">
                {hoursDisplay > 0 ? `${hoursDisplay}h ` : ''}{minsDisplay} mins
              </div>
              <p className="text-xs text-teal-700 dark:text-teal-400">
                Supplying <b>{energyKwhNeeded.toFixed(1)} kWh</b> ({currentSoc}% → {targetSoc}%)
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <span className="text-[11px] font-bold text-gray-400 block uppercase">
                  Driving Range Added
                </span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5 block">
                  +{addedKm} km
                </span>
                <span className="text-[11px] text-gray-500">Based on standard drive cycle</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <span className="text-[11px] font-bold text-gray-400 block uppercase">
                  Session Cost
                </span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5 block">
                  ₹{totalCost}.00
                </span>
                <span className="text-[11px] text-gray-500">₹{(totalCost / (addedKm || 1)).toFixed(2)}/km</span>
              </div>
            </div>

            {/* Savings & Environment Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-extrabold">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Environmental & Cost Savings vs Petrol</span>
              </div>
              <div className="flex justify-between items-center text-sm font-extrabold text-emerald-900 dark:text-emerald-100">
                <span>Savings This Session:</span>
                <span className="text-lg text-emerald-600">₹{moneySaved}.00 Saved</span>
              </div>
              <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400">
                <span>CO₂ Emissions Prevented:</span>
                <span className="font-bold">{co2AvoidedKg} kg CO₂ offset</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

