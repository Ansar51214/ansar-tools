import Link from "next/link";

import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 mt-16 rounded-t-[3rem]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Logo className="w-9 h-9" size={36} />
            <span className="font-bold text-xl tracking-tight text-white">Ansar Tools</span>
          </Link>
          <p className="text-slate-400 max-w-sm">
            Your one-stop destination for free, fast, and secure digital utilities. Process PDFs, edit images, and access smart tools instantly in your browser.
          </p>
          

        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link href="/#tools" className="hover:text-blue-400 transition-colors">All Tools</Link></li>
            <li><Link href="/tools/resume-maker" className="hover:text-blue-400 transition-colors">Resume Builder</Link></li>
            <li><Link href="/#about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Legal</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Disclaimer</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 Ansar Tools. All Rights Reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
          <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}
