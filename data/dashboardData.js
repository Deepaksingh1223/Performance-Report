/**
 * Mock data for the Sales Manager Dashboard.
 * Everything rendered on the page comes from this file (or is derived from it).
 */

export const PERIODS = [
  { id: "current", label: "Current month" },
  { id: "previous", label: "Previous month" },
];

export const CHART_COLORS = {
  blue: "#1F6FEB",
  sky: "#5BB8FF",
  mint: "#1FC7A0",
  teal: "#16A085",
  slate: "#6E81A6",
};

const avatar = (n) => `https://i.pravatar.cc/160?img=${n}`;

export const TEAM_STRUCTURE = [
  {
    id: "team-a",
    name: "Team A",
    code: "A",
    head: "Alex Morgan",
    domain: "Enterprise Sales",
    leader: "Anna Cole",
    employeeIds: ["anna", "curtis"],
  },
  {
    id: "team-b",
    name: "Team B",
    code: "B",
    head: "Emily Clark",
    domain: "SMB Sales",
    leader: "David Howard",
    employeeIds: ["david", "karen"],
  },
  {
    id: "team-c",
    name: "Team C",
    code: "C",
    head: "Robert Wilson",
    domain: "Mid-Market Sales",
    leader: "Jennifer Mata",
    employeeIds: ["jennifer"],
  },
  {
    id: "team-d",
    name: "Team D",
    code: "D",
    head: "Sophia Turner",
    domain: "Strategic Accounts",
    leader: "Kyle Daniels",
    employeeIds: ["kyle", "mike"],
  },
];

/** Badge ids map to icons in EmployeeTable. */
const makeEmployees = (stats) =>
  [
    { id: "anna", name: "Anna Cole", avatar: avatar(44), badges: [] },
    { id: "curtis", name: "Curtis Miller", avatar: avatar(33), badges: [] },
    { id: "david", name: "David Howard", avatar: avatar(15), badges: ["award", "trophy"] },
    { id: "jennifer", name: "Jennifer Mata", avatar: avatar(45), badges: [] },
    { id: "karen", name: "Karen Castillo", avatar: avatar(47), badges: ["trophy"] },
    { id: "kyle", name: "Kyle Daniels", avatar: avatar(12), badges: ["flame"] },
    { id: "mike", name: "Mike Novak", avatar: avatar(53), badges: [] },
  ].map((e) => ({ ...e, ...stats[e.id] }));

export const dashboardData = {
  current: {
    dealsWon: { value: 5.77, target: 33 }, // millions
    forecast: 33, // millions
    inboundShare: 60,
    outboundShare: 30,
    upgradeShare: 10,
    newCustomers: 172,
    employees: makeEmployees({
      anna: { wonDeals: 428898, demos: 8 },
      curtis: { wonDeals: 387082, demos: 4 },
      david: { wonDeals: 442077, demos: 7 },
      jennifer: { wonDeals: 580669, demos: 7 },
      karen: { wonDeals: 623089, demos: 4 },
      kyle: { wonDeals: 576973, demos: 9 },
      mike: { wonDeals: 526534, demos: 9 },
    }),
    demosOther: { reps: 8, demos: 38 },
  },
  previous: {
    dealsWon: { value: 28.4, target: 33 },
    forecast: 31,
    inboundShare: 55,
    outboundShare: 33,
    upgradeShare: 12,
    newCustomers: 158,
    employees: makeEmployees({
      anna: { wonDeals: 511240, demos: 6 },
      curtis: { wonDeals: 402318, demos: 5 },
      david: { wonDeals: 398650, demos: 8 },
      jennifer: { wonDeals: 612904, demos: 9 },
      karen: { wonDeals: 547113, demos: 5 },
      kyle: { wonDeals: 590477, demos: 7 },
      mike: { wonDeals: 489026, demos: 8 },
    }),
    demosOther: { reps: 8, demos: 34 },
  },
};

/* ------------------------------------------------------------------ */
/* Derived data                                                        */
/* ------------------------------------------------------------------ */

/** Top N sales reps by won deal value. */
export const getTopReps = (employees, count = 3) =>
  [...employees].sort((a, b) => b.wonDeals - a.wonDeals).slice(0, count);

/** Donut segments for the Upcoming Demos card. */
export const getDemoSegments = (employees, demosOther) => {
  const palette = [
    CHART_COLORS.blue,
    CHART_COLORS.sky,
    CHART_COLORS.mint,
    CHART_COLORS.teal,
  ];
  const top = [...employees].sort((a, b) => b.demos - a.demos).slice(0, 4);

  const segments = top.map((e, i) => ({
    name: e.name,
    value: e.demos,
    color: palette[i],
  }));

  segments.push({
    name: `+${demosOther.reps} other`,
    value: demosOther.demos,
    color: CHART_COLORS.slate,
  });

  return segments;
};

export const getAverageTeamValue = (teams) =>
  teams.reduce((sum, t) => sum + t.value, 0) / teams.length;

export const getTeamSummaries = (employees) => {
  const employeesById = new Map(employees.map((employee) => [employee.id, employee]));
  const teamSummaries = TEAM_STRUCTURE.map((team) => {
    const members = team.employeeIds
      .map((id) => employeesById.get(id))
      .filter(Boolean)
      .sort((a, b) => b.wonDeals - a.wonDeals);
    const collection = members.reduce((sum, member) => sum + member.wonDeals, 0);

    return {
      ...team,
      members,
      collection,
      value: collection / 1000,
    };
  });
  const rankedMembers = teamSummaries
    .flatMap((team) => team.members)
    .sort((a, b) => b.wonDeals - a.wonDeals);
  const highestCollection = rankedMembers[0]?.wonDeals ?? 0;
  const ranks = new Map(rankedMembers.map((member, index) => [member.id, index + 1]));

  return teamSummaries.map((team) => ({
    ...team,
    members: team.members.map((member) => ({
      ...member,
      rank: ranks.get(member.id),
      stars:
        highestCollection > 0
          ? Math.max(1, Math.round((member.wonDeals / highestCollection) * 5))
          : 1,
    })),
  }));
};

/* ------------------------------------------------------------------ */
/* Simulated refresh                                                   */
/* ------------------------------------------------------------------ */

const jitter = (value, pct) => value * (1 + (Math.random() * 2 - 1) * pct);

/** Returns a slightly different copy of a period's data to simulate live updates. */
export const regenerateData = (data) => {
  const inbound = Math.round(jitter(data.inboundShare, 0.08));
  const outbound = Math.max(5, Math.round(jitter(data.outboundShare, 0.1)));

  return {
    ...data,
    dealsWon: {
      ...data.dealsWon,
      value: Math.min(
        data.dealsWon.target,
        Number(jitter(data.dealsWon.value, 0.05).toFixed(2))
      ),
    },
    forecast: Math.round(jitter(data.forecast, 0.04)),
    inboundShare: inbound,
    outboundShare: outbound,
    upgradeShare: Math.max(0, 100 - inbound - outbound),
    newCustomers: Math.round(jitter(data.newCustomers, 0.06)),
    employees: data.employees.map((e) => ({
      ...e,
      wonDeals: Math.round(jitter(e.wonDeals, 0.06)),
      demos: Math.max(1, e.demos + Math.round(Math.random() * 2 - 1)),
    })),
    demosOther: {
      ...data.demosOther,
      demos: Math.max(10, data.demosOther.demos + Math.round(Math.random() * 6 - 3)),
    },
  };
};
