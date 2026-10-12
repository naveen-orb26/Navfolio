'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { Shield, Users, Award, Calendar, CheckCircle2, Globe, HeartHandshake } from 'lucide-react';

export function LeadershipSection() {
  // Separate student welfare and rotaract roles for clear visual distinction
  const studentWelfareRoles = DEVELOPER_PROFILE.leadership.filter(
    (item) => item.category === 'Student Welfare & Governance'
  );
  const rotaractRoles = DEVELOPER_PROFILE.leadership.filter(
    (item) => item.category === 'Rotaract Club of VIT Chennai'
  );

  return (
    <section id="leadership" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Ambient Section Nebula */}
      <div 
        className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%)' }}
      />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 font-mono text-xs">
          <Users className="w-4 h-4" />
          <span>Governance, Community & Impact</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
          Leadership Experience
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl font-sans">
          Institutional administration as an Office Bearer at VIT Chennai Student Welfare, alongside 3 progressive executive leadership roles in the Rotaract Club.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        
        {/* 1. Office of Student Welfare (Left/Top Column - 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-zinc-100 font-sans">
              Office of Student Welfare
            </h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Apex student governance body at Vellore Institute of Technology, Chennai, managing university-wide student affairs and institutional operations.
          </p>

          <div className="space-y-4">
            {studentWelfareRoles.map((role, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#121217]/90 border border-indigo-500/30 hover:border-indigo-400/50 transition-all backdrop-blur-xl shadow-xl space-y-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300">
                      {role.badge || 'Executive Board'}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {role.period}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-zinc-100 font-sans">
                    {role.role}
                  </h4>
                  <p className="text-xs text-zinc-300 font-sans">
                    {role.organization}
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-zinc-300">
                  {role.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-sans">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Rotaract Club of VIT Chennai - 3 Distinct Roles (Right/Bottom Column - 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-violet-400" />
              <h3 className="font-bold text-lg text-zinc-100 font-sans">
                Rotaract Club of VIT Chennai
              </h3>
            </div>
            <span className="text-xs font-mono text-violet-400 bg-violet-950/50 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
              3 Distinct Leadership Tenures
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Continuous leadership advancement from Community Service Associate Director to International Service Director and Senior Executive Advisor.
          </p>

          <div className="space-y-4">
            {rotaractRoles.map((role, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-[#121217]/85 border border-white/10 hover:border-violet-500/30 transition-all backdrop-blur-xl shadow-lg space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-zinc-100 font-sans">
                        {role.role}
                      </h4>
                      {role.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/25 text-violet-300">
                          {role.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 font-sans">
                      {role.organization}
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    {role.period}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-zinc-300">
                  {role.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-sans">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
