import React, { useState, useRef, useEffect } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChatMessage, CartItem, ChatApiResponse } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ChatBotProps {
  cartItems: CartItem[];
}

interface ContextualKnowledge {
  [key: string]: {
    taste: string;
    benefits: string;
    pairings: string;
    seasonality?: string;
    storage?: string;
    ripening?: string;
    cooking?: string;
  };
}

const ChatBot: React.FC<ChatBotProps> = ({ cartItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm your CartSmart AI assistant. How can I help with your shopping today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [apiUrl, setApiUrl] = useState<string>("");

  const foodKnowledge: ContextualKnowledge = {
    "apple": {
      taste: "Our organic apples are crisp and juicy with a perfect balance of sweetness and tartness. The Himalayan varieties we carry have a particularly rich flavor profile.",
      benefits: "Apples are rich in antioxidants, fiber, and vitamin C. They can help boost immunity, improve digestion, and support heart health.",
      pairings: "Pairs wonderfully with almond butter, cinnamon, oats, and cheese.",
      seasonality: "Peak season in India is from September to November, but we source different varieties year-round.",
      storage: "Store in the refrigerator to maintain crispness for up to 3 weeks."
    },
    "bread": {
      taste: "Our whole grain bread has a nutty, complex flavor with a subtle sweetness. The freshly baked loaves have a perfect crust-to-crumb ratio.",
      benefits: "Whole grain bread provides sustained energy, fiber for digestive health, and essential B vitamins.",
      pairings: "Great with avocados, eggs, hummus, or as the base for grilled sandwiches.",
      storage: "Store at room temperature for 2-3 days or freeze for up to a month."
    },
    "milk": {
      taste: "Our organic milk is creamy and rich, with a clean, fresh taste that's superior to conventional options.",
      benefits: "Excellent source of calcium, protein, and vitamin D for bone health and muscle recovery.",
      pairings: "Perfect with cereal, coffee, tea, and for making smoothies or desserts."
    },
    "avocado": {
      taste: "Our avocados are buttery, creamy, and nutty with a subtle grassy note when perfectly ripe.",
      benefits: "Rich in healthy monounsaturated fats, potassium, and fiber. Supports heart health and provides essential nutrients.",
      pairings: "Delicious with eggs, toast, in salads, or with a squeeze of lemon and chaat masala.",
      ripening: "If unripe, store with a banana in a paper bag to speed ripening. Once ripe, refrigerate to extend freshness for 2-3 days."
    },
    "salmon": {
      taste: "Our wild-caught salmon has a rich, buttery texture with a clean ocean flavor that's less fishy than farmed varieties.",
      benefits: "Excellent source of omega-3 fatty acids, high-quality protein, and vitamin D.",
      pairings: "Pairs well with lemon, dill, garlic, honey-mustard glazes, or traditional Indian spice rubs."
    },
    "quinoa": {
      taste: "Our quinoa has a mild, nutty flavor with a slightly crunchy texture when cooked properly.",
      benefits: "Complete protein containing all essential amino acids, high in fiber, magnesium and antioxidants.",
      pairings: "Great in salads, as a rice substitute, or cooked with coconut milk and Indian spices.",
      cooking: "Rinse thoroughly before cooking. Use 1 part quinoa to 2 parts water and simmer for 15 minutes."
    },
    "yogurt": {
      taste: "Our Greek yogurt is rich and creamy with a pleasant tanginess. It's thicker and more protein-dense than regular yogurt.",
      benefits: "High in protein, calcium, and probiotics for gut health. Lower in lactose than milk.",
      pairings: "Delicious with honey, fresh fruits, nuts, or as a base for raita and dips."
    }
  };

  const currentDeals = [
    {
      title: "Festive Season Special",
      description: "20% off on all dry fruits and nuts - perfect for festival preparations!",
      savings: "Up to ₹200 off on purchases over ₹1000"
    },
    {
      title: "Weekend Fresh Produce Sale",
      description: "Buy any 3 organic vegetables and get the cheapest one free",
      savings: "Average savings of ₹150 per transaction"
    },
    {
      title: "Dairy Bundle",
      description: "Buy organic milk, yogurt, and paneer together for a special price",
      savings: "₹80 off bundle price"
    },
    {
      title: "Protein Power Package",
      description: "15% off on chicken, eggs, and legumes when bought together",
      savings: "Up to ₹150 in savings"
    }
  ];

  const regionalRecipes = {
    breakfast: [
      "Masala Dosa with Coconut Chutney using our organic potatoes and fresh coconut",
      "Avocado Paratha using our ripe avocados and whole wheat flour",
      "Quinoa Upma with fresh vegetables and curry leaves"
    ],
    lunch: [
      "Ragi Roti with Palak Paneer using our organic spinach",
      "Brown Rice Pulao with seasonal vegetables",
      "Quinoa Biryani with organic spices and vegetables"
    ],
    dinner: [
      "Millet Khichdi with organic ghee and seasonal vegetables",
      "Baked Salmon with Indian spices and lemon",
      "Sprouted Bean Curry with brown rice"
    ],
    snacks: [
      "Greek Yogurt with honey and mixed nuts",
      "Roasted Sweet Potato chaat",
      "Multigrain Dhokla with mint chutney"
    ]
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setApiUrl("https://api.openai.com/v1/chat/completions");
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const findMatchingFood = (userMessage: string): string | null => {
    const userMessageLower = userMessage.toLowerCase();
    for (const food in foodKnowledge) {
      if (userMessageLower.includes(food)) {
        return food;
      }
    }
    return null;
  };

  const fetchChatbotResponse = async (userMessage: string): Promise<ChatApiResponse> => {
    try {
      const payload = {
        message: userMessage,
        cartItems: cartItems,
      };

      console.log("Sending request to chatbot API:", payload);

      throw new Error("API call simulated failure for demo purposes");

    } catch (error) {
      console.log("Error fetching chatbot response from API:", error);
      console.log("Falling back to local processing...");
      
      const localResponse = generateBotResponse(userMessage);
      
      return {
        message: localResponse,
        suggestions: [
          "Tell me about seasonal produce",
          "What deals are available?",
          "Recommend a healthy breakfast"
        ]
      };
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const userMessageLower = userMessage.toLowerCase();
    
    const matchedFood = findMatchingFood(userMessageLower);
    
    if (matchedFood) {
      if (userMessageLower.includes("taste") || userMessageLower.includes("flavor")) {
        return foodKnowledge[matchedFood].taste;
      } else if (userMessageLower.includes("health") || userMessageLower.includes("benefit")) {
        return foodKnowledge[matchedFood].benefits;
      } else if (userMessageLower.includes("pair") || userMessageLower.includes("combine") || userMessageLower.includes("with")) {
        return foodKnowledge[matchedFood].pairings;
      } else if (userMessageLower.includes("store") || userMessageLower.includes("keep")) {
        return foodKnowledge[matchedFood].storage || `${matchedFood.charAt(0).toUpperCase() + matchedFood.slice(1)} is best stored in a cool, dry place. If you need specific storage instructions, just ask!`;
      } else {
        return `${foodKnowledge[matchedFood].taste} ${foodKnowledge[matchedFood].benefits} Would you like to know about pairing suggestions or how to properly store it?`;
      }
    }
    
    if (userMessageLower.includes("recipe") || userMessageLower.includes("meal") || userMessageLower.includes("cook") || userMessageLower.includes("make")) {
      let mealTime: keyof typeof regionalRecipes = "breakfast";
      
      if (userMessageLower.includes("breakfast") || userMessageLower.includes("morning")) {
        mealTime = "breakfast";
      } else if (userMessageLower.includes("lunch") || userMessageLower.includes("afternoon")) {
        mealTime = "lunch";
      } else if (userMessageLower.includes("dinner") || userMessageLower.includes("evening")) {
        mealTime = "dinner";
      } else if (userMessageLower.includes("snack")) {
        mealTime = "snacks";
      }
      
      if (cartItems.length > 0) {
        const cartItemNames = cartItems.map(item => item.name.toLowerCase());
        
        const relevantRecipes = regionalRecipes[mealTime].filter(recipe => 
          cartItemNames.some(item => recipe.toLowerCase().includes(item))
        );
        
        if (relevantRecipes.length > 0) {
          return `Based on your cart items, here's a perfect ${mealTime} recipe for you: ${relevantRecipes[0]}. Would you like more details on how to prepare it?`;
        }
        
        return `Here's a delicious ${mealTime} idea: ${regionalRecipes[mealTime][0]}. I notice you might need a few ingredients for this recipe. Would you like me to suggest what to add to your cart?`;
      } else {
        return `For a nutritious ${mealTime}, I recommend: ${regionalRecipes[mealTime].join(", or ")}. Would you like me to suggest ingredients to add to your cart for any of these recipes?`;
      }
    }
    
    if (userMessageLower.includes("deal") || userMessageLower.includes("offer") || userMessageLower.includes("discount") || userMessageLower.includes("save") || userMessageLower.includes("sale")) {
      const randomDeal = currentDeals[Math.floor(Math.random() * currentDeals.length)];
      const otherDeals = currentDeals.filter(deal => deal.title !== randomDeal.title).map(deal => deal.title);
      
      return `${randomDeal.title}: ${randomDeal.description} (${randomDeal.savings})\n\nWe also have these ongoing deals:\n• ${otherDeals.join("\n• ")}\n\nWould you like more details on any of these offers?`;
    }
    
    if (userMessageLower.includes("recommend") || userMessageLower.includes("suggest") || userMessageLower.includes("what should i eat") || userMessageLower.includes("what can i eat")) {
      if (userMessageLower.includes("breakfast")) {
        return "For a nutritious Indian breakfast, I recommend our organic eggs for making egg bhurji or try our whole grain bread with avocado and chaat masala. Our Greek yogurt with fresh fruits and a drizzle of local honey is also a customer favorite!";
      } else if (userMessageLower.includes("lunch") || userMessageLower.includes("dinner")) {
        return "Our wild salmon is perfect for a nutritious meal - try it with a tandoori spice rub. For vegetarian options, our organic sweet potatoes make amazing stuffed chaat boats, or use our quinoa for a protein-packed pulao with seasonal vegetables from our produce section.";
      } else if (userMessageLower.includes("snack") || userMessageLower.includes("quick")) {
        return "For a quick and healthy Indian-inspired snack, try our Greek yogurt with a sprinkle of chaat masala, or our fresh avocados mashed on whole grain toast with a dash of turmeric and black pepper. The ripe bananas with almond butter also make a satisfying and nutritious snack!";
      } else if (cartItems.length > 0) {
        const categories = new Set(cartItems.map(item => item.category));
        if (categories.has("Produce")) {
          return "Based on your cart, I see you enjoy fresh produce! Our organic sweet potatoes would go perfectly with your selections - they're grown in the richest soil in Karnataka and have an exceptional sweet flavor when roasted with a little bit of ghee and jeera.";
        } else if (categories.has("Bakery")) {
          return "Since you have bakery items in your cart, you might enjoy our artisanal almond butter as a spread. It's made from hand-selected almonds and has a smooth, rich texture that pairs beautifully with fresh bread!";
        } else if (categories.has("Dairy")) {
          return "I notice you have dairy products in your cart. Our organic paneer is made fresh daily and would complement your dairy selections beautifully. It's perfect for making matar paneer or paneer tikka!";
        } else {
          return "Looking at your cart, I'd recommend adding some seasonal fruits or vegetables to balance your meal. Our organic apples from Himachal Pradesh are especially crisp and juicy right now, and the local avocados are at perfect ripeness for the next 2-3 days.";
        }
      } else {
        return "I'd be happy to recommend something! Are you looking for breakfast, lunch, dinner, or snack ideas? Our seasonal local fruits and vegetables are particularly fresh this week, and we have some exclusive regional specialties you might enjoy.";
      }
    }
    
    if (userMessageLower.includes("healthy") || userMessageLower.includes("nutrition") || userMessageLower.includes("diet")) {
      return "For healthy eating with an Indian palate, I recommend our organic produce section for fresh vegetables to make nutrient-rich sabzis. Our millets and whole grains like ragi and brown rice are excellent alternatives to refined carbs. If you're focusing on protein, our Greek yogurt has 2X the protein of regular dahi, and our free-range eggs are from hens raised without antibiotics. Would you like specific recommendations based on your dietary preferences?";
    }
    
    if (userMessageLower.includes("help") || userMessageLower.includes("how")) {
      return "I can help you find products, explain the taste and nutritional benefits of foods, suggest regional recipes, find local deals, and answer questions about our services. Just ask me anything about our products or how to use them in traditional or fusion recipes!";
    } 
    else if (userMessageLower.includes("cart") || userMessageLower.includes("basket")) {
      if (cartItems.length === 0) {
        return "Your cart is currently empty. Would you like me to recommend some seasonal specialties or weekly deals to get you started?";
      } else {
        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return `You have ${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart totaling ₹${totalAmount}. Based on your selections, you might enjoy adding some complementary items. Would you like suggestions?`;
      }
    }
    else if (userMessageLower.includes("store") || userMessageLower.includes("delivery") || userMessageLower.includes("pickup")) {
      return "Our stores are open from 7 AM to 10 PM daily. We offer free delivery for orders above ₹500 within a 10km radius, and our express delivery gets your groceries to you within 2 hours. For pickup orders, we have dedicated parking spaces - just notify us 30 minutes before arrival so we can have everything ready!";
    }
    else {
      return "I'm here to help with your shopping experience! I can tell you about food taste profiles, suggest recipes using Indian ingredients, recommend regional specialties, or inform you about our current deals and discounts. How can I assist you today?";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    setIsTyping(true);
    
    try {
      const chatResponse = await fetchChatbotResponse(userMessage.content);
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: chatResponse.message,
        isUser: false,
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
      
      if (chatResponse.suggestions && chatResponse.suggestions.length > 0) {
        setTimeout(() => {
          const followUp: ChatMessage = {
            id: (Date.now() + 2).toString(),
            content: chatResponse.suggestions![Math.floor(Math.random() * chatResponse.suggestions!.length)],
            isUser: false,
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, followUp]);
        }, 1500);
      }
    } catch (error) {
      console.error("Error in chat handling:", error);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Connection Error",
        description: "Could not connect to the chat service.",
        variant: "destructive",
      });
    }
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      toast({
        title: "Chat Assistant",
        description: "Your CartSmart AI assistant is ready to help!",
      });
    }
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
      
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 flex flex-col">
          <div className="flex items-center gap-2 p-3 border-b bg-primary/5">
            <Bot className="text-primary h-5 w-5" />
            <h3 className="font-semibold">CartSmart Assistant</h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full ml-auto">
              Online
            </span>
          </div>
          
          <ScrollArea className="flex-grow p-4 h-80">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    <span className="text-xs opacity-70 block mt-1">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted max-w-[80%] p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about food, recipes, or deals..."
              className="flex-grow"
            />
            <Button type="submit" size="icon" disabled={!message.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
