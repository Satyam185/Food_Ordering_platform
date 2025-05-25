import { Clock, MapPin, Phone, Star, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddToCartModal from '../components/AddToCartModal';
import MenuItemCard from '../components/MenuItemCard';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { mockMenuItems, mockRestaurants, mockReviews } from '../data/mockData';
import { formatPrice } from '../lib/utils';
import { MenuItem, Restaurant } from '../types';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, restaurantId } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  
  // Get restaurant data
  useEffect(() => {
    if (id) {
      const foundRestaurant = mockRestaurants.find((r) => r.id === id);
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        
        // Get menu items for this restaurant
        const items = mockMenuItems[id] || [];
        setMenuItems(items);
        
        // Set active category to the first one
        if (items.length > 0) {
          const categories = [...new Set(items.map((item) => item.category))];
          setActiveCategory(categories[0]);
        }
      }
    }
  }, [id]);
  
  // Get reviews for this restaurant
  const restaurantReviews = useMemo(() => {
    if (!id) return [];
    return mockReviews.filter((review) => review.restaurantId === id);
  }, [id]);
  
  // Calculate average rating
  const averageRating = useMemo(() => {
    if (restaurantReviews.length === 0) return 0;
    const totalRating = restaurantReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / restaurantReviews.length;
  }, [restaurantReviews]);
  
  // Group menu items by category
  const menuByCategory = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    
    menuItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    
    return grouped;
  }, [menuItems]);
  
  // Get unique categories
  const categories = useMemo(() => {
    return Object.keys(menuByCategory);
  }, [menuByCategory]);
  
  const handleAddToCart = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
  };
  
  const handleAddToCartConfirm = (
    menuItem: MenuItem,
    quantity: number,
    selectedOptions: any[],
    specialInstructions?: string
  ) => {
    if (restaurant) {
      addToCart(
        restaurant.id,
        restaurant.name,
        menuItem,
        quantity,
        selectedOptions,
        specialInstructions
      );
    }
    setSelectedMenuItem(null);
  };
  
  if (!restaurant) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 bg-gray-900">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <div className="flex items-center">
                <Star className="text-yellow-400 fill-current" size={18} />
                <span className="ml-1 font-semibold">{restaurant.rating}</span>
                <span className="ml-1 text-gray-300">
                  ({restaurantReviews.length} reviews)
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              
              <div className="flex items-center">
                <Truck size={16} className="mr-1" />
                <span>{formatPrice(restaurant.deliveryFee)} delivery</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {restaurant.cuisine.map((type, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-800 bg-opacity-70 px-2 py-1 rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">{restaurant.address}</span>
              <span className="mx-2">•</span>
              <Phone size={16} className="mr-1" />
              <span className="text-sm">555-123-4567</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Warning about switching restaurants */}
      {restaurantId && restaurantId !== restaurant.id && (
        <div className="container mx-auto px-4 py-3 mt-4">
          <div className="bg-warning-100 border border-warning-300 text-warning-800 px-4 py-3 rounded-md">
            <p>
              Your cart contains items from another restaurant. Adding items from this restaurant will clear your current cart.
            </p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Navigation */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-lg mb-4">Menu</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeCategory === category
                        ? 'bg-primary-100 text-primary-800 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                    <span className="text-gray-500 text-sm ml-2">
                      ({menuByCategory[category].length})
                    </span>
                  </button>
                ))}
              </nav>
              
              {/* Restaurant Info */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-lg mb-3">Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Minimum Order</p>
                    <p className="text-gray-600">{formatPrice(restaurant.minOrder)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Working Hours</p>
                    <p className="text-gray-600">Mon-Sun: 10:00 AM - 10:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">{restaurant.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="lg:w-3/4">
            {categories.map((category) => (
              <div 
                key={category} 
                id={category}
                className={`mb-10 ${activeCategory === category ? 'scroll-mt-24' : ''}`}
              >
                <h2 className="text-2xl font-bold mb-4">{category}</h2>
                <div className="space-y-4">
                  {menuByCategory[category].map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {/* Reviews Section */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <div className="flex items-center">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="ml-1 font-semibold text-lg">{averageRating.toFixed(1)}</span>
                  <span className="ml-1 text-gray-500">
                    ({restaurantReviews.length} reviews)
                  </span>
                </div>
              </div>
              
              {restaurantReviews.length > 0 ? (
                <div className="space-y-6">
                  {restaurantReviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{review.userName}</div>
                        <div className="text-gray-500 text-sm">{review.date}</div>
                      </div>
                      <div className="flex items-center mb-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={16}
                            className={index < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No reviews yet.</p>
                  <button 
                    className="mt-3 btn btn-outline"
                    onClick={() => {
                      if (!isAuthenticated) {
                        // Redirect to login if not authenticated
                        alert('Please login to write a review');
                      }
                    }}
                  >
                    Be the first to write a review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add to Cart Modal */}
      {selectedMenuItem && (
        <AddToCartModal
          item={selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
          onAddToCart={handleAddToCartConfirm}
        />
      )}
    </div>
  );
};

export default RestaurantDetail;