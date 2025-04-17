
import { GeminiApiRequest, GeminiApiResponse, CartItem } from "@/types";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_API_KEY = "AIzaSyAkFMx4CsavFvvpABCmIuUOUB3Irn8YjyY";

export const queryGeminiApi = async (
  userMessage: string,
  cartItems: CartItem[],
  conversationHistory: string[]
): Promise<string> => {
  try {
    // Format cart items for context
    const cartItemsText = cartItems.length > 0
      ? `User's cart contains: ${cartItems.map(item => `${item.name} (${item.quantity})`).join(', ')}`
      : "User's cart is empty";

    // Combine conversation history and new message for context
    const conversationContext = conversationHistory.length > 0
      ? "Recent conversation: " + conversationHistory.join("\n") + "\n"
      : "";

    // Create system prompt with instructions
    const systemPrompt = `You are an AI shopping assistant for an online grocery store. 
    Provide helpful, conversational responses about ${cartItemsText}.
    Focus on providing detailed information about products including recipes, cooking tips,
    health benefits, storage advice, and food pairings. Keep responses conversational and friendly.
    If asked about products not in the cart or not in our inventory, politely suggest alternatives we carry.
    ${conversationContext}`;
    
    // Create the Gemini API request
    const requestData: GeminiApiRequest = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "user", 
          parts: [{ text: userMessage }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800
      }
    };

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json() as GeminiApiResponse;
    
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No response from Gemini API");
    }
  } catch (error) {
    console.error("Error querying Gemini API:", error);
    throw error;
  }
};

export const generateSuggestionsWithGemini = async (
  userMessage: string,
  botResponse: string,
  cartItems: CartItem[]
): Promise<string[]> => {
  try {
    const promptText = `Based on this user question: "${userMessage}" and 
    your previous response: "${botResponse.substring(0, 200)}..."
    
    Generate exactly 3 short follow-up questions the user might want to ask next.
    The questions should be directly related to products ${cartItems.map(item => item.name).join(', ')}.
    Keep questions short (under 60 characters) and conversational.
    Return ONLY the 3 questions separated by "|" with nothing else.
    Format example: "Question 1?|Question 2?|Question 3?"`;

    const requestData: GeminiApiRequest = {
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200
      }
    };

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json() as GeminiApiResponse;
    
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
          
      const suggestionsText = data.candidates[0].content.parts[0].text;
      // Split by | to get individual suggestions
      const suggestions = suggestionsText
        .split("|")
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .slice(0, 3); // Ensure we only have max 3 suggestions
      
      return suggestions.length > 0 ? suggestions : ["Tell me more about these products", "What recipes can I make?", "How should I store these items?"];
    } else {
      throw new Error("No suggestions from Gemini API");
    }
  } catch (error) {
    console.error("Error generating suggestions with Gemini:", error);
    // Return default suggestions if there's an error
    return ["Tell me more about these products", "What recipes can I make?", "How should I store these items?"];
  }
};
