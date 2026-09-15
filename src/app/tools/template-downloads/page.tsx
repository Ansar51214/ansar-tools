'use client';

import { useState, useMemo, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  TEMPLATES, 
  TEMPLATE_CATEGORIES, 
  TemplateItem 
} from '@/data/templatesData';
import { 
  Search, Download, FileText, Printer, Copy, Check, Eye, 
  Sparkles, ShieldCheck, FileCheck, 
  Briefcase, Scale, GraduationCap, Heart, Layers,
  X, RefreshCw, SlidersHorizontal
} from 'lucide-react';

export default function TemplateDownloadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedFormat, setSelectedFormat] = useState<'ALL' | 'DOCX' | 'PDF'>('ALL');
  
  // Active modal template
  const [activeTemplate, setActiveTemplate] = useState<TemplateItem | null>(null);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  
  // Toast & Export states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const printAreaRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Preview Modal & Initialize Field Values
  const handleOpenPreview = (template: TemplateItem) => {
    const initialValues: Record<string, string> = {};
    template.fields.forEach(f => {
      initialValues[f.key] = f.defaultValue;
    });
    setCustomFieldValues(initialValues);
    setActiveTemplate(template);
  };

  const handleFieldChange = (key: string, val: string) => {
    setCustomFieldValues(prev => ({ ...prev, [key]: val }));
  };

  const handleResetFields = () => {
    if (!activeTemplate) return;
    const initialValues: Record<string, string> = {};
    activeTemplate.fields.forEach(f => {
      initialValues[f.key] = f.defaultValue;
    });
    setCustomFieldValues(initialValues);
    showToast('Reset to default values');
  };

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(item => {
      const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
      const matchesFormat = selectedFormat === 'ALL' || item.formats.includes(selectedFormat);
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(t => t.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query);
      
      return matchesCategory && matchesFormat && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedFormat]);

  // Export as Word (.DOCX)
  const handleDownloadDocx = async (template: TemplateItem, valuesToUse?: Record<string, string>) => {
    setIsExportingDocx(true);
    showToast('Generating Microsoft Word (.docx) document...');

    try {
      const values = valuesToUse || customFieldValues;
      const textContent = template.generateText(values);
      
      // Dynamic import docx to prevent SSR evaluation
      const { Document, Packer, Paragraph, TextRun } = await import('docx');

      const lines = textContent.split('\n');
      const paragraphs = lines.map(line => {
        const isHeader = line.toUpperCase() === line && line.trim().length > 3 && !line.includes('---');
        const isDivider = line.includes('---');

        if (isDivider) {
          return new Paragraph({
            children: [
              new TextRun({
                text: '____________________________________________________________________',
                color: '94a3b8',
                size: 20
              })
            ],
            spacing: { before: 100, after: 100 }
          });
        }

        return new Paragraph({
          children: [
            new TextRun({
              text: line,
              font: 'Calibri',
              bold: isHeader,
              size: isHeader ? 26 : 22,
              color: isHeader ? '1e3a8a' : '1e293b'
            })
          ],
          spacing: { after: 120 }
        });
      });

      const doc = new Document({
        title: template.title,
        description: template.description,
        sections: [
          {
            properties: {},
            children: paragraphs
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      const filename = `${template.id}_${new Date().toISOString().slice(0, 10)}.docx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Word (.docx) template downloaded successfully! 📄');
    } catch (err) {
      console.error('Docx generation error:', err);
      showToast('Error generating .docx file. Please try again.');
    } finally {
      setIsExportingDocx(false);
    }
  };


  // Quick Copy formatted text
  const handleCopyText = (template: TemplateItem, valuesToUse?: Record<string, string>) => {
    const values = valuesToUse || customFieldValues;
    const text = template.generateText(values);
    navigator.clipboard.writeText(text);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2500);
    showToast('Template text copied to clipboard! 📋');
  };

  // Browser Print / Save as PDF
  const handlePrint = () => {
    if (!activeTemplate) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Popup blocked. Please allow popups to print/save PDF.');
      return;
    }

    const htmlContent = activeTemplate.generateHtml(customFieldValues);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeTemplate.title}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
              margin: 0; 
              padding: 10px; 
              background: #ffffff;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Category Colors
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Business': return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Briefcase };
      case 'Legal': return { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: Scale };
      case 'Career': return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FileCheck };
      case 'Academic': return { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: GraduationCap };
      case 'Matrimonial': return { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: Heart };
      default: return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Layers };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col selection:bg-blue-200">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-semibold text-xs border border-slate-700 animate-bounce">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
            <Download className="w-3.5 h-3.5" />
            <span>100% Free Professional Document Vault</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Free Official Template Downloads
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Download verified, print-ready templates in <strong>Microsoft Word (.docx)</strong>, <strong>PDF</strong>, and <strong>HTML</strong>. Customize any document instantly with live in-browser preview!
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-1.5 text-blue-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Vetted Formats
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-1.5 text-blue-200">
              <FileText className="w-4 h-4 text-amber-400" /> Native Word (.docx)
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-1.5 text-blue-200">
              <Printer className="w-4 h-4 text-rose-400" /> A4 Print Ready
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-1.5 text-blue-200">
              <Check className="w-4 h-4 text-blue-400" /> No Sign-Up Required
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by name, keyword (e.g. invoice, rent agreement, affidavit, resignation, biodata)..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Format Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">Format:</span>
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setSelectedFormat('ALL')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedFormat === 'ALL' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFormat('DOCX')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedFormat === 'DOCX' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Word (.docx)
                </button>
                <button
                  onClick={() => setSelectedFormat('PDF')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedFormat === 'PDF' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PDF
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Showing <strong>{filteredTemplates.length}</strong> verified templates</span>
            {(searchQuery || selectedCategory !== 'All Categories' || selectedFormat !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setSelectedFormat('ALL');
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => {
              const catStyle = getCategoryColor(template.category);
              const CatIcon = catStyle.icon;

              return (
                <div
                  key={template.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Card Top */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${catStyle.bg}`}>
                        <CatIcon className="w-3.5 h-3.5" />
                        <span>{template.category}</span>
                      </span>

                      {template.badge && (
                        <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 tracking-wider">
                          {template.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                      {template.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                      {template.description}
                    </p>

                    {/* Supported Formats */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                      {template.formats.map(fmt => (
                        <span 
                          key={fmt}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600 font-mono"
                        >
                          .{fmt}
                        </span>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1 flex-wrap pt-2 border-t border-slate-100">
                      {template.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="bg-slate-50 p-3 px-5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenPreview(template)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview & Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        const defaults: Record<string, string> = {};
                        template.fields.forEach(f => { defaults[f.key] = f.defaultValue; });
                        handleDownloadDocx(template, defaults);
                      }}
                      title="Instant Download Word (.docx)"
                      className="p-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      onClick={() => {
                        const defaults: Record<string, string> = {};
                        template.fields.forEach(f => { defaults[f.key] = f.defaultValue; });
                        handleCopyText(template, defaults);
                      }}
                      title="Copy Text to Clipboard"
                      className="p-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
                    >
                      {copiedId === template.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No templates found</h3>
            <p className="text-xs text-slate-500 mb-4">
              Try searching with another keyword or adjust your category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedFormat('ALL');
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Informative Guidance & Steps */}
        <section className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            How to Customize & Download Your Free Templates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Select & Preview</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose any template from our verified collection across Business, Legal, Career, or Academic categories and click <strong>Preview & Edit</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Personalize Details</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fill in your company name, dates, names, and customized values in the real-time editor. The preview updates simultaneously.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Download Word / PDF</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Export cleanly formatted <strong>.DOCX</strong> files directly editable in Microsoft Word or Google Docs, or print directly to A4 PDF.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Full-Featured Interactive Preview & Customizer Modal */}
      {activeTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 px-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    {activeTemplate.category}
                  </span>
                  <span className="text-xs text-slate-400">Live Editor & Export Studio</span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {activeTemplate.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveTemplate(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Split 2 Columns (Editor Form + Live Preview) */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              
              {/* Left Column: Interactive Customizer Form (5 cols) */}
              <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-50/60 overflow-y-auto max-h-[60vh] lg:max-h-[calc(92vh-140px)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    Customize Template Fields
                  </h3>
                  <button
                    onClick={handleResetFields}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Update any field below to see the preview adjust in real-time.
                </p>

                <div className="space-y-3">
                  {activeTemplate.fields.map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={customFieldValues[field.key] ?? field.defaultValue}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          value={customFieldValues[field.key] ?? field.defaultValue}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 font-medium"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live A4 Visual Document Preview (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 bg-slate-200/50 overflow-y-auto max-h-[60vh] lg:max-h-[calc(92vh-140px)] flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-500 font-semibold px-1">
                  <span>Live Paper Document Preview</span>
                  <span className="text-[11px] font-mono">Standard A4 Layout</span>
                </div>

                <div 
                  ref={printAreaRef}
                  className="w-full bg-white rounded-2xl shadow-xl border border-slate-300 p-6 sm:p-8"
                  dangerouslySetInnerHTML={{
                    __html: activeTemplate.generateHtml(customFieldValues)
                  }}
                />
              </div>

            </div>

            {/* Modal Bottom Export Toolbar */}
            <div className="p-4 px-6 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium hidden sm:block">
                All downloads are 100% free and water-mark free.
              </div>

              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleCopyText(activeTemplate)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                  <span>Print / PDF</span>
                </button>

                <button
                  onClick={() => handleDownloadDocx(activeTemplate)}
                  disabled={isExportingDocx}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingDocx ? 'Generating DOCX...' : 'Download Word (.DOCX)'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
