
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
  
  // Check if we have eggs and milk in the cart
  const hasEggs = cartItems.some(item => item.id === "4");
  const hasMilk = cartItems.some(item => item.id === "3");
  
  if (hasEggs && !hasMilk) {
    recommendations.push({
      id: "rec1",
      title: "Add milk to your breakfast essentials",
      description: "Adding milk to your eggs could save you on combined shipping from Farm Direct.",
      savings: 2.10,
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
      savings: 1.50,
      items: [
        {
          id: "13",
          name: "Whole Grain Pasta",
          price: 1.99,
          originalPrice: 2.49,
          image: "/placeholder.svg",
          description: "Organic whole grain pasta, 16oz",
          store: "Grocery Plus",
          category: "Pantry",
          rating: 4.4,
          inStock: true,
          quantity: 1
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
      savings: 3.50,
      items: [
        {
          id: "14",
          name: "Banana Bunch",
          price: 1.99,
          originalPrice: 2.49,
          image: "/placeholder.svg",
          description: "Organic banana bunch",
          store: "Freshmart",
          category: "Produce",
          rating: 4.3,
          inStock: true,
          quantity: 1
        },
        {
          id: "15",
          name: "Blueberries",
          price: 3.99,
          originalPrice: 4.99,
          image: "/placeholder.svg",
          description: "Organic blueberries, 6oz container",
          store: "Freshmart",
          category: "Produce",
          rating: 4.7,
          inStock: true,
          quantity: 1
        }
      ]
    });
  }
  
  // Generic recommendation for all carts
  recommendations.push({
    id: "rec4",
    title: "Better together offer",
    description: "Health Foods is running a promotion on these items when purchased together.",
    savings: 4.20,
    items: [
      createCartItem("6"),
      createCartItem("9")
    ]
  });
  
  return recommendations;
};
