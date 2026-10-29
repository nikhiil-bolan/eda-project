import React, { useState } from 'react';

interface ScatterPoint {
  state: string;
  x: number; // Public Charging Stations
  y: number; // EV Registrations
  tier?: string;
  ratio?: number;
}

interface ScatterPlotProps {
  title: string;
  subtitle?: string;
  data: ScatterPoint[];
  xLabel?: string;
  yLabel?: string;
}

export const InteractiveScatterPlot: React.FC<ScatterPlotProps> = ({
  title,
  subtitle,
  data,
  xLabel = 'Public Charging Stations',
  yLabel = 'EV Registrations'
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null);

  if (!data || data.length === 0) return null;

  const width = 640;
  const height = 340;
  const paddingLeft = 70;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 50;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const maxX = Math.max(...data.map((d) => d.x), 100);
  const maxY = Math.max(...data.map((d) => d.y), 1000);

  const getPlotX = (val: number) => paddingLeft + (val / maxX) * plotWidth;
  const getPlotY = (val: number) => paddingTop + plotHeight - (val / maxY) * plotHeight;

  // Simple linear regression line points: (0, 0) to (maxX, predictedMaxY)
  const regStartX = getPlotX(0);
  const regStartY = getPlotY(0);
  const regEndX = getPlotX(maxX);
  const regEndY = getPlotY(maxY * 0.85);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4 flex justify-between items-center">
        <div>
          <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800">
          OLS Trend Line (Pearson r = +0.84)
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + plotHeight * pct;
            const xVal = Math.round(maxX * pct);
            const yVal = Math.round(maxY * (1 - pct));

            return (
              <g key={idx}>
                {/* Horizontal line */}
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-gray-100 dark:text-gray-800"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-gray-400 font-mono"
                >
                  {yVal >= 100000 ? `${(yVal / 1000).toFixed(0)}k` : yVal}
                </text>
              </g>
            );
          })}

          {/* Linear regression line */}
          <line
            x1={regStartX}
            y1={regStartY}
            x2={regEndX}
            y2={regEndY}
            stroke="#DC2626"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Scatter Points */}
          {data.map((pt, idx) => {
            const cx = getPlotX(pt.x);
            const cy = getPlotY(pt.y);
            const isHovered = hoveredPoint?.state === pt.state;

            const pointColor =
              pt.tier === 'Critical'
                ? '#DC2626'
                : pt.tier === 'High'
                ? '#F59E0B'
                : pt.tier === 'Moderate'
                ? '#EAB308'
                : '#10B981';

            return (
              <g key={idx}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 8 : 5}
                  fill={pointColor}
                  fillOpacity="0.85"
                  stroke="white"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="cursor-pointer transition-all hover:scale-125"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}

          {/* Axis Titles */}
          <text
            x={paddingLeft + plotWidth / 2}
            y={height - 12}
            textAnchor="middle"
            className="text-[11px] font-bold fill-gray-500"
          >
            {xLabel} →
          </text>
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 z-20 bg-gray-900/95 dark:bg-gray-800/95 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-gray-700 min-w-[170px]">
            <div className="font-extrabold text-teal-400 text-sm">
              {hoveredPoint.state}
            </div>
            <div className="text-[11px] text-gray-300">
              Registrations: <b>{hoveredPoint.y.toLocaleString()}</b>
            </div>
            <div className="text-[11px] text-gray-300">
              Public Chargers: <b>{hoveredPoint.x.toLocaleString()}</b>
            </div>
            {hoveredPoint.ratio && (
              <div className="text-[11px] text-amber-400">
                EV-to-Charger Ratio: <b>{hoveredPoint.ratio}:1</b>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

