import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ─────────────────── Particle Field ─────────────────── */
function ParticleField({ mouse }) {
  const meshRef = useRef();
  const count = 2500;

  const [positions, colors, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Distance from anomaly center (1.5, 0.5, 0)
      const dx = pos[i * 3] - 1.5;
      const dy = pos[i * 3 + 1] - 0.5;
      const dz = pos[i * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Near anomaly: red-ish. Far: blue-ish
      if (dist < 2.5) {
        col[i * 3] = 0.9;      // R
        col[i * 3 + 1] = 0.27;  // G
        col[i * 3 + 2] = 0.27;  // B
        sc[i] = 0.025 + Math.random() * 0.02;
      } else {
        col[i * 3] = 0.23 + Math.random() * 0.15;
        col[i * 3 + 1] = 0.35 + Math.random() * 0.15;
        col[i * 3 + 2] = 0.7 + Math.random() * 0.25;
        sc[i] = 0.012 + Math.random() * 0.015;
      }
    }
    return [pos, col, sc];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Slow idle rotation
    meshRef.current.rotation.y = t * 0.02;
    meshRef.current.rotation.x = Math.sin(t * 0.015) * 0.05;

    // Mouse influence
    if (mouse.current) {
      const targetRotY = mouse.current.x * 0.08;
      const targetRotX = mouse.current.y * 0.04;
      meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y % (Math.PI * 2)) * 0.02;
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <group ref={meshRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={count}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
            count={count}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.04}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Anomaly Core Glow */}
      <mesh position={[1.5, 0.5, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial
          color="#e54545"
          transparent
          opacity={0.12}
        />
      </mesh>
      <mesh position={[1.5, 0.5, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color="#e54545"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Evidence connection lines */}
      <EvidenceLine from={[1.5, 0.5, 0]} to={[3.5, 1.8, -1]} />
      <EvidenceLine from={[1.5, 0.5, 0]} to={[-1.0, 2.2, 0.5]} />
      <EvidenceLine from={[1.5, 0.5, 0]} to={[2.5, -1.5, 1.2]} />
    </group>
  );
}

/* ─────────────────── Evidence Lines ─────────────────── */
function EvidenceLine({ from, to }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    }
  });

  const points = useMemo(() => {
    return [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  }, [from, to]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.1}
        depthWrite={false}
      />
    </line>
  );
}

/* ─────────────────── Camera Controller ─────────────────── */
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Slow cinematic drift
    state.camera.position.x = Math.sin(t * 0.05) * 0.3;
    state.camera.position.y = Math.cos(t * 0.04) * 0.15;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─────────────────── Main Export ─────────────────── */
export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.current = { x, y };
  };

  return (
    <div
      className="absolute inset-0 z-0"
      onMouseMove={handleMouseMove}
      style={{ touchAction: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 100 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 8, 5]} intensity={0.4} />
        <fog attach="fog" args={['#0b0f1a', 8, 25]} />
        <ParticleField mouse={mouse} />
        <CameraRig />
      </Canvas>
    </div>
  );
}
