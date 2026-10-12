'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { GraduationCap, BookOpen, ExternalLink, Award, FileText } from 'lucide-react';

export function AcademicSection() {
  return (
    <section id="academic" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-xs">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Background & Research</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
          Education & Research Expertise
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl font-sans">
          Formal computer science degrees, academic research publications, and specialized coursework.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Academic History Card Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold text-lg pb-2 border-b border-white/10">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3>Academic History</h3>
          </div>

          <div className="space-y-6">
            {DEVELOPER_PROFILE.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#121217]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-base text-zinc-100 font-sans">{edu.degree}</h4>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-0.5 rounded-full w-fit">
                    {edu.period}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 font-sans">
                  <span className="font-medium text-zinc-300">{edu.institution}</span>
                  {edu.location && <span>{edu.location}</span>}
                </div>

                {edu.gpaOrHonors && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{edu.gpaOrHonors}</span>
                  </div>
                )}

                {edu.coursework && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[11px] font-mono text-zinc-500">Key Coursework:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.coursework.map((course, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 border border-white/5 text-zinc-300"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {edu.thesisOrProject && (
                  <div className="pt-2 text-xs text-zinc-400 flex items-start gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-zinc-300">Thesis:</strong> {edu.thesisOrProject}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Research Publications Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold text-lg pb-2 border-b border-white/10">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3>Research Publications & Preprints</h3>
          </div>

          <div className="space-y-6">
            {DEVELOPER_PROFILE.research.map((paper, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#121217]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                    {paper.focusArea}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{paper.year}</span>
                </div>

                <h4 className="font-bold text-base text-zinc-100 leading-snug font-sans">
                  {paper.title}
                </h4>

                {paper.venueOrPublisher && (
                  <p className="text-xs font-mono text-indigo-300">
                    Published in: {paper.venueOrPublisher}
                  </p>
                )}

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {paper.summary}
                </p>

                <div className="pt-2 space-y-1">
                  <span className="text-[11px] font-mono text-zinc-500">Key Contributions:</span>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {paper.keyContributions.map((contrib, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-mono">•</span>
                        <span>{contrib}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {paper.paperUrl && (
                  <div className="pt-2 flex justify-end">
                    <a
                      href={paper.paperUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>Read Publication</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
