
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Product } from '@/types';

interface ProductFiltersProps {
  products: Product[];
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ products, activeFilter, onFilterChange }) => {
  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Get unique stores from products
  const stores = Array.from(new Set(products.map(p => p.store)));
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(activeFilter === category ? null : category)}
              className="flex items-center gap-1"
            >
              {activeFilter === category && <CheckCircle className="h-3 w-3" />}
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Stores</h3>
        <div className="flex flex-wrap gap-2">
          {stores.map(store => (
            <Button
              key={store}
              variant={activeFilter === store ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(activeFilter === store ? null : store)}
              className="flex items-center gap-1"
            >
              {activeFilter === store && <CheckCircle className="h-3 w-3" />}
              {store}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
