import Link from "next/link";
import { ReactNode } from "react";

export interface ToolItem {
  id: string;
  title: string;
  category: string;
  icon: ReactNode;
  badge?: string;
}

interface ToolCardProps {
  tool: ToolItem;
}

export default function ToolCard({ tool }: ToolCardProps) {
  // Determine badge color based on text
  const getBadgeColor = (badge: string) => {
    if (badge.toUpperCase() === "HOT") return "bg-red-500";
    if (badge.toUpperCase() === "NEW") return "bg-blue-500";
    if (badge.toUpperCase().includes("FREE")) return "bg-green-500";
    return "bg-red-500";
  };

  return (
    <Link href={`/tools/${tool.id}`} className="group relative h-36">
      <div className="absolute inset-0 bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.15)] hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center z-10 hover:z-20">
        {tool.badge && (
          <span className={`absolute top-0 right-0 ${getBadgeColor(tool.badge)} text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-xl rounded-tr-xl shadow-sm z-30`}>
            {tool.badge}
          </span>
        )}
        <div className="w-14 h-14 mb-3 flex items-center justify-center text-blue-600 transition-transform duration-300">
          {tool.icon}
        </div>
        <h3 className="font-bold text-sm text-slate-800 leading-tight">
          {tool.title}
        </h3>
      </div>
    </Link>
  );
}
