import { allEntries } from "@/data";
import { CommandExplorer } from "@/components/CommandExplorer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 max-w-2xl w-full mx-auto px-4">
      <CommandExplorer entries={allEntries} />
    </div>
  );
}
