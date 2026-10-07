'use client';

import React, { useState } from 'react';
import { SITE_CONFIG } from '@/config/site-config';
import { Sparkles, ArrowRight, Bot, ShieldCheck, Zap } from 'lucide-react';

interface HeroPromptBarProps {
  onSubmitPrompt: (prompt: string) => void;
}

export function HeroPromptBar({ onSubmitPrompt }: HeroPromptBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmitPrompt(input.trim());
    setInput('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {/* Interactive Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full rounded-2xl bg-[#121217]/90 border border-white/15 p-2 shadow-2xl backdrop-blur-xl focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all group"
      >
        <div className="pl-3 pr-2 text-violet-400">
          <Bot className="w-5 h-5 group-focus-within:animate-pulse" />
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Naveen's AI Advocate anything (e.g., 'What are his core AI skills?')"
          className="w-full bg-transparent px-2 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span>Ask AI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick Starter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span className="text-[11px] font-mono text-zinc-500 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Starter Prompts:
        </span>
        {SITE_CONFIG.starterPrompts.slice(0, 4).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSubmitPrompt(prompt)}
            className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-violet-500/30 text-xs font-sans text-zinc-300 hover:text-white transition-all text-left truncate max-w-[260px] sm:max-w-none"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Grounding Badges */}
      <div className="flex items-center justify-center gap-6 pt-3 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strictly Grounded Resume Facts</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>20 req/hr Sliding Window Edge Defense</span>
        </div>
      </div>
    </div>
  );
}
