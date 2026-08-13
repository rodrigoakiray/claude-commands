export type EntryKind =
  | "slash"
  | "cli"
  | "shortcut"
  | "config"
  | "skill"
  | "plugin"
  | "subagent";

export type PracticalCategory =
  | "session"
  | "review"
  | "planning"
  | "settings"
  | "editing"
  | "platform"
  | "deploy"
  | "understanding"
  | "finance"
  | "data"
  | "design"
  | "security"
  | "meta";

export interface CommandEntry {
  id: string;
  name: string;
  kind: EntryKind;
  practicalCategory: PracticalCategory;
  summary: string;
  usage?: string;
  details?: string;
  tags?: string[];
  pluginNamespace?: string;
}

export const KIND_LABELS: Record<EntryKind, string> = {
  slash: "Slash",
  cli: "CLI",
  shortcut: "Shortcut",
  config: "Config",
  skill: "Skill",
  plugin: "Plugin",
  subagent: "Subagent",
};

export const PRACTICAL_CATEGORY_LABELS: Record<PracticalCategory, string> = {
  session: "Session & Context",
  review: "Review & Quality",
  planning: "Planning & Automation",
  settings: "Settings & Permissions",
  editing: "Editing & Shortcuts",
  platform: "Integrations & Platform",
  deploy: "Deploy & Vercel",
  understanding: "Code Understanding",
  finance: "Finance & Valuation",
  data: "Data & Engineering",
  design: "Design & Visualization",
  security: "Security",
  meta: "Claude Code Meta",
};

export const PRACTICAL_CATEGORY_ORDER: PracticalCategory[] = [
  "session",
  "review",
  "planning",
  "settings",
  "editing",
  "platform",
  "deploy",
  "understanding",
  "finance",
  "data",
  "design",
  "security",
  "meta",
];
