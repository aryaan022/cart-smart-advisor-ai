
import React, { useState, useRef, useEffect } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types";

interface ChatBotProps {
  cartItems: CartItem[];
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
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateBotResponse = (userMessage: string): string => {
    const userMessageLower = userMessage.toLowerCase();
    
    // Food and taste related responses
    if (userMessageLower.includes("taste") || userMessageLower.includes("flavor")) {
      if (userMessageLower.includes("apple") || userMessageLower.includes("fruit")) {
        return "Our organic apples have a perfect balance of sweetness and tartness. Freshmart's selection is particularly crisp and juicy this season!";
      } else if (userMessageLower.includes("bread") || userMessageLower.includes("bakery")) {
        return "The whole grain bread from Bakery Delight has a nutty flavor with a hint of honey. It's perfect toasted with some avocado!";
      } else if (userMessageLower.includes("salmon") || userMessageLower.includes("fish")) {
        return "The wild salmon has a rich, buttery flavor. It's less fishy than farmed salmon and has a beautiful color. I recommend cooking it simply with lemon and herbs to appreciate its natural taste.";
      } else {
        return "I'd be happy to describe the taste of any product in our inventory. Could you specify which food item you're curious about?";
      }
    } 
    // Recipe and meal suggestions
    else if (userMessageLower.includes("recipe") || userMessageLower.includes("meal") || userMessageLower.includes("cook") || userMessageLower.includes("make")) {
      const hasEggs = cartItems.some(item => item.name.toLowerCase().includes("egg"));
      const hasAvocado = cartItems.some(item => item.name.toLowerCase().includes("avocado"));
      const hasBread = cartItems.some(item => item.name.toLowerCase().includes("bread"));
      
      if (hasEggs && hasAvocado && hasBread) {
        return "With eggs, avocado, and bread in your cart, you could make a delicious avocado toast topped with a poached egg! It's a nutrient-packed breakfast that takes just minutes to prepare.";
      } else if (hasEggs) {
        return "I see you have eggs in your cart! How about a quick frittata? Add some vegetables, cheese, and herbs for a satisfying meal. Or add avocado and whole grain bread from our store for a complete breakfast!";
      } else {
        return "I'd be happy to suggest a recipe based on your cart items or preferences! You can add ingredients to your cart and I'll help you create a delicious meal.";
      }
    }
    // Deal and recommendation queries
    else if (userMessageLower.includes("deal") || userMessageLower.includes("offer") || userMessageLower.includes("discount") || userMessageLower.includes("save")) {
      return "Today's best deals include:\n1. 20% off on all organic produce at Freshmart\n2. Buy one get one 50% off on dairy products at Dairy Depot\n3. $5 off when you spend $30 on Health Foods items\nWould you like me to add any of these sale items to your cart?";
    }
    // Food recommendation queries
    else if (userMessageLower.includes("recommend") || userMessageLower.includes("suggest") || userMessageLower.includes("what should i eat") || userMessageLower.includes("what can i eat")) {
      if (userMessageLower.includes("breakfast")) {
        return "For a nutritious breakfast, I recommend our organic eggs and whole grain bread. Add avocado for healthy fats! We also have Greek yogurt with fresh blueberries for a lighter option.";
      } else if (userMessageLower.includes("lunch") || userMessageLower.includes("dinner")) {
        return "For a quick and healthy meal, our wild salmon is on special today. Pair it with sweet potatoes and quinoa for a balanced dinner. If you prefer vegetarian, try our pasta with organic sauce and add some fresh vegetables.";
      } else if (userMessageLower.includes("snack") || userMessageLower.includes("quick")) {
        return "For a healthy snack, I'd recommend our Greek yogurt, fresh fruit like apples or blueberries, or almond butter with whole grain crackers. The avocados are perfectly ripe today too!";
      } else if (cartItems.length > 0) {
        // Personalized recommendations based on cart
        const categories = new Set(cartItems.map(item => item.category));
        if (categories.has("Produce")) {
          return "Based on your cart, I see you enjoy fresh produce! Our organic avocados and sweet potatoes are exceptional this week. They pair wonderfully with the items you already have.";
        } else if (categories.has("Bakery")) {
          return "Since you have bakery items in your cart, you might enjoy our artisanal almond butter as a spread. It's on sale this week!";
        } else {
          return "Looking at your cart, I'd recommend adding some fresh fruits or vegetables to balance your meal. Our organic apples and avocados are at peak ripeness right now!";
        }
      } else {
        return "I'd be happy to recommend something! Are you looking for breakfast, lunch, dinner, or a snack idea? Our organic apples and avocados are particularly fresh this week.";
      }
    }
    // Health and dietary questions
    else if (userMessageLower.includes("healthy") || userMessageLower.includes("nutrition") || userMessageLower.includes("diet")) {
      return "For healthy eating, I recommend focusing on our fresh produce section. The organic apples, avocados, and sweet potatoes are nutritional powerhouses. Our wild salmon is rich in omega-3s, and quinoa provides complete protein. Would you like specific recommendations based on your dietary preferences?";
    }
    // Default responses
    else if (userMessageLower.includes("help") || userMessageLower.includes("how")) {
      return "I can help you find products, explain recommendations, suggest recipes, describe how foods taste, find the best deals, and answer questions about our service. Just ask away!";
    } else {
      return "I'm here to help with your shopping! You can ask me about food recommendations, how products taste, recipe ideas, or current deals and discounts. What are you interested in today?";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    // Simulate typing delay before bot responds
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(userMessage.content),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 800);
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
      {/* Chat button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
      
      {/* Chat dialog */}
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
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-70 block mt-1">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
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
            <Button type="submit" size="icon" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
