
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { Product } from '@/types';

interface SearchBarProps {
  products: Product[];
  onSearch: (results: Product[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ products, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      onSearch(products);
      return;
    }
    
    const searchTerm = query.toLowerCase().trim();
    const results = products.filter(
      product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.store.toLowerCase().includes(searchTerm)
    );
    
    onSearch(results);
  };

  return (
    <form onSubmit={handleSearch} className="relative flex w-full max-w-md items-center">
      <Input
        type="text"
        placeholder="Search products, stores, categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-12"
      />
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon"
        className="absolute right-0"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;
