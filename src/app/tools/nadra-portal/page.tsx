"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowUpRight, 
  Globe2, 
  Calculator, 
  HelpCircle, 
  Share2, 
  Check, 
  AlertCircle, 
  Smartphone, 
  QrCode, 
  Download, 
  RefreshCw,
  Building,
  UserCheck,
  Baby,
  Users,
  HeartHandshake,
  Compass,
  FileBadge,
  Sparkles
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  category: "CNIC & NICOP" | "Family & Civil Registration" | "Verification & Biometrics" | "Fee & Tracking" | "SMS Helpline Services";
  description: string;
  officialUrl: string;
  turnaround: string;
  requirements: string;
  normalFee: string;
  urgentFee: string;
  executiveFee: string;
  isPopular?: boolean;
}

const NADRA_SERVICES: ServiceItem[] = [
  // 1. CNIC & NICOP
  {
    id: "cnic-new",
    title: "New Smart National Identity Card (SNIC)",
    category: "CNIC & NICOP",
    description: "Issuance of first-time chip-based Smart CNIC upon reaching 18 years of age.",
    officialUrl: "https://id.nadra.gov.pk/",
    turnaround: "Normal: 30 Days | Urgent: 15 Days | Executive: 7 Days",
    requirements: "Original Birth Certificate or Matric Sanad + Father/Mother/Blood Relative CNIC for Biometric verification.",
    normalFee: "Rs. 750",
    urgentFee: "Rs. 1,500",
    executiveFee: "Rs. 2,500",
    isPopular: true
  },
  {
    id: "cnic-renew",
    title: "CNIC / SNIC Renewal (Online & Center)",
    category: "CNIC & NICOP",
    description: "Renewal of expired Pakistani National Identity Card with updated photo and biometrics.",
    officialUrl: "https://id.nadra.gov.pk/",
    turnaround: "Normal: 25 Days | Urgent: 12 Days | Executive: 5 Days",
    requirements: "Old CNIC original copy. Can be renewed up to 6 months before expiry online.",
    normalFee: "Rs. 750",
    urgentFee: "Rs. 1,500",
    executiveFee: "Rs. 2,500",
    isPopular: true
  },
  {
    id: "cnic-modify",
    title: "CNIC Modification / Marital Status Update",
    category: "CNIC & NICOP",
    description: "Change of Name, Address, Marital Status (Marriage/Divorce), or Father/Husband details.",
    officialUrl: "https://id.nadra.gov.pk/",
    turnaround: "Normal: 30 Days | Urgent: 15 Days | Executive: 7 Days",
    requirements: "Nikahnama / Marriage Certificate (for female marital update), Gazetted Notification (for Name change).",
    normalFee: "Rs. 750",
    urgentFee: "Rs. 1,500",
    executiveFee: "Rs. 2,500",
    isPopular: true
  },
  {
    id: "nicop-overseas",
    title: "National Identity Card for Overseas Pakistanis (NICOP)",
    category: "CNIC & NICOP",
    description: "Identity card for Overseas Pakistanis granting visa-free entry and full citizen rights.",
    officialUrl: "https://id.nadra.gov.pk/",
    turnaround: "Zone A: 7-15 Days | Zone B: 10-20 Days",
    requirements: "Valid Pakistani Passport / Foreign Passport, Work Visa/Permit, Parent/Relative CNIC.",
    normalFee: "$20 - $39",
    urgentFee: "$30 - $51",
    executiveFee: "$45 - $75",
    isPopular: true
  },
  {
    id: "poc-card",
    title: "Pakistan Origin Card (POC)",
    category: "CNIC & NICOP",
    description: "Eligible for foreign nationals married to Pakistani citizens or former Pakistani nationals.",
    officialUrl: "https://id.nadra.gov.pk/",
    turnaround: "3 to 4 Weeks Delivery Worldwide",
    requirements: "Proof of Pakistani Origin / Marriage Certificate verified by Ministry of Foreign Affairs (MOFA).",
    normalFee: "$100",
    urgentFee: "$150",
    executiveFee: "$200"
  },

  // 2. Family & Civil Registration
  {
    id: "frc-cert",
    title: "Family Registration Certificate (FRC)",
    category: "Family & Civil Registration",
    description: "Official certificate showing family tree structure by Birth, by Marriage, or by Adoption.",
    officialUrl: "https://id.nadra.gov.pk/",
    turnaround: "Instant Online Download (PDF in 15-30 Mins)",
    requirements: "CNIC numbers of Parents, Siblings (for By Birth), or Spouse & Children (for By Marriage).",
    normalFee: "Rs. 1,000",
    urgentFee: "Rs. 1,000",
    executiveFee: "Rs. 1,000",
    isPopular: true
  },
  {
    id: "b-form",
    title: "Child Registration Certificate (CRC / B-Form)",
    category: "Family & Civil Registration",
    description: "Essential registration document for citizens under 18 years of age.",
    officialUrl: "https://www.nadra.gov.pk/identity/identity-crc/",
    turnaround: "Normal: 15 Days | Executive: 5 Days",
    requirements: "Union Council Computerized Birth Certificate + Both Parents CNIC presence/biometric.",
    normalFee: "Rs. 50",
    urgentFee: "Rs. 500",
    executiveFee: "Rs. 500",
    isPopular: true
  },
  {
    id: "cancellation-death",
    title: "CNIC Cancellation Due to Death",
    category: "Family & Civil Registration",
    description: "Official cancellation of deceased family member's CNIC to prevent identity fraud.",
    officialUrl: "https://www.nadra.gov.pk/identity/identity-cancellation/",
    turnaround: "Immediate Status Updated",
    requirements: "Union Council Death Certificate, Graveyard receipt, Original CNIC of deceased + Blood Relative.",
    normalFee: "Rs. 50",
    urgentFee: "Rs. 500",
    executiveFee: "Rs. 500"
  },

  // 3. Verification & Biometrics
  {
    id: "pak-id-mobile",
    title: "Pak ID Mobile App (Biometric & Photo from Home)",
    category: "Verification & Biometrics",
    description: "Apply, renew, and scan your fingerprints directly using your smartphone camera.",
    officialUrl: "https://play.google.com/store/apps/details?id=com.nadrapakid",
    turnaround: "24/7 Digital Self-Service",
    requirements: "Smartphone with rear camera (8MP+) for optical fingerprint scanning and live photo capture.",
    normalFee: "Same as Web Portal",
    urgentFee: "Same as Web Portal",
    executiveFee: "Same as Web Portal",
    isPopular: true
  },
  {
    id: "succ-cert",
    title: "Succession Certificate & Letter of Administration",
    category: "Verification & Biometrics",
    description: "Fast-track legal inheritance certificate for bank accounts, properties, and assets within 15 days.",
    officialUrl: "https://succ.nadra.gov.pk/",
    turnaround: "15 Days (Avoids long Court procedures)",
    requirements: "Death Certificate, FRC, Legal Heirs CNIC, List of Movable/Immovable Properties.",
    normalFee: "Rs. 10,000 (Property < 1 Lakh) / Rs. 20,000 (Above)",
    urgentFee: "Court Exemption",
    executiveFee: "Direct Verification",
    isPopular: true
  },
  {
    id: "biometric-verification",
    title: "SIM & Bank Biometric Verification Check",
    category: "Verification & Biometrics",
    description: "Check how many active telecom SIMs are registered against your CNIC across Jazz, Zong, Telenor, Ufone.",
    officialUrl: "https://cnic.sims.pk/",
    turnaround: "Instant Online Results",
    requirements: "13-Digit CNIC number without dashes.",
    normalFee: "100% Free",
    urgentFee: "Instant",
    executiveFee: "Instant",
    isPopular: true
  },

  // 4. Fee & Tracking
  {
    id: "tracking-portal",
    title: "NADRA Online Application Status Tracking",
    category: "Fee & Tracking",
    description: "Track your CNIC, Smart Card, FRC or NICOP printing and courier delivery stage live.",
    officialUrl: "https://id.nadra.gov.pk/e-id/tracking/",
    turnaround: "Live 24/7 Status Updates",
    requirements: "12-Digit Tracking ID or Form Application Number provided on NADRA receipt/email.",
    normalFee: "Free Tracking",
    urgentFee: "Free Tracking",
    executiveFee: "Free Tracking",
    isPopular: true
  },
  {
    id: "fee-calculator",
    title: "Official NADRA Digital Fee Schedule 2026",
    category: "Fee & Tracking",
    description: "Check official updated government fee rates for all CNIC, NICOP, FRC and SNIC categories.",
    officialUrl: "https://www.nadra.gov.pk/fee-structure/",
    turnaround: "Official Rates Gazette",
    requirements: "Payable via Credit/Debit Card, 1Link PSID, JazzCash, EasyPaisa, or NADRA e-Sahulat.",
    normalFee: "Verified Govt Rates",
    urgentFee: "Govt Authorized",
    executiveFee: "Zero Hidden Charges"
  }
];

// Official SMS Shortcodes
const SMS_SERVICES = [
  { code: "8300", title: "Vote & Polling Station Check", instruction: "Send your 13-digit CNIC without dashes to 8300 to find your registered voter constituency & polling station." },
  { code: "8500", title: "Sehat Sahulat Card Eligibility", instruction: "Send your CNIC to 8500 to check free health insurance coverage and empaneled hospitals under Universal Health." },
  { code: "8171", title: "BISP & Ehsaas 8171 Portal", instruction: "Send your CNIC to 8171 to check quarterly financial aid, Benazir Taleemi Wazaif, and Kafalat eligibility." },
  { code: "668", title: "SIM Verification Details", instruction: "Send your CNIC number to 668 to receive an SMS breakdown of all SIM cards registered under your identity." },
  { code: "8400", title: "NADRA Verification Service", instruction: "Official citizen verification and vehicle ownership verification shortcode." },
  { code: "7000", title: "Family Tree Verification (FRC)", instruction: "Send your CNIC to 7000 to verify registered family members before applying for FRC or passports." }
];

export default function NadraPortalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [calcCardType, setCalcCardType] = useState<"snic" | "nicop" | "frc" | "bform">("snic");
  const [calcDelivery, setCalcDelivery] = useState<"normal" | "urgent" | "executive">("normal");
  const [copiedLink, setCopiedLink] = useState(false);
  const [trackingInput, setTrackingInput] = useState("");

  const categories = [
    "All",
    "CNIC & NICOP",
    "Family & Civil Registration",
    "Verification & Biometrics",
    "Fee & Tracking",
    "SMS Helpline Services"
  ];

  const filteredServices = useMemo(() => {
    return NADRA_SERVICES.filter(service => {
      const matchesSearch = 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.requirements.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "All" || service.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "NADRA Identity Portal Pakistan - CNIC, FRC, NICOP & Verification",
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Fee calculation helper
  const calculateFee = () => {
    switch (calcCardType) {
      case "snic":
        if (calcDelivery === "normal") return { fee: "Rs. 750", days: "25 - 30 Working Days" };
        if (calcDelivery === "urgent") return { fee: "Rs. 1,500", days: "10 - 15 Working Days" };
        return { fee: "Rs. 2,500", days: "5 - 7 Working Days (Executive Center)" };
      case "nicop":
        if (calcDelivery === "normal") return { fee: "$39 (approx. Rs. 10,800)", days: "15 - 20 Days (Overseas)" };
        if (calcDelivery === "urgent") return { fee: "$51 (approx. Rs. 14,200)", days: "10 - 12 Days (Overseas)" };
        return { fee: "$75 (approx. Rs. 20,900)", days: "5 - 7 Days Fast Track" };
      case "frc":
        return { fee: "Rs. 1,000", days: "Instant PDF Download (15 to 30 Mins)" };
      case "bform":
        if (calcDelivery === "normal") return { fee: "Rs. 50", days: "15 Working Days" };
        return { fee: "Rs. 500", days: "5 Working Days (Executive)" };
    }
  };

  const calculated = calculateFee();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Breadcrumb & Action */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
            <span>/</span>
            <span className="text-emerald-400 font-bold">NADRA Identity Portal (Pakistan)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Copied Link!" : "Share Portal"}</span>
            </button>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
            >
              ← All Tools
            </Link>
          </div>
        </div>

        {/* Sharda-Style Hero Section with Live Search & Quick Action Buttons */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#0b241c] to-[#0f172a] border border-emerald-500/30 p-6 sm:p-10 shadow-2xl text-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Citizen Identity & Verification Hub Pakistan</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              NADRA Identity Portal 2026
            </h1>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              Direct access to official <strong className="text-emerald-300">CNIC Online, Smart Card, FRC, NICOP, B-Form, Pak ID App & Succession Certificates</strong> without agent commission.
            </p>

            {/* Live Search Box */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search CNIC Renewal, FRC, B-Form, NICOP, Succession, Fee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/90 border-2 border-emerald-500/40 rounded-full text-sm text-white placeholder-slate-400 shadow-xl focus:outline-none focus:border-emerald-400 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Sharda Result Style Quick Colorful Links */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <a
                href="https://id.nadra.gov.pk/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" /> Pak ID Online Portal
              </a>
              <a
                href="https://id.nadra.gov.pk/e-id/tracking/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" /> Track CNIC Application
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.nadrapakid"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-extrabold shadow-lg shadow-rose-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" /> Pak ID Mobile App
              </a>
              <a
                href="tel:1777"
                className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-extrabold transition flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Helpline: 1777
              </a>
            </div>
          </div>
        </div>

        {/* Live News & Updates Ticker */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 overflow-hidden flex items-center gap-3">
          <span className="flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> NADRA LIVE:
          </span>
          <div className="overflow-x-auto whitespace-nowrap flex items-center gap-4 text-xs font-medium text-slate-300 scrollbar-none py-1">
            <a href="https://id.nadra.gov.pk/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              ✅ <span>Online FRC download now available in 15 minutes worldwide</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href="https://play.google.com/store/apps/details?id=com.nadrapakid" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              📱 <span>Fingerprints biometric scan directly from mobile camera via Pak ID App</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href="https://succ.nadra.gov.pk/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              🏛️ <span>Succession Certificates issued within 15 days without court civil suit</span>
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">
              📞 <span>Dial <strong>1777</strong> from mobile or <strong>051-111-786-100</strong> from landline for official assistance</span>
            </span>
          </div>
        </div>

        {/* 1-Click Online Tracking Box */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0c1e19] to-slate-900 border border-emerald-500/30 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Live Application Tracker
              </span>
              <h3 className="text-lg font-bold text-white">
                Apna CNIC / FRC / NICOP Status Check Kryn
              </h3>
              <p className="text-xs text-slate-400">
                Enter your 12-Digit Tracking ID from your NADRA receipt to check printing & delivery status.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Enter 12-Digit Tracking ID..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
              />
              <a
                href={trackingInput ? `https://id.nadra.gov.pk/e-id/tracking/?tracking_id=${trackingInput}` : "https://id.nadra.gov.pk/e-id/tracking/"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap transition flex items-center gap-1"
              >
                <span>Track Now</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* 3-Column Service Grid (Sharda Result Structure) */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-emerald-400" />
                Featured NADRA Citizen Services (All Sectors)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Categorized by identity cards, family civil registration, and biometric checks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* COLUMN 1: CNIC & NICOP */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> CNIC, SNIC & NICOP
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Citizen ID</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-3">
                {NADRA_SERVICES.filter(s => s.category === "CNIC & NICOP").map((service) => (
                  <div key={service.id} className="pt-2 first:pt-0 group">
                    <a
                      href={service.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition flex items-start gap-1.5"
                    >
                      <span className="text-emerald-500 font-bold">➢</span>
                      <span>{service.title}</span>
                    </a>
                    <p className="text-[11px] text-slate-400 mt-1 pl-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-2 pl-4 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                        Normal: {service.normalFee}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                        Urgent: {service.urgentFee}
                      </span>
                      <a
                        href={service.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-emerald-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        Apply <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <a
                  href="https://id.nadra.gov.pk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1"
                >
                  Pak ID Portal for All Identity Cards ➜
                </a>
              </div>
            </div>

            {/* COLUMN 2: FAMILY & CIVIL REGISTRATION */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-teal-800 to-cyan-800 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" /> FRC & Family Certificates
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Family Tree</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-3">
                {NADRA_SERVICES.filter(s => s.category === "Family & Civil Registration").map((service) => (
                  <div key={service.id} className="pt-2 first:pt-0 group">
                    <a
                      href={service.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-200 group-hover:text-teal-400 transition flex items-start gap-1.5"
                    >
                      <span className="text-teal-500 font-bold">➢</span>
                      <span>{service.title}</span>
                    </a>
                    <p className="text-[11px] text-slate-400 mt-1 pl-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-2 pl-4 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 font-bold">
                        Fee: {service.normalFee}
                      </span>
                      <span className="text-slate-500">
                        {service.turnaround}
                      </span>
                      <a
                        href={service.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-teal-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        Details <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <a
                  href="https://id.nadra.gov.pk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center justify-center gap-1"
                >
                  Download FRC Certificate Online ➜
                </a>
              </div>
            </div>

            {/* COLUMN 3: BIOMETRIC & VERIFICATION */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-blue-800 to-indigo-800 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FingerprintIcon className="w-4 h-4" /> Biometrics & Verification
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Digital Check</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-3">
                {NADRA_SERVICES.filter(s => s.category === "Verification & Biometrics").map((service) => (
                  <div key={service.id} className="pt-2 first:pt-0 group">
                    <a
                      href={service.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition flex items-start gap-1.5"
                    >
                      <span className="text-blue-500 font-bold">➢</span>
                      <span>{service.title}</span>
                    </a>
                    <p className="text-[11px] text-slate-400 mt-1 pl-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-2 pl-4 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 font-bold">
                        {service.turnaround}
                      </span>
                      <a
                        href={service.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-blue-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        Open <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <a
                  href="https://cnic.sims.pk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1"
                >
                  Check Registered Telecom SIMs ➜
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Official NADRA Fee Calculator 2026 */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Official NADRA Fee & Delivery Calculator (2026 Updated)
              </h3>
              <p className="text-xs text-slate-400">
                Select category and delivery urgency to calculate the exact government fee.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Select Document / Card Type:</label>
              <select
                value={calcCardType}
                onChange={(e) => setCalcCardType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="snic">Smart National Identity Card (SNIC)</option>
                <option value="nicop">National Identity Card for Overseas (NICOP)</option>
                <option value="frc">Family Registration Certificate (FRC)</option>
                <option value="bform">Child Registration Certificate (B-Form)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Processing Speed / Delivery:</label>
              <select
                value={calcDelivery}
                onChange={(e) => setCalcDelivery(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="normal">Normal Processing</option>
                <option value="urgent">Urgent Processing</option>
                <option value="executive">Executive Center Fast-Track</option>
              </select>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[11px] text-emerald-400 font-bold uppercase">Estimated Govt Fee:</span>
              <span className="text-2xl font-black text-white">{calculated.fee}</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Timeline: {calculated.days}</span>
            </div>
          </div>
        </div>

        {/* 6 Essential Pakistan Government SMS Shortcodes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Verified Pakistan Government & NADRA SMS Codes (No Internet Needed)
            </h3>
            <span className="text-xs text-slate-500">Official Shortcodes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SMS_SERVICES.map((sms) => (
              <div
                key={sms.code}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">{sms.title}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold">
                    SMS: {sms.code}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {sms.instruction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Master Directory Table of All NADRA Services */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-emerald-400" />
                Complete NADRA Services Directory
              </h3>
              <p className="text-xs text-slate-400">
                Official fee breakdown, turnaround days and direct apply links.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="py-3 px-3">Service Name</th>
                  <th className="py-3 px-3 min-w-[130px]">Category</th>
                  <th className="py-3 px-3 min-w-[160px]">Key Requirements</th>
                  <th className="py-3 px-3 min-w-[90px]">Normal Fee</th>
                  <th className="py-3 px-3 min-w-[90px]">Urgent Fee</th>
                  <th className="py-3 px-3 min-w-[120px]">Timeline</th>
                  <th className="py-3 px-3 text-right">Official Apply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500">
                      No services match your search term.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-800/40 transition group">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {service.isPopular && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/30">
                              POPULAR
                            </span>
                          )}
                          <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition">
                            {service.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {service.description}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                          {service.category}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {service.requirements}
                      </td>

                      <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                        {service.normalFee}
                      </td>

                      <td className="py-3 px-3 font-mono text-amber-300 font-bold">
                        {service.urgentFee}
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {service.turnaround}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <a
                          href={service.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition transform hover:scale-105"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Citizen Safety & Guidance Warning */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-300">
              Important Citizen Alert: Beware of Fake Agents & Websites
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Always ensure the URL ends with <strong className="text-white">.nadra.gov.pk</strong>. Never share your OTP, credit card CVV, or original biometric data with unauthorized Facebook pages or third-party WhatsApp numbers. All online payments are officially routed via 1Link, Debit/Credit Card or official e-Sahulat franchises.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Fingerprint Icon Component
function FingerprintIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" />
      <path d="M2 16h.01" />
      <path d="M21.8 16c.2-2 .131-5.354 0-6" />
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
      <path d="M8.65 22c.21-.66.45-1.32.57-2" />
      <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
    </svg>
  );
}
