"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/journey";

const PALETTE = ["#c1592b", "#c99a3e", "#4f6b4b", "#e0b98f"];

function NodeCluster() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const nodes = useMemo(() => {
    const count = 46;
    const rand = mulberry32(501);
    const pts: { pos: THREE.Vector3; color: string; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      const radius = 3.2 + rand() * 1.6;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const pos = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta) * 0.7,
        radius * Math.cos(phi) * 0.9
      );
      pts.push({
        pos,
        color: PALETTE[i % PALETTE.length],
        scale: 0.05 + rand() * 0.09,
      });
    }
    return pts;
  }, []);

  const edges = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      let closest: number[] = [];
      const dists = nodes
        .map((n, j) => ({ j, d: nodes[i].pos.distanceTo(n.pos) }))
        .filter((n) => n.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      closest = dists.map((d) => d.j);
      closest.forEach((j) => {
        if (j > i) lines.push([nodes[i].pos, nodes[j].pos]);
      });
    }
    return lines;
  }, [nodes]);

  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    edges.forEach(([a, b]) => {
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [edges]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.055;
    groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.08;

    const targetX = (state.pointer.x * viewport.width) / 24;
    const targetY = (state.pointer.y * viewport.height) / 24;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#8a6a4c" transparent opacity={0.35} />
      </lineSegments>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[n.scale, 12, 12]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={0.55}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#f4b183" />
      <pointLight position={[-5, -3, -5]} intensity={25} color="#4f6b4b" />
      <NodeCluster />
    </Canvas>
  );
}
