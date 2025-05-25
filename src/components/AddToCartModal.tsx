import { Minus, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartItem, MenuItem } from '../types';
import { formatPrice } from '../lib/utils';

interface AddToCartModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (
    menuItem: MenuItem,
    quantity: number,
    selectedOptions: CartItem['selectedOptions'],
    specialInstructions?: string
  ) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CartItem['selectedOptions']>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [totalPrice, setTotalPrice] = useState(item.price);

  // Calculate total price
  useEffect(() => {
    let basePrice = item.price;
    
    // Add price from selected options
    selectedOptions.forEach((option) => {
      basePrice += option.choice.price;
    });
    
    setTotalPrice(basePrice * quantity);
  }, [item.price, quantity, selectedOptions]);

  const handleOptionChange = (
    optionName: string, 
    choice: { id: string; name: string; price: number },
    multiple: boolean
  ) => {
    setSelectedOptions((prev) => {
      // If multiple selections are not allowed, remove previous selection for this option
      if (!multiple) {
        const filtered = prev.filter((opt) => opt.name !== optionName);
        return [...filtered, { name: optionName, choice }];
      }
      
      // For multiple selections, toggle the selection
      const existingSelection = prev.find(
        (opt) => opt.name === optionName && opt.choice.id === choice.id
      );
      
      if (existingSelection) {
        // Remove if already selected
        return prev.filter(
          (opt) => !(opt.name === optionName && opt.choice.id === choice.id)
        );
      } else {
        // Add new selection
        return [...prev, { name: optionName, choice }];
      }
    });
  };

  const isOptionSelected = (optionName: string, choiceId: string): boolean => {
    return selectedOptions.some(
      (opt) => opt.name === optionName && opt.choice.id === choiceId
    );
  };

  const handleSubmit = () => {
    onAddToCart(item, quantity, selectedOptions, specialInstructions);
    onClose();
  };

  // Check if all required options are selected
  const requiredOptionsMissing = item.options
    ?.filter((option) => option.required)
    .some((option) => !selectedOptions.some((selected) => selected.name === option.name));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        {/* Item image */}
        <div className="h-48 relative">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold">{item.name}</h3>
          <p className="text-gray-600 mt-1">{item.description}</p>
          
          {/* Quantity Selector */}
          <div className="flex items-center justify-between mt-4 bg-gray-100 p-3 rounded-lg">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 rounded-full bg-white text-gray-600 hover:bg-gray-200 transition-colors shadow-sm"
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>
              
              <span className="w-6 text-center font-medium">{quantity}</span>
              
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 rounded-full bg-white text-gray-600 hover:bg-gray-200 transition-colors shadow-sm"
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          
          {/* Options */}
          {item.options && item.options.length > 0 && (
            <div className="mt-6 space-y-6">
              {item.options.map((option) => (
                <div key={option.name}>
                  <div className="flex items-center mb-2">
                    <h4 className="font-semibold">{option.name}</h4>
                    {option.required && (
                      <span className="ml-2 text-xs text-error-600 font-medium">
                        (Required)
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {option.choices.map((choice) => (
                      <label
                        key={choice.id}
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          isOptionSelected(option.name, choice.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } cursor-pointer transition-colors`}
                      >
                        <div className="flex items-center">
                          <input
                            type={option.multiple ? 'checkbox' : 'radio'}
                            checked={isOptionSelected(option.name, choice.id)}
                            onChange={() => handleOptionChange(option.name, choice, option.multiple)}
                            className="mr-3"
                          />
                          <span>{choice.name}</span>
                        </div>
                        {choice.price > 0 && (
                          <span className="text-gray-600">+{formatPrice(choice.price)}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Special Instructions */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Special Instructions</h4>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any specific preferences or allergies..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              rows={3}
            />
          </div>
          
          {/* Add to Cart Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={requiredOptionsMissing}
              className={`btn ${
                requiredOptionsMissing ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'
              } w-full text-center py-3`}
            >
              {requiredOptionsMissing
                ? 'Please select all required options'
                : `Add to Cart - ${formatPrice(totalPrice)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;