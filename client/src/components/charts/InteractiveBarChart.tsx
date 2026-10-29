import React, { useState } from 'react';

interface BarItem {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
  badge?: string;
}

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: BarItem[];
  orientation?: 'vertical' | 'horizontal';
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  showZeroLine?: boolean;
}

export const InteractiveBarChart: React.FC<BarChartProps> = ({
  title,
  subtitle,
  data,
  orientation = 'horizontal',
  height = 340,
  valuePrefix = '',
  valueSuffix = '',
  showZeroLine = false
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => Math.abs(d.value)), 1);

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

      {orientation === 'horizontal' ? (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
          {data.map((item, idx) => {
            const widthPct = Math.min(100, (Math.abs(item.value) / maxVal) * 100);
            const isHovered = hoveredIdx === idx;
            const barColor = item.color || '#0284C7';

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isHovered ? 'bg-gray-50 dark:bg-gray-800/80 shadow-sm' : ''
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-gray-900 dark:text-white truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-extrabold text-gray-900 dark:text-white ml-2 flex-shrink-0">
                    {valuePrefix}
                    {item.value.toLocaleString()}
                    {valueSuffix}
                  </span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: barColor
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Vertical Bar Chart */
        <div className="h-64 flex items-end justify-between space-x-2 pt-6 pb-2 px-1">
          {data.map((item, idx) => {
            const heightPct = Math.min(100, (item.value / maxVal) * 100);
            const isHovered = hoveredIdx === idx;
            const barColor = item.color || '#0284C7';

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Tooltip value */}
                <div
                  className={`text-[10px] font-mono font-bold mb-1 transition-opacity ${
                    isHovered
                      ? 'opacity-100 text-teal-600 dark:text-teal-400'
                      : 'opacity-0'
                  }`}
                >
                  {item.value.toLocaleString()}
                </div>

                {/* Vertical Bar */}
                <div className="w-full max-w-[40px] bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: barColor
                    }}
                  ></div>
                </div>

                {/* X Axis Label */}
                <span className="text-[10px] text-gray-500 font-semibold mt-2 truncate max-w-[60px] text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

