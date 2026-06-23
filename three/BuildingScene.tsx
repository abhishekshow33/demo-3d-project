"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, ContactShadows, Sky, SoftShadows, useGLTF, useTexture, MeshTransmissionMaterial, RoundedBox, Text, Float, Image as DreiImage } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { Water } from 'three-stdlib';
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
  // Net segments
  const netSegments = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), []);
  return (
    <group position={position} rotation={[0, rotation, 0]} onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerLeave={() => { setHovered(false); document.body.style.cursor = ''; }}>
      {/* Pole */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 4.4, 10]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Support arm */}
      <mesh position={[0, 4.1, -0.55]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 1.2]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Backboard */}
      <mesh position={[0, 3.72, -0.5]} castShadow>
        <boxGeometry args={[2.4, 1.42, 0.08]} />
        <MeshTransmissionMaterial color="#e8f4f8" roughness={0.02} metalness={0.05} transmission={0.95} thickness={0.08} ior={1.5} clearcoat={1} clearcoatRoughness={0.02} chromaticAberration={0.03} />
      </mesh>
      {/* Backboard red square */}
      <mesh position={[0, 3.72, -0.44]}>
        <boxGeometry args={[0.9, 0.6, 0.01]} />
        <meshBasicMaterial color="#c0392b" wireframe />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 3.26, -0.95]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.45, 0.03, 12, 32]} />
        <meshPhysicalMaterial ref={rim as any} color="#e67e22" emissive={accent} emissiveIntensity={0.4} metalness={0.9} roughness={0.15} clearcoat={1} clearcoatRoughness={0.1} />
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

function Door({
  open,
  accent,
  textures,
  position = [0, 0, 17],
  rotation = [0, 0, 0],
  scale = 1,
  progressRef,
  reducedMotion = false,
  openRange = [.105, .185],
  partialOpen = false,
  partialUntil,
  partialMaxOpen = 0.24,
}: {
  open: number;
  accent: string;
  textures: SurfaceTextures;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  progressRef?: React.MutableRefObject<number>;
  reducedMotion?: boolean;
  openRange?: readonly [number, number];
  partialOpen?: boolean;
  partialUntil?: number;
  partialMaxOpen?: number;
}) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const thresholdLight = useRef<THREE.PointLight>(null);
  const openness = useRef(open);
  
  useFrame((_, delta) => {
    if (!left.current || !right.current) return;
    const requested = progressRef
      ? (reducedMotion ? 1 : THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((progressRef.current - openRange[0]) / Math.max(openRange[1] - openRange[0], .001), 0, 1), 0, 1))
      : open;
    const inPartialRange = partialUntil !== undefined && progressRef ? progressRef.current < partialUntil : false;
    const maxOpen = partialOpen || inPartialRange ? partialMaxOpen : 1.0;
    openness.current = THREE.MathUtils.damp(openness.current, Math.min(requested, maxOpen), 3.5, delta);
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
        <RoundedBox args={[2.94, 5.4, 0.32]} radius={0.02} smoothness={4} position={[0, 2.7, 0]} castShadow receiveShadow>
          <meshStandardMaterial map={textures.wood} normalMap={textures.woodNormal} normalScale={new THREE.Vector2(0.35, 0.35)} color="#3d1a0c" roughness={0.25} metalness={0.15} />
        </RoundedBox>
        {[1.15, 2.45, 3.75].map((y) => (
          <group key={y} position={[0, y, 0.19]}>
            <RoundedBox args={[2.25, 0.92, 0.09]} radius={0.015} smoothness={4} castShadow><meshStandardMaterial color="#3c2415" roughness={0.22} metalness={0.28} /></RoundedBox>
            <mesh position={[0, 0, 0.055]}><boxGeometry args={[1.91, 0.62, 0.06]} /><meshStandardMaterial map={textures.wood} normalMap={textures.woodNormal} color="#1e120c" roughness={0.35} /></mesh>
          </group>
        ))}
        {[0.52, 2.7, 4.86].map((y) => (
          <group key={y} position={[-direction * 1.43, y, 0.2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.055, 0.055, 0.3, 16]} /><meshStandardMaterial color="#8d6c35" metalness={0.75} roughness={0.15} /></mesh>
            <RoundedBox args={[0.28, 0.16, 0.08]} radius={0.01} position={[direction * 0.11, 0, 0]}><meshStandardMaterial color="#8d6c35" metalness={0.75} roughness={0.15} /></RoundedBox>
          </group>
        ))}
        <group position={[-direction * 0.98, 2.68, 0.24]}>
          <RoundedBox args={[0.16, 0.54, 0.06]} radius={0.02}><meshStandardMaterial color="#b99755" metalness={0.78} roughness={0.12} /></RoundedBox>
          <mesh position={[-direction * 0.16, 0.08, 0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.055, 0.055, 0.36, 16]} /><meshStandardMaterial color="#d2b16b" metalness={0.78} roughness={0.1} /></mesh>
          <mesh position={[0, -.18, .04]}><circleGeometry args={[.035, 12]} /><meshBasicMaterial color="#19130e" /></mesh>
        </group>
      </group>
    );
  };
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={left} position={[-3, 0, 0]}>{leaf('left')}</group>
      <group ref={right} position={[3, 0, 0]}>{leaf('right')}</group>
      {[-3.55, 3.55].map((x) => <RoundedBox key={x} args={[0.72, 5.9, 0.72]} radius={0.04} position={[x, 2.8, 0.08]} castShadow><meshStandardMaterial map={textures.sandstone} normalMap={textures.sandstoneNormal} color="#c9bda9" roughness={0.62} /></RoundedBox>)}
      <RoundedBox args={[7.82, 0.44, 0.72]} radius={0.04} position={[0, 5.74, 0.08]} castShadow><meshStandardMaterial map={textures.sandstone} normalMap={textures.sandstoneNormal} color="#c9bda9" roughness={0.6} /></RoundedBox>
      <group position={[0, 6.35, 0.02]}>
        <mesh><circleGeometry args={[3.0, 64, 0, Math.PI]} /><meshStandardMaterial color="#17242a" roughness={0.14} metalness={0.42} side={THREE.DoubleSide} /></mesh>
        {[-1.18, -0.58, 0, 0.58, 1.18].map((rotation) => <RoundedBox key={rotation} args={[0.055, 1.55, 0.06]} radius={0.01} rotation={[0, 0, rotation]} position={[0, 0.72, 0.14]}><meshStandardMaterial color="#b99755" metalness={0.75} roughness={0.15} /></RoundedBox>)}
      </group>
      <mesh position={[0, 0.045, 0.12]} receiveShadow><boxGeometry args={[8.5, 0.09, 0.7]} /><meshStandardMaterial map={textures.sandstone} color="#c8aa78" roughness={0.5} metalness={0.18} /></mesh>
      <pointLight ref={thresholdLight} position={[0, 3, -2]} intensity={open * 7} distance={12} color={accent} />
    </group>
  );
}

const CREST_EXTRUDE = { depth: .34, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: .12, bevelThickness: .1 } as const;
const CREST_INSET_EXTRUDE = { depth: .11, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .06, bevelThickness: .05 } as const;

function Crest({ textureUrl, position, rotation = [0, 0, 0], accent, href, progressRef, reducedMotion }: { textureUrl: string; position: [number, number, number]; rotation?: [number, number, number]; accent: string; href: string; progressRef: React.MutableRefObject<number>; reducedMotion: boolean }) {
  const router = useRouter();
  const texture = useTexture(textureUrl);
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const shield = useMemo(() => {
    const shape = new THREE.Shape();
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
        c.toArray(colorArray, idx * 3);
        idx++;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [countX, countZ, colorArray]);
  
  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]} position={[0, -.08, 0]} receiveShadow>
      <boxGeometry args={[1, 0.16, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </boxGeometry>
      <meshPhysicalMaterial map={marbleTexture} vertexColors roughness={0.05} metalness={0.15} clearcoat={1} clearcoatRoughness={0.05} />
    </instancedMesh>
  );
}

function FloorEngraving({ text, position }: { text: string; position: [number, number, number] }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = '#B8860B';
    ctx.font = 'bold 130px "Playfair Display", Georgia, serif';
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
      <meshPhysicalMaterial map={texture} transparent alphaTest={0.05} roughness={0.2} metalness={0.9} clearcoat={1} depthWrite={false} polygonOffset polygonOffsetFactor={-1} />
    </mesh>
  );
}

function Interior({ visible, accent, schoolId, textures, progressRef, reducedMotion }: { visible: boolean; accent: string; schoolId: SchoolId; textures: SurfaceTextures; progressRef: React.MutableRefObject<number>; reducedMotion: boolean }) {
  const achievements = SCHOOL_ACHIEVEMENTS[schoolId] || SCHOOL_ACHIEVEMENTS.shared;
  const leftAchievements = achievements.slice(0, 3);
  const rightAchievements = achievements.slice(3, 6);
  
  const leftFramePositions = [0, 1, 2].map(i => [-3.84, 3.15, 6 - i * 7] as [number, number, number]);
  const rightFramePositions = [0, 1, 2].map(i => [3.84, 3.15, 6 - i * 7] as [number, number, number]);

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

      <mesh position={[-4, 3.4, 0]} receiveShadow><boxGeometry args={[.2, 6.8, 28]} /><meshStandardMaterial map={textures.plaster} normalMap={textures.plasterNormal} normalScale={new THREE.Vector2(.25,.25)} color="#FFF9EE" roughness={0.9} /></mesh>
      <mesh position={[4, 3.4, 0]} receiveShadow><boxGeometry args={[.2, 6.8, 28]} /><meshStandardMaterial map={textures.plaster} normalMap={textures.plasterNormal} normalScale={new THREE.Vector2(.25,.25)} color="#FFF9EE" roughness={0.9} /></mesh>
      <mesh position={[0, 6.8, 0]} receiveShadow><boxGeometry args={[8.2, .16, 28]} /><meshStandardMaterial map={textures.plaster} color="#FAF5EB" roughness={0.92} /></mesh>

      {/* Wainscoting — upgraded to highly polished varnished wood */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <RoundedBox args={[0.24, 0.44, 28]} radius={0.02} position={[side * 3.82, 0.22, 0]} castShadow receiveShadow><meshStandardMaterial map={textures.wood} color="#3a1f13" roughness={0.25} /></RoundedBox>
          <RoundedBox args={[0.16, 1.45, 28]} radius={0.02} position={[side * 3.82, 1.18, 0]} castShadow receiveShadow><meshStandardMaterial map={textures.wood} color="#2d1c0f" roughness={0.3} /></RoundedBox>
          <RoundedBox args={[0.18, 0.12, 28]} radius={0.02} position={[side * 3.70, 1.98, 0]} castShadow><meshStandardMaterial color="#b99355" metalness={0.72} roughness={0.12} /></RoundedBox>
        </group>
      ))}

      {/* Benches: 4 positions, alternating sides, upgraded to rounded edges and varnished finish */}
      {[-8, 0, 8].map((z, index) => (
        <group key={z} position={[index % 2 ? 2.75 : -2.75, 0, z]}>
          <RoundedBox args={[1.65, 0.13, 0.55]} radius={0.03} position={[0, 0.62, 0]} castShadow receiveShadow><meshStandardMaterial map={textures.wood} color="#3a1f13" roughness={0.25} /></RoundedBox>
          {[-0.68, 0.68].map((x) => <RoundedBox args={[0.12, 0.6, 0.45]} radius={0.02} key={x} position={[x, 0.3, 0]} castShadow><meshStandardMaterial color="#1c110b" metalness={0.55} roughness={0.25} /></RoundedBox>)}
        </group>
      ))}
      <group position={[-3.55, 1.15, -4]}>
        <mesh castShadow><cylinderGeometry args={[0.14, 0.2, 0.75, 24]} /><meshStandardMaterial color="#a5261f" roughness={0.2} /></mesh>
        <mesh position={[0.08, 0.48, 0]} rotation={[0, 0, -0.5]}><torusGeometry args={[0.18, 0.025, 16, 32, 3.9]} /><meshStandardMaterial color="#262626" roughness={0.2} metalness={0.7} /></mesh>
      </group>
      
      {/* §5.1 §5.3 — staggered frame reveals driven by cinematic entrance timeline */}
      <AchievementFrameWall side="left" achievements={leftAchievements} schoolId={schoolId} accent={accent} frameReveal={entrance.frameReveal} revealOffset={0} baseZ={6} zSpacing={7} />
      <AchievementFrameWall side="right" achievements={rightAchievements} schoolId={schoolId} accent={accent} frameReveal={entrance.frameReveal} revealOffset={3} baseZ={6} zSpacing={7} />


      {/* Rear door — pulled closer from Z=-20.72 to match compressed 28-unit corridor */}
      <Door open={1} accent={accent} textures={textures} openRange={[0.82, 0.95]} />
      <mesh position={[-3.55, 3.15, -14.5]} castShadow><boxGeometry args={[1.1, 6.3, .28]} /><meshStandardMaterial map={textures.plaster} normalMap={textures.plasterNormal} color="#FFF9EE" roughness={0.9} /></mesh>
      <mesh position={[3.55, 3.15, -14.5]} castShadow><boxGeometry args={[1.1, 6.3, .28]} /><meshStandardMaterial map={textures.plaster} normalMap={textures.plasterNormal} color="#FFF9EE" roughness={0.9} /></mesh>
      <mesh position={[0, 6.05, -14.5]} castShadow><boxGeometry args={[6.1, .5, .28]} /><meshStandardMaterial map={textures.sandstone} normalMap={textures.sandstoneNormal} color="#cbb58f" roughness={.76} /></mesh>
      {/* Rear door: cracks open during Admissions (stage 4/idx 4), then swings wide for sports exit */}
      <Door
        open={0}
        accent={accent}
        textures={textures}
        position={[0, 0, -14.36]}
        rotation={[0, Math.PI, 0]}
        scale={.7}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
        openRange={[.56, .70]}
        partialUntil={.68}
        partialMaxOpen={.23}
      />
      {/* Garden patch just beyond rear door */}
      <mesh position={[0, -.02, -17]} receiveShadow><boxGeometry args={[7, .12, 5]} /><meshStandardMaterial map={textures.grass} color="#466b45" roughness={.96} /></mesh>
      <pointLight position={[0, 3.5, -17]} color="#e4f4cf" intensity={14} distance={14} />
    </group>
  );
}

function PoolWater({ color, reducedMotion, textures }: { color: string; reducedMotion: boolean; textures: SurfaceTextures }) {
  const water = useRef<any>(null);
  const { gl } = useThree();
  
  const geom = useMemo(() => new THREE.PlaneGeometry(49.2, 24.2), []);
  const waterOptions = useMemo(() => ({
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: textures.poolNormal,
    sunDirection: new THREE.Vector3(70, 25, -90).normalize(),
    sunColor: 0xffffff,
    waterColor: color,
    distortionScale: 3.7,
    fog: false,
  }), [textures.poolNormal, color]);

  const waterObject = useMemo(() => {
    return new Water(geom, waterOptions);
  }, [geom, waterOptions]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (water.current && water.current.material && (water.current.material as any).uniforms) {
      (water.current.material as any).uniforms['time'].value += delta * 0.5;
    }
    const t = state.clock.elapsedTime;
    textures.poolInteriorNormal.offset.set(t * -0.002, t * -0.001); // Simulated caustic movement for tiles
  });

  return (
    <group>
      {/* Pool floor — Tiled surface */}
      <mesh position={[5, -0.8, -18]}>
        <boxGeometry args={[49.2, 0.05, 24.2]} />
        <meshStandardMaterial map={textures.poolInterior} normalMap={textures.poolInteriorNormal} normalScale={new THREE.Vector2(0.5, 0.5)} color="#8dcbe6" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Pool walls */}
      {([[5, -0.4, -5.9], [5, -0.4, -30.1]] as [number,number,number][]).map((pos, i) => (
        <mesh key={i} position={pos} receiveShadow><boxGeometry args={[49.2, 0.8, 0.2]} /><meshStandardMaterial map={textures.poolInterior} color="#8dcbe6" roughness={0.7} /></mesh>
      ))}
      {([[-19.6, -0.4, -18], [29.6, -0.4, -18]] as [number,number,number][]).map((pos, i) => (
        <mesh key={i} position={pos} receiveShadow><boxGeometry args={[0.2, 0.8, 24]} /><meshStandardMaterial map={textures.poolInterior} color="#8dcbe6" roughness={0.7} /></mesh>
      ))}

      {/* Highly realistic water shader from three-stdlib */}
      <primitive object={waterObject} ref={water} position={[5, 0.31, -18]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow />
      
      {/* Lane ropes — connected ropes and floats */}
      {[-10, -7, -4, -1, 2, 5, 8].map((z) => (
        <group key={z} position={[5, 0.38, -18 + z * 1.7]}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 49]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
          </mesh>
          {Array.from({ length: 48 }, (_, i) => (
            <mesh key={i} position={[-23.5 + i * 1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 0.15, 12]} />
              <meshPhysicalMaterial color={i < 5 || i > 42 ? '#e74c3c' : i % 2 === 0 ? '#3498db' : '#f5f5f5'} roughness={0.3} clearcoat={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Pool Ladders (Chrome finish) */}
      {([-18, -8, 8, 28] as number[]).map((x) => (
        <group key={`ladder-${x}`} position={[x, 0.1, -5.9]} rotation={[0, 0, 0]}>
          {[-0.4, 0.4].map((lx) => (
            <group key={lx} position={[lx, 0, 0]}>
              <mesh castShadow position={[0, 0.4, 0.2]}><cylinderGeometry args={[0.025, 0.025, 0.8, 8]} /><meshStandardMaterial color="#ddd" metalness={0.95} roughness={0.1} /></mesh>
              <mesh castShadow position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.4, 8]} /><meshStandardMaterial color="#ddd" metalness={0.95} roughness={0.1} /></mesh>
              <mesh castShadow position={[0, 0.1, -0.2]}><cylinderGeometry args={[0.025, 0.025, 1.4, 8]} /><meshStandardMaterial color="#ddd" metalness={0.95} roughness={0.1} /></mesh>
            </group>
          ))}
          {[-0.1, -0.4, -0.7].map((ly) => (
            <mesh key={ly} position={[0, ly, -0.2]} castShadow>
              <boxGeometry args={[0.75, 0.04, 0.1]} />
              <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Underwater glow lights */}
      {[-20, -8, 4, 16].map((x) => (
        <pointLight key={x} position={[5 + x, -0.2, -18]} color={color} intensity={8} distance={15} decay={2} />
      ))}
      {/* Surface caustic projection light */}
      <spotLight position={[5, 10, -18]} angle={1.2} penumbra={0.8} color="#e0f7fa" intensity={4} distance={30} castShadow />
    </group>
  );
}

/**
 * Court3DContent — Story text + gallery images laid flat on basketball court floor
 * Rendered when activeStage corresponds to the sports/Virtual recreation chapter.
 */
function Court3DContent({ accent, schoolId, visible }: { accent: string; schoolId: SchoolId; visible: boolean }) {
  const eyebrow = schoolId === 'girls' ? 'SPORTS CAMPUS' : schoolId === 'boys' ? 'SPORTS CAMPUS' : 'VIRTUAL RECREATION';
  const title = schoolId === 'girls' ? 'Confidence in Motion' : schoolId === 'boys' ? 'Train, Compete and Lead' : 'Courts Beyond the Colonnade';
  const subtitle = schoolId === 'girls'
    ? 'Basketball · Football · Skating · Athletics'
    : schoolId === 'boys'
    ? 'Football · Cricket · Basketball · Tennis · Athletics'
    : 'The shared grounds uphold the sports traditions of both schools';

  // Achievement images laid into the court floor like a gallery mosaic.
  const images = schoolId === 'girls'
    ? [
        { url: '/images/achievements/girls-gallery-1.webp', label: 'House life' },
        { url: '/images/achievements/girls-gallery-3.webp', label: 'Athletics' },
        { url: '/images/achievements/girls-gallery-5.webp', label: 'Campus' },
        { url: '/images/achievements/girls-gallery-6.webp', label: 'Clubs' },
      ]
    : schoolId === 'boys'
    ? [
        { url: '/images/achievements/boys-gallery-1.webp', label: 'Teams' },
        { url: '/images/achievements/boys-gallery-3.webp', label: 'Courts' },
        { url: '/images/achievements/boys-gallery-4.webp', label: 'Training' },
        { url: '/images/achievements/boys-gallery-6.webp', label: 'Tradition' },
      ]
    : [
        { url: '/images/achievements/shared-campus.webp', label: 'Shared campus' },
        { url: '/images/achievements/boys-gallery-3.webp', label: 'Boys sport' },
        { url: '/images/achievements/girls-gallery-3.webp', label: 'Girls sport' },
        { url: '/images/achievements/shared-legacy-2.webp', label: 'Archive' },
      ];

  const groupRef = useRef<THREE.Group>(null);
  const animState = useRef({ y: -2, scale: 0.9, opacity: 0 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = visible ? 0.12 : -2;
    const targetScale = visible ? 1 : 0.9;
    const targetOpacity = visible ? 1 : 0;
    
    animState.current.y = THREE.MathUtils.damp(animState.current.y, targetY, 4.5, delta);
    animState.current.scale = THREE.MathUtils.damp(animState.current.scale, targetScale, 4.5, delta);
    animState.current.opacity = THREE.MathUtils.damp(animState.current.opacity, targetOpacity, 6, delta);
    
    groupRef.current.position.y = animState.current.y;
    groupRef.current.scale.setScalar(animState.current.scale);
    groupRef.current.visible = animState.current.opacity > 0.01;
    
    // Smooth fade for children
    groupRef.current.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (child.userData.originalOpacity === undefined) {
          child.userData.originalOpacity = child.material.opacity !== undefined ? child.material.opacity : 1;
        }
        child.material.transparent = true;
        child.material.opacity = child.userData.originalOpacity * animState.current.opacity;
      }
    });
  });

  return (
    <group ref={groupRef} position={[-13, -2, 5]}>
      <mesh position={[0, 0.045, -4.65]} receiveShadow>
        <boxGeometry args={[24, 0.05, 5.25]} />
        <meshPhysicalMaterial color="#0f1f27" roughness={0.42} metalness={0.08} clearcoat={0.4} transparent opacity={0.76} />
      </mesh>
      <mesh position={[0, 0.082, -4.65]}>
        <boxGeometry args={[24.4, 0.018, 5.55]} />
        <meshBasicMaterial color={accent} transparent opacity={0.14} />
      </mesh>
      {/* Eyebrow label — small, gold, horizontal on floor */}
      <Text
        position={[0, 0, -6.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.32}
        color={accent}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0}
        depthOffset={-1}
      >
        {eyebrow}
      </Text>
      {/* Title — large, ivory, painted on the court */}
      <Text
        position={[0, 0, -5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.1}
        color="#f3eddf"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0}
        maxWidth={22}
        depthOffset={-1}
      >
        {title}
      </Text>
      {/* Subtitle — muted, smaller */}
      <Text
        position={[0, 0, -2.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.42}
        color="#b7b0a4"
        anchorX="center"
        anchorY="middle"
        maxWidth={18}
        depthOffset={-1}
      >
        {subtitle}
      </Text>
      {/* Gallery images — framed media inlaid into the basketball court floor. */}
      {images.map((image, i) => {
        const x = (i - (images.length - 1) / 2) * 5.2;
        return (
          <group key={image.url} position={[x, 0.1, 4.35]}>
            <mesh receiveShadow>
              <boxGeometry args={[4.45, 0.06, 3.05]} />
              <meshPhysicalMaterial color="#d6b45f" metalness={0.86} roughness={0.18} clearcoat={0.9} emissive={accent} emissiveIntensity={0.12} />
            </mesh>
            <mesh position={[0, 0.045, 0]}>
              <boxGeometry args={[4.14, 0.035, 2.74]} />
              <meshStandardMaterial color="#101820" roughness={0.55} />
            </mesh>
            <DreiImage
              url={image.url}
              position={[0, 0.085, -0.08]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[3.92, 2.48]}
              transparent
              opacity={0.94}
            />
            <Text
              position={[0, 0.13, 1.68]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.2}
              color="#f3eddf"
              anchorX="center"
              anchorY="middle"
              maxWidth={3.6}
              textAlign="center"
              depthOffset={-2}
            >
              {image.label}
            </Text>
            <pointLight position={[0, 1.2, 0]} color={accent} intensity={1.6} distance={5} />
          </group>
        );
      })}
      {[-10.8, 10.8].map((x) => (
        <mesh key={x} position={[x, 0.13, -4.65]}>
          <boxGeometry args={[0.08, 0.02, 5.55]} />
          <meshBasicMaterial color="#f5f0e0" transparent opacity={0.52} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Pool3DContent — Floating story text + clickable school logo crests above the pool water.
 * Uses drei <Float> for gentle bobbing animation.
 */
function Pool3DContent({ accent, schoolId, visible, reducedMotion }: { accent: string; schoolId: SchoolId; visible: boolean; reducedMotion: boolean }) {
  const router = useRouter();
  const [boysHovered, setBoysHovered] = useState(false);
  const [girlsHovered, setGirlsHovered] = useState(false);

  const eyebrow = schoolId === 'girls' ? 'AQUATICS' : schoolId === 'boys' ? 'AQUATICS' : 'CONTINUE THE JOURNEY';
  const title = schoolId === 'girls'
    ? 'Strength, Rhythm and Resolve'
    : schoolId === 'boys'
    ? 'Champions Are Made One Length at a Time'
    : 'Which School Will You Explore?';
  const subtitle = schoolId === 'shared'
    ? 'Enter the Boys or Girls experience'
    : 'The pool deck completes a reference-led recreation of the school\'s sporting campus.';

  // For Boys/Girls pages show only their crest; for shared show both
  const showBoys = schoolId === 'shared' || schoolId === 'boys';
  const showGirls = schoolId === 'shared' || schoolId === 'girls';
  const floatFactor = reducedMotion ? 0 : 1;

  const groupRef = useRef<THREE.Group>(null);
  const animState = useRef({ y: -2, scale: 0.9, opacity: 0 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = visible ? 1.05 : -1.6;
    const targetScale = visible ? 1 : 0.9;
    const targetOpacity = visible ? 1 : 0;
    
    animState.current.y = THREE.MathUtils.damp(animState.current.y, targetY, 4.5, delta);
    animState.current.scale = THREE.MathUtils.damp(animState.current.scale, targetScale, 4.5, delta);
    animState.current.opacity = THREE.MathUtils.damp(animState.current.opacity, targetOpacity, 6, delta);
    
    groupRef.current.position.y = animState.current.y;
    groupRef.current.scale.setScalar(animState.current.scale);
    groupRef.current.visible = animState.current.opacity > 0.01;
    
    groupRef.current.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (child.userData.originalOpacity === undefined) {
          child.userData.originalOpacity = child.material.opacity !== undefined ? child.material.opacity : 1;
        }
        child.material.transparent = true;
        child.material.opacity = child.userData.originalOpacity * animState.current.opacity;
      }
    });
  });

  // Hover animations for logos
  const boysRef = useRef<THREE.Group>(null);
  const boysAnim = useRef({ scale: 1 });
  useFrame((_, delta) => {
    if (!boysRef.current) return;
    boysAnim.current.scale = THREE.MathUtils.damp(boysAnim.current.scale, boysHovered ? 1.08 : 1.0, 6, delta);
    boysRef.current.scale.setScalar(boysAnim.current.scale);
  });

  const girlsRef = useRef<THREE.Group>(null);
  const girlsAnim = useRef({ scale: 1 });
  useFrame((_, delta) => {
    if (!girlsRef.current) return;
    girlsAnim.current.scale = THREE.MathUtils.damp(girlsAnim.current.scale, girlsHovered ? 1.08 : 1.0, 6, delta);
    girlsRef.current.scale.setScalar(girlsAnim.current.scale);
  });

  return (
    <group ref={groupRef} position={[5, 0.35, -26]}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[9.4, 72]} />
        <meshBasicMaterial color="#e8fbff" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.9, 5.16, 72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Eyebrow */}
      <Float speed={1.2 * floatFactor} rotationIntensity={0} floatIntensity={0.15 * floatFactor}>
        <Text
          position={[0, 0.05, -3.32]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.28}
          color={accent}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0}
        >
          {eyebrow}
        </Text>
      </Float>
      {/* Main title */}
      <Float speed={0.9 * floatFactor} rotationIntensity={0} floatIntensity={0.2 * floatFactor}>
        <Text
          position={[0, 0.05, -2.22]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={schoolId === 'shared' ? 1.0 : 0.82}
          color="#f3eddf"
          anchorX="center"
          anchorY="middle"
          maxWidth={18}
          textAlign="center"
        >
          {title}
        </Text>
      </Float>
      {/* Subtitle */}
      <Float speed={1.0 * floatFactor} rotationIntensity={0} floatIntensity={0.12 * floatFactor}>
        <Text
          position={[0, 0.05, -1.12]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.34}
          color="#b7b0a4"
          anchorX="center"
          anchorY="middle"
          maxWidth={14}
          textAlign="center"
        >
          {subtitle}
        </Text>
      </Float>

      {/* Boys crest logo — clickable, floating */}
      {showBoys && (
        <Float speed={1.4 * floatFactor} rotationIntensity={0.04 * floatFactor} floatIntensity={0.35 * floatFactor}>
          <group
            ref={boysRef}
            position={schoolId === 'shared' ? [-5, 0, 0.08] : [0, 0, 0.08]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e: any) => { e.stopPropagation(); router.push('/boys'); }}
            onPointerOver={() => { setBoysHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setBoysHovered(false); document.body.style.cursor = ''; }}
          >
            {/* Glow ring */}
            <mesh position={[0, 0, 0.03]}>
              <ringGeometry args={[1.65, 1.8, 48]} />
              <meshBasicMaterial color="#62d9ff" transparent opacity={boysHovered ? 0.7 : 0.35} side={THREE.DoubleSide} />
            </mesh>
            <DreiImage
              url="/brand/la_martiniere/la_martiniere_boys_logo.png"
              transparent
              opacity={boysHovered ? 1.0 : 0.88}
              scale={3.2}
              position={[0, 0, 0.05]}
            />
            <pointLight color="#62d9ff" intensity={boysHovered ? 12 : 5} distance={8} position={[0, 0, 0.5]} />
            {/* Label */}
            <Text
              position={[0, -1.9, 0.05]}
              fontSize={0.28}
              color="#62d9ff"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0}
            >
              LA MARTINIERE FOR BOYS
            </Text>
          </group>
        </Float>
      )}

      {/* Girls crest logo — clickable, floating */}
      {showGirls && (
        <Float speed={1.6 * floatFactor} rotationIntensity={0.04 * floatFactor} floatIntensity={0.4 * floatFactor}>
          <group
            ref={girlsRef}
            position={schoolId === 'shared' ? [5, 0, 0.08] : [0, 0, 0.08]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e: any) => { e.stopPropagation(); router.push('/girls'); }}
            onPointerOver={() => { setGirlsHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setGirlsHovered(false); document.body.style.cursor = ''; }}
          >
            <mesh position={[0, 0, 0.03]}>
              <ringGeometry args={[1.65, 1.8, 48]} />
              <meshBasicMaterial color="#ff7edc" transparent opacity={girlsHovered ? 0.7 : 0.35} side={THREE.DoubleSide} />
            </mesh>
            <DreiImage
              url="/brand/la_martiniere/la_martiniere_girls_logo.png"
              transparent
              opacity={girlsHovered ? 1.0 : 0.88}
              scale={3.2}
              position={[0, 0, 0.05]}
            />
            <pointLight color="#ff7edc" intensity={girlsHovered ? 12 : 5} distance={8} position={[0, 0, 0.5]} />
            <Text
              position={[0, -1.9, 0.05]}
              fontSize={0.28}
              color="#ff7edc"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0}
            >
              LA MARTINIERE FOR GIRLS
            </Text>
          </group>
        </Float>
      )}
    </group>
  );
}

function SportsCampus({ visible, accent, schoolId, textures, reducedMotion, activeStage }: { visible: boolean; accent: string; schoolId: SchoolId; textures: SurfaceTextures; reducedMotion: boolean; activeStage: number }) {
  const experience = getExperience(schoolId);
  const sportsStageIdx = experience.stages.findIndex((s) => s.id === 'sports');
  const poolStageIdx = experience.stages.findIndex((s) => s.id === 'pool');
  const isCourtStage = activeStage === sportsStageIdx;
  const isPoolStage = activeStage === poolStageIdx;
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
        <meshPhysicalMaterial map={textures.court} normalMap={textures.courtNormal} normalScale={new THREE.Vector2(0.4, 0.4)} color={courtColor} roughness={0.4} clearcoat={0.3} clearcoatRoughness={0.2} />
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
        <boxGeometry args={[56, 0.24, 30]} />
        <meshPhysicalMaterial map={textures.poolTile} color="#cfc3ad" roughness={0.3} clearcoat={0.5} clearcoatRoughness={0.4} />
      </mesh>
      {/* Pool basin edge */}
      <mesh position={[5, 0.18, -18]}>
        <boxGeometry args={[50.4, 0.1, 25.4]} />
        <meshStandardMaterial color="#b0c4cc" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Animated pool water + lanes */}
      <PoolWater color={poolBlue} reducedMotion={reducedMotion} textures={textures} />
      {/* Poolside lighting columns */}
      {[-22, -8, 8, 22].map((x) => (
        <group key={x} position={[5 + x, 0, -6.5]}>
          <mesh castShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 4, 16]} />
            <meshPhysicalMaterial color="#8a9ba8" metalness={0.9} roughness={0.15} clearcoat={1} />
          </mesh>
          <mesh position={[0, 4.2, 0]}>
            <sphereGeometry args={[0.22, 10, 8]} />
            <meshStandardMaterial color="#fff8d6" emissive="#ffdd88" emissiveIntensity={1.5} />
          </mesh>
          <pointLight position={[0, 4.5, 0]} color="#ffe4a0" intensity={8} distance={14} />
        </group>
      ))}
      {/* Starting blocks */}
      {[-20, -10, 0, 10, 20].map((x) => (
        <group key={x} position={[5 + x, 0.38, -30.2]}>
          <RoundedBox args={[1.2, 0.32, 0.9]} radius={0.02} castShadow>
            <meshPhysicalMaterial map={textures.poolTile} color="#ddd5c4" roughness={0.4} clearcoat={0.2} />
          </RoundedBox>
          {/* Angled block face */}
          <RoundedBox args={[1.05, 0.06, 0.55]} radius={0.01} position={[0, 0.15, -0.3]} rotation={[-0.35, 0, 0]}>
            <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={0.3} roughness={0.2} clearcoat={0.8} />
          </RoundedBox>
          {/* Block legs */}
          {[-0.45, 0.45].map((bx) => (
            <mesh key={bx} position={[bx, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.36, 16]} />
              <meshPhysicalMaterial color="#ddd" metalness={0.95} roughness={0.1} clearcoat={1} />
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

      {/* §renderIn3D — 3D content for sports and pool stages */}
      <Court3DContent accent={accent} schoolId={schoolId} visible={isCourtStage} />
      <Pool3DContent accent={accent} schoolId={schoolId} visible={isPoolStage} reducedMotion={reducedMotion} />

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

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = .96;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = !mobile;
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
          <ambientLight intensity={.52} />
          <hemisphereLight args={['#9bc3dd', '#172319', 1.15]} />
        </>
      )}
      <directionalLight position={[-24, 32, 18]} intensity={2.4} color="#d9e9ff" visible={stage.world !== 'exterior'} />
      <pointLight position={[0, 8, 25]} intensity={9} distance={70} color="#ffd79a" visible={stage.world !== 'exterior'} />
      <group visible={stage.world === 'exterior'}>
        {exteriorZones.map((zone) => <Zone key={zone.id} zone={zone} schoolId={schoolId} textures={textures} />)}
        {/* Main entrance door — cracks open during door approach stage, then fully open at threshold */}
        <Door
          open={0}
          accent={experience.accent}
          textures={textures}
          position={schoolId === 'girls' ? [0, 0, -94] : schoolId === 'boys' ? [0, 0, -14] : [0, 0, 17]}
          rotation={schoolId === 'boys' ? [0, Math.PI, 0] : [0, 0, 0]}
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          openRange={schoolId === 'shared' ? [.07, .42] : [.2, .48]}
          partialUntil={schoolId === 'shared' ? .29 : .37}
          partialMaxOpen={schoolId === 'shared' ? .25 : .23}
        />
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
            accent={experience.accent}
            href={schoolId === 'boys' ? '/boys/profile' : '/girls/profile'}
            progressRef={progressRef}
            reducedMotion={reducedMotion}
          />
        ) : null}
      </group>
      {!mobile && stage.world === 'exterior' && <ContactShadows position={[0, .03, 0]} scale={120} far={42} opacity={.34} blur={2.6} frames={1} />}
      {!mobile && stage.world === 'interior' && <ContactShadows position={[0, .02, 0]} scale={42} far={12} opacity={.4} blur={2.2} frames={1} />}
      {!mobile && stage.world === 'sports' && <ContactShadows position={[0, .03, 0]} scale={88} far={28} opacity={.3} blur={2.5} frames={1} />}
      <Interior visible={stage.world === 'interior'} accent={experience.accent} schoolId={schoolId} textures={textures} progressRef={progressRef} reducedMotion={reducedMotion} />
      {!mobile && stage.world === 'interior' && <InteriorAtmosphere reducedMotion={reducedMotion} accent={experience.accent} />}
      <SportsCampus visible={stage.world === 'sports' || activeStage === 5} accent={experience.accent} schoolId={schoolId} textures={textures} reducedMotion={reducedMotion} activeStage={activeStage} />
      <WallNarrativePlaques schoolId={schoolId} activeStage={activeStage} />
      {!mobile && !reducedMotion && <CinematicEffects world={stage.world} />}
    </>
  );
}
