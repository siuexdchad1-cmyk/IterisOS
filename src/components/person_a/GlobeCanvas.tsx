"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { HotspotTask } from "@/types";

interface GlobeCanvasProps {
  hotspots: HotspotTask[];
  activeHotspot: HotspotTask | null;
  onSelectHotspot: (hotspot: HotspotTask | null) => void;
}

// Convert lat/lng to 3D sphere coordinates
function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

function RotatingGlobe({
  hotspots,
  activeHotspot,
  onSelectHotspot,
}: GlobeCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Tab visibility detection to pause animation when tab hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Auto rotate globe slowly
  useFrame((_, delta) => {
    if (groupRef.current && isTabVisible) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const globeRadius = 2.0;

  return (
    <group ref={groupRef}>
      {/* Primary Globe Wireframe Mesh */}
      <mesh>
        <sphereGeometry args={[globeRadius, 36, 36]} />
        <meshStandardMaterial
          color="#0d1527"
          wireframe={false}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Wireframe Grid Layer */}
      <mesh scale={[1.002, 1.002, 1.002]}>
        <sphereGeometry args={[globeRadius, 24, 24]} />
        <meshBasicMaterial
          color="#5EE0FF"
          wireframe={true}
          transparent={true}
          opacity={0.12}
        />
      </mesh>

      {/* Glowing Outer Atmosphere Ring */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[globeRadius, 32, 32]} />
        <meshBasicMaterial
          color="#5EE0FF"
          transparent={true}
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Hotspots */}
      {hotspots.map((hs) => {
        const lat = hs.lat ?? 0;
        const lng = hs.lng ?? 0;
        const pos = latLngToVector3(lat, lng, globeRadius + 0.05);
        const isActive = activeHotspot?.taskId === hs.taskId;

        return (
          <group key={hs.taskId} position={pos}>
            {/* 3D Glowing Marker Mesh */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(isActive ? null : hs);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "default";
              }}
            >
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial
                color={isActive ? "#3DDC84" : "#5EE0FF"}
              />
            </mesh>

            {/* 3D HTML Pulsing Hotspot Marker */}
            <Html distanceFactor={10} zIndexRange={[100, 0]}>
              <div
                onClick={() => onSelectHotspot(isActive ? null : hs)}
                className="relative flex items-center justify-center cursor-pointer group"
              >
                <span
                  className={`animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-75 ${
                    isActive ? "bg-[#3DDC84]" : "bg-[#5EE0FF]"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isActive ? "bg-[#3DDC84]" : "bg-[#5EE0FF]"
                  } border border-white/50 shadow-[0_0_12px_#5EE0FF]`}
                />
                <span className="ml-2 font-mono text-[10px] whitespace-nowrap px-1.5 py-0.5 rounded bg-[#0A0D14]/80 text-gray-200 border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                  {hs.city}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function GlobeCanvas(props: GlobeCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 1.5]}
      className="w-full h-full"
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#5EE0FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#3DDC84" />
      <RotatingGlobe {...props} />
    </Canvas>
  );
}
