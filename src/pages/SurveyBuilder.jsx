import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurvey } from '../contexts/SurveyContext';
import QuestionEditor from '../components/QuestionEditor';
import QuestionTypeSelector from '../components/QuestionTypeSelector';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiEye, FiPlus, FiSettings, FiArrowLeft } = FiIcons;

function SurveyBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useSurvey();
  const [isEditing, setIsEditing] = useState(false);
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);

  useEffect(() => {
    if (id) {
      const survey = state.surveys.find(s => s.id === id);
      if (survey) {
        dispatch({ type: 'SET_CURRENT_SURVEY', payload: survey });
      } else {
        navigate('/');
      }
    } else {
      dispatch({
        type: 'ADD_SURVEY',
        payload: { title: 'New Survey', description: '' }
      });
      setIsEditing(true);
    }
  }, [id, state.surveys, dispatch, navigate]);

  const handleSaveSurvey = () => {
    if (state.currentSurvey) {
      dispatch({
        type: 'UPDATE_SURVEY',
        payload: state.currentSurvey
      });
      setIsEditing(false);
    }
  };

  const handleAddQuestion = (type) => {
    dispatch({
      type: 'ADD_QUESTION',
      payload: { type, title: `New ${type} Question` }
    });
    setShowQuestionTypes(false);
  };

  const handleSurveyChange = (field, value) => {
    if (state.currentSurvey) {
      dispatch({
        type: 'UPDATE_SURVEY',
        payload: { id: state.currentSurvey.id, [field]: value }
      });
    }
  };

  if (!state.currentSurvey) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Survey Builder</h1>
            <p className="text-gray-600">Design your survey questions and settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/preview/${state.currentSurvey.id}`)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiEye} className="text-lg" />
            <span>Preview</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveSurvey}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiSave} className="text-lg" />
            <span>Save Survey</span>
          </motion.button>
        </div>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Survey Information</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiSettings} className="text-lg" />
            </motion.button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Title
                </label>
                <input
                  type="text"
                  value={state.currentSurvey.title}
                  onChange={(e) => handleSurveyChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter survey title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={state.currentSurvey.description}
                  onChange={(e) => handleSurveyChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter survey description"
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {state.currentSurvey.title}
              </h3>
              {state.currentSurvey.description && (
                <p className="text-gray-600">{state.currentSurvey.description}</p>
              )}
            </div>
          )}
        </motion.div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowQuestionTypes(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiPlus} className="text-lg" />
              <span>Add Question</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {state.currentSurvey.questions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <SafeIcon icon={FiPlus} className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-600 mb-4">Start building your survey by adding questions</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQuestionTypes(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Your First Question
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {state.currentSurvey.questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <QuestionEditor question={question} index={index} />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showQuestionTypes && (
          <QuestionTypeSelector
            onSelect={handleAddQuestion}
            onClose={() => setShowQuestionTypes(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default SurveyBuilder;