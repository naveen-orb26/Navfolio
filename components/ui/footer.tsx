'use client';

import React from 'react';
import { SITE_CONFIG } from '@/config/site-config';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { Bot, ShieldCheck, Heart, Github, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  onOpenChat: () => void;
}

export function Footer({ onOpenChat }: FooterProps) {
  return (
    <footer className="w-full border-t border-white/10 bg-[#09090b] text-zinc-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Persona Info */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 text-white font-semibold text-base font-sans">
            <Bot className="w-5 h-5 text-violet-400" />
            <span>{DEVELOPER_PROFILE.name}</span>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm">
            Autonomous AI Developer Portfolio built with Next.js 15, Vercel AI SDK, Google Gemini 2.5, and procedural Three.js.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Strictly Grounded Facts & Edge Rate-Limited</span>
          </div>
        </div>

        {/* Action Button & Links */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <button
            onClick={onOpenChat}
            className="px-4 py-2 rounded-xl bg-violet-950/60 hover:bg-violet-900/60 border border-violet-500/30 text-xs font-mono text-violet-300 hover:text-white transition-all shadow-lg"
          >
            Launch Interactive AI Persona
          </button>

          <div className="flex items-center gap-4 text-zinc-400 text-xs">
            <a
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
            <a
              href={SITE_CONFIG.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <a
              href={`mailto:${SITE_CONFIG.links.email}`}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/5 text-center text-[11px] font-mono text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} {DEVELOPER_PROFILE.name}. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Designed with dark minimalist elegance <Heart className="w-3 h-3 text-rose-500" /> Linear standard
        </span>
      </div>
    </footer>
  );
}
