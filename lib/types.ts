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

// Second, independent classification axis: what kind of thing this is at a
// coarse level, collapsing the built-in-command kinds into one bucket.
export type TypeGroup = "commands" | "skills" | "plugins" | "subagents";

export const KIND_TO_TYPE_GROUP: Record<EntryKind, TypeGroup> = {
  slash: "commands",
  cli: "commands",
  shortcut: "commands",
  config: "commands",
  skill: "skills",
  plugin: "plugins",
  subagent: "subagents",
};

export const TYPE_GROUP_LABELS: Record<TypeGroup, string> = {
  commands: "Commands",
  skills: "Skills",
  plugins: "Plugins",
  subagents: "Subagents",
};

export const TYPE_GROUP_ORDER: TypeGroup[] = ["commands", "skills", "plugins", "subagents"];
