"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Plane,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  Building2,
  Share2,
  Check,
  Compass,
  FileBadge
} from "lucide-react";

interface VisaCountry {
  id: string;
  country: string;
  flag: string;
  region: "Middle East & Gulf" | "Europe & UK" | "North America & Oceania" | "Asia & Far East" | "Africa & Central Asia";
  visaType: "E-Visa (Online)" | "Sticker Visa (Embassy / VFS)" | "Visa on Arrival" | "Visa Free";
  processingTime: string;
  officialFee: string;
  bankStatement: string;
  officialPortalUrl: string;
  appointmentPortal: string;
  requiredDocuments: string[];
  keyNotes: string;
  isPopular?: boolean;
}

const VISA_DATA: VisaCountry[] = [
  // 1. Middle East & Gulf
  {
    id: "uae-dubai",
    country: "United Arab Emirates (Dubai / Abu Dhabi)",
    flag: "🇦🇪",
    region: "Middle East & Gulf",
    visaType: "E-Visa (Online)",
    processingTime: "24 to 72 Hours",
    officialFee: "30 Days: ~Rs. 25,000 | 60 Days: ~Rs. 45,000",
    bankStatement: "Not strictly required for tourist e-visa via airlines (Emirates / FlyDubai)",
    officialPortalUrl: "https://smartservices.icp.gov.pk/",
    appointmentPortal: "GDRFA Dubai / ICP Smart Services",
    requiredDocuments: ["Passport valid for 6+ months", "White background digital photo", "Confirmed return flight ticket", "Hotel booking"],
    keyNotes: "Apply directly via official ICP portal, Emirates/FlyDubai or licensed tour operators. Overstay fines are strictly enforced (AED 50/day).",
    isPopular: true
  },
  {
    id: "saudi-arabia",
    country: "Saudi Arabia (Umrah / Tourist / Transit)",
    flag: "🇸🇦",
    region: "Middle East & Gulf",
    visaType: "E-Visa (Online)",
    processingTime: "Instant to 48 Hours",
    officialFee: "Umrah / Tourist E-Visa: ~SAR 300 - 450 (Includes Medical Insurance)",
    bankStatement: "Not required for Nusuk / Tourist with valid US/UK/Schengen visa",
    officialPortalUrl: "https://visa.mofa.gov.sa/",
    appointmentPortal: "Nusuk App / Tasheer Visa Service Centers",
    requiredDocuments: ["Passport scan", "Digital photograph", "Valid email & debit/credit card for fee payment"],
    keyNotes: "Pakistani citizens with valid used US, UK, or Schengen visa can get Instant Tourist E-Visa on Arrival or via Nusuk portal.",
    isPopular: true
  },
  {
    id: "qatar",
    country: "Qatar (Hayya Platform)",
    flag: "🇶🇦",
    region: "Middle East & Gulf",
    visaType: "Visa on Arrival",
    processingTime: "Instant on Arrival (Hayya Entry)",
    officialFee: "Free (Entry Permit via Discover Qatar hotel booking)",
    bankStatement: "Credit/Debit Card with min QAR 5,000 or Cash equivalent",
    officialPortalUrl: "https://hayya.qa/",
    appointmentPortal: "Hayya Online Portal",
    requiredDocuments: ["Passport valid for 6 months", "Confirmed return flight with Qatar Airways or other airline", "Mandatory Discover Qatar hotel booking"],
    keyNotes: "Must book hotel strictly through Discover Qatar official portal for the entire stay.",
    isPopular: true
  },
  {
    id: "oman",
    country: "Oman (Royal Oman Police E-Visa)",
    flag: "🇴🇲",
    region: "Middle East & Gulf",
    visaType: "E-Visa (Online)",
    processingTime: "2 to 4 Working Days",
    officialFee: "10 Days: OMR 5 | 30 Days: OMR 20",
    bankStatement: "Not required for standard e-visa",
    officialPortalUrl: "https://evisa.rop.gov.om/",
    appointmentPortal: "Royal Oman Police (ROP) Portal",
    requiredDocuments: ["Passport copy", "Passport photo", "Return ticket", "Hotel reservation"],
    keyNotes: "Apply under 26B unsponsored tourist visa if holding GCC residency, or through licensed Oman agencies.",
    isPopular: true
  },

  // 2. Europe & UK
  {
    id: "united-kingdom",
    country: "United Kingdom (Standard Visitor Visa)",
    flag: "🇬🇧",
    region: "Europe & UK",
    visaType: "Sticker Visa (Embassy / VFS)",
    processingTime: "3 to 6 Weeks (Priority: 5 Working Days)",
    officialFee: "6 Months: £115 (approx. Rs. 42,000)",
    bankStatement: "Last 6 Months verified statement showing min Rs. 1.8M - 2.5M closing balance",
    officialPortalUrl: "https://www.gov.uk/standard-visitor",
    appointmentPortal: "VFS Global Pakistan (Islamabad, Lahore, Karachi, Mirpur)",
    requiredDocuments: ["Valid Passport", "6-Month Bank Statement + Account Maintenance Certificate", "FBR Tax Returns (2-3 Years)", "Employment / Business letter", "FRC from NADRA", "Travel Itinerary"],
    keyNotes: "Fill form on GOV.UK, pay IHS/fee online, then book biometric appointment at VFS Global in Pakistan.",
    isPopular: true
  },
  {
    id: "schengen-europe",
    country: "Schengen States (Germany, France, Italy, Spain, Netherlands)",
    flag: "🇪🇺",
    region: "Europe & UK",
    visaType: "Sticker Visa (Embassy / VFS)",
    processingTime: "15 to 45 Calendar Days",
    officialFee: "Adult: €90 (approx. Rs. 28,000) + VFS service fee",
    bankStatement: "Last 6 Months bank statement with minimum balance of Rs. 2M - 3M",
    officialPortalUrl: "https://visa.vfsglobal.com/pak/en/deu/",
    appointmentPortal: "VFS Global / Gerry's / BLS Spain / TLScontact",
    requiredDocuments: ["Duly filled Schengen Application Form", "Travel Health Insurance covering min €30,000", "Confirmed Flight Reservation & Hotel Bookings", "FBR Active Taxpayer (ATL) NTN + Returns", "NADRA FRC (Family Tree)", "Leave letter from Employer / Business registration"],
    keyNotes: "Apply to the embassy of the country where you will spend the longest duration or enter first.",
    isPopular: true
  },
  {
    id: "turkiye",
    country: "Türkiye (Turkey Tourist Sticker / E-Visa)",
    flag: "🇹🇷",
    region: "Europe & UK",
    visaType: "Sticker Visa (Embassy / VFS)",
    processingTime: "10 to 15 Working Days",
    officialFee: "Sticker Visa: ~Rs. 45,000 (Includes Anatolia Gerry's fee & insurance)",
    bankStatement: "Last 3 Months Bank Statement with min Rs. 1.5M balance",
    officialPortalUrl: "https://www.evisa.gov.tr/",
    appointmentPortal: "Anatolia Travel Services Pakistan",
    requiredDocuments: ["Original Passport", "Biometric Photos (5x5 cm)", "Police Character Certificate", "FBR NTN & Tax Returns", "Flight & Hotel vouchers", "NADRA FRC / MRC"],
    keyNotes: "Pakistani citizens with valid US, UK, Ireland, or Schengen sticker visa can get INSTANT online E-Visa at evisa.gov.tr for $43.",
    isPopular: true
  },

  // 3. Asia & Far East
  {
    id: "malaysia",
    country: "Malaysia (eVisa Platform)",
    flag: "🇲🇾",
    region: "Asia & Far East",
    visaType: "E-Visa (Online)",
    processingTime: "48 to 72 Hours",
    officialFee: "Single Entry (30 Days): ~Rs. 8,500 - 10,000",
    bankStatement: "Last 3 Months statement showing min Rs. 350,000 - 500,000 balance",
    officialPortalUrl: "https://malaysiavisa.imi.gov.my/",
    appointmentPortal: "Official eVisa Malaysia Portal",
    requiredDocuments: ["Passport bio-data page", "Passport photo (studio specs)", "Return flight ticket", "Hotel reservation voucher", "Account Maintenance Certificate"],
    keyNotes: "100% online application without visiting any drop box. Digital eVisa is emailed directly.",
    isPopular: true
  },
  {
    id: "thailand",
    country: "Thailand (Tourist Sticker / E-Visa)",
    flag: "🇹🇭",
    region: "Asia & Far East",
    visaType: "Sticker Visa (Embassy / VFS)",
    processingTime: "5 to 7 Working Days",
    officialFee: "Single Entry: ~Rs. 13,000 + Gerry's / VFS fee",
    bankStatement: "Last 6 Months Bank Statement with min Rs. 300,000 closing balance",
    officialPortalUrl: "https://thaievisa.go.th/",
    appointmentPortal: "Gerry's Visa Drop Box Pakistan",
    requiredDocuments: ["Passport valid 6 months", "3 photos (3.5 x 4.5 cm white bg)", "Bank Statement + Bank letter", "Confirmed return air ticket", "Hotel booking"],
    keyNotes: "Submit at Gerry's Visa drop box in Islamabad, Lahore, Karachi or apply online via Thai E-Visa portal.",
    isPopular: true
  },
  {
    id: "singapore",
    country: "Singapore (E-Visa via Authorized Partner)",
    flag: "🇸🇬",
    region: "Asia & Far East",
    visaType: "E-Visa (Online)",
    processingTime: "3 to 5 Working Days",
    officialFee: "SGD 30 (approx. Rs. 6,500) + Agency processing fee",
    bankStatement: "Last 6 Months statement with min Rs. 800,000 balance",
    officialPortalUrl: "https://www.ica.gov.sg/",
    appointmentPortal: "Gerry's / Authorized Singapore Visa Agents",
    requiredDocuments: ["Form 14A duly signed", "Passport scan", "Photographs", "Bank statement & FRC", "Employment letter"],
    keyNotes: "Applications for Pakistani passport holders are submitted online via authorized partners or local Singapore sponsors.",
    isPopular: true
  },
  {
    id: "azerbaijan",
    country: "Azerbaijan (ASAN E-Visa)",
    flag: "🇦🇿",
    region: "Asia & Far East",
    visaType: "E-Visa (Online)",
    processingTime: "Standard: 3 Working Days | Urgent: 3 Hours",
    officialFee: "Standard: $26 (approx. Rs. 7,300) | Urgent: $60",
    bankStatement: "No bank statement required",
    officialPortalUrl: "https://evisa.gov.az/",
    appointmentPortal: "ASAN Visa Official Portal",
    requiredDocuments: ["Passport front bio-data page scan (Clear color copy)", "Email address & Credit Card for payment"],
    keyNotes: "One of the easiest e-visas for Pakistanis. 30 days single entry issued 100% online.",
    isPopular: true
  },

  // 4. North America & Oceania
  {
    id: "united-states",
    country: "United States (B1 / B2 Tourist & Business Visa)",
    flag: "🇺🇸",
    region: "North America & Oceania",
    visaType: "Sticker Visa (Embassy / VFS)",
    processingTime: "Interview appointment based (Visa issued 3-5 days after approval)",
    officialFee: "B1/B2 Fee: $185 (MRV Fee approx. Rs. 51,800)",
    bankStatement: "Strong 6-month financial evidence proving business, salary & family ties to Pakistan",
    officialPortalUrl: "https://ceac.state.gov/genniv/",
    appointmentPortal: "ustraveldocs.com / US Embassy Islamabad & Consulate Karachi",
    requiredDocuments: ["DS-160 Confirmation Barcode Page", "Valid Passport", "MRV Fee Receipt", "Appointment Confirmation Letter", "Tax Returns, Property docs, Employment & Family proof"],
    keyNotes: "Fill DS-160 form, pay fee via Habib Bank Limited (HBL) branches, and schedule in-person consular interview.",
    isPopular: true
  },
  {
    id: "canada",
    country: "Canada (Visitor Visa / Temporary Resident Visa TRV)",
    flag: "🇨🇦",
    region: "North America & Oceania",
    visaType: "Sticker Visa (Embassy / VFS)",
    processingTime: "4 to 8 Weeks",
    officialFee: "Visa Fee: CAD 100 + Biometrics Fee: CAD 85 (approx. Rs. 38,000)",
    bankStatement: "Last 6 Months bank statement with min Rs. 2.5M - 3.5M balance",
    officialPortalUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
    appointmentPortal: "IRCC Portal / VFS Global Biometrics",
    requiredDocuments: ["Digital application on IRCC portal", "Proof of financial support", "Travel history", "Purpose of travel & detailed cover letter", "NADRA FRC and ties to home country"],
    keyNotes: "100% paperless online application on the IRCC portal. Biometrics given at VFS Global Pakistan upon instruction letter.",
    isPopular: true
  },
  {
    id: "australia",
    country: "Australia (Visitor Visa Subclass 600)",
    flag: "🇦🇺",
    region: "North America & Oceania",
    visaType: "E-Visa (Online)",
    processingTime: "3 to 5 Weeks",
    officialFee: "AUD 192 (approx. Rs. 35,000)",
    bankStatement: "Last 6 Months statement with min Rs. 2M - 3M balance",
    officialPortalUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600",
    appointmentPortal: "ImmiAccount Online Portal + VFS Biometrics",
    requiredDocuments: ["ImmiAccount online submission", "Income Tax Returns", "Employment Letter & Pay slips", "NADRA FRC", "Detailed itinerary & accommodation proof"],
    keyNotes: "Paperless digital visa (label-free). Linked directly to your passport number in Australian immigration systems."
  }
];

export default function InternationalVisaGuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedVisaType, setSelectedVisaType] = useState<string>("All");
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedCountryDetails, setSelectedCountryDetails] = useState<VisaCountry | null>(null);

  const regions = [
    "All",
    "Middle East & Gulf",
    "Europe & UK",
    "Asia & Far East",
    "North America & Oceania"
  ];

  const filteredCountries = useMemo(() => {
    return VISA_DATA.filter(item => {
      const matchesSearch = 
        item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.visaType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.officialFee.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === "All" || item.region === selectedRegion;
      const matchesType = selectedVisaType === "All" || item.visaType === selectedVisaType;

      return matchesSearch && matchesRegion && matchesType;
    });
  }, [searchQuery, selectedRegion, selectedVisaType]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "International Visa Guides for Pakistani Citizens 2026",
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Grouped for 3-Column Boxes
  const gulfVisas = VISA_DATA.filter(v => v.region === "Middle East & Gulf");
  const europeVisas = VISA_DATA.filter(v => v.region === "Europe & UK");
  const asiaVisas = VISA_DATA.filter(v => v.region === "Asia & Far East");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Breadcrumb & Action */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-blue-400 transition">Home</Link>
            <span>/</span>
            <span className="text-blue-400 font-bold">International Visa Guides (Pakistani Passport)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Share Guide"}</span>
            </button>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition"
            >
              ← All Tools
            </Link>
          </div>
        </div>

        {/* Hero Section with Live Search & Quick Action Buttons */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0284c7] border border-blue-500/30 p-6 sm:p-10 shadow-2xl text-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>100% Verified Official Embassy & E-Visa Portals for Pakistanis</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              International Visa Guides 2026
            </h1>

            <p className="text-slate-200 text-xs sm:text-base leading-relaxed">
              Complete step-by-step guidance for <strong className="text-cyan-300">Dubai, Saudi Arabia, UK, Schengen, USA, Canada, Malaysia, Turkiye & Thailand</strong> with direct official links, genuine bank statement rules & fee schedules.
            </p>

            {/* Live Search Box */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search country (Dubai, UK, Schengen, USA, Malaysia, Turkey...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/90 border-2 border-blue-400/40 rounded-full text-sm text-white placeholder-slate-400 shadow-xl focus:outline-none focus:border-cyan-400 transition"
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

            {/* Quick Colorful Links */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <a
                href="https://smartservices.icp.gov.pk/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                🇦🇪 Dubai ICP Portal
              </a>
              <a
                href="https://visa.mofa.gov.sa/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-extrabold shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                🇸🇦 Saudi MOFA Visa
              </a>
              <a
                href="https://www.gov.uk/standard-visitor"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                🇬🇧 UK Visitor Visa
              </a>
              <a
                href="https://ceac.state.gov/genniv/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-extrabold transition flex items-center gap-1.5"
              >
                🇺🇸 US DS-160 Portal
              </a>
            </div>
          </div>
        </div>

        {/* Live News Ticker */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 overflow-hidden flex items-center gap-3">
          <span className="flex items-center gap-1 bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> VISA ALERTS:
          </span>
          <div className="overflow-x-auto whitespace-nowrap flex items-center gap-4 text-xs font-medium text-slate-300 scrollbar-none py-1">
            <a href="https://evisa.rop.gov.om/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-center gap-1">
              🇴🇲 <span>Oman unsponsored tourist e-visa open for eligible travelers</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href="https://www.evisa.gov.tr/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-center gap-1">
              🇹🇷 <span>Pakistanis with valid US/UK/Schengen visa can get instant Türkiye E-Visa ($43)</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href="https://malaysiavisa.imi.gov.my/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-center gap-1">
              🇲🇾 <span>Malaysia single entry 30-day eVisa processed within 48 hours</span>
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">
              ✈️ <span>Never purchase fake dummy tickets — always use verifiable airline reservation codes (PNR)</span>
            </span>
          </div>
        </div>

        {/* 3-Column Box Grid */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-blue-400" />
                Popular Destinations for Pakistani Travelers
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Organized by Gulf e-visas, European sticker visas, and Asian tourism hubs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* COLUMN 1: GULF & MIDDLE EAST */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Plane className="w-4 h-4" /> Middle East & Gulf Visas
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Fast E-Visa</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-3">
                {gulfVisas.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 group">
                    <div className="flex items-start justify-between gap-1">
                      <a
                        href={item.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition flex items-center gap-1.5"
                      >
                        <span className="text-base">{item.flag}</span>
                        <span>{item.country}</span>
                      </a>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 whitespace-nowrap">
                        {item.visaType}
                      </span>
                    </div>

                    <div className="mt-1.5 pl-6 space-y-1 text-[11px] text-slate-400">
                      <div className="text-slate-300 font-medium">Fee: {item.officialFee}</div>
                      <div>Timeline: <span className="text-emerald-400 font-mono">{item.processingTime}</span></div>
                    </div>

                    <div className="mt-2 pl-6 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => setSelectedCountryDetails(item)}
                        className="text-blue-400 hover:underline font-semibold"
                      >
                        View Checklist
                      </button>
                      <a
                        href={item.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        Apply Online <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <button
                  onClick={() => setSelectedRegion("Middle East & Gulf")}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1 w-full"
                >
                  All Gulf E-Visa Guides ➜
                </button>
              </div>
            </div>

            {/* COLUMN 2: EUROPE & UK */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-blue-800 to-indigo-800 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Europe & UK Visas
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Sticker / VFS</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-3">
                {europeVisas.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 group">
                    <div className="flex items-start justify-between gap-1">
                      <a
                        href={item.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition flex items-center gap-1.5"
                      >
                        <span className="text-base">{item.flag}</span>
                        <span>{item.country}</span>
                      </a>
                      <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 whitespace-nowrap">
                        {item.visaType}
                      </span>
                    </div>

                    <div className="mt-1.5 pl-6 space-y-1 text-[11px] text-slate-400">
                      <div className="text-slate-300 font-medium">Fee: {item.officialFee}</div>
                      <div>Timeline: <span className="text-blue-400 font-mono">{item.processingTime}</span></div>
                    </div>

                    <div className="mt-2 pl-6 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => setSelectedCountryDetails(item)}
                        className="text-blue-400 hover:underline font-semibold"
                      >
                        View Checklist
                      </button>
                      <a
                        href={item.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        Embassy Portal <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <button
                  onClick={() => setSelectedRegion("Europe & UK")}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 w-full"
                >
                  All Europe & UK Guidelines ➜
                </button>
              </div>
            </div>

            {/* COLUMN 3: ASIA & FAR EAST */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-purple-800 to-pink-800 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4" /> Asia & Far East Visas
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Tourism</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-3">
                {asiaVisas.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 group">
                    <div className="flex items-start justify-between gap-1">
                      <a
                        href={item.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-200 group-hover:text-purple-400 transition flex items-center gap-1.5"
                      >
                        <span className="text-base">{item.flag}</span>
                        <span>{item.country}</span>
                      </a>
                      <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 whitespace-nowrap">
                        {item.visaType}
                      </span>
                    </div>

                    <div className="mt-1.5 pl-6 space-y-1 text-[11px] text-slate-400">
                      <div className="text-slate-300 font-medium">Fee: {item.officialFee}</div>
                      <div>Timeline: <span className="text-purple-400 font-mono">{item.processingTime}</span></div>
                    </div>

                    <div className="mt-2 pl-6 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => setSelectedCountryDetails(item)}
                        className="text-blue-400 hover:underline font-semibold"
                      >
                        View Checklist
                      </button>
                      <a
                        href={item.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        Apply Online <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <button
                  onClick={() => setSelectedRegion("Asia & Far East")}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 w-full"
                >
                  All Asian Visa Guides ➜
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Interactive Country Checklist Modal Popup */}
        {selectedCountryDetails && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCountryDetails.flag}</span>
                  <div>
                    <h3 className="text-lg font-black text-white">{selectedCountryDetails.country}</h3>
                    <span className="text-xs text-blue-400 font-semibold">{selectedCountryDetails.visaType} • {selectedCountryDetails.region}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCountryDetails(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block font-medium">Processing Time:</span>
                    <span className="font-bold text-emerald-400">{selectedCountryDetails.processingTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Official Visa Fee:</span>
                    <span className="font-bold text-white">{selectedCountryDetails.officialFee}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block font-medium">Bank Statement Requirement:</span>
                    <span className="font-semibold text-slate-300">{selectedCountryDetails.bankStatement}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> Mandatory Documents Required:
                  </h4>
                  <ul className="space-y-1.5 pl-2 text-slate-300">
                    {selectedCountryDetails.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">✓</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl text-slate-300 leading-relaxed">
                  <strong className="text-blue-300">Crucial Officer Advice:</strong> {selectedCountryDetails.keyNotes}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedCountryDetails(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Back
                </button>
                <a
                  href={selectedCountryDetails.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                >
                  <span>Go to Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Master Directory Table of All Countries */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-blue-400" />
                All Countries Visa Directory for Pakistanis
              </h3>
              <p className="text-xs text-slate-400">
                Official embassy links, application portals, and verified embassy fees.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Region:</span>
                {regions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedRegion === reg
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Visa Type:</span>
                {["All", "E-Visa (Online)", "Sticker Visa (Embassy / VFS)", "Visa on Arrival", "Visa Free"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedVisaType(type)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedVisaType === type
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="py-3 px-3">Country / Destination</th>
                  <th className="py-3 px-3 min-w-[120px]">Visa Category</th>
                  <th className="py-3 px-3 min-w-[130px]">Official Fee</th>
                  <th className="py-3 px-3 min-w-[130px]">Processing Time</th>
                  <th className="py-3 px-3 min-w-[180px]">Bank Balance Guideline</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredCountries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">
                      No country matches your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCountries.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition group">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.flag}</span>
                          <span className="font-bold text-slate-200 group-hover:text-blue-400 transition">
                            {item.country}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[11px] font-semibold">
                          {item.visaType}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-300">
                        {item.officialFee}
                      </td>

                      <td className="py-3 px-3 text-emerald-400 font-mono">
                        {item.processingTime}
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {item.bankStatement}
                      </td>

                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedCountryDetails(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                        >
                          Checklist
                        </button>
                        <a
                          href={item.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
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

        {/* Crucial Tips & Scam Warning */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-300">
              Pakistani Travelers Alert: Avoid Visa Fraud & Fake Work Permits
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never pay cash to unauthorized travel agents promising &ldquo;Guaranteed Sticker Visas&rdquo; or &ldquo;Direct Work Permits&rdquo; for Europe or Canada. No agent can guarantee a visa; decisions are made solely by the Embassy Consular Officers based on genuine bank statements, NADRA FRC ties, and active tax returns.
            </p>
          </div>
        </div>

      </div>
      </main>
      <Footer />
    </div>
  );
}
