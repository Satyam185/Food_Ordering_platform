import { ChevronDown, X } from 'lucide-react';
import { Star as StarIcon } from 'lucide-react';

import { useState } from 'react';
import { availableCuisines, dietaryOptions, priceRanges, sortOptions } from '../data/mockData';
import { FilterOptions } from '../types';

interface RestaurantFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
}

const RestaurantFilters: React.FC<RestaurantFiltersProps> = ({ filters, onFilterChange }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleCuisineChange = (cuisine: string) => {
    const updatedCuisines = filters.cuisine.includes(cuisine)
      ? filters.cuisine.filter((c) => c !== cuisine)
      : [...filters.cuisine, cuisine];
    
    onFilterChange({ ...filters, cuisine: updatedCuisines });
  };

  const handlePriceChange = (price: string) => {
    const updatedPrices = filters.priceRange.includes(price)
      ? filters.priceRange.filter((p) => p !== price)
      : [...filters.priceRange, price];
    
    onFilterChange({ ...filters, priceRange: updatedPrices });
  };

  const handleDietaryChange = (option: string) => {
    const updatedDietary = filters.dietaryPreferences.includes(option)
      ? filters.dietaryPreferences.filter((o) => o !== option)
      : [...filters.dietaryPreferences, option];
    
    onFilterChange({ ...filters, dietaryPreferences: updatedDietary });
  };

  const handleSortChange = (sortBy: string) => {
    onFilterChange({ ...filters, sortBy });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const resetFilters = () => {
    onFilterChange({
      cuisine: [],
      priceRange: [],
      sortBy: 'Recommended',
      dietaryPreferences: [],
      minRating: 0,
    });
  };

  // Count active filters
  const activeFilterCount = 
    filters.cuisine.length + 
    filters.priceRange.length + 
    filters.dietaryPreferences.length + 
    (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="mb-6">
      {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <button 
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center btn btn-outline w-full justify-center"
        >
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-primary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown size={18} className="ml-2" />
        </button>
      </div>

      {/* Desktop filters */}
      <div className="hidden md:block border rounded-lg bg-white shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button 
            className="text-sm text-primary-600 hover:text-primary-800" 
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        {/* Sort By */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Sort By</h4>
          <select 
            value={filters.sortBy} 
            onChange={(e) => handleSortChange(e.target.value)}
            className="input py-1"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Rating</h4>
          <div className="space-y-2">
            {[0, 3, 4, 4.5].map((rating) => (
              <label key={rating} className="flex items-center">
                <input 
                  type="radio" 
                  checked={filters.minRating === rating} 
                  onChange={() => handleRatingChange(rating)}
                  className="mr-2"
                />
                {rating === 0 ? (
                  <span>Any rating</span>
                ) : (
                  <div className="flex items-center">
                    <span className="text-yellow-500">{rating}+</span>
                    <Star rating={rating} />
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Price Range</h4>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((price) => (
              <button
                key={price}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.priceRange.includes(price)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handlePriceChange(price)}
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine Type */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Cuisine</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableCuisines.map((cuisine) => (
              <label key={cuisine} className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={filters.cuisine.includes(cuisine)} 
                  onChange={() => handleCuisineChange(cuisine)}
                  className="mr-2"
                />
                {cuisine}
              </label>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div>
          <h4 className="font-medium mb-2">Dietary Preferences</h4>
          <div className="space-y-2">
            {dietaryOptions.map((option) => (
              <label key={option} className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={filters.dietaryPreferences.includes(option)} 
                  onChange={() => handleDietaryChange(option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile filters modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center md:hidden">
          <div className="bg-white rounded-t-xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filters</h3>
              <div className="flex space-x-4 items-center">
                <button 
                  className="text-sm text-primary-600" 
                  onClick={resetFilters}
                >
                  Reset all
                </button>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Sort By */}
              <div>
                <h4 className="font-medium mb-2">Sort By</h4>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="input py-1 w-full"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="font-medium mb-2">Rating</h4>
                <div className="space-y-3">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input 
                        type="radio" 
                        checked={filters.minRating === rating} 
                        onChange={() => handleRatingChange(rating)}
                        className="mr-2"
                      />
                      {rating === 0 ? (
                        <span>Any rating</span>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-yellow-500">{rating}+</span>
                          <Star rating={rating} />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((price) => (
                    <button
                      key={price}
                      className={`px-4 py-2 rounded-full text-sm ${
                        filters.priceRange.includes(price)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      onClick={() => handlePriceChange(price)}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine Type */}
              <div>
                <h4 className="font-medium mb-2">Cuisine</h4>
                <div className="space-y-3">
                  {availableCuisines.map((cuisine) => (
                    <label key={cuisine} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={filters.cuisine.includes(cuisine)} 
                        onChange={() => handleCuisineChange(cuisine)}
                        className="mr-3 h-5 w-5"
                      />
                      {cuisine}
                    </label>
                  ))}
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <h4 className="font-medium mb-2">Dietary Preferences</h4>
                <div className="space-y-3">
                  {dietaryOptions.map((option) => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={filters.dietaryPreferences.includes(option)} 
                        onChange={() => handleDietaryChange(option)}
                        className="mr-3 h-5 w-5"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-4 bg-white border-t">
              <button 
                className="btn btn-primary w-full" 
                onClick={() => setShowMobileFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Star: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex ml-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon key={`full-${i}`} size={16} fill="#FFC107" color="#FFC107" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <StarIcon size={16} color="#FFC107" fill="none" />
          <div className="absolute top-0 left-0 w-[50%] overflow-hidden">
            <StarIcon size={16} color="#FFC107" fill="#FFC107" />
          </div>
        </div>
      )}
    </div>
  );
};


export default RestaurantFilters;