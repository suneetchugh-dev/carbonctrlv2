import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere, Cylinder, PointerLockControls } from "@react-three/drei";
import { X, Play, Pause, RotateCcw, CheckCircle, Zap, Home, Car, Factory, TrendingUp, Users, Heart, DollarSign, Leaf, Building2, Sparkles, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MissionCity } from "@/components/globe/Globe";
import * as THREE from "three";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: MissionCity | null;
  onComplete: (missionId: string) => void;
}

interface SolarPanel {
  id: string;
  x: number;
  y: number;
  efficiency: number;
  isPlaced: boolean;
  energyOutput: number;
  isConnected: boolean;
}

interface CityBuilding {
  id: string;
  type: 'residential' | 'commercial' | 'industrial';
  x: number;
  y: number;
  energyDemand: number;
  satisfaction: number;
  isPowered: boolean;
}

interface Citizen {
  id: string;
  name: string;
  mood: 'happy' | 'neutral' | 'sad';
  energyUsage: number;
  satisfaction: number;
  avatar: string;
  isCelebrating: boolean;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  type: 'sparkle' | 'energy' | 'confetti';
  color: string;
  life: number;
}

interface EnergyFlow {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  intensity: number;
}

// 3D Game Types
interface SolarLamp {
  id: string;
  position: [number, number, number];
  isPlaced: boolean;
  isPowered: boolean;
  energyOutput: number;
  lightRadius: number;
}

interface NPCCharacter {
  id: string;
  name: string;
  position: [number, number, number];
  targetPosition: [number, number, number];
  mood: 'happy' | 'neutral' | 'sad';
  isInLight: boolean;
  animationState: 'walking' | 'idle' | 'celebrating';
  speed: number;
}

interface PlayerCharacter {
  position: [number, number, number];
  rotation: [number, number, number];
  isMoving: boolean;
  selectedLamp: SolarLamp | null;
}

// 3D Game Components
function PlayerCharacter({ position, rotation, isMoving }: { position: [number, number, number], rotation: [number, number, number], isMoving: boolean }) {
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Walking animation
    if (isMoving && bodyRef.current) {
      // Body bobbing
      bodyRef.current.position.y = position[1] + Math.sin(time * 8) * 0.05;
      
      // Arm swinging
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = Math.sin(time * 8) * 0.5;
        rightArmRef.current.rotation.z = -Math.sin(time * 8) * 0.5;
      }
      
      // Leg movement
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 8) * 0.3;
        rightLegRef.current.rotation.x = -Math.sin(time * 8) * 0.3;
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Human-like body with torso */}
      <mesh ref={bodyRef} position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.08, 1.25, 0.15]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.08, 1.25, 0.15]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Left arm */}
      <mesh ref={leftArmRef} position={[-0.3, 0.8, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Right arm */}
      <mesh ref={rightArmRef} position={[0.3, 0.8, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Left leg */}
      <mesh ref={leftLegRef} position={[-0.1, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      
      {/* Right leg */}
      <mesh ref={rightLegRef} position={[0.1, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.1, -0.2, 0.1]}>
        <boxGeometry args={[0.15, 0.1, 0.2]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0.1, -0.2, 0.1]}>
        <boxGeometry args={[0.15, 0.1, 0.2]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
    </group>
  );
}

function SolarLampComponent({ lamp, onPlace }: { lamp: SolarLamp, onPlace: (lamp: SolarLamp) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && lamp.isPlaced && lamp.isPowered) {
      // Glowing animation
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      }
    }
  });

  return (
    <group position={lamp.position}>
      {/* Lamp post */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Lamp head */}
      <mesh ref={meshRef} position={[0, 1, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial 
          color={lamp.isPlaced && lamp.isPowered ? "#fbbf24" : "#6b7280"}
          emissive={lamp.isPlaced && lamp.isPowered ? "#fbbf24" : "#000000"}
          emissiveIntensity={lamp.isPlaced && lamp.isPowered ? 0.5 : 0}
        />
      </mesh>
      {/* Light radius indicator */}
      {lamp.isPlaced && lamp.isPowered && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.5, lamp.lightRadius, 16]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.1} />
        </mesh>
      )}
    </group>
  );
}

function NPCCharacter({ npc, onMoodChange, gameState }: { npc: NPCCharacter, onMoodChange: (id: string, mood: 'happy' | 'neutral' | 'sad') => void, gameState: string }) {
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(npc.position);
  
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    
    // Only move if game is playing
    if (gameState !== "playing") {
      // Idle animation when game is not playing
      if (bodyRef.current) {
        bodyRef.current.position.y = currentPosition[1] + Math.sin(time * 2) * 0.02;
      }
      return;
    }
    
    // Only animate if NPC is actually moving (has a different target)
    const distanceToTarget = Math.sqrt(
      Math.pow(npc.targetPosition[0] - currentPosition[0], 2) + 
      Math.pow(npc.targetPosition[2] - currentPosition[2], 2)
    );
    
    if (distanceToTarget > 0.1) {
      // Move towards target position
      const direction = new THREE.Vector3(
        npc.targetPosition[0] - currentPosition[0],
        0,
        npc.targetPosition[2] - currentPosition[2]
      ).normalize();
      
      const newPosition: [number, number, number] = [
        currentPosition[0] + direction.x * npc.speed * delta,
        currentPosition[1],
        currentPosition[2] + direction.z * npc.speed * delta
      ];
      setCurrentPosition(newPosition);
      
      // Walking animation only when moving
      if (bodyRef.current) {
        bodyRef.current.position.y = newPosition[1] + Math.sin(time * 8) * 0.05;
        
        // Arm swinging
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.z = Math.sin(time * 8) * 0.5;
          rightArmRef.current.rotation.z = -Math.sin(time * 8) * 0.5;
        }
        
        // Leg movement
        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = Math.sin(time * 8) * 0.3;
          rightLegRef.current.rotation.x = -Math.sin(time * 8) * 0.3;
        }
      }
    } else {
      // Idle animation when not moving
      if (bodyRef.current) {
        bodyRef.current.position.y = currentPosition[1] + Math.sin(time * 2) * 0.02;
      }
    }
  });

  const getMoodColor = () => {
    switch (npc.mood) {
      case 'happy': return '#10b981';
      case 'neutral': return '#f59e0b';
      case 'sad': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getClothingColor = () => {
    // Different clothing colors for each NPC
    const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];
    const index = parseInt(npc.id.replace('npc', '')) - 1;
    return colors[index % colors.length];
  };

  return (
    <group position={currentPosition}>
      {/* Human-like body with torso */}
      <mesh ref={bodyRef} position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.7, 8]} />
        <meshStandardMaterial color={getClothingColor()} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.06, 1.15, 0.12]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.06, 1.15, 0.12]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Left arm */}
      <mesh ref={leftArmRef} position={[-0.25, 0.7, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Right arm */}
      <mesh ref={rightArmRef} position={[0.25, 0.7, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Left leg */}
      <mesh ref={leftLegRef} position={[-0.08, 0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      
      {/* Right leg */}
      <mesh ref={rightLegRef} position={[0.08, 0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.08, -0.15, 0.08]}>
        <boxGeometry args={[0.12, 0.08, 0.15]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0.08, -0.15, 0.08]}>
        <boxGeometry args={[0.12, 0.08, 0.15]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Mood indicator */}
      <Text
        position={[0, 1.6, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {npc.mood === 'happy' ? '😊' : npc.mood === 'neutral' ? '😐' : '😢'}
      </Text>
      
      {/* Name tag */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {npc.name}
      </Text>
    </group>
  );
}

// FPS Camera Component
function FPSCamera({ 
  position, 
  rotation, 
  isActive 
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  isActive: boolean; 
}) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (isActive) {
      camera.position.set(...position);
      camera.rotation.set(...rotation);
    }
  });
  
  return null;
}

function CityEnvironment({ isNight, onBuildingPositionsChange }: { isNight: boolean; onBuildingPositionsChange?: (positions: [number, number, number][]) => void }) {
  // Generate fixed positions for buildings and trees to prevent random movement
  const buildingPositions = useMemo(() => {
    const positions = Array.from({ length: 20 }, (_, i) => [
      (Math.random() - 0.5) * 15,
      1,
      (Math.random() - 0.5) * 15
    ] as [number, number, number]);
    
    // Share positions with parent for collision detection
    if (onBuildingPositionsChange) {
      onBuildingPositionsChange(positions);
    }
    
    return positions;
  }, [onBuildingPositionsChange]);

  const treePositions = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => [
      (Math.random() - 0.5) * 18,
      0,
      (Math.random() - 0.5) * 18
    ] as [number, number, number]
  ), []);

  return (
    <>
      {/* Ground */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={isNight ? "#1f2937" : "#6b7280"} />
      </mesh>
      
      {/* Streets */}
      <mesh position={[0, -0.49, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[2, 20]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0, -0.49, 0]} rotation={[-Math.PI/2, 0, Math.PI/2]}>
        <planeGeometry args={[2, 20]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Buildings */}
      {buildingPositions.map((position, i) => (
        <Box
          key={i}
          position={position}
          args={[2, 3, 2]}
        >
          <meshStandardMaterial color="#4b5563" />
        </Box>
      ))}
      
      {/* Trees */}
      {treePositions.map((position, i) => (
        <group
          key={i}
          position={position}
        >
          <Cylinder args={[0.1, 0.1, 2]} position={[0, 1, 0]}>
            <meshStandardMaterial color="#8b5cf6" />
          </Cylinder>
          <Sphere args={[0.8]} position={[0, 2.5, 0]}>
            <meshStandardMaterial color="#10b981" />
          </Sphere>
        </group>
      ))}
    </>
  );
}

export default function GameModal({ isOpen, onClose, mission, onComplete }: GameModalProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "completed">("intro");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [solarPanels, setSolarPanels] = useState<SolarPanel[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // City Integration State
  const [cityBuildings, setCityBuildings] = useState<CityBuilding[]>([]);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [totalEnergyGenerated, setTotalEnergyGenerated] = useState(0);
  const [totalEnergyDemand, setTotalEnergyDemand] = useState(0);
  const [citySatisfaction, setCitySatisfaction] = useState(50);
  const [carbonReduction, setCarbonReduction] = useState(0);
  const [revenue, setRevenue] = useState(0);
  
  // Visual Effects State
  const [particles, setParticles] = useState<Particle[]>([]);
  const [energyFlows, setEnergyFlows] = useState<EnergyFlow[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [milestoneReached, setMilestoneReached] = useState(false);
  const [celebrationParticles, setCelebrationParticles] = useState<Particle[]>([]);
  
  // 3D Game State
  const [solarLamps, setSolarLamps] = useState<SolarLamp[]>([]);
  const [npcs, setNpcs] = useState<NPCCharacter[]>([]);
  const [player, setPlayer] = useState<PlayerCharacter>({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    isMoving: false,
    selectedLamp: null
  });
  const [isFPSMode, setIsFPSMode] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 1.6, 0]);
  const [cameraRotation, setCameraRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [isNight, setIsNight] = useState(false);
  
  // Shared building positions for collision detection
  const [buildingPositions, setBuildingPositions] = useState<[number, number, number][]>([]);
  
  // Collision detection
  const checkCollision = (newPosition: [number, number, number]) => {
    const playerRadius = 0.5; // Player collision radius
    const buildingSize = 1; // Building collision size (half of building width)
    
    for (const buildingPos of buildingPositions) {
      const distance = Math.sqrt(
        Math.pow(newPosition[0] - buildingPos[0], 2) + 
        Math.pow(newPosition[2] - buildingPos[2], 2)
      );
      
      if (distance < playerRadius + buildingSize) {
        return true; // Collision detected
      }
    }
    return false;
  };
  const [gameStats, setGameStats] = useState({
    energyProduced: 0,
    happiness: 50,
    environment: 0,
    economy: 0
  });

  // Initialize 3D game
  useEffect(() => {
    if (mission && isOpen) {
      // Initialize solar lamps
      const lamps: SolarLamp[] = Array.from({ length: 36 }, (_, i) => ({
        id: `lamp-${i}`,
        position: [
          (i % 6) * 2.5 - 6.25, // X position: 6x6 grid
          0,
          Math.floor(i / 6) * 2.5 - 6.25 // Z position: 6x6 grid
        ] as [number, number, number],
        isPlaced: false,
        isPowered: false,
        energyOutput: 0,
        lightRadius: 3
      }));
      setSolarLamps(lamps);
      
      // Initialize NPCs
      const npcs: NPCCharacter[] = [
        { id: 'npc1', name: 'Sarah', position: [-5, 0, -5], targetPosition: [-5, 0, -5], mood: 'sad', isInLight: false, animationState: 'idle', speed: 1 },
        { id: 'npc2', name: 'Ahmed', position: [5, 0, -5], targetPosition: [5, 0, -5], mood: 'sad', isInLight: false, animationState: 'idle', speed: 1.2 },
        { id: 'npc3', name: 'Maria', position: [-5, 0, 5], targetPosition: [-5, 0, 5], mood: 'sad', isInLight: false, animationState: 'idle', speed: 0.8 },
        { id: 'npc4', name: 'David', position: [5, 0, 5], targetPosition: [5, 0, 5], mood: 'sad', isInLight: false, animationState: 'idle', speed: 1.1 },
        { id: 'npc5', name: 'Lisa', position: [0, 0, 0], targetPosition: [0, 0, 0], mood: 'sad', isInLight: false, animationState: 'idle', speed: 0.9 },
      ];
      setNpcs(npcs);
      
      setGameState("intro");
      setScore(0);
      setTimeLeft(300);
      setGameStats({ energyProduced: 0, happiness: 50, environment: 0, economy: 0 });
    }
  }, [mission, isOpen]);

  // NPC movement system - only when game is playing
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const interval = setInterval(() => {
      setNpcs(prev => prev.map(npc => {
        // Check if NPC has reached their target
        const distanceToTarget = Math.sqrt(
          Math.pow(npc.targetPosition[0] - npc.position[0], 2) + 
          Math.pow(npc.targetPosition[2] - npc.position[2], 2)
        );
        
        if (distanceToTarget < 0.5) {
          const newTarget = [
            Math.random() * 10 - 5, // Random X between -5 and 5
            0,
            Math.random() * 10 - 5   // Random Z between -5 and 5
          ] as [number, number, number];
          // Set new random target
          return {
            ...npc,
            targetPosition: newTarget,
            animationState: 'walking' as const
          };
        }
        return npc;
      }));
    }, 5000); // Change target every 5 seconds (slower)
    
    return () => clearInterval(interval);
  }, [gameState]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (gameState === "playing" && !isPaused && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, isPaused, timeLeft]);

  // Auto-complete when time runs out
  useEffect(() => {
    if (timeLeft === 0 && gameState === "playing") {
      setGameState("completed");
    }
  }, [timeLeft, gameState]);

  // Particle effects
  const createParticles = (x: number, y: number, type: 'sparkle' | 'energy' | 'confetti') => {
    const colors = {
      sparkle: ['#fbbf24', '#f59e0b', '#d97706'],
      energy: ['#3b82f6', '#1d4ed8', '#1e40af'],
      confetti: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
    };
    
    const newParticles = Array.from({ length: type === 'confetti' ? 25 : 15 }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      type,
      color: colors[type][Math.floor(Math.random() * colors[type].length)],
      life: 1
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 2000);
  };

  const createEnergyFlow = (fromX: number, fromY: number, toX: number, toY: number) => {
    const flow: EnergyFlow = {
      id: `flow-${Date.now()}`,
      fromX,
      fromY,
      toX,
      toY,
      intensity: 1
    };
    
    setEnergyFlows(prev => [...prev, flow]);
    
    setTimeout(() => {
      setEnergyFlows(prev => prev.filter(f => f.id !== flow.id));
    }, 1000);
  };

  // Keyboard controls for player movement - FPS mode
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle movement keys when game is playing and not in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const moveSpeed = 0.1;
      const rotationSpeed = 0.05;
      const newPosition: [number, number, number] = [...player.position];
      const newRotation: [number, number, number] = [...player.rotation];
      let isMoving = false;
      let shouldPreventDefault = false;
      
      if (isFPSMode) {
        // FPS movement - relative to camera direction
        switch (event.key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            // Forward - move in the direction the player is facing
            newPosition[0] += Math.sin(player.rotation[1]) * moveSpeed;
            newPosition[2] += Math.cos(player.rotation[1]) * moveSpeed;
            isMoving = true;
            shouldPreventDefault = true;
            break;
          case 's':
          case 'arrowdown':
            // Backward - move opposite to the direction the player is facing
            newPosition[0] -= Math.sin(player.rotation[1]) * moveSpeed;
            newPosition[2] -= Math.cos(player.rotation[1]) * moveSpeed;
            isMoving = true;
            shouldPreventDefault = true;
            break;
          case 'a':
          case 'arrowleft':
            // Left - move perpendicular to the left of the player's facing direction
            newPosition[0] -= Math.cos(player.rotation[1]) * moveSpeed;
            newPosition[2] += Math.sin(player.rotation[1]) * moveSpeed;
            isMoving = true;
            shouldPreventDefault = true;
            break;
          case 'd':
          case 'arrowright':
            // Right - move perpendicular to the right of the player's facing direction
            newPosition[0] += Math.cos(player.rotation[1]) * moveSpeed;
            newPosition[2] -= Math.sin(player.rotation[1]) * moveSpeed;
            isMoving = true;
            shouldPreventDefault = true;
            break;
          case 'q':
            newRotation[1] -= rotationSpeed;
            shouldPreventDefault = true;
            break;
          case 'e':
            newRotation[1] += rotationSpeed;
            shouldPreventDefault = true;
            break;
        }
      } else {
        // Top-down movement - standard WASD
        switch (event.key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            // Forward - move up (negative Z)
            newPosition[2] -= moveSpeed;
            isMoving = true;
            shouldPreventDefault = true;
            break;
          case 's':
          case 'arrowdown':
            // Backward - move down (positive Z)
            newPosition[2] += moveSpeed;
            isMoving = true;
            shouldPreventDefault = true;
            break;
          case 'a':
          case 'arrowleft':
            // Left - move left (negative X)
            newPosition[0] -= moveSpeed;
            isMoving = true;
            shouldPreventDefault = true;
            break;
          case 'd':
          case 'arrowright':
            // Right - move right (positive X)
            newPosition[0] += moveSpeed;
            isMoving = true;
            shouldPreventDefault = true;
            break;
        }
      }
      
      if (shouldPreventDefault) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
      
      // Check collision before moving
      if (isMoving && !checkCollision(newPosition)) {
        setPlayer(prev => ({
          ...prev,
          position: newPosition,
          rotation: newRotation,
          isMoving
        }));
        
        // Update camera position in FPS mode
        if (isFPSMode) {
          setCameraPosition([newPosition[0], newPosition[1] + 1.6, newPosition[2]]);
          setCameraRotation([0, newRotation[1], 0]);
        }
      } else if (newRotation !== player.rotation) {
        // Allow rotation even if movement is blocked
        setPlayer(prev => ({
          ...prev,
          rotation: newRotation
        }));
        
        if (isFPSMode) {
          setCameraRotation([0, newRotation[1], 0]);
        }
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(event.key.toLowerCase())) {
        setPlayer(prev => ({ ...prev, isMoving: false }));
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    };
    
    // Add event listeners with capture phase to intercept early
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('keyup', handleKeyUp, { capture: true });
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, [gameState, player.position, player.rotation, isFPSMode]);

  const handleLampPlace = (lamp: SolarLamp) => {
    if (gameState !== "playing") return;
    
    const isPlacing = !lamp.isPlaced;
    
    // Start NPCs moving when first lamp is placed
    if (isPlacing && solarLamps.filter(l => l.isPlaced).length === 0) {
      setNpcs(prev => prev.map(npc => ({
        ...npc,
        targetPosition: [
          Math.random() * 10 - 5, // Random X between -5 and 5
          0,
          Math.random() * 10 - 5  // Random Z between -5 and 5
        ] as [number, number, number],
        animationState: 'walking' as const
      })));
    }
    
    setSolarLamps(prev => 
      prev.map(l => 
        l.id === lamp.id 
          ? { ...l, isPlaced: isPlacing, isPowered: isPlacing, energyOutput: isPlacing ? 50 : 0 }
          : l
      )
    );
    
    // Update game stats
    const newEnergyProduced = solarLamps
      .filter(l => l.isPlaced)
      .reduce((sum, l) => sum + l.energyOutput, 0) + (isPlacing ? 50 : 0);
    
    const newHappiness = Math.min(50 + (newEnergyProduced / 10), 100);
    const newEnvironment = newEnergyProduced * 0.5;
    const newEconomy = newEnergyProduced * 0.1;
    
    setGameStats({
      energyProduced: newEnergyProduced,
      happiness: newHappiness,
      environment: newEnvironment,
      economy: newEconomy
    });
    
    // Update NPCs based on lighting
    setNpcs(prev => 
      prev.map(npc => {
        const isInLight = solarLamps.some(lamp => 
          lamp.isPlaced && lamp.isPowered &&
          Math.sqrt(
            Math.pow(npc.position[0] - lamp.position[0], 2) + 
            Math.pow(npc.position[2] - lamp.position[2], 2)
          ) <= lamp.lightRadius
        );
        
        return {
          ...npc,
          isInLight,
          mood: isInLight ? 'happy' : newHappiness > 70 ? 'neutral' : 'sad',
          animationState: isInLight ? 'celebrating' : 'walking'
        };
      })
    );
    
    // Create visual effects
    if (isPlacing) {
      createParticles(lamp.position[0] * 10 + 50, lamp.position[2] * 10 + 50, 'sparkle');
    }
    
    setScore(newEnergyProduced);
  };

  const startGame = () => {
    setGameState("playing");
    setIsPaused(false);
    
    // Keep NPCs idle initially - they'll start moving after first lamp placement
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetGame = () => {
    setSolarPanels(prev => prev.map(p => ({ ...p, isPlaced: false })));
    setScore(0);
    setTimeLeft(300);
    setGameState("intro");
  };

  const completeGame = () => {
    if (mission) {
      onComplete(mission.id);
    }
    onClose();
  };

  // Trigger confetti on completion
  useEffect(() => {
    if (gameState === "completed") {
      setShowConfetti(true);
      // Create celebration particles
      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          createParticles(Math.random() * 400, Math.random() * 300, 'confetti');
        }, i * 100);
      }
    }
  }, [gameState]);

  if (!isOpen || !mission) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ overflow: 'hidden' }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl h-[80vh] mx-4 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">{mission.missionTitle}</h2>
              <p className="text-white/70 text-sm">{mission.name}, {mission.country}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Game Content */}
          <div className="flex-1 p-4 overflow-y-auto min-h-0">
            {gameState === "intro" && (
              <div className="text-center space-y-6 h-full flex flex-col justify-center">
                <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                  <span className="text-3xl">☀️</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4 font-orbitron">Solar Revolution</h3>
                  <p className="text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
                    {mission.missionDescription}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-white font-orbitron">5 min</div>
                    <div className="text-white/60 text-sm">Time Limit</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-white font-orbitron">64</div>
                    <div className="text-white/60 text-sm">Solar Panels</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-white font-orbitron">Max</div>
                    <div className="text-white/60 text-sm">Efficiency</div>
                  </div>
                </div>
                <Button
                  onClick={startGame}
                  className="bg-white text-black hover:bg-white/90 font-bold px-8 py-3 text-lg rounded-lg transition-all duration-300"
                >
                  Start Mission
                </Button>
              </div>
            )}

            {gameState === "playing" && (
              <div className="flex flex-col h-full relative">
                {/* Simplified HUD Stats */}
                <motion.div 
                  className="absolute top-4 left-4 right-4 z-20 grid grid-cols-4 gap-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white/5 rounded-xl p-3 border border-white/20 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-bold">ENERGY</span>
                    </div>
                    <div className="text-white font-bold text-lg font-orbitron">
                      {Math.round(gameStats.energyProduced)} MW
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-3 border border-white/20 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-bold">HAPPINESS</span>
                    </div>
                    <div className="text-white font-bold text-lg font-orbitron">
                      {Math.round(gameStats.happiness)}%
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-3 border border-white/20 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Leaf className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-bold">ENVIRONMENT</span>
                    </div>
                    <div className="text-white font-bold text-lg font-orbitron">
                      {Math.round(gameStats.environment)} tons
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-3 border border-white/20 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-bold">ECONOMY</span>
                    </div>
                    <div className="text-white font-bold text-lg font-orbitron">
                      ${Math.round(gameStats.economy)}
                    </div>
                  </div>
                </motion.div>

                {/* 3D Game Scene */}
                <div 
                  className="flex-1 relative overflow-hidden rounded-xl bg-black"
                >
                  <Canvas
                    camera={{ 
                      position: isFPSMode ? cameraPosition : [10, 8, 10], 
                      fov: isFPSMode ? 75 : 60 
                    }}
                    shadows
                  >
                    {/* Lighting */}
                    <ambientLight intensity={isNight ? 0.3 : 0.6} />
                    <directionalLight 
                      position={[10, 10, 5]} 
                      intensity={isNight ? 0.5 : 1.2}
                      castShadow
                    />
                    <pointLight position={[0, 5, 0]} intensity={isNight ? 0.8 : 0.3} color="#fbbf24" />
                    
                    {/* FPS Camera */}
                    {isFPSMode && (
                      <FPSCamera 
                        position={cameraPosition}
                        rotation={cameraRotation}
                        isActive={true}
                      />
                    )}
                    
                    {/* Camera Controls */}
                    {!isFPSMode && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />}
                    
                    {/* City Environment */}
                    <CityEnvironment 
                      isNight={isNight} 
                      onBuildingPositionsChange={setBuildingPositions}
                    />
                    
                    {/* Solar Lamps */}
                    {solarLamps.map((lamp) => (
                      <SolarLampComponent 
                        key={lamp.id} 
                        lamp={lamp} 
                        onPlace={handleLampPlace}
                      />
                    ))}
                    
                    {/* NPCs - Simplified */}
                    {npcs.slice(0, 3).map((npc) => (
                      <NPCCharacter 
                        key={npc.id} 
                        npc={npc} 
                        gameState={gameState}
                        onMoodChange={(id, mood) => {
                          setNpcs(prev => prev.map(n => n.id === id ? { ...n, mood } : n));
                        }}
                      />
                    ))}
                    
                    {/* Player Character - Hidden in FPS mode */}
                    {!isFPSMode && (
                      <PlayerCharacter 
                        position={player.position}
                        rotation={player.rotation}
                        isMoving={player.isMoving}
                      />
                    )}
                    
                    {/* Particles */}
                    {particles.map((particle) => (
                      <mesh
                        key={particle.id}
                        position={[particle.x / 10, particle.y / 10, 0]}
                      >
                        <sphereGeometry args={[0.1]} />
                        <meshBasicMaterial color={particle.color} />
                      </mesh>
                    ))}
                  </Canvas>
                </div>

                {/* Game Controls */}
                <motion.div 
                  className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center gap-6">
                    <motion.div 
                      className="text-center bg-black/20 backdrop-blur-xl rounded-xl p-3 border border-white/20"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <div className="text-lg font-bold text-red-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-white/60 text-xs">Time</div>
                    </motion.div>
                    <motion.div 
                      className="text-center bg-black/20 backdrop-blur-xl rounded-xl p-3 border border-white/20"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <div className="text-lg font-bold text-green-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {solarLamps.filter(l => l.isPlaced).length}/16
                      </div>
                      <div className="text-white/60 text-xs">Lamps</div>
                    </motion.div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={togglePause}
                      className="text-white border-white/30 hover:bg-white/10 backdrop-blur-xl bg-black/20"
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetGame}
                      className="text-white border-white/30 hover:bg-white/10 backdrop-blur-xl bg-black/20"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>

                {/* FPS Toggle Button */}
                <motion.div 
                  className="absolute top-4 right-4 z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    onClick={() => setIsFPSMode(!isFPSMode)}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      isFPSMode 
                        ? 'bg-white/10 border-white/30 text-white hover:bg-white/20' 
                        : 'bg-white/5 border-white/20 text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {isFPSMode ? '🎮 FPS Mode' : '👁️ Top View'}
                  </Button>
                </motion.div>

                {/* Instructions */}
                <motion.div 
                  className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20"
                  animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20 text-white text-sm">
                    🎮 WASD to move • Click lamps to place • {isFPSMode ? 'Q/E to turn' : 'Mouse to look around'}
                  </div>
                </motion.div>
              </div>
            )}

            {gameState === "completed" && (
              <div className="text-center space-y-6 h-full flex flex-col justify-center relative overflow-hidden">
                {/* Victory Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Animated Background Gradient */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5"
                    animate={{
                      background: [
                        'linear-gradient(45deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                        'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))',
                        'linear-gradient(45deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  {/* Floating Particles */}
                  {Array.from({ length: 50 }, (_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-1 h-1 bg-white/30 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        x: [0, (Math.random() - 0.5) * 40],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        delay: Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>

                {/* Confetti Background */}
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 300 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          backgroundColor: ['#ffffff', '#e5e5e5', '#cccccc', '#b3b3b3', '#999999', '#808080', '#666666', '#4d4d4d'][Math.floor(Math.random() * 8)]
                        }}
                        animate={{
                          y: [0, -150],
                          x: [0, (Math.random() - 0.5) * 300],
                          rotate: [0, 720],
                          opacity: [1, 0],
                          scale: [0.5, 1.5, 0]
                        }}
                        transition={{
                          duration: 4,
                          delay: Math.random() * 3,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Success Icon */}
                <motion.div 
                  className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>
                </motion.div>
                
                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.h3 
                    className="text-4xl font-bold text-white mb-4"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      textShadow: [
                        '0 0 20px rgba(34, 197, 94, 0.5)',
                        '0 0 30px rgba(34, 197, 94, 0.8)',
                        '0 0 20px rgba(34, 197, 94, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎉 Mission Accomplished! 🎉
                  </motion.h3>
                  <motion.p 
                    className="text-white/90 text-xl mb-6"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    You've transformed <span className="font-bold text-green-400">{mission.name}</span> into a sustainable city! 
                  </motion.p>
                  <motion.div 
                    className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="text-2xl font-bold text-blue-400">{solarLamps.filter(l => l.isPlaced).length}/16</div>
                      <div className="text-white/70 text-sm">Solar Lamps Placed</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="text-2xl font-bold text-green-400">{Math.round(gameStats.happiness)}%</div>
                      <div className="text-white/70 text-sm">City Happiness</div>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Professional Results Dashboard */}
                <motion.div 
                  className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-400/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-bold">Energy</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">{Math.round(totalEnergyGenerated)} MW</div>
                    <div className="text-white/60 text-sm">Clean Energy Generated</div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-400/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-bold">Happiness</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">{Math.round(citySatisfaction)}%</div>
                    <div className="text-white/60 text-sm">City Satisfaction</div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-400/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Leaf className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Environment</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{Math.round(carbonReduction)} tons</div>
                    <div className="text-white/60 text-sm">CO2 Emissions Reduced</div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl border border-yellow-400/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">Economy</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">${Math.round(revenue)}</div>
                    <div className="text-white/60 text-sm">Revenue Generated</div>
                  </motion.div>
                </motion.div>
                
                {/* Citizens Celebration */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.h4 
                    className="text-xl font-bold text-white mb-4"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎊 Citizens Celebrating! 🎊
                  </motion.h4>
                  <div className="flex justify-center gap-4 flex-wrap">
                    {npcs.map((npc, index) => (
                      <motion.div
                        key={npc.id}
                        className="relative"
                        animate={{ 
                          y: [0, -20, 0],
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          delay: index * 0.3,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center text-2xl border-2 border-green-400/30 shadow-lg">
                          😊
                        </div>
                        <motion.div 
                          className="absolute -top-2 -right-2 text-lg"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            rotate: [0, 15, -15, 0]
                          }}
                          transition={{ 
                            duration: 1,
                            repeat: Infinity,
                            delay: index * 0.2
                          }}
                        >
                          🎉
                        </motion.div>
                        <div className="text-center mt-2">
                          <div className="text-white font-semibold text-sm">{npc.name}</div>
                          <div className="text-green-400 text-xs">Happy!</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Achievement Badge */}
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl p-6 border border-yellow-400/30 backdrop-blur-sm mb-6 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {/* Animated background sparkles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 20 }, (_, i) => (
                      <motion.div
                        key={`sparkle-${i}`}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 2,
                          delay: Math.random() * 2,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      />
                    ))}
                  </div>
                  
                  <motion.div 
                    className="flex items-center justify-center gap-3 mb-3"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Award className="w-8 h-8 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-xl">🏆 Achievement Unlocked! 🏆</span>
                  </motion.div>
                  <motion.div 
                    className="text-white font-bold text-xl mb-2"
                    animate={{ 
                      textShadow: [
                        '0 0 10px rgba(251, 191, 36, 0.5)',
                        '0 0 20px rgba(251, 191, 36, 0.8)',
                        '0 0 10px rgba(251, 191, 36, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Solar City Master
                  </motion.div>
                  <div className="text-white/80 text-base">Successfully powered a city with clean energy</div>
                  
                  {/* Additional achievements */}
                  <motion.div 
                    className="mt-4 grid grid-cols-2 gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-green-400 font-bold">🌱 Eco Hero</div>
                      <div className="text-white/70 text-xs">Reduced CO2</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-blue-400 font-bold">⚡ Energy Master</div>
                      <div className="text-white/70 text-xs">Clean Power</div>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Complete Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg blur-lg opacity-50"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={completeGame}
                      className="relative bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold px-10 py-4 text-xl shadow-2xl shadow-green-500/50 border-2 border-green-300/50"
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mr-3"
                      >
                        <Star className="w-6 h-6" />
                      </motion.div>
                      Complete Mission
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="ml-3"
                      >
                        🎉
                      </motion.div>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
