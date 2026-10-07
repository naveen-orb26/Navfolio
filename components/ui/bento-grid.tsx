'use client';

import React, { useState } from 'react';
import { Project, DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { ExternalLink, Github, Sparkles, Activity, Layers, ShieldCheck } from 'lucide-react';

interface BentoGridProps {
  onSelectProjectPrompt?: (prompt: string) => void;
}

export function BentoGrid({ onSelectProjectPrompt }: BentoGridProps) {
  return (
    <section id="projects" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 font-mono text-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>Production Architecture Showcase</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
          Featured Engineering Projects
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl font-sans">
          High-performance AI platforms, procedural WebGL visualizers, and edge security guardrails built by Naveen.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
        {DEVELOPER_PROFILE.projects.map((project) => (
          <BentoCard
            key={project.id}
            project={project}
            onSelectProjectPrompt={onSelectProjectPrompt}
          />
        ))}
      </div>
    </section>
  );
}

interface BentoCardProps {
  project: Project;
  onSelectProjectPrompt?: (prompt: string) => void;
}

function BentoCard({ project, onSelectProjectPrompt }: BentoCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between p-6 rounded-3xl bg-[#121217]/80 border border-white/10 hover:border-white/20 backdrop-blur-xl overflow-hidden transition-all duration-300 shadow-xl ${project.bentoSpan || 'col-span-1 row-span-1'}`}
    >
      {/* Subtle Mouse Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.12), transparent 40%)`,
        }}
      />

      {/* Card Header & Badges */}
      <div className="relative z-10 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-violet-400 bg-violet-950/40 border border-violet-500/20 px-2.5 py-1 rounded-full">
            {project.category}
          </span>
          <div className="flex items-center gap-2 text-zinc-400">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="GitHub Repo"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors pt-2">
          {project.title}
        </h3>
        <p className="text-xs font-medium text-zinc-400 line-clamp-1">{project.tagline}</p>
        <p className="text-xs text-zinc-300 leading-relaxed pt-1">{project.description}</p>
      </div>

      {/* Card Metrics & Footer */}
      <div className="relative z-10 pt-4 flex flex-col gap-3">
        {/* Key Metrics */}
        <div className="flex flex-wrap gap-2">
          {project.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[11px] font-mono text-emerald-400"
            >
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>{metric}</span>
            </div>
          ))}
        </div>

        {/* Tech Tag Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-white/5 text-zinc-400"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Ask AI about project button */}
          {onSelectProjectPrompt && (
            <button
              onClick={() => onSelectProjectPrompt(`Tell me about ${project.title} and its architecture.`)}
              className="flex items-center gap-1 text-[11px] font-mono text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask AI</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
