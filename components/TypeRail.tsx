import type { TypeGroup } from "@/lib/types";
import { TYPE_GROUP_LABELS, TYPE_GROUP_ORDER } from "@/lib/types";

export type TypeFilter = TypeGroup | "all";

export function TypeRail({
  active,
  onChange,
  counts,
}: {
  active: TypeFilter;
  onChange: (type: TypeFilter) => void;
  counts: Record<TypeFilter, number>;
}) {
  const types: TypeFilter[] = ["all", ...TYPE_GROUP_ORDER];

  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-3.5 px-3.5">
      {types.map((type) => {
        const label = type === "all" ? "All types" : TYPE_GROUP_LABELS[type];
        const isActive = active === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className="shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-glass border"
            style={
              isActive
                ? { background: "var(--label)", color: "var(--bg-0)", borderColor: "var(--label)" }
                : {
                    color: "var(--label-tertiary)",
                    background: "transparent",
                    borderColor: "var(--glass-border-soft)",
                  }
            }
          >
            {label}
            <span className="ml-1 opacity-70 tabular-nums">{counts[type] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
