import React, { useState, useRef, useEffect } from "react";
import { Bot, MessageCircle, Send, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChatMessage, CartItem, ChatApiResponse, FoodKnowledge, QuestionSuggestion } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { queryGeminiApi, generateSuggestionsWithGemini } from "@/services/geminiService";
import { getRecentMessages, calculateTypingDelay } from "@/utils/chatUtils";

interface ChatBotProps {
  cartItems: CartItem[];
}

interface ContextualKnowledge {
  [key: string]: FoodKnowledge;
}

interface ConversationContext {
  lastTopic?: string;
  mentionedFoods: string[];
  askedAbout: Set<string>;
  userPreferences: {
    dietaryPreferences?: string[];
    likedFoods?: string[];
    dislikedFoods?: string[];
  };
  interactionCount: number;
  lastSuggestion?: Date;
  hasAskedFollowUp: boolean;
  recentQuestions: Set<string>;
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
      suggestions: [
        { id: "s1", text: "Tell me about seasonal produce", icon: "help-circle" },
        { id: "s2", text: "What deals are available?", icon: "question-mark-circle" },
        { id: "s3", text: "Recommend a healthy breakfast", icon: "help-circle" }
      ]
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    mentionedFoods: [],
    askedAbout: new Set<string>(),
    userPreferences: {},
    interactionCount: 0,
    hasAskedFollowUp: false,
    recentQuestions: new Set<string>()
  });

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

  const casualPhrases = {
    greetings: [
      "Hi there! ",
      "Hello! ",
      "Hey! ",
      "Great to hear from you! ",
      "Thanks for reaching out! "
    ],
    thinking: [
      "Let me think about that... ",
      "That's a great question. ",
      "Hmm, let me see... ",
      "Let me check that for you. ",
      "Good question! "
    ],
    positive: [
      "Absolutely! ",
      "Of course! ",
      "Definitely! ",
      "Sure thing! ",
      "I'd be happy to help with that! "
    ],
    transitions: [
      "By the way, ",
      "Also, ",
      "I should mention that ",
      "Oh, and ",
      "Something else you might like to know: "
    ],
    personalQuestions: [
      "Do you cook often at home?",
      "What kind of dishes do you enjoy making?",
      "Are you shopping for a special occasion?",
      "Do you have any dietary preferences I should keep in mind?",
      "Have you tried any of our seasonal items yet?"
    ]
  };

  const getRandomItem = <T,>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };

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

  const findMatchingFood = (userMessage: string): string | null => {
    const userMessageLower = userMessage.toLowerCase();
    for (const food in foodKnowledge) {
      if (userMessageLower.includes(food)) {
        return food;
      }
    }
    return null;
  };

  const updateConversationContext = (userMessage: string, responseContent: string) => {
    setConversationContext(prevContext => {
      const newMentionedFoods = Object.keys(foodKnowledge).filter(food => 
        userMessage.toLowerCase().includes(food) && !prevContext.mentionedFoods.includes(food)
      );
      
      const topicKeywords: {[key: string]: string} = {
        'recipe': 'recipes',
        'cook': 'cooking',
        'meal': 'meals',
        'health': 'health benefits',
        'store': 'storage',
        'seasonal': 'seasonality',
        'deal': 'deals',
        'offer': 'offers',
        'discount': 'discounts'
      };
      
      let lastTopic = prevContext.lastTopic;
      for (const [keyword, topic] of Object.entries(topicKeywords)) {
        if (userMessage.toLowerCase().includes(keyword)) {
          lastTopic = topic;
          break;
        }
      }
      
      const dietaryKeywords = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'];
      const dietaryPreferences = dietaryKeywords.filter(pref => 
        userMessage.toLowerCase().includes(pref) && 
        !prevContext.userPreferences.dietaryPreferences?.includes(pref)
      );
      
      const recentQuestions = new Set(prevContext.recentQuestions);
      recentQuestions.add(userMessage.toLowerCase());
      
      if (recentQuestions.size > 5) {
        const oldestQuestion = Array.from(recentQuestions)[0];
        recentQuestions.delete(oldestQuestion);
      }
      
      return {
        lastTopic,
        mentionedFoods: [...prevContext.mentionedFoods, ...newMentionedFoods],
        askedAbout: new Set([...Array.from(prevContext.askedAbout), ...newMentionedFoods]),
        userPreferences: {
          ...prevContext.userPreferences,
          dietaryPreferences: [
            ...(prevContext.userPreferences.dietaryPreferences || []),
            ...dietaryPreferences
          ]
        },
        interactionCount: prevContext.interactionCount + 1,
        lastSuggestion: new Date(),
        hasAskedFollowUp: responseContent.includes("?"),
        recentQuestions
      };
    });
  };

  const fetchChatbotResponse = async (userMessage: string): Promise<ChatApiResponse> => {
    try {
      const recentMessages = getRecentMessages(messages);
      
      const response = await queryGeminiApi(userMessage, cartItems, recentMessages);
      
      const suggestions = await generateSuggestionsWithGemini(userMessage, response, cartItems);
      
      return {
        message: response,
        suggestions: suggestions
      };
    } catch (error) {
      console.log("Error fetching chatbot response from Gemini API:", error);
      console.log("Falling back to local processing...");
      
      const localResponse = generateBotResponse(userMessage);
      
      return {
        message: localResponse,
        suggestions: generateSuggestions(userMessage, localResponse)
      };
    }
  };

  const generateSuggestions = (userMessage: string, botResponse: string): string[] => {
    const userMessageLower = userMessage.toLowerCase();
    const botResponseLower = botResponse.toLowerCase();
    const suggestions: string[] = [];
    
    const addSuggestion = (suggestion: string) => {
      if (
        !conversationContext.recentQuestions.has(suggestion.toLowerCase()) &&
        !suggestions.some(s => s.toLowerCase() === suggestion.toLowerCase()) &&
        suggestions.length < 3
      ) {
        suggestions.push(suggestion);
      }
    };
    
    const matchedFood = findMatchingFood(userMessageLower);
    if (matchedFood) {
      if (!botResponseLower.includes("taste") && !userMessageLower.includes("taste")) {
        addSuggestion(`How does ${matchedFood} taste?`);
      }
      if (!botResponseLower.includes("health") && !botResponseLower.includes("benefit") && 
          !userMessageLower.includes("health") && !userMessageLower.includes("benefit")) {
        addSuggestion(`What are the health benefits of ${matchedFood}?`);
      }
      if (!botResponseLower.includes("store") && !userMessageLower.includes("store")) {
        addSuggestion(`How should I store ${matchedFood}?`);
      }
      if (!botResponseLower.includes("recipe") && !userMessageLower.includes("recipe")) {
        addSuggestion(`What can I make with ${matchedFood}?`);
      }
    }
    
    if (conversationContext.lastTopic) {
      switch (conversationContext.lastTopic) {
        case 'recipes':
          addSuggestion("Do you have any quick meal ideas?");
          addSuggestion("What's a good vegetarian dinner option?");
          break;
        case 'deals':
        case 'offers':
        case 'discounts':
          addSuggestion("What's the best deal this week?");
          addSuggestion("Are there any discounts on organic products?");
          break;
        case 'health benefits':
          addSuggestion("What foods help with energy levels?");
          addSuggestion("Which fruits have the most antioxidants?");
          break;
        case 'seasonality':
          addSuggestion("What's in season right now?");
          addSuggestion("When will mangoes be in season?");
          break;
      }
    }
    
    const generalSuggestions = [
      "What deals are available this week?",
      "Tell me about seasonal produce",
      "Can you recommend a healthy breakfast?",
      "What's popular in the store right now?",
      "What's good for a quick dinner?",
      "Do you have meal prep ideas?",
      "What are your freshest items today?",
      "Are there any new products?"
    ];
    
    while (suggestions.length < 3) {
      const randomSuggestion = generalSuggestions[Math.floor(Math.random() * generalSuggestions.length)];
      addSuggestion(randomSuggestion);
      if (suggestions.length === generalSuggestions.length) break;
    }
    
    return suggestions;
  };

  const generateBotResponse = (userMessage: string): string => {
    const userMessageLower = userMessage.toLowerCase();
    
    const matchedFood = findMatchingFood(userMessageLower);
    
    let greeting = '';
    if (conversationContext.interactionCount <= 1) {
      greeting = getRandomItem(casualPhrases.greetings);
    } else if (conversationContext.interactionCount % 3 === 0) {
      greeting = getRandomItem(casualPhrases.thinking);
    }
    
    const shouldAskFollowUp = !conversationContext.hasAskedFollowUp;
    
    if (matchedFood) {
      if (userMessageLower.includes("taste") || userMessageLower.includes("flavor")) {
        return `${greeting}${foodKnowledge[matchedFood].taste}${shouldAskFollowUp ? " Have you tried it before? Many of our customers say it's exceptional compared to what they find elsewhere." : ""}`;
      } else if (userMessageLower.includes("health") || userMessageLower.includes("benefit")) {
        return `${greeting}${foodKnowledge[matchedFood].benefits} I've heard from many customers that they notice a real difference when switching to our quality products. Is that something you're particularly interested in?`;
      } else if (userMessageLower.includes("pair") || userMessageLower.includes("combine") || userMessageLower.includes("with")) {
        return `${greeting}${foodKnowledge[matchedFood].pairings} What kind of flavors do you typically enjoy? I can suggest some combinations that might work well with your preferences.`;
      } else if (userMessageLower.includes("store") || userMessageLower.includes("keep")) {
        const storageInfo = foodKnowledge[matchedFood].storage || `${matchedFood.charAt(0).toUpperCase() + matchedFood.slice(1)} is best stored in a cool, dry place. If you need specific storage instructions, just ask!`;
        return `${greeting}${storageInfo} Do you find storage space is often a challenge? I have some creative solutions that work well for many of our customers.`;
      } else {
        const randomInfo = `${greeting}${foodKnowledge[matchedFood].taste} ${foodKnowledge[matchedFood].benefits}`;
        return shouldAskFollowUp ? `${randomInfo} Would you like to know more about how to use or store it?` : randomInfo;
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
          return `${greeting}Based on your cart items, here's a perfect ${mealTime} recipe for you: ${relevantRecipes[0]}. Would you like more details on how to prepare it? I can also suggest some variations that might suit your taste preferences.`;
        }
        
        const personalQuestion = getRandomItem([
          `Do you like to experiment with new flavors or do you prefer traditional recipes?`,
          `Do you prefer quick meals or are you looking for something more elaborate?`,
          `Are you cooking for yourself or for others as well?`
        ]);
        
        return `${greeting}Here's a delicious ${mealTime} idea: ${regionalRecipes[mealTime][0]}. I notice you might need a few ingredients for this recipe. Would you like me to suggest what to add to your cart? ${personalQuestion}`;
      } else {
        return `${greeting}For a nutritious ${mealTime}, I recommend: ${regionalRecipes[mealTime].join(", or ")}. Would you like me to suggest ingredients to add to your cart for any of these recipes? What kind of flavors do you typically enjoy?`;
      }
    }
    
    if (userMessageLower.includes("deal") || userMessageLower.includes("offer") || userMessageLower.includes("discount") || userMessageLower.includes("save") || userMessageLower.includes("sale")) {
      const randomDeal = currentDeals[Math.floor(Math.random() * currentDeals.length)];
      const otherDeals = currentDeals.filter(deal => deal.title !== randomDeal.title).map(deal => deal.title);
      
      const personalTouch = getRandomItem([
        "I personally love the savings on the weekend produce sale - I've been able to try so many new vegetables without breaking the bank!",
        "The festive season special is particularly popular with our regular customers who plan ahead.",
        "Many customers have been combining these deals for maximum savings.",
        "These deals were curated based on our most popular customer requests."
      ]);
      
      return `${greeting}${randomDeal.title}: ${randomDeal.description} (${randomDeal.savings})\n\nWe also have these ongoing deals:\n• ${otherDeals.join("\n• ")}\n\n${personalTouch}\n\nWould you like more details on any of these offers?`;
    }
    
    if (userMessageLower.includes("recommend") || userMessageLower.includes("suggest") || userMessageLower.includes("what should i eat") || userMessageLower.includes("what can i eat")) {
      if (userMessageLower.includes("breakfast")) {
        return `${greeting}For a nutritious Indian breakfast, I recommend our organic eggs for making egg bhurji or try our whole grain bread with avocado and chaat masala. Our Greek yogurt with fresh fruits and a drizzle of local honey is also a customer favorite! What kind of breakfast do you typically prefer - something quick or more leisurely?`;
      } else if (userMessageLower.includes("lunch") || userMessageLower.includes("dinner")) {
        return `${greeting}Our wild salmon is perfect for a nutritious meal - try it with a tandoori spice rub. For vegetarian options, our organic sweet potatoes make amazing stuffed chaat boats, or use our quinoa for a protein-packed pulao with seasonal vegetables from our produce section. Are you looking for something quick to prepare or do you have time for a more elaborate meal?`;
      } else if (userMessageLower.includes("snack") || userMessageLower.includes("quick")) {
        return `${greeting}For a quick and healthy Indian-inspired snack, try our Greek yogurt with a sprinkle of chaat masala, or our fresh avocados mashed on whole grain toast with a dash of turmeric and black pepper. The ripe bananas with almond butter also make a satisfying and nutritious snack! Do you prefer sweet or savory snacks generally?`;
      } else if (cartItems.length > 0) {
        const categories = new Set(cartItems.map(item => item.category));
        const personalQuestion = getRandomItem(casualPhrases.personalQuestions);
        
        if (categories.has("Produce")) {
          return `${greeting}Based on your cart, I see you enjoy fresh produce! Our organic sweet potatoes would go perfectly with your selections - they're grown in the richest soil in Karnataka and have an exceptional sweet flavor when roasted with a little bit of ghee and jeera. ${personalQuestion}`;
        } else if (categories.has("Bakery")) {
          return `${greeting}Since you have bakery items in your cart, you might enjoy our artisanal almond butter as a spread. It's made from hand-selected almonds and has a smooth, rich texture that pairs beautifully with fresh bread! Many customers tell me they can't go back to regular butter after trying it. ${personalQuestion}`;
        } else if (categories.has("Dairy")) {
          return `${greeting}I notice you have dairy products in your cart. Our organic paneer is made fresh daily and would complement your dairy selections beautifully. It's perfect for making matar paneer or paneer tikka! We just got a new batch this morning that's exceptionally creamy. ${personalQuestion}`;
        } else {
          return `${greeting}Looking at your cart, I'd recommend adding some seasonal fruits or vegetables to balance your meal. Our organic apples from Himachal Pradesh are especially crisp and juicy right now, and the local avocados are at perfect ripeness for the next 2-3 days. A customer yesterday mentioned they made an amazing avocado chaat with them! ${personalQuestion}`;
        }
      } else {
        return `${greeting}I'd be happy to recommend something! Are you looking for breakfast, lunch, dinner, or snack ideas? Our seasonal local fruits and vegetables are particularly fresh this week, and we have some exclusive regional specialties you might enjoy. What kind of flavors do you typically prefer?`;
      }
    }
    
    if (userMessageLower.includes("healthy") || userMessageLower.includes("nutrition") || userMessageLower.includes("diet")) {
      const dietaryQuestion = getRandomItem([
        "Do you have any specific dietary preferences or restrictions I should keep in mind?",
        "Are you following any particular nutritional plan at the moment?",
        "What are your main health goals with your diet currently?",
        "Have you tried any of our specialty health foods yet?"
      ]);
      
      return `${greeting}For healthy eating with an Indian palate, I recommend our organic produce section for fresh vegetables to make nutrient-rich sabzis. Our millets and whole grains like ragi and brown rice are excellent alternatives to refined carbs. If you're focusing on protein, our Greek yogurt has 2X the protein of regular dahi, and our free-range eggs are from hens raised without antibiotics. ${dietaryQuestion}`;
    }
    
    if (userMessageLower.includes("help") || userMessageLower.includes("how")) {
      return `${greeting}I can help you find products, explain the taste and nutritional benefits of foods, suggest regional recipes, find local deals, and answer questions about our services. Just ask me anything about our products or how to use them in traditional or fusion recipes! What are you specifically looking for today? I'd love to help you find exactly what you need.`;
    } 
    else if (userMessageLower.includes("cart") || userMessageLower.includes("basket")) {
      if (cartItems.length === 0) {
        const suggestions = getRandomItem([
          "I noticed many customers are loving our seasonal mangoes this week - they're perfectly ripe and sweet!",
          "Our fresh bread is baked in-store every morning, and it's been very popular lately.",
          "Many customers are stocking up on our organic rice and lentils while they're on special.",
          "Our fresh paneer is made daily and has been flying off the shelves!"
        ]);
        
        return `${greeting}Your cart is currently empty. ${suggestions} Would you like me to recommend some seasonal specialties or weekly deals to get you started?`;
      } else {
        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const personalTouch = getRandomItem([
          "I see you have some great choices there!",
          "You've selected some of our most popular items!",
          "Those are excellent choices.",
          "You've got some wonderful items there."
        ]);
        
        return `${greeting}You have ${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart totaling ₹${totalAmount}. ${personalTouch} Based on your selections, you might enjoy adding some complementary items. Would you like suggestions?`;
      }
    }
    else if (userMessageLower.includes("store") || userMessageLower.includes("delivery") || userMessageLower.includes("pickup")) {
      const personalNote = getRandomItem([
        "I always recommend the express delivery for perishables - it's amazingly fast!",
        "Many customers prefer the early morning pickup to get the freshest produce.",
        "The pickup service is really convenient if you're in a hurry.",
        "We've recently improved our delivery packaging to keep items fresher for longer!"
      ]);
      
      return `${greeting}Our stores are open from 7 AM to 10 PM daily. We offer free delivery for orders above ₹500 within a 10km radius, and our express delivery gets your groceries to you within 2 hours. For pickup orders, we have dedicated parking spaces - just notify us 30 minutes before arrival so we can have everything ready! ${personalNote}`;
    }
    else if (userMessageLower.includes("who are you") || userMessageLower.includes("what are you") || userMessageLower.includes("are you human") || userMessageLower.includes("are you real")) {
      return `${greeting}I'm CartSmart's digital shopping assistant, designed to help make your shopping experience more personalized and enjoyable! While I'm not human, I'm trained to understand your preferences and provide helpful recommendations based on our products and your needs. Is there something specific I can help you find today?`;
    }
    else if (userMessageLower.includes("thank") || userMessageLower.includes("appreciate") || userMessageLower.includes("helpful")) {
      return `${greeting}You're very welcome! I'm glad I could help. Is there anything else you'd like to know about our products or services? I'm always here to assist with your shopping needs.`;
    }
    else if (userMessageLower.includes("hi") || userMessageLower.includes("hello") || userMessageLower.includes("hey") || userMessageLower.match(/^(good|morning|afternoon|evening)/)) {
      const timeBasedGreeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
      return `${timeBasedGreeting}! It's great to chat with you today. I'm here to help with your shopping experience. Are you looking for something specific, or would you like some recommendations based on what's fresh and in season?`;
    }
    else {
      const randomQuestion = getRandomItem(casualPhrases.personalQuestions);
      
      return `${greeting}I'm here to help with your shopping experience! I can tell you about food taste profiles, suggest recipes using Indian ingredients, recommend regional specialties, or inform you about our current deals and discounts. ${randomQuestion}`;
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    if (!isTyping) {
      setMessage(suggestionText);
      handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
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
      
      const typingDelay = calculateTypingDelay(chatResponse.message);
      
      updateConversationContext(userMessage.content, chatResponse.message);
      
      await new Promise(resolve => setTimeout(resolve, typingDelay));
      
      let suggestions: QuestionSuggestion[] = [];
      
      if (chatResponse.suggestions && chatResponse.suggestions.length > 0) {
        const suggestionIcons = ["help-circle", "question-mark-circle", "message-circle"];
        
        suggestions = chatResponse.suggestions.map((text, index) => ({
          id: `sugg-${Date.now()}-${index}`,
          text,
          icon: suggestionIcons[index % suggestionIcons.length]
        }));
      }
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: chatResponse.message,
        isUser: false,
        timestamp: new Date(),
        suggestions: suggestions.length > 0 ? suggestions : undefined
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
      
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
                <div key={msg.id} className="space-y-2">
                  <div
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
                  
                  {!msg.isUser && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-2 mt-2">
                      {msg.suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/50 hover:bg-secondary/70 rounded-full text-xs transition-colors"
                          disabled={isTyping}
                        >
                          {suggestion.icon && (
                            <HelpCircle className="w-3 h-3" />
                          )}
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  )}
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
