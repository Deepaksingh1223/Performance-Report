"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Card from "./Card";
import { formatMillions } from "@/lib/format";

const tooltipStyle = {
  backgroundColor: "#0c1526",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

/**
 * 270° gauge showing progress towards a target (values in millions).
 */
export default function CircularProgress({
  title,
  subtitle,
  value,
  target,
  className = "",
}) {
  const remaining = Math.max(target - value, 0);
  const data = [
    { name: "Won", value, fill: "url(#gaugeProgress)" },
    { name: "Remaining", value: remaining, fill: "#5b6b8c" },
  ];
  const pct = Math.round((value / target) * 100);

  return (
    <Card title={title} subtitle={subtitle} className={className} bodyClassName="relative flex items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(240,69,75,0.32) 0%, rgba(240,69,75,0) 70%)",
        }}
      />

      <div
        className="relative h-[170px] w-full max-w-[240px] sm:h-[200px] sm:max-w-[270px]"
        role="img"
        aria-label={`${formatMillions(value)} of ${formatMillions(target)} target, ${pct}%`}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <defs>
              <linearGradient id="gaugeProgress" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#f0454b" />
                <stop offset="100%" stopColor="#f59a3c" />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              startAngle={225}
              endAngle={-45}
              innerRadius="76%"
              outerRadius="92%"
              cornerRadius={6}
              paddingAngle={2}
              stroke="none"
              isAnimationActive
              animationDuration={600}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={{ color: "#fff" }}
              formatter={(v, name) => [formatMillions(v), name]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold leading-tight text-brand-red tabular-nums sm:text-2xl">
            {formatMillions(value)}
          </span>
          <span className="text-sm font-medium leading-tight text-muted tabular-nums">
            {formatMillions(target, 0)}
          </span>
        </div>
      </div>
    </Card>
  );
}
