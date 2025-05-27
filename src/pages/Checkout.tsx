import { ArrowLeft, CreditCard, MapPin, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { generateOrderId } from '../lib/utils';

interface CheckoutFormInputs {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'credit' | 'paypal' | 'cash';
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
  tip: string;
  specialInstructions?: string;
  
}


const Checkout: React.FC = () => {
  
  const { items, restaurantId, restaurantName, updateQuantity, removeFromCart, getSubtotal, getTax, getDeliveryFee, getTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customTip, setCustomTip] = useState('');
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormInputs>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      paymentMethod: 'cash',
      tip: '15',
    },
  });
  
  const paymentMethod = watch('paymentMethod');
  const tipAmount = watch('tip');
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);
  
  // Set user info in form when authenticated
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      if (user.phone) setValue('phone', user.phone);
      if (user.address) setValue('address', user.address);
    }
  }, [user, setValue]);
  
  // Calculate tip amount
  const calculateTip = () => {
    const subtotal = getSubtotal();
    
    if (tipAmount === 'custom') {
      return parseFloat(customTip) || 0;
    }
    
    return subtotal * (parseFloat(tipAmount) / 100);
  };
  
  // Calculate order total with tip
  const getOrderTotal = () => {
    return getTotal() + calculateTip();
  };
  
  // const onSubmit = async (data: CheckoutFormInputs) => {
  //   if (!isAuthenticated) {
  //     navigate('/login');
  //     return;
  //   }
    
  //   if (items.length === 0) {
  //     navigate('/restaurants');
  //     return;
  //   }
    
  //   setIsSubmitting(true);
    
  //   try {
  //     // In a real app, this would send data to a server
  //     await new Promise((resolve) => setTimeout(resolve, 1500));
      
  //     // Generate order ID and redirect to confirmation
  //     const orderId = generateOrderId();
  //     clearCart();
  //     navigate(`/order-confirmation/${orderId}`);
  //   } catch (error) {
  //     console.error('Checkout error:', error);
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = async (data: CheckoutFormInputs) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  
    if (items.length === 0) {
      navigate('/restaurants');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
  
      const orderId = generateOrderId();
  
      const orderDetails = {
        ...data,
        items,
        tipAmount: calculateTip(),
        totalAmount: getOrderTotal(),
      };
  
      clearCart();
      navigate(`/order-confirmation/${orderId}`, { state: orderDetails }); // pass order data here
    } catch (error) {
      console.error('Checkout error:', error);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Add some delicious items from our restaurants to get started.
          </p>
          <Link to="/restaurants" className="btn btn-primary">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Link to={`/restaurants/${restaurantId}`} className="inline-flex items-center text-primary-600 mb-6">
        <ArrowLeft size={18} className="mr-2" />
        Back to {restaurantName}
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Order Summary */}
        <div className="lg:w-2/5">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Restaurant info */}
            <div className="flex items-start gap-3 pb-4 border-b">
              <div className="w-16 h-16 rounded-md bg-gray-100 flex-shrink-0">
                {/* Restaurant logo would go here */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8.5H3" />
                    <path d="M21 15.5H3" />
                    <path d="M21 12H3" />
                    <path d="M17 18.5H3" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-medium">{restaurantName}</h3>
                <p className="text-sm text-gray-500">
                  Estimated delivery: 30-45 minutes
                </p>
              </div>
            </div>
            
            {/* Cart Items */}
            <div className="mt-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
            
            {/* Add more items */}
            <div className="mt-4 text-center">
              <Link
                to={`/restaurants/${restaurantId}`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Add more items
              </Link>
            </div>
          </div>
          
          {/* Order total */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Order Total</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹{getDeliveryFee().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tip</span>
                <span>₹{calculateTip().toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{getOrderTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Checkout Form */}
        <div className="lg:w-3/5">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border p-6">
            {/* Delivery Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin size={20} className="mr-2 text-primary-500" />
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name" 
                    type="text"
                    className={`input w-full ${errors.name ? 'border-error-500' : ''}`}
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={`input w-full ${errors.phone ? 'border-error-500' : ''}`}
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    className={`input w-full ${errors.address ? 'border-error-500' : ''}`}
                    {...register('address', { required: 'Address is required' })}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-error-600">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Instructions (optional)
                  </label>
                  <textarea
                    id="specialInstructions"
                    className="input w-full"
                    rows={2}
                    placeholder="E.g., Ring doorbell, leave at door, etc."
                    {...register('specialInstructions')}
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard size={20} className="mr-2 text-primary-500" />
                Payment Method
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <label className={`flex items-center border rounded-lg p-3 cursor-pointer transition-colors ${
                    paymentMethod === 'credit' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="credit"
                      className="mr-2"
                      {...register('paymentMethod')}
                    />
                    <div className="flex items-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                        alt="Visa"
                        className="h-6 mr-1"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        alt="Mastercard"
                        className="h-6"
                      />
                      <span className="ml-2">Credit/Debit Card</span>
                    </div>
                  </label>
                  
                  <label className={`flex items-center border rounded-lg p-3 cursor-pointer transition-colors ${
                    paymentMethod === 'paypal' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="paypal"
                      className="mr-2"
                      {...register('paymentMethod')}
                    />
                    <div className="flex items-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.svg"
                        alt="PayPal"
                        className="h-6"
                      />
                      <span className="ml-2">PayPal</span>
                    </div>
                  </label>
                  
                  <label className={`flex items-center border rounded-lg p-3 cursor-pointer transition-colors ${
                    paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="cash"
                      className="mr-2"
                      {...register('paymentMethod')}
                    />
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <span>Cash on Delivery</span>
                  </label>
                </div>
                
                {/* Credit Card Details */}
                {paymentMethod === 'credit' && (
                  <div className="mt-4 space-y-4 animate-fade-in">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        className={`input w-full ${errors.cardNumber ? 'border-error-500' : ''}`}
                        placeholder="•••• •••• •••• ••••"
                        {...register('cardNumber', {
                          required: 'Card number is required',
                        })}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-error-600">{errors.cardNumber.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration Date
                        </label>
                        <input
                          id="cardExpiry"
                          type="text"
                          className={`input w-full ${errors.cardExpiry ? 'border-error-500' : ''}`}
                          placeholder="MM/YY"
                          {...register('cardExpiry', {
                            required: 'Expiration date is required',
                          })}
                        />
                        {errors.cardExpiry && (
                          <p className="mt-1 text-sm text-error-600">{errors.cardExpiry.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          id="cardCVC"
                          type="text"
                          className={`input w-full ${errors.cardCVC ? 'border-error-500' : ''}`}
                          placeholder="•••"
                          {...register('cardCVC', {
                            required: 'CVC is required',
                          })}
                        />
                        {errors.cardCVC && (
                          <p className="mt-1 text-sm text-error-600">{errors.cardCVC.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tip */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Add a Tip</h2>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {['0', '10', '15', '20', 'custom'].map((tipValue) => (
                    <label
                      key={tipValue}
                      className={`border rounded-lg px-4 py-2 cursor-pointer transition-colors ${
                        tipAmount === tipValue ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={tipValue}
                        className="hidden"
                        {...register('tip')}
                      />
                      {tipValue === 'custom' ? (
                        <span>Custom</span>
                      ) : (
                        <span>{tipValue}%</span>
                      )}
                    </label>
                  ))}
                </div>
                
                {tipAmount === 'custom' && (
                  <div className="flex items-center animate-fade-in">
                    <span className="text-gray-500 mr-2">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="input w-32"
                      placeholder="Enter amount"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Place Order Button */}
            <button
              type="submit"
              className="btn btn-primary w-full py-3 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Place Order • ₹${getOrderTotal().toFixed(2)}`}
            </button>
            
            <div className="mt-4 text-center text-gray-500 text-sm">
              By placing your order, you agree to our {' '}
              <a href="#" className="text-primary-600 hover:text-primary-800">
                Terms of Service
              </a>
              {' '} and {' '}
              <a href="#" className="text-primary-600 hover:text-primary-800">
                Privacy Policy
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


