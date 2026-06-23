# LA MARTINIÈRE SCHOOLS KOLKATA
## 3D Cinematic Redesign Specification
### "Walking Through Excellence" - Complete Digital Transformation

---

## PROJECT OVERVIEW

**Objective**: Transform La Martinière Schools website into an immersive 3D cinematic experience across three buildings with interactive navigation, interior walkthroughs, achievement galleries, and legacy preservation.

**Creative Thesis**: The digital experience mirrors the physical journey of a visitor walking through the campus. Each building entrance opens into curated interior spaces that celebrate 189 years of institutional excellence through environmental storytelling.

---

## ARCHITECTURE OVERVIEW

### Three Building Experiences

#### **1. MAIN BUILDING (Legacy Headquarters)**
- **Role**: Primary entry point and thematic anchor
- **Visual Statement**: Vast heritage door (focal point)
- **Interactive Elements**:
  - Both school logos as 3D models flanking the entrance with fluorescent cyan/magenta glow
  - Clickable navigation to individual school pages
  - Scroll-triggered door opening and interior fade-in
  - Logo disappearance on scroll (parallax effect)

- **Interior Experience**:
  - Grand foyer with heritage elements
  - Framed achievement galleries on walls
  - Historical timeline frames (Claude Martin legacy, Paul Chater benefaction)
  - Organizational structure display
  - Contact information architectural elements

#### **2. LA MARTINIÈRE FOR BOYS**
- **Role**: Detailed campus walkthrough
- **Key Spaces**:
  - Main academic building (heritage architecture)
  - Basketball courts (interactive hover states)
  - Swimming pool (reflective water simulation)
  - Gallery spaces with student achievement frames
  - Auditorium/assembly hall

- **Visual Identity**:
  - Boys logo (navy blue accents) with fluorescent glow
  - School motto: "Labore et Constantia"
  - 3,800+ student enrollment visualization
  - Alumni success stories on framed walls

#### **3. LA MARTINIÈRE FOR GIRLS**
- **Role**: Parallel campus experience with distinct visual language
- **Key Spaces**:
  - Main academic building
  - Basketball courts
  - Swimming pool
  - Achievement gallery
  - Courtyard spaces

- **Visual Identity**:
  - Girls logo (maroon/burgundy accents) with fluorescent glow
  - Same motto with distinct architectural representation
  - 3,000+ student enrollment visualization
  - Alumni achievements gallery

---

## TECHNICAL STACK

### Core Framework
- **Next.js 14** (React server components, App Router)
- **Three.js** with **React Three Fiber** for 3D rendering
- **Drei** for prebuilt 3D components (Text, Image, Environment, etc.)
- **GSAP ScrollTrigger** for scroll-driven camera animations
- **Framer Motion** for UI transitions and overlays

### 3D Asset Pipeline
- **Blender** or **Spline** for architectural modeling
- **Substance Painter** for material creation
- **Babylon Exporter** → glTF/glB format for optimal Three.js loading
- **Texture Optimization**: PNGs with compression, WebP fallback

### Performance Optimization
- **Instancing** for repeated courtyard/gallery elements
- **LOD (Level of Detail)** for distant building geometry
- **Baked lighting** for interior scenes (static lightmaps)
- **Lazy loading** of interior scenes per building
- **Web Workers** for model parsing on background thread

---

## VISUAL DESIGN LANGUAGE

### Color Palette
**Primary Heritage Colors**
- Deep Navy: `#0B1F3F` (structural elements, typography)
- Cream/Ivory: `#F5F0E8` (walls, backgrounds)
- Burgundy: `#8B1538` (accent, girls school)
- Forest Green: `#1F4620` (accent, boys school)

**Neon Accent System** (Logo glow)
- Cyan: `#00D9FF` (main building)
- Magenta: `#FF0080` (boys school)
- Gold: `#FFD700` (girls school)
- Glow radius: 0.8px blur effect with 2x intensity

### Typography
- **Display**: IBM Plex Serif Bold (heritage authority)
- **Body**: IBM Plex Sans (clarity, readability)
- **Legacy Text**: IBM Plex Mono (historical quotations)

### Material Specifications

#### Building Exteriors
- **Heritage Stone**: Roughness 0.85, Metalness 0, Normal mapping for weathering
- **Door Material**: High-gloss wood, Roughness 0.2, Metalness 0.1
- **Glass Windows**: Roughness 0.05, Metalness 0, with subtle reflection

#### Interior Surfaces
- **Marble Floors**: Roughness 0.3, Metalness 0.05, high specular highlights
- **Wood Paneling**: Roughness 0.7, Metalness 0, subtle wood grain normal
- **Framed Walls**: Matte finish, Roughness 0.9, Metalness 0

#### Achievement Frames
- **Frame Border**: Gold-tinted metal, Roughness 0.4, Metalness 0.8
- **Frame Glass**: Roughness 0.02, with subtle lens distortion
- **Matte Board**: Roughness 0.95, Metalness 0

---

## INTERACTION DESIGN

### Scroll-Driven State Machine

**State 0 (Initial)**: Full view of building facade
- Camera position: 25 units from facade, 1.8m eye level
- Logo opacity: 100%
- Door state: Closed (Y rotation 0°)
- Instruction text visible: "Scroll to Enter"

**State 1 (Scroll 0-30%)**: Camera approach + Logo fade
- Camera moves closer (parallax move at 0.3x scroll speed)
- Left logo X position: -5 + (scroll% × 0.15)
- Right logo X position: +5 - (scroll% × 0.15)
- Both logos fade out (opacity: 100% → 0%)
- Door remains closed

**State 2 (Scroll 30-50%)**: Door opening sequence
- Camera at door entry plane
- Both door panels rotate outward (Y: 0° → 45°)
- Door creak audio plays (0.5s duration)
- Interior lighting fades in (0% → 100%)

**State 3 (Scroll 50-100%)**: Interior exploration
- Camera dolly into building interior
- Multi-stop navigation:
  - Foyer (achievement frames auto-focus)
  - Left gallery wall (principal's portrait, organizational chart)
  - Right gallery wall (Paul Chater legacy, historical timeline)
  - Back wall (contact info, admission details)

### Clickable Navigation (Logo Interaction)

**Hover State**:
- Logo scale: 1.0 → 1.15
- Glow intensity: 1.0 → 1.8
- Cursor: 'pointer'
- Subtle upward bob animation (±0.2 units, 2s cycle)

**Click State**:
- Scale back to 1.0
- Fade out over 500ms
- Navigate to `/laMartiniereForBoys` or `/laMartiniereForGirls`
- Page transition: Cross-fade with background blur

---

## SCENE SPECIFICATIONS

### Main Building Scene (Scene A)

#### Exterior Environment
- **Skybox**: Kolkata sky (overcast afternoon)
- **Lighting**: 
  - Key light: Directional, 60° angle, intensity 1.2
  - Fill light: Hemisphere light, intensity 0.4
  - Ambient occlusion: Baked at 1024x1024 resolution

#### Building Geometry
- **Facade**: Heritage sandstone texture (4K, 2MB)
- **Door**: Carved wooden double-door (12 units tall)
- **Windows**: 24 individual window geometry pieces with glass material
- **Roof**: Clay tile texture with minor weathering variation

#### Interactive Elements
- **Logo Models** (Boys & Girls):
  - Geometry: Logo extruded 0.5 units depth
  - Material: Emissive shader with fluorescent glow
  - Glow effect: Post-processing bloom layer
  - Position: (-4, 0.5, -2) and (+4, 0.5, -2)

#### Audio Layer
- **Ambient**: Subtle wind, distant school chimes (30s loop, 0.3 volume)
- **Interaction**: Door creak (100ms fade-in, 0.5s sustain)
- **Success**: Subtle chime on navigation click

---

### Interior Foyer (Scene A-Interior)

#### Spatial Layout
- **Dimensions**: 12m wide × 8m tall × 10m deep
- **Flooring**: Marble checkerboard (white/grey alternation, 1m tiles)
- **Lighting**: Chandelier (focal point), 4x wall sconces

#### Achievement Display System
- **Left Wall**: 6 framed images (2 rows × 3 columns)
  - Frame spec: 80cm × 100cm, gold border 8cm
  - Content focus: Sports achievements, academic excellence
  - Auto-play focus: 2-second dolly to each frame on scroll progress

- **Right Wall**: 6 framed images (2 rows × 3 columns)
  - Content focus: Cultural events, student contributions
  - Interaction: Hover to read year/achievement label

- **Back Wall**: Central focal point
  - Large organizational chart (heritage structure)
  - Principal's portrait (right side)
  - Contact information plaque (left side)
  - Admission guidelines scroll (center, on pedestal)

#### Text Display Elements
**Principal's Message** (floating card):
```
"...providing value-based holistic education..."
- Headmaster, La Martinière

Position: Right wall, 2.5m height
Font: IBM Plex Serif, 48px
```

**Historical Timeline** (wall-mounted):
- 1836: School founding
- 1925-1926: Paul Chater benefaction
- 1945: Co-education introduction
- 2000: ISC affiliation
- 2026: Digital transformation

---

### Boys School Campus (Scene B)

#### Multi-Zone Layout
1. **Academic Building** (Primary structure)
   - Facade: Red brick with white stone trim
   - Windows: 40+ individual geometry
   - Entrance portico with columns

2. **Basketball Court** (Interactive zone)
   - Court geometry: 28m × 15m
   - Court lines: Procedural material
   - Hoops: 2 interactive geometry with collision detection
   - Hover effect: Ring glow, court illumination +0.3 intensity
   - Achievement display: 4 championship frames around perimeter

3. **Swimming Pool** (Signature space)
   - Pool body: 50m × 25m × 2m depth
   - Water shader: Gerstner waves, subtle caustic texture
   - Reflections: Real-time reflection probe
   - Diving platform: Elevated structure with safety railings
   - Gallery frames: 8 swimming achievement records on surrounding walls

4. **Student Life Gallery** (Walk-through space)
   - Display walls: 12 achievement frame clusters
   - Content: Sports victories, academic honors, cultural events
   - Interactive: Hover to reveal achievement year/category

#### Camera Navigation Path (Scroll-based)
```
0% → 25%: Entrance approach to courtyard
25% → 50%: Court overview with glow-up
50% → 75%: Pool complex exploration
75% → 100%: Gallery immersion + achievement focus
```

#### Lighting Scheme
- **Outdoor**: Golden hour directional light (3000K warmth)
- **Court**: Overhead stadium lights (2x intensity boosts on focus)
- **Pool**: Underwater caustic projection + surface reflection
- **Gallery**: Warm gallery lighting, directional frame spotlights

---

### Girls School Campus (Scene C)

#### Multi-Zone Layout
**Parallel to Boys School with distinct visual identity**

1. **Academic Building** (Primary structure)
   - Facade: Cream/ivory with burgundy accents
   - Windows: 40+ individual geometry with shutters
   - Entrance: Elegant arched portico

2. **Basketball Court** (Interactive zone)
   - Court geometry: 28m × 15m with distinct floor material
   - Glow color: Gold (not magenta, for visual distinction)
   - Achievement display: 4 championship frames

3. **Swimming Pool** (Signature space)
   - Pool body: 50m × 25m × 2m depth (matching boys)
   - Water shader: Similar Gerstner waves
   - Gallery frames: 8 swimming achievement records

4. **Courtyard & Commons** (Unique element)
   - Outdoor seating areas with shade structures
   - Central garden/fountain (water simulation)
   - Achievement monumental stone with engraved achievements

#### Lighting Scheme
- **Outdoor**: Warmer golden hour (3500K)
- **Court**: Similar overhead stadium lighting
- **Pool**: Caustic projection with warmer undertones
- **Courtyard**: Natural indirect lighting with shadow play

---

## CONTENT PRESERVATION & LEGACY STRATEGY

### Information Architecture
All existing website content will be embedded in 3D space:

#### Main Building Interior (Scene A)
✓ About Us section → Foyer central plaque
✓ Claude Martin legacy → Historical timeline (left wall)
✓ Paul Chater benefaction → Heritage portrait (back wall)
✓ Organizational chart → Large foyer wall installation
✓ Contact information → Plaque system (back wall)
✓ Admission details → Scroll pedestal (center foyer)
✓ School motto: "Labore et Constantia" → Engraved over main entrance

#### Boys School Campus (Scene B)
✓ Principal's message → Floating card in foyer
✓ 3,800+ students enrollment → Visualization on welcome arch
✓ Academic programs → Achievement frame categories
✓ Co-curricular activities → Sports/arts gallery displays
✓ Contact email → Engraved on administrative building entrance
✓ ISC/ICSE affiliation → Academic achievement frames
✓ Global reach → Alumni success gallery section

#### Girls School Campus (Scene C)
✓ School motto display → Central courtyard feature
✓ Principal's message → Welcome pavilion
✓ 3,000+ students enrollment → Courtyard visualization
✓ Mission statement → Engraved in courtyard stone
✓ Vision statement → Central fountain inscription
✓ Achievement galleries → Multi-wall display system
✓ Values (honesty, compassion, inclusion, gratitude) → Courtyard corner markers

---

## INTERACTIVE MECHANICS

### Logo Interaction (Main Building)
```
Hover → Scale 1.15 + Glow 1.8x
Click → Fade out 500ms + Navigate with page transition
```

### Achievement Frame Focus System
```
On scroll approach → Auto-dolly camera to frame center
On frame hover → Opacity 1.0, label text fade-in
Labels display → Year achieved, category, student names
Transition → Smooth 300ms dolly between frames
```

### Water Interaction (Pools)
```
Caustic animation → Continuous loop (8s cycle)
Reflection probes → Update every frame at 60FPS
Water normal scrolling → 2 normal textures at different speeds
Ripple on interaction → Touch point creates wave from camera focus
```

### Text Readability Layer
```
All 3D text rendered with:
- Depth-based fog for far elements
- Font size scaling based on distance
- Automatic culling of non-focus text
- Tooltip system for long-form content
```

---

## ANIMATION TIMELINE

### Scroll Progress Mapping
```
Scroll %  | Camera Event              | Element State
0%        | Building exterior view    | Logos full opacity, door closed
15%       | Approach movement         | Logos fading, camera moving
30%       | Camera at door plane      | Logos 0%, door angle 0°
40%       | Door opens               | Interior lighting fades in
60%       | Interior foyer full view  | Frames at rest
75%       | Left gallery focus        | Left frames magnified
90%       | Right gallery focus       | Right frames magnified
100%      | Back wall focus          | Central plaque magnified
```

### GSAP ScrollTrigger Implementation
```javascript
ScrollTrigger.create({
  trigger: ".building-scene",
  onUpdate: (self) => {
    // Progress 0-1
    const progress = self.getVelocity() > 0 
      ? self.progress 
      : self.progress;
    
    // Camera position interpolation
    camera.position.lerp(targetPos, 0.1);
    
    // Logo parallax
    boyLogo.position.x = -4 + (progress * 3);
    girlLogo.position.x = 4 - (progress * 3);
    
    // Door rotation trigger at 40%
    if (progress > 0.3 && !doorOpened) {
      gsap.to(door.rotation, {
        y: Math.PI / 4,
        duration: 1
      });
      doorOpened = true;
    }
  }
});
```

---

## PERFORMANCE TARGETS

- **Initial Load**: < 4s (main building)
- **Scenic Transition**: < 800ms (between buildings)
- **60 FPS Scroll**: Consistent frame rate on mid-range devices
- **Mobile Optimization**: Reduced geometry, simplified water, disabled bloom on <4GB RAM

---

## DELIVERABLES CHECKLIST

- [ ] Specification document (this file)
- [ ] React component structure (tsx files)
- [ ] Three.js scene setup utility
- [ ] GSAP scroll animation controller
- [ ] Achievement frame gallery system
- [ ] Logo 3D models (glB format)
- [ ] Texture pack (PNGs + WebP)
- [ ] Material definitions (Three.js MeshStandardMaterial specs)
- [ ] Audio assets (ambient, UI interactions)
- [ ] Deployment configuration (Next.js build, CDN setup)
- [ ] Mobile responsiveness guide
- [ ] Accessibility layer (keyboard navigation, screen reader support)

---

## NEXT PHASES

**Phase 1 (Foundation)**: Core scene setup, basic geometry, scroll mechanics
**Phase 2 (Content)**: Interior scenes, achievement frames, text display system
**Phase 3 (Polish)**: Materials, lighting, animations, sound design
**Phase 4 (Optimization)**: Performance tuning, mobile adaptation, SEO integration

---

**Project Codename**: "Walking Through Excellence"
**Designer**: Abhishek
**Client**: La Martinière Schools, Kolkata
**Scope**: Complete digital transformation across 3 buildings, 189 years of legacy preservation
**Timeline**: 8-12 weeks for full production
