

import { CheckCircle, ChevronRight, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

enum OrderStatus {
  Confirmed = 'confirmed',
  Preparing = 'preparing',
  OutForDelivery = 'out-for-delivery',
  Delivered = 'delivered',
}

interface OrderDetails {
  name: string;
  phone: string;
  address: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
  }[];
  tipAmount: number;
  totalAmount: number;
}

const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const order: OrderDetails = location.state;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(OrderStatus.Confirmed);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');


  useEffect(() => {
    if (!id || !order) {
      navigate('/');
      return;
    }

    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 40 * 60000);
    setEstimatedDelivery(deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const statusTimeline = [
      { status: OrderStatus.Confirmed, delay: 0 },
      { status: OrderStatus.Preparing, delay: 5000 },
      { status: OrderStatus.OutForDelivery, delay: 10000 },
      { status: OrderStatus.Delivered, delay: 15000 },
    ];

    const statusUpdates = statusTimeline.map(({ status, delay }) =>
      setTimeout(() => setCurrentStatus(status), delay)
    );

    return () => {
      statusUpdates.forEach(clearTimeout);
    };
  }, [id, navigate, order]);




  if (!id || !order) return null;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 text-success-600 mb-4">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Your order #{id} has been placed and will be on its way shortly.</p>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Order Status</h2>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="h-1 w-full bg-gray-200 rounded"></div>
            </div>
            <ol className="relative flex justify-between items-center">
              {Object.values(OrderStatus).map((status, index) => {
                const isActive = Object.values(OrderStatus).indexOf(currentStatus) >= index;
                const isCurrent = currentStatus === status;

                return (
                  <li key={status} className="relative flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-primary-500' : 'bg-gray-300'
                      } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}>
                      {isActive && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`absolute top-8 text-sm font-medium ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                      {status.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="text-center mb-6 pt-10">
            {currentStatus === OrderStatus.Confirmed && <p className="text-lg">Your order has been confirmed and is being processed.</p>}
            {currentStatus === OrderStatus.Preparing && <p className="text-lg">The restaurant is preparing your food.</p>}
            {currentStatus === OrderStatus.OutForDelivery && <p className="text-lg">Your food is on the way! ETA {estimatedDelivery}</p>}
            {currentStatus === OrderStatus.Delivered && <p className="text-lg">Delivered. Enjoy your meal!</p>}
          </div>
          {currentStatus !== OrderStatus.Delivered && (
            <div className="text-center bg-gray-50 py-4 rounded-lg">
              <p className="text-gray-600">Estimated delivery by <span className="font-bold text-gray-800">{estimatedDelivery}</span></p>
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin size={20} className="mr-3 text-primary-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Delivery Address</h3>
                <p className="text-gray-600">{order.address}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone size={20} className="mr-3 text-primary-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Contact Number</h3>
                <p className="text-gray-600">{order.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            
           
          

            <div className="border-t pt-4 space-y-2 mt-4 text-gray-600">
              <div className="flex justify-between"><span>Tip</span><span>₹{order.tipAmount.toFixed(2)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>₹{order.totalAmount.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary py-2.5 px-6">Return to Home</Link>
          <Link to="/restaurants" className="btn btn-outline py-2.5 px-6">Order More Food</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
