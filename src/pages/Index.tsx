import React, { useState, useEffect } from "react";
import { mockProducts } from "@/data/mockProducts";
import { generateRecommendations } from "@/data/mockRecommendations";
import { CartItem, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";
import { default as CartItemComponent } from "@/components/CartItem";
import RecommendationCard from "@/components/RecommendationCard";
import SearchBar from "@/components/SearchBar";
import CartStats from "@/components/CartStats";
import ProductFilters from "@/components/ProductFilters";

const Index: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>(mockProducts);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [potentialSavings, setPotentialSavings] = useState<number>(0);

  useEffect(() => {
    if (cartItems.length > 0) {
      const cartItemsForRecommendations = cartItems.map(item => ({ id: item.id, quantity: item.quantity }));
      const newRecommendations = generateRecommendations(cartItemsForRecommendations);
      setRecommendations(newRecommendations);
      
      const totalPotentialSavings = newRecommendations.reduce(
        (sum, rec) => sum + rec.savings, 
        0
      );
      setPotentialSavings(totalPotentialSavings);
    } else {
      setRecommendations([]);
      setPotentialSavings(0);
    }
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.name} has been removed from your cart.`,
        });
      }
      return prevItems.filter(item => item.id !== id);
    });
  };

  const handleAddRecommendedItems = (itemIds: string[]) => {
    const recommendation = recommendations.find(rec => 
      rec.items.some(item => itemIds.includes(item.id))
    );
    
    if (recommendation) {
      const newItems: CartItem[] = [];
      
      recommendation.items.forEach((recItem: CartItem) => {
        const existingItem = cartItems.find(item => item.id === recItem.id);
        
        if (!existingItem) {
          newItems.push({ ...recItem, quantity: 1 });
        }
      });
      
      if (newItems.length > 0) {
        setCartItems(prev => [...prev, ...newItems]);
        toast({
          title: "Added recommendation",
          description: `Added ${newItems.length} item${newItems.length > 1 ? 's' : ''} to your cart.`,
        });
      }
    }
  };

  const handleSearch = (results: Product[]) => {
    setSearchResults(results);
  };

  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter);
    
    if (filter === null) {
      setSearchResults(products);
    } else {
      const filtered = products.filter(
        product => 
          product.category === filter || 
          product.store === filter
      );
      setSearchResults(filtered);
    }
  };

  const displayedProducts = activeFilter
    ? searchResults.filter(
        product => 
          product.category === activeFilter || 
          product.store === activeFilter
      )
    : searchResults;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="container py-4 px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">CartSmart AI Optimizer</h1>
          </div>
          <SearchBar products={products} onSearch={handleSearch} />
          <div className="relative">
            <Button variant="outline" className="gap-2">
              <ShoppingCart className="h-5 w-5" />
              My Cart
              {cartItems.length > 0 && (
                <Badge className="bg-primary ml-1">{cartItems.length}</Badge>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <ProductFilters
                products={products}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            {cartItems.length > 0 && (
              <CartStats 
                cartItems={cartItems}
                potentialSavings={potentialSavings}
              />
            )}
          </div>
          
          <div className="lg:col-span-6 space-y-6">
            {displayedProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Products</h2>
                  <span className="text-sm text-muted-foreground">
                    {displayedProducts.length} result{displayedProducts.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {displayedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isInCart={cartItems.some(item => item.id === product.id)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-primary/10 p-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Your Cart
                  {cartItems.length > 0 && (
                    <Badge className="bg-primary ml-2">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                    </Badge>
                  )}
                </h2>
              </div>
              
              <ScrollArea className="h-[350px] p-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add items to get personalized savings recommendations
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {cartItems.map(item => (
                      <CartItemComponent
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            {recommendations.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Recommendations
                </h2>
                <div className="space-y-4">
                  {recommendations.map(recommendation => (
                    <RecommendationCard
                      key={recommendation.id}
                      recommendation={recommendation}
                      onAddToCart={handleAddRecommendedItems}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
