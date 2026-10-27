"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/journey";

const GAP = 14;
const TAU = Math.PI * 2;
const RING_COLORS = ["#c1592b", "#c99a3e", "#8fb38a", "#e0b98f"];

let webglCache: boolean | undefined;
function hasWebGL() {
  if (webglCache === undefined) {
    try {
      const c = document.createElement("canvas");
      webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglCache = false;
    }
  }
  return webglCache;
}
const noopSubscribe = () => () => {};

function Tunnel({ index, count, reduced }: { index: number; count: number; reduced: boolean }) {
  const { positions, colors } = useMemo(() => {
    const rand = mulberry32(7);
    const n = 1800;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    const palette = ["#c1592b", "#c99a3e", "#8fb38a", "#e0b98f", "#f6f0e4", "#f6f0e4"].map(
      (c) => new THREE.Color(c),
    );
    for (let i = 0; i < n; i++) {
      const r = 2.5 + rand() * 11;
      const theta = rand() * TAU;
      const z = 8 - rand() * (count * GAP + 16);
      positions.set([r * Math.cos(theta), r * Math.sin(theta) * 0.72, z], i * 3);
      const c = palette[Math.floor(rand() * palette.length)];
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, colors };
  }, [count]);

  const gates = useMemo(
    () =>
      Array.from({ length: count - 1 }, (_, k) => ({
        z: -(k + 1) * GAP + 3,
        color: RING_COLORS[k % RING_COLORS.length],
      })),
    [count],
  );

  useFrame((state, dt) => {
    const cam = state.camera;
    const targetZ = -index * GAP;
    const px = reduced ? 0 : state.pointer.x * 0.9;
    const py = reduced ? 0 : state.pointer.y * 0.6;
    if (reduced) {
      cam.position.set(px, py, targetZ);
    } else {
      cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, 2.4, dt);
      cam.position.x = THREE.MathUtils.damp(cam.position.x, px, 3, dt);
      cam.position.y = THREE.MathUtils.damp(cam.position.y, py, 3, dt);
    }
    cam.lookAt(cam.position.x * 0.25, cam.position.y * 0.25, cam.position.z - 10);
  });

  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>
      {gates.map((g, i) => (
        <group key={i} position={[0, 0, g.z]}>
          <mesh>
            <torusGeometry args={[7.6, 0.03, 8, 160]} />
            <meshBasicMaterial color={g.color} transparent opacity={0.3} />
          </mesh>
          <mesh>
            <torusGeometry args={[5.3, 0.018, 8, 140]} />
            <meshBasicMaterial color={g.color} transparent opacity={0.13} />
          </mesh>
        </group>
      ))}
    </>
  );
}

export default function Backdrop({
  index,
  count,
  reduced,
}: {
  index: number;
  count: number;
  reduced: boolean;
}) {
  const ok = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);

  return (
    <div className="absolute inset-0" aria-hidden>
      {/* CSS glow sits under the canvas and doubles as the no-WebGL fallback */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(193,89,43,0.18),transparent_60%)]" />
      {ok && (
        <Canvas
          camera={{ position: [0, 0, 0], fov: 62, near: 0.1, far: 120 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <fog attach="fog" args={["#171009", 6, 46]} />
          <Tunnel index={index} count={count} reduced={reduced} />
        </Canvas>
      )}
    </div>
  );
}
