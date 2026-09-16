"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  ExternalLink, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  FolderDown, 
  CheckCircle2, 
  Maximize2
} from "lucide-react";

export default function ContentCalendarPage() {
  const [copied, setCopied] = useState(false);

  // User's specific Content Calendar Sheet
  const SHEET_ID = "1f4oVE2t1fdo-dV3XxbJj9A2-XZHRCQN4_J_MoTtYAZ0";
  const DIRECT_VIEW_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?usp=sharing`;
  const COPY_DRIVE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/copy`;
  const EMBED_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/htmlembed?widget=true&headers=true`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(DIRECT_VIEW_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/20 text-white">
              <CalendarIcon className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                Content Calendar Sheet
                <span className="text-[11px] uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Live Synced
                </span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Manage your social media content, posting dates, channels, and SEO checklist in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link 
              href="/"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
            >
              ← Back to Tools
            </Link>
          </div>
        </div>

        {/* Action Card: Google Drive Save & Direct Sheet Access */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Drive Sheet</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Apna Content Calendar Direct Google Drive Main Save Ya Edit Kryn
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">
                Neechy aapki original sheet ka live viewer open hai. Isko apni Google Drive me copy karne ya browser me kholne k lye buttons use kryn:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <a
                href={COPY_DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
              >
                <FolderDown className="w-4 h-4" />
                <span>Save Copy in My Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a
                href={DIRECT_VIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>Open in Google Sheets</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition"
                title="Copy Sheet URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instagram, YouTube, LinkedIn, WhatsApp & LMS Checklist Included
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Free & Live Synced
              </span>
            </div>
          </div>
        </div>

        {/* Live Embedded Google Sheet */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Live Spreadsheet View</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={DIRECT_VIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                <span>Full Screen</span>
                <Maximize2 className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="w-full bg-white rounded-b-2xl overflow-hidden" style={{ height: "75vh", minHeight: "600px" }}>
            <iframe
              src={EMBED_URL}
              className="w-full h-full border-0"
              title="Content Calendar Spreadsheet"
              allowFullScreen
            />
          </div>
        </div>

      </div>
      </main>
      <Footer />
    </div>
  );
}
