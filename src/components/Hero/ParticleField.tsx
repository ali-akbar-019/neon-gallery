import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '../../hooks/useMousePosition';

const PARTICLE_COUNT = 1800;

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();

  // Generate random positions in a sphere-ish volume
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    // Neon color palette for particles
    const palette = [
      new THREE.Color('#00FFFF'),
      new THREE.Color('#FF00FF'),
      new THREE.Color('#FFD700'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute in a wide volume
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime();

    // Slow ambient rotation
    meshRef.current.rotation.y = t * 0.03 + mouse.normalizedX * 0.15;
    meshRef.current.rotation.x = mouse.normalizedY * 0.08;

    // Subtle pulsing scale
    const s = 1 + Math.sin(t * 0.4) * 0.015;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.08 + mouse.normalizedX * 0.3;
    groupRef.current.rotation.x = t * 0.04 + mouse.normalizedY * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Central glowing wireframe icosahedron */}
      <mesh position={[0, 0, -2]}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial
          color="#00FFFF"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Outer ring */}
      <mesh position={[0, 0, -2]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[3.5, 0.012, 8, 120]} />
        <meshBasicMaterial color="#FF00FF" transparent opacity={0.15} />
      </mesh>

      <mesh position={[0, 0, -2]} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[2.8, 0.008, 8, 100]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export default function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <Particles />
      <FloatingGeometry />
    </Canvas>
  );
}
