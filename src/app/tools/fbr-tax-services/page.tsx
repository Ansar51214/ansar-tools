"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolPageHeader from "@/components/ToolPageHeader";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Calculator,
  FileText,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Check,
  Layers,
  ArrowUpRight,
  Sparkles,
  PhoneCall,
  Scale,
  FileCheck2
} from "lucide-react";

interface FbrService {
  id: string;
  title: string;
  category: "Tax Filing & IRIS" | "Verification & Active Taxpayer (ATL)" | "Challan & 1Link PSID" | "Business, Sales Tax & NTN" | "POS & Digital Invoicing";
  description: string;
  officialUrl: string;
  timing: string;
  charge: string;
  requirements: string;
  isPopular?: boolean;
}

const FBR_SERVICES: FbrService[] = [
  // 1. Tax Filing & IRIS
  {
    id: "iris-filing",
    title: "IRIS 2.0 Income Tax Return Filing",
    category: "Tax Filing & IRIS",
    description: "Official online portal to prepare, submit, and file Annual Income Tax & Wealth Statement.",
    officialUrl: "https://iris.fbr.gov.pk/",
    timing: "24/7 Digital Portal",
    charge: "100% Free (Govt Official)",
    requirements: "CNIC, Registered Mobile SIM on your name, Email Address, Bank Statement, Salary Slips or Business Profit/Loss.",
    isPopular: true
  },
  {
    id: "iris-registration",
    title: "E-Enrollment / New Taxpayer Registration",
    category: "Tax Filing & IRIS",
    description: "First time online user registration for Pakistani residents to obtain IRIS login credentials.",
    officialUrl: "https://iris.fbr.gov.pk/infosys/pages/en/enrollment.jsf",
    timing: "Instant OTP Activation",
    charge: "Free",
    requirements: "13-digit CNIC, Mobile Operator, SIM number registered on your CNIC, and Personal Email."
  },
  {
    id: "tax-asani-app",
    title: "Tax Asaan Mobile App (Android & iOS)",
    category: "Tax Filing & IRIS",
    description: "File simple salaried return, verify ATL status, and generate PSID directly from your phone.",
    officialUrl: "https://play.google.com/store/apps/details?id=fbr.gov.pk.taxasaan",
    timing: "Mobile App 24/7",
    charge: "Free",
    requirements: "IRIS Username (CNIC) & Password.",
    isPopular: true
  },

  // 2. Verification & Active Taxpayer List (ATL)
  {
    id: "atl-inquiry",
    title: "Active Taxpayer List (ATL) Status Inquiry",
    category: "Verification & Active Taxpayer (ATL)",
    description: "Check whether you are a Filer or Non-Filer to save up to 50% withholding tax on bank cash withdrawals, property, and car registration.",
    officialUrl: "https://e.fbr.gov.pk/esbn/Service.aspx?PID=0&SID=ATLInquiry",
    timing: "Live Instant Inquiry",
    charge: "Free",
    requirements: "13-digit CNIC number without dashes or NTN.",
    isPopular: true
  },
  {
    id: "ntn-inquiry",
    title: "Online NTN / STRN Verification",
    category: "Verification & Active Taxpayer (ATL)",
    description: "Verify registered National Tax Number (NTN), Sales Tax Registration Number (STRN), or Company name.",
    officialUrl: "https://e.fbr.gov.pk/esbn/Service.aspx?PID=0&SID=NTNInquiry",
    timing: "Instant",
    charge: "Free",
    requirements: "CNIC or NTN or Incorporation Reg Number."
  },
  {
    id: "exemption-cert",
    title: "Exemption & Withholding Tax Certificates",
    category: "Verification & Active Taxpayer (ATL)",
    description: "Download verified Income Tax exemption certificates under Section 153 or Section 159.",
    officialUrl: "https://e.fbr.gov.pk/esbn/Service.aspx?PID=0&SID=WHTInquiry",
    timing: "Instant Download",
    charge: "Free",
    requirements: "CPR or Barcode Number."
  },

  // 3. Challan & 1Link PSID
  {
    id: "e-payment-psid",
    title: "E-Payment PSID Generator (1Link / ATM / JazzCash)",
    category: "Challan & 1Link PSID",
    description: "Generate 17-digit PSID payment slip to pay Income Tax, Sales Tax, Late Surcharge, or ATL Surcharge.",
    officialUrl: "https://e.fbr.gov.pk/epayment/",
    timing: "Immediate Generation",
    charge: "Free",
    requirements: "Tax Year, Tax Head (Income Tax / Sales Tax / Surcharge), and CNIC / NTN.",
    isPopular: true
  },
  {
    id: "atl-surcharge-payment",
    title: "ATL 1000 Surcharge Payment (Become Instant Filer)",
    category: "Challan & 1Link PSID",
    description: "Pay Rs. 1,000 ATL surcharge for individuals to immediately include your name in the Active Taxpayer List.",
    officialUrl: "https://e.fbr.gov.pk/epayment/",
    timing: "Reflects within 24 Hours",
    charge: "Rs. 1,000 (Individual) / Rs. 10,000 (AOP) / Rs. 20,000 (Company)",
    requirements: "Prior filed tax return for the relevant tax year."
  },
  {
    id: "cpr-verification",
    title: "Computerized Payment Receipt (CPR) Verification",
    category: "Challan & 1Link PSID",
    description: "Verify bank payment receipt against tax deposits at State Bank or National Bank branches.",
    officialUrl: "https://e.fbr.gov.pk/esbn/Service.aspx?PID=0&SID=CPRInquiry",
    timing: "Instant Verification",
    charge: "Free",
    requirements: "CPR Number found on your payment receipt."
  },

  // 4. Business, Sales Tax & NTN
  {
    id: "tajir-dost",
    title: "Tajir Dost Scheme 2026 (Retailers & Wholesalers)",
    category: "Business, Sales Tax & NTN",
    description: "Simplified special registration and advance tax portal for shopkeepers, traders, and retail businesses.",
    officialUrl: "https://tajirdost.fbr.gov.pk/",
    timing: "Simplified 2-Step Form",
    charge: "Free Registration",
    requirements: "Shop Address, Electricity Consumer Number, CNIC and Business Title.",
    isPopular: true
  },
  {
    id: "sales-tax-reg",
    title: "Sales Tax Registration (STRN) & Annex-C",
    category: "Business, Sales Tax & NTN",
    description: "Sales Tax registration for Manufacturers, Importers, Exporters, and Tier-1 Retailers.",
    officialUrl: "https://iris.fbr.gov.pk/",
    timing: "3-5 Working Days",
    charge: "Free",
    requirements: "Utility Bills, Bank Account Maintenance Certificate, GPS Bio-metric Photos of Business Premises."
  },
  {
    id: "webooc-customs",
    title: "WeBOC Customs Import / Export Portal",
    category: "Business, Sales Tax & NTN",
    description: "Web Based One Customs (WeBOC) system for clearance of import and export consignments.",
    officialUrl: "https://www.weboc.gov.pk/",
    timing: "24/7 Port Customs",
    charge: "Official Govt Port Tariffs",
    requirements: "NTN, STRN, Chamber of Commerce Membership, Biometric User ID."
  },

  // 5. POS & Digital Invoicing
  {
    id: "pos-invoicing",
    title: "FBR POS Integration & Digital Invoicing",
    category: "POS & Digital Invoicing",
    description: "Verify genuine FBR QR codes on shopping invoices or integrate your retail point-of-sale software.",
    officialUrl: "https://fbr.gov.pk/pos-integration/",
    timing: "Real-time Verification",
    charge: "Free",
    requirements: "FBR Invoice Number or QR Scan from receipt."
  }
];

export default function FbrTaxServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Tax Calculator State (Updated for Pakistan Budget 2025/2026)
  const [monthlySalary, setMonthlySalary] = useState<number>(150000);
  const [cnicCheck, setCnicCheck] = useState("");

  const categories = [
    "All",
    "Tax Filing & IRIS",
    "Verification & Active Taxpayer (ATL)",
    "Challan & 1Link PSID",
    "Business, Sales Tax & NTN",
    "POS & Digital Invoicing"
  ];

  const filteredServices = useMemo(() => {
    return FBR_SERVICES.filter(service => {
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
        title: "FBR Tax Services Portal Pakistan - Tax Filing, ATL & Calculator",
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Pakistan Salaried Income Tax Calculation (Tax Year 2025-2026 Slabs)
  const taxCalculation = useMemo(() => {
    const annualIncome = (monthlySalary || 0) * 12;
    let annualTax = 0;
    let slab = "Exempt (Income up to Rs. 600,000 is Tax-Free)";

    if (annualIncome <= 600000) {
      annualTax = 0;
      slab = "Up to Rs. 600,000 (0% Tax Rate)";
    } else if (annualIncome <= 1200000) {
      annualTax = (annualIncome - 600000) * 0.05;
      slab = "Rs. 600k - 1.2M (5% of amount exceeding Rs. 600,000)";
    } else if (annualIncome <= 2200000) {
      annualTax = 30000 + (annualIncome - 1200000) * 0.15;
      slab = "Rs. 1.2M - 2.2M (Rs. 30,000 + 15% exceeding 1.2M)";
    } else if (annualIncome <= 3200000) {
      annualTax = 180000 + (annualIncome - 2200000) * 0.25;
      slab = "Rs. 2.2M - 3.2M (Rs. 180,000 + 25% exceeding 2.2M)";
    } else if (annualIncome <= 4100000) {
      annualTax = 430000 + (annualIncome - 3200000) * 0.30;
      slab = "Rs. 3.2M - 4.1M (Rs. 430,000 + 30% exceeding 3.2M)";
    } else {
      annualTax = 700000 + (annualIncome - 4100000) * 0.35;
      slab = "Exceeding Rs. 4.1M (Rs. 700,000 + 35% exceeding 4.1M)";
    }

    const monthlyTax = Math.round(annualTax / 12);
    const netMonthlyTakeHome = (monthlySalary || 0) - monthlyTax;

    return {
      annualIncome,
      annualTax: Math.round(annualTax),
      monthlyTax,
      netMonthlyTakeHome,
      slab
    };
  }, [monthlySalary]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <ToolPageHeader toolName="FBR Tax Services Portal (Pakistan)" onShare={handleShare} />

        {/* Hero Section with Live Search & Quick Action Buttons */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#78350f] border border-amber-500/30 p-6 sm:p-10 shadow-2xl text-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Federal Board of Revenue (FBR) Official Citizen Tax Hub</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              FBR Tax Services & Filing Portal 2026
            </h1>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              Verify your <strong className="text-amber-300">Active Taxpayer List (ATL) Filer Status</strong>, calculate salaried income tax, file IRIS 2.0 returns, and generate 1Link PSID challans officially.
            </p>

            {/* Live Search Box */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search ATL status, IRIS 2.0, PSID challan, NTN inquiry, Tax Asaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/90 border-2 border-amber-500/40 rounded-full text-sm text-white placeholder-slate-400 shadow-xl focus:outline-none focus:border-amber-400 transition"
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
                href="https://e.fbr.gov.pk/esbn/Service.aspx?PID=0&SID=ATLInquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Check ATL Filer Status
              </a>
              <a
                href="https://iris.fbr.gov.pk/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-extrabold shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> IRIS 2.0 Tax Filing
              </a>
              <a
                href="https://e.fbr.gov.pk/epayment/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" /> Generate 1Link PSID
              </a>
              <a
                href="tel:051111772772"
                className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-extrabold transition flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Helpline: (051) 111-772-772
              </a>
            </div>
          </div>
        </div>

        {/* Live News Ticker */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 overflow-hidden flex items-center gap-3">
          <span className="flex items-center gap-1 bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> FBR TAX LIVE:
          </span>
          <div className="overflow-x-auto whitespace-nowrap flex items-center gap-4 text-xs font-medium text-slate-300 scrollbar-none py-1">
            <a href="https://e.fbr.gov.pk/esbn/Service.aspx?PID=0&SID=ATLInquiry" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1">
              ⭐ <span>ATL 2026 updated weekly every Monday on FBR online portal</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href="https://iris.fbr.gov.pk/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1">
              💼 <span>Salaried individuals earning below Rs. 600,000 annually enjoy 0% income tax</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href="https://tajirdost.fbr.gov.pk/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1">
              🏪 <span>Tajir Dost Scheme special facilitation desks active across major wholesale markets</span>
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">
              💬 <span>SMS your <strong>CNIC to 9966</strong> to check Filer status instantly on your phone</span>
            </span>
          </div>
        </div>

        {/* 1-Click ATL Filer Checker Box */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#1e1c14] to-slate-900 border border-amber-500/30 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Active Taxpayer (ATL) Verification
              </span>
              <h3 className="text-lg font-bold text-white">
                Check Filer / Non-Filer Status via CNIC
              </h3>
              <p className="text-xs text-slate-400">
                Enter 13-digit CNIC to open the official FBR database inquiry and verify your withholding tax status.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Enter 13-digit CNIC..."
                value={cnicCheck}
                onChange={(e) => setCnicCheck(e.target.value)}
                className="px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-full sm:w-64"
              />
              <a
                href="https://e.fbr.gov.pk/esbn/Service.aspx?PID=0&SID=ATLInquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold whitespace-nowrap transition flex items-center gap-1"
              >
                <span>Check on FBR</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Pakistan Salary Income Tax Calculator 2025-2026 */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Pakistan Salaried Income Tax Calculator (Tax Year 2025 - 2026)
                </h3>
                <p className="text-xs text-slate-400">
                  Calculated based on current Pakistan Federal Budget tax slabs for salaried employees.
                </p>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Budget 2025/26 Updated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Monthly Gross Salary (PKR):</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">Rs.</span>
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                  step={5000}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Annual Gross: Rs. {taxCalculation.annualIncome.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[11px] text-rose-400 font-bold uppercase">Monthly Tax Deduction:</span>
              <span className="text-2xl font-black text-rose-400">Rs. {taxCalculation.monthlyTax.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Annual: Rs. {taxCalculation.annualTax.toLocaleString()}</span>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[11px] text-emerald-400 font-bold uppercase">Net Monthly Take-Home:</span>
              <span className="text-2xl font-black text-emerald-300">Rs. {taxCalculation.netMonthlyTakeHome.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">After tax deduction</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[10px] text-amber-400 font-bold uppercase">Applicable Tax Slab:</span>
              <span className="text-xs font-semibold text-slate-200 mt-1">{taxCalculation.slab}</span>
            </div>
          </div>
        </div>

        {/* 3-Column Box Grid */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-amber-400" />
                FBR Online Service Centers (Official Direct Access)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Organized by return filing, taxpayer verification, and payment challans.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* COLUMN 1: TAX FILING & IRIS */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-amber-800 to-orange-800 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Tax Filing & IRIS 2.0
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Filing Portal</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-3">
                {FBR_SERVICES.filter(s => s.category === "Tax Filing & IRIS").map((service) => (
                  <div key={service.id} className="pt-2 first:pt-0 group">
                    <a
                      href={service.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition flex items-start gap-1.5"
                    >
                      <span className="text-amber-500 font-bold">➢</span>
                      <span>{service.title}</span>
                    </a>
                    <p className="text-[11px] text-slate-400 mt-1 pl-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-2 pl-4 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                        {service.charge}
                      </span>
                      <a
                        href={service.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-amber-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        Open Portal <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <a
                  href="https://iris.fbr.gov.pk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1"
                >
                  Login to IRIS 2.0 Main Dashboard ➜
                </a>
              </div>
            </div>

            {/* COLUMN 2: VERIFICATION & ATL */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> ATL & NTN Verification
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Active Taxpayer</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-3">
                {FBR_SERVICES.filter(s => s.category === "Verification & Active Taxpayer (ATL)").map((service) => (
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
                        {service.timing}
                      </span>
                      <a
                        href={service.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-emerald-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        Inquire <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <a
                  href="https://e.fbr.gov.pk/esbn/Service.aspx?PID=0&SID=ATLInquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1"
                >
                  Verify Active Taxpayer List Live ➜
                </a>
              </div>
            </div>

            {/* COLUMN 3: E-PAYMENT & PSID */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-blue-800 to-indigo-800 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Challan & 1Link PSID
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Bank Payment</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-3">
                {FBR_SERVICES.filter(s => s.category === "Challan & 1Link PSID").map((service) => (
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
                        {service.timing}
                      </span>
                      <a
                        href={service.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-blue-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        Generate <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <a
                  href="https://e.fbr.gov.pk/epayment/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1"
                >
                  Create 1Link Online PSID Challan ➜
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* FBR SMS Shortcode Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                Check ATL Status via SMS (No Internet)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                SMS to 9966
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Type <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">ATL [13-digit CNIC]</code> and send to <strong>9966</strong>. You will receive an instant SMS showing your Filer status and Tax Year inclusion.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                Key Filer Benefits in Pakistan
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                Save 50% Tax
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filers pay <strong>1% to 3%</strong> tax on property purchase (Non-filers pay up to 12% to 18%), zero advance tax on cash withdrawal, and heavily discounted registration rates on new vehicles.
            </p>
          </div>
        </div>

        {/* Master Directory Table of All FBR Services */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                All FBR Official Services Directory
              </h3>
              <p className="text-xs text-slate-400">
                Direct verified links to Federal Board of Revenue tax e-services.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
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
                  <th className="py-3 px-3 min-w-[180px]">Requirements</th>
                  <th className="py-3 px-3 min-w-[100px]">Govt Charge</th>
                  <th className="py-3 px-3 min-w-[120px]">Timeline</th>
                  <th className="py-3 px-3 text-right">Official Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">
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
                          <span className="font-bold text-slate-200 group-hover:text-amber-400 transition">
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
                        {service.charge}
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {service.timing}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <a
                          href={service.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md transition transform hover:scale-105"
                        >
                          <span>Open</span>
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

      </div>
      </main>
      <Footer />
    </div>
  );
}
