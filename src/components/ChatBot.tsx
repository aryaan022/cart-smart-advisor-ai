
import React, { useState, useRef, useEffect } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ChatBotProps {
  cartItems: any[];
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
    
    if (userMessageLower.includes("recommendation") || userMessageLower.includes("suggest")) {
      if (cartItems.length === 0) {
        return "Add some items to your cart first, and I'll be able to provide personalized recommendations!";
      } else {
        return `Based on your cart items, I recommend checking out our bundle deals and similar products from different stores that might offer better prices.`;
      }
    } else if (userMessageLower.includes("discount") || userMessageLower.includes("coupon")) {
      return "You can use code WELCOME10 for 10% off your first purchase!";
    } else if (userMessageLower.includes("price") || userMessageLower.includes("cost")) {
      return "We continuously track prices across multiple stores to help you find the best deals.";
    } else if (userMessageLower.includes("help") || userMessageLower.includes("how")) {
      return "I can help you find products, explain recommendations, provide shopping tips, and answer questions about our service. Just ask away!";
    } else {
      return "I'm here to help with your shopping! You can ask me about product recommendations, discounts, or how to use CartSmart features.";
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
              placeholder="Type your question..."
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
