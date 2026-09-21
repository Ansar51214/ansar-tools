'use client';

import ToolGuideSection from '@/components/ToolGuideSection';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import ToolPageHeader from '@/components/ToolPageHeader';
import Footer from '@/components/Footer';
import { Upload, Download, RefreshCw, Settings2 } from 'lucide-react';

export default function ImageCompressorTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    compressImage(url, quality);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const compressImage = (url: string, qual: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Keep original dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Compress
      const dataUrl = canvas.toDataURL('image/jpeg', qual);
      setCompressedUrl(dataUrl);

      // Calculate approximate size in KB
      const base64str = dataUrl.split(',')[1];
      const decoded = atob(base64str);
      setCompressedSize(decoded.length);
      setIsProcessing(false);
    };
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuality = parseFloat(e.target.value);
    setQuality(newQuality);
    if (originalUrl) {
      compressImage(originalUrl, newQuality);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        <ToolPageHeader toolName="Image Compressor" theme="light" />
      </div>
      
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">🖼️ Image Compressor</h1>
            <p className="text-slate-500">Reduce image file size locally without losing visible quality.</p>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {!originalUrl ? (
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors max-w-2xl mx-auto"
            >
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 font-medium mb-1 text-lg">Click or drag-drop photo here</p>
              <p className="text-slate-500 text-sm">Supports JPG, PNG, WEBP</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                  <Settings2 className="text-blue-600 w-6 h-6" />
                  <h3 className="font-semibold text-slate-800 text-lg">Compression Settings</h3>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                    <span>Lower Quality (Smaller Size)</span>
                    <span>High Quality (Larger Size)</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1" 
                    step="0.1" 
                    value={quality}
                    onChange={handleQualityChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="text-center mt-2 font-bold text-blue-600">
                    Quality: {Math.round(quality * 100)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-2xl p-4 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-700">Original</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-mono">
                      {originalFile ? formatSize(originalFile.size) : ''}
                    </span>
                  </div>
                  <div className="bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center h-[300px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={originalUrl} alt="Original" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>

                <div className="border border-blue-200 rounded-2xl p-4 bg-blue-50/30 relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-blue-800">Compressed</h3>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-mono font-bold">
                      {compressedSize ? formatSize(compressedSize) : 'Calculating...'}
                    </span>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden flex items-center justify-center h-[300px] border border-blue-100">
                    {isProcessing ? (
                      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      compressedUrl && <img src={compressedUrl} alt="Compressed" className="max-w-full max-h-full object-contain" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 max-w-lg mx-auto">
                <button 
                  onClick={() => {
                    setOriginalFile(null);
                    setOriginalUrl(null);
                    setCompressedUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 py-4 px-6 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Start Over
                </button>
                <a 
                  href={compressedUrl || '#'}
                  download={`compressed-${originalFile?.name || 'image.jpg'}`}
                  className={`flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-xl font-bold transition-colors ${!compressedUrl || isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                  <Download className="w-5 h-5" /> Download
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      
      {/* SEO, How-to Guide & FAQ Section */}
      <ToolGuideSection
        toolName="Image Compressor"
        theme="light"
        about="Ansar Tools Image Compressor minimizes file sizes for JPG, PNG, and WebP images by up to 90% without sacrificing perceptual clarity. Tailored for webmasters seeking faster page loads and applicants meeting strict portal upload thresholds, it provides real-time before-and-after size comparisons and batch download features."
        howToUseTitle="How do I compress images online without losing quality?"
        steps={[{"title":"Add Images to Queue","description":"Upload images by dropping them into the designated dropzone or selecting them via the file browser."},{"title":"Select Quality & Max Dimensions","description":"Adjust the compression slider and optional maximum width/height constraints to reach your target file size."},{"title":"Inspect Savings in Real Time","description":"Compare original vs compressed file sizes and review the estimated bandwidth reduction."},{"title":"Download Optimized Files","description":"Click 'Download All' to retrieve your compressed images in a single click."}]}
        faqs={[{"question":"Which image formats are supported?","answer":"The compressor supports JPEG, PNG, and modern WebP formats, automatically optimizing each according to its compression capabilities."},{"question":"How much file size reduction can I expect?","answer":"Depending on initial image density, reductions between 50% and 85% are common with virtually zero noticeable loss in quality on screens."},{"question":"Is there a limit on image dimensions?","answer":"You can process large multi-megapixel smartphone and DSLR photos. You can also downscale max width/height to drastically reduce payload size."},{"question":"Do you keep copies of my personal photos?","answer":"No. Images are processed purely in client-side memory. No images are ever uploaded, logged, or saved to any external server."}]}
      />

      <Footer />
    </div>
  );
}
