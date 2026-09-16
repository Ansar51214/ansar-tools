// ANSAR TOOLS — OFFICIAL COLOR SYSTEM & DESIGN TOKENS
//
// Primary Brand (trust/official): Navy Blue gradient
//   - Hero/brand gradient: #09396F -> #4088AD
//   - Use for: main brand elements, headers, primary buttons, links
// Accent (CTA/highlight only, do not overuse): Orange
//   - Tailwind: orange-400 to orange-500
//   - Use for: call-to-action buttons, highlighted text, badges
// Dark tool background (standard, use everywhere a tool needs dark theme):
//   - Tailwind: bg-slate-950
// Light tool background (standard, use everywhere a tool needs light theme):
//   - Tailwind: bg-slate-50 or bg-white
// Do NOT introduce new custom hex colors for page backgrounds. Always use
// one of the two standard tones above.
// Avoid red as a primary/brand color anywhere except genuine error states,
// delete buttons, or destructive action warnings — red already carries a
// "danger/error" meaning in this app's UI and should stay reserved for that.
//
// Cultural theme exception:
//   - /tools/wedding-cards uses a dedicated cultural maroon (#3b0813) theme,
//     which is an intentional domain-specific exception.

export const THEME_TOKENS = {
  brand: {
    primaryNavy: '#09396F',
    primaryLight: '#4088AD',
    gradient: 'from-[#09396F] to-[#4088AD]',
    gradientStyle: 'linear-gradient(135deg, #09396F 20%, #4088AD 95%)',
  },
  accent: {
    orange400: '#fb923c',
    orange500: '#f97316',
    hover: 'hover:bg-orange-600',
  },
  backgrounds: {
    darkTool: 'bg-slate-950',
    darkCard: 'bg-slate-900',
    darkCardBorder: 'border-slate-800',
    lightTool: 'bg-slate-50',
    lightCard: 'bg-white',
    lightCardBorder: 'border-slate-200',
  },
  status: {
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    error: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  }
} as const;
