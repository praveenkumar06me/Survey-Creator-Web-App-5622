import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurvey } from '../contexts/SurveyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiTrash2, FiSave, FiX, FiPlus, FiMinus, FiCheck } = FiIcons;

function QuestionEditor({ question, index }) {
  const { dispatch } = useSurvey();
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_QUESTION',
      payload: editedQuestion
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedQuestion(question);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      dispatch({
        type: 'DELETE_QUESTION',
        payload: question.id
      });
    }
  };

  const handleAddOption = () => {
    setEditedQuestion({
      ...editedQuestion,
      options: [...editedQuestion.options, `Option ${editedQuestion.options.length + 1}`]
    });
  };

  const handleRemoveOption = (index) => {
    setEditedQuestion({
      ...editedQuestion,
      options: editedQuestion.options.filter((_, i) => i !== index)
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({
      ...editedQuestion,
      options: newOptions
    });
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'text': return '📝';
      case 'textarea': return '📄';
      case 'radio': return '⚪';
      case 'checkbox': return '☑️';
      case 'select': return '📋';
      case 'rating': return '⭐';
      case 'number': return '🔢';
      case 'email': return '📧';
      case 'date': return '📅';
      default: return '❓';
    }
  };

  return (
    <motion.div
      layout
      className="bg-gray-50 rounded-lg border border-gray-200 p-4"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold text-sm">
            {index + 1}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
            <span className="text-sm font-medium text-gray-500 capitalize">{question.type}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Save Changes"
              >
                <SafeIcon icon={FiSave} className="text-lg" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cancel"
              >
                <SafeIcon icon={FiX} className="text-lg" />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Question"
              >
                <SafeIcon icon={FiEdit3} className="text-lg" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Question"
              >
                <SafeIcon icon={FiTrash2} className="text-lg" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Title
              </label>
              <input
                type="text"
                value={editedQuestion.title}
                onChange={(e) => setEditedQuestion({ ...editedQuestion, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter question title"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`required-${question.id}`}
                checked={editedQuestion.required}
                onChange={(e) => setEditedQuestion({ ...editedQuestion, required: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-gray-700">
                Required question
              </label>
            </div>

            {['radio', 'checkbox', 'select'].includes(editedQuestion.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  {editedQuestion.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveOption(optionIndex)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiMinus} className="text-sm" />
                      </motion.button>
                    </div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddOption}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="text-sm" />
                    <span>Add Option</span>
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="viewing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {question.title}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            
            {['radio', 'checkbox', 'select'].includes(question.type) && question.options.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Options:</p>
                <div className="space-y-1">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                      <SafeIcon icon={FiCheck} className="text-xs text-gray-400" />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default QuestionEditor;