"use client";

import { useMemo, useState } from "react";
import type { Command, CommandCategory } from "@/lib/types";
import { CategoryTabs, type CategoryFilter } from "@/components/CategoryTabs";
import { CommandCard } from "@/components/CommandCard";

function matches(command: Command, query: string): boolean {
  if (!query) return true;
  const haystack = [command.name, command.summary, ...(command.tags ?? [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function CommandExplorer({ commands }: { commands: Command[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const counts = useMemo(() => {
    const base: Record<CategoryFilter, number> = {
      all: commands.length,
      slash: 0,
      cli: 0,
      shortcut: 0,
      config: 0,
    };
    for (const command of commands) {
      base[command.category as CommandCategory] += 1;
    }
    return base;
  }, [commands]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return commands.filter(
      (command) =>
        (category === "all" || command.category === category) &&
        matches(command, normalizedQuery)
    );
  }, [commands, query, category]);

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 -mx-4 px-4 pt-[env(safe-area-inset-top)] pb-3 bg-background/90 backdrop-blur border-b border-foreground/10 flex flex-col gap-3">
        <input
          type="search"
          inputMode="search"
          placeholder="Search commands, flags, shortcuts..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-xl border border-foreground/15 bg-foreground/[0.03] px-4 py-3 text-base outline-none focus:border-foreground/40"
        />
        <CategoryTabs active={category} onChange={setCategory} counts={counts} />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-foreground/50 py-8 text-center">
          No commands match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-[env(safe-area-inset-bottom)]">
          {filtered.map((command) => (
            <CommandCard key={command.id} command={command} />
          ))}
        </div>
      )}
    </div>
  );
}
