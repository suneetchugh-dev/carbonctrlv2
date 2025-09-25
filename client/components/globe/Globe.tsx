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

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });

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
        <meshStandardMaterial color={hovered ? "#ffffff" : "#aaaaaa"} emissive={hovered ? "#ffffff" : "#000000"} emissiveIntensity={hovered ? 1 : 0} />
      </mesh>
      {hovered && (
        <Html distanceFactor={10} position={[0.05, 0.05, 0]}>
          <div className="px-2 py-1 text-xs rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.35)]">
            {school.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Globe({
  onSelectSchool,
  textureUrl = "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
}: {
  onSelectSchool?: (s: School) => void;
  textureUrl?: string;
}) {
  const [schools, setSchools] = useState<School[]>([]);

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

  const markers = useMemo(() => {
    const radius = 2.02; // slightly above surface
    return schools.map((s) => ({ school: s, pos: latLonToVector3(s.lat, s.lon, radius) }));
  }, [schools]);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <Stars radius={50} depth={20} count={2000} factor={2} saturation={0} fade speed={1} />
      <Earth textureUrl={textureUrl} />
      {markers.map(({ school, pos }) => (
        <Marker key={school.id} position={pos} school={school} onClick={(s) => onSelectSchool?.(s)} />
      ))}
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.25} />
    </Canvas>
  );
}
