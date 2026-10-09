require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 20 },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const products = [

  // =====================================================
  // MOBILES
  // =====================================================

  {
    name: "Nova X12 5G",
    category: "Mobiles",
    price: 24999,
    oldPrice: 28999,
    description:
      "Modern 5G smartphone with a large display, powerful processor and advanced camera system.",
    image:
      "https://images.pexels.com/photos/5961044/pexels-photo-5961044.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.7,
    reviews: 184,
    stock: 24,
    featured: true,
    tags: ["5G", "smartphone", "camera"],
  },

  {
    name: "Pulse Lite",
    category: "Mobiles",
    price: 14999,
    oldPrice: 17999,
    description:
      "Slim smartphone with a clean app-filled display, lightweight body and smooth everyday performance.",
    image:
      "https://images.pexels.com/photos/11216305/pexels-photo-11216305.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.5,
    reviews: 126,
    stock: 32,
    featured: true,
    tags: ["smartphone", "display", "apps"],
  },

  {
    name: "Apex Pro Max",
    category: "Mobiles",
    price: 42999,
    oldPrice: 47999,
    description:
      "Premium flagship-style smartphone with a sleek body, bright display and professional camera system.",
    image:
      "https://images.pexels.com/photos/20360361/pexels-photo-20360361.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.8,
    reviews: 241,
    stock: 15,
    featured: true,
    tags: ["flagship", "premium", "5G"],
  },

  {
    name: "Volt X8",
    category: "Mobiles",
    price: 19999,
    oldPrice: 22999,
    description:
      "Modern smartphone with a clean design, bright touchscreen and reliable everyday performance.",
    image:
      "https://images.pexels.com/photos/11216260/pexels-photo-11216260.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.6,
    reviews: 98,
    stock: 28,
    featured: false,
    tags: ["battery", "5G", "smartphone"],
  },

  {
    name: "Edge Pro 5G",
    category: "Mobiles",
    price: 32999,
    oldPrice: 36999,
    description:
      "Stylish 5G smartphone with an edge-to-edge display, premium design and high-speed performance.",
    image:
      "https://images.pexels.com/photos/20360363/pexels-photo-20360363.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.7,
    reviews: 157,
    stock: 19,
    featured: true,
    tags: ["5G", "fast", "premium"],
  },

  // =====================================================
  // LAPTOPS
  // =====================================================

  {
    name: "AeroBook 14",
    category: "Laptops",
    price: 54999,
    oldPrice: 59999,
    description:
      "Slim 14-inch laptop designed for students, professionals, browsing and everyday productivity.",
    image:
      "https://images.pexels.com/photos/6968093/pexels-photo-6968093.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.6,
    reviews: 143,
    stock: 12,
    featured: true,
    tags: ["laptop", "student", "office"],
  },

  {
    name: "Forge G15 Gaming Laptop",
    category: "Laptops",
    price: 74999,
    oldPrice: 82999,
    description:
      "High-performance gaming laptop with RGB keyboard, large screen and gaming-focused hardware.",
    image:
      "https://images.pexels.com/photos/19012049/pexels-photo-19012049.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.8,
    reviews: 211,
    stock: 8,
    featured: true,
    tags: ["gaming", "RGB", "performance"],
  },

  {
    name: "Slate Air 13",
    category: "Laptops",
    price: 61999,
    oldPrice: 67999,
    description:
      "Slim portable 13-inch laptop with a premium design suitable for study, work and travel.",
    image:
      "https://images.pexels.com/photos/8003992/pexels-photo-8003992.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.7,
    reviews: 119,
    stock: 14,
    featured: true,
    tags: ["thin", "portable", "premium"],
  },

  {
    name: "ProBook 15",
    category: "Laptops",
    price: 65999,
    oldPrice: 71999,
    description:
      "Professional 15-inch laptop designed for coding, office work, study and multitasking.",
    image:
      "https://images.pexels.com/photos/10655906/pexels-photo-10655906.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.5,
    reviews: 87,
    stock: 17,
    featured: false,
    tags: ["business", "coding", "office"],
  },

  {
    name: "UltraBook X14",
    category: "Laptops",
    price: 69999,
    oldPrice: 75999,
    description:
      "Premium lightweight ultrabook with a clean design for productivity, study and travel.",
    image:
      "https://images.pexels.com/photos/6893347/pexels-photo-6893347.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.7,
    reviews: 102,
    stock: 11,
    featured: true,
    tags: ["ultrabook", "thin", "portable"],
  },

  // =====================================================
  // HEADPHONES
  // =====================================================

  {
    name: "Halo ANC Over-Ear",
    category: "Headphones",
    price: 5999,
    oldPrice: 7499,
    description:
      "Premium wireless over-ear headphones with active noise cancellation and large cushioned ear cups.",
    image:
      "https://images.pexels.com/photos/33034333/pexels-photo-33034333.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.7,
    reviews: 193,
    stock: 26,
    featured: true,
    tags: ["ANC", "headphones", "wireless", "over-ear"],
  },

  {
    name: "Bud Air TWS",
    category: "Headphones",
    price: 2499,
    oldPrice: 3299,
    description:
      "True wireless earbuds with a compact charging case designed for everyday listening.",
    image:
      "https://images.pexels.com/photos/33307532/pexels-photo-33307532.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.5,
    reviews: 327,
    stock: 45,
    featured: true,
    tags: ["TWS", "earbuds", "wireless"],
  },

  {
    name: "Studio Wired Monitor",
    category: "Headphones",
    price: 3499,
    oldPrice: 4299,
    description:
      "Professional wired over-ear headphones with cushioned ear cups and studio-style design.",
    image:
      "https://images.pexels.com/photos/12266869/pexels-photo-12266869.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.6,
    reviews: 84,
    stock: 18,
    featured: false,
    tags: ["studio", "wired", "audio", "over-ear"],
  },

  {
    name: "BassBoost Wireless",
    category: "Headphones",
    price: 4499,
    oldPrice: 5499,
    description:
      "Wireless over-ear headphones with large ear cups designed for powerful bass and comfortable listening.",
    image:
      "https://images.pexels.com/photos/18254091/pexels-photo-18254091.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.5,
    reviews: 131,
    stock: 22,
    featured: true,
    tags: ["bass", "wireless", "headphones", "over-ear"],
  },

  {
    name: "MiniPods Pro",
    category: "Headphones",
    price: 2999,
    oldPrice: 3999,
    description:
      "Compact premium-style wireless earbuds with a portable charging case.",
    image:
      "https://images.pexels.com/photos/8858287/pexels-photo-8858287.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.6,
    reviews: 176,
    stock: 30,
    featured: true,
    tags: ["earbuds", "TWS", "portable", "wireless"],
  },

  // =====================================================
  // ACCESSORIES
  // =====================================================

  {
    name: "65W GaN Fast Charger",
    category: "Accessories",
    price: 2499,
    oldPrice: 2999,
    description:
      "Compact USB-C fast charger designed for smartphones, tablets and compatible laptops.",
    image:
      "https://images.pexels.com/photos/3921710/pexels-photo-3921710.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.7,
    reviews: 268,
    stock: 40,
    featured: true,
    tags: ["charger", "65W", "GaN", "USB-C"],
  },

  {
    name: "10000mAh Power Bank",
    category: "Accessories",
    price: 1799,
    oldPrice: 2299,
    description:
      "Portable 10000mAh power bank designed for charging smartphones while travelling.",
    image:
      "https://images.pexels.com/photos/3921696/pexels-photo-3921696.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.6,
    reviews: 218,
    stock: 35,
    featured: true,
    tags: ["power bank", "10000mAh", "portable"],
  },

  {
    name: "USB-C Hub 7-in-1",
    category: "Accessories",
    price: 2299,
    oldPrice: 2799,
    description:
      "Multi-port USB-C hub providing additional connectivity for laptops and tablets.",
    image:
      "https://images.pexels.com/photos/30708285/pexels-photo-30708285.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.5,
    reviews: 147,
    stock: 27,
    featured: true,
    tags: ["USB-C", "hub", "laptop"],
  },

  {
    name: "Wireless Charging Pad",
    category: "Accessories",
    price: 1599,
    oldPrice: 1999,
    description:
      "Slim wireless charging pad designed for compatible smartphones and wireless devices.",
    image:
      "https://images.pexels.com/photos/7742584/pexels-photo-7742584.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.4,
    reviews: 93,
    stock: 31,
    featured: false,
    tags: ["wireless charging", "charger", "phone"],
  },

  {
    name: "Smart USB-C Cable",
    category: "Accessories",
    price: 699,
    oldPrice: 999,
    description:
      "Durable USB-C charging and data cable designed for smartphones, tablets and laptops.",
    image:
      "https://images.pexels.com/photos/3921713/pexels-photo-3921713.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.5,
    reviews: 312,
    stock: 70,
    featured: false,
    tags: ["USB-C", "cable", "charging"],
  },

  // =====================================================
  // COMPUTER ACCESSORIES
  // =====================================================

  {
    name: "Voltline Mechanical Keyboard",
    category: "Computer Accessories",
    price: 3499,
    oldPrice: 4499,
    description:
      "Mechanical gaming keyboard with a full-size layout and responsive keys.",
    image:
      "https://images.pexels.com/photos/36374384/pexels-photo-36374384.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.7,
    reviews: 204,
    stock: 25,
    featured: true,
    tags: ["keyboard", "mechanical", "gaming"],
  },

  {
    name: "Voltline Wireless Mouse",
    category: "Computer Accessories",
    price: 1299,
    oldPrice: 1699,
    description:
      "Compact wireless computer mouse with an ergonomic shape for work, study and gaming.",
    image:
      "https://images.pexels.com/photos/13870516/pexels-photo-13870516.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.5,
    reviews: 156,
    stock: 38,
    featured: false,
    tags: ["mouse", "wireless", "ergonomic"],
  },

  {
    name: "Voltline FHD Webcam",
    category: "Computer Accessories",
    price: 2499,
    oldPrice: 2999,
    description:
      "Full HD computer webcam designed for video calls, online classes, meetings and streaming.",
    image:
      "https://images.pexels.com/photos/7172701/pexels-photo-7172701.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.4,
    reviews: 78,
    stock: 20,
    featured: false,
    tags: ["webcam", "FHD", "streaming"],
  },

  {
    name: "Voltline Laptop Stand",
    category: "Computer Accessories",
    price: 1799,
    oldPrice: 2299,
    description:
      "Adjustable laptop stand designed to raise the laptop screen for a comfortable desk setup.",
    image:
      "https://images.pexels.com/photos/4792717/pexels-photo-4792717.jpeg?auto=compress&cs=tinysrgb&w=1000",
    rating: 4.6,
    reviews: 112,
    stock: 29,
    featured: true,
    tags: ["laptop stand", "ergonomic", "desk"],
  },
];


// =====================================================
// SEED DATABASE
// =====================================================

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected");

    await Product.deleteMany({});

    console.log("🗑️ Old products removed");

    await Product.insertMany(products);

    console.log(`✅ ${products.length} products inserted successfully`);

    await mongoose.connection.close();

    console.log("🔌 MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();