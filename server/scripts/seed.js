require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const path = require('path');

// Load .env from server directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

const products = [
  {
    name: 'Aam Ka Achaar (Mango Pickle)',
    slug: 'aam-ka-achaar-mango-pickle',
    description: 'Our signature mango pickle made from raw Rajapuri mangoes, slow-cured in pure mustard oil with a secret blend of 12 spices passed down three generations. Tangy, spicy, and absolutely addictive — the kind that makes every meal feel like home.',
    shortDescription: 'Classic raw mango pickle in mustard oil — tangy, spicy, and utterly irresistible.',
    ingredients: ['Raw Mango', 'Mustard Oil', 'Fenugreek Seeds', 'Fennel Seeds', 'Red Chilli Powder', 'Turmeric', 'Asafoetida', 'Salt', 'Mustard Seeds', 'Nigella Seeds'],
    category: 'Pickles',
    images: ['/images/products/mango-pickle-real.jpg', '/images/products/mango-pickle-aesthetic.jpg'],
    variants: [
      { weight: '250g', price: 180, discountPrice: 160, stock: 80 },
      { weight: '500g', price: 320, discountPrice: 290, stock: 60 },
      { weight: '1kg', price: 580, discountPrice: 520, stock: 40 },
    ],
    tags: ['bestseller', 'mango', 'traditional', 'mustard oil'],
    isFeatured: true,
    isBestSeller: true,
    averageRating: 4.8,
    numReviews: 124,
    totalSold: 580,
  },
  {
    name: 'Sweet Lemon Pickle',
    slug: 'sweet-lemon-pickle',
    description: 'Sun-dried lemon quarters steeped in a fiery, aromatic brine of spices and salt. This traditional pickle is a digestive powerhouse — bold, tart, with a lingering warmth that keeps you coming back for more.',
    shortDescription: 'Sun-dried lemon pickle with aromatic spices — bold, tart, and deeply satisfying.',
    ingredients: ['Fresh Lemons', 'Rock Salt', 'Red Chilli Powder', 'Turmeric', 'Asafoetida', 'Mustard Seeds', 'Fenugreek', 'Sesame Oil'],
    category: 'Pickles',
    images: ['/images/products/sweet-lemon-pickle-real.jpg', '/images/products/sweet-lemon-pickle-aesthetic.jpg'],
    variants: [
      { weight: '250g', price: 160, discountPrice: null, stock: 70 },
      { weight: '500g', price: 290, discountPrice: 260, stock: 55 },
      { weight: '1kg', price: 520, discountPrice: 480, stock: 35 },
    ],
    tags: ['lemon', 'tangy', 'digestive', 'traditional'],
    isFeatured: true,
    isBestSeller: false,
    averageRating: 4.6,
    numReviews: 87,
    totalSold: 340,
  },
  {
    name: 'Lehsun Ka Achaar (Garlic Pickle)',
    slug: 'lehsun-ka-achaar-garlic-pickle',
    description: 'Whole garlic cloves marinated in a rich, spiced mustard oil base for a minimum of 30 days. The result? A deeply flavoured, mildly pungent pickle that is an absolute game-changer for garlic lovers. Pairs beautifully with dal-chawal or paratha.',
    shortDescription: 'Whole garlic cloves slow-marinated in spiced mustard oil — pungent, flavourful perfection.',
    ingredients: ['Garlic Cloves', 'Mustard Oil', 'Red Chilli Powder', 'Vinegar', 'Salt', 'Fenugreek', 'Black Pepper'],
    category: 'Pickles',
    images: ['/images/products/garlic-pickle-real.jpg', '/images/products/garlic-pickle-aesthetic.jpg'],
    variants: [
      { weight: '250g', price: 200, discountPrice: 180, stock: 65 },
      { weight: '500g', price: 370, discountPrice: 340, stock: 45 },
    ],
    tags: ['garlic', 'spicy', 'pungent', 'premium'],
    isFeatured: true,
    isBestSeller: true,
    averageRating: 4.7,
    numReviews: 93,
    totalSold: 410,
  },
  {
    name: 'Mix Achaar (Mixed Pickle)',
    slug: 'mix-achaar-mixed-pickle',
    description: 'A glorious medley of seasonal vegetables — raw mango, carrot, cauliflower, turnip, and green chilli — all pickled together in our signature mustard oil blend. Every jar is a celebration of flavours and textures.',
    shortDescription: 'A vibrant medley of seasonal vegetables pickled in mustard oil and spices.',
    ingredients: ['Raw Mango', 'Carrot', 'Cauliflower', 'Turnip', 'Green Chilli', 'Mustard Oil', 'Salt', 'Red Chilli', 'Turmeric', 'Fenugreek'],
    category: 'Pickles',
    images: ['/images/products/mix-pickle-real.jpg', '/images/products/mix-pickle-aesthetic.jpg'],
    variants: [
      { weight: '250g', price: 170, discountPrice: 150, stock: 90 },
      { weight: '500g', price: 300, discountPrice: 270, stock: 70 },
      { weight: '1kg', price: 550, discountPrice: 499, stock: 50 },
    ],
    tags: ['mixed', 'vegetables', 'family favourite', 'everyday'],
    isFeatured: true,
    isBestSeller: true,
    averageRating: 4.5,
    numReviews: 156,
    totalSold: 720,
  },
  {
    name: 'Mirchi Ka Achaar (Green Chilli Pickle)',
    slug: 'mirchi-ka-achaar-green-chilli-pickle',
    description: 'Thick, meaty green chillies stuffed with a tangy-spicy filling of fennel, mustard, and amchur, then preserved in mustard oil. This one is for the brave-hearted — intensely fiery, deeply flavourful, and absolutely addictive.',
    shortDescription: 'Stuffed green chilli pickle — intensely fiery, deeply flavourful, and addictive.',
    ingredients: ['Thick Green Chillies', 'Fennel Seeds', 'Mustard Seeds', 'Dry Mango Powder', 'Mustard Oil', 'Salt', 'Asafoetida'],
    category: 'Pickles',
    images: ['/images/products/green-chili-pickle-real.jpg', '/images/products/green-chili-pickle-aesthetic.jpg'],
    variants: [
      { weight: '250g', price: 150, discountPrice: null, stock: 60 },
      { weight: '500g', price: 270, discountPrice: 250, stock: 40 },
    ],
    tags: ['chilli', 'spicy', 'fiery', 'bold'],
    isFeatured: false,
    isBestSeller: false,
    averageRating: 4.4,
    numReviews: 62,
    totalSold: 210,
  },
  {
    name: 'Gunda Pickle',
    slug: 'gunda-pickle',
    description: 'Traditional Gunda (Lasoda/Gum Berry) pickle, stuffed with tangy mango powder and authentic spices, preserved in mustard oil. A unique, slightly tart delicacy that pairs perfectly with parathas and traditional Indian meals.',
    shortDescription: 'Traditional Gunda (Gum Berry) stuffed pickle in mustard oil.',
    ingredients: ['Gunda', 'Mustard Oil', 'Mango Powder', 'Fenugreek Seeds', 'Fennel', 'Salt', 'Turmeric', 'Red Chilli'],
    category: 'Pickles',
    images: ['/images/products/gunda-pickle-real.jpg'],
    variants: [
      { weight: '250g', price: 180, discountPrice: 160, stock: 40 },
      { weight: '500g', price: 340, discountPrice: 300, stock: 25 },
    ],
    tags: ['gunda', 'lasoda', 'traditional', 'unique'],
    isFeatured: true,
    isBestSeller: false,
    averageRating: 4.8,
    numReviews: 24,
    totalSold: 110,
  },
  {
    name: 'Karela Achaar (Bitter Gourd Pickle)',
    slug: 'karela-achaar-bitter-gourd-pickle',
    description: 'Bitter gourd pickled with a balancing blend of jaggery, tamarind, and spices that tames the bitterness into something complex and deeply satisfying. A beloved traditional pickle that is both a health food and a flavour revelation.',
    shortDescription: 'Bitter gourd tamed with jaggery and tamarind — complex, healthy, and delicious.',
    ingredients: ['Bitter Gourd', 'Jaggery', 'Tamarind', 'Mustard Oil', 'Red Chilli', 'Salt', 'Fennel', 'Turmeric'],
    category: 'Pickles',
    images: ['/images/products/bitter-gourd-pickle-1.jpg', '/images/products/bitter-gourd-pickle-2.jpg'],
    variants: [
      { weight: '250g', price: 160, discountPrice: 140, stock: 45 },
      { weight: '500g', price: 290, discountPrice: 260, stock: 30 },
    ],
    tags: ['bitter gourd', 'health', 'traditional', 'unique'],
    isFeatured: false,
    isBestSeller: false,
    averageRating: 4.3,
    numReviews: 41,
    totalSold: 145,
  },
  {
    name: 'Supreme Garam Masala',
    slug: 'supreme-garam-masala',
    description: 'Hand-ground from 18 whole spices, this garam masala is slow-roasted to extract maximum flavour and aroma. Unlike factory blends, every batch is made fresh and ground in small quantities — no preservatives, no fillers. Just pure, fragrant spice magic.',
    shortDescription: 'Hand-ground from 18 whole spices, freshly roasted in small batches — pure aromatic perfection.',
    ingredients: ['Cinnamon', 'Cardamom', 'Cloves', 'Black Pepper', 'Cumin', 'Coriander', 'Nutmeg', 'Mace', 'Bay Leaves', 'Caraway', 'Star Anise', 'Black Cardamom'],
    category: 'Spices',
    images: ['/images/products/garam-masala-1.jpg', '/images/products/garam-masala-2.jpg'],
    variants: [
      { weight: '100g', price: 180, discountPrice: 160, stock: 100 },
      { weight: '200g', price: 320, discountPrice: 290, stock: 80 },
      { weight: '500g', price: 720, discountPrice: 650, stock: 50 },
    ],
    tags: ['garam masala', 'spice blend', 'premium', 'freshly ground'],
    isFeatured: true,
    isBestSeller: true,
    averageRating: 4.9,
    numReviews: 203,
    totalSold: 890,
  },
  {
    name: 'Pure Haldi Powder (Turmeric)',
    slug: 'pure-haldi-powder-turmeric',
    description: 'Single-origin Lakadong turmeric from Meghalaya, known for its exceptionally high curcumin content (6-8% vs 2-3% in regular turmeric). Vibrant golden colour, earthy aroma, and genuine health benefits — nothing added, nothing removed.',
    shortDescription: 'Single-origin Lakadong turmeric — exceptionally high curcumin, vibrant golden colour.',
    ingredients: ['100% Pure Lakadong Turmeric'],
    category: 'Spices',
    images: ['/images/products/turmeric-1.jpg', '/images/products/turmeric-2.jpg'],
    variants: [
      { weight: '100g', price: 120, discountPrice: null, stock: 120 },
      { weight: '200g', price: 210, discountPrice: 190, stock: 100 },
      { weight: '500g', price: 480, discountPrice: 430, stock: 70 },
    ],
    tags: ['turmeric', 'haldi', 'organic', 'health', 'lakadong'],
    isFeatured: false,
    isBestSeller: true,
    averageRating: 4.8,
    numReviews: 178,
    totalSold: 750,
  },
  {
    name: 'Lal Mirch Powder (Kashmiri Red Chilli)',
    slug: 'lal-mirch-powder-kashmiri-red-chilli',
    description: 'Vibrant, deep-red Kashmiri chilli powder with a beautiful colour and moderate heat. This is the spice that makes your curries look restaurant-stunning. Stone-ground from premium Kashmiri chillies for maximum colour and gentle warmth.',
    shortDescription: 'Deep-red Kashmiri chilli — vibrant colour, moderate heat, restaurant-quality results.',
    ingredients: ['100% Pure Kashmiri Red Chilli'],
    category: 'Spices',
    images: ['/images/products/red-chilli-1.jpg', '/images/products/red-chilli-2.jpg'],
    variants: [
      { weight: '100g', price: 130, discountPrice: null, stock: 110 },
      { weight: '200g', price: 230, discountPrice: 210, stock: 90 },
      { weight: '500g', price: 520, discountPrice: 470, stock: 60 },
    ],
    tags: ['red chilli', 'kashmiri', 'colour', 'spice'],
    isFeatured: false,
    isBestSeller: false,
    averageRating: 4.7,
    numReviews: 112,
    totalSold: 490,
  },
  {
    name: 'Dhaniya Jeera Powder (Coriander-Cumin Blend)',
    slug: 'dhaniya-jeera-powder',
    description: 'The backbone of Indian cooking — our 2:1 ratio dhaniya-jeera blend is slow-roasted and freshly stone-ground. Fragrant, earthy, and deeply aromatic, this is the spice that transforms simple home cooking into something extraordinary.',
    shortDescription: 'Freshly stone-ground coriander-cumin blend — the backbone of Indian cooking.',
    ingredients: ['Coriander Seeds', 'Cumin Seeds'],
    category: 'Spices',
    images: ['/images/products/dhaniya-jeera-1.jpg', '/images/products/dhaniya-jeera-2.jpg'],
    variants: [
      { weight: '100g', price: 110, discountPrice: null, stock: 130 },
      { weight: '200g', price: 190, discountPrice: 170, stock: 100 },
      { weight: '500g', price: 430, discountPrice: 390, stock: 75 },
    ],
    tags: ['coriander', 'cumin', 'dhania jeera', 'essential spice'],
    isFeatured: false,
    isBestSeller: false,
    averageRating: 4.6,
    numReviews: 89,
    totalSold: 380,
  },
  {
    name: 'Achaar Masala Blend (Pickling Spice Mix)',
    slug: 'achaar-masala-blend',
    description: 'Our proprietary achaar masala blend — the same mix we use in all our pickles. Perfect for home pickle-makers who want authentic flavour. Contains 10 whole and ground spices in the exact ratios for restaurant-quality homemade pickles.',
    shortDescription: 'Our secret pickling spice blend — make authentic homemade pickles with ease.',
    ingredients: ['Fenugreek', 'Fennel', 'Nigella Seeds', 'Mustard Seeds', 'Carom Seeds', 'Red Chilli', 'Turmeric', 'Salt', 'Asafoetida', 'Dry Mango Powder'],
    category: 'Spices',
    images: ['/images/products/achaar-masala-1.jpg', '/images/products/achaar-masala-2.jpg'],
    variants: [
      { weight: '100g', price: 150, discountPrice: 130, stock: 85 },
      { weight: '200g', price: 270, discountPrice: 240, stock: 65 },
    ],
    tags: ['achaar masala', 'pickling', 'spice blend', 'DIY'],
    isFeatured: false,
    isBestSeller: false,
    averageRating: 4.5,
    numReviews: 54,
    totalSold: 220,
  },
  {
    name: 'Himalayan Pink Sendha Namak (Rock Salt)',
    slug: 'himalayan-pink-sendha-namak',
    description: 'Unrefined Himalayan pink rock salt, hand-mined from the ancient salt ranges of Khewra. Rich in 84 trace minerals, this salt enhances flavours naturally without any chemical processing. Ideal for pickling, cooking, and fasting days.',
    shortDescription: 'Unrefined Himalayan rock salt — 84 trace minerals, pure and chemical-free.',
    ingredients: ['100% Natural Himalayan Pink Rock Salt'],
    category: 'Spices',
    images: ['/images/products/rock-salt-1.jpg', '/images/products/rock-salt-2.jpg'],
    variants: [
      { weight: '250g', price: 90, discountPrice: null, stock: 150 },
      { weight: '500g', price: 160, discountPrice: 145, stock: 120 },
    ],
    tags: ['rock salt', 'sendha namak', 'himalayan', 'natural', 'minerals'],
    isFeatured: false,
    isBestSeller: false,
    averageRating: 4.7,
    numReviews: 73,
    totalSold: 310,
  },
  {
    name: 'Pickle Trio Combo Pack',
    slug: 'pickle-trio-combo-pack',
    description: 'Can\'t decide? Get all three! Our most popular Pickle Trio Combo brings together our bestselling Mango, Mixed, and Garlic pickles in 250g jars each. Packed in a branded gift box, this combo is also a perfect gift for pickle lovers.',
    shortDescription: 'Three bestselling pickles in one gift-ready box — Mango, Mixed & Garlic (250g each).',
    ingredients: ['Aam Ka Achaar 250g', 'Mix Achaar 250g', 'Lehsun Ka Achaar 250g'],
    category: 'Combos',
    images: ['/images/products/combo-trio-1.jpg', '/images/products/combo-trio-2.jpg'],
    price: 450,
    discountPrice: 399,
    stock: 55,
    tags: ['combo', 'gift', 'bestseller', 'trio', 'value'],
    isFeatured: true,
    isBestSeller: true,
    averageRating: 4.8,
    numReviews: 98,
    totalSold: 445,
  },
  {
    name: 'Spice Starter Pack',
    slug: 'spice-starter-pack',
    description: 'The perfect introduction to the world of authentic Indian spices. This curated starter pack contains our Garam Masala, Haldi Powder, Lal Mirch, and Dhaniya Jeera in handy 100g packs — everything you need to transform your everyday cooking.',
    shortDescription: 'Four essential spices in 100g packs — the perfect starter kit for your spice cabinet.',
    ingredients: ['Garam Masala 100g', 'Haldi Powder 100g', 'Lal Mirch Powder 100g', 'Dhaniya Jeera 100g'],
    category: 'Combos',
    images: ['/images/products/spice-starter-1.jpg', '/images/products/spice-starter-2.jpg'],
    price: 380,
    discountPrice: 340,
    stock: 65,
    tags: ['combo', 'spices', 'starter', 'essentials', 'gift'],
    isFeatured: true,
    isBestSeller: false,
    averageRating: 4.7,
    numReviews: 67,
    totalSold: 290,
  },
  {
    name: 'Supreme Gift Hamper — The Grand Indulgence',
    slug: 'supreme-gift-hamper-grand-indulgence',
    description: 'The ultimate Supreme Pickles experience, beautifully curated in a handcrafted wooden crate. Includes our 5 bestselling pickles (250g each), 3 premium spices (100g each), the Achaar Masala blend, and a personalised note card. Perfect for Diwali, weddings, corporate gifting, or any special occasion.',
    shortDescription: 'Handcrafted wooden crate with 5 pickles + 3 spices — the ultimate gifting experience.',
    ingredients: ['Mango Pickle 250g', 'Mixed Pickle 250g', 'Garlic Pickle 250g', 'Lemon Pickle 250g', 'Chilli Pickle 250g', 'Garam Masala 100g', 'Haldi Powder 100g', 'Lal Mirch 100g', 'Achaar Masala 100g'],
    category: 'Gift Hampers',
    images: ['/images/products/gift-hamper-1.jpg', '/images/products/gift-hamper-2.jpg'],
    price: 799,
    discountPrice: 749,
    stock: 30,
    tags: ['gift hamper', 'premium', 'diwali', 'corporate', 'wooden crate'],
    isFeatured: true,
    isBestSeller: false,
    averageRating: 4.9,
    numReviews: 45,
    totalSold: 178,
  },
];

const coupons = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 200,
    maxDiscount: 100,
    isActive: true,
  },
  {
    code: 'PICKLE50',
    discountType: 'flat',
    discountValue: 50,
    minOrderAmount: 499,
    isActive: true,
  },
  {
    code: 'SPICE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 300,
    maxDiscount: 150,
    isActive: true,
  },
];

const seed = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    console.log('🌱 Seeding products...');
    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);

    console.log('🎫 Seeding coupons...');
    await Coupon.insertMany(coupons);
    console.log(`✅ Inserted ${coupons.length} coupons (WELCOME10, PICKLE50, SPICE20)`);

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@supremepickles.in' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin Supreme',
        email: 'admin@supremepickles.in',
        password: 'admin123456',
        role: 'admin',
      });
      console.log('👤 Admin user created: admin@supremepickles.in / admin123456');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('📦 Products: 15 items across Pickles, Spices, Combos & Gift Hampers');
    console.log('🎫 Coupons: WELCOME10, PICKLE50, SPICE20');
    console.log('👤 Admin: admin@supremepickles.in / admin123456\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
