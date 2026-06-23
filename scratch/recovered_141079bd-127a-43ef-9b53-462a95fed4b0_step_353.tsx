Created At: 2026-06-22T17:58:37Z
Completed At: 2026-06-22T17:58:37Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/three/BuildingScene.tsx`
Total Lines: 675
Total Bytes: 38626
Showing lines 480 to 580
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
480:           <ringGeometry args={[5.6, 5.76, 32, 1, 0, Math.PI]} />
481:           <meshBasicMaterial color="#f5f0e0" transparent opacity={0.9} />
482:         </mesh>
483:       ))}
484:       {/* Free-throw circles */}
485:       {([-22.5, -3.5] as number[]).map((cx) => (
486:         <mesh key={cx} position={[cx, 0.09, 5]} rotation={[-Math.PI / 2, 0, 0]}>
487:           <ringGeometry args={[1.75, 1.88, 28]} />
488:           <meshBasicMaterial color="#f5f0e0" transparent opacity={0.8} />
489:         </mesh>
490:       ))}
491:       {/* Accent glow overlay */}
492:       <mesh position={[-13, 0.055, 5]}>
493:         <boxGeometry args={[29, 0.01, 18]} />
494:         <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.08} transparent opacity={0.15} />
495:       </mesh>
496:       {/* Stadium floodlights */}
497:       <StadiumLighting />
498:       {/* Extra court-level lights for drama */}
499:       <pointLight position={[-13, 8, 5]} color={accent} intensity={16} distance={28} />
500:       <pointLight position={[-24, 5, 5]} color="#fff8e7" intensity={10} distance={18} />
501:       <pointLight position={[-2, 5, 5]} color="#fff8e7" intensity={10} distance={18} />
502:       {/* Hoops */}
503:       <BasketballHoop position={[-26, 0, 5]} rotation={Math.PI / 2} accent={accent} />
504:       <BasketballHoop position={[0, 0, 5]} rotation={-Math.PI / 2} accent={accent} />
505: 
506:       {/* ── POOL AREA ── */}
507:       {/* Pool deck (surround) */}
508:       <mesh position={[5, 0.1, -18]} receiveShadow>

<truncated 1733 bytes>
5, 0, 0]}>
542:             <boxGeometry args={[1.05, 0.06, 0.55]} />
543:             <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} roughness={0.4} />
544:           </mesh>
545:           {/* Block legs */}
546:           {[-0.45, 0.45].map((bx) => (
547:             <mesh key={bx} position={[bx, -0.18, 0]} castShadow>
548:               <cylinderGeometry args={[0.04, 0.04, 0.36, 6]} />
549:               <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
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
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
