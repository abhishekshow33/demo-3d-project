'use client';

/**
 * CinematicEntrance — Entrance sequence hook (animation_Rules.md §5.1)
 *
 * Timeline:
 *   0.0s – 0.5s  Ambient light ramps from 0 → 0.8
 *   0.5s – 1.5s  Camera dolly finds focal point
 *   1.5s – 2.5s  Principal frame emissive yoyo pulse 0 → 0.3 → 0.15
 *   2.5s – 4.3s  Secondary frames stagger fade-in (0.3s intervals)
 *   4.3s+        Sequence complete, interactive mode
 *   (Stretching the timeline adds majestic weight, eliminating the "snappy" feeling)
 */

import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type EntrancePhase = 'ambient' | 'dolly' | 'pulse' | 'reveal' | 'done';

export interface CinematicEntranceState {
  /** 0→1 over first 0.2s — use for ambient light intensity */
  ambientProgress: number;
  /** 0→1 over 0.2–0.5s — use for camera dolly interpolation */
  dollyProgress: number;
  /** 0→1 and back over 0.5–1.2s — use for principal frame emissive yoyo */
  pulseValue: number;
  /** Per-frame reveal factor (array[6]) each 0→1, staggered at 0.2s */
  frameReveal: readonly number[];
  /** True once all 3s have elapsed */
  done: boolean;
  /** Current phase label */
  phase: EntrancePhase;
}

const FRAME_COUNT = 6;
const STAGGER_INTERVAL = 0.3; // seconds per frame

export function useCinematicEntrance(): CinematicEntranceState {
  const elapsed = useRef(0);
  const [state, setState] = useState<CinematicEntranceState>({
    ambientProgress: 0,
    dollyProgress: 0,
    pulseValue: 0,
    frameReveal: new Array(FRAME_COUNT).fill(0),
    done: false,
    phase: 'ambient',
  });

  useFrame((_, delta) => {
    if (state.done) return;

    elapsed.current = Math.min(elapsed.current + delta, 5.0);
    const t = elapsed.current;

    // §5.1 — Ambient: 0.0 – 0.5s
    const ambientProgress = THREE.MathUtils.clamp(t / 0.5, 0, 1);

    // §5.1 — Dolly: 0.5 – 1.5s (1.0s duration gives it heavy cinematic weight)
    const dollyProgress = THREE.MathUtils.clamp((t - 0.5) / 1.0, 0, 1);
    const dollyEased = dollyProgress < 0.5
      ? 4 * dollyProgress ** 3
      : 1 - (-2 * dollyProgress + 2) ** 3 / 2;

    // §5.1 — Principal frame pulse yoyo: 1.5 – 2.5s (goes 0→0.3 then back to 0.15)
    const pulseRaw = THREE.MathUtils.clamp((t - 1.5) / 1.0, 0, 1);
    // first half: rise to 1, second half: fall to 0.5 (0.3 * 0.5 = 0.15)
    const pulseValue = pulseRaw < 0.5
      ? pulseRaw * 2 * 0.3
      : (1 - (pulseRaw - 0.5) * 2) * 0.15 + 0.15;

    // §5.1 — Secondary frames stagger: 2.5 – 4.3s (0.3s each)
    const revealStart = 2.5;
    const frameReveal = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const start = revealStart + i * STAGGER_INTERVAL;
      return THREE.MathUtils.clamp((t - start) / 0.5, 0, 1);
    }) as number[];

    // Determine phase
    let phase: EntrancePhase = 'done';
    if (t < 0.5) phase = 'ambient';
    else if (t < 1.5) phase = 'dolly';
    else if (t < 2.5) phase = 'pulse';
    else if (t < 4.3) phase = 'reveal';

    const done = t >= 4.3;

    setState({
      ambientProgress,
      dollyProgress: dollyEased,
      pulseValue,
      frameReveal,
      done,
      phase,
    });
  });

  return state;
}

/**
 * Entrance-aware ambient light — intensity lerps from 0 to targetIntensity
 * following the ambientProgress from useCinematicEntrance.
 */
export function EntranceAmbientLight({
  targetIntensity = 0.8,
  color = '#e8dcc8' as string,
  ambientProgress,
}: {
  targetIntensity?: number;
  color?: string;
  ambientProgress: number;
}) {
  const lightRef = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    if (!lightRef.current) return;
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      targetIntensity * ambientProgress,
      0.12
    );
  });

  return <ambientLight ref={lightRef} color={color} intensity={0} />;
}
