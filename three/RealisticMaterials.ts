"use client";

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export type SurfaceTextures = {
  plaster: THREE.CanvasTexture;
  sandstone: THREE.CanvasTexture;
  brick: THREE.CanvasTexture;
  wood: THREE.CanvasTexture;
  marble: THREE.CanvasTexture;
  court: THREE.CanvasTexture;
  poolTile: THREE.CanvasTexture;
  grass: THREE.CanvasTexture;
  plasterNormal: THREE.CanvasTexture;
  sandstoneNormal: THREE.CanvasTexture;
  woodNormal: THREE.CanvasTexture;
  courtNormal: THREE.CanvasTexture;
  poolNormal: THREE.CanvasTexture;
  poolInterior: THREE.CanvasTexture;
  poolInteriorNormal: THREE.CanvasTexture;
};

function rng(seed = 1836) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function makeTexture(draw: (context: CanvasRenderingContext2D, random: () => number, size: number) => void, repeat: [number, number]) {
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas textures are not supported');
  draw(context, rng(), size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function makeNormalTexture(seed: number, repeat: [number, number], strength = 12) {
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = size; canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas textures are not supported');
  const image = context.createImageData(size, size);
  const random = rng(seed);
  for (let index = 0; index < image.data.length; index += 4) {
    image.data[index] = 128 + Math.floor((random() - .5) * strength);
    image.data[index + 1] = 128 + Math.floor((random() - .5) * strength);
    image.data[index + 2] = 245;
    image.data[index + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function fillNoise(context: CanvasRenderingContext2D, random: () => number, size: number, base: string, light: string, dark: string, count = 2600) {
  context.fillStyle = base;
  context.fillRect(0, 0, size, size);
  for (let index = 0; index < count; index += 1) {
    const alpha = .025 + random() * .08;
    context.fillStyle = random() > .55 ? `${light}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}` : `${dark}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
    const radius = .3 + random() * 2.4;
    context.fillRect(random() * size, random() * size, radius, radius * (.4 + random()));
  }
}

export function useRealisticTextures(): SurfaceTextures {
  const textures = useMemo<SurfaceTextures>(() => ({
    plaster: makeTexture((context, random, size) => {
      fillNoise(context, random, size, '#d8d0c1', '#ffffff', '#786f63', 3000);
      context.strokeStyle = 'rgba(91,78,66,.12)';
      context.lineWidth = 1;
      for (let i = 0; i < 12; i += 1) {
        const x = random() * size;
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x + random() * 12 - 6, size); context.stroke();
      }
    }, [4, 10]),
    sandstone: makeTexture((context, random, size) => {
      fillNoise(context, random, size, '#b9986c', '#f2d7a4', '#60472f', 3600);
      context.strokeStyle = 'rgba(83,57,34,.18)';
      for (let y = 32; y < size; y += 32) { context.beginPath(); context.moveTo(0, y); context.lineTo(size, y + random() * 3); context.stroke(); }
    }, [5, 5]),
    brick: makeTexture((context, random, size) => {
      context.fillStyle = '#d0b89d'; context.fillRect(0, 0, size, size);
      const height = 24; const width = 52;
      for (let row = 0; row < Math.ceil(size / height); row += 1) {
        const offset = row % 2 ? -width / 2 : 0;
        for (let x = offset; x < size; x += width) {
          const red = 112 + Math.floor(random() * 40);
          context.fillStyle = `rgb(${red},${48 + Math.floor(random() * 22)},${30 + Math.floor(random() * 18)})`;
          context.fillRect(x + 2, row * height + 2, width - 4, height - 4);
          context.fillStyle = 'rgba(255,210,170,.08)'; context.fillRect(x + 4, row * height + 4, width - 8, 2);
        }
      }
    }, [7, 5]),
    wood: makeTexture((context, random, size) => {
      context.fillStyle = '#3f2415'; context.fillRect(0, 0, size, size);
      for (let x = 0; x < size; x += 3) {
        const wave = Math.sin(x * .13) * 3;
        context.strokeStyle = `rgba(${110 + Math.floor(random() * 50)},${64 + Math.floor(random() * 20)},35,.22)`;
        context.beginPath(); context.moveTo(x, 0); context.bezierCurveTo(x + wave, 70, x - wave, 170, x + wave, size); context.stroke();
      }
    }, [2, 4]),
    marble: makeTexture((context, random, size) => {
      const tile = 32;
      for (let y = 0; y < size; y += tile) for (let x = 0; x < size; x += tile) {
        context.fillStyle = ((x + y) / tile) % 2 ? '#5b5b58' : '#d8d2c8'; context.fillRect(x, y, tile, tile);
        context.strokeStyle = 'rgba(40,35,31,.28)'; context.strokeRect(x, y, tile, tile);
      }
      context.strokeStyle = 'rgba(255,255,255,.16)';
      for (let i = 0; i < 20; i += 1) { context.beginPath(); context.moveTo(random() * size, 0); context.bezierCurveTo(random() * size, 80, random() * size, 180, random() * size, size); context.stroke(); }
    }, [1, 5]),
    court: makeTexture((context, random, size) => fillNoise(context, random, size, '#87422f', '#d78560', '#3d211b', 4200), [9, 6]),
    poolTile: makeTexture((context, random, size) => {
      fillNoise(context, random, size, '#d8d2c6', '#ffffff', '#7d827e', 800);
      context.strokeStyle = 'rgba(80,99,104,.45)';
      for (let p = 0; p <= size; p += 32) { context.beginPath(); context.moveTo(p, 0); context.lineTo(p, size); context.stroke(); context.beginPath(); context.moveTo(0, p); context.lineTo(size, p); context.stroke(); }
    }, [8, 4]),
    poolInterior: makeTexture((context, random, size) => {
      fillNoise(context, random, size, '#2c7da0', '#468faf', '#014f86', 1500);
      context.strokeStyle = 'rgba(1,79,134,.6)';
      context.lineWidth = 1.5;
      for (let p = 0; p <= size; p += 16) { context.beginPath(); context.moveTo(p, 0); context.lineTo(p, size); context.stroke(); context.beginPath(); context.moveTo(0, p); context.lineTo(size, p); context.stroke(); }
    }, [16, 8]),
    grass: makeTexture((context, random, size) => fillNoise(context, random, size, '#294832', '#6f8d58', '#0c2417', 5000), [12, 12]),
    plasterNormal: makeNormalTexture(1836, [4, 10], 10),
    sandstoneNormal: makeNormalTexture(1837, [5, 5], 22),
    woodNormal: makeNormalTexture(1838, [2, 4], 18),
    courtNormal: makeNormalTexture(1839, [9, 6], 28),
    poolNormal: makeNormalTexture(1840, [8, 4], 14),
    poolInteriorNormal: makeNormalTexture(1841, [16, 8], 12),
  }), []);

  useEffect(() => () => Object.values(textures).forEach((texture) => texture.dispose()), [textures]);
  return textures;
}
