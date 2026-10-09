import React, { useState } from 'react';
import {
  CalendarCheck2,
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

interface DayPlan {
  day: number;
  title: string;
  aptitudeFocus: string;
  technicalFocus: string;
  tasks: string[];
  practiceTarget: string;
}

const DEFAULT_7_DAY_PLAN: DayPlan[] = [
  {
    day: 1,
    title: 'Aptitude Foundations & Array Manipulation',
    aptitudeFocus: 'Percentages, Profit and Loss shortcuts',
    technicalFocus: 'Two-pointer technique & Hash Maps (Two Sum)',
    tasks: [
      'Solve 15 quantitative problems on percentages',
      'Implement Two Sum in O(N) using Hash Map',
      'Prepare 90-second "Tell me about yourself" pitch',
    ],
    practiceTarget: '20 Questions',
  },
  {
    day: 2,
    title: 'Time & Work + Stack/Queue Mechanics',
    aptitudeFocus: 'Time and Work, Pipes and Cisterns',
    technicalFocus: 'Stack verification (Valid Parentheses, Monotonic Stack)',
    tasks: [
      'Solve 12 Time & Work combined rate questions',
      'Solve Valid Parentheses with corner cases',
      'Read Coffman deadlock conditions for OS interview',
    ],
    practiceTarget: '15 Questions',
  },
  {
    day: 3,
    title: 'Probability & Binary Tree Traversals',
    aptitudeFocus: 'Probability & Permutation/Combination',
    technicalFocus: 'BST Inorder, Preorder, Postorder & Level Order',
    tasks: [
      'Review card/dice probability formulas',
      'Implement BFS on Binary Tree',
      'Practice 1 Behavioral STAR scenario on project hurdles',
    ],
    practiceTarget: '18 Questions',
  },
  {
    day: 4,
    title: 'Dynamic Programming & SQL Joins',
    aptitudeFocus: 'Speed Distance Time & Train problems',
    technicalFocus: "Kadane's Algorithm + SQL GROUP BY/HAVING queries",
    tasks: [
      'Practice 10 Speed & Distance calculations',
      'Solve Maximum Subarray in O(N)',
      'Review ACID properties & transaction isolation levels',
    ],
    practiceTarget: '15 Questions',
  },
  {
    day: 5,
    title: 'Full-Length Timed Assessment',
    aptitudeFocus: 'Comprehensive Quant & Logical review',
    technicalFocus: 'Pseudocode, Networks TCP Handshake, OS Paging',
    tasks: [
      'Attempt 45-minute TCS NQT Mock Test',
      'Review incorrect questions with step derivations',
      'Conduct 1 AI Mock Interview session',
    ],
    practiceTarget: '1 Full Mock Test',
  },
  {
    day: 6,
    title: 'Company Specific Preparation Track',
    aptitudeFocus: 'Logical syllogisms & blood relations',
    technicalFocus: 'System design basics & OOP 4 pillars',
    tasks: [
      'Solve 15 logical reasoning puzzles',
      'Review encapsulation & polymorphism code examples',
      'Refine resume project architectural bullet points',
    ],
    practiceTarget: '20 Questions',
  },
  {
    day: 7,
    title: 'Final Readiness Drill & Voice Mock',
    aptitudeFocus: 'Formula sheet rapid revision',
    technicalFocus: 'Time & space complexity summary',
    tasks: [
      'Do a full voice mock interview with SphereAI',
      'Export and review placement readiness dossier',
      'Relax and rest before Day-1 campus drive',
    ],
    practiceTarget: 'Final Review',
  },
];

export const StudyPlanView: React.FC = () => {
  const { profile } = useAuth();
  const { placementReadiness } = useProgress();

  const [planDays, setPlanDays] = useState<DayPlan[]>(DEFAULT_7_DAY_PLAN);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleGenerateAIPlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days: 7,
          weakTopics: ['Dynamic Programming', 'Probability', 'System Design'],
          targetCompany: 'Tier-1 Product & IT Services',
          targetRole: profile?.careerInterests || 'SDE',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.plan) && data.plan.length > 0) {
          setPlanDays(data.plan);
        }
      }
    } catch {
      // Retain robust default
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <CalendarCheck2 className="w-6 h-6 text-indigo-400" />
            <span>Personalized AI Placement Roadmap</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Custom schedule dynamically calibrated for {profile?.careerInterests} placements.
          </p>
        </div>

        <button
          onClick={handleGenerateAIPlan}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
          <span>{isGenerating ? 'Regenerating AI Plan...' : 'Regenerate Dynamic Plan'}</span>
        </button>
      </div>

      {/* Days Roadmap Timeline */}
      <div className="space-y-4">
        {planDays.map((day) => (
          <div
            key={day.day}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                  D{day.day}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white">{day.title}</h3>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                Target: {day.practiceTarget}
              </span>
            </div>

            {/* Modules Focus Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                <strong className="text-indigo-400 block mb-0.5">Aptitude Objective:</strong>
                <span className="text-slate-300">{day.aptitudeFocus}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                <strong className="text-emerald-400 block mb-0.5">Technical & Coding Objective:</strong>
                <span className="text-slate-300">{day.technicalFocus}</span>
              </div>
            </div>

            {/* Task Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Daily Checkpoints:
              </span>
              <div className="space-y-1.5">
                {day.tasks.map((task, taskIdx) => {
                  const taskKey = `${day.day}-${taskIdx}`;
                  const isDone = completedTasks[taskKey];
                  return (
                    <div
                      key={taskIdx}
                      onClick={() => toggleTask(taskKey)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200 line-through opacity-80'
                          : 'bg-slate-800/40 border-slate-800 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-600'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span>{task}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
