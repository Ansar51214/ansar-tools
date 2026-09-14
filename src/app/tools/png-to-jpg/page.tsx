'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Image as ImageIcon, Upload, Download, Copy, Trash2,
  RefreshCw, CheckCircle2, ShieldCheck, Sparkles, Sliders,
  Layers, Eye, FileArchive, X, Check, Palette, ArrowRight,
  Maximize2, Loader2, ArrowDown
} from 'lucide-react';
import JSZip from 'jszip';

export interface ConvertedItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  convertedSize: number;
  originalDataUrl: string;
  convertedDataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  savingsPercent: number;
}

const BG_COLOR_PRESETS = [
  { name: 'Pure White', hex: '#ffffff', border: 'border-slate-300' },
  { name: 'Pure Black', hex: '#000000', border: 'border-slate-700' },
  { name: 'Soft Slate', hex: '#0f172a', border: 'border-slate-700' },
  { name: 'Light Gray', hex: '#f8fafc', border: 'border-slate-300' },
  { name: 'Warm Cream', hex: '#fffbeb', border: 'border-amber-200' },
  { name: 'Navy Blue', hex: '#1e3a8a', border: 'border-blue-700' },
];

export default function PngToJpgPage() {
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [quality, setQuality] = useState<number>(0.92);
  const [maxDimension, setMaxDimension] = useState<string>('original'); // 'original' | '3840' | '1920' | '1280'

  // Modal Inspection
  const [previewItem, setPreviewItem] = useState<ConvertedItem | null>(null);
  const [previewMode, setPreviewMode] = useState<'converted' | 'original'>('converted');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Convert a single PNG file into JPG
  const convertFile = (
    file: File,
    bgHex: string,
    qualityVal: number,
    maxDim: string,
    existingOriginalDataUrl?: string
  ): Promise<ConvertedItem> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        if (maxDim !== 'original') {
          const max = parseInt(maxDim, 10);
          if (w > max || h > max) {
            if (w >= h) {
              h = Math.round((h * max) / w);
              w = max;
            } else {
              w = Math.round((w * max) / h);
              h = max;
            }
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Fill background color first to seamlessly replace transparency
        ctx.fillStyle = bgHex;
        ctx.fillRect(0, 0, w, h);

        // Draw image over background
        ctx.drawImage(img, 0, 0, w, h);

        const convertedDataUrl = canvas.toDataURL('image/jpeg', qualityVal);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to generate JPG blob'));
            return;
          }
          const convertedSize = blob.size;
          const savings = Math.max(0, Math.round(((file.size - convertedSize) / file.size) * 100));

          // Also get original dataUrl for comparison if not passed
          let origUrl = existingOriginalDataUrl;
          if (!origUrl) {
            const origCanvas = document.createElement('canvas');
            origCanvas.width = img.naturalWidth;
            origCanvas.height = img.naturalHeight;
            const origCtx = origCanvas.getContext('2d');
            origCtx?.drawImage(img, 0, 0);
            origUrl = origCanvas.toDataURL('image/png');
          }

          const baseName = file.name.replace(/\.png$/i, '');
          resolve({
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            file,
            name: `${baseName}.jpg`,
            originalSize: file.size,
            convertedSize,
            originalDataUrl: origUrl,
            convertedDataUrl,
            blob,
            width: w,
            height: h,
            savingsPercent: savings,
          });
        }, 'image/jpeg', qualityVal);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to parse PNG file'));
      };
    });
  };

  // Process incoming files
  const processFiles = async (fileList: File[]) => {
    const pngs = fileList.filter(
      (f) => f.type === 'image/png' || f.name.toLowerCase().endsWith('.png')
    );

    if (pngs.length === 0) {
      alert('Please upload valid PNG images (.png).');
      return;
    }

    setLoading(true);
    try {
      const convertedList: ConvertedItem[] = [];
      for (const file of pngs) {
        const item = await convertFile(file, bgColor, quality, maxDimension);
        convertedList.push(item);
      }
      setItems((prev) => [...prev, ...convertedList]);
      showToast(`Converted ${convertedList.length} PNG image${convertedList.length > 1 ? 's' : ''} to JPG!`);
    } catch (err: any) {
      console.error('Conversion error:', err);
      alert(`Error converting images: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Re-render all loaded images when settings change
  const handleSettingsChange = async (newBg: string, newQuality: number, newMaxDim: string) => {
    setBgColor(newBg);
    setQuality(newQuality);
    setMaxDimension(newMaxDim);

    if (items.length === 0) return;

    setLoading(true);
    try {
      const updated = await Promise.all(
        items.map((item) =>
          convertFile(item.file, newBg, newQuality, newMaxDim, item.originalDataUrl)
        )
      );
      setItems(updated);
      showToast('Updated JPG settings for all images');
    } catch (err) {
      console.error('Error updating settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    if (items.length === 0) return;
    if (confirm('Clear all converted images?')) {
      setItems([]);
    }
  };

  // Download Single JPG
  const downloadSingle = (item: ConvertedItem) => {
    const link = document.createElement('a');
    link.href = item.convertedDataUrl;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${item.name}`);
  };

  // Copy JPG to Clipboard
  const copyToClipboard = async (item: ConvertedItem) => {
    try {
      // Modern browsers require image/png for clipboard copy
      const img = new Image();
      img.src = item.convertedDataUrl;
      await new Promise((res) => (img.onload = res));
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          showToast(`Copied ${item.name} to Clipboard!`);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Clipboard copy error:', err);
      showToast('Clipboard copy blocked by browser. Please use direct download.');
    }
  };

  // Download All as ZIP
  const downloadAllAsZip = async () => {
    if (items.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('converted_jpg_images') || zip;

      for (const item of items) {
        const base64Data = item.convertedDataUrl.split(',')[1];
        folder.file(item.name, base64Data, { base64: true });
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ansar_converted_jpgs_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`Downloaded ZIP with ${items.length} JPG images!`);
    } catch (err) {
      console.error('ZIP error:', err);
      alert('Error creating ZIP archive.');
    } finally {
      setIsZipping(false);
    }
  };

  // 1-Click "Try Sample PNG" Demo Generator
  const loadSamplePng = async () => {
    try {
      setLoading(true);

      // Create a transparent PNG on an HTML5 canvas
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Transparent background by default
      // Draw circular shield badge
      const grad = ctx.createLinearGradient(150, 150, 650, 650);
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(0.5, '#06b6d4');
      grad.addColorStop(1, '#3b82f6');

      ctx.beginPath();
      ctx.arc(400, 400, 280, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;
      ctx.fill();

      // Inner ring
      ctx.beginPath();
      ctx.arc(400, 400, 240, 0, Math.PI * 2);
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.stroke();

      // Center Icon: Star
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(400, 260);
      ctx.lineTo(440, 350);
      ctx.lineTo(530, 360);
      ctx.lineTo(465, 420);
      ctx.lineTo(485, 510);
      ctx.lineTo(400, 460);
      ctx.lineTo(315, 510);
      ctx.lineTo(335, 420);
      ctx.lineTo(270, 360);
      ctx.lineTo(360, 350);
      ctx.closePath();
      ctx.fill();

      // Text inside badge
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('ANSAR TOOLS', 400, 570);
      ctx.font = '20px sans-serif';
      ctx.fillText('Transparent PNG Test', 400, 605);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const sampleFile = new File([blob], 'ansar_transparent_badge_sample.png', {
            type: 'image/png',
          });
          await processFiles([sampleFile]);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error generating sample:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalOriginalBytes = items.reduce((sum, i) => sum + i.originalSize, 0);
  const totalConvertedBytes = items.reduce((sum, i) => sum + i.convertedSize, 0);
  const totalSavedPercent = totalOriginalBytes > 0
    ? Math.max(0, Math.round(((totalOriginalBytes - totalConvertedBytes) / totalOriginalBytes) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar />

      {/* TOP HERO HEADER */}
      <header className="bg-slate-950/95 border-b border-slate-800 py-6 px-4 sm:px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Ansar Pro PNG to JPG Converter
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Free &amp; Private
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Convert transparent or high-res PNGs to clean JPGs with custom background color &amp; quality control.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadSamplePng}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Try Sample PNG</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload PNG Files</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,image/png"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="bg-slate-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex items-center justify-center gap-3 text-center">
            <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            <span className="text-sm font-bold text-white">
              Processing and rendering JPG images in browser memory...
            </span>
          </div>
        )}

        {/* EMPTY STATE / DRAG & DROP ZONE */}
        {items.length === 0 && !loading && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-950/60 hover:bg-slate-950 transition-all rounded-3xl p-12 sm:p-20 flex flex-col items-center justify-center text-center cursor-pointer group shadow-xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/10">
              <ImageIcon className="w-9 h-9" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Drag &amp; Drop your PNG images here, or <span className="text-amber-400 underline decoration-amber-500/40">Browse</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
              Convert multiple PNGs into JPG with custom transparent background color fill, quality slider, and batch ZIP export.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Client-Side Privacy
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Palette className="w-4 h-4 text-teal-400" /> Custom Transparent Background Fill
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Sliders className="w-4 h-4 text-amber-400" /> 50% - 100% Quality Compression
              </span>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 w-full max-w-sm flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  loadSamplePng();
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 underline underline-offset-4 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Click here to test with a transparent sample PNG
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE CONVERSION STUDIO */}
        {items.length > 0 && (
          <div className="flex flex-col gap-6">

            {/* CONTROL PANEL CARD */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-5">

              {/* Summary Stats Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      PNG to JPG Queue
                      <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {items.length} Image{items.length > 1 ? 's' : ''}
                      </span>
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Original: {formatBytes(totalOriginalBytes)}</span>
                      <span>→</span>
                      <span className="text-emerald-400 font-bold">New JPG: {formatBytes(totalConvertedBytes)}</span>
                      {totalSavedPercent > 0 && (
                        <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          ({totalSavedPercent}% smaller)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Add More PNGs
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                </div>
              </div>

              {/* Conversion Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* 1. Transparent Background Fill Color */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-400" /> Transparent Background Fill
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 uppercase">{bgColor}</span>
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {BG_COLOR_PRESETS.map((p) => (
                      <button
                        key={p.hex}
                        type="button"
                        onClick={() => handleSettingsChange(p.hex, quality, maxDimension)}
                        style={{ backgroundColor: p.hex }}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer relative ${
                          bgColor.toLowerCase() === p.hex.toLowerCase()
                            ? 'ring-2 ring-amber-400 scale-110'
                            : p.border
                        }`}
                        title={`Set background to ${p.name}`}
                      >
                        {bgColor.toLowerCase() === p.hex.toLowerCase() && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Check className={`w-3.5 h-3.5 ${p.hex === '#ffffff' || p.hex === '#fffbeb' ? 'text-black' : 'text-white'}`} />
                          </span>
                        )}
                      </button>
                    ))}
                    {/* Custom Color Input */}
                    <label
                      className="w-7 h-7 rounded-full border border-slate-700 bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center cursor-pointer overflow-hidden"
                      title="Pick custom background color"
                    >
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => handleSettingsChange(e.target.value, quality, maxDimension)}
                        className="opacity-0 w-0 h-0"
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    JPG doesn&apos;t support transparency. We fill transparent areas with this color instead of ugly black boxes.
                  </span>
                </div>

                {/* 2. JPG Quality Slider */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-400" /> JPG Quality
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => handleSettingsChange(bgColor, parseFloat(e.target.value), maxDimension)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">
                    92% delivers optimal clarity with 70%+ file size reduction.
                  </span>
                </div>

                {/* 3. Max Dimension Resizer */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" /> Max Dimension (Optional)
                  </label>
                  <div className="grid grid-cols-4 gap-1 pt-1">
                    {[
                      { label: 'Original', val: 'original' },
                      { label: '4K', val: '3840' },
                      { label: '1080p', val: '1920' },
                      { label: '720p', val: '1280' },
                    ].map((d) => (
                      <button
                        key={d.val}
                        type="button"
                        onClick={() => handleSettingsChange(bgColor, quality, d.val)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          maxDimension === d.val
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Keeps exact aspect ratio while scaling large images down.
                  </span>
                </div>

              </div>

              {/* Batch Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Ready to export <span className="text-white font-bold">{items.length} JPG</span> file{items.length > 1 ? 's' : ''}
                </span>

                <button
                  type="button"
                  onClick={downloadAllAsZip}
                  disabled={items.length === 0 || isZipping}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                >
                  {isZipping ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <FileArchive className="w-4 h-4 text-white" />
                  )}
                  <span>
                    {isZipping ? 'Packaging ZIP Archive...' : `Download All ${items.length} JPGs (ZIP)`}
                  </span>
                </button>
              </div>

            </div>

            {/* CONVERTED IMAGES GRID */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" /> Converted JPG Files ({items.length})
                </h3>
                <span className="text-xs text-slate-400">
                  Click any card to inspect before/after • 1-Click Copy or Download
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col"
                  >
                    {/* Card Header: File Name & Remove */}
                    <div className="p-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-white truncate max-w-[180px]" title={item.name}>
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Preview Thumbnail Box with Click to Inspect */}
                    <div
                      onClick={() => setPreviewItem(item)}
                      className="relative w-full aspect-[4/3] flex items-center justify-center p-2 cursor-zoom-in overflow-hidden"
                      style={{ backgroundColor: bgColor }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.convertedDataUrl}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                        <span className="px-3 py-1.5 bg-slate-900/90 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-lg border border-slate-700">
                          <Eye className="w-3.5 h-3.5 text-amber-400" /> Click to Inspect
                        </span>
                      </div>
                    </div>

                    {/* File Size & Dimensions Info */}
                    <div className="px-3 py-2 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span className="line-through text-slate-500">{formatBytes(item.originalSize)}</span>
                        <span>→</span>
                        <span className="text-emerald-400 font-bold">{formatBytes(item.convertedSize)}</span>
                      </div>

                      {item.savingsPercent > 0 ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          -{item.savingsPercent}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.width}×{item.height}
                        </span>
                      )}
                    </div>

                    {/* Action Bar Footer */}
                    <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item)}
                        className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 border border-slate-800 transition-colors cursor-pointer"
                        title="Copy image to clipboard"
                      >
                        <Copy className="w-3 h-3 text-blue-400" />
                        <span>Copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadSingle(item)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
                        title={`Download ${item.name}`}
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FULL-SCREEN ZOOM & COMPARISON MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {previewItem.name}
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  ({previewItem.width} × {previewItem.height} px • {formatBytes(previewItem.convertedSize)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Toggle Before/After */}
                <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('original')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      previewMode === 'original' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Original PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('converted')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      previewMode === 'converted' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Converted JPG
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(previewItem)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-400" /> Copy
                </button>
                <button
                  type="button"
                  onClick={() => downloadSingle(previewItem)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Image Preview */}
            <div
              className={`flex-1 overflow-auto p-6 flex items-center justify-center ${
                previewMode === 'original'
                  ? 'bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] bg-slate-950'
                  : ''
              }`}
              style={previewMode === 'converted' ? { backgroundColor: bgColor } : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewMode === 'original' ? previewItem.originalDataUrl : previewItem.convertedDataUrl}
                alt={previewItem.name}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-between px-6">
              <span>
                {previewMode === 'original' ? 'Viewing Original PNG (Transparent Grid)' : `Viewing Converted JPG (${bgColor} fill)`}
              </span>
              <span>Press Esc or click close to return</span>
            </div>

          </div>
        </div>
      )}

      {/* BENCHMARK & ADVANTAGE SECTION */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 mt-6 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Benchmark Advantage
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-3">
            Why Ansar Pro PNG to JPG Outperforms Online Converters
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero black background artifacts, real-time quality control, and complete client-side privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">No More Black Backgrounds</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard converters turn transparent PNGs into ugly black blocks. Our custom backdrop engine fills transparent alpha layers with pure white, black, or your choice of brand colors.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">70%+ Size Reduction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fine-tune your JPG compression slider from 50% to 100% with real-time file size savings counter. Dramatically speeds up web page loading and email attachments.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">100% Private &amp; Batch ZIP</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your photos never upload to remote servers. All processing is executed directly on your device via HTML5 canvas, with 1-click batch ZIP download and direct clipboard copying.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
