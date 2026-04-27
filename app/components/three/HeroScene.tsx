"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useGLTF, Center } from "@react-three/drei";
import { EffectComposer, Bloom, Glitch } from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import * as THREE from "three";

// ─── Custom 3D Model ───────────────────────────────────────────────

function CustomModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load the GLTF model from the public/object directory
  const { scene } = useGLTF("/object/ZieLabs3d.glb");

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Auto slow rotation
      groupRef.current.rotation.y += delta * 0.1;

      // Mouse parallax
      const { pointer } = state;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (pointer.y * Math.PI) / 6,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (pointer.x * Math.PI) / 6,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Adjust scale and use Center to fix off-center pivot points */}
      <Center>
        <primitive object={scene} scale={0.26} />
      </Center>
    </group>
  );
}

// ─── Ambient Particles ─────────────────────────────────────────────

function Particles() {
  const ref = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      // Smooth ambient movement
      ref.current.rotation.y += delta * 0.02;
      
      // Particle Glitch Effect
      // Very cheap: jitter the whole container's position and scale occasionally
      if (Math.random() < 0.02) {
        ref.current.position.x = (Math.random() - 0.5) * 0.5;
        ref.current.position.z = (Math.random() - 0.5) * 0.5;
        ref.current.scale.y = Math.random() > 0.5 ? 1.5 : 0.5;
      } else {
        ref.current.position.x = 0;
        ref.current.position.z = 0;
        ref.current.scale.y = 1;
      }

      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
    }
  });

  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const palette = [
    new THREE.Color("#50C878"), // Green
    new THREE.Color("#E8652A"), // Amber
    new THREE.Color("#2660A4"), // Blue
    new THREE.Color("#D4A843"), // Gold
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;

    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Scene Composition ─────────────────────────────────────────────

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,1)_0%,rgba(0,0,0,1)_100%)] overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.2} color="#ffffff" />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
        
        <spotLight position={[-5, 5, -5]} intensity={5} color="#50C878" angle={0.5} penumbra={1} />
        <spotLight position={[5, -5, 5]} intensity={2} color="#E8652A" angle={0.5} penumbra={1} />
        
        <CustomModel />
        <Particles />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            mipmapBlur
            intensity={1.2}
          />
          <Glitch
            delay={new THREE.Vector2(2, 5)} // delay between glitches in seconds
            duration={new THREE.Vector2(0.1, 0.3)} // duration of glitch
            strength={new THREE.Vector2(0.02, 0.05)} // mild glitch strength
            mode={GlitchMode.SPORADIC}
            active
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
