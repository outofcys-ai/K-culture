import React from "react";
import { motion } from "motion/react";
import { PungryuScores } from "../types";

interface RadarChartProps {
  scores: PungryuScores;
}

export default function PungryuRadarChart({ scores }: RadarChartProps) {
  // Center and Radius configuration
  const cx = 160;
  const cy = 160;
  const maxR = 100;

  // Axis definitions
  // 0: 흥 (Heung) - Top, 1: 한과 정 (Han & Jeong) - Right, 2: 멋 (Meot) - Bottom, 3: 융합성 (Integration) - Left
  const axes = [
    { label: "흥 (興)", score: scores.heung, angle: -Math.PI / 2, color: "#b24d38" }, // clay
    { label: "한과 정 (情)", score: scores.hanAndJeong, angle: 0, color: "#d97706" }, // amber
    { label: "멋 (멋)", score: scores.meot, angle: Math.PI / 2, color: "#3b6b55" }, // celadon
    { label: "융합성 (流)", score: scores.integration, angle: Math.PI, color: "#334155" }, // slate
  ];

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Calculate polygon points based on scores
  const getPointsString = (customScores: PungryuScores) => {
    return [
      customScores.heung,
      customScores.hanAndJeong,
      customScores.meot,
      customScores.integration
    ].map((val, idx) => {
      const angle = axes[idx].angle;
      const r = (val / 100) * maxR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  };

  const pointsStr = getPointsString(scores);

  return (
    <div className="flex flex-col items-center justify-center bg-paper-white border border-clay/10 rounded-2xl p-6 shadow-inner relative overflow-hidden group">
      {/* Astrolabe Compass layout context */}
      <span className="absolute top-2 left-3 font-mono text-[9px] text-ink-light tracking-widest">
        AESTHETIC RADAR VIEW
      </span>
      <span className="absolute bottom-2 right-3 font-mono text-[9px] text-clay/80 tracking-widest font-bold">
        風流 四端
      </span>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 320 320"
        className="max-w-[280px] md:max-w-[300px] drop-shadow-sm"
      >
        <defs>
          {/* Soft traditional ink and clay gradients */}
          <radialGradient id="celestial-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5f3ef" stopOpacity="1" />
            <stop offset="100%" stopColor="#fcfbfa" stopOpacity="0.5" />
          </radialGradient>
          <linearGradient id="clay-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b24d38" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#b24d38" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Ambient background ring representing Zen compass */}
        <circle cx={cx} cy={cy} r={maxR + 15} fill="url(#celestial-glow)" stroke="#e8e3da" strokeWidth="0.5" />
        <circle cx={cx} cy={cy} r={maxR + 15} fill="none" stroke="#baa291" strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />

        {/* Concentric Traditional Grid Diamonds */}
        {levels.map((level, lIdx) => {
          const r = level * maxR;
          // Create path for 4-axis diamond grid
          const dPoints = axes.map((axis) => {
            const x = cx + r * Math.cos(axis.angle);
            const y = cy + r * Math.sin(axis.angle);
            return `${x},${y}`;
          }).join(" ");

          const isOuter = lIdx === levels.length - 1;

          return (
            <g key={lIdx}>
              <polygon
                points={dPoints}
                fill="none"
                stroke={isOuter ? "#baa291" : "#e8e3da"}
                strokeWidth={isOuter ? 1.25 : 0.75}
                opacity={isOuter ? 1 : 0.8}
              />
              {/* Score level percentage callouts */}
              {lIdx > 0 && (
                <text
                  x={cx + 3}
                  y={cy - r + 3}
                  fill="#8c827c"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  className="select-none opacity-60"
                >
                  {Math.round(level * 100)}
                </text>
              )}
            </g>
          );
        })}

        {/* Axis line extensions */}
        {axes.map((axis, aIdx) => {
          const xMax = cx + maxR * Math.cos(axis.angle);
          const yMax = cy + maxR * Math.sin(axis.angle);
          return (
            <line
              key={aIdx}
              x1={cx}
              y1={cy}
              x2={xMax}
              y2={yMax}
              stroke="#e8e3da"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Animated Radar Area Polygon */}
        <motion.polygon
          points={pointsStr}
          fill="url(#clay-grad)"
          stroke="#b24d38"
          strokeWidth="2.5"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          layoutId="radar-poly"
        />

        {/* Outer and Inner interactive points marker rings */}
        {axes.map((axis, idx) => {
          const r = (axis.score / 100) * maxR;
          const x = cx + r * Math.cos(axis.angle);
          const y = cy + r * Math.sin(axis.angle);

          return (
            <g key={idx}>
              {/* Outer decorative ring */}
              <motion.circle
                cx={x}
                cy={y}
                r="6"
                fill="none"
                stroke={axis.color}
                strokeWidth="1"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1, 1.4, 1], opacity: 1 }}
                transition={{ repeat: Infinity, duration: 3, delay: idx * 0.4 }}
              />
              {/* Inner core circle */}
              <motion.circle
                cx={x}
                cy={y}
                r="3.5"
                fill={axis.color}
                stroke="#fcfbfa"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Center core point matching traditional focal point */}
        <circle cx={cx} cy={cy} r="3" fill="#b24d38" />

        {/* Axis Labels Positioned Dynamically Outside Radar Bounds */}
        {axes.map((axis, idx) => {
          const labelDist = maxR + 25;
          const x = cx + labelDist * Math.cos(axis.angle);
          const y = cy + labelDist * Math.sin(axis.angle);

          // Customize text anchor and vertical alignment for clean layouts
          let textAnchor = "middle";
          let dy = "0.35em";

          if (idx === 1) { // Right ( 한과 정 )
            textAnchor = "start";
          } else if (idx === 3) { // Left ( 융합성 )
            textAnchor = "end";
          } else if (idx === 0) { // Top ( 흥 )
            dy = "-0.2em";
          } else if (idx === 2) { // Bottom ( 멋 )
            dy = "1em";
          }

          return (
            <g key={idx} className="select-none">
              <rect
                x={x - (idx === 3 ? 55 : idx === 1 ? -5 : 30)}
                y={y - 10}
                width="60"
                height="18"
                rx="4"
                fill="#f5f3ef"
                opacity="0.85"
                className="hidden"
              />
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                dy={dy}
                fill="#161514"
                fontWeight="700"
                fontSize="12"
                fontFamily="Gowun Batang, Georgia, serif"
                className="font-serif block"
              >
                {axis.label}
              </text>
              {/* Score indicator subscript text */}
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                dy={idx === 2 ? "2em" : idx === 0 ? "-1.3em" : "1.4em"}
                fill={axis.color}
                fontSize="10"
                fontWeight="600"
                fontFamily="JetBrains Mono, monospace"
              >
                {axis.score}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
