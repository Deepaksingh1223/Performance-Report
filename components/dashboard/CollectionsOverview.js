"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Crown, Radio, TrendingUp } from "lucide-react";

const REPORT_PERIODS = [
  { id: "day", label: "Today", factor: 1 / 30 },
  { id: "week", label: "This week", factor: 7 / 30 },
  { id: "month", label: "This month", factor: 1 },
];

const formatRupees = (amount) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

const formatCrores = (amount) =>
  `₹${(amount / 10000000).toFixed(2)} Cr`;

function AnimatedTotal({ value }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const startValue = previousValue.current;
    const difference = value - startValue;
    const duration = 1000;
    let frameId;
    let startTime;

    const animate = (time) => {
      if (startTime === undefined) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(startValue + difference * easedProgress));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        previousValue.current = value;
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <>{formatRupees(displayValue)}</>;
}

export default function CollectionsOverview({ total, teams, teamCollections }) {
  const [reportPeriod, setReportPeriod] = useState("month");
  const period = REPORT_PERIODS.find((item) => item.id === reportPeriod);
  const reportTeams = teams
    .map((team) => ({
      ...team,
      reportCollection: (teamCollections[team.id] ?? 0) * period.factor,
    }))
    .sort((a, b) => b.reportCollection - a.reportCollection);
  const reportTotal = total * period.factor;
  const highestTeam = reportTeams[0];
  const lowestTeam = reportTeams[reportTeams.length - 1];

  return (
    <section
      aria-labelledby="company-collection-title"
      className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#172947] via-[#13233c] to-[#101a2c] shadow-xl shadow-black/20"
    >
      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
              <TrendingUp className="size-4" aria-hidden="true" />
            </span>
            <h2
              id="company-collection-title"
              className="text-sm font-semibold text-soft sm:text-base"
            >
              Company Total Collection
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-brand-green/10 px-2 py-1 text-[10px] font-semibold text-brand-green">
              <Radio className="size-3 animate-pulse" aria-hidden="true" />
              LIVE
            </span>
          </div>

          <p
            className="mt-3 break-all text-3xl font-bold leading-tight tracking-tight text-white tabular-nums sm:text-4xl lg:text-5xl"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatedTotal value={total} />
          </p>
          <p className="mt-1 text-sm font-medium text-brand-green">
            {formatCrores(total)} <span className="text-muted">total collected</span>
          </p>
          <p className="mt-2 text-xs text-muted">
            Collection report automatically refreshes while this dashboard is open.
          </p>
        </div>

        <div className="min-w-0">
          <div
            role="tablist"
            aria-label="Collection report period"
            className="grid grid-cols-3 rounded-xl border border-white/[0.08] bg-black/20 p-1"
          >
            {REPORT_PERIODS.map((item) => (
              <button
                key={item.id}
                id={`collection-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={reportPeriod === item.id}
                aria-controls="collection-report-panel"
                onClick={() => setReportPeriod(item.id)}
                className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors duration-200 sm:text-sm ${
                  reportPeriod === item.id
                    ? "bg-[#2a3d68] text-white shadow-sm"
                    : "text-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            id="collection-report-panel"
            role="tabpanel"
            aria-labelledby={`collection-tab-${reportPeriod}`}
            className="mt-3"
          >
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {period.label} collection
                </p>
                <p className="mt-0.5 text-xl font-bold tabular-nums text-white sm:text-2xl">
                  {formatRupees(reportTotal)}
                </p>
              </div>
              <p className="pb-1 text-[10px] text-muted">Team performance</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { team: highestTeam, icon: ArrowUpRight, label: "Top team", color: "text-brand-green" },
                { team: lowestTeam, icon: ArrowDownRight, label: "Needs focus", color: "text-brand-orange" },
              ].map(({ team, icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3"
                >
                  <p className="flex items-center gap-1 text-[10px] font-medium text-muted">
                    <Icon className={`size-3.5 ${color}`} aria-hidden="true" />
                    {label}
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-white">{team?.name ?? "—"}</p>
                  <p className={`mt-0.5 truncate text-xs font-semibold tabular-nums ${color}`}>
                    {formatRupees(team?.reportCollection ?? 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t border-white/[0.07] px-4 py-2 text-[10px] text-muted sm:px-6">
        <Crown className="size-3 text-brand-yellow" aria-hidden="true" />
        Team collection shares are distributed using the current demo sales data.
      </div>
    </section>
  );
}
