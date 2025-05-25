import { Leaf, Plus } from 'lucide-react';
import { useState } from 'react';
import { MenuItem } from '../types';
import { formatPrice } from '../lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="card flex flex-col md:flex-row gap-4 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="md:w-1/4 h-32 md:h-auto relative rounded-lg overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className={`w-full h-full object-cover ${isHovered ? 'scale-105' : 'scale-100'} transition-transform duration-500`}
        />
        {(item.vegetarian || item.vegan || item.glutenFree) && (
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-full p-1">
            <Leaf size={16} className="text-green-600" />
          </div>
        )}
        {item.popular && (
          <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
            Popular
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold">{item.name}</h4>
          <span className="font-medium text-gray-900">{formatPrice(item.price)}</span>
        </div>
        
        <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-2">{item.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {item.vegetarian && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              Vegetarian
            </span>
          )}
          {item.vegan && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              Vegan
            </span>
          )}
          {item.glutenFree && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
              Gluten-Free
            </span>
          )}
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
            {item.category}
          </span>
        </div>
        
        {/* Add button */}
        <div className="mt-3 md:mt-auto flex justify-end">
          <button 
            className="btn btn-primary py-1"
            onClick={() => onAddToCart(item)}
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={16} />
            <span className="ml-1">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;