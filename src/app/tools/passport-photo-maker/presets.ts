export interface CountryPreset {
  id: string;
  country: string;
  category: string;
  document: string;
  widthMm: number;
  heightMm: number;
  widthPx: number; // calculated at 300 DPI
  heightPx: number; // calculated at 300 DPI
  bgColor: string; // recommended bg hex
  bgName: string;
  faceHeightPercent: number; // e.g. 75 means head should occupy 70-80% of photo
  flag: string; // emoji flag
  description: string;
}

export interface PaperPreset {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
}

// Convert mm to pixels at specified DPI (default 300 DPI)
export function mmToPx(mm: number, dpi: number = 300): number {
  return Math.round((mm / 25.4) * dpi);
}

// Convert inches to pixels at specified DPI
export function inchesToPx(inches: number, dpi: number = 300): number {
  return Math.round(inches * dpi);
}

export const COUNTRY_PRESETS: CountryPreset[] = [
  // Pakistan
  {
    id: 'pk-passport',
    country: 'Pakistan',
    category: 'Asia',
    document: 'Passport & Nadra ID',
    widthMm: 35,
    heightMm: 45,
    widthPx: mmToPx(35),
    heightPx: mmToPx(45),
    bgColor: '#FFFFFF',
    bgName: 'White / Light Blue',
    faceHeightPercent: 75,
    flag: '🇵🇰',
    description: '35×45 mm official standard for Pakistan Machine Readable Passport & Nadra CNIC'
  },
  {
    id: 'pk-visa',
    country: 'Pakistan',
    category: 'Asia',
    document: '2×2 inch (Embassy / Visa)',
    widthMm: 50.8,
    heightMm: 50.8,
    widthPx: 600,
    heightPx: 600,
    bgColor: '#FFFFFF',
    bgName: 'White',
    faceHeightPercent: 65,
    flag: '🇵🇰',
    description: '2×2 inch (51×51 mm, 600×600 px) for foreign embassies & visa applications in Pakistan'
  },

  // United States
  {
    id: 'us-passport',
    country: 'United States',
    category: 'North America',
    document: 'US Passport & Visa',
    widthMm: 50.8,
    heightMm: 50.8,
    widthPx: 600,
    heightPx: 600,
    bgColor: '#FFFFFF',
    bgName: 'Pure White',
    faceHeightPercent: 65,
    flag: '🇺🇸',
    description: '2×2 inch (600×600 px @ 300 DPI), head must be 1 to 1 3/8 inches (50-69%)'
  },

  // India
  {
    id: 'in-passport',
    country: 'India',
    category: 'Asia',
    document: 'Indian Passport (3.5×4.5 cm)',
    widthMm: 35,
    heightMm: 45,
    widthPx: mmToPx(35),
    heightPx: mmToPx(45),
    bgColor: '#FFFFFF',
    bgName: 'White',
    faceHeightPercent: 75,
    flag: '🇮🇳',
    description: '35×45 mm with 70–80% face coverage, plain white background'
  },
  {
    id: 'in-pan',
    country: 'India',
    category: 'Asia',
    document: 'PAN Card',
    widthMm: 25,
    heightMm: 35,
    widthPx: mmToPx(25),
    heightPx: mmToPx(35),
    bgColor: '#FFFFFF',
    bgName: 'White',
    faceHeightPercent: 70,
    flag: '🇮🇳',
    description: '25×35 mm official photo for Indian NSDL/UTIITSL PAN Card'
  },
  {
    id: 'in-stamp',
    country: 'India',
    category: 'Asia',
    document: 'Stamp Size Photo',
    widthMm: 20,
    heightMm: 25,
    widthPx: mmToPx(20),
    heightPx: mmToPx(25),
    bgColor: '#FFFFFF',
    bgName: 'White',
    faceHeightPercent: 70,
    flag: '🇮🇳',
    description: '20×25 mm standard stamp size for official documents & job cards'
  },

  // United Kingdom
  {
    id: 'uk-passport',
    country: 'United Kingdom',
    category: 'Europe',
    document: 'UK Passport & Driving Licence',
    widthMm: 35,
    heightMm: 45,
    widthPx: mmToPx(35),
    heightPx: mmToPx(45),
    bgColor: '#F4F4EC',
    bgName: 'Cream / Off-White',
    faceHeightPercent: 75,
    flag: '🇬🇧',
    description: '35×45 mm with plain cream or light grey background, head 29–34mm'
  },

  // Schengen / European Union
  {
    id: 'eu-schengen',
    country: 'Schengen / Europe',
    category: 'Europe',
    document: 'Schengen Visa & EU Passport',
    widthMm: 35,
    heightMm: 45,
    widthPx: mmToPx(35),
    heightPx: mmToPx(45),
    bgColor: '#E5E7EB',
    bgName: 'Light Grey',
    faceHeightPercent: 75,
    flag: '🇪🇺',
    description: '35×45 mm biometric photo with light grey background, 70–80% face height'
  },

  // Canada
  {
    id: 'ca-passport',
    country: 'Canada',
    category: 'North America',
    document: 'Canadian Passport (50×70 mm)',
    widthMm: 50,
    heightMm: 70,
    widthPx: mmToPx(50),
    heightPx: mmToPx(70),
    bgColor: '#FFFFFF',
    bgName: 'Plain White',
    faceHeightPercent: 68,
    flag: '🇨🇦',
    description: '50×70 mm (2×2.75 in), face length between 31mm and 36mm'
  },

  // Saudi Arabia & UAE
  {
    id: 'sa-umrah',
    country: 'Saudi Arabia',
    category: 'Middle East',
    document: 'Umrah / Hajj Visa & 2×2"',
    widthMm: 50.8,
    heightMm: 50.8,
    widthPx: 600,
    heightPx: 600,
    bgColor: '#FFFFFF',
    bgName: 'Pure White',
    faceHeightPercent: 68,
    flag: '🇸🇦',
    description: '2×2 inch (51×51 mm) or 40×60 mm with pure white background'
  },
  {
    id: 'sa-iqama',
    country: 'Saudi Arabia',
    category: 'Middle East',
    document: 'Saudi Iqama / Visa (4×6 cm)',
    widthMm: 40,
    heightMm: 60,
    widthPx: mmToPx(40),
    heightPx: mmToPx(60),
    bgColor: '#FFFFFF',
    bgName: 'White',
    faceHeightPercent: 72,
    flag: '🇸🇦',
    description: '40×60 mm (4×6 cm) standard for Saudi residency (Iqama) & work visa'
  },
  {
    id: 'ae-visa',
    country: 'United Arab Emirates',
    category: 'Middle East',
    document: 'UAE / Dubai Visa & Emirates ID',
    widthMm: 43,
    heightMm: 55,
    widthPx: mmToPx(43),
    heightPx: mmToPx(55),
    bgColor: '#FFFFFF',
    bgName: 'White',
    faceHeightPercent: 75,
    flag: '🇦🇪',
    description: '43×55 mm or 35×45 mm with white background for Emirates ID & Dubai Visa'
  },

  // China
  {
    id: 'cn-visa',
    country: 'China',
    category: 'Asia',
    document: 'Chinese Visa & Passport',
    widthMm: 33,
    heightMm: 48,
    widthPx: mmToPx(33),
    heightPx: mmToPx(48),
    bgColor: '#FFFFFF',
    bgName: 'Pure White',
    faceHeightPercent: 72,
    flag: '🇨🇳',
    description: '33×48 mm with pure white background, head width 15–22mm, height 28–33mm'
  },

  // Australia
  {
    id: 'au-passport',
    country: 'Australia',
    category: 'Oceania',
    document: 'Australian Passport & Visa',
    widthMm: 35,
    heightMm: 45,
    widthPx: mmToPx(35),
    heightPx: mmToPx(45),
    bgColor: '#E5E7EB',
    bgName: 'Light Grey / White',
    faceHeightPercent: 75,
    flag: '🇦🇺',
    description: '35×45 mm with plain cream or light grey background, face 32–36mm'
  },

  // Malaysia
  {
    id: 'my-passport',
    country: 'Malaysia',
    category: 'Asia',
    document: 'Malaysian Passport (Blue BG)',
    widthMm: 35,
    heightMm: 50,
    widthPx: mmToPx(35),
    heightPx: mmToPx(50),
    bgColor: '#0284C7',
    bgName: 'Light Blue',
    faceHeightPercent: 72,
    flag: '🇲🇾',
    description: '35×50 mm with light blue background for Malaysian immigration'
  },
  // Competitive Exams & Sarkari / Govt Portals
  {
    id: 'govt-exam-dop',
    country: 'India & Pakistan Exams',
    category: 'Exams & Govt',
    document: 'Govt Job / SSC / UPSC (With Name & DOP)',
    widthMm: 35,
    heightMm: 45,
    widthPx: mmToPx(35),
    heightPx: mmToPx(45),
    bgColor: '#FFFFFF',
    bgName: 'Pure White',
    faceHeightPercent: 75,
    flag: '🏛️',
    description: '35×45 mm standard for SSC, UPSC, Railway, Police & State Govt forms with candidate Name & Date of Photo (20–50 KB)'
  },
  {
    id: 'us-dv-lottery',
    country: 'United States',
    category: 'North America',
    document: 'US DV Lottery (Green Card)',
    widthMm: 50.8,
    heightMm: 50.8,
    widthPx: 600,
    heightPx: 600,
    bgColor: '#FFFFFF',
    bgName: 'Pure White',
    faceHeightPercent: 65,
    flag: '🇺🇸',
    description: '600×600 px square, strictly under 240 KB, 24-bit color, plain white background'
  },
  {
    id: 'neet-postcard',
    country: 'India',
    category: 'Exams & Govt',
    document: 'NEET Postcard Photo (4×6 inch)',
    widthMm: 101.6,
    heightMm: 152.4,
    widthPx: 1200,
    heightPx: 1800,
    bgColor: '#FFFFFF',
    bgName: 'White',
    faceHeightPercent: 80,
    flag: '🇮🇳',
    description: '4×6 inch Postcard size photo required for NEET Exam admit card & attendance sheet'
  }
];

export interface SignaturePreset {
  id: string;
  name: string;
  widthPx: number;
  heightPx: number;
  widthMm: number;
  heightMm: number;
  minKb: number;
  maxKb: number;
  description: string;
}

export const SIGNATURE_PRESETS: SignaturePreset[] = [
  {
    id: 'govt-standard',
    name: 'Govt / SSC / UPSC Standard',
    widthPx: 140,
    heightPx: 60,
    widthMm: 35,
    heightMm: 15,
    minKb: 10,
    maxKb: 20,
    description: '140×60 px (3.5×1.5 cm) — 10KB to 20KB standard for SSC, UPSC, Railway & State Exams'
  },
  {
    id: 'ibps-bank',
    name: 'IBPS / Banking & Insurance',
    widthPx: 140,
    heightPx: 60,
    widthMm: 35,
    heightMm: 15,
    minKb: 10,
    maxKb: 20,
    description: '140×60 px, black ink on white paper, 10–20 KB'
  },
  {
    id: 'pan-signature',
    name: 'PAN Card Signature (NSDL/UTI)',
    widthPx: 298,
    heightPx: 118,
    widthMm: 45,
    heightMm: 20,
    minKb: 10,
    maxKb: 30,
    description: 'Official 2:1 aspect ratio signature for PAN card application'
  },
  {
    id: 'high-res-sig',
    name: 'High-Resolution 300 DPI Signature',
    widthPx: 600,
    heightPx: 250,
    widthMm: 50,
    heightMm: 21,
    minKb: 20,
    maxKb: 100,
    description: 'Crisp transparent or white-background signature for PDF documents & contracts'
  }
];

export const PAPER_PRESETS: PaperPreset[] = [
  {
    id: 'single',
    name: 'Single Photo (HD 300 DPI)',
    widthMm: 0,
    heightMm: 0,
    description: 'Export 1 isolated HD photo with exact mm/px specs'
  },
  {
    id: '4x6-combo',
    name: '4 × 6 inch Combo (6 Passport + 4 Stamp Photos)',
    widthMm: 101.6,
    heightMm: 152.4,
    description: 'Cyber Cafe & Studio Special: 6 Passport + 4 Stamp size photos on 1 sheet'
  },
  {
    id: '4x6',
    name: '4 × 6 inch Photo Paper (10×15 cm)',
    widthMm: 101.6,
    heightMm: 152.4,
    description: 'Most popular photo lab format — fits 6 to 8 photos with cut lines'
  },
  {
    id: '5x7',
    name: '5 × 7 inch Photo Paper (13×18 cm)',
    widthMm: 127.0,
    heightMm: 177.8,
    description: 'Standard medium photo paper — fits 8 to 12 photos'
  },
  {
    id: 'a4',
    name: 'A4 Standard Paper (210×297 mm)',
    widthMm: 210.0,
    heightMm: 297.0,
    description: 'Standard office & home printer paper — fits 24 to 36 photos'
  },
  {
    id: 'letter',
    name: 'US Letter Paper (8.5×11 inch)',
    widthMm: 215.9,
    heightMm: 279.4,
    description: 'Standard North American paper size — fits 24 to 32 photos'
  }
];

export const STANDARD_BG_COLORS = [
  { id: 'original', name: 'Original / Transparent', hex: 'transparent', border: 'border-slate-300' },
  { id: 'white', name: 'Pure White (Embassy/Visa)', hex: '#FFFFFF', border: 'border-slate-300' },
  { id: 'cream', name: 'Off-White / Cream (UK)', hex: '#F5F5EC', border: 'border-amber-200' },
  { id: 'light-grey', name: 'Light Grey (Schengen/EU)', hex: '#E5E7EB', border: 'border-slate-300' },
  { id: 'light-blue', name: 'Studio Light Blue (PK/MY)', hex: '#38BDF8', border: 'border-sky-400' },
  { id: 'royal-blue', name: 'Royal Blue (Studio ID)', hex: '#1E3A8A', border: 'border-blue-800' },
  { id: 'navy', name: 'Navy Blue (Passport/ID)', hex: '#0F172A', border: 'border-slate-800' },
  { id: 'red', name: 'Studio Red', hex: '#DC2626', border: 'border-red-600' }
];
