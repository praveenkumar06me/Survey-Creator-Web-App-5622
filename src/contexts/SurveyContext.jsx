import React, { createContext, useContext, useReducer, useEffect } from 'react';

const SurveyContext = createContext();

const initialState = {
  surveys: [],
  currentSurvey: null,
  responses: {}
};

function surveyReducer(state, action) {
  switch (action.type) {
    case 'SET_SURVEYS':
      return { ...state, surveys: action.payload };
    
    case 'ADD_SURVEY':
      const newSurvey = {
        id: Date.now().toString(),
        title: action.payload.title || 'Untitled Survey',
        description: action.payload.description || '',
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      };
      return {
        ...state,
        surveys: [...state.surveys, newSurvey],
        currentSurvey: newSurvey
      };
    
    case 'UPDATE_SURVEY':
      const updatedSurveys = state.surveys.map(survey =>
        survey.id === action.payload.id
          ? { ...survey, ...action.payload, updatedAt: new Date().toISOString() }
          : survey
      );
      return {
        ...state,
        surveys: updatedSurveys,
        currentSurvey: state.currentSurvey?.id === action.payload.id
          ? { ...state.currentSurvey, ...action.payload, updatedAt: new Date().toISOString() }
          : state.currentSurvey
      };
    
    case 'DELETE_SURVEY':
      return {
        ...state,
        surveys: state.surveys.filter(survey => survey.id !== action.payload),
        currentSurvey: state.currentSurvey?.id === action.payload ? null : state.currentSurvey
      };
    
    case 'SET_CURRENT_SURVEY':
      return { ...state, currentSurvey: action.payload };
    
    case 'ADD_QUESTION':
      if (!state.currentSurvey) return state;
      const newQuestion = {
        id: Date.now().toString(),
        type: action.payload.type,
        title: action.payload.title || 'New Question',
        required: false,
        options: action.payload.options || []
      };
      const updatedCurrentSurvey = {
        ...state.currentSurvey,
        questions: [...state.currentSurvey.questions, newQuestion]
      };
      return {
        ...state,
        currentSurvey: updatedCurrentSurvey,
        surveys: state.surveys.map(survey =>
          survey.id === state.currentSurvey.id ? updatedCurrentSurvey : survey
        )
      };
    
    case 'UPDATE_QUESTION':
      if (!state.currentSurvey) return state;
      const updatedQuestions = state.currentSurvey.questions.map(question =>
        question.id === action.payload.id ? { ...question, ...action.payload } : question
      );
      const surveyWithUpdatedQuestion = {
        ...state.currentSurvey,
        questions: updatedQuestions
      };
      return {
        ...state,
        currentSurvey: surveyWithUpdatedQuestion,
        surveys: state.surveys.map(survey =>
          survey.id === state.currentSurvey.id ? surveyWithUpdatedQuestion : survey
        )
      };
    
    case 'DELETE_QUESTION':
      if (!state.currentSurvey) return state;
      const filteredQuestions = state.currentSurvey.questions.filter(
        question => question.id !== action.payload
      );
      const surveyWithDeletedQuestion = {
        ...state.currentSurvey,
        questions: filteredQuestions
      };
      return {
        ...state,
        currentSurvey: surveyWithDeletedQuestion,
        surveys: state.surveys.map(survey =>
          survey.id === state.currentSurvey.id ? surveyWithDeletedQuestion : survey
        )
      };
    
    case 'ADD_RESPONSE':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.surveyId]: [
            ...(state.responses[action.payload.surveyId] || []),
            {
              id: Date.now().toString(),
              responses: action.payload.responses,
              submittedAt: new Date().toISOString()
            }
          ]
        }
      };
    
    default:
      return state;
  }
}

export function SurveyProvider({ children }) {
  const [state, dispatch] = useReducer(surveyReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('surveyCreatorData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'SET_SURVEYS', payload: parsedData.surveys || [] });
        if (parsedData.responses) {
          dispatch({ type: 'SET_RESPONSES', payload: parsedData.responses });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('surveyCreatorData', JSON.stringify({
      surveys: state.surveys,
      responses: state.responses
    }));
  }, [state.surveys, state.responses]);

  return (
    <SurveyContext.Provider value={{ state, dispatch }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}