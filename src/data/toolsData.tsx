import { 
  FileText, FileImage, Image as ImageIcon, Minimize, UserPlus, FileSignature, Receipt,
  Scissors, Type, RefreshCw, Wand2, Download, Video, Sparkles, GraduationCap, Link2, 
  Settings, CreditCard, LayoutTemplate, Briefcase, FileSearch, Star, Heart, TrendingUp, Users, Calendar
} from "lucide-react";
import { ReactNode } from "react";
import { ToolItem } from "../components/ToolCard";

export interface Category {
  title: string;
  icon: ReactNode;
  tools: ToolItem[];
}

export const categories: Category[] = [
  {
    title: "Popular Tools",
    icon: <Star className="w-6 h-6" />,
    tools: [
      { id: "pakistan-jobs", title: "Latest Pakistan Jobs & Results Portal", category: "Career", icon: <Briefcase className="w-7 h-7 text-emerald-500" />, badge: "HOT" },
      { id: "content-calendar", title: "Master Content Calendar & Drive Sheet", category: "Social Media", icon: <Calendar className="w-7 h-7 text-emerald-500" />, badge: "NEW" },
      { id: "clients-financial-calculator", title: "Clients & Financial Freedom Calculator", category: "Career", icon: <Users className="w-7 h-7 text-teal-500" />, badge: "HOT" },
      { id: "ecommerce-calculator", title: "E-Commerce Profit & Growth Calculator", category: "Utility", icon: <TrendingUp className="w-7 h-7 text-emerald-500" />, badge: "HOT" },
      { id: "online-pdf-editor", title: "Online PDF Editor", category: "PDFs", icon: <FileSignature className="w-7 h-7" />, badge: "HOT" },
      { id: "passport-photo-maker", title: "Passport Size Photo Maker", category: "Image Tools", icon: <UserPlus className="w-7 h-7" />, badge: "HOT" },
      { id: "id-card-maker", title: "Pro ID Card Maker & PSD Studio", category: "Templates", icon: <CreditCard className="w-7 h-7 text-indigo-500" />, badge: "NEW" },
      { id: "shaadi-biodata", title: "Shaadi Biodata Maker", category: "Matrimonial", icon: <Heart className="w-7 h-7 text-rose-500" />, badge: "HOT" },
      { id: "ats-resume", title: "Pro ATS Resume Maker", category: "Career", icon: <FileText className="w-7 h-7" />, badge: "100% Free" },
      { id: "invoice-generator", title: "Pro Invoice & GST Bill Studio", category: "Document", icon: <Receipt className="w-7 h-7" />, badge: "HOT" },
      { id: "background-remover", title: "Background Remover", category: "Image Tools", icon: <Scissors className="w-7 h-7" />, badge: "NEW" },
      { id: "pdf-to-image", title: "PDF to Image", category: "PDFs", icon: <FileImage className="w-7 h-7" />, badge: "HOT" },
      { id: "merge-pdf", title: "Merge PDF", category: "PDFs", icon: <FileSearch className="w-7 h-7" />, badge: "HOT" },
      { id: "png-to-jpg", title: "PNG to JPG", category: "Image Tools", icon: <RefreshCw className="w-7 h-7" />, badge: "HOT" }
    ]
  },
  {
    title: "Document & PDF Tools",
    icon: <FileText className="w-6 h-6" />,
    tools: [
      { id: "online-pdf-editor", title: "Online PDF Editor", category: "PDFs", icon: <FileSignature className="w-7 h-7" />, badge: "HOT" },
      { id: "pdf-compressor", title: "PDF Compressor", category: "PDFs", icon: <Minimize className="w-7 h-7" />, badge: "100% Free" },
      { id: "pdf-to-image", title: "PDF to Image", category: "PDFs", icon: <FileImage className="w-7 h-7" />, badge: "HOT" },
      { id: "merge-pdf", title: "Merge PDF", category: "PDFs", icon: <FileSearch className="w-7 h-7" />, badge: "HOT" },
      { id: "invoice-generator", title: "Pro Invoice & GST Bill Studio", category: "Document", icon: <Receipt className="w-7 h-7" />, badge: "HOT" }
    ]
  },
  {
    title: "Image & Photo Tools",
    icon: <ImageIcon className="w-6 h-6" />,
    tools: [
      { id: "passport-photo-maker", title: "Passport Size Photo Maker", category: "Image Tools", icon: <UserPlus className="w-7 h-7" />, badge: "HOT" },
      { id: "png-to-jpg", title: "PNG to JPG", category: "Image Tools", icon: <RefreshCw className="w-7 h-7" />, badge: "HOT" },
      { id: "background-remover", title: "Background Remover", category: "Image Tools", icon: <Scissors className="w-7 h-7" />, badge: "NEW" },
      { id: "image-compressor", title: "Image Compressor", category: "Image Tools", icon: <Minimize className="w-7 h-7" />, badge: "100% Free" },
      { id: "meta-glasses", title: "Meta Glasses 3D Effect", category: "Image Tools", icon: <Wand2 className="w-7 h-7" />, badge: "NEW" }
    ]
  },
  {
    title: "AI Prompts & Templates",
    icon: <Sparkles className="w-6 h-6" />,
    tools: [
      { id: "content-calendar", title: "Master Content Calendar (Google Sheets)", category: "Templates", icon: <Calendar className="w-7 h-7 text-emerald-500" />, badge: "HOT" },
      { id: "id-card-maker", title: "Pro ID Card Maker & PSD Studio", category: "Templates", icon: <CreditCard className="w-7 h-7 text-indigo-500" />, badge: "HOT" },
      { id: "ai-prompts", title: "AI Prompts Gallery", category: "AI Prompts", icon: <Type className="w-7 h-7" />, badge: "HOT" },
      { id: "wedding-cards", title: "Animated Wedding Cards", category: "Templates", icon: <Video className="w-7 h-7 text-rose-500" />, badge: "HOT" },
      { id: "template-downloads", title: "Template Downloads", category: "Templates", icon: <Download className="w-7 h-7" />, badge: "100% Free" }
    ]
  },
  {
    title: "Career & Utility Tools",
    icon: <Briefcase className="w-6 h-6" />,
    tools: [
      { id: "clients-financial-calculator", title: "Clients & Financial Freedom Calculator", category: "Career", icon: <Users className="w-7 h-7 text-teal-500" />, badge: "HOT" },
      { id: "ecommerce-calculator", title: "E-Commerce Profit & Growth Calculator", category: "Utility", icon: <TrendingUp className="w-7 h-7 text-emerald-500" />, badge: "HOT" },
      { id: "id-card-maker", title: "Pro ID Card Maker & PSD Studio", category: "Templates", icon: <CreditCard className="w-7 h-7 text-indigo-500" />, badge: "NEW" },
      { id: "resume-maker", title: "Pro ATS Resume Maker", category: "Career", icon: <FileText className="w-7 h-7" />, badge: "HOT" },
      { id: "mock-test", title: "Online Mock Test", category: "Career", icon: <GraduationCap className="w-7 h-7" /> },
      { id: "fresher-resume", title: "Fresher Resume Builder", category: "Career", icon: <LayoutTemplate className="w-7 h-7" />, badge: "100% Free" },
      { id: "typing-master", title: "Urdu, Hindi & English Typing Master", category: "Utility", icon: <Type className="w-7 h-7" />, badge: "HOT" },
      { id: "qr-generator", title: "QR Code Generator", category: "Utility", icon: <Settings className="w-7 h-7" /> },
      { id: "age-calculator", title: "Age Calculator", category: "Utility", icon: <Settings className="w-7 h-7" /> },
      { id: "shaadi-biodata", title: "Shaadi Biodata Maker", category: "Matrimonial", icon: <Heart className="w-7 h-7 text-rose-500" />, badge: "HOT" }
    ]
  },
  {
    title: "Portal Services / Utility Links",
    icon: <Link2 className="w-6 h-6" />,
    tools: [
      { id: "pakistan-jobs", title: "Pakistan Jobs, Results & Testing Portals", category: "Portal", icon: <Briefcase className="w-7 h-7 text-emerald-500" />, badge: "HOT" },
      { id: "nadra-portal", title: "NADRA Identity Portal", category: "Portal", icon: <CreditCard className="w-7 h-7" />, badge: "HOT" },
      { id: "fbr-tax-services", title: "FBR Tax Services", category: "Portal", icon: <Receipt className="w-7 h-7" /> },
      { id: "multi-currency-invoice", title: "Multi-Currency Invoice (USD/PKR)", category: "Portal", icon: <FileSignature className="w-7 h-7" />, badge: "NEW" },
      { id: "international-visa-guides", title: "International Visa Guides", category: "Portal", icon: <Briefcase className="w-7 h-7" /> },
      { id: "global-travel-docs", title: "Global Travel Docs Prep", category: "Portal", icon: <FileSearch className="w-7 h-7" /> }
    ]
  }
];
