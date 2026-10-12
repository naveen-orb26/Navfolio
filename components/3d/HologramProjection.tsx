'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export interface HologramProjectionProps {
  isActive: boolean;
  originPosition?: THREE.Vector3;
  onProgressChange?: (progress: number) => void;
}

export function HologramProjection({
  isActive,
  originPosition = new THREE.Vector3(0, 0, 0),
  onProgressChange,
}: HologramProjectionProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load texture with guaranteed fallback settings
  const texture = useTexture('/hologram-profile.png');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const progressRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth progress interpolation
    const target = isActive ? 1.0 : 0.0;
    progressRef.current = THREE.MathUtils.damp(progressRef.current, target, 4.0, delta);
    const p = progressRef.current;
    
    if (onProgressChange) onProgressChange(p);

    // Visible scale (Target size: 3.0w x 4.0h - 1.25x larger)
    const scaleFactor = Math.max(0.0001, p);
    meshRef.current.scale.set(scaleFactor * 3.0, scaleFactor * 4.0, scaleFactor);

    // Position: Emerge from node position to clean forward camera view z=0.5
    const targetPos = new THREE.Vector3(0, 0, 0.5);
    meshRef.current.position.lerpVectors(originPosition, targetPos, p);

    // Guarantee the plane faces the camera head-on at all times
    meshRef.current.quaternion.copy(state.camera.quaternion);

    // Force visibility state
    meshRef.current.visible = p > 0.01;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.5]} renderOrder={99999}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        opacity={1.0}
        side={THREE.DoubleSide}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

if (typeof window !== 'undefined') {
  useTexture.preload('/hologram-profile.png');
}

