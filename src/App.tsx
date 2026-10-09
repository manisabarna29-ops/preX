import React, { useState, useEffect } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FloatingAIWidget } from './components/FloatingAIWidget';
import { AIVoiceAssistantModal } from './components/AIVoiceAssistantModal';

// Views
import { HomePageView } from './pages/HomePageView';
import { DashboardView } from './pages/DashboardView';
import { AptitudeView } from './pages/AptitudeView';
import { TechnicalView } from './pages/TechnicalView';
import { CodingView } from './pages/CodingView';
import { InterviewView } from './pages/InterviewView';
import { VoiceAgentView } from './pages/VoiceAgentView';
import { MockTestsView } from './pages/MockTestsView';
import { AnalyticsView } from './pages/AnalyticsView';
import { StudyPlanView } from './pages/StudyPlanView';
import { ProfileView } from './pages/ProfileView';
import { AdminView } from './pages/AdminView';
import { LandingPageView } from './pages/LandingPageView';

export function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const isLandingRoute = location.pathname === '/landing';

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-950', 'text-slate-100');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-slate-950', 'text-slate-100');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      <div className="flex-1 flex relative">
        {/* Sidebar */}
        {!isLandingRoute && (
          <Sidebar
            isOpenMobile={isSidebarOpenMobile}
            onCloseMobile={() => setIsSidebarOpenMobile(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 p-4 sm:p-8 max-w-7xl mx-auto w-full ${
            !isLandingRoute
              ? isSidebarCollapsed
                ? 'lg:pl-24'
                : 'lg:pl-72'
              : ''
          }`}
        >
          {/* Quick Landing / Home Switcher Banner */}
          <div className="mb-4 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-medium text-slate-300">
              SphereAI Voice Coach • Placement Preparation Suite
            </span>
            <button
              onClick={() => {
                if (isLandingRoute) {
                  navigate('/home');
                } else {
                  navigate('/landing');
                }
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              {isLandingRoute ? '← Return to Home Page' : 'View Public 3D Showcase'}
            </button>
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route
              path="/home"
              element={
                <HomePageView
                  onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardView
                  onOpenVoiceAgent={() => setIsVoiceModalOpen(true)}
                />
              }
            />
            <Route path="/aptitude" element={<AptitudeView />} />
            <Route path="/technical" element={<TechnicalView />} />
            <Route path="/coding" element={<CodingView />} />
            <Route path="/mock-interview" element={<InterviewView />} />
            <Route path="/voice-coach" element={<VoiceAgentView />} />
            <Route path="/analytics" element={<AnalyticsView />} />
            <Route path="/study-materials" element={<StudyPlanView />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/mock-tests" element={<MockTestsView />} />
            <Route path="/admin" element={<AdminView />} />
            <Route
              path="/landing"
              element={
                <LandingPageView
                  onEnterApp={() => navigate('/home')}
                />
              }
            />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      </div>

      {/* Floating 3D AI Assistant Widget */}
      <FloatingAIWidget onClick={() => setIsVoiceModalOpen(true)} />

      {/* 24/7 AI Voice Assistant Modal */}
      <AIVoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </AuthProvider>
    </HashRouter>
  );
}
