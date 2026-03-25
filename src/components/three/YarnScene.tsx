"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   Yarn ball colors — realistic estambre palette
   ───────────────────────────────────────────────────────────── */
const YARN_PALETTE = [
  { base: "#e74c3c", light: "#f1948a", name: "Rojo" },
  { base: "#e67e22", light: "#f0b27a", name: "Naranja" },
  { base: "#f1c40f", light: "#f9e154", name: "Amarillo" },
  { base: "#2ecc71", light: "#82e0aa", name: "Verde" },
  { base: "#3498db", light: "#85c1e9", name: "Azul" },
  { base: "#9b59b6", light: "#c39bd3", name: "Morado" },
  { base: "#e91e63", light: "#f48fb1", name: "Rosa" },
  { base: "#1abc9c", light: "#76d7c4", name: "Turquesa" },
  { base: "#ecf0f1", light: "#ffffff", name: "Blanco" },
  { base: "#2c3e50", light: "#5d6d7e", name: "Azul Marino" },
];

/* ─────────────────────────────────────────────────────────────
   Custom yarn ball geometry with wrap texture
   ───────────────────────────────────────────────────────────── */
function createYarnTexture(baseColor: string, lightColor: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Base color fill
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // Yarn wrap lines — many overlapping curved strands
  const strandCount = 60;
  for (let i = 0; i < strandCount; i++) {
    const angle = (i / strandCount) * Math.PI * 2;
    const shade = Math.random() > 0.5 ? baseColor : lightColor;
    ctx.strokeStyle = shade;
    ctx.lineWidth = 3 + Math.random() * 5;
    ctx.globalAlpha = 0.15 + Math.random() * 0.25;
    ctx.beginPath();

    // Sine-wave curves wrapping around
    const yOffset = Math.random() * size;
    const amplitude = 30 + Math.random() * 50;
    const freq = 2 + Math.random() * 4;
    for (let x = 0; x < size; x += 2) {
      const y = yOffset + Math.sin((x / size) * freq * Math.PI + angle) * amplitude;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Cross-wrap strands (vertical direction)
  for (let i = 0; i < strandCount / 2; i++) {
    const shade = Math.random() > 0.5 ? baseColor : lightColor;
    ctx.strokeStyle = shade;
    ctx.lineWidth = 2 + Math.random() * 4;
    ctx.globalAlpha = 0.1 + Math.random() * 0.2;
    ctx.beginPath();
    const xOffset = Math.random() * size;
    const amplitude = 20 + Math.random() * 40;
    const freq = 2 + Math.random() * 3;
    for (let y = 0; y < size; y += 2) {
      const x = xOffset + Math.sin((y / size) * freq * Math.PI) * amplitude;
      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Fuzzy fiber dots
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 2;
    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/* ─────────────────────────────────────────────────────────────
   Single Yarn Ball component
   ───────────────────────────────────────────────────────────── */
interface YarnBallProps {
  position: [number, number, number];
  radius: number;
  color: typeof YARN_PALETTE[0];
  mousePos: React.MutableRefObject<THREE.Vector3>;
}

function YarnBall({ position, radius, color, mousePos }: YarnBallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 0.01,
    (Math.random() - 0.5) * 0.01,
    0,
  ));
  const startPos = useRef(new THREE.Vector3(...position));
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(
    () => createYarnTexture(color.base, color.light),
    [color.base, color.light],
  );

  // Bump map for fuzzy feel
  const bumpTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const v = Math.random() * 100 + 100;
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    // Mouse repulsion
    const dist = mesh.position.distanceTo(mousePos.current);
    const repelRadius = 2.5;
    if (dist < repelRadius && dist > 0.01) {
      const force = new THREE.Vector3()
        .subVectors(mesh.position, mousePos.current)
        .normalize()
        .multiplyScalar((repelRadius - dist) * 0.08);
      velocity.current.add(force);
    }

    // Spring force back to start position
    const toStart = new THREE.Vector3().subVectors(startPos.current, mesh.position);
    velocity.current.add(toStart.multiplyScalar(0.005));

    // Damping
    velocity.current.multiplyScalar(0.96);

    // Apply velocity
    mesh.position.add(velocity.current.clone().multiplyScalar(delta * 60));

    // Rotation based on movement
    mesh.rotation.x += velocity.current.y * 2;
    mesh.rotation.y += velocity.current.x * 2;
    mesh.rotation.z += delta * 0.15;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.15 : 1}
    >
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        bumpMap={bumpTexture}
        bumpScale={0.03}
        roughness={0.85}
        metalness={0.02}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────
   Dangling thread for each yarn ball
   ───────────────────────────────────────────────────────────── */
function DanglingThread({ from, color }: { from: [number, number, number]; color: string }) {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(from[0] + 0.2, from[1] - 0.3, from[2]),
      new THREE.Vector3(from[0] + 0.35, from[1] - 0.5, from[2] + 0.1),
      new THREE.Vector3(from[0] + 0.2, from[1] - 0.7, from[2] - 0.05),
    ]);
    return curve.getPoints(20);
  }, [from]);

  const lineGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);

  return (
    <line geometry={lineGeom}>
      <lineBasicMaterial color={color} linewidth={2} transparent opacity={0.5} />
    </line>
  );
}

/* ─────────────────────────────────────────────────────────────
   Mouse tracker — projects mouse to 3D plane
   ───────────────────────────────────────────────────────────── */
function MouseTracker({ mousePos }: { mousePos: React.MutableRefObject<THREE.Vector3> }) {
  const { camera, size } = useThree();
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useFrame(({ pointer }) => {
    raycaster.setFromCamera(pointer, camera);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    if (intersection) {
      mousePos.current.lerp(intersection, 0.15);
    }
  });

  return null;
}

/* ─────────────────────────────────────────────────────────────
   Main Scene
   ───────────────────────────────────────────────────────────── */
function Scene() {
  const mousePos = useRef(new THREE.Vector3(100, 100, 0));

  // Generate yarn ball positions spread across the scene
  const balls = useMemo(() => {
    const result: Array<{
      position: [number, number, number];
      radius: number;
      color: typeof YARN_PALETTE[0];
    }> = [];

    const count = 14;
    const spread = 8;

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread * 2;
      const y = (Math.random() - 0.5) * spread * 0.6;
      const z = (Math.random() - 0.5) * 2;
      const radius = 0.25 + Math.random() * 0.35;
      const color = YARN_PALETTE[i % YARN_PALETTE.length];

      result.push({ position: [x, y, z], radius, color });
    }

    return result;
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 3, -2]} intensity={0.3} color="#e8d5b7" />
      <pointLight position={[0, -2, 3]} intensity={0.4} color="#87ceeb" />

      <Environment preset="studio" environmentIntensity={0.2} />

      <MouseTracker mousePos={mousePos} />

      {balls.map((ball, i) => (
        <Float
          key={i}
          speed={1 + Math.random() * 0.5}
          rotationIntensity={0.1}
          floatIntensity={0.2 + Math.random() * 0.3}
        >
          <YarnBall
            position={ball.position}
            radius={ball.radius}
            color={ball.color}
            mousePos={mousePos}
          />
          <DanglingThread from={ball.position} color={ball.color.base} />
        </Float>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Exported component with lazy loading
   ───────────────────────────────────────────────────────────── */
export default function YarnScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-auto z-0" style={{ opacity: 0.85 }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
