import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Headphones,
  Sliders,
  Send,
  RotateCcw,
  Bot,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThreeHeroScene } from '../components/ThreeHeroScene';
import { TRANSLATIONS } from '../lib/i18n';
import { cleanTextForNarration } from '../lib/speechSanitizer';

interface ChatTurn {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

export const VoiceAgentView: React.FC = () => {
  const { profile } = useAuth();
  const currentLang = profile?.preferredLanguage || 'en';
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [agentState, setAgentState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Zephyr'>('Kore');
  const [isMuted, setIsMuted] = useState(false);
  const [inputText, setInputText] = useState('');

  const [conversation, setConversation] = useState<ChatTurn[]>([
    {
      id: 'init-1',
      role: 'model',
      text: `Hello ${profile?.name || 'candidate'}! Welcome to the 24/7 AI Placement Voice Studio. I am ready to conduct interactive mock rounds, break down algorithms, or advise you on campus recruitment strategies in ${currentLang.toUpperCase()}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, agentState]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        currentLang === 'ta'
          ? 'ta-IN'
          : currentLang === 'hi'
          ? 'hi-IN'
          : currentLang === 'te'
          ? 'te-IN'
          : currentLang === 'ml'
          ? 'ml-IN'
          : currentLang === 'kn'
          ? 'kn-IN'
          : 'en-US';

      recognition.onstart = () => {
        setAgentState('listening');
      };

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          sendVoiceQuery(transcript);
        }
      };

      recognition.onerror = () => {
        setAgentState('idle');
      };

      recognition.onend = () => {
        if (agentState === 'listening') {
          setAgentState('idle');
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      stopAudio();
    };
  }, [currentLang]);

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playTTS = async (text: string) => {
    if (isMuted) return;
    stopAudio();

    const sanitized = cleanTextForNarration(text);
    if (!sanitized) return;

    setAgentState('speaking');

    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sanitized.slice(0, 450),
          voice: selectedVoice,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioData) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioData}`);
          currentAudioRef.current = audio;
          audio.onended = () => setAgentState('idle');
          audio.onerror = () => browserTTS(sanitized);
          await audio.play();
          return;
        }
      }
      browserTTS(sanitized);
    } catch {
      browserTTS(sanitized);
    }
  };

  const browserTTS = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setAgentState('idle');
      return;
    }
    const sanitized = cleanTextForNarration(text);
    if (!sanitized) {
      setAgentState('idle');
      return;
    }
    const utter = new SpeechSynthesisUtterance(sanitized);
    utter.onend = () => setAgentState('idle');
    utter.onerror = () => setAgentState('idle');
    window.speechSynthesis.speak(utter);
  };

  const startListening = () => {
    stopAudio();
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use the chat input.');
      return;
    }
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn(e);
    }
  };

  const sendVoiceQuery = async (query: string) => {
    const text = query.trim();
    if (!text) return;

    setInputText('');
    stopAudio();

    const newTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation((prev) => [...prev, newTurn]);
    setAgentState('thinking');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: conversation.slice(-6).map((c) => ({ role: c.role, content: c.text })),
          targetRole: profile?.careerInterests || 'Software Engineer',
          language: currentLang === 'en' ? 'English' : currentLang,
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'Let us continue your placement preparation!';

      const modelTurn: ChatTurn = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversation((prev) => [...prev, modelTurn]);
      playTTS(reply);
    } catch {
      const fallback = 'I am processing your query offline. Focus on consistent DSA problem solving and the STAR framework.';
      setConversation((prev) => [
        ...prev,
        {
          id: `m-err-${Date.now()}`,
          role: 'model',
          text: fallback,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setAgentState('idle');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Headphones className="w-6 h-6 text-indigo-400" />
            <span>{t('voice.title')}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">{t('voice.subtitle')}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <select
              aria-label="Select Voice"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Kore" className="bg-slate-900">Kore (Clear Female)</option>
              <option value="Puck" className="bg-slate-900">Puck (Natural Male)</option>
              <option value="Zephyr" className="bg-slate-900">Zephyr (Deep Male)</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (!isMuted) stopAudio();
              setIsMuted(!isMuted);
            }}
            className={`p-2 rounded-xl transition-colors ${
              isMuted
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3D Orb & Interactive Stage */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6">
        {/* 3D Scene Container */}
        <div className="w-64 h-64 relative flex items-center justify-center">
          <ThreeHeroScene />
        </div>

        {/* Status indicator */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                agentState === 'listening'
                  ? 'bg-emerald-400 animate-ping'
                  : agentState === 'thinking'
                  ? 'bg-amber-400 animate-pulse'
                  : agentState === 'speaking'
                  ? 'bg-cyan-400 animate-bounce'
                  : 'bg-indigo-400'
              }`}
            />
            <span>
              {agentState === 'listening'
                ? t('voice.status_listening')
                : agentState === 'thinking'
                ? t('voice.status_thinking')
                : agentState === 'speaking'
                ? t('voice.status_speaking')
                : t('voice.status_idle')}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white">
            Ask SphereAI about Coding, Aptitude, or Placement Strategy
          </h3>
        </div>

        {/* Central Big Mic Button */}
        <button
          onClick={startListening}
          className={`p-6 rounded-full transition-all duration-300 shadow-2xl ${
            agentState === 'listening'
              ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50 ring-8 ring-rose-500/20'
              : 'bg-gradient-to-tr from-indigo-600 to-cyan-500 hover:scale-105 active:scale-95 text-white shadow-indigo-600/40 ring-4 ring-indigo-500/20'
          }`}
          title="Click to speak"
        >
          {agentState === 'listening' ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        <p className="text-xs text-slate-400">
          Click the mic to speak or enter your query below
        </p>

        {/* Text Input Row */}
        <div className="w-full max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendVoiceQuery(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type here: 'Explain memory leaks in C++' or 'How to introduce myself'..."
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Transcript History */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Voice Session History
        </h4>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {conversation.map((turn) => (
            <div
              key={turn.id}
              className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                turn.role === 'user'
                  ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-100 ml-8'
                  : 'bg-slate-800/60 border-slate-700 text-slate-200 mr-8'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-bold uppercase tracking-wider text-slate-300">
                  {turn.role === 'user' ? 'Candidate' : 'SphereAI Coach'}
                </span>
                <span>{turn.time}</span>
              </div>
              {turn.role === 'user' ? (
                <p className="whitespace-pre-line">{turn.text}</p>
              ) : (
                <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-1.5">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-100">{children}</p>,
                      h1: ({ children }) => <h1 className="text-sm font-bold text-white mt-2 mb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xs font-bold text-cyan-300 mt-2 mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xs font-semibold text-indigo-300 mt-1 mb-0.5">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1.5 pl-1 text-slate-200">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1.5 pl-1 text-slate-200">{children}</ol>,
                      li: ({ children }) => <li className="text-xs sm:text-sm text-slate-200">{children}</li>,
                      code: ({ node, inline, className, children, ...props }: any) => {
                        const isInline = !Boolean(className?.includes('language-')) && !String(children).includes('\n');
                        return isInline ? (
                          <code className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[11px] border border-slate-700/60" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="p-3 my-2 rounded-xl bg-slate-950 border border-slate-700/80 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                            <code {...props}>{children}</code>
                          </pre>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-indigo-400 pl-3 my-2 italic text-slate-300 bg-slate-900/40 py-1 rounded-r text-xs">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {turn.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </div>
    </div>
  );
};
