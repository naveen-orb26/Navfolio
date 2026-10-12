'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/header';
import { HeroSection } from '@/components/sections/HeroSection';
import { BentoGrid } from '@/components/ui/bento-grid';
import { TechMatrix } from '@/components/ui/tech-matrix';
import { EducationSection } from '@/components/ui/education-section';
import { ResearchSection } from '@/components/ui/research-section';
import { ExperienceSection } from '@/components/ui/experience-section';
import { LeadershipSection } from '@/components/ui/leadership-section';
import { HobbiesSkillsSection } from '@/components/ui/hobbies-skills-section';
import { Footer } from '@/components/ui/footer';
import { ChatDialog } from '@/components/ui/chat-dialog';
import { BackgroundEffects } from '@/components/ui/background-effects';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Global command key shortcut: Ctrl+K (Windows/Linux) or Cmd+K (macOS)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsChatOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenChat = (prompt?: string) => {
    if (prompt) {
      setChatInitialPrompt(prompt);
    } else {
      setChatInitialPrompt('');
    }
    setIsChatOpen(true);
  };

  return (
    <div className="relative min-h-screen text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-violet-500/30">
      
      {/* Dynamic Minimalist Background: Blueprint Grid, Parallax Aurora Orbs, Micro-Particles & Spotlight */}
      <BackgroundEffects />

      {/* Main Content Layer (Z-10 ensures glass cards & typography render cleanly above background effects) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 1. Top Header with single AI tab & Ctrl+K indicator */}
        <Header onOpenChat={handleOpenChat} />

        {/* 2. Hero Section with Interactive Prompt Bar under Objective/Bio */}
        <HeroSection onOpenChat={handleOpenChat} isAiThinking={isAiThinking} />

        {/* 3. Featured Projects Bento Grid (Clean showcase) */}
        <BentoGrid />

        {/* 4. Technology Stack Matrix */}
        <TechMatrix />

        {/* 5. Academic Education Section */}
        <EducationSection />

        {/* 6. Research Expertise & Publications */}
        <ResearchSection />

        {/* 7. Professional Work Experience (ANU & BRFL) */}
        <ExperienceSection />

        {/* 8. Dedicated Leadership & Governance (Student Welfare & Rotaract) */}
        <LeadershipSection />

        {/* 9. Hobbies, Personal Interests & Skills */}
        <HobbiesSkillsSection />

        {/* 10. Footer */}
        <Footer />
      </div>

      {/* Interactive AI Chat Dialog Drawer */}
      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialPrompt={chatInitialPrompt}
        onStreamingChange={setIsAiThinking}
      />

    </div>
  );
}
