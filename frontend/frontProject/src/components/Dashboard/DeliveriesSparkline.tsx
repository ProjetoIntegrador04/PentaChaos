import React from "react";
import "./DeliveriesSparkline.css";

type Props = { data: number[]; lineColor?: string };

export default function DeliveriesSparkline({ data, lineColor = "#3b82f6" }: Props) {
  const width = 260;
  const height = 120;
  const pad = 12;

  const max = Math.max(...data, 1);
  const stepX = (width - pad * 2) / (data.length - 1);

  const points = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = height - pad - (v / max) * (height - pad * 2);
    return `${x},${y}`;
  });

  const last = data[data.length - 1];

  return (
    <div className="spark-wrap">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={lineColor}
          strokeWidth="3"
          points={points.join(" ")}
        />
        {points.map((p, i) => {
          const [x, y] = p.split(",").map(Number);
          return <circle key={i} cx={x} cy={y} r="3" fill={lineColor} opacity={i === points.length - 1 ? 1 : 0.4} />;
        })}
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#d1d5db" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#d1d5db" />
      </svg>
      <div className="spark-footer">Último valor: <b>{last}</b></div>
    </div>
  );
}
