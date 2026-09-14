'use client';

import { useState, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  FileText, Upload, Download, Trash2, ArrowUp, ArrowDown,
  RotateCw, Plus, CheckCircle2, ShieldCheck, Sparkles, RefreshCw,
  Layers, ChevronDown, ChevronUp, Eye, FileSearch, ArrowRight,
  Loader2, Files, SortAsc, SortDesc, X
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export interface PageItem {
  originalIndex: number;
  pageNumber: number;
  rotation: number;
  deleted: boolean;
  thumbnail?: string;
}

export interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  pages: PageItem[];
  coverThumbnail?: string;
  isExpanded: boolean;
}

export default function MergePdfPage() {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [outputFileName, setOutputFileName] = useState<string>('ansar_merged_document.pdf');
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [loadingThumbnails, setLoadingThumbnails] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamically load PDF.js from CDN for rendering thumbnails
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

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Generate thumbnail dataUrl for a specific page using PDF.js
  const renderThumbnail = async (pdfDoc: any, pageNum: number): Promise<string> => {
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.35 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch {
      return '';
    }
  };

  // Process uploaded files
  const processUploadedFiles = async (newFileList: File[]) => {
    const validPdfs = newFileList.filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (validPdfs.length === 0) {
      alert('Please upload valid PDF files.');
      return;
    }

    setLoadingThumbnails(true);

    try {
      const pdfjs = await getPdfJs();
      const newItems: PdfFileItem[] = [];

      for (const file of validPdfs) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdfDoc = await loadingTask.promise;
        const pageCount = pdfDoc.numPages;

        const coverThumbnail = await renderThumbnail(pdfDoc, 1);

        const pages: PageItem[] = [];
        for (let p = 1; p <= pageCount; p++) {
          pages.push({
            originalIndex: p - 1,
            pageNumber: p,
            rotation: 0,
            deleted: false,
          });
        }

        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
          pageCount,
          pages,
          coverThumbnail,
          isExpanded: false,
        });
      }

      setFiles((prev) => [...prev, ...newItems]);
      showToast(`Added ${newItems.length} PDF file${newItems.length > 1 ? 's' : ''}!`);
    } catch (err: any) {
      console.error('Error reading PDF files:', err);
      alert(`Could not process PDF: ${err.message || 'Unknown error'}`);
    } finally {
      setLoadingThumbnails(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // File Reordering & Removal
  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    const reordered = [...files];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setFiles(reordered);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAllFiles = () => {
    if (files.length === 0) return;
    if (confirm('Are you sure you want to remove all uploaded PDF files?')) {
      setFiles([]);
    }
  };

  const sortFilesAZ = () => {
    const sorted = [...files].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    setFiles(sorted);
    showToast('Sorted files A to Z');
  };

  const sortFilesZA = () => {
    const sorted = [...files].sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));
    setFiles(sorted);
    showToast('Sorted files Z to A');
  };

  // Toggle file expansion to view pages
  const toggleExpand = async (fileId: string) => {
    const target = files.find((f) => f.id === fileId);
    if (!target) return;

    // Load thumbnails for individual pages if not yet loaded
    if (!target.isExpanded && target.pages.some((p) => !p.thumbnail)) {
      setLoadingThumbnails(true);
      try {
        const pdfjs = await getPdfJs();
        const arrayBuffer = await target.file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdfDoc = await loadingTask.promise;

        const updatedPages = await Promise.all(
          target.pages.map(async (p) => {
            if (!p.thumbnail) {
              const thumb = await renderThumbnail(pdfDoc, p.pageNumber);
              return { ...p, thumbnail: thumb };
            }
            return p;
          })
        );

        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, pages: updatedPages, isExpanded: true } : f))
        );
      } catch (err) {
        console.error('Page thumbnail loading error:', err);
      } finally {
        setLoadingThumbnails(false);
      }
    } else {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, isExpanded: !f.isExpanded } : f))
      );
    }
  };

  // Rotate all pages of a file
  const rotateAllPages = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f;
        return {
          ...f,
          pages: f.pages.map((p) => ({ ...p, rotation: (p.rotation + 90) % 360 })),
        };
      })
    );
    showToast('Rotated all pages +90°');
  };

  // Rotate a single page
  const rotateSinglePage = (fileId: string, pageNumber: number) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f;
        return {
          ...f,
          pages: f.pages.map((p) =>
            p.pageNumber === pageNumber ? { ...p, rotation: (p.rotation + 90) % 360 } : p
          ),
        };
      })
    );
  };

  // Toggle deletion of an individual page
  const toggleDeletePage = (fileId: string, pageNumber: number) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f;
        return {
          ...f,
          pages: f.pages.map((p) =>
            p.pageNumber === pageNumber ? { ...p, deleted: !p.deleted } : p
          ),
        };
      })
    );
  };

  // 1-Click "Try Sample PDFs" Demo Generator
  const loadSamplePdfs = async () => {
    try {
      setLoadingThumbnails(true);

      // Sample 1: Annual Report Part 1
      const doc1 = await PDFDocument.create();
      const helveticaBold = await doc1.embedFont(StandardFonts.HelveticaBold);
      const helvetica = await doc1.embedFont(StandardFonts.Helvetica);

      const p1 = doc1.addPage([595.28, 841.89]);
      p1.drawRectangle({ x: 0, y: 750, width: 595.28, height: 92, color: rgb(0.06, 0.58, 0.45) });
      p1.drawText('ANNUAL REPORT — PART 1', { x: 40, y: 790, size: 22, font: helveticaBold, color: rgb(1, 1, 1) });
      p1.drawText('Sample Document 1 — Business Strategy Overview', { x: 40, y: 765, size: 12, font: helvetica, color: rgb(0.9, 1, 0.95) });
      p1.drawText('This is page 1 of sample file #1 to test PDF merging.', { x: 40, y: 700, size: 12, font: helvetica, color: rgb(0.2, 0.2, 0.2) });

      const p2 = doc1.addPage([595.28, 841.89]);
      p2.drawRectangle({ x: 0, y: 750, width: 595.28, height: 92, color: rgb(0.06, 0.58, 0.45) });
      p2.drawText('ANNUAL REPORT — PART 1 (CONT.)', { x: 40, y: 790, size: 22, font: helveticaBold, color: rgb(1, 1, 1) });
      p2.drawText('Sample Document 1 — Operational Metrics', { x: 40, y: 765, size: 12, font: helvetica, color: rgb(0.9, 1, 0.95) });
      p2.drawText('This is page 2 of sample file #1.', { x: 40, y: 700, size: 12, font: helvetica, color: rgb(0.2, 0.2, 0.2) });

      const doc1Bytes = await doc1.save();
      const file1 = new File([doc1Bytes as any], '01_Annual_Report_Strategy.pdf', { type: 'application/pdf' });

      // Sample 2: Financial Appendix
      const doc2 = await PDFDocument.create();
      const p3 = doc2.addPage([595.28, 841.89]);
      p3.drawRectangle({ x: 0, y: 750, width: 595.28, height: 92, color: rgb(0.15, 0.35, 0.65) });
      p3.drawText('FINANCIAL APPENDIX — PART 2', { x: 40, y: 790, size: 22, font: helveticaBold, color: rgb(1, 1, 1) });
      p3.drawText('Sample Document 2 — Audited Balance Sheet', { x: 40, y: 765, size: 12, font: helvetica, color: rgb(0.9, 0.95, 1) });
      p3.drawText('This is page 1 of sample file #2 to combine with Part 1.', { x: 40, y: 700, size: 12, font: helvetica, color: rgb(0.2, 0.2, 0.2) });

      const doc2Bytes = await doc2.save();
      const file2 = new File([doc2Bytes as any], '02_Financial_Appendix.pdf', { type: 'application/pdf' });

      await processUploadedFiles([file1, file2]);
    } catch (err) {
      console.error('Error generating sample PDFs:', err);
      alert('Could not generate sample files.');
    } finally {
      setLoadingThumbnails(false);
    }
  };

  // Perform Merge using pdf-lib
  const handleMergeAndDownload = async () => {
    if (files.length === 0) {
      alert('Please upload at least one PDF file to merge.');
      return;
    }

    // Check if at least one page is active
    const totalActivePages = files.reduce(
      (sum, f) => sum + f.pages.filter((p) => !p.deleted).length,
      0
    );

    if (totalActivePages === 0) {
      alert('All pages in all files are marked as deleted. Please restore at least one page to merge.');
      return;
    }

    setIsMerging(true);
    try {
      const mergedDoc = await PDFDocument.create();

      for (const item of files) {
        const activePages = item.pages.filter((p) => !p.deleted);
        if (activePages.length === 0) continue;

        const arrayBuffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(arrayBuffer);

        const indicesToCopy = activePages.map((p) => p.originalIndex);
        const copiedPages = await mergedDoc.copyPages(srcDoc, indicesToCopy);

        copiedPages.forEach((copiedPage, idx) => {
          const pageMeta = activePages[idx];
          if (pageMeta.rotation !== 0) {
            const currentRot = copiedPage.getRotation().angle;
            copiedPage.setRotation(degrees((currentRot + pageMeta.rotation) % 360));
          }
          mergedDoc.addPage(copiedPage);
        });
      }

      const mergedPdfBytes = await mergedDoc.save();
      const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanFileName = outputFileName.trim().toLowerCase().endsWith('.pdf')
        ? outputFileName.trim()
        : `${outputFileName.trim() || 'ansar_merged_document'}.pdf`;
      a.download = cleanFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`Merged ${totalActivePages} pages successfully!`);
    } catch (err: any) {
      console.error('Merge error:', err);
      alert(`Could not merge PDFs: ${err.message || 'Unknown error'}`);
    } finally {
      setIsMerging(false);
    }
  };

  // Summary statistics
  const totalActivePages = files.reduce(
    (sum, f) => sum + f.pages.filter((p) => !p.deleted).length,
    0
  );
  const totalSizeBytes = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar />

      {/* TOP HERO HEADER */}
      <header className="bg-slate-950/95 border-b border-slate-800 py-6 px-4 sm:px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Ansar Pro Merge PDF Studio
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Free &amp; Private
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Combine multiple PDF documents in any order, rotate pages, delete unwanted pages, and download as one clean PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadSamplePdfs}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Try Sample PDFs</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Add PDF Files</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
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
        {loadingThumbnails && (
          <div className="bg-slate-950 border border-blue-500/30 rounded-3xl p-6 shadow-2xl flex items-center justify-center gap-3 text-center">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            <span className="text-sm font-bold text-white">
              Rendering PDF thumbnails in memory...
            </span>
          </div>
        )}

        {/* EMPTY STATE / DRAG & DROP ZONE */}
        {files.length === 0 && !loadingThumbnails && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 bg-slate-950/60 hover:bg-slate-950 transition-all rounded-3xl p-12 sm:p-20 flex flex-col items-center justify-center text-center cursor-pointer group shadow-xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
              <Files className="w-9 h-9" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Drag &amp; Drop multiple PDFs here, or <span className="text-blue-400 underline decoration-blue-500/40">Browse</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
              Select two or more PDF documents to combine into a single seamless PDF file. Completely secure &amp; 100% in-browser.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% In-Browser Privacy
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Layers className="w-4 h-4 text-teal-400" /> Page-Level Control &amp; Rotation
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Download className="w-4 h-4 text-blue-400" /> Unlimited Merges &amp; No File Caps
              </span>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 w-full max-w-sm flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  loadSamplePdfs();
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 underline underline-offset-4 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Don&apos;t have files ready? Click here to test with sample PDFs
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE MERGE DASHBOARD */}
        {files.length > 0 && (
          <div className="flex flex-col gap-6">

            {/* TOP MERGE CONTROLS BAR */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
              
              {/* Stats & Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      PDF Merge Queue
                      <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {files.length} Document{files.length > 1 ? 's' : ''}
                      </span>
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-emerald-400 font-bold">{totalActivePages} Total Pages to Merge</span>
                      <span>•</span>
                      <span>Combined Size: {formatBytes(totalSizeBytes)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={sortFilesAZ}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Sort documents in alphabetical order A-Z"
                  >
                    <SortAsc className="w-3.5 h-3.5 text-blue-400" /> Sort A-Z
                  </button>
                  <button
                    type="button"
                    onClick={sortFilesZA}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Sort documents Z-A"
                  >
                    <SortDesc className="w-3.5 h-3.5 text-blue-400" /> Sort Z-A
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add More Files
                  </button>
                  <button
                    type="button"
                    onClick={clearAllFiles}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                </div>
              </div>

              {/* Output Name & Merge Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                <div className="w-full sm:w-auto flex-1 max-w-md flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 shrink-0">Output File:</span>
                  <input
                    type="text"
                    value={outputFileName}
                    onChange={(e) => setOutputFileName(e.target.value)}
                    placeholder="ansar_merged_document.pdf"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleMergeAndDownload}
                  disabled={isMerging || files.length === 0}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                >
                  {isMerging ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Download className="w-4 h-4 text-white" />
                  )}
                  <span>{isMerging ? 'Merging PDF Documents...' : `Merge & Download (${totalActivePages} Pages)`}</span>
                </button>
              </div>

            </div>

            {/* FILES LIST (SORTABLE / REORDERABLE) */}
            <div className="flex flex-col gap-4">
              {files.map((item, index) => {
                const activeInFile = item.pages.filter((p) => !p.deleted).length;
                return (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all"
                  >
                    {/* File Header Bar */}
                    <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
                      
                      {/* Left: Index badge, cover thumb, title & size */}
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold flex items-center justify-center text-slate-300">
                          {index + 1}
                        </span>

                        {item.coverThumbnail && (
                          <div className="w-10 h-14 bg-white rounded overflow-hidden shadow-md flex items-center justify-center shrink-0 border border-slate-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.coverThumbnail}
                              alt="Cover"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}

                        <div>
                          <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span>{formatBytes(item.size)}</span>
                            <span>•</span>
                            <span className={activeInFile > 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
                              {activeInFile} of {item.pageCount} page{item.pageCount > 1 ? 's' : ''} included
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Reorder and Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 rounded-lg border border-slate-800 cursor-pointer"
                          title="Move Up in merge order"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === files.length - 1}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 rounded-lg border border-slate-800 cursor-pointer"
                          title="Move Down in merge order"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        {/* Rotate All Pages +90 */}
                        <button
                          type="button"
                          onClick={() => rotateAllPages(item.id)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          title="Rotate all pages of this file 90 degrees clockwise"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                          <span className="hidden sm:inline">Rotate All</span>
                        </button>

                        {/* Expand / View Pages */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          title="Inspect and edit individual pages"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-400" />
                          <span>{item.isExpanded ? 'Collapse' : 'Inspect Pages'}</span>
                          {item.isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Remove File */}
                        <button
                          type="button"
                          onClick={() => removeFile(item.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg border border-rose-500/20 cursor-pointer ml-1"
                          title="Remove file from merge list"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                    {/* EXPANDED INDIVIDUAL PAGES GRID */}
                    {item.isExpanded && (
                      <div className="p-4 border-t border-slate-800/80 bg-slate-950">
                        <div className="flex items-center justify-between mb-3 text-xs">
                          <span className="font-bold text-slate-300 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-teal-400" /> Individual Pages for &quot;{item.name}&quot;
                          </span>
                          <span className="text-slate-400">
                            Click Rotate or Exclude on any individual page
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {item.pages.map((page) => (
                            <div
                              key={page.pageNumber}
                              className={`relative bg-slate-900 border rounded-xl p-2 flex flex-col items-center gap-1.5 transition-all ${
                                page.deleted
                                  ? 'border-rose-500/40 opacity-40 grayscale'
                                  : 'border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {/* Header: Page # & Rotation badge */}
                              <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400">
                                <span className="font-bold text-slate-200">Page {page.pageNumber}</span>
                                {page.rotation > 0 && (
                                  <span className="text-[10px] text-blue-400 font-bold">
                                    {page.rotation}°
                                  </span>
                                )}
                              </div>

                              {/* Thumbnail with rotation */}
                              <div className="relative w-full aspect-[1/1.3] bg-white rounded overflow-hidden flex items-center justify-center p-1 border border-slate-800">
                                {page.thumbnail ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={page.thumbnail}
                                    alt={`Page ${page.pageNumber}`}
                                    className="max-w-full max-h-full object-contain transition-transform"
                                    style={{ transform: `rotate(${page.rotation}deg)` }}
                                  />
                                ) : (
                                  <div className="text-slate-400 text-xs flex flex-col items-center">
                                    <FileText className="w-6 h-6 text-slate-500 mb-1" />
                                    <span>P. {page.pageNumber}</span>
                                  </div>
                                )}

                                {page.deleted && (
                                  <div className="absolute inset-0 bg-rose-950/70 flex items-center justify-center text-rose-300 font-bold text-xs uppercase tracking-wider">
                                    Excluded
                                  </div>
                                )}
                              </div>

                              {/* Controls: Rotate & Exclude/Include */}
                              <div className="w-full flex items-center justify-between gap-1 pt-1">
                                <button
                                  type="button"
                                  onClick={() => rotateSinglePage(item.id, page.pageNumber)}
                                  disabled={page.deleted}
                                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                                  title="Rotate this page +90°"
                                >
                                  <RotateCw className="w-2.5 h-2.5 text-blue-400" />
                                  <span>+90°</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleDeletePage(item.id, page.pageNumber)}
                                  className={`flex-1 py-1 rounded text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer ${
                                    page.deleted
                                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20'
                                  }`}
                                  title={page.deleted ? 'Include this page back in merge' : 'Exclude this page from merged output'}
                                >
                                  {page.deleted ? (
                                    <>
                                      <Plus className="w-2.5 h-2.5" />
                                      <span>Restore</span>
                                    </>
                                  ) : (
                                    <>
                                      <X className="w-2.5 h-2.5" />
                                      <span>Exclude</span>
                                    </>
                                  )}
                                </button>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        )}

      </main>

      {/* BENCHMARK & ADVANTAGE FEATURE CARD */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 mt-6 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            Benchmark Superiority
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-3">
            Why Ansar Pro Merge PDF Beats Commercial Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enjoy unlimited merges with deep page-level inspection and zero cloud privacy exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">100% Client-Side Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike cloud services that store sensitive documents on external servers, Ansar Tools combines your PDFs completely in your browser memory via WebAssembly `pdf-lib`. Your documents never leave your computer.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Deep Page-Level Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Expand any document to view all interior pages. Easily rotate landscape tables or exclude unwanted blank or duplicate pages before downloading the final consolidated file.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero Limits &amp; No Paywalls</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Merge as many documents and pages as you need without hitting daily upload quotas, file size limits, or watermarked outputs.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
