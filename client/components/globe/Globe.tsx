import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import { TextureLoader, Vector3 } from "three";
import { useEffect, useMemo, useRef, useState } from "react";

export type School = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  details?: string;
};

export type MissionCity = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  missionTitle: string;
  missionDescription: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  isUnlocked: boolean;
  isCompleted: boolean;
};

function latLonToVector3(lat: number, lon: number, radius: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new Vector3(x, y, z);
}

function Earth({ textureUrl }: { textureUrl: string }) {
  const earthRef = useRef<any>(null);
  const texture = useLoader(TextureLoader, textureUrl);

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={1} metalness={0} />
    </mesh>
  );
}

function Marker({
  position,
  school,
  onClick,
}: {
  position: Vector3;
  school: School;
  onClick: (s: School) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position.toArray() as any}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick(school);
        }}
      >
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : "#aaaaaa"}
          emissive={hovered ? "#ffffff" : "#000000"}
          emissiveIntensity={hovered ? 1 : 0}
        />
      </mesh>
      {hovered && (
        <Html distanceFactor={10} position={[0.05, 0.05, 0]} style={{ pointerEvents: "none" }}>
          <div className="px-2 py-1 text-xs rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.35)]">
            {school.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function MissionMarker({
  position,
  city,
  onClick,
}: {
  position: Vector3;
  city: MissionCity;
  onClick: (c: MissionCity) => void;
}) {
  const [hovered, setHovered] = useState(false);
  
  const getMarkerColor = () => {
    if (city.isCompleted) return "#10b981"; // green
    if (city.isUnlocked) return "#f59e0b"; // amber
    return "#6b7280"; // gray
  };

  const getMarkerEmissive = () => {
    if (city.isCompleted) return "#10b981";
    if (city.isUnlocked) return "#f59e0b";
    return "#6b7280";
  };

  return (
    <group position={position.toArray() as any}>
      {/* Google Maps style teardrop pin */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (city.isUnlocked) onClick(city);
        }}
      >
        {/* Teardrop pin body */}
        <coneGeometry args={[0.03, 0.08, 8]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : getMarkerColor()}
          emissive={hovered ? "#ffffff" : getMarkerEmissive()}
          emissiveIntensity={hovered ? 1.2 : 0.6}
        />
      </mesh>
      
      {/* White center dot */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.5}
        />
      </mesh>
      
      {/* Small shadow */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.02, 0.03, 8]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.4}
        />
      </mesh>
      
      {hovered && (
        <Html distanceFactor={10} position={[0.05, 0.05, 0]} style={{ pointerEvents: "none" }}>
          <div className="px-3 py-2 text-[7px] rounded-md bg-black/95 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] max-w-[120px]">
            <div className="font-semibold text-[7px]">{city.name}, {city.country}</div>
            <div className="font-bold text-[7px] mt-1">{city.missionTitle}</div>
            <div className="text-[6px] text-white/60 mt-1 leading-tight">{city.missionDescription}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-1.5 py-0.5 rounded text-[6px] bg-white/20">
                {city.difficulty}
              </span>
              <span className="text-[6px] text-white/50">{city.estimatedTime}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Globe({
  onSelectSchool,
  onSelectMission,
  textureUrl = "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  showMarkers = true,
  showMissions = true,
}: {
  onSelectSchool?: (s: School) => void;
  onSelectMission?: (c: MissionCity) => void;
  textureUrl?: string;
  showMarkers?: boolean;
  showMissions?: boolean;
}) {
  const [schools, setSchools] = useState<School[]>([]);
  const [missionCities, setMissionCities] = useState<MissionCity[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const resumeTimeoutRef = useRef<number | null>(null);
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data/schools.json");
        const data = (await res.json()) as School[];
        setSchools(data);
      } catch (err) {
        console.error("Failed to load schools.json", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    // Initialize mission cities data
    const cities: MissionCity[] = [
      {
        id: "delhi",
        name: "Delhi",
        country: "India",
        lat: 28.6139,
        lon: 77.2090,
        missionTitle: "Solar Revolution",
        missionDescription: "Build India's renewable energy future by placing solar panels strategically",
        difficulty: "Easy",
        estimatedTime: "5 min",
        isUnlocked: true,
        isCompleted: false,
      },
      {
        id: "beijing",
        name: "Beijing",
        country: "China",
        lat: 39.9042,
        lon: 116.4074,
        missionTitle: "Carbon Footprint Simulator",
        missionDescription: "Manage a city's carbon emissions through smart policy decisions",
        difficulty: "Medium",
        estimatedTime: "7 min",
        isUnlocked: false,
        isCompleted: false,
      },
      {
        id: "moscow",
        name: "Moscow",
        country: "Russia",
        lat: 55.7558,
        lon: 37.6176,
        missionTitle: "Arctic Ecosystem Protector",
        missionDescription: "Protect Arctic species from climate change threats",
        difficulty: "Medium",
        estimatedTime: "8 min",
        isUnlocked: false,
        isCompleted: false,
      },
      {
        id: "berlin",
        name: "Berlin",
        country: "Germany",
        lat: 52.5200,
        lon: 13.4050,
        missionTitle: "Green City Planner",
        missionDescription: "Design sustainable urban infrastructure and renewable energy systems",
        difficulty: "Medium",
        estimatedTime: "7 min",
        isUnlocked: false,
        isCompleted: false,
      },
      {
        id: "los-angeles",
        name: "Los Angeles",
        country: "USA",
        lat: 34.0522,
        lon: -118.2437,
        missionTitle: "Electric Vehicle Revolution",
        missionDescription: "Transform transportation with electric vehicles and charging infrastructure",
        difficulty: "Hard",
        estimatedTime: "9 min",
        isUnlocked: false,
        isCompleted: false,
      },
      {
        id: "new-york",
        name: "New York",
        country: "USA",
        lat: 40.7128,
        lon: -74.0060,
        missionTitle: "Smart Grid Manager",
        missionDescription: "Optimize energy distribution and reduce carbon footprint in the city",
        difficulty: "Hard",
        estimatedTime: "10 min",
        isUnlocked: false,
        isCompleted: false,
      },
      {
        id: "tel-aviv",
        name: "Tel Aviv",
        country: "Israel",
        lat: 32.0853,
        lon: 34.7818,
        missionTitle: "Water Innovation Hub",
        missionDescription: "Develop advanced water conservation and desalination technologies",
        difficulty: "Medium",
        estimatedTime: "8 min",
        isUnlocked: false,
        isCompleted: false,
      },
      {
        id: "cairo",
        name: "Cairo",
        country: "Egypt",
        lat: 30.0444,
        lon: 31.2357,
        missionTitle: "Desert Solar Farm",
        missionDescription: "Build massive solar installations in the Sahara desert",
        difficulty: "Easy",
        estimatedTime: "6 min",
        isUnlocked: false,
        isCompleted: false,
      },
      {
        id: "tunis",
        name: "Tunis",
        country: "Tunisia",
        lat: 36.8065,
        lon: 10.1815,
        missionTitle: "Mediterranean Conservation",
        missionDescription: "Protect marine ecosystems and coastal environments",
        difficulty: "Medium",
        estimatedTime: "7 min",
        isUnlocked: false,
        isCompleted: false,
      },
      {
        id: "buenos-aires",
        name: "Buenos Aires",
        country: "Argentina",
        lat: -34.6118,
        lon: -58.3960,
        missionTitle: "Urban Green Transformation",
        missionDescription: "Convert the city into a sustainable urban ecosystem with green spaces and clean energy",
        difficulty: "Medium",
        estimatedTime: "8 min",
        isUnlocked: false,
        isCompleted: false,
      },
      {
        id: "toronto",
        name: "Toronto",
        country: "Canada",
        lat: 43.6532,
        lon: -79.3832,
        missionTitle: "Climate Resilience Builder",
        missionDescription: "Develop infrastructure to withstand extreme weather and climate change impacts",
        difficulty: "Hard",
        estimatedTime: "9 min",
        isUnlocked: false,
        isCompleted: false,
      },
    ];
    setMissionCities(cities);
  }, []);

  const markers = useMemo(() => {
    const radius = 2.02; // slightly above surface
    return schools.map((s) => ({
      school: s,
      pos: latLonToVector3(s.lat, s.lon, radius),
    }));
  }, [schools]);

  const missionMarkers = useMemo(() => {
    const radius = 2.05; // slightly above school markers
    return missionCities.map((c) => ({
      city: c,
      pos: latLonToVector3(c.lat, c.lon, radius),
    }));
  }, [missionCities]);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ pointerEvents: "auto", touchAction: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        onCreated={({ gl }) => {
          // Ensure canvas can receive pointer events and touch gestures don't scroll the page
          gl.domElement.style.pointerEvents = 'auto';
          gl.domElement.style.touchAction = 'none';

          if (!hasLoggedRef.current) {
            console.log('[Globe] Canvas created', {
              pointerEvents: gl.domElement.style.pointerEvents,
              touchAction: (gl.domElement.style as any).touchAction,
            });
            hasLoggedRef.current = true;
          }

          const handlePointerDown = (e: PointerEvent) => {
            console.log('[Globe] pointerdown on canvas', { x: e.clientX, y: e.clientY, button: e.button });
          };
          const handlePointerUp = (e: PointerEvent) => {
            console.log('[Globe] pointerup on canvas', { x: e.clientX, y: e.clientY, button: e.button });
          };
          const handleWheel = (e: WheelEvent) => {
            console.log('[Globe] wheel on canvas', { deltaY: e.deltaY });
          };

          gl.domElement.addEventListener('pointerdown', handlePointerDown);
          gl.domElement.addEventListener('pointerup', handlePointerUp);
          gl.domElement.addEventListener('wheel', handleWheel, { passive: true });

          // Cleanup listeners on hot-reload/unmount
          return () => {
            gl.domElement.removeEventListener('pointerdown', handlePointerDown);
            gl.domElement.removeEventListener('pointerup', handlePointerUp);
            gl.domElement.removeEventListener('wheel', handleWheel as any);
          };
        }}
      >
        <ambientLight intensity={1.0} />
        <hemisphereLight intensity={0.6} groundColor={0x222222 as any} color={0xffffff as any} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <directionalLight position={[-5, -2, -3]} intensity={0.4} />
        <Stars
          radius={120}
          depth={80}
          count={6000}
          factor={3}
          saturation={0}
          fade
          speed={0.4}
        />
        <Earth textureUrl={textureUrl} />
        {showMarkers && markers.map(({ school, pos }) => (
          <Marker
            key={school.id}
            position={pos}
            school={school}
            onClick={(s) => onSelectSchool?.(s)}
          />
        ))}
        {showMissions && missionMarkers.map(({ city, pos }) => (
          <MissionMarker
            key={city.id}
            position={pos}
            city={city}
            onClick={(c) => onSelectMission?.(c)}
          />
        ))}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate
          makeDefault
          zoomSpeed={0.8}
          rotateSpeed={0.8}
          minDistance={6.5}
          maxDistance={6.5}
          autoRotate={autoRotate}
          autoRotateSpeed={0.25}
          enableDamping
          dampingFactor={0.05}
          onStart={() => {
            if (resumeTimeoutRef.current) {
              window.clearTimeout(resumeTimeoutRef.current);
              resumeTimeoutRef.current = null;
            }
            console.log('[Globe] OrbitControls interaction start → pause autoRotate');
            setAutoRotate(false);
          }}
          onEnd={() => {
            if (resumeTimeoutRef.current) {
              window.clearTimeout(resumeTimeoutRef.current);
            }
            console.log('[Globe] OrbitControls interaction end → schedule autoRotate resume');
            resumeTimeoutRef.current = window.setTimeout(() => {
              console.log('[Globe] Resuming autoRotate');
              setAutoRotate(true);
              resumeTimeoutRef.current = null;
            }, 1200);
          }}
        />
      </Canvas>
    </div>
  );
}
