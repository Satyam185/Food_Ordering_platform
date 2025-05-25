import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../data/mockData';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  autoLogin: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  autoLogin: () => {},
  updateProfile: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const isAuthenticated = useMemo(() => !!user, [user]);

  const login = useCallback(
    async (email: string, password: string) => {
      // In a real app, this would be a real API call
      try {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // For demo, we're using mock data
        const foundUser = mockUsers.find((u) => u.email === email);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      // In a real app, this would be a real API call
      try {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Check if user already exists
        const existingUser = mockUsers.find((u) => u.email === email);
        if (existingUser) {
          return false;
        }

        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
        };

        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      } catch (error) {
        console.error('Registration error:', error);
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  }, [navigate]);

  const autoLogin = useCallback(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const updateProfile = useCallback(
    async (userData: Partial<User>) => {
      if (!user) return false;

      try {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      } catch (error) {
        console.error('Update profile error:', error);
        return false;
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      register,
      logout,
      autoLogin,
      updateProfile,
    }),
    [user, isAuthenticated, login, register, logout, autoLogin, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};