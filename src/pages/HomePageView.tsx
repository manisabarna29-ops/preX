import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Code2,
  Terminal,
  Mic2,
  BarChart3,
  BookOpen,
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Compass,
  Headphones,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { ThreeHeroScene } from '../components/ThreeHeroScene';
import { TRANSLATIONS } from '../lib/i18n';

interface HomePageViewProps {
  onOpenVoiceModal: () => void;
}

export const HomePageView: React.FC<HomePageViewProps> = ({ onOpenVoiceModal }) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { quizHistory, codingHistory, interviewHistory, placementReadiness } = useProgress();
  const currentLang = profile?.preferredLanguage || 'en';
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  // Last attempted items from real stored data
  const lastQuiz = quizHistory[0] || null;
  const lastCode = codingHistory[0] || null;
  const lastInterview = interviewHistory[0] || null;

  const hasAnyActivity = Boolean(lastQuiz || lastCode || lastInterview);

  const quickAccessCards = [
    {
      title: 'Aptitude Practice',
      description: 'Quantitative aptitude, logical reasoning, and verbal ability tests with step-by-step AI derivations.',
      icon: Brain,
      route: '/aptitude',
      tag: 'Math & Logic',
      accentColor: 'from-indigo-600 to-indigo-800',
      iconColor: 'text-indigo-400',
    },
    {
      title: 'Technical Preparation',
      description: 'Core CS subjects: DSA, DBMS, operating systems, computer networks, and OOP architectural fundamentals.',
      icon: Code2,
      route: '/technical',
      tag: 'Core CS & MCQs',
      accentColor: 'from-purple-600 to-indigo-800',
      iconColor: 'text-purple-400',
    },
    {
      title: 'Coding Practice',
      description: 'Algorithm challenges with multi-language code editors, sample test cases, and real-time execution.',
      icon: Terminal,
      route: '/coding',
      tag: 'Live Sandbox',
      accentColor: 'from-emerald-600 to-teal-800',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Mock Interview',
      description: 'HR and technical voice-enabled interview practice with real-time STAR method feedback and scoring.',
      icon: Mic2,
      route: '/mock-interview',
      tag: 'STAR AI Evaluation',
      accentColor: 'from-cyan-600 to-blue-800',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'AI Voice Coach',
      description: '24/7 spoken tutoring. Speak naturally to ask questions and receive intelligent spoken explanations.',
      icon: Headphones,
      route: '/voice-coach',
      tag: 'Speech & Audio',
      accentColor: 'from-fuchsia-600 to-purple-800',
      iconColor: 'text-fuchsia-400',
    },
    {
      title: 'Progress & Analytics',
      description: 'Track scores, module completion, accuracy breakdown, and export placement readiness dossiers.',
      icon: BarChart3,
      route: '/analytics',
      tag: 'Live Reports',
      accentColor: 'from-blue-600 to-indigo-800',
      iconColor: 'text-blue-400',
    },
  ];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-indigo-300 uppercase">
              SphereAI Placement Suite 2026
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Welcome to Your Placement Journey, {profile?.name || 'Student'}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Learn, Practice, Improve, and Get Placement Ready.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-all shadow-sm"
          >
            <Mic2 className="w-4 h-4 text-cyan-400" />
            <span>Start AI Voice Coach</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Section with 3D Core */}
      <div className="relative min-h-[440px] rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950/90 to-purple-950/60 border border-indigo-500/25 p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col justify-center">
        {/* Interactive 3D Background */}
        <div className="absolute top-0 right-0 w-full lg:w-7/12 h-full opacity-65 pointer-events-auto">
          <ThreeHeroScene />
        </div>

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI-Driven Placement Readiness</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your AI-Powered Placement{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-white bg-clip-text text-transparent">
              Success Partner
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Prepare smarter with personalized aptitude practice, technical learning, coding challenges, and AI-powered mock interviews designed for top campus recruiters.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/aptitude')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start Practice Modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/voice-coach')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all"
            >
              <Headphones className="w-4 h-4 text-cyan-300" />
              <span>Full Voice Studio</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Placement Readiness: <strong className="text-white">{placementReadiness}%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>6 Multilingual Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Real-time Code Sandbox</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Access Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>Core Placement Modules</span>
            </h3>
            <p className="text-xs text-slate-400">Explore each specialized preparation arena</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View Full Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickAccessCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(card.route)}
                className="group relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-xl hover:shadow-indigo-500/10 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 ${card.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {card.tag}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Enter Arena</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Continue Learning Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Continue Your Learning</h3>
              <p className="text-xs text-slate-400">Jump straight back into your ongoing exercises</p>
            </div>
          </div>

          {hasAnyActivity && (
            <button
              onClick={() => {
                if (lastQuiz) navigate('/aptitude');
                else if (lastCode) navigate('/coding');
                else navigate('/mock-interview');
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <span>Continue Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {hasAnyActivity ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Last Quiz Attempt */}
            {lastQuiz ? (
              <div
                onClick={() => navigate('/aptitude')}
                className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-indigo-300">Aptitude Drill</span>
                  <span>{new Date(lastQuiz.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-white">{lastQuiz.topic}</h4>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-300">Score: <strong className="text-emerald-400">{lastQuiz.score}%</strong></span>
                  <span className="text-indigo-400 text-[11px] font-semibold flex items-center gap-1">
                    Retake <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ) : null}

            {/* Last Coding Submission */}
            {lastCode ? (
              <div
                onClick={() => navigate('/coding')}
                className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-emerald-300">Coding Challenge</span>
                  <span>{lastCode.language.toUpperCase()}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-white">{lastCode.problemTitle}</h4>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-emerald-400 font-bold">{lastCode.verdict}</span>
                  <span className="text-indigo-400 text-[11px] font-semibold flex items-center gap-1">
                    Code <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ) : null}

            {/* AI Recommendation */}
            <div
              onClick={() => navigate('/study-materials')}
              className="p-4 rounded-xl bg-indigo-950/30 hover:bg-indigo-950/50 border border-indigo-500/30 cursor-pointer transition-colors space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] text-cyan-300 font-semibold">
                <span>AI Recommended Step</span>
                <Sparkles className="w-3 h-3" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Daily 7-Day Roadmap</h4>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                Refine quantitative shortcuts and STAR behavioral responses.
              </p>
              <div className="text-cyan-400 text-[11px] font-bold flex items-center gap-1 pt-1">
                Open Roadmap <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 text-center bg-slate-800/30 rounded-2xl border border-dashed border-slate-700 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">No activity recorded yet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Start your first practice session to see your learning progress and customized recommendations here.
            </p>
            <button
              onClick={() => navigate('/aptitude')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Start First Aptitude Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
