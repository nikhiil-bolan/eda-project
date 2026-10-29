import React, { useState, useEffect } from 'react';
import { fetchGapAnalysis } from '../services/api';
import { Sliders, Target, CheckCircle2, TrendingUp, Sparkles, Building2, MapPin } from 'lucide-react';

export const PriorityPlanner: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [wDensity, setWDensity] = useState<number>(40);
  const [wGrowth, setWGrowth] = useState<number>(35);
  const [wShortage, setWShortage] = useState<number>(25);
  const [totalNewStations, setTotalNewStations] = useState<number>(5000);

  useEffect(() => {
    async function load() {
      const gapData = await fetchGapAnalysis();
      setData(gapData);
    }
    load();
  }, []);

  // Normalize and calculate dynamically ranked priority scores
  const totalWeight = wDensity + wGrowth + wShortage || 1;
  const nDensity = wDensity / totalWeight;
  const nGrowth = wGrowth / totalWeight;
  const nShortage = wShortage / totalWeight;

  const rankedData = data.map((s) => {
    // Normalization factors
    const scoreDensity = Math.min(100, (s.totalEVRegistrations / 400000) * 100);
    const scoreGrowth = Math.min(100, (s.evGrowthYoYPct / 50) * 100);
    const scoreShortage = Math.min(100, s.gapScore);

    const dynamicPriorityScore = Math.round(
      nDensity * scoreDensity + nGrowth * scoreGrowth + nShortage * scoreShortage
    );

    return {
      ...s,
      priorityScore: dynamicPriorityScore
    };
  });

  rankedData.sort((a, b) => b.priorityScore - a.priorityScore);

  const sumScores = rankedData.reduce((acc, s) => acc + s.priorityScore, 0) || 1;
  const allocatedData = rankedData.map((s) => ({
    ...s,
    allocatedStations: Math.max(10, Math.round((s.priorityScore / sumScores) * totalNewStations))
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 mb-2">
          <Target className="w-3.5 h-3.5 text-teal-600" />
          <span>Multi-Criteria Decision Analysis (MCDA)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Priority Station Deployment Planner
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
          Dynamically tune capital allocation weights to rank states and calculate optimal public charger deployment quotas.
        </p>
      </div>

      {/* Interactive Weight Sliders Toolbar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-teal-600" />
          <span>Customize Capital Allocation Weights</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1 */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex justify-between text-xs font-extrabold text-gray-800 dark:text-gray-200">
              <span>EV Volume & Density</span>
              <span className="text-teal-600 font-mono">{wDensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={wDensity}
              onChange={(e) => setWDensity(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[11px] text-gray-500">
              Weights states with largest existing active fleets (e.g. Maharashtra, UP).
            </p>
          </div>

          {/* Slider 2 */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex justify-between text-xs font-extrabold text-gray-800 dark:text-gray-200">
              <span>YoY Growth Velocity</span>
              <span className="text-teal-600 font-mono">{wGrowth}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={wGrowth}
              onChange={(e) => setWGrowth(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[11px] text-gray-500">
              Weights states with accelerating month-on-month EV sales growth rates.
            </p>
          </div>

          {/* Slider 3 */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex justify-between text-xs font-extrabold text-gray-800 dark:text-gray-200">
              <span>Charger Shortage Deficit</span>
              <span className="text-teal-600 font-mono">{wShortage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={wShortage}
              onChange={(e) => setWShortage(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[11px] text-gray-500">
              Weights underserved charging deserts with high EV-to-charger pressure.
            </p>
          </div>
        </div>

        {/* Total Stations Tranche */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 text-xs">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-gray-700 dark:text-gray-300">
              Deployment Tranche Size:
            </span>
            <div className="flex space-x-1.5">
              {[2000, 5000, 10000, 20000].map((tranche) => (
                <button
                  key={tranche}
                  onClick={() => setTotalNewStations(tranche)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    totalNewStations === tranche
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {tranche.toLocaleString()} Stations
                </button>
              ))}
            </div>
          </div>

          <span className="text-gray-400 font-medium">
            Dynamic Normalization: {(nDensity * 100).toFixed(0)}% / {(nGrowth * 100).toFixed(0)}% / {(nShortage * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Top Priority Region Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {allocatedData.slice(0, 3).map((st, idx) => (
          <div
            key={st.state}
            className="bg-white dark:bg-gray-900 border-2 border-teal-500/80 rounded-3xl p-6 shadow-md relative overflow-hidden space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-extrabold">
                Priority Rank #{idx + 1}
              </span>
              <span className="text-xl font-extrabold text-teal-600 font-mono">
                {st.priorityScore} Pts
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                {st.state}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Current Stations: {st.publicChargingStations} • Active EVs: {st.totalEVRegistrations.toLocaleString()}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 block">
                Recommended Capital Allocation:
              </span>
              <span className="text-xl font-extrabold text-teal-900 dark:text-teal-100">
                +{st.allocatedStations.toLocaleString()} New Charging Stations
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Complete Allocation Quota Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
            State-by-State Priority Allocations
          </h3>
          <span className="text-xs text-gray-400 font-bold">
            Total Distributed: {totalNewStations.toLocaleString()} Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
              <tr>
                <th className="py-4 px-6">Rank & State</th>
                <th className="py-4 px-6">Dynamic Score</th>
                <th className="py-4 px-6">Existing Chargers</th>
                <th className="py-4 px-6">Registered EVs</th>
                <th className="py-4 px-6">Calculated Quota</th>
                <th className="py-4 px-6">Post-Deployment Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
              {allocatedData.map((row, idx) => {
                const newTotalStations = row.publicChargingStations + row.allocatedStations;
                const newRatio = (row.totalEVRegistrations / newTotalStations).toFixed(1);

                return (
                  <tr key={row.state} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                    <td className="py-4 px-6 font-extrabold text-gray-900 dark:text-white">
                      #{idx + 1} {row.state}
                    </td>
                    <td className="py-4 px-6 font-bold text-teal-600 font-mono">
                      {row.priorityScore} / 100
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {row.publicChargingStations.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {row.totalEVRegistrations.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-teal-700 dark:text-teal-400 text-sm">
                      +{row.allocatedStations.toLocaleString()} Stations
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-600">
                      {newRatio}:1 (Improved)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

