export type IdCardOrientation = 'vertical' | 'horizontal';

export type IdCardTheme = 
  | 'corporate-blue'
  | 'modern-dark'
  | 'medical-cyan'
  | 'student-emerald'
  | 'press-crimson'
  | 'fitness-amber'
  | 'executive-gold'
  | 'security-indigo'
  | 'creative-purple'
  | 'classic-navy';

export interface IdCardData {
  orgName: string;
  orgTagline: string;
  holderName: string;
  designation: string;
  idNumber: string;
  department: string;
  bloodGroup: string;
  phone: string;
  email: string;
  emergencyContact: string;
  issueDate: string;
  expiryDate: string;
  address: string;
  website: string;
  terms: string[];
  avatarUrl: string;
  logoUrl: string;
  signatureText?: string;
  barcodeValue?: string;
}

export interface IdCardTemplate {
  id: string;
  title: string;
  category: 'Corporate' | 'Education' | 'Medical' | 'Security' | 'Media' | 'Fitness' | 'Events' | 'Creative';
  orientation: IdCardOrientation;
  description: string;
  previewImage: string;
  theme: IdCardTheme;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  badgeTag: string;
  psdFileSize: string;
  downloadsCount: number;
  rating: number;
  tags: string[];
  defaultData: IdCardData;
}

export const ID_CARD_CATEGORIES = [
  'All Templates',
  'Corporate',
  'Education',
  'Medical',
  'Security',
  'Media',
  'Fitness',
  'Events',
  'Creative'
] as const;

export const DEFAULT_TERMS = [
  'This card is the property of the issuing organization and must be surrendered upon request.',
  'If found, please drop in the nearest mailbox or return to the official address printed below.',
  'Unauthorized use, copying, or tampering with this card constitutes a legal offense.',
  'Card must be visibly worn with official badge holder at all times during working hours.'
];

export const ID_CARD_TEMPLATES: IdCardTemplate[] = [
  {
    id: 'gf-corporate-modern-vertical',
    title: 'Modern Corporate Employee ID Card PSD',
    category: 'Corporate',
    orientation: 'vertical',
    description: 'Ultra-clean corporate employee identity badge with dynamic diagonal blue geometric headers, QR verification, and high-contrast typography.',
    previewImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
    theme: 'corporate-blue',
    primaryColor: '#1e40af', // blue-800
    secondaryColor: '#0284c7', // sky-600
    accentColor: '#38bdf8', // sky-400
    badgeTag: 'Best Seller',
    psdFileSize: '18.4 MB',
    downloadsCount: 14280,
    rating: 4.9,
    tags: ['Corporate', 'Employee', 'Business', 'Clean', 'Blue', 'CR80'],
    defaultData: {
      orgName: 'NEXUS GLOBAL CORP',
      orgTagline: 'INNOVATION & INTEGRITY',
      holderName: 'Alexander Hayes',
      designation: 'Senior Cloud Architect',
      idNumber: 'EMP-98421',
      department: 'Infrastructure & DevOps',
      bloodGroup: 'O+',
      phone: '+1 (555) 234-5678',
      email: 'a.hayes@nexusglobal.com',
      emergencyContact: '+1 (555) 998-1122',
      issueDate: 'Jan 2025',
      expiryDate: 'Dec 2028',
      address: 'Suite 400, 100 Financial Way, New York, NY',
      website: 'www.nexusglobal.com',
      terms: DEFAULT_TERMS,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'A. Hayes',
      barcodeValue: 'NEXUS-98421'
    }
  },
  {
    id: 'gf-corporate-executive-horizontal',
    title: 'Executive Horizontal Company Access Card',
    category: 'Corporate',
    orientation: 'horizontal',
    description: 'Sleek landscape corporate pass featuring dual-side NFC access indicator, barcode footer, and minimalist modern grid.',
    previewImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    theme: 'classic-navy',
    primaryColor: '#0f172a', // slate-900
    secondaryColor: '#2563eb', // blue-600
    accentColor: '#60a5fa', // blue-400
    badgeTag: 'Popular',
    psdFileSize: '14.2 MB',
    downloadsCount: 9850,
    rating: 4.8,
    tags: ['Landscape', 'Executive', 'Access Pass', 'NFC', 'CR80'],
    defaultData: {
      orgName: 'VERITAS CAPITAL PARTNERS',
      orgTagline: 'INVESTMENT MANAGEMENT',
      holderName: 'Sophia Montgomery',
      designation: 'Managing Director',
      idNumber: 'VCP-00412',
      department: 'Private Equity Group',
      bloodGroup: 'A+',
      phone: '+1 (555) 432-8765',
      email: 's.montgomery@veritascap.com',
      emergencyContact: '+1 (555) 332-9900',
      issueDate: 'Mar 2024',
      expiryDate: 'Mar 2027',
      address: 'One Wall Street Plaza, 28th Floor, New York, NY',
      website: 'www.veritascap.com',
      terms: DEFAULT_TERMS,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'S. Montgomery',
      barcodeValue: 'VCP-DIR-00412'
    }
  },
  {
    id: 'gf-university-student-smart-id',
    title: 'University & College Student Smart ID Card',
    category: 'Education',
    orientation: 'vertical',
    description: 'Official academic student campus card with semester badge, library barcode, university emblem, and biometric photo frame.',
    previewImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    theme: 'student-emerald',
    primaryColor: '#065f46', // emerald-800
    secondaryColor: '#059669', // emerald-600
    accentColor: '#34d399', // emerald-400
    badgeTag: 'Academic',
    psdFileSize: '16.7 MB',
    downloadsCount: 18920,
    rating: 5.0,
    tags: ['Student', 'University', 'College', 'Campus', 'Emerald Green', 'Education'],
    defaultData: {
      orgName: 'OXFORD BRIDGE UNIVERSITY',
      orgTagline: 'FACULTY OF ENGINEERING & COMPUTING',
      holderName: 'Zubair Tariq',
      designation: 'Undergraduate Student',
      idNumber: 'STU-2024-8831',
      department: 'Software Engineering (B.Sc)',
      bloodGroup: 'B+',
      phone: '+92 300 1234567',
      email: 'zubair.tariq@oxfordbridge.edu',
      emergencyContact: '+92 321 7654321',
      issueDate: 'Sep 2024',
      expiryDate: 'Jul 2028',
      address: 'North Campus, University Ave, Islamabad, PK',
      website: 'www.oxfordbridge.edu',
      terms: [
        'Must be carried and produced on demand on all university premises.',
        'Grants access to university libraries, research laboratories, and sports complex.',
        'Loss of card must immediately be reported to the Academic Registrar office.',
        'Non-transferable and remains property of Oxford Bridge University.'
      ],
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'Z. Tariq',
      barcodeValue: 'STU-OBU-8831'
    }
  },
  {
    id: 'gf-hospital-doctor-medical-id',
    title: 'Hospital Staff & Doctor Medical ID Badge',
    category: 'Medical',
    orientation: 'vertical',
    description: 'Certified healthcare provider and clinical staff identification badge with high-visibility emergency red caduceus and cyan banner.',
    previewImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    theme: 'medical-cyan',
    primaryColor: '#0e7490', // cyan-700
    secondaryColor: '#0891b2', // cyan-600
    accentColor: '#22d3ee', // cyan-400
    badgeTag: 'Healthcare',
    psdFileSize: '15.3 MB',
    downloadsCount: 11340,
    rating: 4.9,
    tags: ['Doctor', 'Hospital', 'Nurse', 'Medical', 'Healthcare', 'Clinic'],
    defaultData: {
      orgName: 'ST. JUDE MEMORIAL HOSPITAL',
      orgTagline: 'CENTER FOR ADVANCED SURGERY',
      holderName: 'Dr. Fatima Rehman',
      designation: 'Chief Consultant Cardiologist',
      idNumber: 'MED-77402',
      department: 'Cardiothoracic Surgery',
      bloodGroup: 'AB+',
      phone: '+1 (555) 911-4000',
      email: 'f.rehman@stjudemedical.org',
      emergencyContact: '+1 (555) 911-0000',
      issueDate: 'Jan 2024',
      expiryDate: 'Dec 2029',
      address: '770 Health Sciences Blvd, Chicago, IL',
      website: 'www.stjudemedical.org',
      terms: [
        'Authorizes unrestricted access to Surgical Wings, ICU, and Pharmacy vaults.',
        'Valid only when displayed alongside state medical license credential badge.',
        'Report immediate loss to Hospital Security Dispatch (Ext. 911).',
        'Subject to hospital infection control protocol sanitized casing.'
      ],
      avatarUrl: 'https://images.unsplash.com/photo-1594824813689-58b8772a6b29?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'Dr. F. Rehman',
      barcodeValue: 'MD-SJM-77402'
    }
  },
  {
    id: 'gf-cyber-security-badge-dark',
    title: 'Cyber Security & Enforcement Officer Badge',
    category: 'Security',
    orientation: 'vertical',
    description: 'High-security dark aesthetic badge with holographic micro-pattern, clearance level indicator, and encrypted chip silhouette.',
    previewImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    theme: 'modern-dark',
    primaryColor: '#090d16', // ultra dark slate
    secondaryColor: '#1e293b', // slate-800
    accentColor: '#10b981', // emerald-500 cyber glow
    badgeTag: 'Top Security',
    psdFileSize: '22.1 MB',
    downloadsCount: 12450,
    rating: 4.9,
    tags: ['Security', 'Cyber', 'Clearance', 'Dark Theme', 'Enforcement', 'Tech'],
    defaultData: {
      orgName: 'AEGIS CYBER DEFENSE',
      orgTagline: 'SECURE CRITICAL INFRASTRUCTURE',
      holderName: 'Marcus Vance',
      designation: 'Principal Threat Investigator',
      idNumber: 'SEC-LEVEL-5-09',
      department: 'Incident Response Unit',
      bloodGroup: 'O-',
      phone: '+1 (800) 555-0199',
      email: 'm.vance@aegisdefense.gov',
      emergencyContact: '+1 (800) 555-9999',
      issueDate: 'Feb 2025',
      expiryDate: 'Feb 2028',
      address: 'Secure Facility 7, Fort Meade, MD',
      website: 'www.aegisdefense.internal',
      terms: [
        'TOP SECRET // RESTRICTED ACCESS. Level 5 credential verification required.',
        'Duplication, photography, or digital transmission of this badge is strictly punishable by federal law.',
        'Built-in biometric RFID chip transmits location within secure zones.',
        'Return immediately to Aegis Provost Marshal upon clearance revocation.'
      ],
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'M. Vance',
      barcodeValue: 'AEGIS-LV5-09-ENC'
    }
  },
  {
    id: 'gf-press-media-journalist-pass',
    title: 'VIP Press & Media Journalist Pass PSD',
    category: 'Media',
    orientation: 'vertical',
    description: 'High-visibility bold press accreditation badge in crimson red and black, designed for international journalists and photojournalists.',
    previewImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80',
    theme: 'press-crimson',
    primaryColor: '#b91c1c', // red-700
    secondaryColor: '#18181b', // zinc-900
    accentColor: '#f87171', // red-400
    badgeTag: 'VIP Media',
    psdFileSize: '17.8 MB',
    downloadsCount: 8940,
    rating: 4.8,
    tags: ['Press', 'Media', 'Journalist', 'News', 'Red', 'Lanyard Pass'],
    defaultData: {
      orgName: 'GLOBAL NEWS NETWORK',
      orgTagline: 'INTERNATIONAL BROADCASTING CORPS',
      holderName: 'Elena Rostova',
      designation: 'Senior Foreign Correspondent',
      idNumber: 'PRESS-ID-4491',
      department: 'Investigative Bureau',
      bloodGroup: 'A-',
      phone: '+44 20 7946 0192',
      email: 'e.rostova@gnn-news.com',
      emergencyContact: '+44 20 7946 9999',
      issueDate: 'Jan 2025',
      expiryDate: 'Dec 2026',
      address: 'Broadcasting House, London, UK',
      website: 'www.gnn-news.com',
      terms: [
        'Official Press Credential recognized under International Journalism Convention.',
        'Grants perimeter media room access and designated interview corridors.',
        'Bearer is protected under journalistic rights protocols.',
        'Verify media authenticity via the live scannable QR code.'
      ],
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'E. Rostova',
      barcodeValue: 'PRESS-GNN-4491'
    }
  },
  {
    id: 'gf-gym-fitness-membership-card',
    title: 'Gym & Fitness Center Membership Pass',
    category: 'Fitness',
    orientation: 'horizontal',
    description: 'Sleek dark and electric amber gym membership card with barcode check-in for turnstiles, VIP tier badge, and locker assignment.',
    previewImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    theme: 'fitness-amber',
    primaryColor: '#78350f', // amber-900
    secondaryColor: '#d97706', // amber-600
    accentColor: '#fbbf24', // amber-400
    badgeTag: 'VIP Tier',
    psdFileSize: '13.5 MB',
    downloadsCount: 7650,
    rating: 4.7,
    tags: ['Fitness', 'Gym', 'Membership', 'Sports', 'Amber Gold', 'Turnstile'],
    defaultData: {
      orgName: 'TITAN IRON ATHLETIC CLUB',
      orgTagline: 'ELITE STRENGTH & WELLNESS',
      holderName: 'Damian Cross',
      designation: 'Diamond VIP Member',
      idNumber: 'TAC-VIP-2049',
      department: 'All-Access Pass (Spa & Pool)',
      bloodGroup: 'O+',
      phone: '+1 (555) 777-3838',
      email: 'd.cross@gmail.com',
      emergencyContact: '+1 (555) 777-0099',
      issueDate: 'Jan 2025',
      expiryDate: 'Jan 2026',
      address: 'Titan Arena, 500 Olympic Way, Los Angeles, CA',
      website: 'www.titanathletic.club',
      terms: [
        'Valid for unlimited 24/7 biometric check-in across all global branches.',
        'Includes dedicated VIP locker, sauna, and towel service access.',
        'Membership is strictly non-transferable.',
        'Scan barcode at front turnstile upon entry.'
      ],
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'D. Cross',
      barcodeValue: 'TITAN-MEM-2049'
    }
  },
  {
    id: 'gf-executive-gold-vip-pass',
    title: 'Executive Gold VIP Conference Lanyard Pass',
    category: 'Events',
    orientation: 'vertical',
    description: 'High-end black and brushed metallic gold badge designed for global tech summits, VIP keynote speakers, and private gala delegates.',
    previewImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
    theme: 'executive-gold',
    primaryColor: '#1c1917', // stone-900
    secondaryColor: '#854d0e', // yellow-800
    accentColor: '#facc15', // yellow-400 gold
    badgeTag: 'Luxury',
    psdFileSize: '20.4 MB',
    downloadsCount: 10420,
    rating: 5.0,
    tags: ['Conference', 'VIP', 'Summit', 'Gold', 'Lanyard', 'Event Badge'],
    defaultData: {
      orgName: 'GLOBAL TECH SUMMIT 2025',
      orgTagline: 'THE FUTURE OF ARTIFICIAL INTELLIGENCE',
      holderName: 'Victoria Sterling',
      designation: 'Keynote Speaker & Venture Partner',
      idNumber: 'GTS-VIP-001',
      department: 'Main Stage & Backstage Access',
      bloodGroup: 'B+',
      phone: '+1 (555) 888-2025',
      email: 'victoria@sterlingventures.vc',
      emergencyContact: '+1 (555) 888-0000',
      issueDate: 'Oct 2025',
      expiryDate: 'Oct 2025',
      address: 'Convention Center, San Francisco, CA',
      website: 'www.globaltechsummit.io',
      terms: [
        'Grants All-Access VIP admission including Speaker Green Room & Investor Dinners.',
        'Must be worn visibly around neck via summit gold lanyard.',
        'RFID chip embedded for automated stage pass-through.',
        'Non-transferable without prior Secretariat approval.'
      ],
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'V. Sterling',
      barcodeValue: 'GTS-2025-SPK-001'
    }
  },
  {
    id: 'gf-creative-agency-art-director',
    title: 'Creative Agency Art Director & Studio Pass',
    category: 'Creative',
    orientation: 'vertical',
    description: 'Vibrant avant-garde design featuring artistic purple and neon gradient accents, creative typography, and QR portfolio showcase.',
    previewImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80',
    theme: 'creative-purple',
    primaryColor: '#581c87', // purple-900
    secondaryColor: '#9333ea', // purple-600
    accentColor: '#c084fc', // purple-400
    badgeTag: 'Creative',
    psdFileSize: '19.1 MB',
    downloadsCount: 8320,
    rating: 4.8,
    tags: ['Creative', 'Studio', 'Designer', 'Agency', 'Purple', 'Art Director'],
    defaultData: {
      orgName: 'SPECTRUM DESIGN LABS',
      orgTagline: 'IMMERSIVE BRAND EXPERIENCE',
      holderName: 'Julian Vance',
      designation: 'Senior Art Director',
      idNumber: 'SDL-CREATIVE-18',
      department: 'Brand Identity & Motion',
      bloodGroup: 'AB-',
      phone: '+1 (555) 456-7890',
      email: 'julian@spectrumdesign.co',
      emergencyContact: '+1 (555) 456-0000',
      issueDate: 'Jan 2025',
      expiryDate: 'Jan 2028',
      address: '742 Broadway Design District, Brooklyn, NY',
      website: 'www.spectrumdesign.co',
      terms: [
        'Authorized 24-hour access to VR labs, 3D printing suites, and sound studios.',
        'Property of Spectrum Design Labs Inc.',
        'Scan QR code to view verified agency portfolio & security credentials.',
        'Report loss to studio administration within 24 hours.'
      ],
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'J. Vance',
      barcodeValue: 'SDL-ART-DIR-18'
    }
  },
  {
    id: 'gf-school-faculty-teacher-id',
    title: 'School Teacher & Educational Faculty ID',
    category: 'Education',
    orientation: 'horizontal',
    description: 'Warm, distinguished faculty badge with classroom room number, department seal, school colors, and emergency campus phone.',
    previewImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
    theme: 'security-indigo',
    primaryColor: '#312e81', // indigo-900
    secondaryColor: '#4f46e5', // indigo-600
    accentColor: '#818cf8', // indigo-400
    badgeTag: 'Faculty',
    psdFileSize: '15.9 MB',
    downloadsCount: 9110,
    rating: 4.8,
    tags: ['Teacher', 'Faculty', 'School', 'Education', 'Horizontal', 'Staff'],
    defaultData: {
      orgName: 'ST. LAWRENCE GRAMMAR SCHOOL',
      orgTagline: 'EXCELLENCE IN EDUCATION SINCE 1968',
      holderName: 'Sarah Jenkins, M.Ed',
      designation: 'Head of Department - Sciences',
      idNumber: 'FACULTY-302',
      department: 'Physics & Applied Mathematics',
      bloodGroup: 'A+',
      phone: '+1 (555) 234-9800',
      email: 's.jenkins@stlawrence.edu',
      emergencyContact: '+1 (555) 234-0099',
      issueDate: 'Aug 2024',
      expiryDate: 'Jul 2027',
      address: '22 Schoolhouse Lane, Cambridge, MA',
      website: 'www.stlawrence.edu',
      terms: [
        'Faculty badge must be presented at main security gate and examination halls.',
        'Grants access to faculty lounges, grading rooms, and lab stores.',
        'Property of St. Lawrence Educational Trust.',
        'Please return to Bursar Office if lost.'
      ],
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'S. Jenkins',
      barcodeValue: 'SLGS-FAC-302'
    }
  },
  {
    id: 'gf-law-enforcement-security-shield',
    title: 'Law Enforcement & Municipal Officer Shield Pass',
    category: 'Security',
    orientation: 'vertical',
    description: 'Authoritative badge with official eagle emblem crest, gold-foil badge number plate, and tamper-resistant security microprint lines.',
    previewImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    theme: 'classic-navy',
    primaryColor: '#030712', // black/deep navy
    secondaryColor: '#1e3a8a', // blue-900
    accentColor: '#eab308', // gold-500
    badgeTag: 'Official',
    psdFileSize: '24.5 MB',
    downloadsCount: 11200,
    rating: 4.9,
    tags: ['Security', 'Officer', 'Shield', 'Badge', 'Police', 'Enforcement'],
    defaultData: {
      orgName: 'METROPOLITAN SECURITY PATROL',
      orgTagline: 'PROTECTION & DEDICATED SERVICE',
      holderName: 'Captain David Miller',
      designation: 'Commanding Officer',
      idNumber: 'BADGE # 904',
      department: 'Special Operations Bureau',
      bloodGroup: 'O+',
      phone: '+1 (555) 333-7000',
      email: 'd.miller@metropatrol.gov',
      emergencyContact: '+1 (555) 911-0000',
      issueDate: 'Jan 2024',
      expiryDate: 'Dec 2028',
      address: 'Headquarters Plaza, Downtown Station, Metro City',
      website: 'www.metropatrol.gov',
      terms: [
        'Official municipal enforcement badge. Impersonation is a felony.',
        'Authorizes bearer full departmental emergency coordination duties.',
        'If found, deliver immediately to the nearest police precinct.',
        'Equipped with tamper-evident NFC security layer.'
      ],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'Capt. D. Miller',
      barcodeValue: 'METRO-SHIELD-904'
    }
  },
  {
    id: 'gf-logistics-transport-driver-id',
    title: 'Logistics & Cargo Transport Driver ID Card',
    category: 'Corporate',
    orientation: 'horizontal',
    description: 'High-visibility industrial transit ID card with commercial driver license details, truck fleet clearance, and warehouse barcode.',
    previewImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
    theme: 'fitness-amber',
    primaryColor: '#c2410c', // orange-700
    secondaryColor: '#1c1917', // stone-900
    accentColor: '#fb923c', // orange-400
    badgeTag: 'Transit',
    psdFileSize: '12.8 MB',
    downloadsCount: 6890,
    rating: 4.7,
    tags: ['Logistics', 'Driver', 'Transport', 'Cargo', 'Warehouse', 'Fleet'],
    defaultData: {
      orgName: 'APEX FREIGHT & SUPPLY CHAIN',
      orgTagline: 'GLOBAL INTERMODAL LOGISTICS',
      holderName: 'Robert Kowalski',
      designation: 'Commercial Heavy Fleet Driver',
      idNumber: 'CDL-TRUCK-8819',
      department: 'Cross-Country Freight Line',
      bloodGroup: 'B-',
      phone: '+1 (555) 600-4411',
      email: 'r.kowalski@apexfreight.com',
      emergencyContact: '+1 (555) 600-9999',
      issueDate: 'Jan 2025',
      expiryDate: 'Jan 2027',
      address: 'Terminal 4, Logistics Highway, Dallas, TX',
      website: 'www.apexfreight.com',
      terms: [
        'Valid commercial driver clearance for all Apex Freight terminals & docks.',
        'Authorizes cargo inspection bypass and weigh station fast-lane access.',
        'Return to Fleet Dispatcher upon route contract termination.',
        'Emergency breakdown helpline: 1-800-APEX-SOS.'
      ],
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      logoUrl: '',
      signatureText: 'R. Kowalski',
      barcodeValue: 'APEX-CDL-8819'
    }
  }
];
