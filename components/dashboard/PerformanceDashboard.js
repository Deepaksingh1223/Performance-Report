"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FiActivity,
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiChevronRight,
  FiDollarSign,
  FiFilter,
  FiLock,
  FiRadio,
  FiSearch,
  FiShield,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiX,
  FiZap,
} from "react-icons/fi";
import { REPORT_SNAPSHOT } from "@/data/performanceReportData";

const amount = (value, digits = 2) =>
  `₹${Number(value).toFixed(digits)} Cr`;

const percent = (value, digits = 2) =>
  `${Number(value).toFixed(digits)}%`;

const REPORT_PERIODS = [
  {
    id: "october",
    label: "October 2026",
    collectionLabel: "01–04 Oct 2026",
    collectionField: "current",
    collectionIndex: 0,
    isCurrentSnapshot: true,
  },
  {
    id: "september",
    label: "September 2026",
    collectionLabel: "September 2026",
    collectionField: "september",
    collectionIndex: 1,
    isCurrentSnapshot: false,
  },
  {
    id: "august",
    label: "August 2026",
    collectionLabel: "August 2026",
    collectionField: "august",
    collectionIndex: 2,
    isCurrentSnapshot: false,
  },
];

const ReportPeriodContext = createContext(null);

function useReportPeriod() {
  const context = useContext(ReportPeriodContext);
  if (!context) {
    throw new Error("Dashboard components must be inside ReportPeriodContext.");
  }
  return context;
}

function performanceTier(items, item, metric) {
  const values = items
    .map((entry) => entry[metric])
    .filter((value) => Number.isFinite(value));
  if (values.length < 2) return null;
  if (item[metric] === Math.max(...values)) return "top";
  if (item[metric] === Math.min(...values)) return "low";
  return null;
}

function PerformanceBadge({ tier }) {
  if (!tier) return null;

  return (
    <span
      className={`rounded-full px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide ${
        tier === "top"
          ? "bg-[#dff1e4] text-[#32754b]"
          : "bg-[#fff0e9] text-[#a26042]"
      }`}
    >
      {tier === "top" ? "Top" : "Low"}
    </span>
  );
}

function PeriodPicker({ compact = false }) {
  const { period, setPeriodId } = useReportPeriod();
  const containerTone = compact
    ? "border-white/15 bg-white/[0.08] text-white"
    : "border-[#d6e0d8] bg-white text-[#46564b]";

  return (
    <label
      className={`inline-flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-1.5 ${containerTone}`}
    >
      <FiCalendar
        className={`size-3.5 shrink-0 ${
          compact ? "text-[#b4dfc4]" : "text-[#74877a]"
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">Filter dashboard by reporting month</span>
      <select
        value={period.id}
        onChange={(event) => setPeriodId(event.target.value)}
        className={`min-w-0 cursor-pointer bg-transparent text-[10px] font-bold text-inherit outline-none [&>option]:bg-white [&>option]:text-[#27342e] ${
          compact ? "max-w-[132px]" : "max-w-[160px]"
        }`}
      >
        {REPORT_PERIODS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PeriodUnavailable({ title, detail }) {
  const { period } = useReportPeriod();
  return (
    <div className="flex min-h-36 flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d9e3da] bg-white/75 px-5 py-7 text-center">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-[#eef3ef] text-[#76877b]">
        <FiCalendar className="size-4" aria-hidden="true" />
      </span>
      <h3 className="mt-3 text-xs font-bold text-[#4a5c50]">{title}</h3>
      <p className="mt-1 max-w-md text-[10px] leading-relaxed text-[#8b968e]">
        {detail ??
          `The supplied recording has no ${period.label} history for this section. No other period's figures are shown.`}
      </p>
    </div>
  );
}

function LeagueIcon({ id, className }) {
  const icons = {
    legends: FiAward,
    champions: FiStar,
    challengers: FiTrendingUp,
    survivors: FiActivity,
  };
  const Icon = icons[id] ?? FiAward;

  return <Icon className={className} aria-hidden="true" />;
}

function UserTicker() {
  const { period } = useReportPeriod();
  const repeatedMembers = [
    ...REPORT_SNAPSHOT.liveMembers,
    ...REPORT_SNAPSHOT.liveMembers,
  ];

  return (
    <div className="flex h-9 items-center overflow-hidden border-b border-white/10 bg-[#102328] text-[10px]">
      <div className="z-10 flex h-full shrink-0 items-center gap-1.5 bg-[#d5f4e2] px-3 font-black tracking-[0.14em] text-[#286444]">
        <FiRadio className="size-3.5" aria-hidden="true" />
        {period.isCurrentSnapshot ? (
          <>
            RECORDED
            <span className="rounded-full bg-[#173e31]/10 px-1.5 py-0.5 tracking-normal">
              {REPORT_SNAPSHOT.currentUsers}
            </span>
          </>
        ) : (
          "ARCHIVE"
        )}
      </div>
      {period.isCurrentSnapshot ? (
        <div className="dashboard-marquee flex min-w-0 items-center whitespace-nowrap">
          {repeatedMembers.map((member, index) => (
            <span
              key={`${member}-${index}`}
              className="inline-flex items-center gap-2 px-3 font-semibold text-[#e0ebe7]"
            >
              <span className="size-1.5 rounded-full bg-[#83d4ac]" />
              {member}
              <span className="text-white/25">|</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="truncate px-3 text-[10px] font-medium text-[#d3dfd9]">
          {period.label} selected · user activity history unavailable
        </p>
      )}
    </div>
  );
}

function Header({ onOpenInsights, insightsTriggerRef }) {
  const { period } = useReportPeriod();

  return (
    <header className="relative z-10 bg-[#244540] shadow-[0_8px_24px_rgba(36,69,64,0.12)]">
      <UserTicker />
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#e2f1e8] text-sm font-black text-[#276248]">
            S<span className="text-[#6eaa8b]">&amp;</span>
          </span>
          <div>
            <p className="text-[9px] font-bold tracking-[0.13em] text-[#92b6a2]">
              SALES PULSE · COLLECTION PERFORMANCE
            </p>
            <h1 className="text-sm font-bold text-white sm:text-base">
              {period.label} report
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PeriodPicker compact />
          <button
            ref={insightsTriggerRef}
            type="button"
            onClick={onOpenInsights}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#b6d5c1]/35 bg-[#d5f4e2] px-3 py-2 text-[10px] font-bold text-[#285d42] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-haspopup="dialog"
          >
            <FiBarChart2 className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Quick insights</span>
            <span className="sm:hidden">Insights</span>
          </button>
          {period.isCurrentSnapshot ? (
            <>
              <span className="hidden items-center gap-1.5 rounded-full bg-[#d5f4e2] px-3 py-2 text-[10px] font-bold text-[#285d42] sm:inline-flex">
                <FiUsers className="size-3.5" aria-hidden="true" />
                {REPORT_SNAPSHOT.currentUsers} current users
              </span>
              <span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[10px] font-semibold text-white/85 md:inline-flex">
                <FiTrendingUp className="size-3.5 text-[#bdd1f4]" aria-hidden="true" />
                {REPORT_SNAPSHOT.usersToday} users today
              </span>
            </>
          ) : (
            <span className="hidden rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[10px] font-semibold text-white/85 md:inline-flex">
              Data as recorded {REPORT_SNAPSHOT.reportDate}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

function PageHeading({ number, eyebrow, title, detail, id }) {
  return (
    <div id={id} className="scroll-mt-48">
      <div className="flex items-start gap-3">
        {number && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#e8f2ec] text-[11px] font-black text-[#39745a]">
            {number}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#7f9188]">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-base font-bold tracking-tight text-[#202d2a] sm:text-lg">
            {title}
          </h2>
          {detail && (
            <p className="mt-1 text-[11px] leading-relaxed text-[#77817c]">
              {detail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function LeaguePills() {
  const leagueStyles = {
    legends: "bg-[#f0ebfc] text-[#7353a3]",
    champions: "bg-[#fff4d6] text-[#8d6a19]",
    challengers: "bg-[#ffede6] text-[#b45332]",
    survivors: "bg-[#e8f5e8] text-[#397447]",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {REPORT_SNAPSHOT.leagues.map((league) => (
        <span
          key={league.id}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold ${
            leagueStyles[league.id]
          }`}
        >
          <LeagueIcon id={league.id} className="size-3.5" />
          {league.label} <span className="opacity-70">{league.range}</span>
          <span className="rounded-full bg-white/70 px-1.5 py-0.5 tabular-nums">
            {league.count}
          </span>
        </span>
      ))}
    </div>
  );
}

function MissionHero() {
  const { period } = useReportPeriod();
  if (!period.isCurrentSnapshot) {
    return (
      <section className="rounded-[26px] border border-[#e7ebe6] bg-white p-4 shadow-[0_8px_28px_rgba(20,42,34,0.04)] sm:p-6">
        <PeriodUnavailable
          title={`Monthly mission · ${period.label}`}
          detail={`Mission target and achieved totals are available only for the ${REPORT_SNAPSHOT.mission.label} snapshot.`}
        />
      </section>
    );
  }
  const { mission } = REPORT_SNAPSHOT;
  const progress = Math.min((mission.achieved / mission.target) * 100, 100);
  const daysProgress = (mission.daysElapsed / mission.daysInMonth) * 100;

  return (
    <section className="overflow-hidden rounded-[26px] bg-white shadow-[0_8px_28px_rgba(20,42,34,0.07)]">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ed] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#337452]">
              <FiZap className="size-3" aria-hidden="true" />
              {period.label} leaderboard
            </span>
            <span className="text-[10px] font-medium text-[#909994]">
              {period.label}
            </span>
          </div>
          <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#929b96]">
            Monthly mission
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-[42px] font-bold leading-none tracking-[-0.055em] text-[#172d29] sm:text-6xl">
              {amount(mission.achieved)}
            </h2>
            <span className="text-sm font-semibold text-[#929b96]">
              of {amount(mission.target, 0)} target
            </span>
          </div>
          <div
            className="mt-6 h-2.5 overflow-hidden rounded-full bg-[#edf0ed]"
            role="progressbar"
            aria-label="Monthly mission progress"
            aria-valuenow={Number(progress.toFixed(2))}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-[#40aa7b] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px]">
            <span className="font-bold text-[#337452]">
              {progress.toFixed(1)}% of mission
            </span>
            <span className="text-[#78837e]">
              ₹{Math.round(mission.target - mission.achieved)} Cr remaining
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-[#eff6f1] p-5 sm:p-7 lg:p-6">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#75897d]">
              Month in progress
            </p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-bold leading-none tracking-tight text-[#183a30]">
                {mission.daysElapsed}
              </span>
              <span className="pb-1 text-[11px] font-semibold text-[#708278]">
                / {mission.daysInMonth} days elapsed
              </span>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-[9px] font-semibold text-[#718078]">
              <span>Time elapsed</span>
              <span>{daysProgress.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[#72bd92]"
                style={{ width: `${daysProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Overview() {
  const { period } = useReportPeriod();
  if (!period.isCurrentSnapshot) {
    return (
      <section className="space-y-3">
        <PageHeading
          number="01"
          eyebrow="At a glance"
          title="Collection health"
          detail="This report section only has the October 2026 snapshot."
        />
        <PeriodUnavailable
          title={`Collection health · ${period.label}`}
          detail="Company target, achieved MTD, milestone targets and league counts are not recorded for this month."
        />
      </section>
    );
  }
  const { overall } = REPORT_SNAPSHOT;
  const stats = [
    {
      label: "Total target",
      value: amount(overall.target),
      note: "Monthly collection target",
      icon: FiTarget,
      tone: "text-[#5577bb]",
      iconBg: "bg-[#edf1fb]",
    },
    {
      label: "Achieved MTD",
      value: amount(overall.achieved),
      note: "Recorded month to date",
      icon: FiDollarSign,
      tone: "text-[#27845b]",
      iconBg: "bg-[#e8f4ec]",
    },
    {
      label: "% of target",
      value: percent(overall.achievedPercent),
      note: "Target achievement",
      icon: FiActivity,
      tone: "text-[#bd7933]",
      iconBg: "bg-[#fbf1e4]",
    },
    {
      label: "Disb. target till date",
      value: percent(overall.targetTillDate),
      note: "Month-to-date benchmark",
      icon: FiTrendingUp,
      tone: "text-[#795ca8]",
      iconBg: "bg-[#f0eafa]",
    },
  ];

  return (
    <section className="space-y-3">
      <PageHeading
        number="01"
        eyebrow="At a glance"
        title="Collection health"
        detail="Target milestones and the month-to-date company snapshot."
      />
      <div className="grid gap-3 xl:grid-cols-[0.85fr_1.55fr]">
        <div className="rounded-[22px] border border-[#e8ebe6] bg-white p-4 shadow-[0_4px_16px_rgba(20,42,34,0.035)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-[#293632]">
                Min. collection target
              </h3>
              <p className="mt-1 text-[10px] text-[#89928d]">
                Achievement milestones
              </p>
            </div>
            <span className="flex size-8 items-center justify-center rounded-xl bg-[#f1f2fb] text-[#707bb5]">
              <FiTarget className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {REPORT_SNAPSHOT.minimumTargets.map((target) => (
              <div
                key={target.milestone}
                className="flex items-center justify-between gap-2 rounded-xl bg-[#f7f8f6] px-3 py-3"
              >
                <span className="text-[10px] font-semibold text-[#75807a]">
                  {target.milestone}
                </span>
                <span className="text-sm font-bold tabular-nums text-[#606fae]">
                  {target.target}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {stats.map(({ label, value, note, icon: Icon, tone, iconBg }, index) => (
            <article
              key={label}
              className={`dashboard-card min-w-0 rounded-[20px] border p-3.5 shadow-[0_4px_16px_rgba(76,111,86,0.055)] sm:p-4 ${
                [
                  "border-[#e4eafa] bg-gradient-to-br from-white to-[#f0f4ff]",
                  "border-[#e3eee7] bg-gradient-to-br from-white to-[#eff8f1]",
                  "border-[#f1e8d8] bg-gradient-to-br from-white to-[#fff7e9]",
                  "border-[#ebe3f4] bg-gradient-to-br from-white to-[#f7f1fd]",
                ][index % 4]
              }`}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-xl ${iconBg} ${tone}`}
              >
                <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="mt-3 text-[9px] font-bold leading-snug text-[#818b85]">
                {label}
              </p>
              <p className={`mt-1 text-base font-bold tabular-nums sm:text-lg ${tone}`}>
                {value}
              </p>
              <p className="mt-1 hidden text-[9px] text-[#a0a8a3] 2xl:block">
                {note}
              </p>
            </article>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-[18px] border border-[#e8ebe6] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#818b85]">
          League counts · recorded snapshot
        </span>
        <LeaguePills />
      </div>
    </section>
  );
}

function MatchScore({ left, right, days }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] overflow-hidden rounded-[20px] border border-[#e9ebe8] bg-white shadow-[0_4px_16px_rgba(20,42,34,0.035)]">
      <div className="flex items-center justify-center gap-3 px-3 py-4 sm:py-5">
        <FiAward className="hidden size-4 text-[#ba8936] sm:block" aria-hidden="true" />
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#929a95]">
            In front
          </p>
          <p className="mt-1 text-xs font-bold text-[#28332f] sm:text-sm">
            Team {left.name}
          </p>
        </div>
        <span className="text-3xl font-bold tabular-nums text-[#26764f] sm:text-4xl">
          {left.score}
        </span>
      </div>
      <div className="flex min-w-[62px] flex-col items-center justify-center border-x border-[#ebede9] bg-[#f7f8f5] px-3">
        <span className="text-[8px] font-extrabold tracking-[0.14em] text-[#99a19b]">
          VS
        </span>
        <span className="text-[11px] font-bold tabular-nums text-[#53615a]">
          {days} DAYS
        </span>
      </div>
      <div className="flex items-center justify-center gap-3 px-3 py-4 sm:py-5">
        <span className="text-3xl font-bold tabular-nums text-[#a4aaa5] sm:text-4xl">
          {right.score}
        </span>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#a3aaa5]">
            Chasing
          </p>
          <p className="mt-1 text-xs font-bold text-[#6f7772] sm:text-sm">
            Team {right.name}
          </p>
        </div>
      </div>
    </div>
  );
}

function LapProgress({ team, index }) {
  const color = index === 0 ? "#6188d4" : "#34a77a";
  const isLeader = team.score === Math.max(...REPORT_SNAPSHOT.teams.map((entry) => entry.score));
  const laps = [
    {
      label: "Lap 1 · target",
      target: team.lapOne.target,
      percent: team.lapOne.percent,
    },
    {
      label: "Lap 2 · target",
      target: team.lapTwo.target,
      percent: team.lapTwo.percent,
      bonus: true,
    },
    {
      label: "Overall target",
      target: team.total.target,
      percent: team.total.percent,
      total: true,
    },
  ];

  return (
    <article className={`dashboard-card rounded-[20px] border p-4 shadow-[0_4px_16px_rgba(76,111,86,0.055)] sm:p-5 ${
      !isLeader
        ? "border-[#e4eafa] bg-gradient-to-br from-white to-[#f0f4ff]"
        : "border-[#e0eee6] bg-gradient-to-br from-white to-[#edf8f1]"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8c9690]">
            {team.name}
          </p>
          <h3 className="mt-1 text-sm font-bold text-[#26332d]">
            Lap race progress
          </h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${
            index === 0
              ? "bg-[#eef2fb] text-[#5e77b5]"
              : "bg-[#e9f5ed] text-[#327a56]"
          }`}
        >
          {isLeader ? (
            <FiAward className="size-3" aria-hidden="true" />
          ) : (
            <FiActivity className="size-3" aria-hidden="true" />
          )}
          {isLeader ? "LEADING" : "CHASING"}
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {laps.map((lap) => (
          <div
            key={lap.label}
            className={`rounded-2xl p-3 ${
              lap.total ? "bg-[#f1f5f1]" : "bg-[#f7f8f6]"
            }`}
          >
            <div className="flex items-start justify-between gap-1">
              <span className="text-[9px] font-semibold text-[#818b85]">
                {lap.label}
              </span>
              <span
                className="whitespace-nowrap text-[10px] font-bold"
                style={{ color: lap.total ? "#bd7933" : color }}
              >
                {lap.bonus ? "+" : ""}
                {amount(lap.target)}
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-[#e6eae5]">
              <div
                className="h-full rounded-full"
                style={{
                  background: lap.total ? "#d79750" : color,
                  width: `${Math.min(lap.percent, 100)}%`,
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[9px] text-[#99a19c]">Achieved</span>
              <span className="text-[10px] font-bold tabular-nums text-[#4e5a54]">
                {percent(lap.percent)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf0ec] pt-3">
        <span className="text-[10px] font-semibold text-[#7c8680]">
          <FiUsers className="mr-1 inline size-3" aria-hidden="true" />
          {team.memberCount.toLocaleString("en-IN")} members
        </span>
        <span className="text-[10px] font-semibold text-[#7c8680]">
          Achieved MTD{" "}
          <b className="ml-1 text-sm font-bold text-[#258256]">
            {amount(team.lapOne.achieved)}
          </b>
        </span>
        <span className="text-[10px] font-semibold text-[#7c8680]">
          % of total{" "}
          <b className="ml-1 text-sm font-bold text-[#bd7933]">
            {percent(team.total.percent)}
          </b>
        </span>
      </div>
    </article>
  );
}

function TeamLeadershipCard({ team, index }) {
  const teamLead = team.name.replace("TEAM ", "");

  return (
    <article
      className={`dashboard-card min-w-0 overflow-hidden rounded-[22px] border p-4 shadow-[0_4px_18px_rgba(76,111,86,0.06)] sm:p-5 ${
        index === 0
          ? "border-[#e2e8f4] bg-gradient-to-br from-white to-[#f0f4fc]"
          : "border-[#dfede5] bg-gradient-to-br from-white to-[#eff8f1]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${
              index === 0
                ? "bg-[#e9effc] text-[#5979bd]"
                : "bg-[#e7f4eb] text-[#37815b]"
            }`}
          >
            <FiUsers className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8c9690]">
              Team head / leader
            </p>
            <h3 className="mt-0.5 truncate text-base font-bold text-[#26332d]">
              {teamLead}
            </h3>
            <p className="mt-0.5 text-[10px] text-[#838d86]">
              {team.memberCount.toLocaleString("en-IN")} team members
            </p>
          </div>
        </div>
        <span className="rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[9px] font-extrabold tracking-[0.12em] text-[#68766d]">
          CBH &amp; CCH
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { label: "CBH total", value: team.collectionTotals.cbh },
          { label: "CCH total", value: team.collectionTotals.cch },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/90 bg-white/75 px-3 py-2.5"
          >
            <p className="text-[9px] font-semibold uppercase tracking-wide text-[#8c9690]">
              {label}
            </p>
            <p className="mt-1 text-lg font-bold tabular-nums text-[#347758]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/90 bg-white/80">
        <div className="flex items-center justify-between gap-2 border-b border-[#edf0ec] px-3 py-2.5">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#66766d]">
              CBH · MTD disbursement
            </p>
            <p className="mt-0.5 text-[9px] text-[#9aa39d]">
              Race points shown as stars
            </p>
          </div>
          <FiAward className="size-4 text-[#bd934b]" aria-hidden="true" />
        </div>
        <ul className="divide-y divide-[#f0f2ef]">
          {team.raceMembers.map((member, memberIndex) => (
            <li
              key={member.name}
              className="flex min-w-0 items-center justify-between gap-3 px-3 py-2.5 odd:bg-white/70"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f0f3ee] text-[9px] font-bold text-[#6f7c72]">
                  {memberIndex + 1}
                </span>
                <span className="truncate text-[11px] font-semibold text-[#37443b]">
                  {member.name}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span
                  className="flex items-center gap-0.5"
                  aria-label={`${member.score} recorded points, displayed as stars`}
                  title={`${member.score} recorded points`}
                >
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <FiStar
                      key={starIndex}
                      className={`size-3 ${
                        starIndex < member.score
                          ? "fill-[#e4b858] text-[#d2a33f]"
                          : "text-[#dce2dc]"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </span>
                <span className="text-[8px] font-bold tabular-nums text-[#89938c]">
                  {member.score} {member.score === 1 ? "point" : "points"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function TeamRace() {
  const { period } = useReportPeriod();
  if (!period.isCurrentSnapshot) {
    return (
      <section id="team-race" className="scroll-mt-48 space-y-3">
        <PageHeading
          number="02"
          eyebrow="Friendly competition"
          title="Team lap race"
          detail="Team score, lap targets and collection progress."
        />
        <PeriodUnavailable
          title={`Team lap race · ${period.label}`}
          detail="Team scores, targets and member race points are available only in the October 2026 snapshot."
        />
      </section>
    );
  }
  return (
    <section id="team-race" className="scroll-mt-48 space-y-3">
      <PageHeading
        number="02"
        eyebrow="Friendly competition"
        title="Team lap race"
        detail="Team score, lap targets and collection progress."
      />
      <MatchScore
        left={{
          name: REPORT_SNAPSHOT.headToHead.leader,
          score: REPORT_SNAPSHOT.headToHead.leaderScore,
        }}
        right={{
          name: REPORT_SNAPSHOT.headToHead.rival,
          score: REPORT_SNAPSHOT.headToHead.rivalScore,
        }}
        days={REPORT_SNAPSHOT.headToHead.days}
      />
      <div className="grid gap-3 xl:grid-cols-2">
        {REPORT_SNAPSHOT.teams.map((team, index) => (
          <TeamLeadershipCard key={team.id} team={team} index={index} />
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <FiAward className="size-4 text-[#b68d42]" aria-hidden="true" />
          <h3 className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#69776e]">
            CBH · MTD disbursement performers
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {REPORT_SNAPSHOT.disbursementLeaders.map((performer, index) => (
            <PerformerCard
              key={performer.name}
              performer={performer}
              index={index}
              tier={performanceTier(
                REPORT_SNAPSHOT.disbursementLeaders,
                performer,
                "percent"
              )}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        {REPORT_SNAPSHOT.teams.map((team, index) => (
          <LapProgress key={team.id} team={team} index={index} />
        ))}
      </div>
    </section>
  );
}

function BrandChip({ brand, value }) {
  const numericValue = Number.parseFloat(value);
  const tone =
    Number.isFinite(numericValue) && numericValue >= 85
      ? "bg-[#e8f4e9] text-[#38734a]"
      : Number.isFinite(numericValue) && numericValue >= 75
        ? "bg-[#fff2dc] text-[#876222]"
        : "bg-[#eef1f8] text-[#56688d]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${tone}`}
    >
      {brand}
      <b className="font-bold">{value}</b>
    </span>
  );
}

function PerformerCard({ performer, index, groupLabel, tier }) {
  return (
    <article className={`dashboard-card flex min-w-0 flex-col rounded-[20px] border p-4 shadow-[0_4px_16px_rgba(76,111,86,0.055)] ${
      tier === "top"
        ? "border-[#bcdcc5] bg-gradient-to-br from-white to-[#eaf6ed]"
        : tier === "low"
          ? "border-[#f0d5c8] bg-gradient-to-br from-white to-[#fff5f0]"
          : index % 3 === 0
            ? "border-[#e2e8f4] bg-gradient-to-br from-white to-[#f0f4fc]"
            : index % 3 === 1
              ? "border-[#e1eee5] bg-gradient-to-br from-white to-[#eff8f1]"
              : "border-[#eee7d9] bg-gradient-to-br from-white to-[#fff8eb]"
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#26332d]">
            {performer.name}
          </p>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#909a94]">
            <FiUsers className="mr-1 inline size-3" aria-hidden="true" />
            {groupLabel ? `${groupLabel} · ` : ""}
            {performer.count} members
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <PerformanceBadge tier={tier} />
          <span
            className={`flex size-8 items-center justify-center rounded-xl text-xs font-bold ${
              tier === "top"
                ? "bg-[#dff1e4] text-[#32754b]"
                : tier === "low"
                  ? "bg-[#fff0e9] text-[#a26042]"
                  : index === 0
                    ? "bg-[#edf3fa] text-[#5777aa]"
                    : "bg-[#eff3ec] text-[#63805d]"
            }`}
          >
            {performer.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
        </div>
      </div>
      <div className="mt-3 flex min-h-12 flex-wrap content-start gap-1.5">
        {performer.brands.map(([brand, value]) => (
          <BrandChip key={brand} brand={brand} value={value} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#edf0ec] pt-3">
        <div>
          <p className="text-[9px] font-semibold text-[#9aa29d]">TARGET</p>
          <p className="mt-1 text-xs font-bold text-[#5879b6]">
            {amount(performer.target)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-semibold text-[#9aa29d]">ACHIEVED MTD</p>
          <p className="mt-1 text-xs font-bold text-[#318258]">
            {amount(performer.achieved)}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-[#89938d]">Target progress</span>
        <span className="text-[10px] font-bold text-[#b7793b]">
          {percent(performer.percent)}
        </span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-[#f0f0e9]">
        <div
          className="h-full rounded-full bg-[#d49a59]"
          style={{ width: `${Math.min(performer.percent, 100)}%` }}
        />
      </div>
    </article>
  );
}

function TeamPerformers() {
  const { period } = useReportPeriod();
  if (!period.isCurrentSnapshot) {
    return (
      <section id="performers" className="scroll-mt-48 space-y-3">
        <PageHeading
          number="03"
          eyebrow="Team collection performers"
          title="Team members & collection"
          detail="Team-wise members, visible brand percentages, targets and achieved totals."
        />
        <PeriodUnavailable
          title={`Team performers · ${period.label}`}
          detail="Team performer targets and achieved totals are available only in the October 2026 snapshot."
        />
      </section>
    );
  }
  return (
    <section id="performers" className="scroll-mt-48 space-y-3">
      <PageHeading
        number="03"
        eyebrow="Team collection performers"
        title="Team members & collection"
        detail="Team-wise members, their visible brand percentages, targets and achieved totals."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {REPORT_SNAPSHOT.teams.map((team, teamIndex) => (
          <div
            key={team.id}
            className="rounded-[22px] border border-[#e5ebe4] bg-white/65 p-3.5 sm:p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2 px-1">
              <h3 className="text-xs font-bold text-[#2e3a34]">
                {team.name}
              </h3>
              <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold text-[#7c8780]">
                {team.performers.length} recorded members
              </span>
            </div>
            <div className="grid gap-2.5 md:grid-cols-2">
              {team.performers.map((performer, index) => (
                <PerformerCard
                  key={performer.name}
                  performer={performer}
                  index={teamIndex + index}
                  groupLabel={team.name}
                  tier={performanceTier(team.performers, performer, "percent")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LeaderScore({ race }) {
  return (
    <div className="flex min-h-[76px] items-center justify-center gap-4 rounded-2xl border border-[#e8ebe6] bg-white px-4 shadow-[0_4px_16px_rgba(20,42,34,0.035)]">
      <FiAward className="size-5 text-[#c39442]" aria-hidden="true" />
      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#929b95]">
          Leading collector
        </p>
        <p className="mt-1 text-xs font-bold text-[#313c36]">{race.leader}</p>
      </div>
      <span className="text-3xl font-bold tabular-nums text-[#47795d]">
        {race.score}
      </span>
    </div>
  );
}

function MonthMetrics({ value, label, color }) {
  return (
    <div className="grid grid-cols-[minmax(72px,1fr)_minmax(0,auto)] items-center gap-x-2 rounded-xl bg-white px-2.5 py-2.5">
      <span className="text-[9px] font-semibold text-[#717c75]">{label}</span>
      <span
        className={`whitespace-nowrap text-right text-[9px] font-bold tabular-nums sm:text-[10px] ${color}`}
      >
        {label === "Collect %" ? percent(value) : amount(value)}
      </span>
    </div>
  );
}

function CollectionPersonCard({ leader, index, tier, period }) {
  const monthIndex = period.collectionIndex;
  const achievement = leader.monthly.collectPercent[monthIndex];
  const rows = [
    {
      label: "Repay Amt.",
      value: leader.monthly.repay[monthIndex],
      color: "text-[#a5682a]",
    },
    {
      label: "Received Amt.",
      value: leader.monthly.received[monthIndex],
      color: "text-[#2e8363]",
    },
    {
      label: "Collect %",
      value: achievement,
      color: "text-[#ae4f45]",
    },
  ];

  return (
    <article className={`dashboard-card rounded-[20px] border p-3.5 shadow-[0_4px_16px_rgba(76,111,86,0.055)] ${
      tier === "top"
        ? "border-[#bcdcc5] bg-gradient-to-br from-white to-[#eaf6ed]"
        : tier === "low"
          ? "border-[#f0d5c8] bg-gradient-to-br from-white to-[#fff5f0]"
          : index % 2 === 0
            ? "border-[#e1ebe6] bg-gradient-to-br from-white to-[#eff7f4]"
            : "border-[#e7e5f0] bg-gradient-to-br from-white to-[#f5f2fa]"
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.09em] text-[#344039]">
            {leader.name}
          </p>
          <p className="mt-1 text-[9px] text-[#87918b]">
            Collection rank {index + 1}
            {period.isCurrentSnapshot ? ` · ${leader.count} members` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <PerformanceBadge tier={tier} />
          <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
            tier === "top"
              ? "bg-[#dff1e4] text-[#32754b]"
              : tier === "low"
                ? "bg-[#fff0e9] text-[#a26042]"
                : "bg-[#f1f4ed] text-[#4d7552]"
          }`}>
            {percent(achievement)}
          </span>
        </div>
      </div>
      {period.isCurrentSnapshot && (
        <div className="my-3 flex flex-wrap gap-1">
          {leader.brands.map(([brand, value]) => (
            <BrandChip key={brand} brand={brand} value={value} />
          ))}
        </div>
      )}
      <p className="mb-1 px-2.5 text-[8px] font-extrabold tracking-wide text-[#a0a8a2]">
        {period.label.toUpperCase()}
      </p>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <MonthMetrics
            key={row.label}
            value={row.value}
            label={row.label}
            color={row.color}
          />
        ))}
      </div>
    </article>
  );
}

function CollectionReport() {
  const { period } = useReportPeriod();
  const { collectionRaces, collectionLeaders } = REPORT_SNAPSHOT;
  const sortedLeaders = [...collectionLeaders].sort(
    (first, second) =>
      second.monthly.collectPercent[period.collectionIndex] -
      first.monthly.collectPercent[period.collectionIndex]
  );

  return (
    <section id="collections" className="scroll-mt-48 space-y-3">
      <PageHeading
        number="04"
        eyebrow="Repayment · received · collection"
        title={
          period.isCurrentSnapshot
            ? "3-month collection report"
            : `${period.label} collection report`
        }
        detail={
          period.isCurrentSnapshot
            ? "CBH and CCH race, followed by performer-level October, September and August results."
            : `Repayment, received amount and collection percentage for ${period.label}.`
        }
      />
      {period.isCurrentSnapshot ? (
        <div className="grid gap-2.5 xl:grid-cols-2">
          {collectionRaces.map((race) =>
            race.rival ? (
              <MatchScore
                key={race.id}
                left={{ name: race.leader, score: race.score }}
                right={{ name: race.rival, score: race.rivalScore }}
                days={race.days}
              />
            ) : (
              <LeaderScore key={race.id} race={race} />
            )
          )}
        </div>
      ) : (
        <PeriodUnavailable
          title={`Collection race · ${period.label}`}
          detail="The CBH/CCH race scores are a combined three-month result, not a month-specific score."
        />
      )}
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {sortedLeaders.map((leader, index) => (
          <CollectionPersonCard
            key={leader.name}
            leader={leader}
            index={index}
            period={period}
            tier={
              index === 0
                ? "top"
                : index === sortedLeaders.length - 1
                  ? "low"
                  : null
            }
          />
        ))}
      </div>
    </section>
  );
}

function RewardStrip({ league }) {
  return (
    <div className="league-reward-strip flex flex-wrap gap-x-3 gap-y-1.5 rounded-xl bg-[#f5f4f8] px-3 py-2.5 text-[9px] text-[#686477]">
      {league.royalty.map(([role, reward]) => (
        <span key={role}>
          {role}: <b className="font-bold text-[#745b91]">{reward}</b>
        </span>
      ))}
    </div>
  );
}

function ChallengePodium({ league, brands, period }) {
  const [second, first, third] = [brands[1], brands[0], brands[2]];
  const places = [
    {
      label: "2nd place",
      brand: second,
      style: "bg-[#f0f1f2]",
      number: "02",
    },
    {
      label: "1st place",
      brand: first,
      style: "bg-[#fff6dc]",
      number: "01",
    },
    {
      label: "3rd place",
      brand: third,
      style: "bg-[#f8ece2]",
      number: "03",
    },
  ];

  return (
    <div className="league-podium-grid grid grid-cols-3 items-stretch gap-2">
      {places.map((place) => (
        <div
          key={place.label}
          className={`min-w-0 rounded-2xl border border-black/[0.035] p-2.5 text-center ${place.style}`}
        >
          <span className="mx-auto flex size-7 items-center justify-center rounded-xl bg-white text-[9px] font-extrabold text-[#7b7a75]">
            {place.number}
          </span>
          <p className="mt-2 text-[8px] font-bold uppercase tracking-wide text-[#89908a]">
            {place.label}
          </p>
          <p className="mt-2 truncate text-[10px] font-bold text-[#303a34]">
            {place.brand?.name ?? "—"}
          </p>
          {place.brand && period.isCurrentSnapshot && (
            <>
              <p className="mt-2 text-xs font-bold text-[#29825d]">
                {amount(place.brand.achieved)}
              </p>
              <p className="mt-1 text-[8px] font-medium text-[#7c847e]">
                Collection {percent(place.brand.current)}
              </p>
            </>
          )}
          {place.brand && !period.isCurrentSnapshot && (
            <p className="mt-2 text-xs font-bold text-[#29825d]">
              Collection {percent(place.brand[period.collectionField])}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

const tableHeadings = [
  "Rank",
  "Brand · Business / Credit / Sales",
  "Target (₹ Cr)",
  "Achieved MTD (₹ Cr)",
  "% of target",
  "Collection % · 01 Oct–04 Oct 2026",
  "Collection % · Sep 2026",
  "Collection % · Aug 2026",
];

function BrandTable({ league }) {
  const { period } = useReportPeriod();
  const isHistorical = !period.isCurrentSnapshot;
  const brands = useMemo(
    () =>
      [
        ...league.brands,
        ...(league.additionalBrands ?? []),
      ],
    [league.brands, league.additionalBrands]
  );
  const rankedBrands = useMemo(() => {
    const availableBrands = isHistorical
      ? brands
          .filter((brand) => Number.isFinite(brand[period.collectionField]))
          .sort(
            (first, second) =>
              second[period.collectionField] - first[period.collectionField] ||
              first.name.localeCompare(second.name)
          )
      : [...brands].sort((first, second) => first.rank - second.rank);

    return availableBrands.map((brand, index) => ({
      ...brand,
      displayRank: index + 1,
    }));
  }, [brands, isHistorical, period.collectionField]);
  const highlightCount = Math.min(
    3,
    Math.max(1, Math.ceil(rankedBrands.length * 0.1))
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    if (
      isHistorical &&
      (filter === "target-20" || filter === "collection-na")
    ) {
      setFilter("all");
    }
  }, [filter, isHistorical]);
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredBrands = useMemo(
    () =>
      rankedBrands.filter((brand) => {
        const matchesSearch =
          !normalizedSearch ||
          [
            brand.displayRank,
            brand.name,
            ...(!isHistorical
              ? [brand.owner, brand.badge, brand.members]
              : []),
          ]
            .filter((value) => value != null)
            .some((value) =>
              String(value).toLocaleLowerCase().includes(normalizedSearch)
            );

        if (!matchesSearch) return false;

        switch (filter) {
          case "top-10":
            return brand.displayRank <= 10;
          case "target-20":
            if (isHistorical) return false;
            return brand.targetPercent >= 20;
          case "collection-90":
            return (
              brand[period.collectionField] != null &&
              brand[period.collectionField] >= 90
            );
          case "collection-80":
            return (
              brand[period.collectionField] != null &&
              brand[period.collectionField] >= 80 &&
              brand[period.collectionField] < 90
            );
          case "collection-low":
            return (
              brand[period.collectionField] != null &&
              brand[period.collectionField] < 80
            );
          case "collection-na":
            return brand[period.collectionField] == null;
          default:
            return true;
        }
      }),
    [rankedBrands, filter, isHistorical, normalizedSearch, period.collectionField]
  );
  const hasActiveFilters = Boolean(normalizedSearch) || filter !== "all";
  const headings = isHistorical
    ? ["Rank", "Brand", `Collection · ${period.collectionLabel}`]
    : tableHeadings;

  return (
    <div className="league-table-panel mt-3 overflow-hidden rounded-2xl border border-[#d9e2dc] bg-white shadow-[0_3px_12px_rgba(48,72,55,0.045)]">
      <div className="flex flex-col gap-2.5 border-b border-[#dce5de] bg-[#f8faf8] p-3 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <FiSearch
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#89968d]"
            aria-hidden="true"
          />
          <span className="sr-only">Search {league.title} brands</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search brand, owner or rank..."
            className="h-10 w-full rounded-xl border border-[#d6e0d8] bg-white pl-9 pr-3 text-[11px] text-[#29372f] outline-none transition placeholder:text-[#9aa59d] focus:border-[#78a98a] focus:ring-2 focus:ring-[#9dc7aa]/35 sm:max-w-[340px]"
          />
        </label>
        <label className="relative flex min-w-0 items-center gap-2 sm:w-auto">
          <FiFilter
            className="size-4 shrink-0 text-[#74877a]"
            aria-hidden="true"
          />
          <span className="sr-only">Filter brands by performance</span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-10 min-w-0 flex-1 rounded-xl border border-[#d6e0d8] bg-white px-3 text-[11px] font-semibold text-[#46564b] outline-none transition focus:border-[#78a98a] focus:ring-2 focus:ring-[#9dc7aa]/35 sm:min-w-[205px]"
          >
            <option value="all">All brands</option>
            <option value="top-10">Top 10 ranks</option>
            {!isHistorical && (
              <option value="target-20">Target achievement · 20%+</option>
            )}
            <option value="collection-90">Collection · 90%+</option>
            <option value="collection-80">Collection · 80–89.99%</option>
            <option value="collection-low">Collection · below 80%</option>
            {!isHistorical && (
              <option value="collection-na">Collection · N/A</option>
            )}
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl border border-[#d6e0d8] bg-white px-2.5 text-[10px] font-semibold text-[#64736a] transition hover:border-[#adbbb0] hover:bg-[#f2f6f2]"
            >
              <FiX className="size-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
        </label>
        <span
          className="text-[10px] font-semibold tabular-nums text-[#78867c] sm:ml-auto sm:whitespace-nowrap"
          aria-live="polite"
        >
          {filteredBrands.length} of {rankedBrands.length} brands
        </span>
      </div>
      <div className="league-table-scroll scroll-thin overflow-x-auto">
        <table
          className={`w-full border-collapse text-left text-[10px] ${
            isHistorical
              ? "league-history-table min-w-[360px]"
              : "min-w-[800px]"
          }`}
        >
          <thead className="bg-[#293e39] text-white">
            <tr>
              {headings.map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="max-w-[150px] border border-[#52655d] px-3 py-3 text-center text-[8px] font-bold uppercase leading-snug tracking-wide"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand, index) => {
              const isTop = brand.displayRank <= highlightCount;
              const isLow =
                brand.displayRank > rankedBrands.length - highlightCount;
              return (
              <tr
                key={`${brand.rank}-${brand.name}`}
                className={`border-b border-[#dce4dd] ${
                  isTop
                    ? brand.displayRank === 1
                      ? "bg-[#fff8e7]"
                      : "bg-[#eef7ef]"
                    : isLow
                      ? "bg-[#fff5f1]"
                      : index % 2 === 0
                        ? "bg-white"
                        : "bg-[#f8f9f7]"
                }`}
              >
                <td className="border border-[#e1e7e2] px-3 py-3 text-center text-xs font-bold text-[#536d5f]">
                  {!isHistorical && brand.displayRank <= 3 ? (
                    <FiAward
                      className={`mx-auto size-4 ${
                        brand.displayRank === 1
                          ? "text-[#c3913b]"
                          : brand.displayRank === 2
                            ? "text-[#87949a]"
                            : "text-[#b87958]"
                      }`}
                      aria-label={`Rank ${brand.displayRank}`}
                    />
                  ) : (
                    brand.displayRank
                  )}
                </td>
                <td
                  className={`border border-[#e1e7e2] px-3 py-2.5 ${
                    isHistorical ? "min-w-[190px]" : "min-w-[190px]"
                  }`}
                >
                  <p className="font-bold text-[#29342e]">
                    {brand.name}{" "}
                    {isTop && (
                      <span className="ml-1 rounded-full bg-[#dff1e4] px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wide text-[#32754b]">
                        Top
                      </span>
                    )}
                    {isLow && (
                      <span className="ml-1 rounded-full bg-[#fff0e9] px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wide text-[#a26042]">
                        Low
                      </span>
                    )}
                    {!isHistorical &&
                      (brand.badge || brand.members != null) && (
                      <span className="text-[#7888b3]">
                        {brand.badge} · {brand.members}
                      </span>
                    )}
                  </p>
                  {!isHistorical && brand.owner && (
                    <p className="mt-1 text-[8px] leading-relaxed text-[#818b84]">
                      {brand.owner}
                    </p>
                  )}
                </td>
                {isHistorical ? (
                  <td className="whitespace-nowrap border border-[#e1e7e2] px-3 py-3 text-center font-bold tabular-nums text-[#43805d]">
                    {percent(brand[period.collectionField])}
                  </td>
                ) : (
                  <>
                <td className="whitespace-nowrap border border-[#e1e7e2] px-3 py-3 text-center tabular-nums text-[#505b54]">
                  ₹{Number(brand.target).toFixed(2)}
                </td>
                <td className="whitespace-nowrap border border-[#e1e7e2] px-3 py-3 text-center tabular-nums text-[#505b54]">
                  ₹{Number(brand.achieved).toFixed(2)}
                </td>
                <td className="whitespace-nowrap border border-[#e1e7e2] px-3 py-3 text-center font-bold tabular-nums text-[#28835b]">
                  {percent(brand.targetPercent)}
                </td>
                {[brand.current, brand.september, brand.august].map(
                  (value, valueIndex) => (
                    <td
                      key={`${brand.name}-${valueIndex}`}
                      className={`whitespace-nowrap border border-[#e1e7e2] px-3 py-3 text-center font-bold tabular-nums ${
                        value == null
                          ? "text-[#929992]"
                          : valueIndex === 0
                            ? "text-[#4f719e]"
                            : valueIndex === 1
                              ? "text-[#43805d]"
                              : "text-[#a75b50]"
                      }`}
                    >
                      {value == null ? "N/A" : percent(value)}
                    </td>
                  )
                )}
                  </>
                )}
              </tr>
              );
            })}
            {league.total && !isHistorical && !hasActiveFilters && (
              <tr className="border-t-2 border-[#bfc9c0] bg-[#eef2ed] font-bold text-[#37443b]">
                <th colSpan={2} className="border border-[#cbd5cc] px-3 py-3 text-left uppercase">
                  {league.title} total
                </th>
                <td className="whitespace-nowrap border border-[#cbd5cc] px-3 py-3 text-center">
                  ₹{Number(league.total.target).toFixed(2)}
                </td>
                <td className="whitespace-nowrap border border-[#cbd5cc] px-3 py-3 text-center text-[#28835b]">
                  ₹{Number(league.total.achieved).toFixed(2)}
                </td>
                <td className="border border-[#cbd5cc] px-3 py-3 text-center">
                  {percent(league.total.percent)}
                </td>
                <td colSpan={3} className="border border-[#cbd5cc]" />
              </tr>
            )}
            {filteredBrands.length === 0 && (
              <tr>
                <td
                  colSpan={headings.length}
                  className="border border-[#e1e7e2] px-4 py-10 text-center text-xs font-medium text-[#78867c]"
                >
                  No brands match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="border-t border-[#dce5de] px-3 py-2.5 text-[9px] leading-relaxed text-[#8a938d]">
        {isHistorical
          ? `${rankedBrands.length} brands have recorded ${period.collectionLabel} collection data. Rows are ranked by the selected month; other month-specific league metrics were not provided.`
          : league.id === "survivors"
            ? `All ${brands.length} Survivors rows are transcribed from the supplied recording. Cells shown as — were marked N/A in the recorded report.`
            : `All ${league.brands.length} brand rows readable in the recording.`}
      </p>
    </div>
  );
}

function ChallengeCard({ league }) {
  const { period } = useReportPeriod();
  const accent = {
    legends: {
      line: "border-l-[#9271bc]",
      badge: "bg-[#f1ebfa] text-[#705697]",
    },
    champions: {
      line: "border-l-[#d4a748]",
      badge: "bg-[#fbf3dc] text-[#8b701f]",
    },
    challengers: {
      line: "border-l-[#7195a0]",
      badge: "bg-[#e8f0f1] text-[#466d78]",
    },
    survivors: {
      line: "border-l-[#cd8657]",
      badge: "bg-[#fbefe5] text-[#a05d34]",
    },
  }[league.id];
  const allBrands = [
    ...league.brands,
    ...(league.additionalBrands ?? []),
  ];
  const rankedBrands = period.isCurrentSnapshot
    ? [...allBrands].sort((first, second) => first.rank - second.rank)
    : allBrands
        .filter((brand) =>
          Number.isFinite(brand[period.collectionField])
        )
        .sort(
          (first, second) =>
            second[period.collectionField] - first[period.collectionField] ||
            first.name.localeCompare(second.name)
        );

  return (
    <article
      className={`league-card min-w-0 rounded-[22px] border border-[#e7eae5] border-l-[4px] bg-white p-4 shadow-[0_4px_16px_rgba(20,42,34,0.035)] sm:p-5 ${accent.line}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex size-9 items-center justify-center rounded-xl text-base ${accent.badge}`}
          >
            <LeagueIcon id={league.id} className="size-4" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-[#28362f]">
              {league.title}
            </h3>
            <p className="mt-1 text-[9px] text-[#89928c]">
              Royalty range · {league.range}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#f4f5f2] px-3 py-1.5 text-[9px] font-bold text-[#778179]">
          {period.isCurrentSnapshot ? league.count : rankedBrands.length} brands
        </span>
      </div>
      <div className="mt-4">
        <RewardStrip league={league} />
      </div>
      {period.isCurrentSnapshot && league.locked ? (
        <div className="mt-3 flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#dfe5e0] bg-[#f7f8f6] px-4 text-center">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-[#79929a] shadow-sm">
            <FiLock className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-xs font-bold text-[#536a65]">
            Eagerly waiting
          </p>
          <p className="mt-1 max-w-[230px] text-[10px] leading-relaxed text-[#939c96]">
            No brand has reached this tier yet.
          </p>
        </div>
      ) : !period.isCurrentSnapshot && rankedBrands.length === 0 ? (
        <div className="mt-3">
          <PeriodUnavailable
            title={`${league.title} · ${period.label}`}
            detail={`This recording has no ${period.collectionLabel} brand collection rows for this league.`}
          />
        </div>
      ) : (
        <>
          <div className="mt-3">
            <ChallengePodium
              league={league}
              brands={rankedBrands}
              period={period}
            />
          </div>
          <BrandTable league={league} />
        </>
      )}
    </article>
  );
}

function LeagueStandings() {
  const { period } = useReportPeriod();
  return (
    <section id="leagues" className="scroll-mt-48 space-y-3">
      <PageHeading
        number="05"
        eyebrow="Monthly challenge · awards"
        title="League standings & rewards"
        detail={
          period.isCurrentSnapshot
            ? "Podium brands, collection rankings and royalty for each collection tier."
            : `Brand rankings are recalculated using recorded ${period.collectionLabel} collection percentages.`
        }
      />
      <div className="mb-3 flex items-start gap-3 rounded-[18px] border border-[#e7eae5] bg-white px-4 py-3 text-[10px] text-[#737e77]">
        <FiZap className="mt-0.5 size-4 shrink-0 text-[#b58948]" aria-hidden="true" />
        <p>
          <b className="font-bold text-[#435148]">
            Who’s next in line for Legend and Champion glory?
          </b>{" "}
          Brand standings below reflect the rows readable in the screen recording.
        </p>
      </div>
      <div className="league-card-grid grid min-w-0 gap-3 xl:grid-cols-2">
        {REPORT_SNAPSHOT.challenges.map((league) => (
          <div
            key={league.id}
            className={`min-w-0 ${
              league.id === "challengers" || league.id === "survivors"
                ? "xl:col-span-2"
                : ""
            }`}
          >
            <ChallengeCard league={league} />
          </div>
        ))}
      </div>
    </section>
  );
}

function InsightMetric({ label, value, detail, icon: Icon, tone }) {
  const tones = {
    green: "border-[#d6e8da] bg-[#f0f8f1] text-[#34764d]",
    amber: "border-[#eee2c9] bg-[#fff9ed] text-[#92703b]",
    blue: "border-[#dce5f1] bg-[#f3f7fc] text-[#55739b]",
    rose: "border-[#f0ddd4] bg-[#fff6f2] text-[#a26042]",
  };

  return (
    <div className={`rounded-2xl border p-3.5 ${tones[tone]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-75">
          {label}
        </span>
        <Icon className="size-4 shrink-0 opacity-80" aria-hidden="true" />
      </div>
      <p className="mt-2 text-base font-extrabold leading-tight">{value}</p>
      <p className="mt-1 text-[10px] leading-relaxed opacity-75">{detail}</p>
    </div>
  );
}

function InsightsDialog({ onClose }) {
  const { period, setPeriodId } = useReportPeriod();
  const dialogRef = useRef(null);
  const disbursementLeaders = REPORT_SNAPSHOT.disbursementLeaders;
  const bestDisbursement = [...disbursementLeaders].sort(
    (first, second) => second.percent - first.percent
  )[0];
  const lowestDisbursement = [...disbursementLeaders].sort(
    (first, second) => first.percent - second.percent
  )[0];
  const bestTeam = [...REPORT_SNAPSHOT.teams].sort(
    (first, second) => second.total.percent - first.total.percent
  )[0];
  const lowestTeam = [...REPORT_SNAPSHOT.teams].sort(
    (first, second) => first.total.percent - second.total.percent
  )[0];
  const sortedCollectionLeaders = [...REPORT_SNAPSHOT.collectionLeaders].sort(
    (first, second) =>
      second.monthly.collectPercent[period.collectionIndex] -
      first.monthly.collectPercent[period.collectionIndex]
  );
  const bestCollectionLeader = sortedCollectionLeaders[0];
  const lowestCollectionLeader =
    sortedCollectionLeaders[sortedCollectionLeaders.length - 1];
  const rankedBrands = REPORT_SNAPSHOT.challenges
    .flatMap((league) =>
      [...league.brands, ...(league.additionalBrands ?? [])]
        .filter((brand) =>
          period.isCurrentSnapshot
            ? Number.isFinite(brand.targetPercent)
            : Number.isFinite(brand[period.collectionField])
        )
        .map((brand) => ({ ...brand, league: league.title }))
    )
    .sort((first, second) =>
      period.isCurrentSnapshot
        ? second.targetPercent - first.targetPercent
        : second[period.collectionField] - first[period.collectionField]
    );
  const topBrand = rankedBrands[0];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === dialogRef.current)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const goToSection = (sectionId) => {
    onClose();
    window.setTimeout(
      () =>
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#10231f]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="insights-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
        }}
        className="flex max-h-[92dvh] w-full max-w-2xl touch-pan-y flex-col overflow-y-auto overscroll-contain rounded-t-[26px] border border-white/70 bg-[#f8faf7] shadow-[0_24px_80px_rgba(9,29,22,0.3)] outline-none sm:rounded-[26px]"
      >
        <div className="sticky top-0 z-20 flex shrink-0 items-start justify-between gap-4 border-b border-[#e6ebe5] bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#e6f3e9] text-[#34764d]">
              <FiBarChart2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#829088]">
                At a glance · {period.label}
              </p>
              <h2
                id="insights-title"
                className="mt-0.5 text-base font-extrabold text-[#20362d] sm:text-lg"
              >
                Quick insights
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-xl border border-[#e3e9e3] bg-white text-[#66746b] transition hover:bg-[#f0f5f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7aaa87]"
            aria-label="Close quick insights"
          >
            <FiX className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#e4eae3] bg-white px-3 py-2.5">
            <span className="text-[9px] font-bold uppercase tracking-wide text-[#718078]">
              Filter all dashboard data
            </span>
            <label className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-[#d6e0d8] bg-white px-2.5 py-1.5 text-[#46564b]">
              <FiCalendar
                className="size-3.5 shrink-0 text-[#74877a]"
                aria-hidden="true"
              />
              <span className="sr-only">Filter dashboard by reporting month</span>
              <select
                value={period.id}
                onChange={(event) => setPeriodId(event.target.value)}
                className="min-w-0 max-w-[160px] cursor-pointer bg-transparent text-[10px] font-bold text-inherit outline-none [&>option]:bg-white [&>option]:text-[#27342e]"
              >
                {REPORT_PERIODS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <InsightMetric
              label="Achieved MTD"
              value={
                period.isCurrentSnapshot
                  ? amount(REPORT_SNAPSHOT.mission.achieved)
                  : "Unavailable"
              }
              detail={
                period.isCurrentSnapshot
                  ? `${percent(REPORT_SNAPSHOT.overall.achievedPercent)} of overall target`
                  : `No achieved MTD data for ${period.label}`
              }
              icon={FiDollarSign}
              tone="green"
            />
            <InsightMetric
              label="Target"
              value={
                period.isCurrentSnapshot
                  ? amount(REPORT_SNAPSHOT.overall.target, 0)
                  : "Unavailable"
              }
              detail={
                period.isCurrentSnapshot
                  ? `${REPORT_SNAPSHOT.mission.daysElapsed} of ${REPORT_SNAPSHOT.mission.daysInMonth} days elapsed`
                  : `No company target recorded for ${period.label}`
              }
              icon={FiTarget}
              tone="blue"
            />
            <InsightMetric
              label="Users today"
              value={
                period.isCurrentSnapshot
                  ? REPORT_SNAPSHOT.usersToday
                  : "Unavailable"
              }
              detail={
                period.isCurrentSnapshot
                  ? `${REPORT_SNAPSHOT.currentUsers} currently recorded`
                  : `No user activity history for ${period.label}`
              }
              icon={FiUsers}
              tone="amber"
            />
            <InsightMetric
              label="League brands"
              value={
                period.isCurrentSnapshot
                  ? REPORT_SNAPSHOT.leagues.reduce(
                      (total, league) => total + league.count,
                      0
                    )
                  : rankedBrands.length
              }
              detail={
                period.isCurrentSnapshot
                  ? "Across all recorded tiers"
                  : `Brands with ${period.collectionLabel} data`
              }
              icon={FiAward}
              tone="rose"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <FiZap className="size-4 text-[#bd934b]" aria-hidden="true" />
              <h3 className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#5a6a60]">
                Standout results
              </h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <InsightMetric
                label="Top disbursement performer"
                value={
                  period.isCurrentSnapshot
                    ? bestDisbursement.name
                    : "Unavailable"
                }
                detail={
                  period.isCurrentSnapshot
                    ? `${percent(bestDisbursement.percent)} target progress · ${amount(bestDisbursement.achieved)} achieved`
                    : `No disbursement history for ${period.label}`
                }
                icon={FiTrendingUp}
                tone="green"
              />
              <InsightMetric
                label="Needs attention"
                value={
                  period.isCurrentSnapshot
                    ? lowestDisbursement.name
                    : "Unavailable"
                }
                detail={
                  period.isCurrentSnapshot
                    ? `${percent(lowestDisbursement.percent)} target progress · lowest in this group`
                    : `No disbursement history for ${period.label}`
                }
                icon={FiActivity}
                tone="rose"
              />
              <InsightMetric
                label="Leading team"
                value={
                  period.isCurrentSnapshot
                    ? bestTeam.name.replace("TEAM ", "")
                    : "Unavailable"
                }
                detail={
                  period.isCurrentSnapshot
                    ? `${percent(bestTeam.total.percent)} overall target progress`
                    : `No team target history for ${period.label}`
                }
                icon={FiAward}
                tone="blue"
              />
              <InsightMetric
                label="Team to catch up"
                value={
                  period.isCurrentSnapshot
                    ? lowestTeam.name.replace("TEAM ", "")
                    : "Unavailable"
                }
                detail={
                  period.isCurrentSnapshot
                    ? `${percent(lowestTeam.total.percent)} overall target progress`
                    : `No team target history for ${period.label}`
                }
                icon={FiUsers}
                tone="rose"
              />
              <InsightMetric
                label="Top collection leader"
                value={bestCollectionLeader.name}
                detail={`${percent(bestCollectionLeader.monthly.collectPercent[period.collectionIndex])} recorded collection for ${period.label}`}
                icon={FiActivity}
                tone="green"
              />
              <InsightMetric
                label="Lowest collection achievement"
                value={lowestCollectionLeader.name}
                detail={`${percent(lowestCollectionLeader.monthly.collectPercent[period.collectionIndex])} recorded collection for ${period.label}`}
                icon={FiActivity}
                tone="rose"
              />
              <InsightMetric
                label={
                  period.isCurrentSnapshot
                    ? "Top brand · target progress"
                    : "Top brand · collection"
                }
                value={topBrand?.name ?? "No brand data"}
                detail={
                  topBrand
                    ? `${percent(
                        period.isCurrentSnapshot
                          ? topBrand.targetPercent
                          : topBrand[period.collectionField]
                      )} · ${topBrand.league}`
                    : "No ranked brands in this snapshot"
                }
                icon={FiStar}
                tone="amber"
              />
            </div>
            <p className="mt-2 text-[9px] leading-relaxed text-[#89948c]">
              {period.isCurrentSnapshot
                ? "“Needs attention” is the lowest target progress in the recorded disbursement group, not a live alert."
                : `Team targets, mission totals, user activity and disbursement figures have no recorded ${period.label} history.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-[#e4eae3] pt-4">
            <button
              type="button"
              onClick={() => goToSection("team-race")}
              className="inline-flex items-center gap-1 rounded-xl bg-[#244540] px-3.5 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#31584f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79a88a]"
            >
              Team race <FiChevronRight className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToSection("performers")}
              className="inline-flex items-center gap-1 rounded-xl border border-[#d9e3da] bg-white px-3.5 py-2.5 text-[10px] font-bold text-[#496253] transition hover:bg-[#f0f6f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79a88a]"
            >
              View performers <FiChevronRight className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToSection("leagues")}
              className="inline-flex items-center gap-1 rounded-xl border border-[#d9e3da] bg-white px-3.5 py-2.5 text-[10px] font-bold text-[#496253] transition hover:bg-[#f0f6f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79a88a]"
            >
              League standings <FiChevronRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>
          <p className="text-[9px] text-[#929b95]">
            {period.isCurrentSnapshot
              ? "Recorded snapshot · live data source is not connected."
              : `Historical collection values are from ${period.collectionLabel}; unavailable measures are not estimated.`}
          </p>
        </div>
      </section>
    </div>
  );
}

function Footer() {
  const { period } = useReportPeriod();
  return (
    <footer className="flex flex-col gap-2 border-t border-[#e4e8e2] py-4 text-[10px] leading-relaxed text-[#818c85] sm:flex-row sm:items-center sm:justify-between">
      <span className="inline-flex items-center gap-2">
        <FiShield className="size-3.5 text-[#78907e]" aria-hidden="true" />
        Recording snapshot · {REPORT_SNAPSHOT.reportDate}
      </span>
      <span>
        {period.isCurrentSnapshot
          ? "Figures are transcribed from the supplied recording. Live data requires the original authenticated report source."
          : `Showing recorded ${period.collectionLabel} collection history where available; other sections require historical source data.`}
      </span>
    </footer>
  );
}

export default function PerformanceDashboard() {
  const [selectedPeriodId, setSelectedPeriodId] = useState("october");
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const insightsTriggerRef = useRef(null);
  const wasInsightsOpenRef = useRef(false);
  const period =
    REPORT_PERIODS.find((option) => option.id === selectedPeriodId) ??
    REPORT_PERIODS[0];

  useEffect(() => {
    if (!isInsightsOpen && wasInsightsOpenRef.current) {
      insightsTriggerRef.current?.focus();
    }
    wasInsightsOpenRef.current = isInsightsOpen;
  }, [isInsightsOpen]);

  const closeInsights = () => {
    setIsInsightsOpen(false);
  };

  return (
    <ReportPeriodContext.Provider
      value={{
        period,
        setPeriodId: (periodId) => {
          setSelectedPeriodId(periodId);
          setIsInsightsOpen(false);
        },
      }}
    >
    <div className="min-h-screen bg-[#f4f6f2] text-[#27342e]">
      <Header
        onOpenInsights={() => setIsInsightsOpen(true)}
        insightsTriggerRef={insightsTriggerRef}
      />
      <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-7 px-4 py-6 sm:gap-9 sm:px-6 sm:py-8 lg:px-9">
        <section id="overview" className="scroll-mt-52 space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.19em] text-[#829088]">
                SALES &amp; COLLECTIONS · MONTHLY REPORT
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-[#1f3029] sm:text-2xl">
                {period.label} performance overview
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ecdcbf] bg-[#fff9ee] px-3 py-1.5 text-[9px] font-semibold text-[#92703b]">
              <FiRadio className="size-3" aria-hidden="true" />
              {period.isCurrentSnapshot
                ? `Recorded snapshot · ${REPORT_SNAPSHOT.reportDate}`
                : `Historical filter · ${period.collectionLabel}`}
            </span>
          </div>
          <MissionHero />
        </section>
        <Overview />
        <TeamRace />
        <TeamPerformers />
        <CollectionReport />
        <LeagueStandings />
        <Footer />
      </main>
      {isInsightsOpen && <InsightsDialog onClose={closeInsights} />}
    </div>
    </ReportPeriodContext.Provider>
  );
}
