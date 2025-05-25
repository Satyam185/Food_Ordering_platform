import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import RestaurantFilters from '../components/RestaurantFilters';
import { mockRestaurants } from '../data/mockData';
import { FilterOptions, Restaurant } from '../types';

const Restaurants: React.FC = () => {
  const location = useLocation();
  const initialSearchQuery = location.state?.searchQuery || '';
  const initialSelectedCuisine = location.state?.selectedCuisine || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [filters, setFilters] = useState<FilterOptions>({
    cuisine: initialSelectedCuisine ? [initialSelectedCuisine] : [],
    priceRange: [],
    sortBy: 'Recommended',
    dietaryPreferences: [],
    minRating: 0,
  });
  
  // Apply filters and search
  useEffect(() => {
    let results = [...mockRestaurants];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.cuisine.some((c) => c.toLowerCase().includes(query))
      );
    }
    
    // Filter by cuisine
    if (filters.cuisine.length > 0) {
      results = results.filter((restaurant) =>
        restaurant.cuisine.some((c) => filters.cuisine.includes(c))
      );
    }
    
    // Filter by minimum rating
    if (filters.minRating > 0) {
      results = results.filter((restaurant) => restaurant.rating >= filters.minRating);
    }
    
    // Sort restaurants
    switch (filters.sortBy) {
      case 'Rating: High to Low':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'Delivery Time':
        results.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split('-')[0]);
          const bTime = parseInt(b.deliveryTime.split('-')[0]);
          return aTime - bTime;
        });
        break;
      case 'Delivery Fee: Low to High':
        results.sort((a, b) => a.deliveryFee - b.deliveryFee);
        break;
      case 'Min. Order: Low to High':
        results.sort((a, b) => a.minOrder - b.minOrder);
        break;
      // For 'Recommended', we'll use a combination of rating and delivery time
      default:
        results.sort((a, b) => {
          // Higher rating is better, lower delivery time is better
          const aScore = a.rating - a.distance / 10;
          const bScore = b.rating - b.distance / 10;
          return bScore - aScore;
        });
    }
    
    setFilteredRestaurants(results);
  }, [searchQuery, filters]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Restaurants</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search for restaurants or cuisines..."
            className="input pr-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute right-3 top-3 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className="md:w-1/4">
          <RestaurantFilters filters={filters} onFilterChange={setFilters} />
        </div>
        
        {/* Restaurant List */}
        <div className="md:w-3/4">
          {filteredRestaurants.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-4">
                {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No restaurants found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      cuisine: [],
                      priceRange: [],
                      sortBy: 'Recommended',
                      dietaryPreferences: [],
                      minRating: 0,
                    });
                  }}
                  className="btn btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;