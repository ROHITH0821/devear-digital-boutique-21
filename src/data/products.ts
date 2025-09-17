import tshirtImage from "@/assets/product-tshirt.jpg";
import jeansImage from "@/assets/product-jeans.jpg";
import hoodieImage from "@/assets/product-hoodie.jpg";
import jacketImage from "@/assets/product-jacket.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  image: string;
  images: string[];
  isNew?: boolean;
  isOnSale?: boolean;
  inStock: number;
  fabric: string;
  careInstructions: string[];
  rating: number;
  reviewCount: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Essential Black Tee",
    price: 45,
    description: "A premium quality essential black t-shirt made from 100% organic cotton. Perfect for everyday wear with a comfortable fit and durable construction.",
    category: "Men",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Gray"],
    image: tshirtImage,
    images: [tshirtImage],
    isNew: true,
    inStock: 25,
    fabric: "100% Organic Cotton",
    careInstructions: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
    rating: 4.5,
    reviewCount: 124
  },
  {
    id: "2", 
    name: "Premium Denim",
    price: 120,
    originalPrice: 150,
    description: "Classic premium denim jeans with a modern fit. Made from high-quality denim with stretch for comfort and style.",
    category: "Men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Dark Blue", "Light Blue", "Black"],
    image: jeansImage,
    images: [jeansImage],
    isOnSale: true,
    inStock: 15,
    fabric: "98% Cotton, 2% Elastane",
    careInstructions: ["Machine wash cold", "Hang to dry", "Iron on medium heat"],
    rating: 4.7,
    reviewCount: 89
  },
  {
    id: "3",
    name: "Comfort Hoodie",
    price: 85,
    description: "Ultra-comfortable hoodie perfect for casual wear and layering. Made with soft fleece interior for maximum warmth.",
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Gray", "Black", "Navy", "Pink"],
    image: hoodieImage,
    images: [hoodieImage],
    inStock: 30,
    fabric: "80% Cotton, 20% Polyester",
    careInstructions: ["Machine wash warm", "Tumble dry medium", "Do not iron decoration"],
    rating: 4.3,
    reviewCount: 67
  },
  {
    id: "4",
    name: "Minimalist Jacket",
    price: 180,
    description: "A sleek minimalist jacket designed for modern professionals. Water-resistant and breathable with a tailored fit.",
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Beige"],
    image: jacketImage,
    images: [jacketImage],
    isNew: true,
    inStock: 12,
    fabric: "Polyester blend with water-resistant coating",
    careInstructions: ["Dry clean only", "Do not bleach", "Cool iron if needed"],
    rating: 4.8,
    reviewCount: 43
  },
  {
    id: "5",
    name: "Classic White Shirt",
    price: 65,
    description: "Timeless white shirt perfect for office or casual wear. Crisp cotton fabric with a comfortable regular fit.",
    category: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue"],
    image: tshirtImage,
    images: [tshirtImage],
    inStock: 20,
    fabric: "100% Cotton",
    careInstructions: ["Machine wash cold", "Iron while damp", "Dry clean recommended"],
    rating: 4.4,
    reviewCount: 156
  },
  {
    id: "6",
    name: "Casual Sneakers",
    price: 95,
    originalPrice: 110,
    description: "Comfortable everyday sneakers with premium leather upper and cushioned sole for all-day comfort.",
    category: "Accessories",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Gray"],
    image: jacketImage,
    images: [jacketImage],
    isOnSale: true,
    inStock: 18,
    fabric: "Leather upper, rubber sole",
    careInstructions: ["Wipe clean with damp cloth", "Air dry", "Use leather conditioner"],
    rating: 4.6,
    reviewCount: 92
  }
];

export const categories = ["All", "Men", "Women", "Accessories"];
export const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $150", min: 100, max: 150 },
  { label: "Over $150", min: 150, max: 999 }
];
export const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "popular" }
];