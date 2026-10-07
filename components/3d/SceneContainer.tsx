'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { AmbientMesh } from './AmbientMesh';

interface SceneContainerProps {
  isThinking?: boolean;
  isStreaming?: boolean;
  className?: string;
}

export default function SceneContainer({
  isThinking = false,
  isStreaming = false,
  className = '',
}: SceneContainerProps) {
  return (
    <div className={`relative w-full h-full min-h-[350px] overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
        <pointLight
          position={[-10, -10, -5]}
          intensity={isThinking || isStreaming ? 2.5 : 0.8}
          color={isThinking || isStreaming ? '#8b5cf6' : '#3f3f46'}
        />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
            <AmbientMesh isThinking={isThinking} isStreaming={isStreaming} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
