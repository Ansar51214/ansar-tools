'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Share2, Check } from 'lucide-react';
import { THEME_TOKENS } from '@/lib/theme';

interface ToolPageHeaderProps {
  toolName: string;
  onShare?: () => void;
  theme?: 'light' | 'dark';
}

export default function ToolPageHeader({
  toolName,
  onShare,
  theme = 'dark'
}: ToolPageHeaderProps) {
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

  const isLight = theme === 'light';

  return (
    <div
      className={`flex items-center justify-between border-b ${
        isLight ? 'border-slate-200' : THEME_TOKENS.backgrounds.darkCardBorder
      } pb-4`}
    >
      {/* Breadcrumb Navigation */}
      <div
        className={`flex items-center gap-2 text-xs font-semibold ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}
      >
        <Link
          href="/"
          className={
            isLight
              ? 'hover:text-blue-600 transition'
              : 'hover:text-amber-400 transition'
          }
        >
          Home
        </Link>
        <span>/</span>
        <span
          className={
            isLight
              ? 'text-blue-600 font-bold'
              : 'text-amber-400 font-bold'
          }
        >
          {toolName}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleShareClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {copied ? (
            <Check
              className={`w-3.5 h-3.5 ${
                isLight ? 'text-blue-600' : 'text-amber-400'
              }`}
            />
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
          <span>{copied ? 'Link Copied!' : 'Share Portal'}</span>
        </button>

        <Link
          href="/"
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            isLight
              ? 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200'
              : 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30'
          }`}
        >
          ← All Tools
        </Link>
      </div>
    </div>
  );
}
