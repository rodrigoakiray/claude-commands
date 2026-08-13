"use client";

import { useState } from "react";
import type { CommandEntry } from "@/lib/types";
import { KIND_LABELS } from "@/lib/types";

const KIND_DOT: Record<CommandEntry["kind"], string> = {
  slash: "var(--kind-slash)",
  cli: "var(--kind-cli)",
  shortcut: "var(--kind-shortcut)",
  config: "var(--kind-config)",
  skill: "var(--kind-skill)",
  plugin: "var(--kind-plugin)",
  subagent: "var(--kind-subagent)",
};

export function GlassRow({
  entry,
  favorite,
  onToggleFavorite,
}: {
  entry: CommandEntry;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(entry.usage ?? entry.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <li
      className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-b-0"
      style={{ borderColor: "var(--glass-border-soft)" }}
    >
      <div className="flex items-start gap-1">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 min-w-0 text-left px-3.5 py-2.5 flex items-start gap-2.5 min-h-[44px] active:bg-black/[0.03] dark:active:bg-white/[0.04] transition-glass"
          aria-expanded={expanded}
        >
          <span
            className="mt-1.5 h-2 w-2 rounded-full shrink-0"
            style={{ background: KIND_DOT[entry.kind] }}
            aria-hidden
          />
          <span className="flex-1 min-w-0">
            <span className="flex items-baseline justify-between gap-2">
              <code className="text-[13.5px] font-mono font-semibold truncate" style={{ color: "var(--label)" }}>
                {entry.name}
              </code>
              <span
                className="shrink-0 text-[10px] uppercase tracking-wide"
                style={{ color: "var(--label-tertiary)" }}
              >
                {KIND_LABELS[entry.kind]}
              </span>
            </span>
            <span
              className={`block text-[12.5px] leading-snug mt-0.5 ${expanded ? "" : "truncate"}`}
              style={{ color: "var(--label-secondary)" }}
            >
              {entry.summary}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className="shrink-0 h-11 w-11 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={favorite ? "var(--favorite)" : "none"} stroke={favorite ? "var(--favorite)" : "var(--label-tertiary)"} strokeWidth="1.75">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z"
            />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="px-3.5 pb-3 pl-[2.15rem] space-y-2">
          {entry.usage && (
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 glass">
              <code className="flex-1 text-[11.5px] font-mono overflow-x-auto whitespace-pre" style={{ color: "var(--label)" }}>
                {entry.usage}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 text-[11px] font-medium px-2 py-1 rounded-md"
                style={{ color: "var(--accent)" }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}
          {entry.details && (
            <p className="text-[12px] leading-snug" style={{ color: "var(--label-secondary)" }}>
              {entry.details}
            </p>
          )}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] rounded-full px-2 py-0.5"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
