import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface FloatingAIWidgetProps {
  onClick: () => void;
  className?: string;
}

export const FloatingAIWidget: React.FC<FloatingAIWidgetProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-indigo-400/30 ${className}`}
      title="Open 24/7 Placement AI Voice Coach"
      aria-label="Open 24/7 AI Voice Assistant"
    >
      <div className="relative">
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300"></span>
        </span>
      </div>

      <span className="hidden sm:inline text-xs font-bold tracking-wide uppercase">
        24/7 AI Coach
      </span>
      <Sparkles className="hidden sm:inline w-3.5 h-3.5 text-cyan-200" />
    </button>
  );
};
