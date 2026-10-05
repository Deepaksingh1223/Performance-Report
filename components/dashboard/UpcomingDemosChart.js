"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Card from "./Card";

const tooltipStyle = {
  backgroundColor: "#0c1526",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

/**
 * Donut chart + legend. `data` = [{ name, value, color }].
 */
export default function UpcomingDemosChart({
  title,
  subtitle,
  data,
  className = "",
}) {
  const [active, setActive] = useState(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card title={title} subtitle={subtitle} className={className} bodyClassName="flex flex-col items-center justify-between gap-4">
      <div
        className="relative h-[170px] w-full max-w-[190px] sm:h-[190px] sm:max-w-[210px]"
        role="img"
        aria-label={`${total} upcoming demos in total`}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="64%"
              outerRadius="96%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={1.5}
              stroke="none"
              animationDuration={600}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((d, i) => (
                <Cell
                  key={d.name}
                  fill={d.color}
                  fillOpacity={active === null || active === i ? 1 : 0.4}
                  style={{ transition: "fill-opacity 200ms ease-in-out", cursor: "pointer" }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={{ color: "#fff" }}
              formatter={(v, name) => [`${v} demos`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-soft">Total</span>
          <span className="text-5xl font-medium leading-none tabular-nums text-white sm:text-6xl">
            {total}
          </span>
        </div>
      </div>

      <ul className="w-full space-y-1.5 text-xs">
        {data.map((d, i) => (
          <li
            key={d.name}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`flex items-center gap-2 rounded px-1 py-0.5 transition-all duration-200 ease-in-out hover:bg-white/5 ${
              active !== null && active !== i ? "opacity-50" : "opacity-100"
            }`}
          >
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: d.color }}
            />
            <span className="min-w-0 flex-1 truncate text-soft">{d.name}</span>
            <span className="font-semibold tabular-nums text-white">{d.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
