'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ToolPageHeader from '@/components/ToolPageHeader';
import Footer from '@/components/Footer';
import {
  Calculator,
  CheckCircle2,
  Copy,
  Printer,
  RotateCcw,
  Zap,
  Compass,
  Layers
} from 'lucide-react';

interface Preset {
  name: string;
  desc: string;
  baseline: number;
  ratio: number;
  growth: number;
  contingency: number;
  income: number;
  price: number;
  conversion: number;
  workingDays: number;
}

const PRESETS: Preset[] = [
  {
    name: 'Apna Kamao Benchmark',
    desc: 'Average local Pakistani freelancer',
    baseline: 85000,
    ratio: 50,
    growth: 28000,
    contingency: 10,
    income: 20000,
    price: 50000,
    conversion: 10,
    workingDays: 24
  },
  {
    name: 'Web & Shopify Dev',
    desc: 'High ticket international websites',
    baseline: 120000,
    ratio: 70,
    growth: 60000,
    contingency: 15,
    income: 45000,
    price: 100000,
    conversion: 8,
    workingDays: 22
  },
  {
    name: 'Video Editor & Motion',
    desc: 'Retainer editing for YouTube & Reels',
    baseline: 90000,
    ratio: 60,
    growth: 35000,
    contingency: 10,
    income: 25000,
    price: 45000,
    conversion: 12,
    workingDays: 25
  },
  {
    name: 'Digital Marketing & SEO',
    desc: 'Monthly retainer clients for Meta/Google Ads',
    baseline: 150000,
    ratio: 80,
    growth: 80000,
    contingency: 15,
    income: 60000,
    price: 80000,
    conversion: 10,
    workingDays: 24
  }
];

export default function ClientsFinancialCalculatorPage() {
  // Inputs
  const [baseline, setBaseline] = useState<number>(85000);
  const [ratio, setRatio] = useState<number>(50);
  const [growth, setGrowth] = useState<number>(28000);
  const [contingency, setContingency] = useState<number>(10);
  const [income, setIncome] = useState<number>(20000);
  const [price, setPrice] = useState<number>(50000);
  const [conversion, setConversion] = useState<number>(10);
  const [workingDays, setWorkingDays] = useState<number>(24);

  // Currency Selection
  const [currency, setCurrency] = useState<'PKR' | 'USD' | 'AED' | 'SAR' | 'INR'>('PKR');
  const [copied, setCopied] = useState<boolean>(false);

  // Currency Symbol
  const currencySymbol = useMemo(() => {
    switch (currency) {
      case 'PKR': return 'Rs. ';
      case 'USD': return '$ ';
      case 'AED': return 'AED ';
      case 'SAR': return 'SAR ';
      case 'INR': return '₹ ';
      default: return 'Rs. ';
    }
  }, [currency]);

  // Formatters
  const formatMoney = (n: number) => {
    return currencySymbol + Math.round(isFinite(n) ? n : 0).toLocaleString('en-US');
  };

  const formatNum = (n: number) => {
    return Math.round(isFinite(n) ? n : 0).toLocaleString('en-US');
  };

  // Calculation Engine
  const stats = useMemo(() => {
    const baseVal = Number(baseline) || 0;
    const ratioVal = Number(ratio) || 0;
    const growthVal = Number(growth) || 0;
    const contingencyVal = Number(contingency) || 0;
    const currentInc = Number(income) || 0;
    const priceVal = Math.max(Number(price) || 1, 1);
    const convVal = Math.max(Number(conversion) || 1, 1);
    const daysVal = Math.max(Number(workingDays) || 1, 1);

    const responsibility = baseVal * (ratioVal / 100);
    const subtotal = responsibility + growthVal;
    const bufferAmount = subtotal * (contingencyVal / 100);
    const targetIncome = subtotal + bufferAmount;

    const incomeGap = Math.max(targetIncome - currentInc, 0);
    const clientsNeeded = incomeGap > 0 ? Math.ceil(incomeGap / priceVal) : 0;

    const newClientRevenue = clientsNeeded * priceVal;
    const surplus = incomeGap > 0 ? newClientRevenue - incomeGap : currentInc - targetIncome;
    const totalProjectedIncome = currentInc + newClientRevenue;

    const leadsRequired = clientsNeeded > 0 ? Math.ceil(clientsNeeded / (convVal / 100)) : 0;
    const dailyLeads = leadsRequired > 0 ? Math.ceil(leadsRequired / daysVal) : 0;

    const clientImpact = priceVal;
    const coverage = targetIncome > 0 ? (currentInc / targetIncome) * 100 : 0;

    // Percent Breakdown
    const respPct = targetIncome > 0 ? (responsibility / targetIncome) * 100 : 0;
    const growthPct = targetIncome > 0 ? (growthVal / targetIncome) * 100 : 0;
    const bufferPct = targetIncome > 0 ? (bufferAmount / targetIncome) * 100 : 0;

    return {
      responsibility,
      bufferAmount,
      targetIncome,
      incomeGap,
      clientsNeeded,
      newClientRevenue,
      surplus,
      totalProjectedIncome,
      leadsRequired,
      dailyLeads,
      clientImpact,
      coverage,
      respPct,
      growthPct,
      bufferPct
    };
  }, [baseline, ratio, growth, contingency, income, price, conversion, workingDays]);

  const handleApplyPreset = (p: Preset) => {
    setBaseline(p.baseline);
    setRatio(p.ratio);
    setGrowth(p.growth);
    setContingency(p.contingency);
    setIncome(p.income);
    setPrice(p.price);
    setConversion(p.conversion);
    setWorkingDays(p.workingDays);
  };

  const handleReset = () => {
    handleApplyPreset(PRESETS[0]);
  };

  const handleCopySummary = () => {
    const text = `--- CLIENTS FINANCIAL FREEDOM BLUEPRINT ---
Monthly Target Income: ${formatMoney(stats.targetIncome)}
Current Reliable Income: ${formatMoney(income)}
Monthly Income Gap: ${formatMoney(stats.incomeGap)}
Average Price Per Client: ${formatMoney(price)}

CLIENTS NEEDED: ${formatNum(stats.clientsNeeded)} Client(s)
Revenue from New Clients: ${formatMoney(stats.newClientRevenue)}
Estimated Monthly Surplus Cash: ${formatMoney(stats.surplus)}
Total Projected Monthly Income: ${formatMoney(stats.totalProjectedIncome)}

OUTREACH TARGETS:
Conversion Rate: ${conversion}%
Total Leads Required: ${formatNum(stats.leadsRequired)} Leads / month
Daily Outreach Goal: ${formatNum(stats.dailyLeads)} Leads / working day (${workingDays} days/mo)
Calculated via Multi-Tool Web App (Inspired by Apna Kamao)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        <ToolPageHeader toolName="Clients & Financial Freedom Calculator" theme="dark" />
      </div>

      {/* Background Decorative Glow */}
      <div className="fixed top-0 right-0 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40 z-0" />
      <div className="fixed bottom-0 left-0 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40 z-0" />

      {/* Header Section */}
      <header className="relative z-10 pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-teal-500/5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            Apna Kamao Clients Financial Calculator
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Calculate How Many Clients You Need to Reach{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
              Financial Independence
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Enter your household responsibility, monthly growth goal, current income, service price, and outreach numbers. 
            This calculator will show your income gap, clients needed, surplus cash, and the activity required to reach your monthly target.
          </p>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
              <strong className="block text-white text-lg sm:text-xl font-extrabold">{currency}</strong>
              <span className="text-[11px] text-slate-400 font-medium">Pakistan-Focused</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
              <strong className="block text-teal-400 text-lg sm:text-xl font-extrabold">Live</strong>
              <span className="text-[11px] text-slate-400 font-medium">Instant Results</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
              <strong className="block text-emerald-400 text-lg sm:text-xl font-extrabold">Clients</strong>
              <span className="text-[11px] text-slate-400 font-medium">Action-Based Planning</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
              <strong className="block text-cyan-400 text-lg sm:text-xl font-extrabold">Free</strong>
              <span className="text-[11px] text-slate-400 font-medium">For Entrepreneurs</span>
            </div>
          </div>

          {/* Presets & Currency Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/80 text-left">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 mr-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Presets:
              </span>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-medium transition-all flex-shrink-0"
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-bold px-2">Currency:</span>
              {(['PKR', 'USD', 'AED', 'SAR', 'INR'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    currency === c ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =============================================================== */}
          {/* LEFT COLUMN: FINANCIAL BLUEPRINT INPUTS (5 cols)                 */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
            
            {/* Title Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-teal-400" />
                  Your Financial Blueprint
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add your monthly numbers below. The calculator will convert your goal into clients and action steps.
                </p>
              </div>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700"
                title="Reset to benchmark"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Inputs Form */}
            <div className="space-y-4">
              
              {/* 1. Household Survival Baseline */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span>Household Survival Baseline</span>
                  <span className="text-slate-400 font-mono text-[11px]">{currency} / Month</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={baseline}
                    onChange={(e) => setBaseline(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    {currencySymbol}
                  </span>
                </div>
              </div>

              {/* 2. Your Responsibility Ratio (%) */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span>Your Responsibility Ratio</span>
                  <span className="text-teal-400 font-mono text-[11px] font-bold">{ratio}%</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={ratio}
                    onChange={(e) => setRatio(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                    <span>0% (No burden)</span>
                    <span>50% (Shared)</span>
                    <span>100% (Sole breadwinner)</span>
                  </div>
                </div>
              </div>

              {/* 3. Personal Growth Goal */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span>Personal Growth Goal (Savings/Investments)</span>
                  <span className="text-slate-400 font-mono text-[11px]">{currency} / Month</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={growth}
                    onChange={(e) => setGrowth(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    {currencySymbol}
                  </span>
                </div>
              </div>

              {/* 4. Emergency / Contingency Buffer (%) */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span>Emergency / Contingency Buffer</span>
                  <span className="text-slate-400 font-mono text-[11px]">%</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={contingency}
                    onChange={(e) => setContingency(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    %
                  </span>
                </div>
              </div>

              {/* 5. Current Reliable Income */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span>Current Reliable Income</span>
                  <span className="text-slate-400 font-mono text-[11px]">{currency} / Month</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    {currencySymbol}
                  </span>
                </div>
              </div>

              {/* 6. Average Price Per Client */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span>Average Price Per Client</span>
                  <span className="text-teal-400 font-mono text-[11px] font-bold">Package Price</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    {currencySymbol}
                  </span>
                </div>
              </div>

              {/* 7. Lead-to-Client Conversion Rate (%) */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span>Lead-to-Client Conversion Rate</span>
                  <span className="text-slate-400 font-mono text-[11px]">%</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={conversion}
                    onChange={(e) => setConversion(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    %
                  </span>
                </div>
              </div>

              {/* 8. Working Days Per Month */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span>Working Days Per Month</span>
                  <span className="text-slate-400 font-mono text-[11px]">Days</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    step="1"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    Days
                  </span>
                </div>
              </div>

            </div>

            {/* Pro Tip Box */}
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-300 leading-relaxed">
              <strong className="text-teal-400 block mb-1">💡 Apna Kamao Strategy:</strong>
              Apni service ka realistic package price select karein. Agar clients ki tadaad bohat zyada lag rahi hai to low-paying clients ke bajaye apni skill upgrade karke high-ticket packages offer karein.
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: LIVE RESULTS, FORMULAS & ACTION PLAN (7 cols)      */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Live Calculation Results</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* 9 Live Results Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* 1. Monthly Target Income (Highlighted) */}
              <div className="sm:col-span-2 relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 text-slate-950 shadow-xl shadow-teal-500/10 border border-teal-400/30">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900/80 block mb-1">
                  Monthly Target Income
                </span>
                <strong className="text-3xl sm:text-4xl font-black block text-slate-950 tracking-tight">
                  {formatMoney(stats.targetIncome)}
                </strong>
                <small className="text-[11px] font-bold text-slate-900/70 block mt-1">
                  Responsibility ({formatMoney(stats.responsibility)}) + Growth + Buffer
                </small>
              </div>

              {/* 2. Income Gap */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Monthly Income Gap</span>
                  <strong className={`text-2xl font-black block ${stats.incomeGap > 0 ? 'text-amber-400' : 'text-teal-400'}`}>
                    {formatMoney(stats.incomeGap)}
                  </strong>
                </div>
                <small className="text-[11px] text-slate-500 block">Target minus reliable income</small>
              </div>

              {/* 3. Clients Needed (Highlighted) */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-teal-500/40 bg-teal-500/5">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">Clients Needed</span>
                <strong className="text-3xl font-black text-white block">
                  {formatNum(stats.clientsNeeded)} <span className="text-sm font-normal text-slate-400">Clients</span>
                </strong>
                <small className="text-[11px] text-slate-400 block mt-1">Rounded up to whole client</small>
              </div>

              {/* 4. Monthly Surplus Cash */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Monthly Surplus Cash</span>
                <strong className="text-2xl font-black text-emerald-400 block">
                  {formatMoney(stats.surplus)}
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">Extra cash generated above target</small>
              </div>

              {/* 5. Revenue From New Clients */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Revenue From New Clients</span>
                <strong className="text-2xl font-black text-cyan-400 block">
                  {formatMoney(stats.newClientRevenue)}
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">{formatNum(stats.clientsNeeded)} × {formatMoney(price)}</small>
              </div>

              {/* 6. Total Projected Income */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-lg">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
                  Total Projected Monthly Income
                </span>
                <strong className="text-3xl font-black text-white block">
                  {formatMoney(stats.totalProjectedIncome)}
                </strong>
                <small className="text-[11px] text-slate-400 block mt-1">
                  Current Income ({formatMoney(income)}) + New Clients ({formatMoney(stats.newClientRevenue)})
                </small>
              </div>

              {/* 7. Leads Required */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Monthly Leads Required</span>
                <strong className="text-2xl font-black text-purple-400 block">
                  {formatNum(stats.leadsRequired)} Leads
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">Based on {conversion}% conversion</small>
              </div>

              {/* 8. Daily Outreach Target */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Daily Outreach Target</span>
                <strong className="text-2xl font-black text-amber-400 block">
                  {formatNum(stats.dailyLeads)} Leads / Day
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">Across {workingDays} working days</small>
              </div>

              {/* 9. Per Client Impact */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Per Client Revenue Impact</span>
                <strong className="text-2xl font-black text-teal-300 block">
                  {formatMoney(stats.clientImpact)}
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">
                  Har naya client aapki monthly financial stream mein itna direct izafa karta hai
                </small>
              </div>
            </div>

            {/* Target Breakdown & Live Formulas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Box 1: Target Breakdown */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3.5">
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400" />
                  Target Income Breakdown
                </h4>

                {/* Household Responsibility Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Household Responsibility ({ratio}%)</span>
                    <span className="text-slate-400 font-mono">{stats.respPct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, stats.respPct))}%` }} 
                      className="h-full bg-teal-500 rounded-full transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Growth Goal Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Personal Growth Goal</span>
                    <span className="text-slate-400 font-mono">{stats.growthPct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, stats.growthPct))}%` }} 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Buffer Amount Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Emergency Buffer ({contingency}%)</span>
                    <span className="text-slate-400 font-mono">{stats.bufferPct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, stats.bufferPct))}%` }} 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Current Income Coverage Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-cyan-400 font-bold">Current Income Coverage</span>
                    <span className="text-cyan-400 font-mono font-bold">{stats.coverage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, stats.coverage))}%` }} 
                      className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Summary Text Box */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {stats.incomeGap <= 0 ? (
                    <div>
                      <span className="text-teal-400 font-bold block mb-1">
                        🌟 Mubarak ho! (Surplus Position)
                      </span>
                      Aapki current reliable income ({formatMoney(income)}) aapke target income ({formatMoney(stats.targetIncome)}) ko already poora cover kar rahi hai. 
                      Aapke paas already <strong className="text-emerald-400">{formatMoney(stats.surplus)}</strong> ka surplus hai.
                    </div>
                  ) : (
                    <div>
                      Aapka monthly target income <strong className="text-white">{formatMoney(stats.targetIncome)}</strong> hai. 
                      Current reliable income ({formatMoney(income)}) ke baad aapka net income gap <strong className="text-amber-400">{formatMoney(stats.incomeGap)}</strong> hai. 
                      Is gap ko poora karne ke liye aapko sirf <strong className="text-teal-400">{formatNum(stats.clientsNeeded)}</strong> clients ki zaroorat hai.
                    </div>
                  )}
                </div>
              </div>

              {/* Box 2: Live Formulas Display */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-teal-400" />
                  Live Mathematical Formulas
                </h4>

                <div className="space-y-3">
                  {/* Formula 1 */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">1. Target Income Formula:</span>
                    <code className="text-xs font-mono text-teal-300 block leading-relaxed break-words">
                      T = ({formatMoney(baseline)} × {ratio}%) + {formatMoney(growth)} + {formatMoney(stats.bufferAmount)} = <strong className="text-white">{formatMoney(stats.targetIncome)}</strong>
                    </code>
                  </div>

                  {/* Formula 2 */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">2. Income Gap Formula:</span>
                    <code className="text-xs font-mono text-amber-300 block leading-relaxed break-words">
                      Gap = {formatMoney(stats.targetIncome)} - {formatMoney(income)} = <strong className="text-white">{formatMoney(stats.incomeGap)}</strong>
                    </code>
                  </div>

                  {/* Formula 3 */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">3. Clients Needed Formula:</span>
                    <code className="text-xs font-mono text-emerald-300 block leading-relaxed break-words">
                      Clients = {formatMoney(stats.incomeGap)} ÷ {formatMoney(price)} = <strong className="text-white">{formatNum(stats.clientsNeeded)} client(s)</strong>
                    </code>
                  </div>

                  {/* Formula 4 */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">4. Outreach Target Formula:</span>
                    <code className="text-xs font-mono text-purple-300 block leading-relaxed break-words">
                      Leads = {formatNum(stats.clientsNeeded)} clients ÷ {conversion}% = <strong className="text-white">{formatNum(stats.leadsRequired)} leads</strong> ({formatNum(stats.dailyLeads)}/day)
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Step Strategic Action Plan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-teal-400 font-black text-base block mb-1">01</span>
                <h4 className="font-bold text-white text-xs mb-1">Know Your Gap</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sab se pehle calculate karein ke har maheene aapko kitni extra income ki zaroorat hai.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-emerald-400 font-black text-base block mb-1">02</span>
                <h4 className="font-bold text-white text-xs mb-1">Price Your Service</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Aesa package rate rakhein jo aapki skill aur client ko milne wale ROI se justify ho sake.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-cyan-400 font-black text-base block mb-1">03</span>
                <h4 className="font-bold text-white text-xs mb-1">Find Leads Daily</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Apne required clients ko daily cold email, DM ya outreach target mein convert karein.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-purple-400 font-black text-base block mb-1">04</span>
                <h4 className="font-bold text-white text-xs mb-1">Improve Monthly</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Prices barhayein, conversion improve karein, aur kam se kam clients se maximum profit banayein.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
