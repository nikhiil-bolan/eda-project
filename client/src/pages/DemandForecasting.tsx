import React, { useState, useEffect } from 'react';
import { fetchGapAnalysis } from '../services/api';
import { Sparkles, TrendingUp, Download, Sliders, BatteryCharging, AlertCircle, Calendar } from 'lucide-react';

export const DemandForecasting: React.FC = () => {
  const [targetYear, setTargetYear] = useState<number>(2028);
  const [stateProjections, setStateProjections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadForecasts() {
      setLoading(true);
      const gapData = await fetchGapAnalysis();

      const yearsAhead = targetYear - 2025;
      const compoundRate = 1.34; // 34% compound national EV adoption

      const results = gapData.map((s) => {
        const forecastedEVs = Math.round(s.totalEVRegistrations * Math.pow(compoundRate, yearsAhead));
        // Target 1 charger per 25 EVs
        const requiredStations = Math.max(s.publicChargingStations, Math.round(forecastedEVs * 0.04));
        const shortage = Math.max(0, requiredStations - s.publicChargingStations);

        return {
          state: s.state,
          currentEVs: s.totalEVRegistrations,
          forecastedEVs,
          currentStations: s.publicChargingStations,
          requiredStations,
          shortage,
          growthMultiplier: (Math.pow(compoundRate, yearsAhead)).toFixed(1)
        };
      });

      // Sort by largest shortage first
      results.sort((a, b) => b.shortage - a.shortage);
      setStateProjections(results);
      setLoading(false);
    }
    loadForecasts();
  }, [targetYear]);

  const totalForecastEVs = stateProjections.reduce((sum, s) => sum + s.forecastedEVs, 0);
  const totalRequiredStations = stateProjections.reduce((sum, s) => sum + s.requiredStations, 0);
  const totalShortage = stateProjections.reduce((sum, s) => sum + s.shortage, 0);

  const exportForecastCSV = () => {
    const headers = 'State,Current_2025_EVs,Forecasted_EVs,Current_Stations,Required_Stations,Shortage\n';
    const rows = stateProjections
      .map(
        (s) =>
          `"${s.state}",${s.currentEVs},${s.forecastedEVs},${s.currentStations},${s.requiredStations},${s.shortage}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evision_forecast_${targetYear}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Infrastructure Planning Horizon</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Longitudinal EV & Station Demand Projections (2026–2030)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
            Data-driven capacity modeling to forecast future vehicle adoption and public station deployment quotas.
          </p>
        </div>

        <button
          onClick={exportForecastCSV}
          className="py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:border-purple-500 text-xs font-bold shadow-sm flex items-center space-x-2 self-start lg:self-auto"
        >
          <Download className="w-4 h-4 text-purple-600" />
          <span>Export Forecast Data</span>
        </button>
      </div>

      {/* Target Horizon Year Selector */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
              Target Prediction Horizon: <span className="text-purple-600 dark:text-purple-400">{targetYear}</span>
            </h3>
            <p className="text-xs text-gray-500">
              Select simulation year to observe compounded EV registrations and required charger installations
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {[2026, 2027, 2028, 2029, 2030].map((yr) => (
              <button
                key={yr}
                onClick={() => setTargetYear(yr)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  targetYear === yr
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* National Projected KPI Rollup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Projected National Active EVs ({targetYear})
          </span>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            {totalForecastEVs.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            ~{((totalForecastEVs / 2845600)).toFixed(1)}x Expansion from 2025 Baseline
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Target Required Public Chargers
          </span>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            {totalRequiredStations.toLocaleString()}
          </div>
          <p className="text-xs text-blue-600 font-semibold mt-1">
            Calculated at recommended 1 station per 25 EVs
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Net Infrastructure Deficit (Shortage)
          </span>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            {totalShortage.toLocaleString()}
          </div>
          <p className="text-xs text-rose-600 font-semibold mt-1">
            Stations that must be deployed before {targetYear}
          </p>
        </div>
      </div>

      {/* State-by-State Forecasting Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
              <tr>
                <th className="py-4 px-6">State / UT</th>
                <th className="py-4 px-6">2025 EVs</th>
                <th className="py-4 px-6">{targetYear} Forecasted EVs</th>
                <th className="py-4 px-6">Current Chargers</th>
                <th className="py-4 px-6">Required Chargers</th>
                <th className="py-4 px-6">Net Shortage (Deficit)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
              {stateProjections.map((row) => (
                <tr key={row.state} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                  <td className="py-4 px-6 font-extrabold text-gray-900 dark:text-white text-sm">
                    {row.state}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                    {row.currentEVs.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 font-bold text-purple-600 dark:text-purple-400 text-sm">
                    {row.forecastedEVs.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                    {row.currentStations.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 font-bold text-blue-600">
                    {row.requiredStations.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200">
                      +{row.shortage.toLocaleString()} Needed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

