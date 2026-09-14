import { ReactNode } from "react";
import ToolCard, { ToolItem } from "./ToolCard";

interface ToolGridProps {
  title: string;
  icon: ReactNode;
  tools: ToolItem[];
}

export default function ToolGrid({ title, icon, tools }: ToolGridProps) {
  if (tools.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <div className="text-red-500">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
