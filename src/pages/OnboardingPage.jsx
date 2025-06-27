import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnBoarding } from '@questlabs/react-sdk';
import questConfig from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClipboard, FiArrowRight } = FiIcons;

function OnboardingPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const getAnswers = () => {
    // Navigate to main app after completion
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Onboarding Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8">
              <SafeIcon icon={FiArrowRight} className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-6">Let's Get Started!</h1>
            <p className="text-xl text-white text-opacity-90 leading-relaxed mb-8">
              We're setting up your personalized experience. This will only take a moment.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">1</span>
                </div>
                <span className="text-white text-opacity-90">Tell us about your survey goals</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">2</span>
                </div>
                <span className="text-white text-opacity-90">Customize your preferences</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">3</span>
                </div>
                <span className="text-white text-opacity-90">Start creating amazing surveys</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-yellow-300 bg-opacity-20 rounded-full blur-xl"></div>
      </div>

      {/* Right Section - Onboarding Component */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiClipboard} className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Almost Ready!</h1>
            <p className="text-gray-600">Let's personalize your experience</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="quest-onboarding-container" style={{ width: '400px', margin: '0 auto' }}>
              <OnBoarding
                userId={userId}
                token={token}
                questId={questConfig.QUEST_ONBOARDING_QUESTID}
                answer={answers}
                setAnswer={setAnswers}
                getAnswers={getAnswers}
                accent={questConfig.PRIMARY_COLOR}
                singleChoose="modal1"
                multiChoice="modal2"
              >
                <OnBoarding.Header />
                <OnBoarding.Content />
                <OnBoarding.Footer />
              </OnBoarding>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;