import type { CommandCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export type CategoryFilter = CommandCategory | "all";

const CATEGORIES: CategoryFilter[] = ["all", "slash", "cli", "shortcut", "config"];

export function CategoryTabs({
  active,
  onChange,
  counts,
}: {
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
  counts: Record<CategoryFilter, number>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
      {CATEGORIES.map((category) => {
        const label = category === "all" ? "All" : CATEGORY_LABELS[category];
        const isActive = active === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
              isActive
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-foreground/70 border-foreground/15 hover:border-foreground/30"
            }`}
          >
            {label}
            <span className="ml-1.5 opacity-60 tabular-nums">{counts[category]}</span>
          </button>
        );
      })}
    </div>
  );
}
