import { builtinCommands } from "@/data/commands";
import { skillEntries } from "@/data/skills";
import { codexCommands } from "@/data/codexCommands";
import { geminiCommands } from "@/data/geminiCommands";
import { kimiCommands } from "@/data/kimiCommands";
import type { CommandEntry } from "@/lib/types";

const claudeEntries: CommandEntry[] = [...builtinCommands, ...skillEntries].map((e) => ({
  ...e,
  source: "claude" as const,
}));
const codexEntries: CommandEntry[] = codexCommands.map((e) => ({ ...e, source: "codex" as const }));
const geminiEntries: CommandEntry[] = geminiCommands.map((e) => ({ ...e, source: "gemini" as const }));
const kimiEntries: CommandEntry[] = kimiCommands.map((e) => ({ ...e, source: "kimi" as const }));

export const allEntries: CommandEntry[] = [
  ...claudeEntries,
  ...codexEntries,
  ...geminiEntries,
  ...kimiEntries,
];
