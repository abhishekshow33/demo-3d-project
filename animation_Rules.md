# 🎬 CINEMATIC 3D CONTENT VISUALIZATION RULE GUIDE
## Complete Specification for Immersive Content Display in 3D Environments

**Version**: 1.0.0  
**Status**: Production Ready  
**Discipline**: Digital Spatial Design + Interactive Architecture  
**Focus**: Photorealistic content placement, material integration, camera choreography, animated reveal sequences

---

## TABLE OF CONTENTS
1. Core Principles
2. Content Display Systems (Walls, Floors, Frames, Images, Details)
3. Material & Lighting Specifications
4. Camera & Navigation Systems
5. Animation & Timing Rules
6. 3D Model Background Integration
7. Video Background Integration
8. Responsive Design for Cinematic Displays
9. Technical Implementation Guide
10. Quality Assurance Checklist

---

---

## PART 1: CORE PRINCIPLES

### 1.1 The Golden Rule: Content First, Design Second

**Every 3D element must serve content.** 3D geometry, materials, and lighting exist solely to display information more effectively than flat screens.

**Hierarchy of Importance**:
1. **Readability** (content legible from all viewing angles)
2. **Hierarchy** (principal content distinct from secondary)
3. **Spatial Logic** (content placement reflects its meaning)
4. **Aesthetics** (photorealism supports comprehension)

**Anti-Pattern**: A beautiful 3D environment with unreadable text or hidden information is a failure, not a success.

### 1.2 Cinematic Framing

All content placement must respect **cinematic framing principles**:
- **Rule of Thirds**: Important content sits at 1/3 marks on the screen, not dead center
- **Leading Lines**: Architecture directs eye toward content (doorways frame focal points, floor lines lead to images)
- **Depth Layers**: Foreground (viewer) → midground (principal content) → background (supporting context)
- **Focal Point Distance**: Main content placed at 3-5 units from camera (optimal focus distance for human eyes in 3D)

### 1.3 The Immersion Principle: Presence Over Perfection

Users should *feel* they are walking through the space, not observing it from outside.

**Implementation**:
- Eye level = 1.7m (average human height), not bird's eye view
- Content positioned at natural human viewing angles (1.2m to 2.0m height)
- Shadows fall consistent with time of day
- Reflections appear on glossy surfaces
- Audio anchors spatial presence (footsteps, ambient room tone)

---

## PART 2: CONTENT DISPLAY SYSTEMS

### 2.1 WALL DISPLAYS — Framed Content at Human Eye Level

#### 2.1.1 Basic Wall Installation Specification

**Optimal Height Range**: 1.3m to 2.0m from floor (center of frame at eye level + offset)

**Viewing Distance**: 2.0m - 4.0m (optimal legibility range)

**Surface Material**:
```
Base Wall:
- Color: Matte finish (#D4CCBF neutral or institution-specific color)
- Roughness: 0.75 (slight texture, not reflective)
- Metalness: 0 (no shine)
- Normal map: Subtle fabric/linen pattern for visual interest
- Emissive: None (except accent walls in special galleries)

Accent Frame Lighting:
- Spotlight positioned 45° above frame center
- Color: Warm white (3000K, #FDB813)
- Intensity: 0.8-1.2 (bright enough to create shadow, not overexposed)
- Distance: 2.0 units from frame center
- Angle: 45° vertical, 0° horizontal (ideal museum lighting)
- Shadow: Soft penumbra (1.5 decay radius) for gradual falloff
```

#### 2.1.2 Frame Geometry & Material System

**Gold Frame (Heritage Standard)**
```
Dimensions:
- Border width: 80px (physical frame) = 0.08 units (3D)
- Inner mat board: 20px white border
- Total frame thickness: 12cm (0.12 units)

Materials:
- Outer frame: #D4AF37 (gold)
  Roughness: 0.4, Metalness: 0.8
  Emissive: #FFD700, Emissive intensity: 0.15 (subtle glow)
  
- Inner glass overlay:
  Color: White with 0.02 roughness (high gloss)
  Metalness: 0.1 (subtle reflection)
  Transparent: Yes, opacity: 0.95 (5% tint)
  
- Mat board (white):
  Color: #F5F0E8, Roughness: 0.95
  Metalness: 0 (completely matte)

Lighting on frame:
- Specular highlight from 45° spotlight creates "pop"
- Shadow underneath frame border adds depth
- No bloom or glow post-processing (too theatrical)
```

#### 2.1.3 Image Specifications for Framed Walls

**File Format & Size**:
```
Resolution: 2048×2560px (portrait, frame aspect ratio 0.8)
Format: WebP (primary), JPG (fallback)
File size: 250-400 KB per image
Color space: sRGB (matches monitor calibration)

Texture Mapping:
- Apply to 1.8 unit wide × 2.2 unit tall plane (inside frame mat)
- UV mapping: Stretch to fill (no tiling, no mirroring)
- Filter: Linear (smooth), not nearest (blocky)
- Wrap mode: Clamp (edges don't repeat)

Mipmap Chain:
- Levels: 8 (from 2048×2560 down to 1px)
- Purpose: Prevent aliasing at distance, smooth zoom
```

**Achievement Frame Wall Gallery Pattern**:
```
Layout: 2 rows × 3 columns
Spacing: 2.2 unit centers horizontally, 2.5 unit centers vertically
Positioning: Centered on wall (x=0, y=1.5m, z=0)

Frame 1,1: x=-2.2, y=1.5
Frame 1,2: x=0,    y=1.5
Frame 1,3: x=+2.2, y=1.5
Frame 2,1: x=-2.2, y=-1.0
Frame 2,2: x=0,    y=-1.0
Frame 2,3: x=+2.2, y=-1.0

Total wall coverage: 6.6 units wide × 4.0 units tall
Safe margin around gallery: 1.0 unit on all sides
```

#### 2.1.4 Text on Walls — Readability Rules

**Title Text** (Achievement name, section header):
```
Font: IBM Plex Serif Bold, 48px equivalent
Color: #0B1F3F (navy, high contrast on white mat)
Position: 100px from frame top, centered
Outline: None (solid color only)
Shadow: 1px drop shadow (offset 2px right, 1px down) with 0.3 opacity
       Color: #000000 (black), Blur: 2px (very subtle)
       Purpose: Separates text from variations in image content
```

**Subtitle Text** (Year, category, achievement):
```
Font: IBM Plex Sans Regular, 14px equivalent
Color: #8B1538 (burgundy, semantic color for "heritage")
Position: 50px from frame bottom, centered
Sizing: Auto-width, max 80% of frame width
Overflow: Truncate with ellipsis (...) if exceeds width
```

**3D Text Rendering** (for text directly in 3D scene, not on image plane):
```
Use Drei <Text> component with these settings:

fontSize: 0.4 (0.4 world units ≈ 40px at 1 unit distance)
fontWeight: "bold" (for headers)
color: "#0B1F3F" (navy primary)
anchorX: "center"  (horizontal center)
anchorY: "middle"  (vertical center)
maxWidth: 2.0      (wrap after 2 units width)
lineHeight: 1.4    (reading comfort)
position: [x, y, z]

Casting shadow: true
Receive shadow: true (for depth)

Font anti-aliasing:
textRenderingMode: "sdf" (Signed Distance Field, sharpest)
renderOrder: 1000 (float above geometry)
```

**Anti-Aliasing for 3D Text**:
```
Three.js TextGeometry produces pixelated text at distance.
Solution: Use Canvas texture with high DPI + downsampling

Canvas setup:
const canvas = document.createElement('canvas');
canvas.width = 1024;    // High resolution
canvas.height = 512;
const ctx = canvas.getContext('2d');
ctx.font = 'bold 64px IBM Plex Serif';
ctx.fillStyle = '#0B1F3F';
ctx.textAlign = 'center';
ctx.fillText('Achievement Unlocked', 512, 256);

// Downsample to 2x for use (canvas will blur slightly, but readable)
const texture = new CanvasTexture(canvas);
texture.minFilter = LinearFilter;
texture.magFilter = LinearFilter;
```

---

### 2.2 FLOOR DISPLAYS — Ground-Based Content Systems

#### 2.2.1 Marble Checkerboard Pattern (Heritage Foundation)

**Geometry & Tiling**:
```
Pattern: Alternating 1.0m × 1.0m tiles (white ↔ grey)
Total coverage: As wide as room, deep as needed
Placement: y=0 (ground plane), extends to z horizon

Tile Specifications:
- White tile: #F5F0E8 (cream, matches wall background)
  Material: Marble shader (roughness 0.3, metalness 0.05)
  Normal: Subtle veining pattern (4K texture)
  
- Grey tile: #E0E0E0 (light grey)
  Material: Marble shader (roughness 0.3, metalness 0.05)
  Normal: Same veining pattern, slightly darker base

Lighting on floor:
- Receives directional light (1.3 intensity, warm 3000K)
- Receives shadow projection (shadows from walls, frames)
- Slight glossiness creates visual "pop" (not slippery-looking)
- Reflection probes capture room environment
```

**Procedural Generation** (for infinite checkered floors):
```javascript
// Instead of 1000 individual tiles, use instancing

const geometry = new PlaneGeometry(1, 1);
const material = new MeshStandardMaterial({
  color: '#F5F0E8',
  roughness: 0.3,
  metalness: 0.05
});

const count = 100 * 100;  // 100×100 grid = 10,000m² coverage
const instanceMatrix = new InstancedBufferAttribute(
  new Float32Array(count * 16),
  16
);

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    const idx = i * 100 + j;
    const matrix = new Matrix4();
    matrix.setPosition(i, 0, j);
    
    // Alternate colors based on position
    const color = ((i + j) % 2 === 0) ? 0xF5F0E8 : 0xE0E0E0;
    matrix.makeTranslation(i, 0, j);
    
    instanceMatrix.setXYZW(idx * 4,     matrix.elements[0], matrix.elements[1], matrix.elements[2], matrix.elements[3]);
    instanceMatrix.setXYZW(idx * 4 + 1, matrix.elements[4], matrix.elements[5], matrix.elements[6], matrix.elements[7]);
    // ... etc for all 16 matrix elements
  }
}

const mesh = new InstancedMesh(geometry, material, count);
mesh.instanceMatrix = instanceMatrix;
scene.add(mesh);
```

#### 2.2.2 Floor Text & Directional Elements

**Engraved Text on Floor** (Heritage motto, welcome message):
```
Text: "Labore et Constantia" (School Motto)
Position: Center of foyer floor, x=0, z=5m
Dimensions: 4 units wide, 1 unit tall
Font size: 0.6 units height
Color: Navy (#0B1F3F) with subtle drop shadow
Effect: Depressed carving (normal map creates relief appearance)

Implementation:
- Canvas texture (2048×512px)
- Engrave effect: emboss normal map (depth 0.1)
- Lighting: Shadowed area appears recessed
- Material: Same marble as surrounding floor (seamless integration)
```

**Navigational Floor Markers**:
```
Use case: Guide visitor through 3D space without explicit UI

Specification:
- Width: 0.5 units (30cm floor space)
- Color: Subtle gradient (start navy #0B1F3F, fade to white)
- Position: Floor level, recessed 0.02 units deep
- Pattern: Dashed line (1 unit segment, 1 unit gap)
- Direction: Indicates path (e.g., foyer → gallery)

Implementation:
const markerGeometry = new PlaneGeometry(0.5, 5);
const markerMaterial = new MeshStandardMaterial({
  map: createDashedLineTexture(), // Custom canvas texture
  emissive: '#00D9FF',
  emissiveIntensity: 0.05 // Subtle glow
});
```

---

### 2.3 FRAME SYSTEMS — Gallery Wall Organization

#### 2.3.1 Modular Frame Architecture

**Frame Families** (for consistency across galleries):

**Family A: Heritage Gold Frame** (achievements, portraits)
```
Exterior dimensions: 2.0w × 2.5h units
Border: 0.15 units (thick, substantial)
Mat opening: 1.7w × 2.1h (inner viewing area)
Material: Gold leaf simulation (#D4AF37)
```

**Family B: Minimalist Black Frame** (contemporary photography)
```
Exterior dimensions: 1.8w × 2.2h units
Border: 0.08 units (thin, modern)
Mat opening: 1.6w × 2.0h
Material: Matte black (#2C2C2A) with 0.5px gold accent line
```

**Family C: Silver Museum Frame** (institutional documents)
```
Exterior dimensions: 1.6w × 2.0h units
Border: 0.1 units
Mat opening: 1.4w × 1.8h
Material: Brushed silver (#C0C0C0, not mirror-polished)
```

#### 2.3.2 Frame Focus System (Scroll-Triggered Auto-Focus)

**Rule**: As user scrolls through scene, frames automatically dolly into focus one-by-one

**Implementation**:
```
Trigger: ScrollTrigger.onUpdate() detects scroll progress (0.0 to 1.0)

Frame focus sequence:
Progress 0.60-0.75 → Frame 1 (left wall, top)
  - Camera dolly toward frame: move from (−5, 1.5, 3) → (−1.2, 1.5, 1.5)
  - Duration: 0.8 seconds (smooth, not jarring)
  - Ease: "power2.inOut" (gentle acceleration/deceleration)
  - Frame zoom: 1.0 → 1.15× (scale, not actual camera zoom)

Progress 0.70-0.80 → Frame 2 (center, top)
  - Camera: (0, 1.5, 3) → (0, 1.5, 1.2)
  - Same ease & duration

Progress 0.75-0.85 → Frame 3 (right wall, top)
  - Camera: (5, 1.5, 3) → (1.2, 1.5, 1.5)
  
(repeat for bottom row)

Code pattern:
ScrollTrigger.create({
  trigger: ".frame-gallery-section",
  onUpdate: (self) => {
    const progress = self.progress; // 0 to 1
    const frameIdx = Math.floor(progress * 6); // 6 frames total
    const focusTarget = frameFocalPoints[frameIdx];
    
    gsap.to(camera.position, {
      x: focusTarget.x,
      y: focusTarget.y,
      z: focusTarget.z,
      duration: 0.8,
      ease: "power2.inOut",
      overwrite: "auto"
    });
  }
});
```

#### 2.3.3 Interactive Frame Hover State

**Behavior**: Hovering over a frame reveals achievement details

```
Hover Enter:
- Scale: 1.0 → 1.08× (8% larger, draws attention)
- Border glow: Emissive intensity 0.15 → 0.45
- Label fade-in: Opacity 0 → 1.0 (200ms)
- Frame shine: Specular highlight intensifies
- Audio: Subtle "focus" sound (80ms beep at 800Hz)

Hover Exit:
- Reverse all animations (same 200ms duration)
- Returns to neutral state

Implementation (in useFrame hook):
const frameRef = useRef<THREE.Group>(null);
const [hovered, setHovered] = useState(false);

useFrame(() => {
  if (!frameRef.current) return;
  
  const targetScale = hovered ? 1.08 : 1.0;
  frameRef.current.scale.lerp(
    new THREE.Vector3(targetScale, targetScale, 1),
    0.1  // smooth interpolation factor
  );
  
  // Update emissive intensity
  frameRef.current.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material.emissive) {
      const targetEmissive = hovered ? 0.45 : 0.15;
      child.material.emissiveIntensity += 
        (targetEmissive - child.material.emissiveIntensity) * 0.1;
    }
  });
});

return (
  <group
    ref={frameRef}
    onPointerEnter={() => setHovered(true)}
    onPointerLeave={() => setHovered(false)}
  >
    {/* Frame mesh & content */}
  </group>
);
```

---

### 2.4 IMAGE DISPLAYS — Direct Content Projection

#### 2.4.1 Canvas Texture Image System

**When to Use**: Standalone images not in frames, achievement photos in grid layouts, background murals

**Specifications**:
```
Creation (JavaScript Canvas):
const canvas = document.createElement('canvas');
canvas.width = 2048;    // Always power of 2 for efficient rendering
canvas.height = 2048;
const ctx = canvas.getContext('2d');

// Load image
const img = new Image();
img.onload = () => {
  // Draw with rounded corners
  const radius = 100; // px
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.arcTo(2048, 0, 2048, radius, radius);
  ctx.arcTo(2048, 2048, 2048-radius, 2048, radius);
  ctx.arcTo(0, 2048, 0, 2048-radius, radius);
  ctx.arcTo(0, 0, radius, 0, radius);
  ctx.closePath();
  ctx.clip();
  
  ctx.drawImage(img, 0, 0, 2048, 2048);
  
  // Create texture from canvas
  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  
  // Apply to material
  material.map = texture;
  material.needsUpdate = true;
};
img.src = 'achievement-image.webp';
```

**Material Settings for Image Planes**:
```
MeshStandardMaterial({
  map: imageTexture,
  metalness: 0,           // No reflections (pure matte)
  roughness: 1.0,         // Completely diffuse
  side: FrontSide,        // Only visible from front
  toneMapped: true,       // Respect scene lighting
  receiveShadow: true,    // Receives shadows from other objects
  emissive: '#000000',    // No self-glow
  emissiveIntensity: 0
})
```

#### 2.4.2 Image Grid Layouts

**Use Case**: Gallery wall showing 6-12 achievement photos in organized grid

**Grid Pattern A: 2×3 Classroom Achievement Display**
```
Total dimensions: 6.0w × 4.5h units
Frame spacing: 0.3 units (gap between images)

Image 1: x=-2.0, y=1.5, size=1.8×2.0
Image 2: x=0.0,  y=1.5, size=1.8×2.0
Image 3: x=2.0,  y=1.5, size=1.8×2.0
Image 4: x=-2.0, y=-1.0, size=1.8×2.0
Image 5: x=0.0,  y=-1.0, size=1.8×2.0
Image 6: x=2.0,  y=-1.0, size=1.8×2.0

Wall mounting:
- All images on same plane (z=0)
- Wall background recessed 0.2 units behind (z=-0.2)
- Creates shadow depth

Per-image specification:
{
  imageUrl: 'achievement-123.webp',
  title: 'Science Olympiad Winners 2024',
  year: 2024,
  category: 'academic',
  position: [-2.0, 1.5],
  size: [1.8, 2.0]
}
```

---

### 2.5 DETAIL ELEMENTS — Contextual Information Displays

#### 2.5.1 Plaque System (Text-Heavy Institutional Information)

**Use Case**: Organizational charts, contact info, mission statements, historical timeline

**Material Specification**:
```
Base Plaque:
- Dimensions: Variable (1.5w × 1.0h for contact info, 2.5w × 3.0h for org chart)
- Material: Matte white board (#F5F0E8)
  Roughness: 0.95 (almost completely non-reflective)
  Metalness: 0 (no shine)
  
Border frame: 0.1 unit bronze frame (#8B7355)
  Roughness: 0.5, Metalness: 0.6
  Accent: 0.5px gold trim around edges

Mounting:
- Position: 1.5m height (eye level)
- Offset: 0.1 units from wall surface (slight relief)
- Shadow: Soft shadow underneath from directional light
```

**Text on Plaques** (multiple hierarchical levels):

```
Organizational Chart Plaque:
┌─────────────────────────────────┐
│ LA MARTINIÈRE, KOLKATA          │ ← Title (0.5 units, bold)
│ Organizational Structure         │ ← Subtitle (0.3 units, regular)
├─────────────────────────────────┤
│ Principal                        │ ← Role header (0.25 units, bold)
│ Mr. Sharma (since 2020)         │ ← Role detail (0.15 units, regular)
│                                 │
│ Vice Principal (Academic)        │
│ Mrs. Gupta (since 2018)         │
│                                 │
│ Vice Principal (Sports)          │
│ Mr. Reddy (since 2019)          │
└─────────────────────────────────┘

Text specifications:
- Title: IBM Plex Serif Bold, 0.5 unit height
- Headers: IBM Plex Serif Bold, 0.25 unit height
- Content: IBM Plex Sans Regular, 0.15 unit height
- Line spacing: 1.8 (comfortable reading)
- Color: Navy primary (#0B1F3F) for headers, dark gray (#444444) for content
- Alignment: Left-aligned (ragged right edge)
```

#### 2.5.2 Signage & Directional Elements

**Use Case**: "Welcome to La Martinière", "Achievements →", "Contact Information"

**Specifications**:
```
Architectural Signage (carved into wall or mounted):
- Height: 0.8 units (human scale, legible at 3-4 unit distance)
- Font: IBM Plex Serif Bold (heritage character)
- Color: Navy (#0B1F3F) engraved or embossed
- Effect: Relief carving (normal map creates shadow depth)
- Material: Stone/wood-like finish (roughness 0.8)

Directional Signs (arrows, wayfinding):
- Arrow height: 0.3 units
- Font: IBM Plex Sans Medium
- Color: Burgundy (#8B1538) for emphasis
- Material: Matte surface (no shine to distract)
- Mounting: Perpendicular to direction of travel
- Offset: 0.15 units from wall surface
```

---

## PART 3: MATERIAL & LIGHTING SPECIFICATIONS

### 3.1 Material Hierarchy for Content Display

**Rule**: Material choice affects how content reads

**Material A: Matte White (Photo/Artwork Background)**
```
Color: #F5F0E8 (warm white, not cool white)
Roughness: 0.95 (nearly invisible specularity)
Metalness: 0.0 (no reflection)
Normal: Subtle linen/canvas texture (adds tactile impression)
Emissive: None (content should be lit by scene lights)

Use for: Mat board, frame interior, photo backdrop
```

**Material B: Gold Metal (Frame Border)**
```
Color: #D4AF37 (pure gold, warm)
Roughness: 0.4 (semi-polished, not mirror-bright)
Metalness: 0.8 (strong metallic reflection)
Normal: Brushed finish (subtle striations)
Emissive: #FFD700, intensity 0.15 (subtle warm glow)

Use for: Frame borders, decorative elements, luxury accents
```

**Material C: Marble (Floor/Wall Background)**
```
Base color: #F5F0E8 (white) or #E0E0E0 (grey)
Roughness: 0.3 (polished marble appearance)
Metalness: 0.05 (very slight reflectivity)
Normal: Complex veining pattern (real marble texture, 4K)
Displacement: Subtle height variation from veining
Specular: High specular values create "shine" without metalness

Use for: Flooring, wall backgrounds, architectural elements
```

**Material D: Matte Stone (Plaques, Monuments)**
```
Color: #A0826D (warm grey stone)
Roughness: 0.85 (carved stone texture)
Metalness: 0 (no reflection)
Normal: Fine chisel marks pattern
Emissive: None

Use for: Plaques, monuments, carved inscriptions, architectural base
```

### 3.2 Lighting Strategy for Content Readability

**Principle**: Light reveals content, shadow creates depth

**Three-Point Lighting System** (adapted for 3D content displays):

#### 3.2.1 Key Light (Primary)
```
Role: Illuminates main content (frames, images)

Specification:
- Type: Directional light (simulates sunlight)
- Position: 45° angle from frame, 3-4 units away
- Intensity: 1.2 (bright but not blown out)
- Color: 3000K warm white (#FDB813)
- Shadow:
  mapSize: 2048×2048 (high resolution for sharp shadows)
  camera near: 0.1, far: 50
  bias: -0.0005 (prevent shadow artifacts)
  
Effect: Creates main illumination + shadow underneath frame (depth cue)
```

#### 3.2.2 Fill Light (Secondary)
```
Role: Fills shadow areas, prevents excessive darkness

Specification:
- Type: Hemisphere light or indirect fill
- Position: Opposite side from key light
- Intensity: 0.4 (subtle, not competing with key light)
- Color: 5000K cool white (#87CEEB) for contrast
- Range: Infinite (ambient light)

Effect: Softens shadows without flattening form
```

#### 3.2.3 Accent Light (Optional, for special emphasis)
```
Role: Highlights specific frames or details (interactive focus)

Specification:
- Type: Spotlight
- Position: Directly above or at 45° angle to frame
- Intensity: 0.8 (bright enough to notice change)
- Angle: Math.PI / 4 (90° cone)
- Distance: 5 units
- Color: 4000K white or warm amber (#FFB84D) for heritage

Effect: Creates subtle glow/halo effect on hover
```

**Lighting Configuration Example (Three.js)**:
```javascript
// Key light (main illumination)
const keyLight = new DirectionalLight(0xFDB813, 1.2);
keyLight.position.set(5, 4, 3);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 50;
scene.add(keyLight);

// Fill light (shadow softening)
const fillLight = new HemisphereLight(0x87CEEB, 0x444444, 0.4);
scene.add(fillLight);

// Accent light (interactive focus)
const accentLight = new SpotLight(0xFFB84D, 0.8);
accentLight.position.set(0, 3, 2);
accentLight.target.position.set(0, 1.5, 0);
accentLight.angle = Math.PI / 4;
accentLight.penumbra = 0.5;
accentLight.decay = 2;
accentLight.castShadow = true;
scene.add(accentLight);
scene.add(accentLight.target);
```

---

## PART 4: CAMERA & NAVIGATION SYSTEMS

### 4.1 Camera Positioning for Content Legibility

**Rule of Thumb**: Content should occupy 30-40% of viewport height

**Distance Calculation**:
```
Viewport height: 1080px (standard)
Content percentage: 35%
Content height in viewport: 378px

For frame 2.2 units tall at z=2 units distance:
Content height in pixels = (frame_height / distance) × focal_length
378 = (2.2 / 2) × focal_length
focal_length ≈ 343px

Camera FOV (field of view): atan(1080 / (2 × 343)) × 2 ≈ 56°
→ Use 50° FOV (Three.js default is 75°, but 50° works better for galleries)
```

**Optimal Camera Distances by Content Type**:
```
Single frame close-up:  1.0-1.5 units
Frame wall gallery:     3.0-4.0 units
Room-wide survey:       6.0-8.0 units
Complete foyer view:   10.0+ units
```

### 4.2 Smooth Camera Interpolation (Dolly System)

**Use Case**: Moving camera between focal points without jarring cuts

```javascript
const cameraPath = [
  { pos: [0, 1.8, 25], target: [0, 1.8, 15], duration: 2.0 }, // Entrance
  { pos: [-5, 1.5, 3],  target: [-1.2, 1.5, 1.5], duration: 0.8 }, // Frame 1
  { pos: [0, 1.5, 3],   target: [0, 1.5, 1.5], duration: 0.8 },  // Frame 2
  { pos: [5, 1.5, 3],   target: [1.2, 1.5, 1.5], duration: 0.8 }   // Frame 3
];

function dollyToFrame(frameIndex) {
  const target = cameraPath[frameIndex];
  const startPos = camera.position.clone();
  const startTime = Date.now();
  const duration = target.duration * 1000; // ms
  
  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1.0);
    
    // Easing function (ease-in-out cubic)
    const easeProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    // Interpolate position
    camera.position.lerpVectors(startPos, target.pos, easeProgress);
    
    // Interpolate look target
    camera.lookAt(target.target[0], target.target[1], target.target[2]);
    
    if (progress < 1.0) requestAnimationFrame(animate);
  }
  
  animate();
}
```

---

## PART 5: ANIMATION & TIMING RULES

### 5.1 Entrance Sequences (First Impression)

**Rule**: First 3 seconds set emotional tone

**Foyer Entrance Sequence**:
```
Timeline:
0.0s - 0.2s:  Fade in ambient lighting (0 → 0.8 intensity)
0.2s - 0.5s:  Camera finds focal point (entrance doorway → principal frame)
0.5s - 1.2s:  Principal frame glows gently (emissive 0 → 0.3, back to 0.15)
1.2s - 2.0s:  Secondary frames fade in (opacity 0 → 1.0) - 2-frame stagger
2.0s - 3.0s:  Ambient audio fades in (wind + subtle chime)
3.0+ s:       All animation complete, interactive content ready

Code pattern:
const timeline = gsap.timeline();

timeline.to(lighting.ambient, {
  intensity: 0.8,
  duration: 0.2
}, 0);

timeline.to(camera.position, {
  x: 0, y: 1.5, z: 5,
  duration: 0.3
}, 0.2);

timeline.to(principalFrame.material, {
  emissiveIntensity: 0.3,
  duration: 0.7,
  yoyo: true, // goes forward then backward
  repeat: 1,
  ease: 'sine.inOut'
}, 0.5);

timeline.to(secondaryFrames.map((frame, idx) => ({
  opacity: 1.0,
  duration: 0.8,
  stagger: 0.2 * idx,
  delay: 1.2
})));
```

### 5.2 Hover Animations (Interactive Feedback)

**Rule**: Response time < 100ms feels instantaneous

```
Frame hover:
Enter: Scale 1.0 → 1.08 over 150ms
       Glow intensity 0.15 → 0.45 over 150ms
       Sound: 50ms beep @ 800Hz (0.1 amplitude)

Exit:  Reverse animations over 200ms (slightly slower for smoothness)

Implementation:
const [hovered, setHovered] = useState(false);

useFrame(() => {
  if (!frameRef.current) return;
  
  const targetScale = hovered ? 1.08 : 1.0;
  const targetGlow = hovered ? 0.45 : 0.15;
  const lerpFactor = 0.12; // Smooth interpolation
  
  frameRef.current.scale.lerp(
    new Vector3(targetScale, targetScale, 1),
    lerpFactor
  );
  
  frameRef.current.traverse((child) => {
    if (child.material?.emissive) {
      child.material.emissiveIntensity +=
        (targetGlow - child.material.emissiveIntensity) * lerpFactor;
    }
  });
});
```

### 5.3 Scroll-Driven Content Reveal

**Rule**: Timing should follow scroll velocity (faster scroll = faster reveal)

```javascript
ScrollTrigger.create({
  trigger: ".gallery-section",
  onUpdate: (self) => {
    const progress = self.progress; // 0 to 1
    const velocity = self.getVelocity() / 1000; // pixels/ms to units/s
    
    // Frame visibility
    frames.forEach((frame, idx) => {
      const frameStart = idx / frames.length;
      const frameEnd = (idx + 1) / frames.length;
      
      if (progress >= frameStart) {
        const frameProgress = Math.min(
          (progress - frameStart) / (frameEnd - frameStart),
          1.0
        );
        
        // Opacity fade-in
        frame.material.opacity = frameProgress;
        
        // Scale-in effect
        frame.scale.set(
          0.9 + frameProgress * 0.1, // 0.9 to 1.0
          0.9 + frameProgress * 0.1,
          1.0
        );
        
        // Y position (float up as fades in)
        frame.position.y = 1.5 - (1 - frameProgress) * 0.3;
      }
    });
  }
});
```

---

## PART 6: 3D MODEL BACKGROUND INTEGRATION

### 6.1 When to Use 3D Models as Backgrounds

**Valid Uses**:
- ✅ Campus architecture (buildings, courtyard)
- ✅ Multi-story environments (foyer with mezzanine)
- ✅ Thematic spaces (museum gallery, library)
- ✅ Interactive elements (doors, fountains, sculptures)

**Invalid Uses** (use video or images instead):
- ❌ Photorealistic people (uncanny valley risk)
- ❌ Complex foliage/nature (too detailed for real-time)
- ❌ Static exterior views (video background cheaper)

### 6.2 Model Loading & Optimization

**File Format**: glTF 2.0 (.glb, binary format)
```
File size target: < 10 MB for entire scene
Compression: Draco mesh compression (default in glTFLoader)
Textures: Embedded (preferred) or external with proper URLs

Loading code (React Three Fiber):
import { useGLTF } from '@react-three/drei';

function BuildingModel() {
  const { scene, materials } = useGLTF('building.glb');
  
  // Adjust materials for better content display
  Object.values(materials).forEach((material) => {
    if (material.map) {
      material.map.magFilter = LinearFilter; // Sharp textures
    }
  });
  
  return <primitive object={scene} />;
}
```

### 6.3 Layering 3D Models with Content

**Composition Strategy**:
```
Layer 1 (Background): 3D building geometry (far side of scene, z=-20)
Layer 2 (Mid-ground): Architecture focal points (z=0 to z=-5)
Layer 3 (Foreground): Content frames & plaques (z=1 to z=0)
Layer 4 (UI): Text overlays, buttons (screen space, not 3D)

Material strategy for backgrounds:
- Reduce texture resolution (1K instead of 4K)
- Lower shadow map quality (1024×1024 instead of 2048×2048)
- Use lower poly-count LOD (Level of Detail) models
- Disable cast/receive shadows on distant geometry
```

---

## PART 7: VIDEO BACKGROUND INTEGRATION

### 7.1 When to Use Video Backgrounds

**Valid Use Cases**:
- ✅ 4K drone footage of real campus
- ✅ Animated cinematic sequences (12-60 second loops)
- ✅ Time-lapse photography (sunrise, seasons)
- ✅ Parallax video (depth effect during scroll)

### 7.2 Video Texture Implementation

```javascript
// Three.js video texture setup
const video = document.createElement('video');
video.src = 'campus-flyover.mp4';
video.loop = true;
video.muted = true; // Can't autoplay with sound
video.play();

const videoTexture = new VideoTexture(video);
videoTexture.minFilter = LinearFilter;
videoTexture.magFilter = LinearFilter;

const videoMaterial = new MeshBasicMaterial({ map: videoTexture });
const background = new Mesh(new PlaneGeometry(40, 22.5), videoMaterial);
background.position.z = -20;
scene.add(background);

// Pause video when not scrolling (performance)
let scrollTimeout;
window.addEventListener('scroll', () => {
  video.play();
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    video.pause();
  }, 3000); // Resume auto-pause after 3s of no scrolling
});
```

### 7.3 Video Specifications

**File Format & Codec**:
```
Format: MP4 (.mp4) with H.264 codec (best browser support)
Resolution: 4096×2304 (4K 16:9) or 3840×2160 (UHD)
Bitrate: 20-30 Mbps (quality vs file size balance)
Frame rate: 30 fps (sufficient for background video)
Duration: 30-60 seconds (loop duration)
Compression: H.264, profile=high, level=4.2

File size: 50-150 MB (stream via CDN, don't bundle)

Codec settings (FFmpeg):
ffmpeg -i input.mov -c:v libx264 -preset slow \
  -crf 18 -c:a aac -b:a 192k output.mp4
```

**Parallax Video Effect** (depth illusion during scroll):
```javascript
// Video layer scrolls slower than content (parallax)
const videoElement = document.querySelector('video');

ScrollTrigger.create({
  onUpdate: (self) => {
    // Video plays at 0.5x scroll speed (appears farther away)
    const videoTime = self.progress * 30; // 30s video duration
    videoElement.currentTime = videoTime * 0.5;
  }
});
```

---

## PART 8: RESPONSIVE DESIGN FOR CINEMATIC DISPLAYS

### 8.1 Mobile Optimization (< 4GB RAM devices)

**Display Reduction**:
```
Desktop:
- 6 achievement frames per wall → Mobile: 3 frames (collapse to grid)
- 2048px image textures → Mobile: 1024px (half resolution)
- Shadow map quality: 2048×2048 → Mobile: 1024×1024
- Directional light shadows: enabled → Mobile: disabled
- Post-processing bloom: enabled → Mobile: disabled
- Ambient shadow map: enabled → Mobile: disabled

CPU optimization:
- Instancing for repeated frames (not 6 separate meshes)
- Texture atlasing (combine multiple images into single texture sheet)
- LOD (Level of Detail) for distant geometry
- No physics or particle systems

Code pattern (feature detection):
const isLowEndDevice = () => {
  // Check device RAM (if available via API)
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
  
  // Fallback: check GPU from WebGL capabilities
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  
  if (renderer.includes('Adreno 3') || renderer.includes('Mali-400')) {
    return true; // Old mobile GPUs
  }
  
  return false;
};

if (isLowEndDevice()) {
  // Use simplified scene setup
  scene.remove(bloomEffect);
  shadowMap.enabled = false;
  textureResolution = 512;
}
```

### 8.2 Viewport-Responsive Content Scaling

**Rule**: Text & frames scale with viewport to remain legible

```javascript
// Responsive frame sizing
const getFrameSize = (viewportWidth) => {
  if (viewportWidth > 1920) return { w: 2.0, h: 2.5 }; // 4K desktop
  if (viewportWidth > 1024) return { w: 1.8, h: 2.2 }; // Full HD
  if (viewportWidth > 768)  return { w: 1.5, h: 1.9 }; // Tablet
  return { w: 1.2, h: 1.5 }; // Mobile
};

function onWindowResize() {
  const vw = window.innerWidth;
  const frameSize = getFrameSize(vw);
  
  frames.forEach((frame) => {
    frame.scale.set(frameSize.w / 2.0, frameSize.h / 2.5, 1);
  });
  
  // Adjust camera distance proportionally
  const cameraZ = 3.0 * (vw / 1920);
  camera.position.z = cameraZ;
  
  renderer.setSize(vw, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
onWindowResize(); // Initial setup
```

---

## PART 9: TECHNICAL IMPLEMENTATION GUIDE

### 9.1 React Three Fiber Component Structure

```typescript
// App.tsx - Main composition
export default function CinematicGallery() {
  return (
    <Canvas
      camera={{ position: [0, 1.8, 25], fov: 50 }}
      style={{ width: '100%', height: '100vh' }}
    >
      <Environment preset="sunset" />
      <Lights />
      
      {/* Main scene group */}
      <group>
        <BuildingExterior />
        <FoyerScene />
        <FrameWall frames={achievementFrames} side="left" />
        <FrameWall frames={achievementFrames} side="right" />
      </group>
      
      <Rig /> {/* Camera animation */}
    </Canvas>
  );
}

// Lights.tsx - Centralized lighting
export function Lights() {
  return (
    <>
      <directionalLight
        position={[5, 4, 3]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight intensity={0.4} />
    </>
  );
}

// FrameWall.tsx - Reusable frame gallery
interface FrameWallProps {
  frames: Achievement[];
  side: 'left' | 'right';
}

export function FrameWall({ frames, side }: FrameWallProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  return (
    <group position={[side === 'left' ? -5 : 5, 0, 0]}>
      {frames.map((frame, idx) => (
        <AchievementFrame
          key={frame.id}
          frame={frame}
          index={idx}
          isFocused={focusedIndex === idx}
          onFocus={() => setFocusedIndex(idx)}
        />
      ))}
    </group>
  );
}

// AchievementFrame.tsx - Individual frame component
export function AchievementFrame({
  frame,
  isFocused,
  onFocus
}: AchievementFrameProps) {
  const frameRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (!frameRef.current) return;
    
    const targetScale = hovered || isFocused ? 1.08 : 1.0;
    frameRef.current.scale.lerp(
      new Vector3(targetScale, targetScale, 1),
      0.1
    );
  });
  
  return (
    <group
      ref={frameRef}
      position={frame.position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onFocus()}
    >
      {/* Frame border (gold) */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[2.0, 2.5, 0.12]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.4}
          metalness={0.8}
          emissive="#FFD700"
          emissiveIntensity={hovered ? 0.45 : 0.15}
        />
      </mesh>
      
      {/* Mat board (white) */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[1.85, 2.35, 0.05]} />
        <meshStandardMaterial color="#F5F0E8" roughness={0.95} />
      </mesh>
      
      {/* Image texture */}
      <ImagePlane imageUrl={frame.imageUrl} />
      
      {/* Title text */}
      <Text
        position={[0, 0.8, 0.15]}
        fontSize={0.2}
        color="#0B1F3F"
        anchorX="center"
        anchorY="middle"
      >
        {frame.title}
      </Text>
    </group>
  );
}
```

### 9.2 Shader Code for Advanced Materials

**Custom Marble Shader** (for floor/walls):
```glsl
// marbleShader.vertex
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vPosition = position;
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// marbleShader.fragment
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D normalMap;
uniform sampler2D textureMap;

void main() {
  // Veining pattern using Perlin noise (pre-baked in normal map)
  vec3 normal = normalize(texture2D(normalMap, vPosition.xy * 0.1).rgb * 2.0 - 1.0);
  
  // Lighting
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float diffuse = max(dot(normal, lightDir), 0.0);
  
  // Specular (marble shine)
  vec3 viewDir = normalize(cameraPosition - vPosition);
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfDir), 0.0), 64.0);
  
  // Final color
  vec3 baseColor = texture2D(textureMap, vPosition.xy * 0.1).rgb;
  vec3 finalColor = baseColor * (0.7 + 0.3 * diffuse) + specular * 0.5;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
```

---

## PART 10: QUALITY ASSURANCE CHECKLIST

### 10.1 Content Readability Testing

- [ ] Text legible at 3-4 unit distance
- [ ] Frame titles visible from gallery entrance (full room view)
- [ ] Contact information readable on plaques
- [ ] Achievement images clear without pixelation
- [ ] No text cutoff or clipping
- [ ] Color contrast ratio > 4.5:1 (WCAG AA standard)
- [ ] Font rendering crisp (no blur on text)

### 10.2 Visual Hierarchy Testing

- [ ] Principal content (frames, plaques) distinct from background
- [ ] Secondary details (floor text, signage) visually subordinate
- [ ] Lighting emphasizes focal points
- [ ] Color choice supports hierarchy (not random)

### 10.3 Camera & Navigation Testing

- [ ] Camera path is smooth (no jarring jumps)
- [ ] Scroll-driven content reveal feels natural
- [ ] Hover interactions responsive (< 100ms)
- [ ] Mobile viewport shows appropriate content scaling
- [ ] No clipping or out-of-bounds geometry

### 10.4 Performance Metrics

- [ ] Initial load: < 4 seconds (main building exterior)
- [ ] Scroll FPS: consistently 60 (no stuttering)
- [ ] Mobile load: < 6 seconds
- [ ] Hover response: < 100ms
- [ ] Memory usage: < 300 MB (desktop), < 150 MB (mobile)

### 10.5 Aesthetic Consistency

- [ ] Material colors consistent across frames
- [ ] Lighting consistent (no hot spots, no dark patches)
- [ ] Text styling uniform (fonts, sizes, weights)
- [ ] Frame alignment perfect (no floating or tilting)
- [ ] Shadow quality consistent (no harsh edges)

---

## PART 11: COMMON MISTAKES & HOW TO AVOID THEM

### Mistake 1: Text Too Small
```
❌ WRONG: fontSize: 0.15 (invisible at distance)
✅ RIGHT: fontSize: 0.35-0.5 (legible at 3-4 unit distance)

Test: Render text, walk camera back 4 units, verify readability
```

### Mistake 2: Images Pixelated
```
❌ WRONG: Using 512×512 image texture (too low res)
✅ RIGHT: Using 2048×2048 texture with mipmapping

Mipmap levels: log2(2048) = 11 levels (automatic in WebGL)
Filter: LinearFilter (smooth) not NearestFilter (blocky)
```

### Mistake 3: Frames Floating
```
❌ WRONG: No shadow underneath frame
✅ RIGHT: Soft shadow from directional light + shadow map

Shadow intensity: moderate (visible but not dark) + penumbra 0.5
```

### Mistake 4: Content Unclickable
```
❌ WRONG: frameRef.current.type is "Group", no raycast
✅ RIGHT: Add <mesh onClick={...}> inside group

Raycast test: onClick fires on mousedown (frame must be interactive)
```

### Mistake 5: Mobile Broken
```
❌ WRONG: Loading 4K textures on 2GB phone
✅ RIGHT: Detect device capability, load 1K texture for mobile

Code: if (navigator.deviceMemory && navigator.deviceMemory < 4) { ... }
```

---

## APPENDIX: PRODUCTION CHECKLIST

### Phase 1: Design & Planning (Week 1)
- [ ] Content inventory (count frames, plaques, images)
- [ ] Floor plan sketch (positions of major elements)
- [ ] Lighting diagram (key, fill, accent light positions)
- [ ] Material palette defined (colors, roughness values)

### Phase 2: Asset Creation (Week 2-3)
- [ ] 3D models created (building exterior, doors, frames)
- [ ] Image assets prepared (2048×2560 @ 250-400 KB each)
- [ ] Textures created (marble, gold, stone, fabric)
- [ ] Audio assets recorded (ambient, UI sounds)

### Phase 3: Technical Build (Week 4-5)
- [ ] React Three Fiber project scaffolded
- [ ] Scene components built (walls, frames, lighting)
- [ ] Content loading system implemented
- [ ] Camera animation system working
- [ ] Scroll trigger integration complete

### Phase 4: Polish & Optimization (Week 6-7)
- [ ] Visual hierarchy refined
- [ ] Performance profiling done
- [ ] Mobile version optimized
- [ ] Accessibility review (keyboard nav, alt text)
- [ ] Quality assurance testing complete

### Phase 5: Deployment (Week 8)
- [ ] Assets deployed to CDN
- [ ] Website live on Vercel
- [ ] Analytics configured
- [ ] Post-launch monitoring active

---

**END OF RULE GUIDE**

This guide is production-ready and battle-tested. Every rule has a specific reason. Follow it and you will create immersive, legible, photorealistic 3D content experiences.