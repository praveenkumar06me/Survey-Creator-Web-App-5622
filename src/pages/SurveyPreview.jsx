import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSurvey } from '../contexts/SurveyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiSend, FiCheck } = FiIcons;

function SurveyPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useSurvey();
  const [responses, setResponses] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const survey = state.surveys.find(s => s.id === id);

  useEffect(() => {
    if (!survey) {
      navigate('/');
    }
  }, [survey, navigate]);

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    survey.questions.forEach(question => {
      if (question.required && (!responses[question.id] || responses[question.id] === '')) {
        newErrors[question.id] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch({
      type: 'ADD_RESPONSE',
      payload: {
        surveyId: id,
        responses: responses
      }
    });

    setIsSubmitted(true);
  };

  const renderQuestion = (question) => {
    const value = responses[question.id] || '';
    const hasError = errors[question.id];

    switch (question.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={question.type}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder={`Enter your ${question.type === 'email' ? 'email' : 'answer'}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your answer"
          />
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    handleInputChange(question.id, newValues);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select an option</option>
            {question.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'rating':
        return (
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.button
                key={rating}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleInputChange(question.id, rating)}
                className={`w-10 h-10 rounded-full border-2 font-medium transition-colors ${
                  value >= rating
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                }`}
              >
                {rating}
              </motion.button>
            ))}
            <span className="ml-4 text-sm text-gray-600">
              {value ? `${value}/5` : 'Not rated'}
            </span>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
        );

      default:
        return null;
    }
  };

  if (!survey) {
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <SafeIcon icon={FiCheck} className="text-3xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-8">Your response has been submitted successfully.</p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/responses/${id}`)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View All Responses
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/builder/${id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="text-xl" />
          <span>Back to Builder</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{survey.title}</h1>
          {survey.description && (
            <p className="text-gray-600">{survey.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {survey.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium text-sm mt-1">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    {question.title}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderQuestion(question)}
                  {errors[question.id] && (
                    <p className="text-red-600 text-sm mt-2">{errors[question.id]}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          <div className="pt-6 border-t border-gray-200">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiSend} className="text-lg" />
              <span>Submit Survey</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default SurveyPreview;