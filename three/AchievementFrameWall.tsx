'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTexture, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SchoolId } from '../content/site-content';

export type AchievementCategory = 'academic' | 'sports' | 'cultural' | 'community' | 'alumni';

export type AchievementData = {
  title: string;
  year: string;
  category: AchievementCategory;
  description: string;
  imageUrl: string;
  imageAlt: string;
  sourceUrl: string;
};

const CATEGORY_COLORS: Record<AchievementCategory, string> = {
  academic: '#0b1f3f', sports: '#1f4620', cultural: '#8b1538', community: '#17606c', alumni: '#8a6817',
};

const sharedSource = 'https://lamartiniere.co/';
const boysSource = 'https://lamartiniere.co/laMartiniereForBoys/index.html';
const girlsSource = 'https://lamartiniere.co/laMartiniereForGirls/gallery.html';

export const SCHOOL_ACHIEVEMENTS: Record<SchoolId, AchievementData[]> = {
  shared: [
    { title: 'Claude Martin Legacy', year: '1836', category: 'alumni', description: 'Founded for the public good of Calcutta', imageUrl: '/images/achievements/shared-founder.webp', imageAlt: 'Portrait of founder Major General Claude Martin', sourceUrl: sharedSource },
    { title: 'Paul Chater Benefaction', year: '1925', category: 'community', description: 'A benefaction that preserved the institution', imageUrl: '/images/achievements/shared-benefactor.webp', imageAlt: 'Portrait of benefactor Sir Catchick Paul Chater', sourceUrl: sharedSource },
    { title: 'Living Heritage', year: '1836–2026', category: 'cultural', description: 'The historic La Martiniere campus', imageUrl: '/images/achievements/shared-campus.webp', imageAlt: 'Historic La Martiniere campus', sourceUrl: sharedSource },
    { title: 'Labore et Constantia', year: '1836', category: 'academic', description: 'By labour and consistent effort', imageUrl: '/images/achievements/shared-legacy-1.webp', imageAlt: 'Official La Martiniere heritage photograph', sourceUrl: sharedSource },
    { title: 'Generations of Martinians', year: '2026', category: 'alumni', description: 'A tradition carried across generations', imageUrl: '/images/achievements/shared-legacy-2.webp', imageAlt: 'Official La Martiniere community photograph', sourceUrl: sharedSource },
    { title: 'A Living Institution', year: '2026', category: 'community', description: 'Scholarship, service and school life', imageUrl: '/images/achievements/shared-legacy-3.webp', imageAlt: 'Official La Martiniere school-life photograph', sourceUrl: sharedSource },
  ],
  boys: [
    { title: 'School of Excellence', year: '2025', category: 'academic', description: 'Academic distinction and leadership', imageUrl: '/images/achievements/boys-gallery-1.webp', imageAlt: 'La Martiniere for Boys official gallery photograph one', sourceUrl: boysSource },
    { title: 'Academic Achievement', year: '2024', category: 'academic', description: 'Outstanding academic performance', imageUrl: '/images/achievements/boys-gallery-2.webp', imageAlt: 'La Martiniere for Boys official gallery photograph two', sourceUrl: boysSource },
    { title: 'Sporting Tradition', year: '2024', category: 'sports', description: 'Competition, teamwork and resolve', imageUrl: '/images/achievements/boys-gallery-3.webp', imageAlt: 'La Martiniere for Boys official gallery photograph three', sourceUrl: boysSource },
    { title: 'Service and Community', year: '2025', category: 'community', description: 'Learning through contribution', imageUrl: '/images/achievements/boys-gallery-4.webp', imageAlt: 'La Martiniere for Boys official gallery photograph four', sourceUrl: boysSource },
    { title: 'Co-curricular Excellence', year: '2024', category: 'cultural', description: 'Creative pursuits beyond the classroom', imageUrl: '/images/achievements/boys-gallery-5.webp', imageAlt: 'La Martiniere for Boys official gallery photograph five', sourceUrl: boysSource },
    { title: 'Men of Substance', year: '2025', category: 'alumni', description: 'Character prepared for a larger world', imageUrl: '/images/achievements/boys-gallery-6.webp', imageAlt: 'La Martiniere for Boys official gallery photograph six', sourceUrl: boysSource },
  ],
  girls: [
    { title: 'Mission and Vision', year: '1836–2026', category: 'academic', description: 'Head, heart and hands education', imageUrl: '/images/achievements/girls-gallery-1.webp', imageAlt: 'La Martiniere for Girls official gallery photograph one', sourceUrl: girlsSource },
    { title: 'Learning in Action', year: '2024', category: 'academic', description: 'Experiential and technology-enabled learning', imageUrl: '/images/achievements/girls-gallery-2.webp', imageAlt: 'La Martiniere for Girls official gallery photograph two', sourceUrl: girlsSource },
    { title: 'Houses and Clubs', year: '2025', category: 'cultural', description: 'Belonging, creativity and collaboration', imageUrl: '/images/achievements/girls-gallery-3.webp', imageAlt: 'La Martiniere for Girls official gallery photograph three', sourceUrl: girlsSource },
    { title: 'Women of Substance', year: '2025', category: 'alumni', description: 'Confidence, compassion and excellence', imageUrl: '/images/achievements/girls-gallery-4.webp', imageAlt: 'La Martiniere for Girls official gallery photograph four', sourceUrl: girlsSource },
    { title: 'Sporting Confidence', year: '2024', category: 'sports', description: 'Strength built through competition', imageUrl: '/images/achievements/girls-gallery-5.webp', imageAlt: 'La Martiniere for Girls official gallery photograph five', sourceUrl: girlsSource },
    { title: 'The Girls School', year: '2026', category: 'community', description: 'A distinct campus within a shared legacy', imageUrl: '/images/achievements/girls-gallery-6.webp', imageAlt: 'Front of La Martiniere for Girls school building', sourceUrl: girlsSource },
  ],
};

/**
 * captionTexture — Playfair Display + Inter hierarchy per animation_Rules.md §2.1.4
 * Title: Playfair Display Bold 54px (#f3eddf ivory)
 * Year·Category: Inter 700 25px (#8B1538 burgundy)
 * Description: Inter 30px (#b7b0a4 muted)
 */
function captionTexture(data: AchievementData, accent: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  // Background
  ctx.fillStyle = '#0b1218';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Category accent stripe (left side) — §2.1.4 burgundy for heritage
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 14, canvas.height);

  // Title — ivory #f3eddf, Playfair Display bold per §2.1.4
  ctx.fillStyle = '#f3eddf';
  ctx.font = '700 52px "Playfair Display", Georgia, serif';
  ctx.fillText(data.title, 54, 76, 900);

  // Subtitle — #8B1538 burgundy, Inter 700 per §2.1.4
  ctx.fillStyle = '#8B1538';
  ctx.font = '700 24px "Inter", Arial, sans-serif';
  ctx.fillText(`${data.year}  ·  ${data.category.toUpperCase()}`, 54, 122);

  // Description — muted, Inter per §2.1.4
  ctx.fillStyle = '#b7b0a4';
  ctx.font = '28px "Inter", Arial, sans-serif';
  ctx.fillText(data.description, 54, 180, 900);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  // §11 mistake 2: LinearFilter prevents pixelation
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * AchievementFrame — Individual framed achievement per animation_Rules.md §2.3.3 & §5.2
 *
 * Hover behaviour:
 *   • Scale 1.0 → 1.08× lerped at factor 0.12 (§5.2 <150ms feel)
 *   • Gold frame emissive 0.15 → 0.45 (§2.1.2 & §2.3.3)
 *   • Glass overlay opacity pulse
 *
 * Entrance reveal:
 *   • revealProgress 0→1 controls opacity + Y float-up (§5.3)
 */
function AchievementFrame({
  data,
  accent,
  revealProgress,
  isPrincipal = false,
  principalPulse = 0,
}: {
  data: AchievementData;
  accent: string;
  revealProgress: number;
  isPrincipal?: boolean;
  principalPulse?: number;
}) {
  const image = useTexture(data.imageUrl);
  const caption = useMemo(() => captionTexture(data, accent), [accent, data]);

  const groupRef = useRef<THREE.Group>(null);
  const frameMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    image.colorSpace = THREE.SRGBColorSpace;
    // §11 mistake 2: anisotropy prevents distance aliasing
    image.anisotropy = 4;
    image.minFilter = THREE.LinearFilter;
    image.magFilter = THREE.LinearFilter;
    image.needsUpdate = true;
    return () => caption.dispose();
  }, [caption, image]);

  useFrame((_, delta) => {
    if (!groupRef.current || !frameMaterialRef.current) return;

    // §5.2 — scale lerp: 1.0 → 1.08 on hover
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, 1),
      0.12  // smooth interpolation, rules-compliant
    );

    // §5.3 — entrance reveal: float up from −0.3 Y offset
    const yOffset = (1 - revealProgress) * -0.3;
    groupRef.current.position.y = yOffset;

    // §2.3.3 — emissive glow on hover (0.15 base → 0.45 hover)
    const baseEmissive = isPrincipal ? principalPulse : 0.15;
    const targetEmissive = hovered ? 0.45 : baseEmissive;
    frameMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      frameMaterialRef.current.emissiveIntensity,
      targetEmissive,
      0.12
    );

    // Opacity from reveal progress (entrance)
    frameMaterialRef.current.opacity = revealProgress;
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = ''; }}
    >
      {/* §2.1.2 — Gold Heritage Frame: #D4AF37, meshStandardMaterial for performance */}
      <RoundedBox args={[2.0, 2.5, 0.12]} radius={0.03} smoothness={4} castShadow>
        <meshStandardMaterial
          ref={frameMaterialRef as any}
          color="#D4AF37"
          roughness={0.2}
          metalness={0.65}
          emissive="#FFD700"
          emissiveIntensity={0.15}
          transparent
          opacity={revealProgress}
        />
      </RoundedBox>

      {/* §2.1.2 — Mat board (warm white #F5F0E8, matte) */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.85, 2.35, 0.04]} />
        <meshStandardMaterial color="#F5F0E8" roughness={0.95} metalness={0} transparent opacity={revealProgress} />
      </mesh>

      {/* Image — §2.4.1. Sized to 1.7w x 1.6h. Top aligns with inner mat 1.7w x 2.1h */}
      <mesh position={[0, 0.25, 0.071]}>
        <planeGeometry args={[1.7, 1.6]} />
        <meshBasicMaterial map={image} toneMapped={false} transparent opacity={revealProgress} />
      </mesh>

      {/* Caption strip — Sized to 1.7w x 0.45h. Meets image perfectly at y = -0.55 */}
      <mesh position={[0, -0.775, 0.072]}>
        <planeGeometry args={[1.7, 0.45]} />
        <meshBasicMaterial map={caption} toneMapped={false} transparent opacity={revealProgress} />
      </mesh>

      {/* §2.3.3 — Hyper-realistic Glass overlay */}
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[1.85, 2.35, 0.01]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={hovered ? 0.85 * revealProgress : 0.95 * revealProgress}
          roughness={0.02}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.02}
          transmission={0.95}
          ior={1.5}
          thickness={0.05}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * AchievementFrameWall — Gallery wall with scroll-driven staggered reveal
 * animation_Rules.md §2.3.1, §2.3.2, §5.1, §5.3
 */
export function AchievementFrameWall({
  side,
  achievements,
  accent,
  baseZ = 9,
  zSpacing = 9,
  frameReveal,
  revealOffset = 0,
}: {
  side: 'left' | 'right';
  achievements: AchievementData[];
  schoolId: SchoolId;
  accent: string;
  baseZ?: number;
  zSpacing?: number;
  /** Per-frame reveal progress array (0→1) from useCinematicEntrance */
  frameReveal?: readonly number[];
  /** Index offset into frameReveal (left=0, right=3) */
  revealOffset?: number;
}) {
  const isLeft = side === 'left';
  return (
    <group>
      {achievements.slice(0, 3).map((data, index) => {
        const reveal = frameReveal ? frameReveal[revealOffset + index] ?? 0 : 1;
        return (
          <group
            key={data.imageUrl}
            // §2.1.1 optimal height range 1.3–2.0m from floor
            position={[isLeft ? -3.84 : 3.84, 3.15, baseZ - index * zSpacing]}
            rotation={[0, isLeft ? Math.PI / 2 : -Math.PI / 2, 0]}
          >
            <AchievementFrame
              data={data}
              accent={accent}
              revealProgress={reveal}
              isPrincipal={index === 0}
            />
          </group>
        );
      })}
    </group>
  );
}
