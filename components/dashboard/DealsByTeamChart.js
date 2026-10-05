"use client";

import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./Card";
import { formatThousandsAsMillions } from "@/lib/format";

const tickStyle = { fill: "#8d9dbf", fontSize: 11 };

function TeamTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;

  return (
    <div className="rounded-lg border border-white/10 bg-[#0c1526] px-3 py-2 text-xs shadow-lg">
      <p className="text-muted">{name}</p>
      <p className="mt-0.5 text-sm font-semibold text-white">
        {formatThousandsAsMillions(value)}
      </p>
    </div>
  );
}

export default function DealsByTeamChart({
  title,
  subtitle,
  teams,
  average,
  className = "",
}) {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      className={className}
      action={
        <p className="shrink-0 text-xs text-soft">
          Average{" "}
          <span className="text-base font-semibold tabular-nums text-white">
            {formatThousandsAsMillions(average)}
          </span>
        </p>
      }
      bodyClassName="flex"
    >
      <div
        className="h-[260px] w-full sm:h-[300px] lg:h-full lg:min-h-[260px]"
        role="img"
        aria-label={`Deals by team: ${teams
          .map((t) => `${t.name} ${formatThousandsAsMillions(t.value)}`)
          .join(", ")}`}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={teams} margin={{ top: 24, right: 12, bottom: 4, left: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={tickStyle}
              height={32}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={52}
              domain={[0, "dataMax + 300"]}
              tick={tickStyle}
              tickFormatter={(v) => (v === 0 ? "0" : `${v.toLocaleString("en-US")}k`)}
            />
            <Tooltip
              content={<TeamTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Bar
              dataKey="value"
              barSize={8}
              radius={4}
              fill="#5bb8ff"
              background={{ fill: "#2a3a5f", radius: 4 }}
              animationDuration={600}
            >
              <LabelList
                dataKey="value"
                position="top"
                offset={8}
                formatter={formatThousandsAsMillions}
                fill="#ffffff"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
