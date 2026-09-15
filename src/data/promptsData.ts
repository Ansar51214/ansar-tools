export interface PromptItem {
  id: string;
  title: string;
  category: 
    | 'ID Cards'
    | 'Banners'
    | 'Invitations'
    | 'Visuals'
    | 'Templates'
    | 'Anniversary'
    | 'Logos'
    | 'Marketing'
    | 'Albums'
    | 'Thumbnails'
    | 'Coding'
    | 'Writing'
    | 'Career'
    | 'Study'
    | 'Business'
    | 'Productivity';
  description: string;
  targetModels: ('ChatGPT' | 'Claude' | 'Gemini' | 'Midjourney' | 'Flux' | 'DALL-E 3')[];
  tags: string[];
  promptTemplate: string;
  defaultVariables?: Record<string, string>;
  imageUrl?: string;
  isCustom?: boolean;
}

export const CATEGORIES = [
  { id: 'all', label: 'All Designs', icon: 'Sparkles' },
  { id: 'ID Cards', label: 'ID Cards', icon: 'CreditCard' },
  { id: 'Banners', label: 'Banners', icon: 'Layout' },
  { id: 'Invitations', label: 'Invitation Cards', icon: 'Mail' },
  { id: 'Visuals', label: 'Image & Photos', icon: 'Image' },
  { id: 'Templates', label: 'Digital Templates', icon: 'Layers' },
  { id: 'Logos', label: 'Logo Design', icon: 'Sparkles' },
  { id: 'Albums', label: 'Album Design', icon: 'BookOpen' },
  { id: 'Thumbnails', label: 'Thumbnails', icon: 'Video' },
  { id: 'Marketing', label: 'Product & Marketing', icon: 'TrendingUp' },
  { id: 'Coding', label: 'Coding & Tech', icon: 'Code' },
  { id: 'Writing', label: 'Writing & Content', icon: 'PenTool' },
  { id: 'saved', label: 'Saved Prompts', icon: 'Bookmark' },
  { id: 'custom', label: 'My Vault', icon: 'FolderPlus' }
] as const;

export const curatedPrompts: PromptItem[] = [
  // ================= VISUAL DESIGNS =================
  {
    id: 'ansar-id-card-1',
    title: "Corporate Employee ID Card",
    category: 'ID Cards',
    description: "Clean, modern vertical corporate ID card template with geometric accents, QR code area, and official layout.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["ID Card", "Corporate", "Badge", "Design Template"],
    promptTemplate: "'C'r'e'a't'e' 'a' 'p'r'e'm'i'u'm' 'v'e'r't'i'c'a'l' 'c'o'r'p'o'r'a't'e' 'e'm'p'l'o'y'e'e' 'I'D' 'C'a'r'd' '('F'r'o'n't' 'S'i'd'e' 'O'n'l'y')',' 'a's'p'e'c't' 'r'a't'i'o' '2':'3',' 'w'i't'h' 'r'o'u'n'd'e'd' 'c'o'r'n'e'r's' 'a'n'd' 'a' 'm'o'd'e'r'n' 'c'o'r'p'o'r'a't'e' 'l'a'y'o'u't'.' 'M'a'i'n't'a'i'n' 't'h'e' 'e'x'a'c't' 's'a'm'e' 'b'a'c'k'g'r'o'u'n'd' 's't'y'l'e' 'u's'i'n'g' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e',' 'c'r'i's'p' 'w'h'i't'e',' 'a'n'd' 'v'i'b'r'a'n't' 'o'r'a'n'g'e' 'f'l'o'w'i'n'g' 'w'a'v'e' 's'h'a'p'e's'.' 'K'e'e'p' 't'h'e' 'b'a'c'k'g'r'o'u'n'd',' 'c'o'l'o'r' 'c'o'm'b'i'n'a't'i'o'n',' 'l'a'y'o'u't',' 's'p'a'c'i'n'g',' 'a'n'd' 'd'e's'i'g'n' 'i'd'e'n't'i'c'a'l' 'e'v'e'r'y' 't'i'm'e'.'\r'\n'A't' 't'h'e' 't'o'p' 'c'e'n't'e'r',' 'd'i's'p'l'a'y' 't'h'e' 'c'o'm'p'a'n'y' 'n'a'm'e':'\r'\n'&'q'u'o't';'A'n's'a'r' 'T'e'c'h' 'S't'u'd'i'o'&'q'u'o't';'\r'\n'B'e'l'o'w' 'i't',' 'd'i's'p'l'a'y' 't'h'e' 't'a'g'l'i'n'e':'\r'\n'&'q'u'o't';'C'o'm'p'u't'e'r' 'T'e'a'c'h'e'r'&'q'u'o't';'\r'\n'U's'e' 'c'l'e'a'n',' 'm'o'd'e'r'n',' 'b'o'l'd' 't'y'p'o'g'r'a'p'h'y'.'\r'\n'A'u't'o'm'a't'i'c'a'l'l'y' 'u's'e' 't'h'e' 'u'p'l'o'a'd'e'd' 'p'h'o't'o' 'o'f' 'a'n'y' 'm'a'l'e' 'o'r' 'f'e'm'a'l'e'.' 'P'l'a'c'e' 'i't' 'i'n's'i'd'e' 'a' 'p'e'r'f'e'c't'l'y' 'c'e'n't'e'r'e'd' 'c'i'r'c'u'l'a'r' 'f'r'a'm'e' 'w'i't'h' 'a' 'p'r'e'm'i'u'm' 'g'o'l'd' 'a'n'd' 'w'h'i't'e' 'd'o'u'b'l'e' 'b'o'r'd'e'r'.' 'P'r'e's'e'r'v'e' 't'h'e' 'p'e'r's'o'n'&'#'0'3'9';'s' 'r'e'a'l' 'f'a'c'e',' 's'k'i'n' 't'o'n'e',' 'h'a'i'r's't'y'l'e',' 'f'a'c'i'a'l' 'f'e'a't'u'r'e's',' 'a'n'd' 'i'd'e'n't'i't'y' 'w'i't'h'o'u't' 'b'e'a'u't'i'f'i'c'a't'i'o'n' 'o'r' 'd'i's't'o'r't'i'o'n'.' 'C'r'o'p' 't'h'e' 'i'm'a'g'e' 'p'r'o'f'e's's'i'o'n'a'l'l'y' 't'o' 'f'i't' 'i'n's'i'd'e' 't'h'e' 'c'i'r'c'l'e'.'\r'\n'B'e'l'o'w' 't'h'e' 'p'h'o't'o',' 'd'i's'p'l'a'y':'\r'\n'F'u'l'l' 'N'a'm'e':' '{'{'F'U'L'L'_'N'A'M'E'}'}'\r'\n'D'e's'i'g'n'a't'i'o'n':' '{'{'D'E'S'I'G'N'A'T'I'O'N'}'}'\r'\n'U's'e' 'l'a'r'g'e' 'b'o'l'd' 'w'h'i't'e' 't'e'x't' 'f'o'r' 't'h'e' 'n'a'm'e' 'a'n'd' 's'l'i'g'h't'l'y' 's'm'a'l'l'e'r' 'w'h'i't'e' 't'e'x't' 'f'o'r' 't'h'e' 'd'e's'i'g'n'a't'i'o'n'.'\r'\n'I'n' 't'h'e' 'l'o'w'e'r' 'd'a'r'k' 'n'a'v'y' 's'e'c't'i'o'n',' 'n'e'a't'l'y' 'a'l'i'g'n' 't'h'e' 'f'o'l'l'o'w'i'n'g' 'd'e't'a'i'l's' 'o'n' 't'h'e' 'l'e'f't':'\r'\n'I'D' 'N'O' ':' '{'I'D'_'N'U'M'B'E'R'}'\r'\n'E'M'A'I'L' ':' '{'E'M'A'I'L'}'\r'\n'P'H'O'N'E' ':' '{'P'H'O'N'E'}'\r'\n'A't' 't'h'e' 'b'o't't'o'm' 'c'e'n't'e'r' 'i'n's'i'd'e' 't'h'e' 'w'h'i't'e' 'c'u'r'v'e'd' 's'e'c't'i'o'n',' 'p'l'a'c'e' 'a' 'r'e'a'l'i's't'i'c' 's'q'u'a'r'e' 'Q'R' 'C'o'd'e' 'o'n' 't'h'e' 'l'e'f't' 'a'n'd' 'a' 'p'r'o'f'e's's'i'o'n'a'l' 'B'a'r'c'o'd'e' 'o'n' 't'h'e' 'r'i'g'h't'.' 'B'o't'h' 's'h'o'u'l'd' 'l'o'o'k' 'l'i'k'e' 'a' 'r'e'a'l' 'p'r'i'n't'-'r'e'a'd'y' 'c'o'r'p'o'r'a't'e' 'e'm'p'l'o'y'e'e' 'b'a'd'g'e'.'\r'\n'D'e's'i'g'n' 'R'e'q'u'i'r'e'm'e'n't's':'\r'\n'\u2022' 'S'a'm'e' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e',' 'w'h'i't'e',' 'a'n'd' 'o'r'a'n'g'e' 'f'l'o'w'i'n'g' 'w'a'v'e' 'b'a'c'k'g'r'o'u'n'd' 'e'v'e'r'y' 't'i'm'e'.'\r'\n'\u2022' 'S'a'm'e' 'l'a'y'o'u't' 'a'n'd' 's'p'a'c'i'n'g'.'\r'\n'\u2022' 'R'o'u'n'd'e'd' 'c'o'r'n'e'r's'.'\r'\n'\u2022' 'P'r'e'm'i'u'm' 'c'o'r'p'o'r'a't'e' 'b'r'a'n'd'i'n'g'.'\r'\n'\u2022' 'P'r'o'f'e's's'i'o'n'a'l' 'm'o'd'e'r'n' 't'y'p'o'g'r'a'p'h'y'.'\r'\n'\u2022' 'P'r'i'n't'-'r'e'a'd'y' 'd'e's'i'g'n'.'\r'\n'\u2022' 'U'l't'r'a' 'H'D' '4'K' 'q'u'a'l'i't'y'.'\r'\n'\u2022' '3'0'0' 'D'P'I'.'\r'\n'\u2022' 'C'l'e'a'n' 'v'e'c't'o'r' 's't'y'l'e'.'\r'\n'\u2022' 'H'i'g'h' 'c'o'n't'r'a's't'.'\r'\n'\u2022' 'R'e'a'l'i's't'i'c' 'l'i'g'h't'i'n'g'.'\r'\n'\u2022' 'P'e'r'f'e'c't' 'a'l'i'g'n'm'e'n't'.'\r'\n'\u2022' 'D'o' 'n'o't' 'c'h'a'n'g'e' 't'h'e' 'b'a'c'k'g'r'o'u'n'd',' 'c'o'l'o'r's',' 'l'a'y'o'u't',' 'o'r' 'd'e's'i'g'n'.'\r'\n'\u2022' 'O'n'l'y' 'r'e'p'l'a'c'e' 't'h'e' 'u'p'l'o'a'd'e'd' 'p'h'o't'o' 'a'n'd' 't'h'e' 'p'e'r's'o'n'a'l' 'd'e't'a'i'l's' 'w'h'i'l'e' 'k'e'e'p'i'n'g' 't'h'e' 'e'n't'i'r'e' 'd'e's'i'g'n' 'e'x'a'c't'l'y' 't'h'e' 's'a'm'e'.'",
  },
  {
    id: 'ansar-id-card-2',
    title: "Modern Geometric Business Badge",
    category: 'ID Cards',
    description: "Clean, modern vertical corporate ID card template with geometric accents, QR code area, and official layout.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["ID Card", "Corporate", "Badge", "Design Template"],
    promptTemplate: "'A' 'p'r'o'f'e's's'i'o'n'a'l' 'v'e'r't'i'c'a'l' 'c'o'r'p'o'r'a't'e' 'I'D' 'c'a'r'd' 't'e'm'p'l'a't'e' 'd'e's'i'g'n'.' 'C'l'e'a'n',' 'm'o'd'e'r'n',' 'a'n'd' 'g'e'o'm'e't'r'i'c' 's't'y'l'e'.' 'T'h'e' 'c'o'l'o'r' 'p'a'l'e't't'e' 'c'o'n's'i's't's' 'o'f' 'd'e'e'p' 'f'o'r'e's't' 'g'r'e'e'n',' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e',' 'b'r'i'g'h't' 'g'r'e'e'n',' 'a'n'd' 'w'h'i't'e'.' 'T'o'p' 's'e'c't'i'o'n' 'f'e'a't'u'r'e's' 'a' 'd'a'r'k' 'g'r'e'e'n' 'b'a'c'k'g'r'o'u'n'd' 'w'i't'h' 'a'n'g'l'e'd' 'g'e'o'm'e't'r'i'c' 's'h'a'p'e's' 'a'n'd' 'a' 'p'l'a'c'e'h'o'l'd'e'r' 'f'o'r' 'a' 'm'i'n'i'm'a'l' 'w'h'i't'e' 'c'o'm'p'a'n'y' 'l'o'g'o' 'a't' 't'h'e' 't'o'p' 'c'e'n't'e'r'.' 'T'h'e' 'c'e'n't'r'a'l' 'f'o'c'u's' 'i's' 'a' 'p'r'o'm'i'n'e'n't' 'h'e'x'a'g'o'n'a'l' 'p'h'o't'o' 'f'r'a'm'e' 'w'i't'h' 'a' 't'h'i'c'k' 'b'r'i'g'h't' 'g'r'e'e'n' 'b'o'r'd'e'r',' 'c'o'n't'a'i'n'i'n'g' 'a' 'p'r'o'f'e's's'i'o'n'a'l' 'h'e'a'd's'h'o't' 'p'o'r't'r'a'i't' 'o'f' 'a' 'm'a'n' 'i'n' 'a' 'g'r'e'y' 's'u'i't' 'a'n'd' 't'i'e'.' 'T'h'e' 'p'h'o't'o' 'f'r'a'm'e' 'i's' 'f'l'a'n'k'e'd' 'b'y' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e' 'a'n'g'l'e'd' 'b'a'c'k'g'r'o'u'n'd' 'e'l'e'm'e'n't's'.' 'T'h'e' 'm'i'd'd'l'e' 't'o' 'l'o'w'e'r' 's'e'c't'i'o'n' 'i's' 'a' 'c'l'e'a'n' 'w'h'i't'e' 'b'a'c'k'g'r'o'u'n'd'.' 'B'e'l'o'w' 't'h'e' 'p'h'o't'o',' 't'h'e'r'e' 'i's' 'l'a'r'g'e',' 'b'o'l'd',' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e' 'd'u'm'm'y' 't'e'x't' 'f'o'r' 'a' '&'#'0'3'9';'F'u'l'l' 'N'a'm'e'&'#'0'3'9';'.' 'U'n'd'e'r'n'e'a't'h' 't'h'e' 'n'a'm'e',' 't'h'e'r'e' 'i's' 'a' 'b'r'i'g'h't' 'g'r'e'e'n' 'r'e'c't'a'n'g'u'l'a'r' 'b'a'd'g'e' 'c'o'n't'a'i'n'i'n'g' 'w'h'i't'e' 'd'u'm'm'y' 't'e'x't' 'f'o'r' 'a' '&'#'0'3'9';'J'o'b' 'T'i't'l'e'&'#'0'3'9';'.' 'B'e'l'o'w' 't'h'i's',' 'n'e'a't'l'y' 'l'e'f't'-'a'l'i'g'n'e'd' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e' 'd'u'm'm'y' 't'e'x't' 'f'o'r' '&'#'0'3'9';'I'D' 'N'o' ':'&'#'0'3'9';',' '&'#'0'3'9';'E'm'a'i'l' ':'&'#'0'3'9';',' 'a'n'd' '&'#'0'3'9';'P'h'o'n'e' ':'&'#'0'3'9';' 'w'i't'h' 'p'l'a'c'e'h'o'l'd'e'r' 'v'a'l'u'e's'.' 'A't' 't'h'e' 'b'o't't'o'm' 'c'e'n't'e'r',' 'a' 'c'l'e'a'r' 'b'l'a'c'k'-'a'n'd'-'w'h'i't'e' 'b'a'r'c'o'd'e' 'g'r'a'p'h'i'c'.' 'T'h'e' 'b'o't't'o'm' 'e'd'g'e's' 'o'f' 't'h'e' 'c'a'r'd' 'f'e'a't'u'r'e' 's'h'a'r'p',' 'a'n'g'l'e'd' 'g'e'o'm'e't'r'i'c' 's't'r'i'p'e's' 'i'n' 'd'e'e'p' 'g'r'e'e'n' 'a'n'd' 'n'a'v'y' 'b'l'u'e'.' 'V'e'c't'o'r' 'g'r'a'p'h'i'c' 's't'y'l'e',' 'f'l'a't' 'd'e's'i'g'n',' 'h'i'g'h' 'r'e's'o'l'u't'i'o'n',' 'r'e'a'l'i's't'i'c' 'I'D' 'c'a'r'd' 'p'r'o'p'o'r't'i'o'n's'.'",
  },
  {
    id: 'ansar-id-card-3',
    title: "Professional ID Card Design #3",
    category: 'ID Cards',
    description: "Clean, modern vertical corporate ID card template with geometric accents, QR code area, and official layout.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["ID Card", "Corporate", "Badge", "Design Template"],
    promptTemplate: "'A' 'v'e'r't'i'c'a'l' 'p'r'o'f'e's's'i'o'n'a'l' 'I'D' 'c'a'r'd' 'd'e's'i'g'n' 't'e'm'p'l'a't'e'.' 'W'h'i't'e' 'b'a'c'k'g'r'o'u'n'd' 'w'i't'h' 'e'l'e'g'a'n't',' 'a'b's't'r'a'c't' 'f'l'o'w'i'n'g' 'p'i'n'k' 'w'a'v'y' 'g'r'a'p'h'i'c' 'r'i'b'b'o'n's' 'o'n' 't'h'e' 't'o'p' 'r'i'g'h't',' 'b'o't't'o'm' 'l'e'f't',' 'a'n'd' 'l'e'f't' 'e'd'g'e's'.' 'I'n' 't'h'e' 'c'e'n't'e'r',' 'a' 'l'a'r'g'e' 'r'e'c't'a'n'g'u'l'a'r' 'p'h'o't'o' 'p'l'a'c'e'h'o'l'd'e'r' 'w'i't'h' 'a' 'b'r'i'g'h't' 'g'l'o'w'i'n'g' 'p'i'n'k' 'b'o'r'd'e'r',' 'c'o'n't'a'i'n'i'n'g' 'a' 'p'o'r't'r'a'i't' 'o'f' 'a' 'p'r'o'f'e's's'i'o'n'a'l' 'w'o'm'a'n' 'i'n' 'a' 'p'i'n'k' 's'u'i't'.' 'T'o'p' 'c'e'n't'e'r' 'h'a's' 'a' 'p'i'l'l'-'s'h'a'p'e'd' 'l'a'n'y'a'r'd' 'h'o'l'e'.' 'V'e'r't'i'c'a'l' 'b'l'a'c'k' 't'e'x't' '&'#'0'3'9';'I'D' 'N'O':'&'#'0'3'9';' 'r'o't'a't'e'd' 'o'n' 't'h'e' 'l'e'f't' 'e'd'g'e'.' 'V'e'r't'i'c'a'l' 't'e'x't' '&'#'0'3'9';'O'C'C'U'P'A'T'I'O'N'&'#'0'3'9';' 'r'o't'a't'e'd' 'o'n' 't'h'e' 'r'i'g'h't' 'e'd'g'e'.' 'B'e'l'o'w' 't'h'e' 'p'h'o't'o' 'f'r'a'm'e',' 'b'o'l'd' 'b'l'a'c'k' 't'e'x't' 'f'o'r' '&'#'0'3'9';'O'l'i'v'i'a' 'W'i'l's'o'n'&'#'0'3'9';',' 'f'o'l'l'o'w'e'd' 'b'y' 's'm'a'l'l'e'r' 't'e'x't' 'l'i'n'e's' 'f'o'r' '&'#'0'3'9';'D'.'O'.'B':' '0'9'/'0'2'/'2'0'0'0'&'#'0'3'9';',' '&'#'0'3'9';'B'L'O'O'D' 'T'Y'P'E':' 'B'+'&'#'0'3'9';',' '&'#'0'3'9';'I'S'S'U'E'D'&'#'0'3'9';',' 'a'n'd' '&'#'0'3'9';'E'X'P'I'R'E'S'&'#'0'3'9';'.' 'A' 's'm'a'l'l' 'Q'R' 'c'o'd'e' 'i'n' 't'h'e' 'b'o't't'o'm' 'r'i'g'h't' 'c'o'r'n'e'r'.' 'H'i'g'h'-'q'u'a'l'i't'y' 'c'o'r'p'o'r'a't'e' 'g'r'a'p'h'i'c' 'd'e's'i'g'n'.'",
  },
  {
    id: 'ansar-id-card-4',
    title: "Professional ID Card Design #4",
    category: 'ID Cards',
    description: "Clean, modern vertical corporate ID card template with geometric accents, QR code area, and official layout.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["ID Card", "Corporate", "Badge", "Design Template"],
    promptTemplate: "'V'e'r't'i'c'a'l' 's'c'h'o'o'l' 'I'D' 'c'a'r'd'.' 'T'o'p':' 'o'r'a'n'g'e' 'b'a'n'n'e'r',' '['I'N'S'E'R'T' 'L'O'G'O' 'D'E'S'C'R'I'P'T'I'O'N']' 'o'n' 'l'e'f't',' 'w'h'i't'e' 't'e'x't' '&'q'u'o't';'['S'C'H'O'O'L' 'N'A'M'E']'&'q'u'o't';',' '&'q'u'o't';'['S'U'B'H'E'A'D'E'R']'&'q'u'o't';',' '&'q'u'o't';'['E'I'I'N']'&'q'u'o't';'.' 'M'i'd'd'l'e':' 'w'h'i't'e' 'b'a'c'k'g'r'o'u'n'd',' 'o'r'a'n'g'e' 'h'a'l'f't'o'n'e' 'w'a'v'e' 'p'a't't'e'r'n' 'o'n' 's'i'd'e's'.' 'C'e'n't'e'r':' 'o'r'a'n'g'e' 'r'o'u'n'd'e'd' 'f'r'a'm'e' 'w'i't'h' '['S'T'U'D'E'N'T' 'P'H'O'T'O' 'D'E'S'C'R'I'P'T'I'O'N']'.' 'B'e'l'o'w' 'p'h'o't'o',' 't'e'x't' 'f'i'e'l'd's':' '&'q'u'o't';'['S'T'U'D'E'N'T' 'N'A'M'E']'&'q'u'o't';' '('l'a'r'g'e' 'b'l'u'e' 'f'o'n't')',' '&'q'u'o't';'F'a't'h'e'r'&'#'0'3'9';'s' 'N'a'm'e':' '['F'A'T'H'E'R'&'#'0'3'9';'S' 'N'A'M'E']'&'q'u'o't';',' '&'q'u'o't';'C'l'a's's':' '['C'L'A'S'S']'&'q'u'o't';',' '&'q'u'o't';'I'D' 'N'o':' '['I'D' 'N'U'M'B'E'R']'&'q'u'o't';' '('b'l'a'c'k' 'f'o'n't')'.' 'B'o't't'o'm' 'r'i'g'h't':' 'h'a'n'd'-'d'r'a'w'n' '['S'I'G'N'A'T'U'R'E']' 'o'v'e'r' 'l'i'n'e' 'a'n'd' '&'q'u'o't';'P'r'i'n'c'i'p'a'l'&'q'u'o't';'.' 'B'o't't'o'm' 'e'd'g'e':' 'o'r'a'n'g'e' 'b'a'r',' 'w'h'i't'e' 't'e'x't' '&'q'u'o't';'D'a't'e' 'O'f' 'E'x'p'i'r'y' ':' '['E'X'P'I'R'Y' 'D'A'T'E']'&'q'u'o't';'.' 'C'l'e'a'n' 'v'e'c't'o'r' 'g'r'a'p'h'i'c' 's't'y'l'e',' 'r'e'a'l'i's't'i'c' 'I'D' 'c'a'r'd' 't'e'm'p'l'a't'e'.' '-'-'a'r' '2':'3'",
  },
  {
    id: 'ansar-banner-1',
    title: "4K Political Campaign & Event Banner",
    category: 'Banners',
    description: "Photorealistic, professional event and campaign banner layout with prominent typography and lighting.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Banner", "Event", "Campaign", "Poster"],
    promptTemplate: "'A' 'p'r'o'f'e's's'i'o'n'a'l' '4'K' 'h'i'g'h'l'y' 'r'e'a'l'i's't'i'c' 'I'n'd'i'a'n' 'p'o'l'i't'i'c'a'l' 'c'a'm'p'a'i'g'n' 'b'a'n'n'e'r' 'l'a'y'o'u't'.' 'O'n' 't'h'e' 'r'i'g'h't' 's'i'd'e',' 'a' 'h'y'p'e'r'-'r'e'a'l'i's't'i'c' 'y'o'u'n'g' 'I'n'd'i'a'n' 'm'a'n' 's't'a'n'd'i'n'g' 'w'i't'h' 'f'o'l'd'e'd' 'h'a'n'd's' 'i'n' 'a' 'r'e's'p'e'c't'f'u'l' 'N'a'm'a's't'e' 'p'o's'e'.' 'H'e' 'i's' 'w'e'a'r'i'n'g' 'a' 'c'r'i's'p' 'w'h'i't'e' 's'h'i'r't',' 'a' 't'h'i'c'k' 'o'r'a'n'g'e' 'm'a'r'i'g'o'l'd' '('g'e'n'd'a' 'p'h'o'o'l')' 'g'a'r'l'a'n'd' 'a'r'o'u'n'd' 'h'i's' 'n'e'c'k',' 'a'n'd' 'a' 'p'i'n'k' 't'i'l'a'k' 'o'n' 'h'i's' 'f'o'r'e'h'e'a'd'.' 'T'h'e' 'b'a'c'k'g'r'o'u'n'd' 'b'e'h'i'n'd' 'h'i'm' 's'h'o'w's' 'a' 'b'r'i'g'h't',' 's'c'e'n'i'c' 'I'n'd'i'a'n' 'v'i'l'l'a'g'e' 'r'o'a'd' 'w'i't'h' 'l'u's'h' 'g'r'e'e'n' 't'r'e'e's',' 's'u'n'l'i'g'h't',' 'a'n'd' 'a' 'w'a't'e'r' 't'o'w'e'r' 'i'n' 't'h'e' 'd'i's't'a'n'c'e'.' 'T'h'e' 'l'e'f't' 's'i'd'e' 'o'f' 't'h'e' 'p'o's't'e'r' 'f'e'a't'u'r'e's' 'a' 's'm'o'o't'h' 'g'r'a'd'i'e'n't' 'b'a'c'k'g'r'o'u'n'd' 'b'l'e'n'd'i'n'g' 'w'h'i't'e',' 'l'i'g'h't' 'g'r'e'e'n',' 'a'n'd' 'l'i'g'h't' 's'a'f'f'r'o'n'.' 'I'n'c'l'u'd'e' 'p'l'a'c'e'h'o'l'd'e'r' 'g'r'a'p'h'i'c' 'e'l'e'm'e'n't's':' 'a' 'd'a'r'k' 'b'l'u'e' 'r'i'b'b'o'n' 'f'o'r' 't'h'e' 'p'o's'i't'i'o'n' 't'i't'l'e',' 'l'a'r'g'e' 'b'o'l'd' '3'D' 'r'e'd' 't'e'x't' 'w'i't'h' 'w'h'i't'e' 'o'u't'l'i'n'e's' 't'h'a't' 's'a'y's' '&'q'u'o't';'Y'O'U'R' 'N'A'M'E' 'H'E'R'E'&'q'u'o't';',' 'c'i'r'c'u'l'a'r' 'g'r'a'p'h'i'c' 'b'a'd'g'e's' 'w'i't'h' 'g'o'l'd' 'b'o'r'd'e'r's' 'o'n' 't'h'e' 't'o'p' 'c'o'r'n'e'r's',' 'a'n'd' 'a' 's't'r'u'c't'u'r'e'd' 'w'h'i't'e' 'b'o'x' 'a't' 't'h'e' 'b'o't't'o'm' 'l'e'f't' 'w'i't'h' 's'm'a'l'l' 'b'u'l'l'e't' 'p'o'i'n't' 'i'c'o'n's' 'f'o'r' 'a' 'm'a'n'i'f'e's't'o'.' 'U'l't'r'a'-'d'e't'a'i'l'e'd',' 'p'h'o't'o'r'e'a'l'i's't'i'c',' 'p'r'o'f'e's's'i'o'n'a'l' 'a'd'v'e'r't'i's'i'n'g' 's't'y'l'e',' '8'k' 'r'e's'o'l'u't'i'o'n'.'",
  },
  {
    id: 'ansar-banner-2',
    title: "Corporate Conference Banner",
    category: 'Banners',
    description: "Photorealistic, professional event and campaign banner layout with prominent typography and lighting.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Banner", "Event", "Campaign", "Poster"],
    promptTemplate: "'o'p' 'B'a'r' '('D'e'e'p' 'G'r'e'e'n')':' 'A' 's'o'l'i'd' 'd'e'e'p' 'g'r'e'e'n' 'r'e'c't'a'n'g'u'l'a'r' 'h'e'a'd'e'r' 's't'r'i'p' 'r'u'n'n'i'n'g' 'a'c'r'o's's' 't'h'e' 't'o'p'.' 'I'n's'i'd'e',' 'i'n' 'b'o'l'd',' 'c'l'e'a'r',' 'w'h'i't'e' 'D'e'v'a'n'a'g'a'r'i' 's'c'r'i'p't' '('P'o'p'p'i'n's' 'o'r' 's'i'm'i'l'a'r' 'p'r'o'f'e's's'i'o'n'a'l' 'f'o'n't')',' 'i's' 't'h'e' 't'e'x't':' '&'q'u'o't';'\u091c'\u0928'\u092a'\u0926' '\u092a'\u0902'\u091a'\u093e'\u092f'\u0924' '['\u0909'\u092a'\u092f'\u094b'\u0917'\u0915'\u0930'\u094d'\u0924'\u093e'-'\u092a'\u0930'\u093f'\u092d'\u093e'\u0937'\u093f'\u0924' '\u0938'\u094d'\u0925'\u093e'\u0928']' '\u0915'\u0947' '\u0915'\u094d'\u0937'\u0947'\u0924'\u094d'\u0930' '\u0915'\u094d'\u0930'.' '['\u0909'\u092a'\u092f'\u094b'\u0917'\u0915'\u0930'\u094d'\u0924'\u093e'-'\u092a'\u0930'\u093f'\u092d'\u093e'\u0937'\u093f'\u0924' '\u0915'\u094d'\u0937'\u0947'\u0924'\u094d'\u0930' '\u0938'\u0902'\u0916'\u094d'\u092f'\u093e']' '\u0938'\u0947'&'q'u'o't';'.'\r'\n'\r'\n'M'a'i'n' 'B'o'd'y' '('L'i'g'h't' 'G'r'e'e'n' 't'o' 'W'h'i't'e' 'G'r'a'd'i'e'n't')':' 'T'h'e' 'c'e'n't'r'a'l' 'a'r'e'a' 'i's' 'a' 'l'i'g'h't' 'g'r'e'e'n' 't'o' 's'o'f't' 'w'h'i't'e' 'v'e'r't'i'c'a'l' 'g'r'a'd'i'e'n't'.'\r'\n'\r'\n'F'o'o't'e'r' '('D'e'e'p' 'M'a'r'o'o'n'/'B'u'r'g'u'n'd'y')':' 'A' 's'o'l'i'd' 'm'a'r'o'o'n'/'b'u'r'g'u'n'd'y' 'f'o'o't'e'r' 's't'r'i'p' 'a't' 't'h'e' 'b'o't't'o'm'.'\r'\n'\r'\n'M'a'i'n' 'B'o'd'y' 'C'o'n't'e'n't':'\r'\n'\r'\n'P'o's't' 'T'i't'l'e':' 'C'e'n't'e'r'e'd' 'b'e'l'o'w' 't'h'e' 'T'o'p' 'B'a'r',' 't'h'e' 'l'a'r'g'e',' 'b'o'l'd',' 'p'u'r'p'l'e'/'b'l'u'e' 't'i't'l'e' 'w'i't'h' 'a' 'w'h'i't'e' 'o'u't'l'i'n'e' 'i'n' 'D'e'v'a'n'a'g'a'r'i' 's'c'r'i'p't' 'r'e'a'd's':' '&'q'u'o't';'['\u0909'\u092a'\u092f'\u094b'\u0917'\u0915'\u0930'\u094d'\u0924'\u093e'-'\u092a'\u0930'\u093f'\u092d'\u093e'\u0937'\u093f'\u0924' '\u092a'\u0926']'&'q'u'o't';'.' '('F'o'r' 'e'x'a'm'p'l'e',' '&'#'0'3'9';'\u091c'\u0928'\u092a'\u0926' '\u0938'\u0926'\u0938'\u094d'\u092f'&'#'0'3'9';')'.'\r'\n'\r'\n'C'a'n'd'i'd'a'c'y' 'T'e'x't' '('O'p't'i'o'n'a'l')':' 'B'e'l'o'w' 't'h'e' 't'i't'l'e',' 's'm'a'l'l'e'r' 'd'e'e'p' 'p'u'r'p'l'e' 't'e'x't' 'r'e'a'd's':' '&'q'u'o't';'\u092a'\u0926' '\u0939'\u0947'\u0924'\u0941' '\u092f'\u094b'\u0917'\u094d'\u092f',' '\u0936'\u093f'\u0915'\u094d'\u0937'\u093f'\u0924' '\u090f'\u0935'\u0902' '\u0915'\u0930'\u094d'\u092e'\u0920' '\u092a'\u094d'\u0930'\u0924'\u094d'\u092f'\u093e'\u0936'\u0940'&'q'u'o't';'.'\r'\n'\r'\n'C'a'n'd'i'd'a't'e' 'N'a'm'e':' 'L'a'r'g'e',' 'p'r'o'm'i'n'e'n't',' 'b'o'l'd' 'm'a'r'o'o'n'-'p'i'n'k' 'D'e'v'a'n'a'g'a'r'i' 't'e'x't' 'c'e'n't'e'r'e'd' 'b'e'l'o'w' 't'h'e' 'c'a'n'd'i'd'a'c'y' 't'e'x't' 'r'e'a'd's':' '&'q'u'o't';'['\u0909'\u092a'\u092f'\u094b'\u0917'\u0915'\u0930'\u094d'\u0924'\u093e'-'\u092a'\u0930'\u093f'\u092d'\u093e'\u0937'\u093f'\u0924' '\u0909'\u092e'\u094d'\u092e'\u0940'\u0926'\u0935'\u093e'\u0930' '\u0915'\u093e' '\u0928'\u093e'\u092e']'&'q'u'o't';'.' '('F'o'r' 'e'x'a'm'p'l'e',' '&'#'0'3'9';'\u0917'\u093e'\u092f'\u0924'\u094d'\u0930'\u0940' '\u0915'\u0936'\u094d'\u092f'\u092a'&'#'0'3'9';')'.'\r'\n'\r'\n'C'a'n'd'i'd'a't'e' 'P'h'o't'o' '('R'i'g'h't' 'S'i'd'e')':' 'T'h'e' 'r'i'g'h't' 'h'a'l'f' 'o'f' 't'h'e' 'm'a'i'n' 'b'o'd'y' 'f'e'a't'u'r'e's' 'a' 'h'i'g'h'-'q'u'a'l'i't'y',' 'p'r'o'f'e's's'i'o'n'a'l' 'p'h'o't'o'g'r'a'p'h' 'o'f' 't'h'e' 'u's'e'r'&'#'0'3'9';'s' 'u'p'l'o'a'd'e'd' 'c'a'n'd'i'd'a't'e'.' 'T'h'e' 'c'a'n'd'i'd'a't'e' 'i's' 'a' 's'm'i'l'i'n'g' 'p'e'r's'o'n',' 'i'n' 't'h'i's' 'c'a's'e',' 'a' 'w'o'm'a'n' 'i'n' 'a' 'd'e'e'p' 'm'a'r'o'o'n'-'p'a't't'e'r'n'e'd' 's'a'r'e'e' 'w'i't'h' 'r'e'd' 'a'n'd' 'g'r'e'e'n' 'e'l'e'm'e'n't's',' 's't'a'n'd'i'n'g' 'w'i't'h' 'h'a'n'd's' 'j'o'i'n'e'd' 'i'n' 'a' 't'r'a'd'i't'i'o'n'a'l' '&'#'0'3'9';'N'a'm'a's't'e'&'#'0'3'9';' 'g'r'e'e't'i'n'g'.' 'H'e'r' 'j'e'w'e'l'r'y' '('g'o'l'd' 'n'e'c'k'l'a'c'e' 'a'n'd' 's't'a'c'k'e'd' 'b'a'n'g'l'e's')' 'i's' 'c'l'e'a'r' 'a'n'd' 'p'r'o'f'e's's'i'o'n'a'l'.'\r'\n'\r'\n'E'l'e'c't'i'o'n' 'S'y'm'b'o'l' '('L'e'f't' 'S'i'd'e')':' 'O'p'p'o's'i't'e' 't'h'e' 'c'a'n'd'i'd'a't'e' 'p'h'o't'o',' 'c'e'n't'e'r'e'd' 'o'n' 't'h'e' 'l'e'f't' 'h'a'l'f',' 'i's' 'a' 'd'e't'a'i'l'e'd' 'm'o'n'o'c'h'r'o'm'e' '('b'l'a'c'k' 'a'n'd' 'w'h'i't'e')' 'i'l'l'u's't'r'a't'i'o'n' 'o'f' 't'h'e' 'u's'e'r'&'#'0'3'9';'s' 'u'p'l'o'a'd'e'd' 'e'l'e'c't'i'o'n' 's'y'm'b'o'l'.' 'F'o'r' 'e'x'a'm'p'l'e',' 'a' 'd'e't'a'i'l'e'd' 'i'l'l'u's't'r'a't'i'o'n' 'o'f' 'a' 'f'u'l'l',' 'm'a't'u'r'e' 'B'a'n'y'a'n' 't'r'e'e' 'w'i't'h' 'a'l'l' 'i't's' 'r'o'o't's' 'a'n'd' 'l'e'a'v'e's'.' 'B'e'l'o'w' 't'h'i's' 'i'l'l'u's't'r'a't'i'o'n',' 'i'n' 'd'e'e'p' 'g'r'e'e'n' 's'c'r'i'p't',' 't'e'x't' 'r'e'a'd's':' '&'q'u'o't';'\u0915'\u094b' '['\u0909'\u092a'\u092f'\u094b'\u0917'\u0915'\u0930'\u094d'\u0924'\u093e' '\u0915'\u0947' '\u091a'\u0941'\u0928'\u093e'\u0935' '\u091a'\u093f'\u0928'\u094d'\u0939' '\u0915'\u093e' '\u0928'\u093e'\u092e']' '\u091b'\u093e'\u092a' '\u092a'\u0930' '\u092e'\u0941'\u0939'\u0930' '\u0932'\u0917'\u093e'\u0915'\u0930' '\u092d'\u093e'\u0930'\u0940' '\u092e'\u0924'\u094b'\u0902' '\u0938'\u0947' '\u0935'\u093f'\u091c'\u092f'\u0940' '\u092c'\u0928'\u093e'\u0935'\u0947'\u0902'&'q'u'o't';'.' 'T'h'e' 'n'a'm'e' '('e'.'g'.',' '&'#'0'3'9';'\u092c'\u0930'\u0917'\u0926' '\u0915'\u093e' '\u092a'\u0947'\u0921'\u093c'&'#'0'3'9';')' 'i's' 'd'y'n'a'm'i'c' 'b'a's'e'd' 'o'n' 't'h'e' 'u'p'l'o'a'd'e'd' 's'y'm'b'o'l'.'\r'\n'\r'\n'F'o'o't'e'r' 'C'o'n't'e'n't':'\r'\n'\r'\n'W'h'i't'e' 'B'o'x' '('T'o'p' 'F'o'o't'e'r')':' 'I'n's'i'd'e' 't'h'e' 'm'a'r'o'o'n' 'f'o'o't'e'r' 'i's' 'a' 'c'e'n't'r'a'l' 'w'h'i't'e' 'r'e'c't'a'n'g'u'l'a'r' 'b'o'x'.' 'I'n's'i'd'e' 't'h'i's' 'b'o'x':'\r'\n'\r'\n'H'e'a'd'e'r':' 'B'o'l'd',' 'd'a'r'k' 'm'a'r'o'o'n' 't'e'x't':' '&'q'u'o't';'\u092e'\u0924'\u0926'\u093e'\u0928' '\u0924'\u093f'\u0925'\u093f'&'q'u'o't';'.'\r'\n'\r'\n'D'e't'a'i'l's':' 'T'e'x't' 'b'e'l'o'w' 'i'n' 'r'e'd' '('f'o'r' 't'h'e' 'd'a't'e')' 'a'n'd' 'b'l'a'c'k' '('f'o'r' 't'h'e' 't'i'm'e')' 'r'e'a'd's':' '&'q'u'o't';'\u0926'\u093f'\u0928'\u093e'\u0902'\u0915' '['\u0909'\u092a'\u092f'\u094b'\u0917'\u0915'\u0930'\u094d'\u0924'\u093e'-'\u092a'\u0930'\u093f'\u092d'\u093e'\u0937'\u093f'\u0924' '\u0924'\u093e'\u0930'\u0940'\u0916']' '('['\u0909'\u092a'\u092f'\u094b'\u0917'\u0915'\u0930'\u094d'\u0924'\u093e'-'\u092a'\u0930'\u093f'\u092d'\u093e'\u0937'\u093f'\u0924' '\u0938'\u092e'\u092f']' '\u0924'\u0915')'&'q'u'o't';'.' '('F'o'r' 'e'x'a'm'p'l'e',' '&'#'0'3'9';'1'9'/'0'2'/'2'0'2'5' '('\u0938'\u0941'\u092c'\u0939' '7' '\u092c'\u091c'\u0947' '\u0938'\u0947' '\u0936'\u093e'\u092e' '5' '\u092c'\u091c'\u0947' '\u0924'\u0915')'&'#'0'3'9';')'.'\r'\n'\r'\n'L'o'w'e'r' 'F'o'o't'e'r' 'T'e'x't':' 'B'e'l'o'w' 't'h'e' 'w'h'i't'e' 'b'o'x',' 'w'h'i't'e' 'D'e'v'a'n'a'g'a'r'i' 's'c'r'i'p't' 'r'e'a'd's':' '&'q'u'o't';'\u0935'\u093f'\u0928'\u0940'\u0924' '-' '\u0938'\u092e'\u0938'\u094d'\u0924' '\u092e'\u0924'\u0926'\u093e'\u0924'\u093e'\u0917'\u0923',' '\u0915'\u094d'\u0937'\u0947'\u0924'\u094d'\u0930' '\u0915'\u094d'\u0930'.' '['\u0909'\u092a'\u092f'\u094b'\u0917'\u0915'\u0930'\u094d'\u0924'\u093e'-'\u092a'\u0930'\u093f'\u092d'\u093e'\u0937'\u093f'\u0924' '\u0915'\u094d'\u0937'\u0947'\u0924'\u094d'\u0930' '\u0938'\u0902'\u0916'\u094d'\u092f'\u093e']'&'q'u'o't';'.'",
  },
  {
    id: 'ansar-banner-3',
    title: "High-Resolution Banner Layout #3",
    category: 'Banners',
    description: "Photorealistic, professional event and campaign banner layout with prominent typography and lighting.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Banner", "Event", "Campaign", "Poster"],
    promptTemplate: "'A' 'w'i'd'e' 'h'o'r'i'z'o'n't'a'l' 'A'4' 'l'a'n'd's'c'a'p'e' 'f'o'r'm'a't' 't'r'a'd'i't'i'o'n'a'l' 'I'n'd'i'a'n' 'w'e'd'd'i'n'g' 'i'n'v'i't'a't'i'o'n' 'c'a'r'd' 'f'o'r' 'a' 'g'r'o'o'm'&'#'0'3'9';'s' 'p'o's't'-'w'e'd'd'i'n'g' 'c'e'r'e'm'o'n'y' '('S'a'a'j'a'n' 'C'h'a'l'e' 'S'a's'u'r'a'l')'.' 'O'v'e'r'a'l'l' 'C'o'l'o'r' 'T'h'e'm'e':' '['E'N'T'E'R' 'Y'O'U'R' 'C'O'L'O'R' 'H'E'R'E',' 'e'.'g'.',' 'Y'e'l'l'o'w']'.' 'T'h'e' 'A'I' 'm'u's't' 'a'u't'o'm'a't'i'c'a'l'l'y' 'u's'e' 't'h'i's' 'c'o'l'o'r' 'a's' 't'h'e' 'p'r'i'm'a'r'y' 'b'a'c'k'g'r'o'u'n'd' 'a'n'd' 's'e'l'e'c't' 'a' 'h'i'g'h'l'y' 'v'i's'i'b'l'e',' 'c'o'n't'r'a's't'i'n'g' 't'r'a'd'i't'i'o'n'a'l' 'c'o'l'o'r' '('l'i'k'e' 'r'e'd',' 'g'o'l'd',' 'o'r' 'd'a'r'k' 'b'r'o'w'n')' 'f'o'r' 'a'l'l' 't'h'e' 't'e'x't' 'a'n'd' 'v'e'c't'o'r' 'd'e's'i'g'n's'.'\r'\n'\r'\n'T'h'e' 'e'n't'i'r'e' 'd'e's'i'g'n' 'f'e'a't'u'r'e's' 'a' 't'r'a'd'i't'i'o'n'a'l' 'v'e'c't'o'r' 'i'l'l'u's't'r'a't'i'o'n' 's't'y'l'e'.' 'I't' 'i's' 'f'r'a'm'e'd' 'b'y' 't'w'o' 'd'e'c'o'r'a't'i'v'e' 'b'o'r'd'e'r's';' 't'h'e' 'o'u't'e'r' 'b'o'r'd'e'r' 'i's' 'a' 's'i'm'p'l'e' 'd'o't't'e'd' 'l'i'n'e',' 'a'n'd' 't'h'e' 'i'n'n'e'r' 'b'o'r'd'e'r' 'i's' 'a'n' 'o'r'n'a't'e',' 'f'i'l'i'g'r'e'e' 'd'e's'i'g'n'.' 'A't' 't'h'e' 't'o'p' 'l'e'f't',' 't'h'e'r'e' 'i's' 'a' 'f'l'o'r'a'l' 'a'n'd' 't'a's's'e'l' 'd'e'c'o'r'a't'i'o'n'.' 'T'o' 't'h'e' 'r'i'g'h't' 'o'f' 't'h'a't',' 't'h'e' 't'e'x't' 'i'n' 'H'i'n'd'i' 'r'e'a'd's':' '&'q'u'o't';'\u0938'\u093e'\u091c'\u0928' '\u091a'\u0932'\u0947' '\u0938'\u0938'\u0941'\u0930'\u093e'\u0932'&'q'u'o't';'.' 'F'u'r't'h'e'r' 'r'i'g'h't' 'i's' 'a' 'c'a'l'l'i'g'r'a'p'h'i'c' 'l'o'g'o' 'w'i't'h' 'a' 'c'o'u'p'l'e'&'#'0'3'9';'s' 's'i'l'h'o'u'e't't'e' 'a'n'd' 't'h'e' 'w'o'r'd's' '&'q'u'o't';'\u0936'\u0941'\u092d' '\u0935'\u093f'\u0935'\u093e'\u0939'&'q'u'o't';'.' 'B'e'l'o'w' 't'h'i's' 'l'o'g'o',' 't'h'e' 'd'a't'e' 't'e'x't' 'i'n' 'H'i'n'd'i' 'r'e'a'd's':' '&'q'u'o't';'1'4' '\u092e'\u0908' '2'0'2'3' '\u0926'\u093f'\u0928'-'\u0930'\u0935'\u093f'\u0935'\u093e'\u0930'&'q'u'o't';'.' 'T'h'e' 'c'e'n't'r'a'l' 'c'o'm'p'o's'i't'i'o'n' 'f'e'a't'u'r'e's' 't'w'o' 'l'a'r'g'e',' 'o'r'n'a't'e' 'h'e'a'r't'-'s'h'a'p'e'd' 'f'r'a'm'e's' 'w'i't'h' 'i'n't'r'i'c'a't'e' 'p'a't't'e'r'n's'.' 'T'h'e' 't'o'p'-'l'e'f't' 'h'e'a'r't' 'f'r'a'm'e' 'c'o'n't'a'i'n's' 't'h'e' 'n'a'm'e' '&'q'u'o't';'\u0928'\u0935'\u0928'\u0940'\u0924'&'q'u'o't';' 'i'n' 'a' 'p'r'o'm'i'n'e'n't' 'H'i'n'd'i' 'f'o'n't'.' 'T'h'e' 'b'o't't'o'm'-'r'i'g'h't' 'h'e'a'r't' 'f'r'a'm'e' 'c'o'n't'a'i'n's' 't'h'e' 'n'a'm'e' '&'q'u'o't';'\u0938'\u0941'\u0937'\u092e'\u093e'&'q'u'o't';' 'i'n' 'a' 'm'a't'c'h'i'n'g' 'p'r'o'm'i'n'e'n't' 'H'i'n'd'i' 'f'o'n't'.' 'B'e't'w'e'e'n' 't'h'e' 't'w'o' 'h'e'a'r't's',' 'i'n' 's'm'a'l'l'e'r' 't'e'x't',' 'i's' '&'q'u'o't';'\u0938'\u0902'\u0917'&'q'u'o't';'.' 'I'n' 't'h'e' 'b'o't't'o'm'-'l'e'f't' 'c'o'r'n'e'r',' 't'h'e'r'e' 'i's' 'a' 't'r'a'd'i't'i'o'n'a'l' 'd'e't'a'i'l'e'd' 'v'e'c't'o'r' 'i'l'l'u's't'r'a't'i'o'n' 'o'f' 'a' 'S'o'u't'h' 'A's'i'a'n' 'c'o'u'p'l'e' 'i'n' 'w'e'd'd'i'n'g' 'a't't'i'r'e'.' 'I'n' 't'h'e' 'b'o't't'o'm'-'r'i'g'h't' 'c'o'r'n'e'r',' 't'h'e'r'e' 'i's' 'a' 's'm'a'l'l' 'v'e'c't'o'r' 'i'l'l'u's't'r'a't'i'o'n' 'o'f' 'a' 'p'e'n' 'w'i't'h' 'a' 'p'e'a'c'o'c'k' 'f'e'a't'h'e'r' 'a'n'd' 't'h'e' 't'e'x't' '&'q'u'o't';'\u0930'\u093e'\u0939'\u0941'\u0932' '\u092a'\u094d'\u0930'\u093f'\u0902'\u091f'\u093f'\u0902'\u0917' '\u092a'\u094d'\u0930'\u0947'\u0938' '\u0915'\u091a'\u0928'\u093e'\u0935'\u093e'\u0901'&'q'u'o't';'.' 'A't' 't'h'e' 'v'e'r'y' 'b'o't't'o'm' 'c'e'n't'e'r',' 't'h'e' 'l'o'c'a't'i'o'n' 't'e'x't' 'i'n' 'H'i'n'd'i' 'r'e'a'd's':' '&'q'u'o't';'\u092c'\u0924'\u0940'\u0938'\u092a'\u0941'\u0930' '\u0938'\u0947' '\u092c'\u093e'\u0932'\u093e'\u0935'\u093f'\u0917'\u0939'\u093e' '\u092c'\u093e'\u091c'\u093e'\u0930' '('\u0916'\u0928'\u0947'\u091f'\u0941')'&'q'u'o't';'.' 'T'h'e' 'o'v'e'r'a'l'l' 's't'y'l'e' 'i's' 'a' 't'r'a'd'i't'i'o'n'a'l',' 'p'r'e'm'i'u'm' 'I'n'd'i'a'n' 'i'n'v'i't'a't'i'o'n' 'c'a'r'd',' 'p'e'r'f'e'c't'l'y' 'f'i'l'l'i'n'g' 'a'n' 'A'4' 'l'a'n'd's'c'a'p'e' 'c'a'n'v'a's' '('a's'p'e'c't' 'r'a't'i'o' '3':'2' 'o'r' '2'9'7':'2'1'0')'.'",
  },
  {
    id: 'ansar-invitation-1',
    title: "Royal Festive Pooja Invitation Card",
    category: 'Invitations',
    description: "Rich traditional luxury invitation card with ornate gold borders, festive motifs, and royal typography.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Wedding Card", "Invitation", "Ceremony", "Royal"],
    promptTemplate: "'C'r'e'a't'e' 'a' 'p'r'e'm'i'u'm' 'r'o'y'a'l' 'H'i'n'd'u' 'i'n'v'i't'a't'i'o'n' 'c'a'r'd' 'f'o'r' '\u201c'V'i's'h'w'a'k'a'r'm'a' 'P'u'j'a'\u201d' 'i'n' 'a' 'u'n'i'q'u'e' 'r'e'd',' 'g'o'l'd'e'n' 'a'n'd' 'c'r'e'a'm' 't'h'e'm'e'.' 'U's'e' 'a'n' 'e'l'e'g'a'n't' 't'e'm'p'l'e'-'s't'y'l'e' 'd'e'c'o'r'a't'i'v'e' 'f'r'a'm'e',' 'g'o'l'd'e'n' 'o'r'n'a'm'e'n't's',' 'm'a'r'i'g'o'l'd' 'f'l'o'w'e'r's',' 'd'i'y'a's',' 'k'a'l'a's'h' 'a'n'd' 'a' 'b'e'a'u't'i'f'u'l' 'd'i'v'i'n'e' 'i'm'a'g'e' 'o'f' 'L'o'r'd' 'V'i's'h'w'a'k'a'r'm'a' 'w'i't'h' 't'r'a'd'i't'i'o'n'a'l' 't'o'o'l's'.' 'A'd'd' 's't'y'l'i's'h' 'H'i'n'd'i' 't'y'p'o'g'r'a'p'h'y' 'w'i't'h' '\u201c'|'|' '\u0906'\u092e'\u0902'\u0924'\u094d'\u0930'\u0923' '|'|'\u201d' 'a'n'd' 'l'a'r'g'e' 'h'e'a'd'i'n'g' '\u201c'\u0935'\u093f'\u0936'\u094d'\u0935'\u0915'\u0930'\u094d'\u092e'\u093e' '\u092a'\u0942'\u091c'\u093e' '\u092e'\u0947'\u0902' '\u092a'\u0927'\u093e'\u0930'\u0947'\u0902'\u201d'.' 'I'n'c'l'u'd'e' '\u201c'1'7' '\u0938'\u093f'\u0924'\u0902'\u092c'\u0930'\u201d',' '\u201c'\u0938'\u094d'\u0925'\u093e'\u0928':' '['Y'O'U'R' 'L'O'C'A'T'I'O'N']'\u201d',' '\u201c'\u0938'\u092e'\u092f':' '['Y'O'U'R' 'T'I'M'E']'\u201d',' 'a'n'd' '\u201c'\u0906'\u092e'\u0902'\u0924'\u094d'\u0930'\u0915':' '['Y'O'U'R' 'N'A'M'E']'\u201d'.' 'M'a'k'e' 't'h'e' 'd'e's'i'g'n' 'l'u'x'u'r'i'o'u's',' 'd'e'v'o't'i'o'n'a'l',' 'c'o'l'o'r'f'u'l',' 'c'l'e'a'n',' 'b'a'l'a'n'c'e'd' 'a'n'd' 'h'i'g'h'l'y' 'd'e't'a'i'l'e'd',' 'l'i'k'e' 'a' 'p'r'o'f'e's's'i'o'n'a'l'l'y' 'd'e's'i'g'n'e'd' 'I'n'd'i'a'n' 'f'e's't'i'v'a'l' 'i'n'v'i't'a't'i'o'n' 'c'a'r'd'.'",
  },
  {
    id: 'ansar-invitation-2',
    title: "Traditional Floral Wedding Card",
    category: 'Invitations',
    description: "Rich traditional luxury invitation card with ornate gold borders, festive motifs, and royal typography.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Wedding Card", "Invitation", "Ceremony", "Royal"],
    promptTemplate: "'C'r'e'a't'e' 'a' 'p'r'e'm'i'u'm',' 'c'o'l'o'r'f'u'l' 'a'n'd' 'e'l'e'g'a'n't' 'H'i'n'd'u' 'i'n'v'i't'a't'i'o'n' 'c'a'r'd' 'f'o'r' '\u201c'V'i's'h'w'a'k'a'r'm'a' 'P'u'j'a'\u201d',' 'i'n' 'a' 't'r'a'd'i't'i'o'n'a'l' 'r'e'd',' 'g'o'l'd',' 'y'e'l'l'o'w' 'a'n'd' 'c'r'e'a'm' 'f'e's't'i'v'e' 'd'e's'i'g'n'.' 'A'd'd' 'L'o'r'd' 'V'i's'h'w'a'k'a'r'm'a' 'w'i't'h' 's'a'c'r'e'd' 't'o'o'l's',' 'm'a'r'i'g'o'l'd' 'f'l'o'w'e'r's',' 'd'i'y'a's',' 'k'a'l'a's'h',' 'd'e'c'o'r'a't'i'v'e' 'b'o'r'd'e'r's' 'a'n'd' 'b'e'a'u't'i'f'u'l' 'I'n'd'i'a'n' 'o'r'n'a'm'e'n't's'.' 'U's'e' 'e'l'e'g'a'n't' 'H'i'n'd'i' 't'y'p'o'g'r'a'p'h'y' 'w'i't'h' 't'h'e' 'm'a'i'n' 'h'e'a'd'i'n'g' '\u201c'|'|' '\u0906'\u092e'\u0902'\u0924'\u094d'\u0930'\u0923' '|'|'\u201d' 'a'n'd' '\u201c'\u0935'\u093f'\u0936'\u094d'\u0935'\u0915'\u0930'\u094d'\u092e'\u093e' '\u092a'\u0942'\u091c'\u093e' '\u092e'\u0947'\u0902' '\u092a'\u0927'\u093e'\u0930'\u0947'\u0902'\u201d'.' 'I'n'c'l'u'd'e':' '\u201c'1'7' '\u0938'\u093f'\u0924'\u092e'\u094d'\u092c'\u0930'\u201d',' '\u201c'\u0938'\u094d'\u0925'\u093e'\u0928':' '['Y'O'U'R' 'L'O'C'A'T'I'O'N']'\u201d',' '\u201c'\u0938'\u092e'\u092f':' '['Y'O'U'R' 'T'I'M'E']'\u201d' 'a'n'd' 'a' 'w'a'r'm' 'i'n'v'i't'a't'i'o'n' 'm'e's's'a'g'e'.' 'M'a'k'e' 'i't' 'd'e'v'o't'i'o'n'a'l',' 'p'r'e'm'i'u'm',' 'c'l'e'a'n',' 'h'i'g'h'l'y' 'd'e't'a'i'l'e'd' 'a'n'd' 'p'r'i'n't'-'r'e'a'd'y',' 'w'i't'h' 'b'a'l'a'n'c'e'd' 's'p'a'c'i'n'g' 'a'n'd' 'p'r'o'f'e's's'i'o'n'a'l' 'i'n'v'i't'a't'i'o'n'-'c'a'r'd' 'd'e's'i'g'n'.'",
  },
  {
    id: 'ansar-invitation-3',
    title: "Golden Luxury Invitation Card",
    category: 'Invitations',
    description: "Rich traditional luxury invitation card with ornate gold borders, festive motifs, and royal typography.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Wedding Card", "Invitation", "Ceremony", "Royal"],
    promptTemplate: "'C'r'e'a't'e' 'a' 'p'r'e'm'i'u'm',' 'c'o'l'o'r'f'u'l' 'a'n'd' 'e'l'e'g'a'n't' 'H'i'n'd'u' 'i'n'v'i't'a't'i'o'n' 'c'a'r'd' 'f'o'r' '\u201c'V'i's'h'w'a'k'a'r'm'a' 'P'u'j'a'\u201d',' 'i'n' 'a' 't'r'a'd'i't'i'o'n'a'l' 'r'e'd',' 'g'o'l'd',' 'y'e'l'l'o'w' 'a'n'd' 'c'r'e'a'm' 'f'e's't'i'v'e' 'd'e's'i'g'n'.' 'A'd'd' 'L'o'r'd' 'V'i's'h'w'a'k'a'r'm'a' 'w'i't'h' 's'a'c'r'e'd' 't'o'o'l's',' 'm'a'r'i'g'o'l'd' 'f'l'o'w'e'r's',' 'd'i'y'a's',' 'k'a'l'a's'h',' 'd'e'c'o'r'a't'i'v'e' 'b'o'r'd'e'r's' 'a'n'd' 'b'e'a'u't'i'f'u'l' 'I'n'd'i'a'n' 'o'r'n'a'm'e'n't's'.' 'U's'e' 'e'l'e'g'a'n't' 'H'i'n'd'i' 't'y'p'o'g'r'a'p'h'y' 'w'i't'h' 't'h'e' 'm'a'i'n' 'h'e'a'd'i'n'g' '\u201c'|'|' '\u0906'\u092e'\u0902'\u0924'\u094d'\u0930'\u0923' '|'|'\u201d' 'a'n'd' '\u201c'\u0935'\u093f'\u0936'\u094d'\u0935'\u0915'\u0930'\u094d'\u092e'\u093e' '\u092a'\u0942'\u091c'\u093e' '\u092e'\u0947'\u0902' '\u092a'\u0927'\u093e'\u0930'\u0947'\u0902'\u201d'.' 'I'n'c'l'u'd'e':' '\u201c'1'7' '\u0938'\u093f'\u0924'\u0902'\u092c'\u0930'\u201d',' '\u201c'\u0938'\u094d'\u0925'\u093e'\u0928':' '['Y'O'U'R' 'L'O'C'A'T'I'O'N']'\u201d',' '\u201c'\u0938'\u092e'\u092f':' '['Y'O'U'R' 'T'I'M'E']'\u201d' 'a'n'd' 'a' 'w'a'r'm' 'i'n'v'i't'a't'i'o'n' 'm'e's's'a'g'e'.' 'M'a'k'e' 'i't' 'd'e'v'o't'i'o'n'a'l',' 'p'r'e'm'i'u'm',' 'c'l'e'a'n',' 'h'i'g'h'l'y' 'd'e't'a'i'l'e'd' 'a'n'd' 'p'r'i'n't'-'r'e'a'd'y',' 'w'i't'h' 'b'a'l'a'n'c'e'd' 's'p'a'c'i'n'g' 'a'n'd' 'p'r'o'f'e's's'i'o'n'a'l' 'i'n'v'i't'a't'i'o'n'-'c'a'r'd' 'd'e's'i'g'n'.'",
  },
  {
    id: 'ansar-invitation-4',
    title: "Royal Cultural Invitation #4",
    category: 'Invitations',
    description: "Rich traditional luxury invitation card with ornate gold borders, festive motifs, and royal typography.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Wedding Card", "Invitation", "Ceremony", "Royal"],
    promptTemplate: "'C'r'e'a't'e' 'a' 'p'r'e'm'i'u'm',' 'c'o'l'o'r'f'u'l' 'a'n'd' 'e'l'e'g'a'n't' 'H'i'n'd'u' 'i'n'v'i't'a't'i'o'n' 'c'a'r'd' 'f'o'r' '\u201c'V'i's'h'w'a'k'a'r'm'a' 'P'u'j'a'\u201d',' 'i'n' 'a' 't'r'a'd'i't'i'o'n'a'l' 'r'e'd',' 'g'o'l'd',' 'y'e'l'l'o'w' 'a'n'd' 'c'r'e'a'm' 'f'e's't'i'v'e' 'd'e's'i'g'n'.' 'A'd'd' 'L'o'r'd' 'V'i's'h'w'a'k'a'r'm'a' 'w'i't'h' 's'a'c'r'e'd' 't'o'o'l's',' 'm'a'r'i'g'o'l'd' 'f'l'o'w'e'r's',' 'd'i'y'a's',' 'k'a'l'a's'h',' 'd'e'c'o'r'a't'i'v'e' 'b'o'r'd'e'r's' 'a'n'd' 'b'e'a'u't'i'f'u'l' 'I'n'd'i'a'n' 'o'r'n'a'm'e'n't's'.' 'U's'e' 'e'l'e'g'a'n't' 'H'i'n'd'i' 't'y'p'o'g'r'a'p'h'y' 'w'i't'h' 't'h'e' 'm'a'i'n' 'h'e'a'd'i'n'g' '\u201c'|'|' '\u0906'\u092e'\u0902'\u0924'\u094d'\u0930'\u0923' '|'|'\u201d' 'a'n'd' '\u201c'\u0935'\u093f'\u0936'\u094d'\u0935'\u0915'\u0930'\u094d'\u092e'\u093e' '\u092a'\u0942'\u091c'\u093e' '\u092e'\u0947'\u0902' '\u092a'\u0927'\u093e'\u0930'\u0947'\u0902'\u201d'.' 'I'n'c'l'u'd'e':' '\u201c'1'7' '\u0938'\u093f'\u0924'\u092e'\u094d'\u092c'\u0930'\u201d',' '\u201c'\u0938'\u094d'\u0925'\u093e'\u0928':' '['Y'O'U'R' 'L'O'C'A'T'I'O'N']'\u201d',' '\u201c'\u0938'\u092e'\u092f':' '['Y'O'U'R' 'T'I'M'E']'\u201d' 'a'n'd' 'a' 'w'a'r'm' 'i'n'v'i't'a't'i'o'n' 'm'e's's'a'g'e'.' 'M'a'k'e' 'i't' 'd'e'v'o't'i'o'n'a'l',' 'p'r'e'm'i'u'm',' 'c'l'e'a'n',' 'h'i'g'h'l'y' 'd'e't'a'i'l'e'd' 'a'n'd' 'p'r'i'n't'-'r'e'a'd'y',' 'w'i't'h' 'b'a'l'a'n'c'e'd' 's'p'a'c'i'n'g' 'a'n'd' 'p'r'o'f'e's's'i'o'n'a'l' 'i'n'v'i't'a't'i'o'n'-'c'a'r'd' 'd'e's'i'g'n'.'",
  },
  {
    id: 'ansar-invitation-5',
    title: "Royal Cultural Invitation #5",
    category: 'Invitations',
    description: "Rich traditional luxury invitation card with ornate gold borders, festive motifs, and royal typography.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Wedding Card", "Invitation", "Ceremony", "Royal"],
    promptTemplate: "'D'e's'i'g'n' 'a' 'm'i'n'i'm'a'l'i's't',' 'e'l'e'g'a'n't' 'w'e'd'd'i'n'g' 'i'n'v'i't'a't'i'o'n' 'c'a'r'd' 'w'i't'h' 'a' 'w'h'i't'e' 't'e'x't'u'r'e'd' 'c'a'r'd's't'o'c'k' 'b'a'c'k'g'r'o'u'n'd' 'a'n'd' 'd'e'l'i'c'a't'e' 'w'a't'e'r'c'o'l'o'r' 'e'u'c'a'l'y'p't'u's' 'l'e'a'v'e's' 'f'r'a'm'i'n'g' 't'h'e' 'b'o'r'd'e'r'.'\r'\n'U's'e' 'm'o'd'e'r'n' 'c'a'l'l'i'g'r'a'p'h'y' 'f'o'r' 't'h'e' 'n'a'm'e's' 'R'a'n'a' '&'a'm'p';' 'A'h'm'e'd',' 'p'a'i'r'e'd' 'w'i't'h' 'r'e'f'i'n'e'd' 's'e'r'i'f' 't'y'p'o'g'r'a'p'h'y' 'f'o'r' 't'h'e' 'e'v'e'n't' 'd'e't'a'i'l's'.'\r'\n'C'r'e'a't'e' 'a' 'l'u'x'u'r'i'o'u's',' 'c'o'l'o'r'f'u'l',' 'a'n'd' 'e't'h'e'r'e'a'l' 'a'e's't'h'e't'i'c' 'w'i't'h' 'h'i'g'h'-'r'e's'o'l'u't'i'o'n' 'w'a't'e'r'c'o'l'o'r' 't'e'x't'u'r'e's',' 's'o'f't' 'g'o'l'd' 'a'c'c'e'n't's',' 'a'n'd' 'a' 'v'e'r't'i'c'a'l' 'l'a'y'o'u't'.'\r'\n'W'e'd'd'i'n'g' 'D'a't'e':' '1'0'-'1'2'-'2'0'2'6'",
  },
  {
    id: 'ansar-invitation-6',
    title: "Royal Cultural Invitation #6",
    category: 'Invitations',
    description: "Rich traditional luxury invitation card with ornate gold borders, festive motifs, and royal typography.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Wedding Card", "Invitation", "Ceremony", "Royal"],
    promptTemplate: "'D'e's'i'g'n' 'a' 'm'i'n'i'm'a'l'i's't',' 'e'l'e'g'a'n't' 'w'e'd'd'i'n'g' 'i'n'v'i't'a't'i'o'n' 'c'a'r'd' 'w'i't'h' 'a' 'w'h'i't'e' 't'e'x't'u'r'e'd' 'c'a'r'd's't'o'c'k' 'b'a'c'k'g'r'o'u'n'd' 'a'n'd' 'd'e'l'i'c'a't'e' 'w'a't'e'r'c'o'l'o'r' 'e'u'c'a'l'y'p't'u's' 'l'e'a'v'e's' 'f'r'a'm'i'n'g' 't'h'e' 'b'o'r'd'e'r'.'\r'\n'U's'e' 'm'o'd'e'r'n' 'c'a'l'l'i'g'r'a'p'h'y' 'f'o'r' 't'h'e' 'n'a'm'e's' 'R'a'n'a' '&'a'm'p';' 'A'h'm'e'd',' 'p'a'i'r'e'd' 'w'i't'h' 'r'e'f'i'n'e'd' 's'e'r'i'f' 't'y'p'o'g'r'a'p'h'y' 'f'o'r' 't'h'e' 'e'v'e'n't' 'd'e't'a'i'l's'.'\r'\n'C'r'e'a't'e' 'a' 'l'u'x'u'r'i'o'u's',' 'c'o'l'o'r'f'u'l',' 'a'n'd' 'e't'h'e'r'e'a'l' 'a'e's't'h'e't'i'c' 'w'i't'h' 'h'i'g'h'-'r'e's'o'l'u't'i'o'n' 'w'a't'e'r'c'o'l'o'r' 't'e'x't'u'r'e's',' 's'o'f't' 'g'o'l'd' 'a'c'c'e'n't's',' 'a'n'd' 'a' 'v'e'r't'i'c'a'l' 'l'a'y'o'u't'.'\r'\n'W'e'd'd'i'n'g' 'D'a't'e':' '1'0'-'1'2'-'2'0'2'6'",
  },
  {
    id: 'ansar-image-1',
    title: "Vibrant Festive Marigold Portrait",
    category: 'Visuals',
    description: "Ultra-realistic 4K DSLR portrait with natural lighting, traditional aesthetic, and depth of field.",
    targetModels: ["Midjourney", "Flux", "Gemini"],
    tags: ["Portrait", "DSLR", "Festive", "Cinematic"],
    promptTemplate: "'C'r'e'a't' 'a'-'r'e'a'l'i's't'i'c',' '4'k' 'i'm'a'g'e' 'w'i't'h' 's'o'f't' 'b'l'u'r' 'b'a'c'k'g'r'o'u'n'd' 'a'n'd' 'v'i'b'r'a'n't' 'f'e's't'i'v'e' 'd'e'c'o'r'a't'i'o'n's' 'l'i'k'e' 'm'a'r'i'g'o'l'd' 'a'n'd' 'r'o's'e's'.' 'N'i'g'h't' 's'c'e'n'e' 'w'i't'h' 'w'a'r'm' 'l'i'g'h't'i'n'g' 'h'i'g'h'l'i'g'h't'i'n'g' 't'e'x't'u'r'e's' 'a'n'd' 'c'r'e'a't'i'n'g' 'a' 'g'l'o'w'i'n'g' 'a't'm'o's'p'h'e'r'e'.' 'I'n' 't'h'e' 'c'e'n't'e'r',' 'a' 's't'y'l'i's'h' 'y'o'u'n'g' 'I'n'd'i'a'n' 'm'a'n' 'w'i't'h' 'H'e' 'w'e'a'r's' 'a' 'w'h'i't'e' 'k'u'r't'a' 'w'i't'h' 'f'l'o'r'a'l',' 'w'i't'h' 'm'i'n'i'm'a'l' 'a'c'c'e's's'o'r'i'e's' 'l'i'k'e' 'a' 's'i'l'v'e'r' 'b'r'a'c'e'l'e't' 'a'n'd' 's'u'b't'l'e' 'e'a'r'r'i'n'g's'.' 'H'e' 'h'a's' 'a' 's'o'f't' 's'm'i'l'e' 'a'n'd' 'e'l'e'g'a'n't' 'p'o's'e'.' 'T'h'e' 'b'a'c'k'g'r'o'u'n'd' 'f'e'a't'u'r'e's' 'a' 'g'r'a'n'd' 'G'o'd'd'e's's' 'D'u'r'g'a' 'i'd'o'l' 'd'e'c'o'r'a't'e'd' 'w'i't'h' 'f'l'o'w'e'r's',' 'l'a'm'p's',' 'a'n'd' 's'o'f't' 'g'l'o'w'i'n'g' 'l'i'g'h't's',' 'e'n'h'a'n'c'i'n'g' 't'h'e' 'f'e's't'i'v'e' 'a'n'd' 's'p'i'r'i't'u'a'l' 'f'e'e'l'.'&'q'u'o't';'",
  },
  {
    id: 'ansar-image-2',
    title: "Traditional Festive DSLR Portrait",
    category: 'Visuals',
    description: "Ultra-realistic 4K DSLR portrait with natural lighting, traditional aesthetic, and depth of field.",
    targetModels: ["Midjourney", "Flux", "Gemini"],
    tags: ["Portrait", "DSLR", "Festive", "Cinematic"],
    promptTemplate: "'C'r'e'a't' 'a'-'r'e'a'l'i's't'i'c',' '4'k' 'i'm'a'g'e' 'w'i't'h' 's'o'f't' 'b'l'u'r' 'b'a'c'k'g'r'o'u'n'd' 'a'n'd' 'v'i'b'r'a'n't' 'f'e's't'i'v'e' 'd'e'c'o'r'a't'i'o'n's' 'l'i'k'e' 'm'a'r'i'g'o'l'd' 'a'n'd' 'r'o's'e's'.' 'N'i'g'h't' 's'c'e'n'e' 'w'i't'h' 'w'a'r'm' 'l'i'g'h't'i'n'g' 'h'i'g'h'l'i'g'h't'i'n'g' 't'e'x't'u'r'e's' 'a'n'd' 'c'r'e'a't'i'n'g' 'a' 'g'l'o'w'i'n'g' 'a't'm'o's'p'h'e'r'e'.' 'I'n' 't'h'e' 'c'e'n't'e'r',' 'a' 's't'y'l'i's'h' 'y'o'u'n'g' 'I'n'd'i'a'n' 'm'a'n' 'w'i't'h' 'H'e' 'w'e'a'r's' 'a' 'w'h'i't'e' 'k'u'r't'a' 'w'i't'h' 'f'l'o'r'a'l',' 'w'i't'h' 'm'i'n'i'm'a'l' 'a'c'c'e's's'o'r'i'e's' 'l'i'k'e' 'a' 's'i'l'v'e'r' 'b'r'a'c'e'l'e't' 'a'n'd' 's'u'b't'l'e' 'e'a'r'r'i'n'g's'.' 'H'e' 'h'a's' 'a' 's'o'f't' 's'm'i'l'e' 'a'n'd' 'e'l'e'g'a'n't' 'p'o's'e'.' 'T'h'e' 'b'a'c'k'g'r'o'u'n'd' 'f'e'a't'u'r'e's' 'a' 'g'r'a'n'd' 'G'o'd'd'e's's' 'D'u'r'g'a' 'i'd'o'l' 'd'e'c'o'r'a't'e'd' 'w'i't'h' 'f'l'o'w'e'r's',' 'l'a'm'p's',' 'a'n'd' 's'o'f't' 'g'l'o'w'i'n'g' 'l'i'g'h't's',' 'e'n'h'a'n'c'i'n'g' 't'h'e' 'f'e's't'i'v'e' 'a'n'd' 's'p'i'r'i't'u'a'l' 'f'e'e'l'.'",
  },
  {
    id: 'ansar-image-3',
    title: "Outdoor Mountain Travel Shoot",
    category: 'Visuals',
    description: "Ultra-realistic 4K DSLR portrait with natural lighting, traditional aesthetic, and depth of field.",
    targetModels: ["Midjourney", "Flux", "Gemini"],
    tags: ["Portrait", "DSLR", "Festive", "Cinematic"],
    promptTemplate: "'U'l't'r'a'-'r'e'a'l'i's't'i'c' 'c'i'n'e'm'a't'i'c' 'h'a'l'f'-'b'o'd'y' 'p'o'r't'r'a'i't' 'o'f' 'a' 's't'y'l'i's'h' '2'3'-'y'e'a'r'-'o'l'd' 's't'i'm' 'm'a'n' '('h'e'i'g'h't' '5'&'#'0'3'9';'5'&'q'u'o't';')',' 'w'i't'h' 't'h'e' 's'a'm'e' 'o'r'i'g'i'n'a'l' 'f'a'c'e' 'a'n'd' 'p'e'r'f'e'c't'l'y' 's'e't' 'h'a'i'r's't'y'l'e' 'a's' 'i'n' 't'h'e' 'r'e'f'e'r'e'n'c'e'.' 'H'e' 'i's' 'w'e'a'r'i'n'g' 'a' 'v'i'b'r'a'n't' 'r'e'd' 'a'n'd' 'b'l'a'c'k' 't'r'a'd'i't'i'o'n'a'l' 'd'a'n'd'i'y'a' 'o'u't'f'i't' 'd'e'c'o'r'a't'e'd' 'w'i't'h' 'i'n't'r'i'c'a't'e' 'm'i'r'r'o'r' 'w'o'r'k' 'a'n'd' 'g'o'l'd'e'n' 'e'm'b'r'o'i'd'e'r'y',' 'p'a'i'r'e'd' 'w'i't'h' 'm'a't'c'h'i'n'g' 'd'a'n'd'i'y'a' 's'h'o'e's' 'a'n'd' 'a' 's'l'e'e'k' 'w'r'i's't'w'a't'c'h'.' 'T'h'e' 'm'a'n' 'i's' 'l'e'a'n'i'n'g' 'c'a's'u'a'l'l'y' 'a'g'a'i'n's't' 'a' 'b'e'a'u't'i'f'u'l'l'y' 'd'e'c'o'r'a't'e'd' 'p'i'l'l'a'r' 'w'r'a'p'p'e'd' 'i'n' 'g'l'o'w'i'n'g' 'f'e's't'i'v'e' 'l'i'g'h't's'.' 'O'n'e' 'h'a'n'd' 'r'e's't's' 'i'n' 'h'i's' 'p'o'c'k'e't' 'w'h'i'l'e' 't'h'e' 'o't'h'e'r' 'h'a'n'd' 'l'o'o's'e'l'y' 'h'o'l'd's' 't'h'e' 'd'a'n'd'i'y'a' 's't'i'c'k's' 'a't' 'h'i's' 's'i'd'e'.' 'H'i's' 'c'o'n'f'i'd'e'n't' 'g'a'z'e' 'i's' 'd'i'r'e'c't'e'd' 't'o'w'a'r'd' 't'h'e' 'c'a'm'e'r'a' 'w'i't'h' 'a' 's'u'b't'l'e' 's't'y'l'i's'h' 's'm'i'l'e'.' 'B'a'c'k'g'r'o'u'n'd':' 'a' 'l'i'v'e'l'y' 'd'a'n'd'i'y'a' 'n'i'g'h't' 'f'i'l'l'e'd' 'w'i't'h' 'c'o'l'o'r'f'u'l' 'l'i'g'h't's',' 'b'l'u'r'r'e'd' 's'i'l'h'o'u'e't't'e's' 'o'f' 'd'a'n'c'e'r's',' 'a'n'd' 'a' 'g'l'a'm'o'r'o'u's' 'N'a'v'r'a't'r'i' 'c'e'l'e'b'r'a't'i'o'n' 'a'm'b'i'a'n'c'e'.'",
  },
  {
    id: 'ansar-image-4',
    title: "1980s Retro Bollywood Cinematic Shoot",
    category: 'Visuals',
    description: "Ultra-realistic 4K DSLR portrait with natural lighting, traditional aesthetic, and depth of field.",
    targetModels: ["Midjourney", "Flux", "Gemini"],
    tags: ["Portrait", "DSLR", "Festive", "Cinematic"],
    promptTemplate: "'U'l't'r'a' 'r'e'a'l'i's't'i'c' '8'K' 'v'i'b'r'a'n't' 'f'e's't'i'v'e' 'n'i'g'h't' 's'c'e'n'e',' 'y'o'u'n'g' 'm'a'n' '('s'a'm'e' 'a's' 'u'p'l'o'a'd'e'd' 'p'h'o't'o' 'a'n'd' 'd'o'n'&'#'0'3'9';'t' 'c'h'a'n'g'e' 'h'a'i'r's't'y'l'e' 'a'n'd' 'f'a'c'i'a'l' 'e'x'p'r'e's's'i'o'n's')' 's't'a'n'd'i'n'g' 'i'n' 't'r'a'd'i't'i'o'n'a'l' 'n'a'v'r'a't'r'i' 's'p'e'c'i'a'l' 'b'l'a'c'k' 'k'u'r't'a' 'w'i't'h' 'c'o'l'o'r'f'u'l' 'G'u'j'a'r'a't'i' 'b'a'n'd'h'a'n'i' 'd'u'p'a't't'o',' 's't'y'l'i's'h' 's'u'n'g'l'a's's'e's',' 'h'o'l'd'i'n'g' 'a' 'd'a'n'd'i'y'a' 's't'i'c'k',' 'c'o'n'f'i'd'e'n't' 'p'o's'e'.' 'B'a'c'k'g'r'o'u'n'd' 'f'i'l'l'e'd' 'w'i't'h' 'b'r'i'g'h't' 'm'u'l't'i'c'o'l'o'r' 'f'l'a'g's',' 'f'a'i'r'y' 'l'i'g'h't's',' 'f'e's't'i'v'e' 'c'r'o'w'd',' 'd'r'a'm'a't'i'c' 'd'e'p't'h' 'o'f' 'f'i'e'l'd' 'c'i'n'e'm'a't'i'c' 'l'i'g'h't'i'n'g',' 'h'y'p'e'r' 'd'e't'a'i'l'e'd' 't'e'x't'u'r'e's',' 's'h'a'r'p' 't'o'c'u's'.'",
  },
  {
    id: 'ansar-image-5',
    title: "DSLR Portrait Shoot #5",
    category: 'Visuals',
    description: "Ultra-realistic 4K DSLR portrait with natural lighting, traditional aesthetic, and depth of field.",
    targetModels: ["Midjourney", "Flux", "Gemini"],
    tags: ["Portrait", "DSLR", "Festive", "Cinematic"],
    promptTemplate: "'A' 'c'o'l'l'a'g'e' 'o'f' 't'h'r'e'e' 'd'i'f'f'e'r'e'n't' 'p'h'o't'o's' 's'h'o'w'i'n'g' 'a' 'y'o'u'n'g' 'I'n'd'i'a'n' 'w'o'm'a'n' 'p'o's'i'n'g' 'i'n' 'a' 'v'i'b'r'a'n't' 't'r'a'd'i't'i'o'n'a'l' 'N'a'v'r'a't'r'i' 'o'u't'f'i't'.' 'S'h'e' 'i's' 'w'e'a'r'i'n'g' 'a' 'b'r'i'g'h't'l'y' 'c'o'l'o'r'e'd',' 'm'u'l't'i'c'o'l'o'r'e'd' 'e'm'b'r'o'i'd'e'r'e'd' 's'l'e'e'v'e'l'e's's' 'c'h'o'l'i' 'b'l'o'u's'e' 'w'i't'h' 'm'i'r'r'o'r' 'w'o'r'k',' 'e'l'e'p'h'a'n't' 'm'o't'i'f's',' 'a'n'd' 'g'e'o'm'e't'r'i'c' 'p'a't't'e'r'n's',' 'p'a'i'r'e'd' 'w'i't'h' 'a' 'b'r'i'g'h't' 'p'i'n'k' 'l'e'h'e'n'g'a' 's'k'i'r't'.' 'T'h'e' 'l'e'h'e'n'g'a' 'f'e'a't'u'r'e's' 'a' 'h'e'a'v'y' 'o'r'n'a't'e' 's'i'l'v'e'r' 'w'a'i's't' 'b'e'l't' '('k'a'm'a'r'b'a'n'd'h')' 'm'a'd'e' 'o'f' 'c'o'i'n's' 'a'n'd' 'c'h'a'i'n's'.' 'S'h'e' 'h'a's' 'd'r'a'p'e'd' 'a' 'c'o'l'o'r'f'u'l' 't'i'e'-'d'y'e' 'd'u'p'a't't'a'.'3':'4' 'r'a't'i'o'",
  },
  {
    id: 'ansar-image-6',
    title: "DSLR Portrait Shoot #6",
    category: 'Visuals',
    description: "Ultra-realistic 4K DSLR portrait with natural lighting, traditional aesthetic, and depth of field.",
    targetModels: ["Midjourney", "Flux", "Gemini"],
    tags: ["Portrait", "DSLR", "Festive", "Cinematic"],
    promptTemplate: "'C'R'E'A'T'E' 'A' 'H'I'G'H'-'R'E'S'O'L'U'T'I'O'N',' 'P'H'O'T'O'R'E'A'L'I'S'T'I'C' 'F'U'L'L'-'B'O'D'Y' 'G'A'R'B'A'/'N'A'V'R'A'T'R'I' 'P'O'R'T'R'A'I'T' 'B'A'S'E'D' 'O'N' 'T'H'E' 'R'E'F'E'R'E'N'C'E' 'I'M'A'G'E'.' 'P'R'E'S'E'R'V'E' 'T'H'E' 'P'E'R'S'O'N'&'#'0'3'9';'S' 'F'A'C'I'A'L' 'F'E'A'T'U'R'E'S',' 'I'D'E'N'T'I'T'Y',' 'N'A'T'U'R'A'L' 'S'K'I'N' 'T'O'N'E',' 'A'N'D' 'P'R'O'P'O'R'T'I'O'N'S'.' 'S'H'E' 'I'S' 'W'E'A'R'I'N'G' 'A' 'B'E'A'U'T'I'F'U'L' 'I'V'O'R'Y'-'W'H'I'T'E' 'G'U'J'A'R'A'T'I' 'L'E'H'E'N'G'A' 'C'H'O'L'I' 'W'I'T'H' 'C'O'L'O'R'F'U'L' 'M'U'L'T'I'C'O'L'O'R' 'M'I'R'R'O'R'-'W'O'R'K' 'E'M'B'R'O'I'D'E'R'Y',' 'F'O'R'A'L' 'M'O'T'I'F'S',' 'I'N'T'R'I'C'A'T'E' 'T'R'A'D'I'T'I'O'N'A'L' 'B'O'R'D'E'R'S',' 'A'N'D' 'A' 'B'R'I'G'H'T' 'M'U'S'T'A'R'D'-'Y'E'L'L'O'W' 'E'M'B'R'O'I'D'E'R'E'D' 'D'U'P'A'T'T'A' 'D'R'A'P'E'D' 'E'L'E'G'A'N'T'L'Y' 'O'V'E'R' 'O'N'E' 'S'H'O'U'L'D'E'R' 'A'D'D' 'M'A'T'C'H'I'N'G'C'O'L'O'R'F'U'L' 'M'I'R'R'O'R'-'W'O'R'K' 'D'E'T'A'I'L'I'N'G' 'O'N' 'T'H'E' 'B'L'O'U'S'E' 'A'N'D' 'L'E'H'E'N'G'A',' 'T'R'A'D'I'T'I'O'N'A'L' 'O'X'I'D'I'Z'E'D'-'S'I'L'V'E'R' 'J'H'U'M'K'A' 'E'A'R'R'I'N'G'S',' 'A' 'S'I'L'V'E'R' 'C'H'O'K'E'R' 'N'E'C'K'L'A'C'E',' 'B'L'A'C'K' 'A'N'D' 'S'I'L'V'E'R' 'B'A'N'G'L'E'S',' 'R'I'N'G'S',' 'A' 'S'M'A'L'L' 'R'E'D' 'B'I'N'D'I',' 'A'N'D' 'A' 'D'E'L'I'C'A'T'E' 'T'R'A'D'I'T'I'O'N'A'L' 'N'O'S'E' 'R'I'N'G',' 'S'T'Y'L'E' 'H'E'R' 'H'A'I'R'I'N' 'L'O'N'G',' 'V'O'L'U'M'I'N'O'U'S' 'S'O'F'T' 'C'U'R'L'S' 'W'I'T'H' 'A' 'P'A'R'T'I'A'L'L'Y' 'B'R'A'I'D'E'D' 'C'R'O'W'N' 'D'E'C'O'R'A'T'E'D' 'W'I'T'H' 'T'I'N'Y' 'W'H'I'T'E' 'F'L'O'W'E'R'S'.' 'S'H'E' 'H'O'L'D'S' 'D'E'C'O'R'A'T'E'D' 'M'U'L'T'I'C'O'L'O'R' 'D'A'N'D'I'Y'A' 'S'T'I'C'K'S' 'I'N' 'A' 'G'R'A'C'E'F'U'L' 'G'A'R'B'A' 'P'O'S'E'.' 'S'E'T' 'T'H'E' 'S'C'E'N'E' 'A'T' 'A' 'V'I'B'R'A'N'T' 'N'I'G'H'T'T'I'M'E' 'N'A'V'R'A'T'R'I' 'G'A'R'B'A' 'C'E'L'E'B'R'A'T'I'O'N' 'W'I'T'H' 'C'O'L'O'R'F'U'L' 'F'A'B'R'I'C' 'D'E'C'O'R'A'T'I'O'N'S',' 'G'L'O'W'I'N'G' 'F'A'I'R'Y' 'L'I'G'H'T'S',' 'W'A'R'M' 'L'A'N'T'E'R'N'S',' 'F'E'S'T'I'V'E' 'B'O'K'E'H',' 'A'N'D' 'S'O'",
  },
  {
    id: 'ansar-template-1',
    title: "Medical Clinic A4 Letterhead Template",
    category: 'Templates',
    description: "Print-ready clean business and medical stationery template with precise margin grids and branding.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Template", "Letterhead", "Print", "Stationery"],
    promptTemplate: "'A' 'p'r'o'f'e's's'i'o'n'a'l' 'A'4' 's'i'z'e' 'm'e'd'i'c'a'l' 'c'l'i'n'i'c' 'l'e't't'e'r'h'e'a'd' 'd'e's'i'g'n' 't'e'm'p'l'a't'e',' 'v'e'r't'i'c'a'l' 'a's'p'e'c't' 'r'a't'i'o' '3':'4',' 'p'u'r'e' 'w'h'i't'e' 'b'a'c'k'g'r'o'u'n'd'.' 'T'h'e' 'd'e's'i'g'n' 'f'e'a't'u'r'e's' 'a' 'd'i's't'i'n'c't'i'v'e' 'b'o'l'd' 'r'e'd' 'b'o'r'd'e'r' 'r'u'n'n'i'n'g' 's'e'a'm'l'e's's'l'y' 'a'l'o'n'g' 't'h'e' 't'o'p',' 'r'i'g'h't',' 'a'n'd' 'b'o't't'o'm' 'e'd'g'e's',' 'w'i't'h' 't'h'e' 'r'i'g'h't'-'s'i'd'e' 'r'e'd' 'b'o'r'd'e'r' 'b'e'i'n'g' 'n'o't'i'c'e'a'b'l'y' 't'h'i'c'k'e'r'.'\r'\n'\r'\n'T'o'p' 'R'i'g'h't' 'C'o'r'n'e'r':' 'S'h'a'r'p',' 'o'v'e'r'l'a'p'p'i'n'g' 'a'n'g'u'l'a'r' 'd'i'a'g'o'n'a'l' 'g'e'o'm'e't'r'i'c' 'b'l'o'c'k's' 'i'n' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e',' 'l'i'g'h't' 'g'r'e'y',' 'a'n'd' 'r'e'd' 'f'r'a'm'i'n'g' 't'h'e' 'c'o'r'n'e'r'.' 'J'u's't' 'b'e'l'o'w' 't'h'e's'e' 'g'r'a'p'h'i'c' 's'h'a'p'e's',' 'a' 's'e'm'i'-'t'r'a'n's'p'a'r'e'n't',' 's'o'f't'l'y' 'f'a'd'e'd' 'p'h'o't'o'g'r'a'p'h' 'o'f' '['D'e's'c'r'i'b'e' 'M'e'd'i'c'a'l' 'S'c'e'n'e',' 'e'.'g'.',' 'a' 'b'l'u'r'r'e'd' 'c'l'o's'e'-'u'p' 'o'f' 'a' 's't'e't'h'o's'c'o'p'e' 'o'n' 'a' 'b'r'i'g'h't' 'w'h'i't'e' 'd'e's'k']' 't'h'a't' 's'e'a'm'l'e's's'l'y' 'f'a'd'e's' 'o'u't' 'i'n't'o' 't'h'e' 'w'h'i't'e' 'b'a'c'k'g'r'o'u'n'd' 'b'e'l'o'w'.'\r'\n'\r'\n'B'o't't'o'm' 'L'e'f't' 'C'o'r'n'e'r':' 'M'a't'c'h'i'n'g' 's'h'a'r'p',' 'o'v'e'r'l'a'p'p'i'n'g' 'a'n'g'u'l'a'r' 'd'i'a'g'o'n'a'l' 'g'e'o'm'e't'r'i'c' 'b'l'o'c'k's' 'i'n' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e',' 'l'i'g'h't' 'g'r'e'y',' 'a'n'd' 'r'e'd' 'f'r'a'm'i'n'g' 't'h'e' 'b'o't't'o'm' 'l'e'f't' 'c'o'r'n'e'r'.'\r'\n'\r'\n'T'o'p' 'L'e'f't' 'H'e'a'd'e'r':' 'I'n' 't'h'e' 't'o'p' 'l'e'f't' 'w'h'i't'e' 'a'r'e'a',' 'a' 'p'l'a'c'e'h'o'l'd'e'r' 'f'o'r' '['E'n't'e'r' 'C'l'i'n'i'c'/'H'o's'p'i't'a'l' 'L'o'g'o' 'H'e'r'e']' 'a'l'o'n'g's'i'd'e' 'b'o'l'd' 'd'a'r'k' 'r'e'd' 't'e'x't' 'r'e'a'd'i'n'g' '&'q'u'o't';'['E'n't'e'r' 'H'o's'p'i't'a'l' 'N'a'm'e' 'H'e'r'e']'&'q'u'o't';'.' 'B'e'l'o'w' 't'h'i's',' 'a'l'i'g'n'e'd' 't'o' 't'h'e' 'l'e'f't',' 'd'a'r'k' 'c'r'i's'p' 't'e'x't' 'r'e'a'd'i'n'g' '&'q'u'o't';'['E'n't'e'r' 'D'o'c't'o'r' 'N'a'm'e' 'H'e'r'e']'&'q'u'o't';',' 'f'o'l'l'o'w'e'd' 'b'y' '&'q'u'o't';'['E'n't'e'r' 'Q'u'a'l'i'f'i'c'a't'i'o'n's' 'a'n'd' 'R'e'g' 'N'o'.']'&'q'u'o't';'.'\r'\n'\r'\n'P'a't'i'e'n't' 'D'e't'a'i'l's':' 'J'u's't' 'b'e'l'o'w' 't'h'e' 'd'o'c't'o'r'&'#'0'3'9';'s' 'd'e't'a'i'l's',' 'a' 'c'l'e'a'n' 'h'o'r'i'z'o'n't'a'l' 'l'a'y'o'u't' 'w'i't'h' 'f'i'l'l'-'i'n'-'t'h'e'-'b'l'a'n'k' 't'e'x't' 'l'i'n'e's' 'r'e'a'd'i'n'g' 'e'x'a'c't'l'y':' '&'q'u'o't';'P'a't'i'e'n't' 'N'a'm'e':' '_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_' 'A'g'e'/'S'e'x':' '_'_'_'_'_'_'_'_' 'D'a't'e':' '_'_'_'_'_'_'_'_'_'&'q'u'o't';'.'\r'\n'\r'\n'C'e'n't'e'r' 'W'a't'e'r'm'a'r'k':' 'I'n' 't'h'e' 'e'x'p'a'n's'i'v'e' 'b'l'a'n'k' 'w'h'i't'e' 'w'r'i't'i'n'g' 's'p'a'c'e' 'i'n' 't'h'e' 'm'i'd'd'l'e' 'o'f' 't'h'e' 'p'a'g'e',' 'a' 'l'a'r'g'e',' 'h'i'g'h'l'y' 't'r'a'n's'p'a'r'e'n't',' 'f'a'i'n't',' 'l'o'w'-'o'p'a'c'i't'y' 'w'a't'e'r'm'a'r'k' 'o'f' '['D'e's'c'r'i'b'e' 'Y'o'u'r' 'W'a't'e'r'm'a'r'k' 'L'o'g'o' 'H'e'r'e',' 'e'.'g'.',' 'a' 's'u'b't'l'e' 'm'e'd'i'c'a'l' 'c'r'o's's' 'o'r' 'h'o's'p'i't'a'l' 'e'm'b'l'e'm']'.'\r'\n'\r'\n'B'o't't'o'm' 'F'o'o't'e'r':' 'A'l'o'n'g' 't'h'e' 'b'o't't'o'm' 'e'd'g'e',' 'r'e's't'i'n'g' 'j'u's't' 'a'b'o'v'e' 't'h'e' 'b'o't't'o'm' 'r'e'd' 'b'o'r'd'e'r',' 't'h'r'e'e' 'h'o'r'i'z'o'n't'a'l'l'y' 'a'l'i'g'n'e'd' 's'e'c't'i'o'n's' 'f'e'a't'u'r'i'n'g' 's'm'a'l'l' 'r'e'd' 'c'i'r'c'u'l'a'r' 'i'c'o'n's' 'a'n'd' 't'e'x't':' 'a' 'p'h'o'n'e' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'P'h'o'n'e' 'N'u'm'b'e'r']'&'q'u'o't';',' 'a'n' 'e'n'v'e'l'o'p'e'/'w'e'b' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'E'm'a'i'l' 'o'r' 'W'e'b's'i't'e']'&'q'u'o't';',' 'a'n'd' 'a' 'l'o'c'a't'i'o'n' 'p'i'n' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'F'u'l'l' 'C'l'i'n'i'c' 'A'd'd'r'e's's' 'H'e'r'e']'&'q'u'o't';'.'\r'\n'\r'\n'O'v'e'r'a'l'l' 'S't'y'l'e':' 'H'i'g'h'-'r'e's'o'l'u't'i'o'n' '8'k',' 'p'h'o't'o'r'e'a'l'i's't'i'c' 'g'r'a'p'h'i'c' 'd'e's'i'g'n',' 'p'r'e'c'i's'e' 't'y'p'o'g'r'a'p'h'y',' 'p'e'r'f'e'c't'l'y' 'a'l'i'g'n'e'd' 'f'o'r' 'a' 'p'r'i'n't'-'r'e'a'd'y' 'm'e'd'i'c'a'l' 'l'a'y'o'u't'.'",
  },
  {
    id: 'ansar-template-2',
    title: "Corporate Business Stationery Template",
    category: 'Templates',
    description: "Print-ready clean business and medical stationery template with precise margin grids and branding.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Template", "Letterhead", "Print", "Stationery"],
    promptTemplate: "'A' 'p'r'o'f'e's's'i'o'n'a'l' 'A'4' 's'i'z'e' 'm'e'd'i'c'a'l' 'c'l'i'n'i'c' 'l'e't't'e'r'h'e'a'd' 'd'e's'i'g'n' 't'e'm'p'l'a't'e',' 'v'e'r't'i'c'a'l' 'a's'p'e'c't' 'r'a't'i'o' '3':'4',' 'p'u'r'e' 'w'h'i't'e' 'b'a'c'k'g'r'o'u'n'd'.' 'T'h'e' 'l'a'y'o'u't' 'f'e'a't'u'r'e's' 's'h'a'r'p' 'a'n'g'u'l'a'r' 'g'e'o'm'e't'r'i'c' 's'h'a'p'e's' 'i'n' 't'e'a'l' 'a'n'd' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e'.'\r'\n'\r'\n'T'o'p' 'H'e'a'd'e'r' 'L'e'f't':' 'A' 's'h'a'r'p' 't'e'a'l' 'a'n'g'u'l'a'r' 's'h'a'p'e' 'a't' 't'h'e' 't'o'p' 'l'e'f't' 'c'o'r'n'e'r',' 'o'v'e'r'l'a'p'p'i'n'g' 'a' 'p'r'o'm'i'n'e'n't' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e' 'h'o'r'i'z'o'n't'a'l' 'g'e'o'm'e't'r'i'c' 'b'a'n'n'e'r'.' 'I'n's'i'd'e' 't'h'i's' 'n'a'v'y' 'b'l'u'e' 'b'a'n'n'e'r',' 'a' 'p'l'a'c'e'h'o'l'd'e'r' 'f'o'r' '['E'n't'e'r' 'C'l'i'n'i'c'/'H'o's'p'i't'a'l' 'L'o'g'o' 'H'e'r'e']'.' 'J'u's't' 'b'e'l'o'w' 't'h'e' 'b'l'u'e' 'b'a'n'n'e'r',' 'o'n' 't'h'e' 'w'h'i't'e' 'b'a'c'k'g'r'o'u'n'd',' 'b'o'l'd' 't'e'a'l' 't'e'x't' 'r'e'a'd'i'n'g' '&'q'u'o't';'['E'n't'e'r' 'D'o'c't'o'r' 'N'a'm'e' 'H'e'r'e']'&'q'u'o't';',' 'f'o'l'l'o'w'e'd' 'b'y' 's'm'a'l'l'e'r' 'd'a'r'k' 't'e'x't' 'f'o'r' '&'q'u'o't';'['E'n't'e'r' 'H'o's'p'i't'a'l' 'N'a'm'e' '&'a'm'p';' 'Q'u'a'l'i'f'i'c'a't'i'o'n's' 'H'e'r'e']'&'q'u'o't';'.'\r'\n'\r'\n'T'o'p' 'H'e'a'd'e'r' 'R'i'g'h't':' 'T'h'e' 't'o'p' 'r'i'g'h't' 'c'o'r'n'e'r' 'f'e'a't'u'r'e's' 'a' 's'o'f't'-'f'a'd'e'd',' 's'e'm'i'-'t'r'a'n's'p'a'r'e'n't' 'p'h'o't'o'g'r'a'p'h'i'c' 'b'a'c'k'g'r'o'u'n'd' 'o'f' '['D'e's'c'r'i'b'e' 'M'e'd'i'c'a'l' 'S'c'e'n'e',' 'e'.'g'.',' 'a' 'b'l'u'r'r'e'd' 'c'l'o's'e'-'u'p' 'o'f' 'a' 's't'e't'h'o's'c'o'p'e' 'o'n' 'a' 'd'e's'k']' 't'h'a't' 's'e'a'm'l'e's's'l'y' 'a'n'd' 's'o'f't'l'y' 'f'a'd'e's' 'o'u't' 'i'n't'o' 't'h'e' 'w'h'i't'e' 'b'a'c'k'g'r'o'u'n'd' 'b'e'l'o'w'.'\r'\n'\r'\n'P'a't'i'e'n't' 'D'e't'a'i'l's':' 'B'e'l'o'w' 't'h'e' 'l'e'f't' 'h'e'a'd'e'r' 's'e'c't'i'o'n',' 't'h'i'n',' 'c'l'e'a'n' 'h'o'r'i'z'o'n't'a'l' 'l'i'n'e's' 'w'i't'h' 'd'a'r'k' 't'e'x't' 'r'e'a'd'i'n'g' 'e'x'a'c't'l'y':' '&'q'u'o't';'P'a't'i'e'n't' 'N'a'm'e':' '_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_' 'A'g'e'/'S'e'x':' '_'_'_'_'_'_'_'_' 'D'a't'e':' '_'_'_'_'_'_'_'_'_'&'q'u'o't';'.'\r'\n'\r'\n'C'e'n't'e'r' 'W'a't'e'r'm'a'r'k':' 'I'n' 't'h'e' 'v'a's't' 'b'l'a'n'k' 'w'h'i't'e' 'w'r'i't'i'n'g' 's'p'a'c'e' 'i'n' 't'h'e' 'm'i'd'd'l'e' 'o'f' 't'h'e' 'p'a'g'e',' 'a' 'l'a'r'g'e',' 'f'a'i'n't',' 'l'o'w'-'o'p'a'c'i't'y',' 'h'i'g'h'l'y' 't'r'a'n's'p'a'r'e'n't' 'w'a't'e'r'm'a'r'k' 'o'f' '['D'e's'c'r'i'b'e' 'Y'o'u'r' 'W'a't'e'r'm'a'r'k' 'L'o'g'o' 'H'e'r'e',' 'e'.'g'.',' 'a' 's'u'b't'l'e' 'm'e'd'i'c'a'l' 'c'r'o's's' 'o'r' 'c'u's't'o'm' 'c'l'i'n'i'c' 'e'm'b'l'e'm']'.'\r'\n'\r'\n'B'o't't'o'm' 'F'o'o't'e'r':' 'T'h'e' 'b'o't't'o'm' 'e'd'g'e' 'f'e'a't'u'r'e's' 'a'n' 'a'n'g'u'l'a'r',' 'o'v'e'r'l'a'p'p'i'n'g' 'g'e'o'm'e't'r'i'c' 'b'o'r'd'e'r' 'i'n' 't'e'a'l' 'a'n'd' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e' 'm'a't'c'h'i'n'g' 't'h'e' 't'o'p' 'd'e's'i'g'n'.' 'J'u's't' 'a'b'o'v'e' 't'h'i's' 'b'o't't'o'm' 'g'r'a'p'h'i'c',' 't'h'r'e'e' 'n'e'a't' 'h'o'r'i'z'o'n't'a'l' 'c'o'l'u'm'n's' 'c'o'n't'a'i'n'i'n'g' 'd'a'r'k' 't'e'a'l' 'i'c'o'n's' 'a'n'd' 't'e'x't':' 'a' 'p'h'o'n'e' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'P'h'o'n'e' 'N'u'm'b'e'r']'&'q'u'o't';',' 'a'n' 'e'n'v'e'l'o'p'e' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'E'm'a'i'l' 'a'n'd' 'W'e'b's'i't'e']'&'q'u'o't';',' 'a'n'd' 'a' 'l'o'c'a't'i'o'n' 'p'i'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'F'u'l'l' 'C'l'i'n'i'c' 'A'd'd'r'e's's' 'H'e'r'e']'&'q'u'o't';'.'\r'\n'\r'\n'S't'y'l'e':' 'H'i'g'h'-'r'e's'o'l'u't'i'o'n' '8'k',' 'p'r'i'n't'-'r'e'a'd'y',' 'm'o'd'e'r'n' 'c'o'r'p'o'r'a't'e' 'm'e'd'i'c'a'l' 'l'a'y'o'u't',' 'c'l'e'a'n' 'v'e'c't'o'r' 's'h'a'p'e's' 'c'o'm'b'i'n'e'd' 'w'i't'h' 'a' 'p'h'o't'o'r'e'a'l'i's't'i'c' 't'o'p'-'r'i'g'h't' 'i'm'a'g'e' 'f'a'd'e'.'",
  },
  {
    id: 'ansar-template-3',
    title: "Digital Print Template #3",
    category: 'Templates',
    description: "Print-ready clean business and medical stationery template with precise margin grids and branding.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Template", "Letterhead", "Print", "Stationery"],
    promptTemplate: "'A' 'p'r'o'f'e's's'i'o'n'a'l' 'A'4' 's'i'z'e' 'm'e'd'i'c'a'l' 'c'l'i'n'i'c' 'l'e't't'e'r'h'e'a'd' 'd'e's'i'g'n' 't'e'm'p'l'a't'e',' 'v'e'r't'i'c'a'l' 'a's'p'e'c't' 'r'a't'i'o' '3':'4',' 'c'r'i's'p' 'f'l'a't' 'v'e'c't'o'r' 'g'r'a'p'h'i'c',' 'p'u'r'e' 'w'h'i't'e' 'b'a'c'k'g'r'o'u'n'd',' 'u't'i'l'i'z'i'n'g' 'a' 's't'y'l'i's'h' 'r'u's't'-'o'r'a'n'g'e' 'a'n'd' 'l'i'g'h't' 'g'r'e'y' 'c'o'l'o'r' 'p'a'l'e't't'e'.'\r'\n'\r'\n'T'o'p' 'H'e'a'd'e'r' 'D'e's'i'g'n':' 'A' 's'm'o'o't'h',' 's'w'e'e'p'i'n'g' 'r'u's't'-'o'r'a'n'g'e' 'c'u'r'v'e'd' 'b'a'n'd' 's'p'a'n'n'i'n'g' 'a'c'r'o's's' 't'h'e' 't'o'p' 'e'd'g'e',' 's'l'i'g'h't'l'y' 'o'v'e'r'l'a'p'p'i'n'g' 'a' 't'h'i'n'n'e'r' 'l'i'g'h't'-'g'r'e'y' 'c'u'r'v'e'd' 'b'a'n'd' 'r'i'g'h't' 'b'e'n'e'a't'h' 'i't'.'\r'\n'\r'\n'H'e'a'd'e'r' 'T'e'x't':' 'B'e'l'o'w' 't'h'e' 't'o'p' 'c'u'r'v'e's',' 'p'o's'i't'i'o'n'e'd' 'c'l'e'a'r'l'y',' 'a' 'p'r'o'm'i'n'e'n't' 'p'l'a'c'e'h'o'l'd'e'r' 'f'o'r' '['E'n't'e'r' 'C'l'i'n'i'c'/'H'o's'p'i't'a'l' 'L'o'g'o' 'H'e'r'e']' 'a'l'o'n'g's'i'd'e' 'b'o'l'd' 'r'u's't'-'o'r'a'n'g'e' 't'e'x't' 'r'e'a'd'i'n'g' '&'q'u'o't';'['E'n't'e'r' 'C'l'i'n'i'c' 'N'a'm'e' 'H'e'r'e']'&'q'u'o't';'.' 'J'u's't' 'b'e'l'o'w' 't'h'i's',' 'd'a'r'k' 'g'r'e'y' 't'e'x't' 'r'e'a'd'i'n'g':' '&'q'u'o't';'['E'n't'e'r' 'D'o'c't'o'r' 'N'a'm'e' 'H'e'r'e']'&'q'u'o't';',' 'f'o'l'l'o'w'e'd' 'b'y' 's'm'a'l'l'e'r' 't'e'x't' 'f'o'r' '&'q'u'o't';'['E'n't'e'r' 'Q'u'a'l'i'f'i'c'a't'i'o'n's' 'a'n'd' 'R'e'g' 'N'o'.']'&'q'u'o't';'.'\r'\n'\r'\n'P'a't'i'e'n't' 'D'e't'a'i'l's':' 'J'u's't' 'b'e'l'o'w' 't'h'e' 'd'o'c't'o'r'&'#'0'3'9';'s' 'd'e't'a'i'l's',' 'a' 'c'l'e'a'n' 'h'o'r'i'z'o'n't'a'l' 'l'a'y'o'u't' 'w'i't'h' 'f'i'l'l'-'i'n'-'t'h'e'-'b'l'a'n'k' 't'e'x't' 'l'i'n'e's' 'r'e'a'd'i'n'g' 'e'x'a'c't'l'y':' '&'q'u'o't';'P'a't'i'e'n't' 'N'a'm'e':' '_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_' 'A'g'e'/'S'e'x':' '_'_'_'_'_'_'_'_' 'D'a't'e':' '_'_'_'_'_'_'_'_'_'&'q'u'o't';'.'\r'\n'\r'\n'C'e'n't'e'r' 'W'a't'e'r'm'a'r'k':' 'I'n' 't'h'e' 'v'a's't' 'b'l'a'n'k' 'w'h'i't'e' 'w'r'i't'i'n'g' 's'p'a'c'e' 'i'n' 't'h'e' 'm'i'd'd'l'e' 'o'f' 't'h'e' 'p'a'g'e',' 'a' 'l'a'r'g'e',' 'h'i'g'h'l'y' 't'r'a'n's'p'a'r'e'n't',' 'f'a'i'n't',' 'l'o'w'-'o'p'a'c'i't'y' 'w'a't'e'r'm'a'r'k' 'o'f' '['D'e's'c'r'i'b'e' 'Y'o'u'r' 'W'a't'e'r'm'a'r'k' 'L'o'g'o' 'H'e'r'e',' 'e'.'g'.',' 'a' 'm'e'd'i'c'a'l' 'c'r'o's's' 'o'r' 'c'u's't'o'm' 'c'l'i'n'i'c' 'e'm'b'l'e'm']'.'\r'\n'\r'\n'B'o't't'o'm' 'F'o'o't'e'r' 'D'e's'i'g'n':' 'A' 's'o'l'i'd' 'r'u's't'-'o'r'a'n'g'e' 'h'o'r'i'z'o'n't'a'l' 'r'e'c't'a'n'g'u'l'a'r' 'b'a'r' 's'p'a'n's' 't'h'e' 'v'e'r'y' 'b'o't't'o'm' 'e'd'g'e' 'o'f' 't'h'e' 'p'a'g'e'.' 'J'u's't' 'a'b'o'v'e' 't'h'i's' 'b'o't't'o'm' 'b'a'r',' 'o'n' 't'h'e' 'r'i'g'h't' 's'i'd'e',' 'a' 's't'y'l'i's'h' '3'D'-'s't'y'l'e' 's't'y'l'i'z'e'd' 'g'r'a'p'h'i'c' 'o'f' 'a' '['D'e's'c'r'i'b'e' 'G'r'a'p'h'i'c',' 'e'.'g'.',' 'm'o'd'e'r'n' 'h'o's'p'i't'a'l' 'b'u'i'l'd'i'n'g' 'o'r' 'm'e'd'i'c'a'l' 's'y'm'b'o'l']' 'i'n' 's'u'b't'l'e' 'r'u's't'-'o'r'a'n'g'e' 'a'n'd' 'l'i'g'h't' 'p'i'n'k'i's'h'-'b'r'o'w'n' 't'o'n'e's' 't'o' 'm'a't'c'h' 't'h'e' 'o'r'i'g'i'n'a'l' 'd'e's'i'g'n' 'a'e's't'h'e't'i'c'.'\r'\n'\r'\n'F'o'o't'e'r' 'T'e'x't':' 'O'n' 't'h'e' 'l'e'f't' 's'i'd'e',' 'j'u's't' 'a'b'o'v'e' 't'h'e' 'b'o't't'o'm' 'b'a'r',' 'v'e'r't'i'c'a'l'l'y' 's't'a'c'k'e'd' 'c'o'n't'a'c't' 'd'e't'a'i'l's' 'f'e'a't'u'r'i'n'g' 's'm'a'l'l' 'c'i'r'c'u'l'a'r' 'r'u's't'-'o'r'a'n'g'e' 'i'c'o'n's':' 'a' 'l'o'c'a't'i'o'n' 'p'i'n' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'F'u'l'l' 'C'l'i'n'i'c' 'A'd'd'r'e's's' 'H'e'r'e']'&'q'u'o't';',' 'a'n' 'e'n'v'e'l'o'p'e'/'w'e'b' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'E'm'a'i'l' 'o'r' 'W'e'b's'i't'e']'&'q'u'o't';',' 'a'n'd' 'a' 'p'h'o'n'e' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'P'h'o'n'e' 'N'u'm'b'e'r']'&'q'u'o't';'.'\r'\n'\r'\n'O'v'e'r'a'l'l' 'S't'y'l'e':' 'H'i'g'h'-'r'e's'o'l'u't'i'o'n' '8'k',' 'p'r'e'c'i's'e' 't'y'p'o'g'r'a'p'h'y',' 'p'e'r'f'e'c't'l'y' 'a'l'i'g'n'e'd' 'f'o'r' 'a' 'p'r'i'n't'-'r'e'a'd'y' 'm'e'd'i'c'a'l' 'l'a'y'o'u't'.'",
  },
  {
    id: 'ansar-template-4',
    title: "Digital Print Template #4",
    category: 'Templates',
    description: "Print-ready clean business and medical stationery template with precise margin grids and branding.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Template", "Letterhead", "Print", "Stationery"],
    promptTemplate: "'A' 'p'r'o'f'e's's'i'o'n'a'l' 'A'4' 's'i'z'e' 'm'e'd'i'c'a'l' 'c'l'i'n'i'c' 'l'e't't'e'r'h'e'a'd' 'd'e's'i'g'n' 't'e'm'p'l'a't'e',' 'v'e'r't'i'c'a'l' 'a's'p'e'c't' 'r'a't'i'o' '3':'4',' 'c'r'i's'p' 'f'l'a't' 'v'e'c't'o'r' 'g'r'a'p'h'i'c',' 'p'u'r'e' 'w'h'i't'e' 'b'a'c'k'g'r'o'u'n'd'.'\r'\n'\r'\n'T'o'p' 'H'e'a'd'e'r' 'D'e's'i'g'n':' 'T'h'e' 't'o'p' 'e'd'g'e' 'f'e'a't'u'r'e's' 'a' 'm'o'd'e'r'n' 'a'b's't'r'a'c't' 'g'e'o'm'e't'r'i'c' 'p'a't't'e'r'n' 'o'f' 'o'v'e'r'l'a'p'p'i'n'g' 'h'o'r'i'z'o'n't'a'l' 'r'e'c't'a'n'g'u'l'a'r' 'b'a'r's' 'a'n'd' 'd'y'n'a'm'i'c' 's't'r'i'p'e's' 'i'n' 'v'a'r'i'o'u's' 's'h'a'd'e's' 'o'f' 'l'i'g'h't' 'b'l'u'e',' 'b'r'i'g'h't' 'b'l'u'e',' 'a'n'd' 'd'a'r'k' 'n'a'v'y' 'b'l'u'e'.'\r'\n'\r'\n'H'e'a'd'e'r' 'T'e'x't':' 'B'e'l'o'w' 't'h'e' 't'o'p' 'b'l'u'e' 'p'a't't'e'r'n',' 'o'n' 't'h'e' 'l'e'f't' 's'i'd'e',' 'a' 'p'r'o'm'i'n'e'n't' 'p'l'a'c'e'h'o'l'd'e'r' 'f'o'r' '['E'n't'e'r' 'C'l'i'n'i'c'/'H'o's'p'i't'a'l' 'L'o'g'o' 'H'e'r'e']' 'n'e'x't' 't'o' 'b'o'l'd' 'b'l'u'e' 't'e'x't' 'r'e'a'd'i'n'g' '&'q'u'o't';'['E'n't'e'r' 'C'l'i'n'i'c' 'N'a'm'e' 'H'e'r'e']'&'q'u'o't';'.' 'B'e'l'o'w' 't'h'i's',' 'a' 'l'e'f't'-'a'l'i'g'n'e'd' 't'e'x't' 'b'l'o'c'k' 'i'n' 'd'a'r'k' 'f'o'n't' 'r'e'a'd'i'n'g':' '&'q'u'o't';'['E'n't'e'r' 'D'o'c't'o'r' 'N'a'm'e' 'H'e'r'e']'&'q'u'o't';',' 'f'o'l'l'o'w'e'd' 'b'y' '&'q'u'o't';'['E'n't'e'r' 'Q'u'a'l'i'f'i'c'a't'i'o'n's' 'a'n'd' 'D'e's'i'g'n'a't'i'o'n']'&'q'u'o't';'.'\r'\n'\r'\n'P'a't'i'e'n't' 'D'e't'a'i'l's':' 'J'u's't' 'b'e'l'o'w' 't'h'e' 'd'o'c't'o'r'&'#'0'3'9';'s' 'd'e't'a'i'l's',' 'a' 'c'l'e'a'n' 'h'o'r'i'z'o'n't'a'l' 'l'a'y'o'u't' 'w'i't'h' 'f'i'l'l'-'i'n'-'t'h'e'-'b'l'a'n'k' 't'e'x't' 'l'i'n'e's' 'r'e'a'd'i'n'g' 'e'x'a'c't'l'y':' '&'q'u'o't';'P'a't'i'e'n't' 'N'a'm'e':' '_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_'_' 'A'g'e'/'S'e'x':' '_'_'_'_'_'_'_'_' 'D'a't'e':' '_'_'_'_'_'_'_'_'_'&'q'u'o't';'.'\r'\n'\r'\n'C'e'n't'e'r' 'W'a't'e'r'm'a'r'k':' 'I'n' 't'h'e' 'v'a's't' 'b'l'a'n'k' 'w'h'i't'e' 'w'r'i't'i'n'g' 's'p'a'c'e' 'i'n' 't'h'e' 'm'i'd'd'l'e' 'o'f' 't'h'e' 'p'a'g'e',' 'a' 'l'a'r'g'e',' 'h'i'g'h'l'y' 't'r'a'n's'p'a'r'e'n't',' 'f'a'i'n't',' 'l'o'w'-'o'p'a'c'i't'y' 'w'a't'e'r'm'a'r'k' 'o'f' '['D'e's'c'r'i'b'e' 'Y'o'u'r' 'W'a't'e'r'm'a'r'k' 'L'o'g'o' 'H'e'r'e',' 'e'.'g'.',' 'a' 'm'e'd'i'c'a'l' 'c'r'o's's' 'o'r' 'c'u's't'o'm' 'c'l'i'n'i'c' 'e'm'b'l'e'm']'.'\r'\n'\r'\n'B'o't't'o'm' 'F'o'o't'e'r' 'D'e's'i'g'n':' 'T'h'e' 'b'o't't'o'm' 'o'f' 't'h'e' 'p'a'g'e' 'f'e'a't'u'r'e's' 'a' 'c'o'n't'i'n'u'o'u's' 's'o'l'i'd' 'b'l'u'e' 's'i'l'h'o'u'e't't'e' 'o'f' 'a' 'm'o'd'e'r'n' 'c'i't'y' 's'k'y'l'i'n'e' 's'p'a'n'n'i'n'g' 't'h'e' 'e'n't'i'r'e' 'w'i'd't'h'.' 'D'i'r'e'c't'l'y' 'b'e'l'o'w' 't'h'e' 'c'i't'y' 's'k'y'l'i'n'e' 'i's' 'a' 's'o'l'i'd' 'b'l'u'e' 'r'e'c't'a'n'g'u'l'a'r' 'f'o'o't'e'r' 'b'a'n'd' 'a't' 't'h'e' 'v'e'r'y' 'b'o't't'o'm' 'e'd'g'e'.'\r'\n'\r'\n'F'o'o't'e'r' 'T'e'x't':' 'I'n's'i'd'e' 't'h'e' 'b'o't't'o'm' 's'o'l'i'd' 'b'l'u'e' 'b'a'n'd',' 'c'r'i's'p' 'w'h'i't'e' 'i'c'o'n's' 'a'n'd' 't'e'x't' 'a'r'e' 'a'r'r'a'n'g'e'd' 'h'o'r'i'z'o'n't'a'l'l'y' 'f'o'r' 'c'o'n't'a'c't' 'i'n'f'o':' 'a' 'p'h'o'n'e' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'P'h'o'n'e' 'N'u'm'b'e'r']'&'q'u'o't';',' 'a' 'm'a'i'l'/'g'l'o'b'e' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'E'm'a'i'l' 'o'r' 'W'e'b's'i't'e']'&'q'u'o't';',' 'a'n'd' 'a' 'l'o'c'a't'i'o'n' 'p'i'n' 'i'c'o'n' 'w'i't'h' '&'q'u'o't';'['E'n't'e'r' 'F'u'l'l' 'C'l'i'n'i'c' 'A'd'd'r'e's's' 'H'e'r'e']'&'q'u'o't';'.'\r'\n'\r'\n'O'v'e'r'a'l'l' 'S't'y'l'e':' 'H'i'g'h'-'r'e's'o'l'u't'i'o'n',' 'p'r'e'c'i's'e' 't'y'p'o'g'r'a'p'h'y',' 'p'e'r'f'e'c't'l'y' 'a'l'i'g'n'e'd' 'f'o'r' 'a' 'p'r'i'n't'-'r'e'a'd'y' 'm'e'd'i'c'a'l' 'l'a'y'o'u't'.'",
  },
  {
    id: 'ansar-logo-1',
    title: "3D Mascot & Character Brand Logo",
    category: 'Logos',
    description: "Modern commercial logo design with bold vector lines, vibrant gradients, and distinctive mascot silhouette.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Logo", "Branding", "Mascot", "Vector"],
    promptTemplate: "'U's'e' 't'h'e' 'u'p'l'o'a'd'e'd' 'p'h'o't'o' 'a's' 't'h'e' 'm'a'i'n' 's'u'b'j'e'c't'.' 'R'e'p'l'a'c'e' 't'h'e' 'c'a'r't'o'o'n' 'g'i'r'l' 'c'o'm'p'l'e't'e'l'y' 'w'i't'h' 't'h'e' 'u'p'l'o'a'd'e'd' 'p'e'r's'o'n'&'#'0'3'9';'s' 'f'a'c'e' 'a'n'd' 'a'p'p'e'a'r'a'n'c'e' 'w'h'i'l'e' 'm'a'i'n't'a'i'n'i'n'g' 'm'a'x'i'm'u'm' 'f'a'c'i'a'l' 'r'e's'e'm'b'l'a'n'c'e',' 'h'a'i'r's't'y'l'e',' 's'k'i'n' 't'o'n'e',' 'a'n'd' 'i'd'e'n't'i't'y'.' 'C'r'e'a't'e' 'a' 'p'r'o'f'e's's'i'o'n'a'l' '3'D' 'g'r'a'p'h'i'c' 'd'e's'i'g'n'e'r' 'w'o'r'k's'p'a'c'e' 'i'n's'i'd'e' 'a' 'c'i'r'c'u'l'a'r' 'b'a'd'g'e' 'l'o'g'o'.' 'T'h'e' 'p'e'r's'o'n' 'i's' 's'i't't'i'n'g' 'a't' 'a' 'm'o'd'e'r'n' 'd'e's'k' 'u's'i'n'g' 'a' 'l'a'p't'o'p',' 's'u'r'r'o'u'n'd'e'd' 'b'y' 'g'l'o'w'i'n'g' 'd'e's'i'g'n' 's'o'f't'w'a'r'e' 'i'c'o'n's' 's'u'c'h' 'a's' 'P'h'o't'o's'h'o'p',' 'I'l'l'u's't'r'a't'o'r',' 'I'n'D'e's'i'g'n',' 'F'i'g'm'a',' 'C'o'r'e'l'D'R'A'W',' 'a'n'd' 'o't'h'e'r' 'c'r'e'a't'i'v'e' 't'o'o'l's'.' 'I'n'c'l'u'd'e' 'a' 'c'o'f'f'e'e' 'm'u'g',' 'c'o'l'o'r' 'p'a'l'e't't'e',' 's't'a't'i'o'n'e'r'y',' 'a'n'd' 's't'y'l'i's'h' 'w'o'r'k's'p'a'c'e' 'e'l'e'm'e'n't's'.' 'U's'e' 'v'i'b'r'a'n't' 'n'e'o'n' 'b'l'u'e' 'l'i'g'h't'i'n'g',' 'c'i'n'e'm'a't'i'c' 'g'l'o'w' 'e'f'f'e'c't's',' 'u'l't'r'a'-'d'e't'a'i'l'e'd' '3'D' 'i'l'l'u's't'r'a't'i'o'n' 's't'y'l'e',' 'p'r'o'f'e's's'i'o'n'a'l' 'b'r'a'n'd'i'n'g' 'l'o'o'k',' 'h'i'g'h' 'q'u'a'l'i't'y',' 's'h'a'r'p' 'f'o'c'u's',' 'r'e'a'l'i's't'i'c' 'f'a'c'i'a'l' 'f'e'a't'u'r'e's',' 'c'l'e'a'n' 'c'o'm'p'o's'i't'i'o'n'.' 'A'd'd' 'b'o'l'd' 't'e'x't' 'a't' 't'h'e' 'b'o't't'o'm':' '\u201c'G'r'a'p'h'i'c' 'D'e's'i'g'n'e'r'\u201d'.' 'K'e'e'p' 't'h'e' 's'a'm'e' 'o'v'e'r'a'l'l' 'l'a'y'o'u't',' 'c'i'r'c'u'l'a'r' 'f'r'a'm'e',' 'c'o'l'o'r's',' 'l'i'g'h't'i'n'g',' 'a'n'd' 'p'r'o'f'e's's'i'o'n'a'l' 'd'e's'i'g'n' 't'h'e'm'e' 'a's' 't'h'e' 'r'e'f'e'r'e'n'c'e' 'i'm'a'g'e'.' '4'K' 'q'u'a'l'i't'y',' 'h'i'g'h'l'y' 'd'e't'a'i'l'e'd',' 'p'r'e'm'i'u'm' 'l'o'g'o' 'd'e's'i'g'n'.'",
  },
  {
    id: 'ansar-logo-2',
    title: "Modern Vector Emblem & Badge",
    category: 'Logos',
    description: "Modern commercial logo design with bold vector lines, vibrant gradients, and distinctive mascot silhouette.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Logo", "Branding", "Mascot", "Vector"],
    promptTemplate: "'U's'e' 't'h'e' 'u'p'l'o'a'd'e'd' 'p'h'o't'o' 'a's' 't'h'e' 'm'a'i'n' 's'u'b'j'e'c't'.' 'R'e'p'l'a'c'e' 't'h'e' 'c'a'r't'o'o'n' 'g'i'r'l' 'c'o'm'p'l'e't'e'l'y' 'w'i't'h' 't'h'e' 'u'p'l'o'a'd'e'd' 'p'e'r's'o'n'&'#'0'3'9';'s' 'f'a'c'e' 'a'n'd' 'a'p'p'e'a'r'a'n'c'e' 'w'h'i'l'e' 'm'a'i'n't'a'i'n'i'n'g' 'm'a'x'i'm'u'm' 'f'a'c'i'a'l' 'r'e's'e'm'b'l'a'n'c'e',' 'h'a'i'r's't'y'l'e',' 's'k'i'n' 't'o'n'e',' 'a'n'd' 'i'd'e'n't'i't'y'.' 'C'r'e'a't'e' 'a' 'p'r'o'f'e's's'i'o'n'a'l' '3'D' 'g'r'a'p'h'i'c' 'd'e's'i'g'n'e'r' 'w'o'r'k's'p'a'c'e' 'i'n's'i'd'e' 'a' 'c'i'r'c'u'l'a'r' 'b'a'd'g'e' 'l'o'g'o'.' 'T'h'e' 'p'e'r's'o'n' 'i's' 's'i't't'i'n'g' 'a't' 'a' 'm'o'd'e'r'n' 'd'e's'k' 'u's'i'n'g' 'a' 'l'a'p't'o'p',' 's'u'r'r'o'u'n'd'e'd' 'b'y' 'g'l'o'w'i'n'g' 'd'e's'i'g'n' 's'o'f't'w'a'r'e' 'i'c'o'n's' 's'u'c'h' 'a's' 'P'h'o't'o's'h'o'p',' 'I'l'l'u's't'r'a't'o'r',' 'I'n'D'e's'i'g'n',' 'F'i'g'm'a',' 'C'o'r'e'l'D'R'A'W',' 'a'n'd' 'o't'h'e'r' 'c'r'e'a't'i'v'e' 't'o'o'l's'.' 'I'n'c'l'u'd'e' 'a' 'c'o'f'f'e'e' 'm'u'g',' 'c'o'l'o'r' 'p'a'l'e't't'e',' 's't'a't'i'o'n'e'r'y',' 'a'n'd' 's't'y'l'i's'h' 'w'o'r'k's'p'a'c'e' 'e'l'e'm'e'n't's'.' 'U's'e' 'v'i'b'r'a'n't' 'n'e'o'n' 'b'l'u'e' 'l'i'g'h't'i'n'g',' 'c'i'n'e'm'a't'i'c' 'g'l'o'w' 'e'f'f'e'c't's',' 'u'l't'r'a'-'d'e't'a'i'l'e'd' '3'D' 'i'l'l'u's't'r'a't'i'o'n' 's't'y'l'e',' 'p'r'o'f'e's's'i'o'n'a'l' 'b'r'a'n'd'i'n'g' 'l'o'o'k',' 'h'i'g'h' 'q'u'a'l'i't'y',' 's'h'a'r'p' 'f'o'c'u's',' 'r'e'a'l'i's't'i'c' 'f'a'c'i'a'l' 'f'e'a't'u'r'e's',' 'c'l'e'a'n' 'c'o'm'p'o's'i't'i'o'n'.' 'A'd'd' 'b'o'l'd' 't'e'x't' 'a't' 't'h'e' 'b'o't't'o'm':' '\u201c'G'r'a'p'h'i'c' 'D'e's'i'g'n'e'r'\u201d'.' 'K'e'e'p' 't'h'e' 's'a'm'e' 'o'v'e'r'a'l'l' 'l'a'y'o'u't',' 'c'i'r'c'u'l'a'r' 'f'r'a'm'e',' 'c'o'l'o'r's',' 'l'i'g'h't'i'n'g',' 'a'n'd' 'p'r'o'f'e's's'i'o'n'a'l' 'd'e's'i'g'n' 't'h'e'm'e' 'a's' 't'h'e' 'r'e'f'e'r'e'n'c'e' 'i'm'a'g'e'.' '4'K' 'q'u'a'l'i't'y',' 'h'i'g'h'l'y' 'd'e't'a'i'l'e'd',' 'p'r'e'm'i'u'm' 'l'o'g'o' 'd'e's'i'g'n'.'",
  },
  {
    id: 'ansar-logo-3',
    title: "Custom Vector Logo Design #3",
    category: 'Logos',
    description: "Modern commercial logo design with bold vector lines, vibrant gradients, and distinctive mascot silhouette.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Logo", "Branding", "Mascot", "Vector"],
    promptTemplate: "'&'q'u'o't';'A' 'h'i'g'h'-'e'n'd',' 'l'u'x'u'r'i'o'u's' 'b'e'a'u't'y' 'p'a'r'l'o'u'r' 'l'o'g'o' 's'e't' 'o'n' 'a' 'c'l'e'a'n' 'w'h'i't'e' 'b'a'c'k'g'r'o'u'n'd'.' 'C'e'n't'e'r'e'd' 'i's' 'a' 'c'i'r'c'u'l'a'r' 'i'c'o'n' 'w'i't'h' 'a' 's'o'p'h'i's't'i'c'a't'e'd' 'g'o'l'd' 'f'r'a'm'e'.' 'I'n's'i'd'e',' 't'h'e'r'e' 'i's' 'a' 's't'y'l'i'z'e'd',' 'e'l'e'g'a'n't' 'f'e'm'a'l'e' 'f'a'c'e' 'p'r'o'f'i'l'e' 'w'i't'h' 'd'e't'a'i'l'e'd' 'g'o'l'd' 'e'y'e's'h'a'd'o'w',' 'p'r'e'c'i's'e' 'e'y'e'l'i'n'e'r',' 'a'n'd' 'b'o'l'd' 'r'e'd' 'l'i'p's'.' 'I'n't'r'i'c'a't'e',' 'f'l'o'w'i'n'g' 'g'o'l'd'e'n' 'f'l'o'r'a'l' 'a'n'd' 'l'e'a'f' 'm'o't'i'f's' 'w'i't'h' 'd'e'p't'h' 'b'r'a'n'c'h' 'o'u't' 'f'r'o'm' 't'h'e' 'f'i'g'u'r'e' 'a'n'd' 'a'r'e' 'i'n't'e'g'r'a't'e'd' 'w'i't'h' 'h'e'r' 'h'a'i'r'.' 'B'e'l'o'w' 't'h'e' 'c'i'r'c'u'l'a'r' 'i'c'o'n',' 't'h'e' 't'e'x't' '&'#'0'3'9';'['I'N'S'E'R'T'_'N'A'M'E'_'H'E'R'E']'&'#'0'3'9';' 'i's' 'b'e'a'u't'i'f'u'l'l'y' 'r'e'n'd'e'r'e'd' 'i'n' 'a'n' 'e'l'e'g'a'n't',' 'f'l'o'w'i'n'g' 'g'o'l'd' 's'c'r'i'p't' 'f'o'n't'.' 'T'h'e' 'i'n't'e'r'n'a'l' 'b'a'c'k'g'r'o'u'n'd' 'o'f' 't'h'e' 'g'o'l'd' 'c'i'r'c'l'e' 'i's' 'a' 'c'o'n't'r'a's't'i'n'g' 'd'e'e'p' 'b'l'a'c'k',' 'a'n'd' 't'h'e' 'o'v'e'r'a'l'l' 'c'o'm'p'o's'i't'i'o'n' 'i's' 'c'l'e'a'n' 'a'n'd' 'p'r'e'm'i'u'm'.'&'q'u'o't';'\r'\n'\r'\n'I's's'e' 'u's'e' 'k'a'r'n'e' 'k'e' 'l'i'y'e':'\r'\n'\r'\n'A'a'p' 'a'p'n'e' 'A'I' 'i'm'a'g'e' 'g'e'n'e'r'a't'i'o'n' 't'o'o'l' 'm'e'i'n' '&'#'0'3'9';'['I'N'S'E'R'T'_'N'A'M'E'_'H'E'R'E']'&'#'0'3'9';' 'k'i' 'j'a'g'a'h' 'v'a'h' 'n'a'a'm' 'd'a'a'l' 'd'e'i'n' 'j'o' 'a'a'p' 'l'o'g'o' 'p'a'r' 'd'e'k'h'n'a' 'c'h'a'h't'e' 'h'a'i'n' '('j'a'i's'e' 'k'i' '&'q'u'o't';'A'i's'h'a'&'#'0'3'9';'s' 'B'e'a'u't'y'&'q'u'o't';')'.' 'J'a'b' 'b'h'i' 'a'a'p' 'i's' 'p'r'o'm'p't' 's'e' 'l'o'g'o' 'g'e'n'e'r'a't'e' 'k'a'r'e'n'g'e',' 't'o'h' 'A'I' 'a'u't'o'm'a't'i'c'a'l'l'y' 'e'k' 'n'a'y'a' 'a'u'r' 'c'u's't'o'm'i'z'e'd' 'i'c'o'n' '('j'a'i's'e' 'd'i'f'f'e'r'e'n't' 'f'a'c'e' 'f'e'a't'u'r'e's' 'y'a' 'd'i'f'f'e'r'e'n't' 'f'i'l'i'g'r'e'e' 'f'l'o'w')' 't'a'i'y'a'a'r' 'k'a'r'e'g'a',' 'l'e'k'i'n' 'i's' 'p'r'e'm'i'u'm' 'g'o'l'd' 'a'u'r' 'r'e'd' 's't'y'l'e' 'k'o' 'b'a'r'k'a'r'a'a'r' 'r'a'k'h'e'g'a'.'",
  },
  {
    id: 'ansar-logo-4',
    title: "Custom Vector Logo Design #4",
    category: 'Logos',
    description: "Modern commercial logo design with bold vector lines, vibrant gradients, and distinctive mascot silhouette.",
    targetModels: ["Midjourney", "Flux", "ChatGPT"],
    tags: ["Logo", "Branding", "Mascot", "Vector"],
    promptTemplate: "'A' 'p'r'e'm'i'u'm',' 'h'i'g'h'-'r'e's'o'l'u't'i'o'n' 'v'e'c't'o'r'-'s't'y'l'e' 'm'a's'c'o't' 'l'o'g'o' 'i'l'l'u's't'r'a't'i'o'n' 'o'f' 'a' 'm'a'l'e' 'g'a'm'e'r' 'a'v'a't'a'r',' 'c'e'n't'r'a'l'l'y' 'c'o'm'p'o's'e'd'.' 'T'h'e' 'f'a'c'i'a'l' 'f'e'a't'u'r'e's',' 'i'n'c'l'u'd'i'n'g' 't'h'e' 's'p'e'c'i'f'i'c' 's'h'a'p'e' 'o'f' 't'h'e' 'e'y'e's',' 'n'o's'e',' 'm'o'u't'h',' 'a'n'd' 't'h'e' 'p'a't't'e'r'n' 'o'f' 't'h'e' 'b'e'a'r'd',' 'a'r'e' 'd'i'r'e'c't'l'y' 'b'a's'e'd' 'o'n' 'a' 'p'r'o'v'i'd'e'd' 'r'e'f'e'r'e'n'c'e' 'p'h'o't'o'g'r'a'p'h' 'o'f' 'a' 'r'e'a'l' 'p'e'r's'o'n' '('t'h'e' 'u's'e'r'&'#'0'3'9';'s' 'u'p'l'o'a'd'e'd' 'p'h'o't'o')'.' 'T'h'e' 'e'x'p'r'e's's'i'o'n' 'i's' 'a' 'c'o'n'f'i'd'e'n't' 'a'n'd' 's'l'i'g'h't'l'y' 'k'n'o'w'i'n'g' 's'm'i'r'k'.' 'T'h'e' 'a'v'a't'a'r' 'w'e'a'r's' 'a' 'w'h'i't'e' 'b'a's'e'b'a'l'l' 'c'a'p',' 'b'a'c'k'w'a'r'd' 'o'r' 'f'o'r'w'a'r'd'-'f'a'c'i'n'g',' 'w'i't'h' 'a' 'l'a'r'g'e',' 's't'y'l'i'z'e'd' 'l'e't't'e'r' '&'#'0'3'9';'B'&'#'0'3'9';' '('o'r' 'o't'h'e'r' 'l'e't't'e'r' 'o'f' 'u's'e'r'&'#'0'3'9';'s' 'c'h'o'i'c'e')' 'o'n' 't'h'e' 'f'r'o'n't' 'p'a'n'e'l'.' 'H'e' 'a'l's'o' 'w'e'a'r's' 'l'a'r'g'e',' 'o'v'e'r'-'e'a'r' 'g'a'm'i'n'g' 'h'e'a'd'p'h'o'n'e's' 'w'i't'h' 'd'i's't'i'n'c't' 'o'r'a'n'g'e' 'a'n'd' 'y'e'l'l'o'w' 'a'c'c'e'n't's' 'a'n'd' 'p'a'd'd'i'n'g',' 'w'i't'h' 'a' 'v'i's'i'b'l'e' 'a'u'd'i'o' 'c'a'b'l'e'.' 'H'e' 'i's' 'w'e'a'r'i'n'g' 't'h'e' 'c'o'l'l'a'r' 'o'f' 'a' 's'i'm'p'l'e' 'd'a'r'k' 'h'o'o'd'i'e'.' 'P'o's'i't'i'o'n'e'd' 'd'i'r'e'c't'l'y' 'b'e'l'o'w' 't'h'e' 'a'v'a't'a'r' 'p'o'r't'r'a'i't' 'i's' 'a' 'c'u's't'o'm'-'d'e's'i'g'n'e'd' 't'e'x't' 'b'a'n'n'e'r'.' 'T'h'e' 't'e'x't' 'w'i't'h'i'n' 't'h'i's' 'b'a'n'n'e'r' 's'h'o'u'l'd' 'b'e' 'd'e'f'i'n'e'd' 'b'y' 't'h'e' 'u's'e'r' '('e'.'g'.',' '&'q'u'o't';'['U'S'E'R'_'N'A'M'E']' 'G'A'M'I'N'G'&'q'u'o't';')',' 'r'e'p'l'a'c'i'n'g' 't'h'e' 't'e'x't' '&'q'u'o't';'G'A'M'E'R' 'L'O'G'O'&'q'u'o't';' 's'e'e'n' 'i'n' 'i'm'a'g'e'_'0'.'p'n'g'.' 'T'h'e' 't'e'x't' 'f'o'n't' 'a'n'd' 's't'y'l'e' 'm'u's't' 'm'a't'c'h' 't'h'e' 'b'l'o'c'k'y',' 's'a'n's'-'s'e'r'i'f',' 'b'o'l'd' 'f'o'n't' 'w'i't'h' 't'h'e' 'v'i'b'r'a'n't' 'y'e'l'l'o'w'-'t'o'-'o'r'a'n'g'e' 'g'r'a'd'i'e'n't' 'f'i'l'l' 'a'n'd' 't'h'e' 't'h'i'c'k',' 'c'l'e'a'n' 'b'l'a'c'k' 'a'n'd' 'w'h'i't'e' 'o'u't'l'i'n'e' 'l'a'y'e'r's' 's'e'e'n' 'i'n' 'i'm'a'g'e'_'0'.'p'n'g'.' 'T'h'e' 'e'n't'i'r'e' 'l'o'g'o' 'i's' 's'e't' 'a'g'a'i'n's't' 'a' 'c'l'e'a'n',' 'n'e'u't'r'a'l' 'l'i'g'h't' 'g'r'e'y' 't'o' 'w'h'i't'e' 'g'r'a'd'i'e'n't' 'b'a'c'k'g'r'o'u'n'd' 'w'i't'h' 'a' 's'o'f't' 'i'n'n'e'r' 'v'i'g'n'e't't'e',' 'm'a'i'n't'a'i'n'i'n'g' 't'h'e' 'c'l'e'a'n' 'l'i'n'e's',' 'p'r'e'm'i'u'm' 'c'o'l'o'r'i'n'g',' 'a'n'd' 'd'i's't'i'n'c't' 'v'e'c't'o'r' 'i'l'l'u's't'r'a't'i'o'n' 's't'y'l'e' 'o'f' 'i'm'a'g'e'_'0'.'p'n'g'.' 'T'h'e' 'o'v'e'r'a'l'l' 'q'u'a'l'i't'y' 'i's' 'p'r'i's't'i'n'e' 'a'n'd' 'p'r'o'f'e's's'i'o'n'a'l'.'",
  },
  {
    id: 'ansar-album-1',
    title: "Instagram Aesthetic Photo Collage 4:5",
    category: 'Albums',
    description: "High-end 4K cinematic album spread and Instagram portrait collage with seamless color grading.",
    targetModels: ["Midjourney", "Flux", "Gemini"],
    tags: ["Album", "Wedding", "Collage", "Photo Grid"],
    promptTemplate: "'U'l't'r'a'-'r'e'a'l'i's't'i'c' 'I'n's't'a'g'r'a'm'-'s't'y'l'e' 'p'h'o't'o' 'c'o'l'l'a'g'e' 'i'n' '4':'5' 'p'o'r't'r'a'i't' 'r'a't'i'o',' 's'o'f't' 'w'a'r'm' 'w'i'n'd'o'w' 'l'i'g'h't' 'w'i't'h' 'd'r'a'm'a't'i'c' 'l'i'g'h't' 'r'a'y's',' 'r'i'c'h' 'm'a'r'o'o'n'-'r'e'd' 'a'n'd' 'g'o'l'd'\r'\n'T'e'e'j' 'a'e's't'h'e't'i'c'.'\r'\n'L'a'y'o'u't' '('e'x'a'c't'l'y' 'l'i'k'e' 't'h'e' 'o'r'i'g'i'n'a'l')':'\r'\n'-' 'T'o'p'-'l'e'f't':' 'y'o'u'n'g' 'I'n'd'i'a'n' 'w'o'm'a'n' 'i'n' 'd'e'e'p' 'm'a'r'o'o'n' 's'i'l'k' 's'a'r'e'e' 'w'i't'h' 'h'e'a'v'y' 'g'o'l'd' 'b'o'r'd'e'r' 'a'n'd' 'e'm'b'r'o'i'd'e'r'y',' 's'm'i'l'i'n'g' 's'o'f't'l'y' 'a't' 'c'a'm'e'r'a',' 'm'a'a'n'g' 't'i'k'k'a',' 'l'a'r'g'e' 'g'o'l'd' 'n'a't'h' '('n'o's'e' 'r'i'n'g')',' 'h'e'a'v'y' 'j'h'u'm'k'a's',' 'l'a'y'e'r'e'd' 'g'o'l'd' 'n'e'c'k'l'a'c'e's',' 'm'u'l't'i'p'l'e' 'r'e'd'-'g'o'l'd' 'b'a'n'g'l'e's',' 'i'n't'r'i'c'a't'e' 'm'e'h'n'd'i' 'o'n' 'h'a'n'd's',' 'o'n'e' 'h'a'n'd' 'n'e'a'r' 'c'h'e's't'.'\r'\n'T'o'p'-'r'i'g'h't':' 'c'l'o's'e'r' 'p'o'r't'r'a'i't' 'o'f' 's'a'm'e' 'w'o'm'a'n' 's'm'i'l'i'n'g',' 'l'o'o'k'i'n'g' 's'l'i'g'h't'l'y' 's'i'd'e'w'a'y's',' 'h'a'n'd' 't'o'u'c'h'i'n'g' 'h'a'i'r'.'\r'\n'M'i'd'd'l'e'-'r'i'g'h't':' 'i'n't'i'm'a't'e' 'c'l'o's'e'-'u'p' 'u'n'd'e'r' 't'h'e' 'p'a'l'l'u',' 'b'o't'h' 'h'a'n'd's' 'r'a'i's'e'd' 's'h'o'w'i'n'g' 'm'e'h'n'd'i' 'a'n'd' 'b'a'n'g'l'e's'.'\r'\n'-' 'B'o't't'o'm'-'l'e'f't':' 'f'u'l'l' 's'i't't'i'n'g' 'p'o's'e' 'a'g'a'i'n's't' 'a' 'p'l'a'i'n' 'w'a'l'l',' 'a'r'm's' 'c'r'o's's'e'd',' 'd'r'e'a'm'y' 'u'p'w'a'r'd' 'g'a'z'e',' 's'a'r'e'e' 'f'l'o'w'i'n'g'.'\r'\n'B'o't't'o'm'-'r'i'g'h't':' 'c'l'o's'e'-'u'p' 'o'f' 'h'e'r' 'f'e'e't' 'w'i't'h' 'c'l'a's's'i'c' 'r'e'd' 'a'l't'a' '('s'o'l'e's' '+' 't'o'e's')',' 's'i'l'v'e'r' 'p'a'y'a'l',' 's'o'f't' 't'i'l'e'd' 'f'l'o'o'r' 'w'i't'h' 'l'i'g'h't' 'r'a'y's'.'\r'\n'N'e'w' 'a'd'd'i't'i'o'n' '-' 'c'e'n't'r'e' 'o'v'e'r'l'a'p'p'i'n'g' 'f'r'a'm'e':' 't'h'e' 's'a'm'e' 'w'o'm'a'n' 's't'a'n'd'i'n'g' 'w'i't'h' 'h'e'r' 'h'u's'b'a'n'd'.' 'H'u's'b'a'n'd' 'i's' 'a' 'h'a'n'd's'o'm'e' 'I'n'd'i'a'n' 'm'a'n' 'i'n' 'm'a't'c'h'i'n'g' 'd'e'e'p' 'm'a'r'o'o'n' 'k'u'r't'a' 'w'i't'h' 'g'o'l'd' 'e'm'b'r'o'i'd'e'r'y' '+' 'c'r'e'a'm' 'd'h'o't'i' '/' 'c'h'u'r'i'd'a'r',' 'g'o'l'd' 'c'h'a'i'n' 'a'n'd' 'b'r'a'c'e'l'e't',' 'l'o'o'k'i'n'g' 'l'o'v'i'n'g'l'y' 'a't' 'h'e'r'.' 'B'o't'h' 'w'e'a'r'i'n'g' 'c'o'o'r'd'i'n'a't'e'd' 't'r'a'd'i't'i'o'n'a'l' 'o'u't'f'i't's'.'\r'\n'E'l'e'g'a'n't' 'w'h'i't'e' 's'e'r'i'f' 't'e'x't' 'i'n' 't'h'e' 'c'e'n't'r'e':' '&'q'u'o't';'T'e'e'j' 'S'p'e'c'i'a'l'&'q'u'o't';' 'w'i't'h' 'm'a'r'i'g'o'l'd',' 'd'i'a'm'o'n'd' 'a'n'd' 'l'e'a'f' 'e'm'o'j'i's'.'\r'\n'H'i'g'h'l'y' 'd'e't'a'i'l'e'd' 'f'a'b'r'i'c' 't'e'x't'u'r'e',' 'j'e'w'e'l'l'e'r'y',' 'm'e'h'n'd'i',' 'r'e'a'l'i's't'i'c' 's'k'i'n' 't'o'n'e's',' 'c'i'n'e'm'a't'i'c' 's'o'f't' 'l'i'g'h't'i'n'g',' 'n'o' 'w'a't'e'r'm'a'r'k',' '4':'5' 'r'a't'i'o'.'\r'\n'F'a'c'e' 's'a'm'e' 'a's' 'r'e'f'e'r'e'n'c'e' 'i'm'a'g'e'.'",
  },
  {
    id: 'ansar-album-2',
    title: "Premium 4K Wedding Album Spread 16:8",
    category: 'Albums',
    description: "High-end 4K cinematic album spread and Instagram portrait collage with seamless color grading.",
    targetModels: ["Midjourney", "Flux", "Gemini"],
    tags: ["Album", "Wedding", "Collage", "Photo Grid"],
    promptTemplate: "'U'p'l'o'a'd' 'a'n'y' 'p'e'r's'o'n'\u2019's' 'p'h'o't'o' 'a'n'd' 'c'r'e'a't'e' 'a' 'p'r'e'm'i'u'm' '4'K' 'c'i'n'e'm'a't'i'c' 'a'l'b'u'm' 'c'o'v'e'r' 'i'n' '1'6':'8'.' 'P'r'e's'e'r'v'e' 't'h'e' 'f'a'c'e' 'a'n'd' 'a'p'p'e'a'r'a'n'c'e' 'a'c'c'u'r'a't'e'l'y'.' 'C'r'e'a't'e' 'a'n' 'e'l'e'g'a'n't' 'd'o'u'b'l'e'-'e'x'p'o's'u'r'e' 'p'h'o't'o' 'c'o'l'l'a'g'e' 'w'i't'h' 'm'u'l't'i'p'l'e' 'b'l'e'n'd'e'd' 'p'o'r't'r'a'i't's',' 's'o'f't' 'b'o'k'e'h',' 'd'r'e'a'm'y' 'l'i'g'h't'i'n'g',' 'n'a't'u'r'a'l' 'b'a'c'k'g'r'o'u'n'd',' 'c'i'n'e'm'a't'i'c' 'd'e'p't'h',' 'a'n'd' 'b'e'a'u't'i'f'u'l' 'm'i'n'i'm'a'l' 's't'y'l'i's'h' 't'y'p'o'g'r'a'p'h'y'.' 'P'r'o'f'e's's'i'o'n'a'l',' 'r'e'a'l'i's't'i'c',' 's'h'a'r'p',' 'l'u'x'u'r'i'o'u's' 'p'h'o't'o'g'r'a'p'h'y' 'l'o'o'k'.'",
  },
  {
    id: 'ansar-album-3',
    title: "Cinematic Album Layout #3",
    category: 'Albums',
    description: "High-end 4K cinematic album spread and Instagram portrait collage with seamless color grading.",
    targetModels: ["Midjourney", "Flux", "Gemini"],
    tags: ["Album", "Wedding", "Collage", "Photo Grid"],
    promptTemplate: "'U'p'l'o'a'd' 'a'n'y' 'p'e'r's'o'n'\u2019's' 'p'h'o't'o' 'a'n'd' 'c'r'e'a't'e' 'a' 'p'r'e'm'i'u'm' '4'K' 'c'i'n'e'm'a't'i'c' '1'6':'8' 'a'l'b'u'm' 'c'o'v'e'r' 'w'i't'h' 'a'c'c'u'r'a't'e' 'f'a'c'e' 'p'r'e's'e'r'v'a't'i'o'n',' 'e'l'e'g'a'n't' 'd'o'u'b'l'e'-'e'x'p'o's'u'r'e' 'p'h'o't'o' 'c'o'l'l'a'g'e',' 'm'u'l't'i'p'l'e' 'b'l'e'n'd'e'd' 'p'o'r't'r'a'i't's',' 's'o'f't' 'g'o'l'd'e'n'-'g'r'e'e'n' 'l'i'g'h't'i'n'g',' 'd'r'e'a'm'y' 'b'o'k'e'h',' 'f'l'o'r'a'l' 'e'l'e'm'e'n't's',' 'l'u'x'u'r'y' 'w'e'd'd'i'n'g'/'c'e'l'e'b'r'a't'i'o'n' 'a'e's't'h'e't'i'c',' 'a'n'd' 'b'e'a'u't'i'f'u'l' 'm'i'n'i'm'a'l' 's't'y'l'i's'h' 't'y'p'o'g'r'a'p'h'y'.' 'P'r'o'f'e's's'i'o'n'a'l',' 'r'e'a'l'i's't'i'c',' 's'h'a'r'p' 'a'n'd' 'h'i'g'h'-'e'n'd' 'p'h'o't'o'g'r'a'p'h'y' 'l'o'o'k'.'",
  },
  {
    id: 'ansar-album-4',
    title: "Cinematic Album Layout #4",
    category: 'Albums',
    description: "High-end 4K cinematic album spread and Instagram portrait collage with seamless color grading.",
    targetModels: ["Midjourney", "Flux", "Gemini"],
    tags: ["Album", "Wedding", "Collage", "Photo Grid"],
    promptTemplate: "'U'p'l'o'a'd' 'a'n'y' 'p'e'r's'o'n'/'c'o'u'p'l'e' 'p'h'o't'o' 'a'n'd' 'c'r'e'a't'e' 'a' 'p'r'e'm'i'u'm' '4'K' 'c'i'n'e'm'a't'i'c' 'w'e'd'd'i'n'g' 'a'l'b'u'm' 'c'o'v'e'r' 'i'n' '1'6':'8'.' 'P'r'e's'e'r'v'e' 't'h'e' 'u'p'l'o'a'd'e'd' 'f'a'c'e's' 'a'n'd' 'a'p'p'e'a'r'a'n'c'e' 'a'c'c'u'r'a't'e'l'y'.' 'C'r'e'a't'e' 'a'n' 'e'l'e'g'a'n't' 'd'o'u'b'l'e'-'e'x'p'o's'u'r'e' 'c'o'l'l'a'g'e' 'w'i't'h' 'm'u'l't'i'p'l'e' 'b'l'e'n'd'e'd' 'p'o'r't'r'a'i't's',' 'r'o'm'a'n't'i'c' 'g'o'l'd'e'n' 'l'i'g'h't'i'n'g',' 's'o'f't' 'b'o'k'e'h',' 'f'l'o'r'a'l' 'e'l'e'm'e'n't's',' 'c'i'n'e'm'a't'i'c' 'd'e'p't'h' 'a'n'd' 'l'u'x'u'r'y' 'p'h'o't'o'g'r'a'p'h'y' 's't'y'l'e'.' 'A'd'd' 'b'e'a'u't'i'f'u'l' 'm'i'n'i'm'a'l' 'w'e'd'd'i'n'g' 't'y'p'o'g'r'a'p'h'y',' 'b'a'l'a'n'c'e'd' 'c'o'm'p'o's'i't'i'o'n',' 's'h'a'r'p' 'r'e'a'l'i's't'i'c' 'd'e't'a'i'l's',' 'p'r'e'm'i'u'm' 'a'l'b'u'm'-'c'o'v'e'r' 'f'i'n'i's'h'.'",
  },

  // ================= CODING & TECH =================
  {
    id: 'code-bug-hunter',
    title: 'Bug Hunter & Root Cause Diagnostic',
    category: 'Coding',
    description: 'Pinpoints elusive bugs, memory leaks, or race conditions with precise root cause analysis.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Debugging', 'Refactoring', 'Software Engineering'],
    promptTemplate: `Act as a Principal Staff Software Engineer. Analyze the following [PROGRAMMING_LANGUAGE] code that is producing this unexpected behavior or error:

[ERROR_MESSAGE_OR_BEHAVIOR]

Code Snippet:
\`\`\`[PROGRAMMING_LANGUAGE]
[PASTE_CODE_HERE]
\`\`\`

Perform a comprehensive diagnostic:
1. Explain the exact Root Cause of the failure (including edge cases or concurrency issues).
2. Provide the corrected, production-ready code with inline comments explaining the fix.
3. List 2-3 preventive measures or unit tests (using [TEST_FRAMEWORK]) to verify regression cannot recur.`,
    defaultVariables: {
      PROGRAMMING_LANGUAGE: 'TypeScript / React',
      ERROR_MESSAGE_OR_BEHAVIOR: 'Maximum update depth exceeded when updating state inside useEffect.',
      PASTE_CODE_HERE: 'useEffect(() => { setUserData({ ...userData, count: userData.count + 1 }); }, [userData]);',
      TEST_FRAMEWORK: 'Jest / React Testing Library'
    }
  },
  {
    id: 'code-senior-refactor',
    title: 'Senior Code Architecture & Clean Code Refactor',
    category: 'Coding',
    description: 'Transforms messy spaghetti code into clean, testable SOLID architecture with design patterns.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Clean Code', 'Architecture', 'SOLID', 'Design Patterns'],
    promptTemplate: `Act as an expert software architect specializing in Clean Architecture and SOLID principles. Review and refactor the following [PROGRAMMING_LANGUAGE] code:

\`\`\`[PROGRAMMING_LANGUAGE]
[PASTE_CODE_HERE]
\`\`\`

Your refactoring objectives:
- Identify code smells, anti-patterns, and violations of SOLID principles.
- Refactor the code into modular, maintainable, and highly testable modules.
- Ensure strict type safety and idiomatic [PROGRAMMING_LANGUAGE] conventions.
- Provide a summary of architectural improvements and time/space complexity differences.`,
    defaultVariables: {
      PROGRAMMING_LANGUAGE: 'Python',
      PASTE_CODE_HERE: 'def handle_data(d):\n    if len(d) > 0:\n        for x in d:\n            if x["status"] == "ok":\n                # 50 lines of nested logic\n                pass'
    }
  },
  {
    id: 'code-sql-optimizer',
    title: 'High-Performance SQL Query & Index Optimizer',
    category: 'Coding',
    description: 'Diagnoses slow SQL queries, recommends composite indexes, and optimizes execution plans.',
    targetModels: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['Database', 'SQL', 'PostgreSQL', 'MySQL', 'Performance'],
    promptTemplate: `Act as a senior Database Administrator (DBA) specializing in [DATABASE_ENGINE]. 

Here is my current SQL query that is running slowly on a table with [APPROXIMATE_ROW_COUNT] rows:
\`\`\`sql
[PASTE_SQL_QUERY]
\`\`\`

Table Schema & Existing Indexes:
[SCHEMA_OR_INDEX_INFO]

Please provide:
1. Analysis of potential bottleneck (full table scans, improper JOIN order, Cartesian products, unindexed filters).
2. The optimized query rewritten for maximum speed.
3. Recommended exact index creation statements (composite, partial, or covering indexes).
4. Tips for EXPLAIN ANALYZE inspection.`,
    defaultVariables: {
      DATABASE_ENGINE: 'PostgreSQL 16',
      APPROXIMATE_ROW_COUNT: '2.5 Million',
      PASTE_SQL_QUERY: 'SELECT u.id, o.total, p.name FROM users u JOIN orders o ON u.id = o.user_id JOIN payments p ON o.id = p.order_id WHERE o.created_at >= NOW() - INTERVAL \'30 days\' AND u.status = \'active\' ORDER BY o.total DESC LIMIT 50;',
      SCHEMA_OR_INDEX_INFO: 'users(id PK, status), orders(id PK, user_id FK, total, created_at), payments(id PK, order_id FK, name)'
    }
  },
  {
    id: 'code-system-design',
    title: 'High-Scale System Architecture Design (HLD & LLD)',
    category: 'Coding',
    description: 'Designs scalable, fault-tolerant cloud systems answering latency, throughput, and consistency trade-offs.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['System Design', 'Microservices', 'Cloud', 'Architecture'],
    promptTemplate: `Act as a Principal Cloud Solutions Architect. Design an end-to-end system architecture for [SYSTEM_NAME_OR_FEATURE].

Key Requirements:
- Scale: [SCALE_REQUIREMENTS]
- Latency SLA: [LATENCY_SLA]
- Core Features: [CORE_FEATURES]

Deliver your design in the following structured format:
1. High-Level Architecture Diagram explanation (Client -> CDN -> API Gateway -> Microservices -> Queues -> DB / Cache).
2. Data Model & Database Choice (SQL vs NoSQL vs NewSQL with CAP theorem trade-offs).
3. Caching Strategy (Redis/Memcached, Cache-Aside vs Write-Through, TTLs, Invalidation).
4. Resiliency & Fault Tolerance (Circuit breakers, rate limiting, dead-letter queues, disaster recovery).
5. Bottlenecks & Scaling Roadmap.`,
    defaultVariables: {
      SYSTEM_NAME_OR_FEATURE: 'Real-time Global Notification Engine (Push, SMS, Email)',
      SCALE_REQUIREMENTS: '100 Million daily active users, 15,000 notifications per second peak',
      LATENCY_SLA: '< 200ms end-to-end delivery',
      CORE_FEATURES: 'Priority queues, user quiet hours, deduplication, retry logic, delivery webhooks'
    }
  },
  {
    id: 'code-regex-architect',
    title: 'Regex Architect & Comprehensive Explainer',
    category: 'Coding',
    description: 'Generates robust Regular Expressions with detailed group breakdowns and edge-case validation.',
    targetModels: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['Regex', 'Parsing', 'String Manipulation'],
    promptTemplate: `Act as a regular expression specialist. Create a robust, production-grade regular expression in [REGEX_FLAVOR] for the following pattern requirement:

Requirement: [PATTERN_REQUIREMENT]

Must Match:
[POSITIVE_TEST_EXAMPLES]

Must NOT Match:
[NEGATIVE_TEST_EXAMPLES]

Output:
1. The raw Regular Expression.
2. Group-by-group breakdown explaining every token, quantifier, and lookaround.
3. Performance analysis (ensure no catastrophic backtracking risk).
4. Code snippet demonstrating usage in [PROGRAMMING_LANGUAGE].`,
    defaultVariables: {
      REGEX_FLAVOR: 'JavaScript (ECMAScript) / PCRE',
      PATTERN_REQUIREMENT: 'Strict international phone number with optional country code and extensions',
      POSITIVE_TEST_EXAMPLES: '+1-800-555-0199, +92 300 1234567, 03001234567, +44 20 7946 0958 ext. 123',
      NEGATIVE_TEST_EXAMPLES: '12345, abcdef, +9999999999999999999, ++1-234-567',
      PROGRAMMING_LANGUAGE: 'TypeScript'
    }
  },
  {
    id: 'code-unit-tests',
    title: 'Bulletproof Unit & Integration Test Suite Generator',
    category: 'Coding',
    description: 'Generates 100% branch-coverage unit tests with mocks, edge cases, and failure scenarios.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Testing', 'TDD', 'Jest', 'PyTest'],
    promptTemplate: `Act as a QA Lead and Test Automation Engineer. Write a comprehensive suite of unit tests for the following [PROGRAMMING_LANGUAGE] function/class using [TEST_RUNNER]:

\`\`\`[PROGRAMMING_LANGUAGE]
[CODE_TO_TEST]
\`\`\`

Include:
- Happy path standard execution scenarios.
- Boundary condition tests (null, empty, 0, max integer, unexpected type).
- Error handling & exception assertions.
- External dependencies mocking (APIs, Database, Timers).
- Clear, readable test titles following the Given-When-Then / Arrange-Act-Assert pattern.`,
    defaultVariables: {
      PROGRAMMING_LANGUAGE: 'TypeScript',
      TEST_RUNNER: 'Vitest / Jest with Mock Service Worker (MSW)',
      CODE_TO_TEST: 'export async function checkoutCart(userId: string, items: CartItem[], coupon?: string): Promise<OrderSummary> { ... }'
    }
  },
  {
    id: 'code-api-designer',
    title: 'RESTful / GraphQL API Contract & OpenAPI Specification',
    category: 'Coding',
    description: 'Designs clear, standard-compliant API contracts with pagination, error models, and OpenAPI 3.0 specs.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['API', 'REST', 'OpenAPI', 'Swagger', 'Backend'],
    promptTemplate: `Act as a Senior API Architect. Design a production-grade RESTful API contract for [FEATURE_NAME].

Business Context:
[BUSINESS_DESCRIPTION]

Requirements:
- Endpoint URIs following REST naming conventions.
- HTTP Methods, Headers, Request Body Schema, and Query parameters (filtering, sorting, cursor-based pagination).
- Detailed Response Payloads for 200 OK, 201 Created, 400 Bad Request, 401/403 Auth, 404 Not Found, 429 Rate Limited.
- Standardized error response envelope: \`{ error: { code, message, details, trace_id } }\`.
- Complete OpenAPI 3.0 (Swagger) YAML representation.`,
    defaultVariables: {
      FEATURE_NAME: 'Multi-Tenant Subscription & Seat Management Billing API',
      BUSINESS_DESCRIPTION: 'SaaS platform where organizations invite members, upgrade plans, cancel subscriptions, and monitor seat usage.'
    }
  },
  {
    id: 'code-docker-compose',
    title: 'Production Dockerfile & Multi-Service Compose Setup',
    category: 'Coding',
    description: 'Builds lightweight, secure multi-stage Dockerfiles and containerized dev environments.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
    promptTemplate: `Act as a Senior DevOps and Cloud Infrastructure Engineer. Write an optimized, secure Dockerfile and docker-compose.yml configuration for a [APP_STACK] application.

Specific Needs:
- Multi-stage build to minimize image size and remove build dependencies.
- Non-root user execution for container security hardening.
- Proper layer caching for fast rebuilds.
- Environment variable injection and healthcheck probes.
- Docker Compose setup connecting [DEPENDENT_SERVICES] with volume persistence and restart policies.`,
    defaultVariables: {
      APP_STACK: 'Next.js 15 (App Router) + Node.js 20',
      DEPENDENT_SERVICES: 'PostgreSQL 16, Redis Cache, and Mailpit SMTP server for local email testing'
    }
  },
  {
    id: 'code-typescript-types',
    title: 'TypeScript Advanced Generics & Type Wizard',
    category: 'Coding',
    description: 'Solves complex TypeScript typings, conditional types, mapped types, and branded primitives.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['TypeScript', 'Generics', 'Frontend', 'TypeSafety'],
    promptTemplate: `Act as a TypeScript core contributor. Help me design an advanced, strictly typed TypeScript utility or type definition for:

Use Case: [USE_CASE_DESCRIPTION]

Current Code / Rough Attempt:
\`\`\`typescript
[PASTE_TYPE_OR_ATTEMPT]
\`\`\`

Requirements:
- Must avoid \`any\` or unsafe \`as unknown\` type assertions where possible.
- Leverage advanced TypeScript features (conditional types, mapped types, template literal types, or distributive inference).
- Provide 3 unit tests using TypeScript compile-time checks (e.g. \`type Expect<T extends true> = T\`).`,
    defaultVariables: {
      USE_CASE_DESCRIPTION: 'Deeply flatten nested object keys into dot-notation strings for type-safe i18n translation keys.',
      PASTE_TYPE_OR_ATTEMPT: 'type NestedKeys<T> = ...'
    }
  },
  {
    id: 'code-security-audit',
    title: 'Web Application Security Audit & OWASP Top 10 Review',
    category: 'Coding',
    description: 'Audits source code for XSS, SQL injection, CSRF, IDOR, and SSRF vulnerabilities with mitigation steps.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Cybersecurity', 'OWASP', 'Penetration Testing', 'AppSec'],
    promptTemplate: `Act as a certified Application Security (AppSec) Specialist and Ethical Hacker. Review the following code/architecture snippet for potential security flaws based on the OWASP Top 10:

\`\`\`[PROGRAMMING_LANGUAGE]
[PASTE_CODE_OR_HANDLER]
\`\`\`

Deliver your security assessment:
1. Vulnerability Findings (categorized by severity: Critical, High, Medium, Low).
2. Attack Scenario: How an adversary could exploit each vulnerability (POC explanation).
3. Exact Remediation Code: Safe implementation implementing input sanitization, parameterized queries, or token validation.
4. Security headers or middleware configurations recommended.`,
    defaultVariables: {
      PROGRAMMING_LANGUAGE: 'Node.js Express',
      PASTE_CODE_OR_HANDLER: 'app.get("/user/profile", async (req, res) => {\n  const id = req.query.id;\n  const user = await db.query(`SELECT * FROM users WHERE id = \'${id}\'`);\n  res.render("profile", { user });\n});'
    }
  },

  // ================= WRITING & CONTENT =================
  {
    id: 'write-viral-linkedin',
    title: 'Viral LinkedIn Storytelling Post with High-Engagement Hook',
    category: 'Writing',
    description: 'Crafts relatable, high-CTR storytelling posts formatted for modern LinkedIn dwell time algorithms.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['LinkedIn', 'Personal Brand', 'Storytelling', 'Copywriting'],
    promptTemplate: `Act as a top 1% LinkedIn ghostwriter with over 500,000 followers. Write a viral, high-retention LinkedIn post about:

Topic / Lesson: [TOPIC_OR_LESSON]
Target Audience: [TARGET_AUDIENCE]
Tone: [TONE]

Structure Guidelines:
1. The Hook (First 2 lines): Make it impossible not to click "see more". Use intrigue, a counter-intuitive observation, or a bold claim.
2. The Story / Context: 3-4 short, punchy paragraphs with 1-2 sentences each. High white space for mobile readability.
3. The Turning Point: What changed or what critical lesson was learned.
4. Actionable Takeaway: Bullet points formatted with clean emojis.
5. The Discussion Question: A frictionless question at the end that prompts comments.
6. 3-4 niche relevant hashtags.`,
    defaultVariables: {
      TOPIC_OR_LESSON: 'Why working 14 hours a day was killing my startup, and how cutting back to 6 hours doubled our revenue.',
      TARGET_AUDIENCE: 'Founders, solopreneurs, tech leaders, software engineers',
      TONE: 'Vulnerable, authentic, inspiring, data-backed'
    }
  },
  {
    id: 'write-seo-pillar',
    title: 'Comprehensive SEO Pillar Article & Rank #1 Guide',
    category: 'Writing',
    description: 'Produces in-depth, long-form articles optimized for Google EEAT and semantic search intent.',
    targetModels: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['SEO', 'Blogging', 'Content Marketing', 'Google EEAT'],
    promptTemplate: `Act as a world-class SEO strategist and technical content writer. Write a comprehensive, 2,000-word authoritative guide on:

Target Keyword: [TARGET_KEYWORD]
Secondary Keywords: [SECONDARY_KEYWORDS]
Target Audience: [AUDIENCE_PERSONA]
Search Intent: [SEARCH_INTENT]

Write the complete article following these SEO guidelines:
- Title Tag & H1: Catchy, contains the main keyword, under 60 characters.
- Meta Description: High-CTR, contains target keyword and benefit, under 155 characters.
- Introduction: Hook the reader, address their pain point immediately, and provide a clear value thesis.
- Structured Content: Use H2 and H3 tags logically. Include comparison tables, bulleted takeaways, and actionable steps.
- FAQs Section: 4-5 Schema-friendly question/answers answering "People Also Ask" queries.
- Conclusion with a compelling Call to Action (CTA).`,
    defaultVariables: {
      TARGET_KEYWORD: 'Next.js 15 App Router SEO Best Practices',
      SECONDARY_KEYWORDS: 'Server Components SEO, Next.js metadata API, OpenGraph dynamic images, sitemap.xml automation',
      AUDIENCE_PERSONA: 'Full-stack developers, tech leads, agency founders',
      SEARCH_INTENT: 'Informational & practical implementation guide'
    }
  },
  {
    id: 'write-youtube-script',
    title: 'High-Retention YouTube Video Script with Visual Directives',
    category: 'Writing',
    description: 'Hooks viewers in the first 5 seconds, eliminates dead air, and drives average view duration (AVD).',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['YouTube', 'Video Creation', 'Storytelling', 'Retention'],
    promptTemplate: `Act as a professional YouTube scriptwriter for channels with over 1 Million subscribers (like Ali Abdaal or MrWhosetheboss). Write a full video script for:

Video Title: [VIDEO_TITLE]
Target Video Length: [TARGET_LENGTH]
Core Message: [CORE_MESSAGE]

Script Layout:
Create a two-column format:
- [Visual / B-Roll / SFX / On-Screen Graphic]: Exact editing cues, zoom-ins, screen recordings, sound effects.
- [Host Dialogue]: Natural, conversational speech without corporate jargon.

Include:
1. The 0-30 Second Hook: Immediately validate the title/thumbnail promise without slow introductions.
2. The "Bridge": Setup the stakes and explain why this matters.
3. Chapters 1 to 3: High-value insights with mini-cliffhangers between segments.
4. Retention Reset: A visual/tonal shift at the 50% mark to prevent drop-off.
5. End Screen CTA: Seamlessly guide viewers to watch the next recommended video.`,
    defaultVariables: {
      VIDEO_TITLE: 'How to Build and Monetize 5 Micro-SaaS Apps in 2026',
      TARGET_LENGTH: '10 to 12 minutes',
      CORE_MESSAGE: 'Solo developers can replace their 9-5 income using AI coding agents, Supabase, and Stripe.'
    }
  },
  {
    id: 'write-cold-email',
    title: 'Hyper-Personalized B2B Cold Email with High Response Rate',
    category: 'Writing',
    description: 'Generates non-spammy, high-converting cold emails that get opened and booked into sales calls.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Sales', 'Outreach', 'B2B', 'Email Marketing'],
    promptTemplate: `Act as an elite B2B sales development expert who achieves 35%+ reply rates. Write a high-converting cold email sequence for:

My Offer / Service: [MY_OFFER]
Prospect's Role & Industry: [PROSPECT_ROLE_AND_INDUSTRY]
Prospect's Core Pain Point: [PROSPECT_PAIN_POINT]
Value Proposition / Proof: [PROOF_OR_METRICS]

Requirements:
- Under 100 words total.
- Compelling, non-clickbait Subject Line (under 5 words, lowercase style).
- Personalized observation hook showing we researched their company.
- Low-friction Call to Action (e.g. "Open to seeing a 2-minute video breakdown?" rather than asking for a 30-minute call).
- Follow-up email template (sent 3 days later if no reply).`,
    defaultVariables: {
      MY_OFFER: 'AI Workflow Automation that saves e-commerce brands 20 hours/week on customer support.',
      PROSPECT_ROLE_AND_INDUSTRY: 'Head of Operations at D2C Fashion Brands doing $2M-$10M ARR',
      PROSPECT_PAIN_POINT: 'Slow response times during weekend flash sales leading to cart abandonment.',
      PROOF_OR_METRICS: 'Reduced ticket backlog by 78% for Brand X in 14 days.'
    }
  },
  {
    id: 'write-newsletter',
    title: 'Engaging Weekly Newsletter Deep-Dive (Substack / Beehiiv)',
    category: 'Writing',
    description: 'Curates rich, personal, insight-dense newsletters that build fierce subscriber loyalty.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Newsletter', 'Substack', 'Beehiiv', 'Email'],
    promptTemplate: `Act as a top tech & business newsletter curator (in the style of The Hustle, Morning Brew, or Lenny\'s Newsletter). Write this week\'s edition on:

Theme / Big Idea: [NEWSLETTER_THEME]
Target Audience: [TARGET_AUDIENCE]
Tone: [TONE]

Structure:
1. Catchy Subject Line + Preview Text combination.
2. The "TL;DR" Quick Take (3 bullet points).
3. The Deep-Dive Story: 500 words breaking down the core concept with real-world examples and contrarian opinions.
4. "3 Curated Links / Tools to Check Out": Brief, high-value recommendations.
5. Reader Poll or Interactive Question.`,
    defaultVariables: {
      NEWSLETTER_THEME: 'Why AI coding agents are replacing boilerplate coding and shifting engineering to system specification.',
      TARGET_AUDIENCE: 'Software engineers, founders, tech enthusiasts',
      TONE: 'Witty, insightful, sharp, forward-looking'
    }
  },
  {
    id: 'write-book-chapter',
    title: 'Non-Fiction Book Chapter Outline & Opening Hook',
    category: 'Writing',
    description: 'Structures gripping non-fiction book chapters with narrative hooks, case studies, and takeaways.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Authors', 'Books', 'Publishing', 'Writing'],
    promptTemplate: `Act as a New York Times bestselling non-fiction book editor (like Malcolm Gladwell or James Clear). Help outline and write the opening section for a book chapter:

Book Topic: [BOOK_TOPIC]
Chapter Title / Subject: [CHAPTER_SUBJECT]
Key Lesson: [KEY_LESSON]

Deliver:
1. The Opening Narrative Anecdote: A compelling, suspenseful real-world historical or personal story illustrating the concept.
2. The Conceptual Framework: Break down the psychological or strategic mechanism at play.
3. Detailed Chapter Section Breakdown with H2/H3 subheadings.
4. 3 Actionable Exercises for the reader at the end of the chapter.`,
    defaultVariables: {
      BOOK_TOPIC: 'The Architecture of Focus in an Age of Hyper-Distraction',
      CHAPTER_SUBJECT: 'Chapter 4: The 90-Minute Dopamine Reset',
      KEY_LESSON: 'Ultradian rhythms dictate peak cognitive output far more than willpower.'
    }
  },

  // ================= MARKETING & SEO =================
  {
    id: 'mkt-ad-copy-framework',
    title: 'High-Converting Meta & Google Ads (AIDA & PAS Framework)',
    category: 'Marketing',
    description: 'Generates 3 ad copy variations tailored to cold, warm, and retargeting traffic.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Advertising', 'Facebook Ads', 'Google Ads', 'PPC', 'Copywriting'],
    promptTemplate: `Act as an elite Direct Response Copywriter who has spent over $10M in profitable paid ads. Write 3 distinct ad copy variations for:

Product / Service: [PRODUCT_OR_SERVICE]
Target Customer Persona: [TARGET_PERSONA]
Primary Offer / Discount: [PRIMARY_OFFER]
Major Objections to Overcome: [CUSTOMER_OBJECTIONS]

Generate:
- Variation 1 (PAS Framework: Problem - Agitation - Solution) for Cold Audiences.
- Variation 2 (AIDA Framework: Attention - Interest - Desire - Action) for Warm Audiences.
- Variation 3 (Short-Form Urgency & Social Proof) for Retargeting / Abandoned Cart.

For each variation provide:
- Primary Text / Body Copy.
- 3 Headline Options (high CTR).
- Suggested Visual Concept (Video hook or image style).
- Call to Action (CTA) button recommendation.`,
    defaultVariables: {
      PRODUCT_OR_SERVICE: 'Ergonomic Standing Desk with Memory Presets & Wireless Charging',
      TARGET_PERSONA: 'Remote workers, developers, and designers suffering from lower back pain',
      PRIMARY_OFFER: '$100 off + Free Ergonomic Cable Management Spine Kit',
      CUSTOMER_OBJECTIONS: 'Too expensive, hard to assemble, motor might break quickly'
    }
  },
  {
    id: 'mkt-landing-page',
    title: 'High-Converting Landing Page Copy & Wireframe Strategy',
    category: 'Marketing',
    description: 'Full sales page copy including hero section, social proof, feature-benefit grid, and FAQ.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['CRO', 'Landing Page', 'Web Design', 'SaaS', 'Sales'],
    promptTemplate: `Act as a top Conversion Rate Optimization (CRO) and Landing Page Copywriter. Write complete, high-converting copy for a modern landing page:

Product / SaaS: [PRODUCT_NAME_AND_PURPOSE]
Target Audience: [TARGET_AUDIENCE]
Competitors / Alternatives: [COMPETITORS]
Key Differentiator: [KEY_DIFFERENTIATOR]

Section-by-Section Copy Required:
1. Above-the-Fold Hero Section:
   - Eyebrow badge / Social proof stat.
   - H1 Headline (Clear > Clever).
   - Supporting Subheadline.
   - Primary and Secondary CTA buttons with micro-copy (e.g. "No credit card required • 2 min setup").
2. "The Pain You Know" Section: 3 agitating problems the user deals with today.
3. "The Better Way" Feature-Benefit Matrix: 3 core features translated into emotional & financial outcomes.
4. Interactive Calculator / ROI Showcase concept.
5. Objections Buster FAQ (5 critical questions answered).
6. Final Call to Action banner.`,
    defaultVariables: {
      PRODUCT_NAME_AND_PURPOSE: 'InvoicePro: AI-Powered Invoice & GST Billing Software for Small Business Owners',
      TARGET_AUDIENCE: 'Freelancers, digital agency owners, retail merchants, consultants',
      COMPETITORS: 'FreshBooks, Zoho Invoice, Excel spreadsheets',
      KEY_DIFFERENTIATOR: 'Instant WhatsApp direct invoice delivery, 100% in-browser offline privacy, zero monthly subscriptions'
    }
  },
  {
    id: 'mkt-product-hunt',
    title: 'Product Hunt Launch Playbook, Taglines & First Comment',
    category: 'Marketing',
    description: 'Optimizes Product Hunt launch assets for Top 3 Product of the Day visibility.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Product Hunt', 'Startup', 'Launch', 'Growth Hacking'],
    promptTemplate: `Act as a veteran startup founder who has won "Product of the Day" on Product Hunt multiple times. Create our Product Hunt launch assets:

Product Name: [PRODUCT_NAME]
What it does in 1 sentence: [ONE_SENTENCE_PITCH]
Key Features: [KEY_FEATURES]
Special Launch Day Deal: [LAUNCH_DEAL]

Deliver:
1. Tagline: 5 catchy options under 60 characters explaining value instantly.
2. Maker's First Comment (The story behind why we built it, the struggle, vision, and welcoming community feedback).
3. 5 Teaser Tweets / LinkedIn updates to build hype 24 hours prior to launch.
4. FAQ responses ready for potential tough questions in the comments.`,
    defaultVariables: {
      PRODUCT_NAME: 'Ansar Multi-Tool Web App',
      ONE_SENTENCE_PITCH: '50+ free in-browser privacy-first utility tools: PDF editing, image conversion, ATS resume builder, and biodata maker.',
      KEY_FEATURES: '100% client-side privacy, zero watermarks, no account needed, blazing fast WebAssembly performance.',
      LAUNCH_DEAL: '100% Free Forever with open community feedback roadmap'
    }
  },

  // ================= CAREER & JOBS =================
  {
    id: 'career-ats-resume',
    title: 'ATS Resume Bullet Point Enhancer (Google X-Y-Z Formula)',
    category: 'Career',
    description: 'Upgrades boring job duty bullets into high-impact accomplishments using Google\'s X-Y-Z formula.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Resume', 'ATS', 'Job Search', 'Career Growth'],
    promptTemplate: `Act as an executive recruiter and former Google hiring manager. Transform my weak resume bullet points into high-impact, quantifiable accomplishment statements using Google\'s proven formula: "Accomplished [X], as measured by [Y], by doing [Z]".

Target Role: [TARGET_JOB_TITLE]
Industry: [INDUSTRY]

My Current Weak Bullet Points:
[PASTE_BULLET_POINTS]

Deliver:
1. 3 upgraded bullet points for each input, packed with strong action verbs and metrics.
2. Keyword optimization recommendations to bypass modern ATS scanners for [TARGET_JOB_TITLE].
3. Advice on metrics to estimate if exact numbers aren't known.`,
    defaultVariables: {
      TARGET_JOB_TITLE: 'Senior Full-Stack Software Engineer',
      INDUSTRY: 'FinTech / SaaS',
      PASTE_BULLET_POINTS: '- Responsible for writing API endpoints in Node.js.\n- Worked on fixing frontend bugs in React.\n- Helped migrate database tables to PostgreSQL.'
    }
  },
  {
    id: 'career-mock-interview',
    title: 'Tough Behavioral Interview Simulator (STAR Method)',
    category: 'Career',
    description: 'Conducts a realistic mock interview with rigorous feedback on answers using the STAR method.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Interview', 'Mock Interview', 'STAR Method', 'Career'],
    promptTemplate: `Act as a hiring manager conducting a rigorous behavioral interview for a [JOB_TITLE] role at [COMPANY_TYPE].

Please interview me one question at a time. Do NOT output all questions at once.

Interview Flow:
1. Ask me the first behavioral question focused on [FOCUS_AREA_CONFLICT_OR_LEADERSHIP].
2. Wait for my response.
3. After I respond, critique my answer based on the STAR method (Situation, Task, Action, Result):
   - What was strong.
   - What was missing or vague (e.g. lacking quantifiable impact or unclear personal ownership).
   - Provide a revised example answer demonstrating executive presence.
4. Then ask the next interview question.

Start now by welcoming me and asking Question #1.`,
    defaultVariables: {
      JOB_TITLE: 'Engineering Manager',
      COMPANY_TYPE: 'High-growth Series B Tech Startup',
      FOCUS_AREA_CONFLICT_OR_LEADERSHIP: 'Handling cross-functional engineering conflict and missed deadlines'
    }
  },
  {
    id: 'career-salary-negotiation',
    title: 'Executive Salary Negotiation Script & Counter-Offer',
    category: 'Career',
    description: 'Crafts confident, polite, and persuasive counter-offers to maximize base salary, equity, and perks.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Salary', 'Negotiation', 'Career', 'Compensation'],
    promptTemplate: `Act as a seasoned executive career coach. Help me negotiate a job offer to maximize total compensation without risking the offer being rescinded.

Details:
- Role & Company: [ROLE_AND_COMPANY]
- Initial Offer: [INITIAL_OFFER]
- My Target Compensation: [TARGET_COMPENSATION]
- Market Data / My Leverage: [LEVERAGE_OR_OTHER_OFFERS]

Provide:
1. Phone Call Script: What to say verbatim when the recruiter calls with the initial offer (expressing gratitude while setting up negotiation).
2. Written Counter-Offer Email: Professional, data-backed email proposing specific adjustments to base salary, signing bonus, or equity.
3. Scenario Responses: How to respond if they say "This is our final budget" or "We cannot adjust base salary".`,
    defaultVariables: {
      ROLE_AND_COMPANY: 'Senior Product Manager at a B2B SaaS company',
      INITIAL_OFFER: '$140,000 Base Salary + 10% Bonus + 15,000 Stock Options',
      TARGET_COMPENSATION: '$160,000 Base Salary OR $20,000 Signing Bonus',
      LEVERAGE_OR_OTHER_OFFERS: '5 years direct domain experience, competing final interview at another tech firm'
    }
  },

  // ================= STUDY & ACADEMICS =================
  {
    id: 'study-feynman-technique',
    title: 'The Feynman Technique Deep Concept Simplifier',
    category: 'Study',
    description: 'Explains complex scientific, technical, or mathematical topics with simple, unforgettable analogies.',
    targetModels: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['Learning', 'Feynman', 'Academics', 'Mental Models'],
    promptTemplate: `Act as Richard Feynman, the Nobel Prize-winning physicist known for explaining complex topics with absolute clarity and intuitive analogies.

Topic to Explain: [COMPLEX_TOPIC]
My Current Knowledge Level: [KNOWLEDGE_LEVEL]

Please teach me this concept using the 4 steps of the Feynman Technique:
1. The 10-Year-Old Explanation: Explain the fundamental intuition using a vivid, everyday real-world analogy. Zero jargon permitted.
2. The Mechanical Breakdown: Now introduce the technical terms step-by-step, showing how each piece of the machine works.
3. Spotting the Gaps: Highlight the 2 most common misconceptions students make when studying this.
4. Self-Test Question: Ask me a conceptual question to test whether I truly understand the core principle.`,
    defaultVariables: {
      COMPLEX_TOPIC: 'How Large Language Models (Transformers & Attention Mechanism) actually generate text',
      KNOWLEDGE_LEVEL: 'Beginner programmer with basic understanding of computers'
    }
  },
  {
    id: 'study-paper-summarizer',
    title: 'Scientific Research Paper Deconstructor & Executive Summary',
    category: 'Study',
    description: 'Extracts methodology, sample sizes, primary findings, and limitations from academic papers.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Research', 'Academia', 'Literature Review', 'Science'],
    promptTemplate: `Act as a senior academic researcher and peer reviewer. Analyze the following scientific paper text or abstract:

\`\`\`
[PASTE_PAPER_TEXT_OR_ABSTRACT]
\`\`\`

Deliver a structured academic breakdown:
1. Core Research Question: What specific hypothesis was tested?
2. Methodology & Dataset: What was the study design, sample size (n), duration, and control group?
3. Key Findings (Statistical Significance): What were the primary effect sizes, p-values, or benchmarks?
4. Critical Limitations & Confounders: What biases, sample constraints, or unaddressed variables exist?
5. Practical Takeaways: How does this change real-world application in the field?`,
    defaultVariables: {
      PASTE_PAPER_TEXT_OR_ABSTRACT: 'Paste the abstract or introduction of any medical, AI, or sociological research paper here...'
    }
  },
  {
    id: 'study-flashcards',
    title: 'Active Recall Flashcard & Spaced Repetition Builder',
    category: 'Study',
    description: 'Builds question-and-answer pairs optimized for Anki and active recall studying.',
    targetModels: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['Anki', 'Flashcards', 'Active Recall', 'Exam Prep'],
    promptTemplate: `Act as an expert in cognitive learning science and spaced repetition. Convert the following study material into high-retention Active Recall Flashcards:

Study Notes / Subject:
[PASTE_NOTES_OR_SYLLABUS]

Formatting Rules:
- Generate 10-15 flashcards following the Minimum Information Principle (each question tests ONE specific fact).
- Format as CSV or tab-delimited text ready for direct import into Anki (Front;Back).
- Categorize into: Conceptual Definitions, Real-World Application, and Edge Cases.`,
    defaultVariables: {
      PASTE_NOTES_OR_SYLLABUS: 'Mitosis vs Meiosis stages, chromosome counts, diploid vs haploid cells, crossing over phenomenon.'
    }
  },

  // ================= AI ART & VISUALS =================
  {
    id: 'art-midjourney-photoreal',
    title: 'Midjourney v6 Cinematic Photorealistic Studio Portrait',
    category: 'Visuals',
    description: 'Generates breathtaking photographic prompt formulas with camera bodies, lenses, and cinematic lighting.',
    targetModels: ['Midjourney', 'Flux'],
    tags: ['Midjourney', 'Photography', 'Cinematic', 'Portraits'],
    promptTemplate: `Act as a master cinematographer and editorial photographer. Create 3 ultra-detailed Midjourney v6 / Flux prompt formulas for:

Subject / Scene: [SUBJECT_OR_PERSON]
Setting & Atmosphere: [SETTING_AND_MOOD]
Visual Style: [VISUAL_STYLE]

Formula to construct for each prompt:
[Subject Description], [Camera Body & Lens e.g. Hasselblad H6D-100c, 85mm f/1.2 lens], [Lighting Setup e.g. Rembrant lighting, golden hour volumetric haze, soft octabox backlight], [Color Grading & Film Stock e.g. Kodak Portra 400 tones, award-winning editorial look], [Texture details e.g. natural skin pores, ray-traced reflections] --ar [ASPECT_RATIO] --v 6.1 --style raw`,
    defaultVariables: {
      SUBJECT_OR_PERSON: 'An elderly Kashmiri craftsman hand-carving intricate walnut wood in his traditional workshop',
      SETTING_AND_MOOD: 'Moody afternoon dust motes floating through antique wooden lattice windows, nostalgic and reverent',
      VISUAL_STYLE: 'National Geographic award-winning documentary photography',
      ASPECT_RATIO: '16:9'
    }
  },
  {
    id: 'art-3d-isometric-icon',
    title: '3D Isometric Glossy Icon & App Asset Prompt',
    category: 'Visuals',
    description: 'Produces modern, vibrant 3D clay/glass isometric renders for websites, mobile apps, and marketing.',
    targetModels: ['Midjourney', 'Flux'],
    tags: ['3D', 'Isometric', 'Icons', 'Blender', 'UI/UX'],
    promptTemplate: `Act as a 3D digital artist specializing in Blender and Cinema 4D renders. Generate 3 Midjourney prompts for:

Icon Concept: [ICON_CONCEPT]
Color Palette: [COLOR_PALETTE]
Material Finish: [MATERIAL_FINISH]

Prompt Structure:
Cute 3D isometric [ICON_CONCEPT], smooth rounded corners, [MATERIAL_FINISH], vibrant [COLOR_PALETTE] gradient, octane render, ray tracing, studio softbox lighting, clean solid pastel background, Figma app asset style, trending on Dribbble, 8k resolution --ar 1:1 --v 6.1`,
    defaultVariables: {
      ICON_CONCEPT: 'Cybersecurity shield with a glowing holographic padlock and golden verification stars',
      COLOR_PALETTE: 'Electric violet, neon cyan, and frosted emerald',
      MATERIAL_FINISH: 'Glossy acrylic glass and polished metallic brass'
    }
  },
  {
    id: 'art-minimalist-vector-logo',
    title: 'Modern Minimalist Vector Logo & Brand Identity Prompt',
    category: 'Visuals',
    description: 'Creates clean geometric vector emblems with negative space and flat design aesthetics.',
    targetModels: ['Midjourney', 'Flux'],
    tags: ['Logo', 'Vector', 'Branding', 'Minimalism'],
    promptTemplate: `Act as an award-winning brand identity designer (in the style of Paul Rand or Pentagram). Write 3 high-precision AI image prompts for:

Company / Brand Name: [BRAND_NAME]
Industry: [INDUSTRY]
Core Values / Symbols: [SYMBOLS_OR_VALUES]

Prompt Structure:
Minimalist vector logo for [BRAND_NAME], [SYMBOLS_OR_VALUES], clever use of negative space, modern flat geometric shapes, swiss design style, monochrome high contrast on pure white background, no gradients, clean lines, scalable SVG aesthetic --no photorealistic, shading, 3d, realistic --v 6.1`,
    defaultVariables: {
      BRAND_NAME: 'Nexus Health',
      INDUSTRY: 'Digital Telemedicine & Patient Diagnostics',
      SYMBOLS_OR_VALUES: 'Interlocking pulse heartbeat and medical cross combined in a single continuous line'
    }
  },
  {
    id: 'art-festive-portrait',
    title: 'High-Resolution Traditional Festive / Wedding Portrait',
    category: 'Visuals',
    description: 'Creates breathtaking photorealistic festive cultural portraits with intricate mirror-work, jewelry, and bokeh.',
    targetModels: ['Midjourney', 'Flux'],
    tags: ['Festive', 'Traditional', 'Couture', 'Portrait', 'Garba'],
    promptTemplate: `Create a high-resolution, photorealistic full-body festive [CELEBRATION_TYPE] portrait based on [SUBJECT_DESCRIPTION]. Preserve natural skin tone, expressive eyes, and proportions. 

Outfit & Styling:
She is wearing a luxurious [OUTFIT_STYLE] with intricate multicolor mirror-work embroidery, floral motifs, heavy embellished borders, and an embroidered [DUPATTA_COLOR] draped over one shoulder. Accessorized with traditional oxidized-silver jhumka earrings, a delicate choker necklace, matching bangles, and a subtle bindi. Hair styled in long voluminous soft curls with tiny white flowers.

Setting & Atmosphere:
Set at a vibrant nighttime [EVENT_ATMOSPHERE] with colorful fabric canopies, glowing string fairy lights, warm lanterns, festive dancing in the soft bokeh background, 35mm lens, f/1.4 shallow depth of field, 8k resolution --ar 3:4 --v 6.1 --style raw`,
    defaultVariables: {
      CELEBRATION_TYPE: 'Navratri Garba / Festive Wedding Sangeet',
      SUBJECT_DESCRIPTION: 'A joyful young South Asian woman holding decorated dandiya sticks in a graceful festive pose',
      OUTFIT_STYLE: 'Ivory-white & deep purple Gujarati lehenga choli',
      DUPATTA_COLOR: 'Mustard-yellow sheer dupatta with gold lace',
      EVENT_ATMOSPHERE: 'Outdoor celebration garden at dusk with illuminated lanterns and festive crowd'
    }
  },
  {
    id: 'art-3d-pixar-avatar',
    title: 'Cute 3D Disney / Pixar Animated Character Avatar',
    category: 'Visuals',
    description: 'Generates endearing 3D animated avatars with Pixar/DreamWorks character styling and soft lighting.',
    targetModels: ['Midjourney', 'Flux'],
    tags: ['Pixar', '3D Avatar', 'Character Design', 'Animation'],
    promptTemplate: `Act as a 3D character animator at Pixar or Disney Animation Studios. Create a vibrant 3D character portrait:

Character Concept: [CHARACTER_CONCEPT]
Outfit & Accessories: [OUTFIT_AND_ACCESSORIES]
Expression & Pose: [EXPRESSION_AND_POSE]

Prompt Construction:
Cute 3D character of [CHARACTER_CONCEPT], Pixar 3D animation style, adorable expressive eyes, smooth stylized skin texture with subsurface scattering, wearing [OUTFIT_AND_ACCESSORIES], [EXPRESSION_AND_POSE], soft rim lighting, warm pastel background, Cinema 4D, Octane render, trending on Artstation, 8k resolution --ar 1:1 --v 6.1`,
    defaultVariables: {
      CHARACTER_CONCEPT: 'A cheerful young female software developer sitting at a cozy desk with a steaming coffee mug and a smiling robot cat',
      OUTFIT_AND_ACCESSORIES: 'An oversized turquoise hoodie, stylish round glasses, and colorful developer stickers',
      EXPRESSION_AND_POSE: 'Warm friendly smile, resting chin in hand looking curiously at the viewer'
    }
  },
  {
    id: 'art-youtube-thumbnail',
    title: 'Viral High-CTR YouTube Thumbnail Graphic',
    category: 'Visuals',
    description: 'Generates dramatic, high-contrast, attention-grabbing thumbnail compositions that maximize click-through rate.',
    targetModels: ['Midjourney', 'Flux'],
    tags: ['YouTube', 'Thumbnails', 'CTR', 'Graphic Design'],
    promptTemplate: `Act as a master YouTube thumbnail designer for top creators (like MrBeast, MKBHD, or Veritasium). Create an ultra-high CTR thumbnail prompt:

Video Concept / Hook: [VIDEO_HOOK]
Focal Subject: [FOCAL_SUBJECT]
Background Contrast: [BACKGROUND_CONTRAST]

Prompt Syntax:
High-energy viral YouTube thumbnail composition, [FOCAL_SUBJECT], dramatic rim lighting, hyper-expressive facial reaction, intense sharp eyes, [BACKGROUND_CONTRAST], bold cinematic lighting, saturated colors, volumetric fog, wide angle 16mm lens, crisp details, optimized for small mobile screens, high contrast visual hierarchy --ar 16:9 --v 6.1`,
    defaultVariables: {
      VIDEO_HOOK: 'I Built a $100,000 AI Agent in 24 Hours',
      FOCAL_SUBJECT: 'Shocked young tech entrepreneur holding a glowing holographic AI cube with floating code streams',
      BACKGROUND_CONTRAST: 'High-contrast split background: messy messy bedroom on left vs luxury futuristic glass penthouse on right'
    }
  },
  {
    id: 'art-ecommerce-product',
    title: 'Commercial E-Commerce Luxury Product Studio Shot',
    category: 'Visuals',
    description: 'Generates advertising-ready luxury commercial product shots with floating splashes, marble, and studio lighting.',
    targetModels: ['Midjourney', 'Flux'],
    tags: ['Commercial', 'Product Photography', 'Advertising', 'E-commerce'],
    promptTemplate: `Act as a high-end commercial product photographer for Vogue and Apple. Generate a luxury advertising product shot:

Product: [PRODUCT_NAME_AND_TYPE]
Environment / Pedestal: [PEDESTAL_AND_SCENERY]
Lighting & Props: [LIGHTING_AND_PROPS]

Prompt Syntax:
Award-winning commercial product photography of [PRODUCT_NAME_AND_TYPE], resting on [PEDESTAL_AND_SCENERY], surrounded by [LIGHTING_AND_PROPS], crystal-clear water droplets, hyper-detailed reflections, Hasselblad H6D-100c, 100mm macro lens, f/8 sharpness, softbox studio backlight, clean minimalist editorial layout, 8k resolution --ar 4:5 --v 6.1`,
    defaultVariables: {
      PRODUCT_NAME_AND_TYPE: 'Minimalist matte-black matte glass perfume bottle with gold engraved typography',
      PEDESTAL_AND_SCENERY: 'A smooth circular white Carrara marble pedestal emerging from calm rippling water',
      LIGHTING_AND_PROPS: 'Soft golden morning sunlight rays filtering through palm shadows, gentle floating amber mist'
    }
  },

  // ================= BUSINESS & FREELANCING =================
  {
    id: 'biz-upwork-proposal',
    title: 'Upwork / Freelance Proposal That Closes High-Ticket Clients',
    category: 'Business',
    description: 'Wins client bids by addressing their hidden worries in the first 2 sentences with zero generic fluff.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Freelancing', 'Upwork', 'Proposals', 'Sales', 'Clients'],
    promptTemplate: `Act as a top-rated freelance contractor who has generated over $300,000 on Upwork. Write a winning proposal for the following job posting:

Client Job Description:
"""
[PASTE_JOB_DESCRIPTION]
"""

My Relevant Skills & Portfolio: [MY_SKILLS_AND_RELEVANT_PROJECTS]
My Solution / Approach: [PROPOSED_SOLUTION]

Proposal Guidelines:
- Hook (Lines 1-2): Prove I read the entire post without saying "I read your post with great interest". Immediately reference their specific bottleneck.
- The Diagnostic: Explain what caused their issue or what the standard rookie mistake is.
- The 3-Step Action Plan: Exactly what I will do on Day 1, Day 3, and Day 7.
- Relevant Proof: 1 sentence linking to a similar project I completed.
- Frictionless Closing Question to trigger an interview.`,
    defaultVariables: {
      PASTE_JOB_DESCRIPTION: 'Need Next.js developer to fix slow page load speeds on our e-commerce site. Lighthouse score is currently 32 on mobile and we are losing sales.',
      MY_SKILLS_AND_RELEVANT_PROJECTS: 'Next.js 14/15 performance expert. Migrated 10+ clients to 95+ mobile Lighthouse scores via image optimization and dynamic import bundle splitting.',
      PROPOSED_SOLUTION: 'Audit third-party scripts, convert unoptimized PNGs to WebP/AVIF, and implement server component data streaming.'
    }
  },
  {
    id: 'biz-saas-pricing',
    title: 'SaaS Pricing Strategy & 3-Tier Value Packaging',
    category: 'Business',
    description: 'Structures Starter, Pro, and Enterprise pricing tiers with optimal value metrics.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Pricing', 'SaaS', 'Monetization', 'Business Model'],
    promptTemplate: `Act as a monetization consultant for high-growth SaaS startups (in the style of Patrick Campbell / ProfitWell). Design an optimal 3-tier pricing strategy for:

Product Description: [PRODUCT_DESCRIPTION]
Primary Customer Persona: [TARGET_CUSTOMER]
Value Metric (What unit scales with customer success?): [VALUE_METRIC]

Deliver:
1. Tier Packaging Breakdown:
   - Tier 1: Starter / Hobbyist (Price point, limits, target user).
   - Tier 2: Pro / Growth (The "Anchor Tier" where 70% of revenue should come from).
   - Tier 3: Enterprise / Agency (High ACV with custom SLAs, security, SSO).
2. The Psychological Decoy: How features are arranged to make Tier 2 the obvious choice.
3. Add-on / Expansion Revenue Opportunities.
4. Annual vs. Monthly discount strategy.`,
    defaultVariables: {
      PRODUCT_DESCRIPTION: 'AI automated video repurposing tool that turns long podcasts into 15 viral TikToks/Reels with auto-captions.',
      TARGET_CUSTOMER: 'YouTubers, podcast agencies, and marketing teams',
      VALUE_METRIC: 'Minutes of video processed per month or number of exported clips'
    }
  },

  // ================= PRODUCTIVITY & LIFE =================
  {
    id: 'prod-eisenhower-matrix',
    title: 'Daily Chaos to Eisenhower Matrix & Time-Boxed Schedule',
    category: 'Productivity',
    description: 'Turns an overwhelming brain-dump of tasks into prioritized quadrants and time-blocked calendar slots.',
    targetModels: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['Productivity', 'Time Management', 'Deep Work', 'Organization'],
    promptTemplate: `Act as an executive productivity coach. I am feeling overwhelmed with the following messy brain dump of tasks and obligations today:

My Tasks & Obligations:
"""
[PASTE_BRAIN_DUMP]
"""

Working Hours Available: [AVAILABLE_HOURS]
Peak Energy Time: [PEAK_ENERGY_HOURS]

Please organize this for me:
1. The Eisenhower Matrix Categorization:
   - Quadrant 1 (Urgent & Important - Do First).
   - Quadrant 2 (Not Urgent but Important - Schedule for Deep Work).
   - Quadrant 3 (Urgent but Not Important - Delegate or Batch).
   - Quadrant 4 (Not Urgent & Not Important - Eliminate).
2. Time-Blocked Daily Schedule (9:00 AM to 5:00 PM) matching high-cognitive load tasks with my peak energy hours.
3. The Single Most Important Task (The "Lead Domino" that makes everything else easier).`,
    defaultVariables: {
      PASTE_BRAIN_DUMP: 'Fix bug on staging server, reply to 25 unread emails, prepare quarterly board slide deck, buy groceries, schedule dentist appointment, review pull request from junior dev, workout, call mom, research competitor pricing.',
      AVAILABLE_HOURS: '8 Hours (9:00 AM - 5:00 PM)',
      PEAK_ENERGY_HOURS: 'Mornings between 9:00 AM and 12:00 PM'
    }
  },
  {
    id: 'prod-meeting-notes',
    title: 'Messy Meeting Transcript to Action Items & Executive Brief',
    category: 'Productivity',
    description: 'Filters meeting transcripts into key decisions made, owners, deadlines, and open questions.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Meetings', 'Summaries', 'Executive Assistant', 'Notes'],
    promptTemplate: `Act as a Chief of Staff at a Fortune 500 company. Distill the following unstructured meeting notes or transcript into an actionable executive summary:

Meeting Context: [MEETING_NAME_AND_PARTICIPANTS]
Rough Notes / Transcript:
"""
[PASTE_ROUGH_NOTES]
"""

Provide:
1. Executive TL;DR (3 sentences on what was discussed and the primary outcome).
2. Key Decisions Made (Bullet points with clear consensus noted).
3. Action Items Matrix:
   | Action Item | Owner | Deadline | Priority |
4. Unresolved Topics / Open Questions that require follow-up.`,
    defaultVariables: {
      MEETING_NAME_AND_PARTICIPANTS: 'Product Roadmap Sync (Sarah - VP Product, Dave - Tech Lead, Omar - Marketing)',
      PASTE_ROUGH_NOTES: 'Sarah said we must launch mobile app by Q3. Dave said backend is not ready unless we cut offline mode. Omar agreed we can delay offline mode if push notifications work. Sarah will talk to CEO on Friday. Dave needs 2 more contractors.'
    }
  },
  {
    id: 'code-git-wizard',
    title: 'Git Merge Conflict & Version Control Savior',
    category: 'Coding',
    description: 'Resolves complex merge conflicts, interactive rebases, detached HEADs, and untangled commits.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Git', 'DevOps', 'CLI', 'Version Control'],
    promptTemplate: `Act as a Git CLI guru and version control master. I am in a messy Git state:

Situation: [GIT_SITUATION_OR_ERROR]
Current Branch / Status: [GIT_STATUS_OUTPUT]
Intended Goal: [INTENDED_GOAL]

Please provide:
1. Exact, step-by-step terminal commands to safely fix this without losing uncommitted work.
2. An explanation of what each command does under the hood.
3. How to create a safety backup branch before executing the fix.`,
    defaultVariables: {
      GIT_SITUATION_OR_ERROR: 'Rebase conflict on 12 files after rebasing feature branch on top of main branch.',
      GIT_STATUS_OUTPUT: 'interactive rebase in progress; onto abc1234, last command done: pick def5678',
      INTENDED_GOAL: 'Keep our feature changes, accept main branch updates for config files, and cleanly push to GitHub.'
    }
  },
  {
    id: 'write-hook-generator',
    title: '10 Magnetic Hooks & First-Line Openers',
    category: 'Writing',
    description: 'Generates 10 viral opening hooks across curiosity, controversy, data, and vulnerability angles.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Hooks', 'Twitter / X', 'LinkedIn', 'Copywriting', 'Shorts'],
    promptTemplate: `Act as a master viral copywriter. Write 10 high-converting, scroll-stopping first-line hooks for a post about:

Topic: [TOPIC_OR_IDEA]
Target Platform: [PLATFORM]
Target Reader: [TARGET_READER]

Generate 10 distinct hooks categorized by psychological angle:
1. The Counter-Intuitive Truth (Challenges conventional wisdom)
2. The Specific Number / Metric (High credibility)
3. The "I spent X hours so you don't have to" (Time arbitrage)
4. The Vulnerable Mistake (Deep empathy)
5. The Future Prediction / Warning (Urgency)
6. The Simple Analogy (Instant clarity)
7. The Direct Challenge (Ego provoking)
8. The Step-by-Step Blueprint promise
9. The "Secret weapon" angle
10. The Story in Media Res (Starts in the middle of action)`,
    defaultVariables: {
      TOPIC_OR_IDEA: 'Why 90% of solo developers fail to make their first $1,000 online and how to fix distribution',
      PLATFORM: 'Twitter / X & LinkedIn',
      TARGET_READER: 'Indie hackers, junior software engineers, agency owners'
    }
  },
  {
    id: 'mkt-seo-meta-generator',
    title: 'High-CTR SEO Title Tags & Meta Descriptions Generator',
    category: 'Marketing',
    description: 'Creates compelling title tags and meta descriptions formatted to character limits that win clicks on Google.',
    targetModels: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['SEO', 'SERP', 'CTR', 'Meta Tags'],
    promptTemplate: `Act as a Technical SEO Director and conversion specialist. Generate 5 variations of Title Tags and Meta Descriptions for:

Page Topic / Keyword: [PAGE_TOPIC_AND_KEYWORD]
Target Audience: [TARGET_AUDIENCE]
Primary Value Proposition: [PRIMARY_VALUE_PROP]

Rules:
- Title Tags: Exactly 50-60 characters (to avoid truncation in Google SERPs), include main keyword near front, use brackets or separators (| or -).
- Meta Descriptions: Exactly 130-155 characters, include primary and secondary keywords, active voice with a clear CTA.
- Highlight the emotional trigger for each variation (Curiosity, Authority, Speed, Urgency, Completeness).`,
    defaultVariables: {
      PAGE_TOPIC_AND_KEYWORD: 'Free Online PDF to Image Converter',
      TARGET_AUDIENCE: 'Students, office workers, accountants looking for fast conversion',
      PRIMARY_VALUE_PROP: '100% free, no file size limits, runs instantly in your browser with zero sign-up'
    }
  },
  {
    id: 'career-cover-letter',
    title: 'Pain-Point Centered, Non-Boring Cover Letter',
    category: 'Career',
    description: 'Bypasses generic clichés by addressing the company\'s quarterly challenges directly.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Cover Letter', 'Job Application', 'Career', 'Interviews'],
    promptTemplate: `Act as a top career strategist. Write a captivating, modern cover letter that avoids boring clichés like "I am writing to apply for...".

Target Position: [JOB_TITLE]
Target Company: [COMPANY_NAME]
Company\'s Big Goal or Recent News: [COMPANY_GOAL_OR_NEWS]
My Top 2 Career Proof Points: [TOP_PROOF_POINTS]

Structure:
- The Disrupter Opening: Praise a recent achievement of theirs and immediately tie it to my relevant expertise.
- The Diagnostic: Identify the exact problem someone in this role must solve for them this quarter.
- The Evidence: 2 bullet points detailing previous measurable outcomes I created.
- The Cultured Close: Confident, low-ego call to discuss practical strategy.
- Keep strictly under 250 words.`,
    defaultVariables: {
      JOB_TITLE: 'Head of Growth Marketing',
      COMPANY_NAME: 'Fintech Mobile App',
      COMPANY_GOAL_OR_NEWS: 'Recently raised $10M Series A to expand from UK to European markets.',
      TOP_PROOF_POINTS: 'Scaled previous startup from 10k to 250k MAUs at $2.10 CAC; built viral referral loop.'
    }
  },
  {
    id: 'study-socratic-tutor',
    title: 'Socratic Method Deep Learning Coach',
    category: 'Study',
    description: 'Guides you to master difficult problems through thoughtful questions rather than just handing you the answer.',
    targetModels: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['Tutoring', 'Socratic Method', 'Critical Thinking', 'STEM'],
    promptTemplate: `Act as an inspiring university professor using the pure Socratic Method. I want to deeply understand:

Topic / Problem: [TOPIC_OR_PROBLEM]
My Current Understanding: [MY_CURRENT_UNDERSTANDING]

Rules for your responses:
- Do NOT just lecture or give me the final answer immediately.
- Ask me ONE thoughtful, probing question that forces me to think through the underlying mechanics or assumptions.
- Once I answer, point out what was insightful about my reasoning, challenge any hidden gaps, and ask the next sequential question.
- Guide me step-by-step until I discover the core insight myself.

Begin now with your opening greeting and first diagnostic question.`,
    defaultVariables: {
      TOPIC_OR_PROBLEM: 'Why does dividing by zero lead to an undefined result rather than infinity or zero?',
      MY_CURRENT_UNDERSTANDING: 'I know you cannot do it on a calculator, but if you divide by smaller and smaller numbers it gets huge, so why not infinity?'
    }
  },
  {
    id: 'art-flux-cyberpunk',
    title: 'Flux.1 / Midjourney Ultra-Detailed Cyberpunk Street Scene',
    category: 'Visuals',
    description: 'Generates atmospheric, neon-soaked cyberpunk streetscapes with hyper-detailed wet reflections and volumetric fog.',
    targetModels: ['Flux', 'Midjourney'],
    tags: ['Cyberpunk', 'Sci-Fi', 'Environment', 'Raytracing'],
    promptTemplate: `Act as an environment concept artist for high-end sci-fi cinema (Blade Runner 2049, Cyberpunk 2077). Generate 2 cinematic image prompts for:

City / Scene Setting: [CITY_SETTING]
Hero Subject / Focal Point: [FOCAL_POINT]
Atmospheric Conditions: [WEATHER_AND_LIGHTING]

Prompt Syntax:
Cinematic establishing shot of [CITY_SETTING], [FOCAL_POINT], wet asphalt reflections, dense neon signs in holographic kanji and futuristic typography, [WEATHER_AND_LIGHTING], hyper-detailed industrial pipes and wires, 35mm anamorphic lens, shallow depth of field, ray traced global illumination, moody color grading --ar 21:9 --v 6.1 --style raw`,
    defaultVariables: {
      CITY_SETTING: 'Neo-Tokyo alleyway night market packed with steaming ramen stalls and floating delivery drones',
      FOCAL_POINT: 'A lone cyborg courier in an iridescent hooded jacket inspecting a holographic route map',
      WEATHER_AND_LIGHTING: 'Torrential rain pouring over glowing neon reflections in puddles, cyan and magenta rim lighting'
    }
  },
  {
    id: 'biz-contract-agreement',
    title: 'Freelance Master Services Agreement & Scope of Work',
    category: 'Business',
    description: 'Drafts plain-English freelance contracts protecting IP rights, payment milestones, and revision boundaries.',
    targetModels: ['ChatGPT', 'Claude'],
    tags: ['Contracts', 'Legal', 'Freelance', 'SOW', 'Agreements'],
    promptTemplate: `Act as a legal advisor for independent contractors and creative agencies. Draft a plain-English, legally protective Freelance Service Agreement for:

Service Provided: [SERVICE_PROVIDED]
Total Project Fee & Milestones: [FEE_AND_MILESTONES]
Project Timeline: [TIMELINE]
Revision Policy: [REVISION_LIMITS]

Include essential clauses:
1. Detailed Scope of Work & Deliverables.
2. Payment Schedule, Invoicing Terms, and Late Fee clause (1.5% per month).
3. Revisions & Out-of-Scope Work Hourly Add-on Rate.
4. Intellectual Property Rights (transferred ONLY upon full receipt of final payment).
5. Cancellation / Kill Fee (50% of remaining fee if terminated by client).
6. Non-Solicitation and Confidentiality (NDA).`,
    defaultVariables: {
      SERVICE_PROVIDED: 'Full-stack web application development in Next.js, including Stripe integration and responsive UI.',
      FEE_AND_MILESTONES: '$4,000 total: 50% deposit upfront, 25% upon design approval, 25% upon deployment to production.',
      TIMELINE: '4 weeks from deposit date.',
      REVISION_LIMITS: 'Up to 2 rounds of minor revisions within the agreed scope.'
    }
  },

  // ================= LOGO DESIGN STUDIO (LOGODESIGN.NET BENCHMARK) =================
  {
    id: 'logo-minimal-tech-vector',
    title: 'Modern Minimalist Tech & SaaS Vector Logo',
    category: 'Logos',
    description: 'Iconic flat geometric symbol with golden ratio balance, sleek typography, and scalable vector aesthetics on pure white background.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Minimalist', 'Tech', 'SaaS', 'Vector', 'Flat Design'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Minimalist modern vector logo design for [COMPANY_NAME], a [INDUSTRY_OR_NICHE] startup. The logo features a clean geometric icon representing [CORE_SYMBOLIC_CONCEPT], designed with mathematical golden ratio balance and sleek continuous lines. Color palette: [COLOR_PALETTE]. Flat vector graphic style, bold recognizable silhouette, Paul Rand and Dieter Rams aesthetic, isolated on a pure white background, no gradients, no photorealistic shading, clean typography below the icon reading "[COMPANY_NAME]", professional corporate branding --no realistic photo, mockup, 3d, shadows --ar 1:1 --v 6.1`,
    defaultVariables: {
      COMPANY_NAME: 'NexusAI',
      INDUSTRY_OR_NICHE: 'cloud AI infrastructure and automation',
      CORE_SYMBOLIC_CONCEPT: 'an intertwined infinity loop combined with a digital data node',
      COLOR_PALETTE: 'deep cobalt blue and vibrant electric cyan on crisp white'
    }
  },
  {
    id: 'logo-luxury-3d-metallic',
    title: 'Luxury 3D Embossed Metallic Emblem Logo',
    category: 'Logos',
    description: 'Polished 3D gold or platinum metallic emblem with realistic bevels, specular reflections, and debossed texture on a matte black background.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Luxury', '3D Metallic', 'Emblem', 'Gold Foil', 'Real Estate', 'Jewelry'],
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `High-end luxury 3D metallic logo emblem for [BRAND_NAME], an exclusive [LUXURY_INDUSTRY] brand. An ornate [CENTRAL_MOTIF] rendered in polished [METALLIC_FINISH] with subtle beveled chamfer edges, exquisite micro-reflections, and raytraced ambient lighting. The logo is debossed into a premium matte black textured linen card background. Clean elegant serif wordmark beneath reading "[BRAND_NAME]", 8K resolution, octane render style, ultra-premium corporate identity --ar 1:1 --v 6.1 --style raw`,
    defaultVariables: {
      BRAND_NAME: 'Aurelia Crown',
      LUXURY_INDUSTRY: 'haute horlogerie and fine jewelry atelier',
      CENTRAL_MOTIF: 'interlocking heraldic crown and faceted diamond geometric silhouette',
      METALLIC_FINISH: '24k brushed yellow gold with polished mirror bevels'
    }
  },
  {
    id: 'logo-interlocking-monogram',
    title: 'Interlocking Haute Monogram & Lettermark',
    category: 'Logos',
    description: 'Sophisticated interlocking monogram initials with high-fashion luxury proportions inspired by Paris fashion houses.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Monogram', 'Lettermark', 'Fashion', 'Typography', 'Minimalist'],
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Sophisticated interlocking monogram logo combining the letters "[INITIALS]" for [BRAND_NAME], a [BRAND_TYPE] brand. The letters intertwine with flawless geometric harmony, featuring hairline thin and bold contrast strokes in high-fashion editorial style (inspired by Yves Saint Laurent and Gucci). Minimalist monochrome aesthetic, rendered in [COLOR_ACCENT] on a solid [BACKGROUND_COLOR] backdrop. Razor-sharp vector vector lines, luxury symmetry, iconic fashion house lettermark --no clutter, no gradients --ar 1:1 --v 6.1`,
    defaultVariables: {
      INITIALS: 'VK',
      BRAND_NAME: 'Valentin & Knox',
      BRAND_TYPE: 'luxury bespoke tailoring and fragrance house',
      COLOR_ACCENT: 'matte champagne gold',
      BACKGROUND_COLOR: 'pure deep obsidian black'
    }
  },
  {
    id: 'logo-vintage-retro-badge',
    title: 'Vintage Heritage Stamp & Artisan Badge Logo',
    category: 'Logos',
    description: 'Hand-crafted retro circular badge with curved typography, banner ribbons, established date, and artisan woodcut illustration.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Vintage', 'Retro Badge', 'Coffee', 'Barber', 'Brewery', 'Hand-Drawn'],
    imageUrl: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Artisan vintage retro circular badge logo for "[BUSINESS_NAME]", an authentic [BUSINESS_TYPE] established in [ESTABLISHED_YEAR]. The emblem features a detailed hand-drawn [FOCAL_ILLUSTRATION] in traditional woodcut cross-hatch engraving style. Surrounding circular text arching over the top reads "[TOP_BANNER_TEXT]" and bottom ribbon banner reads "[ESTABLISHED_YEAR]". Earthy vintage color scheme: [COLOR_SCHEME]. Distressed texture, classic Americana slab-serif typography, screenprint aesthetic, isolated on an off-white aged paper background --ar 1:1 --v 6.1`,
    defaultVariables: {
      BUSINESS_NAME: 'Iron & Oak Roasters',
      BUSINESS_TYPE: 'specialty craft coffee roastery and espresso bar',
      ESTABLISHED_YEAR: 'EST. 1984',
      FOCAL_ILLUSTRATION: 'vintage steam espresso kettle with coffee leaves and roasting flames',
      COLOR_SCHEME: 'roasted espresso brown, warm amber gold, and cream'
    }
  },
  {
    id: 'logo-abstract-tech-gradient',
    title: 'Dynamic Abstract Gradient Ribbon & Web3 Logo',
    category: 'Logos',
    description: 'Futuristic continuous ribbon origami with flowing neon holographic gradients for AI, FinTech, and crypto platforms.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Web3', 'AI', 'FinTech', 'Gradient', 'Futuristic', 'Crypto'],
    imageUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Cutting-edge dynamic abstract logo for [TECH_VENTURE], a [TECH_CATEGORY] enterprise. The mark is a 3D isometric continuous origami ribbon twisting into an impossible [SHAPE_GEOMETRY], symbolizing infinite computing and connectivity. Smooth radiant gradient transition from [GRADIENT_START] to [GRADIENT_END] with soft outer luminescent cyber glow. Centered on a clean dark slate-950 backdrop, ultra-sharp vector rendering, futuristic sans-serif typography below, Silicon Valley tech brand identity --ar 1:1 --v 6.1`,
    defaultVariables: {
      TECH_VENTURE: 'Synapse Protocol',
      TECH_CATEGORY: 'decentralized AI computing and neural network protocol',
      SHAPE_GEOMETRY: 'Mobius loop forming a stylized letter S',
      GRADIENT_START: 'vibrant neon turquoise cyan',
      GRADIENT_END: 'electric violet and magenta pink'
    }
  },
  {
    id: 'logo-mascot-gaming-esports',
    title: 'Esports & Gaming Dynamic Mascot Logo',
    category: 'Logos',
    description: 'Fierce, stylized illustrated mascot with bold vector stroke outlines, cel-shaded highlights, and dynamic sports typography.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Mascot', 'Esports', 'Gaming', 'Character', 'Illustration'],
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Fierce esports team mascot logo featuring an aggressive [MASCOT_CREATURE] with glowing eyes and razor-sharp geometric contours. High-contrast cel-shading with heavy black vector contour outlines, dramatic rim lighting in [ACCENT_NEON_COLOR], positioned inside a modern angular sports shield crest. Bold, angled sports display typography banner underneath reading "[TEAM_NAME]". Professional gaming franchise branding, vector sticker style, isolated on clean dark background, Twitch and esports tournament ready --ar 1:1 --v 6.1`,
    defaultVariables: {
      MASCOT_CREATURE: 'cybernetic mechanized white tiger baring teeth',
      ACCENT_NEON_COLOR: 'electric neon cyan and amber orange',
      TEAM_NAME: 'ARCTIC CLAW'
    }
  },
  {
    id: 'logo-clever-negative-space',
    title: 'Clever Negative Space Conceptual Mark',
    category: 'Logos',
    description: 'Ingenious dual-meaning silhouette where the negative space inside the primary symbol forms a secondary hidden icon.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Negative Space', 'Clever', 'Minimalist', 'Creative Agency'],
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Award-winning conceptual minimalist logo utilizing negative space for [BRAND_NAME], a [INDUSTRY_DESCRIPTION] firm. The outer silhouette depicts [PRIMARY_SYMBOL], while the negative white space inside cleverly and seamlessly reveals [HIDDEN_SECONDARY_SYMBOL]. Pure two-tone color palette using [TWO_TONE_COLORS]. Brilliant visual pun, highly memorable, Swiss design discipline, crisp vector outlines on solid background, no gradients, no photorealism --ar 1:1 --v 6.1`,
    defaultVariables: {
      BRAND_NAME: 'Horizon Logistics & Air Cargo',
      INDUSTRY_DESCRIPTION: 'global air freight and express courier network',
      PRIMARY_SYMBOL: 'a bold stylized swooping falcon wing',
      HIDDEN_SECONDARY_SYMBOL: 'a sleek commercial cargo jet silhouette in the negative space',
      TWO_TONE_COLORS: 'deep midnight navy blue and crisp white'
    }
  },
  {
    id: 'logo-botanical-watercolor-wellness',
    title: 'Organic Botanical & Watercolor Wellness Logo',
    category: 'Logos',
    description: 'Delicate hand-drawn botanical line art with soft pastel watercolor splash wash and gold foil leaf accents for wellness & spas.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Botanical', 'Watercolor', 'Spa', 'Skincare', 'Beauty', 'Organic'],
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Delicate organic botanical logo emblem for [SPA_OR_BRAND_NAME], an all-natural [WELLNESS_NICHE] brand. Features fine single-needle line art illustration of [PLANT_OR_FLOWER_ELEMENTS], enveloped by a soft translucent watercolor splash wash in [WATERCOLOR_TONES] with subtle metallic gold foil splatters. Elegant modern calligraphy script for the brand name, luxurious Zen atmosphere, clean off-white textured cotton paper background, feminine aesthetic, organic skincare packaging ready --ar 1:1 --v 6.1`,
    defaultVariables: {
      SPA_OR_BRAND_NAME: 'Verdant Glow Naturals',
      WELLNESS_NICHE: 'holistic herbal skincare and aromatherapy studio',
      PLANT_OR_FLOWER_ELEMENTS: 'blooming wild peony branch with eucalyptus and lavender leaves',
      WATERCOLOR_TONES: 'dusty blush rose, sage green, and pastel peach'
    }
  },
  {
    id: 'logo-royal-heraldic-crest',
    title: 'Royal Heraldic Crest & Coat of Arms Logo',
    category: 'Logos',
    description: 'Majestic classical heraldry crest with dual rampant lions, royal crown, filigree shield, and Latin ribbon for law & elite heritage.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Royal Crest', 'Coat of Arms', 'Law Firm', 'Heritage', 'Luxury'],
    imageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Majestic classical heraldic coat of arms crest logo for [INSTITUTION_OR_FIRM], a distinguished [HERITAGE_SECTOR]. The crest features an ornate baroque shield with [SHIELD_CENTRAL_EMBLEM], flanked by [SUPPORTERS_ANIMALS] standing rampant on an acanthus leaf pedestal. Crowned with an antique royal coronet at the top and a flowing parchment ribbon banner at the base inscribed with the motto "[MOTTO_TEXT]". Rendered in [COLOR_THEME] with intricate hand-engraved line details, stately institutional prestige --ar 1:1 --v 6.1`,
    defaultVariables: {
      INSTITUTION_OR_FIRM: 'Sterling & Kensington Chambers',
      HERITAGE_SECTOR: 'international constitutional law and private wealth advisory',
      SHIELD_CENTRAL_EMBLEM: 'a balanced scale of justice crossed by an antique quill and key',
      SUPPORTERS_ANIMALS: 'two noble crowned rampant golden lions',
      MOTTO_TEXT: 'JUSTITIA ET INTEGRITAS',
      COLOR_THEME: 'antique burnished gold, deep British racing green, and ivory'
    }
  },
  {
    id: 'logo-monoline-architecture-realestate',
    title: 'Continuous Monoline Architecture & Real Estate Logo',
    category: 'Logos',
    description: 'Ultra-modern single continuous line stroke forming geometric architectural silhouettes and structural luxury towers.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Monoline', 'Architecture', 'Real Estate', 'Minimalist', 'Line Art'],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Ultra-modern continuous monoline vector logo for [DEVELOPER_NAME], an elite [REAL_ESTATE_NICHE] firm. Designed using a single, uninterrupted uniform stroke width line that flows to form [ARCHITECTURAL_SILHOUETTE]. Perfect geometric angles, spacious kerning, accompanied by a clean geometric sans-serif wordmark reading "[DEVELOPER_NAME]". Rendered in [LINE_COLOR] on a clean [BG_COLOR] backdrop. Architectural drafting precision, Scandinavian minimalism, luxury property branding --ar 1:1 --v 6.1`,
    defaultVariables: {
      DEVELOPER_NAME: 'Vanguard Skyline Developments',
      REAL_ESTATE_NICHE: 'luxury high-rise penthouses and sustainable modern architecture',
      ARCHITECTURAL_SILHOUETTE: 'a soaring minimalist glass skyscraper merging into geometric origami roofs',
      LINE_COLOR: 'warm titanium bronze metallic line',
      BG_COLOR: 'pure crisp white background'
    }
  },
  {
    id: 'logo-artisan-culinary-restaurant',
    title: 'Artisan Food & Gourmet Restaurant Logo',
    category: 'Logos',
    description: 'Charming modern bistro badge combining vintage cutlery, artisanal flame, and warm appetizing culinary aesthetics.',
    targetModels: ['Midjourney', 'Flux', 'DALL-E 3'],
    tags: ['Logo Design', 'Restaurant', 'Food', 'Cafe', 'Bakery', 'Culinary', 'Artisan'],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Charming artisan culinary logo badge for [RESTAURANT_NAME], a [CULINARY_SPECIALTY] bistro. The emblem features a hand-crafted illustration of [KITCHEN_OR_FOOD_ELEMENTS] with warm woodcut linework, enclosed in a rustic circular stamp with delicate wheat sheaf borders. Warm appetizing color palette: [APPETIZING_COLORS]. Nostalgic yet contemporary gastronomy branding, custom hand-lettered bold typography, vector format on clean parchment background --ar 1:1 --v 6.1`,
    defaultVariables: {
      RESTAURANT_NAME: 'The Hearth & Crust Bakehouse',
      CULINARY_SPECIALTY: 'wood-fired sourdough pizzeria and traditional artisan bakery',
      KITCHEN_OR_FOOD_ELEMENTS: 'crossed baker peel and vintage wheat stalks over a glowing woodfire flame',
      APPETIZING_COLORS: 'brick terracotta, golden sourdough crust yellow, and charcoal black'
    }
  },
  {
    id: 'logo-typographic-custom-wordmark',
    title: 'Custom Typographic Wordmark with Creative Ligatures',
    category: 'Logos',
    description: 'Bold custom brand wordmark with unique character ligatures, stylized letter cutouts, and distinctive modern kerning.',
    targetModels: ['Midjourney', 'Flux', 'ChatGPT', 'Claude'],
    tags: ['Logo Design', 'Wordmark', 'Typography', 'Branding', 'Custom Font', 'Modern'],
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    promptTemplate: `Custom modern typographic logo wordmark for "[BRAND_TEXT]", a modern [PRODUCT_OR_LIFESTYLE] company. The wordmark features custom designed bold geometric letterforms with distinctive creative ligatures between [LIGATURE_PAIR]. A subtle negative space or geometric angle in the letter [SPECIAL_LETTER_FEATURE] gives the mark an unmistakable signature look. High-contrast palette: [PALETTE_CHOICE]. Perfectly balanced optical kerning, avant-garde editorial branding, scalable from app favicon to billboard --ar 1:1 --v 6.1`,
    defaultVariables: {
      BRAND_TEXT: 'LUMINA',
      PRODUCT_OR_LIFESTYLE: 'smart ambient lighting and spatial computing hardware',
      LIGATURE_PAIR: 'the letters M and I connecting through a flowing diagonal beam',
      SPECIAL_LETTER_FEATURE: 'A replaced with an open upward apex chevron',
      PALETTE_CHOICE: 'monochrome matte black on stark white with an electric lime dot'
    }
  }
];
