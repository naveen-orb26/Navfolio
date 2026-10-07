'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { Cpu, CheckCircle2, Sparkles, Terminal } from 'lucide-react';

interface TechMatrixProps {
  onSelectSkillPrompt?: (prompt: string) => void;
}

export function TechMatrix({ onSelectSkillPrompt }: TechMatrixProps) {
  return (
    <section id="tech-stack" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
          Production technologies and frameworks utilized across Naveen's AI platforms and full-stack systems.
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

            {onSelectSkillPrompt && (
              <button
                onClick={() =>
                  onSelectSkillPrompt(`What experience does Naveen have in ${category.category}?`)
                }
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all pt-2"
              >
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span>Ask AI about {category.category}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
