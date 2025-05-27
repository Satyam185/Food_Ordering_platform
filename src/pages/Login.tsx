import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  
  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        navigate('/');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Background Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{ 
        backgroundImage: "url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
      }}>
        <div className="h-full w-full bg-black bg-opacity-40 flex items-center justify-center p-12">
          <div className="text-white max-w-md">
            <h1 className="text-4xl font-bold mb-6">Welcome back to FoodHub</h1>
            <p className="text-xl">
              Access your account to order from your favorite restaurants and track your deliveries.
            </p>
          </div>
        </div>
      </div>
      
      {/* Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12">
        <div className="sm:max-w-md sm:mx-auto w-full">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-gray-600">
              Sign in to continue to FoodHub
            </p>
          </div>
          
          {loginError && (
            <div className="mb-4 p-3 bg-error-100 border border-error-300 text-error-800 rounded-md">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email address"
                className={`input w-full ${errors.email ? 'border-error-500' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>
            
            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-800">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Your password"
                className={`input w-full ${errors.password ? 'border-error-500' : ''}`}
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full py-2.5"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Don't have an account? {' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
          
          {/* Demo Account Notice */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              <span className="font-semibold">Demo Account:</span> Use email 'john@example.com' with any password to login
            </p>
          </div>
             
        </div>
      </div>
    </div>
  );
};

export default Login;
