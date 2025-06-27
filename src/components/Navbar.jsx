import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClipboard, FiHome, FiLogOut } = FiIcons;

function Navbar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/builder', label: 'Create Survey', icon: FiClipboard }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiClipboard} className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-gray-900">SurveyCraft</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-blue-50 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`relative flex items-center space-x-2 ${
                  location.pathname === item.path 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}>
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="ml-4 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
              title="Logout"
            >
              <SafeIcon icon={FiLogOut} className="text-lg" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;