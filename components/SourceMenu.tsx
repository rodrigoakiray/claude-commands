"use client";

import { useEffect, useRef, useState } from "react";
import type { Source } from "@/lib/types";
import { SOURCE_LABELS, SOURCE_ORDER } from "@/lib/types";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--label-tertiary)"
      strokeWidth="2.5"
      style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.2s ease" }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

// Top-left catalog switcher: single-select among the three sources, unlike
// CategoryRail/TypeRail which are multi-value filter rails with an "all"
// aggregate. There's no "all sources" view.
export function SourceMenu({ active, onChange }: { active: Source; onChange: (source: Source) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 -mx-1 -my-0.5 px-1 py-0.5 rounded-lg transition-glass"
        aria-expanded={open}
      >
        <span className="text-[13px] font-semibold" style={{ color: "var(--label)" }}>
          {SOURCE_LABELS[active]}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          className="glass-strong absolute left-0 top-full mt-1.5 z-30 min-w-[172px] rounded-xl p-1 flex flex-col gap-0.5"
        >
          {SOURCE_ORDER.map((source) => {
            const isActive = source === active;
            return (
              <button
                key={source}
                type="button"
                onClick={() => {
                  onChange(source);
                  setOpen(false);
                }}
                className="text-left rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-glass"
                style={
                  isActive
                    ? { background: "var(--accent-soft)", color: "var(--accent)" }
                    : { color: "var(--label-secondary)" }
                }
              >
                {SOURCE_LABELS[source]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
