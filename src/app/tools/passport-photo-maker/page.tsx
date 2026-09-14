'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  COUNTRY_PRESETS, 
  PAPER_PRESETS, 
  STANDARD_BG_COLORS, 
  SIGNATURE_PRESETS,
  CountryPreset, 
  PaperPreset, 
  SignaturePreset,
  mmToPx 
} from './presets';
import { SUIT_TEMPLATES, SuitTemplate } from './suits';
import { SAMPLE_PORTRAIT_DATA_URI } from './sampleImage';
import { PDFDocument, rgb } from 'pdf-lib';
import {
  Upload, Sparkles, ZoomIn, ZoomOut, RotateCw, RotateCcw,
  FlipHorizontal, Download, Printer, Eye, EyeOff, Sliders,
  User, Palette, Grid, Scissors, Check, Undo, RefreshCw,
  FileDown, ChevronRight, HelpCircle, ShieldCheck, Camera,
  Move, Maximize2, AlertCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Calendar, PenTool, Type as TypeIcon, Image as ImageIcon, CheckCircle, Info, Shield, Crop
} from 'lucide-react';

export default function PassportPhotoMakerPage() {
  // --- MODE SWITCHER: Photo Maker vs Signature Resizer ---
  const [toolMode, setToolMode] = useState<'photo' | 'signature'>('photo');

  // --- STATE: Image & Processing ---
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // --- Active Tab ---
  const [activeTab, setActiveTab] = useState<'preset' | 'namedate' | 'bg' | 'suit' | 'adjust' | 'print'>('preset');

  // --- Preset & Crop State ---
  const [selectedPreset, setSelectedPreset] = useState<CountryPreset>(COUNTRY_PRESETS[0]);
  const [customWidthMm, setCustomWidthMm] = useState<number>(35);
  const [customHeightMm, setCustomHeightMm] = useState<number>(45);
  const [customDpi, setCustomDpi] = useState<number>(300);
  const [isCustomPreset, setIsCustomPreset] = useState(false);

  // --- Name & Date of Photo (DOP / DOB) Overlay State ---
  const [addNameDate, setAddNameDate] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('');
  const [dopDate, setDopDate] = useState<string>(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  });
  const [dopPrefix, setDopPrefix] = useState<string>('DOP: ');

  // --- Studio Border State ---
  const [addBorder, setAddBorder] = useState<boolean>(false);
  const [borderWidth, setBorderWidth] = useState<number>(2); // 1 to 4px
  const [borderColor, setBorderColor] = useState<string>('#000000');

  // --- Strict Target File Size (KB Limiter) ---
  const [targetKbMode, setTargetKbMode] = useState<'hd' | 'govt-50' | 'govt-20' | 'under-100' | 'custom'>('hd');
  const [customTargetKb, setCustomTargetKb] = useState<number>(50);
  const [estimatedKb, setEstimatedKb] = useState<number | null>(null);

  // --- SIGNATURE RESIZER STATE ---
  const [sigSrc, setSigSrc] = useState<string | null>(null);
  const [sigLoaded, setSigLoaded] = useState(false);
  const [sigPreset, setSigPreset] = useState<SignaturePreset>(SIGNATURE_PRESETS[0]);
  const [sigAutoWhiten, setSigAutoWhiten] = useState<boolean>(true);
  const [sigContrast, setSigContrast] = useState<number>(20);
  const [sigZoom, setSigZoom] = useState<number>(1);
  const [sigPan, setSigPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [sigEstimatedKb, setSigEstimatedKb] = useState<number | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigHiddenImgRef = useRef<HTMLImageElement | null>(null);
  const sigFileInputRef = useRef<HTMLInputElement>(null);

  // Pan & Zoom
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [showBiometricGuide, setShowBiometricGuide] = useState<boolean>(true);
  const [showRuleOfThirds, setShowRuleOfThirds] = useState<boolean>(false);

  // --- Background State ---
  const [bgColor, setBgColor] = useState<string>('transparent');
  const [bgMode, setBgMode] = useState<'original' | 'replace'>('original');
  const [detectedPhotoBg, setDetectedPhotoBg] = useState<string | null>(null);
  const [enableBgReplace, setEnableBgReplace] = useState<boolean>(false);
  const [bgTolerance, setBgTolerance] = useState<number>(28);
  const [bgFeather, setBgFeather] = useState<number>(2);

  // --- SHARDA TOOL ONE-CLICK GRID & VIEW STATE ---
  const [sheetLayout, setSheetLayout] = useState<'single' | '4' | '6' | '8' | '12' | '16' | '32' | 'combo'>('single');
  const [viewMode, setViewMode] = useState<'single' | 'sheet'>('single');
  const sheetCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- Eraser / Touch-up Brush State ---
  const [brushMode, setBrushMode] = useState<'none' | 'erase' | 'restore'>('none');
  const [brushSize, setBrushSize] = useState<number>(25);

  // --- Suit State ---
  const [selectedSuit, setSelectedSuit] = useState<SuitTemplate | null>(null);
  const [suitScale, setSuitScale] = useState<number>(1);
  const [suitPos, setSuitPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [suitFlip, setSuitFlip] = useState<boolean>(false);
  const [suitGenderTab, setSuitGenderTab] = useState<'men' | 'women'>('men');

  // --- Adjustments State ---
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [sharpness, setSharpness] = useState<number>(0);
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);

  // --- Print Sheet State ---
  const [selectedPaper, setSelectedPaper] = useState<PaperPreset>(PAPER_PRESETS[1]); // 4x6 default
  const [showCutLines, setShowCutLines] = useState<boolean>(true);
  const [showCropMarks, setShowCropMarks] = useState<boolean>(true);
  const [photoSpacingMm, setPhotoSpacingMm] = useState<number>(2);

  // --- UI & Modals ---
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showSheetModal, setShowSheetModal] = useState<boolean>(false);
  const [sheetPreviewUrl, setSheetPreviewUrl] = useState<string | null>(null);
  const [sheetStats, setSheetStats] = useState<{ count: number; cols: number; rows: number }>({ count: 0, cols: 0, rows: 0 });

  // --- REFS ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenImageRef = useRef<HTMLImageElement | null>(null);
  const suitImageRef = useRef<HTMLImageElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null); // for eraser brush strokes
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const isSuitDraggingRef = useRef(false);
  const suitDragStartRef = useRef({ x: 0, y: 0 });

  // Current photo aspect ratio & pixel dimensions at 300 DPI
  const targetWidthPx = isCustomPreset ? mmToPx(customWidthMm, customDpi) : selectedPreset.widthPx;
  const targetHeightPx = isCustomPreset ? mmToPx(customHeightMm, customDpi) : selectedPreset.heightPx;
  const targetAspectRatio = targetWidthPx / targetHeightPx;

  // ---------------------------------------------------------------------------
  // Helper: Iterative JPEG Target KB Compressor (Guarantees strict 20-50KB / 10-20KB)
  // ---------------------------------------------------------------------------
  const canvasToTargetKbBlob = async (
    canvas: HTMLCanvasElement,
    targetMinKb: number,
    targetMaxKb: number
  ): Promise<{ blob: Blob; sizeKb: number }> => {
    if (targetMaxKb <= 0 || targetMaxKb >= 1000) {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve({ blob: blob!, sizeKb: Math.round((blob?.size || 0) / 1024) });
        }, 'image/jpeg', 0.95);
      });
    }

    let low = 0.05;
    let high = 0.96;
    let bestBlob: Blob | null = null;
    let bestSize = 0;

    for (let step = 0; step < 7; step++) {
      const mid = (low + high) / 2;
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', mid));
      if (!blob) break;
      const kb = blob.size / 1024;
      bestBlob = blob;
      bestSize = Math.round(kb);

      if (kb >= targetMinKb && kb <= targetMaxKb) {
        return { blob, sizeKb: Math.round(kb) };
      }
      if (kb > targetMaxKb) {
        high = mid;
      } else {
        low = mid;
      }
    }

    // If still exceeds target max KB, scale down dimensions slightly to guarantee compliance
    if (bestBlob && bestSize > targetMaxKb) {
      const scale = Math.sqrt(targetMaxKb / bestSize);
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = Math.max(80, Math.round(canvas.width * scale));
      scaledCanvas.height = Math.max(80, Math.round(canvas.height * scale));
      const sCtx = scaledCanvas.getContext('2d');
      if (sCtx) {
        sCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
        const scaledBlob: Blob | null = await new Promise((res) => scaledCanvas.toBlob(res, 'image/jpeg', 0.85));
        if (scaledBlob) {
          return { blob: scaledBlob, sizeKb: Math.round(scaledBlob.size / 1024) };
        }
      }
    }

    return { blob: bestBlob!, sizeKb: bestSize };
  };

  // ---------------------------------------------------------------------------
  // Helper: Name & Date of Photo (DOP / DOB) Overlay Renderer
  // ---------------------------------------------------------------------------
  const drawNameDateBanner = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    name: string,
    date: string,
    prefix: string
  ) => {
    if (!name && !date) return;
    const bannerHeight = Math.round(h * 0.17); // 17% height at bottom
    const bannerY = h - bannerHeight;

    ctx.save();
    // Crisp white background banner
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, bannerY, w, bannerHeight);

    // Dark hairline border separating photo from banner
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = Math.max(1, Math.round(w * 0.0035));
    ctx.beginPath();
    ctx.moveTo(0, bannerY);
    ctx.lineTo(w, bannerY);
    ctx.stroke();

    // Centered Typography
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontNameSize = Math.max(11, Math.round(bannerHeight * 0.38));
    const fontDateSize = Math.max(10, Math.round(bannerHeight * 0.30));

    if (name && date) {
      ctx.font = `bold ${fontNameSize}px 'Arial', 'Inter', sans-serif`;
      ctx.fillText(name.toUpperCase(), w / 2, bannerY + bannerHeight * 0.34);

      ctx.font = `bold ${fontDateSize}px 'Arial', 'Inter', sans-serif`;
      ctx.fillText(`${prefix}${date}`, w / 2, bannerY + bannerHeight * 0.74);
    } else if (name) {
      ctx.font = `bold ${fontNameSize * 1.15}px 'Arial', 'Inter', sans-serif`;
      ctx.fillText(name.toUpperCase(), w / 2, bannerY + bannerHeight * 0.5);
    } else if (date) {
      ctx.font = `bold ${fontDateSize * 1.15}px 'Arial', 'Inter', sans-serif`;
      ctx.fillText(`${prefix}${date}`, w / 2, bannerY + bannerHeight * 0.5);
    }

    ctx.restore();
  };

  // ---------------------------------------------------------------------------
  // Helper: Studio Perimeter Border (1px to 4px)
  // ---------------------------------------------------------------------------
  const drawStudioBorder = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    thickness: number,
    color: string
  ) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    const half = thickness / 2;
    ctx.strokeRect(half, half, w - thickness, h - thickness);
    ctx.restore();
  };

  // ---------------------------------------------------------------------------
  // Signature Resizer Canvas Renderer
  // ---------------------------------------------------------------------------
  const renderSignatureCanvas = useCallback(() => {
    const canvas = sigCanvasRef.current;
    const img = sigHiddenImgRef.current;
    if (!canvas || !img || !sigLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = sigPreset.widthPx;
    const h = sigPreset.heightPx;
    canvas.width = w;
    canvas.height = h;

    // Fill clean white paper background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Draw transformed signature
    ctx.save();
    ctx.translate(w / 2 + sigPan.x, h / 2 + sigPan.y);
    const baseScale = Math.min(w / img.width, h / img.height);
    const rW = img.width * baseScale * sigZoom;
    const rH = img.height * baseScale * sigZoom;
    ctx.drawImage(img, -rW / 2, -rH / 2, rW, rH);
    ctx.restore();

    // Auto Whiten Paper Background & Ink Sharpener
    if (sigAutoWhiten) {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const threshold = 175 + (sigContrast * 0.5);

      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (lum > threshold) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          const dark = Math.max(0, lum - sigContrast * 1.4);
          data[i] = dark;
          data[i + 1] = dark;
          data[i + 2] = dark;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }, [sigLoaded, sigPreset, sigPan, sigZoom, sigAutoWhiten, sigContrast]);

  useEffect(() => {
    if (toolMode === 'signature') {
      renderSignatureCanvas();
    }
  }, [toolMode, renderSignatureCanvas]);

  // Load Signature Handler
  const handleLoadSignature = (src: string) => {
    setIsProcessing(true);
    setStatusMessage('Loading signature...');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      sigHiddenImgRef.current = img;
      setSigSrc(src);
      setSigLoaded(true);
      setSigZoom(1);
      setSigPan({ x: 0, y: 0 });
      setIsProcessing(false);
    };
    img.onerror = () => {
      alert('Could not load signature. Please upload a clear photo or scan.');
      setIsProcessing(false);
    };
    img.src = src;
  };

  const handleDownloadSignature = async () => {
    if (!sigCanvasRef.current || !sigLoaded) return;
    setIsProcessing(true);
    setStatusMessage(`Compressing signature (${sigPreset.minKb}-${sigPreset.maxKb} KB)...`);
    try {
      const { blob, sizeKb } = await canvasToTargetKbBlob(
        sigCanvasRef.current,
        sigPreset.minKb,
        sigPreset.maxKb
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `Official-Signature-${sigPreset.id}-${sigPreset.widthPx}x${sigPreset.heightPx}.jpg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setSigEstimatedKb(sizeKb);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper: Auto-detect dominant background color from photo corners
  const detectImageBgColor = (img: HTMLImageElement): string => {
    try {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) return '#3B82F6';
      ctx.drawImage(img, 0, 0);

      const cornerPixels = [
        ctx.getImageData(Math.min(10, img.width - 1), Math.min(10, img.height - 1), 1, 1).data,
        ctx.getImageData(Math.max(0, img.width - 15), Math.min(10, img.height - 1), 1, 1).data,
        ctx.getImageData(Math.min(10, img.width - 1), Math.min(35, img.height - 1), 1, 1).data,
        ctx.getImageData(Math.max(0, img.width - 15), Math.min(35, img.height - 1), 1, 1).data
      ];
      let rSum = 0, gSum = 0, bSum = 0;
      for (const p of cornerPixels) {
        rSum += p[0];
        gSum += p[1];
        bSum += p[2];
      }
      const avgR = Math.round(rSum / cornerPixels.length);
      const avgG = Math.round(gSum / cornerPixels.length);
      const avgB = Math.round(bSum / cornerPixels.length);
      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      return `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;
    } catch {
      return '#3B82F6';
    }
  };

  // ---------------------------------------------------------------------------
  // Load Image Handler
  // ---------------------------------------------------------------------------
  const handleLoadImage = (src: string) => {
    setIsProcessing(true);
    setStatusMessage('Loading portrait...');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      hiddenImageRef.current = img;
      setImageSize({ width: img.width, height: img.height });
      setImageSrc(src);
      setImageLoaded(true);

      // Reset transforms to fit nicely in crop viewport
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setFlipH(false);
      setBrightness(0);
      setContrast(0);
      setSaturation(0);
      setSharpness(0);
      setIsGrayscale(false);
      setSelectedSuit(null);

      // Auto-detect background color from photo corners & match background
      const detected = detectImageBgColor(img);
      setDetectedPhotoBg(detected);
      setBgColor('transparent');
      setBgMode('original');
      setEnableBgReplace(false);

      // Initialize mask canvas for eraser
      const mask = document.createElement('canvas');
      mask.width = img.width;
      mask.height = img.height;
      const maskCtx = mask.getContext('2d');
      if (maskCtx) {
        maskCtx.fillStyle = '#FFFFFF';
        maskCtx.fillRect(0, 0, img.width, img.height);
      }
      maskCanvasRef.current = mask;

      setIsProcessing(false);
    };
    img.onerror = () => {
      alert('Could not load the image. Please select a valid JPG or PNG photo.');
      setIsProcessing(false);
    };
    img.src = src;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        handleLoadImage(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Drag & drop on page / upload box
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) handleLoadImage(evt.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Paste from clipboard listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              if (evt.target?.result) handleLoadImage(evt.target.result as string);
            };
            reader.readAsDataURL(blob);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Pre-load suit image when selected
  useEffect(() => {
    if (selectedSuit) {
      const sImg = new Image();
      sImg.crossOrigin = 'anonymous';
      sImg.onload = () => {
        suitImageRef.current = sImg;
        renderCanvas();
      };
      sImg.src = selectedSuit.svgDataUri;
    } else {
      suitImageRef.current = null;
      renderCanvas();
    }
  }, [selectedSuit]);

  // ---------------------------------------------------------------------------
  // Canvas Rendering Engine
  // ---------------------------------------------------------------------------
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = hiddenImageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed display canvas resolution based on target aspect ratio
    const displayHeight = 560;
    const displayWidth = Math.round(displayHeight * targetAspectRatio);
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // 1. Draw Background
    const activeFillColor = bgColor !== 'transparent' ? bgColor : (detectedPhotoBg || '#FFFFFF');
    ctx.fillStyle = activeFillColor;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // 2. Offscreen rendering for image adjustments & chroma background replacement
    const offCanvas = document.createElement('canvas');
    offCanvas.width = displayWidth;
    offCanvas.height = displayHeight;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    offCtx.save();
    // Center point for transformations
    offCtx.translate(displayWidth / 2 + pan.x, displayHeight / 2 + pan.y);
    offCtx.rotate((rotation * Math.PI) / 180);
    offCtx.scale(flipH ? -1 : 1, 1);

    // Scaling to cover crop viewport nicely
    const baseScale = Math.max(displayWidth / img.width, displayHeight / img.height);
    const renderW = img.width * baseScale * zoom;
    const renderH = img.height * baseScale * zoom;

    // Filters (Brightness, Contrast, Saturation, Grayscale)
    const filters: string[] = [];
    if (brightness !== 0) filters.push(`brightness(${100 + brightness}%)`);
    if (contrast !== 0) filters.push(`contrast(${100 + contrast}%)`);
    if (saturation !== 0) filters.push(`saturate(${100 + saturation}%)`);
    if (isGrayscale) filters.push('grayscale(100%)');

    if (filters.length > 0) {
      offCtx.filter = filters.join(' ');
    }

    offCtx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
    offCtx.restore();

    // 3. Intelligent Background Color Replacement (Client-side chroma keying)
    if (enableBgReplace && bgColor !== 'transparent') {
      const imgData = offCtx.getImageData(0, 0, displayWidth, displayHeight);
      const data = imgData.data;

      // Sample top-left and top-right corners for dominant background color
      const sampleCorners = [
        { r: data[0], g: data[1], b: data[2] },
        { r: data[(displayWidth - 1) * 4], g: data[(displayWidth - 1) * 4 + 1], b: data[(displayWidth - 1) * 4 + 2] },
        { r: data[40 * 4], g: data[40 * 4 + 1], b: data[40 * 4 + 2] }
      ];
      const avgBg = {
        r: Math.round((sampleCorners[0].r + sampleCorners[1].r + sampleCorners[2].r) / 3),
        g: Math.round((sampleCorners[0].g + sampleCorners[1].g + sampleCorners[2].g) / 3),
        b: Math.round((sampleCorners[0].b + sampleCorners[1].b + sampleCorners[2].b) / 3)
      };

      const targetBgRgb = hexToRgb(bgColor);
      const tolSq = bgTolerance * bgTolerance * 3;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance from sampled background
        const distSq = (r - avgBg.r) ** 2 + (g - avgBg.g) ** 2 + (b - avgBg.b) ** 2;

        if (distSq < tolSq) {
          // Inside tolerance: replace with target passport bg color
          const blendRatio = Math.min(1, Math.sqrt(distSq / tolSq));
          if (bgFeather > 0 && blendRatio > 0.7) {
            // Feathered soft edge for hair
            const alpha = (1 - blendRatio) * (1 / 0.3);
            data[i] = Math.round(data[i] * (1 - alpha) + targetBgRgb.r * alpha);
            data[i + 1] = Math.round(data[i + 1] * (1 - alpha) + targetBgRgb.g * alpha);
            data[i + 2] = Math.round(data[i + 2] * (1 - alpha) + targetBgRgb.b * alpha);
          } else {
            data[i] = targetBgRgb.r;
            data[i + 1] = targetBgRgb.g;
            data[i + 2] = targetBgRgb.b;
          }
        }
      }
      offCtx.putImageData(imgData, 0, 0);
    }

    // 4. Sharpness filter (3x3 convolution) if enabled
    if (sharpness > 0) {
      applySharpnessFilter(offCtx, displayWidth, displayHeight, sharpness);
    }

    // Draw the composite image onto canvas
    ctx.drawImage(offCanvas, 0, 0);

    // 5. Draw Formal Suit Overlay if selected
    if (suitImageRef.current && selectedSuit) {
      ctx.save();
      const sImg = suitImageRef.current;
      const baseSuitW = displayWidth * 1.05;
      const baseSuitH = (baseSuitW * sImg.height) / sImg.width;
      const suitW = baseSuitW * suitScale;
      const suitH = baseSuitH * suitScale;

      const suitCenterX = displayWidth / 2 + suitPos.x;
      const suitCenterY = displayHeight * 0.72 + suitPos.y;

      ctx.translate(suitCenterX, suitCenterY);
      if (suitFlip) ctx.scale(-1, 1);
      ctx.drawImage(sImg, -suitW / 2, -suitH / 2, suitW, suitH);
      ctx.restore();
    }

    // 6. Name & Date of Photo (DOP / DOB) Overlay
    if (addNameDate) {
      drawNameDateBanner(ctx, displayWidth, displayHeight, candidateName, dopDate, dopPrefix);
    }

    // 7. Studio Perimeter Border (1-4px)
    if (addBorder) {
      drawStudioBorder(ctx, displayWidth, displayHeight, borderWidth, borderColor);
    }

    // 8. Biometric Passport Head Guide Overlay
    if (showBiometricGuide) {
      drawBiometricGuide(ctx, displayWidth, displayHeight, selectedPreset.faceHeightPercent);
    }

    // 9. Rule of Thirds Grid
    if (showRuleOfThirds) {
      drawRuleOfThirds(ctx, displayWidth, displayHeight);
    }
  }, [
    imageLoaded,
    targetAspectRatio,
    zoom,
    pan,
    rotation,
    flipH,
    bgColor,
    detectedPhotoBg,
    enableBgReplace,
    bgTolerance,
    bgFeather,
    sharpness,
    brightness,
    contrast,
    saturation,
    isGrayscale,
    selectedSuit,
    suitScale,
    suitPos,
    suitFlip,
    addNameDate,
    candidateName,
    dopDate,
    dopPrefix,
    addBorder,
    borderWidth,
    borderColor,
    showBiometricGuide,
    showRuleOfThirds,
    selectedPreset.faceHeightPercent
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // ---------------------------------------------------------------------------
  // Helper: Biometric Face Oval Guide
  // ---------------------------------------------------------------------------
  const drawBiometricGuide = (ctx: CanvasRenderingContext2D, w: number, h: number, headPercent: number) => {
    ctx.save();
    const centerX = w / 2;
    const centerY = h * 0.44;

    const ovalRadiusX = w * 0.28;
    const ovalRadiusY = h * (headPercent / 200);

    // Outer Head Oval (Dashed Blue)
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, ovalRadiusX, ovalRadiusY, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Crown / Hairline Guide (Top of head)
    const crownY = centerY - ovalRadiusY;
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(w * 0.15, crownY);
    ctx.lineTo(w * 0.85, crownY);
    ctx.stroke();

    // Eye Level Guide
    const eyeY = centerY - ovalRadiusY * 0.15;
    ctx.strokeStyle = '#10B981';
    ctx.beginPath();
    ctx.moveTo(w * 0.18, eyeY);
    ctx.lineTo(w * 0.82, eyeY);
    ctx.stroke();

    // Chin Guide
    const chinY = centerY + ovalRadiusY;
    ctx.strokeStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(w * 0.2, chinY);
    ctx.lineTo(w * 0.8, chinY);
    ctx.stroke();

    // Reset line dash for labels
    ctx.setLineDash([]);
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = '#EF4444';
    ctx.fillText('CROWN (Top)', w * 0.04, crownY - 4);
    ctx.fillStyle = '#10B981';
    ctx.fillText('EYE LEVEL', w * 0.04, eyeY - 4);
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('CHIN LINE', w * 0.04, chinY + 12);

    // Shoulder arch guide
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX, h * 0.95, w * 0.48, h * 0.22, 0, Math.PI, 0, false);
    ctx.stroke();

    ctx.restore();
  };

  // Rule of thirds grid
  const drawRuleOfThirds = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(w / 3, 0);
    ctx.lineTo(w / 3, h);
    ctx.moveTo((2 * w) / 3, 0);
    ctx.lineTo((2 * w) / 3, h);

    ctx.moveTo(0, h / 3);
    ctx.lineTo(w, h / 3);
    ctx.moveTo(0, (2 * h) / 3);
    ctx.lineTo(w, (2 * h) / 3);
    ctx.stroke();

    ctx.restore();
  };

  // Sharpness Convolution Kernel
  const applySharpnessFilter = (ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) => {
    const imgData = ctx.getImageData(0, 0, w, h);
    const src = imgData.data;
    const output = ctx.createImageData(w, h);
    const dst = output.data;

    const factor = (amount / 100) * 0.75;
    // 3x3 sharpen kernel: [0, -factor, 0, -factor, 1 + 4*factor, -factor, 0, -factor, 0]
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) {
          const up = ((y - 1) * w + x) * 4 + c;
          const down = ((y + 1) * w + x) * 4 + c;
          const left = (y * w + (x - 1)) * 4 + c;
          const right = (y * w + (x + 1)) * 4 + c;
          const val = src[idx + c] * (1 + 4 * factor) - (src[up] + src[down] + src[left] + src[right]) * factor;
          dst[idx + c] = Math.min(255, Math.max(0, val));
        }
        dst[idx + 3] = src[idx + 3];
      }
    }
    ctx.putImageData(output, 0, 0);
  };

  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
    const num = parseInt(clean, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };

  // ---------------------------------------------------------------------------
  // Drag / Pan & Suit Nudge Interactions
  // ---------------------------------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTab === 'suit' && selectedSuit) {
      isSuitDraggingRef.current = true;
      suitDragStartRef.current = { x: e.clientX - suitPos.x, y: e.clientY - suitPos.y };
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSuitDraggingRef.current) {
      setSuitPos({
        x: e.clientX - suitDragStartRef.current.x,
        y: e.clientY - suitDragStartRef.current.y
      });
    } else if (isDraggingRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isSuitDraggingRef.current = false;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (activeTab === 'suit' && selectedSuit) {
        isSuitDraggingRef.current = true;
        suitDragStartRef.current = { x: touch.clientX - suitPos.x, y: touch.clientY - suitPos.y };
      } else {
        isDraggingRef.current = true;
        dragStartRef.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (isSuitDraggingRef.current) {
        setSuitPos({
          x: touch.clientX - suitDragStartRef.current.x,
          y: touch.clientY - suitDragStartRef.current.y
        });
      } else if (isDraggingRef.current) {
        setPan({
          x: touch.clientX - dragStartRef.current.x,
          y: touch.clientY - dragStartRef.current.y
        });
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (activeTab === 'suit' && selectedSuit) {
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      setSuitScale((s) => Math.max(0.4, Math.min(2.5, s + delta)));
    } else {
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      setZoom((z) => Math.max(0.5, Math.min(3.5, z + delta)));
    }
  };

  // ---------------------------------------------------------------------------
  // 1-Click Studio Auto-Enhance
  // ---------------------------------------------------------------------------
  const handleAutoEnhance = () => {
    setBrightness(6);
    setContrast(12);
    setSaturation(8);
    setSharpness(35);
  };

  const handleResetAdjustments = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setSharpness(0);
    setIsGrayscale(false);
  };

  // ---------------------------------------------------------------------------
  // High-Resolution Single Photo Generation (300 DPI)
  // ---------------------------------------------------------------------------
  const generateHighResSingleCanvas = (): HTMLCanvasElement => {
    const singleCanvas = document.createElement('canvas');
    singleCanvas.width = targetWidthPx;
    singleCanvas.height = targetHeightPx;
    const ctx = singleCanvas.getContext('2d');
    if (!ctx || !hiddenImageRef.current) return singleCanvas;

    const img = hiddenImageRef.current;

    // Background
    const activeFillColor = bgColor !== 'transparent' ? bgColor : (detectedPhotoBg || '#FFFFFF');
    ctx.fillStyle = activeFillColor;
    ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);

    // Scaling factor from display canvas to HD target canvas
    const displayHeight = 560;
    const scaleRatio = targetHeightPx / displayHeight;

    ctx.save();
    ctx.translate(targetWidthPx / 2 + pan.x * scaleRatio, targetHeightPx / 2 + pan.y * scaleRatio);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, 1);

    const baseScale = Math.max(targetWidthPx / img.width, targetHeightPx / img.height);
    const renderW = img.width * baseScale * zoom;
    const renderH = img.height * baseScale * zoom;

    const filters: string[] = [];
    if (brightness !== 0) filters.push(`brightness(${100 + brightness}%)`);
    if (contrast !== 0) filters.push(`contrast(${100 + contrast}%)`);
    if (saturation !== 0) filters.push(`saturate(${100 + saturation}%)`);
    if (isGrayscale) filters.push('grayscale(100%)');
    if (filters.length > 0) ctx.filter = filters.join(' ');

    ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
    ctx.restore();

    // Chroma background replace on HD canvas
    if (enableBgReplace && bgColor !== 'transparent') {
      const imgData = ctx.getImageData(0, 0, targetWidthPx, targetHeightPx);
      const data = imgData.data;
      const targetBgRgb = hexToRgb(bgColor);
      const tolSq = bgTolerance * bgTolerance * 3;

      const sampleCorners = [
        { r: data[0], g: data[1], b: data[2] },
        { r: data[(targetWidthPx - 1) * 4], g: data[(targetWidthPx - 1) * 4 + 1], b: data[(targetWidthPx - 1) * 4 + 2] },
        { r: data[40 * 4], g: data[40 * 4 + 1], b: data[40 * 4 + 2] }
      ];
      const avgBg = {
        r: Math.round((sampleCorners[0].r + sampleCorners[1].r + sampleCorners[2].r) / 3),
        g: Math.round((sampleCorners[0].g + sampleCorners[1].g + sampleCorners[2].g) / 3),
        b: Math.round((sampleCorners[0].b + sampleCorners[1].b + sampleCorners[2].b) / 3)
      };

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const distSq = (r - avgBg.r) ** 2 + (g - avgBg.g) ** 2 + (b - avgBg.b) ** 2;
        if (distSq < tolSq) {
          data[i] = targetBgRgb.r;
          data[i + 1] = targetBgRgb.g;
          data[i + 2] = targetBgRgb.b;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    if (sharpness > 0) {
      applySharpnessFilter(ctx, targetWidthPx, targetHeightPx, sharpness);
    }

    // Formal Suit overlay on HD canvas
    if (suitImageRef.current && selectedSuit) {
      ctx.save();
      const sImg = suitImageRef.current;
      const baseSuitW = targetWidthPx * 1.05;
      const baseSuitH = (baseSuitW * sImg.height) / sImg.width;
      const suitW = baseSuitW * suitScale;
      const suitH = baseSuitH * suitScale;

      const suitCenterX = targetWidthPx / 2 + suitPos.x * scaleRatio;
      const suitCenterY = targetHeightPx * 0.72 + suitPos.y * scaleRatio;

      ctx.translate(suitCenterX, suitCenterY);
      if (suitFlip) ctx.scale(-1, 1);
      ctx.drawImage(sImg, -suitW / 2, -suitH / 2, suitW, suitH);
      ctx.restore();
    }

    // Name & Date of Photo on HD canvas
    if (addNameDate) {
      drawNameDateBanner(ctx, targetWidthPx, targetHeightPx, candidateName, dopDate, dopPrefix);
    }

    // Studio Border on HD canvas (scaled with DPI)
    if (addBorder) {
      const hdBorderWidth = Math.max(1, Math.round(borderWidth * scaleRatio));
      drawStudioBorder(ctx, targetWidthPx, targetHeightPx, hdBorderWidth, borderColor);
    }

    return singleCanvas;
  };

  // Download Single Photo HD or with Strict Target KB Limiter
  const handleDownloadSingle = async (format: 'png' | 'jpeg') => {
    if (!imageLoaded) return;
    const singleCanvas = generateHighResSingleCanvas();
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    const filename = `Passport-Photo-${selectedPreset.country.replace(/\s+/g, '-')}-${targetWidthPx}x${targetHeightPx}.${ext}`;

    if (format === 'jpeg' && targetKbMode !== 'hd') {
      let minKb = 20;
      let maxKb = 50;
      if (targetKbMode === 'govt-20') { minKb = 10; maxKb = 20; }
      else if (targetKbMode === 'under-100') { minKb = 40; maxKb = 100; }
      else if (targetKbMode === 'custom') { minKb = Math.max(10, customTargetKb - 10); maxKb = customTargetKb; }

      setIsProcessing(true);
      setStatusMessage(`Compressing to ${minKb}-${maxKb} KB...`);
      try {
        const { blob, sizeKb } = await canvasToTargetKbBlob(singleCanvas, minKb, maxKb);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setEstimatedKb(sizeKb);
      } finally {
        setIsProcessing(false);
      }
    } else {
      const link = document.createElement('a');
      link.download = filename;
      link.href = singleCanvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.98);
      link.click();
    }
  };

  // ---------------------------------------------------------------------------
  // Frame Fit & Positioning Helpers
  // ---------------------------------------------------------------------------
  const handleAutoFillFrame = () => {
    setZoom(1.38);
    setPan({ x: 0, y: 18 });
  };

  const handleResetFrame = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  };

  // ---------------------------------------------------------------------------
  // Print Sheet Generator (A4, 4x6", 5x7", 4x6 Combo Cyber Cafe Special)
  // ---------------------------------------------------------------------------
  const generateSheetCanvas = (): { canvas: HTMLCanvasElement; count: number; cols: number; rows: number } => {
    const single = generateHighResSingleCanvas();
    const sheet = document.createElement('canvas');
    const ctx = sheet.getContext('2d');
    if (!ctx) return { canvas: sheet, count: 0, cols: 0, rows: 0 };

    if (sheetLayout === 'single' || selectedPaper.id === 'single') {
      return { canvas: single, count: 1, cols: 1, rows: 1 };
    }

    // Determine target paper dimensions & grid based on sheetLayout or selectedPaper
    let sheetWidthMm = selectedPaper.widthMm;
    let sheetHeightMm = selectedPaper.heightMm;
    let cols = 0;
    let rows = 0;
    let isCombo = false;

    if (sheetLayout === '8') {
      // 4x6" Landscape (152.4 × 101.6 mm) -> 4 cols × 2 rows = 8 photos
      sheetWidthMm = 152.4;
      sheetHeightMm = 101.6;
      cols = 4;
      rows = 2;
    } else if (sheetLayout === '4') {
      // 4x6" Landscape (152.4 × 101.6 mm) -> 2 cols × 2 rows = 4 photos
      sheetWidthMm = 152.4;
      sheetHeightMm = 101.6;
      cols = 2;
      rows = 2;
    } else if (sheetLayout === '6') {
      // 4x6" Portrait (101.6 × 152.4 mm) -> 2 cols × 3 rows = 6 photos
      sheetWidthMm = 101.6;
      sheetHeightMm = 152.4;
      cols = 2;
      rows = 3;
    } else if (sheetLayout === '12') {
      // A4 (210 × 297 mm) -> 3 cols × 4 rows = 12 photos
      sheetWidthMm = 210;
      sheetHeightMm = 297;
      cols = 3;
      rows = 4;
    } else if (sheetLayout === '16') {
      // 5x7" (127 × 177.8 mm) -> 4 cols × 4 rows = 16 photos
      sheetWidthMm = 127;
      sheetHeightMm = 177.8;
      cols = 4;
      rows = 4;
    } else if (sheetLayout === '32') {
      // A4 (210 × 297 mm) -> 4 cols × 8 rows = 32 photos
      sheetWidthMm = 210;
      sheetHeightMm = 297;
      cols = 4;
      rows = 8;
    } else if (sheetLayout === 'combo' || selectedPaper.id === '4x6-combo') {
      isCombo = true;
      sheetWidthMm = 101.6;
      sheetHeightMm = 152.4;
    }

    if (isCombo) {
      const sheetWidthPx = mmToPx(sheetWidthMm);
      const sheetHeightPx = mmToPx(sheetHeightMm);
      sheet.width = sheetWidthPx;
      sheet.height = sheetHeightPx;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, sheetWidthPx, sheetHeightPx);

      // Top Section: 6 Passport Size (35×45mm, 2 rows of 3)
      const pW = mmToPx(selectedPreset.widthMm || 35);
      const pH = mmToPx(selectedPreset.heightMm || 45);
      const gap = mmToPx(photoSpacingMm || 2);
      const topMarginX = Math.round((sheetWidthPx - (3 * pW + 2 * gap)) / 2);
      const topMarginY = mmToPx(6);

      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          const x = topMarginX + c * (pW + gap);
          const y = topMarginY + r * (pH + gap);
          ctx.drawImage(single, x, y, pW, pH);

          if (showCutLines) {
            ctx.save();
            ctx.strokeStyle = '#94A3B8';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(x, y, pW, pH);
            ctx.restore();
          }
        }
      }

      // Bottom Section: 4 Stamp Size Photos (20×25mm)
      const sW = mmToPx(20);
      const sH = mmToPx(25);
      const bottomMarginX = Math.round((sheetWidthPx - (4 * sW + 3 * gap)) / 2);
      const bottomMarginY = topMarginY + 2 * (pH + gap) + mmToPx(5);

      for (let c = 0; c < 4; c++) {
        const x = bottomMarginX + c * (sW + gap);
        const y = bottomMarginY;
        ctx.drawImage(single, x, y, sW, sH);

        if (showCutLines) {
          ctx.save();
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(x, y, sW, sH);
          ctx.restore();
        }
      }

      return { canvas: sheet, count: 10, cols: 3, rows: 3 };
    }

    const sheetWidthPx = mmToPx(sheetWidthMm);
    const sheetHeightPx = mmToPx(sheetHeightMm);
    sheet.width = sheetWidthPx;
    sheet.height = sheetHeightPx;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, sheetWidthPx, sheetHeightPx);

    const gapPx = mmToPx(photoSpacingMm || 2);

    // If cols and rows not preset, calculate from available dimensions
    if (!cols || !rows) {
      const marginPx = mmToPx(6);
      const availWidth = sheetWidthPx - marginPx * 2;
      const availHeight = sheetHeightPx - marginPx * 2;
      cols = Math.max(1, Math.floor((availWidth + gapPx) / (targetWidthPx + gapPx)));
      rows = Math.max(1, Math.floor((availHeight + gapPx) / (targetHeightPx + gapPx)));
    }

    const totalPhotos = cols * rows;
    const gridTotalW = cols * targetWidthPx + (cols - 1) * gapPx;
    const gridTotalH = rows * targetHeightPx + (rows - 1) * gapPx;
    const startX = Math.round((sheetWidthPx - gridTotalW) / 2);
    const startY = Math.round((sheetHeightPx - gridTotalH) / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (targetWidthPx + gapPx);
        const y = startY + r * (targetHeightPx + gapPx);

        ctx.drawImage(single, x, y, targetWidthPx, targetHeightPx);

        if (showCutLines) {
          ctx.save();
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(x, y, targetWidthPx, targetHeightPx);
          ctx.restore();
        }

        if (showCropMarks) {
          ctx.save();
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1.5;
          const len = 12;
          ctx.beginPath();
          ctx.moveTo(x - 4, y); ctx.lineTo(x - 4 - len, y);
          ctx.moveTo(x, y - 4); ctx.lineTo(x, y - 4 - len);
          ctx.moveTo(x + targetWidthPx + 4, y); ctx.lineTo(x + targetWidthPx + 4 + len, y);
          ctx.moveTo(x + targetWidthPx, y - 4); ctx.lineTo(x + targetWidthPx, y - 4 - len);
          ctx.moveTo(x - 4, y + targetHeightPx); ctx.lineTo(x - 4 - len, y + targetHeightPx);
          ctx.moveTo(x, y + targetHeightPx + 4); ctx.lineTo(x, y + targetHeightPx + 4 + len);
          ctx.moveTo(x + targetWidthPx + 4, y + targetHeightPx); ctx.lineTo(x + targetWidthPx + 4 + len, y + targetHeightPx);
          ctx.moveTo(x + targetWidthPx, y + targetHeightPx + 4); ctx.lineTo(x + targetWidthPx, y + targetHeightPx + 4 + len);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Studio watermark footer
    ctx.font = '500 22px Inter, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(
      `Ansar Tools Passport Studio • ${totalPhotos} Photos • ${selectedPreset.country} (${selectedPreset.widthMm}×${selectedPreset.heightMm}mm) • 300 DPI True Scale`,
      Math.max(20, startX),
      Math.max(30, startY - 16)
    );

    return { canvas: sheet, count: totalPhotos, cols, rows };
  };

  const handleSelectSheetLayout = (layout: 'single' | '4' | '6' | '8' | '12' | '16' | '32' | 'combo') => {
    setSheetLayout(layout);
    if (layout === 'single') {
      setViewMode('single');
      return;
    }
    if (layout === '8' || layout === '4') {
      const p4x6 = PAPER_PRESETS.find((p) => p.id === '4x6') || PAPER_PRESETS[1];
      setSelectedPaper(p4x6);
    } else if (layout === '6') {
      const p4x6 = PAPER_PRESETS.find((p) => p.id === '4x6') || PAPER_PRESETS[1];
      setSelectedPaper(p4x6);
    } else if (layout === '12' || layout === '32') {
      const pA4 = PAPER_PRESETS.find((p) => p.id === 'a4') || PAPER_PRESETS[0];
      setSelectedPaper(pA4);
    } else if (layout === '16') {
      const p5x7 = PAPER_PRESETS.find((p) => p.id === '5x7') || PAPER_PRESETS[2];
      setSelectedPaper(p5x7);
    } else if (layout === 'combo') {
      const pCombo = PAPER_PRESETS.find((p) => p.id === '4x6-combo') || PAPER_PRESETS[3];
      setSelectedPaper(pCombo);
    }
    setViewMode('sheet');
  };

  const handleQuickPrint = () => {
    const { canvas } = generateSheetCanvas();
    const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to use Direct Quick Print.');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Passport Photo Sheet - Ansar Studio</title>
          <style>
            @page {
              size: auto;
              margin: 0mm;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #ffffff;
            }
            img {
              width: 100%;
              max-width: 100vw;
              height: auto;
              display: block;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="setTimeout(() => { window.print(); window.close(); }, 350);" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadSheetJpg = () => {
    const { canvas, count } = generateSheetCanvas();
    const link = document.createElement('a');
    link.download = `Ansar-Passport-Sheet-${count}-Photos-${selectedPreset.country.replace(/\s+/g, '-')}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.98);
    link.click();
  };

  // Re-render sheet canvas whenever in sheet mode or options change
  useEffect(() => {
    if (viewMode === 'sheet' && sheetCanvasRef.current && imageLoaded) {
      const { canvas } = generateSheetCanvas();
      const displayCanvas = sheetCanvasRef.current;
      displayCanvas.width = canvas.width;
      displayCanvas.height = canvas.height;
      const ctx = displayCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(canvas, 0, 0);
      }
    }
  }, [
    viewMode,
    sheetLayout,
    selectedPaper,
    selectedPreset,
    photoSpacingMm,
    showCutLines,
    showCropMarks,
    imageLoaded,
    zoom,
    pan,
    rotation,
    flipH,
    bgColor,
    detectedPhotoBg,
    enableBgReplace,
    bgTolerance,
    bgFeather,
    sharpness,
    brightness,
    contrast,
    saturation,
    isGrayscale,
    selectedSuit,
    suitScale,
    suitPos,
    suitFlip,
    addNameDate,
    candidateName,
    dopDate,
    dopPrefix,
    addBorder,
    borderWidth,
    borderColor
  ]);

  // Preview Print Sheet Modal
  const handleOpenSheetPreview = () => {
    if (!imageLoaded) return;
    const { canvas, count, cols, rows } = generateSheetCanvas();
    setSheetPreviewUrl(canvas.toDataURL('image/png'));
    setSheetStats({ count, cols, rows });
    setShowSheetModal(true);
  };

  // Download Print Sheet (PNG)
  const handleDownloadSheetPng = () => {
    const { canvas } = generateSheetCanvas();
    const link = document.createElement('a');
    link.download = `Ansar-Passport-Sheet-${selectedPaper.name.replace(/\s+/g, '-')}-${selectedPreset.country}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Download Print-Ready PDF with exact millimeters scale
  const handleDownloadPdf = async () => {
    setIsProcessing(true);
    setStatusMessage('Generating print-ready PDF...');
    try {
      const pdfDoc = await PDFDocument.create();

      // Convert mm to PDF points (1 inch = 72 pt = 25.4 mm => 1 mm = 72 / 25.4 pt = 2.8346 pt)
      const MM_TO_PT = 72 / 25.4;

      let pageWidthPt: number;
      let pageHeightPt: number;

      if (selectedPaper.id === 'single') {
        pageWidthPt = selectedPreset.widthMm * MM_TO_PT;
        pageHeightPt = selectedPreset.heightMm * MM_TO_PT;
      } else {
        pageWidthPt = selectedPaper.widthMm * MM_TO_PT;
        pageHeightPt = selectedPaper.heightMm * MM_TO_PT;
      }

      const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);

      // Generate the sheet image and embed into PDF
      const { canvas } = generateSheetCanvas();
      const pngDataUrl = canvas.toDataURL('image/png');
      const pngBytes = await fetch(pngDataUrl).then((res) => res.arrayBuffer());
      const embeddedPng = await pdfDoc.embedPng(pngBytes);

      // Draw embedded PNG covering page exactly 1:1
      page.drawImage(embeddedPng, {
        x: 0,
        y: 0,
        width: pageWidthPt,
        height: pageHeightPt
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Ansar-Passport-Print-${selectedPaper.id}-${selectedPreset.country}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. You can download the high-resolution PNG instead.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <Navbar />

      {/* Main Studio Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              {toolMode === 'photo' ? <User className="w-5 h-5 text-white" /> : <PenTool className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                Ansar Passport & Govt Studio
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                  300 DPI Official
                </span>
              </h1>
              <p className="text-xs text-slate-400">Embassy, Biometric, Sarkari Job & Visa Photo/Signature Maker</p>
            </div>
          </div>

          {/* Tool Mode Switcher (Photo vs Signature) */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setToolMode('photo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                toolMode === 'photo'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Passport Photo
            </button>
            <button
              onClick={() => setToolMode('signature')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                toolMode === 'signature'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              Signature Resizer (10-20 KB)
            </button>
          </div>

          <div className="flex items-center gap-2">
            {toolMode === 'photo' ? (
              <>
                <button
                  onClick={() => handleLoadImage(SAMPLE_PORTRAIT_DATA_URI)}
                  className="px-3.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Try Demo Photo
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </>
            ) : (
              <>
                <button
                  onClick={() => sigFileInputRef.current?.click()}
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Signature
                </button>
                <input
                  ref={sigFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onload = (ev) => ev.target?.result && handleLoadSignature(ev.target.result as string);
                      r.readAsDataURL(f);
                    }
                    e.target.value = '';
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Studio Content Area */}
      {toolMode === 'photo' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT / CENTER: Interactive Canvas Viewport */}
        <div className="flex-1 flex flex-col items-center">
          {/* SHARDA-STYLE 1-CLICK INSTANT PHOTO GRID BAR */}
          {imageLoaded && (
            <div className="w-full mb-3.5 bg-slate-950 border border-slate-800 rounded-2xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 shadow-xl">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-300 mr-1 flex items-center gap-1">
                  <Printer className="w-3.5 h-3.5 text-blue-400" /> Print Grid:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('single');
                    setSheetLayout('single');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    viewMode === 'single'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-1 ring-blue-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  1 Photo
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSheetLayout('4')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'sheet' && sheetLayout === '4'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-2 ring-blue-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  4 Photos
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSheetLayout('6')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'sheet' && sheetLayout === '6'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-2 ring-blue-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  6 Photos
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSheetLayout('8')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    viewMode === 'sheet' && sheetLayout === '8'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-300 scale-105'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  8 Photos (4×6") ★
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSheetLayout('12')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'sheet' && sheetLayout === '12'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-2 ring-blue-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  12 Photos
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSheetLayout('16')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'sheet' && sheetLayout === '16'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-2 ring-blue-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  16 Photos (5×7")
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSheetLayout('32')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'sheet' && sheetLayout === '32'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-2 ring-blue-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  32 Photos (A4)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSheetLayout('combo')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'sheet' && sheetLayout === 'combo'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-2 ring-blue-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  4×6 Combo (6+4)
                </button>
              </div>

              {/* Action Shortcut */}
              <div className="flex items-center gap-2">
                {viewMode === 'sheet' ? (
                  <>
                    <button
                      type="button"
                      onClick={handleQuickPrint}
                      className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Quick Print
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('single')}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 flex items-center gap-1 transition-all"
                    >
                      <User className="w-3.5 h-3.5" />
                      Edit Single
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectSheetLayout('8')}
                    className="px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md shadow-amber-500/30 flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print 8 Photos
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[580px] shadow-2xl overflow-hidden">
            {imageLoaded ? (
              viewMode === 'sheet' ? (
                /* =========================================================
                   PRINT SHEET VIEWPORT (Sharda Style 4, 6, 8, 12, 16, 32)
                   ========================================================= */
                <div className="relative flex flex-col items-center justify-center select-none w-full max-w-full">
                  {/* High Resolution Print Sheet Canvas View */}
                  <div className="relative shadow-2xl rounded-xl overflow-hidden border-2 border-slate-700 bg-white p-2 max-w-full">
                    <canvas
                      ref={sheetCanvasRef}
                      className="block max-h-[520px] max-w-full h-auto w-auto shadow-md rounded"
                    />
                  </div>

                  {/* Sheet Action Toolbar */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleQuickPrint}
                      className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Printer className="w-4 h-4" />
                      1-Click Quick Print (Direct to Printer)
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadSheetJpg}
                      className="px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      Download Sheet (JPG 300 DPI)
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="px-4 py-2.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-2 transition-all"
                    >
                      <FileDown className="w-4 h-4 text-rose-400" />
                      Download PDF (Exact MM Scale)
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('single')}
                      className="px-4 py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Single Photo Edit
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-3 text-center max-w-xl">
                    ✂️ Standard print sheet with scissor cut lines. Insert 4×6" photo paper into your printer and select 100% scale.
                  </p>
                </div>
              ) : (
                /* =========================================================
                   SINGLE PHOTO CROP & TUNING VIEWPORT
                   ========================================================= */
                <div className="relative flex flex-col items-center justify-center select-none">
                  {/* Canvas with dynamic aspect ratio */}
                  <div className="relative shadow-2xl rounded-lg overflow-hidden border-2 border-blue-500/40 bg-slate-900 group">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleMouseUp}
                      onWheel={handleWheel}
                      className="cursor-grab active:cursor-grabbing block touch-none"
                      style={{ maxHeight: '540px', width: 'auto' }}
                    />

                    {/* Canvas Floating Top Controls */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60 text-[11px] font-semibold text-slate-300 shadow-lg pointer-events-auto flex items-center gap-2">
                        <span>{selectedPreset.flag} {selectedPreset.country}</span>
                        <span className="text-blue-400">{selectedPreset.widthMm}×{selectedPreset.heightMm}mm</span>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-md border border-slate-700/60 shadow-lg pointer-events-auto">
                        <button
                          title="Toggle Biometric Head Guides"
                          onClick={() => setShowBiometricGuide(!showBiometricGuide)}
                          className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                            showBiometricGuide ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <User className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Guide</span>
                        </button>
                        <button
                          title="Toggle Rule of Thirds Grid"
                          onClick={() => setShowRuleOfThirds(!showRuleOfThirds)}
                          className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                            showRuleOfThirds ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Grid className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Grid</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Helpful Canvas Bottom Toolbar */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 backdrop-blur border border-slate-800 px-4 py-2 rounded-xl shadow-lg max-w-full">
                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <input
                        type="range"
                        min="50"
                        max="300"
                        value={Math.round(zoom * 100)}
                        onChange={(e) => setZoom(Number(e.target.value) / 100)}
                        className="w-20 sm:w-28 accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                      />
                      <button
                        onClick={() => setZoom((z) => Math.min(3.5, z + 0.1))}
                        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-slate-400 font-mono w-9 text-center">{Math.round(zoom * 100)}%</span>
                    </div>

                    <div className="h-4 w-px bg-slate-800 mx-1" />

                    {/* Instant Auto-Fit Frame & Crop Borders */}
                    <button
                      type="button"
                      onClick={handleAutoFillFrame}
                      className="px-2.5 py-1 text-xs font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/40 rounded-lg flex items-center gap-1 transition-all"
                      title="Auto zoom to crop margins and fill frame"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      Fill Frame
                    </button>

                    <button
                      type="button"
                      onClick={() => setPan({ x: 0, y: 0 })}
                      className="px-2 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                      title="Center Head Position"
                    >
                      Center
                    </button>

                    <div className="h-4 w-px bg-slate-800 mx-1" />

                    {/* Rotate and Flip Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setRotation((r) => (r - 90) % 360)}
                        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                        title="Rotate 90° CCW"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                        title="Rotate 90° CW"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setFlipH(!flipH)}
                        className={`p-1.5 rounded-lg ${flipH ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                        title="Flip Horizontal"
                      >
                        <FlipHorizontal className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleResetFrame}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-1"
                        title="Reset Position & Zoom"
                      >
                        <RefreshCw className="w-3 h-3" /> Reset
                      </button>
                    </div>

                    <div className="h-4 w-px bg-slate-800 mx-1" />

                    {/* Direct 8 Photos Sheet Shortcut */}
                    <button
                      type="button"
                      onClick={() => handleSelectSheetLayout('8')}
                      className="px-3 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-sm flex items-center gap-1 transition-all"
                    >
                      <Printer className="w-3 h-3" /> View 8 Photos
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 text-center">
                    💡 <strong>Tip:</strong> Drag image with mouse to align eyes with the green line, chin with orange line. Click <strong>Fill Frame</strong> to remove border margins.
                  </p>
                </div>
              )
            ) : (
              /* Empty Upload Placeholder */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-700/80 group-hover:border-blue-500/50 flex items-center justify-center mb-5 shadow-inner transition-all group-hover:scale-105">
                  <Upload className="w-9 h-9 text-blue-400 group-hover:animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Upload Portrait Photo</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Drag and drop your photo here, paste from clipboard (<kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">Ctrl+V</kbd>), or click to browse.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all"
                  >
                    Select File
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadImage(SAMPLE_PORTRAIT_DATA_URI);
                    }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Try Sample Photo
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-6 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Private & Client-side — Photos are processed locally and never leave your browser.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Studio Controls Sidebar Tabs */}
        <div className="w-full lg:w-[420px] flex flex-col gap-4">
          {/* Tabs Navigation */}
          <div className="grid grid-cols-6 gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'preset', label: 'Preset', icon: <User className="w-3.5 h-3.5" /> },
              { id: 'namedate', label: 'Name/Date', icon: <TypeIcon className="w-3.5 h-3.5" /> },
              { id: 'bg', label: 'Color', icon: <Palette className="w-3.5 h-3.5" /> },
              { id: 'suit', label: 'Suit', icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: 'adjust', label: 'Adjust', icon: <Sliders className="w-3.5 h-3.5" /> },
              { id: 'print', label: 'Print', icon: <Printer className="w-3.5 h-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 flex flex-col items-center justify-center gap-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.icon}
                <span className="truncate w-full text-center">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: PRESETS & DIMENSIONS */}
          {activeTab === 'preset' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" /> Country & Document Presets
                </h3>
                <button
                  onClick={() => setIsCustomPreset(!isCustomPreset)}
                  className={`text-xs px-2.5 py-1 rounded-md border ${
                    isCustomPreset
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {isCustomPreset ? 'Using Custom Size' : 'Custom Dimensions'}
                </button>
              </div>

              {!isCustomPreset ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-300">Select Country / Visa Type</label>
                    <select
                      value={selectedPreset.id}
                      onChange={(e) => {
                        const found = COUNTRY_PRESETS.find((p) => p.id === e.target.value);
                        if (found) {
                          setSelectedPreset(found);
                          setBgColor(found.bgColor);
                        }
                      }}
                      className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                    >
                      {COUNTRY_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.flag} {p.country} — {p.document} ({p.widthMm}×{p.heightMm}mm)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Active Preset Specs Card */}
                  <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Physical Size:</span>
                      <span className="font-mono font-semibold text-white">
                        {selectedPreset.widthMm} × {selectedPreset.heightMm} mm
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Digital Resolution (300 DPI):</span>
                      <span className="font-mono text-blue-400 font-semibold">
                        {selectedPreset.widthPx} × {selectedPreset.heightPx} px
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Standard Background:</span>
                      <span className="font-semibold text-emerald-400">{selectedPreset.bgName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 border-t border-slate-800/80 pt-2">
                      {selectedPreset.description}
                    </p>
                  </div>
                </>
              ) : (
                /* Custom Dimensions Inputs */
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Width (mm)</label>
                      <input
                        type="number"
                        min="10"
                        max="200"
                        value={customWidthMm}
                        onChange={(e) => setCustomWidthMm(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Height (mm)</label>
                      <input
                        type="number"
                        min="10"
                        max="200"
                        value={customHeightMm}
                        onChange={(e) => setCustomHeightMm(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">DPI (Dots Per Inch)</label>
                    <select
                      value={customDpi}
                      onChange={(e) => setCustomDpi(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value="300">300 DPI (Official Standard Print)</option>
                      <option value="600">600 DPI (Ultra High Definition)</option>
                      <option value="200">200 DPI (Web / Online Form Submission)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Rotate & Straighten Angle Slider */}
              <div className="flex flex-col gap-1.5 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Fine Straighten / Leveling</span>
                  <span className="text-blue-400 font-mono">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 2: NAME & DATE (DOP) OVERLAY & STUDIO BORDER */}
          {activeTab === 'namedate' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TypeIcon className="w-4 h-4 text-blue-400" /> Name & Date of Photo (DOP)
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Sarkari / Govt Required
                </span>
              </div>

              {/* Name & Date Enable Toggle */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Enable Bottom Name & Date Bar</h4>
                  <p className="text-[11px] text-slate-400">Prints candidate name & photo capture date on a clean white bar</p>
                </div>
                <input
                  type="checkbox"
                  checked={addNameDate}
                  onChange={(e) => setAddNameDate(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {addNameDate && (
                <div className="flex flex-col gap-3 pt-1">
                  {/* Candidate Name Input */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Candidate Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. MOHAMMAD ANSAR / RAHUL VERMA"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Rendered in bold uppercase letters</span>
                  </div>

                  {/* Date Input with Prefix & Today Button */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="text-xs font-medium text-slate-300 block mb-1">Prefix</label>
                      <select
                        value={dopPrefix}
                        onChange={(e) => setDopPrefix(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="DOP: ">DOP: </option>
                        <option value="DOB: ">DOB: </option>
                        <option value="Date: ">Date: </option>
                        <option value="">None</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-medium text-slate-300">Date of Photo</label>
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Date();
                            const dd = String(today.getDate()).padStart(2, '0');
                            const mm = String(today.getMonth() + 1).padStart(2, '0');
                            const yyyy = today.getFullYear();
                            setDopDate(`${dd}/${mm}/${yyyy}`);
                          }}
                          className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          Today's Date
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="DD/MM/YYYY"
                        value={dopDate}
                        onChange={(e) => setDopDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STUDIO BORDER SECTION */}
              <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Studio Perimeter Border</h4>
                    <p className="text-[11px] text-slate-400">Solid hairline frame around photo for clean scissor cutting</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={addBorder}
                    onChange={(e) => setAddBorder(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                {addBorder && (
                  <div className="grid grid-cols-2 gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Border Thickness</label>
                      <select
                        value={borderWidth}
                        onChange={(e) => setBorderWidth(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      >
                        <option value="1">1 px (Fine Hairline)</option>
                        <option value="2">2 px (Studio Standard)</option>
                        <option value="3">3 px (Bold)</option>
                        <option value="4">4 px (Heavy Border)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Border Color</label>
                      <div className="flex items-center gap-1.5">
                        {[
                          { name: 'Black', hex: '#000000' },
                          { name: 'Slate', hex: '#334155' },
                          { name: 'Dark Navy', hex: '#0F172A' },
                          { name: 'Pure White', hex: '#FFFFFF' }
                        ].map((b) => (
                          <button
                            key={b.hex}
                            onClick={() => setBorderColor(b.hex)}
                            className={`w-7 h-7 rounded-md border-2 transition-all ${
                              borderColor === b.hex ? 'border-blue-500 scale-110' : 'border-slate-700'
                            }`}
                            style={{ backgroundColor: b.hex }}
                            title={b.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BACKGROUND COLOR REPLACER */}
          {activeTab === 'bg' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-400" /> Background Color & Removal
                </h3>
              </div>

              {/* Detected Photo Background Badge */}
              {detectedPhotoBg && (
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-blue-500/30 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-white/60 shadow-inner"
                      style={{ backgroundColor: detectedPhotoBg }}
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                        Photo Background
                        <span className="text-[10px] text-emerald-400 font-normal">● Match</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">{detectedPhotoBg}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBgColor('transparent');
                      setBgMode('original');
                      setEnableBgReplace(false);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      bgColor === 'transparent'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {bgColor === 'transparent' ? 'Original Active' : 'Keep Original'}
                  </button>
                </div>
              )}

              {/* Standard Swatches */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-300">Official Passport Background Colors</label>
                <div className="grid grid-cols-4 gap-2">
                  {STANDARD_BG_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setBgColor(c.hex)}
                      className={`h-10 rounded-xl flex items-center justify-center relative border-2 transition-all ${
                        bgColor === c.hex ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20' : 'border-slate-700 hover:border-slate-500'
                      }`}
                      style={{ backgroundColor: c.hex === 'transparent' ? '#1e293b' : c.hex }}
                      title={c.name}
                    >
                      {c.hex === 'transparent' && <span className="text-[9px] text-slate-400">Orig.</span>}
                      {bgColor === c.hex && (
                        <Check className={`w-4 h-4 ${c.hex === '#FFFFFF' || c.hex === '#F5F5EC' || c.hex === '#E5E7EB' ? 'text-slate-900' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Hex Color Picker */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Custom Color:</label>
                <input
                  type="color"
                  value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-slate-300">{bgColor}</span>
              </div>

              {/* Auto Background Replacer Toggle */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Smart Chroma Background Fill</h4>
                    <p className="text-[11px] text-slate-400">Replaces solid or plain studio backdrop with selected color</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableBgReplace}
                    onChange={(e) => setEnableBgReplace(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                {enableBgReplace && (
                  <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Color Tolerance</span>
                        <span className="text-blue-400 font-mono">{bgTolerance}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={bgTolerance}
                        onChange={(e) => setBgTolerance(Number(e.target.value))}
                        className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Edge Feathering (Hair Blend)</span>
                        <span className="text-blue-400 font-mono">{bgFeather}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={bgFeather}
                        onChange={(e) => setBgFeather(Number(e.target.value))}
                        className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FORMAL ATTIRE / SUIT CHANGER */}
          {activeTab === 'suit' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" /> Formal Suit & Blazer Attire
                </h3>
                {selectedSuit && (
                  <button
                    onClick={() => setSelectedSuit(null)}
                    className="text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    Remove Suit
                  </button>
                )}
              </div>

              {/* Gender selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSuitGenderTab('men')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    suitGenderTab === 'men'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Men's Suits
                </button>
                <button
                  onClick={() => setSuitGenderTab('women')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    suitGenderTab === 'women'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Women's Blazers
                </button>
              </div>

              {/* Suit Templates Grid */}
              <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {SUIT_TEMPLATES.filter((s) => s.gender === suitGenderTab).map((suit) => (
                  <button
                    key={suit.id}
                    onClick={() => setSelectedSuit(suit)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all bg-slate-900/60 ${
                      selectedSuit?.id === suit.id
                        ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/30'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-full h-16 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden p-1">
                      <img src={suit.svgDataUri} alt={suit.name} className="max-h-full object-contain pointer-events-none" />
                    </div>
                    <span className="text-[10px] text-slate-300 text-center line-clamp-1 leading-tight">{suit.name}</span>
                  </button>
                ))}
              </div>

              {/* Suit Position & Scale Controls */}
              {selectedSuit && (
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Suit Scale / Shoulder Width</span>
                      <span className="text-blue-400 font-mono">{Math.round(suitScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="180"
                      value={Math.round(suitScale * 100)}
                      onChange={(e) => setSuitScale(Number(e.target.value) / 100)}
                      className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Nudge buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">Position Nudge:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSuitPos((p) => ({ ...p, x: p.x - 4 }))}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                        title="Nudge Left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => setSuitPos((p) => ({ ...p, y: p.y - 4 }))}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                          title="Nudge Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSuitPos((p) => ({ ...p, y: p.y + 4 }))}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                          title="Nudge Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => setSuitPos((p) => ({ ...p, x: p.x + 4 }))}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                        title="Nudge Right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSuitFlip(!suitFlip)}
                        className={`p-1.5 rounded ml-2 ${suitFlip ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                        title="Flip Suit Horizontally"
                      >
                        <FlipHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: IMAGE ADJUSTMENTS */}
          {activeTab === 'adjust' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" /> Studio Tone Adjustments
                </h3>
                <button
                  onClick={handleResetAdjustments}
                  className="text-xs text-slate-400 hover:text-white font-medium"
                >
                  Reset
                </button>
              </div>

              {/* 1-Click Auto Enhance */}
              <button
                onClick={handleAutoEnhance}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
              >
                <Sparkles className="w-4 h-4" /> 1-Click Studio Auto-Enhance
              </button>

              {/* Sliders */}
              <div className="flex flex-col gap-3.5 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Brightness</span>
                    <span className="text-blue-400 font-mono">{brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Contrast</span>
                    <span className="text-blue-400 font-mono">{contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Saturation</span>
                    <span className="text-blue-400 font-mono">{saturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Sharpness / Detail Clarity</span>
                    <span className="text-blue-400 font-mono">{sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sharpness}
                    onChange={(e) => setSharpness(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-300">Black & White / Grayscale</span>
                  <input
                    type="checkbox"
                    checked={isGrayscale}
                    onChange={(e) => setIsGrayscale(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRINT SHEET & EXPORT */}
          {activeTab === 'print' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Printer className="w-4 h-4 text-blue-400" /> Print Sheet & Tiling
                </h3>
              </div>

              {/* Paper selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-300">Target Paper Size</label>
                <select
                  value={selectedPaper.id}
                  onChange={(e) => {
                    const found = PAPER_PRESETS.find((p) => p.id === e.target.value);
                    if (found) setSelectedPaper(found);
                  }}
                  className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                >
                  {PAPER_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">{selectedPaper.description}</p>
              </div>

              {/* Cutting guides toggles */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Show Cutting Borders (Dashed)</span>
                  <input
                    type="checkbox"
                    checked={showCutLines}
                    onChange={(e) => setShowCutLines(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Show Corner Crop Crosshairs</span>
                  <input
                    type="checkbox"
                    checked={showCropMarks}
                    onChange={(e) => setShowCropMarks(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Photo Spacing Gap</span>
                    <span className="text-blue-400 font-mono">{photoSpacingMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={photoSpacingMm}
                    onChange={(e) => setPhotoSpacingMm(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Sheet preview modal button */}
              {selectedPaper.id !== 'single' && (
                <button
                  onClick={handleOpenSheetPreview}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Eye className="w-4 h-4 text-blue-400" /> Preview Print Sheet
                </button>
              )}
            </div>
          )}

          {/* MAIN DOWNLOAD & EXPORT ACTION BUTTONS */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-blue-400" /> Export & File Size Limiter
              </h4>
              {estimatedKb !== null && (
                <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> ~{estimatedKb} KB
                </span>
              )}
            </div>

            {/* Target KB Selector */}
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">File Size Requirement</label>
                <span className="text-[10px] text-slate-400">Portal Strict Limit</span>
              </div>
              <select
                value={targetKbMode}
                onChange={(e) => setTargetKbMode(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="hd">Original High-Definition (300 DPI Studio)</option>
                <option value="govt-50">Govt / Exam Standard (20 KB – 50 KB strict)</option>
                <option value="govt-20">Strict Under 20 KB (10 KB – 20 KB)</option>
                <option value="under-100">Under 100 KB (Visa & Embassy Portals)</option>
                <option value="custom">Custom Target Max KB</option>
              </select>

              {targetKbMode === 'custom' && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400">Max File Size:</span>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={customTargetKb}
                    onChange={(e) => setCustomTargetKb(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                  />
                  <span className="text-xs text-slate-400">KB</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={!imageLoaded || isProcessing}
                onClick={() => handleDownloadSingle('jpeg')}
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" /> Download Photo (JPG)
              </button>

              <button
                disabled={!imageLoaded || isProcessing}
                onClick={() => handleDownloadSingle('png')}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <ImageIcon className="w-4 h-4 text-sky-400" /> HD PNG (Lossless)
              </button>
            </div>

            <button
              disabled={!imageLoaded || isProcessing}
              onClick={handleDownloadPdf}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <FileDown className="w-4 h-4" /> Print PDF (Exact Scale 1:1)
            </button>

            {selectedPaper.id !== 'single' && (
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                <button
                  type="button"
                  disabled={!imageLoaded || isProcessing}
                  onClick={handleQuickPrint}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" /> Quick Print Sheet
                </button>
                <button
                  type="button"
                  disabled={!imageLoaded || isProcessing}
                  onClick={handleDownloadSheetJpg}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" /> Sheet (JPG 300 DPI)
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      ) : (
        /* =========================================================================
           SIGNATURE RESIZER & ENHANCER STUDIO (10-20 KB STRICT)
           ========================================================================= */
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-6">
          {/* Left: Interactive Signature Canvas */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[500px] shadow-2xl">
              {sigLoaded ? (
                <div className="flex flex-col items-center gap-4 select-none">
                  {/* Canvas Container with dark checkered frame */}
                  <div className="relative shadow-2xl rounded-xl overflow-hidden border-2 border-blue-500/40 bg-white p-4">
                    <canvas
                      ref={sigCanvasRef}
                      className="block shadow-inner bg-white rounded cursor-grab active:cursor-grabbing"
                      style={{ maxHeight: '220px', width: 'auto' }}
                    />
                  </div>

                  {/* Canvas Controls */}
                  <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl shadow-lg">
                    <button
                      onClick={() => setSigZoom((z) => Math.max(0.4, z - 0.1))}
                      className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="40"
                      max="250"
                      value={Math.round(sigZoom * 100)}
                      onChange={(e) => setSigZoom(Number(e.target.value) / 100)}
                      className="w-28 accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={() => setSigZoom((z) => Math.min(3, z + 0.1))}
                      className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-slate-800" />
                    <button
                      onClick={() => { setSigZoom(1); setSigPan({ x: 0, y: 0 }); }}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 hover:bg-slate-800 px-2 py-1 rounded-lg"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  {/* Nudge buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-900/70 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-400">
                    <span>Align:</span>
                    <button onClick={() => setSigPan((p) => ({ ...p, x: p.x - 4 }))} className="p-1 hover:text-white bg-slate-800 rounded"><ArrowLeft className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setSigPan((p) => ({ ...p, y: p.y - 4 }))} className="p-1 hover:text-white bg-slate-800 rounded"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setSigPan((p) => ({ ...p, y: p.y + 4 }))} className="p-1 hover:text-white bg-slate-800 rounded"><ArrowDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setSigPan((p) => ({ ...p, x: p.x + 4 }))} className="p-1 hover:text-white bg-slate-800 rounded"><ArrowRight className="w-3.5 h-3.5" /></button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    💡 Center your signature inside the frame. The white paper background is automatically cleaned for official submission.
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => sigFileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-700/80 group-hover:border-blue-500/50 flex items-center justify-center mb-5 shadow-inner transition-all group-hover:scale-105">
                    <PenTool className="w-9 h-9 text-blue-400 group-hover:animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Upload Handwritten Signature</h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    Upload a smartphone photo or scan of your signature on paper. We will automatically remove grey shadows, whiten the background, and compress strictly under 20 KB.
                  </p>
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all"
                  >
                    Select Signature Image
                  </button>
                  <p className="text-[11px] text-slate-500 mt-5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Client-Side Privacy — Never uploaded to external servers.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Signature Controls */}
          <div className="w-full lg:w-[420px] flex flex-col gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" /> Signature Dimensions & Standards
                </h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                  10–20 KB Compliant
                </span>
              </div>

              {/* Signature Preset Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-300">Exam & Portal Requirements</label>
                <select
                  value={sigPreset.id}
                  onChange={(e) => {
                    const found = SIGNATURE_PRESETS.find((s) => s.id === e.target.value);
                    if (found) setSigPreset(found);
                  }}
                  className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                >
                  {SIGNATURE_PRESETS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.widthPx}×{s.heightPx} px)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">{sigPreset.description}</p>
              </div>

              {/* Auto Whiten Background & Clean Paper Shadows */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Auto Paper Whitener & Shadow Remover</h4>
                    <p className="text-[11px] text-slate-400">Transforms off-white/yellowish paper to pure white #FFFFFF</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={sigAutoWhiten}
                    onChange={(e) => setSigAutoWhiten(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                {sigAutoWhiten && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Ink Contrast & Boldness</span>
                      <span className="text-blue-400 font-mono">{sigContrast}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={sigContrast}
                      onChange={(e) => setSigContrast(Number(e.target.value))}
                      className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Download Action Card */}
              <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Target File Size:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {sigPreset.minKb} KB – {sigPreset.maxKb} KB (Portal Strict)
                  </span>
                </div>

                <button
                  disabled={!sigLoaded || isProcessing}
                  onClick={handleDownloadSignature}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" /> Download Official Signature JPG ({sigPreset.minKb}-{sigPreset.maxKb} KB)
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* PRINT SHEET PREVIEW MODAL */}
      {showSheetModal && sheetPreviewUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 flex flex-col gap-4 shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Print-Ready Sheet Preview</h3>
                <p className="text-xs text-slate-400">
                  {selectedPaper.name} • Fits <span className="text-emerald-400 font-bold">{sheetStats.count} photos</span> ({sheetStats.cols} cols × {sheetStats.rows} rows)
                </p>
              </div>
              <button
                onClick={() => setShowSheetModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto flex items-center justify-center bg-slate-950 p-4 rounded-xl border border-slate-800">
              <img src={sheetPreviewUrl} alt="Sheet Preview" className="max-w-full h-auto rounded shadow-lg border border-slate-700" />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSheetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                <FileDown className="w-4 h-4" /> Download PDF (Print Ready)
              </button>
              <button
                onClick={handleDownloadSheetPng}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEO & COMPLIANCE GUIDE SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-800/80 mt-12">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Official Passport, Visa & Govt Exam Standards
        </h2>
        <p className="text-xs text-slate-400 text-center mb-8 max-w-2xl mx-auto">
          Compliant with latest government portal guidelines, ICAO biometric specifications, and high-resolution photo print lab formats.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Sarkari & Govt Exams */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏛️</span>
                <h3 className="text-sm font-bold text-white">Sarkari / Govt Job Exams</h3>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Photo Size:</strong> 3.5×4.5 cm (20 KB – 50 KB strict limit).</li>
                <li>• <strong>Name & DOP:</strong> Candidate full name & Date of Photo printed on bottom white bar.</li>
                <li>• <strong>Signature Size:</strong> 140×60 px (10 KB – 20 KB) on clear white background.</li>
                <li>• <strong>Accepted by:</strong> SSC, UPSC, Railway (RRB), Police, State PSC & Banking.</li>
              </ul>
            </div>
            <span className="mt-4 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md text-center font-semibold">
              100% Portal Rejection-Proof
            </span>
          </div>

          {/* Card 2: Pakistan & Nadra */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🇵🇰</span>
                <h3 className="text-sm font-bold text-white">Pakistan Passport & Nadra</h3>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Size:</strong> 35×45 mm (413×531 px at 300 DPI) for Passport & CNIC.</li>
                <li>• <strong>Background:</strong> Plain pure white or light sky blue without texture.</li>
                <li>• <strong>Face Height:</strong> 70% to 80% coverage with neutral facial expression.</li>
                <li>• <strong>Embassy Visa:</strong> 2×2 inch (51×51 mm / 600×600 px) for visa applications.</li>
              </ul>
            </div>
            <span className="mt-4 text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md text-center font-semibold">
              NADRA Smart Card Standard
            </span>
          </div>

          {/* Card 3: US Visa & DV Lottery */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🇺🇸</span>
                <h3 className="text-sm font-bold text-white">US Visa & DV Lottery</h3>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Dimensions:</strong> Exactly 2×2 inch (600×600 px square at 300 DPI).</li>
                <li>• <strong>File Size:</strong> Strictly under 240 KB, 24-bit sRGB color.</li>
                <li>• <strong>Background:</strong> Pure off-white or plain white.</li>
                <li>• <strong>Head Ratio:</strong> 50% to 69% of total height (1 to 1 3/8 inches).</li>
              </ul>
            </div>
            <span className="mt-4 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md text-center font-semibold">
              State Dept Compliant
            </span>
          </div>

          {/* Card 4: Cyber Cafe Combo Sheet */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🖨️</span>
                <h3 className="text-sm font-bold text-white">Studio 4×6 Combo Sheet</h3>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Sheet Size:</strong> 4 × 6 inch standard photo paper (10×15 cm).</li>
                <li>• <strong>Combo Layout:</strong> 6 Passport Photos (35×45mm) + 4 Stamp Photos (20×25mm).</li>
                <li>• <strong>Cutting Guides:</strong> High-precision dashed scissor cutting lines.</li>
                <li>• <strong>Cost Saver:</strong> Get 10 customer photos on one budget print sheet.</li>
              </ul>
            </div>
            <span className="mt-4 text-[10px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-1 rounded-md text-center font-semibold">
              Cyber Cafe Best Seller
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
