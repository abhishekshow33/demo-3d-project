Created At: 2026-06-22T19:07:06Z
Completed At: 2026-06-22T19:07:17Z
The following changes were made by the multi_replace_file_content tool to: /Users/abhishekshow/Downloads/la-martiniere-excellence-improved/three/BuildingScene.tsx. If relevant, proactively run terminal commands to execute this code for the USER. Don't ask for permission.
[diff_block_start]
@@ -10,6 +10,7 @@
 import { InteriorLighting, CourtyardLighting, PoolLighting } from './InteriorLighting';
 import { AchievementFrameWall, SCHOOL_ACHIEVEMENTS } from './AchievementFrameWall';
 import WallNarrativePlaques from './WallNarrativePlaques';
+import { useCinematicEntrance, EntranceAmbientLight } from './CinematicEntrance';
 import { GirlsCourtyard } from './CourtyardFeatures';
 
 type Props = {
@@ -239,6 +239,7 @@
 
 export default function BuildingScene({ schoolId, progressRef, activeStage, mobile, reducedMotion }: Props) {
   const experience = getExperience(schoolId);
+  const cinematicState = useCinematicEntrance();
   const { camera, gl } = useThree();
   const textures = useRealisticTextures();
   const smoothedGaze = useRef(new THREE.Vector3());
@@ -291,6 +291,7 @@
 
       {/* 2. Building Shell (Corridor, Plaster, Wainscoting, Floor) */}
       <group position={[0,0,0]}>
+        <EntranceAmbientLight ambientProgress={cinematicState.ambientProgress} targetIntensity={0.8} />
 
 
         <FloorEngraving text="Labore et Constantia" position={[0, -.07, 10]} />
@@ -318,8 +318,8 @@
           <WallNarrativePlaques schoolId={schoolId} activeStage={activeStage} />
         </group>
 
-        <AchievementFrameWall side="left" schoolId={schoolId} accent={experience.accent} achievements={SCHOOL_ACHIEVEMENTS[schoolId]} revealOffset={0} />
-        <AchievementFrameWall side="right" schoolId={schoolId} accent={experience.accent} achievements={SCHOOL_ACHIEVEMENTS[schoolId]} revealOffset={3} />
+        <AchievementFrameWall side="left" schoolId={schoolId} accent={experience.accent} achievements={SCHOOL_ACHIEVEMENTS[schoolId]} revealOffset={0} frameReveal={cinematicState.frameReveal} />
+        <AchievementFrameWall side="right" schoolId={schoolId} accent={experience.accent} achievements={SCHOOL_ACHIEVEMENTS[schoolId]} revealOffset={3} frameReveal={cinematicState.frameReveal} />
 
         <InteriorLighting entranceProgress={1} visible={stage.world === 'interior'} />
       </group>
[diff_block_end]

Please note that the above snippet only shows the MODIFIED lines from the last change. It shows up to 3 lines of unchanged lines before and after the modified lines. The actual file contents may have many more lines not shown.

We did our best to apply changes despite some inaccuracies. Double check if the edit applied is what you intended.