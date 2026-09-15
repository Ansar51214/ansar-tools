'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import Image from 'next/image';
import {
  Heart,
  Download,
  Share2,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  CheckCircle2,
  Eye,
  Sliders,
  ShieldCheck,
  User,
  Briefcase,
  Users,
  Phone,
  MapPin,
  Check,
  Camera,
  Image as ImageIcon,
  FileText,
  Loader2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export type ThemeId = 'emerald' | 'maroon' | 'navy' | 'rosegold' | 'ivory' | 'saffron' | 'violet' | 'monochrome';
export type ReligiousSymbol = 'islamic' | 'hindu' | 'sikh' | 'christian' | 'universal' | 'none';

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  gradeOrScore?: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface BiodataData {
  header: {
    symbol: ReligiousSymbol;
    customTitle: string;
  };
  personal: {
    fullName: string;
    gender: 'Male' | 'Female' | 'Other';
    dob: string;
    birthTime: string;
    birthPlace: string;
    age: string;
    height: string;
    complexion: string;
    maritalStatus: string;
    religion: string;
    casteOrSect: string;
    motherTongue: string;
    bloodGroup: string;
    photoUrl?: string;
    showPhoto: boolean;
  };
  educationCareer: {
    highestDegree: string;
    collegeOrUni: string;
    occupation: string;
    companyOrOrg: string;
    annualIncome: string;
    workLocation: string;
  };
  educationList: EducationItem[];
  family: {
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    brothers: string;
    sisters: string;
    familyType: string;
    familyValues: string;
    nativePlace: string;
    familyStatus: string;
  };
  contact: {
    residentialAddress: string;
    cityAndCountry: string;
    contactPerson: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  partnerPreferences: {
    ageRange: string;
    heightRange: string;
    educationPreference: string;
    maritalStatusPreference: string;
    locationPreference: string;
    additionalExpectations: string;
  };
  customFields: CustomField[];
}

export interface ThemeConfig {
  name: string;
  tagline: string;
  primary: string;
  secondary: string;
  accent: string;
  borderClass: string;
  headerBg: string;
  headerText: string;
  paperBg: string;
  paperBgHex: string;
  sectionHeaderClass: string;
  ornament: string;
}

const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
  maroon: {
    name: 'Shahi Maroon Mughal',
    tagline: 'Royal Crimson & Antique Gold',
    primary: '#831843',
    secondary: '#9d174d',
    accent: '#d97706',
    borderClass: 'border-rose-800',
    headerBg: 'bg-rose-950',
    headerText: 'text-amber-200',
    paperBg: 'bg-gradient-to-b from-rose-50/40 via-white to-amber-50/30',
    paperBgHex: '#fff8f9',
    sectionHeaderClass: 'bg-rose-900 text-amber-100 border-amber-400/40',
    ornament: '👑'
  },
  emerald: {
    name: 'Imperial Emerald Flora',
    tagline: 'Deep Botanical Green & Gold',
    primary: '#064e3b',
    secondary: '#047857',
    accent: '#d97706',
    borderClass: 'border-emerald-700',
    headerBg: 'bg-emerald-950',
    headerText: 'text-amber-300',
    paperBg: 'bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/30',
    paperBgHex: '#f4fdf8',
    sectionHeaderClass: 'bg-emerald-900 text-amber-200 border-amber-500/40',
    ornament: '🌿'
  },
  navy: {
    name: 'Sapphire Nizam Executive',
    tagline: 'Midnight Navy & Platinum Silver',
    primary: '#0f172a',
    secondary: '#1e3a8a',
    accent: '#38bdf8',
    borderClass: 'border-slate-800',
    headerBg: 'bg-slate-950',
    headerText: 'text-sky-300',
    paperBg: 'bg-gradient-to-b from-slate-50 via-white to-sky-50/30',
    paperBgHex: '#f8fafc',
    sectionHeaderClass: 'bg-slate-900 text-sky-200 border-sky-400/30',
    ornament: '🌌'
  },
  rosegold: {
    name: 'Gulab Rose Gold Vintage',
    tagline: 'Blush Rose & Champagne Lace',
    primary: '#9f1239',
    secondary: '#e11d48',
    accent: '#fb7185',
    borderClass: 'border-rose-400',
    headerBg: 'bg-rose-900',
    headerText: 'text-rose-100',
    paperBg: 'bg-gradient-to-b from-pink-50/50 via-white to-rose-50/30',
    paperBgHex: '#fff5f7',
    sectionHeaderClass: 'bg-rose-800 text-white border-rose-300/40',
    ornament: '🌸'
  },
  ivory: {
    name: 'Imperial Ivory Classic',
    tagline: 'Warm Ivory & Bronze Filigree',
    primary: '#78350f',
    secondary: '#b45309',
    accent: '#f59e0b',
    borderClass: 'border-amber-600',
    headerBg: 'bg-amber-950',
    headerText: 'text-amber-300',
    paperBg: 'bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40',
    paperBgHex: '#fefce8',
    sectionHeaderClass: 'bg-amber-900 text-amber-200 border-amber-500/40',
    ornament: '🕊️'
  },
  saffron: {
    name: 'Shubh Saffron Heritage',
    tagline: 'Auspicious Saffron & Terracotta',
    primary: '#b45309',
    secondary: '#d97706',
    accent: '#f59e0b',
    borderClass: 'border-amber-600',
    headerBg: 'bg-amber-900',
    headerText: 'text-amber-100',
    paperBg: 'bg-gradient-to-b from-amber-50/60 via-white to-orange-50/30',
    paperBgHex: '#fffbeb',
    sectionHeaderClass: 'bg-amber-800 text-amber-100 border-amber-400/40',
    ornament: '⚜️'
  },
  violet: {
    name: 'Nawabi Violet Velvet',
    tagline: 'Deep Royal Violet & Gold',
    primary: '#581c87',
    secondary: '#7e22ce',
    accent: '#c084fc',
    borderClass: 'border-purple-800',
    headerBg: 'bg-purple-950',
    headerText: 'text-purple-200',
    paperBg: 'bg-gradient-to-b from-purple-50/40 via-white to-pink-50/20',
    paperBgHex: '#faf5ff',
    sectionHeaderClass: 'bg-purple-900 text-purple-100 border-purple-400/40',
    ornament: '💜'
  },
  monochrome: {
    name: 'Modern Minimalist Slate',
    tagline: 'Clean Corporate High Legibility',
    primary: '#18181b',
    secondary: '#27272a',
    accent: '#52525b',
    borderClass: 'border-zinc-800',
    headerBg: 'bg-zinc-900',
    headerText: 'text-zinc-100',
    paperBg: 'bg-white',
    paperBgHex: '#ffffff',
    sectionHeaderClass: 'bg-zinc-900 text-zinc-100 border-zinc-700',
    ornament: '🖤'
  },
};

// 6 Detailed Sample Profiles for the Top Showcase Slider
export interface ShowcaseItem {
  id: string;
  name: string;
  role: string;
  location: string;
  theme: ThemeId;
  gender: 'Male' | 'Female';
  avatarBg: string;
  data: BiodataData;
}

const SHOWCASE_PROFILES: ShowcaseItem[] = [
  {
    id: 'sample-ayesha',
    name: 'Dr. Ayesha Siddiqui',
    role: 'MBBS Resident Medical Officer',
    location: 'Islamabad, Pakistan',
    theme: 'maroon',
    gender: 'Female',
    avatarBg: 'bg-rose-900',
    data: {
      header: { symbol: 'islamic', customTitle: 'MATRIMONIAL BIODATA' },
      personal: {
        fullName: 'Dr. Ayesha Siddiqui',
        gender: 'Female',
        dob: '22 October 1999',
        birthTime: '10:15 AM',
        birthPlace: 'Islamabad',
        age: '26 Years',
        height: "5' 6\" (168 cm)",
        complexion: 'Very Fair',
        maritalStatus: 'Never Married',
        religion: 'Islam',
        casteOrSect: 'Sunni / Siddiqui Shaikh',
        motherTongue: 'Urdu',
        bloodGroup: 'O Positive (O+)',
        showPhoto: true,
      },
      educationCareer: {
        highestDegree: 'MBBS, RMP Certified',
        collegeOrUni: 'Shifa College of Medicine, Islamabad',
        occupation: 'Resident Medical Officer / Trainee',
        companyOrOrg: 'Shifa International Hospital',
        annualIncome: 'Confidential / Professional',
        workLocation: 'Islamabad, Pakistan',
      },
      educationList: [
        { id: '1', degree: 'MBBS (Medicine & Surgery)', institution: 'Shifa College of Medicine', year: '2022', gradeOrScore: 'First Division' },
        { id: '2', degree: 'A-Levels (Pre-Medical)', institution: 'Roots Ivy International, Islamabad', year: '2017', gradeOrScore: '3 A*s' }
      ],
      family: {
        fatherName: 'Engr. Nadeem Siddiqui',
        fatherOccupation: 'Executive Director (OGDCL, Retd.)',
        motherName: 'Mrs. Farhat Siddiqui',
        motherOccupation: 'Principal, Beaconhouse (Retd.)',
        brothers: '1 Elder Brother (Chartered Accountant, UK)',
        sisters: 'None',
        familyType: 'Nuclear Family',
        familyValues: 'Religious, Highly Educated & Decent',
        nativePlace: 'Sector F-7, Islamabad',
        familyStatus: 'Upper Middle Class',
      },
      contact: {
        residentialAddress: 'House #48, Street 19, Sector F-7/2, Islamabad',
        cityAndCountry: 'Islamabad, Pakistan',
        contactPerson: 'Father: Engr. Nadeem Siddiqui',
        phone: '+92 321 5551234',
        whatsapp: '+92 321 5551234',
        email: 'siddiqui.family.isb@gmail.com',
      },
      partnerPreferences: {
        ageRange: '27 to 31 Years',
        heightRange: "5' 9\" and above",
        educationPreference: 'Doctor, Engineer, Civil Servant, or Corporate Professional',
        maritalStatusPreference: 'Never Married',
        locationPreference: 'Islamabad / Rawalpindi or Overseas (UK / UAE)',
        additionalExpectations: 'Well-settled gentleman with strong Islamic values and respectable family pedigree.',
      },
      customFields: [
        { id: 'namaz', label: 'Religious Practice', value: 'Regular 5 times prayers, fasts, modest' },
        { id: 'hobbies', label: 'Hobbies', value: 'Reading medical literature, culinary arts, calligraphy' }
      ],
    }
  },
  {
    id: 'sample-arham',
    name: 'Muhammad Arham Tariq',
    role: 'Senior Cloud Solutions Architect',
    location: 'Lahore, Pakistan',
    theme: 'emerald',
    gender: 'Male',
    avatarBg: 'bg-emerald-900',
    data: {
      header: { symbol: 'islamic', customTitle: 'MARRIAGE BIODATA' },
      personal: {
        fullName: 'Muhammad Arham Tariq',
        gender: 'Male',
        dob: '14 August 1997',
        birthTime: '06:30 AM',
        birthPlace: 'Lahore',
        age: '28 Years',
        height: "5' 11\" (180 cm)",
        complexion: 'Fair',
        maritalStatus: 'Never Married',
        religion: 'Islam',
        casteOrSect: 'Sunni / Rajput (Panwar)',
        motherTongue: 'Urdu / Punjabi',
        bloodGroup: 'B Positive (B+)',
        showPhoto: true,
      },
      educationCareer: {
        highestDegree: 'BS in Computer Science (Hons)',
        collegeOrUni: 'FAST-NUCES, Lahore',
        occupation: 'Senior Cloud Solutions Architect',
        companyOrOrg: 'Systems Ltd / Multinational Tech Partner',
        annualIncome: 'PKR 45 - 55 Lakhs / Year',
        workLocation: 'DHA Phase 5, Lahore (Hybrid)',
      },
      educationList: [
        { id: '1', degree: 'BS Computer Science (Hons)', institution: 'FAST-NUCES, Lahore', year: '2019', gradeOrScore: '3.62 CGPA' },
        { id: '2', degree: 'FSc Pre-Engineering', institution: 'Government College University (GCU)', year: '2015', gradeOrScore: 'A+ Grade' }
      ],
      family: {
        fatherName: 'Chaudhry Muhammad Tariq',
        fatherOccupation: 'Retired Government Officer (Grade 19)',
        motherName: 'Begum Shaheen Tariq',
        motherOccupation: 'Homemaker',
        brothers: '1 Younger Brother (BS Software Engineer, Employed)',
        sisters: '1 Elder Sister (Married, Settled in Islamabad)',
        familyType: 'Nuclear Family',
        familyValues: 'Religious, Educated & Moderate',
        nativePlace: 'Model Town, Lahore',
        familyStatus: 'Upper Middle Class',
      },
      contact: {
        residentialAddress: 'House #142, Sector J, DHA Phase 5, Lahore',
        cityAndCountry: 'Lahore, Pakistan',
        contactPerson: 'Father: Ch. Muhammad Tariq',
        phone: '+92 300 1234567',
        whatsapp: '+92 300 1234567',
        email: 'tariq.family.lahore@gmail.com',
      },
      partnerPreferences: {
        ageRange: '23 to 27 Years',
        heightRange: "5' 3\" to 5' 8\"",
        educationPreference: 'Graduate / Master (Doctor, Engineer, or Professional preferred)',
        maritalStatusPreference: 'Never Married',
        locationPreference: 'Lahore or Rawalpindi / Islamabad',
        additionalExpectations: 'Cultured, family-oriented, practicing Muslim with decent family background.',
      },
      customFields: [
        { id: 'hobbies', label: 'Hobbies & Interests', value: 'Reading, Cricket, Tech Blogging & Travel' },
        { id: 'visa', label: 'Passport & Travel', value: 'Valid Passport, frequent international business travel' }
      ],
    }
  },
  {
    id: 'sample-fatima',
    name: 'Fatima Zahra Alvi',
    role: 'Full-Stack Software Engineer',
    location: 'Karachi, Pakistan',
    theme: 'rosegold',
    gender: 'Female',
    avatarBg: 'bg-rose-800',
    data: {
      header: { symbol: 'islamic', customTitle: 'MATRIMONIAL PROFILE' },
      personal: {
        fullName: 'Fatima Zahra Alvi',
        gender: 'Female',
        dob: '12 January 2000',
        birthTime: '04:00 PM',
        birthPlace: 'Karachi',
        age: '25 Years',
        height: "5' 4\" (163 cm)",
        complexion: 'Fair & Radiant',
        maritalStatus: 'Never Married',
        religion: 'Islam',
        casteOrSect: 'Sunni / Alvi',
        motherTongue: 'Urdu',
        bloodGroup: 'A Positive (A+)',
        showPhoto: false, // Purdah Mode
      },
      educationCareer: {
        highestDegree: 'BS Software Engineering',
        collegeOrUni: 'NED University of Engineering & Tech',
        occupation: 'Full-Stack Software Engineer',
        companyOrOrg: 'US-based Remote SaaS Company',
        annualIncome: 'PKR 35 Lakhs / Year',
        workLocation: 'Karachi (Remote)',
      },
      educationList: [
        { id: '1', degree: 'BS Software Engineering', institution: 'NED University, Karachi', year: '2022', gradeOrScore: '3.75 CGPA' }
      ],
      family: {
        fatherName: 'Syed Qasim Alvi',
        fatherOccupation: 'Senior Finance Manager (Ex-Banker)',
        motherName: 'Tahira Qasim',
        motherOccupation: 'Educator & Homemaker',
        brothers: '2 Younger Brothers (Studying)',
        sisters: 'None',
        familyType: 'Nuclear Family',
        familyValues: 'Moderate, Practicing Muslim',
        nativePlace: 'PECHS, Karachi',
        familyStatus: 'Reputed Middle Class',
      },
      contact: {
        residentialAddress: 'Block 2, PECHS, Karachi',
        cityAndCountry: 'Karachi, Pakistan',
        contactPerson: 'Father: Syed Qasim Alvi',
        phone: '+92 333 7654321',
        whatsapp: '+92 333 7654321',
        email: 'alvi.family.khi@gmail.com',
      },
      partnerPreferences: {
        ageRange: '26 to 30 Years',
        heightRange: "5' 8\" to 6' 0\"",
        educationPreference: 'Engineer, IT Professional, Chartered Accountant',
        maritalStatusPreference: 'Never Married',
        locationPreference: 'Karachi, Islamabad, or Overseas',
        additionalExpectations: 'Educated, sober, non-smoker, supportive of career growth.',
      },
      customFields: [
        { id: 'deen', label: 'Deen & Values', value: 'Hijab observing, respects elders, prays regularly' }
      ],
    }
  },
  {
    id: 'sample-bilal',
    name: 'Engr. Bilal Ahmed Khan',
    role: 'Civil Structural Engineer & Builder',
    location: 'Peshawar & Islamabad',
    theme: 'navy',
    gender: 'Male',
    avatarBg: 'bg-slate-900',
    data: {
      header: { symbol: 'islamic', customTitle: 'MARRIAGE BIODATA' },
      personal: {
        fullName: 'Engr. Bilal Ahmed Khan',
        gender: 'Male',
        dob: '05 March 1996',
        birthTime: '08:00 AM',
        birthPlace: 'Peshawar',
        age: '29 Years',
        height: "6' 0\" (183 cm)",
        complexion: 'Very Fair',
        maritalStatus: 'Never Married',
        religion: 'Islam',
        casteOrSect: 'Sunni / Yousafzai Pashtun',
        motherTongue: 'Pashto / Urdu',
        bloodGroup: 'O Positive (O+)',
        showPhoto: true,
      },
      educationCareer: {
        highestDegree: 'MS in Structural Engineering',
        collegeOrUni: 'UET Peshawar & NUST Islamabad',
        occupation: 'Lead Structural Engineer & Real Estate Developer',
        companyOrOrg: 'Al-Khan Engineering & Construction',
        annualIncome: 'PKR 60+ Lakhs / Year',
        workLocation: 'Islamabad & Peshawar',
      },
      educationList: [
        { id: '1', degree: 'MS Structural Engineering', institution: 'NUST Islamabad', year: '2020', gradeOrScore: 'First Class' },
        { id: '2', degree: 'BS Civil Engineering', institution: 'UET Peshawar', year: '2018', gradeOrScore: 'Gold Medalist' }
      ],
      family: {
        fatherName: 'Haji Gul Khan',
        fatherOccupation: 'Prominent Businessman / Industrialist',
        motherName: 'Mrs. Gul Khan',
        motherOccupation: 'Homemaker',
        brothers: '2 Brothers (Both Partners in Family Business)',
        sisters: '2 Sisters (Both Married in Reputable Families)',
        familyType: 'Joint / Extended Reputable Family',
        familyValues: 'Traditional Pashtun Hospitality & Islamic Morals',
        nativePlace: 'Hayatabad, Peshawar',
        familyStatus: 'Affluent Upper Class',
      },
      contact: {
        residentialAddress: 'Phase 5, Hayatabad, Peshawar / F-10, Islamabad',
        cityAndCountry: 'Peshawar / Islamabad, Pakistan',
        contactPerson: 'Father: Haji Gul Khan',
        phone: '+92 345 9876543',
        whatsapp: '+92 345 9876543',
        email: 'khan.builders.pk@gmail.com',
      },
      partnerPreferences: {
        ageRange: '23 to 27 Years',
        heightRange: "5' 4\" to 5' 9\"",
        educationPreference: 'Minimum Graduate (Doctor, Lecturer, or Educated Family)',
        maritalStatusPreference: 'Never Married',
        locationPreference: 'KPK or Islamabad / Rawalpindi',
        additionalExpectations: 'Cultured, polite girl who values joint family respect and harmony.',
      },
      customFields: [
        { id: 'lifestyle', label: 'Lifestyle', value: 'Active fitness enthusiast, equestrian sports, community philanthropy' }
      ],
    }
  },
  {
    id: 'sample-zainab',
    name: 'Zainab Mir',
    role: 'Creative Art Director & UI/UX Lead',
    location: 'Dubai / Lahore',
    theme: 'ivory',
    gender: 'Female',
    avatarBg: 'bg-amber-950',
    data: {
      header: { symbol: 'islamic', customTitle: 'MATRIMONIAL PROFILE' },
      personal: {
        fullName: 'Zainab Mir',
        gender: 'Female',
        dob: '18 September 1998',
        birthTime: '11:45 AM',
        birthPlace: 'Lahore',
        age: '27 Years',
        height: "5' 5\" (165 cm)",
        complexion: 'Fair',
        maritalStatus: 'Never Married',
        religion: 'Islam',
        casteOrSect: 'Sunni / Kashmiri Mir',
        motherTongue: 'Urdu / English',
        bloodGroup: 'B Positive (B+)',
        showPhoto: true,
      },
      educationCareer: {
        highestDegree: 'Bachelors in Communication Design',
        collegeOrUni: 'National College of Arts (NCA), Lahore',
        occupation: 'Creative Art Director & Senior Product Designer',
        companyOrOrg: 'FinTech Tech Agency, Dubai Internet City',
        annualIncome: 'AED 240,000 / Year (Tax Free)',
        workLocation: 'Dubai, UAE / Lahore',
      },
      educationList: [
        { id: '1', degree: 'Bachelors in Visual Communication', institution: 'National College of Arts (NCA)', year: '2020', gradeOrScore: 'Honours' }
      ],
      family: {
        fatherName: 'Mir Aftab Alam',
        fatherOccupation: 'Architect & Urban Planner',
        motherName: 'Mrs. Nilofer Mir',
        motherOccupation: 'Educationist',
        brothers: '1 Brother (Studying in Canada)',
        sisters: '1 Younger Sister',
        familyType: 'Modern Nuclear Family',
        familyValues: 'Cultured, Open-Minded & Ethical',
        nativePlace: 'Gulberg, Lahore',
        familyStatus: 'Upper Middle Class',
      },
      contact: {
        residentialAddress: 'Gulberg III, Lahore / Dubai Marina',
        cityAndCountry: 'Lahore, Pakistan & Dubai, UAE',
        contactPerson: 'Father: Mir Aftab Alam',
        phone: '+971 50 1234567 / +92 300 4455667',
        whatsapp: '+971 50 1234567',
        email: 'aftab.mir.lahore@gmail.com',
      },
      partnerPreferences: {
        ageRange: '28 to 33 Years',
        heightRange: "5' 9\" to 6' 1\"",
        educationPreference: 'Masters / Professional (Corporate, Tech, Finance, Creative)',
        maritalStatusPreference: 'Never Married',
        locationPreference: 'UAE, UK, Canada, or Pakistan',
        additionalExpectations: 'Intellectual companion, emotionally mature, progressive yet rooted.',
      },
      customFields: [
        { id: 'travel', label: 'Travel & Relocation', value: 'Open to relocating within GCC, Europe, or North America' }
      ],
    }
  },
  {
    id: 'sample-daniyal',
    name: 'Daniyal Hashmi',
    role: 'Investment Banker & CFA Charterholder',
    location: 'London & Karachi',
    theme: 'saffron',
    gender: 'Male',
    avatarBg: 'bg-amber-900',
    data: {
      header: { symbol: 'islamic', customTitle: 'MARRIAGE BIODATA' },
      personal: {
        fullName: 'Daniyal Hashmi',
        gender: 'Male',
        dob: '08 November 1995',
        birthTime: '02:30 PM',
        birthPlace: 'Karachi',
        age: '30 Years',
        height: "5' 10\" (178 cm)",
        complexion: 'Fair',
        maritalStatus: 'Never Married',
        religion: 'Islam',
        casteOrSect: 'Sunni / Hashmi Syed',
        motherTongue: 'Urdu / English',
        bloodGroup: 'AB Positive (AB+)',
        showPhoto: true,
      },
      educationCareer: {
        highestDegree: 'MSc Finance & CFA Charter',
        collegeOrUni: 'London School of Economics (LSE) / IBA Karachi',
        occupation: 'Vice President, Private Equity & M&A',
        companyOrOrg: 'Global Asset Management Firm',
        annualIncome: '£95,000 + Bonus / Year',
        workLocation: 'Canary Wharf, London, UK',
      },
      educationList: [
        { id: '1', degree: 'MSc Finance', institution: 'London School of Economics (LSE)', year: '2019', gradeOrScore: 'Distinction' },
        { id: '2', degree: 'BBA Finance (Honours)', institution: 'IBA Karachi', year: '2017', gradeOrScore: 'Dean’s List' }
      ],
      family: {
        fatherName: 'Dr. Masood Hashmi',
        fatherOccupation: 'Consultant Cardiologist',
        motherName: 'Dr. Samina Hashmi',
        motherOccupation: 'Gynecologist',
        brothers: '1 Elder Brother (Doctor in NHS, UK)',
        sisters: 'None',
        familyType: 'Nuclear Family of Doctors',
        familyValues: 'Distinguished, Religious & Humble',
        nativePlace: 'Clifton, Karachi',
        familyStatus: 'Elite Professional Class',
      },
      contact: {
        residentialAddress: 'St John’s Wood, London / Clifton Block 4, Karachi',
        cityAndCountry: 'London, UK & Karachi, Pakistan',
        contactPerson: 'Father: Dr. Masood Hashmi',
        phone: '+44 7700 900123 / +92 321 8899001',
        whatsapp: '+44 7700 900123',
        email: 'hashmi.family.london@gmail.com',
      },
      partnerPreferences: {
        ageRange: '24 to 28 Years',
        heightRange: "5' 4\" to 5' 8\"",
        educationPreference: 'Doctor, Finance/Corporate, Lawyer, or Graduate',
        maritalStatusPreference: 'Never Married',
        locationPreference: 'UK Settled or willing to relocate to London',
        additionalExpectations: 'Graceful, family-oriented, practising Muslimah with pleasant temperament.',
      },
      customFields: [
        { id: 'visa', label: 'Immigration Status', value: 'British Citizen / Dual UK-Pakistan Passport' }
      ],
    }
  }
];

export default function ShaadiBiodataPage() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('maroon');
  const [data, setData] = useState<BiodataData>(SHOWCASE_PROFILES[0].data);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  
  // Showcase Carousel Slider State
  const showcaseScrollRef = useRef<HTMLDivElement | null>(null);
  const templateScrollRef = useRef<HTMLDivElement | null>(null);
  
  // Height & Page fit monitor
  const [paperHeight, setPaperHeight] = useState<number>(0);
  const isOverflowing = paperHeight > 1150;

  // Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  const paperRef = useRef<HTMLDivElement | null>(null);

  // Monitor Paper Height
  useEffect(() => {
    const checkHeight = () => {
      if (paperRef.current) {
        setPaperHeight(paperRef.current.scrollHeight);
      }
    };
    checkHeight();
    const interval = setInterval(checkHeight, 1500);
    return () => clearInterval(interval);
  }, [data, currentTheme]);

  // Load local saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ansar_shaadi_biodata_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.personal) {
          setData(parsed);
        }
      }
      const savedTheme = localStorage.getItem('ansar_shaadi_theme');
      if (savedTheme && savedTheme in THEME_CONFIGS) {
        setCurrentTheme(savedTheme as ThemeId);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveLocal = (newData: BiodataData) => {
    setData(newData);
    try {
      localStorage.setItem('ansar_shaadi_biodata_v2', JSON.stringify(newData));
    } catch (e) {
      console.error(e);
    }
  };

  const handleThemeChange = (newTheme: ThemeId) => {
    setCurrentTheme(newTheme);
    try {
      localStorage.setItem('ansar_shaadi_theme', newTheme);
    } catch (e) {
      console.error(e);
    }
    showToast(`Applied ${THEME_CONFIGS[newTheme].name} Theme! ✨`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Scroll Showcase Slider
  const scrollShowcase = (direction: 'left' | 'right') => {
    if (showcaseScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      showcaseScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Scroll Template Slider
  const scrollTemplates = (direction: 'left' | 'right') => {
    if (templateScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      templateScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 1-Click Load Profile from Slider
  const loadShowcaseProfile = (item: ShowcaseItem) => {
    setData(item.data);
    setCurrentTheme(item.theme);
    saveLocal(item.data);
    showToast(`Loaded "${item.name}" profile & ${THEME_CONFIGS[item.theme].name}! 👑`);
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        saveLocal({
          ...data,
          personal: { ...data.personal, photoUrl: url, showPhoto: true }
        });
        showToast('Photo uploaded successfully! 📸');
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom Fields
  const addCustomField = () => {
    const newField: CustomField = {
      id: `field_${Date.now()}`,
      label: 'New Detail',
      value: ''
    };
    saveLocal({ ...data, customFields: [...data.customFields, newField] });
  };

  const updateCustomField = (id: string, key: 'label' | 'value', val: string) => {
    const updated = data.customFields.map((f) => f.id === id ? { ...f, [key]: val } : f);
    saveLocal({ ...data, customFields: updated });
  };

  const removeCustomField = (id: string) => {
    saveLocal({ ...data, customFields: data.customFields.filter((f) => f.id !== id) });
  };

  // Education Qualifications
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu_${Date.now()}`,
      degree: '',
      institution: '',
      year: '',
      gradeOrScore: ''
    };
    saveLocal({ ...data, educationList: [...(data.educationList || []), newItem] });
  };

  const updateEducation = (id: string, key: keyof EducationItem, val: string) => {
    const updated = (data.educationList || []).map(e => e.id === id ? { ...e, [key]: val } : e);
    saveLocal({ ...data, educationList: updated });
  };

  const removeEducation = (id: string) => {
    saveLocal({ ...data, educationList: (data.educationList || []).filter(e => e.id !== id) });
  };

  // EXPORT 1: PDF Download via html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    const paper = paperRef.current;
    if (!paper) return;

    setIsExportingPdf(true);
    showToast('Rendering high-resolution A4 vector PDF... 📄');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(paper, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: THEME_CONFIGS[currentTheme].paperBgHex || '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      const cleanName = (data.personal.fullName || 'Shaadi_Biodata').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
      pdf.save(`${cleanName}_marriage_biodata.pdf`);

      showToast('Biodata PDF Downloaded Successfully! 🎉');
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // EXPORT 2: Download High-Res JPG Image for WhatsApp
  const handleDownloadImage = async () => {
    const paper = paperRef.current;
    if (!paper) return;

    setIsExportingImage(true);
    showToast('Rendering High-Res JPG for WhatsApp... 📸');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(paper, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: THEME_CONFIGS[currentTheme].paperBgHex || '#ffffff',
      });

      const cleanName = (data.personal.fullName || 'biodata').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const filename = `${cleanName}_marriage_biodata.jpg`;

      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          showToast('Downloaded Biodata Image (JPG) for WhatsApp! 🖼️');
        }, 'image/jpeg', 0.95);
      } else {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Downloaded Biodata Image (JPG)! 🖼️');
      }
    } catch (err) {
      console.error('Image export error:', err);
      showToast('Error generating image.');
    } finally {
      setIsExportingImage(false);
    }
  };

  // EXPORT 3: Native Microsoft Word (.docx) Export
  const handleDownloadWord = async () => {
    setIsExportingWord(true);
    showToast('Generating formatted Microsoft Word (.docx)... 📝');

    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');

      const p = data.personal;
      const edu = data.educationCareer;
      const fam = data.family;
      const con = data.contact;
      const pref = data.partnerPreferences;

      const children: any[] = [
        new Paragraph({
          text: data.header.customTitle || 'MARRIAGE BIODATA',
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        }),
        new Paragraph({
          text: p.fullName || 'Full Name',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
        }),
      ];

      const addSection = (title: string, rows: [string, string | undefined][]) => {
        children.push(
          new Paragraph({
            text: title.toUpperCase(),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        for (const [label, val] of rows) {
          if (val) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `${label}:  `, bold: true, size: 20, color: '334155' }),
                  new TextRun({ text: val, size: 20, color: '0F172A' }),
                ],
                spacing: { after: 50 },
              })
            );
          }
        }
      };

      addSection('Personal Details', [
        ['Full Name', p.fullName],
        ['Gender', p.gender],
        ['Date of Birth', `${p.dob}${p.age ? ` (${p.age})` : ''}`],
        ['Time & Place of Birth', `${p.birthTime || ''}${p.birthPlace ? `, ${p.birthPlace}` : ''}`],
        ['Height & Complexion', `${p.height || ''}${p.complexion ? ` • ${p.complexion}` : ''}`],
        ['Marital Status', p.maritalStatus],
        ['Religion & Sect/Caste', `${p.religion || ''}${p.casteOrSect ? ` • ${p.casteOrSect}` : ''}`],
        ['Mother Tongue', p.motherTongue],
        ['Blood Group', p.bloodGroup],
      ]);

      addSection('Education & Career', [
        ['Highest Qualification', edu.highestDegree],
        ['College / University', edu.collegeOrUni],
        ['Occupation / Profession', edu.occupation],
        ['Company / Organization', edu.companyOrOrg],
        ['Annual Income', edu.annualIncome],
        ['Work Location', edu.workLocation],
      ]);

      addSection('Family Background', [
        ["Father's Name & Occupation", `${fam.fatherName} (${fam.fatherOccupation})`],
        ["Mother's Name & Occupation", `${fam.motherName} (${fam.motherOccupation})`],
        ['Brothers', fam.brothers],
        ['Sisters', fam.sisters],
        ['Family Type & Values', `${fam.familyType} • ${fam.familyValues}`],
        ['Native Place / City', fam.nativePlace],
        ['Family Status', fam.familyStatus],
      ]);

      addSection('Contact Information', [
        ['Contact Person', con.contactPerson],
        ['Phone / Mobile', con.phone],
        ['WhatsApp', con.whatsapp],
        ['Email', con.email],
        ['Residential Address', `${con.residentialAddress}, ${con.cityAndCountry}`],
      ]);

      if (pref.ageRange || pref.heightRange || pref.educationPreference) {
        addSection('Partner Expectations', [
          ['Preferred Age', pref.ageRange],
          ['Preferred Height', pref.heightRange],
          ['Preferred Education/Job', pref.educationPreference],
          ['Preferred Location', pref.locationPreference],
          ['Other Expectations', pref.additionalExpectations],
        ]);
      }

      if (data.customFields.length > 0) {
        addSection('Additional Details', data.customFields.map((f) => [f.label, f.value]));
      }

      const doc = new Document({
        sections: [
          {
            properties: {
              page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } },
            },
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const cleanName = (p.fullName || 'biodata').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cleanName}_marriage_biodata.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Downloaded Word Document (.docx)! 📝');
    } catch (err) {
      console.error('Word export error:', err);
      alert('Error generating Word document.');
    } finally {
      setIsExportingWord(false);
    }
  };

  // EXPORT 4: WhatsApp Summary Formatter
  const handleWhatsAppShare = () => {
    const p = data.personal;
    const edu = data.educationCareer;
    const fam = data.family;
    const con = data.contact;

    const summary = `💍 *MATRIMONIAL BIODATA SUMMARY*\n\n` +
      `👤 *Candidate:* ${p.fullName} (${p.gender})\n` +
      `🎂 *Age / Height:* ${p.age || 'N/A'} • ${p.height || 'N/A'}\n` +
      `🕌 *Religion / Caste:* ${p.religion} • ${p.casteOrSect || 'N/A'}\n` +
      `🎓 *Education:* ${edu.highestDegree} (${edu.collegeOrUni || ''})\n` +
      `💼 *Profession:* ${edu.occupation} at ${edu.companyOrOrg || ''}\n` +
      `📍 *Location:* ${edu.workLocation || con.cityAndCountry}\n\n` +
      `👨‍👩‍👧 *Family Background:*\n` +
      `• Father: ${fam.fatherName} (${fam.fatherOccupation})\n` +
      `• Mother: ${fam.motherName} (${fam.motherOccupation})\n` +
      `• Siblings: ${fam.brothers} brother(s), ${fam.sisters} sister(s)\n\n` +
      `📞 *Contact Information:*\n` +
      `• Contact Person: ${con.contactPerson}\n` +
      `• Phone/WhatsApp: ${con.phone || con.whatsapp}\n\n` +
      `_Created with Ansar Tools Shaadi Biodata Maker_`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank');
  };

  const currentThemeConfig = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.maroon;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      <Navbar />

      {/* =========================================================================
          TOP STUDIO HEADER TOOLBAR
          ========================================================================= */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 py-3 px-3 sm:px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Ansar Pro Shaadi Biodata Maker
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Royal Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Free matrimonial profile studio with 8 ready-made templates, showcase slider &amp; direct exports
              </p>
            </div>
          </div>

          {/* Quick Actions & Exports */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg ${activeTab === 'editor' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
              >
                Edit Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg ${activeTab === 'preview' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
              >
                Live Biodata
              </button>
            </div>

            {/* Export Buttons Toolbar */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
              title="Share formatted summary to WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" /> WhatsApp
            </button>

            <button
              type="button"
              onClick={handleDownloadWord}
              disabled={isExportingWord}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              title="Download Microsoft Word document (.docx)"
            >
              {isExportingWord ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              <span>Word</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExportingImage}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20 cursor-pointer"
              title="Download high-resolution JPG image for WhatsApp"
            >
              {isExportingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
              <span>Save JPG</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Download PDF</span>
            </button>

          </div>
        </div>
      </header>

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          FEATURE 1: TOP SHOWCASE SLIDER (SAMPLE BIODATAS CAROUSEL)
          ========================================================================= */}
      <section className="bg-slate-950/80 border-b border-slate-800 py-4 px-3 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Showcase Biodata Gallery</span>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md font-semibold">
                    1-Click Profiles
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Browse finished sample matrimonial profiles or click any card to load its details and styling instantly
                </p>
              </div>
            </div>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollShowcase('left')}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollShowcase('right')}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Showcase Track Slider */}
          <div
            ref={showcaseScrollRef}
            className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 scroll-smooth scrollbar-thin select-none"
          >
            {SHOWCASE_PROFILES.map((profile) => {
              const theme = THEME_CONFIGS[profile.theme];
              const isSelected = data.personal.fullName === profile.name;

              return (
                <div
                  key={profile.id}
                  className={`flex-shrink-0 w-72 bg-slate-900 border rounded-2xl p-3.5 transition-all relative group cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 shadow-lg shadow-rose-600/20 bg-slate-900/90'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                  onClick={() => loadShowcaseProfile(profile)}
                >
                  <div className="flex items-start gap-3 mb-2.5">
                    {/* Avatar Badge */}
                    <div className={`w-12 h-12 rounded-xl ${profile.avatarBg} border border-white/20 flex items-center justify-center font-bold text-white text-base shadow shrink-0`}>
                      {profile.name.charAt(profile.gender === 'Female' ? 4 : 0) || 'B'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{profile.name}</span>
                      </div>
                      <p className="text-[11px] text-amber-300 font-medium truncate">{profile.role}</p>
                      <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-slate-500" /> {profile.location}
                      </p>
                    </div>
                  </div>

                  {/* Card Mini Meta */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-semibold border border-slate-800 flex items-center gap-1">
                      <span>{theme.ornament}</span> {theme.name.split(' ')[0]}
                    </span>
                    <button
                      type="button"
                      className="px-2 py-0.5 bg-rose-600/20 hover:bg-rose-600 group-hover:bg-rose-600 text-rose-300 group-hover:text-white rounded-md font-bold transition-all flex items-center gap-1"
                    >
                      <span>Load Sample</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE 2: READY-MADE TEMPLATE SLIDER GALLERY (STEP 2: CHOOSE TEMPLATE)
          ========================================================================= */}
      <section className="bg-slate-950 border-b border-slate-800/80 py-4 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Step 2: Choose Ready-Made Royal Template</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md font-semibold">
                    8 Royal Styles
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Click on any template to instantly adapt the live A4 biodata with royal borders, color palettes, and header styling
                </p>
              </div>
            </div>

            {/* Template Navigation Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollTemplates('left')}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Scroll Templates Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTemplates('right')}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Scroll Templates Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Template Gallery Carousel */}
          <div
            ref={templateScrollRef}
            className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth scrollbar-thin select-none"
          >
            {(Object.keys(THEME_CONFIGS) as ThemeId[]).map((tKey) => {
              const t = THEME_CONFIGS[tKey];
              const isSelected = currentTheme === tKey;

              return (
                <div
                  key={tKey}
                  onClick={() => handleThemeChange(tKey)}
                  className={`flex-shrink-0 w-44 rounded-2xl border-2 p-2.5 transition-all cursor-pointer relative flex flex-col items-center ${
                    isSelected
                      ? 'border-amber-400 bg-slate-900 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/30'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {/* Miniature A4 Paper Preview */}
                  <div
                    className={`w-full aspect-[210/297] rounded-xl border p-2 flex flex-col justify-between overflow-hidden shadow-inner mb-2 ${t.paperBg}`}
                    style={{ borderColor: t.primary }}
                  >
                    {/* Mini Header */}
                    <div className="w-full text-center">
                      <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full mb-1 opacity-80" />
                      <div className="w-full h-2 rounded font-bold text-[6px] uppercase tracking-wider text-center" style={{ color: t.primary }}>
                        BIODATA
                      </div>
                    </div>

                    {/* Mini Profile Content mockup */}
                    <div className="space-y-1 my-auto">
                      <div className="w-7 h-7 rounded-full mx-auto border" style={{ borderColor: t.accent, backgroundColor: `${t.primary}22` }} />
                      <div className="w-16 h-1 bg-slate-400/40 rounded mx-auto" />
                      <div className="w-20 h-0.5 bg-slate-300/40 rounded mx-auto" />
                      <div className="w-14 h-0.5 bg-slate-300/40 rounded mx-auto" />
                    </div>

                    {/* Mini Footer Bar */}
                    <div className="w-full h-1.5 rounded" style={{ backgroundColor: `${t.primary}33` }} />
                  </div>

                  {/* Template Title & Badge */}
                  <div className="w-full text-center">
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-white mb-0.5">
                      <span>{t.ornament}</span>
                      <span className="truncate">{t.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{t.tagline}</p>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow font-black text-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN WORKSPACE: SPLIT-VIEW (LEFT: FORM EDITOR, RIGHT: LIVE PAPER)
          ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* =========================================================
           LEFT COLUMN: FORM EDITOR (ACCORDION SECTIONS)
           ========================================================= */}
        <div className={`w-full lg:w-[48%] flex-col gap-6 ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* SECTION 0: RELIGIOUS & CULTURAL HEADER */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-400" /> Header Invocation &amp; Title
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Cultural / Religious Header</label>
                <select
                  value={data.header.symbol}
                  onChange={(e) => {
                    const symbol = e.target.value as ReligiousSymbol;
                    saveLocal({ ...data, header: { ...data.header, symbol } });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="islamic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (Islamic)</option>
                  <option value="hindu">॥ श्री गणेशाय नमः ॥ (Hindu)</option>
                  <option value="sikh">ੴ ਸਤਿਗੁਰ ਪ੍ਰਸादि (Sikh)</option>
                  <option value="christian">✝ Cross / In God&apos;s Grace</option>
                  <option value="universal">💍 Universal / Marriage Biodata</option>
                  <option value="none">None / Title Only</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Document Title</label>
                <input
                  type="text"
                  value={data.header.customTitle}
                  onChange={(e) => saveLocal({ ...data, header: { ...data.header, customTitle: e.target.value } })}
                  placeholder="e.g. MARRIAGE BIODATA / RISHTA PROFILE"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-bold"
                />
              </div>
            </div>
          </div>

          {/* SECTION 1: PERSONAL DETAILS & PHOTO PURDAH TOGGLE */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-rose-500" /> 1. Personal Information
              </h3>

              {/* Photo Privacy Toggle */}
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                <ShieldCheck className={`w-4 h-4 ${data.personal.showPhoto ? 'text-slate-500' : 'text-emerald-400'}`} />
                <label className="text-[11px] font-semibold text-slate-300 cursor-pointer flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={!data.personal.showPhoto}
                    onChange={(e) => saveLocal({
                      ...data,
                      personal: { ...data.personal, showPhoto: !e.target.checked }
                    })}
                    className="accent-rose-500 cursor-pointer"
                  />
                  <span>Purdah / Hide Photo</span>
                </label>
              </div>
            </div>

            {/* Photo Upload Box */}
            {data.personal.showPhoto && (
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div className="w-16 h-20 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 relative">
                  {data.personal.photoUrl ? (
                    <Image src={data.personal.photoUrl} alt="Preview" width={64} height={80} unoptimized className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-white block mb-0.5">Candidate Photograph</span>
                  <p className="text-[11px] text-slate-400 mb-2">Formal portrait / passport size photo recommended.</p>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{data.personal.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    {data.personal.photoUrl && (
                      <button
                        type="button"
                        onClick={() => saveLocal({ ...data, personal: { ...data.personal, photoUrl: undefined } })}
                        className="text-xs text-rose-400 hover:text-rose-300 underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={data.personal.fullName}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, fullName: e.target.value } })}
                  placeholder="e.g. Muhammad Arham Tariq"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Gender</label>
                <select
                  value={data.personal.gender}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, gender: e.target.value as any } })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Male">Male (Groom)</option>
                  <option value="Female">Female (Bride)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Date of Birth</label>
                <input
                  type="text"
                  value={data.personal.dob}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, dob: e.target.value } })}
                  placeholder="e.g. 14 August 1997"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Age</label>
                <input
                  type="text"
                  value={data.personal.age}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, age: e.target.value } })}
                  placeholder="e.g. 28 Years"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Height</label>
                <input
                  type="text"
                  value={data.personal.height}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, height: e.target.value } })}
                  placeholder="e.g. 5' 11&quot; (180 cm)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Complexion</label>
                <input
                  type="text"
                  value={data.personal.complexion}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, complexion: e.target.value } })}
                  placeholder="e.g. Fair / Very Fair"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Marital Status</label>
                <select
                  value={data.personal.maritalStatus}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, maritalStatus: e.target.value } })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Never Married">Never Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Religion</label>
                <input
                  type="text"
                  value={data.personal.religion}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, religion: e.target.value } })}
                  placeholder="e.g. Islam / Hinduism"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Caste / Sect / Clan</label>
                <input
                  type="text"
                  value={data.personal.casteOrSect}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, casteOrSect: e.target.value } })}
                  placeholder="e.g. Sunni / Rajput / Brahmin"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Mother Tongue</label>
                <input
                  type="text"
                  value={data.personal.motherTongue}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, motherTongue: e.target.value } })}
                  placeholder="e.g. Urdu / Punjabi / English"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Blood Group</label>
                <input
                  type="text"
                  value={data.personal.bloodGroup}
                  onChange={(e) => saveLocal({ ...data, personal: { ...data.personal, bloodGroup: e.target.value } })}
                  placeholder="e.g. B Positive (B+)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: EDUCATION & CAREER (WITH ADD DEGREE TABLE) */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" /> 2. Education &amp; Career
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Degree
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-400 font-semibold mb-1 block">Highest Qualification *</label>
                <input
                  type="text"
                  value={data.educationCareer.highestDegree}
                  onChange={(e) => saveLocal({ ...data, educationCareer: { ...data.educationCareer, highestDegree: e.target.value } })}
                  placeholder="e.g. BS Computer Science / MBBS"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Occupation / Profession *</label>
                <input
                  type="text"
                  value={data.educationCareer.occupation}
                  onChange={(e) => saveLocal({ ...data, educationCareer: { ...data.educationCareer, occupation: e.target.value } })}
                  placeholder="e.g. Senior Software Engineer / Doctor"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Company / Hospital / Firm</label>
                <input
                  type="text"
                  value={data.educationCareer.companyOrOrg}
                  onChange={(e) => saveLocal({ ...data, educationCareer: { ...data.educationCareer, companyOrOrg: e.target.value } })}
                  placeholder="e.g. Multinational Tech / Hospital"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Annual Income</label>
                <input
                  type="text"
                  value={data.educationCareer.annualIncome}
                  onChange={(e) => saveLocal({ ...data, educationCareer: { ...data.educationCareer, annualIncome: e.target.value } })}
                  placeholder="e.g. PKR 40 - 50 Lakhs / Confidential"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Work Location</label>
                <input
                  type="text"
                  value={data.educationCareer.workLocation}
                  onChange={(e) => saveLocal({ ...data, educationCareer: { ...data.educationCareer, workLocation: e.target.value } })}
                  placeholder="e.g. Lahore / Dubai / London"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Dynamic Educational Qualifications Table */}
            {(data.educationList || []).length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 mb-2 block">Qualifications Breakdown (Table)</span>
                <div className="space-y-2">
                  {(data.educationList || []).map((item) => (
                    <div key={item.id} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 grid grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={item.degree}
                          onChange={(e) => updateEducation(item.id, 'degree', e.target.value)}
                          placeholder="Degree / Exam"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white font-medium"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) => updateEducation(item.id, 'institution', e.target.value)}
                          placeholder="School / College"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => updateEducation(item.id, 'year', e.target.value)}
                          placeholder="Year"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-center"
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <input
                          type="text"
                          value={item.gradeOrScore || ''}
                          onChange={(e) => updateEducation(item.id, 'gradeOrScore', e.target.value)}
                          placeholder="Grade"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-center"
                        />
                        <button
                          type="button"
                          onClick={() => removeEducation(item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 shrink-0"
                          title="Remove degree"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* SECTION 3: FAMILY BACKGROUND */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
              <Users className="w-4 h-4 text-amber-400" /> 3. Family Background
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Father&apos;s Full Name *</label>
                <input
                  type="text"
                  value={data.family.fatherName}
                  onChange={(e) => saveLocal({ ...data, family: { ...data.family, fatherName: e.target.value } })}
                  placeholder="e.g. Ch. Muhammad Tariq"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Father&apos;s Occupation</label>
                <input
                  type="text"
                  value={data.family.fatherOccupation}
                  onChange={(e) => saveLocal({ ...data, family: { ...data.family, fatherOccupation: e.target.value } })}
                  placeholder="e.g. Businessman / Govt Officer (Retd.)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Mother&apos;s Full Name</label>
                <input
                  type="text"
                  value={data.family.motherName}
                  onChange={(e) => saveLocal({ ...data, family: { ...data.family, motherName: e.target.value } })}
                  placeholder="e.g. Begum Shaheen Tariq"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Mother&apos;s Occupation</label>
                <input
                  type="text"
                  value={data.family.motherOccupation}
                  onChange={(e) => saveLocal({ ...data, family: { ...data.family, motherOccupation: e.target.value } })}
                  placeholder="e.g. Homemaker / Teacher"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Brothers</label>
                <input
                  type="text"
                  value={data.family.brothers}
                  onChange={(e) => saveLocal({ ...data, family: { ...data.family, brothers: e.target.value } })}
                  placeholder="e.g. 1 Younger Brother (Engineer)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Sisters</label>
                <input
                  type="text"
                  value={data.family.sisters}
                  onChange={(e) => saveLocal({ ...data, family: { ...data.family, sisters: e.target.value } })}
                  placeholder="e.g. 1 Sister (Married)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Family Type &amp; Values</label>
                <input
                  type="text"
                  value={data.family.familyType}
                  onChange={(e) => saveLocal({ ...data, family: { ...data.family, familyType: e.target.value } })}
                  placeholder="e.g. Nuclear / Joint Family"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Native City / Origin</label>
                <input
                  type="text"
                  value={data.family.nativePlace}
                  onChange={(e) => saveLocal({ ...data, family: { ...data.family, nativePlace: e.target.value } })}
                  placeholder="e.g. Lahore / Rawalpindi"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: CONTACT INFORMATION */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
              <Phone className="w-4 h-4 text-sky-400" /> 4. Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Contact Person *</label>
                <input
                  type="text"
                  value={data.contact.contactPerson}
                  onChange={(e) => saveLocal({ ...data, contact: { ...data.contact, contactPerson: e.target.value } })}
                  placeholder="e.g. Father: Ch. Muhammad Tariq"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Phone / Mobile No *</label>
                <input
                  type="text"
                  value={data.contact.phone}
                  onChange={(e) => saveLocal({ ...data, contact: { ...data.contact, phone: e.target.value } })}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">WhatsApp No</label>
                <input
                  type="text"
                  value={data.contact.whatsapp}
                  onChange={(e) => saveLocal({ ...data, contact: { ...data.contact, whatsapp: e.target.value } })}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Email Address</label>
                <input
                  type="email"
                  value={data.contact.email}
                  onChange={(e) => saveLocal({ ...data, contact: { ...data.contact, email: e.target.value } })}
                  placeholder="e.g. family.contact@gmail.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-400 font-semibold mb-1 block">Residential Address</label>
                <input
                  type="text"
                  value={data.contact.residentialAddress}
                  onChange={(e) => saveLocal({ ...data, contact: { ...data.contact, residentialAddress: e.target.value } })}
                  placeholder="e.g. House #142, Sector J, DHA Phase 5, Lahore"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: PARTNER PREFERENCES & EXPECTATIONS */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
              <Heart className="w-4 h-4 text-pink-400" /> 5. Partner Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Preferred Age Range</label>
                <input
                  type="text"
                  value={data.partnerPreferences.ageRange}
                  onChange={(e) => saveLocal({ ...data, partnerPreferences: { ...data.partnerPreferences, ageRange: e.target.value } })}
                  placeholder="e.g. 23 to 27 Years"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Preferred Height</label>
                <input
                  type="text"
                  value={data.partnerPreferences.heightRange}
                  onChange={(e) => saveLocal({ ...data, partnerPreferences: { ...data.partnerPreferences, heightRange: e.target.value } })}
                  placeholder="e.g. 5' 4&quot; to 5' 8&quot;"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-400 font-semibold mb-1 block">Preferred Education / Profession</label>
                <input
                  type="text"
                  value={data.partnerPreferences.educationPreference}
                  onChange={(e) => saveLocal({ ...data, partnerPreferences: { ...data.partnerPreferences, educationPreference: e.target.value } })}
                  placeholder="e.g. Graduate or Master (Doctor, Engineer, or Professional)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-400 font-semibold mb-1 block">Key Expectations &amp; Values</label>
                <textarea
                  rows={2}
                  value={data.partnerPreferences.additionalExpectations}
                  onChange={(e) => saveLocal({ ...data, partnerPreferences: { ...data.partnerPreferences, additionalExpectations: e.target.value } })}
                  placeholder="e.g. Cultured, polite, family-oriented with good moral values..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC CUSTOM FIELDS */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" /> 6. Additional Custom Fields
              </h3>
              <button
                type="button"
                onClick={addCustomField}
                className="px-2.5 py-1 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Custom Field
              </button>
            </div>

            {data.customFields.map((f) => (
              <div key={f.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={f.label}
                  onChange={(e) => updateCustomField(f.id, 'label', e.target.value)}
                  placeholder="Label (e.g. Visa Status)"
                  className="w-1/3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-semibold"
                />
                <input
                  type="text"
                  value={f.value}
                  onChange={(e) => updateCustomField(f.id, 'value', e.target.value)}
                  placeholder="Detail (e.g. UK Settled / Dual National)"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => removeCustomField(f.id)}
                  className="p-2 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* =========================================================
           RIGHT COLUMN: LIVE A4 SHAADI BIODATA PREVIEW
           ========================================================= */}
        <div className={`w-full lg:w-[52%] sticky top-20 flex flex-col items-center gap-3 ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Controls above paper */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="font-semibold flex items-center gap-1.5 text-slate-300">
              <Eye className="w-4 h-4 text-rose-400" /> Live A4 Shaadi Biodata Preview
            </span>
            
            {/* Single Page A4 Height Monitor */}
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                isOverflowing 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {isOverflowing ? (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>Overflowing A4</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Single A4 Page Perfect</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* THE A4 PAPER CONTAINER */}
          <div className="w-full flex justify-center overflow-x-auto pb-12 pt-1 scrollbar-none">
            <div
              ref={paperRef}
              id="biodata-paper"
              className={`w-[794px] min-h-[1123px] p-8 shadow-2xl relative transition-all duration-300 ${currentThemeConfig.paperBg}`}
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                backgroundColor: currentThemeConfig.paperBgHex
              }}
            >
              {/* Decorative Double Border Outer Frame */}
              <div 
                className={`w-full h-full min-h-[1050px] border-4 p-3 rounded-xl relative flex flex-col justify-between`}
                style={{ borderColor: currentThemeConfig.primary }}
              >
                {/* Inner decorative dotted border */}
                <div 
                  className="absolute inset-2 border border-dashed rounded-lg pointer-events-none opacity-40"
                  style={{ borderColor: currentThemeConfig.accent }}
                />

                {/* 4 Corner Ornaments */}
                <div className="absolute top-2 left-2 text-sm select-none" style={{ color: currentThemeConfig.primary }}>⚜</div>
                <div className="absolute top-2 right-2 text-sm select-none" style={{ color: currentThemeConfig.primary }}>⚜</div>
                <div className="absolute bottom-2 left-2 text-sm select-none" style={{ color: currentThemeConfig.primary }}>⚜</div>
                <div className="absolute bottom-2 right-2 text-sm select-none" style={{ color: currentThemeConfig.primary }}>⚜</div>

                <div>
                  {/* HEADER: Religious Invocation & Title */}
                  <div className="text-center pt-2 pb-4 border-b-2" style={{ borderColor: `${currentThemeConfig.primary}33` }}>
                    {data.header.symbol === 'islamic' && (
                      <div className="text-lg font-bold tracking-widest text-slate-800 mb-1" style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                    )}
                    {data.header.symbol === 'hindu' && (
                      <div className="text-base font-bold tracking-widest text-slate-800 mb-1">
                        ॥ श्री गणेशाय नमः ॥
                      </div>
                    )}
                    {data.header.symbol === 'sikh' && (
                      <div className="text-base font-bold tracking-widest text-slate-800 mb-1">
                        ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ
                      </div>
                    )}
                    {data.header.symbol === 'christian' && (
                      <div className="text-sm font-semibold tracking-wider text-slate-700 mb-1">
                        ✝ In God&apos;s Grace &amp; Blessings
                      </div>
                    )}
                    {data.header.symbol === 'universal' && (
                      <div className="text-xs font-semibold tracking-widest text-slate-600 uppercase mb-1">
                        In the Name of Love &amp; Companionship
                      </div>
                    )}

                    <h2
                      className="text-xl font-extrabold uppercase tracking-wider mt-1 drop-shadow-sm"
                      style={{ color: currentThemeConfig.primary }}
                    >
                      {data.header.customTitle || 'MARRIAGE BIODATA'}
                    </h2>
                  </div>

                  {/* CANDIDATE HERO ROW (PHOTO & QUICK TITLE) */}
                  <div className="flex items-center justify-between gap-6 py-4 px-2 border-b" style={{ borderColor: `${currentThemeConfig.primary}22` }}>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black tracking-tight" style={{ color: currentThemeConfig.primary }}>
                        {data.personal.fullName || 'Candidate Name'}
                      </h3>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">
                        {data.educationCareer.highestDegree}
                      </p>
                      <p className="text-xs text-slate-600">
                        {data.educationCareer.occupation} {data.educationCareer.companyOrOrg && `at ${data.educationCareer.companyOrOrg}`}
                      </p>
                    </div>

                    {/* Candidate Photo (if not in Purdah mode) */}
                    {data.personal.showPhoto && (
                      <div
                        className="w-28 h-36 rounded-xl border-2 p-1 shadow-md overflow-hidden bg-white shrink-0 relative"
                        style={{ borderColor: currentThemeConfig.primary }}
                      >
                        {data.personal.photoUrl ? (
                          <Image
                            src={data.personal.photoUrl}
                            alt="Candidate"
                            width={112}
                            height={144}
                            unoptimized
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-[10px] text-center p-1 rounded-lg">
                            <User className="w-8 h-8 text-slate-300 mb-1" />
                            <span>Photo</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 1. PERSONAL DETAILS */}
                  <div className="mb-4 mt-3">
                    <div className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded border mb-2 flex items-center justify-between ${currentThemeConfig.sectionHeaderClass}`}>
                      <span>Personal Information</span>
                      <span className="text-[10px] font-normal opacity-80">Profile</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-800 pl-1">
                      <div><span className="font-bold text-slate-600">Full Name:</span> {data.personal.fullName}</div>
                      <div><span className="font-bold text-slate-600">Gender:</span> {data.personal.gender}</div>
                      <div><span className="font-bold text-slate-600">Date of Birth:</span> {data.personal.dob} {data.personal.age && `(${data.personal.age})`}</div>
                      <div><span className="font-bold text-slate-600">Height:</span> {data.personal.height}</div>
                      <div><span className="font-bold text-slate-600">Complexion:</span> {data.personal.complexion}</div>
                      <div><span className="font-bold text-slate-600">Marital Status:</span> {data.personal.maritalStatus}</div>
                      <div><span className="font-bold text-slate-600">Religion:</span> {data.personal.religion}</div>
                      <div><span className="font-bold text-slate-600">Caste / Sect:</span> {data.personal.casteOrSect}</div>
                      <div><span className="font-bold text-slate-600">Mother Tongue:</span> {data.personal.motherTongue}</div>
                      {data.personal.bloodGroup && (
                        <div><span className="font-bold text-slate-600">Blood Group:</span> {data.personal.bloodGroup}</div>
                      )}
                    </div>
                  </div>

                  {/* 2. EDUCATION & CAREER */}
                  <div className="mb-4">
                    <div className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded border mb-2 flex items-center justify-between ${currentThemeConfig.sectionHeaderClass}`}>
                      <span>Education &amp; Profession</span>
                      <span className="text-[10px] font-normal opacity-80">Career</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-800 pl-1 mb-2">
                      <div className="col-span-2"><span className="font-bold text-slate-600">Highest Qualification:</span> {data.educationCareer.highestDegree}</div>
                      <div><span className="font-bold text-slate-600">Occupation:</span> {data.educationCareer.occupation}</div>
                      <div><span className="font-bold text-slate-600">Company / Organization:</span> {data.educationCareer.companyOrOrg}</div>
                      {data.educationCareer.annualIncome && (
                        <div><span className="font-bold text-slate-600">Annual Income:</span> {data.educationCareer.annualIncome}</div>
                      )}
                      <div><span className="font-bold text-slate-600">Work Location:</span> {data.educationCareer.workLocation}</div>
                    </div>

                    {/* Qualifications Table in Live Paper */}
                    {(data.educationList || []).length > 0 && (
                      <div className="mt-2 border rounded-lg overflow-hidden" style={{ borderColor: `${currentThemeConfig.primary}33` }}>
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 font-bold border-b" style={{ borderColor: `${currentThemeConfig.primary}22` }}>
                              <th className="p-1.5">Degree / Course</th>
                              <th className="p-1.5">Institute / University</th>
                              <th className="p-1.5 text-center">Year</th>
                              <th className="p-1.5 text-center">Grade / Division</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(data.educationList || []).map((item, idx) => (
                              <tr key={idx} className="border-b last:border-0 border-slate-200">
                                <td className="p-1.5 font-semibold text-slate-800">{item.degree}</td>
                                <td className="p-1.5 text-slate-600">{item.institution}</td>
                                <td className="p-1.5 text-center text-slate-600">{item.year}</td>
                                <td className="p-1.5 text-center font-semibold text-slate-800">{item.gradeOrScore || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* 3. FAMILY BACKGROUND */}
                  <div className="mb-4">
                    <div className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded border mb-2 flex items-center justify-between ${currentThemeConfig.sectionHeaderClass}`}>
                      <span>Family Background</span>
                      <span className="text-[10px] font-normal opacity-80">Family</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-800 pl-1">
                      <div><span className="font-bold text-slate-600">Father&apos;s Name:</span> {data.family.fatherName}</div>
                      <div><span className="font-bold text-slate-600">Father&apos;s Profession:</span> {data.family.fatherOccupation}</div>
                      <div><span className="font-bold text-slate-600">Mother&apos;s Name:</span> {data.family.motherName}</div>
                      <div><span className="font-bold text-slate-600">Mother&apos;s Profession:</span> {data.family.motherOccupation}</div>
                      <div><span className="font-bold text-slate-600">Brothers:</span> {data.family.brothers}</div>
                      <div><span className="font-bold text-slate-600">Sisters:</span> {data.family.sisters}</div>
                      <div><span className="font-bold text-slate-600">Family Type:</span> {data.family.familyType}</div>
                      {data.family.nativePlace && (
                        <div><span className="font-bold text-slate-600">Native Place / City:</span> {data.family.nativePlace}</div>
                      )}
                    </div>
                  </div>

                  {/* 4. PARTNER PREFERENCES */}
                  {(data.partnerPreferences.ageRange || data.partnerPreferences.educationPreference) && (
                    <div className="mb-4">
                      <div className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded border mb-2 flex items-center justify-between ${currentThemeConfig.sectionHeaderClass}`}>
                        <span>Partner Expectations</span>
                        <span className="text-[10px] font-normal opacity-80">Preferences</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-800 pl-1">
                        <div><span className="font-bold text-slate-600">Preferred Age:</span> {data.partnerPreferences.ageRange}</div>
                        <div><span className="font-bold text-slate-600">Preferred Height:</span> {data.partnerPreferences.heightRange}</div>
                        <div className="col-span-2"><span className="font-bold text-slate-600">Preferred Education:</span> {data.partnerPreferences.educationPreference}</div>
                        {data.partnerPreferences.additionalExpectations && (
                          <div className="col-span-2"><span className="font-bold text-slate-600">Expectations:</span> {data.partnerPreferences.additionalExpectations}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 5. CUSTOM FIELDS */}
                  {data.customFields.length > 0 && (
                    <div className="mb-4">
                      <div className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded border mb-2 flex items-center justify-between ${currentThemeConfig.sectionHeaderClass}`}>
                        <span>Additional Information</span>
                        <span className="text-[10px] font-normal opacity-80">Custom Details</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-800 pl-1">
                        {data.customFields.map((cf) => (
                          <div key={cf.id} className="col-span-2 sm:col-span-1">
                            <span className="font-bold text-slate-600">{cf.label}:</span> {cf.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. CONTACT FOOTER */}
                <div 
                  className="mt-4 pt-3 border-t-2 p-3 rounded-lg"
                  style={{ borderColor: `${currentThemeConfig.primary}44`, backgroundColor: `${currentThemeConfig.primary}11` }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: currentThemeConfig.primary }}>
                    <Phone className="w-3.5 h-3.5" /> Contact Details &amp; Address
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-800">
                    <div><span className="font-bold text-slate-900">Contact Person:</span> {data.contact.contactPerson}</div>
                    <div><span className="font-bold text-slate-900">Phone / WhatsApp:</span> {data.contact.phone || data.contact.whatsapp}</div>
                    {data.contact.email && (
                      <div><span className="font-bold text-slate-900">Email:</span> {data.contact.email}</div>
                    )}
                    <div className="col-span-2"><span className="font-bold text-slate-900">Address:</span> {data.contact.residentialAddress}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
