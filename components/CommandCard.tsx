"use client";

import { useState } from "react";
import type { Command } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export function CommandCard({ command }: { command: Command }) {
  const [copied, setCopied] = useState(false);
  const copyText = command.usage ?? command.name;

  async function handleCopy() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <article className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <code className="text-base font-mono font-semibold break-all">{command.name}</code>
        <span className="shrink-0 text-[11px] uppercase tracking-wide text-foreground/50 mt-1">
          {CATEGORY_LABELS[command.category]}
        </span>
      </div>

      <p className="text-sm text-foreground/80">{command.summary}</p>

      {command.details && (
        <p className="text-sm text-foreground/60">{command.details}</p>
      )}

      {command.usage && (
        <div className="mt-1 flex items-center gap-2 rounded-lg bg-foreground/5 px-3 py-2">
          <code className="flex-1 text-xs font-mono overflow-x-auto whitespace-pre">
            {command.usage}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-xs font-medium text-foreground/70 hover:text-foreground active:scale-95 transition"
            aria-label="Copy usage example"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      {command.tags && command.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mt-1">
          {command.tags.map((tag) => (
            <li
              key={tag}
              className="text-[11px] text-foreground/50 bg-foreground/5 rounded-full px-2 py-0.5"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
