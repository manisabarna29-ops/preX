import React, { useState } from 'react';
import {
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Clock,
  Layers,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { CODING_PROBLEMS, CodingProblem } from '../data/mockData';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../lib/i18n';

export const CodingView: React.FC = () => {
  const { recordCodingSubmission } = useProgress();
  const { profile } = useAuth();
  const currentLang = profile?.preferredLanguage || 'en';
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [selectedProblemId, setSelectedProblemId] = useState<string>('two-sum');
  const [selectedLang, setSelectedLang] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');

  const problem = CODING_PROBLEMS.find((p) => p.id === selectedProblemId) || CODING_PROBLEMS[0];
  const [code, setCode] = useState<string>(problem.starterCode[selectedLang]);

  // When changing problem or language, update code editor
  const handleProblemChange = (prob: CodingProblem) => {
    setSelectedProblemId(prob.id);
    setCode(prob.starterCode[selectedLang]);
    setExecResult(null);
    setAiReview(null);
  };

  const handleLangChange = (lang: 'javascript' | 'python' | 'cpp' | 'java') => {
    setSelectedLang(lang);
    setCode(problem.starterCode[lang]);
    setExecResult(null);
  };

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<any | null>(null);

  // AI Review state
  const [isReviewing, setIsReviewing] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);

  const handleRunCode = async () => {
    setIsRunning(true);
    setExecResult(null);

    try {
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: selectedLang,
          testCases: problem.sampleTestCases,
        }),
      });

      const data = await response.json();
      setExecResult(data);

      // Record submission
      await recordCodingSubmission({
        problemId: problem.id,
        problemTitle: problem.title,
        language: selectedLang,
        verdict: data.verdict || 'Accepted',
        passedTests: data.passedTests || 0,
        totalTests: data.totalTests || problem.sampleTestCases.length,
      });
    } catch (e: any) {
      setExecResult({
        verdict: 'Runtime Error',
        passedTests: 0,
        totalTests: problem.sampleTestCases.length,
        executionTimeMs: 0,
        results: [{ error: e.message || 'Execution failed' }],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleRequestAiReview = async () => {
    setIsReviewing(true);
    setAiReview(null);

    try {
      const response = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          code,
          language: selectedLang,
          errorDetails: execResult?.verdict !== 'Accepted' ? execResult?.results?.[0]?.error : null,
        }),
      });

      const data = await response.json();
      setAiReview(data.review || 'Optimal approach: Review hash map two-pass vs one-pass.');
    } catch (err: any) {
      setAiReview(
        'Time Complexity: O(N), Space Complexity: O(N). Hash map approach effectively reduces brute-force O(N^2) search down to linear time.'
      );
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-emerald-400" />
            <span>{t('code.title')}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">{t('code.subtitle')}</p>
        </div>

        {/* Problem selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          {CODING_PROBLEMS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleProblemChange(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedProblemId === p.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Spec */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{problem.title}</h3>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  problem.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : problem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {problem.difficulty}
              </span>
            </div>

            {/* Company Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Asked at:</span>
              {problem.companyTags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              {problem.description}
            </div>

            {/* Constraints */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Constraints:</h4>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 font-mono">
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Code Reviewer Widget */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleRequestAiReview}
              disabled={isReviewing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-cyan-600/30 hover:from-indigo-600/40 hover:to-cyan-600/40 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>{isReviewing ? 'Analyzing Code...' : t('code.ai_review')}</span>
            </button>

            {aiReview && (
              <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-200 space-y-1.5 animate-in fade-in">
                <span className="font-bold text-cyan-300 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Interviewer Feedback & Complexity
                </span>
                <p className="whitespace-pre-line leading-relaxed text-[11px]">{aiReview}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {(['javascript', 'python', 'cpp', 'java'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLangChange(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      selectedLang === lang
                        ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCode(problem.starterCode[selectedLang])}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Reset Starter Code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Code Textarea with Mono Font */}
            <div className="relative bg-slate-950 p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-100 resize-none focus:outline-none leading-relaxed tracking-wide"
              />
            </div>

            {/* Execution Control Footer */}
            <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sandbox Limit: 2.0s</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                >
                  <Play className="w-4 h-4" />
                  <span>{isRunning ? 'Executing...' : t('code.run')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Test Case Execution Output Panel */}
          {execResult && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-sm ${
                      execResult.verdict === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    Verdict: {execResult.verdict}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({execResult.passedTests}/{execResult.totalTests} Passed)
                  </span>
                </div>

                <span className="text-xs font-mono text-slate-400">
                  Time: {execResult.executionTimeMs} ms
                </span>
              </div>

              {/* Individual Test Cases */}
              <div className="space-y-2 pt-1">
                {execResult.results?.map((res: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs font-mono flex items-start justify-between ${
                      res.passed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div>
                        <strong className="text-slate-400">Input:</strong>{' '}
                        {JSON.stringify(res.input)}
                      </div>
                      <div>
                        <strong className="text-slate-400">Expected:</strong>{' '}
                        {JSON.stringify(res.expected)}
                      </div>
                      <div>
                        <strong className="text-slate-400">Actual Output:</strong>{' '}
                        {res.error ? (
                          <span className="text-rose-400">{res.error}</span>
                        ) : (
                          JSON.stringify(res.output)
                        )}
                      </div>
                    </div>

                    {res.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
