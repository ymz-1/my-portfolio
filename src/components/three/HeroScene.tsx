"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { useMediaQuery } from "@/lib/useMediaQuery";

function LowPolyCore() {
  const meshRef = useRef<Mesh>(null);
  const wireRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.18;
      meshRef.current.rotation.y = t * 0.24;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.1;
      wireRef.current.rotation.y = -t * 0.14;
    }
  });

  return (
    <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.3}>
      {/* faceted low-poly core */}
      <Icosahedron ref={meshRef} args={[1.3, 1]}>
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#8b5cf6"
          emissiveIntensity={0.35}
          roughness={0.45}
          metalness={0.35}
          flatShading
        />
      </Icosahedron>
      {/* wireframe shell */}
      <Icosahedron ref={wireRef} args={[1.7, 1]}>
        <meshBasicMaterial
          color="#c4b5fd"
          wireframe
          transparent
          opacity={0.22}
        />
      </Icosahedron>
    </Float>
  );
}

function FloatingCubes({ count }: { count: number }) {
  const groupRef = useRef<Group>(null);
  const palette = ["#a78bfa", "#c4b5fd", "#7c7a90"];
  const cubes = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = 2.7 + (i % 3) * 0.4;
    return {
      pos: [
        Math.cos(angle) * radius,
        Math.sin(angle * 1.6) * 1.7,
        Math.sin(angle) * radius,
      ] as const,
      size: 0.12 + (i % 4) * 0.04,
      color: palette[i % palette.length],
      rot: (i % 5) * 0.4,
    };
  });

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.07;
    }
  });

  return (
    <group ref={groupRef}>
      {cubes.map((c, i) => (
        <mesh key={i} position={[c.pos[0], c.pos[1], c.pos[2]]} rotation={[c.rot, c.rot, 0]}>
          <boxGeometry args={[c.size, c.size, c.size]} />
          <meshStandardMaterial
            color={c.color}
            emissive={c.color}
            emissiveIntensity={0.25}
            roughness={0.5}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={isMobile ? [1, 1.25] : [1, 1.8]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: isMobile ? "low-power" : "high-performance" }}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 3, 3]} intensity={1.3} color="#a78bfa" />
      <pointLight position={[-4, -2, -2]} intensity={2} color="#8b5cf6" />
      <pointLight position={[4, 2, 2]} intensity={1.4} color="#c4b5fd" />
      <Suspense fallback={null}>
        <LowPolyCore />
        <FloatingCubes count={isMobile ? 6 : 14} />
      </Suspense>
    </Canvas>
  );
}
