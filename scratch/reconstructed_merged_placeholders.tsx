"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, ContactShadows, Sky, SoftShadows, useGLTF, useTexture } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { getExperience, type AssetZone, type CameraKeyframe } from '../content/experience-config';
import type { SchoolId } from '../content/site-content';
import { InteriorLighting, OutdoorLighting, PoolLighting, CourtyardLighting, StadiumLighting, FrameSpotlighting } from './InteriorLighting';
import { useCinematicEntrance } from './CinematicEntrance';
import { AchievementFrameWall, SCHOOL_ACHIEVEMENTS } from './AchievementFrameWall';
import { GirlsCourtyard } from './CourtyardFeatures';
import { useRealisticTextures, type SurfaceTextures } from './RealisticMaterials';
import CinematicEffects from './CinematicEffects';
import WallNarrativePlaques from './WallNarrativePlaques';

type Props = { schoolId: SchoolId; progressRef: React.MutableRefObject<number>; activeStage: number; mobile: boolean; reducedMotion: boolean };
type Rig = { position: THREE.CatmullRomCurve3; gaze: THREE.CatmullRomCurve3 };
const positionTarget = new THREE.Vector3();
const gazeTarget = new THREE.Vector3();

function InteriorAtmosphere({ reducedMotion, accent }: { reducedMotion: boolean; accent: string }) {
  const motes = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(150 * 3);
    let seed = 1836;
    const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let index = 0; index < values.length; index += 3) {
      values[index] = (random() - .5) * 7.2;
      values[index + 1] = .35 + random() * 5.8;
      values[index + 2] = -18 + random() * 38;
    }
    return values;
  }, []);
  useFrame((state) => {
    if (!motes.current || reducedMotion) return;
    motes.current.rotation.y = Math.sin(state.clock.elapsedTime * .08) * .018;
    motes.current.position.y = Math.sin(state.clock.elapsedTime * .22) * .05;
  });
  return (
    <group>
      <points ref={motes}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
        <pointsMaterial color="#f6d7a2" size={.028} transparent opacity={.42} depthWrite={false} sizeAttenuation />
      </points>
      {[-2.3, 0, 2.3].map((x) => (
        <mesh key={x} position={[x, 3.4, 12]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[1.15, 6.5, 20, 1, true]} />
          <meshBasicMaterial color={accent} transparent opacity={.025} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function curve(points: readonly CameraKeyframe[], field: 'position' | 'lookAt') {
  return new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point[field])), false, 'centripetal', .35);
}

function Zone({ zone, schoolId, textures }: { zone: AssetZone; schoolId: SchoolId; textures: SurfaceTextures }) {
  const { scene } = useGLTF(zone.url);
  const clone = useMemo(() => {
    const next = scene.clone(true);
    next.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      const styled = materials.map((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return material;
        const copy = material.clone();
        const name = material.name.toLowerCase();
        copy.envMapIntensity = 1.15;
        if (/(heritage white|aged off white|warm heritage|plaster)/.test(name)) {
          copy.color.set(schoolId === 'shared' ? '#d8c9aa' : schoolId === 'boys' ? '#ddd9ca' : '#e4dfd2');
          copy.roughness = .78;
          copy.map = schoolId === 'shared' ? textures.sandstone : textures.plaster;
          copy.roughnessMap = textures.plaster;
          copy.normalMap = textures.plasterNormal;
          copy.normalScale.set(.28, .28);
        }
        if (/(shutter|deep green)/.test(name)) { copy.color.set(schoolId === 'boys' ? '#1f4620' : '#8b1538'); copy.roughness = .58; }
        if (/(stone|sandstone|trim|cornice)/.test(name)) { copy.map = textures.sandstone; copy.roughnessMap = textures.sandstone; copy.normalMap = textures.sandstoneNormal; copy.normalScale.set(.42, .42); copy.roughness = .76; }
        return copy;
      });
      object.material = Array.isArray(object.material) ? styled : styled[0];
    });
    return next;
  }, [scene, schoolId, textures]);
  return <primitive object={clone} />;
}

function BasketballHoop({ position, rotation = 0, accent }: { position: [number, number, number]; rotation?: number; accent: string }) {
  const [hovered, setHovered] = useState(false);
  const rim = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, delta) => {
    if (!rim.current) return;
    rim.current.emissiveIntensity = THREE.MathUtils.lerp(rim.current.emissiveIntensity, hovered ? 2.2 : 0.4, 8 * delta);
  });
// MISSING LINE 101
// MISSING LINE 102
// MISSING LINE 103
// MISSING LINE 104
// MISSING LINE 105
// MISSING LINE 106
// MISSING LINE 107
// MISSING LINE 108
// MISSING LINE 109
      {/* Support arm */}
      <mesh position={[0, 4.1, -0.55]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 1.2]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Backboard */}
      <mesh position={[0, 3.72, -0.5]} castShadow>
        <boxGeometry args={[2.4, 1.42, 0.08]} />
        <meshPhysicalMaterial color="#e8f4f8" roughness={0.1} metalness={0.05} transmission={0.6} transparent opacity={0.85} />
      </mesh>
      {/* Backboard red square */}
      <mesh position={[0, 3.72, -0.44]}>
        <boxGeometry args={[0.9, 0.6, 0.01]} />
        <meshBasicMaterial color="#c0392b" wireframe />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 3.26, -0.95]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.45, 0.03, 12, 32]} />
        <meshStandardMaterial ref={rim} color="#e67e22" emissive={accent} emissiveIntensity={0.4} metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Net */}
      {netSegments.map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.38, 3.0, -0.95 + Math.sin(angle) * 0.38]} castShadow>
          <cylinderGeometry args={[0.005, 0.008, 0.52, 4]} />
          <meshBasicMaterial color="#f5f0e8" transparent opacity={0.7} />
        </mesh>
      ))}
      {/* Rim spotlight */}
      <pointLight position={[0, 3.5, -0.95]} color={accent} intensity={hovered ? 8 : 3} distance={6} />
    </group>
  );
}

function Door({ open, accent, textures, position = [0, 0, 17], rotation = [0, 0, 0], scale = 1, progressRef, reducedMotion = false, openRange = [.28, .37] }: { open: number; accent: string; textures: SurfaceTextures; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; progressRef?: React.MutableRefObject<number>; reducedMotion?: boolean; openRange?: readonly [number, number] }) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const thresholdLight = useRef<THREE.PointLight>(null);
  const openness = useRef(open);
  
  useFrame((_, delta) => {
// MISSING LINE 150
    const requested = progressRef
      ? (reducedMotion ? 1 : THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((progressRef.current - openRange[0]) / Math.max(openRange[1] - openRange[0], .001), 0, 1), 0, 1))
      : open;
    openness.current = THREE.MathUtils.damp(openness.current, requested, 5.5, delta);
    // The leaves now swing inward on their masonry-side hinges. The previous
    // lateral translation made the entrance read as an automatic sliding door.
    left.current.rotation.y = openness.current * 1.34;
    right.current.rotation.y = -openness.current * 1.34;
    if (thresholdLight.current) thresholdLight.current.intensity = openness.current * 7;
  });

  const leaf = (side: 'left' | 'right') => {
    const direction = side === 'left' ? 1 : -1;
    return (
      <group position={[direction * 1.5, 0, 0]}>
        <mesh position={[0, 2.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.94, 5.4, .32]} />
          <meshStandardMaterial map={textures.wood} normalMap={textures.woodNormal} normalScale={new THREE.Vector2(.35, .35)} color="#66452a" roughness={.46} metalness={.08} />
        </mesh>
        {[1.15, 2.45, 3.75].map((y) => (
          <group key={y} position={[0, y, .19]}>
            <mesh castShadow><boxGeometry args={[2.25, .92, .09]} /><meshStandardMaterial color="#9a743d" roughness={.42} metalness={.18} /></mesh>
            <mesh position={[0, 0, .055]}><boxGeometry args={[1.91, .62, .06]} /><meshStandardMaterial map={textures.wood} normalMap={textures.woodNormal} color="#2d1c0f" roughness={.62} /></mesh>
          </group>
        ))}
        {[.52, 2.7, 4.86].map((y) => (
          <group key={y} position={[-direction * 1.43, y, .2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.055, .055, .3, 12]} /><meshStandardMaterial color="#8d6c35" metalness={.78} roughness={.22} /></mesh>
            <mesh position={[direction * .11, 0, 0]}><boxGeometry args={[.28, .16, .08]} /><meshStandardMaterial color="#8d6c35" metalness={.78} roughness={.22} /></mesh>
          </group>
        ))}
        <group position={[-direction * .98, 2.68, .24]}>
          <mesh><boxGeometry args={[.16, .54, .06]} /><meshStandardMaterial color="#b99755" metalness={.82} roughness={.2} /></mesh>
          <mesh position={[-direction * .16, .08, .04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.055, .055, .36, 12]} /><meshStandardMaterial color="#d2b16b" metalness={.88} roughness={.16} /></mesh>
          <mesh position={[0, -.18, .04]}><circleGeometry args={[.035, 12]} /><meshBasicMaterial color="#19130e" /></mesh>
        </group>
      </group>
    );
// MISSING LINE 189
// MISSING LINE 190
// MISSING LINE 191
// MISSING LINE 192
// MISSING LINE 193
// MISSING LINE 194
// MISSING LINE 195
// MISSING LINE 196
// MISSING LINE 197
// MISSING LINE 198
// MISSING LINE 199
// MISSING LINE 200
// MISSING LINE 201
// MISSING LINE 202
// MISSING LINE 203
// MISSING LINE 204
// MISSING LINE 205
// MISSING LINE 206
// MISSING LINE 207
// MISSING LINE 208
// MISSING LINE 209
// MISSING LINE 210
// MISSING LINE 211
// MISSING LINE 212
// MISSING LINE 213
// MISSING LINE 214
// MISSING LINE 215
    shape.moveTo(-2.15, 2.15); shape.lineTo(2.15, 2.15); shape.lineTo(2.05, .25);
    shape.bezierCurveTo(1.95, -1.15, .92, -2.08, 0, -2.62);
    shape.bezierCurveTo(-.92, -2.08, -1.95, -1.15, -2.05, .25); shape.closePath();
    return shape;
  }, []);
  useEffect(() => { texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; texture.needsUpdate = true; }, [texture]);
  useFrame((state) => {
    if (!group.current) return;
    // Gentle royal bob — always visible, never depart
    if (!reducedMotion) {
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.18;
    }
    group.current.scale.setScalar(hovered ? 1.08 : 1.0);
    group.current.visible = true;
  });
  return (
    <group ref={group} position={position} rotation={rotation} onClick={(event) => { event.stopPropagation(); router.push(href); }} onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}>
      <mesh castShadow><extrudeGeometry args={[shield, CREST_EXTRUDE]} /><meshPhysicalMaterial color="#c49a30" metalness={.88} roughness={.15} clearcoat={1} clearcoatRoughness={.12} emissive="#9a7020" emissiveIntensity={0.4} /></mesh>
      <mesh position={[0, 0, .32]} scale={.88}><extrudeGeometry args={[shield, CREST_INSET_EXTRUDE]} /><meshPhysicalMaterial color="#07131d" emissive={accent} emissiveIntensity={hovered ? 1.2 : 0.7} metalness={.42} roughness={.24} clearcoat={1} clearcoatRoughness={.12} /></mesh>
      <mesh position={[0, -.05, .53]}><planeGeometry args={[3.62, 4.18]} /><meshBasicMaterial map={texture} transparent alphaTest={.04} toneMapped={false} /></mesh>
      {/* Strong accent glow — visible from far away */}
      <pointLight position={[0, 0, 3]} color={accent} intensity={hovered ? 18 : 12} distance={28} />
      <pointLight position={[0, 0, -2]} color={accent} intensity={4} distance={14} />
    </group>
  );
}

function CheckerboardFloor({ length, marbleTexture }: { length: number; marbleTexture: THREE.Texture }) {
  const countX = 8;
  const countZ = length;
  const count = countX * countZ;
  
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const colorArray = useMemo(() => new Float32Array(count * 3), [count]);
  
  useEffect(() => {
    if (!meshRef.current) return;
    const matrix = new THREE.Matrix4();
    const colorWhite = new THREE.Color('#F5F0E8');
    const colorGrey = new THREE.Color('#E0E0E0');
    
    let idx = 0;
    for (let x = 0; x < countX; x++) {
      for (let z = 0; z < countZ; z++) {
        const posX = x - (countX / 2) + 0.5;
        const posZ = z - (countZ / 2) + 0.5;
        matrix.setPosition(posX, 0, posZ);
        meshRef.current.setMatrixAt(idx, matrix);
        
        const c = ((x + z) % 2 === 0) ? colorWhite : colorGrey;
// MISSING LINE 266
// MISSING LINE 267
// MISSING LINE 268
// MISSING LINE 269
// MISSING LINE 270
// MISSING LINE 271
// MISSING LINE 272
// MISSING LINE 273
// MISSING LINE 274
// MISSING LINE 275
// MISSING LINE 276
// MISSING LINE 277
// MISSING LINE 278
// MISSING LINE 279
// MISSING LINE 280
// MISSING LINE 281
// MISSING LINE 282
// MISSING LINE 283
// MISSING LINE 284
// MISSING LINE 285
// MISSING LINE 286
// MISSING LINE 287
// MISSING LINE 288
// MISSING LINE 289
    
    ct
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = '#0B1F3F';
    ctx.font = 'bold 130px "IBM Plex Serif", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [text]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[4, 1]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.05} roughness={0.6} depthWrite={false} polygonOffset polygonOffsetFactor={-1} />
    </mesh>
  );
}

function Interior({ visible, accent, schoolId, textures, progressRef, reducedMotion }: { visible: boolean; accent: string; schoolId: SchoolId; textures: SurfaceTextures; progressRef: React.MutableRefObject<number>; reducedMotion: boolean }) {
  const achievements = SCHOOL_ACHIEVEMENTS[schoolId] || SCHOOL_ACHIEVEMENTS.shared;
  const leftAchievements = achievements.slice(0, 3);
  const rightAchievements = achievements.slice(3, 6);
  
  const leftFramePositions = [0, 1, 2].map(i => [-3.84, 3.15, 6 - i * 7] as [number, number, number]);
  const rightFramePositions = [0, 1, 2].map(i => [3.84, 3.

  // §5.1 — 3-second cinematic entrance sequence
  const entrance = useCinematicEntrance();

  return (
    <group visible={visible}>
      {/* §5.1 — entranceProgress ramps ambient + chandelier from 0→0.8 in first 0.2s */}
      <InteriorLighting entranceProgress={entrance.ambientProgress} />
      <FrameSpotlighting side="left" framePositions={leftFramePositions} />
      <FrameSpotlighting side="right" framePositions={rightFramePositions} />

      {/* Corridor floor — §2.2.1 Marble Checkerboard Pattern, 28 units deep */}
      <CheckerboardFloor length={28} marbleTexture={textures.marble} />
      
      {/* §2.2.2 Engraved Text on Floor — 'Labore et Constantia' near entrance */}
      <FloorEngraving text="Labore et Constantia" position={[0, -.07, 10]} />

 
// MISSING LINE 341
// MISSING LINE 342
// MISSING LINE 343
// MISSING LINE 344
// MISSING LINE 345
// MISSING LINE 346
// MISSING LINE 347
// MISSING LINE 348
// MISSING LINE 349
// MISSING LINE 350
// MISSING LINE 351
// MISSING LINE 352
// MISSING LINE 353
// MISSING LINE 354
// MISSING LINE 355
// MISSING LINE 356
// MISSING LINE 357
// MISSING LINE 358
// MISSING LINE 359
// MISSING LINE 360
// MISSING LINE 361
// MISSING LINE 362
// MISSING LINE 363
// MISSING LINE 364
// MISSING LINE 365
      <AchievementFrameWall side="left" achievements={leftAchievements} schoolId={schoolId} accent={accent} frameReveal={entrance.frameReveal} revealOffset={0} baseZ={6} zSpacing={7} />
      <AchievementFrameWall side="right" achievements={rightAchievements} schoolId={schoolId} accent={accent} frameReveal={entrance.frameReveal} revealOffset={3} baseZ={6} zSpacing={7} />


      {/* Rear door — pulled closer from Z=-20.72 to match compressed 28-unit corridor */}
      <Door open={1} accent={accent} textures={textures} />
      <mesh position={[-3.55, 3.15, -14.5]} castShadow><boxGeometry args={[1.1, 6.3, .28]} /><meshStandardMaterial map={textures.plaster} normalMap={textures.plasterNormal} color="#dfd5c4" roughness={.84} /></mesh>
      <mesh position={[3.55, 3.15, -14.5]} castShadow><boxGeometry args={[1.1, 6.3, .28]} /><meshStandardMaterial map={textures.plaster} normalMap={textures.plasterNormal} color="#dfd5c4" roughness={.84} /></mesh>
      <mesh position={[0, 6.05, -14.5]} castShadow><boxGeometry args={[6.1, .5, .28]} /><meshStandardMaterial map={textures.sandstone} normalMap={textures.sandstoneNormal} color="#cbb58f" roughness={.76} /></mesh>
      <Door open={0} accent={accent} textures={textures} position={[0, 0, -14.36]} rotation={[0, Math.PI, 0]} scale={.7} progressRef={progressRef} reducedMotion={reducedMotion} openRange={[.665, .72]} />
      {/* Garden patch just beyond rear door */}
      <mesh position={[0, -.02, -17]} receiveShadow><boxGeometry args={[7, .12, 5]} /><meshStandardMaterial map={textures.grass} color="#466b45" roughness={.96} /></mesh>
      <pointLight position={[0, 3.5, -17]} color="#e4f4cf" intensity={14} distance={14} />
    </group>
  );
}

function PoolWater({ color, reducedMotion, textures }: { color: string; reducedMotion: boolean; textures: SurfaceTextures }) {
  const water = useRef<THREE.Mesh>(null);
  const ripple1 = useRef<THREE.Mesh>(null);
  const ripple2 = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (water.current) {
      water.current.position.y = 0.31 + Math.sin(t * 0.5) * 0.008;
      textures.poolNormal.offset.set(t * 0.012, t * 0.008);
    }
    // Caustic ripple rings
    if (ripple1.current) { ripple1.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04); ripple1.current.material && ((ripple1.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 1.2) * 0.15); }
    if (ripple2.current) { ripple2.current.scale.setScalar(1 + Math.sin(t * 0.9 + 1.5) * 0.04); ripple2.current.material && ((ripple2.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 0.9 + 1.5) * 0.15); }
  });
  return (
    <group>
      {/* Pool floor — deep blue gradient illusion */}
      <mesh position={[5, -0.8, -18]}>
        <boxGeometry args={[49, 0.05, 24]} />
        <meshStandardMaterial color="#0a4d6e" roughness={0.9} />
      </mesh>
      {/* Pool walls */}
      {([[5, 0.6, -6.2], [5, 0.6, -29.8]] as [number,number,number][]).map((pos, i) => (
        <mesh key={i} position={pos}><boxGeometry args={[49.4, 1.2, 0.22
    if (ripple1.current) { ripple1.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04); ripple1.current.material && ((ripple1.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 1.2) * 0.15); }
    if (ripple2.current) { ripple2.current.scale.setScalar(1 + Math.sin(t * 0.9 + 1.5) * 0.04); ripple2.current.material && ((ripple2.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 0.9 + 1.5) * 0.15); }
  });
  return (
    <group>
      {/* Pool floor — deep blue gradient illusion */}
      <mesh position={[5, -0.8, -18]}>
        <boxGeometry args={[49, 0.05, 24]} />
        <meshStandardMaterial color="#0a4d6e" roughness={0.9} />
          {Array.from({ length: 30 }, (_, i) => (
            <mesh key={i} position={[-23 + i * 1.6, 0, 0]}>
              <sphereGeometry args={[0.065, 6, 4]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#e74c3c' : '#f5f5f5'} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Animated caustic ripples */}
      </mesh>
      {/* Lane ropes — 8 lanes */}
      {[-10, -7, -4, -1, 2, 5, 8].map((z) => (
        <group key={z} position={[5, 0.38, -18 + z * 1.7]}>
          {Array.from({ length: 30 }, (_, i) => (
        <ringGeometry args={[1.5, 1.9, 32]} />
        <meshBasicMaterial color="#88ddff" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {/* Underwater glow lights */}
      {[-20, -8, 4, 16].map((x) => (
        <pointLight key={x} position={[5 + x, 0.1, -18]} color={color} intensity={6} distance={14} />
      ))}
    </group>
  );
}

function SportsCampus({ visible, accent, schoolId, textures, reducedMotion }: { visible: boolean; accent: string; schoolId: SchoolId; textures: SurfaceTextures; reducedMotion: boolean }) {
  const poolBlue = schoolId === 'girls' ? '#38a9c7' : '#2389b8';
  const courtColor = schoolId === 'girls' ? '#7b3553' : '#6b2d2d';
  return (
    // Sports campus pulled from Z=-55 to Z=-40 to reduce the void between interior exit and first court
    <group visible={visible} position={[0, 0, -40]}>
      {/* Ground */}
      <mesh position={[0, -0.08, 2]} receiveShadow>
        <boxGeometry args={[68, 0.16, 64]} />
        <meshStandardMaterial map={textures.grass} roughnessMap={textures.grass} color="#3a5a3c" roughness={0.96} />
      </mesh>

      {/* ── BASKETBALL COURT ── */}
      {/* Main court surface */}
      <mesh position={[-13, 0.02, 5]} receiveShadow>
        <boxGeometry args={[29, 0.06, 18]} />
        <meshStandardMaterial map={textures.court} normalMap={textures.courtNormal} normalScale={new THREE.Vector2(0.4, 0.4)} color={courtColor} roughness={0.72} />
      </mesh>
      {/* Court boundary lines */}
      {[[-13, 0.09, 5]] .map((pos, i) => (
        <mesh key={i} position={pos as [number,number,number]}>
          <boxGeometry args={[28.8, 0.01, 17.8]} />
          <meshBasicMaterial color="#f5f0e0" wireframe />
        </mesh>
      ))}
      {/* Center line */}
      <mesh position={[-13, 0.09, 5]}>
        <boxGeometry args={[0.08, 0.01, 17.8]} />
        <meshBasicMaterial color="#f5f0e0" />
      </mesh>
      {/* Center circle */}
      <mesh position={[-13, 0.09, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.82, 36]} />
        <meshBasicMaterial color="#f5f0e0" />
      </mesh>
      {/* 3-point arcs — left & right */}
      {([-27, 1] as number[]).map((cx) => (
        <mesh key={cx} position={[cx, 0.09, 5]} rotation={[-Math.PI / 2, cx < -13 ? 0 : Math.PI, 0]}>
          <ringGeometry args={[5.6, 5.76, 32, 1, 0, Math.PI]} />
          <meshBasicMaterial color="#f5f0e0" transparent opacity={0.9} />
        </mesh>
      ))}
      {/* Free-throw circles */}
      {([-22.5, -3.5] as number[]).map((cx) => (
        <mesh key={cx} position={[cx, 0.09, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.75, 1.88, 28]} />
          <meshBasicMaterial color="#f5f0e0" transparent opacity={0.8} />
        </mesh>
      ))}
      {/* Accent glow overlay */}
      <mesh position={[-13, 0.055, 5]}>
        <boxGeometry args={[29, 0.01, 18]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.08} transparent opacity={0.15} />
      </mesh>
      {/* Stadium floodlights */}
      <StadiumLighting />
      {/* Extra court-level lights for drama */}
      <pointLight position={[-13, 8, 5]} color={accent} intensity={16} distance={28} />
      <pointLight position={[-24, 5, 5]} color="#fff8e7" intensity={10} distance={18} />
      <pointLight position={[-2, 5, 5]} color="#fff8e7" intensity={10} distance={18} />
      {/* Hoops */}
      <BasketballHoop position={[-26, 0, 5]} rotation={Math.PI / 2} accent={accent} />
      <BasketballHoop position={[0, 0, 5]} rotation={-Math.PI / 2} accent={accent} />

      {/* ── POOL AREA ── */}
      {/* Pool deck (surround) */}
      <mesh position={[5, 0.1, -18]} receiveShadow>
// MISSING LINE 509
// MISSING LINE 510
// MISSING LINE 511
// MISSING LINE 512
// MISSING LINE 513
// MISSING LINE 514
// MISSING LINE 515
// MISSING LINE 516
// MISSING LINE 517
// MISSING LINE 518
// MISSING LINE 519
// MISSING LINE 520
// MISSING LINE 521
// MISSING LINE 522
// MISSING LINE 523
// MISSING LINE 524
// MISSING LINE 525
// MISSING LINE 526
// MISSING LINE 527
// MISSING LINE 528
// MISSING LINE 529
// MISSING LINE 530
// MISSING LINE 531
// MISSING LINE 532
// MISSING LINE 533
// MISSING LINE 534
// MISSING LINE 535
// MISSING LINE 536
// MISSING LINE 537
// MISSING LINE 538
// MISSING LINE 539
// MISSING LINE 540
// MISSING LINE 541
            <boxGeometry args={[1.05, 0.06, 0.55]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} roughness={0.4} />
          </mesh>
          {/* Block legs */}
          {[-0.45, 0.45].map((bx) => (
            <mesh key={bx} position={[bx, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.36, 6]} />
              <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Pool lighting rig */}
      <PoolLighting poolPosition={[5, 0, -18]} />

      {schoolId === 'girls' && (
        <>
          <GirlsCourtyard accent={accent} position={[15, 0, 18]} scale={0.7} />
          <CourtyardLighting />
        </>
      )}

      {/* Ambient campus fill */}
      <pointLight position={[0, 10, 5]} intensity={10} distance={45} color={accent} />
      <hemisphereLight args={['#87ceeb', '#2d4a2d', 0.6]} />
    </group>
  );
}

export default function BuildingScene({ schoolId, progressRef, activeStage, mobile, reducedMotion }: Props) {
  const experience = getExperience(schoolId);
  const { camera, gl } = useThree();
  const textures = useRealisticTextures();
  const smoothedGaze = useRef(new THREE.Vector3());
  const previousStage = useRef(-1);
  const rigs = useMemo<Rig[]>(() => experience.stages.map((stage) => ({ position: curve(stage.keyframes, 'position'), gaze: curve(stage.keyframes, 'lookAt') })), [experience]);
  const exteriorZones = experience.zones.filter((zone) => zone.stages.includes(activeStage));
  const stage = experience.stages[activeStage] ?? experience.stages[0];
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl, mobile]);

  useEffect(() => {
    const nextStage = Math.min(activeStage + 1, experience.stages.length - 1);
    experience.zones.filter((zone) => zone.stages.includes(nextStage)).forEach((zone) => {
      useGLTF.preload(zone.url);
    });
  }, [activeStage, experience, mobile]);

  useFrame((_, delta) => {
    const progress = reducedMotion ? stage.range[0] : progressRef.current;
    const local = THREE.MathUtils.clamp((progress - stage.range[0]) / Math.max(stage.range[1] - stage.range[0], .001), 0, 1);
    const rig = rigs[activeStage] ?? rigs[0];
    rig.position.getPoint(local, positionTarget);
    rig.gaze.getPoint(local, gazeTarget);
    if (previousStage.current !== activeStage) {
      camera.position.copy(positionTarget);
      smoothedGaze.current.copy(gazeTarget);
      previousStage.current = activeStage;
    }
    const damping = reducedMotion ? 1 : 1 - Math.exp(-delta * 4.2);
    camera.position.lerp(positionTarget, damping);
    smoothedGaze.current.lerp(gazeTarget, 1 - Math.exp(-delta * 3.5));
    camera.lookAt(smoothedGaze.current);
    if (camera instanceof THREE.PerspectiveCamera) {
      // §4.1 — 50° FOV for interior gallery (better frame legibility than 40°)
    const targetFov = stage.world === 'interior'
      ? (mobile ? 55 : 50)
      : (mobile ? Math.max(stage.fov, 40) : stage.fov);
    camera.fov = T
    if (camera instanceof THREE.PerspectiveCamera) {
      // §4.1 — 50° FOV for inte
// MISSING LINE 613
      ? (mobile ? 55 : 50)
      : (mobile ? Math.max(stage.fov, 40) : stage.fov);
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, damping);
      camera.updateProjectionMatrix();
    }
    const exposure = stage.world === 'interior' ? 1.04 : stage.world === 'sports' ? .98 : .92;
    gl.toneMappingExposure = THREE.MathUtils.damp(gl.toneMappingExposure, exposure, 3.2, delta);
  });

  return (
    <>
      <AdaptiveDpr />
      <color attach="background" args={['#071019']} />
      <fog attach="fog" args={['#071019', 58, 180]} />
      {!mobile && <SoftShadows size={16} samples={10} focus={.45} />}
      {(stage.world !== 'interior' || activeStage === 5) && <Sky distance={450000} sunPosition={[70, 25, -90]} turbidity={8} rayleigh={1.1} mieCoefficient={.006} mieDirectionalG={.82} />}
      {stage.world === 'exterior' ? <OutdoorLighting /> : (
        <>
      <group visible={stage.world === 'exterior'}>
        {exteriorZones.map((zone) => <Zone key={zone.id} zone={zone} schoolId={schoolId} textures={textures} />)}
        <Door open={0} accent={experience.accent} textures={textures} position={schoolId === 'girls' ? [0, 0, -94] : schoolId === 'boys' ? [0, 0, -14] : [0, 0, 17]} rotation={schoolId === 'boys' ? [0, Math.PI, 0] : [0, 0, 0]} progressRef={progressRef} reducedMotion={reducedMotion} />
        {schoolId === 'shared' ? (
          <>
            {/* Boys crest — mounted left of the entrance arch */}
            <Crest textureUrl="/brand/la_martiniere/la_martiniere_boys_logo.png" position={[-7, 9.5, 18]} accent="#62d9ff" href="/boys" progressRef={progressRef} reducedMotion={reducedMotion} />
            {/* Girls crest — mounted right of the entrance arch */}
            <Crest textureUrl="/brand/la_martiniere/la_martiniere_girls_logo.png" position={[7, 9.5, 18]} accent="#ff7edc" href="/girls" progressRef={progressRef} reducedMotion={reducedMotion} />
          </>
        ) : experience.crest ? (
          <Crest
            textureUrl={experience.crest}
            // Boys: camera at Z=-72 looks toward +Z to door at Z=-14. Crest at Z=-16 (just in front of door, toward camera)
            // Girls: camera at Z=-34 looks toward -Z to door at Z=-94. Crest at Z=-92 (just in front of door, toward camera)
            position={[0, 9.5, schoolId === 'girls' ? -92 : -16]}
            // Boys camera approaches from -Z side, so crest must face -Z direction = rotation [0,π,0]
            // Girls camera approaches from +Z side, so crest must face +Z direction = rotation [0,0,0]
            rotation={schoolId === 'boys' ? [0, Math.PI, 0] : [0, 0, 0]}
// MISSING LINE 651
// MISSING LINE 652
// MISSING LINE 653
// MISSING LINE 654
          />
        ) : null}
      </group>
      {!mobile && stage.world === 'exterior' && <ContactShadows position={[0, .03, 0]} scale={120} far={42} opacity={.34} blur={2.6} frames={1} />}
      {!mobile && stage.world === 'interior' && <ContactShadows position={[0, .02, 0]} scale={42} far={12} opacity={.4} blur={2.2} frames={1} />}
      {!mobile && stage.world === 'sports' && <ContactShadows position={[0, .03, 0]} scale={88} far={28} opacity={.3} blur={2.5} frames={1} />}
      <Interior visible={stage.world === 'interior'} accent={experience.accent} schoolId={schoolId} textures={textures} progressRef={progressRef} reducedMotion={reducedMotion} />
      {!mobile && stage.world === 'interior' && <InteriorAtmosphere reducedMotion={reducedMotion} accent={experience.accent} />}
      <SportsCampus visible={stage.world === 'sports' || activeStage === 5} accent={experience.accent} schoolId={schoolId} textures={textures} reducedMotion={reducedMotion} />
      <WallNarrativePlaques schoolId={schoolId} activeStage={activeStage} />
      {!mobile && !reducedMotion && <CinematicEffects world={stage.world} />}