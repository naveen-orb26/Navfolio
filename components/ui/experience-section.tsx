'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { Briefcase, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ExperienceSection() {
  return (
    <section id="experience" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      <div className="flex flex-col items-center text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Verified Track Record</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
          Engineering & Leadership Experience
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl font-sans">
          Professional roles driving AI systems architecture, microservices scaling, and WebGL user interfaces.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {DEVELOPER_PROFILE.experience.map((exp, idx) => (
          <div
            key={idx}
            className="relative p-6 sm:p-8 rounded-3xl bg-[#121217]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-zinc-100 font-sans">{exp.role}</h3>
                <span className="text-sm font-medium text-violet-400 font-sans">{exp.company}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/5 text-xs font-mono text-zinc-400 self-start sm:self-auto">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{exp.period}</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
              {exp.highlights.map((h, hIdx) => (
                <li key={hIdx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-sans">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
