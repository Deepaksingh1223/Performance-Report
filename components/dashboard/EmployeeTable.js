import { Award, Flame, Trophy } from "lucide-react";
import Card from "./Card";
import Avatar from "./Avatar";
import { formatCurrency } from "@/lib/format";

const BADGES = {
  trophy: { icon: Trophy, label: "Top closer", bg: "bg-brand-yellow" },
  award: { icon: Award, label: "Consistency award", bg: "bg-brand-orange" },
  flame: { icon: Flame, label: "On a streak", bg: "bg-brand-yellow" },
};

export function Badge({ id }) {
  const badge = BADGES[id];
  if (!badge) return null;
  const Icon = badge.icon;

  return (
    <span
      title={badge.label}
      className={`flex size-[22px] items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 ${badge.bg}`}
      style={{ clipPath: "polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }}
    >
      <Icon aria-label={badge.label} className="size-3 text-[#3a2a00]" strokeWidth={2.5} />
    </span>
  );
}

export default function EmployeeTable({ title, employees, className = "" }) {
  return (
    <Card subtitle={title} className={className} bodyClassName="-mx-4 -mb-4 flex">
      {/* Scrolls horizontally inside the card on narrow screens */}
      <div className="scroll-thin w-full overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <thead>
            <tr className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-2 font-semibold">Employee</th>
              <th scope="col" className="px-2 py-2 text-right font-semibold">Won deals</th>
              <th scope="col" className="px-4 py-2 text-right font-semibold">Demos</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e, i) => (
              <tr
                key={e.id}
                className="group text-sm transition-all duration-200 ease-in-out odd:bg-row/60 hover:bg-[#25365c]"
              >
                <td className="px-4 py-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 text-xs tabular-nums text-muted">{i + 1}</span>
                    <Avatar name={e.name} src={e.avatar} className="size-6" />
                    <span className="truncate font-medium text-white">{e.name}</span>
                    {e.badges.length > 0 && (
                      <span className="flex items-center gap-1">
                        {e.badges.map((b) => (
                          <Badge key={b} id={b} />
                        ))}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1.5 text-right font-medium tabular-nums text-white">
                  {formatCurrency(e.wonDeals)}
                </td>
                <td className="px-4 py-1.5 text-right font-medium tabular-nums text-white">
                  {e.demos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
