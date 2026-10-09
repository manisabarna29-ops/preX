import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Terminal,
  Mic2,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { ThreeHeroScene } from '../components/ThreeHeroScene';
import { useAuth } from '../context/AuthContext';

interface LandingPageViewProps {
  onEnterApp: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterApp }) => {
  const { signInWithGoogle, loginAsDemoStudent } = useAuth();

  return (
    <div className="space-y-16 pb-20">
      {/* 3D Hero Section */}
      <div className="relative min-h-[540px] rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-950 border border-indigo-500/20 p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col justify-center">
        {/* Interactive 3D Background Canvas */}
        <div className="absolute top-0 right-0 w-full lg:w-7/12 h-full opacity-70 pointer-events-auto">
          <ThreeHeroScene />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus Placement Season 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Accelerate Your Campus Placements with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-white bg-clip-text text-transparent">
              Intelligent 3D AI
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The complete placement preparation portal combining quantitative aptitude training, real-time sandboxed coding challenges, AI STAR mock interview simulations, and a 24/7 AI voice tutor.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => {
                loginAsDemoStudent();
                onEnterApp();
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore as Demo Candidate</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  onEnterApp();
                } catch {
                  loginAsDemoStudent();
                  onEnterApp();
                }
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Sign In with Google</span>
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multilingual (6 Languages)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Live Voice Synthesis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pillar Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 hover:border-indigo-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">Aptitude Arena</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Quant, logical reasoning, and verbal tests with step-by-step AI formula derivations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">Coding Sandbox</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Practice two-pointers, stacks, and DP with live testcase execution and complexity advice.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 hover:border-cyan-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
            <Mic2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">STAR Mock Interviews</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Speech-to-text behavioral and technical rounds with instant quantifiable grading.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 hover:border-purple-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">Full-Length OA Tests</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Replicate TCS NQT, Amazon Online Assessment, and Cognizant GenC placement patterns.
          </p>
        </div>
      </div>
    </div>
  );
};
