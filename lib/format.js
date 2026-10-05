/** Formatting helpers shared by all dashboard components. */

export const formatCurrency = (n) =>
  `$${Math.round(n).toLocaleString("en-US")}`;

export const formatThousands = (n) => `$${Math.round(n / 1000)}k`;

/** Accepts a value expressed in millions. */
export const formatMillions = (n, digits = 2) =>
  `$${Number(n).toFixed(digits).replace(/\.?0+$/, "")}M`;

/** Accepts a value expressed in thousands (e.g. 2030 -> $2.03M). */
export const formatThousandsAsMillions = (n) => `$${(n / 1000).toFixed(2)}M`;

export const formatPercent = (n) => `${Math.round(n)}%`;

export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
