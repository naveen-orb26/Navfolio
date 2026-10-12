'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/profile-knowledge';
import { Compass, Lightbulb, Palette, Activity, Instagram, ExternalLink, Sparkles } from 'lucide-react';

export function HobbiesSkillsSection() {
  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('art') || category.toLowerCase().includes('photo') || category.toLowerCase().includes('sketch')) {
      return <Palette className="w-5 h-5 text-rose-400" />;
    }
    if (category.toLowerCase().includes('sport') || category.toLowerCase().includes('fitness') || category.toLowerCase().includes('athletic')) {
      return <Activity className="w-5 h-5 text-emerald-400" />;
    }
    return <Lightbulb className="w-5 h-5 text-amber-400" />;
  };

  const getCategoryBadgeColor = (category: string) => {
    if (category.toLowerCase().includes('art') || category.toLowerCase().includes('photo') || category.toLowerCase().includes('sketch')) {
      return 'border-rose-500/20 text-rose-300 bg-rose-950/40';
    }
    if (category.toLowerCase().includes('sport') || category.toLowerCase().includes('fitness') || category.toLowerCase().includes('athletic')) {
      return 'border-emerald-500/20 text-emerald-300 bg-emerald-950/40';
    }
    return 'border-amber-500/20 text-amber-300 bg-amber-950/40';
  };

  return (
    <section id="hobbies" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Ambient Section Nebula */}
      <div 
        className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(244, 63, 94, 0.18) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 70%)' }}
      />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 font-mono text-xs">
          <Compass className="w-4 h-4" />
          <span>Creative Passions & Active Lifestyle</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
          Hobbies, Arts & Fitness Goals
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl font-sans">
          Pencil sketching, visual photography, racquet sports, endurance cycling, swimming, and mechanical prototyping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {DEVELOPER_PROFILE.hobbiesAndSkills.map((category, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-7 rounded-3xl bg-[#121217]/85 border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-5">
              
              {/* Category Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10 text-zinc-100">
                {getCategoryIcon(category.category)}
                <h3 className="font-bold text-base sm:text-lg font-sans">
                  {category.category}
                </h3>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {category.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors space-y-2"
                  >
                    {/* Item Header: Name & Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm text-zinc-100 font-sans">
                        {item.name}
                      </h4>
                      {item.tag && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap flex-shrink-0 ${getCategoryBadgeColor(category.category)}`}>
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Item Description */}
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {item.description}
                    </p>

                    {/* Instagram Portfolio Link (Neat, full-width aligned footer bar) */}
                    {item.link && (
                      <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                          <Instagram className="w-3.5 h-3.5 text-pink-400" />
                          <span>Instagram</span>
                        </span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 hover:border-pink-400 text-pink-300 hover:text-white text-xs font-mono transition-all group shadow-sm"
                          title={`View ${item.name} on Instagram`}
                        >
                          <span>{item.linkText || 'Visit Profile'}</span>
                          <ExternalLink className="w-3 h-3 text-pink-400/80 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
