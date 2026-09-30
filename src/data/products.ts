export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  wholesalePrice?: number;
  minQty?: number;
  rating: number;
  reviews: number;
  image: string;
  tag?: string;
};

export const CURRENCY = '₹';

export const fmt = (n: number) =>
  `${CURRENCY}${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

export const discountPct = (p: Product) =>
  Math.round((1 - p.price / p.mrp) * 100);

/* Actual electrical/electronics photography from Unsplash */
const IMG_BULB =
  'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop';

const IMG_LED =
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop';

const IMG_SWITCH =
  'https://images.unsplash.com/photo-1587391807498-7561be174828?q=80&w=600&auto=format&fit=crop';

const IMG_SOCKET =
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop';

const IMG_WIRE =
  'https://images.unsplash.com/photo-1563408544835-9b2f671bb5d2?q=80&w=600&auto=format&fit=crop';

const IMG_CABLE =
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop';

const IMG_TOOL =
  'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=600&auto=format&fit=crop';

const IMG_MULTIMETER =
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop';

const IMG_FAN =
  'https://images.unsplash.com/photo-1558618047-f4f2b8a9e6b8?q=80&w=600&auto=format&fit=crop';

const IMG_ELECTRICAL =
  'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=600&auto=format&fit=crop';


export const CATEGORIES = [
  {
    id: '0',
    name: 'All',
    icon: 'grid-outline',
    color: '#0F172A',
  },
  {
    id: '1',
    name: 'Wiring',
    icon: 'git-network-outline',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Lighting',
    icon: 'bulb-outline',
    color: '#F59E0B',
  },
  {
    id: '3',
    name: 'Switches',
    icon: 'toggle-outline',
    color: '#10B981',
  },
  {
    id: '4',
    name: 'Fans',
    icon: 'aperture-outline',
    color: '#8B5CF6',
  },
  {
    id: '5',
    name: 'Tools',
    icon: 'hammer-outline',
    color: '#EF4444',
  },
  {
    id: '6',
    name: 'MCBs',
    icon: 'hardware-chip-outline',
    color: '#6366F1',
  },
  {
    id: '7',
    name: 'Sockets',
    icon: 'power-outline',
    color: '#14B8A6',
  },
  {
    id: '8',
    name: 'Cables',
    icon: 'git-branch-outline',
    color: '#F97316',
  },
  {
    id: '9',
    name: 'Accessories',
    icon: 'construct-outline',
    color: '#64748B',
  },
];


export const PRODUCTS: Product[] = [

  // ─────────────────────────────
  // LIGHTING
  // ─────────────────────────────

  {
    id: 'p1',
    name: 'Premium LED Bulb 12W',
    category: 'Lighting',
    price: 120,
    wholesalePrice: 90,
    minQty: 20,
    mrp: 160,
    rating: 4.8,
    reviews: 312,
    image: IMG_BULB,
    tag: 'Bestseller',
  },

  {
    id: 'p2',
    name: 'LED Bulb 9W Cool White',
    category: 'Lighting',
    price: 85,
    wholesalePrice: 64,
    minQty: 50,
    mrp: 120,
    rating: 4.6,
    reviews: 184,
    image: IMG_LED,
  },

  {
    id: 'p3',
    name: 'LED Bulb 15W Warm White',
    category: 'Lighting',
    price: 145,
    wholesalePrice: 109,
    minQty: 50,
    mrp: 190,
    rating: 4.7,
    reviews: 126,
    image: IMG_BULB,
    tag: 'Popular',
  },

  {
    id: 'p4',
    name: 'LED Panel Light 18W',
    category: 'Lighting',
    price: 260,
    wholesalePrice: 195,
    minQty: 10,
    mrp: 340,
    rating: 4.5,
    reviews: 91,
    image: IMG_LED,
  },

  {
    id: 'p5',
    name: 'LED Panel Light 24W',
    category: 'Lighting',
    price: 390,
    wholesalePrice: 293,
    minQty: 20,
    mrp: 520,
    rating: 4.6,
    reviews: 73,
    image: IMG_LED,
  },

  {
    id: 'p6',
    name: 'LED Strip Light 5m',
    category: 'Lighting',
    price: 560,
    wholesalePrice: 420,
    minQty: 50,
    mrp: 750,
    rating: 4.3,
    reviews: 204,
    image: IMG_LED,
    tag: 'New',
  },

  {
    id: 'p7',
    name: 'Emergency Rechargeable LED Light',
    category: 'Lighting',
    price: 699,
    wholesalePrice: 524,
    minQty: 10,
    mrp: 899,
    rating: 4.5,
    reviews: 112,
    image: IMG_BULB,
  },


  // ─────────────────────────────
  // WIRING
  // ─────────────────────────────

  {
    id: 'p8',
    name: 'Copper Wire 1.5 sq mm - 90m',
    category: 'Wiring',
    price: 950,
    wholesalePrice: 713,
    minQty: 10,
    mrp: 1200,
    rating: 4.9,
    reviews: 187,
    image: IMG_WIRE,
    tag: 'Top rated',
  },

  {
    id: 'p9',
    name: 'Copper Wire 2.5 sq mm - 90m',
    category: 'Wiring',
    price: 1580,
    wholesalePrice: 1185,
    minQty: 10,
    mrp: 1900,
    rating: 4.8,
    reviews: 143,
    image: IMG_WIRE,
  },

  {
    id: 'p10',
    name: 'Copper Wire 4 sq mm - 90m',
    category: 'Wiring',
    price: 2480,
    wholesalePrice: 1860,
    minQty: 10,
    mrp: 2950,
    rating: 4.7,
    reviews: 87,
    image: IMG_CABLE,
  },

  {
    id: 'p11',
    name: 'FR PVC Insulated Wire 1 sq mm',
    category: 'Wiring',
    price: 720,
    wholesalePrice: 540,
    minQty: 20,
    mrp: 890,
    rating: 4.5,
    reviews: 61,
    image: IMG_WIRE,
  },

  {
    id: 'p12',
    name: 'Insulation Tape - Pack of 5',
    category: 'Wiring',
    price: 95,
    wholesalePrice: 71,
    minQty: 20,
    mrp: 130,
    rating: 4.2,
    reviews: 88,
    image: IMG_CABLE,
  },

  {
    id: 'p13',
    name: 'Electrical Flexible Cable 2 Core',
    category: 'Wiring',
    price: 540,
    wholesalePrice: 405,
    minQty: 10,
    mrp: 690,
    rating: 4.4,
    reviews: 48,
    image: IMG_CABLE,
  },


  // ─────────────────────────────
  // SWITCHES
  // ─────────────────────────────

  {
    id: 'p14',
    name: 'Modular Switch 6A',
    category: 'Switches',
    price: 45,
    wholesalePrice: 34,
    minQty: 10,
    mrp: 60,
    rating: 4.5,
    reviews: 96,
    image: IMG_SWITCH,
  },

  {
    id: 'p15',
    name: 'Modular Switch 16A',
    category: 'Switches',
    price: 75,
    wholesalePrice: 56,
    minQty: 50,
    mrp: 100,
    rating: 4.6,
    reviews: 72,
    image: IMG_SWITCH,
  },

  {
    id: 'p16',
    name: '6 Module Switch Plate',
    category: 'Switches',
    price: 125,
    wholesalePrice: 94,
    minQty: 50,
    mrp: 170,
    rating: 4.4,
    reviews: 58,
    image: IMG_SWITCH,
  },

  {
    id: 'p17',
    name: '8 Module Modular Plate',
    category: 'Switches',
    price: 160,
    wholesalePrice: 120,
    minQty: 20,
    mrp: 220,
    rating: 4.5,
    reviews: 44,
    image: IMG_SWITCH,
  },

  {
    id: 'p18',
    name: 'Fan Regulator Modular',
    category: 'Switches',
    price: 185,
    wholesalePrice: 139,
    minQty: 50,
    mrp: 250,
    rating: 4.3,
    reviews: 39,
    image: IMG_SWITCH,
  },


  // ─────────────────────────────
  // SOCKETS
  // ─────────────────────────────

  {
    id: 'p19',
    name: '6A Universal Socket',
    category: 'Sockets',
    price: 85,
    wholesalePrice: 64,
    minQty: 20,
    mrp: 120,
    rating: 4.6,
    reviews: 103,
    image: IMG_SOCKET,
    tag: 'Popular',
  },

  {
    id: 'p20',
    name: '16A Heavy Duty Socket',
    category: 'Sockets',
    price: 145,
    wholesalePrice: 109,
    minQty: 50,
    mrp: 190,
    rating: 4.7,
    reviews: 81,
    image: IMG_SOCKET,
  },

  {
    id: 'p21',
    name: '16A Switch + Socket Combo',
    category: 'Sockets',
    price: 190,
    wholesalePrice: 143,
    minQty: 50,
    mrp: 250,
    rating: 4.5,
    reviews: 67,
    image: IMG_SOCKET,
  },

  {
    id: 'p22',
    name: 'USB A+C Wall Socket',
    category: 'Sockets',
    price: 399,
    wholesalePrice: 299,
    minQty: 50,
    mrp: 550,
    rating: 4.4,
    reviews: 36,
    image: IMG_SOCKET,
    tag: 'New',
  },


  // ─────────────────────────────
  // FANS
  // ─────────────────────────────

  {
    id: 'p23',
    name: 'Ceiling Fan 1200 mm',
    category: 'Fans',
    price: 2450,
    wholesalePrice: 1838,
    minQty: 20,
    mrp: 3100,
    rating: 4.6,
    reviews: 141,
    image: IMG_FAN,
  },

  {
    id: 'p24',
    name: 'High Speed Ceiling Fan',
    category: 'Fans',
    price: 2890,
    wholesalePrice: 2168,
    minQty: 10,
    mrp: 3600,
    rating: 4.5,
    reviews: 98,
    image: IMG_FAN,
    tag: 'Bestseller',
  },

  {
    id: 'p25',
    name: 'Wall Mounted Exhaust Fan',
    category: 'Fans',
    price: 1650,
    wholesalePrice: 1238,
    minQty: 20,
    mrp: 2100,
    rating: 4.4,
    reviews: 76,
    image: IMG_FAN,
  },

  {
    id: 'p26',
    name: 'Table Fan 400 mm',
    category: 'Fans',
    price: 1399,
    wholesalePrice: 1049,
    minQty: 10,
    mrp: 1800,
    rating: 4.3,
    reviews: 63,
    image: IMG_FAN,
  },


  // ─────────────────────────────
  // TOOLS
  // ─────────────────────────────

  {
    id: 'p27',
    name: 'Digital Multimeter',
    category: 'Tools',
    price: 780,
    wholesalePrice: 585,
    minQty: 20,
    mrp: 999,
    rating: 4.4,
    reviews: 58,
    image: IMG_MULTIMETER,
  },

  {
    id: 'p28',
    name: 'Professional Digital Multimeter',
    category: 'Tools',
    price: 1290,
    wholesalePrice: 968,
    minQty: 50,
    mrp: 1650,
    rating: 4.6,
    reviews: 84,
    image: IMG_MULTIMETER,
    tag: 'Top rated',
  },

  {
    id: 'p29',
    name: 'Insulated Screwdriver Set',
    category: 'Tools',
    price: 499,
    wholesalePrice: 374,
    minQty: 20,
    mrp: 699,
    rating: 4.7,
    reviews: 119,
    image: IMG_TOOL,
  },

  {
    id: 'p30',
    name: 'Electrician Plier',
    category: 'Tools',
    price: 299,
    wholesalePrice: 224,
    minQty: 20,
    mrp: 399,
    rating: 4.5,
    reviews: 92,
    image: IMG_TOOL,
  },

  {
    id: 'p31',
    name: 'Wire Stripper Tool',
    category: 'Tools',
    price: 349,
    wholesalePrice: 262,
    minQty: 20,
    mrp: 499,
    rating: 4.4,
    reviews: 65,
    image: IMG_TOOL,
  },

  {
    id: 'p32',
    name: 'Electrical Test Pen',
    category: 'Tools',
    price: 99,
    wholesalePrice: 74,
    minQty: 50,
    mrp: 150,
    rating: 4.2,
    reviews: 145,
    image: IMG_TOOL,
  },


  // ─────────────────────────────
  // MCBs
  // ─────────────────────────────

  {
    id: 'p33',
    name: 'MCB 16A Single Pole',
    category: 'MCBs',
    price: 145,
    wholesalePrice: 109,
    minQty: 20,
    mrp: 190,
    rating: 4.6,
    reviews: 89,
    image: IMG_ELECTRICAL,
  },

  {
    id: 'p34',
    name: 'MCB 20A Single Pole',
    category: 'MCBs',
    price: 155,
    wholesalePrice: 116,
    minQty: 50,
    mrp: 205,
    rating: 4.6,
    reviews: 73,
    image: IMG_ELECTRICAL,
  },

  {
    id: 'p35',
    name: 'MCB 32A Double Pole',
    category: 'MCBs',
    price: 385,
    wholesalePrice: 289,
    minQty: 10,
    mrp: 480,
    rating: 4.7,
    reviews: 73,
    image: IMG_ELECTRICAL,
    tag: 'Popular',
  },

  {
    id: 'p36',
    name: 'MCB 40A Double Pole',
    category: 'MCBs',
    price: 460,
    wholesalePrice: 345,
    minQty: 10,
    mrp: 590,
    rating: 4.5,
    reviews: 42,
    image: IMG_ELECTRICAL,
  },

  {
    id: 'p37',
    name: 'MCB 63A Double Pole',
    category: 'MCBs',
    price: 620,
    wholesalePrice: 465,
    minQty: 10,
    mrp: 780,
    rating: 4.4,
    reviews: 31,
    image: IMG_ELECTRICAL,
  },


  // ─────────────────────────────
  // ACCESSORIES
  // ─────────────────────────────

  {
    id: 'p38',
    name: 'Cable Tie Pack - 100 pcs',
    category: 'Accessories',
    price: 120,
    wholesalePrice: 90,
    minQty: 50,
    mrp: 160,
    rating: 4.5,
    reviews: 91,
    image: IMG_CABLE,
  },

  {
    id: 'p39',
    name: 'PVC Electrical Junction Box',
    category: 'Accessories',
    price: 85,
    wholesalePrice: 64,
    minQty: 20,
    mrp: 120,
    rating: 4.3,
    reviews: 47,
    image: IMG_ELECTRICAL,
  },

  {
    id: 'p40',
    name: 'Electrical Connector Pack',
    category: 'Accessories',
    price: 150,
    wholesalePrice: 113,
    minQty: 50,
    mrp: 220,
    rating: 4.4,
    reviews: 53,
    image: IMG_CABLE,
  },

  {
    id: 'p41',
    name: 'Heat Shrink Tube Set',
    category: 'Accessories',
    price: 199,
    wholesalePrice: 149,
    minQty: 10,
    mrp: 299,
    rating: 4.6,
    reviews: 38,
    image: IMG_CABLE,
  },

  {
    id: 'p42',
    name: 'Electrical Terminal Block',
    category: 'Accessories',
    price: 75,
    wholesalePrice: 56,
    minQty: 50,
    mrp: 110,
    rating: 4.2,
    reviews: 29,
    image: IMG_ELECTRICAL,
  },
];