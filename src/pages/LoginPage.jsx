import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestLogin } from '@questlabs/react-sdk';
import { useAuth } from '../contexts/AuthContext';
import questConfig from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClipboard } = FiIcons;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = ({ userId, token, newUser }) => {
    const isNewUser = login({ userId, token, newUser });
    
    if (isNewUser) {
      navigate('/onboarding');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <SafeIcon icon={FiClipboard} className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to SurveyCraft</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Create powerful surveys, collect valuable insights, and make data-driven decisions with our intuitive platform.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Easy Builder</h3>
              <p className="text-sm text-blue-100">Drag & drop survey creation</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-sm text-blue-100">Instant response insights</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-300 bg-opacity-20 rounded-full blur-lg"></div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiClipboard} className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SurveyCraft</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue to your dashboard</p>
            </div>

            <div className="quest-login-container">
              <QuestLogin
                onSubmit={handleLogin}
                email={true}
                google={false}
                accent={questConfig.PRIMARY_COLOR}
              />
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;