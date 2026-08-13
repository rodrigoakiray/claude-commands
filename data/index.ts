import { builtinCommands } from "@/data/commands";
import { skillEntries } from "@/data/skills";
import type { CommandEntry } from "@/lib/types";

export const allEntries: CommandEntry[] = [...builtinCommands, ...skillEntries];
