export default function DashboardHeader({ title, company }) {
  return (
    <header className="grid grid-cols-2 items-center gap-y-2 px-1 pt-1 md:grid-cols-[1fr_auto_1fr]">
      <div
        className="col-start-1 row-start-1 flex items-center text-[22px] font-semibold leading-none tracking-[0.18em] text-white sm:text-[26px]"
        aria-label="Plecto"
      >
        <span>PLECT</span>
        <span
          aria-hidden="true"
          className="ml-[2px] inline-block size-[0.78em] rounded-full border-[3px] border-white border-t-brand-green"
        />
      </div>

      <h1 className="col-span-2 row-start-2 text-center text-lg font-normal tracking-wide text-white sm:text-xl md:col-span-1 md:col-start-2 md:row-start-1">
        {title}
      </h1>

      <p className="col-start-2 row-start-1 text-right text-sm text-soft md:col-start-3">
        {company}
      </p>
    </header>
  );
}
