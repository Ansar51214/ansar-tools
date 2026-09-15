'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import {
  APRINTS_PRODUCTS,
  APRINTS_CATEGORIES,
  AprintsWeddingCard
} from '@/data/aprintsCardsData';
import {
  Heart,
  Sparkles,
  Calendar,
  MapPin,
  Eye,
  Palette,
  Check,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Film,
  ShoppingBag,
  Search,
  X,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle
} from 'lucide-react';

export default function AprintsWeddingCardsStorePage() {
  // Page Mode: 'store' (Aprints.pk clone) or 'studio' (Digital animated E-card generator)
  const [activeTab, setActiveTab] = useState<'store' | 'studio'>('store');

  // ==========================================
  // STOREFRONT STATE (APRINTS.PK CLONE)
  // ==========================================
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Wedding Cards');
  const [quickViewProduct, setQuickViewProduct] = useState<AprintsWeddingCard | null>(null);
  
  // Customizer State inside Quick View Modal
  const [selectedQty, setSelectedQty] = useState<number>(100);
  const [selectedPaper, setSelectedPaper] = useState<string>('');
  const [selectedFoil, setSelectedFoil] = useState<string>('');
  const [includeWaxSeal, setIncludeWaxSeal] = useState<boolean>(false);
  const [groomNameOrder, setGroomNameOrder] = useState<string>('Muhammad Hamza');
  const [brideNameOrder, setBrideNameOrder] = useState<string>('Ayesha Noor');
  const [eventTypeOrder, setEventTypeOrder] = useState<string>('Barat & Walima Suite');
  const [customerCity, setCustomerCity] = useState<string>('Lahore');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [activeGalleryImg, setActiveGalleryImg] = useState<string>('');

  // Cart State
  interface CartItem {
    product: AprintsWeddingCard;
    quantity: number;
    groom: string;
    bride: string;
    event: string;
    paper: string;
    foil: string;
    waxSeal: boolean;
    totalPrice: number;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutCity, setCheckoutCity] = useState('Lahore');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  // Floating Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return APRINTS_PRODUCTS.filter(item => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      if (selectedCategory === 'All Wedding Cards') return matchesSearch;
      if (selectedCategory === 'Under ₨ 150') return matchesSearch && item.minPrice <= 150;
      return matchesSearch && item.category === selectedCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Open Quick View Modal
  const handleOpenQuickView = (product: AprintsWeddingCard) => {
    setQuickViewProduct(product);
    setSelectedQty(product.minOrder >= 50 ? 100 : product.minOrder);
    setSelectedPaper(product.paperTypes[0] || '');
    setSelectedFoil(product.foilOptions[0] || '');
    setIncludeWaxSeal(false);
    setActiveGalleryImg(product.imageUrl);
  };

  // Bulk pricing calculations
  const calculateUnitPrice = (product: AprintsWeddingCard, qty: number): number => {
    if (product.minPrice === product.maxPrice) return product.minPrice;
    let base = product.minPrice + (product.maxPrice - product.minPrice) * 0.4;
    // Bulk volume discount
    if (qty >= 500) base *= 0.85;
    else if (qty >= 250) base *= 0.90;
    else if (qty >= 100) base *= 0.95;
    if (includeWaxSeal) base += 25;
    return Math.round(base);
  };

  const currentUnitPrice = quickViewProduct ? calculateUnitPrice(quickViewProduct, selectedQty) : 0;
  const currentTotalPrice = currentUnitPrice * selectedQty;

  // Direct WhatsApp Order
  const handleOrderWhatsApp = () => {
    if (!quickViewProduct) return;
    const msg = 
`💍 *ORDER INQUIRY - APRINTS.PK WEDDING CARDS*

• *Card Title:* ${quickViewProduct.title}
• *SKU:* ${quickViewProduct.sku}
• *Quantity:* ${selectedQty} Pieces
• *Unit Rate:* ₨ ${currentUnitPrice.toLocaleString()} / card
• *Estimated Total:* ₨ ${currentTotalPrice.toLocaleString()} PKR

📋 *Customization Details:*
• *Groom Name:* ${groomNameOrder}
• *Bride Name:* ${brideNameOrder}
• *Event Type:* ${eventTypeOrder}
• *Paper Stock:* ${selectedPaper}
• *Foil Stamping:* ${selectedFoil}
• *Wax Seal Add-on:* ${includeWaxSeal ? 'Yes (+₨ 25/pc)' : 'No'}
• *Destination City:* ${customerCity}

Please share the digital design proof on this WhatsApp number and confirm delivery timeline. Thank you!`;

    const url = `https://wa.me/923311146549?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (!quickViewProduct) return;
    const newItem: CartItem = {
      product: quickViewProduct,
      quantity: selectedQty,
      groom: groomNameOrder,
      bride: brideNameOrder,
      event: eventTypeOrder,
      paper: selectedPaper,
      foil: selectedFoil,
      waxSeal: includeWaxSeal,
      totalPrice: currentTotalPrice
    };
    setCart(prev => [...prev, newItem]);
    showToast(`Added ${quickViewProduct.title} (${selectedQty} pcs) to Cart! 🛒`);
    setQuickViewProduct(null);
  };

  const cartGrandTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  // Complete COD Order
  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutPhone || !checkoutAddress) {
      showToast('Please enter your full name, phone number, and delivery address.');
      return;
    }
    setOrderPlacedSuccess(true);
    showToast('Your order has been placed successfully! 📦 COD Delivery via TCS.');
  };

  // ==========================================
  // DIGITAL STUDIO STATE (CANVAS ANIMATIONS)
  // ==========================================
  interface WeddingTheme {
    id: string;
    name: string;
    bgGradient: string;
    cardBg: string;
    cardBgHex: string;
    borderColor: string;
    innerBorderColor: string;
    accentGold: string;
    primaryText: string;
    secondaryText: string;
    badgeBg: string;
  }

  const THEMES: WeddingTheme[] = [
    {
      id: 'maroon',
      name: '👑 Shahi Maroon & Gold',
      bgGradient: 'from-amber-950 via-rose-950 to-slate-950',
      cardBg: 'bg-[#3b0813]',
      cardBgHex: '#3b0813',
      borderColor: 'border-[#d4af37]',
      innerBorderColor: 'border-[#d4af37]/40',
      accentGold: '#d4af37',
      primaryText: 'text-[#fbf5e5]',
      secondaryText: 'text-[#e9d5a1]',
      badgeBg: 'bg-[#d4af37]/20 text-[#f3e5b8]'
    },
    {
      id: 'emerald',
      name: '🌿 Royal Emerald & Flora',
      bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
      cardBg: 'bg-[#063327]',
      cardBgHex: '#063327',
      borderColor: 'border-[#eab308]',
      innerBorderColor: 'border-[#eab308]/40',
      accentGold: '#eab308',
      primaryText: 'text-[#f0fdf4]',
      secondaryText: 'text-[#bbf7d0]',
      badgeBg: 'bg-[#eab308]/20 text-[#fef08a]'
    },
    {
      id: 'sapphire',
      name: '🌌 Midnight Sapphire & Gold',
      bgGradient: 'from-slate-950 via-blue-950 to-slate-950',
      cardBg: 'bg-[#0a192f]',
      cardBgHex: '#0a192f',
      borderColor: 'border-[#38bdf8]',
      innerBorderColor: 'border-[#38bdf8]/40',
      accentGold: '#38bdf8',
      primaryText: 'text-[#f0f9ff]',
      secondaryText: 'text-[#bae6fd]',
      badgeBg: 'bg-[#38bdf8]/20 text-[#e0f2fe]'
    },
    {
      id: 'blush',
      name: '🌸 Blush Rose & Champagne',
      bgGradient: 'from-rose-950 via-pink-950 to-slate-950',
      cardBg: 'bg-[#4a1525]',
      cardBgHex: '#4a1525',
      borderColor: 'border-[#f472b6]',
      innerBorderColor: 'border-[#f472b6]/40',
      accentGold: '#f472b6',
      primaryText: 'text-[#fff1f2]',
      secondaryText: 'text-[#fbcfe8]',
      badgeBg: 'bg-[#f472b6]/20 text-[#fce7f3]'
    }
  ];

  const [selectedTheme, setSelectedTheme] = useState<WeddingTheme>(THEMES[0]);
  const [particleType, setParticleType] = useState<'petals' | 'sparkles' | 'fireflies'>('petals');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [invocation, setInvocation] = useState('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
  const [eventTitle, setEventTitle] = useState('The Royal Barat & Nikkah Ceremony');
  const [hostText, setHostText] = useState('Together with their families, cordially invite you to celebrate the wedding of');
  const [groomName, setGroomName] = useState('Muhammad Hamza');
  const [groomDetails, setGroomDetails] = useState('Son of Mr. & Mrs. Tariq Mahmood');
  const [brideName, setBrideName] = useState('Ayesha Noor');
  const [brideDetails, setBrideDetails] = useState('Daughter of Mr. & Mrs. Shakeel Ahmed');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [eventTime, setEventTime] = useState('07:30 PM');
  const [venueName, setVenueName] = useState('The Grand Marquee Palace');
  const [venueAddress, setVenueAddress] = useState('Club Road, Sector G-5, Islamabad');
  const [rsvpContact, setRsvpContact] = useState('+92 331 1146549 | +92 300 1234567');
  const [customQuote, setCustomQuote] = useState('"And among His signs is that He created for you mates from among yourselves..." (Quran 30:21)');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  // Particles Canvas Effect
  useEffect(() => {
    if (activeTab !== 'studio') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      opacity: number;
      color: string;
    }

    const particles: Particle[] = [];
    const count = particleType === 'petals' ? 30 : 45;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: particleType === 'petals' ? Math.random() * 10 + 6 : Math.random() * 4 + 2,
        speedY: particleType === 'petals' ? Math.random() * 1.4 + 0.6 : Math.random() * 0.8 + 0.3,
        speedX: Math.sin(i) * 0.6,
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.7 + 0.3,
        color: particleType === 'petals' ? (i % 2 === 0 ? '#f43f5e' : '#fda4af') : '#fbbf24'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.02) * p.speedX;
        p.rotation += 1;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        if (particleType === 'petals') {
          ctx.fillStyle = p.color;
          ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, particleType]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-800 selection:bg-amber-200">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-amber-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-xs border border-amber-400/40 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Aprints.pk Official Top Announcement Bar */}
      <div className="bg-[#000000] text-white text-[11px] py-2 px-4 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="bg-[#fdb61c] text-black font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">
              Free Delivery
            </span>
            <span className="text-slate-300">
              Pakistan&apos;s #1 Custom Printing &amp; Packaging Company • Wedding Cards Since 1982 • COD Nationwide
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <a href="tel:03311146549" className="hover:text-amber-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#fdb61c]" /> 0331 1146549
            </a>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#fdb61c]" /> 11:00 AM – 7:00 PM
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#fdb61c]" /> Lahore DHA Phase 1
            </span>
          </div>
        </div>
      </div>

      {/* Main Aprints Header & Action Hub */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#000000] flex items-center justify-center text-[#fdb61c] font-black text-xl shadow-md border-2 border-[#fdb61c]">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-950">Aprints<span className="text-[#fca21b]">.pk</span></span>
                <span className="text-[9px] bg-slate-900 text-[#fdb61c] font-black px-1.5 py-0.5 rounded uppercase">Wedding Vault</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Specially Designed Shadi Cards Since 1982</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('store')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'store'
                  ? 'bg-[#fdb61c] text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Printed Cards Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'studio'
                  ? 'bg-slate-950 text-amber-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Free Digital E-Card Studio</span>
            </button>
          </div>

          {/* Cart & WhatsApp Quick Action */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/923311146549?text=Salam%20Aprints!%20I%20am%20interested%20in%20wedding%20cards."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-bold flex items-center gap-2 transition-all relative"
            >
              <ShoppingBag className="w-4 h-4 text-[#d97706]" />
              <span className="hidden sm:inline">Cart /</span>
              <span className="text-slate-900">₨ {cartGrandTotal.toLocaleString()}</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#fdb61c] text-slate-950 font-black rounded-full flex items-center justify-center text-[10px] shadow">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* TAB 1: APRINTS.PK PHYSICAL WEDDING CARDS STORE */}
      {/* ========================================================================= */}
      {activeTab === 'store' && (
        <div className="flex-1 flex flex-col">
          
          {/* Hero Banner with Aprints theme */}
          <div className="bg-gradient-to-r from-slate-950 via-[#1e1302] to-slate-950 text-white py-10 px-4 border-b-4 border-[#fdb61c] relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fdb61c]/20 border border-[#fdb61c]/40 text-[#fdb61c] text-xs font-bold mb-3">
                  <Star className="w-3.5 h-3.5 fill-[#fdb61c]" />
                  <span>Aprints.pk Wedding Collection 2026</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  Pakistani Wedding Cards &amp; Shadi Cards
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                  Explore luxury acrylic invitations, intricate tri-fold floral cards, Mughal gold-foil motifs, vellum wraps, and ceremonial Nikkah pens. Cash on Delivery across Pakistan.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-xs">
                <div className="bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#fdb61c]" />
                  <div>
                    <strong className="block text-white font-bold">COD Nationwide</strong>
                    <span className="text-[10px] text-slate-400">TCS / Leopards courier</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <strong className="block text-white font-bold">Free Proofing</strong>
                    <span className="text-[10px] text-slate-400">Digital preview in 2 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Catalog Controls: Search & Category Pills */}
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
            
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wedding cards, SKU (e.g. APR-WED-CRD-001), floral, acrylic..."
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#fdb61c] focus:ring-1 focus:ring-[#fdb61c]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Showing count */}
              <div className="text-xs text-slate-500 font-semibold px-2">
                Showing <strong>{filteredProducts.length}</strong> Wedding Items
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {APRINTS_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? 'bg-[#fdb61c] text-slate-950 border-[#fdb61c] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#fdb61c] transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer" onClick={() => handleOpenQuickView(product)}>
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />

                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      {product.discountBadge && (
                        <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow">
                          {product.discountBadge}
                        </span>
                      )}
                      {product.badge && (
                        <span className="bg-slate-900 text-[#fdb61c] font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow tracking-wider">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Quick View Hover Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenQuickView(product);
                        }}
                        className="px-4 py-2 bg-[#fdb61c] text-slate-950 text-xs font-black rounded-xl shadow-lg hover:bg-amber-400 transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View &amp; Customize</span>
                      </button>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between text-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {product.category}
                      </span>
                      <h3 
                        onClick={() => handleOpenQuickView(product)}
                        className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-amber-600 transition-colors cursor-pointer leading-snug mb-2"
                      >
                        {product.title}
                      </h3>
                    </div>

                    <div>
                      {/* Price Range */}
                      <div className="my-2">
                        {product.originalPrice ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs text-slate-400 line-through">₨ {product.originalPrice.toLocaleString()}</span>
                            <span className="text-sm font-black text-rose-600">₨ {product.minPrice.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-black text-slate-900">
                            ₨ {product.minPrice.toLocaleString()} – ₨ {product.maxPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="block text-[10px] text-slate-400">Min. order: {product.minOrder} pcs</span>
                      </div>

                      {/* Select Options Button */}
                      <button
                        onClick={() => handleOpenQuickView(product)}
                        className="w-full py-2 bg-slate-900 hover:bg-[#fdb61c] hover:text-slate-950 text-white font-bold text-xs rounded-xl transition-colors mt-2"
                      >
                        Select Options
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Courier & Guarantee Footer Banner */}
            <div className="mt-12 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">100% Satisfaction &amp; Print Guarantee</h4>
                  <p className="text-xs text-slate-500">Every wedding card is printed on imported European cardboards with high-precision hot foil stamping.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Courier Partners:</span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">TCS Express</span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">Leopards</span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">FastEx</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FREE DIGITAL ANIMATED E-CARD STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'studio' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Studio Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
                <Palette className="w-4 h-4" /> 1. Select Theme &amp; Falling Particles
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {THEMES.map(th => (
                  <button
                    key={th.id}
                    onClick={() => setSelectedTheme(th)}
                    className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                      selectedTheme.id === th.id
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-black shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {th.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-600">Animation Effect:</span>
                <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setParticleType('petals')}
                    className={`px-3 py-1 rounded-lg ${particleType === 'petals' ? 'bg-rose-600 text-white' : 'text-slate-600'}`}
                  >
                    🌸 Rose Petals
                  </button>
                  <button
                    onClick={() => setParticleType('sparkles')}
                    className={`px-3 py-1 rounded-lg ${particleType === 'sparkles' ? 'bg-amber-600 text-white' : 'text-slate-600'}`}
                  >
                    ✨ Starlight
                  </button>
                </div>
              </div>
            </div>

            {/* Couple & Event Details */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" /> 2. Couple Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Groom&apos;s Name</label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Bride&apos;s Name</label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Event Time</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Venue Details</label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

          </div>

          {/* Live Mobile Card Canvas */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-20 w-full max-w-sm flex flex-col items-center">
              
              <div 
                ref={cardContainerRef}
                className={`relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 ${selectedTheme.borderColor} flex flex-col items-center justify-between p-6 text-center select-none`}
                style={{ backgroundColor: selectedTheme.cardBgHex }}
              >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />
                
                <div className={`absolute inset-3 rounded-2xl border ${selectedTheme.innerBorderColor} pointer-events-none z-10`} />

                {/* Card Content */}
                <div className="relative z-10 pt-4 w-full">
                  <p className="font-serif text-sm text-amber-300 font-bold mb-1">{invocation}</p>
                  <div className="w-12 h-0.5 bg-amber-400 mx-auto mb-2" />
                  <h3 className={`font-serif text-base font-bold uppercase ${selectedTheme.primaryText}`}>
                    {eventTitle}
                  </h3>
                </div>

                <div className="relative z-10 my-auto py-2">
                  <h2 className="font-serif text-2xl font-black text-amber-300 drop-shadow">
                    {groomName}
                  </h2>
                  <span className="text-amber-300 font-serif italic text-lg my-1 block">&amp;</span>
                  <h2 className="font-serif text-2xl font-black text-rose-300 drop-shadow">
                    {brideName}
                  </h2>
                </div>

                <div className="relative z-10 pb-3 w-full space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold">
                    <Calendar className="w-3 h-3" /> {eventDate} • {eventTime}
                  </div>
                  <p className="text-xs font-bold text-amber-300">{venueName}</p>
                </div>
              </div>

              <div className="w-full mt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = `Wedding Invitation: ${groomName} & ${brideName}\nDate: ${eventDate}\nVenue: ${venueName}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <MessageSquare className="w-4 h-4" /> Share on WhatsApp
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK VIEW & APRINTS CUSTOMIZATION MODAL */}
      {/* ========================================================================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                  {quickViewProduct.category} • SKU: {quickViewProduct.sku}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {quickViewProduct.title}
                </h2>
              </div>
              <button onClick={() => setQuickViewProduct(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Left Image Gallery + Right Customization Options */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              
              {/* Left Column: Product Image & Features (5 cols) */}
              <div className="md:col-span-5 p-5 bg-slate-50 flex flex-col justify-between space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-md relative">
                  <Image
                    src={activeGalleryImg || quickViewProduct.imageUrl}
                    alt={quickViewProduct.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>

                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <strong className="block text-slate-900 font-bold text-xs">Aprints Included Specs:</strong>
                  {quickViewProduct.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Customizer & Bulk Pricing (7 cols) */}
              <div className="md:col-span-7 p-5 sm:p-6 overflow-y-auto space-y-5">
                
                {/* 1. Quantity Selector with Bulk Tier Discounts */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-900">Select Print Quantity:</label>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {selectedQty >= 250 ? 'Free Delivery Included 🚚' : 'COD Available'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 250, 500].map(qty => (
                      <button
                        key={qty}
                        onClick={() => setSelectedQty(qty)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          selectedQty === qty
                            ? 'border-[#fdb61c] bg-amber-50 text-slate-950 font-black ring-2 ring-[#fdb61c]/30'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-sm font-extrabold">{qty} pcs</span>
                        <span className="block text-[9px] text-slate-400">
                          {qty >= 500 ? '15% Off' : qty >= 250 ? '10% Off' : qty >= 100 ? '5% Off' : 'Standard'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Paper Stock Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Cardboard / Paper Finish:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickViewProduct.paperTypes.map(paper => (
                      <button
                        key={paper}
                        onClick={() => setSelectedPaper(paper)}
                        className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all ${
                          selectedPaper === paper
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {paper}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Hot Foil Stamping */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Foil Calligraphy Finish:</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {quickViewProduct.foilOptions.map(foil => (
                      <button
                        key={foil}
                        onClick={() => setSelectedFoil(foil)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                          selectedFoil === foil
                            ? 'border-amber-600 bg-amber-600 text-white font-bold'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {foil}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Couple Names Customization */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Groom Name</label>
                    <input
                      type="text"
                      value={groomNameOrder}
                      onChange={(e) => setGroomNameOrder(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Bride Name</label>
                    <input
                      type="text"
                      value={brideNameOrder}
                      onChange={(e) => setBrideNameOrder(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
                    />
                  </div>
                </div>

                {/* Optional Wax Seal Checkbox */}
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-amber-200 bg-amber-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeWaxSeal}
                    onChange={(e) => setIncludeWaxSeal(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <div className="text-xs">
                    <strong className="text-slate-900 font-bold">Add Custom Monogram Wax Seals (+₨ 25 / card)</strong>
                    <p className="text-[10px] text-slate-500">Handmade self-adhesive wax seals with couple initials in gold/maroon.</p>
                  </div>
                </label>

                {/* Price Display */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Price ({selectedQty} Pcs):</span>
                    <strong className="text-xl font-black text-[#fdb61c]">₨ {currentTotalPrice.toLocaleString()} PKR</strong>
                    <span className="text-[10px] text-slate-400 block">₨ {currentUnitPrice} / card</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-300">
                    <span>COD Nationwide</span><br />
                    <span className="text-emerald-400 font-bold">Ready in 4-6 Days</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Questions? Call our Lahore DHA team: <strong>0331 1146549</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleOrderWhatsApp}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CART DRAWER POPUP */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#fdb61c]" />
                <h3 className="font-bold text-base text-slate-900">Your Wedding Order Cart</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Your shopping cart is empty.</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-slate-900">{item.product.title}</strong>
                      <button 
                        onClick={() => setCart(prev => prev.filter((_, i) => i !== index))}
                        className="text-[10px] text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} pcs • {item.groom} &amp; {item.bride} ({item.event})
                    </p>
                    <div className="text-xs font-black text-slate-900 pt-1 border-t border-slate-200 flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-[#d97706]">₨ {item.totalPrice.toLocaleString()} PKR</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-sm font-black">
                  <span>Grand Total:</span>
                  <span className="text-lg text-slate-950">₨ {cartGrandTotal.toLocaleString()} PKR</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3 bg-[#fdb61c] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all"
                >
                  Proceed to Checkout (COD Nationwide)
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHECKOUT MODAL */}
      {/* ========================================================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">Cash on Delivery (COD) Checkout</h3>
              <button onClick={() => { setIsCheckoutOpen(false); setOrderPlacedSuccess(false); }} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderPlacedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-black text-lg text-slate-900">Mubarak! Order Placed Successfully</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Our printing department at Lahore DHA Phase 1 will contact you on <strong>{checkoutPhone}</strong> via WhatsApp with the initial proof within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setCart([]);
                    setIsCheckoutOpen(false);
                    setOrderPlacedSuccess(false);
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Back to Wedding Store
                </button>
              </div>
            ) : (
              <form onSubmit={handleCompleteOrder} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    placeholder="e.g. Tariq Mahmood"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">WhatsApp / Mobile No.</label>
                    <input
                      type="tel"
                      required
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Delivery City</label>
                    <input
                      type="text"
                      required
                      value={checkoutCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      placeholder="Lahore / Karachi / Islamabad..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Shipping Address</label>
                  <textarea
                    rows={2}
                    required
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    placeholder="House No, Street, Sector / Colony"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs flex justify-between font-bold text-slate-900">
                  <span>Payable via Cash on Delivery:</span>
                  <span className="text-amber-700 font-black">₨ {cartGrandTotal.toLocaleString()} PKR</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#fdb61c] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all"
                >
                  Confirm Order with Cash on Delivery
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
