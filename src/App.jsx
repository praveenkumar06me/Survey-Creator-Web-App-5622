import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import { SurveyProvider } from './contexts/SurveyContext';
import { AuthProvider } from './contexts/AuthContext';
import questConfig from './config/questConfig';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import SurveyBuilder from './pages/SurveyBuilder';
import SurveyPreview from './pages/SurveyPreview';
import ResponseViewer from './pages/ResponseViewer';
import './App.css';

function App() {
  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <AuthProvider>
        <SurveyProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="pt-16">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/builder/:id?" element={<SurveyBuilder />} />
                        <Route path="/preview/:id" element={<SurveyPreview />} />
                        <Route path="/responses/:id" element={<ResponseViewer />} />
                      </Routes>
                    </main>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </SurveyProvider>
      </AuthProvider>
    </QuestProvider>
  );
}

export default App;