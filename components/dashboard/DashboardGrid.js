"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import StatCard from "./StatCard";
import RevenueRepCard from "./RevenueRepCard";
import CircularProgress from "./CircularProgress";
import UpcomingDemosChart from "./UpcomingDemosChart";
import EmployeeTable from "./EmployeeTable";
import DealsByTeamChart from "./DealsByTeamChart";
import TeamOverview from "./TeamOverview";
import CollectionsOverview from "./CollectionsOverview";
import {
  PERIODS,
  TEAM_STRUCTURE,
  dashboardData,
  getAverageTeamValue,
  getDemoSegments,
  getTopReps,
  getTeamSummaries,
  regenerateData,
} from "@/data/dashboardData";
import { formatMillions, formatPercent } from "@/lib/format";

const SIMULATED_DELAY_MS = 700;
const LIVE_COLLECTION_INTERVAL_MS = 2500;
const INITIAL_COMPANY_COLLECTION = 150_000_000;

const createInitialTeamCollections = () => {
  const teams = getTeamSummaries(dashboardData.current.employees);
  const totalWeight = teams.reduce((sum, team) => sum + team.collection, 0);
  let assigned = 0;

  return Object.fromEntries(
    teams.map((team, index) => {
      const amount =
        index === teams.length - 1
          ? INITIAL_COMPANY_COLLECTION - assigned
          : Math.round(
              (INITIAL_COMPANY_COLLECTION * team.collection) / totalWeight
            );
      assigned += amount;
      return [team.id, amount];
    })
  );
};

export default function DashboardGrid() {
  const [period, setPeriod] = useState("current");
  const [store, setStore] = useState(dashboardData);
  const [companyTotal, setCompanyTotal] = useState(INITIAL_COMPANY_COLLECTION);
  const [teamCollections, setTeamCollections] = useState(createInitialTeamCollections);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      const increase = 15_000 + (tick % 5) * 5_000;
      const teamId = TEAM_STRUCTURE[tick % TEAM_STRUCTURE.length].id;
      tick += 1;

      setCompanyTotal((total) => total + increase);
      setTeamCollections((collections) => ({
        ...collections,
        [teamId]: (collections[teamId] ?? 0) + increase,
      }));
    }, LIVE_COLLECTION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const simulateLoading = useCallback((work) => {
    clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => {
      work?.();
      setLoading(false);
    }, SIMULATED_DELAY_MS);
  }, []);

  const handleRefresh = () =>
    simulateLoading(() =>
      setStore((prev) => ({ ...prev, [period]: regenerateData(prev[period]) }))
    );

  const handlePeriodChange = (id) => {
    if (id === period) return;
    setPeriod(id);
    simulateLoading();
  };

  const data = store[period];
  const periodLabel = PERIODS.find((p) => p.id === period).label;

  const topReps = useMemo(() => getTopReps(data.employees), [data.employees]);
  const demoSegments = useMemo(
    () => getDemoSegments(data.employees, data.demosOther),
    [data.employees, data.demosOther]
  );
  const teams = useMemo(() => getTeamSummaries(data.employees), [data.employees]);
  const averageTeamValue = useMemo(() => getAverageTeamValue(teams), [teams]);

  const stats = [
    { id: "inbound", title: "Inbound Revenue", value: formatPercent(data.inboundShare), layout: "lg:col-start-3 lg:row-start-1 lg:row-span-5" },
    { id: "outbound", title: "Outbound Revenue", value: formatPercent(data.outboundShare), layout: "lg:col-start-4 lg:row-start-1 lg:row-span-5" },
    { id: "upgrade", title: "Revenue from Upgrade", value: formatPercent(data.upgradeShare), layout: "lg:col-start-3 lg:row-start-6 lg:row-span-5" },
    { id: "customers", title: "New Customers", value: data.newCustomers, layout: "lg:col-start-4 lg:row-start-6 lg:row-span-5" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <CollectionsOverview
        total={companyTotal}
        teams={teams}
        teamCollections={teamCollections}
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <div
          role="group"
          aria-label="Reporting period"
          className="flex rounded-lg border border-line bg-card p-0.5"
        >
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePeriodChange(p.id)}
              aria-pressed={period === p.id}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-in-out ${
                period === p.id
                  ? "bg-[#2a3d68] text-white"
                  : "text-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-medium text-soft transition-all duration-200 ease-in-out hover:border-white/20 hover:bg-card-hover hover:text-white disabled:cursor-wait disabled:opacity-70"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
          {loading ? "Refreshing…" : "Refresh data"}
        </button>
      </div>

      {/* Grid */}
      <div
        aria-busy={loading}
        className={`grid grid-cols-1 gap-3 transition-opacity duration-200 ease-in-out md:grid-cols-2 lg:grid-cols-[1.05fr_2.1fr_1fr_1fr] lg:grid-rows-[repeat(10,minmax(36px,auto))_auto] ${
          loading ? "opacity-60" : "opacity-100"
        }`}
      >
        <CircularProgress
          title="Deals Won Value vs Target"
          subtitle={periodLabel}
          value={data.dealsWon.value}
          target={data.dealsWon.target}
          className="lg:col-start-1 lg:row-start-1 lg:row-span-6"
        />

        <RevenueRepCard
          title="New Revenue by Sales Rep"
          subtitle={periodLabel}
          reps={topReps}
          className="md:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:row-span-10"
        />

        {stats.slice(0, 2).map((s) => (
          <StatCard key={s.id} title={s.title} subtitle={periodLabel} value={s.value} className={s.layout} />
        ))}

        <StatCard
          title="Forecasted New Revenue"
          subtitle={periodLabel}
          value={formatMillions(data.forecast, 0)}
          size="md"
          className="lg:col-start-1 lg:row-start-7 lg:row-span-4"
        />

        {stats.slice(2).map((s) => (
          <StatCard key={s.id} title={s.title} subtitle={periodLabel} value={s.value} className={s.layout} />
        ))}

        <UpcomingDemosChart
          title="Upcoming Demos"
          subtitle={periodLabel}
          data={demoSegments}
          className="lg:col-start-1 lg:row-start-11"
        />

        <EmployeeTable
          title={periodLabel}
          employees={data.employees}
          className="md:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-11"
        />

        <DealsByTeamChart
          title="Deals by Team"
          subtitle={periodLabel}
          teams={teams}
          average={averageTeamValue}
          className="md:col-span-2 lg:col-span-2 lg:col-start-3 lg:row-start-11"
        />
      </div>

      <TeamOverview teams={teams} />
    </div>
  );
}
