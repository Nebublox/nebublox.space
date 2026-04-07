'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function MovingNebula() {
    const meshRef = useRef<THREE.Mesh>(null);
    const texture = useLoader(THREE.TextureLoader, '/nebula-base.png');

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        // Subtle rhythmic movement
        meshRef.current.position.y = Math.sin(time * 0.2) * 2;
        meshRef.current.position.x = Math.cos(time * 0.15) * 2;

        // Very slow rotation
        meshRef.current.rotation.z = time * 0.02;

        // Slight scale breathing
        const scale = 35 + Math.sin(time * 0.1) * 2;
        meshRef.current.scale.set(scale, scale, 1);
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -20]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                map={texture}
                transparent
                opacity={0.4}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

function CloudLayer({ color, speed, size, position, opacity = 0.2 }: { color: string, speed: number, size: number, position: [number, number, number], opacity?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        meshRef.current.position.x = position[0] + Math.sin(time * speed) * 3;
        meshRef.current.position.y = position[1] + Math.cos(time * speed * 0.8) * 2;
        meshRef.current.rotation.z = time * speed * 0.1;
    });

    // Simple procedural cloud texture or fallback
    return (
        <mesh ref={meshRef} position={position}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={opacity}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

export default function NebulaBackground() {
    return (
        <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
            <Canvas
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />

                {/* Deep background color */}
                <color attach="background" args={['#000000']} />

                <ambientLight intensity={1.5} />

                <Suspense fallback={null}>
                    {/* Base Nebula Texture */}
                    <MovingNebula />
                </Suspense>

                {/* Moving Nebula Clouds - Multi-layered for depth */}
                <group>
                    <CloudLayer color="#6A0DAD" speed={0.15} size={25} position={[-5, 5, -15]} opacity={0.15} />
                    <CloudLayer color="#3c096c" speed={0.1} size={30} position={[8, -5, -18]} opacity={0.2} />
                    <CloudLayer color="#00FFFF" speed={0.08} size={20} position={[-10, -10, -12]} opacity={0.1} />
                    <CloudLayer color="#FF00CC" speed={0.12} size={22} position={[12, 10, -14]} opacity={0.12} />
                </group>

                {/* Star Field */}
                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />

                {/* Floating Elements for extra "lively" feel */}
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={[15, 10, -5]}>
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <meshBasicMaterial color="#00FFFF" transparent opacity={0.6} />
                    </mesh>
                </Float>
            </Canvas>

            {/* Readability Overlays */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 100%)'
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)'
                }}
            />
        </div>
    );
}
