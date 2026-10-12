'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { BookOpen, Clock, FileText, Sparkles, Cpu, Award, Github, ExternalLink } from 'lucide-react';

export function ResearchSection() {
  const getStatusBadge = (type: string, status: string) => {
    if (type === 'Conference Paper') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
          <Award className="w-3.5 h-3.5 text-cyan-400" />
          <span>{status}</span>
        </span>
      );
    }
    if (type === 'Journal Article') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-purple-950/70 border border-purple-500/30 text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-950/70 border border-amber-500/30 text-amber-300">
        <Cpu className="w-3.5 h-3.5 text-amber-400" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <section id="research" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Ambient Section Nebula */}
      <div 
        className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(236, 72, 153, 0.08) 50%, transparent 70%)' }}
      />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
          <BookOpen className="w-4 h-4" />
          <span>Academic Manuscripts & Advanced Research</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
          Research & Academic Publications
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl font-sans">
          Novel theoretical frameworks, quantization architectures for edge PHM, multimodal remote sensing, and distributed LLM serving systems.
        </p>
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {DEVELOPER_PROFILE.research.map((paper) => (
          <div
            key={paper.id}
            className="p-6 sm:p-7 rounded-3xl bg-[#121217]/90 border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              
              {/* Status Badge & Year */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {getStatusBadge(paper.type, paper.status)}
                <span className="text-xs font-mono text-zinc-400">{paper.year}</span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-zinc-100 leading-snug font-sans hover:text-cyan-200 transition-colors">
                {paper.title}
              </h3>

              {/* Authors & Institutional Affiliation */}
              <div className="space-y-1 text-xs font-mono">
                <p className="text-zinc-300">
                  <span className="text-zinc-400">Authors:</span> {paper.authors}
                </p>
                {paper.affiliation && (
                  <p className="text-zinc-400">
                    <span className="text-zinc-400">Affiliation:</span> {paper.affiliation}
                  </p>
                )}
                <p className="text-indigo-300/90 pt-0.5">
                  <span className="text-zinc-400">Target Venue:</span> {paper.venueOrPublisher}
                </p>
              </div>

              {/* Abstract Summary */}
              <p className="text-xs text-zinc-300 leading-relaxed font-sans border-t border-white/5 pt-3">
                {paper.summary}
              </p>

              {/* Key Contributions List */}
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                  Key Research Breakthroughs:
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {paper.keyContributions.map((contrib, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-mono flex-shrink-0 mt-0.5">▸</span>
                      <span className="leading-relaxed">{contrib}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Implementation Code & Publication Status */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
              {paper.githubUrl ? (
                <a
                  href={paper.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/60 hover:bg-violet-900/80 border border-violet-500/35 hover:border-violet-400 text-violet-300 hover:text-white text-xs font-mono transition-all group shadow-sm"
                  title="View open-source research implementation repository"
                >
                  <Github className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
                  <span>Research Code</span>
                  <ExternalLink className="w-3 h-3 text-violet-400/80 ml-0.5" />
                </a>
              ) : (
                <span className="text-[11px] font-mono text-zinc-500 italic">
                  Repository in prep
                </span>
              )}

              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-700/60 text-zinc-400 text-xs font-mono select-none cursor-not-allowed opacity-75 shadow-inner"
                title="This manuscript is awaiting formal publication / in peer review. Full paper link will be activated upon publication."
              >
                <Clock className="w-3.5 h-3.5 text-amber-400/80 animate-pulse" />
                <span>Yet to Publish</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
