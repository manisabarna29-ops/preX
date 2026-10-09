import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  db,
  doc,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import confetti from 'canvas-confetti';

export interface QuizResult {
  id: string;
  category: string;
  topic: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  createdAt: string;
}

export interface CodeSubmission {
  id: string;
  problemId: string;
  problemTitle: string;
  language: string;
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  passedTests: number;
  totalTests: number;
  createdAt: string;
}

export interface MockInterviewResult {
  id: string;
  interviewType: string;
  targetCompany?: string;
  targetRole?: string;
  overallScore: number;
  relevanceScore: number;
  structureScore: number;
  clarityScore: number;
  communicationScore: number;
  summaryFeedback: string;
  createdAt: string;
}

interface ProgressContextType {
  quizHistory: QuizResult[];
  codingHistory: CodeSubmission[];
  interviewHistory: MockInterviewResult[];
  placementReadiness: number;
  streakDays: number;
  recordQuizAttempt: (result: Omit<QuizResult, 'id' | 'createdAt'>) => Promise<void>;
  recordCodingSubmission: (sub: Omit<CodeSubmission, 'id' | 'createdAt'>) => Promise<void>;
  recordInterviewResult: (intResult: Omit<MockInterviewResult, 'id' | 'createdAt'>) => Promise<void>;
  generatePlacementReport: () => string;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Initial realistic baseline data so charts are populated immediately
const INITIAL_QUIZZES: QuizResult[] = [
  {
    id: 'init-q1',
    category: 'Quantitative Aptitude',
    topic: 'Percentages & Profit Loss',
    score: 80,
    totalQuestions: 5,
    correctCount: 4,
    timeSpentSeconds: 145,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'init-q2',
    category: 'Logical Reasoning',
    topic: 'Number Series & Coding',
    score: 100,
    totalQuestions: 4,
    correctCount: 4,
    timeSpentSeconds: 98,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'init-q3',
    category: 'Technical Fundamentals',
    topic: 'DSA & Binary Trees',
    score: 75,
    totalQuestions: 4,
    correctCount: 3,
    timeSpentSeconds: 120,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const INITIAL_CODING: CodeSubmission[] = [
  {
    id: 'init-c1',
    problemId: 'two-sum',
    problemTitle: 'Two Sum',
    language: 'javascript',
    verdict: 'Accepted',
    passedTests: 3,
    totalTests: 3,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'init-c2',
    problemId: 'valid-parentheses',
    problemTitle: 'Valid Parentheses',
    language: 'python',
    verdict: 'Accepted',
    passedTests: 3,
    totalTests: 3,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const INITIAL_INTERVIEWS: MockInterviewResult[] = [
  {
    id: 'init-i1',
    interviewType: 'HR & Behavioral',
    targetCompany: 'TCS / Infosys',
    targetRole: 'Associate Software Engineer',
    overallScore: 84,
    relevanceScore: 85,
    structureScore: 82,
    clarityScore: 88,
    communicationScore: 81,
    summaryFeedback: 'Great use of STAR framework in the project hurdle response. Crisp intro and solid confidence.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, currentUser, isDemoUser, updateProfile } = useAuth();

  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('prepsphere_quiz_history');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [codingHistory, setCodingHistory] = useState<CodeSubmission[]>(() => {
    const saved = localStorage.getItem('prepsphere_coding_history');
    return saved ? JSON.parse(saved) : INITIAL_CODING;
  });

  const [interviewHistory, setInterviewHistory] = useState<MockInterviewResult[]>(() => {
    const saved = localStorage.getItem('prepsphere_interview_history');
    return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
  });

  const [streakDays, setStreakDays] = useState<number>(4);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('prepsphere_quiz_history', JSON.stringify(quizHistory));
  }, [quizHistory]);

  useEffect(() => {
    localStorage.setItem('prepsphere_coding_history', JSON.stringify(codingHistory));
  }, [codingHistory]);

  useEffect(() => {
    localStorage.setItem('prepsphere_interview_history', JSON.stringify(interviewHistory));
  }, [interviewHistory]);

  // Calculate Placement Readiness Score
  const calculateReadiness = (): number => {
    let aptitudeScore = 75;
    if (quizHistory.length > 0) {
      const totalCorrect = quizHistory.reduce((acc, q) => acc + q.correctCount, 0);
      const totalQ = quizHistory.reduce((acc, q) => acc + q.totalQuestions, 0);
      aptitudeScore = totalQ > 0 ? (totalCorrect / totalQ) * 100 : 75;
    }

    let codingScore = 70;
    if (codingHistory.length > 0) {
      const accepted = codingHistory.filter((c) => c.verdict === 'Accepted').length;
      codingScore = Math.min(100, Math.round((accepted / Math.max(1, codingHistory.length)) * 90 + 10));
    }

    let interviewScore = 80;
    if (interviewHistory.length > 0) {
      const totalInt = interviewHistory.reduce((acc, i) => acc + i.overallScore, 0);
      interviewScore = Math.round(totalInt / interviewHistory.length);
    }

    // Weighted composite
    const calculated = Math.round(
      aptitudeScore * 0.35 + codingScore * 0.35 + interviewScore * 0.25 + Math.min(streakDays * 2, 5)
    );
    return Math.min(99, Math.max(40, calculated));
  };

  const placementReadiness = calculateReadiness();

  // Sync readiness to profile when it changes
  useEffect(() => {
    if (profile && profile.readinessScore !== placementReadiness) {
      updateProfile({ readinessScore: placementReadiness });
    }
  }, [placementReadiness]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // Ignored
    }
  };

  const recordQuizAttempt = async (result: Omit<QuizResult, 'id' | 'createdAt'>) => {
    const id = `quiz-${Date.now()}`;
    const newRecord: QuizResult = {
      ...result,
      id,
      createdAt: new Date().toISOString(),
    };
    setQuizHistory((prev) => [newRecord, ...prev]);

    if (result.score >= 80) {
      triggerCelebration();
    }

    if (currentUser && !isDemoUser) {
      try {
        const docRef = doc(db, 'quiz_attempts', id);
        await setDoc(docRef, {
          id,
          userId: currentUser.uid,
          category: result.category,
          topic: result.topic,
          score: result.score,
          totalQuestions: result.totalQuestions,
          correctCount: result.correctCount,
          timeSpentSeconds: result.timeSpentSeconds,
          createdAt: newRecord.createdAt,
        });
      } catch (err) {
        console.warn('Firestore quiz record note:', err);
      }
    }
  };

  const recordCodingSubmission = async (sub: Omit<CodeSubmission, 'id' | 'createdAt'>) => {
    const id = `code-${Date.now()}`;
    const newRecord: CodeSubmission = {
      ...sub,
      id,
      createdAt: new Date().toISOString(),
    };
    setCodingHistory((prev) => [newRecord, ...prev]);

    if (sub.verdict === 'Accepted') {
      triggerCelebration();
    }

    if (currentUser && !isDemoUser) {
      try {
        const docRef = doc(db, 'coding_submissions', id);
        await setDoc(docRef, {
          id,
          userId: currentUser.uid,
          problemId: sub.problemId,
          language: sub.language,
          verdict: sub.verdict,
          passedTests: sub.passedTests,
          totalTests: sub.totalTests,
          codeSnippet: 'User Code Snippet',
          createdAt: newRecord.createdAt,
        });
      } catch (err) {
        console.warn('Firestore coding record note:', err);
      }
    }
  };

  const recordInterviewResult = async (intResult: Omit<MockInterviewResult, 'id' | 'createdAt'>) => {
    const id = `interview-${Date.now()}`;
    const newRecord: MockInterviewResult = {
      ...intResult,
      id,
      createdAt: new Date().toISOString(),
    };
    setInterviewHistory((prev) => [newRecord, ...prev]);

    if (intResult.overallScore >= 80) {
      triggerCelebration();
    }

    if (currentUser && !isDemoUser) {
      try {
        const docRef = doc(db, 'interview_sessions', id);
        await setDoc(docRef, {
          id,
          userId: currentUser.uid,
          interviewType: intResult.interviewType,
          targetCompany: intResult.targetCompany || 'General',
          targetRole: intResult.targetRole || 'SDE',
          overallScore: intResult.overallScore,
          relevanceScore: intResult.relevanceScore,
          structureScore: intResult.structureScore,
          clarityScore: intResult.clarityScore,
          communicationScore: intResult.communicationScore,
          summaryFeedback: intResult.summaryFeedback,
          createdAt: newRecord.createdAt,
        });
      } catch (err) {
        console.warn('Firestore interview record note:', err);
      }
    }
  };

  const generatePlacementReport = (): string => {
    const studentName = profile?.name || 'Student Candidate';
    const readiness = placementReadiness;
    const reportDate = new Date().toLocaleDateString();

    return `# PREPSPHERE AI - PLACEMENT READINESS DOSSIER
Generated: ${reportDate}
Candidate: ${studentName} (${profile?.college || 'Engineering Institute'})
Degree / Dept: ${profile?.degree || 'B.Tech'} - ${profile?.department || 'CSE'}
Placement Readiness Index: ${readiness}% [${readiness >= 75 ? 'CAMPUS READY' : 'INTERMEDIATE PREP'}]

## 1. Executive Summary
- Total Aptitude Quizzes: ${quizHistory.length}
- Average Aptitude Accuracy: ${Math.round(
      quizHistory.reduce((a, b) => a + b.score, 0) / Math.max(1, quizHistory.length)
    )}%
- Coding Challenges Attempted: ${codingHistory.length}
- Solutions Accepted: ${codingHistory.filter((c) => c.verdict === 'Accepted').length}
- Mock Interviews Completed: ${interviewHistory.length}
- Average Interview Communication Score: ${Math.round(
      interviewHistory.reduce((a, b) => a + b.communicationScore, 0) / Math.max(1, interviewHistory.length)
    )}/100

## 2. Recent Technical & Interview Performance
${interviewHistory
  .slice(0, 3)
  .map(
    (i) =>
      `- [${i.interviewType}] Score: ${i.overallScore}/100 | Relevance: ${i.relevanceScore}% | Feedback: ${i.summaryFeedback}`
  )
  .join('\n')}

## 3. Recommended Next Steps
- Reinforce Dynamic Programming and Graph Traversals
- Polish STAR interview responses with quantifiable metrics
- Take 1 full-length timed mock assessment every 48 hours`;
  };

  return (
    <ProgressContext.Provider
      value={{
        quizHistory,
        codingHistory,
        interviewHistory,
        placementReadiness,
        streakDays,
        recordQuizAttempt,
        recordCodingSubmission,
        recordInterviewResult,
        generatePlacementReport,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
