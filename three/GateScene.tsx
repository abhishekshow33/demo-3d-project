"use client";
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface GateSceneProps {
  scroll: number;
}

export default function GateScene({ scroll }: GateSceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  useFrame(({ camera }) => {
    // Adjust camera position based on scroll distance
    // Normalize scroll to [0, 1] over first viewport height
    if (typeof window !== 'undefined') {
      const h = window.innerHeight;
      const t = Math.min(scroll / h, 1);
      // Cinematic easing instead of linear snap
      const eased = THREE.MathUtils.smoothstep(t, 0, 1);
      // Move camera from z=4 to z=2 as user scrolls down first viewport
      camera.position.z = 4 - 2 * eased;
      // Slightly raise camera
      camera.position.y = 1.5 + eased * 0.5;
      camera.lookAt(new THREE.Vector3(0, 1, 0));
    }
  });

  return (
    <>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#02090f" roughness={0.8} />
      </mesh>

      {/* Gate posts */}
      <RoundedBox args={[0.3, 2, 0.3]} radius={0.02} position={[-1.5, 1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2e3a4f" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.3, 2, 0.3]} radius={0.02} position={[1.5, 1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2e3a4f" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      
      {/* Gate crossbeam */}
      <RoundedBox args={[3.6, 0.3, 0.3]} radius={0.02} position={[0, 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#44546a" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      
      {/* Placeholder building */}
      <RoundedBox args={[6, 3, 1]} radius={0.05} position={[0, 1, -5]} castShadow receiveShadow>
        <meshStandardMaterial color="#25354b" roughness={0.6} />
      </RoundedBox>
      
      {/* Trees */}
      <mesh position={[-5, 1.5, -2]} castShadow>
        <cylinderGeometry args={[0, 0.8, 3, 16]} />
        <meshStandardMaterial color="#304d30" roughness={0.8} />
      </mesh>
      <mesh position={[5, 1.5, -2]} castShadow>
        <cylinderGeometry args={[0, 0.8, 3, 16]} />
        <meshStandardMaterial color="#304d30" roughness={0.8} />
      </mesh>
      {/* Lighting */}
      <hemisphereLight args={[0xffffff, 0x202020, 1]} position={[0, 5, 0]} />
      <directionalLight args={[0xffffff, 0.8]} position={[5, 10, 5]} />
    </>
  );
}