'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { Briefcase, Calendar, CheckCircle2, MapPin, Building2, FlaskConical } from 'lucide-react';

export function ExperienceSection() {
  return (
    <section id="experience" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Ambient Section Nebula */}
      <div 
        className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.08) 50%, transparent 70%)' }}
      />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Professional Industry & Research Track Record</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
          Work Experience & Internships
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl font-sans">
          Hands-on software and AI engineering roles across international research institutions and manufacturing enterprises.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {DEVELOPER_PROFILE.experience.map((exp, idx) => (
          <div
            key={idx}
            className="relative p-6 sm:p-8 rounded-3xl bg-[#121217]/85 border border-white/10 hover:border-emerald-500/25 transition-all backdrop-blur-xl shadow-xl space-y-5"
          >
            {/* Header: Role, Company, Period & Type Badge */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-100 font-sans">{exp.role}</h3>
                  <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                    exp.type === 'Research Internship'
                      ? 'bg-cyan-950/50 border-cyan-500/30 text-cyan-300'
                      : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                  }`}>
                    {exp.type}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{exp.company}</span>
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1 text-zinc-400 font-mono text-[11px]">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      <span>{exp.location}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300 self-start sm:self-auto flex-shrink-0">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{exp.period}</span>
              </div>
            </div>

            {/* Highlights */}
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
