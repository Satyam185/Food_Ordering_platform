import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

interface ProfileFormInputs {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });
  
  const onSubmit = async (data: ProfileFormInputs) => {
    if (!user) return;
    
    setIsLoading(true);
    setUpdateSuccess(false);
    
    try {
      const success = await updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });
      
      if (success) {
        setUpdateSuccess(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        {/* Profile Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          {updateSuccess && (
            <div className="mb-6 p-4 bg-success-100 text-success-800 rounded-md">
              Your profile has been updated successfully!
            </div>
          )}
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <button
              className="text-primary-600 hover:text-primary-800 font-medium"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="input w-full bg-gray-100"
                  {...register('email')}
                  readOnly
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`input w-full ${errors.phone ? 'border-error-500' : ''}`}
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Delivery Address
                </label>
                <textarea
                  id="address"
                  className={`input w-full ${errors.address ? 'border-error-500' : ''}`}
                  rows={3}
                  {...register('address')}
                ></textarea>
                {errors.address && (
                  <p className="mt-1 text-sm text-error-600">{errors.address.message}</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Full Name</h3>
                <p className="font-medium">{user?.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Email Address</h3>
                <p className="font-medium">{user?.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Phone Number</h3>
                <p className="font-medium">{user?.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Default Delivery Address</h3>
                <p className="font-medium">{user?.address || 'Not provided'}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Account Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-gray-500">
                  Update your password for better account security
                </p>
              </div>
              <button className="btn btn-outline">Change</button>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">
                  Receive updates about your orders and promotions
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-error-600">Delete Account</h3>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and all data
                </p>
              </div>
              <button className="text-error-600 hover:text-error-800 font-medium">Delete</button>
            </div>
          </div>
        </div>
        
        {/* Payment Methods Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Payment Methods</h2>
            <button className="text-primary-600 hover:text-primary-800 font-medium">Add New</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-3">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                    alt="Visa" 
                    className="h-6 w-10 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium">Visa ending in 1234</p>
                  <p className="text-sm text-gray-500">Expires 12/2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-primary-100 text-primary-800 py-0.5 px-2 rounded-full">
                  Default
                </span>
                <button className="text-gray-500 hover:text-gray-700">Edit</button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-3">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.svg" 
                    alt="PayPal" 
                    className="h-6 w-10 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-sm text-gray-500">Connected to your account</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 hover:text-gray-700">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;