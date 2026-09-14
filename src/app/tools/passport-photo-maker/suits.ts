export interface SuitTemplate {
  id: string;
  name: string;
  gender: 'men' | 'women';
  svgDataUri: string;
}

// Helper to convert raw SVG to data URI
function svgToUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

/* =========================================================================
   SUIT 1: Men's Charcoal Business Suit with White Shirt & Burgundy Striped Tie
   ========================================================================= */
const SVG_MEN_CHARCOAL = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360" width="400" height="360">
  <defs>
    <linearGradient id="suitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D3139" />
      <stop offset="50%" stop-color="#1F232B" />
      <stop offset="100%" stop-color="#14171C" />
    </linearGradient>
    <linearGradient id="lapelGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3A3F49" />
      <stop offset="100%" stop-color="#232730" />
    </linearGradient>
    <linearGradient id="tieGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#991B1B" />
      <stop offset="50%" stop-color="#7F1D1D" />
      <stop offset="100%" stop-color="#450A0A" />
    </linearGradient>
    <linearGradient id="shirtGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
    <filter id="shadow1" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Shoulders & Coat Base -->
  <path d="M 60,360 L 60,165 C 80,120 120,95 160,95 C 175,95 185,110 200,110 C 215,110 225,95 240,95 C 280,95 320,120 340,165 L 340,360 Z" fill="url(#suitGrad1)" />

  <!-- Inner White Shirt Base in V-Opening -->
  <polygon points="160,95 240,95 225,230 175,230" fill="url(#shirtGrad1)" />

  <!-- Shirt Collar Left -->
  <polygon points="165,95 200,120 188,150 162,110" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
  <!-- Shirt Collar Right -->
  <polygon points="235,95 200,120 212,150 238,110" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />

  <!-- Necktie Knot -->
  <polygon points="190,120 210,120 214,142 186,142" fill="url(#tieGrad1)" filter="url(#shadow1)" />
  <!-- Necktie Body -->
  <polygon points="186,142 214,142 222,280 200,320 178,280" fill="url(#tieGrad1)" filter="url(#shadow1)" />
  <!-- Tie Diagonal Stripes -->
  <line x1="187" y1="160" x2="213" y2="150" stroke="#FDE047" stroke-width="2.5" opacity="0.6" />
  <line x1="184" y1="185" x2="216" y2="175" stroke="#FDE047" stroke-width="2.5" opacity="0.6" />
  <line x1="182" y1="210" x2="218" y2="200" stroke="#FDE047" stroke-width="2.5" opacity="0.6" />
  <line x1="180" y1="235" x2="220" y2="225" stroke="#FDE047" stroke-width="2.5" opacity="0.6" />
  <line x1="182" y1="260" x2="218" y2="250" stroke="#FDE047" stroke-width="2.5" opacity="0.6" />

  <!-- Left Lapel -->
  <path d="M 160,95 L 140,160 L 175,210 L 195,290 L 190,360 L 140,360 L 60,360 L 60,165 C 80,120 120,95 160,95 Z" fill="url(#lapelGrad1)" filter="url(#shadow1)" />
  <!-- Left Notch Detail -->
  <polygon points="160,95 140,160 175,210 168,212 135,162 155,98" fill="#4B5563" />

  <!-- Right Lapel -->
  <path d="M 240,95 L 260,160 L 225,210 L 205,290 L 210,360 L 260,360 L 340,360 L 340,165 C 320,120 280,95 240,95 Z" fill="url(#suitGrad1)" filter="url(#shadow1)" />
  <!-- Right Notch Detail -->
  <polygon points="240,95 260,160 225,210 232,212 265,162 245,98" fill="#374151" />

  <!-- Lapel Stitching / Shadows -->
  <path d="M 175,210 L 195,295" stroke="#111827" stroke-width="2.5" />
  <path d="M 225,210 L 205,295" stroke="#111827" stroke-width="2.5" />
  <!-- Suit Button -->
  <circle cx="200" cy="305" r="5" fill="#111827" stroke="#374151" stroke-width="1.5" />
</svg>
`;

/* =========================================================================
   SUIT 2: Men's Deep Navy Formal Suit with Light Blue Shirt & Navy Tie
   ========================================================================= */
const SVG_MEN_NAVY = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360" width="400" height="360">
  <defs>
    <linearGradient id="navySuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="50%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="navyLapelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <linearGradient id="blueTieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7" />
      <stop offset="50%" stop-color="#0369A1" />
      <stop offset="100%" stop-color="#075985" />
    </linearGradient>
    <linearGradient id="blueShirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F0F9FF" />
      <stop offset="100%" stop-color="#BAE6FD" />
    </linearGradient>
    <filter id="navyShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Shoulders & Coat Base -->
  <path d="M 55,360 L 55,165 C 75,120 115,95 158,95 C 174,95 185,110 200,110 C 215,110 226,95 242,95 C 285,95 325,120 345,165 L 345,360 Z" fill="url(#navySuitGrad)" />

  <!-- Inner Light Blue Shirt Base in V-Opening -->
  <polygon points="158,95 242,95 225,235 175,235" fill="url(#blueShirtGrad)" />

  <!-- Shirt Collar Left -->
  <polygon points="162,95 200,122 186,152 158,110" fill="#F0F9FF" stroke="#93C5FD" stroke-width="1.5" />
  <!-- Shirt Collar Right -->
  <polygon points="238,95 200,122 214,152 242,110" fill="#E0F2FE" stroke="#93C5FD" stroke-width="1.5" />

  <!-- Navy Silk Tie Knot -->
  <polygon points="190,122 210,122 215,144 185,144" fill="url(#blueTieGrad)" filter="url(#navyShadow)" />
  <!-- Navy Silk Tie Body -->
  <polygon points="185,144 215,144 223,285 200,325 177,285" fill="url(#blueTieGrad)" filter="url(#navyShadow)" />
  <!-- Micro pattern dots on tie -->
  <circle cx="200" cy="165" r="1.5" fill="#BAE6FD" opacity="0.8" />
  <circle cx="193" cy="180" r="1.5" fill="#BAE6FD" opacity="0.8" />
  <circle cx="207" cy="180" r="1.5" fill="#BAE6FD" opacity="0.8" />
  <circle cx="200" cy="195" r="1.5" fill="#BAE6FD" opacity="0.8" />
  <circle cx="192" cy="210" r="1.5" fill="#BAE6FD" opacity="0.8" />
  <circle cx="208" cy="210" r="1.5" fill="#BAE6FD" opacity="0.8" />
  <circle cx="200" cy="225" r="1.5" fill="#BAE6FD" opacity="0.8" />

  <!-- Left Lapel -->
  <path d="M 158,95 L 138,162 L 175,212 L 195,295 L 190,360 L 55,360 L 55,165 C 75,120 115,95 158,95 Z" fill="url(#navyLapelGrad)" filter="url(#navyShadow)" />
  <polygon points="158,95 138,162 175,212 168,214 133,164 153,98" fill="#1E293B" />

  <!-- Right Lapel -->
  <path d="M 242,95 L 262,162 L 225,212 L 205,295 L 210,360 L 345,360 L 345,165 C 325,120 285,95 242,95 Z" fill="url(#navySuitGrad)" filter="url(#navyShadow)" />
  <polygon points="242,95 262,162 225,212 232,214 267,164 247,98" fill="#0F172A" />

  <!-- Suit Button -->
  <circle cx="200" cy="310" r="5.5" fill="#020617" stroke="#334155" stroke-width="1.5" />
</svg>
`;

/* =========================================================================
   SUIT 3: Men's Formal Black Tuxedo with Bowtie
   ========================================================================= */
const SVG_MEN_TUXEDO = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360" width="400" height="360">
  <defs>
    <linearGradient id="tuxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181B" />
      <stop offset="50%" stop-color="#09090B" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="satinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#27272A" />
      <stop offset="50%" stop-color="#3F3F46" />
      <stop offset="100%" stop-color="#18181B" />
    </linearGradient>
  </defs>

  <!-- Shoulders & Coat Base -->
  <path d="M 55,360 L 55,165 C 75,120 115,95 158,95 C 174,95 185,110 200,110 C 215,110 226,95 242,95 C 285,95 325,120 345,165 L 345,360 Z" fill="url(#tuxGrad)" />

  <!-- Inner Pleated Tuxedo Shirt -->
  <polygon points="158,95 242,95 220,240 180,240" fill="#FFFFFF" />
  <!-- Pleat Lines -->
  <line x1="192" y1="135" x2="192" y2="235" stroke="#E4E4E7" stroke-width="1" />
  <line x1="208" y1="135" x2="208" y2="235" stroke="#E4E4E7" stroke-width="1" />
  <!-- Black Shirt Studs -->
  <circle cx="200" cy="165" r="2.5" fill="#000000" />
  <circle cx="200" cy="195" r="2.5" fill="#000000" />
  <circle cx="200" cy="225" r="2.5" fill="#000000" />

  <!-- Wingtip Collar Left & Right -->
  <polygon points="165,95 195,116 182,132 160,105" fill="#FFFFFF" stroke="#D4D4D8" stroke-width="1" />
  <polygon points="235,95 205,116 218,132 240,105" fill="#FAFAFA" stroke="#D4D4D8" stroke-width="1" />

  <!-- Black Bowtie -->
  <polygon points="200,123 175,115 172,135 200,127" fill="#18181B" stroke="#27272A" stroke-width="1" />
  <polygon points="200,123 225,115 228,135 200,127" fill="#18181B" stroke="#27272A" stroke-width="1" />
  <!-- Bowtie Knot -->
  <rect x="195" y="119" width="10" height="9" rx="2" fill="#27272A" stroke="#3F3F46" stroke-width="1" />

  <!-- Satin Shawl Lapel Curved -->
  <path d="M 158,95 C 145,150 160,220 198,280 L 195,360 L 55,360 L 55,165 C 75,120 115,95 158,95 Z" fill="url(#satinGrad)" />
  <path d="M 242,95 C 255,150 240,220 202,280 L 205,360 L 345,360 L 345,165 C 325,120 285,95 242,95 Z" fill="url(#tuxGrad)" />
</svg>
`;

/* =========================================================================
   SUIT 4: Women's Executive Black Blazer with White Notch Blouse
   ========================================================================= */
const SVG_WOMEN_BLACK = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360" width="400" height="360">
  <defs>
    <linearGradient id="wbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#262626" />
      <stop offset="50%" stop-color="#171717" />
      <stop offset="100%" stop-color="#0A0A0A" />
    </linearGradient>
    <linearGradient id="wbLapelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#404040" />
      <stop offset="100%" stop-color="#262626" />
    </linearGradient>
    <linearGradient id="blouseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    <filter id="wShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Shoulders & Coat Base -->
  <path d="M 65,360 L 65,165 C 85,122 122,100 162,100 C 176,100 186,112 200,112 C 214,112 224,100 238,100 C 278,100 315,122 335,165 L 335,360 Z" fill="url(#wbGrad)" />

  <!-- Inner Elegant White Blouse V-Neck -->
  <polygon points="162,100 238,100 200,225" fill="url(#blouseGrad)" />
  <path d="M 180,105 C 190,140 195,180 200,220 C 205,180 210,140 220,105" stroke="#E2E8F0" stroke-width="1.5" fill="none" />

  <!-- Left Lapel Slim Tailored -->
  <path d="M 162,100 L 140,165 L 180,220 L 198,300 L 195,360 L 65,360 L 65,165 C 85,122 122,100 162,100 Z" fill="url(#wbLapelGrad)" filter="url(#wShadow)" />
  <!-- Left Notch detail -->
  <polygon points="162,100 140,165 180,220 174,222 136,167 156,102" fill="#525252" />

  <!-- Right Lapel Slim Tailored -->
  <path d="M 238,100 L 260,165 L 220,220 L 202,300 L 205,360 L 335,360 L 335,165 C 315,122 278,100 238,100 Z" fill="url(#wbGrad)" filter="url(#wShadow)" />
  <!-- Right Notch detail -->
  <polygon points="238,100 260,165 220,220 226,222 264,167 244,102" fill="#262626" />

  <!-- Single Elegant Center Button -->
  <circle cx="200" cy="305" r="5" fill="#0A0A0A" stroke="#525252" stroke-width="1.5" />
</svg>
`;

/* =========================================================================
   SUIT 5: Women's Deep Navy Tailored Blazer with Cream Inner Top
   ========================================================================= */
const SVG_WOMEN_NAVY = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360" width="400" height="360">
  <defs>
    <linearGradient id="wnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="50%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="wnLapelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <linearGradient id="creamTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="100%" stop-color="#FEF3C7" />
    </linearGradient>
    <filter id="wnShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Shoulders & Coat Base -->
  <path d="M 65,360 L 65,165 C 85,122 122,100 162,100 C 176,100 186,112 200,112 C 214,112 224,100 238,100 C 278,100 315,122 335,165 L 335,360 Z" fill="url(#wnGrad)" />

  <!-- Inner Silk Cream V-Neck -->
  <polygon points="162,100 238,100 200,230" fill="url(#creamTopGrad)" />
  <path d="M 180,105 C 190,145 195,185 200,225 C 205,185 210,145 220,105" stroke="#FDE68A" stroke-width="1.5" fill="none" />

  <!-- Left Lapel -->
  <path d="M 162,100 L 140,165 L 180,225 L 198,305 L 195,360 L 65,360 L 65,165 C 85,122 122,100 162,100 Z" fill="url(#wnLapelGrad)" filter="url(#wnShadow)" />
  <polygon points="162,100 140,165 180,225 174,227 136,167 156,102" fill="#475569" />

  <!-- Right Lapel -->
  <path d="M 238,100 L 260,165 L 220,225 L 202,305 L 205,360 L 335,360 L 335,165 C 315,122 278,100 238,100 Z" fill="url(#wnGrad)" filter="url(#wnShadow)" />
  <polygon points="238,100 260,165 220,225 226,227 264,167 244,102" fill="#0F172A" />

  <!-- Button -->
  <circle cx="200" cy="310" r="5" fill="#020617" stroke="#475569" stroke-width="1.5" />
</svg>
`;

/* =========================================================================
   SUIT 6: Women's Slate Grey Professional Blazer
   ========================================================================= */
const SVG_WOMEN_GREY = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360" width="400" height="360">
  <defs>
    <linearGradient id="wgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4B5563" />
      <stop offset="50%" stop-color="#374151" />
      <stop offset="100%" stop-color="#1F2937" />
    </linearGradient>
    <linearGradient id="wgLapelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6B7280" />
      <stop offset="100%" stop-color="#4B5563" />
    </linearGradient>
    <filter id="wgShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.2" />
    </filter>
  </defs>

  <path d="M 65,360 L 65,165 C 85,122 122,100 162,100 C 176,100 186,112 200,112 C 214,112 224,100 238,100 C 278,100 315,122 335,165 L 335,360 Z" fill="url(#wgGrad)" />

  <polygon points="162,100 238,100 200,225" fill="#FFFFFF" />

  <path d="M 162,100 L 140,165 L 180,220 L 198,300 L 195,360 L 65,360 L 65,165 C 85,122 122,100 162,100 Z" fill="url(#wgLapelGrad)" filter="url(#wgShadow)" />
  <polygon points="162,100 140,165 180,220 174,222 136,167 156,102" fill="#9CA3AF" />

  <path d="M 238,100 L 260,165 L 220,220 L 202,300 L 205,360 L 335,360 L 335,165 C 315,122 278,100 238,100 Z" fill="url(#wgGrad)" filter="url(#wgShadow)" />
  <polygon points="238,100 260,165 220,220 226,222 264,167 244,102" fill="#374151" />

  <circle cx="200" cy="305" r="5" fill="#111827" stroke="#9CA3AF" stroke-width="1.5" />
</svg>
`;

export const SUIT_TEMPLATES: SuitTemplate[] = [
  {
    id: 'men-charcoal-red',
    name: "Men's Charcoal Suit & Red Tie",
    gender: 'men',
    svgDataUri: svgToUri(SVG_MEN_CHARCOAL)
  },
  {
    id: 'men-navy-blue',
    name: "Men's Navy Suit & Blue Tie",
    gender: 'men',
    svgDataUri: svgToUri(SVG_MEN_NAVY)
  },
  {
    id: 'men-tuxedo',
    name: "Men's Black Tuxedo & Bowtie",
    gender: 'men',
    svgDataUri: svgToUri(SVG_MEN_TUXEDO)
  },
  {
    id: 'women-black-blazer',
    name: "Women's Executive Black Blazer",
    gender: 'women',
    svgDataUri: svgToUri(SVG_WOMEN_BLACK)
  },
  {
    id: 'women-navy-blazer',
    name: "Women's Navy Tailored Suit",
    gender: 'women',
    svgDataUri: svgToUri(SVG_WOMEN_NAVY)
  },
  {
    id: 'women-grey-blazer',
    name: "Women's Slate Gray Blazer",
    gender: 'women',
    svgDataUri: svgToUri(SVG_WOMEN_GREY)
  }
];
