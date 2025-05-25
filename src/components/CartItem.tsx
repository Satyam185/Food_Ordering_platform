import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { formatPrice } from '../lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { menuItem, quantity, selectedOptions } = item;

  // Calculate total price for this item
  const calculateItemTotal = (): number => {
    let total = menuItem.price;
    
    // Add price of selected options
    selectedOptions.forEach((option) => {
      total += option.choice.price;
    });
    
    return total * quantity;
  };

  return (
    <div className="py-4 border-b border-gray-200">
      <div className="flex gap-3">
        {/* Item image */}
        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={menuItem.imageUrl} 
            alt={menuItem.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Item details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <h4 className="font-medium text-gray-900">{menuItem.name}</h4>
            <span className="font-medium">{formatPrice(calculateItemTotal())}</span>
          </div>
          
          {/* Selected options */}
          {selectedOptions.length > 0 && (
            <div className="mt-1 text-sm text-gray-500">
              {selectedOptions.map((option, idx) => (
                <div key={idx}>
                  <span className="font-medium">{option.name}:</span> {option.choice.name}
                  {option.choice.price > 0 && ` (+${formatPrice(option.choice.price)})`}
                </div>
              ))}
            </div>
          )}
          
          {/* Special instructions */}
          {item.specialInstructions && (
            <div className="mt-1 text-sm text-gray-500">
              <span className="font-medium">Instructions:</span> {item.specialInstructions}
            </div>
          )}
          
          {/* Quantity controls */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              
              <span className="w-6 text-center">{quantity}</span>
              
              <button 
                onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={() => onRemove(item.id)}
              className="p-1 text-gray-400 hover:text-error-500 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;