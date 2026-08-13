import type { PracticalCategory } from "@/lib/types";
import { PRACTICAL_CATEGORY_LABELS, PRACTICAL_CATEGORY_ORDER } from "@/lib/types";

export type CategoryFilter = PracticalCategory | "all";

export function CategoryRail({
  active,
  onChange,
  counts,
}: {
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
  counts: Record<CategoryFilter, number>;
}) {
  const categories: CategoryFilter[] = ["all", ...PRACTICAL_CATEGORY_ORDER];

  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-3.5 px-3.5">
      {categories.map((category) => {
        const label = category === "all" ? "All" : PRACTICAL_CATEGORY_LABELS[category];
        const isActive = active === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className="shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-glass"
            style={
              isActive
                ? { background: "var(--accent)", color: "white" }
                : { color: "var(--label-secondary)", background: "var(--glass-fill)" }
            }
          >
            {label}
            <span className="ml-1 opacity-70 tabular-nums">{counts[category] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
