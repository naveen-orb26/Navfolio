'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DigitalEarth } from './DigitalEarth';

interface SceneContainerProps {
  isThinking?: boolean;
  isStreaming?: boolean;
  isHologramActive?: boolean;
  onToggleHologram?: () => void;
  onHologramProgress?: (progress: number) => void;
  className?: string;
}

export default function SceneContainer({
  isThinking = false,
  isStreaming = false,
  isHologramActive = false,
  onToggleHologram,
  onHologramProgress,
  className = '',
}: SceneContainerProps) {
  return (
    <div className={`relative w-full h-full min-h-[380px] sm:min-h-[460px] ${className}`}>
      {/* Background Ambient Radial Blur Glow Mesh */}
      <div className="absolute inset-0 pointer-events-none rounded-full bg-gradient-to-tr from-cyan-500/10 via-violet-500/10 to-transparent blur-3xl opacity-70 transform scale-90" />

      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        {/* Low Ambient Light to preserve deep space blacks */}
        <ambientLight intensity={0.35} />

        {/* Key Directional Sun Light (creates sharp day/night terminator line) */}
        <directionalLight position={[5, 3, 5]} intensity={2.2} color="#ffffff" />

        {/* Fill / Rim Light on planet's dark side */}
        <pointLight position={[-6, -2, -4]} intensity={2.5} color="#06b6d4" />

        {/* Dynamic AI Reactivity Light */}
        <pointLight
          position={[0, 0, 5]}
          intensity={isThinking || isStreaming || isHologramActive ? 3.8 : 1.2}
          color={isThinking || isStreaming || isHologramActive ? '#22d3ee' : '#6366f1'}
        />

        <Suspense fallback={null}>
          <DigitalEarth
            isThinking={isThinking}
            isStreaming={isStreaming}
            isHologramActive={isHologramActive}
            onToggleHologram={onToggleHologram}
            onHologramProgress={onHologramProgress}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={!isHologramActive}
            autoRotateSpeed={isThinking || isStreaming ? 3.5 : 0.8}
            rotateSpeed={0.5}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

