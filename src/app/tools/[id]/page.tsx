'use client';

import { use, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { categories } from '@/data/toolsData';
import { Construction } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ToolPlaceholderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const toolId = resolvedParams.id;
  const router = useRouter();

  useEffect(() => {
    if (toolId === 'online-pdf-editor' || toolId === 'pdf-editor') {
      router.replace('/tools/online-pdf-editor');
    } else if (
      toolId === 'passport-photo' ||
      toolId === 'passport-photo-maker' ||
      toolId === 'passport-size-photo-maker' ||
      toolId === 'passport-maker'
    ) {
      router.replace('/tools/passport-photo-maker');
    } else if (
      toolId === 'invoice-generator' ||
      toolId === 'multi-currency-invoice' ||
      toolId === 'invoice-maker' ||
      toolId === 'invoice'
    ) {
      router.replace('/tools/invoice-generator');
    } else if (
      toolId === 'typing-master' ||
      toolId === 'typing' ||
      toolId === 'typing-test' ||
      toolId === 'urdu-typing' ||
      toolId === 'hindi-typing'
    ) {
      router.replace('/tools/typing-master');
    } else if (
      toolId === 'pdf-compressor' ||
      toolId === 'compress-pdf' ||
      toolId === 'pdf-resizer' ||
      toolId === 'pdfresize' ||
      toolId === 'compress'
    ) {
      router.replace('/tools/pdf-compressor');
    } else if (
      toolId === 'background-remover' ||
      toolId === 'remove-bg' ||
      toolId === 'bg-remover' ||
      toolId === 'image-background-remover'
    ) {
      router.replace('/tools/background-remover');
    } else if (
      toolId === 'resume-maker' ||
      toolId === 'ats-resume-maker' ||
      toolId === 'ats-resume' ||
      toolId === 'fresher-resume' ||
      toolId === 'resume-builder' ||
      toolId === 'cv-maker' ||
      toolId === 'cv-builder' ||
      toolId === 'resume'
    ) {
      router.replace('/tools/resume-maker');
    } else if (
      toolId === 'pdf-to-image' ||
      toolId === 'pdf-to-jpg' ||
      toolId === 'pdf-to-png' ||
      toolId === 'pdftoimage' ||
      toolId === 'pdf2image' ||
      toolId === 'pdf-images' ||
      toolId === 'pdftojpg' ||
      toolId === 'pdftopng'
    ) {
      router.replace('/tools/pdf-to-image');
    } else if (
      toolId === 'merge-pdf' ||
      toolId === 'combine-pdf' ||
      toolId === 'pdf-merger' ||
      toolId === 'pdf-combine' ||
      toolId === 'mergepdf' ||
      toolId === 'pdfmerge' ||
      toolId === 'join-pdf'
    ) {
      router.replace('/tools/merge-pdf');
    } else if (
      toolId === 'png-to-jpg' ||
      toolId === 'png-to-jpeg' ||
      toolId === 'png2jpg' ||
      toolId === 'png2jpeg' ||
      toolId === 'convert-png-to-jpg' ||
      toolId === 'pngtojpg' ||
      toolId === 'pngtojpeg'
    ) {
      router.replace('/tools/png-to-jpg');
    } else if (
      toolId === 'shaadi-biodata' ||
      toolId === 'marriage-biodata' ||
      toolId === 'biodata' ||
      toolId === 'biodata-maker' ||
      toolId === 'rishta-profile' ||
      toolId === 'matrimonial-biodata' ||
      toolId === 'matrimony-biodata'
    ) {
      router.replace('/tools/shaadi-biodata');
    } else if (
      toolId === 'ai-prompts' ||
      toolId === 'prompt-gallery' ||
      toolId === 'prompts' ||
      toolId === 'chatgpt-prompts' ||
      toolId === 'ai-prompt-generator' ||
      toolId === 'midjourney-prompts' ||
      toolId === 'claude-prompts'
    ) {
      router.replace('/tools/ai-prompts');
    } else if (
      toolId === 'wedding-cards' ||
      toolId === 'animated-wedding-cards' ||
      toolId === 'wedding-card-maker' ||
      toolId === 'e-invitation' ||
      toolId === 'wedding-invite' ||
      toolId === 'marriage-card' ||
      toolId === 'wedding-invitation'
    ) {
      router.replace('/tools/wedding-cards');
    } else if (
      toolId === 'template-downloads' ||
      toolId === 'templates' ||
      toolId === 'download-templates' ||
      toolId === 'free-templates' ||
      toolId === 'word-templates' ||
      toolId === 'pdf-templates'
    ) {
      router.replace('/tools/template-downloads');
    }
  }, [toolId, router]);
  
  // Find tool details
  let toolTitle = "Unknown Tool";
  let toolCategory = "Unknown";
  
  for (const cat of categories) {
    const tool = cat.tools.find(t => t.id === toolId);
    if (tool) {
      toolTitle = tool.title;
      toolCategory = tool.category;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 md:p-16 text-center w-full">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-12 h-12" />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{toolTitle}</h1>
          
          <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium mb-6">
            Category: {toolCategory}
          </div>
          
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            This tool component is currently pending integration. We are working on bringing this functionality online very soon!
          </p>
          
          <Link href="/" className="inline-flex bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Return to All Tools
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
