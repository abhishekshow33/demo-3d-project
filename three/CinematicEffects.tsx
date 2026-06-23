"use client";

import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/** Native Three passes avoid the React-version mismatch of the former wrapper. */
export default function CinematicEffects({ world }: { world: 'exterior' | 'interior' | 'sports' }) {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const next = new EffectComposer(gl);
    next.addPass(new RenderPass(scene, camera));
    const ssao = new SSAOPass(scene, camera, size.width, size.height);
    ssao.kernelRadius = world === 'interior' ? 7 : 5;
    ssao.minDistance = .001;
    ssao.maxDistance = .075;
    next.addPass(ssao);
    const bloom = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), .22, .42, .9);
    bloom.threshold = .9;
    bloom.strength = world === 'interior' ? .18 : .24;
    bloom.radius = .35;
    next.addPass(bloom);
    next.addPass(new SMAAPass());
    next.addPass(new OutputPass());
    return next;
  }, [camera, gl, scene, size.height, size.width, world]);

  useEffect(() => {
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    composer.setSize(size.width, size.height);
    return () => composer.dispose();
  }, [composer, size.height, size.width]);

  useFrame(() => composer.render(), 1);
  return null;
}
