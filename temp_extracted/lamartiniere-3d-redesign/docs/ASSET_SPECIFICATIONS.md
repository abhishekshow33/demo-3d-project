# LA MARTINIÈRE 3D REDESIGN
## Asset Specifications & Implementation Guide

---

## DIRECTORY STRUCTURE

```
la-martiniere-3d-redesign/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                           # Main building (home)
│   ├── boys/page.tsx                      # Boys school
│   ├── girls/page.tsx                     # Girls school
│   └── components/
│       └── scenes/
│           ├── MainBuildingScene.tsx
│           ├── BoysSchoolScene.tsx
│           ├── GirlsSchoolScene.tsx
│           ├── AchievementFrameWall.tsx
│           ├── InteriorLighting.tsx
│           └── ScrollAnimation.ts
├── public/
│   ├── textures/
│   │   ├── sandstone.jpg
│   │   ├── marble-white.jpg
│   │   ├── marble-grey.jpg
│   │   ├── wood-dark.jpg
│   │   ├── clay-tile.jpg
│   │   └── caustic-flow.jpg
│   ├── models/
│   │   ├── boys-logo.glb
│   │   ├── girls-logo.glb
│   │   └── achievements/ (individual frame images)
│   ├── achievements/
│   │   ├── academic-*.jpg
│   │   ├── sports-*.jpg
│   │   ├── cultural-*.jpg
│   │   ├── community-*.jpg
│   │   └── alumni-*.jpg
│   ├── audio/
│   │   ├── ambient-wind.mp3
│   │   ├── chime-success.mp3
│   │   └── door-creak.mp3
│   └── fonts/
│       ├── IBMPlexSerif-Bold.woff2
│       ├── IBMPlexSans-Regular.woff2
│       └── IBMPlexMono-Regular.woff2
├── styles/
│   ├── globals.css
│   └── variables.css
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## TEXTURE SPECIFICATIONS

### Sandstone (Building Facade)
- **File**: `sandstone.jpg` (4096×4096, 2-3MB)
- **Resolution**: 4K
- **Color**: Warm tan (#C4A57B baseline)
- **Properties**:
  - Roughness: 0.85
  - Metalness: 0
  - Normal map: Weathered surface variation
  - Displacement: Subtle height variation for carved details
- **Usage**: Main building exterior, boys school facade
- **Format**: JPG (85% quality) with WebP alternative

### Marble - White Floor
- **File**: `marble-white.jpg` (4096×4096, 2MB)
- **Color**: Off-white (#F5F0E8)
- **Properties**:
  - Roughness: 0.3
  - Metalness: 0.05
  - Normal map: Fine veining pattern
  - Specular highlights: Polished
- **Usage**: Foyer flooring
- **Scale**: 1m tile repeat

### Marble - Grey Accents
- **File**: `marble-grey.jpg` (2048×2048, 1MB)
- **Color**: Light grey (#E0E0E0)
- **Properties**:
  - Roughness: 0.25
  - Metalness: 0.08
  - Normal map: Subtle veining
- **Usage**: Foyer checkerboard pattern (alternating with white)
- **Scale**: 1m tile repeat

### Dark Wood (Door Material)
- **File**: `wood-dark.jpg` (2048×2048, 1.5MB)
- **Color**: Deep brown (#3D2817)
- **Properties**:
  - Roughness: 0.2
  - Metalness: 0.15
  - Normal map: Wood grain detail
  - Specular: High gloss reflection
- **Usage**: Heritage door panels, wood elements
- **Scale**: 0.5m plank repeat

### Clay Tile (Roof)
- **File**: `clay-tile.jpg` (2048×2048, 1.5MB)
- **Color**: Burnt orange/terracotta (#8B4513)
- **Properties**:
  - Roughness: 0.9
  - Metalness: 0
  - Normal map: Individual tile relief
  - Variation: Slight color randomization
- **Usage**: Roof surfaces (boys school), heritage details
- **Scale**: 0.3m tile repeat

### Caustic Flow (Water Animation)
- **File**: `caustic-flow.jpg` (1024×1024, 500KB)
- **Type**: Animated normal texture
- **Properties**:
  - Seamless looping (8 second cycle)
  - Bright/dark contrast for underwater light effect
  - Two-layer offset at different speeds
- **Usage**: Swimming pool water refraction
- **Animation**: ScrollTrigger + GSAP for UV scroll

---

## 3D MODEL SPECIFICATIONS

### Boys Logo (boys-logo.glb)
- **Format**: glTF 2.0 Binary (.glb)
- **File Size**: < 500KB (compressed)
- **Geometry**:
  - Extruded text: 2.5 units wide × 3 units tall × 0.5 units deep
  - Smooth beveled edges (chamfer 0.1 units)
  - No subdivision surfaces (keep polycount < 10k)
- **Materials**:
  - Base color: Navy blue (#0B1F3F)
  - Emissive color: Magenta (#FF0080)
  - Emissive intensity: 1.0 (base), 2.0 (hover)
- **LOD Levels**: Single high-poly version (optimized)
- **Rigging**: None required
- **Export Settings**:
  - Compressed: Yes (Draco compression)
  - Textures: Embedded or external (reference)
  - Animations: None

### Girls Logo (girls-logo.glb)
- **Format**: glTF 2.0 Binary (.glb)
- **File Size**: < 500KB
- **Geometry**: Same as boys logo
- **Materials**:
  - Base color: Burgundy (#8B1538)
  - Emissive color: Gold (#FFD700)
  - Emissive intensity: 1.0 (base), 1.8 (hover)

**Creation Pipeline (Blender)**:
```
1. Import font (IBM Plex Serif Bold)
2. Convert to mesh
3. Add solidify modifier (extrude 0.5 units)
4. Apply bevel modifier (0.1 chamfer)
5. Create material with PrincipledBSDF
6. Set emissive texture (solid color)
7. Decimate to optimize (target: 8k triangles)
8. Export as glB with Draco compression
```

---

## ACHIEVEMENT FRAME IMAGE SPECIFICATIONS

### Academic Excellence Images
- **Filenames**: 
  - `academic-01.jpg` → "ISC Top Scorer 2024"
  - `academic-02.jpg` → "Science Olympiad Winners"
  - `academic-03.jpg` → "Merit Scholarship Recipients"

- **Specifications**:
  - **Dimensions**: 1800×2200px (portrait, frame aspect ratio)
  - **Resolution**: 72 DPI (web optimized)
  - **File Size**: 200-350KB per image
  - **Format**: JPG (85% quality) + WebP
  - **Color Space**: sRGB
  - **Content**: Achievement photos/certificates on matte background
  - **Border**: 100px white border (auto-cropped in 3D frame)

### Sports Achievement Images
- **Filenames**: `sports-01.jpg`, `sports-02.jpg`, `sports-03.jpg`
- **Content**: Team photos, trophy displays, match moments
- **Same specs as academic**

### Cultural Event Images
- **Filenames**: `cultural-01.jpg`, `cultural-02.jpg`, `cultural-03.jpg`
- **Content**: Performance photos, festival moments, talent showcases

### Community Service Images
- **Filenames**: `community-01.jpg`, `community-02.jpg`, `community-03.jpg`
- **Content**: Service activities, outreach programs, social initiatives

### Alumni Success Images
- **Filenames**: `alumni-01.jpg`, `alumni-02.jpg`, `alumni-03.jpg`
- **Content**: Notable alumni profiles, global impact stories, success metrics

---

## AUDIO SPECIFICATIONS

### Ambient Wind Loop
- **File**: `ambient-wind.mp3`
- **Duration**: 30 seconds (seamless loop)
- **Volume**: -20dB (background ambience)
- **Format**: MP3 (128 kbps stereo)
- **Frequency Response**: Full spectrum, smooth reverb tail
- **Usage**: Constant background in exterior scenes

### Door Creak Sound
- **File**: `door-creak.mp3`
- **Duration**: 1.5 seconds
- **Volume**: -15dB (triggered on door open)
- **Format**: MP3 (192 kbps mono)
- **Characteristics**: Rich wooden creak with slow fade
- **Usage**: Door opening animation trigger

### Success Chime
- **File**: `chime-success.mp3`
- **Duration**: 0.8 seconds
- **Volume**: -12dB (UI feedback)
- **Format**: MP3 (192 kbps mono)
- **Characteristics**: Bright, resonant bell tone
- **Usage**: Logo click navigation feedback

---

## MATERIAL DEFINITIONS

### Material 1: Sandstone Facade
```javascript
new MeshStandardMaterial({
  color: new Color('#C4A57B'),
  map: textureLoader.load('sandstone.jpg'),
  normalMap: textureLoader.load('sandstone-normal.jpg'),
  displacementMap: textureLoader.load('sandstone-displacement.jpg'),
  displacementScale: 0.05,
  roughness: 0.85,
  metalness: 0,
  side: FrontSide,
  castShadow: true,
  receiveShadow: true
})
```

### Material 2: Gold Frame
```javascript
new MeshStandardMaterial({
  color: new Color('#D4AF37'),
  roughness: 0.4,
  metalness: 0.8,
  emissive: new Color('#FFD700'),
  emissiveIntensity: 0.2,
  envMapIntensity: 1.2,
  castShadow: true
})
```

### Material 3: Fluorescent Glow Logo
```javascript
new MeshStandardMaterial({
  color: new Color('#0B1F3F'),
  emissive: new Color('#FF0080'), // or '#FFD700'
  emissiveIntensity: 1.0,
  emissiveMap: glowTexture, // white glow map
  roughness: 0.3,
  metalness: 0.2,
  envMapIntensity: 1.5,
  toneMapped: false // preserve brightness in post-processing
})
```

### Material 4: Water (Pool)
```javascript
new MeshStandardMaterial({
  color: new Color('#006EFF'),
  roughness: 0.15,
  metalness: 0.05,
  normalMap: causticTexture,
  normalScale: new Vector2(1, 1),
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  transmission: 0.8,
  ior: 1.33,
  transparent: true,
  opacity: 0.85,
  side: DoubleSide
})
```

---

## LIGHTING PARAMETERS

### Chandelier (Main Foyer)
```javascript
pointLight: {
  position: [0, 7.5, 0],
  intensity: 1.5,
  color: '#FDB813', // Warm amber
  distance: 20,
  decay: 2,
  castShadow: true,
  shadow: {
    mapSize: { width: 1024, height: 1024 },
    camera: { near: 0.1, far: 50 }
  }
}
```

### Wall Sconces (4 per room)
```javascript
pointLight: {
  position: [-5, 4.5, -3.5],
  intensity: 0.7,
  color: '#FDB813',
  distance: 6,
  decay: 2,
  castShadow: true
}
```

### Stadium Lights (Court)
```javascript
spotLight: {
  position: [-14, 8, -7.5],
  target: [0, -1, 0],
  intensity: 1.2,
  angle: Math.PI / 3,
  penumbra: 0.6,
  color: '#FFFFFF',
  distance: 50,
  decay: 2,
  castShadow: true
}
```

### Key Directional (Outdoor)
```javascript
directionalLight: {
  position: [10, 12, 8],
  intensity: 1.3,
  color: '#FDB813', // Golden hour
  castShadow: true,
  shadow: {
    mapSize: { width: 2048, height: 2048 },
    camera: {
      left: -50, right: 50,
      top: 50, bottom: -50,
      near: 0.1, far: 100
    }
  }
}
```

---

## PERFORMANCE OPTIMIZATION CHECKLIST

- [ ] **Geometry**: All models < 100k triangles (LOD for >10k)
- [ ] **Textures**: 4K max for hero assets, 2K for secondary, 1K for distant
- [ ] **Materials**: Use PBR workflow (base color + normal + roughness + metalness)
- [ ] **Lighting**: Bake static lights where possible, use HDRIs for environment
- [ ] **Shadows**: Shadow map resolution 1024-2048, cascade for large scenes
- [ ] **Particles**: Instancing for repeated elements (flowers, particles)
- [ ] **Loading**: Lazy load interior scenes, preload next building on scroll
- [ ] **Mobile**: Simplified geometry, disabled bloom, lower shadow resolution
- [ ] **Web Workers**: Parse models in background thread
- [ ] **Caching**: CDN for textures/models with long expiry (1 year)

---

## CONTENT MAPPING

### Main Building Interior → Website Content
- **Foyer Central** → About Us + School Logo display
- **Left Wall Gallery** → Academic achievements + Principal message
- **Right Wall Gallery** → Paul Chater legacy + Historical timeline
- **Back Wall Plaque** → Organizational chart + Contact information
- **Pedestal** → Admission guidelines + Current opportunities
- **Floor Inscription** → School Motto: "Labore et Constantia"

### Boys School Campus → Content Sections
- **Academic Building** → School overview, principal message, 3800+ students
- **Basketball Court** → Co-curricular activities, sports excellence
- **Swimming Pool** → Comprehensive facilities, student achievements
- **Achievement Gallery** → ISC/ICSE success, alumni profiles

### Girls School Campus → Content Sections
- **Academic Building** → School mission, 3000+ students, girl child education focus
- **Central Courtyard** → Core values: Honesty, Compassion, Inclusion, Gratitude
- **Central Fountain** → Values inscription, symbolic community space
- **Basketball Court** → Athletic programs, gender-inclusive excellence
- **Swimming Pool** → World-class facilities, achievement records
- **Achievement Gallery** → Academic, cultural, community success stories

---

## DEPLOYMENT CONFIGURATION

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables (.env.local)
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Performance Targets (Web Vitals)
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **TTFB**: < 600ms (Time to First Byte)

### CDN Configuration
- **Images**: Vercel Image Optimization
- **Models/Textures**: Cloudflare or AWS CloudFront
- **Scripts**: gzip compression enabled
- **Cache Headers**:
  - Assets: 1 year immutable
  - HTML: 24 hours revalidate
  - API: No cache

---

## NEXT STEPS FOR PRODUCTION

1. **Phase 1 (Week 1-2)**: Core scene setup, geometry, scroll mechanics
2. **Phase 2 (Week 3-4)**: Interior scenes, frame system, text display
3. **Phase 3 (Week 5-6)**: Materials, lighting, animations, audio
4. **Phase 4 (Week 7-8)**: Performance optimization, mobile adaptation, SEO
5. **Phase 5 (Week 9-10)**: User testing, accessibility layer, refinement
6. **Phase 6 (Week 11-12)**: Deployment, monitoring, post-launch optimization

---

**Version**: 1.0.0
**Last Updated**: June 2026
**Designer**: Abhishek
**Project**: La Martinière 3D Cinematic Redesign
