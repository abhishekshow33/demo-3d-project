import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface BaseLightProps {
  visible?: boolean;
}

/**
 * InteriorLighting — animation_Rules.md §3.2 Three-Point Lighting System
 *
 * Key Light:   Warm white #FDB813 (3000K), 45° angle, intensity 1.2, casts shadow
 * Fill Light:  Hemisphere cool fill (#87CEEB), intensity 0.4
 * Accent:      SpotLight per-frame (#FFB84D warm amber), intensity 0.8
 *
 * Plus: Chandelier with organic flicker animation (§5.1 entrance warmth)
 */
export const InteriorLighting: React.FC<BaseLightProps & { entranceProgress?: number }> = ({
  visible = true,
  entranceProgress = 1,
}) => {
  const chandelierRef = useRef<THREE.PointLight>(null);

  // §5.1 — chandelier organic flicker: warm sine oscillation
  useFrame((state) => {
    if (!chandelierRef.current) return;
    const t = state.clock.elapsedTime;
    // Base intensity 4, subtle organic sine flicker ±0.4 (rule §3.2.1)
    chandelierRef.current.intensity = (4 + Math.sin(t * 0.3) * 0.4 + Math.sin(t * 0.7) * 0.15) * entranceProgress;
  });

  return (
    <group visible={visible}>
      {/* §3.2.1 — Key Light: warm white 3000K #FDB813, 45° angle, intensity 1.2 */}
      <directionalLight
        position={[5, 4, 3]}
        intensity={1.2 * entranceProgress}
        color="#FDB813"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.0005}
      />

      {/* §3.2.2 — Fill Light: hemisphere cool #87CEEB, intensity 0.4 */}
      <hemisphereLight
        args={['#87CEEB', '#1a150d', 0.4 * entranceProgress]}
      />

      {/* Central Chandelier — organic flicker (§5.1) */}
      <group position={[0, 5.8, 0]}>
        {/* Core emissive sphere — warm glow */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#ffdca5"
            emissive="#ffdca5"
            emissiveIntensity={2 * entranceProgress}
          />
        </mesh>
        {/* Radiating arms */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
            <boxGeometry args={[1.2, 0.05, 0.05]} />
            {/* §2.1.2 Gold material: roughness 0.4, metalness 0.8 */}
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}
        {/* Decorative ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.03, 8, 24]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Animated point light with organic flicker */}
        <pointLight ref={chandelierRef} intensity={4} distance={12} color="#ffdca5" />
      </group>

      {/* §3.2.3 — Wall Sconces (accent lights at 45° per frame): warm amber #FFB84D */}
      {[
        [-3.5, 4.2, -4],
        [3.5, 4.2, -4],
        [-3.5, 4.2, 8],
        [3.5, 4.2, 8],
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.05, 0.4, 8]} />
            {/* §2.1.2 gold metalness */}
            <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* §3.2.3 Accent: warm amber 4000K, intensity 0.8 */}
          <pointLight intensity={2.2 * entranceProgress} distance={6} color="#FFB84D" />
        </group>
      ))}

      {/* §3.2.2 — Ambient fill (entrance-aware) */}
      <hemisphereLight args={['#e8dcc8', '#1a150d', 0.35 * entranceProgress]} />
    </group>
  );
};

/**
 * OutdoorLighting — animation_Rules.md §3.2.1 golden hour exterior
 */
export const OutdoorLighting: React.FC<BaseLightProps> = ({ visible = true }) => {
  return (
    <group visible={visible}>
      {/* §3.2.1 Key: directional warm sun */}
      <directionalLight
        position={[18, 30, 16]}
        intensity={2.8}
        color="#fff2d4"
        castShadow
        shadow-mapSize={[2048, 2048] as [number, number]}
        shadow-bias={-0.00015}
        shadow-normalBias={0.035}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-camera-near={1}
        shadow-camera-far={150}
      />
      {/* §3.2.2 Fill: cool sky fill */}
      <directionalLight position={[-12, 20, -8]} intensity={0.6} color="#c8deff" />
      <hemisphereLight args={['#9bc3dd', '#172319', 1.2]} />
    </group>
  );
};

export interface PoolLightingProps extends BaseLightProps {
  poolPosition?: [number, number, number];
}

/**
 * PoolLighting — Underwater caustics + surface reflection
 */
export const PoolLighting: React.FC<PoolLightingProps> = ({
  visible = true,
  poolPosition = [15, 0, -14],
}) => {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(time * 0.8) * 8;
      light1Ref.current.position.z = Math.cos(time * 0.5) * 4;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(time * 0.6) * 8;
      light2Ref.current.position.z = Math.sin(time * 0.7) * 4;
    }
  });

  return (
    <group visible={visible} position={poolPosition}>
      {/* Underwater caustics — animated sweep */}
      <group position={[0, -1, 0]}>
        <pointLight ref={light1Ref} color="#8befff" intensity={5} distance={18} />
        <pointLight ref={light2Ref} color="#8befff" intensity={5} distance={18} />
      </group>
      {/* Surface reflection spotlight */}
      <spotLight
        position={[0, 10, 0]}
        angle={Math.PI / 3}
        penumbra={0.8}
        color="#b4e8ff"
        intensity={2}
        distance={20}
      />
      <ambientLight intensity={0.15} color="#1a3a4a" />
    </group>
  );
};

/**
 * CourtyardLighting — Natural indirect light for girls courtyard
 */
export const CourtyardLighting: React.FC<BaseLightProps> = ({ visible = true }) => {
  return (
    <group visible={visible}>
      <hemisphereLight args={['#ffecd2', '#2a3a1f', 1.4]} />
      {[
        [-12, 6, -12],
        [12, 6, -12],
        [-12, 6, 12],
        [12, 6, 12],
      ].map((pos, idx) => (
        <spotLight
          key={idx}
          position={pos as [number, number, number]}
          color="#ffe8c4"
          intensity={2}
          distance={15}
          angle={Math.PI / 4}
          penumbra={0.5}
          target-position={[pos[0] * 0.5, 0, pos[2] * 0.5] as [number, number, number]}
        />
      ))}
    </group>
  );
};

/**
 * StadiumLighting — Overhead floodlights for basketball courts
 */
export const StadiumLighting: React.FC<BaseLightProps> = ({ visible = true }) => {
  const positions: [number, number, number][] = [
    [-14, 12, -8], [14, 12, -8], [-14, 12, 8], [14, 12, 8],
  ];
  return (
    <group visible={visible}>
      {positions.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.8, 0.3, 0.8]} />
            <meshStandardMaterial color="#444" roughness={0.6} />
          </mesh>
          <spotLight
            position={[0, 0, 0]}
            target-position={[pos[0] * 0.5, 0, pos[2] * 0.5] as [number, number, number]}
            angle={Math.PI / 4}
            intensity={4}
            color="#fff6dd"
            penumbra={0.5}
            distance={25}
          />
        </group>
      ))}
    </group>
  );
};

export interface FrameSpotlightingProps extends BaseLightProps {
  framePositions: [number, number, number][];
  side: 'left' | 'right';
}

/**
 * FrameSpotlighting — animation_Rules.md §3.2.3 Accent Lights for achievement frames
 *
 * Spotlight: positioned 45° above frame center, warm amber #FFB84D (4000K)
 * Intensity 0.8, angle Math.PI/4, penumbra 0.5 — creates "halo" on hover
 */
export const FrameSpotlighting: React.FC<FrameSpotlightingProps> = ({
  visible = true,
  framePositions,
  side,
}) => {
  const dirX = side === 'left' ? 1 : -1;

  return (
    <group visible={visible}>
      {framePositions.map((pos, idx) => {
        // §3.2.3 — spotlight 45° above frame, 2.0 units distance
        const spotPos: [number, number, number] = [
          pos[0] + dirX * 1.5,
          pos[1] + 1.5, // 45° above
          pos[2],
        ];
        return (
          <group key={idx}>
            <spotLight
              position={spotPos}
              target-position={pos}
              angle={Math.PI / 4}           // 90° cone per rule §3.2.3
              intensity={0.8}               // §3.2.3 accent intensity 0.8
              distance={5}
              color="#FFB84D"               // 4000K warm amber §3.2.3
              penumbra={0.5}                // §3.2.3 soft penumbra (1.5 decay radius)
              castShadow
            />
          </group>
        );
      })}
    </group>
  );
};
