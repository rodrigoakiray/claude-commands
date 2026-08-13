export type CommandCategory = "slash" | "cli" | "shortcut" | "config";

export interface Command {
  id: string;
  name: string;
  category: CommandCategory;
  summary: string;
  usage?: string;
  details?: string;
  tags?: string[];
}

export const CATEGORY_LABELS: Record<CommandCategory, string> = {
  slash: "Slash Commands",
  cli: "CLI",
  shortcut: "Shortcuts",
  config: "Hooks & Config",
};
