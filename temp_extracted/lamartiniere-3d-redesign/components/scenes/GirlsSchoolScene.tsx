// app/components/scenes/GirlsSchoolScene.tsx
'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { OutdoorLighting, StadiumLighting, PoolLighting, CourtyardLighting, FrameSpotlighting } from './InteriorLighting';
import { AchievementFrameWall } from './AchievementFrameWall';

gsap.registerPlugin(ScrollTrigger);

/**
 * LA MARTINIÈRE FOR GIRLS CAMPUS SCENE
 * Multi-zone experience with courtyard, courts, pools, and achievement galleries
 */

export const GirlsSchoolScene: React.FC = () => {
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
        style={{ background: '#F5E6D3' }}
      >
        <GirlsSchoolContent scrollProgress={scrollProgress} />
      </Canvas>

      <ScrollTracker onProgressUpdate={setScrollProgress} />

      <div style={{
        position: 'absolute',
        top: 40,
        left: 40,
        color: '#0B1F3F',
        fontFamily: 'IBM Plex Serif',
        zIndex: 10
      }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
          La Martinière for Girls
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.8 }}>
          Since 1836 • 3,000+ Students • Educating the Girl Child
        </p>
      </div>

      {/* MISSION & VISION SIDEBAR */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        right: 40,
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '300px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        fontFamily: 'IBM Plex Sans',
        color: '#0B1F3F',
        fontSize: '12px',
        lineHeight: '1.6'
      }}>
        <p><strong>Mission:</strong> Educating the Girl Child & Building Character</p>
        <p><strong>Vision:</strong> Each student contributes to a more equitable and progressive society</p>
      </div>
    </div>
  );
};

// ============================================================================
// GIRLS SCHOOL SCENE CONTENT
// ============================================================================

interface GirlsSchoolContentProps {
  scrollProgress: number;
}

const GirlsSchoolContent: React.FC<GirlsSchoolContentProps> = ({ scrollProgress }) => {
  const { camera } = useThree();
  const campusGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!campusGroupRef.current) return;

    // Camera path through campus
    // 0-25%: Entrance approach through main gates
    // 25-50%: Courtyard exploration with central fountain
    // 50-75%: Sports facilities (basketball & swimming)
    // 75-100%: Gallery immersion + achievement focus

    const stageProgress = scrollProgress;

    if (stageProgress < 0.25) {
      // Entrance approach
      const t = stageProgress / 0.25;
      camera.position.z = THREE.MathUtils.lerp(30, 18, t);
      camera.position.y = THREE.MathUtils.lerp(2, 3, t);
      camera.lookAt(0, 2.5, 0);
    } else if (stageProgress < 0.5) {
      // Courtyard exploration
      const t = (stageProgress - 0.25) / 0.25;
      camera.position.z = THREE.MathUtils.lerp(18, 0, t);
      camera.position.x = Math.sin(t * Math.PI) * 12;
      camera.position.y = THREE.MathUtils.lerp(3, 3.5, t);
      camera.lookAt(0, 2, 0);
    } else if (stageProgress < 0.75) {
      // Sports facilities
      const t = (stageProgress - 0.5) / 0.25;
      camera.position.z = THREE.MathUtils.lerp(0, -18, t);
      camera.position.x = Math.cos(t * Math.PI) * 12;
      camera.position.y = THREE.MathUtils.lerp(3.5, 2.5, t);
      camera.lookAt(0, 1, 0);
    } else {
      // Gallery immersion
      const t = (stageProgress - 0.75) / 0.25;
      camera.position.z = THREE.MathUtils.lerp(-18, -8, t);
      camera.position.y = 2.5;
      camera.lookAt(0, 3, 0);
    }
  });

  return (
    <group ref={campusGroupRef}>
      <Environment preset=\"park\" />
      <CourtyardLighting />

      {/* MAIN ACADEMIC BUILDING */}
      <AcademicBuilding type=\"girls\" position={[0, 0, 0]} />

      {/* CENTRAL COURTYARD */}
      <CentralCourtyard position={[0, 0, 0]} />

      {/* BASKETBALL COURT */}
      <BasketballCourt position={[-18, 0, -12]} isBoys={false} />

      {/* SWIMMING POOL COMPLEX */}
      <SwimmingPoolComplex position={[18, 0, -12]} isBoys={false} />

      {/* ACHIEVEMENT GALLERY */}
      <AchievementFrameWall
        position={[-20, 2, -25]}
        side=\"right\"
        scrollProgress={scrollProgress}
      />

      {/* VALUES CORNER MARKERS */}
      <ValuesCorners />
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
      {/* MAIN FACADE - Cream/ivory with burgundy accents */}
      <mesh castShadow>
        <boxGeometry args={[24, 13, 3.5]} />
        <meshStandardMaterial
          color=\"#D4B5A0\"
          roughness={0.75}
        />
      </mesh>

      {/* ACCENTED PILASTERS */}
      {[-8, 0, 8].map((x) => (
        <mesh key={`pilaster-${x}`} position={[x, 5, -1.8]} castShadow>
          <boxGeometry args={[1.5, 10, 0.3]} />
          <meshStandardMaterial color=\"#8B1538\" roughness={0.7} />
        </mesh>
      ))}

      {/* ROOF - Burgundy tiles */}
      <mesh position={[0, 7, 0]} castShadow>
        <boxGeometry args={[26, 2, 4]} />
        <meshStandardMaterial color=\"#6B0D1F\" roughness={0.9} />
      </mesh>

      {/* ARCHED ENTRANCE PORTICO - Distinctive feature */}
      <mesh position={[0, 1, -2.2]} castShadow>
        <boxGeometry args={[9, 7, 0.6]} />
        <meshStandardMaterial color=\"#C4A57B\" roughness={0.7} />
      </mesh>

      {/* ARCH ELEMENTS */}
      <mesh position={[-3, 4.5, -2.2]} castShadow>
        <sphereGeometry args={[2, 32, 16]} />
        <meshStandardMaterial color=\"#A0826D\" roughness={0.6} />
      </mesh>
      <mesh position={[3, 4.5, -2.2]} castShadow>
        <sphereGeometry args={[2, 32, 16]} />
        <meshStandardMaterial color=\"#A0826D\" roughness={0.6} />
      </mesh>

      {/* SCHOOL LOGO & MOTTO */}
      <Text
        position={[0, 5.5, -2.4]}
        fontSize={1}
        color=\"#FFD700\"
        anchorX=\"center\"
        fontWeight=\"bold\"
      >
        LMG
      </Text>

      <Text
        position={[0, 4, -2.4]}
        fontSize={0.55}
        color=\"#0B1F3F\"
        anchorX=\"center\"
        fontStyle=\"italic\"
      >
        Labore et Constantia
      </Text>

      {/* WINDOWS - With shutters accent */}
      {[...Array(5)].map((_, row) =>
        [...Array(7)].map((_, col) => (
          <mesh
            key={`window-${row}-${col}`}
            position={[
              -9 + col * 3,
              5.5 - row * 3.5,
              -1.8
            ]}
            castShadow
          >
            <boxGeometry args={[1.3, 1.8, 0.1]} />
            <meshStandardMaterial
              color=\"#4A4A4A\"
              roughness={0.05}
              metalness={0.1}
            />
          </mesh>
        ))
      )}

      {/* SIDE WINGS - Distinctive geometry */}
      <mesh position={[-13, 2.5, 0]} castShadow>
        <boxGeometry args={[7, 8, 2.5]} />
        <meshStandardMaterial
          color=\"#C4A57B\"
          roughness={0.75}
        />
      </mesh>

      <mesh position={[13, 2.5, 0]} castShadow>
        <boxGeometry args={[7, 8, 2.5]} />
        <meshStandardMaterial
          color=\"#C4A57B\"
          roughness={0.75}
        />
      </mesh>

      {/* STUDENT ENROLLMENT */}
      <mesh position={[0, 0.3, -2.5]} castShadow>
        <boxGeometry args={[3.5, 1.2, 0.1]} />
        <meshStandardMaterial color=\"#F5F0E8\" roughness={0.8} />
      </mesh>

      <Text
        position={[0, 0.3, -2.6]}
        fontSize={0.3}
        color=\"#8B1538\"
        anchorX=\"center\"
        anchorY=\"middle\"
        fontWeight=\"bold\"
      >
        3,000+ Students
      </Text>

      {/* GROUND */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[55, 40]} />
        <meshStandardMaterial color=\"#D4CCBF\" roughness={0.7} />
      </mesh>
    </group>
  );
};

// ============================================================================
// CENTRAL COURTYARD (Unique to Girls School)
// ============================================================================

const CentralCourtyard: React.FC<{ position?: [number, number, number] }> = ({ 
  position = [0, 0, 0] 
}) => {
  return (
    <group position={position}>
      {/* MAIN COURTYARD GROUND - Patterned stone */}
      <mesh position={[0, 0, 8]} receiveShadow>
        <planeGeometry args={[35, 20]} />
        <meshStandardMaterial
          color=\"#C4B5A0\"
          roughness={0.8}
        />
      </mesh>

      {/* GEOMETRIC PATHWAYS */}
      <mesh position={[0, 0.01, 8]}>
        <boxGeometry args={[35, 2, 0.05]} />
        <meshStandardMaterial color=\"#A0826D\" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.01, 8]}>
        <boxGeometry args={[2, 20, 0.05]} />
        <meshStandardMaterial color=\"#A0826D\" roughness={0.8} />
      </mesh>

      {/* CENTRAL FOUNTAIN */}
      <CentralFountain position={[0, 0.5, 8]} />

      {/* SHADED SEATING AREAS */}
      {[
        [-10, 0.3, 5],
        [10, 0.3, 5],
        [-10, 0.3, 12],
        [10, 0.3, 12]
      ].map((pos, idx) => (
        <group key={`seating-${idx}`} position={pos as [number, number, number]}>
          {/* Canopy */}
          <mesh castShadow>
            <boxGeometry args={[5, 0.2, 5]} />
            <meshStandardMaterial color=\"#8B7355\" roughness={0.6} />
          </mesh>

          {/* Support pole */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 3, 8]} />
            <meshStandardMaterial color=\"#6B5344\" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ============================================================================
// CENTRAL FOUNTAIN (Signature Courtyard Feature)
// ============================================================================

const CentralFountain: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const fountainRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (fountainRef.current) {
      fountainRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={fountainRef} position={position}>
      {/* BASIN - Primary tier */}
      <mesh castShadow>
        <cylinderGeometry args={[3, 3.2, 0.6, 32]} />
        <meshStandardMaterial
          color=\"#D4AF37\"
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* WATER PLANE */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[2.8, 2.8, 0.05, 32]} />
        <meshStandardMaterial
          color=\"#006EFF\"
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* CENTRAL COLUMN */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 2, 16]} />
        <meshStandardMaterial
          color=\"#A0826D\"
          roughness={0.6}
        />
      </mesh>

      {/* TOP WATER JET */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color=\"#006EFF\"
          emissive=\"#0066FF\"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* FOUNTAIN LIGHT */}
      <pointLight
        position={[0, 1.5, 0]}
        intensity={0.8}
        color=\"#00D9FF\"
        distance={12}
      />

      {/* VALUES INSCRIPTION */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        color=\"#0B1F3F\"
        anchorX=\"center\"
        rotation={[0, Math.PI / 4, 0]}
      >
        Honesty • Compassion • Inclusion • Gratitude
      </Text>
    </group>
  );
};

// ============================================================================
// VALUES CORNER MARKERS
// ============================================================================

const ValuesCorners: React.FC = () => {
  const values = [
    { name: 'Honesty', pos: [-20, 0.5, 15], color: '#1F4620' },
    { name: 'Compassion', pos: [20, 0.5, 15], color: '#8B1538' },
    { name: 'Inclusion', pos: [-20, 0.5, 0], color: '#0B1F3F' },
    { name: 'Gratitude', pos: [20, 0.5, 0], color: '#FF0080' }
  ];

  return (
    <group>
      {values.map((value) => (
        <group key={value.name} position={value.pos as [number, number, number]}>
          {/* Stone monument */}
          <mesh castShadow>
            <boxGeometry args={[1.5, 2, 0.3]} />
            <meshStandardMaterial
              color=\"#A0826D\"
              roughness={0.7}
            />
          </mesh>

          {/* Value engraving */}
          <Text
            position={[0, 0.5, 0.2]}
            fontSize={0.35}
            color={value.color}
            anchorX=\"center\"
            fontWeight=\"bold\"
          >
            {value.name}
          </Text>

          {/* Accent light */}
          <pointLight
            position={[0, 1.5, 0.5]}
            intensity={0.5}
            color={value.color}
            distance={6}
          />
        </group>
      ))}
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

const BasketballCourt: React.FC<BasketballCourtProps> = ({ position }) => {
  return (
    <group position={position}>
      <StadiumLighting position={[0, 0, 0]} />

      {/* COURT FLOOR */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[28, 15]} />
        <meshStandardMaterial
          color=\"#D4A574\"
          roughness={0.4}
        />
      </mesh>

      {/* COURT MARKINGS */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[28, 0.1, 0.15]} />
        <meshStandardMaterial color=\"#FFFFFF\" />
      </mesh>

      {/* HOOPS */}
      {[-14, 14].map((x) => (
        <group key={`hoop-${x}`} position={[x, 3, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
            <meshStandardMaterial color=\"#333333\" roughness={0.6} />
          </mesh>

          <mesh position={[0, 0, -0.3]} castShadow>
            <boxGeometry args={[1.2, 1.5, 0.08]} />
            <meshStandardMaterial
              color=\"#FFFFFF\"
              transparent
              opacity={0.8}
              roughness={0.1}
            />
          </mesh>

          <mesh position={[0, -0.5, -0.5]} castShadow>
            <torusGeometry args={[0.45, 0.08, 8, 16]} />
            <meshStandardMaterial color=\"#FFD700\" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      ))}
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

const SwimmingPoolComplex: React.FC<SwimmingPoolComplexProps> = ({ position }) => {
  return (
    <group position={position}>
      <PoolLighting position={[0, 0, 0]} poolSize={[50, 25]} />

      {/* POOL */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 25]} />
        <meshStandardMaterial
          color=\"#00B4FF\"
          roughness={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* DIVING PLATFORM */}
      <mesh position={[0, 0.5, -10]} castShadow>
        <boxGeometry args={[4, 0.3, 4]} />
        <meshStandardMaterial color=\"#8B7355\" roughness={0.6} />
      </mesh>

      {/* POOL DECK */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <planeGeometry args={[60, 35]} />
        <meshStandardMaterial color=\"#CCCCCC\" roughness={0.5} />
      </mesh>
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
