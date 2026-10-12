'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { HeroPromptBar } from '@/components/ui/hero-prompt-bar';
import { RotateCcw, Radio } from 'lucide-react';

// Dynamic import for Three.js WebGL canvas to prevent SSR hydration delay (<100ms initial DOM paint)
const SceneContainer = dynamic(() => import('@/components/3d/SceneContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] flex items-center justify-center text-zinc-600 font-mono text-xs">
      <span className="animate-pulse">Loading Cyber Earth Viewport...</span>
    </div>
  ),
});

interface HeroSectionProps {
  onOpenChat: (prompt?: string) => void;
  isAiThinking?: boolean;
}

export function HeroSection({ onOpenChat, isAiThinking = false }: HeroSectionProps) {
  const [isHologramActive, setIsHologramActive] = useState(false);
  const [hologramProgress, setHologramProgress] = useState(0);

  const handleToggleHologram = () => {
    setIsHologramActive((prev) => !prev);
  };

  const handleHologramProgress = (p: number) => {
    setHologramProgress(p);
  };

  return (
    <section id="hero" className="relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* HUD Transmission Card (Positioned top-right of section, completely out of hologram figure's path) */}
      {isHologramActive && hologramProgress > 0.5 && (
        <div className="absolute top-2 right-4 sm:top-4 sm:right-6 z-40 max-w-[280px] sm:max-w-xs p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/45 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-2 mb-2 border-b border-cyan-500/20 pb-1.5">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-wider">
                UPLINK ESTABLISHED · BENGALURU NODE
              </span>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-sans mb-2.5">
            Transmission active. Welcome! I&apos;m Naveen — specializing in AI & Machine Learning, predictive optimization, and scalable software systems. Inquire with my AI agent below.
          </p>
          <button
            onClick={() => setIsHologramActive(false)}
            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-[11px] font-mono font-semibold text-cyan-200 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            [Resume Earth Orbit]
          </button>
        </div>
      )}

      {/* Two-Column Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column (Cols 1-7): High-Contrast Typography & Integrated Prompt Input Bar */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 z-10">
          
          {/* Status Badge & Hologram Quick Launch Button */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-zinc-300">
                Interactive AI Persona Online · Vercel Edge Grounded
              </span>
            </div>

            <button
              onClick={handleToggleHologram}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/35 text-xs font-mono text-cyan-300 transition-colors cursor-pointer shadow-sm"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{isHologramActive ? '[Resume Orbit]' : '[✨ Project 3D Hologram]'}</span>
            </button>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
            {DEVELOPER_PROFILE.name}
          </h1>

          <p className="text-lg sm:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 font-sans">
            {DEVELOPER_PROFILE.title}
          </p>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed font-sans">
            {DEVELOPER_PROFILE.bio}
          </p>

          {/* Hero Prompt Input Bar */}
          <div className="w-full pt-2">
            <HeroPromptBar onSubmitPrompt={onOpenChat} />
          </div>

        </div>

        {/* Right Column (Cols 8-12): Dedicated Tactile 3D Viewport with Cyber Earth & Hologram */}
        <div className="lg:col-span-5 relative w-full h-[420px] sm:h-[500px] flex items-center justify-center z-10">
          <SceneContainer
            isThinking={isAiThinking}
            isStreaming={isAiThinking}
            isHologramActive={isHologramActive}
            onToggleHologram={handleToggleHologram}
            onHologramProgress={handleHologramProgress}
            className="w-full h-full"
          />
        </div>

      </div>
    </section>
  );
}

