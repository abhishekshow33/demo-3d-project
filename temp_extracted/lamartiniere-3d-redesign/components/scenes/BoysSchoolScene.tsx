// app/components/scenes/BoysSchoolScene.tsx
'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { OutdoorLighting, StadiumLighting, PoolLighting, FrameSpotlighting } from './InteriorLighting';
import { AchievementFrameWall } from './AchievementFrameWall';

gsap.registerPlugin(ScrollTrigger);

/**
 * LA MARTINIÈRE FOR BOYS CAMPUS SCENE
 * Multi-zone walkthrough with courts, pools, and achievement galleries
 */

export const BoysSchoolScene: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{
          position: [0, 2, 30],
          fov: 50,
          near: 0.1,
          far: 500
        }}
        style={{ background: '#1a1a2e' }}
      >
        <BoysSchoolContent scrollProgress={scrollProgress} />
      </Canvas>

      <ScrollTracker onProgressUpdate={setScrollProgress} />

      <div style={{
        position: 'absolute',
        top: 40,
        left: 40,
        color: 'white',
        fontFamily: 'IBM Plex Serif',
        zIndex: 10
      }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
          La Martinière for Boys
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.8 }}>
          Since 1836 • 3,800+ Students • Excellence Through Labour
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// BOYS SCHOOL SCENE CONTENT
// ============================================================================

interface BoysSchoolContentProps {
  scrollProgress: number;
}

const BoysSchoolContent: React.FC<BoysSchoolContentProps> = ({ scrollProgress }) => {
  const { camera } = useThree();
  const campusGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!campusGroupRef.current) return;

    // Camera path through campus (scroll-driven)
    // 0-25%: Entrance approach to courtyard
    // 25-50%: Basketball court exploration
    // 50-75%: Swimming pool complex
    // 75-100%: Gallery immersion

    const stageProgess = scrollProgress;

    if (stageProgess < 0.25) {
      // Entrance approach
      const t = stageProgess / 0.25;
      camera.position.z = THREE.MathUtils.lerp(30, 20, t);
      camera.position.y = THREE.MathUtils.lerp(2, 2.5, t);
      camera.lookAt(0, 2, 0);
    } else if (stageProgess < 0.5) {
      // Court exploration
      const t = (stageProgess - 0.25) / 0.25;
      camera.position.z = THREE.MathUtils.lerp(20, 5, t);
      camera.position.x = Math.sin(t * Math.PI) * 8;
      camera.position.y = THREE.MathUtils.lerp(2.5, 3, t);
      camera.lookAt(0, 1, 0);
    } else if (stageProgess < 0.75) {
      // Pool complex
      const t = (stageProgess - 0.5) / 0.25;
      camera.position.z = THREE.MathUtils.lerp(5, -15, t);
      camera.position.x = Math.sin(t * Math.PI * 0.5) * 10;
      camera.position.y = THREE.MathUtils.lerp(3, 2, t);
      camera.lookAt(0, 0, 0);
    } else {
      // Gallery immersion
      const t = (stageProgess - 0.75) / 0.25;
      camera.position.z = THREE.MathUtils.lerp(-15, -8, t);
      camera.position.x = 0;
      camera.position.y = 2;
      camera.lookAt(0, 2.5, 0);
    }
  });

  return (
    <group ref={campusGroupRef}>
      <Environment preset="sunset" />
      <OutdoorLighting />

      {/* MAIN ACADEMIC BUILDING */}
      <AcademicBuilding type=\"boys\" position={[0, 0, 0]} />

      {/* BASKETBALL COURT */}
      <BasketballCourt position={[-15, 0, 5]} isBoys={true} />

      {/* SWIMMING POOL COMPLEX */}
      <SwimmingPoolComplex position={[15, 0, -10]} isBoys={true} />

      {/* COURTYARD CENTRAL AREA */}
      <CourtyardArea position={[0, 0, 0]} />

      {/* ACHIEVEMENT GALLERY WALL */}
      <AchievementFrameWall
        position={[-18, 1.5, -20]}
        side=\"left\"
        scrollProgress={scrollProgress}
      />
    </group>
  );
};

// ============================================================================
// ACADEMIC BUILDING
// ============================================================================

interface AcademicBuildingProps {
  type: 'boys' | 'girls';
  position: [number, number, number];
}

const AcademicBuilding: React.FC<AcademicBuildingProps> = ({ type, position }) => {
  return (
    <group position={position}>
      {/* MAIN FACADE */}
      <mesh castShadow>
        <boxGeometry args={[25, 14, 3]} />
        <meshStandardMaterial
          color={type === 'boys' ? '#8B4513' : '#D4B5A0'}
          roughness={0.8}
        />
      </mesh>

      {/* ROOF */}
      <mesh position={[0, 7.5, 0]} castShadow>
        <boxGeometry args={[27, 2, 4]} />
        <meshStandardMaterial color=\"#654321\" roughness={0.9} />
      </mesh>

      {/* ENTRANCE PORTICO */}
      <mesh position={[0, 0, -2]} castShadow>
        <boxGeometry args={[8, 6, 0.5]} />
        <meshStandardMaterial color=\"#A0826D\" roughness={0.7} />
      </mesh>

      {/* SCHOOL LOGO DISPLAY */}
      <Text
        position={[0, 5, -2.3]}
        fontSize={1.2}
        color={type === 'boys' ? '#FF0080' : '#FFD700'}
        anchorX=\"center\"
        fontWeight=\"bold\"
      >
        {type === 'boys' ? 'LMB' : 'LMG'}
      </Text>

      {/* SCHOOL MOTTO */}
      <Text
        position={[0, 3.5, -2.3]}
        fontSize={0.6}
        color=\"#0B1F3F\"
        anchorX=\"center\"
        fontStyle=\"italic\"
      >
        Labore et Constantia
      </Text>

      {/* WINDOWS */}
      {[...Array(6)].map((_, row) =>
        [...Array(8)].map((_, col) => (
          <mesh
            key={`window-${row}-${col}`}
            position={[
              -10 + col * 3,
              6 - row * 4,
              -1.6
            ]}
            castShadow
          >
            <boxGeometry args={[1.5, 2, 0.1]} />
            <meshStandardMaterial
              color=\"#4A4A4A\"
              roughness={0.05}
              metalness={0.1}
            />
          </mesh>
        ))
      )}

      {/* SIDE WINGS */}
      <mesh position={[-14, 3, 0]} castShadow>
        <boxGeometry args={[8, 10, 2]} />
        <meshStandardMaterial
          color={type === 'boys' ? '#7A3D0A' : '#C4A57B'}
          roughness={0.8}
        />
      </mesh>

      <mesh position={[14, 3, 0]} castShadow>
        <boxGeometry args={[8, 10, 2]} />
        <meshStandardMaterial
          color={type === 'boys' ? '#7A3D0A' : '#C4A57B'}
          roughness={0.8}
        />
      </mesh>

      {/* STUDENT ENROLLMENT PLAQUE */}
      <mesh position={[0, 0.5, -2.5]} castShadow>
        <boxGeometry args={[4, 1.5, 0.1]} />
        <meshStandardMaterial color=\"#F5F0E8\" roughness={0.8} />
      </mesh>

      <Text
        position={[0, 0.5, -2.6]}
        fontSize={0.35}
        color=\"#8B1538\"
        anchorX=\"center\"
        anchorY=\"middle\"
        fontWeight=\"bold\"
      >
        {type === 'boys' ? '3,800+ Students' : '3,000+ Students'}
      </Text>

      {/* GROUND */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color=\"#8B8680\" roughness={0.8} />
      </mesh>
    </group>
  );
};

// ============================================================================
// BASKETBALL COURT
// ============================================================================

interface BasketballCourtProps {
  position: [number, number, number];
  isBoys: boolean;
}

const BasketballCourt: React.FC<BasketballCourtProps> = ({ position, isBoys }) => {
  const [courtHovered, setCourtHovered] = useState(false);

  return (
    <group position={position}>
      <StadiumLighting position={[0, 0, 0]} />

      {/* COURT FLOOR */}
      <mesh
        position={[0, 0.05, 0]}
        receiveShadow
        onPointerEnter={() => setCourtHovered(true)}
        onPointerLeave={() => setCourtHovered(false)}
      >
        <planeGeometry args={[28, 15]} />
        <meshStandardMaterial
          color={courtHovered ? '#FF6B35' : '#E8DCC8'}
          roughness={0.4}
          emissive={courtHovered ? '#FF0000' : undefined}
          emissiveIntensity={courtHovered ? 0.2 : 0}
        />
      </mesh>

      {/* COURT LINES */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[28, 0.1, 0.2]} />
        <meshStandardMaterial color=\"#FFFFFF\" />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.2, 15, 0.1]} />
        <meshStandardMaterial color=\"#FFFFFF\" />
      </mesh>

      {/* BASKETBALL HOOPS */}
      {[-14, 14].map((x) => (
        <group key={`hoop-${x}`} position={[x, 3, 0]}>
          {/* Pole */}
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
            <meshStandardMaterial color=\"#333333\" roughness={0.6} />
          </mesh>

          {/* Backboard */}
          <mesh position={[0, 0, -0.3]} castShadow>
            <boxGeometry args={[1.2, 1.5, 0.08]} />
            <meshStandardMaterial
              color=\"#FFFFFF\"
              transparent
              opacity={0.8}
              roughness={0.1}
              metalness={0.2}
            />
          </mesh>

          {/* Rim */}
          <mesh position={[0, -0.5, -0.5]} castShadow>
            <torusGeometry args={[0.45, 0.08, 8, 16]} />
            <meshStandardMaterial color=\"#FF0000\" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Glow on hover */}
          {courtHovered && (
            <pointLight
              position={[0, -0.5, -0.5]}
              intensity={1.5}
              color=\"#FF0080\"
              distance={10}
            />
          )}
        </group>
      ))}

      {/* CHAMPIONSHIP FRAMES - 4 sides */}
      {[
        { pos: [-15, 2, -8], label: 'Basketball 2023' },
        { pos: [15, 2, -8], label: 'Basketball 2024' }
      ].map((frame, idx) => (
        <mesh key={`court-frame-${idx}`} position={frame.pos as [number, number, number]} castShadow>
          <boxGeometry args={[2.5, 3, 0.1]} />
          <meshStandardMaterial color=\"#D4AF37\" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* SEATING AREAS - Bleachers */}
      <mesh position={[0, 0, 8]} castShadow>
        <boxGeometry args={[30, 0.5, 3]} />
        <meshStandardMaterial color=\"#8B7355\" roughness={0.7} />
      </mesh>
    </group>
  );
};

// ============================================================================
// SWIMMING POOL COMPLEX
// ============================================================================

interface SwimmingPoolComplexProps {
  position: [number, number, number];
  isBoys: boolean;
}

const SwimmingPoolComplex: React.FC<SwimmingPoolComplexProps> = ({ position, isBoys }) => {
  return (
    <group position={position}>
      <PoolLighting position={[0, 0, 0]} poolSize={[50, 25]} />

      {/* POOL BASIN */}
      <mesh position={[0, -2, 0]} castShadow>
        <boxGeometry args={[50, 2, 25]} />
        <meshStandardMaterial
          color=\"#0066CC\"
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* WATER SURFACE */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 25]} />
        <meshStandardMaterial
          color=\"#006EFF\"
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* DIVING PLATFORM */}
      <group position={[0, 0.5, -10]}>
        <mesh castShadow>
          <boxGeometry args={[4, 0.3, 4]} />
          <meshStandardMaterial color=\"#8B7355\" roughness={0.6} />
        </mesh>

        {/* Railings */}
        <mesh position={[-2.2, 1.5, 0]} castShadow>
          <boxGeometry args={[0.15, 3, 0.15]} />
          <meshStandardMaterial color=\"#666666\" />
        </mesh>
        <mesh position={[2.2, 1.5, 0]} castShadow>
          <boxGeometry args={[0.15, 3, 0.15]} />
          <meshStandardMaterial color=\"#666666\" />
        </mesh>
      </group>

      {/* SWIMMING ACHIEVEMENT RECORDS - Wall display */}
      {[
        { pos: [-20, 2, -12], title: '100m Freestyle Record' },
        { pos: [20, 2, -12], title: 'Swimming Championship' }
      ].map((record, idx) => (
        <mesh key={`swim-record-${idx}`} position={record.pos as [number, number, number]} castShadow>
          <boxGeometry args={[2, 2.5, 0.1]} />
          <meshStandardMaterial color=\"#D4AF37\" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* POOL DECK SURROUNDING */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <planeGeometry args={[60, 35]} />
        <meshStandardMaterial color=\"#C0C0C0\" roughness={0.5} />
      </mesh>

      {/* SHADE STRUCTURES */}
      <mesh position={[-15, 2, 10]} castShadow>
        <boxGeometry args={[8, 0.2, 8]} />
        <meshStandardMaterial color=\"#8B7355\" roughness={0.6} />
      </mesh>
      <mesh position={[-15, 3, 10]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 3, 8]} />
        <meshStandardMaterial color=\"#333333\" />
      </mesh>
    </group>
  );
};

// ============================================================================
// COURTYARD AREA
// ============================================================================

const CourtyardArea: React.FC<{ position?: [number, number, number] }> = ({ 
  position = [0, 0, 0] 
}) => {
  return (
    <group position={position}>
      {/* CENTRAL COURTYARD GROUND */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial
          color=\"#D4CCBF\"
          roughness={0.7}
        />
      </mesh>

      {/* PATHWAYS */}
      <mesh position={[0, 0.01, 0]}>
        <planeGeometry args={[3, 25]} />
        <meshStandardMaterial color=\"#A0A09A\" roughness={0.8} />
      </mesh>

      {/* CENTRAL PLAZA FEATURE */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.5, 16]} />
        <meshStandardMaterial
          color=\"#D4AF37\"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      <Text
        position={[0, 1.2, 0]}
        fontSize={0.6}
        color=\"#0B1F3F\"
        anchorX=\"center\"
      >
        Since 1836
      </Text>
    </group>
  );
};

// ============================================================================
// SCROLL TRACKER
// ============================================================================

interface ScrollTrackerProps {
  onProgressUpdate: (progress: number) => void;
}

const ScrollTracker: React.FC<ScrollTrackerProps> = ({ onProgressUpdate }) => {
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
      onProgressUpdate(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onProgressUpdate]);

  return null;
};
