// High-resolution realistic sample portrait vector for instant 1-click testing
const SAMPLE_PORTRAIT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <defs>
    <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
    <linearGradient id="skinG" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <linearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FED7AA" />
      <stop offset="100%" stop-color="#FDBA74" />
    </linearGradient>
    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#64748B" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
    <radialGradient id="irisGrad" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#78350F" />
      <stop offset="60%" stop-color="#451A03" />
      <stop offset="100%" stop-color="#1C1917" />
    </radialGradient>
  </defs>

  <!-- Neutral Studio Background -->
  <rect width="600" height="750" fill="url(#bgG)" />

  <!-- Shoulders / Casual T-Shirt -->
  <path d="M 120,750 C 140,560 210,500 300,500 C 390,500 460,560 480,750 Z" fill="url(#shirtGrad)" />
  <path d="M 240,500 C 260,540 340,540 360,500 Z" fill="#E2E8F0" />

  <!-- Neck -->
  <path d="M 250,380 L 250,510 C 270,530 330,530 350,510 L 350,380 Z" fill="url(#faceGrad)" />
  <path d="M 250,440 C 280,480 320,480 350,440 L 350,450 C 320,490 280,490 250,450 Z" fill="#EA580C" opacity="0.15" />

  <!-- Ears -->
  <ellipse cx="205" cy="330" rx="20" ry="32" fill="url(#faceGrad)" />
  <ellipse cx="205" cy="330" rx="12" ry="20" fill="#FDBA74" />
  <ellipse cx="395" cy="330" rx="20" ry="32" fill="url(#faceGrad)" />
  <ellipse cx="395" cy="330" rx="12" ry="20" fill="#FDBA74" />

  <!-- Face Contour -->
  <path d="M 215,280 C 210,380 230,460 300,460 C 370,460 390,380 385,280 C 380,190 220,190 215,280 Z" fill="url(#faceGrad)" />

  <!-- Cheeks Subtle Blush -->
  <circle cx="250" cy="350" r="22" fill="#FB923C" opacity="0.12" filter="blur(8px)" />
  <circle cx="350" cy="350" r="22" fill="#FB923C" opacity="0.12" filter="blur(8px)" />

  <!-- Eyes Sclera -->
  <ellipse cx="260" cy="315" rx="20" ry="11" fill="#FFFFFF" />
  <ellipse cx="340" cy="315" rx="20" ry="11" fill="#FFFFFF" />

  <!-- Irises & Pupils -->
  <circle cx="260" cy="315" r="9.5" fill="url(#irisGrad)" />
  <circle cx="260" cy="315" r="4.5" fill="#000000" />
  <circle cx="258" cy="312" r="2" fill="#FFFFFF" />

  <circle cx="340" cy="315" r="9.5" fill="url(#irisGrad)" />
  <circle cx="340" cy="315" r="4.5" fill="#000000" />
  <circle cx="338" cy="312" r="2" fill="#FFFFFF" />

  <!-- Eyelids -->
  <path d="M 238,313 Q 260,302 282,313" stroke="#7C2D12" stroke-width="2.5" fill="none" />
  <path d="M 318,313 Q 340,302 362,313" stroke="#7C2D12" stroke-width="2.5" fill="none" />

  <!-- Eyebrows -->
  <path d="M 235,296 Q 260,285 285,292" stroke="#1E293B" stroke-width="5" stroke-linecap="round" fill="none" />
  <path d="M 315,292 Q 340,285 365,296" stroke="#1E293B" stroke-width="5" stroke-linecap="round" fill="none" />

  <!-- Nose -->
  <path d="M 300,300 L 297,360 Q 300,366 303,360 Z" stroke="#EA580C" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4" />
  <path d="M 290,365 Q 300,372 310,365" stroke="#C2410C" stroke-width="2.5" stroke-linecap="round" fill="none" />

  <!-- Lips -->
  <path d="M 275,405 Q 300,400 325,405 Q 300,422 275,405 Z" fill="#E11D48" opacity="0.65" />
  <line x1="277" y1="405" x2="323" y2="405" stroke="#9F1239" stroke-width="1.5" />

  <!-- Modern Hair Style -->
  <path d="M 205,270 C 195,180 230,130 300,130 C 370,130 405,180 395,270 C 385,220 370,190 300,185 C 230,190 215,220 205,270 Z" fill="url(#hairGrad)" />
  <path d="M 220,180 C 260,150 340,150 380,185 C 370,165 340,140 300,140 C 260,140 230,165 220,180 Z" fill="#475569" opacity="0.5" />
</svg>
`;

export const SAMPLE_PORTRAIT_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(SAMPLE_PORTRAIT_SVG.trim())}`;
