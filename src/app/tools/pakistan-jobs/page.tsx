"use client";

import ToolGuideSection from '@/components/ToolGuideSection';
import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolPageHeader from "@/components/ToolPageHeader";
import {
  Briefcase,
  Search,
  ExternalLink,
  Building2,
  GraduationCap,
  FileText,
  Flame,
  Award,
  BadgeCheck,
  Clock,
  ShieldCheck,
  Layers,
  Filter,
  ArrowUpRight,
  Globe2
} from "lucide-react";

interface JobItem {
  id: string;
  title: string;
  department: string;
  category: "Government" | "Private & Banking" | "Forces & Police" | "Results & Merit Lists" | "Roll No & Admit Cards" | "Scholarships & Schemes";
  province: "Federal" | "Punjab" | "Sindh" | "KPK" | "Balochistan" | "AJK / GB";
  lastDate: string;
  officialUrl: string;
  testingAgency: "FPSC" | "PPSC" | "SPSC" | "KPPSC" | "NTS" | "PTS" | "OTS" | "HEC / Gov" | "Official Portal";
  isHot?: boolean;
  education: string;
  seats?: string;
}

const PAKISTAN_JOBS_DATA: JobItem[] = [
  // 1. Government Jobs
  {
    id: "gov-1",
    title: "FPSC Consolidated Advertisement No. 04/2026 (Multiple Federal Ministries)",
    department: "Federal Public Service Commission (FPSC)",
    category: "Government",
    province: "Federal",
    lastDate: "2026-03-24",
    officialUrl: "https://online.fpsc.gov.pk/",
    testingAgency: "FPSC",
    isHot: true,
    education: "Graduation / Masters",
    seats: "340+ Posts"
  },
  {
    id: "gov-2",
    title: "PPSC Advertisement No. 06/2026 (Educators, Tehsildar & Health Dept)",
    department: "Punjab Public Service Commission (PPSC)",
    category: "Government",
    province: "Punjab",
    lastDate: "2026-03-30",
    officialUrl: "https://www.ppsc.gop.pk/",
    testingAgency: "PPSC",
    isHot: true,
    education: "BA / BSc / BS / B.Ed",
    seats: "850+ Posts"
  },
  {
    id: "gov-3",
    title: "SPSC Combined Competitive Exam (CCE) & Municipal Officer Posts",
    department: "Sindh Public Service Commission (SPSC)",
    category: "Government",
    province: "Sindh",
    lastDate: "2026-04-05",
    officialUrl: "https://spsc.gos.pk/",
    testingAgency: "SPSC",
    isHot: true,
    education: "Graduation (14/16 Years)",
    seats: "180+ Posts"
  },
  {
    id: "gov-4",
    title: "KPPSC Provincial Civil Service (PCS) & Subject Specialists",
    department: "Khyber Pakhtunkhwa Public Service Commission (KPPSC)",
    category: "Government",
    province: "KPK",
    lastDate: "2026-03-28",
    officialUrl: "https://www.kppsc.gov.pk/",
    testingAgency: "KPPSC",
    education: "Master / BS Honors",
    seats: "210+ Posts"
  },
  {
    id: "gov-5",
    title: "BPSC Assistant Commissioners & Section Officers Recruitment",
    department: "Balochistan Public Service Commission (BPSC)",
    category: "Government",
    province: "Balochistan",
    lastDate: "2026-04-10",
    officialUrl: "https://bpsc.gob.pk/",
    testingAgency: "Official Portal",
    education: "Graduation (2nd Div)",
    seats: "95 Posts"
  },
  {
    id: "gov-6",
    title: "National Job Portal (NJP) - 1,200+ Regular Federal Vacancies",
    department: "Ministry of Federal Education & IT, Islamabad",
    category: "Government",
    province: "Federal",
    lastDate: "2026-03-31",
    officialUrl: "https://njp.gov.pk/",
    testingAgency: "Official Portal",
    isHot: true,
    education: "Matric, Inter, BS, MS",
    seats: "1,200+ Posts"
  },
  {
    id: "gov-7",
    title: "Pakistan Atomic Energy Commission (PAEC) Scientists & Jr Executives",
    department: "Public Sector Scientific Organization (PAEC/NESCOM)",
    category: "Government",
    province: "Federal",
    lastDate: "2026-03-26",
    officialUrl: "https://www.techandresearch.com/",
    testingAgency: "Official Portal",
    isHot: true,
    education: "DAE / BE / BSc / BCS",
    seats: "150+ Posts"
  },

  // 2. Forces & Police
  {
    id: "force-1",
    title: "Join Pak Army PMA Long Course 156 (Regular Commissioned Officers)",
    department: "Pakistan Army Selection & Recruitment",
    category: "Forces & Police",
    province: "Federal",
    lastDate: "2026-04-15",
    officialUrl: "https://www.joinpakarmy.gov.pk/",
    testingAgency: "Official Portal",
    isHot: true,
    education: "FA / FSc / ICS / A-Level",
    seats: "Open Merit Pakistan"
  },
  {
    id: "force-2",
    title: "Pakistan Air Force (PAF) Commissioned Officers & Airmen Induction",
    department: "PAF Information & Selection Centres",
    category: "Forces & Police",
    province: "Federal",
    lastDate: "2026-04-02",
    officialUrl: "http://joinpaf.gov.pk/",
    testingAgency: "Official Portal",
    isHot: true,
    education: "Matric / FSc (Pre-Eng)",
    seats: "GDP, CAE, Admin"
  },
  {
    id: "force-3",
    title: "Join Pakistan Navy as Sailor (Batch 2026-B) & Civilian Staff",
    department: "Pakistan Navy Recruitment Directorate",
    category: "Forces & Police",
    province: "Federal",
    lastDate: "2026-03-29",
    officialUrl: "https://www.joinpaknavy.gov.pk/",
    testingAgency: "Official Portal",
    education: "Matric Science / FSc",
    seats: "Multiple Branches"
  },
  {
    id: "force-4",
    title: "Punjab Police Constable & Lady Constable (Phase-II) Recruitment",
    department: "Punjab Police Department / CTS / PTS",
    category: "Forces & Police",
    province: "Punjab",
    lastDate: "2026-03-27",
    officialUrl: "https://punjabpolice.gov.pk/",
    testingAgency: "Official Portal",
    isHot: true,
    education: "Matriculation (50%)",
    seats: "4,500+ Posts"
  },
  {
    id: "force-5",
    title: "Sindh Police SSU Commando & Wireless Operator Jobs (STS IBA Sukkur)",
    department: "Sindh Police Specialized Units",
    category: "Forces & Police",
    province: "Sindh",
    lastDate: "2026-04-08",
    officialUrl: "https://apply.sts.net.pk/",
    testingAgency: "NTS",
    education: "Matric / Intermediate",
    seats: "2,200+ Posts"
  },
  {
    id: "force-6",
    title: "Anti Narcotics Force (ANF) Sub Inspector & ASI Recruitment 2026",
    department: "Ministry of Narcotics Control",
    category: "Forces & Police",
    province: "Federal",
    lastDate: "2026-04-01",
    officialUrl: "https://www.anf.gov.pk/",
    testingAgency: "PTS",
    education: "FA / FSc / BA",
    seats: "380 Posts"
  },

  // 3. Private & Banking
  {
    id: "bank-1",
    title: "State Bank of Pakistan (SBP) State Bank Officers Training Scheme (SBOTS 26th Batch)",
    department: "State Bank of Pakistan / SBP BSC",
    category: "Private & Banking",
    province: "Federal",
    lastDate: "2026-03-31",
    officialUrl: "https://www.sbp.org.pk/careers/",
    testingAgency: "NTS",
    isHot: true,
    education: "16 Years Master / BS",
    seats: "OG-2 Grade"
  },
  {
    id: "bank-2",
    title: "National Bank of Pakistan (NBP) Cash Officers & Branch Managers",
    department: "National Bank of Pakistan (NBP)",
    category: "Private & Banking",
    province: "Punjab",
    lastDate: "2026-04-04",
    officialUrl: "https://www.nbp.com.pk/careers",
    testingAgency: "Official Portal",
    isHot: true,
    education: "B.Com / BBA / BS",
    seats: "Across Pakistan"
  },
  {
    id: "bank-3",
    title: "Habib Bank Limited (HBL) Management Trainee Officers (MTO 2026)",
    department: "HBL Talent Acquisition",
    category: "Private & Banking",
    province: "Sindh",
    lastDate: "2026-04-12",
    officialUrl: "https://www.hblpeople.com/",
    testingAgency: "Official Portal",
    education: "MBA / MS / BS (CGPA 3.0+)",
    seats: "Pan Pakistan"
  },
  {
    id: "bank-4",
    title: "Bank of Punjab (BOP) Agricultural Credit Officers & Relationship Managers",
    department: "The Bank of Punjab",
    category: "Private & Banking",
    province: "Punjab",
    lastDate: "2026-03-25",
    officialUrl: "https://www.bop.com.pk/careers",
    testingAgency: "Official Portal",
    education: "BSc Agri / BBA / M.Com",
    seats: "120+ Posts"
  },

  // 4. Results & Merit Lists
  {
    id: "res-1",
    title: "FPSC General Recruitment Written Test Results (Consolidated 2025/2026)",
    department: "Federal Public Service Commission",
    category: "Results & Merit Lists",
    province: "Federal",
    lastDate: "Live Result",
    officialUrl: "https://fpsc.gov.pk/results/general-recruitment",
    testingAgency: "FPSC",
    isHot: true,
    education: "All Candidates",
    seats: "Merit Lists Out"
  },
  {
    id: "res-2",
    title: "PPSC Final Merit Lists & Recommendation Status (Educators & Sub Inspectors)",
    department: "Punjab Public Service Commission",
    category: "Results & Merit Lists",
    province: "Punjab",
    lastDate: "Live Result",
    officialUrl: "https://www.ppsc.gop.pk/(S(123))/FinalResults.aspx",
    testingAgency: "PPSC",
    isHot: true,
    education: "Interviews Completed",
    seats: "Final Orders"
  },
  {
    id: "res-3",
    title: "NTS NAT & GAT 2026 Test Results and Answer Keys Released",
    department: "National Testing Service Pakistan",
    category: "Results & Merit Lists",
    province: "Federal",
    lastDate: "Live Result",
    officialUrl: "https://www.nts.org.pk/new/results.php",
    testingAgency: "NTS",
    education: "Roll No Wise",
    seats: "Card / Score"
  },
  {
    id: "res-4",
    title: "HEC Law Admission Test (LAT) & USAT Official Result Gazettes",
    department: "Higher Education Commission (HEC ETC Portal)",
    category: "Results & Merit Lists",
    province: "Federal",
    lastDate: "Live Result",
    officialUrl: "https://etc.hec.gov.pk/",
    testingAgency: "HEC / Gov",
    education: "Score Cards Live",
    seats: "Online Portal"
  },

  // 5. Roll No Slips & Admit Cards
  {
    id: "roll-1",
    title: "Download FPSC CSS Written Exam 2026 Admission Certificates",
    department: "Federal Public Service Commission",
    category: "Roll No & Admit Cards",
    province: "Federal",
    lastDate: "Download Slip",
    officialUrl: "https://online.fpsc.gov.pk/fpsc/css/css_ac.php",
    testingAgency: "FPSC",
    isHot: true,
    education: "CNIC Based Verification",
    seats: "Center Allotment"
  },
  {
    id: "roll-2",
    title: "PPSC Online Admission Letter / Roll Number Slip Print 2026",
    department: "Punjab Public Service Commission",
    category: "Roll No & Admit Cards",
    province: "Punjab",
    lastDate: "Download Slip",
    officialUrl: "https://www.ppsc.gop.pk/(S(123))/admitcard.aspx",
    testingAgency: "PPSC",
    isHot: true,
    education: "Enter CNIC & Post",
    seats: "Exam Slips"
  },
  {
    id: "roll-3",
    title: "NTS Candidate Roll Number Slips & Test Centre Details",
    department: "National Testing Service",
    category: "Roll No & Admit Cards",
    province: "Federal",
    lastDate: "Download Slip",
    officialUrl: "https://www.nts.org.pk/new/rollnoslips.php",
    testingAgency: "NTS",
    education: "All Active Tests",
    seats: "Printable PDF"
  },
  {
    id: "roll-4",
    title: "Open Testing Service (OTS) & PTS Roll No Slip Portal",
    department: "OTS / PTS Pakistan",
    category: "Roll No & Admit Cards",
    province: "Federal",
    lastDate: "Download Slip",
    officialUrl: "https://ots.org.pk/",
    testingAgency: "OTS",
    education: "CNIC Entry",
    seats: "Exam Slip"
  },

  // 6. Scholarships & Schemes
  {
    id: "sch-1",
    title: "BISP Benazir Taleemi Wazaif & Nashonuma 2026 Program",
    department: "Benazir Income Support Programme (BISP 8171)",
    category: "Scholarships & Schemes",
    province: "Federal",
    lastDate: "Ongoing 2026",
    officialUrl: "https://8171.bisp.gov.pk/",
    testingAgency: "HEC / Gov",
    isHot: true,
    education: "Primary to Higher Secondary",
    seats: "Monthly Stipend"
  },
  {
    id: "sch-2",
    title: "HEC Indigenous & Overseas PhD / MS Scholarships Batch 2026-27",
    department: "Higher Education Commission (HEC)",
    category: "Scholarships & Schemes",
    province: "Federal",
    lastDate: "2026-04-20",
    officialUrl: "https://hec.gov.pk/english/scholarships/Pages/default.aspx",
    testingAgency: "HEC / Gov",
    isHot: true,
    education: "16 Years Master / MPhil",
    seats: "Fully Funded"
  },
  {
    id: "sch-3",
    title: "Punjab Educational Endowment Fund (PEEF) Special Quota Scholarships",
    department: "PEEF Government of Punjab",
    category: "Scholarships & Schemes",
    province: "Punjab",
    lastDate: "2026-04-10",
    officialUrl: "https://www.peef.org.pk/",
    testingAgency: "HEC / Gov",
    education: "Matric & Inter Pass",
    seats: "Monthly Merit Aid"
  },
  {
    id: "sch-4",
    title: "Chief Minister Punjab Honahar Undergraduate Scholarship Scheme",
    department: "Higher Education Department Punjab",
    category: "Scholarships & Schemes",
    province: "Punjab",
    lastDate: "2026-03-31",
    officialUrl: "https://honaharscholarship.punjabhec.gov.pk/",
    testingAgency: "HEC / Gov",
    isHot: true,
    education: "University Undergraduate",
    seats: "30,000 Students"
  }
];

// Official Testing Services & Portals Quick Links
const OFFICIAL_PORTALS = [
  { name: "National Job Portal (NJP)", url: "https://njp.gov.pk/", tag: "Federal Govt Portal", color: "from-emerald-600 to-green-600" },
  { name: "FPSC Portal", url: "https://fpsc.gov.pk/", tag: "Federal Commission", color: "from-blue-600 to-indigo-600" },
  { name: "PPSC Portal", url: "https://www.ppsc.gop.pk/", tag: "Punjab Commission", color: "from-cyan-600 to-teal-600" },
  { name: "SPSC Portal", url: "https://spsc.gos.pk/", tag: "Sindh Commission", color: "from-amber-600 to-rose-600" },
  { name: "KPPSC Portal", url: "https://www.kppsc.gov.pk/", tag: "KPK Commission", color: "from-purple-600 to-pink-600" },
  { name: "NTS Pakistan", url: "https://www.nts.org.pk/", tag: "National Testing", color: "from-rose-600 to-red-600" },
  { name: "BISP 8171 Portal", url: "https://8171.bisp.gov.pk/", tag: "Ehsaas / BISP", color: "from-emerald-700 to-teal-800" },
  { name: "HEC ETC Portal", url: "https://etc.hec.gov.pk/", tag: "Education Testing", color: "from-slate-700 to-slate-900" }
];

export default function PakistanJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProvince, setSelectedProvince] = useState<string>("All");

  const categories = [
    "All",
    "Government",
    "Forces & Police",
    "Private & Banking",
    "Results & Merit Lists",
    "Roll No & Admit Cards",
    "Scholarships & Schemes"
  ];

  const provinces = ["All", "Federal", "Punjab", "Sindh", "KPK", "Balochistan", "AJK / GB"];

  const filteredJobs = useMemo(() => {
    return PAKISTAN_JOBS_DATA.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.testingAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.education.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
      const matchesProvince = selectedProvince === "All" || job.province === selectedProvince;

      return matchesSearch && matchesCategory && matchesProvince;
    });
  }, [searchQuery, selectedCategory, selectedProvince]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Latest Pakistan Jobs, Results & Admit Cards 2026",
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Group into 3 responsive columns
  const latestGovtJobs = PAKISTAN_JOBS_DATA.filter(j => j.category === "Government").slice(0, 7);
  const latestForcesJobs = PAKISTAN_JOBS_DATA.filter(j => j.category === "Forces & Police").slice(0, 7);
  const latestResults = PAKISTAN_JOBS_DATA.filter(j => j.category === "Results & Merit Lists").slice(0, 7);
  const latestRollNos = PAKISTAN_JOBS_DATA.filter(j => j.category === "Roll No & Admit Cards").slice(0, 7);
  const latestScholarships = PAKISTAN_JOBS_DATA.filter(j => j.category === "Scholarships & Schemes").slice(0, 7);
  const latestBanking = PAKISTAN_JOBS_DATA.filter(j => j.category === "Private & Banking").slice(0, 7);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <ToolPageHeader toolName="Pakistan Jobs & Results Portal" onShare={handleShare} />

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2340] via-[#0f172a] to-[#064e3b] border border-emerald-500/30 p-6 sm:p-10 shadow-2xl text-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 animate-pulse">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Official Government & Testing Portals</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Pakistan Latest Jobs, Results & Admit Cards
            </h1>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              No fake or third-party ads. Direct links to <strong className="text-emerald-300">FPSC, PPSC, SPSC, KPPSC, NTS, SBP, Pak Army, Navy & PAF</strong> official application portals.
            </p>

            {/* Live Search Box */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search by Post, FPSC, PPSC, NTS, Police, Army, Bank..."
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

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => { setSelectedCategory("Government"); setSelectedProvince("All"); }}
                className="px-4 py-1.5 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-emerald-400" /> Latest Govt Jobs
              </button>
              <button
                onClick={() => { setSelectedCategory("Forces & Police"); setSelectedProvince("All"); }}
                className="px-4 py-1.5 rounded-full bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Forces & Police
              </button>
              <button
                onClick={() => { setSelectedCategory("Results & Merit Lists"); setSelectedProvince("All"); }}
                className="px-4 py-1.5 rounded-full bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-purple-400" /> Results / Merit Lists
              </button>
              <button
                onClick={() => { setSelectedCategory("Roll No & Admit Cards"); setSelectedProvince("All"); }}
                className="px-4 py-1.5 rounded-full bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" /> Roll No Slips
              </button>
            </div>
          </div>
        </div>

        {/* Infinite Live News Marquee */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 overflow-hidden flex items-center gap-3">
          <span className="flex items-center gap-1 bg-rose-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md">
            <Flame className="w-3.5 h-3.5 animate-bounce" /> LIVE UPDATES:
          </span>
          <div className="overflow-x-auto whitespace-nowrap flex items-center gap-4 text-xs font-medium text-slate-300 scrollbar-none py-1">
            <a href="https://online.fpsc.gov.pk/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              🔥 <span>FPSC Cons. Adv 04/2026 Online Application Open</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href="https://www.joinpakarmy.gov.pk/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              ⭐ <span>Pak Army PMA 156 Long Course Registration Started</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href="https://www.ppsc.gop.pk/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              📢 <span>PPSC Educators & Tehsildar Merit Lists Announced</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href="https://www.sbp.org.pk/careers/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              💼 <span>State Bank SBP SBOTS 26th Batch Apply via NTS</span>
            </a>
            <span className="text-slate-600">•</span>
            <a href="https://8171.bisp.gov.pk/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              🎓 <span>BISP 8171 Taleemi Wazaif Portal Open for 2026</span>
            </a>
          </div>
        </div>

        {/* 8 Official Pakistan Govt Testing Portals Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              Direct Official Pakistani Testing & Recruitment Portals
            </h3>
            <span className="text-xs text-slate-500">Always Free & Authentic</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {OFFICIAL_PORTALS.map((portal) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all transform hover:-translate-y-0.5 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 font-mono text-[10px]">
                      {portal.tag}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-emerald-300 transition">
                    {portal.name}
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 font-medium flex items-center gap-1">
                  Visit Official Link ➜
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* 3-Column Card Layout */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-emerald-400" />
                Featured Pakistani Job Sectors
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Organized by department with verified deadline, eligibility, and direct apply link.
              </p>
            </div>

            {/* Province Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 whitespace-nowrap">Filter Province:</span>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                {provinces.map(prov => (
                  <option key={prov} value={prov}>{prov === "All" ? "All Pakistan" : prov}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* COLUMN 1: LATEST GOVERNMENT JOBS */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-emerald-800 to-teal-700 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Latest Government Jobs
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">FPSC / PPSC</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-2">
                {latestGovtJobs
                  .filter(j => selectedProvince === "All" || j.province === selectedProvince)
                  .map((job) => (
                    <div key={job.id} className="pt-2 first:pt-0 group">
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={job.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 leading-snug transition flex items-start gap-1.5"
                        >
                          <span className="text-emerald-500 font-bold">➢</span>
                          <span>{job.title}</span>
                        </a>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400 font-mono">
                          <Clock className="w-3 h-3" /> Last Date: {job.lastDate}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <button
                  onClick={() => setSelectedCategory("Government")}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center justify-center gap-1 w-full"
                >
                  View All Govt Jobs ({PAKISTAN_JOBS_DATA.filter(j => j.category === "Government").length}) ➜
                </button>
              </div>
            </div>

            {/* COLUMN 2: FORCES & POLICE JOBS */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-blue-800 to-indigo-700 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Armed Forces & Police
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Army/PAF/Police</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-2">
                {latestForcesJobs
                  .filter(j => selectedProvince === "All" || j.province === selectedProvince)
                  .map((job) => (
                    <div key={job.id} className="pt-2 first:pt-0 group">
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={job.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-slate-200 group-hover:text-blue-400 leading-snug transition flex items-start gap-1.5"
                        >
                          <span className="text-blue-500 font-bold">➢</span>
                          <span>{job.title}</span>
                        </a>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1 text-blue-400 font-mono">
                          <Clock className="w-3 h-3" /> Last Date: {job.lastDate}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <button
                  onClick={() => setSelectedCategory("Forces & Police")}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline flex items-center justify-center gap-1 w-full"
                >
                  View All Forces & Police Jobs ({PAKISTAN_JOBS_DATA.filter(j => j.category === "Forces & Police").length}) ➜
                </button>
              </div>
            </div>

            {/* COLUMN 3: RESULTS & MERIT LISTS */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-purple-800 to-pink-700 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4" /> Results & Merit Lists
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Gazette Out</span>
              </div>

              <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-2">
                {latestResults
                  .filter(j => selectedProvince === "All" || j.province === selectedProvince)
                  .map((job) => (
                    <div key={job.id} className="pt-2 first:pt-0 group">
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={job.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-slate-200 group-hover:text-purple-400 leading-snug transition flex items-start gap-1.5"
                        >
                          <span className="text-purple-500 font-bold">➢</span>
                          <span>{job.title}</span>
                        </a>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {job.department}
                        </span>
                        <span className="text-purple-400 font-semibold text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10">
                          {job.seats}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
                <button
                  onClick={() => setSelectedCategory("Results & Merit Lists")}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline flex items-center justify-center gap-1 w-full"
                >
                  View All Results & Gazettes ➜
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2nd Row of Columns: Roll No Slips, Banking & Scholarships */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">

          {/* COLUMN 4: ROLL NO SLIPS / ADMIT CARDS */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            <div className="bg-gradient-to-r from-amber-700 to-orange-700 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Roll No Slips / Admit Cards
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">Download</span>
            </div>

            <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-2">
              {latestRollNos.map((job) => (
                <div key={job.id} className="pt-2 first:pt-0 group">
                  <a
                    href={job.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-200 group-hover:text-amber-400 leading-snug transition flex items-start gap-1.5"
                  >
                    <span className="text-amber-500 font-bold">➢</span>
                    <span>{job.title}</span>
                  </a>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{job.department}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
              <button
                onClick={() => setSelectedCategory("Roll No & Admit Cards")}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center justify-center gap-1 w-full"
              >
                All Admit Cards & Slips ➜
              </button>
            </div>
          </div>

          {/* COLUMN 5: BANKING & CORPORATE */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            <div className="bg-gradient-to-r from-teal-800 to-cyan-700 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Banking & Private Jobs
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">SBP / HBL</span>
            </div>

            <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-2">
              {latestBanking.map((job) => (
                <div key={job.id} className="pt-2 first:pt-0 group">
                  <a
                    href={job.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-200 group-hover:text-teal-400 leading-snug transition flex items-start gap-1.5"
                  >
                    <span className="text-teal-500 font-bold">➢</span>
                    <span>{job.title}</span>
                  </a>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{job.department}</span>
                    <span className="text-teal-400 font-mono">• Last: {job.lastDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
              <button
                onClick={() => setSelectedCategory("Private & Banking")}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 hover:underline flex items-center justify-center gap-1 w-full"
              >
                All Banking & Corporate Jobs ➜
              </button>
            </div>
          </div>

          {/* COLUMN 6: SCHOLARSHIPS & BISP SCHEMES */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 py-3 text-white font-bold text-sm tracking-wide flex items-center justify-between">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Govt Scholarships & Schemes
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">HEC / BISP</span>
            </div>

            <div className="p-3 divide-y divide-slate-800/60 flex-grow space-y-2">
              {latestScholarships.map((job) => (
                <div key={job.id} className="pt-2 first:pt-0 group">
                  <a
                    href={job.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 leading-snug transition flex items-start gap-1.5"
                  >
                    <span className="text-emerald-400 font-bold">➢</span>
                    <span>{job.title}</span>
                  </a>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{job.department}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
              <button
                onClick={() => setSelectedCategory("Scholarships & Schemes")}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center justify-center gap-1 w-full"
              >
                All Scholarships & Schemes ➜
              </button>
            </div>
          </div>

        </div>

        {/* Master Job Explorer List with Filters & Search */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-400" />
                Live Vacancies Directory ({filteredJobs.length} Posts)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Filtered search across all verified government ministries, commissions, and testing bodies.
              </p>
            </div>

            {/* Category Pills */}
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

          {/* List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="py-3 px-3">Job Designation / Advertisement</th>
                  <th className="py-3 px-3 min-w-[150px]">Department</th>
                  <th className="py-3 px-3 min-w-[120px]">Eligibility / Edu</th>
                  <th className="py-3 px-3 min-w-[110px]">Testing Agency</th>
                  <th className="py-3 px-3 min-w-[110px]">Province</th>
                  <th className="py-3 px-3 min-w-[100px]">Deadline</th>
                  <th className="py-3 px-3 text-right">Apply Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500">
                      No jobs matched your search criteria. Try resetting the filters.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/40 transition group">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {job.isHot && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                              HOT
                            </span>
                          )}
                          <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition">
                            {job.title}
                          </span>
                        </div>
                        {job.seats && (
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Vacancies: {job.seats}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {job.department}
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 text-[11px]">
                          {job.education}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono text-emerald-400 font-semibold">
                          {job.testingAgency}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-300 text-[11px]">
                          {job.province}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-300">
                        {job.lastDate}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <a
                          href={job.officialUrl}
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

        {/* Guidance for Pakistani Job Applicants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <BadgeCheck className="w-4 h-4" />
              <span>1. Verify Official Portals</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never pay fee on private bank accounts. All fee deposits are only via 1Link PSID or National Bank (NBP) government challans.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <FileText className="w-4 h-4" />
              <span>2. CNIC & Documents Prep</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure your Domicile, PRC, Degree Equivalence (HEC/IBCC) and CNIC are up to date before applying on FPSC or PPSC.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Award className="w-4 h-4" />
              <span>3. Regular Roll No Check</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Testing agencies like NTS, PTS and commissions do not send physical letters; download admit cards directly from their roll number slip portals.
            </p>
          </div>
        </div>

      </div>
      </main>
      
      {/* SEO, How-to Guide & FAQ Section */}
      <ToolGuideSection
        toolName="Pakistan Jobs & Testing Portals Guide"
        theme="dark"
        about="Ansar Tools Pakistan Jobs Portal Guide centralizes verified testing agencies, public service commissions, and federal recruitment opportunities across Pakistan. Covering FPSC, PPSC, SPSC, KPPSC, NTS, OTS, and armed forces inductions, it provides syllabus breakdowns, roll number slip lookups, and result verification links in one organized directory."
        howToUseTitle="How do I find government jobs and download roll number slips?"
        steps={[{"title":"Browse By Testing Commission","description":"Filter recruitment notices across Federal (FPSC, NTS), Punjab (PPSC), Sindh (SPSC), or Khyber Pakhtunkhwa (KPPSC)."},{"title":"Check Eligibility & Application Deadlines","description":"Review required qualifications, age limits, provincial quotas, and chalans before applying."},{"title":"Download Syllabus & Challan Forms","description":"Access verified syllabus PDFs, past paper formats, and official National Bank challan receipts."},{"title":"Track Test Slips & Results","description":"Use direct portal links to access candidate admission certificates, exam centers, and merit interview lists."}]}
        faqs={[{"question":"How do I download my roll number slip for NTS or PPSC exams?","answer":"Use our direct testing agency links, enter your 13-digit CNIC on the official portal, and download your printable admission certificate."},{"question":"Are private and military recruitment notices included?","answer":"Yes. The guide tracks Pakistan Army, Navy, PAF civilian vacancies, state-owned enterprises, and bank recruitment drives."},{"question":"Does Ansar Tools charge any application processing fee?","answer":"No. Ansar Tools is 100% free. All fee payments must be made via official agency challans at designated NBP or online banking channels."},{"question":"How often are job circulars and test schedules updated?","answer":"Portal directories and links are reviewed on an ongoing basis to ensure direct links to official commission job announcements remain functional."}]}
      />

      <Footer />
    </div>
  );
}
