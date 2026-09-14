export interface AprintsWeddingCard {
  id: string;
  sku: string;
  title: string;
  category: 'Trifold Floral' | 'Mughal & Classic' | 'Vellum & Acrylic' | 'Luxury & Velvet' | 'Nikkah Accessories';
  minPrice: number;
  maxPrice: number;
  originalPrice?: number;
  discountBadge?: string;
  badge?: string;
  imageUrl: string;
  galleryImages: string[];
  description: string;
  paperTypes: string[];
  foilOptions: string[];
  features: string[];
  minOrder: number;
  popular?: boolean;
}

export const APRINTS_CATEGORIES = [
  'All Wedding Cards',
  'Trifold Floral',
  'Mughal & Classic',
  'Vellum & Acrylic',
  'Luxury & Velvet',
  'Nikkah Accessories',
  'Under ₨ 150'
] as const;

export const APRINTS_PRODUCTS: AprintsWeddingCard[] = [
  {
    id: 'dark-blue-classic-gold',
    sku: 'APR-WED-CRD-001',
    title: 'Dark Blue Classic Gold Wedding Card | Shadi Card',
    category: 'Mughal & Classic',
    minPrice: 165,
    maxPrice: 245,
    badge: 'HOT SELLING',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2022/10/weddinh2.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2022/10/weddinh2.jpg',
      'https://aprints.pk/wp-content/uploads/2022/10/10.jpg'
    ],
    description: 'Royal midnight navy blue card embellished with rich 24K hot-foil gold stamped floral borders, premium matching envelope, and metallic inserts.',
    paperTypes: ['350gsm Sapphire Pearl Matte', 'Textured Linen Card', 'Gold Metallic Shimmer'],
    foilOptions: ['Gold Hot Foil', 'Antique Bronze', 'Silver Chrome'],
    features: ['Includes Customized Envelope', 'Laser-Cut Inner Flap', 'Free Digital Proofing', 'Wax Seal Compatible'],
    minOrder: 50,
    popular: true
  },
  {
    id: 'pearl-peacock-mughal-classic',
    sku: 'APR-WED-CRD-002',
    title: 'Pearl Peacock Mughal Classic Wedding Card',
    category: 'Mughal & Classic',
    minPrice: 135,
    maxPrice: 225,
    badge: 'POPULAR',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2022/10/10.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2022/10/10.jpg',
      'https://aprints.pk/wp-content/uploads/2022/10/weddinh2.jpg'
    ],
    description: 'Timeless Mughal architecture inspired artwork with peacock arches, embossed Urdu Nastaliq calligraphy, and ivory metallic double folding.',
    paperTypes: ['Ivory Imported Metallic', '300gsm Pearl Finish', 'Textured Hand-Made Paper'],
    foilOptions: ['Classic Gold Foil', 'Rose Gold Stamping', 'Copper Foil'],
    features: ['Traditional Mughal Motifs', 'Includes Gold Tassel Ribbon', 'Urdu / English Dual Printing', 'Free Delivery on 200+ Pcs'],
    minOrder: 50,
    popular: true
  },
  {
    id: 'gold-acrylic-trifold',
    sku: 'APR-WED-CRD-003',
    title: 'Gold Acrylic Trifold Wedding Card',
    category: 'Vellum & Acrylic',
    minPrice: 135,
    maxPrice: 375,
    badge: 'LUXURY',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2021/09/6-2.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2021/09/6-2.jpg',
      'https://aprints.pk/wp-content/uploads/2021/09/3-3.jpg'
    ],
    description: 'High-end 2mm cast clear acrylic wedding invitation with mirror gold screen printing, encased in a tri-fold metallic gold pocket jacket.',
    paperTypes: ['2mm Clear Crystal Acrylic', 'Frosted Matte Acrylic', 'Mirror Gold Tint Acrylic'],
    foilOptions: ['Mirror Gold Screen Print', 'Silver Foil', 'Rose Gold Mirror'],
    features: ['Scratch-Resistant Acrylic', 'Heavyweight Pocket Jacket', 'Custom Monogram Wax Seal', 'VIP Wedding Choice'],
    minOrder: 30,
    popular: true
  },
  {
    id: 'vellum-covered-floral',
    sku: 'APR-WED-CRD-004',
    title: 'Vellum Covered Floral Wedding Card',
    category: 'Vellum & Acrylic',
    minPrice: 135,
    maxPrice: 195,
    badge: 'TRENDING',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2021/09/3-3.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2021/09/3-3.jpg',
      'https://aprints.pk/wp-content/uploads/2021/09/5-2.jpg'
    ],
    description: 'Romantic botanical invitation enclosed with a translucent frosted vellum wrap, dried baby breath floral aesthetic, and wax seal closure.',
    paperTypes: ['180gsm Translucent Frosted Vellum', '350gsm Cotton Card', 'Linen Board'],
    foilOptions: ['Gold Foil Calligraphy', 'Rose Gold Accent', 'Matte White Ink'],
    features: ['Translucent Vellum Jacket', 'Handmade Wax Seal Included', 'Double Sided Color Printing', 'Modern Minimalist'],
    minOrder: 50,
    popular: true
  },
  {
    id: 'trifold-floral-themed',
    sku: 'APR-WED-CRD-005',
    title: 'Trifold Floral Themed Wedding Card',
    category: 'Trifold Floral',
    minPrice: 135,
    maxPrice: 195,
    badge: 'BESTSELLER',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2021/09/5-2.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2021/09/5-2.jpg',
      'https://aprints.pk/wp-content/uploads/2021/09/4-2.jpg'
    ],
    description: 'Three-panel fold opening that features separate dedicated cards for Barat, Walima, and Mehndi all bound seamlessly in one luxurious presentation.',
    paperTypes: ['350gsm Premium Velvet Touch Card', 'Textured Linen', 'Metallic Pearl'],
    foilOptions: ['Gold Foil Header', 'Rose Gold Foil', 'Silver Chrome'],
    features: ['3 Integrated Event Cards', 'Custom Ribbon Tie', 'Printed Envelope Included', 'Space for Google Maps QR'],
    minOrder: 50,
    popular: true
  },
  {
    id: 'dark-red-floral-themed',
    sku: 'APR-WED-CRD-006',
    title: 'Dark Red Floral Themed Wedding Card',
    category: 'Trifold Floral',
    minPrice: 155,
    maxPrice: 215,
    badge: 'ROYAL RED',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2021/09/2-3.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2021/09/2-3.jpg',
      'https://aprints.pk/wp-content/uploads/2021/09/1-4.jpg'
    ],
    description: 'Deep crimson maroon and crimson floral artwork celebrating traditional Pakistani bridal heritage with exquisite gold foil calligraphy.',
    paperTypes: ['Shahi Maroon Textured Card', '350gsm Matte Red Board', 'Gold Pearl Shimmer'],
    foilOptions: ['24K Bright Gold Foil', 'Antique Gold', 'Rose Gold'],
    features: ['Deep Maroon Envelope', 'Islamic Bismillah Header', 'Matching Sweets Box Available', 'Ideal for Barat & Nikkah'],
    minOrder: 50
  },
  {
    id: 'peach-floral-theme',
    sku: 'APR-WED-CRD-007',
    title: 'Peach & Floral Theme Wedding Card',
    category: 'Trifold Floral',
    minPrice: 140,
    maxPrice: 190,
    badge: 'PASTEL',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2021/09/4-2.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2021/09/4-2.jpg',
      'https://aprints.pk/wp-content/uploads/2022/02/7-2.jpg'
    ],
    description: 'Soft pastel peach, coral blossoms, and eucalyptus greenery design tailored for contemporary daytime weddings, Nikkah, and Walima luncheons.',
    paperTypes: ['Soft Peach Matt Card (300gsm)', 'Imported Linen', 'Smooth Ivory Board'],
    foilOptions: ['Rose Gold Hot Stamping', 'Champagne Gold', 'Copper Foil'],
    features: ['Delicate Pastel Colorway', 'Die-Cut Edges', 'Matching RSVP Card', 'Daytime Wedding Favorite'],
    minOrder: 50
  },
  {
    id: 'off-white-purple-floral',
    sku: 'APR-WED-CRD-008',
    title: 'Off-White + Purple Floral Themed Wedding Card',
    category: 'Trifold Floral',
    minPrice: 145,
    maxPrice: 220,
    badge: 'ELEGANT',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2022/02/9-.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2022/02/9-.jpg',
      'https://aprints.pk/wp-content/uploads/2022/02/8.jpg'
    ],
    description: 'Graceful off-white linen card accented by lavender orchids and royal purple accents with radiant gold foil frame borders.',
    paperTypes: ['Off-White Imported Linen', '300gsm Pearlised Card', 'Smooth Velvet Card'],
    foilOptions: ['Gold Foil', 'Silver Chrome', 'Holographic Violet'],
    features: ['Purple Envelope Included', 'Embossed Floral Accents', 'Dual Language Print Ready', 'Luxury Finish'],
    minOrder: 50
  },
  {
    id: 'pinkish-floral-themed',
    sku: 'APR-WED-CRD-009',
    title: 'Pinkish Floral Themed Wedding Card',
    category: 'Trifold Floral',
    minPrice: 155,
    maxPrice: 225,
    badge: 'ROMANTIC',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2022/02/7-2.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2022/02/7-2.jpg',
      'https://aprints.pk/wp-content/uploads/2021/09/4-2.jpg'
    ],
    description: 'Blush pink floral bouquet motif featuring delicate water-color peonies, gold stamped initials, and double flap presentation.',
    paperTypes: ['Blush Pink 350gsm Card', 'Art Silk Cardboard', 'Pearl Finish'],
    foilOptions: ['Rose Gold Foil', 'Bright Gold', 'Silver Foil'],
    features: ['Blush Floral Envelope', 'Laser Cut Border Option', 'Free Digital PDF Mockup', 'Modern Sheen'],
    minOrder: 50
  },
  {
    id: 'pearl-purple-floral-themed',
    sku: 'APR-WED-CRD-010',
    title: 'Pearl Purple Floral Themed Wedding Card',
    category: 'Mughal & Classic',
    minPrice: 145,
    maxPrice: 198,
    badge: 'ROYAL',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2022/02/8.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2022/02/8.jpg',
      'https://aprints.pk/wp-content/uploads/2022/02/9-.jpg'
    ],
    description: 'Majestic deep violet-purple card with shimmering pearlized coating and hand-drawn floral filigree in shimmering gold.',
    paperTypes: ['Pearlised Violet Card 320gsm', 'Matte Linen Card', 'Handcrafted Felt'],
    foilOptions: ['Yellow Gold Foil', 'Antique Gold Foil', 'Platinum Silver'],
    features: ['Includes Gold Foil Envelope', 'Classic Font Typography', 'Barat & Walima Sets', 'Nationwide Delivery'],
    minOrder: 50
  },
  {
    id: 'dark-brown-floral-themed',
    sku: 'APR-WED-CRD-011',
    title: 'Dark Brown Floral Themed Wedding Card',
    category: 'Mughal & Classic',
    minPrice: 140,
    maxPrice: 170,
    badge: 'BUDGET FRIENDLY',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2021/09/1-4.jpg',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2021/09/1-4.jpg',
      'https://aprints.pk/wp-content/uploads/2021/09/2-3.jpg'
    ],
    description: 'Warm chocolate brown card layered with golden autumn botanicals and gold metallic borders. A sophisticated yet budget-friendly choice.',
    paperTypes: ['Earth Brown Matte Card', '300gsm Textured Paper', 'Kraft Cardboard'],
    foilOptions: ['Gold Foil Stamping', 'Bronze Foil', 'Copper Foil'],
    features: ['High Value for Budget', 'Card + Envelope Included', 'Custom Printed Text', 'Fast 4-Day Turnaround'],
    minOrder: 50
  },
  {
    id: 'nikkah-pen-feather-qubool-hai',
    sku: 'APR-WED-PEN-NKH-001',
    title: 'Nikkah Pen Feather with Qubool Hai (Pakistan)',
    category: 'Nikkah Accessories',
    minPrice: 2000,
    maxPrice: 2000,
    originalPrice: 3000,
    discountBadge: '-33% OFF',
    badge: 'POPULAR ACC',
    imageUrl: 'https://aprints.pk/wp-content/uploads/2024/11/3.png',
    galleryImages: [
      'https://aprints.pk/wp-content/uploads/2024/11/3.png'
    ],
    description: 'Ceremonial Nikkah signing pen crafted with pure ostrich feather, wrapped in gold pearls, and detailed with miniature acrylic "Qubool Hai" pendant.',
    paperTypes: ['White Goose/Ostrich Feather', 'Gold Plated Nib', 'Satin Ribbons with Pearls'],
    foilOptions: ['Gold Acrylic Plaque', 'Rose Gold Plaque', 'Silver Plaque'],
    features: ['Smooth Blue/Black Ink', 'Gift Box Included', 'Reusable Cartridge', 'Signature Wedding Keepsake'],
    minOrder: 1,
    popular: true
  }
];
