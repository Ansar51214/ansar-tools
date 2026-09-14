'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Scissors, Upload, Download, RefreshCw, ZoomIn, ZoomOut,
  Eye, Undo2, Redo2, Palette, Sliders, Sparkles, Check,
  CheckCircle2, ShieldCheck, Zap, Image as ImageIcon, Copy,
  Eraser, Paintbrush, Pipette, Move, Maximize2, X,
  ArrowRight, Star, AlertCircle, RotateCcw, SplitSquareVertical,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Crosshair,
  Crop, Wand2, ShieldAlert
} from 'lucide-react';

// Preset Studio Backdrops
interface BackdropTheme {
  id: string;
  name: string;
  type: 'transparent' | 'color' | 'gradient';
  value: string;
}

const BACKDROP_PRESETS: BackdropTheme[] = [
  { id: 'transparent', name: 'Transparent (PNG)', type: 'transparent', value: 'transparent' },
  { id: 'white', name: 'Passport White (E-commerce)', type: 'color', value: '#FFFFFF' },
  { id: 'blue', name: 'Official Passport Blue', type: 'color', value: '#2563EB' },
  { id: 'cyan', name: 'Cyan Sky', type: 'color', value: '#06B6D4' },
  { id: 'gray', name: 'Studio Gray', type: 'color', value: '#64748B' },
  { id: 'black', name: 'Luxury Black', type: 'color', value: '#0F172A' },
  { id: 'red', name: 'Vibrant Red', type: 'color', value: '#DC2626' },
  { id: 'emerald', name: 'Emerald Green', type: 'color', value: '#059669' },
  { id: 'grad-cyber', name: 'Cyber Neon', type: 'gradient', value: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)' },
  { id: 'grad-sunset', name: 'Sunset Glow', type: 'gradient', value: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
  { id: 'grad-ocean', name: 'Deep Ocean', type: 'gradient', value: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
  { id: 'grad-minimal', name: 'Minimal Soft', type: 'gradient', value: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)' },
];

export default function BackgroundRemoverPage() {
  // --- STATE: Image & Processing ---
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageName, setImageName] = useState<string>('image');
  const [imageDims, setImageDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Tools & Modes: 'view' | 'adjust' (Move & Resize) | 'magic-wand' | 'erase' | 'restore'
  const [toolMode, setToolMode] = useState<'view' | 'adjust' | 'magic-wand' | 'erase' | 'restore'>('view');
  const [brushSize, setBrushSize] = useState<number>(35);

  // --- SUBJECT SCALE & POSITION ADJUSTMENT (Size Bara / Chhota & Move) ---
  const [subjectScale, setSubjectScale] = useState<number>(1.0); // 0.3x to 2.5x
  const [subjectPos, setSubjectPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasRatio, setCanvasRatio] = useState<'original' | 'passport' | '1:1' | '4:5'>('original');

  // --- CUTOUT CONFIGURATION & EDGE CLEANER (Blue Line / Fringe Removal) ---
  const [tolerance, setTolerance] = useState<number>(36); // 5 - 80
  const [cutoutMethod, setCutoutMethod] = useState<'boundary' | 'global'>('boundary');
  const [sampledBgColor, setSampledBgColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [edgeTrim, setEdgeTrim] = useState<number>(2); // 0 to 4 px erosion to shave outline
  const [deFringeLevel, setDeFringeLevel] = useState<number>(90); // 0% - 100% blue spill suppression

  // Background Customization
  const [selectedBackdrop, setSelectedBackdrop] = useState<BackdropTheme>(BACKDROP_PRESETS[0]);
  const [customBgColor, setCustomBgColor] = useState<string>('#FFFFFF');
  const [customBgImageSrc, setCustomBgImageSrc] = useState<string | null>(null);

  // Viewport & Comparison
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isShowingOriginal, setIsShowingOriginal] = useState<boolean>(false);
  const [splitCompare, setSplitCompare] = useState<number>(50);
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // History Stack
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // --- REFS ---
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const customBgImgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customBgFileInputRef = useRef<HTMLInputElement>(null);

  // Dragging Subject in Canvas
  const isDraggingSubjectRef = useRef<boolean>(false);
  const dragAnchorRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0, mouseY: 0, startX: 0, startY: 0
  });

  // Brush drawing state & History
  const isDrawingRef = useRef<boolean>(false);
  const historyStackRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef<number>(-1);

  // -------------------------------------------------------------
  // 1. COMPOSITE RENDER ENGINE
  // Composites background + scaled & positioned mask onto display canvas
  // -------------------------------------------------------------
  const compositeToDisplay = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const origCanvas = originalCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;

    if (!displayCanvas || !origCanvas || !maskCanvas) return;

    const origW = origCanvas.width;
    const origH = origCanvas.height;

    // Calculate canvas frame dimensions based on selected aspect ratio
    let targetW = origW;
    let targetH = origH;

    if (canvasRatio === '1:1') {
      const minDim = Math.min(origW, origH);
      targetW = minDim;
      targetH = minDim;
    } else if (canvasRatio === 'passport') {
      // 35:45 (7:9 aspect ratio standard for passports / ID)
      targetH = origH;
      targetW = Math.round(origH * (7 / 9));
    } else if (canvasRatio === '4:5') {
      targetH = origH;
      targetW = Math.round(origH * (4 / 5));
    }

    if (displayCanvas.width !== targetW || displayCanvas.height !== targetH) {
      displayCanvas.width = targetW;
      displayCanvas.height = targetH;
    }

    const ctx = displayCanvas.getContext('2d');
    if (!ctx) return;

    // A. Draw Background Layer
    ctx.clearRect(0, 0, targetW, targetH);

    if (customBgImgRef.current && selectedBackdrop.id === 'custom-img') {
      ctx.drawImage(customBgImgRef.current, 0, 0, targetW, targetH);
    } else if (selectedBackdrop.type === 'color') {
      ctx.fillStyle = selectedBackdrop.value;
      ctx.fillRect(0, 0, targetW, targetH);
    } else if (selectedBackdrop.type === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, targetW, targetH);
      if (selectedBackdrop.id === 'grad-cyber') {
        grad.addColorStop(0, '#7c3aed');
        grad.addColorStop(1, '#06b6d4');
      } else if (selectedBackdrop.id === 'grad-sunset') {
        grad.addColorStop(0, '#f97316');
        grad.addColorStop(1, '#ec4899');
      } else if (selectedBackdrop.id === 'grad-ocean') {
        grad.addColorStop(0, '#1e3a8a');
        grad.addColorStop(1, '#3b82f6');
      } else {
        grad.addColorStop(0, '#f8fafc');
        grad.addColorStop(1, '#cbd5e1');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, targetW, targetH);
    }

    // B. Calculate Scaled & Repositioned Subject Dimensions
    const destW = Math.round(origW * subjectScale);
    const destH = Math.round(origH * subjectScale);
    const destX = Math.round((targetW - destW) / 2 + subjectPos.x);
    const destY = Math.round((targetH - destH) / 2 + subjectPos.y);

    // C. Draw Cutout or Original
    if (isShowingOriginal) {
      ctx.drawImage(origCanvas, destX, destY, destW, destH);
    } else if (!isSplitMode) {
      ctx.drawImage(maskCanvas, destX, destY, destW, destH);
    } else {
      // Split Compare Mode: Left is Cutout, Right is Original
      const splitX = Math.round((splitCompare / 100) * targetW);

      // Draw Cutout on Left
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, targetH);
      ctx.clip();
      ctx.drawImage(maskCanvas, destX, destY, destW, destH);
      ctx.restore();

      // Draw Original on Right
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, targetW - splitX, targetH);
      ctx.clip();
      ctx.drawImage(origCanvas, destX, destY, destW, destH);
      ctx.restore();

      // Draw Divider Line
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(2, Math.round(targetW / 400));
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, targetH);
      ctx.stroke();
    }

    // D. Visual Boundary Box when in 'adjust' (Move & Resize) mode
    if (toolMode === 'adjust') {
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(destX, destY, destW, destH);

      // Corner handles
      const handleSize = 10;
      ctx.fillStyle = '#10B981';
      ctx.fillRect(destX - handleSize / 2, destY - handleSize / 2, handleSize, handleSize);
      ctx.fillRect(destX + destW - handleSize / 2, destY - handleSize / 2, handleSize, handleSize);
      ctx.fillRect(destX - handleSize / 2, destY + destH - handleSize / 2, handleSize, handleSize);
      ctx.fillRect(destX + destW - handleSize / 2, destY + destH - handleSize / 2, handleSize, handleSize);
      ctx.restore();
    }
  }, [
    isShowingOriginal, isSplitMode, splitCompare, selectedBackdrop,
    subjectScale, subjectPos, canvasRatio, toolMode
  ]);

  // Re-render when attributes change
  useEffect(() => {
    if (imageLoaded) {
      compositeToDisplay();
    }
  }, [imageLoaded, compositeToDisplay]);

  // -------------------------------------------------------------
  // 2. SMART AUTO-CUTOUT ALGORITHM + EDGE CLEANER & BLUE LINE REMOVAL
  // -------------------------------------------------------------
  const executeSmartCutout = (
    targetTol: number,
    targetColor: { r: number; g: number; b: number } | null,
    method: 'boundary' | 'global' = cutoutMethod,
    trimPx: number = edgeTrim,
    deFringe: number = deFringeLevel
  ) => {
    const origCanvas = originalCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!origCanvas || !maskCanvas) return;

    setIsProcessing(true);
    setStatusMessage('Carving background & cleaning blue fringe...');

    setTimeout(() => {
      const w = origCanvas.width;
      const h = origCanvas.height;
      const origCtx = origCanvas.getContext('2d');
      const maskCtx = maskCanvas.getContext('2d');
      if (!origCtx || !maskCtx) return;

      const srcData = origCtx.getImageData(0, 0, w, h);
      const srcPixels = srcData.data;

      const maskData = origCtx.createImageData(w, h);
      const maskPixels = maskData.data;

      // Copy RGB from source
      for (let i = 0; i < srcPixels.length; i += 4) {
        maskPixels[i] = srcPixels[i];
        maskPixels[i + 1] = srcPixels[i + 1];
        maskPixels[i + 2] = srcPixels[i + 2];
        maskPixels[i + 3] = srcPixels[i + 3];
      }

      // Detect perimeter colors if none provided
      let bgColors: { r: number; g: number; b: number }[] = [];
      if (targetColor) {
        bgColors = [targetColor];
      } else {
        const samples: { r: number; g: number; b: number }[] = [];
        const stepX = Math.max(1, Math.floor(w / 20));
        const stepY = Math.max(1, Math.floor(h / 20));

        for (let x = 0; x < w; x += stepX) {
          const topIdx = (0 * w + x) * 4;
          const botIdx = ((h - 1) * w + x) * 4;
          samples.push({ r: srcPixels[topIdx], g: srcPixels[topIdx + 1], b: srcPixels[topIdx + 2] });
          samples.push({ r: srcPixels[botIdx], g: srcPixels[botIdx + 1], b: srcPixels[botIdx + 2] });
        }
        for (let y = 0; y < h; y += stepY) {
          const leftIdx = (y * w + 0) * 4;
          const rightIdx = (y * w + (w - 1)) * 4;
          samples.push({ r: srcPixels[leftIdx], g: srcPixels[leftIdx + 1], b: srcPixels[leftIdx + 2] });
          samples.push({ r: srcPixels[rightIdx], g: srcPixels[rightIdx + 1], b: srcPixels[rightIdx + 2] });
        }

        let rSum = 0, gSum = 0, bSum = 0;
        for (const s of samples) {
          rSum += s.r;
          gSum += s.g;
          bSum += s.b;
        }
        const avgR = Math.round(rSum / samples.length);
        const avgG = Math.round(gSum / samples.length);
        const avgB = Math.round(bSum / samples.length);
        bgColors = [{ r: avgR, g: avgG, b: avgB }];
        setSampledBgColor(bgColors[0]);
      }

      const tol = targetTol;
      const tolSq = (tol * 2.8) * (tol * 2.8);
      const { r: tr, g: tg, b: tb } = bgColors[0];

      // --- STEP A: INITIAL FLOOD FILL SEGMENTATION ---
      if (method === 'boundary') {
        // BOUNDARY FLOOD FILL (Protects subject inside, only clears connected border background)
        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let qHead = 0;
        let qTail = 0;

        const checkAndSeed = (x: number, y: number) => {
          const idx = y * w + x;
          if (visited[idx]) return;
          const p = idx * 4;
          const r = srcPixels[p];
          const g = srcPixels[p + 1];
          const b = srcPixels[p + 2];
          const distSq = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;
          if (distSq <= tolSq * 1.6) {
            visited[idx] = 1;
            queue[qTail++] = idx;
          }
        };

        for (let x = 0; x < w; x++) {
          checkAndSeed(x, 0);
          checkAndSeed(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          checkAndSeed(0, y);
          checkAndSeed(w - 1, y);
        }

        while (qHead < qTail) {
          const currIdx = queue[qHead++];
          const cx = currIdx % w;
          const cy = Math.floor(currIdx / w);
          const p = currIdx * 4;

          const r = srcPixels[p];
          const g = srcPixels[p + 1];
          const b = srcPixels[p + 2];
          const distSq = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;

          // Crisp cutoff: Erase background completely without leaving semi-transparent blue fringe
          if (distSq < tolSq * 0.95) {
            maskPixels[p + 3] = 0;
          } else {
            // Very tight 1-pixel edge feathering
            const edgeRatio = Math.max(0, Math.min(1, (distSq - tolSq * 0.95) / (tolSq * 0.3)));
            maskPixels[p + 3] = Math.round(Math.pow(edgeRatio, 1.5) * 255);
          }

          const neighbors = [
            cx > 0 ? currIdx - 1 : -1,
            cx < w - 1 ? currIdx + 1 : -1,
            cy > 0 ? currIdx - w : -1,
            cy < h - 1 ? currIdx + w : -1,
          ];

          for (const n of neighbors) {
            if (n >= 0 && !visited[n]) {
              const np = n * 4;
              const nr = srcPixels[np];
              const ng = srcPixels[np + 1];
              const nb = srcPixels[np + 2];
              const ndistSq = (nr - tr) ** 2 + (ng - tg) ** 2 + (nb - tb) ** 2;
              if (ndistSq <= tolSq * 1.6) {
                visited[n] = 1;
                queue[qTail++] = n;
              }
            }
          }
        }
      } else {
        // GLOBAL COLOR CUTOUT
        for (let i = 0; i < srcPixels.length; i += 4) {
          const r = srcPixels[i];
          const g = srcPixels[i + 1];
          const b = srcPixels[i + 2];
          const distSq = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;

          if (distSq < tolSq * 0.95) {
            maskPixels[i + 3] = 0;
          } else if (distSq < tolSq * 1.3) {
            const ratio = (distSq - tolSq * 0.95) / (tolSq * 0.35);
            maskPixels[i + 3] = Math.round(ratio * 255);
          } else {
            maskPixels[i + 3] = 255;
          }
        }
      }

      // --- STEP B: EDGE TRIM / EROSION (Shaves leftover blue/background outline inwards) ---
      if (trimPx > 0) {
        for (let step = 0; step < trimPx; step++) {
          const alphaSnapshot = new Uint8Array(w * h);
          for (let i = 0; i < w * h; i++) {
            alphaSnapshot[i] = maskPixels[i * 4 + 3];
          }

          for (let cy = 1; cy < h - 1; cy++) {
            for (let cx = 1; cx < w - 1; cx++) {
              const idx = cy * w + cx;
              const p = idx * 4;
              const alpha = alphaSnapshot[idx];

              if (alpha > 0) {
                // If it borders any 0-alpha pixel, shave it
                if (
                  alphaSnapshot[idx - 1] === 0 ||
                  alphaSnapshot[idx + 1] === 0 ||
                  alphaSnapshot[idx - w] === 0 ||
                  alphaSnapshot[idx + w] === 0
                ) {
                  maskPixels[p + 3] = 0;
                }
              }
            }
          }
        }
      }

      // --- STEP C: COLOR SPILL DE-CONTAMINATION (Neutralizes blue/cyan spill on hair & ears) ---
      if (deFringe > 0 && bgColors.length > 0) {
        const factor = deFringe / 100;
        const isBlueBg = tb > tr && tb > tg;
        const isGreenBg = tg > tr && tg > tb;

        for (let cy = 2; cy < h - 2; cy++) {
          for (let cx = 2; cx < w - 2; cx++) {
            const idx = cy * w + cx;
            const p = idx * 4;
            const a = maskPixels[p + 3];

            if (a > 0) {
              // Check if pixel is within 3-4 pixels of transparent edge
              const isNearEdge =
                maskPixels[(idx - 1) * 4 + 3] === 0 ||
                maskPixels[(idx + 1) * 4 + 3] === 0 ||
                maskPixels[(idx - w) * 4 + 3] === 0 ||
                maskPixels[(idx + w) * 4 + 3] === 0 ||
                maskPixels[(idx - 2) * 4 + 3] === 0 ||
                maskPixels[(idx + 2) * 4 + 3] === 0 ||
                maskPixels[(idx - w * 2) * 4 + 3] === 0 ||
                maskPixels[(idx + w * 2) * 4 + 3] === 0;

              if (isNearEdge) {
                const r = maskPixels[p];
                const g = maskPixels[p + 1];
                const b = maskPixels[p + 2];

                if (isBlueBg && (b > r || b > g)) {
                  // Suppress excess blue on hair, ears, collar
                  const maxRG = Math.max(r, g);
                  const excess = b - maxRG;
                  if (excess > 0) {
                    maskPixels[p + 2] = Math.max(0, Math.round(b - excess * factor));
                  }
                } else if (isGreenBg && (g > r || g > b)) {
                  const maxRB = Math.max(r, b);
                  const excess = g - maxRB;
                  if (excess > 0) {
                    maskPixels[p + 1] = Math.max(0, Math.round(g - excess * factor));
                  }
                }
              }
            }
          }
        }
      }

      maskCtx.putImageData(maskData, 0, 0);

      // Push to undo history stack
      historyStackRef.current = [maskData];
      historyIndexRef.current = 0;
      setCanUndo(false);
      setCanRedo(false);

      compositeToDisplay();
      setIsProcessing(false);
      setStatusMessage('');
    }, 20);
  };

  // -------------------------------------------------------------
  // 3. FILE INGESTION & INITIAL LOAD
  // -------------------------------------------------------------
  const handleLoadImage = (file: File) => {
    setIsProcessing(true);
    setStatusMessage('Reading photo & building HD canvas...');

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        setImageName(file.name);
        setImageDims({ width: w, height: h });

        // Initialize Original Buffer Canvas
        let origCanvas = originalCanvasRef.current;
        if (!origCanvas) {
          origCanvas = document.createElement('canvas');
          originalCanvasRef.current = origCanvas;
        }
        origCanvas.width = w;
        origCanvas.height = h;
        const origCtx = origCanvas.getContext('2d');
        if (origCtx) {
          origCtx.drawImage(img, 0, 0);
        }

        // Initialize Mask Canvas
        let maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) {
          maskCanvas = document.createElement('canvas');
          maskCanvasRef.current = maskCanvas;
        }
        maskCanvas.width = w;
        maskCanvas.height = h;
        const maskCtx = maskCanvas.getContext('2d');
        if (maskCtx) {
          maskCtx.drawImage(img, 0, 0);
        }

        setImageLoaded(true);
        setZoomLevel(1);
        setSubjectScale(1.0);
        setSubjectPos({ x: 0, y: 0 });

        // Run smart cutout automatically with edge trim & de-fringing enabled
        executeSmartCutout(tolerance, null, 'boundary', edgeTrim, deFringeLevel);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Demo Portrait
  const handleLoadDemo = () => {
    setIsProcessing(true);
    setStatusMessage('Generating high-res demo portrait...');

    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard blue passport studio background
    ctx.fillStyle = '#2563EB';
    ctx.fillRect(0, 0, 900, 1100);

    // Vignette
    const bgGrad = ctx.createRadialGradient(450, 500, 100, 450, 500, 600);
    bgGrad.addColorStop(0, '#3B82F6');
    bgGrad.addColorStop(1, '#1D4ED8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 900, 1100);

    // Shoulders & Suit
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(150, 1100);
    ctx.quadraticCurveTo(450, 650, 750, 1100);
    ctx.fill();

    // Shirt Collar
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(380, 800);
    ctx.lineTo(450, 920);
    ctx.lineTo(520, 800);
    ctx.lineTo(480, 720);
    ctx.lineTo(420, 720);
    ctx.closePath();
    ctx.fill();

    // Red Tie
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(435, 730);
    ctx.lineTo(465, 730);
    ctx.lineTo(475, 960);
    ctx.lineTo(450, 1020);
    ctx.lineTo(425, 960);
    ctx.closePath();
    ctx.fill();

    // Neck
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(400, 580, 100, 150);

    // Head / Face
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.ellipse(450, 460, 170, 220, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(450, 320, 190, 140, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(380, 450, 16, 0, Math.PI * 2);
    ctx.arc(520, 450, 16, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(450, 520, 50, 0.2, Math.PI - 0.2);
    ctx.stroke();

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'demo_passport_portrait.png', { type: 'image/png' });
        handleLoadImage(file);
      }
    });
  };

  // -------------------------------------------------------------
  // 4. INTERACTIVE DRAG TO MOVE & BRUSH APPLICATION
  // -------------------------------------------------------------
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded) return;
    const { x, y } = getCanvasCoordinates(e);

    // MODE 1: MOVE & POSITION DRAGGING
    if (toolMode === 'adjust') {
      isDraggingSubjectRef.current = true;
      dragAnchorRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: subjectPos.x,
        startY: subjectPos.y,
      };
      return;
    }

    // MODE 2: MAGIC WAND
    if (toolMode === 'magic-wand') {
      const origCanvas = originalCanvasRef.current;
      const displayCanvas = displayCanvasRef.current;
      if (origCanvas && displayCanvas) {
        const targetW = displayCanvas.width;
        const targetH = displayCanvas.height;
        const destW = Math.round(origCanvas.width * subjectScale);
        const destH = Math.round(origCanvas.height * subjectScale);
        const destX = Math.round((targetW - destW) / 2 + subjectPos.x);
        const destY = Math.round((targetH - destH) / 2 + subjectPos.y);

        const origX = (x - destX) / subjectScale;
        const origY = (y - destY) / subjectScale;

        if (origX >= 0 && origX < origCanvas.width && origY >= 0 && origY < origCanvas.height) {
          const ctx = origCanvas.getContext('2d');
          if (ctx) {
            const pixel = ctx.getImageData(Math.round(origX), Math.round(origY), 1, 1).data;
            const picked = { r: pixel[0], g: pixel[1], b: pixel[2] };
            setSampledBgColor(picked);
            executeSmartCutout(tolerance, picked, cutoutMethod, edgeTrim, deFringeLevel);
          }
        }
      }
      setToolMode('view');
      return;
    }

    // MODE 3: ERASE / RESTORE BRUSH
    if (toolMode === 'erase' || toolMode === 'restore') {
      isDrawingRef.current = true;
      applyBrush(x, y);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // A. Handle Subject Dragging in Adjust Mode
    if (isDraggingSubjectRef.current && toolMode === 'adjust') {
      const canvas = displayCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const dx = (e.clientX - dragAnchorRef.current.mouseX) * scaleX;
      const dy = (e.clientY - dragAnchorRef.current.mouseY) * scaleY;
      setSubjectPos({
        x: Math.round(dragAnchorRef.current.startX + dx),
        y: Math.round(dragAnchorRef.current.startY + dy),
      });
      return;
    }

    // B. Handle Brush Stroke
    if (!isDrawingRef.current) return;
    if (toolMode === 'erase' || toolMode === 'restore') {
      const { x, y } = getCanvasCoordinates(e);
      applyBrush(x, y);
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDraggingSubjectRef.current) {
      isDraggingSubjectRef.current = false;
    }

    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas) {
        const ctx = maskCanvas.getContext('2d');
        if (ctx) {
          const imgData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
          const newHistory = historyStackRef.current.slice(0, historyIndexRef.current + 1);
          newHistory.push(imgData);
          historyStackRef.current = newHistory;
          historyIndexRef.current = newHistory.length - 1;
          setCanUndo(true);
          setCanRedo(false);
        }
      }
    }
  };

  // Brush execution with coordinate mapping
  const applyBrush = (dispX: number, dispY: number) => {
    const maskCanvas = maskCanvasRef.current;
    const origCanvas = originalCanvasRef.current;
    const displayCanvas = displayCanvasRef.current;
    if (!maskCanvas || !origCanvas || !displayCanvas) return;

    const targetW = displayCanvas.width;
    const targetH = displayCanvas.height;
    const destW = Math.round(origCanvas.width * subjectScale);
    const destH = Math.round(origCanvas.height * subjectScale);
    const destX = Math.round((targetW - destW) / 2 + subjectPos.x);
    const destY = Math.round((targetH - destH) / 2 + subjectPos.y);

    const maskX = (dispX - destX) / subjectScale;
    const maskY = (dispY - destY) / subjectScale;
    const mappedRadius = brushSize / subjectScale;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    maskCtx.save();
    maskCtx.beginPath();
    maskCtx.arc(maskX, maskY, mappedRadius, 0, Math.PI * 2);

    if (toolMode === 'erase') {
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.fillStyle = 'rgba(0,0,0,1)';
      maskCtx.fill();
    } else if (toolMode === 'restore') {
      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.clip();
      maskCtx.drawImage(origCanvas, 0, 0);
    }

    maskCtx.restore();
    compositeToDisplay();
  };

  // Mouse Wheel to scale subject in adjust mode
  const handleCanvasWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (toolMode === 'adjust') {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      setSubjectScale((s) => Math.max(0.3, Math.min(2.5, +(s + delta).toFixed(2))));
    }
  };

  // Undo & Redo
  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevData = historyStackRef.current[historyIndexRef.current];
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas && prevData) {
        const ctx = maskCanvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(prevData, 0, 0);
          compositeToDisplay();
        }
      }
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(true);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyStackRef.current.length - 1) {
      historyIndexRef.current += 1;
      const nextData = historyStackRef.current[historyIndexRef.current];
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas && nextData) {
        const ctx = maskCanvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(nextData, 0, 0);
          compositeToDisplay();
        }
      }
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyStackRef.current.length - 1);
    }
  };

  // -------------------------------------------------------------
  // 5. EXPORT & DOWNLOAD
  // -------------------------------------------------------------
  const handleDownload = (format: 'png' | 'jpg') => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;

    const baseName = imageName.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');

    if (format === 'png') {
      link.href = displayCanvas.toDataURL('image/png');
      link.download = `${baseName}_cutout.png`;
    } else {
      link.href = displayCanvas.toDataURL('image/jpeg', 0.95);
      link.download = `${baseName}_studio.jpg`;
    }

    link.click();
  };

  const handleCopyClipboard = async () => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;

    try {
      displayCanvas.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 3000);
      }, 'image/png');
    } catch {
      alert('Your browser blocked direct clipboard access. Please use the Download PNG button.');
    }
  };

  // Custom Backdrop Upload
  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const img = new Image();
        img.onload = () => {
          customBgImgRef.current = img;
          setCustomBgImageSrc(dataUrl);
          setSelectedBackdrop({
            id: 'custom-img',
            name: 'Custom Photo',
            type: 'transparent',
            value: 'custom',
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-950/90 border-b border-slate-800 py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free • Unlimited Full HD Downloads • Clean Edge De-Fringe</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Pro Background Remover & Cutout Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Erase backgrounds from portraits, product photos, logos, and signatures with zero blue edge fringes.
            Resize & reposition subjects, replace with transparent PNG, passport white, solid studio colors, or custom HD backdrops.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* ===================================================================
           VIEW 1: UPLOAD DROPZONE (When No Image is Loaded)
           =================================================================== */}
        {!imageLoaded && (
          <div className="max-w-3xl w-full mx-auto flex flex-col gap-6 py-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f && f.type.startsWith('image/')) {
                  handleLoadImage(f);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-3xl p-10 sm:p-16 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all flex flex-col items-center justify-center gap-4 shadow-2xl group"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white group-hover:scale-110 transition-transform">
                <Scissors className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Upload an image to remove background
                </h3>
                <p className="text-xs text-slate-400">
                  Drag and drop, or <span className="text-emerald-400 underline font-semibold">browse file</span> (JPG, PNG, WebP)
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 pt-2">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Private (Runs in Browser)</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Zero Blue Fringe / Clean Edges</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-blue-400" /> Full HD Resolution</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleLoadImage(f);
                }}
              />
            </div>

            {/* Quick Demo Button */}
            <div className="text-center">
              <span className="text-xs text-slate-500 block mb-2">Want to test with a blue passport backdrop demo?</span>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 inline-flex items-center gap-2 transition-all shadow-md hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-400" /> Load Passport Portrait (Blue Backdrop Demo)
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
           VIEW 2: FULL CUTOUT STUDIO WORKSPACE (When Image is Loaded)
           =================================================================== */}
        {imageLoaded && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* LEFT COLUMN: INTERACTIVE CANVAS VIEWPORT */}
            <div className="flex-1 w-full flex flex-col bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative">
              
              {/* TOP TOOLBAR: Info, Tools, Undo */}
              <div className="w-full mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* File Title & Resolution */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white max-w-[150px] sm:max-w-[220px] truncate" title={imageName}>
                    {imageName}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg">
                    {imageDims.width}×{imageDims.height}px
                  </span>
                </div>

                {/* Primary Tool Buttons */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setToolMode('view')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      toolMode === 'view' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => setToolMode('adjust')}
                    className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      toolMode === 'adjust' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Move position & resize subject size"
                  >
                    <Move className="w-3.5 h-3.5" /> Move & Resize
                  </button>
                  <button
                    type="button"
                    onClick={() => setToolMode('magic-wand')}
                    className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      toolMode === 'magic-wand' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Click any background pixel to erase"
                  >
                    <Pipette className="w-3.5 h-3.5" /> Magic Wand
                  </button>
                  <button
                    type="button"
                    onClick={() => setToolMode('erase')}
                    className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      toolMode === 'erase' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Erase background remnants with brush"
                  >
                    <Eraser className="w-3.5 h-3.5" /> Erase
                  </button>
                  <button
                    type="button"
                    onClick={() => setToolMode('restore')}
                    className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      toolMode === 'restore' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Restore subject parts with brush"
                  >
                    <Paintbrush className="w-3.5 h-3.5" /> Restore
                  </button>
                </div>

                {/* Undo / Redo & Zoom Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700 rounded-xl disabled:opacity-30 transition-all"
                    title="Undo brush stroke"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700 rounded-xl disabled:opacity-30 transition-all"
                    title="Redo brush stroke"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                  
                  {/* Zoom Controls */}
                  <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl ml-1 text-slate-300">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                      className="p-1.5 hover:text-white"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono px-1 font-semibold">{Math.round(zoomLevel * 100)}%</span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                      className="p-1.5 hover:text-white"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    {zoomLevel !== 1 && (
                      <button
                        type="button"
                        onClick={() => setZoomLevel(1)}
                        className="text-[10px] text-emerald-400 px-1.5 hover:underline"
                        title="Reset 100%"
                      >
                        100%
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Adjust / Move Hint Sub-Bar */}
              {toolMode === 'adjust' && (
                <div className="w-full mb-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-purple-300 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Move className="w-4 h-4 text-purple-400" />
                    <span className="font-semibold">
                      Drag image anywhere on canvas to reposition • Use mouse wheel or the Size Slider on the right to resize
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSubjectPos({ x: 0, y: 0 })}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-all text-[11px]"
                    >
                      Center Subject
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubjectScale(1.0);
                        setSubjectPos({ x: 0, y: 0 });
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all text-[11px]"
                    >
                      Reset (100%)
                    </button>
                  </div>
                </div>
              )}

              {/* Brush Settings Sub-Bar */}
              {(toolMode === 'erase' || toolMode === 'restore') && (
                <div className="w-full mb-3 p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">
                      {toolMode === 'erase' ? 'Eraser Size:' : 'Restore Brush Size:'}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="flex-1 max-w-sm accent-emerald-500"
                  />
                  <span className="text-slate-400 text-[11px] hidden sm:inline">
                    Click & drag on image to touch up
                  </span>
                </div>
              )}

              {/* Eyedropper Notice */}
              {toolMode === 'magic-wand' && (
                <div className="w-full mb-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                  <span>🎯 Magic Wand Active: Click on any background color pixel in the image to remove it!</span>
                  <button
                    type="button"
                    onClick={() => setToolMode('view')}
                    className="text-white hover:underline text-[11px] font-bold"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Compare / Split Bar */}
              <div className="w-full mb-2 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onMouseDown={() => setIsShowingOriginal(true)}
                    onMouseUp={() => setIsShowingOriginal(false)}
                    onMouseLeave={() => setIsShowingOriginal(false)}
                    onTouchStart={() => setIsShowingOriginal(true)}
                    onTouchEnd={() => setIsShowingOriginal(false)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors select-none cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" /> Hold to View Original
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSplitMode(!isSplitMode)}
                    className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                      isSplitMode
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <SplitSquareVertical className="w-3.5 h-3.5 text-emerald-400" /> Split Compare
                  </button>
                </div>

                {isSplitMode && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px]">Split: {splitCompare}%</span>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={splitCompare}
                      onChange={(e) => setSplitCompare(Number(e.target.value))}
                      className="w-24 accent-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* =========================================================
                 CANVAS VIEWPORT CONTAINER
                 ========================================================= */}
              <div
                className="relative w-full min-h-[440px] max-h-[70vh] flex items-center justify-center p-3 rounded-2xl overflow-auto border border-slate-800 shadow-inner"
                style={{
                  backgroundColor: '#090D16',
                  backgroundImage: selectedBackdrop.id === 'transparent'
                    ? 'repeating-conic-gradient(#1E293B 0% 25%, #0F172A 0% 50%) 50% / 20px 20px'
                    : 'none',
                }}
              >
                {/* Processing Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin" />
                    <span className="text-xs font-semibold text-white">{statusMessage || 'Processing...'}</span>
                  </div>
                )}

                {/* Display Canvas */}
                <div
                  className="transition-transform duration-75 origin-center flex items-center justify-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <canvas
                    ref={displayCanvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    onWheel={handleCanvasWheel}
                    className={`max-w-full max-h-[620px] w-auto h-auto object-contain rounded-lg shadow-2xl select-none ${
                      toolMode === 'adjust'
                        ? 'cursor-grab active:cursor-grabbing'
                        : toolMode === 'magic-wand'
                        ? 'cursor-crosshair'
                        : toolMode === 'erase' || toolMode === 'restore'
                        ? 'cursor-crosshair'
                        : 'cursor-default'
                    }`}
                  />
                </div>
              </div>

              {/* Bottom Action / Download Bar */}
              <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload('png')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4" /> Download Full HD PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('jpg')}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    Download Studio JPG
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyClipboard}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
                    title="Copy transparent PNG to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedNotification ? 'Copied to Clipboard!' : 'Copy'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setImageLoaded(false);
                    setCustomBgImageSrc(null);
                    customBgImgRef.current = null;
                    historyStackRef.current = [];
                    setSubjectScale(1.0);
                    setSubjectPos({ x: 0, y: 0 });
                  }}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Upload Different Photo
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTROLS & ADJUSTMENTS */}
            <div className="w-full lg:w-96 flex flex-col gap-4">
              
              {/* =========================================================
                 CARD 1: CLEAN EDGE & REMOVE BLUE LINE (DE-FRINGE & TRIM)
                 ========================================================= */}
              <div className="bg-slate-950 border border-blue-500/40 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-400" /> Clean Edge (Remove Blue Line)
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEdgeTrim(2);
                      setDeFringeLevel(90);
                      executeSmartCutout(tolerance, sampledBgColor, cutoutMethod, 2, 90);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Reset
                  </button>
                </div>

                {/* Blue Line Spill Suppression Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">Remove Blue Spill / Fringe:</span>
                    <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {deFringeLevel}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={deFringeLevel}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDeFringeLevel(val);
                      executeSmartCutout(tolerance, sampledBgColor, cutoutMethod, edgeTrim, val);
                    }}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Neutralizes blue/cyan reflection on hair, ears, and neck into natural tones.
                  </span>
                </div>

                {/* Edge Trim / Erosion Buttons */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-300 font-semibold">Trim Border Line (Shave Outer Edges):</span>
                    <span className="font-mono text-xs text-blue-400">{edgeTrim}px</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: '0px (Off)', px: 0 },
                      { label: '1px', px: 1 },
                      { label: '2px (Best)', px: 2 },
                      { label: '3px (Deep)', px: 3 },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => {
                          setEdgeTrim(btn.px);
                          executeSmartCutout(tolerance, sampledBgColor, cutoutMethod, btn.px, deFringeLevel);
                        }}
                        className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          edgeTrim === btn.px
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Eats away the outer 1-2 pixels of residual blue background border cleanly.
                  </span>
                </div>
              </div>

              {/* =========================================================
                 CARD 2: SUBJECT SIZE & POSITION (Bara / Chhota & Move)
                 ========================================================= */}
              <div className="bg-slate-950 border border-purple-500/30 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Move className="w-4 h-4 text-purple-400" /> Image Size & Placement
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSubjectScale(1.0);
                      setSubjectPos({ x: 0, y: 0 });
                    }}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Reset (100%)
                  </button>
                </div>

                {/* Size Slider (Bara / Chhota) */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">Subject Size (Bara / Chhota):</span>
                    <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {Math.round(subjectScale * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSubjectScale((s) => Math.max(0.3, +(s - 0.05).toFixed(2)))}
                      className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200"
                      title="Smaller"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0.4"
                      max="2.2"
                      step="0.02"
                      value={subjectScale}
                      onChange={(e) => setSubjectScale(Number(e.target.value))}
                      className="flex-1 accent-purple-500 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setSubjectScale((s) => Math.min(2.5, +(s + 0.05).toFixed(2)))}
                      className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200"
                      title="Bigger"
                    >
                      +
                    </button>
                  </div>

                  {/* Quick Scale Presets */}
                  <div className="grid grid-cols-4 gap-1.5 mt-2">
                    {[
                      { label: '70%', val: 0.7 },
                      { label: '100%', val: 1.0 },
                      { label: '125%', val: 1.25 },
                      { label: '150%', val: 1.5 },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setSubjectScale(p.val)}
                        className={`py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          Math.abs(subjectScale - p.val) < 0.03
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Position Adjustment (Move Left, Right, Up, Down) */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-300 font-semibold">Reposition Image (Drag or Nudge):</span>
                    <button
                      type="button"
                      onClick={() => setToolMode('adjust')}
                      className={`text-[10px] px-2 py-0.5 rounded font-bold border transition-all ${
                        toolMode === 'adjust'
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-slate-900 text-purple-400 border-purple-500/30 hover:bg-purple-600/20'
                      }`}
                    >
                      {toolMode === 'adjust' ? '✓ Drag Mode Active' : 'Enable Drag on Canvas'}
                    </button>
                  </div>

                  {/* Nudge Buttons Pad */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
                      <div />
                      <button
                        type="button"
                        onClick={() => setSubjectPos((p) => ({ ...p, y: p.y - 20 }))}
                        className="h-7 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-lg flex items-center justify-center text-slate-200"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <div />
                      <button
                        type="button"
                        onClick={() => setSubjectPos((p) => ({ ...p, x: p.x - 20 }))}
                        className="h-7 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-lg flex items-center justify-center text-slate-200"
                        title="Move Left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubjectPos({ x: 0, y: 0 })}
                        className="h-7 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center text-[10px] font-bold text-purple-300"
                        title="Center"
                      >
                        Center
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubjectPos((p) => ({ ...p, x: p.x + 20 }))}
                        className="h-7 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-lg flex items-center justify-center text-slate-200"
                        title="Move Right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div />
                      <button
                        type="button"
                        onClick={() => setSubjectPos((p) => ({ ...p, y: p.y + 20 }))}
                        className="h-7 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-lg flex items-center justify-center text-slate-200"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <div />
                    </div>

                    <div className="flex-1 flex flex-col gap-1.5 text-[11px] text-slate-400">
                      <div className="flex justify-between">
                        <span>X Offset:</span>
                        <span className="font-mono text-slate-200">{subjectPos.x}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Y Offset:</span>
                        <span className="font-mono text-slate-200">{subjectPos.y}px</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSubjectPos({ x: 0, y: Math.round(imageDims.height * 0.08) });
                          setSubjectScale(1.15);
                        }}
                        className="mt-1 py-1 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-purple-300 hover:text-white transition-all text-center"
                      >
                        Passport Headshot Auto-Align
                      </button>
                    </div>
                  </div>
                </div>

                {/* Canvas Aspect Ratio / Crop Frame */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold flex items-center gap-1">
                      <Crop className="w-3.5 h-3.5 text-purple-400" /> Frame Ratio:
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'original', name: 'Original' },
                      { id: 'passport', name: 'Passport' },
                      { id: '1:1', name: '1:1 DP' },
                      { id: '4:5', name: '4:5 Studio' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setCanvasRatio(r.id as any)}
                        className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          canvasRatio === r.id
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 3: BACKDROP PRESETS & COLORS */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-emerald-400" /> Choose New Background
                  </h3>
                  <button
                    type="button"
                    onClick={() => customBgFileInputRef.current?.click()}
                    className="text-[11px] text-emerald-400 hover:underline font-semibold"
                  >
                    + Custom Photo
                  </button>
                  <input
                    ref={customBgFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCustomBgUpload}
                  />
                </div>

                {/* Preset Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {BACKDROP_PRESETS.map((b) => {
                    const isSelected = selectedBackdrop.id === b.id && !customBgImageSrc;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setCustomBgImageSrc(null);
                          customBgImgRef.current = null;
                          setSelectedBackdrop(b);
                        }}
                        className={`h-12 rounded-xl border flex flex-col items-center justify-center p-1 relative transition-all overflow-hidden ${
                          isSelected
                            ? 'ring-2 ring-emerald-500 border-emerald-500 scale-105 shadow-md shadow-emerald-500/20'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                        title={b.name}
                      >
                        <div
                          className="w-full h-full rounded-lg"
                          style={{
                            background: b.id === 'transparent'
                              ? 'repeating-conic-gradient(#334155 0% 25%, #0f172a 0% 50%) 50% / 10px 10px'
                              : b.value
                          }}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Hex Color */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Custom Solid Hex:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customBgColor}
                      onChange={(e) => {
                        setCustomBgColor(e.target.value);
                        setCustomBgImageSrc(null);
                        customBgImgRef.current = null;
                        setSelectedBackdrop({
                          id: 'custom-hex',
                          name: 'Custom Hex',
                          type: 'color',
                          value: e.target.value,
                        });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="font-mono text-slate-300 font-semibold">{customBgColor}</span>
                  </div>
                </div>
              </div>

              {/* CARD 4: CUTOUT SENSITIVITY SLIDER */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-400" /> Sensitivity & Mode
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setTolerance(36);
                      executeSmartCutout(36, sampledBgColor, cutoutMethod, edgeTrim, deFringeLevel);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Reset
                  </button>
                </div>

                {/* Algorithm Mode Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCutoutMethod('boundary');
                      executeSmartCutout(tolerance, sampledBgColor, 'boundary', edgeTrim, deFringeLevel);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-semibold transition-all ${
                      cutoutMethod === 'boundary'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🛡️ Smart Flood-Fill
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCutoutMethod('global');
                      executeSmartCutout(tolerance, sampledBgColor, 'global', edgeTrim, deFringeLevel);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-semibold transition-all ${
                      cutoutMethod === 'global'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🌐 Global Eraser
                  </button>
                </div>

                {/* Sensitivity Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400">Color Sensitivity (Tolerance)</span>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {tolerance}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="75"
                    value={tolerance}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTolerance(val);
                      executeSmartCutout(val, sampledBgColor, cutoutMethod, edgeTrim, deFringeLevel);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Magic Wand Button */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setToolMode('magic-wand')}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all"
                  >
                    <Pipette className="w-4 h-4 text-amber-400" /> Click to Pick Background Color
                  </button>
                </div>
              </div>

              {/* CARD 5: 1-CLICK EXPORT */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-400" /> 1-Click Export Formats
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDownload('png')}
                    className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group"
                  >
                    <strong className="text-white group-hover:text-emerald-400">PNG Cutout</strong>
                    <span className="text-[10px] text-slate-400">Lossless Transparent</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('jpg')}
                    className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group"
                  >
                    <strong className="text-white group-hover:text-emerald-400">Studio JPG</strong>
                    <span className="text-[10px] text-slate-400">Full Resolution</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
           SEO, USER GUIDES & BENEFITS
           =================================================================== */}
        <section className="border-t border-slate-800/80 pt-12 mt-6">
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            The Ultimate Online Background Remover
          </h2>
          <p className="text-xs text-slate-400 text-center mb-10 max-w-2xl mx-auto">
            Engineered for photographers, online sellers, students, and graphic designers who demand pixel-perfect cutouts without blue line fringes or paying subscriptions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">No Blue Edge Lines</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automatic De-Fringe & Edge Trim removes all blue outline artifacts around hair, ears, and collars from passport photos.
                </p>
              </div>
              <span className="text-[10px] text-blue-400 font-semibold mt-4">Clean Edge De-Fringe</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                  <Move className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">Resize & Reposition</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Make the portrait larger or smaller, drag with mouse to align perfectly for passport, ID card, or social media DP frames.
                </p>
              </div>
              <span className="text-[10px] text-purple-400 font-semibold mt-4">Full Scale & Position Control</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">100% Private & In-Browser</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Competitors upload your personal photos and sensitive documents to their servers. Ansar Tools operates completely on your local machine; zero images are stored or transmitted.
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold mt-4">Safe & Confidential</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">No Paid Credits & Full HD</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unlike remove.bg which downsizes your image to 0.2 megapixels for free accounts, Ansar Tools downloads your photo in full original high-definition resolution.
                </p>
              </div>
              <span className="text-[10px] text-amber-400 font-semibold mt-4">100% Free Forever</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
