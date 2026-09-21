'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, BookOpen, Info } from 'lucide-react';

export interface ToolStep {
  title: string;
  description: string;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolGuideSectionProps {
  toolName: string;
  theme?: 'light' | 'dark' | 'maroon';
  about: string;
  howToUseTitle?: string;
  steps: ToolStep[];
  faqs: ToolFAQ[];
}

export default function ToolGuideSection({
  toolName,
  theme = 'light',
  about,
  howToUseTitle,
  steps,
  faqs,
}: ToolGuideSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isDark = theme === 'dark';
  const isMaroon = theme === 'maroon';

  // Build JSON-LD schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Styling tokens based on theme
  const containerClasses = isMaroon
    ? 'bg-[#2a060e] text-rose-100 border-rose-900/40'
    : isDark
    ? 'bg-slate-900/60 text-slate-200 border-slate-800'
    : 'bg-white text-slate-800 border-slate-200';

  const cardClasses = isMaroon
    ? 'bg-[#3b0813] border-rose-900/60'
    : isDark
    ? 'bg-slate-900 border-slate-800'
    : 'bg-slate-50/70 border-slate-200/80';

  const headingClasses = isMaroon
    ? 'text-amber-200'
    : isDark
    ? 'text-white'
    : 'text-slate-900';

  const subtextClasses = isMaroon
    ? 'text-rose-200/80'
    : isDark
    ? 'text-slate-400'
    : 'text-slate-600';

  const badgeClasses = isMaroon
    ? 'bg-rose-950 text-amber-300 border-amber-500/30'
    : isDark
    ? 'bg-blue-950/80 text-blue-400 border-blue-500/30'
    : 'bg-blue-50 text-blue-600 border-blue-200';

  return (
    <section className="w-full max-w-5xl mx-auto mt-16 mb-12 px-4 sm:px-6 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* About Section */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${containerClasses}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${badgeClasses}`}>
            <Info className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-bold opacity-70">Overview</span>
            <h2 className={`text-xl sm:text-2xl font-bold ${headingClasses}`}>
              About the {toolName}
            </h2>
          </div>
        </div>
        <p className={`text-base sm:text-lg leading-relaxed ${subtextClasses}`}>
          {about}
        </p>
      </div>

      {/* How to Use Section */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${containerClasses}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${badgeClasses}`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-bold opacity-70">Step-by-Step Guide</span>
            <h2 className={`text-xl sm:text-2xl font-bold ${headingClasses}`}>
              {howToUseTitle || `How to use the ${toolName}`}
            </h2>
          </div>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, idx) => (
            <li
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border flex gap-4 items-start ${cardClasses}`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center border ${badgeClasses}`}
              >
                {idx + 1}
              </span>
              <div className="space-y-1">
                <h3 className={`font-semibold text-sm sm:text-base ${headingClasses}`}>
                  {step.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${subtextClasses}`}>
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* FAQ Section */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${containerClasses}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${badgeClasses}`}>
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-bold opacity-70">FAQ</span>
            <h2 className={`text-xl sm:text-2xl font-bold ${headingClasses}`}>
              Frequently Asked Questions
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${cardClasses}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 focus:outline-none"
                >
                  <span className={`font-semibold text-sm sm:text-base ${headingClasses}`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-blue-500' : 'text-slate-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-inherit">
                    <p className={`text-xs sm:text-sm leading-relaxed ${subtextClasses}`}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
