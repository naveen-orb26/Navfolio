'use client';

import React, { useState } from 'react';
import { Project, DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { ExternalLink, Github, Activity, Layers, ShieldCheck } from 'lucide-react';

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

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
        {DEVELOPER_PROFILE.projects.map((project) => (
          <BentoCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}

interface BentoCardProps {
  project: Project;
}

function BentoCard({ project }: BentoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#121217]/80 border border-white/10 hover:border-violet-500/40 backdrop-blur-xl shadow-xl transition-all duration-300 overflow-hidden ${
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
      <div className="flex items-center justify-between z-10">
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
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              aria-label={`${project.title} Live URL`}
              title="Live demo / view"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Card Middle: Title, Tagline & Description */}
      <div className="my-auto py-3 space-y-2 z-10">
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-zinc-100 tracking-tight font-sans group-hover:text-violet-200 transition-colors">
            {project.title}
          </h3>
          <p className="text-xs font-medium text-violet-400/90 font-mono pt-0.5">
            {project.tagline}
          </p>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-3 sm:line-clamp-4">
          {project.description}
        </p>
      </div>

      {/* Card Footer: Metrics & Tech Badges */}
      <div className="space-y-3 z-10 pt-2">
        {/* Metric Highlights Pill */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {project.metrics.map((metric, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-300 bg-white/[0.04] border border-white/5 px-2 py-0.5 rounded-md"
              >
                <Activity className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                {metric}
              </span>
            ))}
          </div>
        )}

        {/* Tech Tag Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
          {project.tech.map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-white/5 text-zinc-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
