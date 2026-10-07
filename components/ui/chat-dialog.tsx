'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { SITE_CONFIG } from '@/config/site-config';
import { MessageItem } from './message-item';
import { X, Send, Bot, Sparkles, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onStreamingChange?: (isStreaming: boolean) => void;
}

export function ChatDialog({
  isOpen,
  onClose,
  initialPrompt = '',
  onStreamingChange,
}: ChatDialogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    reload,
    stop,
    setMessages,
  } = useChat({
    api: '/api/chat',
    onError: (err) => {
      console.error('Chat error:', err);
      setErrorMessage(err.message || 'An error occurred during response streaming.');
    },
    onResponse: () => {
      setErrorMessage(null);
    },
  });

  // Notify parent of streaming status changes (to trigger Three.js ambient visual pulse)
  useEffect(() => {
    if (onStreamingChange) {
      onStreamingChange(isLoading);
    }
  }, [isLoading, onStreamingChange]);

  // Handle initial prompt auto-submit if passed
  useEffect(() => {
    if (isOpen && initialPrompt) {
      append({ role: 'user', content: initialPrompt });
    }
  }, [isOpen, initialPrompt]);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Keyboard shortcut Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open chat logic in parent
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-3xl h-[85vh] rounded-2xl bg-[#09090b] border border-white/15 shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialog Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#121217]/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-950/80 border border-violet-500/30 text-violet-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm text-zinc-100">Naveen's AI Advocate</h2>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Grounded
                </span>
              </div>
              <p className="text-xs text-zinc-400">Interactive persona grounded exclusively on verified resume data.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-violet-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="font-semibold text-zinc-100 text-base">Ask Naveen's AI Persona</h3>
                <p className="text-xs text-zinc-400">
                  Explore Naveen's engineering achievements, AI architectures, project metrics, or prompt security setup.
                </p>
              </div>

              <div className="w-full max-w-lg pt-4 space-y-2">
                <span className="text-[11px] font-mono text-zinc-500">Suggested Starter Prompts:</span>
                <div className="grid grid-cols-1 gap-2 text-left">
                  {SITE_CONFIG.starterPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => append({ role: 'user', content: prompt })}
                      className="px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-sans text-zinc-300 hover:text-white transition-all text-left flex items-center justify-between"
                    >
                      <span>{prompt}</span>
                      <Sparkles className="w-3 h-3 text-violet-400 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <MessageItem
                key={m.id || idx}
                role={m.role as 'user' | 'assistant'}
                content={m.content}
                isStreaming={isLoading && idx === messages.length - 1 && m.role === 'assistant'}
              />
            ))
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-200 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => reload()}
                className="flex items-center gap-1 font-mono text-[11px] underline hover:text-white"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-[#121217]">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask Naveen's AI advocate..."
              disabled={isLoading}
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
            />
            {isLoading ? (
              <button
                type="button"
                onClick={() => stop()}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
          <div className="flex items-center justify-between pt-2 px-1 text-[10px] font-mono text-zinc-400">
            <span>Powered by Vercel AI SDK & Google Gemini 2.5 Flash</span>
            <span>Press Esc to close</span>
          </div>
        </div>

      </div>
    </div>
  );
}
