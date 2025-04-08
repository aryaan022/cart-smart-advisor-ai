
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem } from '@/types';
import { Separator } from '@/components/ui/separator';
import { DollarSign, TrendingDown } from 'lucide-react';

interface CartStatsProps {
  cartItems: CartItem[];
  potentialSavings: number;
}

const CartStats: React.FC<CartStatsProps> = ({ cartItems, potentialSavings }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 
    0
  );
  const currentSavings = originalTotal - subtotal;
  const totalPotentialSavings = currentSavings + potentialSavings;
  const storeCount = new Set(cartItems.map(item => item.store)).size;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Cart Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Stores:</span>
            <span>{storeCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Original Price:</span>
            <span>${originalTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <Separator className="my-3" />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              Current Savings:
            </span>
            <span className="font-bold text-primary">
              ${currentSavings.toFixed(2)}
            </span>
          </div>
          
          {potentialSavings > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-accent" />
                Additional Potential Savings:
              </span>
              <span className="font-bold text-accent">
                ${potentialSavings.toFixed(2)}
              </span>
            </div>
          )}
          
          <div className="mt-2 pt-2 border-t border-dashed flex justify-between items-center">
            <span className="font-medium">Total Possible Savings:</span>
            <span className="text-lg font-bold">
              ${totalPotentialSavings.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartStats;
