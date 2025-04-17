
import { Recipe } from "@/types";

export const productRecipes: Recipe[] = [
  {
    id: "recipe-1",
    name: "Spinach and Quinoa Salad with Honey Dressing",
    description: "A nutritious and vibrant salad combining baby spinach with protein-rich quinoa.",
    ingredients: [
      "2 cups organic baby spinach",
      "1 cup cooked quinoa",
      "1/4 cup red bell pepper, diced",
      "1/4 cup cucumber, diced",
      "2 tbsp olive oil",
      "1 tbsp organic honey",
      "1 tbsp lemon juice",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook quinoa according to package instructions and let cool.",
      "In a large bowl, combine spinach, cooled quinoa, red bell pepper, and cucumber.",
      "In a small bowl, whisk together olive oil, honey, lemon juice, salt, and pepper.",
      "Pour dressing over salad and toss gently to combine.",
      "Serve immediately as a light meal or side dish."
    ],
    prepTime: "10 minutes",
    cookTime: "15 minutes",
    servings: 2,
    difficulty: "Easy",
    relatedProducts: ["prod-21", "prod-22", "prod-26", "prod-30"]
  },
  {
    id: "recipe-2",
    name: "Roasted Sweet Potato and Red Lentil Soup",
    description: "A hearty, warming soup perfect for cool evenings.",
    ingredients: [
      "2 medium sweet potatoes, diced",
      "1 cup red lentils, rinsed",
      "1 onion, chopped",
      "2 cloves garlic, minced",
      "1 tbsp turmeric powder",
      "1 liter vegetable broth",
      "2 tbsp olive oil",
      "Salt and pepper to taste",
      "Fresh basil for garnish"
    ],
    instructions: [
      "Preheat oven to 200°C. Toss sweet potatoes with 1 tbsp olive oil, salt and pepper.",
      "Roast sweet potatoes for 25 minutes until tender.",
      "In a large pot, heat remaining oil and sauté onion and garlic until translucent.",
      "Add turmeric and cook for 1 minute until fragrant.",
      "Add lentils and vegetable broth, bring to a boil then simmer for 15 minutes.",
      "Add roasted sweet potatoes and simmer for 5 more minutes.",
      "Blend soup to desired consistency, garnish with fresh basil and serve."
    ],
    prepTime: "15 minutes",
    cookTime: "45 minutes",
    servings: 4,
    difficulty: "Medium",
    relatedProducts: ["prod-23", "prod-27", "prod-32", "prod-33"]
  },
  {
    id: "recipe-3",
    name: "Greek Yogurt Parfait with Honey and Mixed Nuts",
    description: "A protein-packed breakfast or snack that's quick and delicious.",
    ingredients: [
      "2 cups Greek yogurt",
      "3 tbsp organic honey",
      "1/2 cup mixed nuts, chopped",
      "1/2 cup seasonal fresh fruits, diced",
      "1/4 tsp cinnamon (optional)"
    ],
    instructions: [
      "In two serving glasses, layer Greek yogurt, honey, nuts, and fruits.",
      "Repeat layers until all ingredients are used.",
      "Top with a drizzle of honey, sprinkle of nuts, and optional cinnamon.",
      "Serve immediately or refrigerate for up to 12 hours."
    ],
    prepTime: "5 minutes",
    cookTime: "0 minutes",
    servings: 2,
    difficulty: "Easy",
    relatedProducts: ["prod-25", "prod-30", "prod-34"]
  },
  {
    id: "recipe-4",
    name: "Honey Glazed Salmon with Spinach",
    description: "A delicious omega-3 rich main dish that's elegant yet simple to prepare.",
    ingredients: [
      "2 salmon fillets (about 150g each)",
      "2 tbsp organic honey",
      "2 tbsp soy sauce",
      "1 tbsp olive oil",
      "2 cloves garlic, minced",
      "1 tbsp fresh ginger, grated",
      "4 cups baby spinach",
      "1 lemon, cut into wedges",
      "Salt and pepper to taste"
    ],
    instructions: [
      "In a bowl, mix honey, soy sauce, half the oil, garlic, and ginger to create a marinade.",
      "Place salmon in the marinade for 15-30 minutes, turning once.",
      "Heat remaining oil in a pan over medium-high heat. Remove salmon from marinade (reserve marinade).",
      "Cook salmon 3-4 minutes per side until it flakes easily with a fork.",
      "Remove salmon from pan, add reserved marinade and bring to a simmer for 1 minute.",
      "In another pan, quickly wilt the spinach with a splash of water. Season lightly.",
      "Serve salmon over bed of spinach, drizzle with reduced marinade, and garnish with lemon wedges."
    ],
    prepTime: "20 minutes",
    cookTime: "10 minutes",
    servings: 2,
    difficulty: "Medium",
    relatedProducts: ["prod-21", "prod-29", "prod-30"]
  },
  {
    id: "recipe-5",
    name: "Almond Milk & Turmeric Golden Latte",
    description: "A warming, anti-inflammatory drink perfect for mornings or evenings.",
    ingredients: [
      "2 cups almond milk",
      "1 tsp turmeric powder",
      "1/2 tsp cinnamon",
      "1/4 tsp ginger powder (or 1 tsp fresh grated ginger)",
      "1 tbsp organic honey",
      "Pinch of black pepper"
    ],
    instructions: [
      "In a small saucepan, gently warm the almond milk over medium-low heat.",
      "Whisk in turmeric, cinnamon, ginger, and a pinch of black pepper.",
      "Continue heating and whisking until the mixture is hot but not boiling.",
      "Remove from heat and stir in honey.",
      "Pour into mugs and sprinkle with additional cinnamon if desired."
    ],
    prepTime: "2 minutes",
    cookTime: "5 minutes",
    servings: 2,
    difficulty: "Easy",
    relatedProducts: ["prod-24", "prod-30", "prod-33"]
  }
];
