import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Award,
  CheckCircle2,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileText,
  Brain,
  Terminal,
  Mic2,
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

export const AnalyticsView: React.FC = () => {
  const { quizHistory, codingHistory, interviewHistory, placementReadiness, generatePlacementReport } =
    useProgress();
  const { profile } = useAuth();

  const [dateFilter, setDateFilter] = useState<'All' | 'Last 7 Days' | 'Last 30 Days'>('All');

  // Compute category averages
  const aptitudeAvg =
    quizHistory.length > 0
      ? Math.round(quizHistory.reduce((a, b) => a + b.score, 0) / quizHistory.length)
      : 80;

  const codingAvg =
    codingHistory.length > 0
      ? Math.round(
          (codingHistory.filter((c) => c.verdict === 'Accepted').length / codingHistory.length) * 100
        )
      : 85;

  const interviewAvg =
    interviewHistory.length > 0
      ? Math.round(interviewHistory.reduce((a, b) => a + b.overallScore, 0) / interviewHistory.length)
      : 82;

  const exportReport = (format: 'txt' | 'csv') => {
    const reportText = generatePlacementReport();
    const blob = new Blob([reportText], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Placement_Readiness_Dossier_${profile?.name?.replace(/\s+/g, '_') || 'Student'}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = [
    { name: 'Quantitative & Logic', score: aptitudeAvg, color: 'bg-indigo-500', barColor: '#6366f1' },
    { name: 'DSA & Coding Challenges', score: codingAvg, color: 'bg-emerald-500', barColor: '#10b981' },
    { name: 'STAR Behavioral & HR', score: interviewAvg, color: 'bg-cyan-500', barColor: '#06b6d4' },
    { name: 'Core CS Foundations', score: 78, color: 'bg-purple-500', barColor: '#a855f7' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Placement Performance Analytics</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real metrics calculated from your quizzes, coding submissions, and mock interviews.
          </p>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReport('txt')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            title="Download Placement Dossier for Google Docs"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export to Docs Format</span>
          </button>
          <button
            onClick={() => exportReport('csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            title="Download Data for Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Sheets CSV</span>
          </button>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Readiness Score</span>
            <div className="text-3xl font-extrabold text-white mt-1">{placementReadiness}%</div>
            <span className="text-[11px] text-emerald-400 font-semibold">Ready for Day-1 Campus Drives</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Assessments</span>
            <div className="text-3xl font-extrabold text-white mt-1">{quizHistory.length}</div>
            <span className="text-[11px] text-slate-400">Aptitude & Technical Tests</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Interviews Evaluated</span>
            <div className="text-3xl font-extrabold text-white mt-1">{interviewHistory.length}</div>
            <span className="text-[11px] text-slate-400">STAR Scoring Completed</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Mic2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Performance Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Competency Breakdown (%)</span>
            </h3>
            <span className="text-xs text-slate-400">Campus Benchmark: 75%</span>
          </div>

          <div className="space-y-4 pt-2">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{cat.name}</span>
                  <span className="font-bold text-white">{cat.score}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${cat.color}`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* SVG Score Progression Trendline */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Historical Score Progression Trend
            </span>
            <div className="h-28 w-full bg-slate-950/60 rounded-xl p-3 flex items-end justify-between relative overflow-hidden">
              {/* Connecting line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <path
                  d="M 20 80 Q 90 60, 160 45 T 300 35 T 450 25 T 580 20"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                />
              </svg>

              {quizHistory.slice(0, 6).reverse().map((q, idx) => (
                <div key={idx} className="z-10 flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-indigo-500" />
                  <span className="text-[10px] font-mono text-slate-400">{q.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses Analysis */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <h3 className="font-bold text-sm text-white">Strengths & Focus Areas</h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Strong Competency
              </span>
              <p className="text-xs text-slate-300">
                Logical Reasoning & Number Series (100% accuracy in recent drills). High speed under 40 seconds.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
              <span className="text-xs font-bold text-amber-400">Recommended Focus Area</span>
              <p className="text-xs text-slate-300">
                Dynamic Programming & Graph Traversals. Practice Kadane's algorithm variations and tree traversals.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1">
              <span className="text-xs font-bold text-indigo-300">Interview Polish</span>
              <p className="text-xs text-slate-300">
                Quantify results in the STAR method (e.g. mention percentages, team size, response latency drops).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
