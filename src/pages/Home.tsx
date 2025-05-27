import { ArrowRight, Search, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { availableCuisines, mockRestaurants } from '../data/mockData';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Get top-rated restaurants (top 4)
  const topRestaurants = [...mockRestaurants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/restaurants', { state: { searchQuery } });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Food background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container mx-auto relative z-10 py-20 px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Order Delicious Food Right To Your Door
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              Choose from thousands of restaurants and get your favorite meals delivered fast.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex w-full max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Find food or restaurants..."
                  className="pl-10 pr-4 py-3 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-r-lg font-medium transition-colors"
              >
                Search
              </button>
            </form>
            
          </div>
        </div>
      </section>

      {/* Top Restaurants Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Top-Rated Restaurants</h2>
            <Link
              to="/restaurants"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Food</h3>
              <p className="text-gray-600">
                Browse restaurants and menus to find exactly what you're craving.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
              <p className="text-gray-600">
                Select your items, customize as needed, and checkout securely.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wait For Delivery</h3>
              <p className="text-gray-600">
                Track your order in real-time as it makes its way to your door.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/restaurants" className="btn btn-primary px-8 py-3">
              Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* App Promotion */}
      <section className="bg-primary-600 text-white py-16 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Get The Foodipie App</h2>
            <p className="text-lg mb-6 text-primary-100">
              Order faster, track easier, and unlock exclusive app-only deals.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="block w-36">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png" 
                  alt="Download on the App Store" 
                  className="w-full"
                />
              </a>
              <a href="#" className="block w-36">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1024px-Google_Play_Store_badge_EN.svg.png" 
                  alt="Get it on Google Play" 
                  className="w-full"
                />
              </a>
            </div>
          </div>
          <div className="md:w-5/12">
            <img 
              src="https://images.pexels.com/photos/6205791/pexels-photo-6205791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Mobile app preview" 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
