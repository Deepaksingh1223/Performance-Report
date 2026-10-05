import { Sparkles } from "lucide-react";
import Card from "./Card";
import Avatar from "./Avatar";
import { formatThousands } from "@/lib/format";

const RANK_STYLES = {
  1: {
    ring: "border-brand-yellow shadow-[0_0_28px_rgba(246,196,69,0.35)]",
    badge: "bg-brand-yellow text-[#3a2a00]",
  },
  2: {
    ring: "border-[#c9d2e3] shadow-[0_0_20px_rgba(201,210,227,0.18)]",
    badge: "bg-[#c9d2e3] text-[#1b2438]",
  },
  3: {
    ring: "border-brand-orange shadow-[0_0_20px_rgba(245,154,60,0.25)]",
    badge: "bg-brand-orange text-[#3a1d00]",
  },
};

export default function RevenueRepCard({ title, subtitle, reps, className = "" }) {
  return (
    <Card title={title} subtitle={subtitle} className={className} bodyClassName="flex items-center">
      <ol className="grid w-full grid-cols-3 items-start gap-2 py-2 sm:gap-4">
        {reps.map((rep, i) => {
          const rank = i + 1;
          const style = RANK_STYLES[rank];

          return (
            <li
              key={rep.id}
              className="group flex min-w-0 flex-col items-center text-center"
            >
              <div className="relative">
                <Avatar
                  name={rep.name}
                  src={rep.avatar}
                  className={`size-16 border-[3px] transition-all duration-200 ease-in-out group-hover:scale-105 sm:size-20 xl:size-24 ${style.ring}`}
                />
                {rank === 1 && (
                  <>
                    <Sparkles
                      aria-hidden="true"
                      className="absolute -left-3 bottom-1 size-4 text-brand-yellow"
                    />
                    <Sparkles
                      aria-hidden="true"
                      className="absolute -right-3 bottom-1 size-4 text-brand-yellow"
                    />
                  </>
                )}
                <span
                  className={`absolute -bottom-2 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-card text-xs font-bold ${style.badge}`}
                  aria-label={`Rank ${rank}`}
                >
                  {rank}
                </span>
              </div>

              <p className="mt-4 w-full truncate text-xs text-soft sm:text-sm">
                {rep.name}
              </p>
              <p className="text-xl font-semibold leading-tight tabular-nums text-white sm:text-2xl xl:text-[28px]">
                {formatThousands(rep.wonDeals)}
              </p>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
