'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ToolPageHeader from '@/components/ToolPageHeader';
import Footer from '@/components/Footer';
import {
  TrendingUp,
  Calculator,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Printer,
  RotateCcw,
  Target,
  ShoppingBag,
  Truck,
  Package,
  Megaphone,
  Percent,
  Layers,
  Zap
} from 'lucide-react';

interface Preset {
  name: string;
  desc: string;
  productCost: number;
  shippingCost: number;
  packagingCost: number;
  marketingCost: number;
  desiredMargin: number;
  orders: number;
  goal: number;
}

const PRESETS: Preset[] = [
  {
    name: 'Apna Kamao Default',
    desc: 'Standard local e-commerce store model',
    productCost: 1000,
    shippingCost: 250,
    packagingCost: 100,
    marketingCost: 400,
    desiredMargin: 30,
    orders: 1000,
    goal: 500000
  },
  {
    name: 'Daraz PL Store',
    desc: 'Low-cost high volume consumer goods',
    productCost: 450,
    shippingCost: 180,
    packagingCost: 60,
    marketingCost: 200,
    desiredMargin: 35,
    orders: 1500,
    goal: 1000000
  },
  {
    name: 'Shopify Clothing Brand',
    desc: 'Apparel & stitched suits with brand packaging',
    productCost: 2200,
    shippingCost: 300,
    packagingCost: 250,
    marketingCost: 750,
    desiredMargin: 40,
    orders: 600,
    goal: 2500000
  },
  {
    name: 'Dropshipping Gadgets',
    desc: 'Trending tech gadgets with performance marketing',
    productCost: 1600,
    shippingCost: 280,
    packagingCost: 120,
    marketingCost: 650,
    desiredMargin: 32,
    orders: 800,
    goal: 1500000
  }
];

export default function EcommerceProfitCalculatorPage() {
  // Primary Form Inputs
  const [productCost, setProductCost] = useState<number>(1000);
  const [shippingCost, setShippingCost] = useState<number>(250);
  const [packagingCost, setPackagingCost] = useState<number>(100);
  const [marketingCost, setMarketingCost] = useState<number>(400);
  const [desiredMargin, setDesiredMargin] = useState<number>(30);
  const [manualSellingPrice, setManualSellingPrice] = useState<string>('');
  const [orders, setOrders] = useState<number>(1000);
  const [goal, setGoal] = useState<number>(500000);

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

  // Number Formatters
  const formatMoney = (n: number) => {
    return currencySymbol + Math.round(isFinite(n) ? n : 0).toLocaleString('en-US');
  };

  const formatNum = (n: number) => {
    return Math.round(isFinite(n) ? n : 0).toLocaleString('en-US');
  };

  // Calculations Engine
  const stats = useMemo(() => {
    const pCost = Number(productCost) || 0;
    const sCost = Number(shippingCost) || 0;
    const packCost = Number(packagingCost) || 0;
    const mCost = Number(marketingCost) || 0;
    const monthlyOrders = Number(orders) || 0;
    const revGoal = Number(goal) || 0;

    let margin = Number(desiredMargin) || 0;
    if (margin >= 100) margin = 99;

    const totalCostPerOrder = pCost + sCost + packCost + mCost;
    const isManual = manualSellingPrice !== '' && Number(manualSellingPrice) > 0;

    const sellingPrice = isManual
      ? Number(manualSellingPrice)
      : totalCostPerOrder / (1 - margin / 100);

    const profitPerOrder = sellingPrice - totalCostPerOrder;
    const actualMargin = sellingPrice > 0 ? (profitPerOrder / sellingPrice) * 100 : 0;

    const monthlyRevenue = sellingPrice * monthlyOrders;
    const monthlyProfit = profitPerOrder * monthlyOrders;
    const totalAdSpend = mCost * monthlyOrders;
    const totalMonthlyCost = totalCostPerOrder * monthlyOrders;

    const ordersNeeded = sellingPrice > 0 ? Math.ceil(revGoal / sellingPrice) : 0;
    const adSpendForGoal = ordersNeeded * mCost;
    const totalCostForGoal = ordersNeeded * totalCostPerOrder;
    const profitForGoal = ordersNeeded * profitPerOrder;

    const goalProgress = revGoal > 0 ? (monthlyRevenue / revGoal) * 100 : 0;

    // Percent Breakdown
    const pPct = sellingPrice > 0 ? (pCost / sellingPrice) * 100 : 0;
    const sPct = sellingPrice > 0 ? (sCost / sellingPrice) * 100 : 0;
    const packPct = sellingPrice > 0 ? (packCost / sellingPrice) * 100 : 0;
    const mPct = sellingPrice > 0 ? (mCost / sellingPrice) * 100 : 0;

    return {
      totalCostPerOrder,
      isManual,
      sellingPrice,
      profitPerOrder,
      actualMargin,
      monthlyRevenue,
      monthlyProfit,
      totalAdSpend,
      totalMonthlyCost,
      ordersNeeded,
      adSpendForGoal,
      totalCostForGoal,
      profitForGoal,
      goalProgress,
      pPct,
      sPct,
      packPct,
      mPct
    };
  }, [productCost, shippingCost, packagingCost, marketingCost, desiredMargin, manualSellingPrice, orders, goal]);

  // Load Preset
  const handleApplyPreset = (p: Preset) => {
    setProductCost(p.productCost);
    setShippingCost(p.shippingCost);
    setPackagingCost(p.packagingCost);
    setMarketingCost(p.marketingCost);
    setDesiredMargin(p.desiredMargin);
    setManualSellingPrice('');
    setOrders(p.orders);
    setGoal(p.goal);
  };

  // Reset to Defaults
  const handleReset = () => {
    handleApplyPreset(PRESETS[0]);
  };

  // Copy Summary Text
  const handleCopySummary = () => {
    const summary = `--- E-COMMERCE PROFIT & GROWTH ANALYSIS ---
Effective Selling Price: ${formatMoney(stats.sellingPrice)} (${stats.isManual ? 'Manual' : 'Auto'})
Total Cost Per Order: ${formatMoney(stats.totalCostPerOrder)}
Profit Per Order: ${formatMoney(stats.profitPerOrder)} (${stats.actualMargin.toFixed(1)}% Margin)
Monthly Orders: ${formatNum(orders)}
Monthly Revenue: ${formatMoney(stats.monthlyRevenue)}
Total Monthly Ad Spend: ${formatMoney(stats.totalAdSpend)}
Total Monthly Net Profit: ${formatMoney(stats.monthlyProfit)}

Monthly Revenue Goal: ${formatMoney(goal)}
Orders Needed for Goal: ${formatNum(stats.ordersNeeded)} orders
Estimated Ad Spend to reach Goal: ${formatMoney(stats.adSpendForGoal)}
Estimated Net Profit at Goal: ${formatMoney(stats.profitForGoal)}
Calculated with Multi-Tool Web App (Inspired by Apna Kamao)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full relative z-20">
        <ToolPageHeader toolName="E-Commerce Profit & Growth Calculator" theme="dark" />
      </div>

      {/* Decorative Glow Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40 z-0" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40 z-0" />

      {/* Header / Hero Section */}
      <header className="relative z-10 pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-emerald-500/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Apna Kamao E-Commerce Calculator
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Calculate Your Product Profit, Pricing &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">
              Growth Goal
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Enter your product cost, shipping, packaging, marketing cost, desired margin, and monthly orders. 
            This calculator will instantly show your selling price, profit, revenue, ad spend, and orders needed to reach your goal.
          </p>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
              <strong className="block text-emerald-400 text-lg sm:text-xl font-extrabold">Live</strong>
              <span className="text-[11px] text-slate-400 font-medium">Instant Calculations</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
              <strong className="block text-white text-lg sm:text-xl font-extrabold">{currency}</strong>
              <span className="text-[11px] text-slate-400 font-medium">Made for E-Commerce</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
              <strong className="block text-teal-400 text-lg sm:text-xl font-extrabold">500K</strong>
              <span className="text-[11px] text-slate-400 font-medium">Default Revenue Goal</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
              <strong className="block text-green-400 text-lg sm:text-xl font-extrabold">100% Free</strong>
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
                    currency === c ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
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
          {/* LEFT COLUMN: INPUTS CARD (5 cols)                                */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  Product Inputs
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add your product numbers below. Leave manual price empty for auto pricing.
                </p>
              </div>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700"
                title="Reset to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4">
              
              {/* 1. Manufacturing / Sourcing Cost */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                    Manufacturing / Sourcing Cost
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{currency}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={productCost}
                    onChange={(e) => setProductCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    {currencySymbol}
                  </span>
                </div>
              </div>

              {/* 2. Shipping Cost */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    Shipping &amp; Courier Cost
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{currency}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    {currencySymbol}
                  </span>
                </div>
              </div>

              {/* 3. Packaging Cost */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    Packaging &amp; Flyer Cost
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{currency}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    {currencySymbol}
                  </span>
                </div>
              </div>

              {/* 4. Marketing Cost / CPA */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Megaphone className="w-3.5 h-3.5 text-purple-400" />
                    Marketing Cost Per Order / CPA
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{currency}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={marketingCost}
                    onChange={(e) => setMarketingCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    {currencySymbol}
                  </span>
                </div>
              </div>

              {/* 5. Desired Profit Margin (%) */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-emerald-400" />
                    Desired Profit Margin
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">%</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={desiredMargin}
                    onChange={(e) => setDesiredMargin(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    %
                  </span>
                </div>
              </div>

              {/* 6. Manual Selling Price (Optional override) */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                    Manual Selling Price
                  </span>
                  <span className="text-amber-400 text-[10px] font-semibold uppercase">Optional Override</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="Leave blank for auto price"
                    value={manualSellingPrice}
                    onChange={(e) => setManualSellingPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                  {manualSellingPrice && (
                    <button
                      onClick={() => setManualSellingPrice('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* 7. Monthly Orders */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Monthly Orders Volume
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">Orders</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={orders}
                    onChange={(e) => setOrders(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* 8. Monthly Revenue Goal */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-rose-400" />
                    Monthly Revenue Goal
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{currency}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={goal}
                    onChange={(e) => setGoal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    {currencySymbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Pro Tip Box */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
              <strong className="text-emerald-400 block mb-1">💡 Apna Kamao Golden Rule:</strong>
              Agar aapka profit per order kam ho raha hai to ya selling price barhayein, sourcing cost negotiate karein, packaging lightweight karein, ya Meta/TikTok ad creatives optimize karke CPA (cost per order) kam karein.
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: LIVE RESULTS, CHARTS & PROJECTIONS (7 cols)        */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Live Business Metrics</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
              
              {/* 1. Effective Selling Price (Highlighted) */}
              <div className="sm:col-span-2 relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 shadow-xl shadow-emerald-500/10 border border-emerald-400/30">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900/80 block mb-1">
                  Effective Selling Price
                </span>
                <strong className="text-3xl sm:text-4xl font-black block text-slate-950 tracking-tight">
                  {formatMoney(stats.sellingPrice)}
                </strong>
                <small className="text-[11px] font-bold text-slate-900/70 block mt-1">
                  {stats.isManual ? 'Manual price set by you' : 'Calculated automatically from desired margin'}
                </small>
              </div>

              {/* 2. Price Mode */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Price Mode</span>
                  <strong className={`text-2xl font-black block ${stats.isManual ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {stats.isManual ? 'Manual' : 'Auto'}
                  </strong>
                </div>
                <small className="text-[11px] text-slate-500 block">
                  {stats.isManual ? 'Fixed price mode' : `${desiredMargin}% target margin`}
                </small>
              </div>

              {/* 3. Actual Profit Margin */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Actual Profit Margin</span>
                <strong className={`text-2xl font-black block ${stats.actualMargin < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {stats.actualMargin.toFixed(1)}%
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">Profit % of selling price</small>
              </div>

              {/* 4. Total Cost Per Order */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Total Cost Per Order</span>
                <strong className="text-2xl font-black text-white block">
                  {formatMoney(stats.totalCostPerOrder)}
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">Product + Shipping + Pack + Ads</small>
              </div>

              {/* 5. Profit Per Order */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Net Profit Per Order</span>
                <strong className={`text-2xl font-black block ${stats.profitPerOrder < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatMoney(stats.profitPerOrder)}
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">Cash left after all per-order costs</small>
              </div>

              {/* 6. Monthly Revenue (Highlighted) */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-lg">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
                  Estimated Monthly Revenue
                </span>
                <strong className="text-3xl font-black text-white block">
                  {formatMoney(stats.monthlyRevenue)}
                </strong>
                <small className="text-[11px] text-slate-400 block mt-1">
                  {formatMoney(stats.sellingPrice)} × {formatNum(orders)} orders per month
                </small>
              </div>

              {/* 7. Monthly Profit */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Monthly Net Profit</span>
                <strong className={`text-2xl font-black block ${stats.monthlyProfit < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatMoney(stats.monthlyProfit)}
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">Net take-home cash profit</small>
              </div>

              {/* 8. Total Ad Spend */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Total Monthly Ad Spend</span>
                <strong className="text-2xl font-black text-purple-400 block">
                  {formatMoney(stats.totalAdSpend)}
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">Meta/TikTok advertising budget</small>
              </div>

              {/* 9. Orders Needed for Goal */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Orders Needed for Revenue Goal</span>
                <strong className="text-2xl font-black text-amber-400 block">
                  {formatNum(stats.ordersNeeded)} Orders
                </strong>
                <small className="text-[11px] text-slate-500 block mt-1">
                  Required to achieve your monthly revenue target of {formatMoney(goal)}
                </small>
              </div>
            </div>

            {/* Visual Breakdown Bars & Goal Projection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Box 1: Price Breakdown */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3.5">
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Per-Order Price Breakdown
                </h4>

                {/* Sourcing Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Sourcing / Product</span>
                    <span className="text-slate-400 font-mono">{stats.pPct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, stats.pPct))}%` }} 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Shipping Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Courier Shipping</span>
                    <span className="text-slate-400 font-mono">{stats.sPct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, stats.sPct))}%` }} 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Packaging Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Flyer &amp; Packaging</span>
                    <span className="text-slate-400 font-mono">{stats.packPct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, stats.packPct))}%` }} 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Marketing Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Marketing / Ads (CPA)</span>
                    <span className="text-slate-400 font-mono">{stats.mPct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, stats.mPct))}%` }} 
                      className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Profit Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-400 font-bold">Net Profit Margin</span>
                    <span className="text-emerald-400 font-mono font-bold">{stats.actualMargin.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, stats.actualMargin))}%` }} 
                      className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-500" 
                    />
                  </div>
                </div>
              </div>

              {/* Box 2: Goal Projection & Analysis */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-rose-400" />
                    Monthly Revenue Goal Progress
                  </h4>

                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Progress Towards {formatMoney(goal)}</span>
                    <span className="text-teal-400 font-mono font-bold">{stats.goalProgress.toFixed(1)}%</span>
                  </div>

                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, stats.goalProgress))}%` }} 
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Dynamic Summary Text */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  {stats.profitPerOrder < 0 ? (
                    <div className="space-y-1">
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Critical Warning: Loss Detected
                      </span>
                      <p>
                        Aap har order par <strong className="text-red-400">{formatMoney(Math.abs(stats.profitPerOrder))}</strong> ka loss kar rahe hain! 
                        Apni selling price barhayein ya product cost, courier charges, aur ad spend ko kam karein.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <p>
                        Current mode: <strong className="text-white">{stats.isManual ? 'Manual Price' : 'Auto Price'}</strong>. 
                        Aapka effective selling price <strong className="text-emerald-400">{formatMoney(stats.sellingPrice)}</strong> hai.
                      </p>
                      <p>
                        Har order par aapko <strong className="text-white">{formatMoney(stats.profitPerOrder)}</strong> profit milega ({stats.actualMargin.toFixed(1)}% margin).
                      </p>
                      <p>
                        <strong className="text-white">{formatNum(orders)}</strong> orders par estimated monthly profit{' '}
                        <strong className="text-emerald-400">{formatMoney(stats.monthlyProfit)}</strong> hoga jabke total ad spend{' '}
                        <strong className="text-purple-400">{formatMoney(stats.totalAdSpend)}</strong> hoga.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Strategic Insights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <b className="text-white text-xs block mb-1">Use Before Launch</b>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Product launch karne se pehle verify karein ke product price shipping, packaging aur marketing costs bardasht kar sakti hai ya nahi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <b className="text-white text-xs block mb-1">Protect Your Margin</b>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sirf revenue ko na dekhein. Real business success healthy profit per order aur repeat customers se aati hai.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <b className="text-white text-xs block mb-1">Plan Your Ads Budget</b>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Marketing cost per order (CPA) aapke store ko make or break karta hai. Meta &amp; TikTok ads metrics daily track karein.
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
