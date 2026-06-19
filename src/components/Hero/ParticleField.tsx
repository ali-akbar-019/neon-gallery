import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '../../hooks/useMousePosition';

// ─── Elegant star-field: fine particles drifting in deep space ────────────────
// NO rotating geometry shapes — just a quiet, infinite starfield with
// very subtle mouse parallax. Clean and cinematic.

const PARTICLE_COUNT = 2200;

function StarField() {
  const meshRef  = useRef<THREE.Points>(null);
  const mouse    = useMousePosition();
  // Smooth mouse target so parallax is silky, not twitchy
  const smoothMX = useRef(0);
  const smoothMY = useRef(0);

  const { positions, colors, sizes } = useMemo(() => {
    const pos  = new Float32Array(PARTICLE_COUNT * 3);
    const col  = new Float32Array(PARTICLE_COUNT * 3);
    const sz   = new Float32Array(PARTICLE_COUNT);

    // Color palette — mostly white/near-white, occasional neon accent
    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#e0f0ff'),
      new THREE.Color('#00FFFF'),
      new THREE.Color('#FF00FF'),
      new THREE.Color('#ffe880'),
    ];
    // Weight: 70% white, 15% cold white, 5% cyan, 5% magenta, 5% gold
    const weights = [0.70, 0.85, 0.90, 0.95, 1.00];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread widely — deep field
      pos[i * 3]     = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;

      const r   = Math.random();
      const idx = weights.findIndex(w => r < w);
      const c   = palette[idx === -1 ? 0 : idx];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      // Most are tiny, a handful are brighter/bigger — gives depth
      sz[i] = Math.random() < 0.06 ? 0.045 : 0.014 + Math.random() * 0.018;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Lerp mouse for buttery parallax
    smoothMX.current += (mouse.normalizedX - smoothMX.current) * 0.04;
    smoothMY.current += (mouse.normalizedY - smoothMY.current) * 0.04;

    // Very slow drift rotation — feels like floating through space
    meshRef.current.rotation.y = t * 0.008 + smoothMX.current * 0.06;
    meshRef.current.rotation.x =             smoothMY.current * 0.04;

    // No scale pulsing — that was the childish part
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={PARTICLE_COUNT} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} count={PARTICLE_COUNT} />
        <bufferAttribute attach="attributes-size"     args={[sizes,     1]} count={PARTICLE_COUNT} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.82}
        sizeAttenuation
        depthWrite={false}
        // Let each particle use its own size attribute
        size={0.02}
      />
    </points>
  );
}

// Two faint horizontal light streaks in the far distance — editorial feel
function LightStreaks() {
  const line1 = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-12, 0.6, -6),
      new THREE.Vector3( 12, 0.6, -6),
    ]);
    const mat = new THREE.LineBasicMaterial({ color: '#00FFFF', transparent: true, opacity: 0.06 });
    return new THREE.Line(geo, mat);
  }, []);

  const line2 = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-8, -0.9, -8),
      new THREE.Vector3( 8, -0.9, -8),
    ]);
    const mat = new THREE.LineBasicMaterial({ color: '#FF00FF', transparent: true, opacity: 0.04 });
    return new THREE.Line(geo, mat);
  }, []);

  return (
    <>
      <primitive object={line1} />
      <primitive object={line2} />
    </>
  );
}

export default function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 55 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <StarField />
      <LightStreaks />
    </Canvas>
  );
}
