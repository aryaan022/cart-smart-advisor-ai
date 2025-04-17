
import { ChatMessage } from "@/types";

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
