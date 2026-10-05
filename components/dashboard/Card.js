/** Shared card shell: consistent radius, border, padding and hover behaviour. */
export default function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
  bodyClassName = "",
}) {
  return (
    <section
      className={`flex min-w-0 flex-col rounded-3xl border border-line bg-card p-4 shadow-sm shadow-black/20 transition-[border-color,background-color,box-shadow] duration-200 ease-in-out hover:border-white/20 hover:bg-card-hover hover:shadow-md hover:shadow-black/25 ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-sm font-semibold leading-tight text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[11px] leading-tight text-muted">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={`min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
