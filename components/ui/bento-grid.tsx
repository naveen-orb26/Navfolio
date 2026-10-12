'use client';

import React, { useState } from 'react';
import { Project, DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { ExternalLink, Github, Activity, Layers, ShieldCheck, Lock } from 'lucide-react';

export function BentoGrid() {
  return (
    <section id="projects" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Ambient Section Nebula */}
      <div 
        className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-10 -left-20 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.06) 50%, transparent 70%)' }}
      />

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
          Autonomous microgrid engines, industrial manufacturing ERPs, hyperspectral vision pipelines, and physical ML models.
        </p>
      </div>

      {/* Bento Grid Layout - Balanced min-height per row so nothing gets cut off */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[350px]">
        {DEVELOPER_PROFILE.projects.map((project) => (
          project.id === 'fluxmind-der-engine' ? (
            <FluxMindHeroCard key={project.id} project={project} />
          ) : (
            <BentoCard key={project.id} project={project} />
          )
        ))}
      </div>
    </section>
  );
}

interface BentoCardProps {
  project: Project;
}

/**
 * Flagship Hero Card for FluxMind with live UI preview screenshot
 */
function FluxMindHeroCard({ project }: BentoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#121217]/90 border border-white/10 hover:border-violet-500/50 backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden ${
        project.bentoSpan || 'col-span-1 md:col-span-2 row-span-2'
      }`}
    >
      {/* Dynamic Ambient Gradient on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-violet-600/15 via-indigo-600/5 to-transparent transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Header: Badges & Links */}
      <div className="flex items-center justify-between z-10 shrink-0 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-medium tracking-wider text-violet-400 bg-violet-950/40 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
            {project.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-2.5 h-2.5" />
            Flagship Architecture
          </span>
        </div>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-colors"
              aria-label={`${project.title} GitHub repository`}
              title="View repository on GitHub"
            >
              <Github className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-[11px]">GitHub</span>
            </a>
          )}
          {project.liveUrl && project.liveUrl !== '#' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-100 border border-emerald-500/30 hover:border-emerald-500/50 text-xs font-mono transition-all shadow-sm"
              aria-label={`${project.title} Live Application`}
              title="Visit live application"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium">Live App</span>
            </a>
          )}
        </div>
      </div>

      {/* Title, Tagline & Description */}
      <div className="z-10 space-y-1.5 mb-3">
        <div>
          <h3 className="font-bold text-xl sm:text-2xl text-zinc-100 tracking-tight font-sans group-hover:text-violet-200 transition-colors">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-violet-400/90 font-mono pt-0.5">
            {project.tagline}
          </p>
        </div>
        <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-sans line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Featured UI Preview Window (FluxMind.png) */}
      <div className="z-10 my-auto w-full py-1">
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="block group/preview relative rounded-xl border border-white/10 hover:border-emerald-500/40 bg-zinc-950/80 overflow-hidden shadow-2xl transition-all duration-300"
          title="Open FluxMind Live Interactive App"
        >
          {/* Window Chrome Titlebar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-white/10 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/70" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
              <span className="text-[10px] text-zinc-400 font-mono ml-2 hidden sm:inline">flux-mind-ten.vercel.app</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>DER Dispatch Active</span>
            </div>
          </div>

          {/* High-Res Dashboard Screenshot */}
          <div className="relative aspect-[16/7.8] w-full overflow-hidden bg-zinc-950">
            <img
              src="/FluxMind.png"
              alt="FluxMind Community Energy & Grid Orchestrator Dashboard"
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/preview:scale-[1.02]"
              loading="lazy"
            />
            {/* Subtle Gradient & Hover Action Pill */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-end justify-center pb-2.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-mono backdrop-blur-md shadow-lg">
                Launch Live Digital Twin <ExternalLink className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </a>
      </div>

      {/* Bottom Section: Metrics & Tech Chips (Never Cut Off) */}
      <div className="space-y-2.5 z-10 pt-3 mt-auto shrink-0 border-t border-white/10">
        {/* Metric Highlights */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {project.metrics.map((metric, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-200 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded-md"
              >
                <Activity className="w-3 h-3 text-cyan-400 shrink-0" />
                {metric}
              </span>
            ))}
          </div>
        )}

        {/* Tech Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {project.tech.map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-white/10 text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Standard Bento Card with reliable vertical flow, no clipping
 */
function BentoCard({ project }: BentoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#121217]/80 border border-white/10 hover:border-violet-500/40 backdrop-blur-xl shadow-xl transition-all duration-300 min-h-[340px] overflow-hidden ${
        project.bentoSpan || 'col-span-1'
      }`}
    >
      {/* Subtle Dynamic Ambient Gradient Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Card Header: Category & External Links */}
      <div className="flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-medium tracking-wider text-violet-400 bg-violet-950/40 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
            {project.category}
          </span>
          {project.featured && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-2.5 h-2.5" />
              Verified Core
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {project.isPrivate && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] text-zinc-400 border border-white/5 text-xs font-mono"
              title="Private proprietary repository"
            >
              <Lock className="w-3 h-3 text-zinc-500" />
              <span className="text-[11px]">Private</span>
            </span>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-colors"
              aria-label={`${project.title} GitHub repository`}
              title="View repository on GitHub"
            >
              <Github className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-[11px]">GitHub</span>
            </a>
          )}
          {project.liveUrl && project.liveUrl !== '#' && (
            <a
              href={project.liveUrl}
              target={project.liveUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-100 border border-emerald-500/30 hover:border-emerald-500/50 text-xs font-mono transition-all shadow-sm"
              aria-label={`${project.title} Live Application`}
              title="Visit live application"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium">Live App</span>
            </a>
          )}
        </div>
      </div>

      {/* Card Middle: Title, Tagline & Description */}
      <div className="my-auto py-3 space-y-1.5 z-10 flex-1 flex flex-col justify-center">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-zinc-100 tracking-tight font-sans group-hover:text-violet-200 transition-colors">
            {project.title}
          </h3>
          <p className="text-xs font-medium text-violet-400/90 font-mono pt-0.5">
            {project.tagline}
          </p>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Card Footer: Metrics & Tech Badges (Always Pinned to Bottom, Zero Clipping) */}
      <div className="space-y-2 z-10 pt-3 border-t border-white/10 shrink-0 mt-auto">
        {/* Metric Highlights Pill */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {project.metrics.map((metric, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-zinc-300 bg-white/[0.04] border border-white/5 px-2 py-0.5 rounded-md"
              >
                <Activity className="w-3 h-3 text-cyan-400 shrink-0" />
                {metric}
              </span>
            ))}
          </div>
        )}

        {/* Tech Tag Chips */}
        <div className="flex flex-wrap items-center gap-1 pt-1">
          {project.tech.map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-white/10 text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
