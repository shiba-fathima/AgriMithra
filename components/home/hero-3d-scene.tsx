"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function GlassShape({ position, scale, speed = 1, rotation, type = "cone" }: any) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.005 * speed;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1 + rotation[0];
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={ref} position={position} scale={scale} rotation={rotation}>
        {type === "cone" && <coneGeometry args={[1, 2, 4]} />}
        {type === "sphere" && <sphereGeometry args={[1, 32, 32]} />}
        {type === "dodecahedron" && <dodecahedronGeometry args={[1, 0]} />}
        {type === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {type === "nut" && <cylinderGeometry args={[1, 1, 1, 6]} />}
        <meshPhysicalMaterial 
          color="#d1fae5" // Very pale whitish-green 
          emissive="#6ee7b7" // Soft green glow
          emissiveIntensity={0.4}
          roughness={0.0} // Perfect mirror smooth
          metalness={1.0} // Full mirror reflection
          transmission={0.3} // Slightly more glass-like
          thickness={1.5}
          ior={2.5} // High index of refraction for diamond/crystal feel
          envMapIntensity={4} // High environment reflection
          clearcoat={1} // Extra glossy clearcoat
          clearcoatRoughness={0.0}
        />
      </mesh>
    </Float>
  );
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0 h-[100%] w-full min-h-[600px] pointer-events-none sm:pointer-events-auto opacity-90">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 20, 10]} intensity={2.5} color="#ffffff" castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#f8fafc" />
        
        <PresentationControls global rotation={[0, 0.2, 0]} polar={[-0.2, 0.2]} azimuth={[-0.4, 0.2]}>
          {/* Main "Virtual Node" Shape (Triangle) */}
          <GlassShape type="cone" position={[2.5, 0, 0]} scale={[1.3, 1.3, 1.3]} speed={0.4} rotation={[0.2, 0, 0]} />
          
          {/* Accent Node Shapes */}
          <GlassShape type="octahedron" position={[-3, 1.5, -1]} scale={[0.9, 0.9, 0.9]} speed={0.6} rotation={[0.2, 0.5, 0]} />
          <GlassShape type="cone" position={[1.5, -2.5, -2]} scale={[0.7, 0.7, 0.7]} speed={0.8} rotation={[-0.1, 0, 0]} />
          
          {/* Floating Data Orbs */}
          <GlassShape type="sphere" position={[-2, -1.5, 1.5]} scale={[0.5, 0.5, 0.5]} speed={1} rotation={[0,0,0]} />
          <GlassShape type="octahedron" position={[4, 2, -1.5]} scale={[0.4, 0.4, 0.4]} speed={1.2} rotation={[0,0,0]} />
          
        </PresentationControls>

        <ContactShadows position={[0, -3.5, 0]} opacity={0.15} scale={20} blur={2.5} far={4} color="#334155" />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
