import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  X,
  Bot,
  User,
  RefreshCw,
  Sliders,
  AudioLines,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../lib/i18n';
import { cleanTextForNarration } from '../lib/speechSanitizer';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface AIVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const AIVoiceAssistantModal: React.FC<AIVoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  initialPrompt = '',
}) => {
  const { profile } = useAuth();
  const currentLang = profile?.preferredLanguage || 'en';
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Hello ${profile?.name || 'there'}! I'm SphereAI, your 24/7 placement voice tutor. You can speak or type in ${currentLang.toUpperCase()} to ask about quantitative formulas, DSA, coding bugs, or mock interview answers!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [agentState, setAgentState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Zephyr'>('Kore');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentState]);

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt && isOpen) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Setup Web Speech API for voice recognition
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
        setIsListening(true);
        setAgentState('listening');
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setIsListening(false);
          sendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
        setIsListening(false);
        setAgentState('idle');
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access blocked. Please enable mic permissions or type your question.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (agentState === 'listening') {
          setAgentState('idle');
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopAudioPlayback();
    };
  }, [currentLang]);

  const toggleMic = () => {
    stopAudioPlayback();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setAgentState('idle');
    } else {
      if (!recognitionRef.current) {
        setErrorMsg('Web Speech recognition is not supported in this browser. Please use text input.');
        return;
      }
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start caught:', e);
      }
    }
  };

  const stopAudioPlayback = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Play TTS audio using Gemini TTS API or browser synthesis
  const speakText = async (text: string) => {
    if (isMuted) return;
    stopAudioPlayback();

    // Robust response-processing layer: sanitize LaTeX, code blocks, and markdown before feeding to voice engine
    const sanitizedSpeech = cleanTextForNarration(text);
    if (!sanitizedSpeech) return;

    setAgentState('speaking');

    try {
      // First attempt server Gemini Flash TTS
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sanitizedSpeech.slice(0, 450),
          voice: selectedVoice,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioData) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioData}`);
          currentAudioRef.current = audio;
          audio.onended = () => setAgentState('idle');
          audio.onerror = () => {
            // Fallback to browser synthesis
            fallbackBrowserTTS(sanitizedSpeech);
          };
          await audio.play();
          return;
        }
      }
      // If server TTS returns non-ok or missing data, use browser synthesis fallback
      fallbackBrowserTTS(sanitizedSpeech);
    } catch (e) {
      fallbackBrowserTTS(sanitizedSpeech);
    }
  };

  const fallbackBrowserTTS = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setAgentState('idle');
      return;
    }
    // Automatically sanitize raw LaTeX, markdown symbols, and code blocks for Web Speech API
    const sanitizedSpeech = cleanTextForNarration(text);
    if (!sanitizedSpeech) {
      setAgentState('idle');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sanitizedSpeech);
    utterance.rate = 1.0;
    utterance.onend = () => setAgentState('idle');
    utterance.onerror = () => setAgentState('idle');
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (contentToSend: string) => {
    const text = contentToSend.trim();
    if (!text) return;

    setInputVal('');
    stopAudioPlayback();

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setAgentState('thinking');
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          targetRole: profile?.careerInterests || 'Software Development Engineer',
          language: currentLang === 'en' ? 'English' : currentLang,
        }),
      });

      if (!response.ok) {
        throw new Error('Server AI responded with an error');
      }

      const data = await response.json();
      const replyText = data.reply || 'I am ready to help with your placement queries!';

      const modelMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
      speakText(replyText);
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      const fallbackReply = `I am currently analyzing your placement query offline. For placement exams: 1. Keep aptitude formulas fresh. 2. Practice O(N) DSA patterns. 3. Structure interview responses using the STAR method (Situation, Task, Action, Result).`;
      const modelMsg: Message = {
        id: `ai-fallback-${Date.now()}`,
        role: 'model',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, modelMsg]);
      setAgentState('idle');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[650px] max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              {agentState !== 'idle' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">SphereAI Voice Coach</h3>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  24/7 Placement Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {agentState === 'listening'
                  ? 'Listening to microphone...'
                  : agentState === 'thinking'
                  ? 'Generating reasoning with Gemini...'
                  : agentState === 'speaking'
                  ? 'Speaking response...'
                  : 'Ready • Voice & Text Multi-modal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Select */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-lg text-xs text-slate-300 border border-slate-700">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <select
                aria-label="Select AI Voice"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as any)}
                className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Kore" className="bg-slate-900">Kore (Clear Female)</option>
                <option value="Puck" className="bg-slate-900">Puck (Natural Male)</option>
                <option value="Zephyr" className="bg-slate-900">Zephyr (Deep Male)</option>
              </select>
            </div>

            {/* Mute Toggle */}
            <button
              onClick={() => {
                if (!isMuted) stopAudioPlayback();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isMuted
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={() => {
                stopAudioPlayback();
                if (isListening) recognitionRef.current?.stop();
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Wave Visualizer Strip */}
        <div className="px-6 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                agentState === 'listening'
                  ? 'bg-emerald-400 animate-ping'
                  : agentState === 'thinking'
                  ? 'bg-amber-400 animate-pulse'
                  : agentState === 'speaking'
                  ? 'bg-cyan-400 animate-bounce'
                  : 'bg-slate-500'
              }`}
            />
            <span className="text-slate-300 font-medium capitalize">
              Status: {agentState}
            </span>
          </div>

          {/* Soundwave Bars Simulation */}
          <div className="flex items-center gap-1 h-4">
            {[4, 8, 14, 10, 16, 6, 12, 5].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  agentState === 'speaking' || agentState === 'listening'
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-slate-700'
                }`}
                style={{
                  height: agentState === 'speaking' ? `${(h * 1.5) % 18 + 4}px` : `${h}px`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>

          <span className="text-slate-400 text-[11px]">
            Target Role: {profile?.careerInterests?.slice(0, 24) || 'SDE'}
          </span>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mx-6 mt-3 px-3 py-2 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-none'
                }`}
              >
                {m.role === 'user' ? (
                  <p className="whitespace-pre-line">{m.content}</p>
                ) : (
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-2">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-100">{children}</p>,
                        h1: ({ children }) => <h1 className="text-sm font-bold text-white mt-2.5 mb-1">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xs font-bold text-cyan-300 mt-2 mb-1 uppercase tracking-wide">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xs font-semibold text-indigo-300 mt-1.5 mb-0.5">{children}</h3>,
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
                      {m.content}
                    </ReactMarkdown>
                  </div>
                )}
                <div
                  className={`mt-1 text-[10px] flex items-center gap-1.5 ${
                    m.role === 'user' ? 'text-indigo-200 justify-end' : 'text-slate-400'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.role === 'model' && (
                    <button
                      onClick={() => speakText(m.content)}
                      className="hover:text-cyan-300 ml-1"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {agentState === 'thinking' && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 rounded-tl-none text-slate-400 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>SphereAI is reasoning through your query...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input & Voice Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputVal);
            }}
            className="flex items-center gap-2"
          >
            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-xl transition-all shadow-md ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40 ring-4 ring-rose-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
              title={isListening ? 'Click to stop listening' : 'Click to speak to SphereAI'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to microphone... Speak clearly.'
                  : 'Type or speak: "Explain Dijkstra algorithm" or "HR STAR practice"...'
              }
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputVal.trim() || agentState === 'thinking'}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl transition-colors shadow-md shadow-indigo-600/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Prompt Chips */}
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400 scrollbar-none pb-1">
            <span className="shrink-0 text-slate-500">Quick Prompts:</span>
            <button
              type="button"
              onClick={() => sendMessage('Give me a 60-second shortcut for Profit & Loss percentages.')}
              className="shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 hover:text-slate-200 rounded-md border border-slate-700 transition-colors"
            >
              Profit & Loss Shortcut
            </button>
            <button
              type="button"
              onClick={() => sendMessage('How do I structure the STAR method for a difficult project?')}
              className="shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 hover:text-slate-200 rounded-md border border-slate-700 transition-colors"
            >
              STAR Interview Framework
            </button>
            <button
              type="button"
              onClick={() => sendMessage('Explain the difference between Process and Thread in OS.')}
              className="shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 hover:text-slate-200 rounded-md border border-slate-700 transition-colors"
            >
              OS: Process vs Thread
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
