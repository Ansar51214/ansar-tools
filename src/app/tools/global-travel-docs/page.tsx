"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileSearch,
  FileText,
  CheckCircle2,
  AlertCircle,
  Printer,
  Copy,
  Check,
  Globe2,
  ExternalLink,
  ShieldCheck,
  Calculator,
  Luggage,
  Building2,
  Sparkles,
  FileBadge,
  Stethoscope,
  BadgeCheck,
  AlertTriangle,
  UserCheck,
  HeartPulse
} from "lucide-react";

// Types
type TabType = "cover-letter" | "attestation" | "finance-calc" | "health-clearance" | "customs-sbp" | "checklist";

export default function GlobalTravelDocsPrep() {
  const [activeTab, setActiveTab] = useState<TabType>("cover-letter");
  const [copiedLetter, setCopiedLetter] = useState(false);

  // ----------------------------------------------------
  // 1. Cover Letter Generator State
  // ----------------------------------------------------
  const [coverData, setCoverData] = useState({
    embassyName: "Visa Section, Embassy of the Federal Republic of Germany",
    embassyCity: "Islamabad, Pakistan",
    applicantName: "Muhammad Ali Khan",
    passportNumber: "PK7829102",
    cnicNumber: "37405-1234567-1",
    profession: "Senior Software Engineer at TechLogix Ltd",
    monthlySalary: "PKR 350,000",
    destinationCountry: "Germany & France (Schengen Area)",
    travelPurpose: "Tourism, cultural sightseeing, and vacation",
    travelStartDate: "2026-10-15",
    travelEndDate: "2026-10-28",
    durationDays: "14",
    sponsorType: "self", // self, employer, sponsor
    tiesToPakistan: "Permanent employment contract, ownership of residential property in Rawalpindi, aged parents residing in Pakistan, and active tax filer status with FBR (ATL).",
    customNotes: "I have booked refundable hotels and a round-trip flight reservation. I guarantee that I will abide by all local visa laws and return to Pakistan before my visa expires."
  });

  // ----------------------------------------------------
  // 2. Financial Readiness Calculator State
  // ----------------------------------------------------
  const [calcCountry, setCalcCountry] = useState<"schengen" | "uk" | "usa" | "gulf" | "turkey" | "malaysia">("schengen");
  const [calcDays, setCalcDays] = useState<number>(14);
  const [calcTravelers, setCalcTravelers] = useState<number>(1);
  const [flightCostPkr, setFlightCostPkr] = useState<number>(280000);
  const [hotelPerNightPkr, setHotelPerNightPkr] = useState<number>(35000);
  const [existingSavingsPkr, setExistingSavingsPkr] = useState<number>(1500000);

  const countryDailyExpenseRate = {
    schengen: { currency: "EUR", dailyForeign: 90, pkrRate: 315, name: "Schengen Zone (EU)" },
    uk: { currency: "GBP", dailyForeign: 120, pkrRate: 375, name: "United Kingdom (UK)" },
    usa: { currency: "USD", dailyForeign: 150, pkrRate: 285, name: "United States (B1/B2)" },
    gulf: { currency: "AED", dailyForeign: 350, pkrRate: 77, name: "UAE / Dubai" },
    turkey: { currency: "USD", dailyForeign: 75, pkrRate: 285, name: "Turkiye" },
    malaysia: { currency: "USD", dailyForeign: 60, pkrRate: 285, name: "Malaysia" }
  };

  const currentRate = countryDailyExpenseRate[calcCountry];

  const financialCalculations = useMemo(() => {
    const dailyExpensesPkr = calcDays * calcTravelers * (currentRate.dailyForeign * currentRate.pkrRate);
    const accommodationTotalPkr = calcDays * hotelPerNightPkr;
    const flightsTotalPkr = calcTravelers * flightCostPkr;
    const baseEstimatedCostPkr = dailyExpensesPkr + accommodationTotalPkr + flightsTotalPkr;
    // Consular benchmark requires 1.8x safety buffer on top of base expenditure in bank account
    const recommendedBankBalancePkr = Math.round(baseEstimatedCostPkr * 1.8);
    const balanceGap = recommendedBankBalancePkr - existingSavingsPkr;
    const isSufficient = existingSavingsPkr >= recommendedBankBalancePkr;

    return {
      dailyExpensesPkr,
      accommodationTotalPkr,
      flightsTotalPkr,
      baseEstimatedCostPkr,
      recommendedBankBalancePkr,
      balanceGap,
      isSufficient
    };
  }, [calcDays, calcTravelers, currentRate, hotelPerNightPkr, flightCostPkr, existingSavingsPkr]);

  // ----------------------------------------------------
  // 3. Readiness Tracker Checklist State
  // ----------------------------------------------------
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    passport_validity: true,
    passport_blank_pages: true,
    smart_cnic: true,
    nadra_frc: true,
    bank_statement_6m: true,
    account_maintenance_cert: false,
    fbr_atl_returns: true,
    employment_noc: false,
    flight_reservation: false,
    hotel_booking: false,
    travel_insurance_50k: false,
    cover_letter_signed: false,
    polio_nims_card: false,
    photos_compliant: true
  });

  const checklistItems = useMemo(() => [
    { id: "passport_validity", label: "Valid Passport (Minimum 6 months validity from travel date)", weight: 10, category: "Core Identity" },
    { id: "passport_blank_pages", label: "At least 2 blank consecutive visa stamp pages", weight: 5, category: "Core Identity" },
    { id: "smart_cnic", label: "NADRA Smart CNIC with English translation", weight: 5, category: "Core Identity" },
    { id: "nadra_frc", label: "NADRA FRC (Family Registration Certificate) with 'By Birth' / 'By Marriage' tree", weight: 10, category: "Civil Verification" },
    { id: "bank_statement_6m", label: "Original 6-Month Bank Statement with official branch stamps & sign on every page", weight: 15, category: "Financial Ties" },
    { id: "account_maintenance_cert", label: "Bank Account Maintenance Certificate (showing opening date & PKR balance)", weight: 10, category: "Financial Ties" },
    { id: "fbr_atl_returns", label: "FBR Active Taxpayer Status (ATL) & 2 Years Tax Return Acknowledgements (Form 182)", weight: 10, category: "Financial Ties" },
    { id: "employment_noc", label: "Employer NOC / Leave Approval Letter on letterhead (or Chamber + NTN for business)", weight: 10, category: "Socio-Economic Ties" },
    { id: "cover_letter_signed", label: "Formal Travel Cover Letter / Statement of Purpose (SOP) signed by applicant", weight: 10, category: "Application Package" },
    { id: "travel_insurance_50k", label: "International Travel Health Insurance (€30,000 / $50,000 coverage with repatriation)", weight: 10, category: "Travel Logistics" },
    { id: "flight_reservation", label: "Round-trip Flight Reservation with verifiable PNR (Dummy ticket / held booking)", weight: 5, category: "Travel Logistics" },
    { id: "hotel_booking", label: "Confirmed Hotel Bookings / Proof of Accommodation with contact details", weight: 5, category: "Travel Logistics" },
    { id: "polio_nims_card", label: "NIMS NADRA Polio Yellow Card / Certificate (Mandatory for travel >4 weeks)", weight: 5, category: "Health & Clearance" }
  ], []);

  const totalScore = useMemo(() => {
    let earned = 0;
    let max = 0;
    checklistItems.forEach(item => {
      max += item.weight;
      if (checklist[item.id]) earned += item.weight;
    });
    return Math.round((earned / max) * 100);
  }, [checklist, checklistItems]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ----------------------------------------------------
  // Formatted Cover Letter Output
  // ----------------------------------------------------
  const generatedCoverLetter = useMemo(() => {
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    return `Date: ${today}

To:
The Visa Officer,
${coverData.embassyName},
${coverData.embassyCity}

Subject: Application for Short-Stay Tourist Visa – ${coverData.applicantName} (Passport No: ${coverData.passportNumber})

Respected Visa Officer,

I, ${coverData.applicantName}, holder of Pakistani Passport Number ${coverData.passportNumber} and CNIC ${coverData.cnicNumber}, am writing to formally submit my application for a short-stay visit visa to visit ${coverData.destinationCountry} from ${coverData.travelStartDate} to ${coverData.travelEndDate} (Duration: ${coverData.durationDays} Days).

PURPOSE OF VISIT:
The primary purpose of my visit is ${coverData.travelPurpose}. As an avid traveler and professional, I have planned this personal vacation to explore historic landmarks, cultural heritage, and scenic attractions across ${coverData.destinationCountry}.

PROFESSIONAL BACKGROUND & FINANCIAL SPONSORSHIP:
I am currently employed as ${coverData.profession} with a net monthly compensation of ${coverData.monthlySalary}. 
${coverData.sponsorType === "self" 
  ? `This journey is entirely self-funded through my personal savings accumulated from my lawful professional earnings. As evidenced by my attached 6-month bank statements and Account Maintenance Certificate, I have sufficient liquid funds to comfortably cover all my round-trip international flights, accommodation, local transit, meals, and unforeseen emergency expenses during my stay.`
  : `The expenses for this journey are sponsored as detailed in the attached formal sponsorship declaration and financial guarantee documents.`
}

TIES TO PAKISTAN & INCENTIVE TO RETURN:
I maintain strong social, financial, and familial ties to Pakistan that obligate my mandatory return upon the completion of my itinerary:
1. Professional Ties: ${coverData.tiesToPakistan}
2. Familial Ties: My family resides permanently in Pakistan, as verified by my attached NADRA Family Registration Certificate (FRC).
3. Tax Compliance: I am an Active Taxpayer registered with the Federal Board of Revenue (FBR) and have attached my filed income tax returns.

ENCLOSED DOCUMENTS:
In support of my visa application, please find enclosed the following authentic documentation:
• Original Passport & copy of previous travel history stamps
• Duly completed and signed Visa Application Form
• Official 6-Month Bank Statement stamped by branch manager & Account Maintenance Letter
• Last 2 Years FBR Income Tax Returns & Active Taxpayer List (ATL) Certificate
• Employer No-Objection Certificate (NOC) and 3 months salary slips
• Verifiable Round-Trip Flight Reservation with live PNR
• Confirmed Hotel Accommodation Bookings for each night of stay
• Schengen/International Travel Medical Insurance policy with €30,000 / $50,000 minimum coverage
• NADRA Family Registration Certificate (FRC)
• Polio Vaccination Certificate (NIMS NADRA)

${coverData.customNotes}

I kindly request you to grant me a visa for the requested duration. I remain at your disposal should any further information or interview be required.

Yours faithfully,

_____________________________
${coverData.applicantName}
Passport No: ${coverData.passportNumber}
CNIC No: ${coverData.cnicNumber}
Contact: +92-3XXXXXXXXX
Address: Islamabad / Lahore / Karachi, Pakistan`;
  }, [coverData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCoverLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. Header Banner (Sharda Result Theme) */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <FileSearch className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Official Consular Toolkit
                  </span>
                  <span className="bg-blue-600/40 text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-500/30">
                    Pakistani Citizens
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                  Global Travel Docs Prep &amp; Attestation Portal
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Generate embassy-ready cover letters, calculate minimum bank balances, verify MOFA/HEC attestations, and NIMS polio yellow cards.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Link 
                href="/tools/international-visa-guides"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Globe2 className="w-4 h-4 text-emerald-400" />
                Visa Guides Directory
              </Link>
              <Link 
                href="/tools/nadra-portal"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-indigo-400" />
                NADRA FRC Portal
              </Link>
            </div>
          </div>

          {/* Quick Jump Buttons (Sharda-Style Colored Pills) */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Direct Portals:
            </span>
            <a 
              href="https://apostille.mofa.gov.pk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition"
            >
              🏛️ MOFA e-Apostille Portal <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://eservices.hec.gov.pk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition"
            >
              🎓 HEC Degree Attestation <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://nims.nadra.gov.pk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition"
            >
              💉 NIMS Polio Certificate <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://beoe.gov.pk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition"
            >
              🛂 Bureau Protector (BEOE) <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://attest.ibcc.edu.pk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition"
            >
              📜 IBCC Verification <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area with Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("cover-letter")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "cover-letter"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            1. Cover Letter / SOP Generator
          </button>

          <button
            onClick={() => setActiveTab("finance-calc")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "finance-calc"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Calculator className="w-4 h-4" />
            2. Bank Balance &amp; Affordability Calculator
          </button>

          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "checklist"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            3. Master Document Readiness Tracker
          </button>

          <button
            onClick={() => setActiveTab("attestation")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "attestation"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <FileBadge className="w-4 h-4" />
            4. MOFA, HEC &amp; Apostille Guide
          </button>

          <button
            onClick={() => setActiveTab("health-clearance")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "health-clearance"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            5. Polio (NIMS) &amp; IOM TB Medical
          </button>

          <button
            onClick={() => setActiveTab("customs-sbp")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "customs-sbp"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Luggage className="w-4 h-4" />
            6. SBP Foreign Cash &amp; Customs Limits
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: COVER LETTER / SOP GENERATOR */}
        {/* ---------------------------------------------------- */}
        {activeTab === "cover-letter" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">Applicant &amp; Travel Details</h2>
                    <p className="text-xs text-slate-500">Fill in your information to generate an embassy-grade cover letter</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Embassy / Consulate</label>
                    <input
                      type="text"
                      value={coverData.embassyName}
                      onChange={(e) => setCoverData({ ...coverData, embassyName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                      placeholder="e.g. Visa Section, Embassy of the Federal Republic of Germany"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Embassy City</label>
                      <input
                        type="text"
                        value={coverData.embassyCity}
                        onChange={(e) => setCoverData({ ...coverData, embassyCity: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                        placeholder="Islamabad / Karachi"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Applicant Name</label>
                      <input
                        type="text"
                        value={coverData.applicantName}
                        onChange={(e) => setCoverData({ ...coverData, applicantName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                        placeholder="Full Name as per Passport"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Passport Number</label>
                      <input
                        type="text"
                        value={coverData.passportNumber}
                        onChange={(e) => setCoverData({ ...coverData, passportNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs uppercase"
                        placeholder="PK1234567"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">CNIC Number</label>
                      <input
                        type="text"
                        value={coverData.cnicNumber}
                        onChange={(e) => setCoverData({ ...coverData, cnicNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                        placeholder="37405-XXXXXXX-X"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Current Profession / Title</label>
                      <input
                        type="text"
                        value={coverData.profession}
                        onChange={(e) => setCoverData({ ...coverData, profession: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                        placeholder="Software Engineer / Business Owner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Income / Salary</label>
                      <input
                        type="text"
                        value={coverData.monthlySalary}
                        onChange={(e) => setCoverData({ ...coverData, monthlySalary: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                        placeholder="PKR 250,000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Destination Countries</label>
                      <input
                        type="text"
                        value={coverData.destinationCountry}
                        onChange={(e) => setCoverData({ ...coverData, destinationCountry: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                        placeholder="Germany, Italy, France"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Days)</label>
                      <input
                        type="number"
                        value={coverData.durationDays}
                        onChange={(e) => setCoverData({ ...coverData, durationDays: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={coverData.travelStartDate}
                        onChange={(e) => setCoverData({ ...coverData, travelStartDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={coverData.travelEndDate}
                        onChange={(e) => setCoverData({ ...coverData, travelEndDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Purpose of Travel</label>
                    <input
                      type="text"
                      value={coverData.travelPurpose}
                      onChange={(e) => setCoverData({ ...coverData, travelPurpose: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                      placeholder="e.g. Tourism, vacation, visiting historic monuments"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Key Ties to Pakistan (Crucial to prevent rejection)</label>
                    <textarea
                      rows={3}
                      value={coverData.tiesToPakistan}
                      onChange={(e) => setCoverData({ ...coverData, tiesToPakistan: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 text-xs"
                      placeholder="Mention job stability, property, family dependants, FBR tax filer status..."
                    />
                  </div>
                </div>
              </div>

              {/* Pro Consular Tips Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
                <div className="flex items-center gap-2 font-bold text-amber-950 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Consular Golden Rules for Pakistani Applicants:
                </div>
                <ul className="list-disc pl-4 space-y-1 text-amber-800">
                  <li>Never submit a handwritten or vague cover letter.</li>
                  <li>Ensure your job title and salary match your bank statement salary credits exactly.</li>
                  <li>Attach an FBR Active Taxpayer Certificate (ATL); embassies prioritize tax filers.</li>
                  <li>Sign your cover letter in <strong>blue ink</strong> before submitting to VFS / Gerry&apos;s.</li>
                </ul>
              </div>
            </div>

            {/* Live Document Preview & Actions */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="font-bold text-slate-900 text-base">Embassy Cover Letter Preview</h3>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                      Standard Schengen / UK Format
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedLetter ? "Copied!" : "Copy Text"}
                    </button>
                    <button
                      onClick={handlePrint}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print / Save PDF
                    </button>
                  </div>
                </div>

                {/* Cover Letter Body Styled like Formal Paper */}
                <div className="bg-slate-50/70 p-6 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed flex-1 overflow-y-auto max-h-[680px]">
                  {generatedCoverLetter}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Formatting follows standard European Visa Code (EC No 810/2009) guidelines</span>
                  <span className="font-semibold text-emerald-600">Embassy Ready ✨</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: BANK BALANCE & FINANCIAL CALCULATOR */}
        {/* ---------------------------------------------------- */}
        {activeTab === "finance-calc" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="max-w-3xl mb-6">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wide">
                  <Calculator className="w-4 h-4" />
                  Financial Sufficiency Benchmark
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Embassy Bank Balance &amp; Affordability Calculator
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Embassies calculate whether your liquid bank balance realistically covers all flights, hotel stays, daily living costs, plus a 1.8× emergency safety buffer without draining your account.
                </p>
              </div>

              {/* Select Country Rate */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
                {(Object.keys(countryDailyExpenseRate) as Array<keyof typeof countryDailyExpenseRate>).map((key) => {
                  const item = countryDailyExpenseRate[key];
                  const isSelected = calcCountry === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setCalcCountry(key)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected 
                          ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-sm"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Min. {item.dailyForeign} {item.currency}/day
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Calculator Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trip Duration (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={calcDays}
                    onChange={(e) => setCalcDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500">Standard tourist stay: 7 to 21 days</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={calcTravelers}
                    onChange={(e) => setCalcTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500">Self or family members travelling together</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Return Flight Estimate (PKR / Person)
                  </label>
                  <input
                    type="number"
                    step={10000}
                    value={flightCostPkr}
                    onChange={(e) => setFlightCostPkr(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500">Approx. PKR 250k - 380k for Europe / US</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hotel / Stay per Night (PKR)
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={hotelPerNightPkr}
                    onChange={(e) => setHotelPerNightPkr(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500">Approx. PKR 25k - 45k / night in Europe</span>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Current Closing Bank Balance (PKR)
                  </label>
                  <input
                    type="number"
                    step={50000}
                    value={existingSavingsPkr}
                    onChange={(e) => setExistingSavingsPkr(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500">Must reflect in your 6-month bank statement without sudden unexplained deposits</span>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Daily Living Expenses</div>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    PKR {financialCalculations.dailyExpensesPkr.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {calcDays} days × {currentRate.dailyForeign} {currentRate.currency}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Accommodation &amp; Flights</div>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    PKR {(financialCalculations.accommodationTotalPkr + financialCalculations.flightsTotalPkr).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Hotels: PKR {financialCalculations.accommodationTotalPkr.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Base Cost of Trip</div>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    PKR {financialCalculations.baseEstimatedCostPkr.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Estimated total expenditures
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${
                  financialCalculations.isSufficient
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : "bg-rose-50 border-rose-300 text-rose-950"
                }`}>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    Recommended Bank Balance
                  </div>
                  <div className="text-xl font-black mt-1">
                    PKR {financialCalculations.recommendedBankBalancePkr.toLocaleString()}
                  </div>
                  <div className="text-[11px] mt-0.5 font-medium">
                    (Base Cost × 1.8 Safe Margin)
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-5 rounded-xl border flex items-start gap-3.5 ${
                financialCalculations.isSufficient
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-amber-50 border-amber-300 text-amber-900"
              }`}>
                {financialCalculations.isSufficient ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-sm">
                  <div className="font-bold text-base">
                    {financialCalculations.isSufficient
                      ? "Your Bank Balance Meets the Consular Benchmark!"
                      : `Warning: Estimated Shortfall of PKR ${Math.abs(financialCalculations.balanceGap).toLocaleString()}`}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed">
                    {financialCalculations.isSufficient
                      ? `Your closing balance of PKR ${existingSavingsPkr.toLocaleString()} comfortably covers the trip and demonstrates you won't be financially stranded. Remember: consistency of monthly salary credits is even more important than the closing number.`
                      : `Consular officers may issue a refusal under "lack of economic means" if your bank balance leaves you with zero savings after paying for flights and hotels. We strongly advise showing at least PKR ${financialCalculations.recommendedBankBalancePkr.toLocaleString()} with authentic 6-month history.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Statement Verification Protocol */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Bank Statement &quot;Do&apos;s and Don&apos;ts&quot; for Pakistani Embassies
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What Embassies Look For:
                  </span>
                  <ul className="list-disc pl-4 space-y-1.5 text-emerald-800">
                    <li><strong>Regular Salary Inflow:</strong> Identical payroll credits on the 1st or 30th of each month matching your pay slips.</li>
                    <li><strong>Account Maintenance Certificate (AMC):</strong> Showing the exact account opening date and clear closing balance.</li>
                    <li><strong>Branch Verification:</strong> Every single page of the statement must have the bank&apos;s circular stamp and signing officer&apos;s PIN.</li>
                    <li><strong>Match with FBR Returns:</strong> The wealth declared on your FBR Wealth Statement (Form 116) should logically correlate with your account.</li>
                  </ul>
                </div>

                <div className="space-y-3 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Red Flags Leading to Instant Refusals:
                  </span>
                  <ul className="list-disc pl-4 space-y-1.5 text-rose-800">
                    <li><strong>Sudden Fund Dumping:</strong> A sudden unexplained deposit of Rs. 15-20 Lakhs 10 days before applying without paper trail.</li>
                    <li><strong>Borrowing from Relatives:</strong> Depositing cash that is immediately withdrawn after printing the statement (embassies do random verification calls).</li>
                    <li><strong>Low Daily Average:</strong> Maintaining Rs. 20,000 for 5 months and depositing Rs. 2 Million in the final 2 weeks.</li>
                    <li><strong>Unstamped Printouts:</strong> Submitting internet banking digital PDFs without the physical branch manager stamp and signature.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: MASTER DOCUMENT READINESS TRACKER */}
        {/* ---------------------------------------------------- */}
        {activeTab === "checklist" && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Interactive Readiness Audit
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    Master Document Readiness Tracker
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    Check off the documents in your folder to check your overall visa application strength score before submitting to Gerry&apos;s or VFS Global.
                  </p>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-4xl font-black text-emerald-600">
                    {totalScore}%
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    {totalScore >= 90 ? "Embassy Ready 🟢" : totalScore >= 60 ? "Moderate Strength 🟡" : "Incomplete Application 🔴"}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden mt-6 border border-slate-200">
                <div 
                  className={`h-full transition-all duration-500 ${
                    totalScore >= 90 ? "bg-emerald-500" : totalScore >= 60 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${totalScore}%` }}
                />
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
                <span>Checklist Items</span>
                <span className="text-xs font-normal text-slate-500">Click checkboxes to update status</span>
              </h3>

              <div className="space-y-3">
                {checklistItems.map((item) => {
                  const isChecked = !!checklist[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked 
                          ? "bg-emerald-50/40 border-emerald-300 text-slate-900" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked 
                            ? "bg-emerald-600 border-emerald-600 text-white" 
                            : "border-slate-300 bg-white"
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className={`text-xs sm:text-sm font-semibold ${isChecked ? "text-slate-900" : "text-slate-700"}`}>
                            {item.label}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Category: {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-slate-400">
                        +{item.weight}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: MOFA, HEC & APOSTILLE DIRECTORY */}
        {/* ---------------------------------------------------- */}
        {activeTab === "attestation" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="max-w-3xl mb-6">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wide">
                  <FileBadge className="w-4 h-4" />
                  Official Legalization &amp; Attestation Systems
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Pakistan Document Attestation &amp; Apostille Guide
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Complete guidelines for getting your educational, marriage, and civil documents attested by MOFA, HEC, and IBCC with direct official portal links.
                </p>
              </div>

              {/* Major Milestone: Apostille Convention */}
              <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl mb-8 flex items-start gap-4">
                <div className="p-2.5 bg-blue-600 text-white rounded-lg shrink-0">
                  <Globe2 className="w-6 h-6" />
                </div>
                <div className="text-xs sm:text-sm text-blue-950">
                  <h4 className="font-bold text-base text-blue-900">
                    Pakistan Has Joined the Hague Apostille Convention!
                  </h4>
                  <p className="mt-1 leading-relaxed text-blue-800">
                    Pakistani documents attested with a <strong>MOFA e-Apostille sticker &amp; QR code</strong> are now directly accepted in over 120+ member countries (including UK, USA, France, Germany, Italy, Turkey, Australia, etc.) <strong>without</strong> needing further costly attestation from the foreign destination embassy.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href="https://apostille.mofa.gov.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition"
                    >
                      Visit MOFA Apostille Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 3 Major Attestation Pathways */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. MOFA */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                        Civil &amp; General Docs
                      </span>
                      <Building2 className="w-5 h-5 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Ministry of Foreign Affairs (MOFA)</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Required for: NADRA Birth Certificate, Marriage Certificate (MRC / Nikahnama), Police Character Certificate, Power of Attorney, Experience Letters.
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-200 text-xs space-y-2">
                      <div>
                        <strong>Locations:</strong> Islamabad HQ, Lahore, Karachi, Peshawar, Quetta camp offices.
                      </div>
                      <div>
                        <strong>Modes:</strong> Walk-in appointments &amp; TCS / Gerry&apos;s courier attestation.
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-200">
                    <a
                      href="https://apostille.mofa.gov.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg text-center flex items-center justify-center gap-1.5 transition"
                    >
                      MOFA Official Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* 2. HEC */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                        Degrees &amp; Transcripts
                      </span>
                      <FileBadge className="w-5 h-5 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Higher Education Commission (HEC)</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Required for: Bachelor&apos;s (BS/BA), Master&apos;s (MS/MPhil), PhD degrees and official university transcripts issued by recognized Pakistani universities.
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-200 text-xs space-y-2">
                      <div>
                        <strong>System:</strong> Degree Attestation System (DAS e-Services).
                      </div>
                      <div>
                        <strong>Fee:</strong> Rs. 1,000 per original degree, Rs. 500 per photocopy.
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-200">
                    <a
                      href="https://eservices.hec.gov.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg text-center flex items-center justify-center gap-1.5 transition"
                    >
                      HEC eServices Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* 3. IBCC */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                        Matric &amp; Inter
                      </span>
                      <BadgeCheck className="w-5 h-5 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Inter Board Coordination Commission (IBCC)</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Required for: Secondary School Certificate (SSC / Matric) and Higher Secondary School Certificate (HSSC / FSc / FA / ICS) marksheets and certificates.
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-200 text-xs space-y-2">
                      <div>
                        <strong>Pre-requisite:</strong> Sealed verification envelope from parent BISE board.
                      </div>
                      <div>
                        <strong>Features:</strong> Instant QR-code digital verification sticker.
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-200">
                    <a
                      href="https://attest.ibcc.edu.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg text-center flex items-center justify-center gap-1.5 transition"
                    >
                      IBCC Attestation Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Protector of Emigrants Box */}
              <div className="mt-8 p-5 bg-purple-50 border border-purple-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Mandatory for Overseas Employment
                    </span>
                    <h4 className="font-bold text-purple-950 text-sm">
                      Bureau of Emigration &amp; Overseas Employment (Protector Stamp)
                    </h4>
                  </div>
                  <p className="text-xs text-purple-800">
                    If you are traveling on an employment / work visa to Saudi Arabia, UAE, Qatar, Oman, Kuwait, or Malaysia, you <strong>cannot</strong> board an international flight from Pakistan without a valid BEOE Protector stamp on your passport.
                  </p>
                </div>
                <a
                  href="https://beoe.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
                >
                  BEOE Registration <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: POLIO (NIMS) & IOM TB MEDICAL */}
        {/* ---------------------------------------------------- */}
        {activeTab === "health-clearance" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="max-w-3xl mb-6">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wide">
                  <Stethoscope className="w-4 h-4" />
                  Mandatory Health Clearances
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Polio Yellow Card &amp; IOM Tuberculosis (TB) Screening
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  International travel health mandates enforced by the World Health Organization (WHO) and foreign immigration authorities for Pakistani passport holders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Polio Card (NIMS NADRA) */}
                <div className="border border-emerald-200 rounded-2xl p-6 bg-emerald-50/40">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-600 text-white rounded-xl">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Polio Yellow Card / Certificate</h3>
                      <span className="text-xs text-emerald-700 font-semibold">National Immunization Management System (NIMS)</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
                    <p>
                      <strong>Who Needs It?</strong> Under WHO International Health Regulations, any Pakistani resident traveling abroad for more than 4 weeks must show proof of Oral Polio Vaccination (OPV/IPV) received within the last 12 months.
                    </p>
                    <div className="bg-white p-3.5 rounded-lg border border-emerald-200">
                      <strong>How to Get It:</strong>
                      <ol className="list-decimal pl-4 mt-1 space-y-1">
                        <li>Visit any government DHQ/THQ hospital or authorized vaccination center with your original passport.</li>
                        <li>Receive polio drops and ensure hospital staff enters data into NIMS.</li>
                        <li>Download and print your official certificate online at <a href="https://nims.nadra.gov.pk" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-bold">nims.nadra.gov.pk</a> for a fee of Rs. 100.</li>
                      </ol>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-200">
                    <a
                      href="https://nims.nadra.gov.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      Download Official Polio Certificate <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 2. IOM TB Screening */}
                <div className="border border-blue-200 rounded-2xl p-6 bg-blue-50/40">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-600 text-white rounded-xl">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">IOM Tuberculosis (TB) Medical</h3>
                      <span className="text-xs text-blue-700 font-semibold">International Organization for Migration (IOM)</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
                    <p>
                      <strong>Who Needs It?</strong> Mandatory for all Pakistani citizens applying for a UK Visa (stays &gt; 6 months, such as Student, Skilled Worker, or Spouse visas), Australia, and New Zealand.
                    </p>
                    <div className="bg-white p-3.5 rounded-lg border border-blue-200">
                      <strong>Authorized IOM Health Centers in Pakistan:</strong>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li><strong>Islamabad:</strong> IOM Migration Health Assessment Center, Sector G-10/4</li>
                        <li><strong>Lahore:</strong> IOM Center, Gulberg III</li>
                        <li><strong>Karachi:</strong> IOM Center, KDA Scheme 1</li>
                        <li><strong>Mirpur (AJK):</strong> IOM Health Clinic, Sector F-1</li>
                      </ul>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      *Validity: The chest X-ray TB certificate is valid for 6 months from the date of examination.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <a
                      href="https://medres.iom.int"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      Book IOM TB Appointment Online <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: CUSTOMS & SBP FOREIGN CASH LIMITS */}
        {/* ---------------------------------------------------- */}
        {activeTab === "customs-sbp" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="max-w-3xl mb-6">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wide">
                  <Luggage className="w-4 h-4" />
                  State Bank &amp; Customs Regulations
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Pakistani Airport Baggage &amp; Foreign Currency Limits
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Rules and legal limits enforced by the State Bank of Pakistan (SBP), Customs, and FIA Immigration at all Pakistani departure airports.
                </p>
              </div>

              {/* SBP Cash Outflow Limit Table */}
              <div className="overflow-x-auto mb-8 border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Passenger Category</th>
                      <th className="py-3 px-4">Per Visit Cash Limit (USD Equivalent)</th>
                      <th className="py-3 px-4">Annual Calendar Year Limit</th>
                      <th className="py-3 px-4">Pakistani Rupee (PKR) Cash Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">Adults (Age 18 and Above)</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">Max USD 5,000</td>
                      <td className="py-3 px-4">USD 30,000 / Calendar Year</td>
                      <td className="py-3 px-4">Max PKR 10,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">Minors (Under Age 18)</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">Max USD 2,500</td>
                      <td className="py-3 px-4">USD 15,000 / Calendar Year</td>
                      <td className="py-3 px-4">Max PKR 10,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">Travel to Afghanistan</td>
                      <td className="py-3 px-4 text-rose-600 font-bold">Max USD 1,000</td>
                      <td className="py-3 px-4">USD 6,000 / Calendar Year</td>
                      <td className="py-3 px-4">Max PKR 3,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Strict Customs Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl space-y-2">
                  <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Currency Declaration Warning:
                  </h4>
                  <p className="text-amber-900">
                    Carrying foreign currency in excess of the legal SBP limit without an official declaration form is an offense punishable under the <strong>Foreign Exchange Regulation Act 1947</strong>. FIA and Customs screen passengers through body scanners and currency sniffer dogs at airport boarding gates.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Duty Free Allowance for Returning Citizens:
                  </h4>
                  <p className="text-slate-600">
                    Pakistani citizens returning from abroad can bring personal used clothing, 1 personal laptop, 1 smartphone (subject to PTA Dirbs registration tax if kept in Pakistan for over 60 days), and medicines for personal use with doctor&apos;s prescription.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
