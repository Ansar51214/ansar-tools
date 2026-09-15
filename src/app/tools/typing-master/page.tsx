'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Keyboard,
  Award,
  RotateCcw,
  Sparkles,
  Printer,
  Play,
  X
} from 'lucide-react';

// Language Type
type Language = 'urdu' | 'hindi' | 'english';
type Difficulty = 'easy' | 'medium' | 'hard' | 'custom';
type TestDuration = 60 | 120 | 180 | 300 | 0; // 0 = Free practice

// Audio Sound Type
type SoundMode = 'mech' | 'soft' | 'typewriter' | 'mute';

// Curated Passages Database
const PASSAGES: Record<Language, Record<'easy' | 'medium' | 'hard', string[]>> = {
  urdu: {
    easy: [
      "علم بڑی دولت ہے۔ محنت کامیابی کی کنجی ہے۔ سچ بولنا ہمیشہ فائدہ مند ہوتا ہے۔ اچھے اخلاق انسان کو بلند مقام عطا کرتے ہیں۔",
      "پاکستان ایک خوبصورت اور وسیع ملک ہے۔ یہاں چاروں موسم پائے جاتے ہیں۔ لوگ محنتی، پرخلوص اور مہمان نواز ہیں۔",
      "صبح کی سیر صحت کے لیے بہت مفید ہے۔ تازہ ہوا انسان کو چست اور تندرست رکھتی ہے۔ روزانہ ورزش کرنا بیماریوں سے بچاتا ہے۔",
      "وقت بہت قیمتی سرمایہ ہے۔ گزرا ہوا وقت کبھی لوٹ کر نہیں آتا۔ اپنے روزمرہ کام وقت پر مکمل کرنے کی عادت اپنائیں۔"
    ],
    medium: [
      "کمپیوٹر اور انٹرنیٹ نے دنیا کو ایک گلوبل ولیج بنا دیا ہے۔ آج ہر شعبہ زندگی میں تیز رفتار ٹائپنگ اور ڈیجیٹل مہارتوں کی اشد ضرورت ہے۔ روزانہ باقاعدہ مشق کرنے سے آپ کی انگلیوں کی رفتار اور درستگی میں واضح بہتری آتی ہے۔",
      "کتابیں انسان کی بہترین اور باوفا دوست ہیں۔ مطالعہ کرنے سے علم و آگہی کے نئے در کھلتے ہیں اور سوچنے سمجھنے کے زاویے نکھرتے ہیں۔ اچھے ادب کا مطالعہ دل اور دماغ کو روشنی بخشتا ہے۔",
      "کامیابی راتوں رات حاصل نہیں ہوتی۔ اس کے لیے مستقل مزاجی، صبر، حوصلہ اور اپنی غلطیوں سے مسلسل سیکھنے کا جذبہ ضروری ہے۔ جو لوگ ہمت نہیں ہارتے وہ بالآخر اپنی منزل کو پا لیتے ہیں۔",
      "ماحولیات کی حفاظت ہم سب کی اجتماعی ذمہ داری ہے۔ شجرکاری کو فروغ دے کر ہم اپنے ماحول کو صاف ستھرا اور آلودگی سے پاک بنا سکتے ہیں۔ آنے والی نسلوں کے لیے سرسبز پاکستان ہمارا خواب ہے۔"
    ],
    hard: [
      "مصنوعی ذہانت اور جدید انفارمیشن ٹیکنالوجی کے طوفانی انقلاب نے انسانی فکر، معاشی نظام اور روزگار کے روایتی ڈھانچوں کو یکسر بدل کر رکھ دیا ہے۔ مستقبل کی ترقی کا انحصار ڈیجیٹل تخلیقی صلاحیتوں، الگورتھمک جدت طرازی اور خودکار نظاموں کی فہم پر مبنی ہوگا۔",
      "معاشی خود انحصاری، شفافیت اور تکنیکی خودمختاری کسی بھی آزاد و باوقار قوم کی بقا اور خودداری کے ناگزیر بنیادی ستون ہیں۔ جدید سائنسی علوم، تحقیق و ترقی اور پیشہ ورانہ مہارتوں میں مستقل سرمایہ کاری ہی خوشحالی کا پائیدار راستہ ہے۔",
      "قومی تعمیر و ترقی کے لیے فکری یکجہتی، انصاف پر مبنی عدالتی نظام اور قانون کی بالا دستی اولین شرط ہے۔ جب معاشرے میں میرٹ اور سچائی کو اولیت دی جاتی ہے تو ملک امن، رواداری اور استحکام کا گہوارہ بن جاتا ہے۔"
    ]
  },
  hindi: {
    easy: [
      "परिश्रम ही सफलता की सबसे बड़ी कुंजी है। समय का सदुपयोग करना सीखें। सदा सत्य और मधुर वाणी बोलनी चाहिए।",
      "भारत एक महान, प्राचीन और सुंदर देश है। यहाँ की विविधता, संस्कृति और भाषाएं पूरे विश्व में प्रसिद्ध और आदरणीय हैं।",
      "सुबह की सैर स्वास्थ्य के लिए अत्यंत लाभदायक होती है। ताज़ी हवा में सांस लेने से मन और मस्तिष्क दिन भर प्रसन्न रहता है।",
      "विद्या ऐसा धन है जिसे कोई चुरा नहीं सकता। जितना बाँटो उतना ही यह बढ़ता है। हमें प्रतिदिन कुछ नया सीखना चाहिए।"
    ],
    medium: [
      "आज के डिजिटल युग में कंप्यूटर, इंटरनेट और स्मार्टफोन हमारे दैनिक जीवन का अभिन्न अंग बन चुके हैं। तीव्र और सटीक टाइपिंग कौशल सीखने से कार्यक्षमता में दोगुनी वृद्धि होती है और बहुमूल्य समय की बचत होती है।",
      "सफलता किसी को अचानक या रातोंरात नहीं मिलती। इसके लिए निरंतर अभ्यास, धैर्य और अटूट संकल्प की आवश्यकता होती है। अपनी पिछली गलतियों से सीखकर निरंतर आगे बढ़ते रहना ही बुद्धिमानी की पहचान है।",
      "प्रकृति का संरक्षण और संवर्धन हम सभी नागरिकों का परम कर्तव्य है। पेड़-पौधे हमें जीवनदायिनी ऑक्सीजन प्रदान करते हैं। हमें अपने पर्यावरण को स्वच्छ और हरा-भरा बनाए रखने का दृढ़ संकल्प लेना चाहिए।",
      "अच्छी पुस्तकें मनुष्य की सबसे सच्ची और मार्गदर्शक मित्र होती हैं। ज्ञान की वृद्धि और चरित्र निर्माण के लिए प्रतिदिन स्वाध्याय करने की आदत अवश्य डालनी चाहिए।"
    ],
    hard: [
      "आर्टिफिशियल इंटेलिजेंस, क्वांटम कंप्यूटिंग और रोबोटिक्स के इस अभूतपूर्व युग में मानवीय बौद्धिकता और तकनीकी नवाचार के मध्य एक नवीन वैज्ञानिक संतुलन स्थापित हो रहा है। भविष्य की वैश्विक अर्थव्यवस्था डिजिटल दक्षता और डेटा विश्लेषण पर आधारित होगी।",
      "आर्थिक आत्मनिर्भरता, तकनीकी संप्रभुता और अनुसंधान आधारित शिक्षा किसी भी प्रगतिशील राष्ट्र के सर्वांगीण विकास के मूल आधार स्तंभ हैं। नवाचार और युवा प्रतिभा को प्रोत्साहित करके ही वैश्विक स्तर पर नेतृत्व स्थापित किया जा सकता है।",
      "सामाजिक समरसता, नैतिक मूल्य और विधि का शासन एक सशक्त और सशक्त लोकतंत्र की आधारशिला हैं। जब नागरिकों में कर्तव्यनिष्ठा और राष्ट्रीय चेतना का संचार होता है, तब राष्ट्र उन्नति के नए आयाम स्थापित करता है।"
    ]
  },
  english: {
    easy: [
      "The quick brown fox jumps over the lazy dog. Practice typing every day to build finger memory and speed.",
      "Morning walks keep the mind fresh and the body energetic. A cup of warm tea is the best way to start the day.",
      "Reading books expands your knowledge and sharpens your imagination. Dedicate some quiet time to reading daily.",
      "Success comes to those who work hard and stay honest. Every small step counts toward achieving your biggest dreams."
    ],
    medium: [
      "Mastering touch typing is an indispensable skill in modern professional environments. Developing proper muscle memory allows you to communicate ideas effortlessly at the speed of thought.",
      "Consistency is the fundamental bridge between ambitious goals and real accomplishment. Dedicating twenty minutes every day yields remarkable progress over weeks and months.",
      "Digital tools and global internet connectivity have transformed education, international commerce, and human communication across the globe, unlocking unprecedented opportunities.",
      "Patience and resilience define true leadership. When faced with unexpected challenges, maintain your composure, analyze the situation objectively, and execute solutions decisively."
    ],
    hard: [
      "The exponential convergence of quantum computing architectures, cognitive artificial intelligence, and decentralized cryptographic protocols is fundamentally rearchitecting enterprise computing paradigms worldwide.",
      "Navigating intricate socioeconomic paradigms requires agile problem-solving, strategic resilience, and interdisciplinary collaboration to navigate unpredictable market fluctuations effectively.",
      "Philosophical inquiries into autonomous algorithmic governance challenge established jurisprudential frameworks, necessitating rigorous ethical deliberation and transparent technological oversight."
    ]
  }
};

// Keyboard Layout Definition (Typing Master Finger Color Guide)
interface KeyDef {
  key: string;
  shiftKey?: string;
  urdu?: string;
  urduShift?: string;
  hindi?: string;
  finger: 'l-pinky' | 'l-ring' | 'l-middle' | 'l-index' | 'thumb' | 'r-index' | 'r-middle' | 'r-ring' | 'r-pinky';
  width?: string;
}

const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { key: '`', shiftKey: '~', urdu: 'ً', hindi: '़', finger: 'l-pinky' },
    { key: '1', shiftKey: '!', urdu: '۱', hindi: '१', finger: 'l-pinky' },
    { key: '2', shiftKey: '@', urdu: '۲', hindi: '२', finger: 'l-ring' },
    { key: '3', shiftKey: '#', urdu: '۳', hindi: '३', finger: 'l-middle' },
    { key: '4', shiftKey: '$', urdu: '۴', hindi: '४', finger: 'l-index' },
    { key: '5', shiftKey: '%', urdu: '۵', hindi: '५', finger: 'l-index' },
    { key: '6', shiftKey: '^', urdu: '۶', hindi: '६', finger: 'r-index' },
    { key: '7', shiftKey: '&', urdu: '۷', hindi: '७', finger: 'r-index' },
    { key: '8', shiftKey: '*', urdu: '۸', hindi: '८', finger: 'r-middle' },
    { key: '9', shiftKey: '(', urdu: '۹', hindi: '९', finger: 'r-ring' },
    { key: '0', shiftKey: ')', urdu: '۰', hindi: '०', finger: 'r-pinky' },
    { key: '-', shiftKey: '_', urdu: '-', hindi: '-', finger: 'r-pinky' },
    { key: '=', shiftKey: '+', urdu: '=', hindi: '=', finger: 'r-pinky' },
    { key: 'Backspace', finger: 'r-pinky', width: 'w-16 sm:w-20' },
  ],
  [
    { key: 'Tab', finger: 'l-pinky', width: 'w-12 sm:w-16' },
    { key: 'q', shiftKey: 'Q', urdu: 'ق', hindi: 'ौ', finger: 'l-pinky' },
    { key: 'w', shiftKey: 'W', urdu: 'و', hindi: 'ै', finger: 'l-ring' },
    { key: 'e', shiftKey: 'E', urdu: 'ع', hindi: 'ा', finger: 'l-middle' },
    { key: 'r', shiftKey: 'R', urdu: 'ر', hindi: 'ी', finger: 'l-index' },
    { key: 't', shiftKey: 'T', urdu: 'ت', hindi: 'ू', finger: 'l-index' },
    { key: 'y', shiftKey: 'Y', urdu: 'ے', hindi: 'ब', finger: 'r-index' },
    { key: 'u', shiftKey: 'U', urdu: 'ء', hindi: 'ह', finger: 'r-index' },
    { key: 'i', shiftKey: 'I', urdu: 'ی', hindi: 'ग', finger: 'r-middle' },
    { key: 'o', shiftKey: 'O', urdu: 'ہ', hindi: 'द', finger: 'r-ring' },
    { key: 'p', shiftKey: 'P', urdu: 'پ', hindi: 'ज', finger: 'r-pinky' },
    { key: '[', shiftKey: '{', urdu: ']', hindi: 'ड', finger: 'r-pinky' },
    { key: ']', shiftKey: '}', urdu: '[', hindi: '़', finger: 'r-pinky' },
    { key: '\\', shiftKey: '|', urdu: '\\', hindi: '\\', finger: 'r-pinky', width: 'w-10 sm:w-14' },
  ],
  [
    { key: 'CapsLock', finger: 'l-pinky', width: 'w-14 sm:w-18' },
    { key: 'a', shiftKey: 'A', urdu: 'ا', hindi: 'ो', finger: 'l-pinky' },
    { key: 's', shiftKey: 'S', urdu: 'س', hindi: 'े', finger: 'l-ring' },
    { key: 'd', shiftKey: 'D', urdu: 'د', hindi: '्', finger: 'l-middle' },
    { key: 'f', shiftKey: 'F', urdu: 'ف', hindi: 'ि', finger: 'l-index' },
    { key: 'g', shiftKey: 'G', urdu: 'گ', hindi: 'ु', finger: 'l-index' },
    { key: 'h', shiftKey: 'H', urdu: 'ح', hindi: 'प', finger: 'r-index' },
    { key: 'j', shiftKey: 'J', urdu: 'ج', hindi: 'र', finger: 'r-index' },
    { key: 'k', shiftKey: 'K', urdu: 'ک', hindi: 'क', finger: 'r-middle' },
    { key: 'l', shiftKey: 'L', urdu: 'ل', hindi: 'त', finger: 'r-ring' },
    { key: ';', shiftKey: ':', urdu: '؛', hindi: 'च', finger: 'r-pinky' },
    { key: '\'', shiftKey: '"', urdu: '\'', hindi: 'ट', finger: 'r-pinky' },
    { key: 'Enter', finger: 'r-pinky', width: 'w-16 sm:w-20' },
  ],
  [
    { key: 'Shift', finger: 'l-pinky', width: 'w-16 sm:w-24' },
    { key: 'z', shiftKey: 'Z', urdu: 'ز', hindi: 'े', finger: 'l-pinky' },
    { key: 'x', shiftKey: 'X', urdu: 'ش', hindi: 'ं', finger: 'l-ring' },
    { key: 'c', shiftKey: 'C', urdu: 'چ', hindi: 'म', finger: 'l-middle' },
    { key: 'v', shiftKey: 'V', urdu: 'ط', hindi: 'न', finger: 'l-index' },
    { key: 'b', shiftKey: 'B', urdu: 'ب', hindi: 'व', finger: 'l-index' },
    { key: 'n', shiftKey: 'N', urdu: 'ن', hindi: 'ल', finger: 'r-index' },
    { key: 'm', shiftKey: 'M', urdu: 'م', hindi: 'स', finger: 'r-index' },
    { key: ',', shiftKey: '<', urdu: '،', hindi: ',', finger: 'r-middle' },
    { key: '.', shiftKey: '>', urdu: '۔', hindi: '.', finger: 'r-ring' },
    { key: '/', shiftKey: '?', urdu: '؟', hindi: 'य', finger: 'r-pinky' },
    { key: 'Shift', finger: 'r-pinky', width: 'w-16 sm:w-24' },
  ],
  [
    { key: 'Ctrl', finger: 'l-pinky', width: 'w-12 sm:w-16' },
    { key: 'Alt', finger: 'l-pinky', width: 'w-12 sm:w-14' },
    { key: 'Space', finger: 'thumb', width: 'flex-1 max-w-sm sm:max-w-md' },
    { key: 'Alt', finger: 'r-pinky', width: 'w-12 sm:w-14' },
    { key: 'Ctrl', finger: 'r-pinky', width: 'w-12 sm:w-16' },
  ]
];

// Urdu Phonetic Mapping for Smart Input Mode
const URDU_PHONETIC_MAP: Record<string, string> = {
  'a': 'ا', 'A': 'آ',
  'b': 'ب', 'B': '﷽',
  'p': 'پ', 'P': 'ُ',
  't': 'ت', 'T': 'ٹ',
  'c': 'چ', 'C': 'ث',
  'j': 'ج', 'J': 'ض',
  'd': 'د', 'D': 'ڈ',
  'r': 'ر', 'R': 'ڑ',
  'z': 'ز', 'Z': 'ذ',
  'x': 'ش', 'X': 'ژ',
  's': 'س', 'S': 'ص',
  'k': 'ک', 'K': 'خ',
  'g': 'گ', 'G': 'غ',
  'l': 'ل', 'L': 'لاً',
  'm': 'م', 'M': 'ّ',
  'n': 'ن', 'N': 'ں',
  'v': 'ط', 'V': 'ظ',
  'w': 'و', 'W': 'ؤ',
  'h': 'ہ', 'H': 'ح',
  'y': 'ی', 'Y': 'ے',
  'e': 'ع', 'E': 'ؑ',
  'f': 'ف', 'F': 'ف',
  'q': 'ق', 'Q': 'ق',
  'o': 'ہ', 'O': 'ۃ',
  'u': 'ء', 'U': 'ئ',
  'i': 'ی', 'I': 'ٰ',
  ',': '،', ';': '؛', '?': '؟'
};

export default function TypingMasterTool() {
  // --- STATE ---
  const [language, setLanguage] = useState<Language>('urdu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [duration, setDuration] = useState<TestDuration>(60);
  const [soundMode, setSoundMode] = useState<SoundMode>('mech');
  const [phoneticAssist, setPhoneticAssist] = useState(true); // Automatically converts Roman keys to Urdu/Hindi

  const [currentText, setCurrentText] = useState('');
  const [customInputText, setCustomInputText] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const [typed, setTyped] = useState('');
  const [testActive, setTestActive] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [userName, setUserName] = useState('Typing Pro');

  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [liveWpm, setLiveWpm] = useState(0);
  const [grossWpm, setGrossWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);
  const [errorsCount, setErrorsCount] = useState(0);
  const [activePressedKey, setActivePressedKey] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize Web Audio click sounds (100% offline, zero lag, no broken external mp3 links)
  const playTypingSound = (isError = false) => {
    if (soundMode === 'mute') return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (isError) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (soundMode === 'typewriter') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (soundMode === 'soft') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.start(now);
        osc.stop(now + 0.02);
      } else {
        // Mechanical Switch Click (Default)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.start(now);
        osc.stop(now + 0.025);
      }
    } catch {
      // Audio context not allowed or failed
    }
  };

  // Calculate WPM and Accuracy
  const calculateStats = useCallback((userTyped: string, elapsedSec: number) => {
    let correct = 0;
    let mistakes = 0;
    for (let i = 0; i < userTyped.length; i++) {
      if (userTyped[i] === currentText[i]) {
        correct++;
      } else {
        mistakes++;
      }
    }
    setErrorsCount(mistakes);

    const accuracy = userTyped.length > 0 ? Math.round((correct / userTyped.length) * 100) : 100;
    setLiveAccuracy(accuracy);

    if (elapsedSec > 1) {
      const minutes = elapsedSec / 60;
      // Standard WPM: 5 characters = 1 word
      const gross = Math.round((userTyped.length / 5) / minutes);
      const net = Math.max(0, Math.round(((userTyped.length / 5) - mistakes) / minutes));
      setGrossWpm(gross);
      setLiveWpm(net);
    }
  }, [currentText]);

  // Finish Test
  const finishTest = useCallback((finalTyped: string) => {
    setTestFinished(true);
    setTestActive(false);
    setShowCertificate(true);

    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 1;
    calculateStats(finalTyped, elapsed);
  }, [startTime, calculateStats]);

  // Reset Test
  const resetTestState = useCallback(() => {
    setTestActive(false);
    setTestFinished(false);
    setShowCertificate(false);
    setStartTime(null);
    setTyped('');
    setTimeLeft(duration > 0 ? duration : 60);
    setElapsedSeconds(0);
    setLiveWpm(0);
    setGrossWpm(0);
    setLiveAccuracy(100);
    setErrorsCount(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [duration]);

  // Load Text on Language / Difficulty Change
  const loadPassage = useCallback((lang: Language, diff: Difficulty) => {
    if (diff === 'custom') {
      if (customInputText.trim()) {
        setCurrentText(customInputText.trim());
      } else {
        setShowCustomModal(true);
      }
    } else {
      const list = PASSAGES[lang][diff];
      const selected = list[Math.floor(Math.random() * list.length)];
      setCurrentText(selected);
    }
    resetTestState();
  }, [customInputText, resetTestState]);

  // Timer Countdown and Stats
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testActive && startTime) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setElapsedSeconds(elapsed);

        if (duration > 0) {
          const remaining = Math.max(0, duration - Math.floor(elapsed));
          setTimeLeft(remaining);
          if (remaining === 0) {
            finishTest(typed);
            return;
          }
        }

        // Compute Live WPM & Accuracy
        calculateStats(typed, elapsed);
      }, 200);
    }
    return () => clearInterval(interval);
  }, [testActive, startTime, typed, duration, currentText, finishTest, calculateStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPassage(language, difficulty);
    }, 0);
    return () => clearTimeout(timer);
  }, [language, difficulty, loadPassage]);

  // Input Handling
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (testFinished) return;
    const val = e.target.value;

    // Start timer on first keystroke
    if (!testActive && val.length > 0) {
      setTestActive(true);
      setStartTime(Date.now());
    }

    // Play Sound & Detect error
    const lastCharIndex = val.length - 1;
    if (lastCharIndex >= 0) {
      const isCorrect = val[lastCharIndex] === currentText[lastCharIndex];
      playTypingSound(!isCorrect);
    }

    setTyped(val);
    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0.1;
    calculateStats(val, elapsed);

    // If typed everything in the passage
    if (val.length >= currentText.length) {
      finishTest(val);
    }
  };

  // Keyboard intercept for Phonetic Input Assistance
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setActivePressedKey(e.key.toLowerCase());
    setTimeout(() => setActivePressedKey(null), 150);

    // If Urdu and Phonetic Assistance is active and user didn't switch system keyboard
    if (language === 'urdu' && phoneticAssist && !e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
      if (URDU_PHONETIC_MAP[e.key]) {
        e.preventDefault();
        const urduChar = URDU_PHONETIC_MAP[e.key];
        const textarea = inputRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newVal = typed.substring(0, start) + urduChar + typed.substring(end);

        if (!testActive) {
          setTestActive(true);
          setStartTime(Date.now());
        }

        const isCorrect = urduChar === currentText[start];
        playTypingSound(!isCorrect);

        setTyped(newVal);
        const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0.1;
        calculateStats(newVal, elapsed);

        setTimeout(() => {
          if (textarea) {
            textarea.selectionStart = textarea.selectionEnd = start + 1;
          }
        }, 0);

        if (newVal.length >= currentText.length) {
          finishTest(newVal);
        }
      }
    }
  };

  // Finger Color Classes
  const getFingerClass = (finger: KeyDef['finger']) => {
    switch (finger) {
      case 'l-pinky': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'l-ring': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'l-middle': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'l-index': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'thumb': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'r-index': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'r-middle': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'r-ring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'r-pinky': return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

  // Skill Rating
  const getRating = (wpm: number) => {
    if (wpm >= 70) return { title: 'Master Typist 🏆', color: 'text-amber-500', desc: 'Top 1% Typing Speed Worldwide' };
    if (wpm >= 50) return { title: 'Professional ⚡', color: 'text-emerald-500', desc: 'Excellent High-Speed Typing' };
    if (wpm >= 35) return { title: 'Intermediate 🚀', color: 'text-blue-500', desc: 'Above Average Standard Speed' };
    return { title: 'Beginner 🌱', color: 'text-slate-500', desc: 'Keep Practicing to Boost Speed' };
  };

  const rating = getRating(liveWpm);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Dynamic Jameel Noori Nastaleeq & Noto Fonts */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Jameel Noori Nastaleeq';
              src: url('https://fonts.cdnfonts.com/s/73138/JameelNooriNastaleeq.woff') format('woff'),
                   url('https://cdn.jsdelivr.net/gh/urdutext/jameel-noori-nastaleeq@master/Jameel-Noori-Nastaleeq.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }

            .font-urdu-jameel {
              font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif !important;
              direction: rtl !important;
              text-align: right !important;
              line-height: 2.3 !important;
              letter-spacing: 0px !important;
            }

            .font-hindi-noto {
              font-family: 'Noto Sans Devanagari', 'Poppins', sans-serif !important;
              direction: ltr !important;
              text-align: left !important;
              line-height: 1.8 !important;
            }

            .font-english-inter {
              font-family: 'Inter', 'Fira Code', monospace, sans-serif !important;
              direction: ltr !important;
              text-align: left !important;
              line-height: 1.8 !important;
            }

            @media print {
              body * { visibility: hidden !important; }
              #certificate-printable, #certificate-printable * { visibility: visible !important; }
              #certificate-printable {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                padding: 40px !important;
                background: #ffffff !important;
                color: #0f172a !important;
              }
            }
          `
        }}
      />

      {/* Main Navigation */}
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* Top Header Studio Bar */}
      <div className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sticky top-16 z-30 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & Language Selector */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">Ansar Typing Master Pro</h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  3 Languages
                </span>
              </div>
              <p className="text-xs text-slate-400">Urdu (Jameel Noori Nastaleeq), Hindi & English Typing Speed Studio</p>
            </div>
          </div>

          {/* Controls: Language, Difficulty, Timer & Sound */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Language Selector */}
            <div className="flex bg-slate-900 border border-slate-700 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('urdu')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  language === 'urdu' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇵🇰 اردو (Urdu)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hindi')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  language === 'hindi' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇮🇳 हिन्दी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('english')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  language === 'english' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇬🇧 English
              </button>
            </div>

            {/* Difficulty Dropdown */}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="easy">Level: Easy</option>
              <option value="medium">Level: Medium</option>
              <option value="hard">Level: Hard</option>
              <option value="custom">Custom Text...</option>
            </select>

            {/* Timer Duration */}
            <select
              value={duration}
              onChange={(e) => {
                const val = Number(e.target.value) as TestDuration;
                setDuration(val);
                setTimeLeft(val > 0 ? val : 60);
                resetTestState();
              }}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value={60}>⏱️ 1 Minute Test</option>
              <option value={120}>⏱️ 2 Minutes Test</option>
              <option value={180}>⏱️ 3 Minutes Test</option>
              <option value={300}>⏱️ 5 Minutes Test</option>
              <option value={0}>♾️ Free Practice</option>
            </select>

            {/* Sound Mode Switcher */}
            <select
              value={soundMode}
              onChange={(e) => setSoundMode(e.target.value as SoundMode)}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-2.5 py-2 focus:outline-none cursor-pointer"
            >
              <option value="mech">🔊 Mechanical Click</option>
              <option value="typewriter">⌨️ Typewriter</option>
              <option value="soft">🔉 Soft Click</option>
              <option value="mute">🔇 Mute Sound</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 print:hidden">
        
        {/* Real-time Performance Dash (WPM, Accuracy, Time) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
          {/* Time Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
              {duration > 0 ? 'Time Left' : 'Time Elapsed'}
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {duration > 0
                ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                : `${Math.round(elapsedSeconds)}s`}
            </div>
          </div>

          {/* Net WPM */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
              Net WPM (Speed)
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              {liveWpm}
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
              Accuracy
            </span>
            <div className={`text-2xl sm:text-3xl font-black font-mono ${liveAccuracy >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {liveAccuracy}%
            </div>
          </div>

          {/* Mistakes / Total */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
              Errors / Keys
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400">
              {errorsCount} <span className="text-xs text-slate-500">/ {typed.length}</span>
            </div>
          </div>
        </div>

        {/* Urdu Smart Phonetic Assistant Toggle */}
        {language === 'urdu' && (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇵🇰</span>
              <div>
                <span className="font-bold text-white block">Jameel Noori Nastaleeq Font Active (جميل نوری نستعلیق)</span>
                <span className="text-slate-400 text-[11px]">
                  Smart Phonetic Helper: Type standard English letters on keyboard (e.g. &apos;a&apos; gives &apos;ا&apos;, &apos;m&apos; gives &apos;م&apos;, &apos;k&apos; gives &apos;ک&apos;)
                </span>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
              <input
                type="checkbox"
                checked={phoneticAssist}
                onChange={(e) => setPhoneticAssist(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span className="text-slate-200 font-semibold">Phonetic Auto-Conversion</span>
            </label>
          </div>
        )}

        {/* Text Display Canvas (Rich Highlighting) */}
        <div
          onClick={() => inputRef.current?.focus()}
          className={`bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-slate-200 cursor-text transition-all min-h-[160px] select-none ${
            language === 'urdu' ? 'font-urdu-jameel text-xl sm:text-2xl leading-relaxed' :
            language === 'hindi' ? 'font-hindi-noto text-lg sm:text-xl leading-relaxed' :
            'font-english-inter text-base sm:text-lg leading-relaxed'
          }`}
        >
          {currentText.split('').map((char, idx) => {
            let style = 'text-slate-400';
            if (idx < typed.length) {
              style = typed[idx] === char
                ? 'text-emerald-700 font-semibold'
                : 'text-rose-600 bg-rose-100 rounded px-0.5 underline font-bold';
            } else if (idx === typed.length) {
              style = 'bg-blue-200 text-blue-900 border-b-2 border-blue-600 animate-pulse font-bold px-0.5 rounded';
            }
            return (
              <span key={idx} className={style}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Hidden / Transparent Typing Input */}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={testFinished}
            placeholder={
              language === 'urdu'
                ? "یہاں ٹائپ کرنا شروع کریں (Start typing here in Urdu Jameel Noori Nastaleeq)..."
                : language === 'hindi'
                ? "यहाँ टाइप करना शुरू करें (Start typing here in Hindi)..."
                : "Start typing here to begin the speed test..."
            }
            rows={3}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className={`w-full p-4 sm:p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 text-white outline-none focus:border-emerald-500 resize-none shadow-inner text-base transition-colors ${
              language === 'urdu' ? 'font-urdu-jameel text-xl' : language === 'hindi' ? 'font-hindi-noto text-lg' : 'font-english-inter text-base'
            }`}
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadPassage(language, difficulty)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
              title="Load another passage"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Change Text
            </button>
            <button
              type="button"
              onClick={resetTestState}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all"
              title="Restart current test"
            >
              <Play className="w-3.5 h-3.5" /> Restart
            </button>
          </div>
        </div>

        {/* Interactive Virtual Keyboard Guide (Typing Master Style) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Touch Typing Keyboard & Finger Color Guide
              </h3>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="hidden sm:inline">Active Target Key:</span>
              <strong className="px-2 py-0.5 bg-blue-600/30 text-blue-400 border border-blue-500/40 rounded font-mono">
                {currentText[typed.length] === ' ' ? 'Spacebar' : currentText[typed.length] || 'Done'}
              </strong>
            </div>
          </div>

          {/* The Physical Keyboard Grid */}
          <div className="flex flex-col gap-1.5 select-none w-full max-w-4xl mx-auto text-xs overflow-x-auto pb-2">
            {KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
                {row.map((k, kIdx) => {
                  const isPressed = activePressedKey === k.key.toLowerCase();
                  const targetChar = currentText[typed.length]?.toLowerCase();
                  const isTarget =
                    (k.key === 'Space' && currentText[typed.length] === ' ') ||
                    (targetChar && (k.key.toLowerCase() === targetChar || k.urdu === targetChar || k.hindi === targetChar));

                  return (
                    <div
                      key={kIdx}
                      className={`h-10 sm:h-12 border rounded-lg flex flex-col items-center justify-center font-bold transition-all shadow-sm ${k.width || 'w-8 sm:w-12'} ${getFingerClass(k.finger)} ${
                        isTarget ? 'ring-2 ring-blue-500 scale-105 shadow-md shadow-blue-500/30 font-black' : ''
                      } ${isPressed ? 'translate-y-1 brightness-90 shadow-none' : ''}`}
                    >
                      {/* Bilingual Label on Key */}
                      <span className="text-[10px] sm:text-xs">
                        {language === 'urdu' && k.urdu ? k.urdu : language === 'hindi' && k.hindi ? k.hindi : k.key}
                      </span>
                      {language !== 'english' && (
                        <span className="text-[8px] opacity-60 font-mono">
                          {k.key}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Finger Color Legend */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-300" /> Left Pinky</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-300" /> Left Ring</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-300" /> Left Middle</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-300" /> Left Index</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Thumbs</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-300" /> Right Index</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-300" /> Right Middle</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-300" /> Right Ring</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-300" /> Right Pinky</span>
          </div>
        </div>

        {/* Detailed Typing Tips & Instructions Section */}
        <section className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Typing Speed & Technique Guidelines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="space-y-1 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <strong className="text-white block">1. Home Row Placement (ASDF - JKL;)</strong>
              <p>Keep your fingers resting naturally on the home row keys. Never look down at the keyboard while typing.</p>
            </div>
            <div className="space-y-1 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <strong className="text-white block">2. Urdu Jameel Noori Nastaleeq</strong>
              <p>Urdu flows right-to-left. Practice common word ligatures to build smooth rhythm and muscle memory.</p>
            </div>
            <div className="space-y-1 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <strong className="text-white block">3. Accuracy Before Speed</strong>
              <p>Aim for 95%+ accuracy first. High speed will naturally follow once your fingers know every key location.</p>
            </div>
          </div>
        </section>
      </main>

      {/* =======================================================================
         CERTIFICATE / RESULTS MODAL (WITH 1-CLICK PRINT & DOWNLOAD)
         ======================================================================= */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 print:p-0 print:bg-white">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 print:border-none print:shadow-none print:p-0">
            
            {/* Top Close */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 print:hidden">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Typing Test Official Scorecard</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Card to Print */}
            <div
              id="certificate-printable"
              className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 border-4 border-double border-slate-300 my-4 text-center shadow-lg relative overflow-hidden"
            >
              {/* Decorative Corner Seals */}
              <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-mono font-bold">ANSAR TYPING LABS</div>
              <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono font-bold">VERIFIED TEST</div>

              <span className="text-3xl sm:text-4xl block mb-2">🏆</span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
                Certificate of Achievement
              </h2>
              <p className="text-xs text-slate-500 mb-4">Speed, Accuracy & Proficiency Assessment</p>

              <div className="my-4">
                <span className="text-xs text-slate-400 block">Awarded to:</span>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter Your Name"
                  className="text-lg sm:text-xl font-bold text-blue-600 text-center border-b border-dashed border-slate-400 focus:outline-none bg-transparent w-64 mx-auto block py-0.5"
                />
              </div>

              {/* Big Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 my-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Net Speed</span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">{liveWpm}</span>
                  <span className="text-[10px] text-slate-400 block">Net WPM</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Gross Speed</span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-purple-600">{grossWpm}</span>
                  <span className="text-[10px] text-slate-400 block">Gross WPM</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Accuracy</span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-blue-600">{liveAccuracy}%</span>
                  <span className="text-[10px] text-slate-400 block">Precision</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Skill Level</span>
                  <span className={`text-xs sm:text-sm font-black block mt-1.5 ${rating.color}`}>{rating.title}</span>
                  <span className="text-[9px] text-slate-400 block">{language.toUpperCase()}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                Completed the official <strong>{language.toUpperCase()}</strong> typing assessment with{' '}
                <strong>{errorsCount}</strong> mistakes across <strong>{typed.length}</strong> keystrokes in{' '}
                <strong>{Math.round(elapsedSeconds)}</strong> seconds.
              </p>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Verified by Ansar Multi-Tool Studio</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Printer className="w-4 h-4" /> Print / Save Certificate
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCertificate(false);
                  loadPassage(language, difficulty);
                }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Next Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Text Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Paste Custom Practice Text</h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste your own Urdu, Hindi, or English paragraph to practice typing tests.
            </p>
            <textarea
              rows={5}
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="Paste your text here..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-emerald-500 mb-4 resize-y"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (customInputText.trim()) {
                    setCurrentText(customInputText.trim());
                    setShowCustomModal(false);
                    resetTestState();
                  }
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
              >
                Start Practice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
