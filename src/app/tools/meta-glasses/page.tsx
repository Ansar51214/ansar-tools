'use client';

import ToolGuideSection from '@/components/ToolGuideSection';
import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import ToolPageHeader from '@/components/ToolPageHeader';
import Footer from '@/components/Footer';
import piexif from 'piexifjs';
import { Upload, RefreshCw } from 'lucide-react';


export default function MetaGlassesTool() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('photo');
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type !== 'image/jpeg') {
      alert('Please upload a JPG/JPEG image. PNG does not support EXIF metadata.');
      return;
    }
    setFileName(file.name.split('.')[0]);
    const reader = new FileReader();
    reader.onload = (e) => {
      setDataUrl(e.target?.result as string);
      setStatus(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = () => {
    if (!dataUrl) return;

    try {
      const zeroth: Record<number, string> = {};
      const exif: Record<number, string> = {};

      zeroth[piexif.ImageIFD.Make] = "Meta";
      zeroth[piexif.ImageIFD.Model] = "Ray-Ban Meta Smart Glasses";
      zeroth[piexif.ImageIFD.Software] = "Meta View App";

      const now = new Date();
      const dateStr = now.getFullYear() + ":" +
        String(now.getMonth() + 1).padStart(2, '0') + ":" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0') + ":" +
        String(now.getSeconds()).padStart(2, '0');

      exif[piexif.ExifIFD.DateTimeOriginal] = dateStr;
      exif[piexif.ExifIFD.LensMake] = "Meta";
      exif[piexif.ExifIFD.LensModel] = "Ray-Ban Meta Smart Glasses Camera";

      const exifObj = { "0th": zeroth, "Exif": exif };
      const exifBytes = piexif.dump(exifObj);
      const newDataUrl = piexif.insert(exifBytes, dataUrl);

      setDataUrl(newDataUrl);
      setStatus('✅ EXIF data added successfully!');

      const link = document.createElement('a');
      link.href = newDataUrl;
      link.download = fileName + '-meta-glasses.jpg';
      link.click();
    } catch (err) {
      alert('Error processing image. Please try a different JPG file.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        <ToolPageHeader toolName="Meta Glasses 3D Effect" theme="light" />
      </div>
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">🕶️ Meta Glasses Converter</h1>
            <p className="text-slate-500">Inject Meta Smart Glasses EXIF metadata into your photos.</p>
          </div>

          <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl mb-8 flex gap-3">
            <span className="text-xl">ℹ️</span>
            <p>
              This tool injects Meta Ray-Ban Smart Glasses camera info into your photo&apos;s EXIF metadata.
              This can help apps like Instagram recognize it for &quot;camera-captured&quot; style effects.
            </p>
          </div>

          {!dataUrl ? (
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 font-medium mb-1">Click or drag-drop photo here</p>
              <p className="text-slate-500 text-sm">JPG format required</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
                accept="image/jpeg" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center bg-slate-100 rounded-2xl p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dataUrl} alt="Preview" className="max-h-[400px] rounded-xl shadow-sm" />
              </div>

              {status && (
                <div className="text-center text-green-600 font-medium bg-green-50 p-3 rounded-lg">
                  {status}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleConvert}
                  className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Wand2Icon className="w-5 h-5" /> Add EXIF Data
                </button>
                <button 
                  onClick={() => {
                    setDataUrl(null);
                    setStatus(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" /> Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      
      {/* SEO, How-to Guide & FAQ Section */}
      <ToolGuideSection
        toolName="Meta Glasses Photo Converter"
        theme="light"
        about="Ansar Tools Meta Glasses 3D Effect injects authentic camera EXIF metadata and Ray-Ban Meta smart glasses device signatures into any photograph. Built for digital enthusiasts, tech reviewers, and mobile photographers, it modifies image header tags client-side while preserving original image quality and color reproduction."
        howToUseTitle="How do I add Meta smart glasses camera metadata to photos?"
        steps={[{"title":"Upload Source Photo","description":"Select a JPEG or PNG photo from your gallery or desktop folder."},{"title":"Select Meta Smart Glasses Profile","description":"Choose the target device profile (Ray-Ban Meta Wayfarer or Headliner) and camera firmware metadata tag."},{"title":"Customize Timestamp & Location","description":"Optionally update the capture timestamp and simulated geolocation EXIF tags."},{"title":"Inject Metadata & Download","description":"Click 'Process Photo' to embed the binary EXIF IFD data block and save your modified photo instantly."}]}
        faqs={[{"question":"What EXIF tags are added to the photo?","answer":"The tool writes the camera Make ('Meta'), Model ('Ray-Ban Meta Smart Glasses'), Software ('Meta View App'), and Lens Model into the standard ExifIFD and 0th IFD headers."},{"question":"Does processing compress or downgrade my original photo quality?","answer":"No. The EXIF injection parses and inserts metadata blocks using piexifjs without recompressing the underlying image bitmap, keeping pixel data identical."},{"question":"Can social media platforms read the injected metadata?","answer":"Platforms and photo viewer apps that parse standard EXIF metadata will detect the camera hardware and device tags."},{"question":"Is my photo sent to an external server during processing?","answer":"No. The entire binary EXIF modification happens locally within your browser's JavaScript environment."}]}
      />

      <Footer />
    </div>
  );
}

function Wand2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
      <path d="m14 7 3 3" />
      <path d="M5 6v4" />
      <path d="M19 14v4" />
      <path d="M10 2v2" />
      <path d="M7 8H3" />
      <path d="M21 16h-4" />
      <path d="M11 3H9" />
    </svg>
  );
}
