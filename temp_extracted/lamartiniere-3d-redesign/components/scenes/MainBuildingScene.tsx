// app/components/scenes/MainBuildingScene.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  Text, 
  useGLTF,
  PerspectiveCamera,
  Lightformer,
  Float
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';
import { AchievementFrameWall } from './AchievementFrameWall';
import { InteriorLighting } from './InteriorLighting';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// MAIN BUILDING EXTERIOR COMPONENT
// ============================================================================

interface MainBuildingSceneProps {
  onEnterComplete?: () => void;
}

export const MainBuildingScene: React.FC<MainBuildingSceneProps> = ({ 
  onEnterComplete 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInteriorVisible, setIsInteriorVisible] = useState(false);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Canvas
        camera={{
          position: [0, 1.8, 25],
          fov: 50,
          near: 0.1,
          far: 500
        }}
        style={{ background: '#1a1a2e' }}
      >
        <SceneContent 
          scrollProgress={scrollProgress}
          onDoorOpened={() => setIsInteriorVisible(true)}
        />
      </Canvas>

      {/* Scroll Progress Tracker */}
      <ScrollTracker onProgressUpdate={setScrollProgress} />

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        opacity: 1 - scrollProgress * 2,
        transition: 'opacity 300ms',
        pointerEvents: 'none',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '14px',
          fontFamily: 'IBM Plex Sans',
          fontWeight: 300,
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Scroll to Enter
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN SCENE CONTENT COMPONENT
// ============================================================================

interface SceneContentProps {
  scrollProgress: number;
  onDoorOpened?: () => void;
}

const SceneContent: React.FC<SceneContentProps> = ({ scrollProgress, onDoorOpened }) => {
  const { camera } = useThree();
  const buildingGroupRef = useRef<THREE.Group>(null);
  const leftLogoRef = useRef<THREE.Group>(null);
  const rightLogoRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Group>(null);
  const interiorGroupRef = useRef<THREE.Group>(null);
  const [doorOpened, setDoorOpened] = useState(false);
  const doorOpenedRef = useRef(false);

  // ========== MAIN ANIMATION LOOP ==========
  useFrame(() => {
    if (!buildingGroupRef.current) return;

    // Progress states
    const logoFadeStart = 0.0;
    const logoFadeEnd = 0.3;
    const doorOpenStart = 0.3;
    const doorOpenEnd = 0.5;
    const interiorFadeStart = 0.4;
    const interiorFadeEnd = 0.65;

    // ===== CAMERA MOVEMENT =====
    const targetZ = 25 - scrollProgress * 24; // From 25 to 1
    const targetY = 1.8 + scrollProgress * 2;  // Slight lift
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);

    // ===== LOGO PARALLAX & FADE =====
    const logoProg = Math.max(0, Math.min(1, (scrollProgress - logoFadeStart) / (logoFadeEnd - logoFadeStart)));
    const logoOpacity = Math.max(0, 1 - logoProg);

    if (leftLogoRef.current) {
      leftLogoRef.current.position.x = -5 + logoProg * 3;
      leftLogoRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.opacity = logoOpacity;
        }
      });
    }

    if (rightLogoRef.current) {
      rightLogoRef.current.position.x = 5 - logoProg * 3;
      rightLogoRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.opacity = logoOpacity;
        }
      });
    }

    // ===== DOOR OPENING =====
    if (scrollProgress > doorOpenStart && !doorOpenedRef.current) {
      doorOpenedRef.current = true;
      setDoorOpened(true);
      onDoorOpened?.();
      
      // Trigger door opening animation
      if (doorRef.current) {
        gsap.to(doorRef.current.children[0].rotation, {
          y: Math.PI / 4,
          duration: 1.2,
          ease: 'power2.inOut'
        });
        gsap.to(doorRef.current.children[1].rotation, {
          y: -Math.PI / 4,
          duration: 1.2,
          ease: 'power2.inOut'
        });
      }
    }

    // ===== INTERIOR FADE =====
    if (interiorGroupRef.current) {
      const interiorProg = Math.max(0, Math.min(1, (scrollProgress - interiorFadeStart) / (interiorFadeEnd - interiorFadeStart)));
      interiorGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.Material) {
            child.material.opacity = interiorProg;
          }
        }
      });
    }
  });

  return (
    <>
      {/* ENVIRONMENT & LIGHTING */}
      <Environment preset="sunset" />
      
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight intensity={0.4} />

      {/* MAIN BUILDING GROUP */}
      <group ref={buildingGroupRef}>
        {/* BUILDING EXTERIOR */}
        <BuildingExterior />

        {/* LOGO MODELS */}
        <group ref={leftLogoRef} position={[-5, 0.5, -2]}>
          <LogoModel type="boys" />
        </group>
        
        <group ref={rightLogoRef} position={[5, 0.5, -2]}>
          <LogoModel type="girls" />
        </group>

        {/* DOOR */}
        <group ref={doorRef} position={[0, 0, 0.1]}>
          <DoorPanels />
        </group>

        {/* INTERIOR SPACES */}
        <group ref={interiorGroupRef} position={[0, 0, 3]} visible={doorOpened}>
          <InteriorFoyer scrollProgress={scrollProgress} />
        </group>
      </group>
    </>
  );
};

// ============================================================================
// BUILDING EXTERIOR GEOMETRY
// ============================================================================

const BuildingExterior: React.FC = () => {
  const buildingRef = useRef<THREE.Group>(null);

  return (
    <group ref={buildingRef}>
      {/* MAIN FACADE */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[18, 12, 2]} />
        <meshStandardMaterial
          color="#C4A57B"
          roughness={0.85}
          metalness={0}
          map={useTexture('/textures/sandstone.jpg')}
        />
      </mesh>

      {/* ROOF */}
      <mesh position={[0, 9.5, 0]} castShadow>
        <boxGeometry args={[20, 1.5, 3]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.9}
        />
      </mesh>

      {/* ENTRANCE PORTICO */}
      <group position={[0, 0, -1]}>
        {/* Left Column */}
        <mesh position={[-4, 2, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 6]} />
          <meshStandardMaterial color="#A0826D" roughness={0.7} />
        </mesh>
        
        {/* Right Column */}
        <mesh position={[4, 2, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 6]} />
          <meshStandardMaterial color="#A0826D" roughness={0.7} />
        </mesh>

        {/* Lintel */}
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[9, 0.8, 0.6]} />
          <meshStandardMaterial color="#8B7355" roughness={0.7} />
        </mesh>
      </group>

      {/* WINDOWS */}
      <Windows />

      {/* GROUND PLANE */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#8B8680"
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

// ============================================================================
// WINDOWS COMPONENT
// ============================================================================

const Windows: React.FC = () => {
  const windowPositions = [
    // Top row
    [-6, 7, -1.1], [-2, 7, -1.1], [2, 7, -1.1], [6, 7, -1.1],
    // Middle row
    [-6, 3, -1.1], [-2, 3, -1.1], [2, 3, -1.1], [6, 3, -1.1],
  ];

  return (
    <group>
      {windowPositions.map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[1.5, 2, 0.1]} />
          <meshStandardMaterial
            color="#4A4A4A"
            roughness={0.05}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

// ============================================================================
// DOOR PANELS
// ============================================================================

const DoorPanels: React.FC = () => {
  return (
    <group>
      {/* Left Door Panel */}
      <mesh 
        position={[-2.5, 2, 0]}
        castShadow
      >
        <boxGeometry args={[4.5, 7, 0.15]} />
        <meshStandardMaterial
          color="#3D2817"
          roughness={0.2}
          metalness={0.15}
        />
      </mesh>

      {/* Right Door Panel */}
      <mesh 
        position={[2.5, 2, 0]}
        castShadow
      >
        <boxGeometry args={[4.5, 7, 0.15]} />
        <meshStandardMaterial
          color="#3D2817"
          roughness={0.2}
          metalness={0.15}
        />
      </mesh>

      {/* Door Frame */}
      <mesh position={[0, 2, -0.1]}>
        <boxGeometry args={[10, 7.3, 0.2]} />
        <meshStandardMaterial color="#2C2416" roughness={0.3} />
      </mesh>
    </group>
  );
};

// ============================================================================
// LOGO MODELS
// ============================================================================

interface LogoModelProps {
  type: 'boys' | 'girls';
}

const LogoModel: React.FC<LogoModelProps> = ({ type }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  // Glow effect
  const glowColor = type === 'boys' ? '#FF0080' : '#FFD700';

  useFrame(() => {
    if (groupRef.current) {
      // Hover animation
      if (hovered) {
        groupRef.current.scale.lerp(
          new THREE.Vector3(1.15, 1.15, 1.15),
          0.1
        );
      } else {
        groupRef.current.scale.lerp(
          new THREE.Vector3(1, 1, 1),
          0.1
        );
      }

      // Floating animation
      groupRef.current.position.y += Math.sin(Date.now() * 0.001) * 0.001;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => router.push(
        type === 'boys' 
          ? '/laMartiniereForBoys' 
          : '/laMartiniereForGirls'
      )}
      style={{ cursor: hovered ? 'pointer' : 'default' }}
    >
      {/* LOGO BASE GEOMETRY */}
      <mesh castShadow>
        <boxGeometry args={[2.5, 3, 0.5]} />
        <meshStandardMaterial
          color={type === 'boys' ? '#0B1F3F' : '#8B1538'}
          roughness={0.3}
          emissive={glowColor}
          emissiveIntensity={hovered ? 2 : 1}
        />
      </mesh>

      {/* LOGO TEXT */}
      <Text
        position={[0, 0, 0.3]}
        fontSize={0.5}
        color={glowColor}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {type === 'boys' ? 'LMB' : 'LMG'}
      </Text>

      {/* GLOW EFFECT (Post-processing) */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.15}
          wireframe={false}
        />
      </mesh>
    </group>
  );
};

// ============================================================================
// INTERIOR FOYER
// ============================================================================

interface InteriorFoyerProps {
  scrollProgress: number;
}

const InteriorFoyer: React.FC<InteriorFoyerProps> = ({ scrollProgress }) => {
  return (
    <group>
      {/* FOYER ENVIRONMENT */}
      <InteriorLighting />

      {/* FLOOR - MARBLE CHECKERBOARD */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial
          color="#F5F0E8"
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>

      {/* CEILING */}
      <mesh position={[0, 8, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.6} />
      </mesh>

      {/* SIDE WALLS */}
      <mesh position={[-6, 4, 0]} receiveShadow>
        <planeGeometry args={[0.2, 8]} />
        <meshStandardMaterial color="#D4CCBF" roughness={0.7} />
      </mesh>
      
      <mesh position={[6, 4, 0]} receiveShadow>
        <planeGeometry args={[0.2, 8]} />
        <meshStandardMaterial color="#D4CCBF" roughness={0.7} />
      </mesh>

      {/* ACHIEVEMENT FRAME WALLS */}
      <AchievementFrameWall 
        position={[-5, 2, 2]} 
        side="left"
        scrollProgress={scrollProgress}
      />
      
      <AchievementFrameWall 
        position={[5, 2, 2]} 
        side="right"
        scrollProgress={scrollProgress}
      />

      {/* BACK WALL - FOCAL POINT */}
      <BackWallDisplay scrollProgress={scrollProgress} />
    </group>
  );
};

// ============================================================================
// BACK WALL DISPLAY
// ============================================================================

interface BackWallDisplayProps {
  scrollProgress: number;
}

const BackWallDisplay: React.FC<BackWallDisplayProps> = ({ scrollProgress }) => {
  return (
    <group position={[0, 0, -4]}>
      {/* BACK WALL */}
      <mesh receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial 
          color="#D4CCBF" 
          roughness={0.7}
        />
      </mesh>

      {/* ORGANIZATIONAL CHART PLAQUE */}
      <mesh position={[0, 4, 0.1]} castShadow>
        <boxGeometry args={[8, 3, 0.1]} />
        <meshStandardMaterial color="#F5F0E8" roughness={0.8} />
      </mesh>

      <Text
        position={[0, 5, 0.15]}
        fontSize={0.6}
        color="#0B1F3F"
        anchorX="center"
        anchorY="top"
      >
        Organizational Structure
      </Text>

      {/* PRINCIPAL'S PORTRAIT FRAME */}
      <mesh position={[4, 3, 0.1]} castShadow>
        <boxGeometry args={[2.5, 3, 0.15]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.4} metalness={0.7} />
      </mesh>

      <Text
        position={[4, 0.5, 0.2]}
        fontSize={0.3}
        color="#0B1F3F"
        anchorX="center"
      >
        Principal
      </Text>

      {/* CONTACT PLAQUE */}
      <mesh position={[-4, 2, 0.1]} castShadow>
        <boxGeometry args={[2.5, 2, 0.1]} />
        <meshStandardMaterial color="#F5F0E8" roughness={0.8} />
      </mesh>

      <Text
        position={[-4, 3, 0.15]}
        fontSize={0.25}
        color="#8B1538"
        anchorX="center"
      >
        Contact Info
      </Text>

      <Text
        position={[-4, 2.3, 0.15]}
        fontSize={0.15}
        color="#0B1F3F"
        anchorX="center"
      >
        +91 33 4040 6601
      </Text>

      {/* ADMISSION SCROLL PEDESTAL */}
      <mesh position={[0, 0.5, 0.1]}>
        <cylinderGeometry args={[1, 1.2, 1, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.6} />
      </mesh>

      <Text
        position={[0, 1.8, 0.2]}
        fontSize={0.35}
        color="#8B1538"
        anchorX="center"
      >
        Admissions Open
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
  useEffect(() => {
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

// ============================================================================
// UTILITY: TEXTURE LOADER
// ============================================================================

const useTexture = (url: string) => {
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);

  React.useEffect(() => {
    new THREE.TextureLoader().load(url, setTexture);
  }, [url]);

  return texture;
};
