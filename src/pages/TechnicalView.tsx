import React, { useState } from 'react';
import {
  Code2,
  Database,
  Cpu,
  Network,
  Boxes,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { TECHNICAL_QUESTIONS, TechnicalQuestion } from '../data/mockData';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../lib/i18n';

export const TechnicalView: React.FC = () => {
  const { recordQuizAttempt } = useProgress();
  const { profile } = useAuth();
  const currentLang = profile?.preferredLanguage || 'en';
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [activeSubject, setActiveSubject] = useState<'All' | 'DSA' | 'DBMS' | 'OS' | 'CN' | 'OOP'>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiDeepDive, setAiDeepDive] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const filteredQuestions = TECHNICAL_QUESTIONS.filter(
    (q) => activeSubject === 'All' || q.subject === activeSubject
  );

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: idx,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    let correct = 0;
    filteredQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const scorePct = Math.round((correct / Math.max(1, filteredQuestions.length)) * 100);

    await recordQuizAttempt({
      category: 'Technical Practice',
      topic: activeSubject === 'All' ? 'Full Technical Screen' : activeSubject,
      score: scorePct,
      totalQuestions: filteredQuestions.length,
      correctCount: correct,
      timeSpentSeconds: 150,
    });
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setAiDeepDive(null);
  };

  const requestAiDeepDive = async () => {
    if (!currentQ) return;
    setLoadingAi(true);
    setAiDeepDive(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Provide a senior technical interview deep-dive for this question:
Subject: ${currentQ.subject}
Question: ${currentQ.question}
Correct Answer: ${currentQ.options[currentQ.correctIndex]}
Explain the underlying memory layout, performance trade-offs, and how a top tech company (like Google or Amazon) expects a candidate to explain this.`,
          history: [],
          targetRole: 'SDE',
          language: currentLang === 'en' ? 'English' : currentLang,
        }),
      });

      if (!response.ok) throw new Error('AI Error');
      const data = await response.json();
      setAiDeepDive(data.reply);
    } catch (e) {
      setAiDeepDive(
        `Technical Deep-Dive: ${currentQ.explanation}. Always remember the time/space constraints when asked in technical rounds.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  const subjects = [
    { id: 'All', label: 'All Subjects', icon: Code2 },
    { id: 'DSA', label: 'Data Structures & Algo', icon: Boxes },
    { id: 'DBMS', label: 'DBMS & SQL', icon: Database },
    { id: 'OS', label: 'Operating Systems', icon: Cpu },
    { id: 'CN', label: 'Computer Networks', icon: Network },
    { id: 'OOP', label: 'OOP & Architecture', icon: Code2 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <Code2 className="w-6 h-6 text-indigo-400" />
          <span>{t('tech.title')}</span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">{t('tech.subtitle')}</p>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
        {subjects.map((s) => {
          const Icon = s.icon;
          const isActive = activeSubject === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                setActiveSubject(s.id as any);
                handleReset();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      {filteredQuestions.length > 0 && currentQ ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400">
                {currentQ.subject}
              </span>
              <span className="text-xs text-slate-400">
                Topic: <strong className="text-slate-200">{currentQ.topic}</strong>
              </span>
            </div>

            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {currentQ.difficulty}
            </span>
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
            {currentQ.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              const isCorrect = isSubmitted && optIdx === currentQ.correctIndex;
              const isWrong = isSubmitted && isSelected && optIdx !== currentQ.correctIndex;

              let btnStyle = 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200';
              if (isSelected && !isSubmitted) {
                btnStyle = 'bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/30';
              } else if (isCorrect) {
                btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
              } else if (isWrong) {
                btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 ring-2 ring-rose-500/30';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(optIdx)}
                  disabled={isSubmitted}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isSubmitted && isWrong && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isSubmitted && (
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Explanation
              </span>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* AI Deep Dive Box */}
          {aiDeepDive && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                <Sparkles className="w-4 h-4" />
                <span>SphereAI Technical Deep Dive</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed">{aiDeepDive}</p>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={requestAiDeepDive}
              disabled={loadingAi}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{loadingAi ? 'Synthesizing...' : 'Ask AI Technical Deep Dive'}</span>
            </button>

            <div className="flex items-center gap-3">
              {currentIndex < filteredQuestions.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => prev + 1);
                    setAiDeepDive(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                !isSubmitted && (
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                  >
                    Submit Technical Test
                  </button>
                )
              )}

              {isSubmitted && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Assessment</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
          No technical questions found for this subject.
        </div>
      )}
    </div>
  );
};
