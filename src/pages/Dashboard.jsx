import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSurvey } from '../contexts/SurveyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiPlus, FiEdit3, FiTrash2, FiEye, FiBarChart3, FiClock, FiUsers } = FiIcons;

function Dashboard() {
  const { state, dispatch } = useSurvey();

  const handleDeleteSurvey = (surveyId) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      dispatch({ type: 'DELETE_SURVEY', payload: surveyId });
    }
  };

  const getResponseCount = (surveyId) => {
    return state.responses[surveyId]?.length || 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Survey Dashboard</h1>
          <p className="text-gray-600 mt-2">Create, manage, and analyze your surveys</p>
        </div>
        <Link to="/builder">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:shadow-lg transition-shadow"
          >
            <SafeIcon icon={FiPlus} className="text-lg" />
            <span>Create Survey</span>
          </motion.button>
        </Link>
      </div>

      {state.surveys.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <SafeIcon icon={FiBarChart3} className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No surveys yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first survey</p>
          <Link to="/builder">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Survey
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.surveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {survey.title}
                    </h3>
                    {survey.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {survey.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <Link to={`/builder/${survey.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Survey"
                      >
                        <SafeIcon icon={FiEdit3} className="text-lg" />
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteSurvey(survey.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Survey"
                    >
                      <SafeIcon icon={FiTrash2} className="text-lg" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiClock} className="text-sm" />
                    <span>{format(new Date(survey.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiUsers} className="text-sm" />
                    <span>{getResponseCount(survey.id)} responses</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link to={`/preview/${survey.id}`} className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiEye} className="text-sm" />
                      <span>Preview</span>
                    </motion.button>
                  </Link>
                  <Link to={`/responses/${survey.id}`} className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiBarChart3} className="text-sm" />
                      <span>Analyze</span>
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;