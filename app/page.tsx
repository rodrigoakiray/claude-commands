import { commands } from "@/data/commands";
import { CommandExplorer } from "@/components/CommandExplorer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 max-w-3xl w-full mx-auto px-4">
      <header className="pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Claude Commands</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Quick reference for Claude Code — slash commands, CLI flags, keyboard
          shortcuts, and hooks.
        </p>
      </header>

      <main className="flex-1 pb-8">
        <CommandExplorer commands={commands} />
      </main>
    </div>
  );
}
