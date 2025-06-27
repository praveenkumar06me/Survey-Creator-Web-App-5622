import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSurvey } from '../contexts/SurveyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiArrowLeft, FiUsers, FiBarChart3, FiDownload, FiEye } = FiIcons;

function ResponseViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useSurvey();

  const survey = state.surveys.find(s => s.id === id);
  const responses = state.responses[id] || [];

  useEffect(() => {
    if (!survey) {
      navigate('/');
    }
  }, [survey, navigate]);

  const getResponseSummary = (question) => {
    const questionResponses = responses.map(response => response.responses[question.id]).filter(Boolean);
    
    if (question.type === 'rating' || question.type === 'number') {
      const numbers = questionResponses.map(r => Number(r)).filter(n => !isNaN(n));
      if (numbers.length === 0) return { average: 0, count: 0 };
      const average = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
      return { average: average.toFixed(1), count: numbers.length };
    }

    if (['radio', 'select'].includes(question.type)) {
      const counts = {};
      questionResponses.forEach(response => {
        counts[response] = (counts[response] || 0) + 1;
      });
      return counts;
    }

    if (question.type === 'checkbox') {
      const counts = {};
      questionResponses.forEach(response => {
        if (Array.isArray(response)) {
          response.forEach(option => {
            counts[option] = (counts[option] || 0) + 1;
          });
        }
      });
      return counts;
    }

    return { totalResponses: questionResponses.length };
  };

  const exportResponses = () => {
    const csvContent = [
      ['Submission Date', ...survey.questions.map(q => q.title)],
      ...responses.map(response => [
        format(new Date(response.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
        ...survey.questions.map(q => {
          const answer = response.responses[q.id];
          if (Array.isArray(answer)) {
            return answer.join('; ');
          }
          return answer || '';
        })
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey.title}_responses.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!survey) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
            <h1 className="text-2xl font-bold text-gray-900">Survey Responses</h1>
            <p className="text-gray-600">{survey.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/preview/${id}`)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiEye} className="text-lg" />
            <span>Preview Survey</span>
          </motion.button>
          {responses.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportResponses}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiDownload} className="text-lg" />
              <span>Export CSV</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiUsers} className="text-xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiBarChart3} className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-2xl font-bold text-gray-900">{survey.questions.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiBarChart3} className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {responses.length > 0 ? '100%' : '0%'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {responses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <SafeIcon icon={FiBarChart3} className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No responses yet</h3>
          <p className="text-gray-600 mb-6">Share your survey to start collecting responses</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/preview/${id}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Preview Survey
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Response Summary</h2>
            <div className="space-y-8">
              {survey.questions.map((question, index) => {
                const summary = getResponseSummary(question);
                
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    <h3 className="font-medium text-gray-900 mb-4">
                      {index + 1}. {question.title}
                    </h3>
                    
                    {question.type === 'rating' || question.type === 'number' ? (
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{summary.average}</p>
                          <p className="text-sm text-gray-600">Average</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{summary.count}</p>
                          <p className="text-sm text-gray-600">Responses</p>
                        </div>
                      </div>
                    ) : ['radio', 'select', 'checkbox'].includes(question.type) ? (
                      <div className="space-y-2">
                        {Object.entries(summary).map(([option, count]) => (
                          <div key={option} className="flex items-center justify-between">
                            <span className="text-gray-700">{option}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-600 rounded-full"
                                  style={{
                                    width: `${(count / responses.length) * 100}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-8">
                                {count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        {summary.totalResponses} text responses received
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Individual Responses</h2>
            <div className="space-y-6">
              {responses.map((response, index) => (
                <motion.div
                  key={response.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Response #{index + 1}</h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(response.submittedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {survey.questions.map((question) => (
                      <div key={question.id} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-medium text-xs flex-shrink-0 mt-0.5">
                          {survey.questions.indexOf(question) + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {question.title}
                          </p>
                          <p className="text-sm text-gray-700">
                            {Array.isArray(response.responses[question.id])
                              ? response.responses[question.id].join(', ')
                              : response.responses[question.id] || 'No response'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResponseViewer;