import React from 'react';
import { InteractiveDonutChart } from '../components/charts/InteractiveDonutChart';
import { InteractiveBarChart } from '../components/charts/InteractiveBarChart';
import { InteractiveLineChart } from '../components/charts/InteractiveLineChart';
import { InteractiveCorrelationHeatmap } from '../components/charts/InteractiveCorrelationHeatmap';
import { Database, CheckCircle2, Activity, PieChart, TrendingUp, Layers } from 'lucide-react';

export const EDAWorkspace: React.FC = () => {
  // Vehicle Category Breakdown Donut Data
  const vehicleClassesData = [
    { label: 'Two-Wheelers (2W)', value: 1711156, color: '#0284C7' },
    { label: 'Three-Wheelers (3W)', value: 985775, color: '#10B981' },
    { label: 'Four-Wheelers (4W)', value: 359591, color: '#F59E0B' },
    { label: 'Commercial Buses', value: 43398, color: '#8B5CF6' }
  ];

  // Growth Mismatch Data for Top States (EV Growth % minus Charger Growth %)
  const mismatchData = [
    { label: 'Uttar Pradesh', value: 30.1, badge: '+30.1% Lag', color: '#DC2626' },
    { label: 'Bihar', value: 37.9, badge: '+37.9% Lag', color: '#DC2626' },
    { label: 'Rajasthan', value: 24.5, badge: '+24.5% Lag', color: '#EA580C' },
    { label: 'Madhya Pradesh', value: 27.9, badge: '+27.9% Lag', color: '#EA580C' },
    { label: 'Maharashtra', value: 15.2, badge: '+15.2% Lag', color: '#F59E0B' },
    { label: 'Gujarat', value: 20.3, badge: '+20.3% Lag', color: '#F59E0B' },
    { label: 'Tamil Nadu', value: 11.5, badge: '+11.5% Lag', color: '#EAB308' },
    { label: 'Karnataka', value: 4.9, badge: '+4.9% Balanced', color: '#10B981' },
    { label: 'Delhi', value: 5.4, badge: '+5.4% Balanced', color: '#10B981' }
  ];

  // National Trend 2020 - 2025
  const nationalTrend = [
    { label: 2020, value: 125000 },
    { label: 2021, value: 330000 },
    { label: 2022, value: 1020000 },
    { label: 2023, value: 1530000 },
    { label: 2024, value: 2180000 },
    { label: 2025, value: 3099920 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 mb-2">
          <Database className="w-3.5 h-3.5 text-teal-600" />
          <span>VAHAN Telemetry & Bureau of Energy Efficiency Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Exploratory Data Analysis (EDA) & Statistical Workspace
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
          Bivariate regressions, vehicle category distributions, growth mismatch detection, and correlation matrices.
        </p>
      </div>

      {/* Dataset Health Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Observations</span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            192 Records
          </div>
          <p className="text-xs text-teal-600 font-semibold mt-1">32 States/UTs over 6 Years</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Features Analyzed</span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            21 Features
          </div>
          <p className="text-xs text-blue-600 font-semibold mt-1">Demographics, Density & Power</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Null Cells</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            0 Missing
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">100% Certified Complete</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Integrity Status</span>
          <div className="text-2xl font-extrabold text-sky-600 mt-1">
            Validated
          </div>
          <p className="text-xs text-sky-600 font-semibold mt-1">Zero Duplicate Primary Keys</p>
        </div>
      </div>

      {/* Row 1: Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Vehicle Segment Mix Donut */}
        <InteractiveDonutChart
          title="Vehicle Category Distribution (2025 National Fleet)"
          subtitle="Proportion of two-wheelers, three-wheelers, passenger cars, and public transit fleets"
          data={vehicleClassesData}
          centerLabel="National Fleet"
          centerValue="3.1M EVs"
        />

        {/* Chart 2: National Growth Trend Curve */}
        <InteractiveLineChart
          title="National EV Registration Acceleration (2020–2025)"
          subtitle="Annual adoption expansion across all 32 Indian States and Union Territories"
          data={nationalTrend}
          line1Name="Active EVs"
          line1Color="#0284C7"
          valueSuffix=" EVs"
        />
      </div>

      {/* Row 2: Growth Mismatch Bar Chart & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: YoY Growth Mismatch Bar Chart */}
        <InteractiveBarChart
          title="Regional Growth Mismatch: EV Growth % vs. Charger Growth %"
          subtitle="Positive values represent states where vehicle adoption velocity is outpacing public charger installations"
          data={mismatchData}
          orientation="horizontal"
          valueSuffix="% Delta"
        />

        {/* Chart 4: Correlation Matrix Heatmap */}
        <InteractiveCorrelationHeatmap />
      </div>

      {/* Diagnostic Synthesis Callout */}
      <div className="bg-gradient-to-r from-gray-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
            Core Statistical Takeaway
          </span>
          <h3 className="text-xl font-extrabold text-white">
            Linear Adoption Correlation Diverges in High-Density Northern States
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
            While mature southern states (Karnataka, Tamil Nadu) display near-parity between EV registrations and charger deployment (EV-to-charger ratio ~58:1), northern adoption leaders (Uttar Pradesh, Bihar) exhibit severe structural divergence (ratio &gt; 250:1). This empirical disparity validates the necessity of the mathematical <b>Infrastructure Gap Index</b> to redirect central PM E-DRIVE subsidies to underserved corridors.
          </p>
        </div>
      </div>
    </div>
  );
};
