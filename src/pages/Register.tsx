import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  
  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true);
    setRegisterError(null);
    
    try {
      const success = await register(data.name, data.email, data.password);
      
      if (success) {
        navigate('/');
      } else {
        setRegisterError('An account with this email already exists.');
      }
    } catch (error) {
      setRegisterError('An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Background Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{ 
        backgroundImage: "url('https://images.pexels.com/photos/1115251/pexels-photo-1115251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
      }}>
        <div className="h-full w-full bg-black bg-opacity-40 flex items-center justify-center p-12">
          <div className="text-white max-w-md">
            <h1 className="text-4xl font-bold mb-6">Join FoodHub Today</h1>
            <p className="text-xl">
              Create an account to order delicious food from thousands of restaurants and get exclusive offers.
            </p>
          </div>
        </div>
      </div>
      
      {/* Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12">
        <div className="sm:max-w-md sm:mx-auto w-full">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-600">
              Sign up to start your food journey
            </p>
          </div>
          
          {registerError && (
            <div className="mb-4 p-3 bg-error-100 border border-error-300 text-error-800 rounded-md">
              {registerError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                className={`input w-full ${errors.name ? 'border-error-500' : ''}`}
                {...registerField('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
              )}
            </div>
            
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
                {...registerField('email', {
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className={`input w-full ${errors.password ? 'border-error-500' : ''}`}
                {...registerField('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className={`input w-full ${errors.confirmPassword ? 'border-error-500' : ''}`}
                {...registerField('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the <a href="#" className="text-primary-600 hover:text-primary-800">Terms of Service</a> and <a href="#" className="text-primary-600 hover:text-primary-800">Privacy Policy</a>
              </label>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full py-2.5"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Already have an account? {' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;