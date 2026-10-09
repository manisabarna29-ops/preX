import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Timer,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Building2,
  Check,
} from 'lucide-react';
import { MOCK_ASSESSMENTS, MockAssessment, APTITUDE_QUESTIONS, TECHNICAL_QUESTIONS } from '../data/mockData';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

export const MockTestsView: React.FC = () => {
  const { recordQuizAttempt } = useProgress();
  const { profile } = useAuth();

  const [activeTest, setActiveTest] = useState<MockAssessment | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Pool questions for the mock test
  const testQuestions = [
    ...APTITUDE_QUESTIONS.slice(0, 4),
    ...TECHNICAL_QUESTIONS.slice(0, 4),
    ...APTITUDE_QUESTIONS.slice(4, 7),
  ];

  const currentQ = testQuestions[currentQIndex] || testQuestions[0];

  const startTest = (test: MockAssessment) => {
    setActiveTest(test);
    setCurrentQIndex(0);
    setAnswers({});
    setMarkedForReview({});
    setTimeRemaining(test.durationMinutes * 60);
    setIsTestSubmitted(false);
    setShowSubmitModal(false);
  };

  useEffect(() => {
    if (!activeTest || isTestSubmitted) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTest, isTestSubmitted]);

  const finishTest = async () => {
    setIsTestSubmitted(true);
    setShowSubmitModal(false);

    let correct = 0;
    testQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct++;
    });

    const scorePct = Math.round((correct / testQuestions.length) * 100);
    if (activeTest) {
      await recordQuizAttempt({
        category: `Mock: ${activeTest.companyTag}`,
        topic: activeTest.title,
        score: scorePct,
        totalQuestions: testQuestions.length,
        correctCount: correct,
        timeSpentSeconds: activeTest.durationMinutes * 60 - timeRemaining,
      });
    }
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="space-y-6 pb-12">
      {/* If No Test is Active: Show Test Directory */}
      {!activeTest ? (
        <>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <FileCheck2 className="w-6 h-6 text-indigo-400" />
              <span>Full-Length Campus Mock Assessments</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Timed simulations replicating exact test patterns of TCS NQT, Amazon OA, and Cognizant GenC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_ASSESSMENTS.map((test) => (
              <div
                key={test.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {test.companyTag}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5 text-cyan-400" /> {test.durationMinutes} Mins
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-indigo-200 transition-colors">
                    {test.title}
                  </h3>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-semibold text-slate-400">Sections Covered:</span>
                    {test.sections.map((sec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs text-slate-300 p-2 rounded-lg bg-slate-800/50"
                      >
                        <span>{sec.name}</span>
                        <span className="text-[11px] text-slate-400">{sec.questionCount} Qs</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => startTest(test)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Timed Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Test Active Screen */
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div>
              <h3 className="font-bold text-white text-base">{activeTest.title}</h3>
              <p className="text-xs text-slate-400">{activeTest.companyTag} Pattern Simulation</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm">
                <Timer className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>

              {!isTestSubmitted && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md"
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>

          {/* Test Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Question Workspace */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400">
                  Question {currentQIndex + 1} of {testQuestions.length}
                </span>

                <button
                  onClick={() =>
                    setMarkedForReview((prev) => ({
                      ...prev,
                      [currentQIndex]: !prev[currentQIndex],
                    }))
                  }
                  className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                    markedForReview[currentQIndex]
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {markedForReview[currentQIndex] ? '★ Marked for Review' : 'Mark for Review'}
                </button>
              </div>

              <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                {currentQ.question}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      disabled={isTestSubmitted}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentQIndex]: optIdx,
                        }))
                      }
                      className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/20'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold"
                >
                  Previous
                </button>

                <button
                  onClick={() => setCurrentQIndex((prev) => Math.min(testQuestions.length - 1, prev + 1))}
                  disabled={currentQIndex === testQuestions.length - 1}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Question Palette Sidebar */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Question Palette</h4>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {testQuestions.map((_, i) => {
                  const isAnswered = answers[i] !== undefined;
                  const isMarked = markedForReview[i];
                  const isCurrent = currentQIndex === i;

                  let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
                  if (isAnswered) badgeColor = 'bg-emerald-600 text-white border-emerald-500';
                  if (isMarked) badgeColor = 'bg-amber-500 text-white border-amber-400';
                  if (isCurrent) badgeColor += ' ring-2 ring-indigo-400';

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentQIndex(i)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${badgeColor}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Submit Confirmation / Result Modal */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
              <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4 text-slate-100">
                <h3 className="text-lg font-bold text-white">Confirm Test Submission</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You have answered {Object.keys(answers).length} out of {testQuestions.length} questions.
                  Are you ready to submit your assessment and compute placement percentile?
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Return to Test
                  </button>
                  <button
                    onClick={finishTest}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Confirm Submission
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Results Banner */}
          {isTestSubmitted && (
            <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Assessment Completed!</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Your score has been logged to your campus placement dossier. Keep your daily streak going!
              </p>

              <button
                onClick={() => setActiveTest(null)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
              >
                Return to Assessment Catalog
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
