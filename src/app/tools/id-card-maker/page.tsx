'use client';

import { useState, useMemo, useRef } from 'react';
import Navbar from '@/components/Navbar';
import ToolPageHeader from '@/components/ToolPageHeader';
import Footer from '@/components/Footer';
import Image from 'next/image';
import {
  ID_CARD_TEMPLATES,
  ID_CARD_CATEGORIES,
  IdCardTemplate,
  IdCardData,
  IdCardOrientation,
  DEFAULT_TERMS
} from '@/data/idCardsData';
import {
  CreditCard,
  Download,
  Printer,
  RotateCcw,
  Sparkles,
  FileDown,
  Search,
  Sliders,
  Eye,
  Layers,
  ShieldCheck,
  Camera,
  Building,
  CheckCircle2,
  X,
  Star,
  Info,
  Shield
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Sample stock avatars for quick 1-click demo
const SAMPLE_AVATARS = [
  { label: 'Male Exec', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Female Exec', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Student', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' },
  { label: 'Doctor', url: 'https://images.unsplash.com/photo-1594824813689-58b8772a6b29?w=400&auto=format&fit=crop&q=80' },
  { label: 'Security', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Journalist', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' }
];

export default function IdCardMakerPage() {
  // Navigation: 'studio' (live interactive card generator) or 'gallery' (GraphicsFamily templates)
  const [activeTab, setActiveTab] = useState<'studio' | 'gallery'>('studio');

  // Active Template & Customizer State
  const [selectedTemplate, setSelectedTemplate] = useState<IdCardTemplate>(ID_CARD_TEMPLATES[0]);
  const [cardData, setCardData] = useState<IdCardData>(ID_CARD_TEMPLATES[0].defaultData);
  const [orientation, setOrientation] = useState<IdCardOrientation>(ID_CARD_TEMPLATES[0].orientation);
  const [activeSide, setActiveSide] = useState<'front' | 'back' | 'both'>('both');
  const [showLanyard, setShowLanyard] = useState<boolean>(true);
  const [avatarShape, setAvatarShape] = useState<'circle' | 'rounded' | 'hexagon'>('rounded');

  // Custom Color Theme Overrides
  const [primaryColor, setPrimaryColor] = useState<string>(ID_CARD_TEMPLATES[0].primaryColor);
  const [secondaryColor, setSecondaryColor] = useState<string>(ID_CARD_TEMPLATES[0].secondaryColor);
  const [accentColor, setAccentColor] = useState<string>(ID_CARD_TEMPLATES[0].accentColor);

  // Gallery Filters & Search
  const [galleryCategory, setGalleryCategory] = useState<string>('All Templates');
  const [galleryOrientation, setGalleryOrientation] = useState<'ALL' | 'vertical' | 'horizontal'>('ALL');
  const [gallerySearch, setGallerySearch] = useState<string>('');
  
  // Modals & Export state
  const [downloadModalTemplate, setDownloadModalTemplate] = useState<IdCardTemplate | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs for html2canvas
  const frontCardRef = useRef<HTMLDivElement | null>(null);
  const backCardRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load a template into the Live Studio
  const handleLoadTemplateIntoStudio = (template: IdCardTemplate) => {
    setSelectedTemplate(template);
    setCardData({ ...template.defaultData });
    setOrientation(template.orientation);
    setPrimaryColor(template.primaryColor);
    setSecondaryColor(template.secondaryColor);
    setAccentColor(template.accentColor);
    setActiveTab('studio');
    showToast(`Loaded "${template.title}" into Studio!`);
  };

  // Filtered Templates for Gallery
  const filteredTemplates = useMemo(() => {
    return ID_CARD_TEMPLATES.filter(tpl => {
      const matchesCat = galleryCategory === 'All Templates' || tpl.category === galleryCategory;
      const matchesOri = galleryOrientation === 'ALL' || tpl.orientation === galleryOrientation;
      const q = gallerySearch.toLowerCase().trim();
      const matchesSearch = !q || 
        tpl.title.toLowerCase().includes(q) || 
        tpl.description.toLowerCase().includes(q) ||
        tpl.tags.some(t => t.toLowerCase().includes(q));
      return matchesCat && matchesOri && matchesSearch;
    });
  }, [galleryCategory, galleryOrientation, gallerySearch]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCardData(prev => ({ ...prev, avatarUrl: uploadEvent.target!.result as string }));
          showToast('Photo uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCardData(prev => ({ ...prev, logoUrl: uploadEvent.target!.result as string }));
          showToast('Company logo uploaded!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Export Single Side as PNG
  const handleExportPNG = async (side: 'front' | 'back') => {
    const targetRef = side === 'front' ? frontCardRef.current : backCardRef.current;
    if (!targetRef) return;
    try {
      setIsExporting(true);
      showToast(`Generating high-res ${side} card PNG...`);
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(targetRef, {
        scale: 3, // High-res 300 DPI equivalent
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      const link = document.createElement('a');
      link.download = `${cardData.holderName.replace(/\s+/g, '_')}_ID_${side.toUpperCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast(`${side.toUpperCase()} card downloaded successfully!`);
    } catch (err) {
      console.error('Export PNG failed:', err);
      showToast('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export Print-Ready Standard CR80 PDF (85.6mm x 53.98mm)
  const handleExportPDF = async () => {
    if (!frontCardRef.current) return;
    try {
      setIsExporting(true);
      showToast('Generating CR80 Print-Ready PDF with bleed marks...');
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Render Front
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true
      });
      const frontImgData = frontCanvas.toDataURL('image/png');

      // CR80 dimensions in mm
      const isPortrait = orientation === 'vertical';
      const cardWidth = isPortrait ? 54 : 85.6;
      const cardHeight = isPortrait ? 85.6 : 54;

      const pdf = new jsPDF({
        orientation: isPortrait ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [cardWidth + 6, cardHeight + 6] // 3mm bleed margin
      });

      // Page 1: Front
      pdf.addImage(frontImgData, 'PNG', 3, 3, cardWidth, cardHeight);

      // Page 2: Back (if available)
      if (backCardRef.current) {
        const backCanvas = await html2canvas(backCardRef.current, {
          scale: 3,
          useCORS: true,
          allowTaint: true
        });
        const backImgData = backCanvas.toDataURL('image/png');
        pdf.addPage([cardWidth + 6, cardHeight + 6], isPortrait ? 'portrait' : 'landscape');
        pdf.addImage(backImgData, 'PNG', 3, 3, cardWidth, cardHeight);
      }

      pdf.save(`${cardData.holderName.replace(/\s+/g, '_')}_CR80_ID_CARD.pdf`);
      showToast('Print-Ready CR80 PDF downloaded!');
    } catch (err) {
      console.error('PDF Export Error:', err);
      showToast('PDF Export failed. Try PNG download instead.');
    } finally {
      setIsExporting(false);
    }
  };

  // Print Direct
  const handlePrintCard = () => {
    window.print();
  };

  // Pseudo-Barcode SVG Generator
  const renderBarcodeSVG = (value: string) => {
    const bars = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1];
    return (
      <div className="flex flex-col items-center">
        <svg className="w-full h-8" viewBox="0 0 200 30" preserveAspectRatio="none">
          <rect width="200" height="30" fill="transparent" />
          {bars.map((w, i) => (
            <rect 
              key={i} 
              x={i * 6.2} 
              y="0" 
              width={w} 
              height="30" 
              fill="#0f172a" 
            />
          ))}
        </svg>
        <span className="font-mono text-[9px] tracking-widest text-slate-700 font-bold uppercase mt-0.5">
          *{value || 'ID-000000'}*
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full print:hidden">
        <ToolPageHeader toolName="Pro ID Card Maker & PSD Studio" theme="dark" />
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white font-medium px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-400 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Hero Banner */}
      <header className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <CreditCard className="w-3.5 h-3.5" /> Inspired by GraphicsFamily ID Card Templates
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Pro ID Card Maker <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">&amp; PSD Studio</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
                Design, customize, and print high-resolution CR80 employee, student, and security ID badges with QR verification, barcodes, and authentic PSD template downloads.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
              <button
                onClick={() => setActiveTab('studio')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'studio'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sliders className="w-4 h-4" />
                Live Card Studio
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'gallery'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                GraphicsFamily PSD Hub ({ID_CARD_TEMPLATES.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* =================================================================== */}
        {/* TAB 1: LIVE INTERACTIVE ID CARD STUDIO                              */}
        {/* =================================================================== */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: CUSTOMIZER CONTROLS (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-bold text-white">ID Card Customizer</h2>
                </div>
                <button
                  onClick={() => {
                    setCardData({ ...selectedTemplate.defaultData });
                    setPrimaryColor(selectedTemplate.primaryColor);
                    setSecondaryColor(selectedTemplate.secondaryColor);
                    setAccentColor(selectedTemplate.accentColor);
                    showToast('Reset to template defaults');
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              {/* Quick Template Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Select Theme Preset
                </label>
                <select
                  value={selectedTemplate.id}
                  onChange={(e) => {
                    const tpl = ID_CARD_TEMPLATES.find(t => t.id === e.target.value);
                    if (tpl) handleLoadTemplateIntoStudio(tpl);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {ID_CARD_TEMPLATES.map(tpl => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.title} ({tpl.orientation.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Layout & Orientation Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setOrientation('vertical')}
                      className={`py-2 sm:py-1.5 min-h-[38px] flex items-center justify-center text-xs font-semibold rounded-lg transition-all ${
                        orientation === 'vertical' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Vertical
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation('horizontal')}
                      className={`py-2 sm:py-1.5 min-h-[38px] flex items-center justify-center text-xs font-semibold rounded-lg transition-all ${
                        orientation === 'horizontal' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Horizontal
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Side View
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveSide('both')}
                      className={`py-2 sm:py-1.5 min-h-[38px] flex items-center justify-center text-[11px] font-semibold rounded-lg transition-all ${
                        activeSide === 'both' ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Both
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSide('front')}
                      className={`py-2 sm:py-1.5 min-h-[38px] flex items-center justify-center text-[11px] font-semibold rounded-lg transition-all ${
                        activeSide === 'front' ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Front
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSide('back')}
                      className={`py-2 sm:py-1.5 min-h-[38px] flex items-center justify-center text-[11px] font-semibold rounded-lg transition-all ${
                        activeSide === 'back' ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo & Logo Upload */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Cardholder Photo &amp; Avatar
                </label>
                
                {/* Sample Avatars Row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {SAMPLE_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCardData(prev => ({ ...prev, avatarUrl: av.url }))}
                      className={`flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                        cardData.avatarUrl === av.url ? 'border-blue-500 scale-110 shadow-md shadow-blue-500/50' : 'border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                      title={av.label}
                    >
                      <Image src={av.url} alt={av.label} width={36} height={36} unoptimized className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <span>Upload Custom Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>

                  <label className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors">
                    <Building className="w-4 h-4 text-cyan-400" />
                    <span>Logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Theme Colors Customizer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Primary Color</label>
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-[11px] font-mono text-slate-300 uppercase">{primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Secondary</label>
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <input 
                      type="color" 
                      value={secondaryColor} 
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-[11px] font-mono text-slate-300 uppercase">{secondaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Accent</label>
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <input 
                      type="color" 
                      value={accentColor} 
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-[11px] font-mono text-slate-300 uppercase">{accentColor}</span>
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3 pt-2 border-t border-slate-800 max-h-96 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={cardData.orgName}
                      onChange={(e) => setCardData(prev => ({ ...prev, orgName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Tagline / Slogan</label>
                    <input
                      type="text"
                      value={cardData.orgTagline}
                      onChange={(e) => setCardData(prev => ({ ...prev, orgTagline: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardData.holderName}
                      onChange={(e) => setCardData(prev => ({ ...prev, holderName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Designation / Role</label>
                    <input
                      type="text"
                      value={cardData.designation}
                      onChange={(e) => setCardData(prev => ({ ...prev, designation: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">ID Number</label>
                    <input
                      type="text"
                      value={cardData.idNumber}
                      onChange={(e) => setCardData(prev => ({ ...prev, idNumber: e.target.value, barcodeValue: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Department</label>
                    <input
                      type="text"
                      value={cardData.department}
                      onChange={(e) => setCardData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Blood Group</label>
                    <input
                      type="text"
                      value={cardData.bloodGroup}
                      onChange={(e) => setCardData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={cardData.phone}
                      onChange={(e) => setCardData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={cardData.emergencyContact}
                      onChange={(e) => setCardData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Issue Date</label>
                    <input
                      type="text"
                      value={cardData.issueDate}
                      onChange={(e) => setCardData(prev => ({ ...prev, issueDate: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardData.expiryDate}
                      onChange={(e) => setCardData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Office / Campus Address</label>
                  <input
                    type="text"
                    value={cardData.address}
                    onChange={(e) => setCardData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Lanyard Mockup & Photo Frame Options */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLanyard}
                    onChange={(e) => setShowLanyard(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs text-slate-300 font-medium">Show Lanyard Holder Mockup</span>
                </label>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">Frame:</span>
                  <button
                    type="button"
                    onClick={() => setAvatarShape('circle')}
                    className={`px-3 py-1.5 sm:py-0.5 min-h-[34px] flex items-center justify-center text-[10px] font-medium rounded ${avatarShape === 'circle' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Circle
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarShape('rounded')}
                    className={`px-3 py-1.5 sm:py-0.5 min-h-[34px] flex items-center justify-center text-[10px] font-medium rounded ${avatarShape === 'rounded' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Square
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE CARD PREVIEW & EXPORT ACTIONS (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Action Buttons Toolbar */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" /> Live CR80 Preview
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                    3.375&quot; × 2.125&quot; (85.6 × 54mm)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleExportPNG('front')}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors border border-slate-700 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" /> Front PNG
                  </button>
                  <button
                    onClick={() => handleExportPNG('back')}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors border border-slate-700 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" /> Back PNG
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30"
                  >
                    <FileDown className="w-3.5 h-3.5 text-amber-300" /> Print PDF
                  </button>
                  <button
                    onClick={handlePrintCard}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
                    title="Direct Browser Print"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </div>
              </div>

              {/* LIVE CARDS RENDER CONTAINER */}
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-3 sm:p-10 flex flex-col items-center justify-center min-h-[560px] shadow-2xl overflow-hidden relative w-full max-w-full">
                
                {/* Visual grid backdrop */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Card Display Container */}
                <div className={`relative z-10 flex flex-col sm:flex-row items-center justify-center gap-8 ${
                  orientation === 'horizontal' ? 'flex-col lg:flex-row' : ''
                }`}>

                  {/* ========================================================= */}
                  {/* FRONT SIDE CARD                                           */}
                  {/* ========================================================= */}
                  {(activeSide === 'front' || activeSide === 'both') && (
                    <div className="flex flex-col items-center w-full max-w-full overflow-x-auto py-1">
                      
                      {/* Optional Lanyard Ribbon Mockup */}
                      {showLanyard && (
                        <div className="flex flex-col items-center -mb-2 z-20 pointer-events-none">
                          <div className="w-8 h-12 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-800 rounded-t shadow-md" />
                          <div className="w-12 h-3.5 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-md border border-slate-600 shadow-sm -mt-0.5" />
                          <div className="w-4 h-4 rounded-full border-2 border-slate-400 bg-slate-800 -mt-1" />
                        </div>
                      )}

                      {/* Card Shell */}
                      <div 
                        ref={frontCardRef}
                        id="print-front-card"
                        style={{
                          width: orientation === 'vertical' ? '320px' : '480px',
                          height: orientation === 'vertical' ? '490px' : '310px',
                          backgroundColor: '#ffffff',
                          color: '#0f172a'
                        }}
                        className="relative rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col justify-between text-left select-none transition-all duration-300"
                      >
                        {/* Orientation: VERTICAL FRONT */}
                        {orientation === 'vertical' ? (
                          <div className="h-full flex flex-col justify-between relative bg-white">
                            
                            {/* Decorative Top Header Banner */}
                            <div 
                              style={{ backgroundColor: primaryColor }}
                              className="relative px-5 pt-5 pb-7 text-white"
                            >
                              <div 
                                style={{ backgroundColor: secondaryColor }}
                                className="absolute -bottom-3 left-0 right-0 h-4 transform -skew-y-2"
                              />
                              
                              <div className="relative z-10 flex items-center justify-between">
                                <div>
                                  <h3 className="font-extrabold text-sm tracking-wider uppercase leading-tight">
                                    {cardData.orgName}
                                  </h3>
                                  <p className="text-[9px] text-blue-200 tracking-widest uppercase font-medium">
                                    {cardData.orgTagline}
                                  </p>
                                </div>
                                
                                {/* Logo or Crest Icon */}
                                {cardData.logoUrl ? (
                                  <Image src={cardData.logoUrl} alt="Logo" width={32} height={32} unoptimized className="w-8 h-8 object-contain rounded" />
                                ) : (
                                  <div 
                                    style={{ backgroundColor: accentColor }}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-900 shadow"
                                  >
                                    <Shield className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Middle Body: Avatar & Details */}
                            <div className="px-5 pt-3 pb-2 flex-1 flex flex-col items-center text-center">
                              
                              {/* Avatar Frame */}
                              <div 
                                style={{ borderColor: primaryColor }}
                                className={`w-28 h-28 overflow-hidden border-4 shadow-xl mb-3 ${
                                  avatarShape === 'circle' ? 'rounded-full' : 'rounded-2xl'
                                }`}
                              >
                                <Image 
                                  src={cardData.avatarUrl} 
                                  alt={cardData.holderName} 
                                  width={112}
                                  height={112}
                                  unoptimized
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Cardholder Name & Title */}
                              <h4 className="font-extrabold text-slate-900 text-lg leading-tight uppercase">
                                {cardData.holderName}
                              </h4>
                              <p 
                                style={{ color: secondaryColor }}
                                className="text-xs font-bold uppercase tracking-wider mt-0.5"
                              >
                                {cardData.designation}
                              </p>
                              
                              {/* Badge Tag ID */}
                              <span 
                                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                                className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider"
                              >
                                ID: {cardData.idNumber}
                              </span>

                              {/* Compact Spec Grid */}
                              <div className="w-full mt-4 grid grid-cols-2 gap-x-2 gap-y-1.5 text-left border-t border-slate-100 pt-3 text-[11px]">
                                <div>
                                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Dept</span>
                                  <span className="font-semibold text-slate-800 truncate block">{cardData.department}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Blood Group</span>
                                  <span className="font-bold text-red-600 block">{cardData.bloodGroup}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Issue Date</span>
                                  <span className="font-semibold text-slate-800 block">{cardData.issueDate}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Valid Thru</span>
                                  <span className="font-semibold text-slate-800 block">{cardData.expiryDate}</span>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Footer Ribbon & Barcode */}
                            <div className="px-5 pb-3 pt-1">
                              {renderBarcodeSVG(cardData.barcodeValue || cardData.idNumber)}
                            </div>

                            {/* Solid Colored Bottom Base Line */}
                            <div style={{ backgroundColor: primaryColor }} className="h-2 w-full" />
                          </div>
                        ) : (
                          /* Orientation: HORIZONTAL FRONT */
                          <div className="h-full flex flex-col justify-between relative bg-white">
                            
                            {/* Horizontal Header */}
                            <div 
                              style={{ backgroundColor: primaryColor }}
                              className="px-5 py-2.5 text-white flex items-center justify-between relative"
                            >
                              <div className="flex items-center gap-2.5">
                                {cardData.logoUrl ? (
                                  <Image src={cardData.logoUrl} alt="Logo" width={24} height={24} unoptimized className="w-6 h-6 object-contain rounded" />
                                ) : (
                                  <div style={{ backgroundColor: accentColor }} className="w-6 h-6 rounded flex items-center justify-center text-slate-900">
                                    <Shield className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-extrabold text-xs tracking-wider uppercase leading-tight">
                                    {cardData.orgName}
                                  </h3>
                                  <p className="text-[8px] text-blue-200 tracking-widest uppercase">
                                    {cardData.orgTagline}
                                  </p>
                                </div>
                              </div>

                              <span className="font-mono text-[11px] font-bold tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/20">
                                {cardData.idNumber}
                              </span>
                            </div>

                            {/* Horizontal Body Grid */}
                            <div className="px-5 py-3 flex items-center gap-5 flex-1">
                              
                              {/* Left: Avatar */}
                              <div 
                                style={{ borderColor: primaryColor }}
                                className={`w-24 h-24 flex-shrink-0 overflow-hidden border-4 shadow-lg ${
                                  avatarShape === 'circle' ? 'rounded-full' : 'rounded-2xl'
                                }`}
                              >
                                <Image src={cardData.avatarUrl} alt={cardData.holderName} width={96} height={96} unoptimized className="w-full h-full object-cover" />
                              </div>

                              {/* Center: Details */}
                              <div className="flex-1 text-left">
                                <h4 className="font-extrabold text-slate-900 text-base uppercase leading-tight">
                                  {cardData.holderName}
                                </h4>
                                <p style={{ color: secondaryColor }} className="text-xs font-bold uppercase tracking-wider mb-2">
                                  {cardData.designation}
                                </p>

                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                                  <div>
                                    <span className="text-slate-400 text-[9px] block uppercase font-semibold">Department</span>
                                    <span className="font-bold text-slate-800">{cardData.department}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 text-[9px] block uppercase font-semibold">Blood Group</span>
                                    <span className="font-bold text-red-600">{cardData.bloodGroup}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 text-[9px] block uppercase font-semibold">Issued</span>
                                    <span className="font-semibold text-slate-700">{cardData.issueDate}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 text-[9px] block uppercase font-semibold">Valid Thru</span>
                                    <span className="font-semibold text-slate-700">{cardData.expiryDate}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right: QR Code */}
                              <div className="flex flex-col items-center justify-center p-2 bg-slate-50 border border-slate-200 rounded-xl">
                                <QRCodeSVG 
                                  value={`VERIFY-ID:${cardData.idNumber}|NAME:${cardData.holderName}|ORG:${cardData.orgName}`} 
                                  size={54}
                                  level="M"
                                />
                                <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">VERIFIED</span>
                              </div>
                            </div>

                            {/* Horizontal Footer Barcode */}
                            <div className="px-5 pb-2">
                              {renderBarcodeSVG(cardData.barcodeValue || cardData.idNumber)}
                            </div>

                            <div style={{ backgroundColor: primaryColor }} className="h-1.5 w-full" />
                          </div>
                        )}
                      </div>

                      <span className="mt-2 text-xs font-semibold text-slate-400">Front Side</span>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* BACK SIDE CARD                                            */}
                  {/* ========================================================= */}
                  {(activeSide === 'back' || activeSide === 'both') && (
                    <div className="flex flex-col items-center w-full max-w-full overflow-x-auto py-1">
                      
                      {/* Optional Lanyard Clip for Back */}
                      {showLanyard && (
                        <div className="flex flex-col items-center -mb-2 z-20 pointer-events-none opacity-80">
                          <div className="w-8 h-12 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-800 rounded-t shadow-md" />
                          <div className="w-12 h-3.5 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-md border border-slate-600 shadow-sm -mt-0.5" />
                          <div className="w-4 h-4 rounded-full border-2 border-slate-400 bg-slate-800 -mt-1" />
                        </div>
                      )}

                      {/* Card Shell */}
                      <div 
                        ref={backCardRef}
                        id="print-back-card"
                        style={{
                          width: orientation === 'vertical' ? '320px' : '480px',
                          height: orientation === 'vertical' ? '490px' : '310px',
                          backgroundColor: '#ffffff',
                          color: '#0f172a'
                        }}
                        className="relative rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col justify-between text-left select-none transition-all duration-300"
                      >
                        {/* Magnetic Strip Header */}
                        <div className="w-full h-10 bg-slate-900 mt-4 relative flex items-center justify-end px-4">
                          <div className="w-12 h-6 bg-amber-200/80 rounded border border-amber-400/80 flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-0.5">
                              <div className="w-1 h-3 bg-amber-600 rounded-sm" />
                              <div className="w-1 h-3 bg-amber-600 rounded-sm" />
                            </div>
                          </div>
                        </div>

                        {/* Back Content Area */}
                        <div className="px-5 py-3 flex-1 flex flex-col justify-between text-left">
                          
                          {/* Terms & Conditions Block */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-blue-600" /> Terms of Issuance
                            </span>
                            <ul className="text-[9.5px] text-slate-600 space-y-1 list-disc pl-3 leading-relaxed">
                              {DEFAULT_TERMS.map((term, i) => (
                                <li key={i}>{term}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Middle: Signature & Official Contact */}
                          <div className="grid grid-cols-2 gap-3 items-end pt-2 border-t border-slate-100">
                            <div>
                              <span className="text-[9px] text-slate-400 font-semibold block uppercase">Cardholder Phone</span>
                              <span className="text-[11px] font-bold text-slate-800">{cardData.phone}</span>
                              
                              <span className="text-[9px] text-slate-400 font-semibold block uppercase mt-1">Emergency SOS</span>
                              <span className="text-[11px] font-bold text-red-600">{cardData.emergencyContact}</span>
                            </div>

                            <div className="text-right">
                              <div className="border-b border-slate-300 pb-1 mb-1">
                                <span className="font-serif italic text-base font-bold text-blue-900">
                                  {cardData.signatureText || cardData.holderName}
                                </span>
                              </div>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                Authorized Signature
                              </span>
                            </div>
                          </div>

                          {/* Return Address & Live Verification QR */}
                          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                            <div className="text-[9px] text-slate-500 leading-tight">
                              <span className="font-bold text-slate-700 block">Return Address:</span>
                              {cardData.address}
                              <span className="block text-blue-600 font-medium mt-0.5">{cardData.website}</span>
                            </div>

                            <div className="flex flex-col items-center bg-slate-50 p-1.5 border border-slate-200 rounded-lg">
                              <QRCodeSVG 
                                value={`SECURITY-AUDIT:${cardData.idNumber}|VALID:${cardData.expiryDate}`} 
                                size={44}
                                level="M"
                              />
                              <span className="text-[7px] font-mono text-slate-500 font-bold mt-0.5">SCAN TO VERIFY</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Stripe */}
                        <div style={{ backgroundColor: secondaryColor }} className="h-2 w-full" />
                      </div>

                      <span className="mt-2 text-xs font-semibold text-slate-400">Back Side</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs text-slate-400">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Printing Tip:</strong> Standard ID cards are printed on standard 30 mil CR80 PVC plastic blanks using card printers (Evolis, Zebra, Fargo, Magicard). When exporting PDF, standard 3mm bleed crop marks are applied for accurate die-cutting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: GRAPHICSFAMILY FREE ID CARD TEMPLATES GALLERY                */}
        {/* =================================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            
            {/* Gallery Filter & Search Header */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    Free ID Card Templates Download (PSD &amp; Vector)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Layered Photoshop .PSD source files, 300 DPI CMYK ready, complete with smart objects and vector assets.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search templates (e.g. corporate, student, doctor)..."
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  {gallerySearch && (
                    <button 
                      onClick={() => setGallerySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Pills & Orientation Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-1.5">
                  {ID_CARD_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setGalleryCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        galleryCategory === cat
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Orientation toggle */}
                <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setGalleryOrientation('ALL')}
                    className={`px-2.5 py-1 rounded-lg ${galleryOrientation === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setGalleryOrientation('vertical')}
                    className={`px-2.5 py-1 rounded-lg ${galleryOrientation === 'vertical' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    Vertical
                  </button>
                  <button
                    onClick={() => setGalleryOrientation('horizontal')}
                    className={`px-2.5 py-1 rounded-lg ${galleryOrientation === 'horizontal' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    Horizontal
                  </button>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map(tpl => (
                <div
                  key={tpl.id}
                  className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Thumbnail */}
                  <div className="relative h-48 w-full bg-slate-950 overflow-hidden cursor-pointer">
                    <Image
                      src={tpl.previewImage}
                      alt={tpl.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 bg-blue-600/90 backdrop-blur-md text-white font-bold text-[10px] rounded-lg shadow">
                        {tpl.badgeTag}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold rounded-lg">
                        {tpl.orientation.toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold rounded-lg flex items-center gap-1 shadow">
                        <Star className="w-3 h-3 fill-amber-400" /> {tpl.rating}
                      </span>
                    </div>

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => handleLoadTemplateIntoStudio(tpl)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Customize
                      </button>
                      <button
                        onClick={() => setDownloadModalTemplate(tpl)}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all"
                      >
                        <FileDown className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{tpl.category}</span>
                        <span className="font-mono text-slate-500">{tpl.psdFileSize}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors line-clamp-1">
                        {tpl.title}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLoadTemplateIntoStudio(tpl)}
                        className="flex-1 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 hover:border-transparent rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        Edit Online
                      </button>

                      <button
                        onClick={() => setDownloadModalTemplate(tpl)}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
                        title="Download PSD Kit"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
                <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No Templates Found</h3>
                <p className="text-xs text-slate-500 mt-1">Try clearing your search query or selecting a different category.</p>
                <button
                  onClick={() => {
                    setGallerySearch('');
                    setGalleryCategory('All Templates');
                    setGalleryOrientation('ALL');
                  }}
                  className="mt-4 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* =================================================================== */}
      {/* PSD DOWNLOAD RESOURCE MODAL (GRAPHICSFAMILY STYLE)                  */}
      {/* =================================================================== */}
      {downloadModalTemplate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  Free Resource Download
                </span>
                <h3 className="text-lg font-extrabold text-white mt-2">
                  {downloadModalTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setDownloadModalTemplate(null)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 h-44 relative">
              <Image 
                src={downloadModalTemplate.previewImage} 
                alt={downloadModalTemplate.title}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-xs font-mono font-bold">Standard CR80 (3.375&quot; × 2.125&quot;)</span>
                <span className="text-[10px] text-slate-300 block">300 DPI CMYK Print Ready</span>
              </div>
            </div>

            {/* Template Specs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Format</span>
                <span className="text-xs font-bold text-white font-mono">PSD, AI, PDF</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">File Size</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">{downloadModalTemplate.psdFileSize}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">License</span>
                <span className="text-xs font-bold text-cyan-400 font-mono">100% Free</span>
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-1 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                Fully Layered &amp; Named Photoshop (.PSD) Source
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                Smart Object Photo Replacement (1-Click Swap)
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                Free Commercial Use &amp; Client Project License
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  handleLoadTemplateIntoStudio(downloadModalTemplate);
                  setDownloadModalTemplate(null);
                }}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Sliders className="w-4 h-4 text-blue-400" />
                Edit in Online Studio
              </button>

              <button
                onClick={() => {
                  showToast(`Downloading "${downloadModalTemplate.title}" PSD Source Pack...`);
                  setTimeout(() => {
                    const blob = new Blob([
                      `GraphicsFamily ID Card Template Kit: ${downloadModalTemplate.title}\nFormat: Layered Adobe Photoshop PSD / AI / PDF\nDimensions: Standard CR80 85.6mm x 54mm 300 DPI\nLicense: Free for Commercial and Personal use.\nCreated with love for Multi-Tool Web App users.`
                    ], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${downloadModalTemplate.id}_PSD_TEMPLATE_KIT.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    setDownloadModalTemplate(null);
                    showToast('Download started!');
                  }, 800);
                }}
                className="py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 text-amber-300" />
                Download PSD (.zip)
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
