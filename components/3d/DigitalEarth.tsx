'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { HologramProjection } from './HologramProjection';

interface DigitalEarthProps {
  isThinking?: boolean;
  isStreaming?: boolean;
  isHologramActive?: boolean;
  onToggleHologram?: () => void;
  onHologramProgress?: (progress: number) => void;
}

// Bengaluru, India precise geographic coordinates
const BENGALURU_LAT = 12.9716;
const BENGALURU_LON = 77.5946;
const GLOBE_RADIUS = 2.0;
const MARKER_RADIUS = 2.035;

/**
 * Converts Latitude & Longitude to 3D Cartesian Vector3 on a Three.js SphereGeometry
 * matching standard equirectangular texture mapping (u=0 at -180°, u=0.5 at 0° Greenwich).
 */
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = ((lon + 180) * Math.PI) / 180;
  const theta = ((90 - lat) * Math.PI) / 180;

  const x = -radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.cos(theta);
  const z = radius * Math.sin(theta) * Math.sin(phi);

  return new THREE.Vector3(x, y, z);
}

export function DigitalEarth({
  isThinking = false,
  isStreaming = false,
  isHologramActive = false,
  onToggleHologram,
  onHologramProgress,
}: DigitalEarthProps) {
  const groupRef = useRef<THREE.Group>(null);
  const globeMeshGroupRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const markerGroupRef = useRef<THREE.Group>(null);
  const markerPulseRef = useRef<THREE.Mesh>(null);
  const markerBadgeRef = useRef<THREE.Sprite>(null);
  const markerPinRef = useRef<THREE.Mesh>(null);
  const markerBeaconRef = useRef<THREE.Mesh>(null);

  const globeScaleRef = useRef<number>(1.0);
  const originWorldPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Load high-resolution Earth textures (served 100% locally from public/textures/)
  const [earthMap, earthLights, earthSpecular, earthClouds] = useTexture([
    '/textures/earth_map.jpg',
    '/textures/earth_lights.png',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.png',
  ]);

  earthMap.colorSpace = THREE.SRGBColorSpace;
  earthLights.colorSpace = THREE.SRGBColorSpace;

  // Generate sharp 2D Canvas Texture for Bengaluru Location Tag Badge
  const locationBadgeTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Semi-transparent dark slate backdrop with glowing cyan border
      ctx.fillStyle = 'rgba(3, 7, 18, 0.94)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;

      ctx.beginPath();
      ctx.roundRect(6, 6, 348, 108, 14);
      ctx.fill();
      ctx.stroke();

      // Glowing status beacon dot
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(34, 42, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Header label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui, -favicon-system, sans-serif';
      ctx.fillText('BENGALURU', 54, 49);

      // Subtitle coordinates
      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 14px monospace, sans-serif';
      ctx.fillText('12.9716° N, 77.5946° E', 34, 76);

      // Action hint
      ctx.fillStyle = '#a5f3fc';
      ctx.font = 'bold 12px monospace, sans-serif';
      ctx.fillText('[ CLICK NODE TO PROJECT HOLOGRAM ]', 34, 98);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Compute 3D Cartesian coordinates for Bengaluru on globe surface
  const markerPos = useMemo(() => {
    return latLonToVector3(BENGALURU_LAT, BENGALURU_LON, MARKER_RADIUS);
  }, []);

  // Target rotation angle to center Bengaluru facing camera (+Z)
  const targetRotationY = useMemo(() => {
    return Math.atan2(-markerPos.x, markerPos.z);
  }, [markerPos]);

  // Surface normal vector pointing outward from planet center
  const markerNormal = useMemo(() => {
    return markerPos.clone().normalize();
  }, [markerPos]);

  // Compute rotation quaternion to orient marker perpendicular to globe curvature
  const markerOrientation = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(up, markerNormal);
    return q;
  }, [markerNormal]);

  useFrame((state, delta) => {
    const isActive = isThinking || isStreaming;

    // 1. Scene Hand-Off Scale Animation:
    // Scale globe from 1.0 down to 0.0 when hologram is active; 0.0 back to 1.0 when inactive
    const targetScale = isHologramActive ? 0.0 : 1.0;
    globeScaleRef.current = THREE.MathUtils.damp(globeScaleRef.current, targetScale, 3.0, delta);

    if (globeMeshGroupRef.current) {
      const s = globeScaleRef.current;
      globeMeshGroupRef.current.scale.set(s, s, s);
      globeMeshGroupRef.current.visible = s > 0.005;
    }

    // 2. Globe rotation dynamics:
    if (groupRef.current) {
      if (isHologramActive) {
        const currentY = groupRef.current.rotation.y;
        const diff = (targetRotationY - currentY) % (Math.PI * 2);
        const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
        const targetAngle = currentY + normalizedDiff;

        groupRef.current.rotation.y = THREE.MathUtils.damp(
          groupRef.current.rotation.y,
          targetAngle,
          3.2,
          delta
        );
      } else {
        const speed = isActive ? 2.5 : 0.6;
        groupRef.current.rotation.y += delta * 0.12 * speed;
      }
    }

    // 3. Pulse atmosphere glow
    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isHologramActive ? 0.0 : isActive ? 0.38 : 0.22;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
    }

    // 4. Update world vector of Bengaluru node for hologram origin
    if (markerGroupRef.current) {
      const worldPos = new THREE.Vector3();
      markerGroupRef.current.getWorldPosition(worldPos);

      // Store origin position for HologramProjection
      if (!isHologramActive || originWorldPosRef.current.lengthSq() < 0.1) {
        originWorldPosRef.current.copy(worldPos);
      }

      // Animate marker visibility based on camera dot product
      const worldNormal = markerNormal.clone().applyQuaternion(groupRef.current?.quaternion || new THREE.Quaternion());
      const camDir = state.camera.position.clone().sub(worldPos).normalize();

      const dot = worldNormal.dot(camDir);
      const visibilityOpacity = isHologramActive
        ? 1.0
        : THREE.MathUtils.clamp((dot - 0.08) / 0.24, 0, 1) * globeScaleRef.current;

      if (markerBadgeRef.current) {
        markerBadgeRef.current.material.opacity = visibilityOpacity;
      }

      if (markerPinRef.current) {
        (markerPinRef.current.material as THREE.MeshBasicMaterial).opacity = visibilityOpacity * 0.95;
      }

      if (markerBeaconRef.current) {
        (markerBeaconRef.current.material as THREE.MeshBasicMaterial).opacity = visibilityOpacity;
      }

      if (markerPulseRef.current) {
        const time = state.clock.getElapsedTime();
        const pulseScale = 1 + Math.sin(time * 3.5) * 0.25;
        markerPulseRef.current.scale.set(pulseScale, pulseScale, pulseScale);
        (markerPulseRef.current.material as THREE.MeshBasicMaterial).opacity = visibilityOpacity * 0.65;
      }
    }
  });

  const handleBeaconClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();

    // Capture initial world position of beacon node on click
    if (markerGroupRef.current) {
      const worldPos = new THREE.Vector3();
      markerGroupRef.current.getWorldPosition(worldPos);
      originWorldPosRef.current.copy(worldPos);
    }

    onToggleHologram?.();
  };

  return (
    <group>
      {/* Globe Group (Rotated & Scaled) */}
      <group ref={groupRef} rotation={[0, Math.PI * 0.4, 0]}>
        {/* Scaling Globe Core Group */}
        <group ref={globeMeshGroupRef}>
          {/* Layer 1: Core Earth Sphere with NASA Map, City Lights, Specular Ocean */}
          <mesh>
            <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
            <meshStandardMaterial
              map={earthMap}
              roughness={0.4}
              metalness={0.2}
              roughnessMap={earthSpecular}
              emissive="#06b6d4"
              emissiveMap={earthLights}
              emissiveIntensity={isThinking || isStreaming ? 2.8 : 1.6}
            />
          </mesh>

          {/* Layer 2: Cloud Layer */}
          <mesh scale={[1.015, 1.015, 1.015]}>
            <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
            <meshStandardMaterial
              alphaMap={earthClouds}
              transparent
              opacity={0.3}
              color="#ffffff"
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Layer 3: Atmospheric Fresnel Halo */}
          <mesh ref={atmosphereRef} scale={[1.04, 1.04, 1.04]}>
            <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
            <meshBasicMaterial
              color={isThinking || isStreaming ? '#38bdf8' : '#06b6d4'}
              transparent
              opacity={0.22}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Layer 4: Bengaluru, India Precise Location Marker Tag */}
          <group ref={markerGroupRef} position={markerPos} quaternion={markerOrientation}>
            {/* Surface Pulsing Base Circle (Clickable) */}
            <mesh
              ref={markerPulseRef}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={handleBeaconClick}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <ringGeometry args={[0.02, 0.075, 32]} />
              <meshBasicMaterial
                color="#22d3ee"
                transparent
                opacity={0.65}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Vertical Sci-Fi Laser Pin / Light Pillar (Clickable) */}
            <mesh
              ref={markerPinRef}
              position={[0, 0.12, 0]}
              onClick={handleBeaconClick}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <cylinderGeometry args={[0.006, 0.006, 0.24, 16]} />
              <meshBasicMaterial
                color="#06b6d4"
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Top Beacon Sphere Node (Clickable) */}
            <mesh
              ref={markerBeaconRef}
              position={[0, 0.24, 0]}
              onClick={handleBeaconClick}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color="#22d3ee" />
            </mesh>

            {/* Expanded Invisible Hit Target Sphere (makes clicking node easy & responsive) */}
            <mesh
              onClick={handleBeaconClick}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
              visible={false}
            >
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Floating Location Badge Sprite (Clickable) */}
            {locationBadgeTexture && (
              <sprite
                ref={markerBadgeRef}
                position={[0, 0.44, 0]}
                scale={[0.88, 0.32, 1]}
                onClick={handleBeaconClick}
                onPointerOver={() => {
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = 'auto';
                }}
              >
                <spriteMaterial
                  map={locationBadgeTexture}
                  transparent
                  opacity={1}
                  depthTest={false}
                />
              </sprite>
            )}
          </group>
        </group>
      </group>

      {/* Hologram Emergence Plane (Out of rotated Globe groupRef, attached in root scene space) */}
      <HologramProjection
        isActive={isHologramActive}
        originPosition={originWorldPosRef.current}
        onProgressChange={onHologramProgress}
      />
    </group>
  );
}

if (typeof window !== 'undefined') {
  useTexture.preload([
    '/textures/earth_map.jpg',
    '/textures/earth_lights.png',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.png',
  ]);
}







