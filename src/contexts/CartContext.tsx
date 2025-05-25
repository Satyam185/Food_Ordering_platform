import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, MenuItem } from '../types';

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addToCart: (
    restaurantId: string,
    restaurantName: string,
    menuItem: MenuItem,
    quantity: number,
    selectedOptions: CartItem['selectedOptions'],
    specialInstructions?: string
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  restaurantId: null,
  restaurantName: null,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getSubtotal: () => 0,
  getTax: () => 0,
  getDeliveryFee: () => 0,
  getTotal: () => 0,
  itemCount: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurantId = localStorage.getItem('restaurantId');
    const savedRestaurantName = localStorage.getItem('restaurantName');

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }

    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }

    if (savedRestaurantName) {
      setRestaurantName(savedRestaurantName);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    if (restaurantId) {
      localStorage.setItem('restaurantId', restaurantId);
    }
    if (restaurantName) {
      localStorage.setItem('restaurantName', restaurantName);
    }
  }, [items, restaurantId, restaurantName]);

  const addToCart = useCallback(
    (
      newRestaurantId: string,
      newRestaurantName: string,
      menuItem: MenuItem,
      quantity: number,
      selectedOptions: CartItem['selectedOptions'],
      specialInstructions?: string
    ) => {
      // Check if trying to add items from a different restaurant
      if (restaurantId && restaurantId !== newRestaurantId) {
        if (!window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
          return;
        }
        setItems([]);
      }

      // Set the restaurant ID and name
      setRestaurantId(newRestaurantId);
      setRestaurantName(newRestaurantName);

      // Create a new cart item
      const newItem: CartItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItem,
        quantity,
        selectedOptions,
        specialInstructions,
      };

      setItems((prevItems) => [...prevItems, newItem]);
    },
    [restaurantId]
  );

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('restaurantId');
    localStorage.removeItem('restaurantName');
  }, []);

  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => {
      // Base price for the menu item
      let itemTotal = item.menuItem.price * item.quantity;

      // Add any additional costs from options
      item.selectedOptions.forEach((option) => {
        itemTotal += option.choice.price * item.quantity;
      });

      return total + itemTotal;
    }, 0);
  }, [items]);

  const getTax = useCallback(() => {
    // Calculate tax at 8.875%
    return getSubtotal() * 0.08875;
  }, [getSubtotal]);

  const getDeliveryFee = useCallback(() => {
    // For now, we'll return a fixed delivery fee of ₹29
    return items.length > 0 ? 29 : 0;
  }, [items]);

  const getTotal = useCallback(() => {
    return getSubtotal() + getTax() + getDeliveryFee();
  }, [getSubtotal, getTax, getDeliveryFee]);

  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      restaurantId,
      restaurantName,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getSubtotal,
      getTax,
      getDeliveryFee,
      getTotal,
      itemCount,
    }),
    [
      items,
      restaurantId,
      restaurantName,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getSubtotal,
      getTax,
      getDeliveryFee,
      getTotal,
      itemCount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};