
import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ImageIcon } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const currencySymbol = "₹"; // Fixed to use Indian Rupee symbol consistently
  const [imageError, setImageError] = React.useState(false);

  // Generate a fallback image URL based on item name
  const fallbackImageUrl = `https://source.unsplash.com/300x300/?${encodeURIComponent(item.name.split(' ')[0])},food`;

  return (
    <div className="flex items-center py-3 border-b last:border-0">
      <div className="h-16 w-16 bg-muted mr-3 rounded-md overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <img
            src={fallbackImageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
            onError={() => {
              // If fallback image also fails, show icon
              return (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <ImageIcon className="h-6 w-6 text-muted-foreground opacity-40" />
                </div>
              );
            }}
          />
        )}
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium text-sm">{item.name}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-medium">{currencySymbol}{item.price}</span>
          {item.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {currencySymbol}{item.originalPrice}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{item.store}</div>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center border rounded-md mr-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrement}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
