
import { Recommendation } from "../types";
import { mockProducts } from "./mockProducts";

// Helper function to create cart items from products with quantity
const createCartItem = (productId: string, quantity: number = 1) => {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) throw new Error(`Product with id ${productId} not found`);
  return {
    ...product,
    quantity
  };
};

export const generateRecommendations = (cartItems: { id: string, quantity: number }[]): Recommendation[] => {
  // This would typically be a complex algorithm making API calls
  // For now we'll return static recommendations based on cart contents

  const recommendations: Recommendation[] = [];
  
  if (cartItems.length === 0) {
    return recommendations;
  }
  
  // Extract product IDs and categories from cart items
  const cartProductIds = cartItems.map(item => item.id);
  const cartProductCategories = new Set(
    cartItems.map(item => {
      const product = mockProducts.find(p => p.id === item.id);
      return product ? product.category : null;
    }).filter(Boolean)
  );
  
  // Check if we have eggs and milk in the cart
  const hasEggs = cartItems.some(item => item.id === "4");
  const hasMilk = cartItems.some(item => item.id === "3");
  
  if (hasEggs && !hasMilk) {
    recommendations.push({
      id: "rec1",
      title: "Add milk to your breakfast essentials",
      description: "Adding milk to your eggs could save you on combined shipping from Farm Direct.",
      savings: 150,
      items: [createCartItem("3")]
    });
  }
  
  // Check if we have pasta sauce without pasta
  const hasPastaSauce = cartItems.some(item => item.id === "5");
  
  if (hasPastaSauce) {
    recommendations.push({
      id: "rec2",
      title: "Complete your pasta dinner",
      description: "Grocery Plus has a bundle deal on pasta with sauce.",
      savings: 100,
      items: [
        {
          id: "13",
          name: "Whole Grain Pasta",
          price: 149,
          originalPrice: 199,
          image: "/placeholder.svg",
          description: "Organic whole grain pasta, 500g",
          store: "Grocery Plus",
          category: "Pantry",
          rating: 4.4,
          inStock: true,
          quantity: 1,
          currency: "₹"
        }
      ]
    });
  }
  
  // Check for fruits to suggest a bundle
  const hasApples = cartItems.some(item => item.id === "1");
  const hasAvocados = cartItems.some(item => item.id === "7");
  
  if (hasApples || hasAvocados) {
    recommendations.push({
      id: "rec3",
      title: "Fruit bundle offer",
      description: "Freshmart has a special discount when you buy 3+ fruit items.",
      savings: 250,
      items: [
        {
          id: "14",
          name: "Banana Bunch",
          price: 149,
          originalPrice: 199,
          image: "/placeholder.svg",
          description: "Organic banana bunch",
          store: "Freshmart",
          category: "Produce",
          rating: 4.3,
          inStock: true,
          quantity: 1,
          currency: "₹"
        },
        {
          id: "15",
          name: "Blueberries",
          price: 299,
          originalPrice: 349,
          image: "/placeholder.svg",
          description: "Organic blueberries, 125g container",
          store: "Freshmart",
          category: "Produce",
          rating: 4.7,
          inStock: true,
          quantity: 1,
          currency: "₹"
        }
      ]
    });
  }
  
  // PRICE OPTIMIZATION RECOMMENDATIONS
  
  // Find expensive items in cart and suggest cheaper alternatives
  const expensiveItems = cartItems.filter(item => {
    const product = mockProducts.find(p => p.id === item.id);
    return product && product.price > 300;
  });
  
  if (expensiveItems.length > 0) {
    // Get the most expensive item
    const expensiveItem = expensiveItems.reduce((most, current) => {
      const mostProduct = mockProducts.find(p => p.id === most.id);
      const currentProduct = mockProducts.find(p => p.id === current.id);
      if (!mostProduct || !currentProduct) return most;
      return mostProduct.price > currentProduct.price ? most : current;
    }, expensiveItems[0]);
    
    const expensiveProduct = mockProducts.find(p => p.id === expensiveItem.id);
    if (expensiveProduct) {
      // Find a cheaper alternative
      const cheaperProducts = mockProducts.filter(p => 
        p.id !== expensiveProduct.id && 
        p.category === expensiveProduct.category && 
        p.price < expensiveProduct.price
      ).sort((a, b) => a.price - b.price);
      
      if (cheaperProducts.length > 0) {
        const cheaperProduct = cheaperProducts[0];
        const priceDifference = expensiveProduct.price - cheaperProduct.price;
        
        recommendations.push({
          id: `rec-save-${expensiveProduct.id}`,
          title: `Save ₹${priceDifference} on ${expensiveProduct.category}`,
          description: `Switch to ${cheaperProduct.name} and save ₹${priceDifference} on your purchase.`,
          savings: priceDifference,
          items: [{...cheaperProduct, quantity: 1}]
        });
      }
    }
  }
  
  // Store-based bundle offers for multiple items from the same store
  const storeGroups: {[key: string]: string[]} = {};
  
  cartItems.forEach(item => {
    const product = mockProducts.find(p => p.id === item.id);
    if (product) {
      if (!storeGroups[product.store]) {
        storeGroups[product.store] = [];
      }
      storeGroups[product.store].push(product.id);
    }
  });
  
  // For stores with multiple items, suggest additional items from the same store
  for (const [store, productIds] of Object.entries(storeGroups)) {
    if (productIds.length >= 2) {
      const storeProducts = mockProducts.filter(p => 
        p.store === store && 
        !cartProductIds.includes(p.id)
      );
      
      // Select 2 random products from the same store to add
      const additionalProducts = storeProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      
      if (additionalProducts.length > 0) {
        const cartValue = productIds.reduce((sum, id) => {
          const product = mockProducts.find(p => p.id === id);
          return sum + (product?.price || 0);
        }, 0);
        
        const additionalValue = additionalProducts.reduce((sum, product) => {
          return sum + product.price;
        }, 0);
        
        const savings = Math.floor((cartValue + additionalValue) * 0.15); // 15% bundle discount
        
        recommendations.push({
          id: `rec-store-${store.replace(/\s+/g, '-')}`,
          title: `${store} Bundle Offer`,
          description: `Add these items to your ${store} products and save ₹${savings} with our bundle discount!`,
          savings,
          items: additionalProducts.map(p => ({...p, quantity: 1}))
        });
      }
    }
  }
  
  // Generic recommendation for all carts
  recommendations.push({
    id: "rec4",
    title: "Better together offer",
    description: "Health Foods is running a promotion on these items when purchased together.",
    savings: 320,
    items: [
      createCartItem("6"),
      createCartItem("9")
    ]
  });
  
  return recommendations;
};

// Get cheaper alternatives for a specific product
export const getCheaperAlternatives = (productId: string): Recommendation | null => {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return null;
  
  const cheaperProducts = mockProducts.filter(p => 
    p.id !== productId && 
    p.category === product.category && 
    p.price < product.price
  ).sort((a, b) => a.price - b.price).slice(0, 2);
  
  if (cheaperProducts.length === 0) return null;
  
  const savings = product.price - cheaperProducts[0].price;
  
  return {
    id: `cheaper-alt-${productId}`,
    title: `Save ₹${savings} on ${product.name}`,
    description: `Try these cheaper alternatives in the same category.`,
    savings,
    items: cheaperProducts.map(p => ({...p, quantity: 1}))
  };
};

