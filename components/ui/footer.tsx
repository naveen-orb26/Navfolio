'use client';

import React from 'react';
import { SITE_CONFIG } from '@/config/site-config';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { Bot, ShieldCheck, Heart, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative w-full border-t border-white/10 bg-[#09090b]/80 backdrop-blur-md text-zinc-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Persona Info */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 text-white font-semibold text-base font-sans">
            <Bot className="w-5 h-5 text-violet-400" />
            <span>{DEVELOPER_PROFILE.name}</span>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm">
            AI & Machine Learning Engineer Portfolio powered by Next.js 15, Vercel AI SDK, Google Gemini, and procedural WebGL.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Strictly Grounded Facts & Edge Rate-Limited</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-5 text-zinc-400 text-xs">
          <a
            href={SITE_CONFIG.links.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a
            href={SITE_CONFIG.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
          <a
            href={`mailto:${SITE_CONFIG.links.email}`}
            className="hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="Send Email"
          >
            <Mail className="w-4 h-4" /> Email
          </a>
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
