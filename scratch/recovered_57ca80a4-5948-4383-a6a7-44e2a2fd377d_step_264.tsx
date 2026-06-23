Created At: 2026-06-22T17:38:42Z
Completed At: 2026-06-22T17:38:42Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/three/BuildingScene.tsx`
Total Lines: 675
Total Bytes: 38626
Showing lines 550 to 600
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
550:             </mesh>
551:           ))}
552:         </group>
553:       ))}
554:       {/* Pool lighting rig */}
555:       <PoolLighting poolPosition={[5, 0, -18]} />
556: 
557:       {schoolId === 'girls' && (
558:         <>
559:           <GirlsCourtyard accent={accent} position={[15, 0, 18]} scale={0.7} />
560:           <CourtyardLighting />
561:         </>
562:       )}
563: 
564:       {/* Ambient campus fill */}
565:       <pointLight position={[0, 10, 5]} intensity={10} distance={45} color={accent} />
566:       <hemisphereLight args={['#87ceeb', '#2d4a2d', 0.6]} />
567:     </group>
568:   );
569: }
570: 
571: export default function BuildingScene({ schoolId, progressRef, activeStage, mobile, reducedMotion }: Props) {
572:   const experience = getExperience(schoolId);
573:   const { camera, gl } = useThree();
574:   const textures = useRealisticTextures();
575:   const smoothedGaze = useRef(new THREE.Vector3());
576:   const previousStage = useRef(-1);
577:   const rigs = useMemo<Rig[]>(() => experience.stages.map((stage) => ({ position: curve(stage.keyframes, 'position'), gaze: curve(stage.keyframes, 'lookAt') })), [experience]);
578:   const exteriorZones = experience.zones.filter((zone) => zone.stages.includes(activeStage));
579:   const stage = experience.stages[activeStage] ?? experience.stages[0];
580: 
581:   useEffect(() => {
582:     gl.toneMapping = THREE.ACESFilmicToneMapping;
583:     gl.toneMappingExposure = .96;
584:     gl.outputColorSpace = THREE.SRGBColorSpace;
585:     gl.shadowMap.enabled = !mobile;
586:     gl.shadowMap.type = THREE.PCFSoftShadowMap;
587:   }, [gl, mobile]);
588: 
589:   useEffect(() => {
590:     const nextStage = Math.min(activeStage + 1, experience.stages.length - 1);
591:     experience.zones.filter((zone) => zone.stages.includes(nextStage)).forEach((zone) => {
592:       useGLTF.preload(zone.url);
593:     });
594:   }, [activeStage, experience, mobile]);
595: 
596:   useFrame((_, delta) => {
597:     const progress = reducedMotion ? stage.range[0] : progressRef.current;
598:     const local = THREE.MathUtils.clamp((progress - stage.range[0]) / Math.max(stage.range[1] - stage.range[0], .001), 0, 1);
599:     const rig = rigs[activeStage] ?? rigs[0];
600:     rig.position.getPoint(local, positionTarget);
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
