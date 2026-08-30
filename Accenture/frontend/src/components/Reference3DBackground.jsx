import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─────────────────── Particle Signal Observatory ─────────────────── */
function SignalParticleField({ mouse }) {
  const meshRef = useRef();
  const count = 3000;

  const [positions, colors, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Atmospheric 3D spatial field
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 5.5;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Anomaly epicenter at (1.8, 0.6, -0.5)
      const dx = pos[i * 3] - 1.8;
      const dy = pos[i * 3 + 1] - 0.6;
      const dz = pos[i * 3 + 2] + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Near anomaly: Crimson Red signal disturbance. Medium: Cyan evidence node. Far: Deep Indigo intelligence signal
      if (dist < 2.2) {
        col[i * 3] = 0.95;     // Red
        col[i * 3 + 1] = 0.22; // Green
        col[i * 3 + 2] = 0.25; // Blue
        sc[i] = 0.03 + Math.random() * 0.02;
      } else if (dist < 4.2 && Math.random() > 0.65) {
        col[i * 3] = 0.02;     // Cyan (Evidence)
        col[i * 3 + 1] = 0.82;
        col[i * 3 + 2] = 0.96;
        sc[i] = 0.025 + Math.random() * 0.015;
      } else {
        col[i * 3] = 0.24 + Math.random() * 0.15; // Indigo / Violet
        col[i * 3 + 1] = 0.35 + Math.random() * 0.15;
        col[i * 3 + 2] = 0.85 + Math.random() * 0.15;
        sc[i] = 0.012 + Math.random() * 0.015;
      }
    }
    return [pos, col, sc];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Slow ambient rotation & subtle pulsation
    meshRef.current.rotation.y = t * 0.018;
    meshRef.current.rotation.x = Math.sin(t * 0.012) * 0.04;

    // Smooth mouse parallax interpolation
    if (mouse.current) {
      const targetRotY = mouse.current.x * 0.06;
      const targetRotX = mouse.current.y * 0.03;
      meshRef.current.rotation.y += (targetRotY - (meshRef.current.rotation.y % (Math.PI * 2))) * 0.015;
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.015;
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
          size={0.038}
          sizeAttenuation
          transparent
          opacity={0.65}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Anomaly Disturbance Core */}
      <mesh position={[1.8, 0.6, -0.5]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial
          color="#ff5f57"
          transparent
          opacity={0.12}
        />
      </mesh>
      <mesh position={[1.8, 0.6, -0.5]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial
          color="#ff5f57"
          transparent
          opacity={0.38}
        />
      </mesh>

      {/* Dynamic Evidence Causal Rays */}
      <CausalEvidenceRay from={[1.8, 0.6, -0.5]} to={[3.8, 2.0, -1.2]} color="#00d2ff" speed={0.9} />
      <CausalEvidenceRay from={[1.8, 0.6, -0.5]} to={[-1.2, 2.4, 0.6]} color="#00d2ff" speed={1.1} />
      <CausalEvidenceRay from={[1.8, 0.6, -0.5]} to={[2.8, -1.8, 1.4]} color="#3D81E3" speed={0.8} />
      <CausalEvidenceRay from={[1.8, 0.6, -0.5]} to={[-2.4, -1.0, -1.0]} color="#A4F4FD" speed={0.7} />
    </group>
  );
}

/* ─────────────────── Dynamic Evidence Connection Rays ─────────────────── */
function CausalEvidenceRay({ from, to, color = '#00d2ff', speed = 1.0 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.07 + Math.sin(state.clock.elapsedTime * speed) * 0.05;
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
        color={color}
        transparent
        opacity={0.1}
        depthWrite={false}
      />
    </line>
  );
}

/* ─────────────────── Cinematic Camera Rig ─────────────────── */
function CinematicCameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.04) * 0.25;
    state.camera.position.y = Math.cos(t * 0.035) * 0.12;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─────────────────── Fallback Layer (WebGL unavailable / weak GPU) ─────────────────── */
function FallbackAtmosphere() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#6366f1]/[0.08] rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#ff5f57]/[0.06] rounded-full blur-[160px]" />
      <div className="absolute top-2/3 left-1/5 w-[350px] h-[350px] bg-[#00d2ff]/[0.05] rounded-full blur-[120px]" />
    </div>
  );
}

/* ─────────────────── Main Shared 3D Background Component ─────────────────── */
export default function Reference3DBackground() {
  const mouse = useRef({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 0 — Same cinematic video background as Landing page */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
      />

      {/* Layer 1 — Dark veil so text/data stays readable over the video */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(6,6,10,0.62) 0%, rgba(6,6,10,0.50) 50%, rgba(6,6,10,0.68) 100%)',
          zIndex: 1,
        }}
      />

      {/* Layer 2 — Grain texture (matches Landing page grain) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.028,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Layer 3 — 3D Animated Particle Field over the video */}
      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 0, 9.5], fov: 45, near: 0.1, far: 100 }}
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent', position: 'absolute', inset: 0, zIndex: 3 }}
        >
          <ambientLight intensity={0.18} />
          <directionalLight position={[6, 8, 6]} intensity={0.35} />
          <fog attach="fog" args={['#060608', 7, 24]} />
          <SignalParticleField mouse={mouse} />
          <CinematicCameraRig />
        </Canvas>
      ) : (
        <FallbackAtmosphere />
      )}

      {/* Layer 4 — Radial vignette for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 20%, transparent 40%, rgba(4, 4, 8, 0.65) 100%)',
          zIndex: 4,
        }}
      />
    </div>
  );
}
