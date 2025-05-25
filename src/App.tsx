import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './contexts/AuthContext';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import Register from './pages/Register';
import RestaurantDetail from './pages/RestaurantDetail';
import Restaurants from './pages/Restaurants';

function App() {
  const { autoLogin } = useAuth();

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="restaurants/:id" element={<RestaurantDetail />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="profile" element={<Profile />} />
        <Route path="order-history" element={<OrderHistory />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;