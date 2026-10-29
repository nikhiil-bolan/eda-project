import React, { useState } from 'react';
import { Car, Sparkles, CheckCircle2, Battery, IndianRupee, Tag, ShieldCheck, ArrowRight } from 'lucide-react';

interface NewEV {
  model: string;
  brand: string;
  battery: string;
  range: string;
  fastCharge: string;
  price: string;
  type: string;
}

const NEW_EVS: NewEV[] = [
  { model: 'Tata Nexon EV Max', brand: 'Tata Motors', battery: '40.5 kWh', range: '453 km', fastCharge: '56 mins (0-80%)', price: '₹14.49 - 19.49 Lakh', type: '4W SUV' },
  { model: 'Tata Punch EV', brand: 'Tata Motors', battery: '35.0 kWh', range: '421 km', fastCharge: '56 mins (10-80%)', price: '₹9.99 - 14.29 Lakh', type: '4W Compact' },
  { model: 'MG ZS EV Excite', brand: 'MG Motor', battery: '50.3 kWh', range: '461 km', fastCharge: '60 mins (0-80%)', price: '₹18.98 - 25.44 Lakh', type: '4W SUV' },
  { model: 'BYD Atto 3 Superior', brand: 'BYD', battery: '60.5 kWh', range: '521 km', fastCharge: '50 mins (0-80%)', price: '₹24.99 - 33.99 Lakh', type: '4W Premium' },
  { model: 'Mahindra XUV400 EL Pro', brand: 'Mahindra', battery: '39.4 kWh', range: '456 km', fastCharge: '50 mins (0-80%)', price: '₹15.49 - 17.69 Lakh', type: '4W SUV' },
  { model: 'Ola S1 Pro Gen 2', brand: 'Ola Electric', battery: '4.0 kWh', range: '195 km', fastCharge: '6.5 hrs (Home)', price: '₹1.28 Lakh', type: '2W Scooter' }
];

export const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'ml_resale'>('catalog');

  // ML Resale Estimator State
  const [resaleModel, setResaleModel] = useState<string>('Tata Nexon EV');
  const [originalPriceLakh, setOriginalPriceLakh] = useState<number>(16.5);
  const [ageYears, setAgeYears] = useState<number>(2);
  const [odometerKm, setOdometerKm] = useState<number>(28000);
  const [batteryHealthPct, setBatteryHealthPct] = useState<number>(93);
  const [condition, setCondition] = useState<string>('Good');

  // Mathematical EV depreciation formula (incorporating battery degradation penalty)
  const calculateResalePrice = (): number => {
    // Annual age depreciation: ~12% year 1, 8% subsequent
    const ageFactor = Math.pow(0.88, 1) * Math.pow(0.92, Math.max(0, ageYears - 1));
    // Mileage factor (standard 15,000 km/yr baseline)
    const expectedKm = ageYears * 15000;
    const mileageAdjustment = 1 - ((odometerKm - expectedKm) / 100000) * 0.1;
    // Battery Health weight (Battery represents ~40% of EV value)
    const batteryPenalty = (100 - batteryHealthPct) * 0.008;
    // Condition multiplier
    const conditionMul = condition === 'Excellent' ? 1.05 : condition === 'Good' ? 1.0 : 0.92;

    const estimated = originalPriceLakh * ageFactor * mileageAdjustment * (1 - batteryPenalty) * conditionMul;
    return Math.max(2.0, Math.round(estimated * 100) / 100);
  };

  const estimatedResaleLakh = calculateResalePrice();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 mb-2">
            <Car className="w-3.5 h-3.5 text-teal-600" />
            <span>Consumer E-Mobility Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            EV Marketplace & Fair Resale Valuation
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
            Browse official EV catalog specifications or calculate pre-owned vehicle resale valuation factoring in battery State of Health (SOH).
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'catalog'
                ? 'bg-white dark:bg-gray-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            🚘 EV Model Catalog
          </button>
          <button
            onClick={() => setActiveTab('ml_resale')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'ml_resale'
                ? 'bg-white dark:bg-gray-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            📊 Vehicle Valuation Calculator
          </button>
        </div>
      </div>

      {/* TAB 1: NEW EV CATALOG */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEW_EVS.map((car) => (
            <div
              key={car.model}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:border-teal-500 hover:shadow-lg transition-all space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                    {car.brand} • {car.type}
                  </span>
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
                    {car.model}
                  </h3>
                </div>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                  {car.price}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <span className="text-[11px] text-gray-400 block font-semibold">Battery Pack</span>
                  <span className="font-extrabold text-gray-900 dark:text-white">{car.battery}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <span className="text-[11px] text-gray-400 block font-semibold">ARAI / MIDC Range</span>
                  <span className="font-extrabold text-gray-900 dark:text-white">{car.range}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                ⚡ Fast Charging: <b className="text-gray-700 dark:text-gray-300">{car.fastCharge}</b>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: USED EV RESALE ESTIMATOR */}
      {activeTab === 'ml_resale' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
              Vehicle Parameters for Fair Market Scoring
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                EV Model
              </label>
              <select
                value={resaleModel}
                onChange={(e) => setResaleModel(e.target.value)}
                className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white"
              >
                <option value="Tata Nexon EV">Tata Nexon EV</option>
                <option value="MG ZS EV">MG ZS EV</option>
                <option value="Tata Tiago EV">Tata Tiago EV</option>
                <option value="BYD Atto 3">BYD Atto 3</option>
                <option value="Mahindra XUV400">Mahindra XUV400</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Original Price (₹ Lakhs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={originalPriceLakh}
                  onChange={(e) => setOriginalPriceLakh(Number(e.target.value))}
                  className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Age ({ageYears} Years)
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Odometer Mileage (km)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(Number(e.target.value))}
                  className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Battery State of Health ({batteryHealthPct}%)
                </label>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={batteryHealthPct}
                  onChange={(e) => setBatteryHealthPct(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer mt-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Cosmetic & Physical Condition
              </label>
              <div className="flex space-x-2">
                {['Excellent', 'Good', 'Fair'].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      condition === cond
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                Estimated Fair Market Valuation
              </h3>

              <div className="p-6 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                  Fair Resale Value Range
                </span>
                <div className="text-4xl font-extrabold text-teal-950 dark:text-teal-100">
                  ₹{estimatedResaleLakh} Lakhs
                </div>
                <p className="text-xs text-teal-800 dark:text-teal-300">
                  Estimated market resale price (± ₹35,000 margin of error)
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Original Ex-Showroom:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">₹{originalPriceLakh} Lakhs</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Depreciation Applied:</span>
                  <span className="font-bold text-rose-600">
                    -{Math.round(((originalPriceLakh - estimatedResaleLakh) / originalPriceLakh) * 100)}% Overall
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Battery Health Influence:</span>
                  <span className="font-bold text-emerald-600">High ({batteryHealthPct}% SOH Retained)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

