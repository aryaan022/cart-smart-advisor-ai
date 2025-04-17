
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  store: string;
  category: string;
  rating: number;
  inStock: boolean;
  currency?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  savings: number;
  items: CartItem[];
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: QuestionSuggestion[];
}

export interface QuestionSuggestion {
  id: string;
  text: string;
  icon?: string;
}

export interface FoodKnowledge {
  taste: string;
  benefits: string;
  pairings: string;
  seasonality?: string;
  storage?: string;
  ripening?: string;
  cooking?: string;
}

export interface ChatApiResponse {
  message: string;
  suggestions?: string[];
}

export interface GeminiApiRequest {
  contents: GeminiContent[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiContent {
  role: string;
  parts: {
    text: string;
  }[];
}

export interface GeminiApiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  relatedProducts: string[];
}
