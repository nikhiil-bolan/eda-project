import React, { useState, useEffect } from 'react';
import { fetchGapAnalysis } from '../services/api';
import { InfrastructureData } from '../types';
import {
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Search,
  Download,
  Info,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const GapAnalysis: React.FC = () => {
  const [data, setData] = useState<InfrastructureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchState, setSearchState] = useState<string>('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchGapAnalysis();
      setData(res);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = data.filter((s) => {
    const matchesTier = selectedTier === 'All' || s.gapTier === selectedTier;
    const matchesSearch =
      searchState === '' || s.state.toLowerCase().includes(searchState.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const criticalCount = data.filter((s) => s.gapTier === 'Critical').length;
  const highCount = data.filter((s) => s.gapTier === 'High').length;
  const modCount = data.filter((s) => s.gapTier === 'Moderate').length;
  const lowCount = data.filter((s) => s.gapTier === 'Low').length;

  const exportCSV = () => {
    const headers = 'State,Gap_Score,Gap_Tier,EV_Registrations,Charging_Stations,EV_to_Charger_Ratio,Growth_YoY_Pct\n';
    const rows = filtered
      .map(
        (s) =>
          `"${s.state}",${s.gapScore},"${s.gapTier}",${s.totalEVRegistrations},${s.publicChargingStations},${s.evToChargerRatio},${s.evGrowthYoYPct}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evision_gap_analysis_2025.csv';
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 mb-2">
            <span>Official BEE & VAHAN Model Formulation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            National Infrastructure Gap Index (0–100)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
            Quantifies regional charger deficits across 32 Indian States/UTs to prioritize public investment.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:border-teal-500 text-xs font-bold shadow-sm flex items-center space-x-2 self-start lg:self-auto"
        >
          <Download className="w-4 h-4 text-teal-600" />
          <span>Export Certified CSV</span>
        </button>
      </div>

      {/* Mathematical Formulation Explainer Card */}
      <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/60 dark:from-teal-950/40 dark:to-emerald-950/30 border border-teal-200 dark:border-teal-800/80 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-extrabold text-teal-950 dark:text-teal-200">
              Mathematical Formula Architecture
            </h3>
            <div className="font-mono text-xs sm:text-sm font-bold text-teal-800 dark:text-teal-300 bg-white/80 dark:bg-gray-900/80 p-3 rounded-xl border border-teal-200/60 dark:border-teal-800/60 overflow-x-auto">
              Gap Score = 0.30 × Deficit + 0.30 × Ratio Pressure + 0.20 × Growth Velocity + 0.20 × Urbanization
            </div>
            <p className="text-xs text-teal-900/80 dark:text-teal-400/80 leading-relaxed pt-1">
              • <b>Deficit:</b> Shortfall against target 1 charger per 25 registered EVs.<br />
              • <b>Ratio Pressure:</b> State EV-to-charger density ratio compared to the national average.<br />
              • <b>Growth Velocity:</b> YoY percentage increase in electric vehicle registrations.<br />
              • <b>Urbanization:</b> Urban population density coefficient.
            </p>
          </div>
        </div>
      </div>

      {/* Tier Summary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedTier(selectedTier === 'Critical' ? 'All' : 'Critical')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedTier === 'Critical'
              ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 shadow-md'
              : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-600">
            <span>Critical Deficit (≥ 75)</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {criticalCount} States
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Immediate capital rollout needed</p>
        </div>

        <div
          onClick={() => setSelectedTier(selectedTier === 'High' ? 'All' : 'High')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedTier === 'High'
              ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-md'
              : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-600">
            <span>High Gap (60–74)</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {highCount} States
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Adoption outrunning chargers</p>
        </div>

        <div
          onClick={() => setSelectedTier(selectedTier === 'Moderate' ? 'All' : 'Moderate')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedTier === 'Moderate'
              ? 'border-yellow-500 bg-yellow-50/70 dark:bg-yellow-950/40 shadow-md'
              : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-yellow-600">
            <span>Moderate Gap (45–59)</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {modCount} States
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Stable growth with steady rollout</p>
        </div>

        <div
          onClick={() => setSelectedTier(selectedTier === 'Low' ? 'All' : 'Low')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedTier === 'Low'
              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-md'
              : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>Low Gap (&lt; 45)</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {lowCount} States
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Well-equipped network (KA, DL)</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
            placeholder="Search state (e.g. Uttar Pradesh)..."
            className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-400 font-bold">Showing:</span>
          {['All', 'Critical', 'High', 'Moderate', 'Low'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedTier === t
                  ? 'bg-teal-600 text-white'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Master Data Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
              <tr>
                <th className="py-4 px-6">Rank & State</th>
                <th className="py-4 px-6">Gap Score</th>
                <th className="py-4 px-6">Classification</th>
                <th className="py-4 px-6">Active EVs (2025)</th>
                <th className="py-4 px-6">Public Chargers</th>
                <th className="py-4 px-6">EV : Charger Ratio</th>
                <th className="py-4 px-6">Adoption YoY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
              {filtered.map((row, idx) => {
                const tierColor =
                  row.gapTier === 'Critical'
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200'
                    : row.gapTier === 'High'
                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200'
                    : row.gapTier === 'Moderate'
                    ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/60 border-yellow-200'
                    : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200';

                return (
                  <tr key={row.state} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center font-bold text-[10px]">
                          #{idx + 1}
                        </span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-sm">
                          {row.state}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                          {row.gapScore.toFixed(1)} / 100
                        </span>
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              row.gapScore >= 75
                                ? 'bg-rose-500'
                                : row.gapScore >= 60
                                ? 'bg-amber-500'
                                : row.gapScore >= 45
                                ? 'bg-yellow-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${row.gapScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${tierColor}`}>
                        {row.gapTier}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                      {row.totalEVRegistrations.toLocaleString()}
                    </td>

                    <td className="py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                      {row.publicChargingStations.toLocaleString()}
                    </td>

                    <td className="py-4 px-6 font-bold text-teal-600 dark:text-teal-400">
                      {row.evToChargerRatio}:1
                    </td>

                    <td className="py-4 px-6 font-bold text-emerald-600">
                      +{row.evGrowthYoYPct}%
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

