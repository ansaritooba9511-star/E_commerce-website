/**
 * LAVENDER & CO. - Product Catalog & Static Data
 * Realistic luxury products across 4 core categories with Indian Rupee (₹) pricing
 */

const CATEGORIES_DATA = [
  {
    id: "fashion",
    name: "Fashion & Accessories",
    description: "Silken scarves, linen silhouettes, and artisanal leather pieces.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    itemCount: 4
  },
  {
    id: "home",
    name: "Home Decor",
    description: "Ceramic vessels, handcrafted throws, and warm ambient touches.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    itemCount: 4
  },
  {
    id: "beauty",
    name: "Beauty & Self-Care",
    description: "Botanical oils, wild lavender elixirs, and calming bath rituals.",
    image: "https://images.unsplash.com/photo-1608248597359-715764d9f67a?auto=format&fit=crop&w=800&q=80",
    itemCount: 4
  },
  {
    id: "stationery",
    name: "Stationery & Gifts",
    description: "Gold-embossed journals, linen stationery, and keepsake gift boxes.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    itemCount: 4
  }
];

const PRODUCTS_DATA = [
  {
    id: 1,
    name: "French Silk Lavender Foulard",
    category: "fashion",
    categoryLabel: "Fashion & Accessories",
    price: 2490,
    originalPrice: 3200,
    rating: 4.9,
    reviewsCount: 128,
    badge: "Best Seller",
    featured: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
    description: "Spun from 100% mulberry silk, this ethereal scarf features hand-rolled edges and a delicate Provence wildflower motif in soft lavender and mocha undertones.",
    options: {
      type: "Color",
      values: ["Soft Lilac", "Mocha Brown", "Chantilly Cream"]
    },
    specs: ["100% Pure Mulberry Silk", "Dimensions: 70cm x 70cm", "Dry clean only", "Gift box included"]
  },
  {
    id: 2,
    name: "Artisan Ceramic Urn Vase",
    category: "home",
    categoryLabel: "Home Decor",
    price: 3850,
    originalPrice: 4500,
    rating: 4.8,
    reviewsCount: 84,
    badge: "Artisanal",
    featured: true,
    isNew: true,
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    description: "Hand-thrown stoneware finished in a matte speckled cream glaze with subtle earthy clay foot. Perfect for dried botanical stems or as a standalone architectural piece.",
    options: {
      type: "Size",
      values: ["Medium (22cm)", "Large (30cm)"]
    },
    specs: ["Handcrafted glazed stoneware", "Water-tight interior", "Wipe clean with soft damp cloth", "Made in small batches"]
  },
  {
    id: 3,
    name: "Nocturne Botanical Sleep Oil",
    category: "beauty",
    categoryLabel: "Beauty & Self-Care",
    price: 1850,
    originalPrice: 2200,
    rating: 5.0,
    reviewsCount: 215,
    badge: "Customer Favorite",
    featured: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1608248597359-715764d9f67a?auto=format&fit=crop&w=800&q=80",
    description: "An intoxicating night recovery elixir enriched with cold-pressed French lavender, organic jojoba, and blue chamomile to restore your skin and calm the senses.",
    options: {
      type: "Volume",
      values: ["30ml Dropper", "50ml Luxury Bottle"]
    },
    specs: ["100% Organic cold-pressed oils", "Paraben and cruelty-free", "Infused with high-altitude lavender", "Recyclable glass dropper"]
  },
  {
    id: 4,
    name: "Woven Linen & Leather Tote",
    category: "fashion",
    categoryLabel: "Fashion & Accessories",
    price: 4950,
    originalPrice: 5900,
    rating: 4.9,
    reviewsCount: 96,
    badge: "Trending",
    featured: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    description: "A timeless daily companion crafted from Belgian flax linen with vegetable-tanned chocolate brown leather trim, interior zip compartment, and magnetic closure.",
    options: {
      type: "Color",
      values: ["Mocha & Oatmeal", "Lavender Hue", "Dark Espresso"]
    },
    specs: ["Heavyweight natural flax linen", "Full-grain Italian leather handles", "Brass hardware", "Includes dust bag"]
  },
  {
    id: 5,
    name: "Hand-Poured Soy Lavender Candle",
    category: "home",
    categoryLabel: "Home Decor",
    price: 1290,
    originalPrice: 1600,
    rating: 4.7,
    reviewsCount: 312,
    badge: "20% OFF",
    featured: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    description: "Cast in a reusable textured ceramic vessel with notes of wild lavender, smoked vanilla beans, cedarwood, and dried sage. Clean-burning wooden wick with crackling sound.",
    options: {
      type: "Scent Variant",
      values: ["Wild Lavender & Sage", "Vanilla Mocha", "Lavender Rosewood"]
    },
    specs: ["100% Clean soy wax", "Crackling wooden wick", "65 hours burn time", "Phthalate-free fragrance oils"]
  },
  {
    id: 6,
    name: "Linen-Bound Gilded Journal",
    category: "stationery",
    categoryLabel: "Stationery & Gifts",
    price: 1450,
    originalPrice: 1800,
    rating: 4.9,
    reviewsCount: 164,
    badge: "New",
    featured: true,
    isNew: true,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    description: "Hardcover journal wrapped in tactile lavender book-cloth with gold foil title stamping, 240 lined pages of 120gsm acid-free fountain-pen friendly paper, and ribbon marker.",
    options: {
      type: "Ruling",
      values: ["College Lined", "Dotted Grid", "Blank Sketch"]
    },
    specs: ["Acid-free 120gsm archival paper", "Lay-flat Smyth-sewn binding", "Expandable back pocket", "240 gilded edge pages"]
  },
  {
    id: 7,
    name: "Cashmere-Touch Relaxed Cardigan",
    category: "fashion",
    categoryLabel: "Fashion & Accessories",
    price: 5200,
    originalPrice: 6500,
    rating: 4.8,
    reviewsCount: 78,
    badge: "Editor's Pick",
    featured: true,
    isNew: true,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    description: "An effortlessly slouchy knit in a muted heather lavender tint with tortoiseshell buttons and rib-knit trims. The ultimate layer for cozy mornings and chic evening outings.",
    options: {
      type: "Size",
      values: ["XS", "S", "M", "L", "XL"]
    },
    specs: ["Ultra-soft fine gauge knit blend", "Natural horn buttons", "Dropped shoulder silhouette", "Hand wash cold"]
  },
  {
    id: 8,
    name: "Himalayan Pink Salt & Lavender Scrub",
    category: "beauty",
    categoryLabel: "Beauty & Self-Care",
    price: 1150,
    originalPrice: 1400,
    rating: 4.9,
    reviewsCount: 198,
    badge: "Organic",
    featured: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    description: "Exfoliating mineral salts suspended in cold-pressed sweet almond oil and therapeutic grade lavender buds. Leaves skin velvety soft with a heavenly lingering scent.",
    options: {
      type: "Jar Size",
      values: ["250g Glass Jar", "500g Value Tub"]
    },
    specs: ["100% Natural minerals", "Handcrafted in small batches", "Includes wooden scoop", "Free from artificial dyes"]
  },
  {
    id: 9,
    name: "Fluted Ribbed Glass Carafe Set",
    category: "home",
    categoryLabel: "Home Decor",
    price: 2600,
    originalPrice: 3200,
    rating: 4.7,
    reviewsCount: 62,
    badge: "Popular",
    featured: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    description: "Mouth-blown borosilicate glass featuring delicate vertical fluting and a warm amber-mocha tint. Includes a 1L carafe and two matching nesting tumblers.",
    options: {
      type: "Tint",
      values: ["Warm Amber Mocha", "Smoky Lavender", "Crystal Clear"]
    },
    specs: ["Heat-resistant borosilicate", "Carafe capacity: 1000ml", "Two 300ml glasses included", "Dishwasher safe"]
  },
  {
    id: 10,
    name: "Handmade Brass & Wax Seal Kit",
    category: "stationery",
    categoryLabel: "Stationery & Gifts",
    price: 1890,
    originalPrice: 2400,
    rating: 5.0,
    reviewsCount: 88,
    badge: "Gift Choice",
    featured: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
    description: "An heirloom-worthy letter-writing set containing an antique brass seal with a botanical lavender motif, melting spoon, and four sticks of flexible metallic wax.",
    options: {
      type: "Wax Shade",
      values: ["Lavender & Rose Gold", "Antique Bronze", "Pearlescent Cream"]
    },
    specs: ["Solid brass engraved stamp head", "Walnut wood handle", "4 premium flexible wax sticks", "Presented in keepsake velvet box"]
  },
  {
    id: 11,
    name: "Silk Pillowcase & Eye Mask Set",
    category: "beauty",
    categoryLabel: "Beauty & Self-Care",
    price: 3400,
    originalPrice: 4200,
    rating: 4.9,
    reviewsCount: 245,
    badge: "15% OFF",
    featured: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    description: "22 Momme Grade 6A pure mulberry silk bedding set designed to reduce hair friction and maintain delicate skin hydration overnight. Includes padded sleeping mask.",
    options: {
      type: "Color",
      values: ["Dusty Lavender", "Warm Mocha", "Pearl Champagne"]
    },
    specs: ["100% 22-Momme Mulberry Silk", "Concealed zipper closure", "Queen Size (51x76cm)", "Hypoallergenic and temperature-regulating"]
  },
  {
    id: 12,
    name: "Artisanal Ceramic Coffee Mug",
    category: "home",
    categoryLabel: "Home Decor",
    price: 990,
    originalPrice: 1250,
    rating: 4.8,
    reviewsCount: 142,
    badge: "Under ₹1000",
    featured: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    description: "Generous 350ml hand-pinched stoneware mug dipped in a two-tone lavender and dark chocolate glaze. Ergonomically shaped thumb rest for comforting warm morning sips.",
    options: {
      type: "Finish",
      values: ["Two-Tone Glaze", "Speckled Cream", "Smoky Mocha"]
    },
    specs: ["Durable stoneware clay", "Capacity: 350ml", "Microwave & dishwasher safe", "Lead-free food-safe glaze"]
  },
  {
    id: 13,
    name: "Leather Bound Recipe Journal",
    category: "stationery",
    categoryLabel: "Stationery & Gifts",
    price: 2100,
    originalPrice: 2600,
    rating: 4.9,
    reviewsCount: 74,
    badge: "Exclusive",
    featured: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    description: "Supple mocha brown leather wrap journal with leather tie strap and deckled cotton handmade paper. Built to document family culinary treasures across generations.",
    options: {
      type: "Binding",
      values: ["Wrap Tie Strap", "Brass Buckle"]
    },
    specs: ["Hand-stitched genuine buff leather", "100% recycled cotton rag paper", "180 unlined deckled pages", "Pen loop included"]
  },
  {
    id: 14,
    name: "Linen Lounge Robe & Belt",
    category: "fashion",
    categoryLabel: "Fashion & Accessories",
    price: 3990,
    originalPrice: 4800,
    rating: 4.8,
    reviewsCount: 110,
    badge: "Lounge Edit",
    featured: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    description: "Stone-washed European flax robe with generous patch pockets, wide kimono sleeves, and removable sash. Breathable in summer and delightfully cozy in winter.",
    options: {
      type: "Size",
      values: ["S / M", "L / XL"]
    },
    specs: ["100% Pre-washed European linen", "Calf-length cut", "Deep front pockets", "Machine washable"]
  },
  {
    id: 15,
    name: "Waffle Weave Organic Throw",
    category: "home",
    categoryLabel: "Home Decor",
    price: 2950,
    originalPrice: 3600,
    rating: 4.9,
    reviewsCount: 135,
    badge: "Bestseller",
    featured: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    description: "Sumptuously plush organic cotton waffle throw in rich espresso mocha with subtle lavender fringed trims. Generously sized for sofa draping and bed layering.",
    options: {
      type: "Size",
      values: ["Standard (130x170cm)", "King (180x220cm)"]
    },
    specs: ["GOTS certified organic cotton", "Breathable deep waffle texture", "Self-fringed hems", "Machine washable gentle"]
  },
  {
    id: 16,
    name: "French Lavender Mist & Roller Gift Duo",
    category: "stationery",
    categoryLabel: "Stationery & Gifts",
    price: 1750,
    originalPrice: 2100,
    rating: 5.0,
    reviewsCount: 180,
    badge: "Gift Set",
    featured: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    description: "Curated gift set featuring our best-selling Linen & Room Pillow Mist (100ml) paired with a travel-friendly pulse point pulse rollerball infused with amethyst chips.",
    options: {
      type: "Gift Box",
      values: ["Signature Lavender Box", "Mocha Keepsake Box"]
    },
    specs: ["100ml Glass fine mist bottle", "10ml Amethyst rollerball", "Embossed luxury gift packaging", "Personalized note card option"]
  }
];

const TESTIMONIALS_DATA = [
  {
    id: 1,
    quote: "LAVENDER & CO. has completely transformed my daily routine. The French Silk Foulard arrived wrapped in tissue paper with real dried lavender sprigs. The attention to detail is unmatched.",
    author: "Ananya Deshmukh",
    city: "Mumbai, India",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    product: "Verified Buyer • Silk Foulard"
  },
  {
    id: 2,
    quote: "The soy candle burns so evenly and fills my living room with the most soothing, sophisticated scent. Not cloying at all — just refined calm in a gorgeous ceramic jar.",
    author: "Rohan Varma",
    city: "Bengaluru, India",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    product: "Verified Buyer • Soy Lavender Candle"
  },
  {
    id: 3,
    quote: "I bought the sleep oil and the silk pillowcase. It genuinely feels like bringing a high-end luxury spa retreat into my own home. My sleep has noticeably improved.",
    author: "Meera Krishnan",
    city: "Chennai, India",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    product: "Verified Buyer • Nocturne Sleep Oil"
  }
];

const FAQS_DATA = [
  {
    question: "Where are your products sourced and crafted?",
    answer: "Our botanical ingredients, including wild lavender, are ethically harvested from small-batch farms in Provence and the Nilgiri hills. Our ceramics and textiles are handcrafted by master artisans in India and Portugal using sustainably sourced raw materials."
  },
  {
    question: "What are your shipping timelines across India?",
    answer: "Orders are processed within 24 hours. We offer complimentary express delivery on all orders above ₹1,999. Standard delivery typically takes 2–4 business days across tier-1 cities and 3–6 business days for the rest of India."
  },
  {
    question: "Are your beauty & self-care formulas clean and cruelty-free?",
    answer: "Absolutely. 100% of our personal care formulations are cruelty-free, paraben-free, vegan, and free from synthetic dyes or artificial fragrances. We test only on willing human friends, never on animals."
  },
  {
    question: "Can I send an item as a gift with a personalized message?",
    answer: "Yes! Every order can be packaged in our signature lavender and mocha embossed gift box with a handwritten calligraphy note. Simply select 'Gift Packaging' at checkout and input your message."
  },
  {
    question: "What is your return and exchange policy?",
    answer: "We offer a seamless 15-day return policy for unused lifestyle, decor, and fashion items in original packaging. For hygiene reasons, opened beauty formulas cannot be returned unless damaged upon arrival."
  }
];
