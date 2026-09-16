'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ToolPageHeader from '@/components/ToolPageHeader';
import Footer from '@/components/Footer';
import {
  curatedPrompts,
  PromptItem,
  CATEGORIES
} from '@/data/promptsData';
import {
  Search,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  ExternalLink,
  Plus,
  Trash2,
  RotateCcw,
  Sliders,
  Download,
  FileText,
  X,
  FolderPlus,
  Eye,
  ArrowRight,
  MessageSquare,
  Send,
  MousePointerClick
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'ID Cards': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Banners': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Invitations': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Visuals': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Templates': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Logos': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Albums': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'Thumbnails': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Marketing': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Coding': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Writing': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Career': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Study': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Business': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'Productivity': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' }
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  'ID Cards': 'from-purple-600 to-indigo-600',
  'Banners': 'from-orange-500 to-amber-600',
  'Invitations': 'from-rose-500 to-pink-600',
  'Visuals': 'from-pink-500 to-purple-600',
  'Templates': 'from-indigo-600 to-blue-600',
  'Logos': 'from-amber-500 to-yellow-600',
  'Albums': 'from-teal-600 to-emerald-600',
  'Thumbnails': 'from-red-600 to-rose-600',
  'Marketing': 'from-emerald-600 to-teal-600',
  'Coding': 'from-blue-600 to-indigo-600',
  'Writing': 'from-purple-600 to-pink-600',
  'Career': 'from-amber-500 to-orange-600',
  'Study': 'from-indigo-600 to-blue-600',
  'Business': 'from-teal-600 to-emerald-600',
  'Productivity': 'from-cyan-600 to-blue-600'
};

function generateCustomPromptId(): string {
  return `custom-${Date.now()}`;
}

export default function AIPromptsGalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customPrompts, setCustomPrompts] = useState<PromptItem[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const savedFavs = localStorage.getItem('ansar_ai_prompt_favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
      const savedCustom = localStorage.getItem('ansar_ai_custom_prompts');
      if (savedCustom) {
        setCustomPrompts(JSON.parse(savedCustom));
      }
    } catch {
      // Ignore read errors
    }
  }, []);
  
  // Modals & Card Flip state
  const [customizerPrompt, setCustomizerPrompt] = useState<PromptItem | null>(null);
  const [customizerValues, setCustomizerValues] = useState<Record<string, string>>({});
  const [isNewPromptModalOpen, setIsNewPromptModalOpen] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New prompt form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PromptItem['category']>('Coding');
  const [newDescription, setNewDescription] = useState('');
  const [newTemplate, setNewTemplate] = useState('');
  const [newTags, setNewTags] = useState('');



  // Save favorites to LocalStorage
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('ansar_ai_prompt_favorites', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites! ⭐');
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Extract variables from template: [VAR_NAME]
  const extractVariables = (template: string): string[] => {
    const matches = template.match(/\[([A-Z0-9_ -]+)\]/g);
    if (!matches) return [];
    const unique = Array.from(new Set(matches.map(m => m.slice(1, -1))));
    return unique;
  };

  // Open Customizer
  const handleOpenCustomizer = (prompt: PromptItem) => {
    setCustomizerPrompt(prompt);
    const vars = extractVariables(prompt.promptTemplate);
    const initial: Record<string, string> = {};
    vars.forEach(v => {
      initial[v] = prompt.defaultVariables?.[v] || '';
    });
    setCustomizerValues(initial);
  };

  // Calculate customized prompt output
  const customizedOutput = useMemo(() => {
    if (!customizerPrompt) return '';
    let result = customizerPrompt.promptTemplate;
    Object.entries(customizerValues).forEach(([key, val]) => {
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      result = result.replace(regex, val.trim() || `[${key}]`);
    });
    return result;
  }, [customizerPrompt, customizerValues]);

  // Copy to clipboard
  const handleCopy = async (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Prompt copied to clipboard! 📋');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Direct AI platform launches
  const openInChatGPT = (text: string) => {
    const url = `https://chatgpt.com/?q=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const openInClaude = (text: string) => {
    const url = `https://claude.ai/new?q=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const openInGemini = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Prompt copied! Opening Google Gemini...');
    setTimeout(() => {
      window.open('https://gemini.google.com/app', '_blank');
    }, 400);
  };

  const shareToWhatsApp = (text: string) => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Add custom prompt
  const handleCreateCustomPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTemplate.trim()) {
      showToast('Please enter both a title and prompt template');
      return;
    }

    const newPrompt: PromptItem = {
      id: generateCustomPromptId(),
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Custom prompt created by you.',
      targetModels: ['ChatGPT', 'Claude'],
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      promptTemplate: newTemplate.trim(),
      isCustom: true
    };

    const updated = [newPrompt, ...customPrompts];
    setCustomPrompts(updated);
    try {
      localStorage.setItem('ansar_ai_custom_prompts', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setIsNewPromptModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewTemplate('');
    setNewTags('');
    showToast('Custom prompt added to your Vault! 📁');
  };

  // Delete custom prompt
  const handleDeleteCustomPrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this custom prompt?')) return;
    const updated = customPrompts.filter(p => p.id !== id);
    setCustomPrompts(updated);
    try {
      localStorage.setItem('ansar_ai_custom_prompts', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    showToast('Custom prompt deleted.');
  };

  // Export all saved prompts as JSON
  const handleExportJSON = () => {
    const allPrompts = [...curatedPrompts, ...customPrompts];
    const saved = allPrompts.filter(p => favorites.includes(p.id) || p.isCustom);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(saved, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ansar-prompts-vault-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Prompt Vault exported to JSON! 💾');
  };

  // Export as Markdown
  const handleExportMarkdown = () => {
    const allPrompts = [...curatedPrompts, ...customPrompts];
    const saved = allPrompts.filter(p => favorites.includes(p.id) || p.isCustom);
    let md = `# Ansar Pro AI Prompts Vault\nExported on: ${new Date().toLocaleDateString()}\n\n`;
    saved.forEach((p, idx) => {
      md += `## ${idx + 1}. ${p.title} (${p.category})\n`;
      md += `> ${p.description}\n\n`;
      md += `**Target Models:** ${p.targetModels.join(', ')}\n\n`;
      md += `\`\`\`\n${p.promptTemplate}\n\`\`\`\n\n---\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ansar-prompts-vault-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Prompt Vault exported to Markdown! 📄');
  };

  // Download individual prompt as .txt file
  const handleDownloadTxt = (title: string, text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-prompt.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Prompt saved as .txt file! 💾');
  };

  // Filtered prompt list
  const combinedPrompts = useMemo(() => {
    return [...customPrompts, ...curatedPrompts];
  }, [customPrompts]);

  const filteredPrompts = useMemo(() => {
    return combinedPrompts.filter(prompt => {
      // Category filter
      if (activeCategory === 'saved') {
        if (!favorites.includes(prompt.id)) return false;
      } else if (activeCategory === 'custom') {
        if (!prompt.isCustom) return false;
      } else if (activeCategory !== 'all') {
        if (prompt.category !== activeCategory) return false;
      }

      // Model filter
      if (selectedModel !== 'all') {
        const hasModel = prompt.targetModels.some(m => 
          m.toLowerCase().includes(selectedModel.toLowerCase())
        );
        if (!hasModel) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prompt.title.toLowerCase().includes(q);
        const matchesDesc = prompt.description.toLowerCase().includes(q);
        const matchesCategory = prompt.category.toLowerCase().includes(q);
        const matchesTags = prompt.tags.some(t => t.toLowerCase().includes(q));
        const matchesContent = prompt.promptTemplate.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesTags && !matchesContent) {
          return false;
        }
      }

      return true;
    });
  }, [combinedPrompts, activeCategory, selectedModel, searchQuery, favorites]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        <ToolPageHeader toolName="AI Prompts Gallery" theme="light" />
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce text-sm font-medium">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#f8faff] via-[#f4f0ff] to-white text-slate-900 pt-10 pb-10 px-4 relative overflow-hidden text-center border-b border-slate-100">
        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* Large Hero Heading: Copy Paste & Generate */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4 select-none">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Copy </span>
            <span className="text-slate-900">Paste & </span>
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Generate</span>
          </h1>

          {/* Subtitle with Explore AI Tools pill */}
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed font-normal">
            Your premium library for AI generation prompts. Click on any design to reveal the prompt and export it directly to ChatGPT or Gemini.{' '}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold align-middle shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Explore AI Tools
            </span>
          </p>

          {/* Social Media Follow Pills (Exact matching from screenshot) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8">
            {/* YouTube */}
            <a 
              href="https://www.youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff0000] hover:bg-[#d90000] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>Subscribe on YouTube</span>
            </a>

            {/* Facebook */}
            <a 
              href="https://www.facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1877f2] hover:bg-[#1464c8] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Follow on Facebook</span>
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <span>Instagram</span>
            </a>

            {/* Telegram */}
            <a 
              href="https://telegram.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Telegram Channel</span>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://whatsapp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Channel</span>
            </a>
          </div>

          {/* Category Filter Pills (Exact Matching from Screenshot with vibrant active magenta) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-5xl mx-auto">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              const count = cat.id === 'all' 
                ? combinedPrompts.length 
                : cat.id === 'saved'
                ? favorites.length
                : cat.id === 'custom'
                ? customPrompts.length
                : combinedPrompts.filter(p => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#d9148c] text-white shadow-lg shadow-pink-200 scale-105 ring-2 ring-pink-300'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Studio Controls & Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-16">
        
        {/* Search & Action Bar */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-4 sm:p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts by keyword: ID card, banner, wedding card, portrait, midjourney..."
                className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:bg-white text-sm sm:text-base transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Model Filter Pills & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setSelectedModel('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${selectedModel === 'all' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  All Models
                </button>
                <button
                  onClick={() => setSelectedModel('ChatGPT')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${selectedModel === 'ChatGPT' ? 'bg-emerald-600 shadow text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  ChatGPT
                </button>
                <button
                  onClick={() => setSelectedModel('Midjourney')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${selectedModel === 'Midjourney' ? 'bg-indigo-600 shadow text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Midjourney
                </button>
                <button
                  onClick={() => setSelectedModel('Flux')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${selectedModel === 'Flux' ? 'bg-purple-600 shadow text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Flux
                </button>
                <button
                  onClick={() => setSelectedModel('Gemini')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${selectedModel === 'Gemini' ? 'bg-blue-600 shadow text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Gemini
                </button>
              </div>

              {/* Add Custom Prompt Button */}
              <button
                onClick={() => setIsNewPromptModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Custom Prompt</span>
              </button>

              {/* Export Vault Button */}
              <div className="relative group">
                <button
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                  title="Export Vault"
                >
                  <Download className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 hidden group-hover:block z-30">
                  <button
                    onClick={handleExportJSON}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" /> Export JSON
                  </button>
                  <button
                    onClick={handleExportMarkdown}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" /> Export Markdown
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map(prompt => {
            const isFav = favorites.includes(prompt.id);
            const isFlipped = !!flippedCards[prompt.id];
            const varCount = extractVariables(prompt.promptTemplate).length;
            const catColor = CATEGORY_COLORS[prompt.category] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
            const catGradient = CATEGORY_GRADIENTS[prompt.category] || 'from-blue-600 to-indigo-600';

            return (
              <div 
                key={prompt.id} 
                className="h-[500px] select-none [perspective:1000px] group"
              >
                <div 
                  className="relative w-full h-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d]"
                  style={{
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* ================= FRONT OF CARD ================= */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-pink-300 flex flex-col justify-between p-4 sm:p-5 transition-all overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
                  >
                    {/* Top Content */}
                    <div>
                      {/* Image Preview Banner if prompt has an imageUrl */}
                      {prompt.imageUrl ? (
                        <div 
                          onClick={(e) => toggleCardFlip(prompt.id, e)}
                          className="h-52 w-full relative rounded-2xl overflow-hidden mb-3 bg-slate-900 shadow-inner group/img cursor-pointer"
                        >
                          {/* Blur Backdrop */}
                          <div 
                            className="absolute inset-0 bg-cover bg-center blur-md opacity-40 scale-110" 
                            style={{ backgroundImage: `url(${prompt.imageUrl})` }} 
                          />
                          {/* Crisp Center Image */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={prompt.imageUrl} 
                            alt={prompt.title} 
                            className="relative z-10 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" 
                          />
                          
                          {/* Top-Left Glass AI Gen Badge */}
                          <span className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg flex items-center gap-1 border border-white/20 shadow">
                            <Sparkles className="w-3 h-3 text-amber-400" /> AI Gen
                          </span>

                          {/* Top-Right Category Badge */}
                          <span className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20 shadow">
                            {prompt.category}
                          </span>

                          {/* Hover / Tap Overlay */}
                          <div className="absolute inset-0 z-20 bg-slate-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                            <MousePointerClick className="w-4 h-4 text-amber-400 animate-bounce" />
                            <span>Tap to Reveal Prompt</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Visual category gradient bar for text/code prompts */}
                          <div className={`h-2.5 w-full rounded-full bg-gradient-to-r ${catGradient} mb-3.5 opacity-90`} />

                          {/* Badges & Favorite */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                                {prompt.category}
                              </span>
                              {varCount > 0 ? (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-md flex items-center gap-1">
                                  <Sliders className="w-3 h-3" /> {varCount} Variables
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> Ready to Use
                                </span>
                              )}
                            </div>

                            {prompt.isCustom && (
                              <button
                                onClick={(e) => handleDeleteCustomPrompt(prompt.id, e)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete custom prompt"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </>
                      )}

                      {/* Title & Description */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-fuchsia-600 transition-colors line-clamp-1">
                          {prompt.title}
                        </h3>
                        <button
                          onClick={(e) => toggleFavorite(prompt.id, e)}
                          className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                            isFav 
                              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                        >
                          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                        {prompt.description}
                      </p>

                      {/* Interactive Preview Box (if no image or secondary teaser) */}
                      {!prompt.imageUrl && (
                        <div 
                          onClick={(e) => toggleCardFlip(prompt.id, e)}
                          className="bg-slate-50 hover:bg-fuchsia-50/50 border border-slate-200/80 hover:border-fuchsia-300 rounded-2xl p-3 cursor-pointer transition-all relative group/box shadow-inner"
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                            <span className="tracking-wider">PREVIEW PROMPT</span>
                            <span className="text-fuchsia-600 flex items-center gap-1 font-semibold group-hover/box:underline">
                              Tap to Flip <ArrowRight className="w-3 h-3 group-hover/box:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-mono leading-relaxed line-clamp-3 select-none">
                            {prompt.promptTemplate}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Front Bottom Controls */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                      {/* Model Tags & Quick Copy */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1 flex-wrap">
                          {prompt.targetModels.slice(0, 3).map((m, i) => (
                            <span key={i} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {m}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={(e) => handleCopy(prompt.promptTemplate, prompt.id, e)}
                          className="p-1.5 text-slate-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-all"
                          title="Quick Copy Raw Prompt"
                        >
                          {copiedId === prompt.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Reveal & Next View CTA Button */}
                      <button
                        onClick={(e) => toggleCardFlip(prompt.id, e)}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow flex items-center justify-center gap-2 transition-all active:scale-95 group/btn"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300 group-hover/btn:rotate-12 transition-transform" />
                        <span>Click to Reveal Prompt & Next View</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* ================= BACK OF CARD (REVEALED / NEXT VIEW) ================= */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-slate-900 text-white rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col justify-between p-4 sm:p-5 overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
                    style={{
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    {/* Back Header */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="p-1.5 bg-fuchsia-500/20 text-fuchsia-400 rounded-lg border border-fuchsia-400/30 flex-shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider block">Prompt Formula</span>
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{prompt.title}</h4>
                          </div>
                        </div>

                        <button
                          onClick={(e) => toggleCardFlip(prompt.id, e)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex-shrink-0"
                          title="Flip back to front"
                        >
                          <RotateCcw className="w-3 h-3 text-amber-400" />
                          <span>Flip Back</span>
                        </button>
                      </div>

                      {/* Scrollable Prompt Formula Code View */}
                      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 relative group/code overflow-hidden">
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] text-slate-400 font-mono">
                          <span>FULL PROMPT FORMULA</span>
                          <span>{prompt.promptTemplate.length} chars</span>
                        </div>
                        <div className="max-h-[195px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                          <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed select-text">
                            {prompt.promptTemplate}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Back Bottom Actions */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      {/* Direct Platform 1-Click Launchers */}
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => openInChatGPT(prompt.promptTemplate)}
                          className="py-1.5 px-2 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                          title="Launch directly in ChatGPT"
                        >
                          <span>ChatGPT</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                        </button>
                        <button
                          onClick={() => openInGemini(prompt.promptTemplate)}
                          className="py-1.5 px-2 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                          title="Launch directly in Google Gemini"
                        >
                          <span>Gemini</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                        </button>
                        <button
                          onClick={() => openInClaude(prompt.promptTemplate)}
                          className="py-1.5 px-2 bg-amber-600/90 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                          title="Launch directly in Claude"
                        >
                          <span>Claude</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                        </button>
                      </div>

                      {/* Action Row: Copy, Save .txt, and Customize */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleCopy(prompt.promptTemplate, prompt.id, e)}
                          className="flex-1 py-2 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow transition-all active:scale-95"
                        >
                          {copiedId === prompt.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => handleDownloadTxt(prompt.title, prompt.promptTemplate, e)}
                          className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-slate-700 transition-all active:scale-95"
                          title="Download as .txt file"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Save</span>
                        </button>

                        <button
                          onClick={() => handleOpenCustomizer(prompt)}
                          className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-slate-700 transition-all active:scale-95"
                        >
                          <Sliders className="w-3.5 h-3.5 text-amber-400" />
                          <span>Customize</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPrompts.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-800 mb-1">No Prompts Found</h4>
            <p className="text-sm text-slate-500 mb-6">
              No matching prompts found for your search query or selected filter.
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); setSelectedModel('all'); }}
              className="px-5 py-2.5 bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow hover:bg-blue-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      {/* ================= SMART VARIABLE CUSTOMIZER MODAL ================= */}
      {customizerPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Sliders className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>{customizerPrompt.title}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">
                      {customizerPrompt.category}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill in the custom variables below — the prompt updates automatically in real-time!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCustomizerPrompt(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Split Layout */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Variable Inputs (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    1. Fill in Your Specifics
                  </h4>
                  {customizerPrompt.defaultVariables && (
                    <button
                      onClick={() => {
                        const vars = extractVariables(customizerPrompt.promptTemplate);
                        const initial: Record<string, string> = {};
                        vars.forEach(v => {
                          initial[v] = customizerPrompt.defaultVariables?.[v] || '';
                        });
                        setCustomizerValues(initial);
                        showToast('Reset to demo variables');
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Fill Example Values
                    </button>
                  )}
                </div>

                {extractVariables(customizerPrompt.promptTemplate).map(varKey => {
                  const label = varKey.replace(/_/g, ' ');
                  const isLong = /CODE|NOTES|DUMP|PROPOSAL|TEXT|POINTS|DESCRIPTION|SITUATION/i.test(varKey);

                  return (
                    <div key={varKey} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <label className="block text-xs font-bold text-slate-700 mb-1 capitalize">
                        {label}
                      </label>
                      {isLong ? (
                        <textarea
                          rows={3}
                          value={customizerValues[varKey] || ''}
                          onChange={(e) => setCustomizerValues(prev => ({ ...prev, [varKey]: e.target.value }))}
                          placeholder={`Enter ${label.toLowerCase()}...`}
                          className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 resize-y"
                        />
                      ) : (
                        <input
                          type="text"
                          value={customizerValues[varKey] || ''}
                          onChange={(e) => setCustomizerValues(prev => ({ ...prev, [varKey]: e.target.value }))}
                          placeholder={`Enter ${label.toLowerCase()}...`}
                          className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
                        />
                      )}
                    </div>
                  );
                })}

                {extractVariables(customizerPrompt.promptTemplate).length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    This prompt does not have placeholder variables. It is 100% ready to execute as-is!
                  </div>
                )}
              </div>

              {/* Right Column: Live Customized Output (7 cols) */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> 2. Real-Time Customized Prompt
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    {customizedOutput.length} chars • {customizedOutput.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 flex-1 overflow-y-auto font-mono text-xs leading-relaxed border border-slate-800 shadow-inner max-h-[380px] lg:max-h-[440px]">
                  <pre className="whitespace-pre-wrap">{customizedOutput}</pre>
                </div>
              </div>

            </div>

            {/* Modal Footer: 1-Click Launchers */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(customizedOutput, 'modal')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow flex items-center gap-2 transition-all active:scale-95"
                >
                  {copiedId === 'modal' ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Customized Prompt</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => shareToWhatsApp(customizedOutput)}
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                  title="Share on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Model Launchers */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Launch Directly in:</span>
                <button
                  onClick={() => openInChatGPT(customizedOutput)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <span>ChatGPT</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => openInClaude(customizedOutput)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <span>Claude</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => openInGemini(customizedOutput)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <span>Gemini</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= CREATE CUSTOM PROMPT MODAL ================= */}
      {isNewPromptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <FolderPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Add Prompt to Your Personal Vault</h3>
              </div>
              <button
                onClick={() => setIsNewPromptModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomPrompt} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prompt Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Next.js 15 Tailwind Hero Component Builder"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PromptItem['category'])}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Coding">Coding & Tech</option>
                    <option value="Writing">Writing & Content</option>
                    <option value="Marketing">Marketing & SEO</option>
                    <option value="Career">Career & Jobs</option>
                    <option value="Study">Study & Academics</option>
                    <option value="Visuals">AI Art & Visuals</option>
                    <option value="Business">Business & Freelancing</option>
                    <option value="Productivity">Productivity & Life</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. React, UI, Frontend"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What does this prompt achieve?"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prompt Template * <span className="font-normal text-slate-400">(Tip: Use [BRACKETS] for customizable blanks)</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  placeholder="Act as a [ROLE]. Help me write [DELIVERABLE] about [TOPIC]..."
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPromptModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
