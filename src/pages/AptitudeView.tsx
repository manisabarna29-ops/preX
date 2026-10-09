import React, { useState, useEffect } from 'react';
import {
  Brain,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Filter,
} from 'lucide-react';
import { APTITUDE_QUESTIONS, AptitudeQuestion } from '../data/mockData';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../lib/i18n';

export const AptitudeView: React.FC = () => {
  const { recordQuizAttempt } = useProgress();
  const { profile } = useAuth();
  const currentLang = profile?.preferredLanguage || 'en';
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'quant' | 'logical' | 'verbal'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Filtered pool
  const filteredQuestions = APTITUDE_QUESTIONS.filter((q) => {
    const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesCat && matchesDiff;
  });

  const activeQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Timer countdown
  useEffect(() => {
    if (isQuizSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isQuizSubmitted]);

  const handleSelectOption = (index: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: index,
    }));
  };

  const handleSubmitQuiz = async () => {
    setIsQuizSubmitted(true);
    let correct = 0;
    filteredQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const scorePct = Math.round((correct / Math.max(1, filteredQuestions.length)) * 100);
    await recordQuizAttempt({
      category: selectedCategory === 'all' ? 'Comprehensive Aptitude' : selectedCategory.toUpperCase(),
      topic: activeQuestion?.topic || 'General Aptitude',
      score: scorePct,
      totalQuestions: filteredQuestions.length,
      correctCount: correct,
      timeSpentSeconds: 180 - timeRemaining,
    });
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setCurrentIndex(0);
    setTimeRemaining(180);
    setAiExplanation(null);
  };

  const askAiExplanation = async () => {
    if (!activeQuestion) return;
    setIsAiExplaining(true);
    setAiExplanation(null);

    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          options: activeQuestion.options,
          selectedAnswer:
            selectedAnswers[currentIndex] !== undefined
              ? activeQuestion.options[selectedAnswers[currentIndex]]
              : 'Not answered',
          correctAnswer: activeQuestion.options[activeQuestion.correctIndex],
          topic: activeQuestion.topic,
          category: activeQuestion.category,
          language: currentLang === 'en' ? 'English' : currentLang,
        }),
      });

      if (!response.ok) throw new Error('Failed to get explanation');
      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch (err) {
      setAiExplanation(
        `AI Explanation: The correct answer is "${activeQuestion.options[activeQuestion.correctIndex]}". Concept: ${activeQuestion.explanation}`
      );
    } finally {
      setIsAiExplaining(false);
    }
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/50 border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-indigo-400" />
            <span>{t('apt.title')}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">{t('apt.subtitle')}</p>
        </div>

        {/* Timer Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-mono text-sm self-start sm:self-auto">
          <Timer className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-slate-400 uppercase ml-1">Left</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'quant', 'logical', 'verbal'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'all'
                ? t('apt.all')
                : cat === 'quant'
                ? t('apt.quant')
                : cat === 'logical'
                ? t('apt.logical')
                : t('apt.verbal')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">{t('apt.difficulty')}:</span>
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff);
                handleReset();
              }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-slate-700 text-indigo-300 font-bold border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      {filteredQuestions.length > 0 && activeQuestion ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          {/* Question Index & Meta */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Topic: <span className="text-slate-200">{activeQuestion.topic}</span>
              </span>
            </div>

            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                activeQuestion.difficulty === 'Beginner'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : activeQuestion.difficulty === 'Intermediate'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {activeQuestion.difficulty}
            </span>
          </div>

          {/* Question Prompt */}
          <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
            {activeQuestion.question}
          </p>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {activeQuestion.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              const isCorrect = isQuizSubmitted && optIdx === activeQuestion.correctIndex;
              const isWrong = isQuizSubmitted && isSelected && optIdx !== activeQuestion.correctIndex;

              let btnStyle = 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 text-slate-200';
              if (isSelected && !isQuizSubmitted) {
                btnStyle = 'bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/30';
              } else if (isCorrect) {
                btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
              } else if (isWrong) {
                btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 ring-2 ring-rose-500/30';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isQuizSubmitted}
                  className={`p-4 rounded-xl border text-left text-sm font-medium transition-all duration-150 flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isQuizSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isQuizSubmitted && isWrong && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Formula Hint if available */}
          {activeQuestion.formulaHint && (
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-indigo-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                <strong>Quick Formula Hint:</strong> {activeQuestion.formulaHint}
              </span>
            </div>
          )}

          {/* AI Explanation Box */}
          {aiExplanation && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                <Sparkles className="w-4 h-4" />
                <span>SphereAI Step-by-Step Derivation</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed">{aiExplanation}</p>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={askAiExplanation}
              disabled={isAiExplaining}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAiExplaining ? 'Analyzing...' : t('apt.ask_ai')}</span>
            </button>

            <div className="flex items-center gap-3">
              {currentIndex > 0 && (
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => Math.max(0, prev - 1));
                    setAiExplanation(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Previous
                </button>
              )}

              {currentIndex < filteredQuestions.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1));
                    setAiExplanation(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
                >
                  <span>{t('apt.next')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                !isQuizSubmitted && (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-colors"
                  >
                    {t('apt.submit')}
                  </button>
                )
              )}

              {isQuizSubmitted && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
          No questions match the current filters. Please reset filters.
        </div>
      )}
    </div>
  );
};
