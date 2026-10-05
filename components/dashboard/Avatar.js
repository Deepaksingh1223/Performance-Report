"use client";

import { useEffect, useRef, useState } from "react";
import { getInitials } from "@/lib/format";

/** Round avatar with a graceful initials fallback if the image cannot load. */
export default function Avatar({ name, src, className = "size-8" }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  // Catches images that failed before React hydrated (onError would be missed).
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#2d4272] text-[11px] font-semibold text-white ${className}`}
        aria-label={name}
      >
        {getInitials(name)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={name}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full bg-[#2d4272] object-cover ${className}`}
    />
  );
}
