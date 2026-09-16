'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import ToolPageHeader from '@/components/ToolPageHeader';
import Footer from '@/components/Footer';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode } from 'lucide-react';

export default function QRGeneratorTool() {
  const [text, setText] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'qrcode.png';
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        <ToolPageHeader toolName="QR Code Generator" theme="light" />
      </div>
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">📱 QR Code Generator</h1>
            <p className="text-slate-500">Generate high-quality QR codes from text or links instantly.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Enter Text or URL
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com or any text..."
                className="w-full p-4 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none h-32 transition-colors"
              />
              <p className="text-xs text-slate-500">The QR code updates automatically as you type.</p>
            </div>

            <div className="flex flex-col items-center gap-4 bg-slate-50 p-8 rounded-2xl border border-slate-100 min-w-[280px]">
              <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                {text ? (
                  <QRCodeSVG value={text} size={180} level="H" includeMargin={false} />
                ) : (
                  <div className="w-[180px] h-[180px] flex items-center justify-center bg-slate-100 text-slate-400 rounded-lg">
                    <QrCode className="w-12 h-12 opacity-50" />
                  </div>
                )}
              </div>
              
              <button
                onClick={downloadQR}
                disabled={!text}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
              >
                <Download className="w-5 h-5" /> Download PNG
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
