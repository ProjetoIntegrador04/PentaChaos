import React from "react";
import "./FrequencyDonut.css";

type Props = {
  present: number; // 0-100
  absent: number;  // 0-100
  labels?: [string, string];
  colors?: [string, string];
};

export default function FrequencyDonut({
  present,
  absent,
  labels = ["Presenças", "Faltas"],
  colors = ["#3b82f6", "#f59e0b"],
}: Props) {
  const size = 160;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;

  const presentLen = (present / 100) * circ;
  const absentLen = (absent / 100) * circ;

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors[0]}
            strokeWidth={stroke}
            strokeDasharray={`${presentLen} ${circ - presentLen}`}
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors[1]}
            strokeWidth={stroke}
            strokeDasharray={`${absentLen} ${circ - absentLen}`}
            strokeDashoffset={-presentLen}
            strokeLinecap="round"
          />
        </g>
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className="donut-center"
        >
          {present}%
        </text>
      </svg>

      <ul className="donut-legend">
        <li>
          <span className="dot" style={{ background: colors[0] }} />
          {labels[0]}
        </li>
        <li>
          <span className="dot" style={{ background: colors[1] }} />
          {labels[1]}
        </li>
      </ul>
    </div>
  );
}
