'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AmbientMeshProps {
  isThinking?: boolean;
  isStreaming?: boolean;
}

export function AmbientMesh({ isThinking = false, isStreaming = false }: AmbientMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Custom procedural geometry with noise-like vertices
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.4, 24);
    return geo;
  }, []);

  // Duplicate position attribute for vertex displacement animation
  const originalPositions = useMemo(() => {
    return geometry.attributes.position.array.slice();
  }, [geometry]);

  useFrame((state) => {
    const clock = state.clock.getElapsedTime();
    const mesh = meshRef.current;
    if (!mesh) return;

    // Intensity multiplier based on AI state
    const isActive = isThinking || isStreaming;
    const speed = isActive ? 1.8 : 0.6;
    const distortionAmp = isActive ? 0.35 : 0.12;

    // Gentle base rotation
    mesh.rotation.y = clock * 0.15 * speed;
    mesh.rotation.x = clock * 0.1 * speed;

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -clock * 0.12 * speed;
      wireframeRef.current.rotation.z = clock * 0.08 * speed;
    }

    // Dynamic vertex displacement (organic pulsing waveform)
    const positionAttr = mesh.geometry.attributes.position;
    const arr = positionAttr.array as Float32Array;

    for (let i = 0; i < arr.length; i += 3) {
      const ox = originalPositions[i];
      const oy = originalPositions[i + 1];
      const oz = originalPositions[i + 2];

      // Calculate spherical coordinates angle
      const length = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const nx = ox / length;
      const ny = oy / length;
      const nz = oz / length;

      // Multi-frequency sine displacement
      const wave1 = Math.sin(nx * 3.5 + clock * 2.0 * speed);
      const wave2 = Math.cos(ny * 4.0 + clock * 1.5 * speed);
      const wave3 = Math.sin(nz * 3.0 + clock * 2.5 * speed);
      const totalWave = (wave1 + wave2 + wave3) * 0.333;

      const displacement = 1 + totalWave * distortionAmp;
      arr[i] = ox * displacement;
      arr[i + 1] = oy * displacement;
      arr[i + 2] = oz * displacement;
    }

    positionAttr.needsUpdate = true;

    // Color transition when AI is thinking/streaming
    if (materialRef.current) {
      const targetColor = isActive
        ? new THREE.Color('#8b5cf6') // Vibrant violet pulse when thinking/streaming
        : new THREE.Color('#3f3f46'); // Sleek dark zinc when idle

      const targetEmissive = isActive
        ? new THREE.Color('#6366f1') // Cyan/indigo emissive glow
        : new THREE.Color('#18181b'); // Dark emissive

      materialRef.current.color.lerp(targetColor, 0.05);
      materialRef.current.emissive.lerp(targetEmissive, 0.05);
    }
  });

  return (
    <group>
      {/* Central Distorted Mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          ref={materialRef}
          color="#3f3f46"
          emissive="#18181b"
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
          flatShading={true}
        />
      </mesh>

      {/* Outer Halo Wireframe */}
      <lineSegments ref={wireframeRef}>
        <wireframeGeometry args={[geometry]} />
        <lineBasicMaterial
          color={isThinking || isStreaming ? '#a78bfa' : '#52525b'}
          transparent={true}
          opacity={isThinking || isStreaming ? 0.45 : 0.15}
          linewidth={1}
        />
      </lineSegments>

      {/* Ambient particles surrounding 3D core */}
      <points>
        <sphereGeometry args={[4.2, 32, 32]} />
        <pointsMaterial
          size={0.025}
          color={isThinking || isStreaming ? '#38bdf8' : '#71717a'}
          transparent={true}
          opacity={0.3}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}
