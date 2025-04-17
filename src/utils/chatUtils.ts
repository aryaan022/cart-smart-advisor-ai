
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
