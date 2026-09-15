'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import Script from 'next/script';
import {
  Type,
  PenTool,
  Eraser,
  Highlighter,
  Image as ImageIcon,
  Check,
  X as CrossIcon,
  RotateCw,
  Trash2,
  Plus,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Undo2,
  Sparkles,
  Move,
  Copy,
  Palette,
  Pipette,
  MousePointer,
  Italic,
  Bold,
  Square,
  Circle,
  ArrowUpRight,
  Minus,
  Paintbrush,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FilePlus
} from 'lucide-react';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

export type ToolMode = 
  | 'select' 
  | 'text' 
  | 'eraser_brush' 
  | 'whiteout' 
  | 'highlight' 
  | 'draw' 
  | 'shape_rect' 
  | 'shape_circle' 
  | 'shape_arrow' 
  | 'shape_line' 
  | 'signature' 
  | 'image' 
  | 'check' 
  | 'cross';

export interface AnnotationItem {
  id: string;
  type: 'text' | 'whiteout' | 'highlight' | 'signature' | 'image' | 'symbol' | 'shape_rect' | 'shape_circle' | 'shape_arrow' | 'shape_line';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width?: number; // percentage (0-100)
  height?: number; // percentage (0-100)
  text?: string;
  fontSize?: number;
  color?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  shapeStyle?: 'outline' | 'fill';
  fontFamily?: string;
  isBold?: boolean;
  isItalic?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  dataUrl?: string;
  symbol?: string;
}

interface PageData {
  pageIndex: number;
  originalPageIndex: number;
  sourceDocIndex: number;
  width: number;
  height: number;
  rotation: number;
  canvasDataUrl: string;
  annotations: AnnotationItem[];
}

interface LoadedDoc {
  name: string;
  arrayBuffer: ArrayBuffer;
}

// 12 Premium Free Google Fonts for Document Editing & Signatures
export const GOOGLE_FONTS = [
  { name: 'Roboto', label: 'Roboto (Standard Sans)' },
  { name: 'Poppins', label: 'Poppins (Modern Clean)' },
  { name: 'Open Sans', label: 'Open Sans (Professional)' },
  { name: 'Montserrat', label: 'Montserrat (Geometric)' },
  { name: 'Lato', label: 'Lato (Humanist Sans)' },
  { name: 'Playfair Display', label: 'Playfair Display (Serif Classic)' },
  { name: 'Caveat', label: 'Caveat (Casual Handwriting)' },
  { name: 'Dancing Script', label: 'Dancing Script (Calligraphy)' },
  { name: 'Oswald', label: 'Oswald (Bold Headline)' },
  { name: 'Raleway', label: 'Raleway (Refined Sans)' },
  { name: 'Ubuntu', label: 'Ubuntu (Tech Sans)' },
  { name: 'Courier Prime', label: 'Courier Prime (Typewriter Monospace)' },
];

function createAnnotationId(prefix: string): string {
  return `anno-${prefix}-${Date.now()}`;
}

interface PDFPageProxy {
  getViewport: (params: { scale: number; rotation?: number }) => { width: number; height: number };
  render: (params: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => { promise: Promise<void> };
}

interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
}

interface PDFJSStatic {
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument: (src: { data: Uint8Array } | string) => { promise: Promise<PDFDocumentProxy> };
}

interface WindowWithPdfJs extends Window {
  pdfjsLib?: PDFJSStatic;
}

export default function ProfessionalPdfEditorPage() {
  // Document State
  const [docs, setDocs] = useState<LoadedDoc[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filename, setFilename] = useState('AnsarTools_Edited.pdf');

  // Active Tool & Properties
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [fontSize, setFontSize] = useState<number>(18);
  const [textColor, setTextColor] = useState<string>('#000000');
  const [fontFamily, setFontFamily] = useState<string>('Roboto');
  const [isBold, setIsBold] = useState<boolean>(true);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  
  // Highlighting & Erasing State
  const [highlightColor, setHighlightColor] = useState<string>('#fef08a');
  const [customEraseColor, setCustomEraseColor] = useState<string>('auto');
  const [eraserBrushSize, setEraserBrushSize] = useState<number>(24);
  const [selectedAnnoId, setSelectedAnnoId] = useState<string | null>(null);

  // Shape Configuration
  const [shapeStyle, setShapeStyle] = useState<'outline' | 'fill'>('outline');
  const [shapeColor, setShapeColor] = useState<string>('#2563eb');
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState<number>(2);

  // Format Painter (Copy/Paste text style)
  const [formatPainterActive, setFormatPainterActive] = useState(false);
  const [copiedStyle, setCopiedStyle] = useState<{
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    isBold?: boolean;
    isItalic?: boolean;
    textAlign?: 'left' | 'center' | 'right';
  } | null>(null);

  // Freehand Drawing & Eraser Overlay Canvas Refs
  const [penColor, setPenColor] = useState<string>('#2563eb');
  const [penWidth, setPenWidth] = useState<number>(3);
  const pageDrawingCanvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});
  const pageOriginalCanvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});

  // Signature Modal State
  const [showSigModal, setShowSigModal] = useState(false);
  const [sigMode, setSigMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typeSigText, setTypeSigText] = useState('');
  const [sigColor, setSigColor] = useState('#000000');
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);
  
  // Upload Signature State
  const [uploadedSigDataUrl, setUploadedSigDataUrl] = useState<string | null>(null);
  const [removeBg, setRemoveBg] = useState<boolean>(true);
  const sigFileInputRef = useRef<HTMLInputElement>(null);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // History for Undo
  const [history, setHistory] = useState<PageData[][]>([]);

  // File Inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mergePdfInputRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  // Dragging Box Draft (for Whiteout, Highlight, Shapes)
  const [boxDraft, setBoxDraft] = useState<{
    pageIndex: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const saveHistory = useCallback(() => {
    setHistory(prev => [...prev.slice(-15), JSON.parse(JSON.stringify(pages))]);
  }, [pages]);

  const handleUndo = () => {
    if (history.length === 0) {
      showToast('Nothing to undo.');
      return;
    }
    const prevPages = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setPages(prevPages);
    showToast('Undo successful');
  };

  // Resilient PDF.js Loader with Synchronous In-Memory Blob Worker
  const getPdfJs = useCallback(async (): Promise<PDFJSStatic | null> => {
    if (typeof window === 'undefined') return null;

    const setupWorker = (pdfjs: PDFJSStatic) => {
      if (pdfjs && !pdfjs.GlobalWorkerOptions?.workerSrc) {
        try {
          const workerBlob = new Blob([
            'importScripts("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js");'
          ], { type: 'application/javascript' });
          pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);
        } catch {
          pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        }
      }
      return pdfjs;
    };

    const win = window as WindowWithPdfJs;
    if (win.pdfjsLib) {
      return setupWorker(win.pdfjsLib);
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById('pdfjs-cdn-script');
      if (existingScript) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          const currentWin = window as WindowWithPdfJs;
          if (currentWin.pdfjsLib) {
            clearInterval(interval);
            resolve(setupWorker((window as WindowWithPdfJs).pdfjsLib!));
          } else if (attempts > 120) {
            clearInterval(interval);
            reject(new Error('PDF.js loading timed out. Please check your internet connection.'));
          }
        }, 50);
        return;
      }

      const script = document.createElement('script');
      script.id = 'pdfjs-cdn-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
      script.onload = () => {
        const pdfjs = (window as WindowWithPdfJs).pdfjsLib;
        if (pdfjs) {
          resolve(setupWorker(pdfjs));
        } else {
          reject(new Error('PDF.js failed to initialize.'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js engine from CDN.'));
      document.head.appendChild(script);
    });
  }, []);

  // Load PDF from ArrayBuffer or Uint8Array
  const loadPdfFromBuffer = async (buffer: ArrayBuffer | Uint8Array, name: string, isMerge: boolean = false) => {
    setIsLoading(true);
    setLoadingStatus('Rendering PDF pages in high resolution...');
    try {
      const pdfjs = await getPdfJs();
      if (!pdfjs) throw new Error('PDF.js unavailable');

      const uint8Data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
      const safeBuffer = uint8Data.buffer.slice(uint8Data.byteOffset, uint8Data.byteOffset + uint8Data.byteLength) as ArrayBuffer;

      const loadingTask = pdfjs.getDocument({ data: uint8Data });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      const newDocIndex = isMerge ? docs.length : 0;
      const newDoc: LoadedDoc = { name, arrayBuffer: safeBuffer };

      const loadedPages: PageData[] = [];

      for (let i = 1; i <= numPages; i++) {
        setLoadingStatus(`Rendering page ${i} of ${numPages}...`);
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/png');

          const offscreenCanvas = document.createElement('canvas');
          offscreenCanvas.width = canvas.width;
          offscreenCanvas.height = canvas.height;
          const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
          offCtx?.drawImage(canvas, 0, 0);

          const pageNum = isMerge ? pages.length + i - 1 : i - 1;
          pageOriginalCanvasRefs.current[pageNum] = offscreenCanvas;

          loadedPages.push({
            pageIndex: pageNum,
            originalPageIndex: i - 1,
            sourceDocIndex: newDocIndex,
            width: viewport.width,
            height: viewport.height,
            rotation: 0,
            canvasDataUrl: dataUrl,
            annotations: []
          });
        }
      }

      if (isMerge) {
        setDocs(prev => [...prev, newDoc]);
        setPages(prev => [...prev, ...loadedPages]);
        showToast(`Merged ${numPages} pages from ${name} successfully!`);
      } else {
        setDocs([newDoc]);
        setPages(loadedPages);
        setActivePageIndex(0);
        setFilename(name.replace('.pdf', '') + '_Edited.pdf');
        setHistory([]);
      }
    } catch (err: unknown) {
      console.error('PDF Load Error:', err);
      const message = err instanceof Error ? err.message : 'Please ensure the file is valid.';
      alert('Error reading PDF: ' + message);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        await loadPdfFromBuffer(e.target.result, file.name, false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Merge Another PDF File Handler
  const handleMergePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please choose a valid PDF to merge.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      if (ev.target?.result instanceof ArrayBuffer) {
        await loadPdfFromBuffer(ev.target.result, file.name, true);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  // Smart Content-Aware Paper Background Color Sampler (Zero borders, natural document tone)
  const samplePaperBackground = (pIndex: number, xPct: number, yPct: number, wPct: number, hPct: number): string => {
    if (customEraseColor !== 'auto') return customEraseColor;

    const canvas = pageOriginalCanvasRefs.current[pIndex];
    if (!canvas) return '#ffffff';
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return '#ffffff';

    const pixelX = Math.floor((xPct / 100) * canvas.width);
    const pixelY = Math.floor((yPct / 100) * canvas.height);
    const pixelW = Math.max(4, Math.floor((wPct / 100) * canvas.width));
    const pixelH = Math.max(4, Math.floor((hPct / 100) * canvas.height));

    const samplePoints = [
      { x: pixelX - 4, y: pixelY + pixelH / 2 },
      { x: pixelX + pixelW + 4, y: pixelY + pixelH / 2 },
      { x: pixelX + pixelW / 2, y: pixelY - 4 },
      { x: pixelX + pixelW / 2, y: pixelY + pixelH + 4 },
      { x: pixelX - 3, y: pixelY - 3 },
      { x: pixelX + pixelW + 3, y: pixelY - 3 },
      { x: pixelX - 3, y: pixelY + pixelH + 3 },
      { x: pixelX + pixelW + 3, y: pixelY + pixelH + 3 }
    ];

    const validColors: { r: number; g: number; b: number }[] = [];

    for (const pt of samplePoints) {
      const cx = Math.max(0, Math.min(canvas.width - 1, pt.x));
      const cy = Math.max(0, Math.min(canvas.height - 1, pt.y));
      try {
        const p = ctx.getImageData(cx, cy, 1, 1).data;
        const brightness = (p[0] + p[1] + p[2]) / 3;
        if (brightness > 130 && p[3] > 200) {
          validColors.push({ r: p[0], g: p[1], b: p[2] });
        }
      } catch {
        // ignore out of bounds
      }
    }

    if (validColors.length === 0) return '#ffffff';

    const avgR = Math.round(validColors.reduce((sum, c) => sum + c.r, 0) / validColors.length);
    const avgG = Math.round(validColors.reduce((sum, c) => sum + c.g, 0) / validColors.length);
    const avgB = Math.round(validColors.reduce((sum, c) => sum + c.b, 0) / validColors.length);

    return `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
  };

  // Generate Interactive Sample Demo PDF
  const loadDemoPdf = async () => {
    setIsLoading(true);
    setLoadingStatus('Creating interactive demo contract...');
    try {
      const doc = await PDFDocument.create();
      const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await doc.embedFont(StandardFonts.Helvetica);

      // Page 1: Sample Document
      const page1 = doc.addPage([595.28, 841.89]);
      page1.drawText('ANSAR TOOLS - PROFESSIONAL CERTIFIED PDF EDITOR', {
        x: 50, y: 780, size: 17, font: boldFont, color: rgb(0.12, 0.23, 0.54)
      });
      page1.drawText('Online PDF Editor, Redactor, Shapes & Digital Signer', {
        x: 50, y: 755, size: 12, font: regularFont, color: rgb(0.4, 0.4, 0.4)
      });
      page1.drawLine({
        start: { x: 50, y: 740 }, end: { x: 545, y: 740 }, thickness: 1.5, color: rgb(0.8, 0.85, 0.95)
      });

      page1.drawText('Client Name:  Muhammad Bilal', { x: 50, y: 690, size: 13, font: boldFont });
      page1.drawText('Invoice Number:  #INV-98241', { x: 50, y: 665, size: 12, font: regularFont });
      page1.drawText('Amount Payable:  $1,500.00 USD', { x: 50, y: 640, size: 13, font: boldFont, color: rgb(0.1, 0.6, 0.2) });
      page1.drawText('Issue Date:  September 13, 2026', { x: 50, y: 615, size: 12, font: regularFont });

      page1.drawText('Try These Professional Features:', { x: 50, y: 555, size: 13, font: boldFont, color: rgb(0.12, 0.23, 0.54) });
      page1.drawText('1. [Brush Eraser] Brush freely over text or dates to erase seamlessly with ZERO borders.', { x: 60, y: 530, size: 11, font: regularFont });
      page1.drawText('2. [Box Erase] Drag a rectangle over "Muhammad Bilal" to whiteout with paper auto-match.', { x: 60, y: 505, size: 11, font: regularFont });
      page1.drawText('3. [Google Fonts] Try "Poppins", "Dancing Script", or "Montserrat" with Bold & Italic.', { x: 60, y: 480, size: 11, font: regularFont });
      page1.drawText('4. [Shapes] Draw Rectangles, Circles, Arrows, and Lines (Outline or Filled).', { x: 60, y: 455, size: 11, font: regularFont });
      page1.drawText('5. [Signatures] Draw, type cursive, or UPLOAD signature photo with background removal.', { x: 60, y: 430, size: 11, font: regularFont });
      page1.drawText('6. [Merge PDF] Click Merge PDF in toolbar to combine documents.', { x: 60, y: 405, size: 11, font: regularFont });

      page1.drawRectangle({ x: 50, y: 350, width: 16, height: 16, borderWidth: 1.5, borderColor: rgb(0.3, 0.4, 0.6) });
      page1.drawText('I confirm that all edits are verified and approved.', { x: 75, y: 353, size: 11, font: regularFont });

      page1.drawRectangle({
        x: 50, y: 220, width: 260, height: 100,
        borderColor: rgb(0.8, 0.85, 0.92), borderWidth: 1, color: rgb(0.98, 0.99, 1)
      });
      page1.drawText('Authorized Signature Line:', { x: 65, y: 295, size: 10, font: boldFont, color: rgb(0.4, 0.45, 0.55) });
      page1.drawLine({
        start: { x: 65, y: 250 }, end: { x: 280, y: 250 }, thickness: 1, color: rgb(0.6, 0.65, 0.75)
      });
      page1.drawText('Sign here (Drag signature here)', { x: 65, y: 235, size: 9, font: regularFont, color: rgb(0.5, 0.5, 0.5) });

      // Page 2
      const page2 = doc.addPage([595.28, 841.89]);
      page2.drawText('PAGE 2 - ZERO SERVER STORAGE GUARANTEE', {
        x: 50, y: 780, size: 16, font: boldFont, color: rgb(0.12, 0.23, 0.54)
      });
      page2.drawText('Your document remains 100% private in your browser RAM.', { x: 50, y: 740, size: 12, font: regularFont });
      page2.drawText('All whiteouts, shapes, and annotations compile directly with PDF-Lib.', { x: 50, y: 715, size: 12, font: regularFont });

      const pdfBytes = await doc.save();
      await loadPdfFromBuffer(pdfBytes, 'AnsarTools_Demo_Contract.pdf', false);
      showToast('Loaded interactive Demo PDF! Try all features freely.');
    } catch (e: unknown) {
      console.error('Demo creation error:', e);
      const message = e instanceof Error ? e.message : 'Unknown error';
      alert('Error creating demo document: ' + message);
    } finally {
      setIsLoading(false);
    }
  };

  // Click on Page to add text, symbols, or shapes
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pIndex: number) => {
    if (
      activeTool !== 'text' && 
      activeTool !== 'check' && 
      activeTool !== 'cross' &&
      !activeTool.startsWith('shape_')
    ) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    saveHistory();

    if (activeTool === 'text') {
      const newAnno: AnnotationItem = {
        id: createAnnotationId('text'),
        type: 'text',
        x: Math.max(1, Math.min(85, clickX)),
        y: Math.max(1, Math.min(95, clickY)),
        text: 'Type text here...',
        fontSize: fontSize,
        color: textColor,
        fontFamily: fontFamily,
        isBold: isBold,
        isItalic: isItalic,
        textAlign: textAlign
      };
      addAnnotation(pIndex, newAnno);
      setSelectedAnnoId(newAnno.id);
      showToast('Text added! Click to edit, or drag move handle to position.');
    } else if (activeTool === 'check' || activeTool === 'cross') {
      const newAnno: AnnotationItem = {
        id: createAnnotationId('sym'),
        type: 'symbol',
        x: Math.max(1, clickX - 2),
        y: Math.max(1, clickY - 2),
        symbol: activeTool === 'check' ? '✓' : '✗',
        fontSize: fontSize + 6,
        color: activeTool === 'check' ? '#16a34a' : '#dc2626'
      };
      addAnnotation(pIndex, newAnno);
      setSelectedAnnoId(newAnno.id);
    } else if (activeTool.startsWith('shape_')) {
      const isLine = activeTool === 'shape_line';
      const isArrow = activeTool === 'shape_arrow';
      const newAnno: AnnotationItem = {
        id: createAnnotationId('shape'),
        type: activeTool as AnnotationItem['type'],
        x: Math.max(1, Math.min(80, clickX)),
        y: Math.max(1, Math.min(85, clickY)),
        width: isLine || isArrow ? 20 : 15,
        height: isLine || isArrow ? 3 : 10,
        shapeStyle: shapeStyle,
        color: shapeColor,
        strokeColor: shapeColor,
        fillColor: shapeStyle === 'fill' ? shapeColor : 'transparent',
        strokeWidth: shapeStrokeWidth
      };
      addAnnotation(pIndex, newAnno);
      setSelectedAnnoId(newAnno.id);
      showToast('Shape placed! Drag or resize handle to position.');
    }
  };

  const addAnnotation = (pIndex: number, item: AnnotationItem) => {
    setPages(prev => prev.map((p, idx) => {
      if (idx === pIndex) {
        return { ...p, annotations: [...p.annotations, item] };
      }
      return p;
    }));
  };

  const updateAnnotation = (pIndex: number, id: string, updates: Partial<AnnotationItem>) => {
    setPages(prev => prev.map((p, idx) => {
      if (idx === pIndex) {
        return {
          ...p,
          annotations: p.annotations.map(a => a.id === id ? { ...a, ...updates } : a)
        };
      }
      return p;
    }));
  };

  const deleteAnnotation = (pIndex: number, id: string) => {
    saveHistory();
    setPages(prev => prev.map((p, idx) => {
      if (idx === pIndex) {
        return { ...p, annotations: p.annotations.filter(a => a.id !== id) };
      }
      return p;
    }));
    if (selectedAnnoId === id) setSelectedAnnoId(null);
    showToast('Element deleted.');
  };

  // Duplicate Selected Annotation Element (Ansar Tools)
  const duplicateSelectedElement = () => {
    if (!selectedAnnoId) {
      showToast('Please select an element first to duplicate.');
      return;
    }
    let foundPage = -1;
    let foundAnno: AnnotationItem | null = null;
    for (let i = 0; i < pages.length; i++) {
      const a = pages[i].annotations.find(item => item.id === selectedAnnoId);
      if (a) {
        foundPage = i;
        foundAnno = a;
        break;
      }
    }
    if (foundPage !== -1 && foundAnno) {
      saveHistory();
      const cloned: AnnotationItem = {
        ...JSON.parse(JSON.stringify(foundAnno)),
        id: createAnnotationId('clone'),
        x: Math.min(85, foundAnno.x + 3),
        y: Math.min(90, foundAnno.y + 3)
      };
      addAnnotation(foundPage, cloned);
      setSelectedAnnoId(cloned.id);
      showToast('Element duplicated!');
    }
  };

  // Format Painter Handler
  const handleFormatPainterClick = () => {
    if (!selectedAnnoId) {
      showToast('Select a text box first to copy its style.');
      return;
    }
    const selectedAnno = pages.flatMap(p => p.annotations).find(a => a.id === selectedAnnoId);
    if (!selectedAnno || selectedAnno.type !== 'text') {
      showToast('Please select a text element first.');
      return;
    }
    setCopiedStyle({
      fontFamily: selectedAnno.fontFamily,
      fontSize: selectedAnno.fontSize,
      color: selectedAnno.color,
      isBold: selectedAnno.isBold,
      isItalic: selectedAnno.isItalic,
      textAlign: selectedAnno.textAlign
    });
    setFormatPainterActive(true);
    showToast('🎨 Format Painter activated! Click any other text to apply style.');
  };

  // Dragging Annotation Move Handler
  const startDragAnnotation = (e: React.MouseEvent, pIndex: number, anno: AnnotationItem) => {
    e.stopPropagation();
    setSelectedAnnoId(anno.id);

    // Apply Format Painter if active
    if (formatPainterActive && copiedStyle && anno.type === 'text') {
      updateAnnotation(pIndex, anno.id, {
        fontFamily: copiedStyle.fontFamily,
        fontSize: copiedStyle.fontSize,
        color: copiedStyle.color,
        isBold: copiedStyle.isBold,
        isItalic: copiedStyle.isItalic,
        textAlign: copiedStyle.textAlign
      });
      setFormatPainterActive(false);
      setCopiedStyle(null);
      showToast('Style applied!');
      return;
    }

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const initialX = anno.x;
    const initialY = anno.y;
    const pageEl = document.getElementById(`editor-page-${pIndex}`);
    if (!pageEl) return;
    const pageRect = pageEl.getBoundingClientRect();

    const onMouseMove = (moveEv: MouseEvent) => {
      const deltaXPct = ((moveEv.clientX - startClientX) / pageRect.width) * 100;
      const deltaYPct = ((moveEv.clientY - startClientY) / pageRect.height) * 100;
      const newX = Math.max(0, Math.min(100 - (anno.width || 4), initialX + deltaXPct));
      const newY = Math.max(0, Math.min(100 - (anno.height || 2), initialY + deltaYPct));
      updateAnnotation(pIndex, anno.id, { x: newX, y: newY });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      saveHistory();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Resizing Annotation Corner Handle
  const startResizeAnnotation = (e: React.MouseEvent, pIndex: number, anno: AnnotationItem) => {
    e.stopPropagation();
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const initialW = anno.width || 10;
    const initialH = anno.height || 4;
    const pageEl = document.getElementById(`editor-page-${pIndex}`);
    if (!pageEl) return;
    const pageRect = pageEl.getBoundingClientRect();

    const onMouseMove = (moveEv: MouseEvent) => {
      const deltaWPct = ((moveEv.clientX - startClientX) / pageRect.width) * 100;
      const deltaHPct = ((moveEv.clientY - startClientY) / pageRect.height) * 100;
      const newW = Math.max(1.5, Math.min(100 - anno.x, initialW + deltaWPct));
      const newH = Math.max(1, Math.min(100 - anno.y, initialH + deltaHPct));
      updateAnnotation(pIndex, anno.id, { width: newW, height: newH });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      saveHistory();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Box Drawing for Whiteout, Highlighter, and Shapes
  const handleMouseDownOnPage = (e: React.MouseEvent<HTMLDivElement>, pIndex: number) => {
    const isDraggableTool = [
      'whiteout', 'highlight', 'shape_rect', 'shape_circle', 'shape_arrow', 'shape_line'
    ].includes(activeTool);

    if (!isDraggableTool) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = ((e.clientX - rect.left) / rect.width) * 100;
    const startY = ((e.clientY - rect.top) / rect.height) * 100;

    setBoxDraft({
      pageIndex: pIndex,
      startX,
      startY,
      currentX: startX,
      currentY: startY
    });
  };

  const handleMouseMoveOnPage = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boxDraft) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const currentY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setBoxDraft(prev => prev ? { ...prev, currentX, currentY } : null);
  };

  const handleMouseUpOnPage = () => {
    if (!boxDraft) return;
    const { pageIndex, startX, startY, currentX, currentY } = boxDraft;
    const minX = Math.min(startX, currentX);
    const minY = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    if (width > 0.4 && height > 0.4) {
      saveHistory();

      if (activeTool === 'whiteout') {
        const autoColor = samplePaperBackground(pageIndex, minX, minY, width, height);
        const newAnno: AnnotationItem = {
          id: createAnnotationId('whiteout'),
          type: 'whiteout',
          x: minX,
          y: minY,
          width,
          height,
          color: autoColor
        };
        addAnnotation(pageIndex, newAnno);
        // CRITICAL FIX: DO NOT select whiteout by default to avoid showing any blue border or pill badge!
        showToast('Erased seamlessly with Content-Aware background (Zero borders)!');
      } else if (activeTool === 'highlight') {
        const newAnno: AnnotationItem = {
          id: createAnnotationId('highlight'),
          type: 'highlight',
          x: minX,
          y: minY,
          width,
          height,
          color: highlightColor
        };
        addAnnotation(pageIndex, newAnno);
        setSelectedAnnoId(newAnno.id);
        showToast('Highlighted area created!');
      } else if (activeTool.startsWith('shape_')) {
        const newAnno: AnnotationItem = {
          id: createAnnotationId('shape'),
          type: activeTool as AnnotationItem['type'],
          x: minX,
          y: minY,
          width: Math.max(2, width),
          height: Math.max(1.5, height),
          shapeStyle: shapeStyle,
          color: shapeColor,
          strokeColor: shapeColor,
          fillColor: shapeStyle === 'fill' ? shapeColor : 'transparent',
          strokeWidth: shapeStrokeWidth
        };
        addAnnotation(pageIndex, newAnno);
        setSelectedAnnoId(newAnno.id);
        showToast('Shape placed!');
      }
    }
    setBoxDraft(null);
  };

  // Freehand Drawing / Eraser Canvas Setup
  const initDrawCanvas = (pIndex: number, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    pageDrawingCanvasRefs.current[pIndex] = canvas;
    const page = pages[pIndex];
    if (page) {
      const targetW = Math.round(page.width);
      const targetH = Math.round(page.height);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    }
  };

  const getCanvasCoords = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const nativeEv = 'nativeEvent' in e ? e.nativeEvent : e;
    const clientX = 'touches' in nativeEv && nativeEv.touches.length > 0 
      ? nativeEv.touches[0].clientX 
      : (nativeEv as MouseEvent).clientX;
    const clientY = 'touches' in nativeEv && nativeEv.touches.length > 0 
      ? nativeEv.touches[0].clientY 
      : (nativeEv as MouseEvent).clientY;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Freehand Pen or Freehand Brush Eraser (Zero Borders, Instant Stroke)
  const handleDrawStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, pIndex: number) => {
    if (activeTool !== 'draw' && activeTool !== 'eraser_brush') return;
    const canvas = pageDrawingCanvasRefs.current[pIndex];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    e.preventDefault();
    const { x, y } = getCanvasCoords(e, canvas);

    if (activeTool === 'eraser_brush') {
      const eraseColor = customEraseColor === 'auto' ? '#ffffff' : customEraseColor;
      ctx.strokeStyle = eraseColor;
      ctx.lineWidth = eraserBrushSize;
    } else {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth * 2;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);

    const onMove = (moveEv: MouseEvent | TouchEvent) => {
      moveEv.preventDefault();
      const pt = getCanvasCoords(moveEv, canvas);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    };

    const onEnd = () => {
      ctx.closePath();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      saveHistory();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  };

  // Page Operations
  const rotatePage = (idx: number) => {
    saveHistory();
    setPages(prev => prev.map((p, i) => {
      if (i === idx) {
        return { ...p, rotation: (p.rotation + 90) % 360 };
      }
      return p;
    }));
    showToast(`Rotated page ${idx + 1}`);
  };

  const duplicatePage = (idx: number) => {
    saveHistory();
    const target = pages[idx];
    const clone: PageData = {
      ...target,
      pageIndex: pages.length,
      annotations: JSON.parse(JSON.stringify(target.annotations))
    };
    setPages(prev => {
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next.map((p, i) => ({ ...p, pageIndex: i }));
    });
    showToast(`Duplicated page ${idx + 1}`);
  };

  const deletePage = (idx: number) => {
    if (pages.length <= 1) {
      alert('Cannot delete the only page remaining.');
      return;
    }
    saveHistory();
    setPages(prev => {
      const next = prev.filter((_, i) => i !== idx);
      return next.map((p, i) => ({ ...p, pageIndex: i }));
    });
    if (activePageIndex >= pages.length - 1) {
      setActivePageIndex(Math.max(0, pages.length - 2));
    }
    showToast(`Deleted page ${idx + 1}`);
  };

  const addBlankPage = () => {
    saveHistory();
    const blank: PageData = {
      pageIndex: pages.length,
      originalPageIndex: -1,
      sourceDocIndex: -1,
      width: 595.28 * 1.35,
      height: 841.89 * 1.35,
      rotation: 0,
      canvasDataUrl: '',
      annotations: []
    };
    setPages(prev => [...prev, blank]);
    showToast('Added blank A4 page.');
  };

  // Signature Setup
  useEffect(() => {
    if (!showSigModal) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = sigColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const onMouseDown = (e: MouseEvent) => {
      setIsDrawingSig(true);
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawingSig) return;
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    };

    const onMouseUp = () => {
      setIsDrawingSig(false);
      ctx.closePath();
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [showSigModal, sigColor, isDrawingSig]);

  const clearSigCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Upload Signature Image with Paper Background Removal
  const handleSignatureUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = e.target?.result as string;
      if (!rawUrl) return;

      if (!removeBg) {
        setUploadedSigDataUrl(rawUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        if (!ctx) {
          setUploadedSigDataUrl(rawUrl);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, c.width, c.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const brightness = (d[i] + d[i + 1] + d[i + 2]) / 3;
          if (brightness > 200) {
            d[i + 3] = 0;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        setUploadedSigDataUrl(c.toDataURL('image/png'));
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  const applySignature = () => {
    let signatureUrl = '';

    if (sigMode === 'draw') {
      const canvas = sigCanvasRef.current;
      if (!canvas) return;
      signatureUrl = canvas.toDataURL('image/png');
    } else if (sigMode === 'type') {
      if (!typeSigText.trim()) {
        alert('Please type your name.');
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = 440;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = 'italic bold 44px "Dancing Script", "Brush Script MT", cursive, sans-serif';
        ctx.fillStyle = sigColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typeSigText, 220, 60);
      }
      signatureUrl = canvas.toDataURL('image/png');
    } else if (sigMode === 'upload') {
      if (!uploadedSigDataUrl) {
        alert('Please choose a signature image first.');
        return;
      }
      signatureUrl = uploadedSigDataUrl;
    }

    if (!signatureUrl) return;

    saveHistory();
    const newAnno: AnnotationItem = {
      id: createAnnotationId('sig'),
      type: 'signature',
      x: 35,
      y: 65,
      width: 25,
      height: 10,
      dataUrl: signatureUrl
    };
    addAnnotation(activePageIndex, newAnno);
    setSelectedAnnoId(newAnno.id);
    setShowSigModal(false);
    showToast('Signature placed! Drag handle to align with line, or drag corner to resize.');
  };

  // Image Upload on page
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          saveHistory();
          const newAnno: AnnotationItem = {
            id: createAnnotationId('img'),
            type: 'image',
            x: 30,
            y: 40,
            width: 25,
            height: 18,
            dataUrl: event.target.result
          };
          addAnnotation(activePageIndex, newAnno);
          setSelectedAnnoId(newAnno.id);
          showToast('Image placed on page. Drag or resize as needed.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Hex to RGB [0-1] converter
  const hexToPdfRgb = (hex: string) => {
    let clean = (hex || '#000000').replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const num = parseInt(clean, 16) || 0;
    return rgb(
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255
    );
  };

  // High-DPI Canvas Text Render Helper (Embeds ANY Google Font with 100% fidelity)
  const renderTextToImage = (text: string, fontName: string, size: number, color: string, bold: boolean, italic: boolean) => {
    const scale = 3;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const fontStyle = italic ? 'italic' : 'normal';
    const fontWeight = bold ? 'bold' : 'normal';
    const fontStr = `${fontStyle} ${fontWeight} ${size * scale}px "${fontName}", sans-serif`;

    ctx.font = fontStr;
    const metrics = ctx.measureText(text);
    const textWidth = Math.ceil(metrics.width) + 30;
    const textHeight = Math.ceil(size * scale * 1.5) + 20;

    canvas.width = textWidth;
    canvas.height = textHeight;

    ctx.font = fontStr;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    ctx.fillText(text, 10, 10);

    return {
      dataUrl: canvas.toDataURL('image/png'),
      width: textWidth / scale,
      height: textHeight / scale
    };
  };

  // Export PDF with full fidelity, Google Fonts, Shapes, and ZERO borders
  const exportEditedPdf = async () => {
    if (pages.length === 0) return;
    setIsExporting(true);
    setExportProgress(10);

    try {
      const loadedPdfDocs: PDFDocument[] = [];
      for (const d of docs) {
        const loaded = await PDFDocument.load(d.arrayBuffer.slice(0));
        loadedPdfDocs.push(loaded);
      }

      const outDoc = await PDFDocument.create();
      const total = pages.length;

      for (let i = 0; i < total; i++) {
        const p = pages[i];
        let outPage;

        if (p.sourceDocIndex === -1 || !loadedPdfDocs[p.sourceDocIndex]) {
          outPage = outDoc.addPage([595.28, 841.89]);
        } else {
          const srcDoc = loadedPdfDocs[p.sourceDocIndex];
          const [copied] = await outDoc.copyPages(srcDoc, [p.originalPageIndex]);
          outPage = outDoc.addPage(copied);
        }

        if (p.rotation !== 0) {
          const cur = outPage.getRotation().angle || 0;
          outPage.setRotation(degrees(cur + p.rotation));
        }

        const { width: pageW, height: pageH } = outPage.getSize();

        // 1. Draw Whiteout Rectangles with ZERO BORDER and exact matched color
        for (const anno of p.annotations) {
          if (anno.type === 'whiteout' && anno.width && anno.height) {
            const pdfX = (anno.x / 100) * pageW;
            const pdfW = (anno.width / 100) * pageW;
            const pdfH = (anno.height / 100) * pageH;
            const pdfY = pageH - ((anno.y / 100) * pageH) - pdfH;

            outPage.drawRectangle({
              x: pdfX,
              y: pdfY,
              width: pdfW,
              height: pdfH,
              color: hexToPdfRgb(anno.color || '#ffffff'),
              borderWidth: 0
            });
          }
        }

        // 2. Draw Highlights
        for (const anno of p.annotations) {
          if (anno.type === 'highlight' && anno.width && anno.height) {
            const pdfX = (anno.x / 100) * pageW;
            const pdfW = (anno.width / 100) * pageW;
            const pdfH = (anno.height / 100) * pageH;
            const pdfY = pageH - ((anno.y / 100) * pageH) - pdfH;

            outPage.drawRectangle({
              x: pdfX,
              y: pdfY,
              width: pdfW,
              height: pdfH,
              color: hexToPdfRgb(anno.color || '#fef08a'),
              opacity: 0.38,
              borderWidth: 0
            });
          }
        }

        // 3. Draw Shapes (Rectangle, Circle, Line, Arrow)
        for (const anno of p.annotations) {
          const pdfX = (anno.x / 100) * pageW;
          const pdfW = ((anno.width || 10) / 100) * pageW;
          const pdfH = ((anno.height || 6) / 100) * pageH;
          const pdfY = pageH - ((anno.y / 100) * pageH) - pdfH;

          if (anno.type === 'shape_rect') {
            outPage.drawRectangle({
              x: pdfX,
              y: pdfY,
              width: pdfW,
              height: pdfH,
              borderColor: anno.shapeStyle === 'fill' ? undefined : hexToPdfRgb(anno.strokeColor || '#2563eb'),
              borderWidth: anno.shapeStyle === 'fill' ? 0 : (anno.strokeWidth || 2),
              color: anno.shapeStyle === 'fill' ? hexToPdfRgb(anno.fillColor || anno.color || '#2563eb') : undefined
            });
          } else if (anno.type === 'shape_circle') {
            outPage.drawEllipse({
              x: pdfX + pdfW / 2,
              y: pdfY + pdfH / 2,
              xScale: pdfW / 2,
              yScale: pdfH / 2,
              borderColor: anno.shapeStyle === 'fill' ? undefined : hexToPdfRgb(anno.strokeColor || '#2563eb'),
              borderWidth: anno.shapeStyle === 'fill' ? 0 : (anno.strokeWidth || 2),
              color: anno.shapeStyle === 'fill' ? hexToPdfRgb(anno.fillColor || anno.color || '#2563eb') : undefined
            });
          } else if (anno.type === 'shape_line') {
            outPage.drawLine({
              start: { x: pdfX, y: pdfY + pdfH / 2 },
              end: { x: pdfX + pdfW, y: pdfY + pdfH / 2 },
              thickness: anno.strokeWidth || 2,
              color: hexToPdfRgb(anno.strokeColor || anno.color || '#2563eb')
            });
          } else if (anno.type === 'shape_arrow') {
            outPage.drawLine({
              start: { x: pdfX, y: pdfY + pdfH / 2 },
              end: { x: pdfX + pdfW - 8, y: pdfY + pdfH / 2 },
              thickness: anno.strokeWidth || 2,
              color: hexToPdfRgb(anno.strokeColor || anno.color || '#2563eb')
            });
            outPage.drawSquare({
              x: pdfX + pdfW - 10,
              y: pdfY + pdfH / 2 - 4,
              size: 8,
              color: hexToPdfRgb(anno.strokeColor || anno.color || '#2563eb'),
              rotate: degrees(45)
            });
          }
        }

        // 4. Draw Text and Symbols with High-DPI Google Fonts Render
        for (const anno of p.annotations) {
          if (anno.type === 'text' && anno.text) {
            try {
              const textImg = renderTextToImage(
                anno.text,
                anno.fontFamily || 'Roboto',
                anno.fontSize || 16,
                anno.color || '#000000',
                anno.isBold ?? true,
                anno.isItalic ?? false
              );

              if (textImg) {
                const embeddedPng = await outDoc.embedPng(textImg.dataUrl);
                const pdfX = (anno.x / 100) * pageW;
                const pdfY = pageH - ((anno.y / 100) * pageH) - textImg.height;

                outPage.drawImage(embeddedPng, {
                  x: Math.max(0, pdfX),
                  y: Math.max(0, pdfY),
                  width: textImg.width,
                  height: textImg.height
                });
              }
            } catch (txtErr) {
              console.warn('Text embed fallback', txtErr);
            }
          } else if (anno.type === 'symbol' && anno.symbol) {
            try {
              const isCheck = anno.symbol === '✓';
              const symImg = renderTextToImage(
                anno.symbol,
                'Roboto',
                (anno.fontSize || 20) * 1.2,
                isCheck ? '#16a34a' : '#dc2626',
                true,
                false
              );
              if (symImg) {
                const embeddedSym = await outDoc.embedPng(symImg.dataUrl);
                const pdfX = (anno.x / 100) * pageW;
                const pdfY = pageH - ((anno.y / 100) * pageH) - symImg.height;

                outPage.drawImage(embeddedSym, {
                  x: pdfX,
                  y: pdfY,
                  width: symImg.width,
                  height: symImg.height
                });
              }
            } catch (symErr) {
              console.warn('Symbol embed fallback', symErr);
            }
          }
        }

        // 5. Draw Freehand Pen & Brush Eraser Canvas overlay
        const drawCanvas = pageDrawingCanvasRefs.current[i];
        if (drawCanvas) {
          try {
            const ctx = drawCanvas.getContext('2d');
            const imgData = ctx?.getImageData(0, 0, drawCanvas.width, drawCanvas.height).data;
            let hasStrokes = false;
            if (imgData) {
              for (let d = 3; d < imgData.length; d += 64) {
                if (imgData[d] > 0) { hasStrokes = true; break; }
              }
            }
            if (hasStrokes) {
              const drawDataUrl = drawCanvas.toDataURL('image/png');
              const drawPng = await outDoc.embedPng(drawDataUrl);
              outPage.drawImage(drawPng, {
                x: 0, y: 0, width: pageW, height: pageH
              });
            }
          } catch (cErr) {
            console.warn('Canvas export skipped', cErr);
          }
        }

        // 6. Draw Signatures & Images
        for (const anno of p.annotations) {
          if ((anno.type === 'signature' || anno.type === 'image') && anno.dataUrl) {
            try {
              const image = await outDoc.embedPng(anno.dataUrl);
              const imgW = ((anno.width || 25) / 100) * pageW;
              const imgH = ((anno.height || 12) / 100) * pageH;
              const pdfX = (anno.x / 100) * pageW;
              const pdfY = pageH - ((anno.y / 100) * pageH) - imgH;

              outPage.drawImage(image, {
                x: pdfX,
                y: pdfY,
                width: imgW,
                height: imgH
              });
            } catch (imgErr) {
              console.warn('Image embed failed', imgErr);
            }
          }
        }

        setExportProgress(Math.round(((i + 1) / total) * 85) + 10);
      }

      setExportProgress(98);
      const pdfBytes = await outDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename || 'Edited_Document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      showToast('Downloaded edited PDF successfully!');
    } catch (err) {
      console.error('Export Error:', err);
      alert('Error downloading PDF. Please check that all elements are valid.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100">
      <Navbar />

      {/* Background Pre-loader for PDF.js */}
      <Script
        id="pdfjs-cdn-script"
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const pdfjs = (window as WindowWithPdfJs).pdfjsLib;
          if (pdfjs && !pdfjs.GlobalWorkerOptions?.workerSrc) {
            try {
              const workerBlob = new Blob([
                'importScripts("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js");'
              ], { type: 'application/javascript' });
              pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);
            } catch {
              pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            }
          }
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950/95 border border-blue-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* LANDING VIEW (No PDF Loaded) */}
      {pages.length === 0 && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 flex flex-col items-center justify-center">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Ansar Tools - Professional Content-Aware PDF Studio
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Edit, Erase & Sign PDFs <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                100% Free, Seamless & Professional
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg mt-4">
              Content-Aware zero-border erase, Google Fonts typography, Rectangles/Circles/Arrows, Merge PDF, and 3-way Digital Signatures.
            </p>
          </div>

          <div className="w-full max-w-3xl bg-slate-800/90 backdrop-blur border-2 border-dashed border-blue-500/40 hover:border-blue-400 rounded-3xl p-8 sm:p-14 text-center transition-all shadow-2xl">
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <div className="w-20 h-20 bg-blue-600/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Upload className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Drop your PDF document here</h3>
            <p className="text-slate-400 text-sm mb-8">
              Supports invoices, contracts, legal forms, certificates, and resumes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-blue-500/30 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Upload PDF Document'}
              </button>

              <button
                onClick={loadDemoPdf}
                disabled={isLoading}
                className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 px-6 py-4 rounded-2xl font-semibold text-base transition-all hover:text-white cursor-pointer"
              >
                ⚡ Try Demo PDF (1-Click Test)
              </button>
            </div>

            {isLoading && (
              <div className="mt-8 flex items-center justify-center gap-3 text-blue-400 font-medium text-sm animate-pulse">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>{loadingStatus}</span>
              </div>
            )}
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-5xl w-full mt-12 text-left">
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
              <div className="text-purple-400 font-bold mb-1 flex items-center gap-2 text-sm">
                <Eraser className="w-4 h-4" /> Zero-Border Eraser
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Brush eraser & box whiteout with Content-Aware paper background auto-matching. No ugly borders!
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
              <div className="text-blue-400 font-bold mb-1 flex items-center gap-2 text-sm">
                <Type className="w-4 h-4" /> 12 Google Fonts
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Poppins, Montserrat, Dancing Script, Roboto with Bold, Italic & Format Painter.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
              <div className="text-emerald-400 font-bold mb-1 flex items-center gap-2 text-sm">
                <PenTool className="w-4 h-4" /> 3 Signature Modes
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Draw, type calligraphy, or upload signature image with automatic background removal.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
              <div className="text-amber-400 font-bold mb-1 flex items-center gap-2 text-sm">
                <Square className="w-4 h-4" /> Shapes & Merge PDF
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Insert Rectangles, Circles, Arrows, Lines and merge multiple PDF documents in 1-click.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* ACTIVE STUDIO VIEW */}
      {pages.length > 0 && (
        <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
          
          {/* TOP FIXED TOOLBAR */}
          <header className="bg-slate-800 border-b border-slate-700 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-md z-30">
            
            {/* Left: Document Operations */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Add Page */}
              <button
                onClick={addBlankPage}
                className="bg-blue-900/50 hover:bg-blue-800 text-blue-300 border border-blue-700/60 px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                title="Add Blank Page to PDF"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Page</span>
              </button>

              {/* Merge PDF */}
              <button
                onClick={() => mergePdfInputRef.current?.click()}
                className="bg-purple-900/50 hover:bg-purple-800 text-purple-300 border border-purple-700/60 px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                title="Merge Another PDF into this Document"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>Merge PDF</span>
              </button>
              <input
                type="file"
                ref={mergePdfInputRef}
                accept="application/pdf"
                className="hidden"
                onChange={handleMergePdfUpload}
              />

              {/* Delete Current Page */}
              <button
                onClick={() => deletePage(activePageIndex)}
                className="bg-rose-950/50 hover:bg-rose-900 text-rose-300 border border-rose-800/60 px-2 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                title="Delete Active Page"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Del Page</span>
              </button>

              <div className="w-px h-5 bg-slate-700 mx-1 hidden sm:block" />

              {/* Undo */}
              <button
                onClick={handleUndo}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Undo last action"
              >
                <Undo2 className="w-4 h-4" />
              </button>

              {/* Duplicate Object */}
              <button
                onClick={duplicateSelectedElement}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                title="Duplicate Selected Element"
              >
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden lg:inline">Duplicate</span>
              </button>

              {/* Format Painter */}
              <button
                onClick={handleFormatPainterClick}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  formatPainterActive
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-lg'
                    : 'bg-slate-700 hover:bg-slate-600 text-amber-300'
                }`}
                title="Format Painter: Copy text style and click another to paste"
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Painter</span>
              </button>
            </div>

            {/* Center: Contextual Tool Adjustments */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              {/* Text Controls */}
              {activeTool === 'text' && (
                <div className="flex items-center gap-1.5 bg-slate-900/95 px-2.5 py-1 rounded-xl border border-slate-700">
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="bg-slate-800 text-slate-100 text-xs px-2 py-1 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
                  >
                    {GOOGLE_FONTS.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1">
                    <input
                      type="range"
                      min="11"
                      max="48"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-14 accent-blue-500"
                    />
                    <span className="w-5 font-mono text-[11px]">{fontSize}</span>
                  </div>

                  <button
                    onClick={() => setIsBold(!isBold)}
                    className={`p-1 rounded font-bold text-xs ${isBold ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'}`}
                    title="Toggle Bold"
                  >
                    <Bold className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => setIsItalic(!isItalic)}
                    className={`p-1 rounded font-serif italic text-xs ${isItalic ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'}`}
                    title="Toggle Italic"
                  >
                    <Italic className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => setTextAlign('left')}
                    className={`p-1 rounded ${textAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'}`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setTextAlign('center')}
                    className={`p-1 rounded ${textAlign === 'center' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'}`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setTextAlign('right')}
                    className={`p-1 rounded ${textAlign === 'right' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'}`}
                    title="Align Right"
                  >
                    <AlignRight className="w-3 h-3" />
                  </button>

                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    title="Text Color"
                  />
                </div>
              )}

              {/* Brush Eraser Controls */}
              {activeTool === 'eraser_brush' && (
                <div className="flex items-center gap-2 bg-slate-900/95 px-3 py-1 rounded-xl border border-slate-700">
                  <span className="text-purple-300 font-bold text-[11px] flex items-center gap-1">
                    <Eraser className="w-3.5 h-3.5" /> Brush Eraser:
                  </span>
                  <div className="flex items-center gap-1">
                    {[14, 26, 45].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setEraserBrushSize(sz)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          eraserBrushSize === sz ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {sz === 14 ? 'Fine' : sz === 26 ? 'Medium' : 'Thick'}
                      </button>
                    ))}
                  </div>
                  <span className="text-slate-500 text-[10px]">|</span>
                  <button
                    onClick={() => setCustomEraseColor('auto')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      customEraseColor === 'auto' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Auto Paper
                  </button>
                  <button
                    onClick={() => setCustomEraseColor('#ffffff')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      customEraseColor === '#ffffff' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    White
                  </button>
                </div>
              )}

              {/* Box Whiteout Controls */}
              {activeTool === 'whiteout' && (
                <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 text-xs">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Pipette className="w-3.5 h-3.5 text-blue-400" /> Paper Tone:
                  </span>
                  <button
                    onClick={() => setCustomEraseColor('auto')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      customEraseColor === 'auto' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Auto-Match (Content-Aware)
                  </button>
                  <button
                    onClick={() => setCustomEraseColor('#ffffff')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      customEraseColor === '#ffffff' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Pure White
                  </button>
                  <button
                    onClick={() => setCustomEraseColor('#fffdf8')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      customEraseColor === '#fffdf8' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Warm Cream
                  </button>
                </div>
              )}

              {/* Shape Controls */}
              {activeTool.startsWith('shape_') && (
                <div className="flex items-center gap-2 bg-slate-900/95 px-3 py-1 rounded-xl border border-slate-700">
                  <select
                    value={shapeStyle}
                    onChange={(e) => setShapeStyle(e.target.value as 'outline' | 'fill')}
                    className="bg-slate-800 text-slate-100 text-xs px-2 py-1 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="outline">Outline Only</option>
                    <option value="fill">Filled Color</option>
                  </select>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span>Width:</span>
                    {[1, 2, 4, 6].map((w) => (
                      <button
                        key={w}
                        onClick={() => setShapeStrokeWidth(w)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                          shapeStrokeWidth === w ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {w}px
                      </button>
                    ))}
                  </div>

                  <input
                    type="color"
                    value={shapeColor}
                    onChange={(e) => setShapeColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    title="Shape Color"
                  />
                </div>
              )}

              {/* Freehand Pen Controls */}
              {activeTool === 'draw' && (
                <div className="flex items-center gap-2 bg-slate-900/95 px-3 py-1 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[11px]">Pen Width:</span>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={penWidth}
                    onChange={(e) => setPenWidth(parseInt(e.target.value))}
                    className="w-14 accent-blue-500"
                  />
                  <input
                    type="color"
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    title="Pen Ink Color"
                  />
                </div>
              )}

              {/* Highlight Controls */}
              {activeTool === 'highlight' && (
                <div className="flex items-center gap-2 bg-slate-900/95 px-3 py-1 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[11px]">Highlight Color:</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { name: 'Yellow', hex: '#fef08a' },
                      { name: 'Green', hex: '#bbf7d0' },
                      { name: 'Pink', hex: '#fbcfe8' },
                      { name: 'Blue', hex: '#bae6fd' },
                      { name: 'Orange', hex: '#fed7aa' }
                    ].map(swatch => (
                      <button
                        key={swatch.hex}
                        type="button"
                        onClick={() => setHighlightColor(swatch.hex)}
                        className={`w-4 h-4 rounded-full border transition-all ${
                          highlightColor === swatch.hex ? 'scale-125 ring-2 ring-white border-white' : 'border-slate-600 hover:scale-110'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                        title={`${swatch.name} Highlight`}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={highlightColor}
                    onChange={(e) => setHighlightColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent ml-1"
                    title="Custom Highlight Color"
                  />
                </div>
              )}
            </div>

            {/* Right: Zoom & Export CTA */}
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.4, Number((prev - 0.1).toFixed(1))))}
                  className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-mono text-[11px] text-slate-300 min-w-[45px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(2.5, Number((prev + 0.1).toFixed(1))))}
                  className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Save & Download CTA */}
              <button
                onClick={exportEditedPdf}
                disabled={isExporting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-1.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? `Saving (${exportProgress}%)` : 'Save PDF'}</span>
              </button>
            </div>
          </header>

          {/* TWO-PANE STUDIO */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT TOOL PALETTE (Ansar Tools) */}
            <aside className="w-16 sm:w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 gap-2 overflow-y-auto flex-shrink-0 z-30 shadow-lg">
              {/* Select */}
              <button
                onClick={() => setActiveTool('select')}
                className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition w-13 ${
                  activeTool === 'select' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Select & Move elements"
              >
                <MousePointer className="w-5 h-5" />
                <span className="text-[9px] font-bold">Select</span>
              </button>

              {/* Text */}
              <button
                onClick={() => setActiveTool('text')}
                className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition w-13 ${
                  activeTool === 'text' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Add Text with Google Fonts"
              >
                <Type className="w-5 h-5" />
                <span className="text-[9px] font-bold">Text</span>
              </button>

              {/* Brush Eraser */}
              <button
                onClick={() => setActiveTool('eraser_brush')}
                className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition w-13 ${
                  activeTool === 'eraser_brush' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-400 hover:bg-slate-800'
                }`}
                title="Brush Eraser: Freehand sweep over text with ZERO borders"
              >
                <Eraser className="w-5 h-5" />
                <span className="text-[9px] font-bold">Brush</span>
              </button>

              {/* Box Whiteout */}
              <button
                onClick={() => setActiveTool('whiteout')}
                className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition w-13 ${
                  activeTool === 'whiteout' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Box Erase: Drag rectangle with content-aware background"
              >
                <Square className="w-5 h-5" />
                <span className="text-[9px] font-bold">Whiteout</span>
              </button>

              {/* Pen (Draw) */}
              <button
                onClick={() => setActiveTool('draw')}
                className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition w-13 ${
                  activeTool === 'draw' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Draw freehand directly on document"
              >
                <Palette className="w-5 h-5 text-indigo-400" />
                <span className="text-[9px] font-bold">Draw</span>
              </button>

              {/* Shapes Divider */}
              <div className="w-8 h-px bg-slate-800 my-1" />

              {/* Shape: Rectangle */}
              <button
                onClick={() => setActiveTool('shape_rect')}
                className={`p-2 rounded-xl flex flex-col items-center gap-0.5 transition w-13 ${
                  activeTool === 'shape_rect' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Rectangle Shape"
              >
                <Square className="w-4 h-4" />
                <span className="text-[8px] font-bold">Rect</span>
              </button>

              {/* Shape: Circle */}
              <button
                onClick={() => setActiveTool('shape_circle')}
                className={`p-2 rounded-xl flex flex-col items-center gap-0.5 transition w-13 ${
                  activeTool === 'shape_circle' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Circle Shape"
              >
                <Circle className="w-4 h-4" />
                <span className="text-[8px] font-bold">Circle</span>
              </button>

              {/* Shape: Arrow */}
              <button
                onClick={() => setActiveTool('shape_arrow')}
                className={`p-2 rounded-xl flex flex-col items-center gap-0.5 transition w-13 ${
                  activeTool === 'shape_arrow' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Arrow Pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-[8px] font-bold">Arrow</span>
              </button>

              {/* Shape: Line */}
              <button
                onClick={() => setActiveTool('shape_line')}
                className={`p-2 rounded-xl flex flex-col items-center gap-0.5 transition w-13 ${
                  activeTool === 'shape_line' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Straight Line"
              >
                <Minus className="w-4 h-4" />
                <span className="text-[8px] font-bold">Line</span>
              </button>

              <div className="w-8 h-px bg-slate-800 my-1" />

              {/* Digital Signature */}
              <button
                onClick={() => setShowSigModal(true)}
                className="p-2.5 rounded-xl flex flex-col items-center gap-1 text-sky-400 hover:bg-slate-800 transition w-13 cursor-pointer"
                title="Sign document (Draw, Type, or Upload Photo)"
              >
                <PenTool className="w-5 h-5" />
                <span className="text-[9px] font-bold">Sign</span>
              </button>

              {/* Highlight */}
              <button
                onClick={() => setActiveTool('highlight')}
                className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition w-13 ${
                  activeTool === 'highlight' ? 'bg-yellow-500 text-slate-950 font-bold shadow-md' : 'text-yellow-400 hover:bg-slate-800'
                }`}
                title="Highlighter"
              >
                <Highlighter className="w-5 h-5" />
                <span className="text-[9px] font-bold">Highlight</span>
              </button>

              {/* Insert Image */}
              <button
                onClick={() => imageUploadRef.current?.click()}
                className="p-2.5 rounded-xl flex flex-col items-center gap-1 text-green-400 hover:bg-slate-800 transition w-13 cursor-pointer"
                title="Insert Image / Stamp"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-[9px] font-bold">Image</span>
              </button>
              <input
                type="file"
                ref={imageUploadRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageFileChange}
              />

              {/* Checkmark */}
              <button
                onClick={() => setActiveTool('check')}
                className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition w-13 ${
                  activeTool === 'check' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-slate-800'
                }`}
                title="Place Checkmark (✓)"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span className="text-[9px] font-bold">Check</span>
              </button>

              {/* Cross */}
              <button
                onClick={() => setActiveTool('cross')}
                className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition w-13 ${
                  activeTool === 'cross' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:bg-slate-800'
                }`}
                title="Place Cross Mark (✗)"
              >
                <CrossIcon className="w-5 h-5 stroke-[3]" />
                <span className="text-[9px] font-bold">Cross</span>
              </button>
            </aside>

            {/* PAGE THUMBNAILS (Collapsible Sidebar) */}
            <aside className="w-40 sm:w-48 bg-slate-850 border-r border-slate-800 p-2.5 overflow-y-auto flex flex-col gap-2.5 flex-shrink-0 hidden md:flex">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                <span>Pages ({pages.length})</span>
                <button
                  onClick={addBlankPage}
                  className="p-1 hover:bg-slate-700 rounded text-blue-400 flex items-center gap-1 cursor-pointer"
                  title="Add Blank Page"
                >
                  <Plus className="w-3.5 h-3.5" /> Page
                </button>
              </div>

              {pages.map((page, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActivePageIndex(idx);
                    const el = document.getElementById(`editor-page-${idx}`);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group relative rounded-xl border-2 p-1.5 transition-all cursor-pointer ${
                    activePageIndex === idx 
                      ? 'border-blue-500 bg-blue-500/10 shadow-md' 
                      : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>Page {idx + 1}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); rotatePage(idx); }}
                        className="p-0.5 hover:text-blue-400"
                        title="Rotate 90°"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); duplicatePage(idx); }}
                        className="p-0.5 hover:text-blue-400"
                        title="Duplicate Page"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deletePage(idx); }}
                        className="p-0.5 hover:text-rose-400"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
                    {page.canvasDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={page.canvasDataUrl}
                        alt={`Page ${idx + 1}`}
                        className="w-full h-full object-contain"
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                    ) : (
                      <div className="text-slate-400 text-xs font-semibold">Blank Page</div>
                    )}
                  </div>
                </div>
              ))}
            </aside>

            {/* MAIN DOCUMENT SCROLL VIEW */}
            <section className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-8 relative">
              
              {/* Active Tool Helper Banner */}
              <div className="sticky top-2 z-30 bg-slate-900/90 backdrop-blur border border-slate-700 text-xs text-slate-300 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                {activeTool === 'select' && 'Select / Move Mode: Click any element to drag, duplicate, or delete.'}
                {activeTool === 'text' && `Text Mode (${fontFamily}): Click anywhere on page to type.`}
                {activeTool === 'eraser_brush' && 'Brush Eraser: Sweep brush over text or marks to erase with ZERO borders.'}
                {activeTool === 'whiteout' && 'Content-Aware Box Erase: Drag box over text to erase with ZERO borders.'}
                {activeTool === 'highlight' && 'Highlight Mode: Drag box over text to highlight.'}
                {activeTool === 'draw' && 'Pen Mode: Draw freehand directly on document.'}
                {activeTool.startsWith('shape_') && 'Shape Mode: Drag or click to place rectangle, circle, arrow, or line.'}
                {activeTool === 'check' && 'Checkmark Mode: Click to stamp ✓ in checkboxes.'}
                {activeTool === 'cross' && 'Crossmark Mode: Click to stamp ✗ in checkboxes.'}
              </div>

              {/* RENDER ALL PAGES VERTICALLY */}
              {pages.map((page, pIdx) => {
                const isDraftOnThisPage = boxDraft && boxDraft.pageIndex === pIdx;

                return (
                  <div
                    key={pIdx}
                    id={`editor-page-${pIdx}`}
                    onMouseEnter={() => setActivePageIndex(pIdx)}
                    className="relative bg-white shadow-2xl rounded-sm transition-transform duration-150 select-none overflow-hidden"
                    style={{
                      width: `${(page.width || 700) * zoomLevel}px`,
                      height: `${(page.height || 990) * zoomLevel}px`,
                      maxWidth: '100%'
                    }}
                  >
                    {/* Background Original PDF Render */}
                    {page.canvasDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={page.canvasDataUrl}
                        alt={`Page ${pIdx + 1}`}
                        className="w-full h-full object-contain pointer-events-none"
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                    ) : (
                      <div className="w-full h-full bg-white flex items-center justify-center text-slate-300 text-sm">
                        Blank Page {pIdx + 1}
                      </div>
                    )}

                    {/* Freehand Pen & Brush Eraser Canvas Overlay */}
                    <canvas
                      ref={(el) => initDrawCanvas(pIdx, el)}
                      onMouseDown={(e) => handleDrawStart(e, pIdx)}
                      onTouchStart={(e) => handleDrawStart(e, pIdx)}
                      className={`absolute inset-0 ${
                        activeTool === 'draw' || activeTool === 'eraser_brush'
                          ? 'z-25 cursor-crosshair pointer-events-auto touch-none' 
                          : 'z-10 pointer-events-none'
                      }`}
                      style={{ width: '100%', height: '100%' }}
                    />

                    {/* Interactive Annotation & Click Layer */}
                    <div
                      onClick={(e) => handlePageClick(e, pIdx)}
                      onMouseDown={(e) => handleMouseDownOnPage(e, pIdx)}
                      onMouseMove={handleMouseMoveOnPage}
                      onMouseUp={handleMouseUpOnPage}
                      className={`absolute inset-0 ${
                        activeTool === 'draw' || activeTool === 'eraser_brush'
                          ? 'z-10 pointer-events-none' 
                          : 'z-20 pointer-events-auto'
                      } ${
                        activeTool === 'text' ? 'cursor-text' : 
                        activeTool === 'whiteout' || activeTool === 'highlight' || activeTool.startsWith('shape_') ? 'cursor-crosshair' : 
                        activeTool === 'check' || activeTool === 'cross' ? 'cursor-pointer' : 
                        'cursor-default'
                      }`}
                    >
                      {/* Active Dragging Box Draft */}
                      {isDraftOnThisPage && (
                        <div
                          className="absolute pointer-events-none"
                          style={{
                            left: `${Math.min(boxDraft.startX, boxDraft.currentX)}%`,
                            top: `${Math.min(boxDraft.startY, boxDraft.currentY)}%`,
                            width: `${Math.abs(boxDraft.currentX - boxDraft.startX)}%`,
                            height: `${Math.abs(boxDraft.currentY - boxDraft.startY)}%`,
                            backgroundColor: activeTool === 'whiteout' ? '#ffffff' : activeTool === 'highlight' ? highlightColor : shapeStyle === 'fill' ? shapeColor : 'transparent',
                            opacity: activeTool === 'whiteout' ? 0.95 : activeTool === 'highlight' ? 0.45 : 0.7,
                            border: activeTool === 'whiteout' ? '1px dashed #94a3b8' : `2px dashed ${shapeColor || '#3b82f6'}`
                          }}
                        />
                      )}

                      {/* RENDER ANNOTATIONS ON THIS PAGE */}
                      {page.annotations.map((anno) => {
                        const isSelected = selectedAnnoId === anno.id;

                        return (
                          <div
                            key={anno.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAnnoId(anno.id);
                              if (formatPainterActive && copiedStyle && anno.type === 'text') {
                                updateAnnotation(pIdx, anno.id, {
                                  fontFamily: copiedStyle.fontFamily,
                                  fontSize: copiedStyle.fontSize,
                                  color: copiedStyle.color,
                                  isBold: copiedStyle.isBold,
                                  isItalic: copiedStyle.isItalic,
                                  textAlign: copiedStyle.textAlign
                                });
                                setFormatPainterActive(false);
                                setCopiedStyle(null);
                                showToast('Style applied!');
                              }
                            }}
                            className={`absolute ${isSelected ? 'z-40' : 'z-20'}`}
                            style={{
                              left: `${anno.x}%`,
                              top: `${anno.y}%`,
                              width: anno.width ? `${anno.width}%` : undefined,
                              height: anno.height ? `${anno.height}%` : undefined,
                            }}
                          >
                            {/* FLOATING ACTION PILL (When Selected in Select Mode) */}
                            {isSelected && activeTool === 'select' && (
                              <div
                                onMouseDown={(e) => startDragAnnotation(e, pIdx, anno)}
                                className="absolute -top-7 left-0 flex items-center gap-1.5 bg-slate-900 text-white px-2 py-0.5 rounded-lg shadow-xl text-[11px] font-semibold cursor-move z-50 border border-slate-700"
                              >
                                <Move className="w-3 h-3 text-blue-400" />
                                <span className="text-[9px] text-slate-300 uppercase">{anno.type.replace('shape_', '')}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateSelectedElement();
                                  }}
                                  className="ml-1 p-0.5 hover:text-blue-400 text-slate-400 cursor-pointer"
                                  title="Duplicate"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAnnotation(pIdx, anno.id);
                                  }}
                                  className="p-0.5 hover:text-rose-400 text-slate-400 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            {/* CORNER RESIZE HANDLE */}
                            {isSelected && activeTool === 'select' && anno.width && anno.height && (
                              <div
                                onMouseDown={(e) => startResizeAnnotation(e, pIdx, anno)}
                                className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full cursor-nwse-resize shadow-lg z-50"
                                title="Drag to Resize"
                              />
                            )}

                            {/* 1. TEXT ANNOTATION WITH GOOGLE FONTS */}
                            {anno.type === 'text' && (
                              <div
                                onMouseDown={(e) => {
                                  if (activeTool === 'select') {
                                    startDragAnnotation(e, pIdx, anno);
                                  }
                                }}
                                className={`inline-block ${
                                  isSelected && activeTool === 'select' ? 'ring-2 ring-blue-500 rounded p-0.5' : ''
                                }`}
                              >
                                <input
                                  type="text"
                                  defaultValue={anno.text}
                                  onBlur={(e) => {
                                    updateAnnotation(pIdx, anno.id, { text: e.target.value });
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') e.currentTarget.blur();
                                  }}
                                  style={{
                                    fontSize: `${(anno.fontSize || 16) * zoomLevel}px`,
                                    color: anno.color || '#000',
                                    fontWeight: anno.isBold ? '700' : '400',
                                    fontStyle: anno.isItalic ? 'italic' : 'normal',
                                    textAlign: anno.textAlign || 'left',
                                    fontFamily: `"${anno.fontFamily || 'Roboto'}", sans-serif`,
                                    width: `${Math.max(60, (anno.text?.length || 10) * (anno.fontSize || 16) * 0.75 * zoomLevel)}px`
                                  }}
                                  className="bg-transparent border-0 outline-none p-0 cursor-text focus:ring-1 focus:ring-blue-500 rounded"
                                />
                              </div>
                            )}

                            {/* 2. WHITEOUT ANNOTATION (ZERO BORDER, SEAMLESS REALISM) */}
                            {anno.type === 'whiteout' && (
                              <div
                                onMouseDown={(e) => {
                                  if (activeTool === 'select') {
                                    startDragAnnotation(e, pIdx, anno);
                                  }
                                }}
                                style={{
                                  backgroundColor: anno.color || '#ffffff',
                                  border: isSelected && activeTool === 'select' ? '1px dashed #3b82f6' : 'none',
                                  outline: 'none',
                                  boxShadow: 'none'
                                }}
                                className={`w-full h-full ${activeTool === 'select' ? 'cursor-move' : 'cursor-default'}`}
                                title="Content-Aware Erased Box (Zero borders)"
                              />
                            )}

                            {/* 3. HIGHLIGHT ANNOTATION */}
                            {anno.type === 'highlight' && (
                              <div
                                onMouseDown={(e) => startDragAnnotation(e, pIdx, anno)}
                                style={{
                                  backgroundColor: anno.color || '#fef08a',
                                  opacity: 0.45,
                                  border: isSelected && activeTool === 'select' ? '1px dashed #3b82f6' : 'none'
                                }}
                                className="w-full h-full cursor-move"
                              />
                            )}

                            {/* 4. SHAPE: RECTANGLE */}
                            {anno.type === 'shape_rect' && (
                              <div
                                onMouseDown={(e) => startDragAnnotation(e, pIdx, anno)}
                                style={{
                                  border: anno.shapeStyle === 'fill' ? 'none' : `${anno.strokeWidth || 2}px solid ${anno.strokeColor || '#2563eb'}`,
                                  backgroundColor: anno.shapeStyle === 'fill' ? (anno.fillColor || anno.color || '#2563eb') : 'transparent'
                                }}
                                className={`w-full h-full cursor-move ${isSelected && activeTool === 'select' ? 'ring-1 ring-blue-400' : ''}`}
                              />
                            )}

                            {/* 5. SHAPE: CIRCLE */}
                            {anno.type === 'shape_circle' && (
                              <div
                                onMouseDown={(e) => startDragAnnotation(e, pIdx, anno)}
                                style={{
                                  border: anno.shapeStyle === 'fill' ? 'none' : `${anno.strokeWidth || 2}px solid ${anno.strokeColor || '#2563eb'}`,
                                  backgroundColor: anno.shapeStyle === 'fill' ? (anno.fillColor || anno.color || '#2563eb') : 'transparent',
                                  borderRadius: '9999px'
                                }}
                                className={`w-full h-full cursor-move ${isSelected && activeTool === 'select' ? 'ring-1 ring-blue-400' : ''}`}
                              />
                            )}

                            {/* 6. SHAPE: LINE */}
                            {anno.type === 'shape_line' && (
                              <div
                                onMouseDown={(e) => startDragAnnotation(e, pIdx, anno)}
                                style={{
                                  width: '100%',
                                  height: `${anno.strokeWidth || 2}px`,
                                  backgroundColor: anno.strokeColor || anno.color || '#2563eb'
                                }}
                                className="cursor-move absolute top-1/2 left-0 -translate-y-1/2"
                              />
                            )}

                            {/* 7. SHAPE: ARROW */}
                            {anno.type === 'shape_arrow' && (
                              <div
                                onMouseDown={(e) => startDragAnnotation(e, pIdx, anno)}
                                className="w-full h-full cursor-move relative flex items-center"
                              >
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                                  <defs>
                                    <marker id={`arrowhead-${anno.id}`} markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                                      <polygon points="0 0, 6 3, 0 6" fill={anno.strokeColor || anno.color || '#2563eb'} />
                                    </marker>
                                  </defs>
                                  <line
                                    x1="2" y1="10" x2="92" y2="10"
                                    stroke={anno.strokeColor || anno.color || '#2563eb'}
                                    strokeWidth={anno.strokeWidth || 2}
                                    markerEnd={`url(#arrowhead-${anno.id})`}
                                  />
                                </svg>
                              </div>
                            )}

                            {/* 8. SYMBOL (Check / Cross) */}
                            {anno.type === 'symbol' && (
                              <div
                                onMouseDown={(e) => startDragAnnotation(e, pIdx, anno)}
                                style={{
                                  fontSize: `${(anno.fontSize || 22) * zoomLevel}px`,
                                  color: anno.color,
                                  fontWeight: '900'
                                }}
                                className="cursor-move select-none leading-none"
                              >
                                {anno.symbol}
                              </div>
                            )}

                            {/* 9. SIGNATURE & IMAGE */}
                            {(anno.type === 'signature' || anno.type === 'image') && anno.dataUrl && (
                              <div
                                onMouseDown={(e) => startDragAnnotation(e, pIdx, anno)}
                                className={`w-full h-full cursor-move ${isSelected && activeTool === 'select' ? 'ring-2 ring-blue-500 rounded' : ''}`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={anno.dataUrl}
                                  alt="Signature or Uploaded Image"
                                  className="w-full h-full object-contain pointer-events-none select-none"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Page Number Indicator */}
                    <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono select-none">
                      Page {pIdx + 1} of {pages.length}
                    </div>
                  </div>
                );
              })}
            </section>

          </div>
        </div>
      )}

      {/* SIGNATURE MODAL DIALOG WITH DRAW, TYPE, AND UPLOAD */}
      {showSigModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-400" /> Digital Signature Creator
              </h3>
              <button
                onClick={() => setShowSigModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <CrossIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Signature Mode Tabs (Draw, Type, Upload) */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1 rounded-xl mb-6 text-xs font-bold">
              <button
                onClick={() => setSigMode('draw')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  sigMode === 'draw' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                ✍️ Draw
              </button>
              <button
                onClick={() => setSigMode('type')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  sigMode === 'type' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⌨️ Type Cursive
              </button>
              <button
                onClick={() => setSigMode('upload')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  sigMode === 'upload' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                📁 Upload Photo
              </button>
            </div>

            {/* Ink Color Selector (for Draw and Type) */}
            {sigMode !== 'upload' && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-400">Signature Ink Color:</span>
                <div className="flex gap-2">
                  {['#000000', '#1e3a8a', '#dc2626'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSigColor(color)}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer ${sigColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 1. DRAW MODE */}
            {sigMode === 'draw' && (
              <div className="space-y-3">
                <div className="relative border-2 border-dashed border-slate-600 rounded-2xl bg-white overflow-hidden">
                  <canvas
                    ref={sigCanvasRef}
                    width={440}
                    height={160}
                    className="w-full h-36 cursor-crosshair"
                  />
                  <button
                    onClick={clearSigCanvas}
                    className="absolute top-2 right-2 text-xs text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                <p className="text-xs text-slate-400 text-center">Draw your signature using mouse, trackpad, or finger.</p>
              </div>
            )}

            {/* 2. TYPE MODE (With Dancing Script Calligraphy) */}
            {sigMode === 'type' && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={typeSigText}
                  onChange={(e) => setTypeSigText(e.target.value)}
                  placeholder="Type your full name..."
                  className="w-full bg-slate-900 border border-slate-600 px-4 py-3 rounded-xl text-base text-white focus:outline-none focus:border-blue-500"
                />

                {typeSigText && (
                  <div className="p-6 bg-white rounded-2xl text-center shadow-inner">
                    <span
                      style={{ color: sigColor, fontFamily: "'Dancing Script', cursive" }}
                      className="text-4xl font-bold italic"
                    >
                      {typeSigText}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 3. UPLOAD MODE (With Auto Transparent Background) */}
            {sigMode === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={sigFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSignatureUpload(e.target.files[0]);
                    }
                  }}
                />

                {!uploadedSigDataUrl ? (
                  <div
                    onClick={() => sigFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm font-bold text-white mb-1">Upload Signature Image</div>
                    <div className="text-xs text-slate-400">PNG, JPG or photo of your handwritten signature on paper</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative p-4 bg-white/95 rounded-2xl border border-slate-600 flex items-center justify-center min-h-[120px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={uploadedSigDataUrl}
                        alt="Uploaded Signature"
                        className="max-h-28 max-w-full object-contain"
                      />
                      <button
                        onClick={() => {
                          setUploadedSigDataUrl(null);
                          if (sigFileInputRef.current) sigFileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 p-1 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-md text-xs cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 px-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={removeBg}
                          onChange={(e) => setRemoveBg(e.target.checked)}
                          className="rounded text-blue-600 accent-blue-600"
                        />
                        <span>Make Paper Background Transparent</span>
                      </label>
                      <button
                        onClick={() => sigFileInputRef.current?.click()}
                        className="text-blue-400 hover:underline cursor-pointer"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
              <button
                onClick={() => setShowSigModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={applySignature}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Place Signature on Page
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer on landing */}
      {pages.length === 0 && <Footer />}
    </div>
  );
}
