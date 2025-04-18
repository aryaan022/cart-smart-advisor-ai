import { Product } from "@/types";
import { additionalProducts } from "./additionalProducts";

const originalProducts: Product[] = [
  {
    id: "1",
    name: "Organic Apples",
    price: 299,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=400",
    description: "Fresh organic apples, pack of 6",
    store: "Freshmart",
    category: "Produce",
    rating: 4.5,
    inStock: true,
    currency: "₹"
  },
  {
    id: "2",
    name: "Whole Grain Bread",
    price: 189,
    originalPrice: 229,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400",
    description: "Artisan whole grain bread, freshly baked",
    store: "Bakery Delight",
    category: "Bakery",
    rating: 4.3,
    inStock: true,
    currency: "₹"
  },
  {
    id: "3",
    name: "Organic Milk",
    price: 279,
    originalPrice: 329,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400",
    description: "Organic whole milk, 1 liter",
    store: "Freshmart",
    category: "Dairy",
    rating: 4.7,
    inStock: true,
    currency: "₹"
  },
  {
    id: "4",
    name: "Free Range Eggs",
    price: 329,
    originalPrice: 379,
    image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&q=80&w=400",
    description: "Free range eggs, dozen",
    store: "Farm Direct",
    category: "Dairy",
    rating: 4.8,
    inStock: true,
    currency: "₹"
  },
  {
    id: "5",
    name: "Pasta Sauce",
    price: 249,
    originalPrice: 299,
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&q=80&w=400",
    description: "Organic tomato pasta sauce",
    store: "Grocery Plus",
    category: "Pantry",
    rating: 4.2,
    inStock: true,
    currency: "₹"
  },
  {
    id: "6",
    name: "Quinoa",
    price: 449,
    originalPrice: 549,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
    description: "Organic quinoa, 500g bag",
    store: "Health Foods",
    category: "Grains",
    rating: 4.6,
    inStock: true,
    currency: "₹"
  },
  {
    id: "7",
    name: "Avocados",
    price: 379,
    originalPrice: 449,
    image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&q=80&w=400",
    description: "Ripe avocados, pack of 4",
    store: "Freshmart",
    category: "Produce",
    rating: 4.4,
    inStock: true,
    currency: "₹"
  },
  {
    id: "8",
    name: "Greek Yogurt",
    price: 249,
    originalPrice: 299,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
    description: "Plain Greek yogurt, 500g",
    store: "Dairy Depot",
    category: "Dairy",
    rating: 4.5,
    inStock: true,
    currency: "₹"
  },
  {
    id: "9",
    name: "Almond Butter",
    price: 529,
    originalPrice: 649,
    image: "https://images.unsplash.com/photo-1612439663569-77f1c811b050?auto=format&fit=crop&q=80&w=400",
    description: "Organic almond butter, 250g jar",
    store: "Health Foods",
    category: "Pantry",
    rating: 4.7,
    inStock: true,
    currency: "₹"
  },
  {
    id: "10",
    name: "Chicken Breast",
    price: 679,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=400",
    description: "Free-range boneless chicken breast, 500g",
    store: "Meat Market",
    category: "Meat",
    rating: 4.6,
    inStock: true,
    currency: "₹"
  },
  {
    id: "11",
    name: "Wild Salmon",
    price: 949,
    originalPrice: 1149,
    image: "https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?auto=format&fit=crop&q=80&w=400",
    description: "Wild-caught salmon fillet, 300g",
    store: "Seafood Market",
    category: "Seafood",
    rating: 4.8,
    inStock: true,
    currency: "₹"
  },
  {
    id: "12",
    name: "Sweet Potatoes",
    price: 189,
    originalPrice: 229,
    image: "https://images.unsplash.com/photo-1596095627585-3296879ea024?auto=format&fit=crop&q=80&w=400",
    description: "Organic sweet potatoes, 1kg bag",
    store: "Freshmart",
    category: "Produce",
    rating: 4.3,
    inStock: true,
    currency: "₹"
  }
];

export const mockProducts: Product[] = [...originalProducts, ...additionalProducts];
