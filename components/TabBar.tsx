export type View = "browse" | "favorites";

function CompassIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--accent)" : "var(--label-tertiary)"} strokeWidth="1.75">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5l-2 5-3 1 2-5z" fill={active ? "var(--accent)" : "none"} />
    </svg>
  );
}

function StarIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "var(--favorite)" : "none"} stroke={active ? "var(--favorite)" : "var(--label-tertiary)"} strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
    </svg>
  );
}

export function TabBar({ active, onChange }: { active: View; onChange: (view: View) => void }) {
  return (
    <nav
      className="fixed left-1/2 -translate-x-1/2 z-20 glass-strong rounded-full flex gap-1 p-1.5"
      style={{ bottom: "calc(var(--safe-bottom) + 14px)" }}
    >
      {(
        [
          { key: "browse" as const, label: "Browse", Icon: CompassIcon },
          { key: "favorites" as const, label: "Favorites", Icon: StarIcon },
        ]
      ).map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 min-h-[44px] transition-glass"
            style={isActive ? { background: "var(--accent-soft)" } : undefined}
          >
            <Icon active={isActive} />
            <span
              className="text-[13px] font-medium"
              style={{ color: isActive ? "var(--accent)" : "var(--label-tertiary)" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
