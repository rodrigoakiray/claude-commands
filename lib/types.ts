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
  source: Source;
}

// Entry shape as authored in each per-source data file, before the `source`
// tag is stamped on at the merge point in data/index.ts.
export type SourcelessEntry = Omit<CommandEntry, "source">;

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
  deploy: "Deploy & Infra",
  understanding: "Code Understanding",
  finance: "Finance & Valuation",
  data: "Data & Engineering",
  design: "Design & Visualization",
  security: "Security",
  meta: "Meta",
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

// Third, independent classification axis: which tool this entry belongs to.
// Unlike category/type, this is a single-select catalog switcher, not a
// multi-value filter rail — there is no "all sources" aggregate view.
export type Source = "claude" | "codex" | "gemini" | "kimi";

export const SOURCE_LABELS: Record<Source, string> = {
  claude: "Claude Commands",
  codex: "Codex Commands",
  gemini: "Gemini Commands",
  kimi: "Kimi Commands",
};

export const SOURCE_ORDER: Source[] = ["claude", "codex", "gemini", "kimi"];
