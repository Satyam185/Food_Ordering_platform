export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  address: string;
  distance: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  options?: MenuItemOption[];
  popular?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
}

export interface MenuItemOption {
  name: string;
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
  required: boolean;
  multiple: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: {
    name: string;
    choice: {
      id: string;
      name: string;
      price: number;
    };
  }[];
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  estimatedDeliveryTime: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  restaurantId: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface FilterOptions {
  cuisine: string[];
  priceRange: string[];
  sortBy: string;
  dietaryPreferences: string[];
  minRating: number;
}