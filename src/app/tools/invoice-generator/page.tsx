'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { currencyToWords } from './numberToWords';
import { QRCodeSVG } from 'qrcode.react';
import {
  Receipt, Plus, Trash2, Printer, Download, Share2, Sparkles,
  RotateCcw, CheckCircle2, Building, User, Calendar, CreditCard,
  Percent, DollarSign, PenTool, Image as ImageIcon, Check,
  Phone, Mail, Globe, MapPin, ShieldCheck, ArrowRight,
  FileSpreadsheet, History, X, Save, AlertCircle, Eye, SlidersHorizontal
} from 'lucide-react';

// Currency definitions
interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const CURRENCIES: Currency[] = [
  { code: 'PKR', symbol: '₨', name: 'PKR (₨) - Pakistani Rupee' },
  { code: 'INR', symbol: '₹', name: 'INR (₹) - Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', name: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', name: 'GBP (£) - British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'AED (د.إ) - UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'SAR (﷼) - Saudi Riyal' },
  { code: 'CAD', symbol: 'C$', name: 'CAD (C$) - Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'AUD (A$) - Australian Dollar' },
];

// Color themes matching Sharda Tool + upgrades
interface ColorTheme {
  id: string;
  name: string;
  hex: string;
  lightBg: string;
  borderHex: string;
}

const COLOR_THEMES: ColorTheme[] = [
  { id: 'green', name: 'Emerald Green', hex: '#059669', lightBg: '#ecfdf5', borderHex: '#a7f3d0' },
  { id: 'blue', name: 'Cyber Blue', hex: '#2563eb', lightBg: '#eff6ff', borderHex: '#bfdbfe' },
  { id: 'gold', name: 'Luxury Gold', hex: '#d97706', lightBg: '#fffbeb', borderHex: '#fde68a' },
  { id: 'black', name: 'Slate Black', hex: '#0f172a', lightBg: '#f8fafc', borderHex: '#cbd5e1' },
  { id: 'red', name: 'Crimson Red', hex: '#dc2626', lightBg: '#fef2f2', borderHex: '#fecaca' },
  { id: 'purple', name: 'Royal Violet', hex: '#7c3aed', lightBg: '#f5f3ff', borderHex: '#ddd6fe' },
];

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number; // percentage
}

type PaperFormat = 'a4' | 'pos';
type StatusStamp = 'NONE' | 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT' | 'VOID';
type WatermarkPosition = 'center' | 'stamp';
type SignatureMode = 'draw' | 'type' | 'upload' | 'none';

interface SavedInvoiceRecord {
  id: string;
  savedAt: string;
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  currencySymbol: string;
  data: any;
}

export default function InvoiceGeneratorPage() {
  // --- STYLING & FORMATTING ---
  const [activeTheme, setActiveTheme] = useState<ColorTheme>(COLOR_THEMES[0]); // Green default (like Sharda)
  const [paperFormat, setPaperFormat] = useState<PaperFormat>('a4');
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [statusStamp, setStatusStamp] = useState<StatusStamp>('NONE');
  const [watermarkPos, setWatermarkPos] = useState<WatermarkPosition>('center');

  // --- INVOICE HEADER & META ---
  const [invoiceTitle, setInvoiceTitle] = useState('INVOICE');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [poNumber, setPoNumber] = useState('');

  // --- BUSINESS / SENDER DETAILS ---
  const [companyName, setCompanyName] = useState('Ansar Tech Solutions');
  const [companyTagline, setCompanyTagline] = useState('Software, IT & Document Services');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyAddress, setCompanyAddress] = useState('Commercial Plaza, Main Boulevard');
  const [companyCity, setCompanyCity] = useState('Lahore, Pakistan');
  const [companyPhone, setCompanyPhone] = useState('+92 300 1234567');
  const [companyEmail, setCompanyEmail] = useState('billing@ansarstudio.com');
  const [companyWebsite, setCompanyWebsite] = useState('www.ansarstudio.com');
  const [companyTaxId, setCompanyTaxId] = useState('NTN / GST: 8492041-3');

  // --- CLIENT / RECIPIENT DETAILS ---
  const [clientName, setClientName] = useState('Ali Raza');
  const [clientCompany, setClientCompany] = useState('Apex Global Enterprises');
  const [clientAddress, setClientAddress] = useState('Suite 402, Blue Area');
  const [clientCity, setClientCity] = useState('Islamabad, Pakistan');
  const [clientPhone, setClientPhone] = useState('+92 321 7654321');
  const [clientEmail, setClientEmail] = useState('ali.raza@apexglobal.com');

  // --- LINE ITEMS ---
  const [items, setItems] = useState<LineItem[]>([
    {
      id: '1',
      description: 'Web Application Development & UI Design (Milestone 1)',
      quantity: 1,
      unit: 'project',
      rate: 45000,
      discount: 0
    },
    {
      id: '2',
      description: 'Document Tools & Invoice Automation Integration',
      quantity: 1,
      unit: 'module',
      rate: 25000,
      discount: 0
    },
    {
      id: '3',
      description: 'Cloud Server Setup & Cyber Security Hardening',
      quantity: 10,
      unit: 'hrs',
      rate: 1500,
      discount: 5
    }
  ]);

  // --- TAX, DISCOUNT & ADJUSTMENTS ---
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxLabel, setTaxLabel] = useState<string>('GST / Tax');
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);

  // --- PAYMENT DETAILS & SCAN-TO-PAY QR ---
  const [showPaymentInfo, setShowPaymentInfo] = useState(true);
  const [bankName, setBankName] = useState('Meezan Bank Ltd');
  const [accountTitle, setAccountTitle] = useState('Ansar Tech Solutions');
  const [accountNumber, setAccountNumber] = useState('02010103948291');
  const [iban, setIban] = useState('PK36MEZN0002010103948291');
  const [walletNumber, setWalletNumber] = useState('0300-1234567 (EasyPaisa/JazzCash)');
  const [qrValue, setQrValue] = useState('PK36MEZN0002010103948291');
  const [showQrCode, setShowQrCode] = useState(true);

  // --- NOTES, TERMS & SIGNATURE ---
  const [notes, setNotes] = useState('Thank you for your business! Please make payment before the due date.');
  const [terms, setTerms] = useState('1. Payment is due within 15 days of issue.\n2. Goods & services delivered are covered under standard service agreement.');
  const [signatureMode, setSignatureMode] = useState<SignatureMode>('type');
  const [typedSignature, setTypedSignature] = useState('Mohammad Ansar');
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);

  // --- MODALS & NOTIFICATIONS ---
  const [showSigModal, setShowSigModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoiceRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sigUploadInputRef = useRef<HTMLInputElement>(null);

  // --- CALCULATIONS ---
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.rate || 0) * (1 - (item.discount || 0) / 100);
    return sum + itemTotal;
  }, 0);

  const taxAmount = (subtotal * (taxRate || 0)) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount + (shippingFee || 0) - (globalDiscount || 0));
  const balanceDue = Math.max(0, totalAmount - (amountPaid || 0));
  const amountInWords = currencyToWords(totalAmount, currency.code);

  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: num % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load Saved Company Profile and History on Mount
  useEffect(() => {
    try {
      const savedCompany = localStorage.getItem('ansar_invoice_company');
      if (savedCompany) {
        const p = JSON.parse(savedCompany);
        if (p.companyName) setCompanyName(p.companyName);
        if (p.companyTagline) setCompanyTagline(p.companyTagline);
        if (p.companyAddress) setCompanyAddress(p.companyAddress);
        if (p.companyCity) setCompanyCity(p.companyCity);
        if (p.companyPhone) setCompanyPhone(p.companyPhone);
        if (p.companyEmail) setCompanyEmail(p.companyEmail);
        if (p.companyWebsite) setCompanyWebsite(p.companyWebsite);
        if (p.companyTaxId) setCompanyTaxId(p.companyTaxId);
        if (p.companyLogo) setCompanyLogo(p.companyLogo);
        if (p.bankName) setBankName(p.bankName);
        if (p.accountTitle) setAccountTitle(p.accountTitle);
        if (p.accountNumber) setAccountNumber(p.accountNumber);
        if (p.iban) setIban(p.iban);
        if (p.walletNumber) setWalletNumber(p.walletNumber);
      }

      const historyData = localStorage.getItem('ansar_invoice_history');
      if (historyData) {
        setSavedInvoices(JSON.parse(historyData));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save Company Profile
  const handleSaveCompanyProfile = () => {
    try {
      const profile = {
        companyName,
        companyTagline,
        companyAddress,
        companyCity,
        companyPhone,
        companyEmail,
        companyWebsite,
        companyTaxId,
        companyLogo,
        bankName,
        accountTitle,
        accountNumber,
        iban,
        walletNumber
      };
      localStorage.setItem('ansar_invoice_company', JSON.stringify(profile));
      showToast('🏢 Business Profile Saved! Your company & bank info will auto-load on future visits.');
    } catch {
      showToast('⚠️ Could not save profile to local storage.');
    }
  };

  // Save current invoice to history
  const handleSaveToHistory = () => {
    try {
      const currentRecord: SavedInvoiceRecord = {
        id: Date.now().toString(),
        savedAt: new Date().toLocaleString(),
        invoiceNumber,
        clientName: clientName || 'Unnamed Client',
        totalAmount,
        currencySymbol: currency.symbol,
        data: {
          invoiceTitle,
          invoiceNumber,
          invoiceDate,
          dueDate,
          poNumber,
          companyName,
          companyTagline,
          companyLogo,
          companyAddress,
          companyCity,
          companyPhone,
          companyEmail,
          companyWebsite,
          companyTaxId,
          clientName,
          clientCompany,
          clientAddress,
          clientCity,
          clientPhone,
          clientEmail,
          items,
          taxRate,
          taxLabel,
          globalDiscount,
          shippingFee,
          amountPaid,
          bankName,
          accountTitle,
          accountNumber,
          iban,
          walletNumber,
          qrValue,
          notes,
          terms,
          currency,
          statusStamp,
          activeTheme
        }
      };

      const updated = [currentRecord, ...savedInvoices.slice(0, 19)]; // keep last 20
      setSavedInvoices(updated);
      localStorage.setItem('ansar_invoice_history', JSON.stringify(updated));
      showToast(`💾 Invoice ${invoiceNumber} saved to History!`);
    } catch {
      showToast('⚠️ Could not save invoice to history.');
    }
  };

  // Restore invoice from history
  const handleLoadInvoiceRecord = (record: SavedInvoiceRecord) => {
    try {
      const d = record.data;
      if (!d) return;
      setInvoiceTitle(d.invoiceTitle || 'INVOICE');
      setInvoiceNumber(d.invoiceNumber || 'INV');
      setInvoiceDate(d.invoiceDate || '');
      setDueDate(d.dueDate || '');
      setPoNumber(d.poNumber || '');
      setClientName(d.clientName || '');
      setClientCompany(d.clientCompany || '');
      setClientAddress(d.clientAddress || '');
      setClientCity(d.clientCity || '');
      setClientPhone(d.clientPhone || '');
      setClientEmail(d.clientEmail || '');
      setItems(d.items || []);
      setTaxRate(d.taxRate || 0);
      setTaxLabel(d.taxLabel || 'GST / Tax');
      setGlobalDiscount(d.globalDiscount || 0);
      setShippingFee(d.shippingFee || 0);
      setAmountPaid(d.amountPaid || 0);
      if (d.currency) setCurrency(d.currency);
      if (d.statusStamp) setStatusStamp(d.statusStamp);
      if (d.activeTheme) setActiveTheme(d.activeTheme);
      setShowHistoryModal(false);
      showToast(`📂 Restored invoice ${record.invoiceNumber}`);
    } catch {
      showToast('⚠️ Could not load invoice record.');
    }
  };

  // Delete invoice record
  const handleDeleteInvoiceRecord = (id: string) => {
    const filtered = savedInvoices.filter(i => i.id !== id);
    setSavedInvoices(filtered);
    localStorage.setItem('ansar_invoice_history', JSON.stringify(filtered));
    showToast('🗑️ Invoice removed from history.');
  };

  // Add Item
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit: 'pcs',
      rate: 0,
      discount: 0
    };
    setItems([...items, newItem]);
  };

  // Update Item
  const handleUpdateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    if (items.length === 1) {
      setItems([{ id: '1', description: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0 }]);
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setCompanyLogo(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Export to Excel / CSV
  const handleExportCSV = () => {
    try {
      let csvContent = '\uFEFF'; // Excel UTF-8 BOM
      csvContent += `INVOICE / BILL DETAILS\n`;
      csvContent += `Invoice Number,${invoiceNumber}\n`;
      csvContent += `Invoice Date,${invoiceDate}\n`;
      csvContent += `Due Date,${dueDate}\n`;
      csvContent += `PO Number,${poNumber}\n`;
      csvContent += `Company Name,${companyName}\n`;
      csvContent += `Company Phone,${companyPhone}\n`;
      csvContent += `Company Tax ID,${companyTaxId}\n`;
      csvContent += `Client Name,${clientName}\n`;
      csvContent += `Client Company,${clientCompany}\n\n`;

      csvContent += `# ,Description,Qty,Unit,Rate (${currency.code}),Discount %,Total (${currency.code})\n`;
      items.forEach((item, index) => {
        const rowTotal = item.quantity * item.rate * (1 - item.discount / 100);
        const desc = `"${(item.description || '').replace(/"/g, '""')}"`;
        csvContent += `${index + 1},${desc},${item.quantity},"${item.unit || ''}",${item.rate},${item.discount}%,${rowTotal.toFixed(2)}\n`;
      });

      csvContent += `\nSubtotal,,,,,${subtotal.toFixed(2)}\n`;
      if (taxRate > 0) csvContent += `${taxLabel} (${taxRate}%),,,,,${taxAmount.toFixed(2)}\n`;
      if (globalDiscount > 0) csvContent += `Discount,,,,, -${globalDiscount.toFixed(2)}\n`;
      if (shippingFee > 0) csvContent += `Shipping/Delivery,,,,,${shippingFee.toFixed(2)}\n`;
      csvContent += `GRAND TOTAL,,,,,${totalAmount.toFixed(2)} ${currency.code}\n`;
      if (amountPaid > 0) csvContent += `Amount Paid,,,,,${amountPaid.toFixed(2)}\n`;
      csvContent += `BALANCE DUE,,,,,${balanceDue.toFixed(2)} ${currency.code}\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${invoiceNumber || 'invoice'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📊 Invoice exported to Excel CSV format!');
    } catch {
      showToast('⚠️ Could not export CSV.');
    }
  };

  // WhatsApp Bill Share
  const handleWhatsAppShare = () => {
    const message =
      `*INVOICE: ${invoiceNumber}*\n` +
      `From: *${companyName}*\n` +
      `To: *${clientName}* (${clientCompany || 'Client'})\n` +
      `Date: ${invoiceDate} | Due: ${dueDate}\n` +
      `--------------------------------\n` +
      `*Subtotal:* ${currency.symbol} ${formatAmount(subtotal)}\n` +
      (taxRate > 0 ? `*${taxLabel} (${taxRate}%):* ${currency.symbol} ${formatAmount(taxAmount)}\n` : '') +
      `*Grand Total:* ${currency.symbol} ${formatAmount(totalAmount)}\n` +
      `*Balance Due:* ${currency.symbol} ${formatAmount(balanceDue)}\n` +
      `--------------------------------\n` +
      `Thank you for doing business with us!`;

    const encoded = encodeURIComponent(message);
    const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Load Demo Data
  const handleLoadDemo = () => {
    setInvoiceTitle('TAX INVOICE');
    setInvoiceNumber('INV-2026-088');
    setCompanyName('Ansar Cyber Technologies');
    setCompanyTagline('Premier Software, IT & Document Studio');
    setCompanyAddress('Commercial Center, Gulberg III');
    setCompanyCity('Lahore, Pakistan');
    setCompanyPhone('+92 300 9876543');
    setCompanyEmail('billing@ansarcyber.com');
    setCompanyWebsite('www.ansarcyber.com');
    setCompanyTaxId('NTN: 7391048-2');
    setClientName('Hamza Khan');
    setClientCompany('Falcon Retail Solutions');
    setClientAddress('F-7 Markaz, Main Boulevard');
    setClientCity('Islamabad, Pakistan');
    setClientPhone('+92 333 4567890');
    setClientEmail('hamza@falconretail.com');
    setTaxRate(5);
    setTaxLabel('Sales Tax / GST');
    setGlobalDiscount(1000);
    setAmountPaid(20000);
    setItems([
      { id: '1', description: 'Complete POS System Installation & Training', quantity: 1, unit: 'system', rate: 45000, discount: 0 },
      { id: '2', description: 'Thermal Barcode Scanner & Receipt Setup', quantity: 2, unit: 'units', rate: 7500, discount: 5 },
      { id: '3', description: '1-Year Cloud Hosting & Database Maintenance', quantity: 1, unit: 'yr', rate: 18000, discount: 0 },
      { id: '4', description: 'Custom Official Invoice & Receipt Templates', quantity: 1, unit: 'service', rate: 5000, discount: 0 }
    ]);
    setStatusStamp('PAID');
    showToast('✨ Loaded sample demo invoice data!');
  };

  // Reset Blank
  const handleReset = () => {
    if (confirm('Reset invoice to blank template?')) {
      setInvoiceNumber('INV-' + Math.floor(1000 + Math.random() * 9000));
      setClientName('');
      setClientCompany('');
      setClientAddress('');
      setClientCity('');
      setClientPhone('');
      setClientEmail('');
      setItems([{ id: '1', description: '', quantity: 1, unit: 'pcs', rate: 0, discount: 0 }]);
      setTaxRate(0);
      setGlobalDiscount(0);
      setShippingFee(0);
      setAmountPaid(0);
      setStatusStamp('NONE');
      showToast('🔄 Invoice reset to blank.');
    }
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = sigCanvasRef.current;
    if (canvas) {
      setDrawnSignature(canvas.toDataURL('image/png'));
    }
  };

  const clearDrawnSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnSignature(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 print:bg-white text-slate-100 print:text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* =======================================================================
         DEDICATED PRINT STYLES (Pure White, Zero Margins, Perfect A4 / 80mm)
         ======================================================================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: ${paperFormat === 'pos' ? '80mm auto' : 'A4 portrait'};
                margin: 0mm !important;
              }
              html, body {
                background: #ffffff !important;
                color: #0f172a !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              body * {
                visibility: hidden !important;
              }
              #printable-invoice, #printable-invoice * {
                visibility: visible !important;
              }
              #printable-invoice {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: ${paperFormat === 'pos' ? '12px !important' : '36px 44px !important'};
                border: none !important;
                box-shadow: none !important;
                background: #ffffff !important;
                color: #0f172a !important;
                display: block !important;
              }
              .no-print {
                display: none !important;
              }
              input, textarea, select {
                border: none !important;
                background: transparent !important;
                outline: none !important;
                box-shadow: none !important;
                appearance: none !important;
                -webkit-appearance: none !important;
                resize: none !important;
              }
              /* Hide placeholder text when printing empty fields */
              input::placeholder, textarea::placeholder {
                color: transparent !important;
              }
            }

            /* Interactive Sheet Input Styling */
            .invoice-input {
              border: 1px solid transparent;
              background: transparent;
              border-radius: 4px;
              transition: all 0.15s ease;
              color: inherit;
            }
            .invoice-input:hover {
              background: rgba(241, 245, 249, 0.7);
              border-color: #cbd5e1;
            }
            .invoice-input:focus {
              background: #ffffff;
              border-color: ${activeTheme.hex};
              box-shadow: 0 0 0 2px ${activeTheme.hex}25;
              outline: none;
            }
          `
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* =======================================================================
         TOP STICKY STUDIO TOOLBAR (Sharda-Style Clean, One-Click Controls)
         ======================================================================= */}
      <div className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 sticky top-16 z-30 px-3 sm:px-6 py-2.5 shadow-xl print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Branding & Fast Format Toggle */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-colors"
              style={{ backgroundColor: activeTheme.hex }}
            >
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white">Ansar Invoice Studio</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  PRO FREE
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Interactive WYSIWYG Editor</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Auto-Calculation Live</span>
              </div>
            </div>
          </div>

          {/* Center: Color Themes & Currencies */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Color Swatches */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              {COLOR_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTheme(t)}
                  className={`w-6 h-6 rounded-lg transition-all flex items-center justify-center ${
                    activeTheme.id === t.id ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: t.hex }}
                  title={t.name}
                >
                  {activeTheme.id === t.id && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>

            {/* Currency Selector */}
            <select
              value={currency.code}
              onChange={(e) => {
                const found = CURRENCIES.find(c => c.code === e.target.value);
                if (found) setCurrency(found);
              }}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>

            {/* Paper Format Toggle */}
            <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaperFormat('a4')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  paperFormat === 'a4' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                📄 Standard A4
              </button>
              <button
                type="button"
                onClick={() => setPaperFormat('pos')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  paperFormat === 'pos' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                🧾 80mm POS Slip
              </button>
            </div>

            {/* Status Stamp / Watermark Switcher */}
            <div className="flex items-center gap-1.5">
              <select
                value={statusStamp}
                onChange={(e) => setStatusStamp(e.target.value as StatusStamp)}
                className="bg-slate-900 border border-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none text-slate-300 cursor-pointer"
              >
                <option value="NONE">Watermark: None</option>
                <option value="PAID">PAID (Green)</option>
                <option value="PENDING">PENDING (Amber)</option>
                <option value="OVERDUE">OVERDUE (Red)</option>
                <option value="DRAFT">DRAFT (Gray)</option>
                <option value="VOID">VOID (Red)</option>
              </select>

              {statusStamp !== 'NONE' && (
                <div className="flex bg-slate-900 border border-slate-700 p-0.5 rounded-xl text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setWatermarkPos('center')}
                    className={`px-2 py-1 rounded-lg transition-all ${
                      watermarkPos === 'center' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Center Watermark (Standard World Practice)"
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setWatermarkPos('stamp')}
                    className={`px-2 py-1 rounded-lg transition-all ${
                      watermarkPos === 'stamp' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Corner Rubber Stamp"
                  >
                    Corner
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Pro Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSaveCompanyProfile}
              className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
              title="Save company name, logo and bank info for next time"
            >
              <Building className="w-3.5 h-3.5 text-sky-400" /> Save Profile
            </button>

            <button
              type="button"
              onClick={handleSaveToHistory}
              className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
              title="Save this invoice to history list"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" /> Save
            </button>

            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all relative"
              title="View previously saved invoices"
            >
              <History className="w-3.5 h-3.5 text-amber-400" /> History
              {savedInvoices.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
              title="Download Microsoft Excel compatible CSV file"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all"
              title="Send bill details directly to client WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" /> WhatsApp
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>

            <button
              type="button"
              onClick={handleLoadDemo}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-amber-400 transition-colors"
              title="Load demo data"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors"
              title="Reset blank"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =======================================================================
         INTERACTIVE WORKSPACE CANVAS (WYSIWYG PAPER RIGHT IN THE CENTER)
         ======================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col items-center print:p-0 print:m-0 print:max-w-none">
        
        {/* Quick Instructions Notice for End Users */}
        <div className="w-full max-w-[850px] mb-4 bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-slate-400 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Click and type directly on any text or price on the invoice paper below.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Total: <strong className="text-white font-mono">{currency.symbol} {formatAmount(totalAmount)}</strong></span>
            <span className="text-slate-600">|</span>
            <span>Due: <strong className="text-rose-400 font-mono">{currency.symbol} {formatAmount(balanceDue)}</strong></span>
          </div>
        </div>

        {/* =====================================================================
           THE ACTUAL PRINTABLE INVOICE SHEET (WYSIWYG PAPER)
           ===================================================================== */}
        <div
          id="printable-invoice"
          className={`bg-white text-slate-900 shadow-2xl rounded-2xl transition-all relative overflow-hidden print:shadow-none print:m-0 print:p-0 print:border-none print:w-full print:block ${
            paperFormat === 'pos'
              ? 'w-full max-w-[420px] p-5 text-[11px] font-mono border border-slate-200'
              : 'w-full max-w-[850px] min-h-[1100px] p-8 sm:p-12 text-xs font-sans border border-slate-200'
          }`}
        >
          {/* Status Stamp / Watermark Overlay (World Standard Centered or Corner Stamp) */}
          {statusStamp !== 'NONE' && (
            <div
              className={`pointer-events-none select-none z-10 overflow-hidden ${
                watermarkPos === 'center'
                  ? 'absolute inset-0 flex items-center justify-center p-4'
                  : 'absolute top-8 right-8 sm:right-16'
              }`}
            >
              <div
                className={`uppercase font-black transition-all text-center ${
                  watermarkPos === 'center'
                    ? paperFormat === 'pos'
                      ? 'text-3xl sm:text-4xl tracking-[0.18em] px-6 py-2 border-2 sm:border-4 border-dashed rounded-2xl transform -rotate-[22deg]'
                      : 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.22em] sm:tracking-[0.28em] px-8 sm:px-20 py-4 sm:py-8 border-4 sm:border-8 border-dashed rounded-3xl sm:rounded-4xl transform -rotate-[26deg]'
                    : 'text-2xl sm:text-3xl tracking-[0.15em] px-5 sm:px-7 py-2 sm:py-2.5 border-3 sm:border-4 border-solid rounded-2xl transform -rotate-[14deg] shadow-sm'
                } ${
                  statusStamp === 'PAID'
                    ? 'text-emerald-700 border-emerald-700'
                    : statusStamp === 'PENDING'
                    ? 'text-amber-600 border-amber-600'
                    : statusStamp === 'OVERDUE'
                    ? 'text-rose-600 border-rose-600'
                    : statusStamp === 'DRAFT'
                    ? 'text-slate-600 border-slate-600'
                    : 'text-red-700 border-red-700'
                }`}
                style={{
                  opacity: watermarkPos === 'center' ? 0.16 : 0.85,
                  mixBlendMode: watermarkPos === 'center' ? 'multiply' : 'normal',
                }}
              >
                {statusStamp}
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------------
              VIEW 1: 80mm POS THERMAL RECEIPT / CASH MEMO
              ------------------------------------------------------------------- */}
          {paperFormat === 'pos' ? (
            <div className="flex flex-col gap-3">
              {/* Store Header */}
              <div className="text-center border-b border-dashed border-slate-400 pb-3">
                {companyLogo && (
                  <div className="relative group inline-block mb-2">
                    <Image src={companyLogo} alt="Logo" width={120} height={48} unoptimized className="h-12 w-auto mx-auto object-contain" />
                    <button
                      type="button"
                      onClick={() => setCompanyLogo(null)}
                      className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity no-print"
                      title="Remove Logo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {!companyLogo && (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="text-[10px] text-slate-400 hover:text-slate-700 border border-dashed border-slate-300 rounded px-2 py-1 mb-2 inline-block no-print"
                  >
                    + Upload Store Logo
                  </button>
                )}
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Store / Company Name"
                  className="invoice-input text-base font-bold uppercase tracking-wider text-slate-900 text-center w-full"
                />
                <input
                  type="text"
                  value={companyTagline}
                  onChange={(e) => setCompanyTagline(e.target.value)}
                  placeholder="Tagline or Branch Name"
                  className="invoice-input text-[10px] text-slate-600 text-center w-full"
                />
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Store Address"
                  className="invoice-input text-[10px] text-slate-600 text-center w-full"
                />
                <input
                  type="text"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="Phone: +92 300 1234567"
                  className="invoice-input text-[10px] text-slate-600 text-center w-full"
                />
                <input
                  type="text"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                  placeholder="NTN / GST Reg No."
                  className="invoice-input text-[10px] font-bold text-slate-800 text-center w-full mt-0.5"
                />
              </div>

              {/* POS Slip Meta */}
              <div className="flex justify-between text-[10px] border-b border-dashed border-slate-300 pb-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Bill:</span>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="invoice-input font-bold text-slate-900 w-24"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Client:</span>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Walk-in Client"
                      className="invoice-input text-slate-800 font-medium w-28"
                    />
                  </div>
                </div>
                <div className="text-right space-y-0.5">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-slate-500">Date:</span>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="invoice-input text-right w-24 font-mono text-[10px]"
                    />
                  </div>
                  <p className="text-slate-500 text-[9px]">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* POS Table */}
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-slate-900 text-left">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Price</th>
                    <th className="py-1 text-right">Total</th>
                    <th className="w-4 no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const itemTotal = item.quantity * item.rate * (1 - item.discount / 100);
                    return (
                      <tr key={item.id} className="border-b border-slate-100 group">
                        <td className="py-1 pr-1">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                            placeholder="Item name"
                            className="invoice-input font-semibold w-full"
                          />
                        </td>
                        <td className="py-1 text-center w-12">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                            className="invoice-input text-center w-10 font-mono"
                          />
                        </td>
                        <td className="py-1 text-right w-16">
                          <input
                            type="number"
                            min="0"
                            value={item.rate}
                            onChange={(e) => handleUpdateItem(item.id, 'rate', Number(e.target.value))}
                            className="invoice-input text-right w-16 font-mono"
                          />
                        </td>
                        <td className="py-1 text-right font-bold font-mono w-16">
                          {formatAmount(itemTotal)}
                        </td>
                        <td className="text-center no-print">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Add POS item button */}
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-1.5 border border-dashed border-slate-300 hover:border-slate-800 rounded text-[10px] text-slate-600 font-bold transition-colors no-print"
              >
                + Add Item
              </button>

              {/* POS Totals */}
              <div className="border-t border-dashed border-slate-900 pt-2 flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">{currency.symbol} {formatAmount(subtotal)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between text-[10px] text-slate-700">
                    <span>{taxLabel} ({taxRate}%):</span>
                    <span className="font-mono">{currency.symbol} {formatAmount(taxAmount)}</span>
                  </div>
                )}
                {globalDiscount > 0 && (
                  <div className="flex justify-between text-[10px] text-slate-700">
                    <span>Discount:</span>
                    <span className="font-mono">-{currency.symbol} {formatAmount(globalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm border-t border-slate-900 pt-1">
                  <span>TOTAL:</span>
                  <span className="font-mono">{currency.symbol} {formatAmount(totalAmount)}</span>
                </div>
                {amountPaid > 0 && (
                  <div className="flex justify-between text-[10px]">
                    <span>Paid:</span>
                    <span className="font-mono">{currency.symbol} {formatAmount(amountPaid)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[11px] text-rose-700">
                  <span>BALANCE DUE:</span>
                  <span className="font-mono">{currency.symbol} {formatAmount(balanceDue)}</span>
                </div>
              </div>

              {/* Amount in words */}
              <p className="text-[9px] text-slate-600 italic border-t border-dashed border-slate-300 pt-1">
                Words: {amountInWords}
              </p>

              {/* QR Code on POS */}
              {showQrCode && qrValue && (
                <div className="flex flex-col items-center justify-center my-2 pt-2 border-t border-dashed border-slate-300">
                  <QRCodeSVG value={qrValue} size={70} />
                  <span className="text-[9px] text-slate-600 mt-1">Scan to Pay</span>
                </div>
              )}

              {/* Footer Note */}
              <div className="text-center text-[10px] text-slate-700 border-t border-dashed border-slate-400 pt-2 mt-2">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="invoice-input text-center text-[10px] w-full"
                />
                <p className="font-bold mt-1">*** THANK YOU FOR YOUR VISIT ***</p>
                <p className="text-[8px] text-slate-400 mt-1">Generated with Ansar Tools Studio</p>
              </div>
            </div>
          ) : (
            /* -----------------------------------------------------------------
                VIEW 2: FULL STANDARD A4 INVOICE SHEET (SHARDA-STYLE WYSIWYG)
                ----------------------------------------------------------------- */
            <div className="flex flex-col justify-between min-h-[980px]">
              <div>
                {/* Header Top Row: Logo & Business Info (Left), Invoice Title & Meta (Right) */}
                <div className="flex items-start justify-between gap-6 pb-6 border-b border-slate-200">
                  {/* Left: Logo Box & Company Details */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Interactive Logo Upload Box */}
                    <div className="relative group shrink-0">
                      {companyLogo ? (
                        <div className="relative w-28 h-20 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center bg-slate-50">
                          <Image src={companyLogo} alt="Logo" width={112} height={80} unoptimized className="max-w-full max-h-full object-contain p-1" />
                          <button
                            type="button"
                            onClick={() => setCompanyLogo(null)}
                            className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md no-print"
                            title="Remove Logo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="w-28 h-20 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50/50 no-print"
                        >
                          <ImageIcon className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-semibold">+ Add Logo</span>
                        </button>
                      )}
                    </div>

                    {/* Company Details Inline Inputs */}
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your Company / Business Name"
                        className="invoice-input text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 w-full"
                      />
                      <input
                        type="text"
                        value={companyTagline}
                        onChange={(e) => setCompanyTagline(e.target.value)}
                        placeholder="Tagline or Business Nature"
                        className="invoice-input text-xs font-medium text-slate-500 w-full"
                      />
                      <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                        <input
                          type="text"
                          value={companyAddress}
                          onChange={(e) => setCompanyAddress(e.target.value)}
                          placeholder="Street Address, Plaza"
                          className="invoice-input w-full"
                        />
                        <input
                          type="text"
                          value={companyCity}
                          onChange={(e) => setCompanyCity(e.target.value)}
                          placeholder="City, State, Country"
                          className="invoice-input w-full"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={companyPhone}
                            onChange={(e) => setCompanyPhone(e.target.value)}
                            placeholder="Phone: +92 300 1234567"
                            className="invoice-input w-1/2"
                          />
                          <input
                            type="text"
                            value={companyEmail}
                            onChange={(e) => setCompanyEmail(e.target.value)}
                            placeholder="Email: billing@domain.com"
                            className="invoice-input w-1/2"
                          />
                        </div>
                        <input
                          type="text"
                          value={companyTaxId}
                          onChange={(e) => setCompanyTaxId(e.target.value)}
                          placeholder="NTN / GST / VAT Registration Number"
                          className="invoice-input font-bold text-slate-800 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Invoice Title & Meta Details */}
                  <div className="text-right flex flex-col items-end min-w-[220px]">
                    <input
                      type="text"
                      value={invoiceTitle}
                      onChange={(e) => setInvoiceTitle(e.target.value)}
                      placeholder="INVOICE"
                      className="invoice-input text-3xl sm:text-4xl font-black uppercase tracking-wider text-right mb-2 w-56"
                      style={{ color: activeTheme.hex }}
                    />
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] space-y-1.5 text-right w-full shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500 font-medium">Invoice No:</span>
                        <input
                          type="text"
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          className="invoice-input font-mono font-bold text-slate-900 text-right w-32"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500 font-medium">Invoice Date:</span>
                        <input
                          type="date"
                          value={invoiceDate}
                          onChange={(e) => setInvoiceDate(e.target.value)}
                          className="invoice-input font-medium text-slate-800 text-right w-32 font-mono text-[11px]"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500 font-medium">Payment Due:</span>
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="invoice-input font-bold text-rose-600 text-right w-32 font-mono text-[11px]"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500 font-medium">PO / Ref #:</span>
                        <input
                          type="text"
                          value={poNumber}
                          onChange={(e) => setPoNumber(e.target.value)}
                          placeholder="Optional"
                          className="invoice-input font-mono text-slate-700 text-right w-32"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row: Client (Bill To) & Quick Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
                  {/* Bill To Info */}
                  <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Billed To (Client Details):
                    </span>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Client or Contact Name"
                      className="invoice-input text-sm font-bold text-slate-900 w-full mb-0.5"
                    />
                    <input
                      type="text"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      placeholder="Company Name (e.g. Apex Global)"
                      className="invoice-input text-xs text-slate-700 font-medium w-full mb-1"
                    />
                    <div className="text-[11px] text-slate-600 space-y-0.5 leading-relaxed">
                      <input
                        type="text"
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                        placeholder="Client Street Address"
                        className="invoice-input w-full"
                      />
                      <input
                        type="text"
                        value={clientCity}
                        onChange={(e) => setClientCity(e.target.value)}
                        placeholder="Client City, Country"
                        className="invoice-input w-full"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="Phone / WhatsApp"
                          className="invoice-input w-1/2"
                        />
                        <input
                          type="text"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="Client Email"
                          className="invoice-input w-1/2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Balance Due Highlight Card */}
                  <div className="flex flex-col justify-between items-end text-right">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full sm:w-64 text-right shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Balance Due:
                      </span>
                      <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900" style={{ color: activeTheme.hex }}>
                        {currency.symbol} {formatAmount(balanceDue)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Due Date: <strong className="text-rose-600">{dueDate}</strong>
                      </div>
                      {amountPaid > 0 && (
                        <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                          Advance Paid: {currency.symbol} {formatAmount(amountPaid)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Table of Line Items (Sharda Style Direct Row Editing) */}
                <div className="my-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr
                        className="text-[11px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: activeTheme.hex }}
                      >
                        <th className="py-3 px-3 w-8 text-center">#</th>
                        <th className="py-3 px-3">Description</th>
                        <th className="py-3 px-3 text-center w-20">Qty</th>
                        <th className="py-3 px-3 text-center w-20">Unit</th>
                        <th className="py-3 px-3 text-right w-28">Rate ({currency.symbol})</th>
                        <th className="py-3 px-3 text-center w-16">Disc %</th>
                        <th className="py-3 px-3 text-right w-32">Total ({currency.symbol})</th>
                        <th className="py-3 px-2 w-8 text-center no-print"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {items.map((item, idx) => {
                        const itemTotal = item.quantity * item.rate * (1 - item.discount / 100);
                        return (
                          <tr key={item.id} className={`group ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                            {/* Row Index */}
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                              {idx + 1}
                            </td>

                            {/* Description */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                                placeholder="Service or product description..."
                                className="invoice-input font-medium text-slate-900 w-full"
                              />
                            </td>

                            {/* Qty */}
                            <td className="py-2 px-3 text-center">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                                className="invoice-input text-center font-mono w-14"
                              />
                            </td>

                            {/* Unit */}
                            <td className="py-2 px-3 text-center">
                              <input
                                type="text"
                                value={item.unit}
                                onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                                placeholder="pcs/hrs"
                                className="invoice-input text-center text-slate-500 text-[11px] w-14"
                              />
                            </td>

                            {/* Rate */}
                            <td className="py-2 px-3 text-right">
                              <input
                                type="number"
                                min="0"
                                value={item.rate}
                                onChange={(e) => handleUpdateItem(item.id, 'rate', Number(e.target.value))}
                                className="invoice-input text-right font-mono text-slate-800 w-24"
                              />
                            </td>

                            {/* Disc */}
                            <td className="py-2 px-3 text-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.discount}
                                onChange={(e) => handleUpdateItem(item.id, 'discount', Number(e.target.value))}
                                className="invoice-input text-center font-mono text-slate-600 text-[11px] w-12"
                              />
                            </td>

                            {/* Row Total */}
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                              {formatAmount(itemTotal)}
                            </td>

                            {/* Delete Action */}
                            <td className="py-2.5 px-2 text-center no-print">
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Line Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* + Add Item Button on Paper */}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2 border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all mb-6 bg-slate-50/50 hover:bg-slate-100/60 no-print"
                >
                  <Plus className="w-4 h-4" /> Add Another Line Item
                </button>

                {/* Calculations & Payment Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 items-start">
                  
                  {/* Left Column: Legal Amount in Words & Bank / QR Info */}
                  <div className="flex flex-col gap-4">
                    
                    {/* Amount in words card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Amount in Words:
                      </span>
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed italic">
                        {amountInWords}
                      </p>
                    </div>

                    {/* Payment / Bank Info Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          Bank & Payment Details:
                        </span>
                        <div className="flex items-center gap-1.5 no-print text-[10px] text-slate-500">
                          <input
                            type="checkbox"
                            checked={showQrCode}
                            onChange={(e) => setShowQrCode(e.target.checked)}
                            className="rounded text-blue-600"
                            id="qrCheck"
                          />
                          <label htmlFor="qrCheck" className="cursor-pointer">QR Code</label>
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div className="text-[11px] space-y-1 flex-1">
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="Bank Name (e.g. Meezan Bank)"
                            className="invoice-input font-bold text-slate-900 w-full"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 shrink-0">A/C:</span>
                            <input
                              type="text"
                              value={accountTitle}
                              onChange={(e) => setAccountTitle(e.target.value)}
                              placeholder="Account Title"
                              className="invoice-input text-slate-700 w-full font-mono text-[11px]"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 shrink-0">IBAN:</span>
                            <input
                              type="text"
                              value={iban}
                              onChange={(e) => {
                                setIban(e.target.value);
                                setQrValue(e.target.value);
                              }}
                              placeholder="IBAN or Account Number"
                              className="invoice-input font-bold text-slate-900 w-full font-mono text-[11px]"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 shrink-0">Wallet:</span>
                            <input
                              type="text"
                              value={walletNumber}
                              onChange={(e) => setWalletNumber(e.target.value)}
                              placeholder="JazzCash / EasyPaisa / UPI"
                              className="invoice-input text-slate-700 w-full font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        {/* Live Scan-to-Pay QR Code */}
                        {showQrCode && qrValue && (
                          <div className="text-center shrink-0">
                            <div className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                              <QRCodeSVG value={qrValue} size={68} />
                            </div>
                            <span className="text-[9px] text-slate-500 block mt-1">Scan to Pay</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Math Calculation Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 shadow-sm">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {currency.symbol} {formatAmount(subtotal)}
                      </span>
                    </div>

                    {/* Tax Rate & Label */}
                    <div className="flex justify-between items-center text-slate-600 gap-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={taxLabel}
                          onChange={(e) => setTaxLabel(e.target.value)}
                          placeholder="GST/VAT"
                          className="invoice-input text-[11px] w-20"
                        />
                        <span>(</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={taxRate}
                          onChange={(e) => setTaxRate(Number(e.target.value))}
                          className="invoice-input text-center font-mono w-10 text-[11px]"
                        />
                        <span>%):</span>
                      </div>
                      <span className="font-mono font-semibold text-slate-900">
                        {currency.symbol} {formatAmount(taxAmount)}
                      </span>
                    </div>

                    {/* Global Discount */}
                    <div className="flex justify-between items-center text-slate-600 gap-2">
                      <div className="flex items-center gap-1">
                        <span>Discount ({currency.symbol}):</span>
                        <input
                          type="number"
                          min="0"
                          value={globalDiscount}
                          onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                          placeholder="0"
                          className="invoice-input text-right font-mono w-20 text-[11px]"
                        />
                      </div>
                      <span className="font-mono font-semibold text-emerald-600">
                        -{currency.symbol} {formatAmount(globalDiscount)}
                      </span>
                    </div>

                    {/* Shipping Fee */}
                    <div className="flex justify-between items-center text-slate-600 gap-2">
                      <div className="flex items-center gap-1">
                        <span>Delivery / Shipping:</span>
                        <input
                          type="number"
                          min="0"
                          value={shippingFee}
                          onChange={(e) => setShippingFee(Number(e.target.value))}
                          placeholder="0"
                          className="invoice-input text-right font-mono w-20 text-[11px]"
                        />
                      </div>
                      <span className="font-mono font-semibold text-slate-900">
                        {currency.symbol} {formatAmount(shippingFee)}
                      </span>
                    </div>

                    {/* GRAND TOTAL (Colored Banner) */}
                    <div
                      className="rounded-lg p-3 text-white flex justify-between items-center shadow-md font-bold text-sm my-2 transition-colors"
                      style={{ backgroundColor: activeTheme.hex }}
                    >
                      <span className="uppercase tracking-wide">Total Amount:</span>
                      <span className="text-base sm:text-lg font-mono font-black">
                        {currency.symbol} {formatAmount(totalAmount)}
                      </span>
                    </div>

                    {/* Amount Paid / Advance */}
                    <div className="flex justify-between items-center text-slate-600 gap-2">
                      <div className="flex items-center gap-1">
                        <span>Amount Paid / Advance:</span>
                        <input
                          type="number"
                          min="0"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(Number(e.target.value))}
                          placeholder="0"
                          className="invoice-input text-right font-mono w-24 text-[11px] text-emerald-700 font-bold"
                        />
                      </div>
                      <span className="font-mono font-bold text-emerald-600">
                        {currency.symbol} {formatAmount(amountPaid)}
                      </span>
                    </div>

                    {/* Balance Due */}
                    <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-center text-rose-600 font-bold">
                      <span className="uppercase tracking-wider text-xs">Balance Due:</span>
                      <span className="font-mono text-base font-black">
                        {currency.symbol} {formatAmount(balanceDue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes & Terms (Editable Directly on the Paper) */}
                <div className="border-t border-slate-200 pt-4 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-slate-600 leading-relaxed">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                      Notes / Message:
                    </span>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Special note for the client..."
                      className="invoice-input w-full p-1.5 resize-y"
                    />
                  </div>
                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                      Terms & Conditions:
                    </span>
                    <textarea
                      rows={2}
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      placeholder="Terms and conditions..."
                      className="invoice-input w-full p-1.5 resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Official Stamp & Interactive Signature Box */}
              <div className="border-t border-slate-200 pt-6 mt-8 flex items-end justify-between">
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <p>Computer Generated Invoice • 100% Tax Compliant</p>
                  <p>Created with Ansar Studio Pro Invoicing & POS Suite</p>
                </div>

                {/* Interactive Signature Box (Click to Draw, Type or Upload) */}
                <div
                  onClick={() => setShowSigModal(true)}
                  className="cursor-pointer group flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  title="Click to sign invoice"
                >
                  {signatureMode === 'type' && (
                    <p className="font-serif italic text-xl text-slate-900 mb-1 px-4 text-center">
                      {typedSignature || 'Authorized Sign'}
                    </p>
                  )}
                  {signatureMode === 'draw' && drawnSignature && (
                    <Image src={drawnSignature} alt="Signature" width={160} height={48} unoptimized className="h-12 w-auto mb-1 object-contain" />
                  )}
                  {signatureMode === 'upload' && uploadedSignature && (
                    <Image src={uploadedSignature} alt="Signature" width={160} height={48} unoptimized className="h-12 w-auto mb-1 object-contain" />
                  )}
                  {signatureMode === 'none' && (
                    <div className="h-10 flex items-center justify-center text-slate-400 text-[10px] no-print">
                      + Click to Add Signature
                    </div>
                  )}

                  <div className="w-48 border-t border-slate-900 pt-1 text-center">
                    <span className="text-[11px] font-bold text-slate-800 block">Authorized Signature</span>
                    <span className="text-[9px] text-slate-500">For {companyName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden Native File Inputs for Logo and Signature */}
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
        />
        <input
          ref={sigUploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              const r = new FileReader();
              r.onload = (ev) => {
                if (ev.target?.result) {
                  setUploadedSignature(ev.target.result as string);
                  setSignatureMode('upload');
                }
              };
              r.readAsDataURL(f);
            }
          }}
        />

        {/* Floating Quick Action Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-3 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" /> 1-Click Print / Download PDF
          </button>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="px-5 py-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Share2 className="w-4 h-4" /> Send on WhatsApp
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-5 py-3 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel CSV
          </button>
          <button
            type="button"
            onClick={handleSaveCompanyProfile}
            className="px-5 py-3 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Building className="w-4 h-4 text-sky-400" /> Save Business Profile
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mt-3 text-center print:hidden">
          💡 <strong>Tip:</strong> In the print preview, select <em>Save as PDF</em> to export a vector crisp PDF without watermarks.
        </p>
      </main>

      {/* =======================================================================
         SIGNATURE CUSTOMIZATION MODAL (Draw / Type / Upload)
         ======================================================================= */}
      {showSigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-emerald-400" /> Authorized Signature & Stamp
              </h3>
              <button
                type="button"
                onClick={() => setShowSigModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Signature Modes Switcher */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl mb-4 border border-slate-800">
              {[
                { id: 'type', label: 'Type' },
                { id: 'draw', label: 'Draw' },
                { id: 'upload', label: 'Upload' },
                { id: 'none', label: 'None' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSignatureMode(m.id as SignatureMode)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    signatureMode === m.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Mode 1: Type Signature */}
            {signatureMode === 'type' && (
              <div className="space-y-3">
                <label className="text-xs text-slate-300 block">Signatory Name</label>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="e.g. Mohammad Ansar"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="p-4 bg-white rounded-xl text-center border border-slate-200">
                  <p className="font-serif italic text-2xl text-slate-900">{typedSignature || 'Signature Preview'}</p>
                </div>
              </div>
            )}

            {/* Mode 2: Draw on Screen Canvas */}
            {signatureMode === 'draw' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-300">Draw with Finger or Mouse:</span>
                  <button
                    type="button"
                    onClick={clearDrawnSignature}
                    className="text-[11px] text-rose-400 hover:text-rose-300 underline"
                  >
                    Clear Canvas
                  </button>
                </div>
                <div className="border border-slate-700 rounded-xl overflow-hidden bg-white">
                  <canvas
                    ref={sigCanvasRef}
                    width={380}
                    height={120}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full touch-none cursor-crosshair"
                  />
                </div>
                <p className="text-[10px] text-slate-400 text-center">Canvas automatically captures signature</p>
              </div>
            )}

            {/* Mode 3: Upload PNG */}
            {signatureMode === 'upload' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => sigUploadInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl bg-slate-950 flex flex-col items-center justify-center text-xs text-slate-300 hover:text-white transition-all"
                >
                  <ImageIcon className="w-6 h-6 text-emerald-400 mb-1" />
                  <span>Choose Transparent PNG Signature or Seal</span>
                </button>
                {uploadedSignature && (
                  <div className="p-3 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                    <Image src={uploadedSignature} alt="Uploaded Sig" width={180} height={64} unoptimized className="max-h-16 w-auto object-contain" />
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSigModal(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Apply Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
         INVOICE HISTORY MODAL (Sharda & Zoho Style Archive)
         ======================================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-400" /> Saved Invoices & Receipts
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Quickly reload previously created client invoices</p>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {savedInvoices.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p>No saved invoices found in browser storage.</p>
                <p className="text-[10px] text-slate-500 mt-1">Click &quot;Save&quot; in the top bar to store an invoice here.</p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800 pr-1 space-y-1">
                {savedInvoices.map((rec) => (
                  <div key={rec.id} className="p-3 bg-slate-950/60 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-950 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{rec.invoiceNumber}</span>
                        <span className="text-[10px] text-slate-400">• {rec.clientName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {rec.savedAt} | <strong className="text-emerald-400">{rec.currencySymbol} {formatAmount(rec.totalAmount)}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadInvoiceRecord(rec)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInvoiceRecord(rec.id)}
                        className="p-1 text-slate-400 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={handleSaveToHistory}
                className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <Save className="w-3.5 h-3.5" /> Save Current Invoice Now
              </button>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
         SEO, STANDARDS & USER GUIDE SECTION
         ======================================================================= */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-800/80 mt-12 print:hidden">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Professional Invoicing, GST & Cash Memo Standards
        </h2>
        <p className="text-xs text-slate-400 text-center mb-8 max-w-2xl mx-auto">
          Compliant with global invoicing regulations, tax authority requirements (NTN, GST, VAT), and fast cyber cafe & retail billing standards.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏛️</span>
                <h3 className="text-sm font-bold text-white">NTN / GST Tax Invoices</h3>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Tax Compliance:</strong> Print official NTN, GST, or VAT registration numbers.</li>
                <li>• <strong>Itemized Math:</strong> Automatic percentage tax calculation and subtotals.</li>
                <li>• <strong>Amount in Words:</strong> Legal requirement for high-value tax bills.</li>
              </ul>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold mt-4">Corporate Compliant</span>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🧾</span>
                <h3 className="text-sm font-bold text-white">80mm POS Thermal Slip</h3>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Retail & Cyber Cafes:</strong> Perfect for supermarket, restaurant, or cyber shop rolls.</li>
                <li>• <strong>Compact Monospace:</strong> Clear legible typography for thermal printers.</li>
                <li>• <strong>QR Code Included:</strong> Customers can scan straight from the slip.</li>
              </ul>
            </div>
            <span className="text-[10px] text-blue-400 font-semibold mt-4">Fast Counter Billing</span>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📲</span>
                <h3 className="text-sm font-bold text-white">Scan-to-Pay QR & Wallets</h3>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Bank IBAN:</strong> Meezan, HBL, SBI, Wise, or any international IBAN.</li>
                <li>• <strong>Mobile Wallets:</strong> EasyPaisa, JazzCash, UPI, Google Pay, or PayPal link.</li>
                <li>• <strong>Zero Friction:</strong> Paid faster by letting clients scan with any banking app.</li>
              </ul>
            </div>
            <span className="text-[10px] text-purple-400 font-semibold mt-4">Instant Settlement</span>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✍️</span>
                <h3 className="text-sm font-bold text-white">Signature, History & Excel</h3>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>• <strong>Digital Signature:</strong> Draw on canvas, type cursive, or upload company stamp.</li>
                <li>• <strong>1-Click Excel:</strong> Export full structured CSV for accounting & bookkeeping.</li>
                <li>• <strong>Invoice Archive:</strong> Save and restore client invoices anytime.</li>
              </ul>
            </div>
            <span className="text-[10px] text-amber-400 font-semibold mt-4">100% Free & Unlimited</span>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
