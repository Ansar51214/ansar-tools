'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Share2, Check } from 'lucide-react';
import { THEME_TOKENS } from '@/lib/theme';

interface ToolPageHeaderProps {
  toolName: string;
  onShare?: () => void;
}

export default function ToolPageHeader({ toolName, onShare }: ToolPageHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    if (onShare) {
      onShare();
    } else if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: `${toolName} - Ansar Tools`,
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center justify-between border-b ${THEME_TOKENS.backgrounds.darkCardBorder} pb-4`}>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <span>/</span>
        <span className="text-amber-400 font-bold">{toolName}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleShareClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? "Link Copied!" : "Share Portal"}</span>
        </button>

        <Link
          href="/"
          className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
        >
          ← All Tools
        </Link>
      </div>
    </div>
  );
}
