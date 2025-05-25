import { Clock, Star, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Restaurant } from '../types';
import { formatPrice } from '../lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link 
      to={`/restaurants/${restaurant.id}`}
      className="card group transition-all hover:scale-[1.02] h-full flex flex-col"
    >
      {/* Restaurant Image */}
      <div className="h-40 rounded-t-lg overflow-hidden">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Restaurant Info */}
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{restaurant.name}</h3>
          <div className="flex items-center text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.cuisine.map((type, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
            >
              {type}
            </span>
          ))}
        </div>
        
        <div className="mt-auto text-sm flex flex-col space-y-1 text-gray-600">
          <div className="flex items-center">
            <Clock size={14} className="mr-1 text-primary-500" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center">
            <Truck size={14} className="mr-1 text-primary-500" />
            <span>
              {formatPrice(restaurant.deliveryFee)} delivery · {restaurant.distance.toFixed(1)} mi
            </span>
          </div>
          <div>
            <span className="text-xs">Min. order: {formatPrice(restaurant.minOrder)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;