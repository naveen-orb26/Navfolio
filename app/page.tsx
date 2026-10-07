'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { Header } from '@/components/ui/header';
import { HeroPromptBar } from '@/components/ui/hero-prompt-bar';
import { BentoGrid } from '@/components/ui/bento-grid';
import { TechMatrix } from '@/components/ui/tech-matrix';
import { ExperienceSection } from '@/components/ui/experience-section';
import { Footer } from '@/components/ui/footer';
import { ChatDialog } from '@/components/ui/chat-dialog';
import { Sparkles, Terminal, ShieldCheck, ArrowUpRight, Cpu } from 'lucide-react';

// Dynamic import for Three.js WebGL canvas to prevent SSR hydration delay (<100ms initial DOM paint)
const SceneContainer = dynamic(() => import('@/components/3d/SceneContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center text-zinc-600 font-mono text-xs">
      <span className="animate-pulse">Loading WebGL Mesh...</span>
    </div>
  ),
});

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleOpenChat = (prompt?: string) => {
    if (prompt) {
      setChatInitialPrompt(prompt);
    } else {
      setChatInitialPrompt('');
    }
    setIsChatOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-violet-500/30">
      
      {/* Persistent Navigation Header */}
      <Header onOpenChat={handleOpenChat} />

      {/* Hero Section with Ambient Three.js 3D Background */}
      <section id="hero" className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Procedural 3D WebGL Background Canvas */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen flex items-center justify-center">
          <SceneContainer isThinking={isAiThinking} isStreaming={isAiThinking} className="w-full h-full" />
        </div>

        {/* Hero Content Layer */}
        <div className="relative z-10 flex flex-col items-center space-y-6 max-w-4xl">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-zinc-300">
              Interactive AI Persona Online · Vercel Edge Grounded
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
            {DEVELOPER_PROFILE.name}
          </h1>

          <p className="text-lg sm:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 max-w-2xl font-sans">
            {DEVELOPER_PROFILE.title}
          </p>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed font-sans">
            {DEVELOPER_PROFILE.bio}
          </p>

          {/* Hero Prompt Bar */}
          <div className="w-full pt-4">
            <HeroPromptBar onSubmitPrompt={handleOpenChat} />
          </div>

        </div>

      </section>

      {/* Bento Grid Projects Showcase */}
      <BentoGrid onSelectProjectPrompt={handleOpenChat} />

      {/* Technology Stack Matrix */}
      <TechMatrix onSelectSkillPrompt={handleOpenChat} />

      {/* Verified Experience & Leadership */}
      <ExperienceSection />

      {/* Interactive Floating AI Agent Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => handleOpenChat()}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs shadow-2xl border border-white/20 backdrop-blur-xl group transition-all transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-amber-300" />
          <span className="font-mono">Chat with AI Agent</span>
        </button>
      </div>

      {/* Interactive AI Chat Dialog Drawer */}
      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialPrompt={chatInitialPrompt}
        onStreamingChange={setIsAiThinking}
      />

      {/* Footer */}
      <Footer onOpenChat={() => handleOpenChat()} />

    </div>
  );
}
