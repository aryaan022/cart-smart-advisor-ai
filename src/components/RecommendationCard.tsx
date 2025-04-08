
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp } from "lucide-react";
import { Recommendation } from "@/types";
import { Badge } from '@/components/ui/badge';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAddToCart: (itemIds: string[]) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onAddToCart }) => {
  const handleAddAll = () => {
    const itemIds = recommendation.items.map(item => item.id);
    onAddToCart(itemIds);
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-secondary/20 to-primary/20 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              {recommendation.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {recommendation.description}
            </CardDescription>
          </div>
          <Badge className="bg-accent text-accent-foreground animate-pulse-scale" variant="secondary">
            Save ${recommendation.savings.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-2">
          {recommendation.items.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
              <div className="h-12 w-12 bg-muted rounded-md overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">${item.price.toFixed(2)}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">• {item.store}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button 
          className="mt-3 w-full gap-2" 
          onClick={handleAddAll}
        >
          <PlusCircle className="h-4 w-4" />
          Add All Items
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
