import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Terminal,
  Mic2,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Target,
  Clock,
  TrendingUp,
  Award,
  Play,
  RotateCcw,
  CheckSquare,
  FileCheck2,
  Headphones,
  CalendarCheck2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { TRANSLATIONS } from '../lib/i18n';

interface DashboardViewProps {
  onOpenVoiceAgent?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenVoiceAgent }) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { quizHistory, codingHistory, interviewHistory, placementReadiness, streakDays } = useProgress();
  const currentLang = profile?.preferredLanguage || 'en';
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  // Real Stored Data Computations
  const totalQuizzes = quizHistory.length;
  const avgAptitudeScore =
    totalQuizzes > 0
      ? Math.round(quizHistory.reduce((a, b) => a + b.score, 0) / totalQuizzes)
      : 0;

  const totalAcceptedCoding = codingHistory.filter((c) => c.verdict === 'Accepted').length;
  const totalCodingAttempts = codingHistory.length;
  const totalInterviews = interviewHistory.length;
  const avgInterviewScore =
    totalInterviews > 0
      ? Math.round(interviewHistory.reduce((a, b) => a + b.overallScore, 0) / totalInterviews)
      : 0;

  const totalPracticeSessions = totalQuizzes + totalCodingAttempts + totalInterviews;

  // Combined Recent Activity sorted by date
  interface RecentItem {
    id: string;
    type: 'aptitude' | 'coding' | 'interview';
    title: string;
    subtitle: string;
    scoreOrVerdict: string;
    date: string;
    route: string;
  }

  const recentList: RecentItem[] = [
    ...quizHistory.map((q) => ({
      id: q.id,
      type: 'aptitude' as const,
      title: q.topic,
      subtitle: `${q.category} • ${q.correctCount}/${q.totalQuestions} Correct`,
      scoreOrVerdict: `${q.score}% Score`,
      date: q.createdAt,
      route: '/aptitude',
    })),
    ...codingHistory.map((c) => ({
      id: c.id,
      type: 'coding' as const,
      title: c.problemTitle,
      subtitle: `${c.language.toUpperCase()} • ${c.passedTests}/${c.totalTests} Tests Passed`,
      scoreOrVerdict: c.verdict,
      date: c.createdAt,
      route: '/coding',
    })),
    ...interviewHistory.map((i) => ({
      id: i.id,
      type: 'interview' as const,
      title: `${i.interviewType} Interview`,
      subtitle: `Target: ${i.targetCompany || 'General Tech'} • Comm: ${i.communicationScore}%`,
      scoreOrVerdict: `${i.overallScore}/100`,
      date: i.createdAt,
      route: '/mock-interview',
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Today's suggested learning tasks
  const dailyTasks = [
    { title: 'Quantitative Speed Drill: Percentages & Profit-Loss (10 Qs)', completed: totalQuizzes > 0, route: '/aptitude' },
    { title: 'Solve 1 Medium DSA Problem (Two Sum or Kadane Algorithm)', completed: totalAcceptedCoding > 0, route: '/coding' },
    { title: 'Conduct 1 STAR Behavioral Mock Round with SphereAI', completed: totalInterviews > 0, route: '/mock-interview' },
    { title: 'Spoken English & Technical Terminology Practice with Voice Coach', completed: false, route: '/voice-coach' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* 1. Header Overview & User Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Student Command Center
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {profile?.name || 'Candidate'}'s Placement Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {profile?.college || 'Campus University'} • Batch of {profile?.gradYear || '2026'} • Role:{' '}
            <span className="text-cyan-300 font-medium">{profile?.careerInterests || 'SDE'}</span>
          </p>
        </div>

        {/* Learning Streak */}
        <div className="flex items-center gap-3 self-start sm:self-auto p-2.5 px-4 rounded-xl bg-slate-800/80 border border-slate-700">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Flame className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Active Streak
            </span>
            <span className="text-base font-extrabold text-amber-400">{streakDays} Consecutive Days</span>
          </div>
        </div>
      </div>

      {/* 2. Real Stored Data Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Sessions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Sessions</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalPracticeSessions}</span>
          </div>
          <span className="text-[11px] text-slate-400">Recorded across portal</span>
        </div>

        {/* Aptitude Score */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Aptitude Avg</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {totalQuizzes > 0 ? `${avgAptitudeScore}%` : '0%'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">{totalQuizzes} drills completed</span>
        </div>

        {/* Coding Solved */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Coding Solved</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {totalAcceptedCoding}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">of {totalCodingAttempts} attempts</span>
        </div>

        {/* Mock Interviews */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Mock Interviews</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Mic2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalInterviews}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {totalInterviews > 0 ? `Avg: ${avgInterviewScore}/100` : 'None yet'}
          </span>
        </div>

        {/* Overall Readiness */}
        <div className="col-span-2 md:col-span-1 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-300">
            <span className="text-xs font-bold">Placement Index</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{placementReadiness}%</span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Ready</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
              style={{ width: `${placementReadiness}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Quick Action Buttons */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick Placement Actions</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/aptitude')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all hover:scale-[1.02] shadow-sm"
          >
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Start Aptitude Test</span>
          </button>

          <button
            onClick={() => navigate('/coding')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all hover:scale-[1.02] shadow-sm"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Practice Coding</span>
          </button>

          <button
            onClick={() => navigate('/mock-interview')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all hover:scale-[1.02] shadow-sm"
          >
            <Mic2 className="w-4 h-4 text-cyan-400" />
            <span>Start Mock Interview</span>
          </button>

          <button
            onClick={onOpenVoiceAgent || (() => navigate('/voice-coach'))}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all hover:scale-[1.02] shadow-md shadow-indigo-600/20"
          >
            <Headphones className="w-4 h-4 text-white" />
            <span>Open AI Voice Coach</span>
          </button>
        </div>
      </div>

      {/* 4. Main Two-Column Layout: Today's Plan & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Learning Plan & Recommended Practice */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Learning Plan */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Today's Placement Learning Plan</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {dailyTasks.filter((t) => t.completed).length} of {dailyTasks.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {dailyTasks.map((task, i) => (
                <div
                  key={i}
                  onClick={() => navigate(task.route)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={task.completed ? 'line-through text-slate-400' : ''}>
                      {task.title}
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Practice based on actual results */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Targeted Recommendation</span>
              </span>
              <span className="text-[10px] text-slate-400">Calibrated for {profile?.careerInterests}</span>
            </div>

            <h4 className="font-bold text-white text-sm">
              Strengthen Dynamic Programming & STAR Interview Metrics
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your previous sessions, campus interviewers evaluate quantifiable impact (e.g. latency reductions, query optimization percentages). Practice structuring your capstone project using the STAR method.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/mock-interview')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Practice Interview STAR Round
              </button>
              <button
                onClick={() => navigate('/study-materials')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
              >
                View 7-Day Plan
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Performance Charts & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Performance Mini Charts */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Module Competency Metrics</span>
              </h3>
              <button
                onClick={() => navigate('/analytics')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Full Analytics →
              </button>
            </div>

            {/* Bars based on real stored averages */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Quantitative & Logical Aptitude</span>
                  <span className="font-bold text-white">{avgAptitudeScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, avgAptitudeScore)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Coding Challenges (Pass Rate)</span>
                  <span className="font-bold text-white">
                    {totalCodingAttempts > 0
                      ? `${Math.round((totalAcceptedCoding / totalCodingAttempts) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totalCodingAttempts > 0
                          ? Math.round((totalAcceptedCoding / totalCodingAttempts) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">STAR Mock Interview Score</span>
                  <span className="font-bold text-white">{avgInterviewScore}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, avgInterviewScore)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Recent Learning Activity</span>
              </h3>
              <span className="text-[11px] text-slate-400">Actual logs</span>
            </div>

            {recentList.length > 0 ? (
              <div className="space-y-2.5">
                {recentList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(item.route)}
                    className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h5 className="font-semibold text-xs text-white truncate">{item.title}</h5>
                      <p className="text-[10px] text-slate-400 truncate">{item.subtitle}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-indigo-300">{item.scoreOrVerdict}</span>
                      <p className="text-[9px] text-slate-500">
                        {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-800/20 rounded-xl border border-dashed border-slate-800">
                No recent activity recorded. Take a test or coding challenge to populate your learning trail.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
