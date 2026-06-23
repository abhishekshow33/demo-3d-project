// app/components/scenes/AchievementFrameWall.tsx
'use client';

import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// ============================================================================
// ACHIEVEMENT FRAME DATA
// ============================================================================

interface AchievementData {
  id: string;
  title: string;
  year: number;
  category: 'academic' | 'sports' | 'cultural' | 'community' | 'alumni';
  imagePath: string;
  description: string;
}

const ACHIEVEMENTS_DATABASE: AchievementData[] = [
  {
    id: 'ac-001',
    title: 'ISC Top Scorer 2024',
    year: 2024,
    category: 'academic',
    imagePath: '/achievements/academic-01.jpg',
    description: 'Excellence in academics'
  },
  {
    id: 'sp-001',
    title: 'National Basketball Championship',
    year: 2023,
    category: 'sports',
    imagePath: '/achievements/sports-01.jpg',
    description: 'Victory in national tournament'
  },
  {
    id: 'cl-001',
    title: 'Cultural Fest Winners',
    year: 2024,
    category: 'cultural',
    imagePath: '/achievements/cultural-01.jpg',
    description: 'Excellence in performing arts'
  },
  {
    id: 'cm-001',
    title: 'Community Service Award',
    year: 2023,
    category: 'community',
    imagePath: '/achievements/community-01.jpg',
    description: 'Outstanding service to society'
  },
  {
    id: 'al-001',
    title: 'Alumni Success Stories',
    year: 2024,
    category: 'alumni',
    imagePath: '/achievements/alumni-01.jpg',
    description: 'Global impact of our graduates'
  },
  {
    id: 'al-002',
    title: 'Alumni Global Leaders',
    year: 2024,
    category: 'alumni',
    imagePath: '/achievements/alumni-02.jpg',
    description: 'Leaders across industries'
  }
];

// ============================================================================
// ACHIEVEMENT FRAME WALL COMPONENT
// ============================================================================

interface AchievementFrameWallProps {
  position: [number, number, number];
  side: 'left' | 'right';
  scrollProgress: number;
}

export const AchievementFrameWall: React.FC<AchievementFrameWallProps> = ({
  position,
  side,
  scrollProgress
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [focusedFrameId, setFocusedFrameId] = useState<string | null>(null);
  const { camera } = useThree();

  // Select achievements for this wall based on side
  const wallAchievements = side === 'left' 
    ? ACHIEVEMENTS_DATABASE.slice(0, 3)
    : ACHIEVEMENTS_DATABASE.slice(3, 6);

  // Auto-focus based on scroll progress
  useFrame(() => {
    if (scrollProgress > 0.6) {
      const focusIndex = Math.floor((scrollProgress - 0.6) * 5) % wallAchievements.length;
      setFocusedFrameId(wallAchievements[focusIndex].id);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* WALL BACKGROUND */}
      <mesh position={[0, 0, -0.2]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial
          color={side === 'left' ? '#E8DCC8' : '#D4CCBF'}
          roughness={0.7}
        />
      </mesh>

      {/* FRAME GRID LAYOUT - 2 ROWS × 3 COLUMNS */}
      {wallAchievements.map((achievement, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const x = (col - 1) * 2.2;
        const y = (1 - row) * 2.5;

        return (
          <AchievementFrame
            key={achievement.id}
            position={[x, y, 0]}
            achievement={achievement}
            isFocused={focusedFrameId === achievement.id}
          />
        );
      })}

      {/* WALL LABEL */}
      <Text
        position={[0, 2.8, 0.1]}
        fontSize={0.4}
        color="#8B1538"
        anchorX="center"
        fontWeight="bold"
      >
        {side === 'left' ? 'Academic Excellence' : 'Alumni Success'}
      </Text>
    </group>
  );
};

// ============================================================================
// INDIVIDUAL ACHIEVEMENT FRAME
// ============================================================================

interface AchievementFrameProps {
  position: [number, number, number];
  achievement: AchievementData;
  isFocused: boolean;
}

const AchievementFrame: React.FC<AchievementFrameProps> = ({
  position,
  achievement,
  isFocused
}) => {
  const frameRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Frame dimensions (in world units)
  const frameWidth = 1.8;
  const frameHeight = 2.2;
  const frameBorder = 0.15;

  useFrame(() => {
    if (frameRef.current) {
      // Scale animation on focus/hover
      const targetScale = isFocused || hovered ? 1.12 : 1;
      frameRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Subtle rotation on hover
      if (hovered) {
        frameRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.02;
      } else {
        frameRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group
      ref={frameRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* FRAME BORDER - GOLD MATERIAL */}
      <mesh position={[0, 0, 0.05]} castShadow>
        <boxGeometry
          args={[frameWidth + frameBorder, frameHeight + frameBorder, 0.1]}
        />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.4}
          metalness={0.8}
          emissive={hovered ? '#FFD700' : '#D4AF37'}
          emissiveIntensity={hovered ? 0.5 : 0.1}
        />
      </mesh>

      {/* IMAGE AREA - MATTE BOARD */}
      <mesh position={[0, 0, 0.08]} castShadow>
        <boxGeometry args={[frameWidth - 0.1, frameHeight - 0.1, 0.05]} />
        <meshStandardMaterial
          color="#F5F0E8"
          roughness={0.9}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* GLASS OVERLAY - GLOSSY EFFECT */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry
          args={[frameWidth - 0.2, frameHeight - 0.2, 0.01]}
        />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.05}
          roughness={0.02}
          metalness={0.1}
        />
      </mesh>

      {/* ACHIEVEMENT TITLE */}
      <Text
        position={[0, frameHeight * 0.3, 0.15]}
        fontSize={0.2}
        color="#0B1F3F"
        anchorX="center"
        anchorY="middle"
        maxWidth={frameWidth - 0.4}
        fontWeight="bold"
      >
        {achievement.title}
      </Text>

      {/* YEAR BADGE */}
      <mesh position={[0, -frameHeight * 0.25, 0.1]} castShadow>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial
          color={getCategoryColor(achievement.category)}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      <Text
        position={[0, -frameHeight * 0.25, 0.12]}
        fontSize={0.12}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {achievement.year}
      </Text>

      {/* HOVER LABEL */}
      {hovered && (
        <Text
          position={[0, -frameHeight * 0.45, 0.15]}
          fontSize={0.12}
          color="#8B1538"
          anchorX="center"
          anchorY="middle"
          maxWidth={frameWidth - 0.3}
        >
          {achievement.description}
        </Text>
      )}
    </group>
  );
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'academic':
      return '#1F4620'; // Forest Green
    case 'sports':
      return '#8B1538'; // Burgundy
    case 'cultural':
      return '#0B1F3F'; // Navy
    case 'community':
      return '#FF0080'; // Magenta
    case 'alumni':
      return '#FFD700'; // Gold
    default:
      return '#0B1F3F';
  }
};

// ============================================================================
// CATEGORY FILTER SYSTEM (for future implementation)
// ============================================================================

export const useCategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredAchievements = activeCategory
    ? ACHIEVEMENTS_DATABASE.filter(a => a.category === activeCategory)
    : ACHIEVEMENTS_DATABASE;

  return {
    activeCategory,
    setActiveCategory,
    filteredAchievements,
    categories: ['academic', 'sports', 'cultural', 'community', 'alumni']
  };
};
