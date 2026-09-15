'use client';

import { useState, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import {
  FileImage,
  Upload,
  Download,
  Copy,
  Eye,
  Trash2,
  FileText,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  X,
  Layers,
  Sliders,
  FileArchive,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import JSZip from 'jszip';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export type ImageFormat = 'jpeg' | 'png' | 'webp';
export type DpiMode = 72 | 150 | 300;

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
  blob?: Blob;
  selected: boolean;
}

export default function PdfToImagePage() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Settings
  const [format, setFormat] = useState<ImageFormat>('jpeg');
  const [dpi, setDpi] = useState<DpiMode>(150);
  const [quality, setQuality] = useState<number>(0.92);

  // Preview Modal
  const [previewPage, setPreviewPage] = useState<RenderedPage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfDocRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper: Dynamically load PDF.js from CDN
  const getPdfJs = useCallback((): Promise<any> => {
    const setupWorker = (pdfjs: any) => {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        try {
          const workerCode = `importScripts("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js");`;
          const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
          pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);
        } catch {
          pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        }
      }
      return pdfjs;
    };

    if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
      return Promise.resolve(setupWorker((window as any).pdfjsLib));
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById('pdfjs-cdn-script');
      if (existingScript) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if ((window as any).pdfjsLib) {
            clearInterval(interval);
            resolve(setupWorker((window as any).pdfjsLib));
          } else if (attempts > 100) {
            clearInterval(interval);
            reject(new Error('PDF.js loading timed out.'));
          }
        }, 50);
        return;
      }

      const script = document.createElement('script');
      script.id = 'pdfjs-cdn-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
      script.onload = () => {
        const pdfjs = (window as any).pdfjsLib;
        if (pdfjs) {
          resolve(setupWorker(pdfjs));
        } else {
          reject(new Error('PDF.js failed to initialize.'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js engine from CDN.'));
      document.body.appendChild(script);
    });
  }, []);

  // Format Bytes helper
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Convert a single page with specified format & DPI
  const renderSinglePage = async (
    pdfDoc: any,
    pageNumber: number,
    targetDpi: DpiMode,
    targetFormat: ImageFormat,
    targetQuality: number
  ): Promise<RenderedPage> => {
    const page = await pdfDoc.getPage(pageNumber);
    // Base PDF scale is 72 DPI
    const scale = (targetDpi / 72);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    // Fill pure white background (crucial for clean JPGs and transparent-less PDF pages)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    const mimeType = targetFormat === 'png' ? 'image/png' : targetFormat === 'webp' ? 'image/webp' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, targetFormat === 'png' ? undefined : targetQuality);

    return new Promise<RenderedPage>((resolve) => {
      canvas.toBlob((blob) => {
        resolve({
          pageNumber,
          dataUrl,
          width: canvas.width,
          height: canvas.height,
          blob: blob || undefined,
          selected: true
        });
      }, mimeType, targetFormat === 'png' ? undefined : targetQuality);
    });
  };

  // Load and process PDF file
  const processPdfFile = async (selectedFile: File) => {
    setLoading(true);
    setProgressPercent(5);
    setProgressText('Loading PDF engine...');
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSizeBytes(selectedFile.size);
    setPages([]);

    try {
      const pdfjs = await getPdfJs();
      setProgressPercent(15);
      setProgressText('Reading PDF structure...');

      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      pdfDocRef.current = pdfDoc;

      const numPages = pdfDoc.numPages;
      setTotalPages(numPages);

      const renderedList: RenderedPage[] = [];

      for (let i = 1; i <= numPages; i++) {
        const pct = Math.round(20 + ((i / numPages) * 75));
        setProgressPercent(pct);
        setProgressText(`Rendering Page ${i} of ${numPages} (${dpi} DPI)...`);

        const rendered = await renderSinglePage(pdfDoc, i, dpi, format, quality);
        renderedList.push(rendered);
      }

      setPages(renderedList);
      setProgressPercent(100);
      setProgressText('Conversion complete!');
      showToast(`Successfully converted ${numPages} page${numPages > 1 ? 's' : ''}!`);
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      alert(`Could not process PDF: ${err.message || 'Unknown error'}`);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgressPercent(0);
        setProgressText('');
      }, 500);
    }
  };

  // Re-render when format, DPI, or quality change
  const handleSettingsChange = async (newFormat: ImageFormat, newDpi: DpiMode, newQuality: number) => {
    setFormat(newFormat);
    setDpi(newDpi);
    setQuality(newQuality);

    if (!pdfDocRef.current || pages.length === 0) return;

    setLoading(true);
    setProgressPercent(10);
    setProgressText(`Re-rendering pages in ${newFormat.toUpperCase()} at ${newDpi} DPI...`);

    try {
      const numPages = pdfDocRef.current.numPages;
      const updatedList: RenderedPage[] = [];

      for (let i = 1; i <= numPages; i++) {
        const pct = Math.round(10 + ((i / numPages) * 85));
        setProgressPercent(pct);
        setProgressText(`Re-rendering Page ${i} of ${numPages}...`);

        const isPrevSelected = pages[i - 1] ? pages[i - 1].selected : true;
        const rendered = await renderSinglePage(pdfDocRef.current, i, newDpi, newFormat, newQuality);
        rendered.selected = isPrevSelected;
        updatedList.push(rendered);
      }

      setPages(updatedList);
      showToast(`Updated to ${newFormat.toUpperCase()} (${newDpi} DPI)`);
    } catch (err) {
      console.error('Re-rendering error:', err);
    } finally {
      setLoading(false);
      setProgressPercent(0);
      setProgressText('');
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type === 'application/pdf') {
      processPdfFile(dropped);
    } else {
      alert('Please upload a valid PDF document (.pdf).');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) {
      processPdfFile(picked);
    }
  };

  // Page Selection helpers
  const toggleSelectPage = (pageNumber: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p))
    );
  };

  const selectAllPages = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: true })));
  };

  const deselectAllPages = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: false })));
  };

  const selectOddPages = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: p.pageNumber % 2 !== 0 })));
  };

  const selectEvenPages = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: p.pageNumber % 2 === 0 })));
  };

  // Single Page Download
  const downloadSinglePage = (page: RenderedPage) => {
    const ext = format === 'jpeg' ? 'jpg' : format;
    const cleanBase = (fileName || 'document').replace(/\.pdf$/i, '').replace(/[^a-z0-9]+/gi, '_');
    const name = `${cleanBase}_page_${String(page.pageNumber).padStart(2, '0')}.${ext}`;

    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded Page ${page.pageNumber} as ${ext.toUpperCase()}`);
  };

  // Copy Page Image to Clipboard
  const copyPageToClipboard = async (page: RenderedPage) => {
    try {
      if (!page.blob) {
        const res = await fetch(page.dataUrl);
        const blob = await res.blob();
        page.blob = blob;
      }
      // ClipboardItem prefers PNG
      if (page.blob.type === 'image/png') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': page.blob }),
        ]);
      } else {
        // Convert blob to png for clipboard support
        const img = new Image();
        img.src = page.dataUrl;
        await new Promise((res) => (img.onload = res));
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob(async (pngBlob) => {
          if (pngBlob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': pngBlob }),
            ]);
          }
        }, 'image/png');
      }
      showToast(`Copied Page ${page.pageNumber} to Clipboard!`);
    } catch (err) {
      console.error('Clipboard copy error:', err);
      showToast('Browser blocked clipboard write. Use direct download instead.');
    }
  };

  // Batch Download all selected pages as ZIP
  const downloadSelectedAsZip = async () => {
    const selectedList = pages.filter((p) => p.selected);
    if (selectedList.length === 0) {
      alert('Please select at least one page to download.');
      return;
    }

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const cleanBase = (fileName || 'document').replace(/\.pdf$/i, '').replace(/[^a-z0-9]+/gi, '_');
      const ext = format === 'jpeg' ? 'jpg' : format;
      const folder = zip.folder(`${cleanBase}_images`) || zip;

      for (const page of selectedList) {
        // Strip data:image/...;base64, header
        const base64Data = page.dataUrl.split(',')[1];
        const pageFileName = `${cleanBase}_page_${String(page.pageNumber).padStart(2, '0')}.${ext}`;
        folder.file(pageFileName, base64Data, { base64: true });
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cleanBase}_images_${format}_${dpi}dpi.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`Downloaded ZIP with ${selectedList.length} images!`);
    } catch (err) {
      console.error('ZIP generation error:', err);
      alert('Error building ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };

  // Generate Sample Multi-Page PDF for 1-Click Testing
  const loadSamplePdf = async () => {
    try {
      setLoading(true);
      setProgressText('Generating Sample 3-Page PDF...');
      setProgressPercent(20);

      const pdfDoc = await PDFDocument.create();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Page 1: Cover & Intro
      const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
      page1.drawRectangle({
        x: 0,
        y: 750,
        width: 595.28,
        height: 92,
        color: rgb(0.06, 0.58, 0.45), // Emerald
      });
      page1.drawText('ANSAR PRO PDF TO IMAGE', {
        x: 40,
        y: 790,
        size: 24,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      page1.drawText('Sample Document - Page 1 (High Definition Test)', {
        x: 40,
        y: 765,
        size: 13,
        font: helvetica,
        color: rgb(0.9, 0.98, 0.95),
      });
      page1.drawText('This sample PDF demonstrates client-side high-resolution rendering at 72, 150, or 300 DPI.', {
        x: 40,
        y: 700,
        size: 12,
        font: helvetica,
        color: rgb(0.2, 0.25, 0.3),
      });
      page1.drawRectangle({
        x: 40,
        y: 400,
        width: 515,
        height: 250,
        borderColor: rgb(0.1, 0.6, 0.5),
        borderWidth: 2,
        color: rgb(0.96, 0.99, 0.98),
      });
      page1.drawText('FEATURE HIGHLIGHTS:', {
        x: 60,
        y: 615,
        size: 14,
        font: helveticaBold,
        color: rgb(0.06, 0.45, 0.35),
      });
      const bulletItems = [
        '1. Convert PDF pages to JPG, PNG, and WebP formats.',
        '2. Scalable DPI settings: 72 DPI (Web), 150 DPI (Crisp), 300 DPI (Ultra HD).',
        '3. 1-Click Batch ZIP Download with zero server upload.',
        '4. 1-Click Copy any page image directly to system clipboard.',
        '5. Selective page extraction: Odd, Even, or Custom Checkbox range.'
      ];
      bulletItems.forEach((text, i) => {
        page1.drawText(text, {
          x: 60,
          y: 580 - i * 28,
          size: 11,
          font: helvetica,
          color: rgb(0.2, 0.25, 0.3),
        });
      });

      // Page 2: Invoice / Data Table
      const page2 = pdfDoc.addPage([595.28, 841.89]);
      page2.drawRectangle({
        x: 0,
        y: 750,
        width: 595.28,
        height: 92,
        color: rgb(0.15, 0.35, 0.65), // Blue
      });
      page2.drawText('DATA TABLE & INVOICE PAGE', {
        x: 40,
        y: 790,
        size: 24,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      page2.drawText('Sample Document - Page 2 (Fine Vector Lines & Numbers)', {
        x: 40,
        y: 765,
        size: 13,
        font: helvetica,
        color: rgb(0.9, 0.95, 1),
      });
      // Table Header
      page2.drawRectangle({
        x: 40,
        y: 680,
        width: 515,
        height: 30,
        color: rgb(0.9, 0.93, 0.98),
      });
      page2.drawText('Item Description', { x: 50, y: 690, size: 11, font: helveticaBold, color: rgb(0.1, 0.2, 0.4) });
      page2.drawText('Qty', { x: 300, y: 690, size: 11, font: helveticaBold, color: rgb(0.1, 0.2, 0.4) });
      page2.drawText('Unit Price', { x: 380, y: 690, size: 11, font: helveticaBold, color: rgb(0.1, 0.2, 0.4) });
      page2.drawText('Total Amount', { x: 470, y: 690, size: 11, font: helveticaBold, color: rgb(0.1, 0.2, 0.4) });

      const sampleRows = [
        ['PDF Page Rendering Engine (72-300 DPI)', '1', '$150.00', '$150.00'],
        ['Client-Side High Speed JSZip Packer', '1', '$80.00', '$80.00'],
        ['Lossless PNG & Modern WebP Exporter', '1', '$120.00', '$120.00'],
        ['1-Click Clipboard System Integration', '1', '$50.00', '$50.00'],
      ];
      sampleRows.forEach((row, idx) => {
        const y = 650 - idx * 32;
        page2.drawText(row[0], { x: 50, y, size: 10, font: helvetica, color: rgb(0.2, 0.2, 0.2) });
        page2.drawText(row[1], { x: 305, y, size: 10, font: helvetica, color: rgb(0.2, 0.2, 0.2) });
        page2.drawText(row[2], { x: 385, y, size: 10, font: helvetica, color: rgb(0.2, 0.2, 0.2) });
        page2.drawText(row[3], { x: 475, y, size: 10, font: helveticaBold, color: rgb(0.1, 0.5, 0.3) });
      });

      // Page 3: Visual Graphic / Certificate
      const page3 = pdfDoc.addPage([595.28, 841.89]);
      page3.drawRectangle({
        x: 0,
        y: 750,
        width: 595.28,
        height: 92,
        color: rgb(0.45, 0.2, 0.65), // Violet
      });
      page3.drawText('GRAPHICS & CERTIFICATE', {
        x: 40,
        y: 790,
        size: 24,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      page3.drawText('Sample Document - Page 3 (Color Gradients & Signatures)', {
        x: 40,
        y: 765,
        size: 13,
        font: helvetica,
        color: rgb(0.95, 0.9, 1),
      });
      page3.drawRectangle({
        x: 80,
        y: 450,
        width: 435,
        height: 220,
        borderColor: rgb(0.8, 0.7, 0.2),
        borderWidth: 3,
        color: rgb(0.99, 0.99, 0.95),
      });
      page3.drawText('VERIFIED CERTIFICATION', {
        x: 180,
        y: 620,
        size: 16,
        font: helveticaBold,
        color: rgb(0.6, 0.45, 0.1),
      });
      page3.drawText('Awarded to Ansar Tools for 100% Privacy & Zero Server Uploads', {
        x: 105,
        y: 570,
        size: 11,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      });
      page3.drawText('Verified: 2026 | Certified PDF Rendering', {
        x: 175,
        y: 500,
        size: 10,
        font: helveticaBold,
        color: rgb(0.2, 0.6, 0.3),
      });

      const pdfBytes = await pdfDoc.save();
      const sampleBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const sampleFile = new File([sampleBlob], 'ansar_sample_document.pdf', { type: 'application/pdf' });

      await processPdfFile(sampleFile);
    } catch (err) {
      console.error('Error generating sample:', err);
      alert('Could not generate sample PDF.');
    }
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar />

      {/* TOP HERO HEADER */}
      <header className="bg-slate-950/95 border-b border-slate-800 py-6 px-4 sm:px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <FileImage className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Ansar Pro PDF to Image Converter
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Free &amp; Private
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Convert PDF pages to High-Resolution JPG, PNG, and WebP (72, 150, 300 DPI) with 1-Click ZIP Download
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadSamplePdf}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Try Sample PDF</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload PDF</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
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

        {/* LOADING & PROGRESS OVERLAY */}
        {loading && (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <div>
              <h3 className="text-base font-bold text-white mb-1">{progressText}</h3>
              <p className="text-xs text-slate-400">Rendering pages in memory via WebAssembly PDF.js engine...</p>
            </div>
            <div className="w-full max-w-md bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
        )}

        {/* EMPTY STATE / DRAG & DROP ZONE */}
        {!file && !loading && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/60 hover:bg-slate-950 transition-all rounded-3xl p-12 sm:p-20 flex flex-col items-center justify-center text-center cursor-pointer group shadow-xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
              <Upload className="w-9 h-9" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Drag &amp; Drop your PDF here, or <span className="text-emerald-400 underline decoration-emerald-500/40">Browse</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
              Convert all pages or extract specific pages into high-resolution JPG, PNG, or WebP. 100% private, client-side conversion.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Safe (In-Browser)
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <ImageIcon className="w-4 h-4 text-teal-400" /> JPG / PNG / WebP
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Sparkles className="w-4 h-4 text-amber-400" /> 72 / 150 / 300 DPI
              </span>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 w-full max-w-sm flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  loadSamplePdf();
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 underline underline-offset-4 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Don&apos;t have a file? Click here to try sample PDF
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE DOCUMENT DASHBOARD */}
        {file && !loading && (
          <div className="flex flex-col gap-6">
            
            {/* CONTROL PANEL CARD */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-5">
              
              {/* Top row: File Info & Change File */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                      {fileName}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{formatBytes(fileSizeBytes)}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{totalPages} Page{totalPages > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Change PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPages([]);
                      pdfDocRef.current = null;
                    }}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                </div>
              </div>

              {/* Conversion Settings Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Format Selection */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['jpeg', 'png', 'webp'] as ImageFormat[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => handleSettingsChange(f, dpi, quality)}
                        className={`py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                          format === f
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {f === 'jpeg' ? 'JPG' : f}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {format === 'jpeg' && 'Standard photo format, white background'}
                    {format === 'png' && 'Lossless crisp clarity, best for text/logos'}
                    {format === 'webp' && 'Next-gen web format with high compression'}
                  </span>
                </div>

                {/* 2. Resolution / DPI */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Resolution / DPI
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([72, 150, 300] as DpiMode[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleSettingsChange(format, d, quality)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          dpi === d
                            ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {d} DPI
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {dpi === 72 && '72 DPI: Lightweight web view (Smallest size)'}
                    {dpi === 150 && '150 DPI: High Quality crisp balance (Recommended)'}
                    {dpi === 300 && '300 DPI: Ultra HD Print-Ready (Crystal clear text)'}
                  </span>
                </div>

                {/* 3. Quality Slider (for JPG & WebP) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-400" /> Image Quality
                    </label>
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {format === 'png' ? '100% (Lossless)' : `${Math.round(quality * 100)}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    disabled={format === 'png'}
                    onChange={(e) => handleSettingsChange(format, dpi, parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer disabled:opacity-40"
                  />
                  <span className="text-[10px] text-slate-400">
                    {format === 'png' ? 'PNG is natively lossless' : 'Higher quality preserves small text details'}
                  </span>
                </div>

              </div>

              {/* Action Toolbar: Selection Filters & Batch Download ZIP */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-400 mr-1">Select:</span>
                  <button
                    type="button"
                    onClick={selectAllPages}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    All ({totalPages})
                  </button>
                  <button
                    type="button"
                    onClick={deselectAllPages}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-lg text-xs cursor-pointer"
                  >
                    None
                  </button>
                  <button
                    type="button"
                    onClick={selectOddPages}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs cursor-pointer"
                  >
                    Odd Pages
                  </button>
                  <button
                    type="button"
                    onClick={selectEvenPages}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs cursor-pointer"
                  >
                    Even Pages
                  </button>
                  <span className="ml-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    Selected: {selectedCount} / {totalPages}
                  </span>
                </div>

                {/* Batch ZIP Download Button */}
                <button
                  type="button"
                  onClick={downloadSelectedAsZip}
                  disabled={selectedCount === 0 || isZipping}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                >
                  {isZipping ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <FileArchive className="w-4 h-4 text-white" />
                  )}
                  <span>
                    {isZipping ? 'Packaging ZIP Archive...' : `Download ${selectedCount} Page${selectedCount > 1 ? 's' : ''} (ZIP)`}
                  </span>
                </button>
              </div>

            </div>

            {/* PAGE THUMBNAILS GRID */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" /> Converted Pages ({pages.length})
                </h3>
                <span className="text-xs text-slate-400">
                  Click any thumbnail to zoom &amp; inspect • Download or Copy individually
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pages.map((page) => (
                  <div
                    key={page.pageNumber}
                    className={`group relative bg-slate-950 border rounded-2xl overflow-hidden transition-all flex flex-col ${
                      page.selected
                        ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                        : 'border-slate-800 opacity-60 hover:opacity-90'
                    }`}
                  >
                    {/* Header Bar */}
                    <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={page.selected}
                          onChange={() => toggleSelectPage(page.pageNumber)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 accent-emerald-500 cursor-pointer"
                        />
                        <span className="font-bold text-white">Page {page.pageNumber}</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        {page.width} × {page.height}px
                      </span>
                    </div>

                    {/* Image Preview Box */}
                    <div
                      onClick={() => setPreviewPage(page)}
                      className="relative w-full aspect-[1/1.4] bg-white flex items-center justify-center p-2 cursor-zoom-in overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={page.dataUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="max-w-full max-h-full object-contain transition-transform group-hover:scale-[1.02]"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                        <span className="px-3 py-1.5 bg-slate-900/90 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-lg border border-slate-700">
                          <Eye className="w-3.5 h-3.5 text-emerald-400" /> Click to Inspect
                        </span>
                      </div>
                    </div>

                    {/* Action Bar Footer */}
                    <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyPageToClipboard(page)}
                        className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 border border-slate-800 transition-colors cursor-pointer"
                        title="Copy image directly to system clipboard"
                      >
                        <Copy className="w-3 h-3 text-blue-400" />
                        <span>Copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadSinglePage(page)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
                        title={`Download Page ${page.pageNumber} as ${format.toUpperCase()}`}
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

      {/* FULL-SCREEN ZOOM PREVIEW MODAL */}
      {previewPage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <FileImage className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">
                  Page {previewPage.pageNumber} of {totalPages} Preview
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  ({previewPage.width} × {previewPage.height} px • {format.toUpperCase()} • {dpi} DPI)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyPageToClipboard(previewPage)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-400" /> Copy
                </button>
                <button
                  type="button"
                  onClick={() => downloadSinglePage(previewPage)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPage(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: High-Res Scrollable Image */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-900/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewPage.dataUrl}
                alt={`Page ${previewPage.pageNumber}`}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl bg-white"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400">
              Press Esc or click close to return to pages grid
            </div>

          </div>
        </div>
      )}

      {/* WHY CHOOSE ANSAR TOOLS BENCHMARK CARD */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 mt-6 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Benchmark Advantage
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-3">
            Why Ansar Pro PDF to Image Beats Cloud Converters
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero limits, zero paywalls, zero cloud uploads. Your data stays 100% on your device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">100% Privacy &amp; Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike cloud services (iLovePDF, Smallpdf) that upload your confidential PDFs, contracts, and IDs to remote servers, Ansar Tools renders pages completely inside your browser using WebAssembly.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">True 300 DPI Ultra HD Print</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Other tools restrict free exports to low-res 72 DPI. We provide true 300 DPI high-resolution rasterization, preserving crisp legal fonts, stamps, and fine vector diagrams for printing.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileArchive className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">1-Click Batch ZIP Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select all pages or just odd/even pages and download them in a single cleanly-named ZIP file instantly, or copy any individual page straight to your clipboard to paste into Word or WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
