// app/components/scenes/InteriorLighting.tsx
'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * INTERIOR LIGHTING SYSTEM
 * Handles all lighting within the main building foyer and interior spaces
 */
export const InteriorLighting: React.FC = () => {
  const chandelierRef = useRef<THREE.Group>(null);

  // Subtle chandelier sway
  useFrame(() => {
    if (chandelierRef.current) {
      chandelierRef.current.rotation.z = Math.sin(Date.now() * 0.0003) * 0.01;
    }
  });

  return (
    <group>
      {/* MAIN CHANDELIER - Overhead focal point */}
      <group ref={chandelierRef} position={[0, 7.5, 0]}>
        {/* Chandelier body */}
        <mesh castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#D4AF37"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Main light - warm tone */}
        <pointLight
          position={[0, -0.2, 0]}
          intensity={1.5}
          color="#FDB813"
          distance={20}
          castShadow
        />

        {/* Chandelier arms - 4 branches */}
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 0.8;
          const z = Math.sin(rad) * 0.8;

          return (
            <group key={`chandelier-${angle}`}>
              {/* Arm geometry */}
              <mesh position={[x * 0.5, -0.3, z * 0.5]} castShadow>
                <boxGeometry args={[0.15, 0.8, 0.1]} />
                <meshStandardMaterial
                  color="#8B7355"
                  roughness={0.5}
                  metalness={0.3}
                />
              </mesh>

              {/* Candle-style bulb */}
              <mesh position={[x, -1.2, z]} castShadow>
                <cylinderGeometry args={[0.12, 0.1, 0.4, 8]} />
                <meshStandardMaterial
                  color="#FFF8DC"
                  emissive="#FDB813"
                  emissiveIntensity={0.6}
                />
              </mesh>

              {/* Small point light at bulb */}
              <pointLight
                position={[x, -1.2, z]}
                intensity={0.6}
                color="#FDB813"
                distance={8}
                castShadow
              />
            </group>
          );
        })}
      </group>

      {/* WALL SCONCES - 4 corners of foyer */}
      {[
        { pos: [-5, 4.5, -3.5], dir: [0.5, -0.2, 0.8] },
        { pos: [5, 4.5, -3.5], dir: [-0.5, -0.2, 0.8] },
        { pos: [-5, 4.5, 3.5], dir: [0.5, -0.2, -0.8] },
        { pos: [5, 4.5, 3.5], dir: [-0.5, -0.2, -0.8] }
      ].map((sconce, idx) => (
        <group key={`sconce-${idx}`} position={sconce.pos as [number, number, number]}>
          {/* Sconce fixture */}
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.8, 0.2]} />
            <meshStandardMaterial
              color="#A0826D"
              roughness={0.4}
              metalness={0.5}
            />
          </mesh>

          {/* Sconce light - warm amber */}
          <pointLight
            position={[0, 0, -0.3]}
            intensity={0.7}
            color="#FDB813"
            distance={6}
            castShadow
          />

          {/* Light spread cone */}
          <mesh position={[0, -0.2, -0.25]} castShadow>
            <coneGeometry args={[0.3, 0.4, 16]} />
            <meshStandardMaterial
              color="#FFF8DC"
              emissive="#FDB813"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* ACCENT LIGHTS ON ACHIEVEMENT FRAMES */}
      {/* Left wall frame lights */}
      <group position={[-5, 2, 2]}>
        <spotLight
          position={[-0.5, 1.5, 1]}
          intensity={0.8}
          angle={Math.PI / 4}
          penumbra={0.5}
          color="#FDB813"
          castShadow
        />
      </group>

      {/* Right wall frame lights */}
      <group position={[5, 2, 2]}>
        <spotLight
          position={[0.5, 1.5, 1]}
          intensity={0.8}
          angle={Math.PI / 4}
          penumbra={0.5}
          color="#FDB813"
          castShadow
        />
      </group>

      {/* GENERAL AMBIENT FILL */}
      <ambientLight intensity={0.3} color="#FFFFFF" />

      {/* SOFT DIRECTIONAL FILL FROM ABOVE */}
      <directionalLight
        position={[0, 6, 5]}
        intensity={0.5}
        color="#FFF8DC"
        castShadow
      />
    </group>
  );
};

/**
 * OUTDOOR LIGHTING SYSTEM
 * For campus exterior scenes (Boys and Girls schools)
 */
export const OutdoorLighting: React.FC = () => {
  return (
    <group>
      {/* GOLDEN HOUR DIRECTIONAL LIGHT */}
      <directionalLight
        position={[10, 12, 8]}
        intensity={1.3}
        color="#FDB813"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
      />

      {/* FILL LIGHT */}
      <directionalLight
        position={[-5, 8, -10]}
        intensity={0.4}
        color="#87CEEB"
      />

      {/* AMBIENT */}
      <ambientLight intensity={0.5} color="#FFFFFF" />

      {/* HEMISPHERE LIGHT */}
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#8B8680"
        intensity={0.4}
      />
    </group>
  );
};

/**
 * POOL LIGHTING SYSTEM
 * Special lighting for water features with caustic effects
 */
export interface PoolLightingProps {
  position?: [number, number, number];
  poolSize?: [number, number];
}

export const PoolLighting: React.FC<PoolLightingProps> = ({
  position = [0, 0, 0],
  poolSize = [50, 25]
}) => {
  const causticGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (causticGroupRef.current) {
      causticGroupRef.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* POOL SURFACE LIGHTS - Underwater view */}
      <pointLight
        position={[-poolSize[0] / 2, -1, -poolSize[1] / 2]}
        intensity={0.8}
        color="#87CEEB"
        distance={20}
      />
      <pointLight
        position={[poolSize[0] / 2, -1, poolSize[1] / 2]}
        intensity={0.8}
        color="#87CEEB"
        distance={20}
      />

      {/* CAUSTIC PROJECTION LIGHT */}
      <spotLight
        position={[0, 2, 0]}
        target-position={[0, -2, 0]}
        intensity={0.6}
        color="#00D9FF"
        angle={Math.PI / 2}
        penumbra={0.8}
      />

      {/* AMBIENT WATER LIGHTING */}
      <ambientLight intensity={0.4} color="#00D9FF" />
    </group>
  );
};

/**
 * COURTYARD LIGHTING SYSTEM
 * For open courtyard spaces (Girls school)
 */
export const CourtyardLighting: React.FC<{ 
  position?: [number, number, number] 
}> = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      {/* MAIN DIRECTIONAL - Golden hour */}
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.2}
        color="#FDB813"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* FILL LIGHT FROM OPPOSITE */}
      <directionalLight
        position={[-6, 8, -8]}
        intensity={0.5}
        color="#87CEEB"
      />

      {/* ACCENT LIGHTS ON FEATURES */}
      <pointLight
        position={[0, 3, 0]}
        intensity={0.7}
        color="#FFD700"
        distance={15}
      />

      {/* AMBIENT */}
      <ambientLight intensity={0.4} color="#FFFFFF" />

      {/* SUBTLE GROUND REFLECTION */}
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#D4CCBF"
        intensity={0.3}
      />
    </group>
  );
};

/**
 * STADIUM LIGHTING - For sports courts
 */
export const StadiumLighting: React.FC<{ 
  position?: [number, number, number] 
}> = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      {/* OVERHEAD COURT LIGHTS - 4 corners */}
      {[
        [-14, 8, -7.5],
        [14, 8, -7.5],
        [-14, 8, 7.5],
        [14, 8, 7.5]
      ].map((pos, idx) => (
        <group key={`stadium-light-${idx}`}>
          {/* Light fixture */}
          <mesh position={pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.3]} />
            <meshStandardMaterial
              color="#444444"
              roughness={0.5}
              metalness={0.6}
            />
          </mesh>

          {/* Spotlight pointing down */}
          <spotLight
            position={pos as [number, number, number]}
            target-position={[pos[0], -1, pos[2]]}
            intensity={1.2}
            angle={Math.PI / 3}
            penumbra={0.6}
            color="#FFFFFF"
            castShadow
          />
        </group>
      ))}

      {/* AMBIENT FILL */}
      <ambientLight intensity={0.5} color="#FFFFFF" />

      {/* DIRECTION FILL */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.6}
        color="#FFFFFF"
      />
    </group>
  );
};

/**
 * FRAME SPOTLIGHT SYSTEM
 * Dedicated accent lighting for achievement frames
 */
export const FrameSpotlighting: React.FC<{
  position: [number, number, number];
  direction?: [number, number, number];
}> = ({ position, direction = [0, -0.3, 0.8] }) => {
  return (
    <spotLight
      position={position}
      target-position={[
        position[0] + direction[0],
        position[1] + direction[1],
        position[2] + direction[2]
      ]}
      intensity={0.9}
      angle={Math.PI / 6}
      penumbra={0.4}
      color="#FDB813"
      castShadow
    />
  );
};
