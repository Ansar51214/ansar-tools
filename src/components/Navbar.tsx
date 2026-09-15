import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white text-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-9 h-9" size={36} />
              <span className="font-bold text-xl tracking-tight text-blue-900">Ansar Tools</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              <Link href="/#tools" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">All Tools</Link>
              <Link href="/#about" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">About Us</Link>
              <Link href="/tools/resume-maker" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Resume Builder</Link>
              <Link href="/#contact" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-gray-800 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link href="/#tools" className="text-gray-800 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">All Tools</Link>
            <Link href="/#about" className="text-gray-800 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">About Us</Link>
            <Link href="/tools/resume-maker" className="text-gray-800 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Resume Builder</Link>
            <Link href="/#contact" className="text-gray-800 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
