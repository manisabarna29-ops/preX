import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Brain,
  Code2,
  Terminal,
  Mic2,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  BarChart2,
  Database,
} from 'lucide-react';
import { APTITUDE_QUESTIONS, TECHNICAL_QUESTIONS, CODING_PROBLEMS, INTERVIEW_TRACKS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export const AdminView: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'aptitude' | 'technical' | 'coding' | 'students'>('overview');

  const [aptitudeList, setAptitudeList] = useState(APTITUDE_QUESTIONS);
  const [showAddAptitude, setShowAddAptitude] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    topic: '',
    difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctIndex: 0,
    explanation: '',
  });

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `admin-q-${Date.now()}`,
      category: 'quant' as const,
      topic: newQuestion.topic || 'Quantitative General',
      difficulty: newQuestion.difficulty,
      question: newQuestion.question,
      options: [newQuestion.optionA, newQuestion.optionB, newQuestion.optionC, newQuestion.optionD],
      correctIndex: Number(newQuestion.correctIndex),
      explanation: newQuestion.explanation,
    };
    setAptitudeList([created, ...aptitudeList]);
    setShowAddAptitude(false);
    setNewQuestion({
      topic: '',
      difficulty: 'Intermediate',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctIndex: 0,
      explanation: '',
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setAptitudeList(aptitudeList.filter((q) => q.id !== id));
  };

  const sampleStudents = [
    { name: 'Arjun Sharma', email: 'arjun@campus.edu', college: 'NIT', role: 'student', readiness: 78, attempts: 14 },
    { name: 'Priya Narayanan', email: 'priya.n@campus.edu', college: 'IIT Madras', role: 'student', readiness: 86, attempts: 22 },
    { name: 'Rahul Varma', email: 'rahul.v@campus.edu', college: 'Anna University', role: 'student', readiness: 71, attempts: 11 },
    { name: 'Sneha Patel', email: 'sneha.p@campus.edu', college: 'BITS Pilani', role: 'student', readiness: 92, attempts: 29 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              Administrator Console
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            <span>Placement Platform Management</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Manage question banks, review registered candidate cohorts, and track aggregate metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
            Current User: <strong className="text-purple-300">{profile?.role?.toUpperCase()}</strong>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
        {[
          { id: 'overview', label: 'Platform Overview', icon: BarChart2 },
          { id: 'aptitude', label: `Aptitude Bank (${aptitudeList.length})`, icon: Brain },
          { id: 'technical', label: `Technical MCQs (${TECHNICAL_QUESTIONS.length})`, icon: Code2 },
          { id: 'coding', label: `Coding Problems (${CODING_PROBLEMS.length})`, icon: Terminal },
          { id: 'students', label: `Candidate Roster (${sampleStudents.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <span className="text-xs text-slate-400 block">Total Active Students</span>
              <span className="text-3xl font-extrabold text-white mt-1">1,482</span>
              <span className="text-[11px] text-emerald-400 mt-1 block">+18% this month</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <span className="text-xs text-slate-400 block">Questions Practiced</span>
              <span className="text-3xl font-extrabold text-white mt-1">42,910</span>
              <span className="text-[11px] text-cyan-400 mt-1 block">Aptitude & Technical</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <span className="text-xs text-slate-400 block">Mock Interviews Conducted</span>
              <span className="text-3xl font-extrabold text-white mt-1">3,120</span>
              <span className="text-[11px] text-purple-400 mt-1 block">STAR Framework AI Graded</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <span className="text-xs text-slate-400 block">Average Cohort Readiness</span>
              <span className="text-3xl font-extrabold text-white mt-1">79.4%</span>
              <span className="text-[11px] text-amber-400 mt-1 block">Day-1 Campus Ready</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span>Cloud Database Synchronization Status</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Firebase Firestore is operational with enterprise read/write rules. Security schema adheres strictly to ABAC rules for candidate isolation, encrypted attributes, and zero client delegation.
            </p>
          </div>
        </div>
      )}

      {/* Aptitude Question Bank Tab */}
      {activeTab === 'aptitude' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Live Aptitude Question Pool</h3>
            <button
              onClick={() => setShowAddAptitude(!showAddAptitude)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddAptitude ? 'Cancel' : 'Add New Question'}</span>
            </button>
          </div>

          {showAddAptitude && (
            <form
              onSubmit={handleAddQuestion}
              className="p-6 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-4 animate-in fade-in"
            >
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                Create New Aptitude Question
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Topic (e.g. Permutations & Combinations)"
                  value={newQuestion.topic}
                  onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                  className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                  className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <textarea
                placeholder="Question text..."
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Option A"
                  value={newQuestion.optionA}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Option B"
                  value={newQuestion.optionB}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Option C"
                  value={newQuestion.optionC}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Option D"
                  value={newQuestion.optionD}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Correct Answer Index:</label>
                  <select
                    value={newQuestion.correctIndex}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctIndex: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value={0}>Option A (0)</option>
                    <option value={1}>Option B (1)</option>
                    <option value={2}>Option C (2)</option>
                    <option value={3}>Option D (3)</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Explanation derivation..."
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white self-end"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Save Question to Bank
              </button>
            </form>
          )}

          <div className="space-y-3">
            {aptitudeList.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                      {q.topic}
                    </span>
                    <span className="text-[10px] text-slate-400">{q.difficulty}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-200">{q.question}</p>
                  <p className="text-[11px] text-slate-400">
                    Correct: <strong>{q.options[q.correctIndex]}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Roster Tab */}
      {activeTab === 'students' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white">Registered Placement Candidates</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">College</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Readiness Index</th>
                  <th className="py-2.5 px-3">Assessments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sampleStudents.map((st, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{st.name}</div>
                      <div className="text-[10px] text-slate-400">{st.email}</div>
                    </td>
                    <td className="py-2.5 px-3">{st.college}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px]">
                        {st.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">{st.readiness}%</td>
                    <td className="py-2.5 px-3 text-slate-400">{st.attempts} attempts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Technical and Coding overview tabs */}
      {(activeTab === 'technical' || activeTab === 'coding') && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white">
            {activeTab === 'technical' ? 'Technical Subject Bank' : 'Coding Challenge Bank'}
          </h3>
          <p className="text-xs text-slate-400">
            All challenges support dynamic evaluation with sandboxed test runners and time limits.
          </p>
          <div className="space-y-2">
            {(activeTab === 'technical' ? TECHNICAL_QUESTIONS : CODING_PROBLEMS).map((item: any) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-white">{item.topic || item.title}</h4>
                  <p className="text-[11px] text-slate-400">{item.question || item.description?.slice(0, 100)}...</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                  {item.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
