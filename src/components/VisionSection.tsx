import Image from "next/image";
import { CheckCircle2, FileText, Sparkles, Image as ImageIcon, QrCode } from "lucide-react";

export default function VisionSection() {
  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 space-y-6">
        <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-2">
          Our Vision
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          Democratizing Digital Tools for Everyone.
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          We believe that essential digital utilities should be accessible to all. That's why we're committed to providing 100% free, privacy-focused, and lightning-fast web tools with no hidden paywalls, intrusive ads, or mandatory signups.
        </p>
        
        <ul className="space-y-3 pt-4">
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>100% Free Forever</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>No Registration Required</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>Privacy First (Files processed locally)</span>
          </li>
        </ul>
      </div>
      
      <div className="flex-1 w-full relative">
        <div className="aspect-square max-w-md mx-auto bg-gradient-to-tr from-blue-100/70 via-indigo-50/40 to-blue-50 rounded-full flex items-center justify-center p-8 relative shadow-inner">
          {/* Animated dashed orbital ring */}
          <div className="absolute inset-0 border-2 border-dashed border-blue-300/80 rounded-full animate-[spin_35s_linear_infinite]" />
          
          {/* Center Logo Display */}
          <div className="w-full h-full bg-white rounded-full shadow-2xl flex flex-col items-center justify-center p-8 relative z-10 border border-blue-50 hover:shadow-blue-200/50 transition-all duration-500">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Ansar Tools Logo"
                fill
                sizes="(max-width: 640px) 176px, 208px"
                className="object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-sm font-bold tracking-wider text-blue-900 uppercase">Ansar Tools</span>
            </div>
          </div>
          
          {/* Floating feature pills around orbit */}
          <div className="absolute -top-2 left-10 bg-white px-3 py-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 transform -rotate-6 animate-pulse z-20">
            <div className="p-1.5 bg-red-50 text-red-500 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-gray-700">PDF Tools</span>
          </div>

          <div className="absolute top-16 -right-3 bg-white px-3 py-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 transform rotate-6 animate-pulse z-20" style={{ animationDelay: '1.2s' }}>
            <div className="p-1.5 bg-purple-50 text-purple-500 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Smart AI</span>
          </div>

          <div className="absolute -bottom-2 right-12 bg-white px-3 py-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 transform -rotate-3 animate-pulse z-20" style={{ animationDelay: '2s' }}>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Image Studio</span>
          </div>

          <div className="absolute bottom-16 -left-3 bg-white px-3 py-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 transform rotate-6 animate-pulse z-20" style={{ animationDelay: '2.8s' }}>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-gray-700">QR Generator</span>
          </div>
        </div>
      </div>
    </section>
  );
}
