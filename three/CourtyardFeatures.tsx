'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export interface GirlsCourtyardProps {
  accent?: string;
  visible?: boolean;
  position?: [number, number, number];
  scale?: number;
}

/**
 * ValueMonument
 * Central stone with engraved values and floating animated pillar top.
 */
const ValueMonument: React.FC = () => {
  const topPillarRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (topPillarRef.current) {
      // Floating animation: ±0.05 units, period 12s for heavy majestic feel
      topPillarRef.current.position.y = 2.75 + Math.sin(time * (Math.PI / 6)) * 0.05;
    }
  });

  const markerColors = [
    { color: '#0B1F3F', label: 'Honesty' },
    { color: '#8B1538', label: 'Compassion' },
    { color: '#1F4620', label: 'Inclusion' },
    { color: '#d6b45f', label: 'Gratitude' },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 3, 1.5, 32]} />
        <meshStandardMaterial color="#a09585" roughness={0.6} />
      </mesh>
      
      {/* Top stone */}
      <mesh position={[0, 2.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 2, 2.5, 32]} />
        <meshStandardMaterial color="#8a7d6f" roughness={0.5} />
      </mesh>
      
      {/* Floating Pillar */}
      <mesh ref={topPillarRef} position={[0, 2.75, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 3, 16]} />
        <meshStandardMaterial color="#a09585" roughness={0.4} />
      </mesh>
      
      {/* Marker Stones */}
      {markerColors.map((data, idx) => {
        const angle = (idx * Math.PI) / 2;
        const radius = 4;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <RoundedBox key={idx} args={[1.2, 1, 0.4]} radius={0.05} position={[x, 0.5, z]} rotation={[0, angle, 0]} castShadow>
            <meshStandardMaterial 
              color={data.color} 
              emissive={data.color}
              emissiveIntensity={0.25}
              roughness={0.2}
            />
          </RoundedBox>
        );
      })}
    </group>
  );
};

/**
 * Fountain
 * Animated water feature with particles.
 */
const Fountain: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 0, 6] }) => {
  const particlesRef = useRef<THREE.Group>(null);
  
  // 12 particles with different phases
  const particleData = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    phase: (i / 12) * Math.PI * 2,
    speed: 1.5 + ((i * 7) % 5) * .1,
    radius: 1.5 + ((i * 11) % 5) * .1,
  })), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const data = particleData[i];
        const t = (time * data.speed + data.phase) % Math.PI;
        
        // Parabolic arc: x/z move linearly outward, y follows parabola
        const progress = t / Math.PI; // 0 to 1
        const r = progress * data.radius;
        const y = 1.5 + Math.sin(t) * 1.5 - (progress * 1.5);
        
        child.position.set(
          Math.sin(data.phase) * r,
          Math.max(0.3, y), // Don't go below water surface
          Math.cos(data.phase) * r
        );
      });
    }
  });

  return (
    <group position={position}>
      {/* Basin */}
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <torusGeometry args={[2.5, 0.4, 32, 64]} />
        <meshStandardMaterial color="#a09585" roughness={0.4} />
      </mesh>
      
      {/* Water surface */}
      <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.3, 64]} />
        <MeshTransmissionMaterial 
          color="#6bc4d6" 
          thickness={1.2}
          roughness={0.02}
          transmission={0.95}
          ior={1.33}
          chromaticAberration={0.03}
          distortion={0.5}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
        />
      </mesh>
      
      {/* Central spout */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.1, 1.5, 16]} />
        <meshStandardMaterial color="#8a9ba5" metalness={0.8} roughness={0.1} />
      </mesh>
      
      {/* Water particles */}
      <group ref={particlesRef}>
        {particleData.map((_, i) => (
          <mesh key={i} castShadow>
            <sphereGeometry args={[0.06, 16, 16]} />
            <MeshTransmissionMaterial color="#c8eeff" transmission={0.9} ior={1.33} roughness={0} />
          </mesh>
        ))}
      </group>
      
      <pointLight position={[0, 1.6, 0]} color="#8befff" intensity={2} distance={6} />
    </group>
  );
};

/**
 * SeatingPavilion
 * Shaded seating area.
 */
const SeatingPavilion: React.FC<{ position: [number, number, number]; rotation?: number }> = ({ 
  position, 
  rotation = 0 
}) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Support posts */}
      {[
        [-1.5, 0, -1],
        [1.5, 0, -1],
        [-1.5, 0, 1],
        [1.5, 0, 1]
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], 1.4, pos[2]]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 2.8, 16]} />
          <meshStandardMaterial color="#5c4e3d" roughness={0.5} />
        </mesh>
      ))}
      
      {/* Canopy roof */}
      <RoundedBox args={[3.5, 0.12, 2.5]} radius={0.03} position={[0, 2.8, 0]} castShadow>
        <meshStandardMaterial color="#7a5c3c" roughness={0.4} />
      </RoundedBox>
      
      {/* Bench seat */}
      <RoundedBox args={[2.8, 0.15, 0.8]} radius={0.02} position={[0, 0.6, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#6b5840" roughness={0.3} />
      </RoundedBox>
      
      {/* Accent light */}
      <pointLight position={[0, 2.6, 0]} color="#ffecd2" intensity={0.8} distance={4} />
    </group>
  );
};

/**
 * CourtyardPath
 * Decorative pathway lines.
 */
const CourtyardPath: React.FC = () => {
  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      {/* Cross pattern arms */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[0.6, 0.04, 12]} />
        <meshStandardMaterial color="#c4b8a5" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[0.6, 0.04, 12]} />
        <meshStandardMaterial color="#c4b8a5" roughness={0.5} />
      </mesh>
    </group>
  );
};

/**
 * GirlsCourtyard
 * Main container for all girls school courtyard features.
 */
export const GirlsCourtyard: React.FC<GirlsCourtyardProps> = ({ 
  visible = true,
  position = [0, 0, -30],
  scale = 1,
}) => {
  return (
    <group visible={visible} position={position} scale={scale}>
      {/* Ground plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 25]} />
        <meshStandardMaterial color="#e8ddc4" roughness={0.6} />
      </mesh>
      
      <ValueMonument />
      <Fountain position={[0, 0, 6]} />
      <CourtyardPath />
      
      {/* 4 Seating Pavilions at corners */}
      <SeatingPavilion position={[-10, 0, -8]} rotation={Math.PI / 4} />
      <SeatingPavilion position={[10, 0, -8]} rotation={-Math.PI / 4} />
      <SeatingPavilion position={[-10, 0, 8]} rotation={-Math.PI / 4} />
      <SeatingPavilion position={[10, 0, 8]} rotation={Math.PI / 4} />
    </group>
  );
};
