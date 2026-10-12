'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { GraduationCap, Award, FileText, School, BookmarkCheck } from 'lucide-react';

export function EducationSection() {
  return (
    <section id="education" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Ambient Section Nebula */}
      <div 
        className="absolute top-1/4 -right-20 w-[480px] h-[480px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 70%)' }}
      />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-xs">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Background</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
          Education & Qualifications
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl font-sans">
          Formal academic journey spanning 10th High School, 12th Senior Secondary, Undergraduate, and Postgraduate degrees.
        </p>
      </div>

      {/* Education Timeline / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEVELOPER_PROFILE.education.map((edu, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-3xl bg-[#121217]/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/50 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                  {edu.level}
                </span>
                <span className="text-xs font-mono text-zinc-400">{edu.period}</span>
              </div>

              <h3 className="font-bold text-lg text-zinc-100 font-sans leading-snug">{edu.degree}</h3>

              <div className="flex items-center justify-between text-xs text-zinc-400 font-sans">
                <span className="font-medium text-zinc-300 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-indigo-400" />
                  {edu.institution}
                </span>
                {edu.location && <span>{edu.location}</span>}
              </div>

              {edu.gpaOrHonors && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 rounded-lg w-fit">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{edu.gpaOrHonors}</span>
                </div>
              )}

              {edu.coursework && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                    <BookmarkCheck className="w-3 h-3 text-indigo-400" /> Key Subjects & Coursework:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.coursework.map((course, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-zinc-900 border border-white/5 text-zinc-300"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {edu.thesisOrProject && (
              <div className="pt-3 border-t border-white/5 text-xs text-zinc-400 flex items-start gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-zinc-300">Thesis/Project:</strong> {edu.thesisOrProject}</span>
              </div>
            )}
          </div>
        ))}
      </div>

    </section>
  );
}
