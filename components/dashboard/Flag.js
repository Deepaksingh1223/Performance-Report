/** Circular country flags drawn as inline SVG (no external assets). */
export default function Flag({ code, size = 24 }) {
  const id = `flag-clip-${code}`;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={code}>
      <defs>
        <clipPath id={id}>
          <circle cx="24" cy="24" r="23" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {code === "UK" && (
          <>
            <rect width="48" height="48" fill="#1b3a8c" />
            <path d="M0 0L48 48M48 0L0 48" stroke="#fff" strokeWidth="9" />
            <path d="M0 0L48 48M48 0L0 48" stroke="#d3213c" strokeWidth="3.5" />
            <path d="M24 0V48M0 24H48" stroke="#fff" strokeWidth="14" />
            <path d="M24 0V48M0 24H48" stroke="#d3213c" strokeWidth="8" />
          </>
        )}
        {code === "SE" && (
          <>
            <rect width="48" height="48" fill="#1d6fb8" />
            <rect x="14" width="8" height="48" fill="#f6c32b" />
            <rect y="20" width="48" height="8" fill="#f6c32b" />
          </>
        )}
        {code === "IT" && (
          <>
            <rect width="16" height="48" fill="#1fa05a" />
            <rect x="16" width="16" height="48" fill="#f4f5f7" />
            <rect x="32" width="16" height="48" fill="#d6283a" />
          </>
        )}
      </g>
      <circle cx="24" cy="24" r="23" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    </svg>
  );
}
