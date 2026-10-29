import React, { useState } from 'react';

interface DonutSlice {
  label: string;
  value: number;
  color: string;
  description?: string;
}

interface DonutChartProps {
  title: string;
  subtitle?: string;
  data: DonutSlice[];
  centerLabel?: string;
  centerValue?: string;
}

export const InteractiveDonutChart: React.FC<DonutChartProps> = ({
  title,
  subtitle,
  data,
  centerLabel = 'Total Fleet',
  centerValue
}) => {
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;

  // SVG parameters
  const size = 240;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  const displayCenterValue =
    activeSlice !== null
      ? `${((data[activeSlice].value / total) * 100).toFixed(1)}%`
      : centerValue || total.toLocaleString();

  const displayCenterLabel =
    activeSlice !== null ? data[activeSlice].label : centerLabel;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* SVG Donut */}
        <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
            {data.map((slice, idx) => {
              const strokeDasharray = `${
                (slice.value / total) * circumference
              } ${circumference}`;
              const strokeDashoffset = -cumulativeAngle;
              cumulativeAngle += (slice.value / total) * circumference;

              const isHovered = activeSlice === idx;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="cursor-pointer transition-all duration-300 hover:opacity-90"
                  onMouseEnter={() => setActiveSlice(idx)}
                  onMouseLeave={() => setActiveSlice(null)}
                />
              );
            })}
          </svg>

          {/* Center Callout */}
          <div className="absolute text-center pointer-events-none px-2">
            <span className="text-lg font-extrabold text-gray-900 dark:text-white block font-mono">
              {displayCenterValue}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider line-clamp-1">
              {displayCenterLabel}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 flex-1 w-full">
          {data.map((slice, idx) => {
            const pct = ((slice.value / total) * 100).toFixed(1);
            const isHovered = activeSlice === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveSlice(idx)}
                onMouseLeave={() => setActiveSlice(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  isHovered
                    ? 'border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80 shadow-sm'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: slice.color }}
                  ></span>
                  <span className="font-bold text-gray-800 dark:text-gray-200 truncate">
                    {slice.label}
                  </span>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0 font-mono">
                  <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                    {slice.value.toLocaleString()}
                  </span>
                  <span className="font-extrabold text-gray-900 dark:text-white">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

