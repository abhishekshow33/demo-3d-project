"use client";

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getExperience } from '../content/experience-config';
import type { SchoolId } from '../content/site-content';

type Vec3 = [number, number, number];

function wrap(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) { lines.push(line); line = word; }
    else line = candidate;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * plaqueTexture — animation_Rules.md §2.5.1 text hierarchy
 *
 * Title:    IBM Plex Serif Bold 70px, #f3eddf (ivory)
 * Eyebrow:  IBM Plex Sans 28px, #8B1538 (burgundy — heritage)
 * Body:     IBM Plex Sans 34px, #c5bfb3 (muted)
 * Border:   #8B7355 (bronze — §2.5.1)
 * Offset:   0.1 units from wall (§2.5.1 slight relief)
 */
function plaqueTexture(eyebrow: string, title: string, copy: string, accent: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200; canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  // §2.5.1 — Matte ivory board background #FFF9EE
  ctx.fillStyle = '#FFF9EE';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // §2.5.1 — Bronze border #8B7355 (not generic accent)
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  // Thin accent line — fixed royal gold for heritage consistency
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

  // §2.5.1 — Eyebrow: burgundy #8B1538, uppercase, Inter 700
  ctx.fillStyle = '#8B1538';
  ctx.font = '700 28px "Inter", "IBM Plex Sans", Arial, sans-serif';
  ctx.fillText(eyebrow.toUpperCase(), 72, 90, 1040);

  // §2.5.1 — Title: Navy primary #0B1F3F, Playfair Display Bold 70px
  ctx.fillStyle = '#0B1F3F';
  ctx.font = '700 70px "Playfair Display", Georgia, "IBM Plex Serif", serif';
  const titleLines = wrap(ctx, title, 1040).slice(0, 3);
  titleLines.forEach((line, i) => ctx.fillText(line, 72, 185 + i * 84));

  // §2.5.1 — Body: dark gray #444444, Inter 34px, line-height 1.8
  ctx.fillStyle = '#444444';
  ctx.font = '34px "Inter", "IBM Plex Sans", Arial, sans-serif';
  const copyLines = wrap(ctx, copy, 1040).slice(0, 4);
  const copyStart = 185 + titleLines.length * 84 + 38;
  copyLines.forEach((line, i) => ctx.fillText(line, 72, copyStart + i * 61));

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  // §11 mistake 2: prevent pixelation
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
  return texture;
}

/**
 * WallPlaque — animation_Rules.md §2.5.1 plaque spec + entrance animation
 *
 * On visible=true: opacity lerps 0→1 over ~400ms
 * On visible=false: opacity lerps 1→0
 * Material: bronze frame #8B7355, matte stone body #A0826D (§Material D)
 */
function WallPlaque({
  visible,
  position,
  rotation,
  accent,
  eyebrow,
  title,
  copy,
  scale = 1,
}: {
  visible: boolean;
  position: Vec3;
  rotation: Vec3;
  accent: string;
  eyebrow: string;
  title: string;
  copy: string;
  scale?: number;
}) {
  const texture = useMemo(
    () => plaqueTexture(eyebrow, title, copy, accent),
    [accent, copy, eyebrow, title]
  );
  useEffect(() => () => texture.dispose(), [texture]);

  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(visible ? 1 : 0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Smooth opacity transition on visibility change (~400ms ramp)
    const target = visible ? 1 : 0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, delta * 2.5);

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m: THREE.MeshStandardMaterial) => {
          if (m.transparent !== undefined) {
            m.opacity = opacityRef.current;
            m.transparent = true;
          }
        });
      }
    });

    groupRef.current.visible = opacityRef.current > 0.01;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* §2.5.1 — Base plaque: bronze frame #8B7355, meshStandardMaterial for performance */}
      <RoundedBox args={[5.15, 3.05, 0.16]} radius={0.04} castShadow receiveShadow>
        <meshStandardMaterial
          color="#8B7355"
          metalness={0.45}
          roughness={0.3}
          transparent
          opacity={1}
        />
      </RoundedBox>

      {/* Content plane */}
      <mesh position={[0, 0, 0.091]}>
        <planeGeometry args={[4.9, 2.8]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={1} />
      </mesh>

      {/* §2.5.1 — Glass overlay (subtle shine, performance-optimized) */}
      <mesh position={[0, 0, 0.105]}>
        <planeGeometry args={[4.94, 2.84]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.07}
          roughness={0.1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function WallNarrativePlaques({ schoolId, activeStage }: { schoolId: SchoolId; activeStage: number }) {
  const experience = getExperience(schoolId);
  const doorZ = schoolId === 'girls' ? -94 : schoolId === 'boys' ? -14 : 17;
  const reverse = schoolId === 'boys';
  const facadeRotation: Vec3 = [0, reverse ? Math.PI : 0, 0];
  const facadeOffset = reverse ? -.42 : .42;
  const specs: Array<{ stage: number; position: Vec3; rotation: Vec3; scale?: number }> = [
    { stage: 1, position: [-14, 7, doorZ + facadeOffset], rotation: facadeRotation, scale: .82 },
    { stage: 2, position: [14, 5.2, doorZ + facadeOffset], rotation: facadeRotation, scale: .76 },
    // Interior stages — positions matched to compressed 28-unit corridor
    { stage: 3, position: [-3.865, 3.2, 5],  rotation: [0, Math.PI / 2, 0], scale: .72 },
    { stage: 4, position: [3.865, 3.2, -1],  rotation: [0, -Math.PI / 2, 0], scale: .72 },
    { stage: 5, position: [-3.865, 3.2, -7], rotation: [0, Math.PI / 2, 0], scale: .72 },
    { stage: 6, position: [-27, 3.1, -48], rotation: [0, 0, 0], scale: .8 },
  ];
  return (
    <group>
      {specs.map((spec) => {
        const chapter = experience.chapters[spec.stage];
        return (
          <WallPlaque
            key={spec.stage}
            visible={activeStage === spec.stage}
            position={spec.position}
            rotation={spec.rotation}
            scale={spec.scale}
            accent={experience.accent}
            eyebrow={chapter.eyebrow}
            title={chapter.title}
            copy={chapter.copy}
          />
        );
      })}
    </group>
  );
}
