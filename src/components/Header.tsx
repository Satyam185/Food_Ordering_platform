import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when navigating
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="text-primary-600 mr-2">
            <ShoppingBag size={28} />
          </div>
          <span className="text-2xl font-bold text-primary-600">Foodipie</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="font-medium hover:text-primary-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/restaurants"
            className="font-medium hover:text-primary-600 transition-colors"
          >
            Restaurants
          </Link>
         
        </nav>

        {/* Mobile hamburger menu button */}
        <button
          className="md:hidden text-gray-600 hover:text-primary-600"
          onClick={toggleMobileMenu}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Right side icons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/checkout"
            className="relative text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
              >
                <User size={22} />
                <span className="hidden lg:inline">{user?.name.split(' ')[0]}</span>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20 animate-fade-in">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/order-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
   
            <Link
              to="/restaurants"
              className="py-2 text-gray-700 hover:text-primary-600 border-b border-gray-100"
            >
              Restaurants
            </Link>
            <Link
              to="/checkout"
              className="py-2 text-gray-700 hover:text-primary-600 border-b border-gray-100 flex items-center justify-between"
            >
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {itemCount} items
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="py-2 text-gray-700 hover:text-primary-600 border-b border-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/order-history"
                  className="py-2 text-gray-700 hover:text-primary-600 border-b border-gray-100"
                >
                  Order History
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 text-left text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary w-full"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
