'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { Cpu, CheckCircle2, Terminal } from 'lucide-react';

export function TechMatrix() {
  return (
    <section id="tech-stack" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Ambient Section Nebula */}
      <div 
        className="absolute top-1/3 -left-20 w-[480px] h-[480px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-10 -right-20 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(20, 184, 166, 0.06) 50%, transparent 70%)' }}
      />

      {/* Section Title */}
      <div className="flex flex-col items-center text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
          <Cpu className="w-3.5 h-3.5" />
          <span>Technical Stack & Proficiency Matrix</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
          Core Engineering Capabilities
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl font-sans">
          Production frameworks, programming languages, and toolchains utilized across Naveen&apos;s AI platforms and software systems.
        </p>
      </div>

      {/* Grid of Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEVELOPER_PROFILE.skills.map((category, idx) => (
          <div
            key={idx}
            className="flex flex-col p-6 rounded-3xl bg-[#121217]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-base text-zinc-100 font-sans">{category.category}</h3>
            </div>

            <div className="space-y-3 flex-1">
              {category.skills.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-200">{skill.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        skill.level === 'Expert'
                          ? 'bg-violet-950/60 text-violet-300 border border-violet-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-white/5'
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>

                  {skill.highlight && (
                    <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {skill.highlight}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
