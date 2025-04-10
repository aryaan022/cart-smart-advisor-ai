
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
}
