import React, { useState } from 'react';

interface HeatmapCell {
  row: string;
  col: string;
  val: number;
}

export const InteractiveCorrelationHeatmap: React.FC = () => {
  const [activeCell, setActiveCell] = useState<HeatmapCell | null>(null);

  const features = [
    'EV Volume',
    'Stations',
    'Population',
    'Urbanization',
    'Gap Score'
  ];

  const matrix: number[][] = [
    [1.00, 0.84, 0.69, 0.52, 0.63],
    [0.84, 1.00, 0.48, 0.42, 0.31],
    [0.69, 0.48, 1.00, 0.38, 0.59],
    [0.52, 0.42, 0.38, 1.00, 0.58],
    [0.63, 0.31, 0.59, 0.58, 1.00]
  ];

  const getColor = (val: number) => {
    if (val === 1.0) return 'bg-teal-700 text-white font-extrabold';
    if (val >= 0.8) return 'bg-teal-600 text-white font-bold';
    if (val >= 0.6) return 'bg-teal-500/80 text-white font-bold';
    if (val >= 0.4) return 'bg-teal-400/50 text-gray-900 dark:text-white font-semibold';
    return 'bg-teal-100 dark:bg-teal-950/40 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
          Pearson Feature Correlation Heatmap Matrix
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Quantifies statistical interdependence across demographic and infrastructural indicators
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-[11px] font-bold text-gray-400 uppercase">
                Indicator
              </th>
              {features.map((f) => (
                <th
                  key={f}
                  className="p-2 text-[11px] font-bold text-gray-600 dark:text-gray-400"
                >
                  {f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((rowName, rIdx) => (
              <tr key={rowName}>
                <td className="p-2 text-left font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                  {rowName}
                </td>
                {features.map((colName, cIdx) => {
                  const val = matrix[rIdx][cIdx];
                  const isHovered =
                    activeCell?.row === rowName && activeCell?.col === colName;

                  return (
                    <td
                      key={colName}
                      onMouseEnter={() =>
                        setActiveCell({ row: rowName, col: colName, val })
                      }
                      onMouseLeave={() => setActiveCell(null)}
                      className="p-1 cursor-pointer transition-transform hover:scale-105"
                    >
                      <div
                        className={`py-2 px-1 rounded-lg text-xs font-mono transition-all ${getColor(
                          val
                        )} ${isHovered ? 'ring-2 ring-gray-900 dark:ring-white shadow-md' : ''}`}
                      >
                        {val.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Callout on hover */}
      {activeCell && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl text-xs flex justify-between items-center border border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-300">
            Correlation between <b>{activeCell.row}</b> & <b>{activeCell.col}</b>:
          </span>
          <span className="font-mono font-extrabold text-teal-600 dark:text-teal-400 text-sm">
            r = {activeCell.val.toFixed(2)}{' '}
            {activeCell.val >= 0.8
              ? '(Very Strong Positive)'
              : activeCell.val >= 0.6
              ? '(Strong Positive)'
              : activeCell.val >= 0.4
              ? '(Moderate Positive)'
              : '(Weak Positive)'}
          </span>
        </div>
      )}
    </div>
  );
};

