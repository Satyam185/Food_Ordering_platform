import { ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockOrders } from '../data/mockData';
import { formatPrice } from '../lib/utils';

const OrderHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Filter orders
  const filteredOrders = mockOrders.filter((order) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !order.id.toLowerCase().includes(query) &&
        !order.restaurantName.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    
    // Filter by status
    if (selectedFilter !== 'all' && order.status !== selectedFilter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Order History</h1>
      <p className="text-gray-600 mb-8">
        View and track all your past orders
      </p>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by order ID or restaurant..."
            className="input pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="flex overflow-x-auto gap-2 pb-2">
          <button
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedFilter('all')}
          >
            All Orders
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedFilter === 'pending'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedFilter === 'confirmed'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedFilter('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedFilter === 'delivered'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedFilter('delivered')}
          >
            Delivered
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedFilter === 'cancelled'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>
      
      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Order ID: {order.id}</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </div>
                  
                  <StatusBadge status={order.status} />
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="M17 8.5H3" />
                      <path d="M21 15.5H3" />
                      <path d="M21 12H3" />
                      <path d="M17 18.5H3" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{order.restaurantName}</h3>
                    <p className="text-sm text-gray-500">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {item.quantity} × {item.menuItem.name}
                      </span>
                      <span className="text-gray-600">
                        {formatPrice(item.menuItem.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between">
                  <Link
                    to={`/restaurants/${order.restaurantId}`}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
                  >
                    Order Again <ChevronRight size={16} />
                  </Link>
                  
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500">
            {searchQuery || selectedFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : "You haven't placed any orders yet"}
          </p>
          
          <div className="mt-6">
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  let label = '';
  
  switch (status) {
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = 'Pending';
      break;
    case 'confirmed':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      label = 'Confirmed';
      break;
    case 'preparing':
      bgColor = 'bg-indigo-100';
      textColor = 'text-indigo-800';
      label = 'Preparing';
      break;
    case 'out-for-delivery':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      label = 'Out for Delivery';
      break;
    case 'delivered':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Delivered';
      break;
    case 'cancelled':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = 'Cancelled';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = status;
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

export default OrderHistory;