'use client';

import { useMemo } from 'react';

/**
 * A sleek, dependency-free SVG Line Chart for Patient Trends.
 * @param {{ data: Array<{label: string, value: number}> }} props
 */
export default function TrendChart({ data = [] }) {
  const maxVal = useMemo(() => Math.max(...data.map(d => d.value), 5), [data]);

  // Chart dimensions
  const width = 1000;
  const height = 240;
  const padding = 40;

  const points = useMemo(() => {
    if (!data.length) return "";
    return data.map((d, i) => {
      const x = padding + (i * (width - padding * 2)) / (data.length - 1);
      const y = height - padding - (d.value / maxVal) * (height - padding * 2);
      return { x, y };
    });
  }, [data, maxVal]);

  // Create smooth cubic bezier path
  const pathData = useMemo(() => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }, [points]);

  const areaData = useMemo(() => {
    if (!pathData) return "";
    return `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  }, [pathData, points]);

  return (
    <div className="mgmt-trend-section">
      <div className="mgmt-card">
        <div className="mgmt-card__header">
          <div className="mgmt-card__title">
            7-Day Patient Visit Trend
          </div>
          <div className="mgmt-card__subtitle">Visualizing daily prescription volume</div>
        </div>
        <div className="mgmt-card__body pt-0">
          <div className="mgmt-chart-container">
            <svg viewBox={`0 0 ${width} ${height}`} className="mgmt-trend-svg">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--mgmt-accent)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--mgmt-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((v, i) => {
                const y = padding + v * (height - padding * 2);
                return (
                  <line
                    key={i}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="var(--mgmt-border)"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area under the curve */}
              <path d={areaData} fill="url(#trendGradient)" />

              {/* The Curve */}
              <path
                d={pathData}
                fill="none"
                stroke="var(--mgmt-accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="trend-path-animate"
              />

              {/* Data Points */}
              {points.map((p, i) => (
                <g key={i} className="chart-point-group">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="6"
                    fill="var(--mgmt-surface)"
                    stroke="var(--mgmt-accent)"
                    strokeWidth="3"
                  />
                  <text
                    x={p.x}
                    y={height - 10}
                    textAnchor="middle"
                    className="chart-axis-label"
                  >
                    {data[i].label}
                  </text>
                  <text
                    x={p.x}
                    y={p.y - 15}
                    textAnchor="middle"
                    className="chart-value-label"
                  >
                    {data[i].value}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mgmt-trend-section {
          margin-bottom: 24px;
          animation: fadeIn 0.5s ease-out;
        }
        .mgmt-chart-container {
          padding: 20px 10px 10px;
          position: relative;
        }
        .mgmt-trend-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .chart-axis-label {
          font-size: 14px;
          font-weight: 600;
          fill: var(--mgmt-text-secondary);
          text-transform: uppercase;
        }
        .chart-value-label {
          font-size: 16px;
          font-weight: 800;
          fill: var(--mgmt-text);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .chart-point-group:hover .chart-value-label {
          opacity: 1;
        }
        .chart-point-group circle {
          transition: r 0.2s, stroke-width 0.2s;
          cursor: pointer;
        }
        .chart-point-group:hover circle {
          r: 8;
          stroke-width: 4;
        }
        .trend-path-animate {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: dash 2s ease-out forwards;
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
