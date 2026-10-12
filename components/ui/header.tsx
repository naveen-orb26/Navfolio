'use client';

import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '@/config/site-config';
import { Sparkles, Github, Linkedin } from 'lucide-react';

interface HeaderProps {
  onOpenChat: (initialPrompt?: string) => void;
}

export function Header({ onOpenChat }: HeaderProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform || ''));
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#09090b]/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-white/10 text-white shadow-inner">
            <span className="font-mono font-bold text-sm tracking-wider">BN</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-sm text-zinc-100 tracking-tight">{SITE_CONFIG.name}</span>
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">AI/ML & Full-Stack Engineer</span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
          {SITE_CONFIG.navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-zinc-100 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Controls: The Single Top Header AI Tab & Social Links */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenChat()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600/25 to-indigo-600/25 hover:from-violet-600/40 hover:to-indigo-600/40 border border-violet-500/35 hover:border-violet-400/60 text-xs text-zinc-100 hover:text-white transition-all shadow-md group cursor-pointer"
            aria-label="Open AI Persona Chat (Ctrl+K or Cmd+K)"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400 group-hover:rotate-12 transition-transform" />
            <span className="font-medium font-sans">Ask AI</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-zinc-950/80 border border-white/15 rounded text-zinc-400 group-hover:text-zinc-200">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-zinc-400">
            <a
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md hover:bg-white/[0.05] hover:text-zinc-100 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={SITE_CONFIG.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md hover:bg-white/[0.05] hover:text-zinc-100 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </header>
  );
}
