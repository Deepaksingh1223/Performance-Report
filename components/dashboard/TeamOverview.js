import { Crown, Star, UserRound, Users } from "lucide-react";
import Avatar from "./Avatar";
import Card from "./Card";
import { Badge } from "./EmployeeTable";

const formatAmount = (value) => `₹${Math.round(value).toLocaleString("en-IN")}`;

function RoleRow({ icon: Icon, label, name, detail, emphasis = false }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
          emphasis
            ? "bg-brand-cyan/15 text-brand-cyan ring-1 ring-brand-cyan/20"
            : "bg-white/5 text-soft"
        }`}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        {detail && <p className="truncate text-[11px] text-brand-cyan">{detail}</p>}
      </div>
    </div>
  );
}

function CollectionStars({ count }) {
  return (
    <span
      className="flex shrink-0 items-center gap-0.5"
      aria-label={`${count} out of 5 stars`}
      title={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`size-3 ${index < count ? "fill-brand-yellow text-brand-yellow" : "text-white/15"}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function TeamCard({ team }) {
  return (
    <Card
      title={team.name}
      subtitle={`${team.members.length} ${team.members.length === 1 ? "member" : "members"} · ${team.domain}`}
      className="min-w-0 overflow-hidden border-white/[0.08] bg-gradient-to-br from-card via-card to-[#101a2d] hover:border-brand-cyan/25"
      action={
        <div className="shrink-0 text-right">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-muted">Total collection</p>
          <p className="text-base font-bold tabular-nums text-brand-green">
            {formatAmount(team.collection)}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-2.5">
        <RoleRow icon={Crown} label="Head" name={team.head} detail={team.domain} />
        <div className="ml-4 h-2 border-l border-dashed border-white/15" aria-hidden="true" />
        <RoleRow icon={UserRound} label="Team Leader" name={team.leader} emphasis />

        <div className="ml-4 h-2 border-l border-dashed border-white/15" aria-hidden="true" />
        <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
          <div className="mb-1 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-1 text-[9px] font-semibold uppercase tracking-wide text-muted sm:grid-cols-[minmax(0,1fr)_112px_38px]">
            <div className="flex min-w-0 items-center gap-2">
              <Users className="size-3.5 text-brand-cyan" aria-hidden="true" />
              <span className="truncate">Team members</span>
            </div>
            <span className="text-right">Collection</span>
            <span className="text-right">Demos</span>
          </div>
          <ol className="-mx-3 overflow-hidden">
            {team.members.map((member) => (
              <li
                key={member.id}
                className="group grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-3 py-2 transition-colors odd:bg-row/50 hover:bg-[#25365c] sm:grid-cols-[minmax(0,1fr)_112px_38px]"
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                  <span className="w-3 shrink-0 text-xs tabular-nums text-muted">{member.rank}</span>
                  <Avatar name={member.name} src={member.avatar} className="size-7 sm:size-8" />
                  <span className="truncate text-xs font-semibold text-white sm:text-sm">
                    {member.name}
                  </span>
                  {member.badges.length > 0 && (
                    <span className="hidden shrink-0 items-center gap-1 sm:flex">
                      {member.badges.map((badge) => (
                        <Badge key={badge} id={badge} />
                      ))}
                    </span>
                  )}
                  <CollectionStars count={member.stars} />
                </div>
                <span className="whitespace-nowrap text-right text-xs font-semibold tabular-nums text-white sm:text-sm">
                  {formatAmount(member.wonDeals)}
                </span>
                <span className="text-right text-xs font-semibold tabular-nums text-white sm:text-sm">
                  {member.demos}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Card>
  );
}

export default function TeamOverview({ teams }) {
  return (
    <section aria-labelledby="team-overview-title" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-2 px-1">
        <div>
          <h2 id="team-overview-title" className="text-lg font-semibold text-white">
            Four-team member tree
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Team leads, members and collection totals at a glance
          </p>
        </div>
        <p className="text-xs font-medium text-soft">{teams.length} teams</p>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </section>
  );
}
