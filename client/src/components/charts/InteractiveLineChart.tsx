import React, { useState } from 'react';

interface DataPoint {
  label: string | number;
  value: number;
  value2?: number;
  secondaryLabel?: string;
}

interface LineChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  line1Name?: string;
  line2Name?: string;
  line1Color?: string;
  line2Color?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  height?: number;
}

export const InteractiveLineChart: React.FC<LineChartProps> = ({
  title,
  subtitle,
  data,
  line1Name = 'EV Registrations',
  line2Name = 'Charging Stations',
  line1Color = '#0284C7', // Google/Tata Sky Blue
  line2Color = '#10B981', // Emerald Green
  valuePrefix = '',
  valueSuffix = '',
  height = 280
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;
  const width = 600;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const maxVal1 = Math.max(...data.map((d) => d.value), 1);
  const maxVal2 = line2Name && data.some((d) => d.value2 !== undefined)
    ? Math.max(...data.map((d) => d.value2 || 0), 1)
    : maxVal1;

  // Scale for primary value (left Y-axis)
  const getY1 = (val: number) =>
    paddingTop + plotHeight - (val / maxVal1) * plotHeight;

  // Scale for secondary value (if 2 series)
  const getY2 = (val: number) =>
    paddingTop + plotHeight - (val / maxVal2) * plotHeight;

  const getX = (idx: number) =>
    paddingLeft + (idx / (data.length - 1)) * plotWidth;

  // Generate SVG path strings
  const pathD1 = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY1(d.value)}`)
    .join(' ');

  const areaD1 = `${pathD1} L ${getX(data.length - 1)} ${
    paddingTop + plotHeight
  } L ${getX(0)} ${paddingTop + plotHeight} Z`;

  const hasSeries2 = data.some((d) => d.value2 !== undefined);
  const pathD2 = hasSeries2
    ? data
        .map(
          (d, i) =>
            `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY2(d.value2 || 0)}`
        )
        .join(' ')
    : '';

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-2 gap-2">
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

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: line1Color }}
            ></span>
            <span className="text-gray-700 dark:text-gray-300">{line1Name}</span>
          </div>
          {hasSeries2 && (
            <div className="flex items-center space-x-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: line2Color }}
              ></span>
              <span className="text-gray-700 dark:text-gray-300">{line2Name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={line1Color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={line1Color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + plotHeight * pct;
            const labelVal = Math.round(maxVal1 * (1 - pct));
            return (
              <g key={idx}>
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
                  {labelVal >= 1000000
                    ? `${(labelVal / 1000000).toFixed(1)}M`
                    : labelVal >= 1000
                    ? `${(labelVal / 1000).toFixed(0)}k`
                    : labelVal}
                </text>
              </g>
            );
          })}

          {/* Area under curve 1 */}
          <path
            d={areaD1}
            fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
          />

          {/* Line 1 */}
          <path
            d={pathD1}
            fill="none"
            stroke={line1Color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Line 2 (if present) */}
          {hasSeries2 && (
            <path
              d={pathD2}
              fill="none"
              stroke={line2Color}
              strokeWidth="2.5"
              strokeDasharray="5 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* X Axis Labels & Interactive Points */}
          {data.map((d, i) => {
            const x = getX(i);
            const y1 = getY1(d.value);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={paddingTop + plotHeight}
                    stroke="currentColor"
                    className="text-gray-300 dark:text-gray-700"
                    strokeDasharray="3 3"
                  />
                )}

                {/* X Axis Label */}
                <text
                  x={x}
                  y={height - paddingBottom + 18}
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${
                    isHovered
                      ? 'fill-teal-600 dark:fill-teal-400'
                      : 'fill-gray-500 dark:fill-gray-400'
                  }`}
                >
                  {d.label}
                </text>

                {/* Data Point 1 */}
                <circle
                  cx={x}
                  cy={y1}
                  r={isHovered ? 6 : 4}
                  fill="white"
                  stroke={line1Color}
                  strokeWidth={isHovered ? 3 : 2}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Data Point 2 (if present) */}
                {hasSeries2 && d.value2 !== undefined && (
                  <circle
                    cx={x}
                    cy={getY2(d.value2)}
                    r={isHovered ? 6 : 3.5}
                    fill="white"
                    stroke={line2Color}
                    strokeWidth={isHovered ? 3 : 2}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                )}

                {/* Invisible larger hover zone for easier touch */}
                <rect
                  x={x - 20}
                  y={paddingTop}
                  width={40}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Card */}
        {hoveredItem && hoveredIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 min-w-[140px] border border-gray-700"
            style={{
              left: `${(getX(hoveredIndex) / width) * 100}%`,
              top: `${(getY1(hoveredItem.value) / height) * 100 - 4}%`
            }}
          >
            <div className="font-extrabold text-[11px] text-gray-300 pb-1 border-b border-gray-700">
              Year {hoveredItem.label}
            </div>
            <div className="flex justify-between items-center space-x-2">
              <span className="text-gray-400 text-[11px]">{line1Name}:</span>
              <span className="font-extrabold text-sky-400">
                {valuePrefix}
                {hoveredItem.value.toLocaleString()}
                {valueSuffix}
              </span>
            </div>
            {hasSeries2 && hoveredItem.value2 !== undefined && (
              <div className="flex justify-between items-center space-x-2">
                <span className="text-gray-400 text-[11px]">{line2Name}:</span>
                <span className="font-extrabold text-emerald-400">
                  {hoveredItem.value2.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

