import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX } = FiIcons;

const questionTypes = [
  { type: 'text', label: 'Short Text', icon: '📝', description: 'Single line text input' },
  { type: 'textarea', label: 'Long Text', icon: '📄', description: 'Multi-line text area' },
  { type: 'radio', label: 'Multiple Choice', icon: '⚪', description: 'Select one option' },
  { type: 'checkbox', label: 'Checkboxes', icon: '☑️', description: 'Select multiple options' },
  { type: 'select', label: 'Dropdown', icon: '📋', description: 'Dropdown selection' },
  { type: 'rating', label: 'Rating Scale', icon: '⭐', description: 'Rate from 1 to 5' },
  { type: 'number', label: 'Number', icon: '🔢', description: 'Numeric input' },
  { type: 'email', label: 'Email', icon: '📧', description: 'Email address input' },
  { type: 'date', label: 'Date', icon: '📅', description: 'Date picker' }
];

function QuestionTypeSelector({ onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add Question</h2>
              <p className="text-gray-600 mt-1">Choose the type of question you want to add</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionTypes.map((questionType, index) => (
              <motion.button
                key={questionType.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(questionType.type)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{questionType.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {questionType.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{questionType.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default QuestionTypeSelector;