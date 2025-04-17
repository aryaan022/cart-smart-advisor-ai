
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check, ImageIcon } from "lucide-react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isInCart, onAddToCart }) => {
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;
  
  const currencySymbol = "₹"; // Fixed to use Indian Rupee symbol consistently
  const [imageError, setImageError] = React.useState(false);

  // Generate a fallback image URL based on product name
  const fallbackImageUrl = `https://source.unsplash.com/300x300/?${encodeURIComponent(product.name.split(' ')[0])},food`;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 bg-muted flex items-center justify-center">
        {!imageError ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <img
            src={fallbackImageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              // If even fallback image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              setImageError(true);
              return (
                <div className="flex flex-col items-center justify-center h-full w-full bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground opacity-40" />
                  <span className="text-xs text-muted-foreground mt-2">{product.name}</span>
                </div>
              );
            }}
          />
        )}
        {imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center h-full w-full bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground opacity-40" />
            <span className="text-xs text-muted-foreground mt-2">{product.name}</span>
          </div>
        )}
        {discountPercent > 0 && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
            {discountPercent}% OFF
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">{product.rating}★</span>
          </div>
        </div>
        
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-lg font-bold">{currencySymbol}{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {currencySymbol}{product.originalPrice}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{product.store}</span>
          <Button 
            variant={isInCart ? "secondary" : "default"}
            size="sm"
            onClick={() => onAddToCart(product)}
            className="gap-1"
          >
            {isInCart ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
