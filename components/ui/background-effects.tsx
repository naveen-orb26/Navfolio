'use client';

import React, { useEffect, useRef, useState } from 'react';

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Initialize mouse position and track cursor & scroll
  useEffect(() => {
    setIsClient(true);
    // Initial center spotlight so the hero area is illuminated immediately
    if (typeof window !== 'undefined') {
      setMousePos({ x: window.innerWidth / 2, y: 350 });
    }

    const handlePointerMove = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Floating Micro-Particles & Constellation Web Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    // 55 vibrant ambient particles
    const particleCount = 55;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      glowColor: string;
    }> = [];

    const colorPalette = [
      { base: 'rgba(168, 85, 247, ', glow: 'rgba(168, 85, 247, 0.7)' }, // violet
      { base: 'rgba(6, 182, 212, ', glow: 'rgba(6, 182, 212, 0.7)' },   // cyan
      { base: 'rgba(99, 102, 241, ', glow: 'rgba(99, 102, 241, 0.7)' }, // indigo
      { base: 'rgba(16, 185, 129, ', glow: 'rgba(16, 185, 129, 0.7)' }, // emerald
      { base: 'rgba(244, 63, 94, ', glow: 'rgba(244, 63, 94, 0.7)' },   // rose
      { base: 'rgba(245, 158, 11, ', glow: 'rgba(245, 158, 11, 0.7)' }, // amber
      { base: 'rgba(255, 255, 255, ', glow: 'rgba(255, 255, 255, 0.5)' }, // white
    ];

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    for (let i = 0; i < particleCount; i++) {
      const palette = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particles.push({
        x: Math.random() * screenW,
        y: Math.random() * screenH,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.2 + 1.6,
        alpha: Math.random() * 0.4 + 0.4,
        color: palette.base,
        glowColor: palette.glow,
      });
    }

    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const currentW = window.innerWidth;
      const currentH = window.innerHeight;
      ctx.clearRect(0, 0, currentW, currentH);

      // Render & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Screen edge wrap
        if (p.x < 0) p.x = currentW;
        if (p.x > currentW) p.x = 0;
        if (p.y < 0) p.y = currentH;
        if (p.y > currentH) p.y = 0;

        // Draw particle node with luminous glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset for lines

        // Connect nearby nodes with delicate constellation threads
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* 1. Deep Space Base Background */}
      <div className="absolute inset-0 bg-[#09090b]" />

      {/* 2. Sleek Architectural Coordinate Grid (Clean Lines without dots) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '128px 128px, 128px 128px',
        }}
      />

      {/* 3. Interactive Cursor Spotlight (Radiant illumination follows mouse pointer) */}
      {isClient && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.24), rgba(6, 182, 212, 0.14) 40%, transparent 75%)`,
          }}
        />
      )}

      {/* 4. Strategic Parallax Aurora Glow Orbs (Subtly translate based on scroll) */}
      {/* Top Left: Electric Cyan / Sky Blue Nebula */}
      <div 
        className="absolute -top-24 -left-24 w-[650px] h-[650px] rounded-full blur-[120px] pointer-events-none transition-transform duration-100 ease-out"
        style={{ 
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.28) 0%, rgba(14, 165, 233, 0.12) 50%, transparent 70%)',
          transform: `translateY(${scrollY * -0.08}px)` 
        }}
      />

      {/* Top Right: Electric Violet / Purple Nebula */}
      <div 
        className="absolute top-12 -right-24 w-[680px] h-[680px] rounded-full blur-[130px] pointer-events-none transition-transform duration-100 ease-out"
        style={{ 
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.26) 0%, rgba(99, 102, 241, 0.12) 50%, transparent 70%)',
          transform: `translateY(${scrollY * -0.12}px)` 
        }}
      />

      {/* Mid Left: Deep Indigo & Cobalt Core */}
      <div 
        className="absolute top-[38%] -left-32 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none transition-transform duration-100 ease-out"
        style={{ 
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(79, 70, 229, 0.10) 50%, transparent 70%)',
          transform: `translateY(${scrollY * -0.06}px)` 
        }}
      />

      {/* Mid Right: Teal & Emerald Professional Glow */}
      <div 
        className="absolute top-[55%] -right-32 w-[680px] h-[680px] rounded-full blur-[140px] pointer-events-none transition-transform duration-100 ease-out"
        style={{ 
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(20, 184, 166, 0.10) 50%, transparent 70%)',
          transform: `translateY(${scrollY * -0.09}px)` 
        }}
      />

      {/* Bottom Left: Warm Sunset Rose & Amber Glow */}
      <div 
        className="absolute bottom-16 -left-20 w-[640px] h-[640px] rounded-full blur-[130px] pointer-events-none transition-transform duration-100 ease-out"
        style={{ 
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.22) 0%, rgba(245, 158, 11, 0.12) 50%, transparent 70%)',
          transform: `translateY(${scrollY * -0.05}px)` 
        }}
      />

      {/* Bottom Right: Radiant Violet Horizon */}
      <div 
        className="absolute -bottom-20 -right-20 w-[620px] h-[620px] rounded-full blur-[130px] pointer-events-none transition-transform duration-100 ease-out"
        style={{ 
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(99, 102, 241, 0.10) 50%, transparent 70%)',
          transform: `translateY(${scrollY * -0.07}px)` 
        }}
      />

      {/* 5. Floating Ambient Micro-Particle & Constellation Field Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 6. Technical Engineering Margin Guide Lines (Desktop developer aesthetic) */}
      <div className="hidden xl:block absolute top-0 bottom-0 left-12 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
      <div className="hidden xl:block absolute top-0 bottom-0 right-12 w-px bg-gradient-to-b from-transparent via-violet-500/20 to-transparent pointer-events-none" />

    </div>
  );
}
