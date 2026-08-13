"use client";

import { useMemo, useState } from "react";
import type { CommandEntry, PracticalCategory } from "@/lib/types";
import { KIND_TO_TYPE_GROUP, PRACTICAL_CATEGORY_LABELS, PRACTICAL_CATEGORY_ORDER, TYPE_GROUP_ORDER } from "@/lib/types";
import { CategoryRail, type CategoryFilter } from "@/components/CategoryRail";
import { TypeRail, type TypeFilter } from "@/components/TypeRail";
import { GlassRow } from "@/components/GlassRow";
import { TabBar, type View } from "@/components/TabBar";
import { useFavorites } from "@/lib/useFavorites";

function matchesQuery(entry: CommandEntry, query: string): boolean {
  if (!query) return true;
  const haystack = [entry.name, entry.summary, entry.pluginNamespace, ...(entry.tags ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function CommandExplorer({ entries }: { entries: CommandEntry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [view, setView] = useState<View>("browse");
  const { toggle, isFavorite, hydrated } = useFavorites();

  const viewEntries = useMemo(() => {
    if (view === "favorites") return entries.filter((e) => isFavorite(e.id));
    return entries;
  }, [entries, view, isFavorite]);

  const searched = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return viewEntries.filter((e) => matchesQuery(e, normalized));
  }, [viewEntries, query]);

  // Two independent facets — each rail's counts reflect the OTHER facet's
  // current selection, so picking one shows what the combination yields.
  const byTypeOnly = useMemo(
    () => (category === "all" ? searched : searched.filter((e) => e.practicalCategory === category)),
    [searched, category]
  );

  const byCategoryOnly = useMemo(
    () => (type === "all" ? searched : searched.filter((e) => KIND_TO_TYPE_GROUP[e.kind] === type)),
    [searched, type]
  );

  const categoryCounts = useMemo(() => {
    const base: Record<CategoryFilter, number> = { all: byCategoryOnly.length } as Record<CategoryFilter, number>;
    for (const cat of PRACTICAL_CATEGORY_ORDER) base[cat] = 0;
    for (const entry of byCategoryOnly) base[entry.practicalCategory] += 1;
    return base;
  }, [byCategoryOnly]);

  const typeCounts = useMemo(() => {
    const base: Record<TypeFilter, number> = { all: byTypeOnly.length } as Record<TypeFilter, number>;
    for (const t of TYPE_GROUP_ORDER) base[t] = 0;
    for (const entry of byTypeOnly) base[KIND_TO_TYPE_GROUP[entry.kind]] += 1;
    return base;
  }, [byTypeOnly]);

  const filtered = useMemo(() => {
    let result = searched;
    if (category !== "all") result = result.filter((e) => e.practicalCategory === category);
    if (type !== "all") result = result.filter((e) => KIND_TO_TYPE_GROUP[e.kind] === type);
    return result;
  }, [searched, category, type]);

  const groups = useMemo(() => {
    if (category !== "all") return [{ key: category as PracticalCategory, items: filtered }];
    return PRACTICAL_CATEGORY_ORDER.map((cat) => ({
      key: cat,
      items: filtered.filter((e) => e.practicalCategory === cat),
    })).filter((g) => g.items.length > 0);
  }, [filtered, category]);

  return (
    <div className="flex flex-col gap-3 pb-28">
      <div
        className="glass-header sticky top-0 z-10 -mx-4 px-4 flex flex-col gap-2.5"
        style={{ paddingTop: "calc(var(--safe-top) + 0.6rem)", paddingBottom: "0.75rem" }}
      >
        <div className="flex items-baseline justify-between px-1">
          <span className="text-[13px] font-semibold" style={{ color: "var(--label)" }}>
            {view === "favorites" ? "Favorites" : "Claude Commands"}
          </span>
          <span className="text-[11px] tabular-nums" style={{ color: "var(--label-tertiary)" }}>
            {filtered.length} entries
          </span>
        </div>
        <div className="rounded-2xl px-3.5 py-1" style={{ background: "var(--glass-fill)" }}>
          <input
            type="search"
            inputMode="search"
            placeholder={view === "favorites" ? "Search favorites…" : "Search commands, skills, subagents…"}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent py-2.5 text-[15px] outline-none placeholder:opacity-60"
            style={{ color: "var(--label)" }}
          />
        </div>
        <CategoryRail active={category} onChange={setCategory} counts={categoryCounts} />
        <TypeRail active={type} onChange={setType} counts={typeCounts} />
      </div>

      {view === "favorites" && hydrated && filtered.length === 0 ? (
        <p className="text-center text-[13px] py-10" style={{ color: "var(--label-tertiary)" }}>
          No favorites yet. Tap the star on anything you want to find fast.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-[13px] py-10" style={{ color: "var(--label-tertiary)" }}>
          No matches for &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <section key={group.key} className="flex flex-col gap-1.5">
              <h2
                className="px-1 text-[12px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--label-tertiary)" }}
              >
                {PRACTICAL_CATEGORY_LABELS[group.key]}
                <span className="ml-1.5 opacity-70 tabular-nums">{group.items.length}</span>
              </h2>
              <ul className="glass rounded-2xl overflow-hidden md:grid md:grid-cols-2">
                {group.items.map((entry) => (
                  <GlassRow
                    key={entry.id}
                    entry={entry}
                    favorite={isFavorite(entry.id)}
                    onToggleFavorite={() => toggle(entry.id)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <TabBar active={view} onChange={setView} />
    </div>
  );
}
