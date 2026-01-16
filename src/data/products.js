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
  /* -------- BEAUTY -------- */

  {
    id: 1,
    title: "Sunscreen SPF 50 PA+++ 100ml",
    brand: "SunGuard",
    category: "Beauty",
    price: 899,
    mrp: 1499,
    discount: 40,
    rating: 4.8,
    reviewCount: 3456,
    stock: 150,
    images: [sunscreen1, sunscreen2, sunscreen3],
    description:
      "Broad spectrum sunscreen with SPF 50 and non-greasy formula.",
    reviews: [
      {
        id: 1,
        rating: 4,
        title: "Good",
        user: "Kamandla Mallesh",
        date: "4 months ago",
        location: "Hyderabad",
        likes: 8,
        dislikes: 0,
      },
      {
        id: 2,
        rating: 5,
        title: "Nice product ✌️",
        user: "Flipkart Customer",
        date: "Apr, 2024",
        location: "Navi Mumbai",
        likes: 3,
        dislikes: 0,
      },
    ],
  },

  {
    id: 2,
    title: "Herbal Face Wash 150ml",
    brand: "GlowCare",
    category: "Beauty",
    price: 299,
    mrp: 399,
    discount: 25,
    rating: 4.4,
    reviewCount: 980,
    stock: 200,
    images: [facewash1],
    description: "Gentle herbal face wash suitable for daily use.",
    reviews: [
      {
        id: 1,
        rating: 4,
        title: "Nice and refreshing",
        user: "Anitha",
        date: "Mar, 2024",
        location: "Chennai",
        likes: 5,
        dislikes: 0,
      },
    ],
  },

  /* -------- FASHION -------- */

  {
    id: 3,
    title: "Running Sneakers for Men",
    brand: "Nike",
    category: "Fashion",
    price: 2999,
    mrp: 4999,
    discount: 40,
    rating: 4.6,
    reviewCount: 2120,
    stock: 80,
    images: [sneakers1, sneakers2, sneakers3],
    description:
      "Lightweight running shoes with breathable mesh design.",
    reviews: [
      {
        id: 1,
        rating: 5,
        title: "Excellent",
        user: "Sandhya Rani",
        date: "Feb, 2024",
        location: "Baleshwar",
        likes: 3,
        dislikes: 0,
      },
    ],
  },

  {
    id: 4,
    title: "Men Cotton T-Shirt",
    brand: "Puma",
    category: "Fashion",
    price: 799,
    mrp: 1299,
    discount: 38,
    rating: 4.3,
    reviewCount: 860,
    stock: 120,
    images: [tshirt1],
    description: "Soft cotton t-shirt with comfortable regular fit.",
    reviews: [
      {
        id: 1,
        rating: 4,
        title: "Good quality",
        user: "Ravi",
        date: "Jan, 2024",
        location: "Bangalore",
        likes: 2,
        dislikes: 0,
      },
    ],
  },

  /* -------- ELECTRONICS -------- */

  {
    id: 5,
    title: "Wireless Bluetooth Headphones",
    brand: "Boat",
    category: "Electronics",
    price: 1499,
    mrp: 2999,
    discount: 50,
    rating: 4.5,
    reviewCount: 3400,
    stock: 90,
    images: [headphone1],
    description: "High bass wireless headphones with built-in mic.",
    reviews: [
      {
        id: 1,
        rating: 5,
        title: "Amazing sound",
        user: "Suresh",
        date: "Dec, 2023",
        location: "Pune",
        likes: 6,
        dislikes: 0,
      },
    ],
  },

  {
    id: 6,
    title: "Laptop 15.6-inch SSD",
    brand: "HP",
    category: "Electronics",
    price: 52999,
    mrp: 64999,
    discount: 18,
    rating: 4.6,
    reviewCount: 1250,
    stock: 40,
    images: [laptop1],
    description: "Powerful laptop with SSD, 8GB RAM and fast performance.",
    reviews: [
      {
        id: 1,
        rating: 5,
        title: "Worth the money",
        user: "Arjun",
        date: "Nov, 2023",
        location: "Delhi",
        likes: 10,
        dislikes: 1,
      },
    ],
  },

  /* -------- MOBILES -------- */

  {
    id: 7,
    title: "Smartphone 5G (128GB)",
    brand: "Samsung",
    category: "Mobiles",
    price: 24999,
    mrp: 29999,
    discount: 17,
    rating: 4.4,
    reviewCount: 5400,
    stock: 70,
    images: [mobile1],
    description: "5G smartphone with AMOLED display and great camera.",
    reviews: [
      {
        id: 1,
        rating: 4,
        title: "Good phone",
        user: "Karthik",
        date: "Oct, 2023",
        location: "Coimbatore",
        likes: 12,
        dislikes: 2,
      },
    ],
  },

  {
    id: 8,
    title: "Budget Smartphone (64GB)",
    brand: "Redmi",
    category: "Mobiles",
    price: 11999,
    mrp: 14999,
    discount: 20,
    rating: 4.2,
    reviewCount: 6200,
    stock: 100,
    images: [mobile2],
    description: "Affordable smartphone with long battery life.",
    reviews: [
      {
        id: 1,
        rating: 4,
        title: "Value for money",
        user: "Meena",
        date: "Sep, 2023",
        location: "Madurai",
        likes: 8,
        dislikes: 1,
      },
    ],
  },

  /* -------- HOME -------- */

  {
    id: 9,
    title: "Mixer Grinder 750W",
    brand: "Prestige",
    category: "Home",
    price: 3499,
    mrp: 4999,
    discount: 30,
    rating: 4.5,
    reviewCount: 2100,
    stock: 60,
    images: [mixer1],
    description: "Powerful mixer grinder suitable for Indian kitchens.",
    reviews: [
      {
        id: 1,
        rating: 5,
        title: "Very useful",
        user: "Lakshmi",
        date: "Aug, 2023",
        location: "Salem",
        likes: 4,
        dislikes: 0,
      },
    ],
  },

  {
    id: 10,
    title: "Cotton Double Bedsheet",
    brand: "Bombay Dyeing",
    category: "Home",
    price: 1299,
    mrp: 1999,
    discount: 35,
    rating: 4.4,
    reviewCount: 1450,
    stock: 90,
    images: [bedsheet1],
    description: "Soft cotton bedsheet with matching pillow covers.",
    reviews: [
      {
        id: 1,
        rating: 4,
        title: "Comfortable",
        user: "Nithya",
        date: "Jul, 2023",
        location: "Trichy",
        likes: 3,
        dislikes: 0,
      },
    ],
  },

  /* -------- GROCERY -------- */

  {
    id: 11,
    title: "Basmati Rice 5kg",
    brand: "India Gate",
    category: "Grocery",
    price: 699,
    mrp: 899,
    discount: 22,
    rating: 4.6,
    reviewCount: 3100,
    stock: 200,
    images: [rice1],
    description: "Premium quality basmati rice with rich aroma.",
    reviews: [
      {
        id: 1,
        rating: 5,
        title: "Excellent quality",
        user: "Ramesh",
        date: "Jun, 2023",
        location: "Erode",
        likes: 9,
        dislikes: 0,
      },
    ],
  },

  {
    id: 12,
    title: "Sunflower Cooking Oil 1L",
    brand: "Fortune",
    category: "Grocery",
    price: 179,
    mrp: 220,
    discount: 19,
    rating: 4.5,
    reviewCount: 4200,
    stock: 300,
    images: [oil1],
    description: "Healthy refined sunflower cooking oil.",
    reviews: [
      {
        id: 1,
        rating: 4,
        title: "Good for daily use",
        user: "Sathya",
        date: "May, 2023",
        location: "Karur",
        likes: 6,
        dislikes: 0,
      },
    ],
  },
];

export default products;
