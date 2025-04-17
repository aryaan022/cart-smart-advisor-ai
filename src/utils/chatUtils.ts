
import { ChatMessage, CartItem } from "@/types";

// Store recent conversation messages to provide context
export const getRecentMessages = (messages: ChatMessage[], count: number = 5): string[] => {
  return messages
    .slice(-count)
    .map(msg => `${msg.isUser ? "User" : "Assistant"}: ${msg.content}`)
    .filter(Boolean);
};

// Generate a typing delay based on message length and complexity
export const calculateTypingDelay = (message: string): number => {
  // Base delay of 500ms plus 10ms per character, but cap at 3000ms
  const baseDelay = 500;
  const charDelay = message.length * 10;
  const complexityFactor = message.includes('?') ? 1.2 : 1.0; // Questions take longer
  
  return Math.min(baseDelay + charDelay * complexityFactor, 3000);
};

// Extract food keywords from message
export const extractFoodKeywords = (message: string): string[] => {
  const commonFoodWords = [
    "apple", "banana", "orange", "strawberry", "blueberry",
    "chicken", "beef", "fish", "salmon", "tuna",
    "rice", "pasta", "bread", "cereal", "oats",
    "milk", "yogurt", "cheese", "butter", "cream",
    "tomato", "potato", "carrot", "broccoli", "spinach",
    "avocado", "quinoa", "almond", "walnut", "cashew"
  ];
  
  const messageLower = message.toLowerCase();
  return commonFoodWords.filter(food => messageLower.includes(food));
};

// Determine if a message is asking about food properties
export const isFoodPropertyQuestion = (message: string): boolean => {
  const propertyKeywords = ["taste", "flavor", "health", "benefit", "nutrition", 
                          "store", "storage", "cook", "recipe", "prepare", 
                          "pair", "combine", "with", "texture", "ripe"];
  
  const messageLower = message.toLowerCase();
  return propertyKeywords.some(keyword => messageLower.includes(keyword));
};

// Check if a message is asking about price optimization
export const isPriceOptimizationQuestion = (message: string): boolean => {
  const priceKeywords = ["cheaper", "cheaper alternative", "deal", "offer", "discount", 
                        "save", "savings", "price", "cost", "budget", "affordable", 
                        "expensive", "alternative", "bundle", "combo"];
  
  const messageLower = message.toLowerCase();
  return priceKeywords.some(keyword => messageLower.includes(keyword));
};

// Get cheaper alternatives for a product
export const findCheaperAlternatives = (
  product: CartItem, 
  allProducts: CartItem[], 
  maxResults: number = 3
): CartItem[] => {
  return allProducts
    .filter(item => 
      item.id !== product.id && 
      item.category === product.category && 
      item.price < product.price)
    .sort((a, b) => a.price - b.price)
    .slice(0, maxResults);
};

// Calculate potential savings when buying a bundle
export const calculateBundleSavings = (items: CartItem[]): number => {
  if (items.length < 2) return 0;
  
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const discountPercentage = Math.min(5 + (items.length * 2), 15); // 5% + 2% per item, max 15%
  
  return Math.floor(totalPrice * (discountPercentage / 100));
};

// Format price with currency
export const formatPrice = (price: number, currency: string = "₹"): string => {
  return `${currency}${price}`;
};

