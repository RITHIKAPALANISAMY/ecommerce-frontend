/* ================= BEAUTY ================= */

import sunscreen1 from "../assets/product/sunscreen1.jpg";
import sunscreen2 from "../assets/product/sunscreen2.webp";
import sunscreen3 from "../assets/product/sunscreen3.webp";
import facewash1 from "../assets/product/facewash1.jpg";

/* ================= FASHION ================= */

import sneakers1 from "../assets/product/sneakers1.avif";
import sneakers2 from "../assets/product/sneakers2.avif";
import sneakers3 from "../assets/product/sneakers3.avif";
import tshirt1 from "../assets/product/tshirt1.jpg";

/* ================= ELECTRONICS ================= */

import headphone1 from "../assets/product/headphone1.jpg";
import laptop1 from "../assets/product/laptop1.jpg";

/* ================= MOBILES ================= */

import mobile1 from "../assets/product/mobile1.jpg";
import mobile2 from "../assets/product/mobile2.jpg";

/* ================= HOME ================= */

import mixer1 from "../assets/product/mixer1.jpg";
import bedsheet1 from "../assets/product/bedsheet1.jpg";

/* ================= GROCERY ================= */

import rice1 from "../assets/product/rice1.jpg";
import oil1 from "../assets/product/oil1.jpg";

const products = [
  {
    id: 1,
    title: "Sunscreen SPF 50 PA+++ 100ml",
    brand: "SunGuard",
    category: "Beauty",
    price: 899,
    mrp: 1499,
    discount: 40,
    stock: 150,
    images: [sunscreen1, sunscreen2, sunscreen3],
    description: {
      about:
        "SunGuard SPF 50 PA+++ sunscreen provides advanced protection against harmful UVA and UVB rays. It is specially formulated for Indian skin conditions and helps prevent tanning, sunburn, and premature aging.",
      highlights: [
        "SPF 50 PA+++ broad spectrum protection",
        "Lightweight and non-greasy formula",
        "Water and sweat resistant",
        "Suitable for all skin types"
      ],
      material: "Dermatologically tested UV filters",
      usage: "Apply generously 15 minutes before sun exposure",
      care: "Reapply every 2-3 hours when outdoors",
      warranty: "Not applicable"
    },
    reviews: []
  },

  {
    id: 2,
    title: "Herbal Face Wash 150ml",
    brand: "GlowCare",
    category: "Beauty",
    price: 299,
    mrp: 399,
    discount: 25,
    stock: 200,
    images: [facewash1],
    description: {
      about:
        "GlowCare Herbal Face Wash gently cleanses the skin while maintaining natural moisture. Enriched with herbal extracts, it removes dirt and excess oil without drying the skin.",
      highlights: [
        "Gentle herbal formulation",
        "Removes dirt and impurities",
        "Maintains skin hydration",
        "Ideal for daily use"
      ],
      material: "Herbal extracts and mild cleansers",
      usage: "Use twice daily on wet face",
      care: "Avoid contact with eyes",
      warranty: "Not applicable"
    },
    reviews: []
  },

  {
    id: 3,
    title: "Running Sneakers for Men",
    brand: "Nike",
    category: "Fashion",
    price: 2999,
    mrp: 4999,
    discount: 40,
    stock: 80,
    images: [sneakers1, sneakers2, sneakers3],
    description: {
      about:
        "Nike running sneakers are designed for maximum comfort and performance. Ideal for running, walking, and gym workouts, they provide excellent cushioning and grip.",
      highlights: [
        "Breathable mesh upper",
        "Shock-absorbing cushioned sole",
        "Anti-slip rubber outsole",
        "Lightweight and durable design"
      ],
      material: "Mesh upper with rubber sole",
      usage: "Suitable for sports and daily wear",
      care: "Clean with dry cloth only",
      warranty: "6 months manufacturer warranty"
    },
    reviews: []
  },

  {
    id: 4,
    title: "Men Cotton T-Shirt",
    brand: "Puma",
    category: "Fashion",
    price: 799,
    mrp: 1299,
    discount: 38,
    stock: 120,
    images: [tshirt1],
    description: {
      about:
        "This Puma cotton T-shirt offers comfort and style for everyday wear. Designed with breathable fabric, it keeps you comfortable throughout the day.",
      highlights: [
        "100% soft cotton fabric",
        "Regular fit for daily comfort",
        "Colorfast and durable",
        "Ideal for casual wear"
      ],
      material: "Pure cotton",
      usage: "Casual and daily wear",
      care: "Machine wash cold",
      warranty: "No warranty"
    },
    reviews: []
  },

  {
    id: 5,
    title: "Wireless Bluetooth Headphones",
    brand: "Boat",
    category: "Electronics",
    price: 1499,
    mrp: 2999,
    discount: 50,
    stock: 90,
    images: [headphone1],
    description: {
      about:
        "Boat wireless headphones deliver immersive sound quality with deep bass. Designed for music, calls, and gaming, they provide long-lasting comfort.",
      highlights: [
        "High-quality sound output",
        "Built-in microphone for calls",
        "Long battery life",
        "Comfortable ear cushions"
      ],
      material: "ABS body with cushioned ear pads",
      usage: "Music, calls, and entertainment",
      care: "Keep away from water",
      warranty: "1 year manufacturer warranty"
    },
    reviews: []
  },

  {
    id: 6,
    title: "Laptop 15.6-inch SSD",
    brand: "HP",
    category: "Electronics",
    price: 52999,
    mrp: 64999,
    discount: 18,
    stock: 40,
    images: [laptop1],
    description: {
      about:
        "This HP laptop is designed for performance and productivity. With SSD storage and fast processing, it is ideal for office work, studies, and entertainment.",
      highlights: [
        "15.6-inch Full HD display",
        "Fast SSD storage",
        "Smooth multitasking performance",
        "Lightweight and portable design"
      ],
      material: "Metallic body",
      usage: "Office, education, and entertainment",
      care: "Use laptop bag for protection",
      warranty: "1 year manufacturer warranty"
    },
    reviews: []
  },

  {
    id: 7,
    title: "Smartphone 5G (128GB)",
    brand: "Samsung",
    category: "Mobiles",
    price: 24999,
    mrp: 29999,
    discount: 17,
    stock: 70,
    images: [mobile1],
    description: {
      about:
        "Samsung 5G smartphone offers powerful performance, stunning display, and advanced camera features. Built for multitasking and entertainment.",
      highlights: [
        "5G connectivity",
        "AMOLED display",
        "High-quality camera system",
        "Long-lasting battery"
      ],
      material: "Glass front with metal frame",
      usage: "Daily use, photography, and gaming",
      care: "Use protective case",
      warranty: "1 year manufacturer warranty"
    },
    reviews: []
  },

  {
    id: 8,
    title: "Budget Smartphone (64GB)",
    brand: "Redmi",
    category: "Mobiles",
    price: 11999,
    mrp: 14999,
    discount: 20,
    stock: 100,
    images: [mobile2],
    description: {
      about:
        "Redmi budget smartphone delivers reliable performance at an affordable price. Suitable for daily tasks, calls, and media consumption.",
      highlights: [
        "Long battery life",
        "Smooth daily performance",
        "Value for money",
        "User-friendly interface"
      ],
      material: "Polycarbonate body",
      usage: "Daily communication and apps",
      care: "Avoid water exposure",
      warranty: "1 year manufacturer warranty"
    },
    reviews: []
  },

  {
    id: 9,
    title: "Mixer Grinder 750W",
    brand: "Prestige",
    category: "Home",
    price: 3499,
    mrp: 4999,
    discount: 30,
    stock: 60,
    images: [mixer1],
    description: {
      about:
        "Prestige mixer grinder is designed for Indian cooking needs. Powerful motor ensures smooth grinding and blending.",
      highlights: [
        "750W powerful motor",
        "Multiple jars for different uses",
        "Durable stainless steel blades",
        "Overload protection"
      ],
      material: "ABS body with steel jars",
      usage: "Grinding and blending",
      care: "Clean jars after use",
      warranty: "1 year manufacturer warranty"
    },
    reviews: []
  },

  {
    id: 10,
    title: "Cotton Double Bedsheet",
    brand: "Bombay Dyeing",
    category: "Home",
    price: 1299,
    mrp: 1999,
    discount: 35,
    stock: 90,
    images: [bedsheet1],
    description: {
      about:
        "Bombay Dyeing cotton bedsheet offers comfort and elegance. Soft fabric ensures a pleasant sleeping experience.",
      highlights: [
        "100% cotton fabric",
        "Soft and breathable",
        "Colorfast and durable",
        "Includes pillow covers"
      ],
      material: "Pure cotton",
      usage: "Daily home use",
      care: "Machine wash cold",
      warranty: "No warranty"
    },
    reviews: []
  },

  {
    id: 11,
    title: "Basmati Rice 5kg",
    brand: "India Gate",
    category: "Grocery",
    price: 699,
    mrp: 899,
    discount: 22,
    stock: 200,
    images: [rice1],
    description: {
      about:
        "India Gate basmati rice is known for its long grains and rich aroma. Ideal for biryani and special meals.",
      highlights: [
        "Premium quality long grains",
        "Rich aroma and taste",
        "Non-sticky texture",
        "Ideal for special dishes"
      ],
      material: "Natural basmati rice",
      usage: "Cooking rice dishes",
      care: "Store in a dry place",
      warranty: "Not applicable"
    },
    reviews: []
  },

  {
    id: 12,
    title: "Sunflower Cooking Oil 1L",
    brand: "Fortune",
    category: "Grocery",
    price: 179,
    mrp: 220,
    discount: 19,
    stock: 300,
    images: [oil1],
    description: {
      about:
        "Fortune sunflower oil is a healthy choice for everyday cooking. Light and refined oil suitable for Indian cuisine.",
      highlights: [
        "Refined sunflower oil",
        "Light and healthy",
        "Maintains food taste",
        "Suitable for daily cooking"
      ],
      material: "Refined sunflower oil",
      usage: "Cooking and frying",
      care: "Store in cool and dry place",
      warranty: "Not applicable"
    },
    reviews: []
  }
];

export default products;
