'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleVortex() {
    const pointsRef = useRef<THREE.Points>(null);
    const particleCount = 2000;

    // Generate particles in a disc shape
    const { positions, colors, velocities } = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);

        const cyanColor = new THREE.Color('#00FFFF');
        const purpleColor = new THREE.Color('#6A0DAD');

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Create disc distribution
            const radius = Math.random() * 15 + 2; // 2-17 units from center
            const angle = Math.random() * Math.PI * 2;

            positions[i3] = Math.cos(angle) * radius; // x
            positions[i3 + 1] = (Math.random() - 0.5) * 0.5; // y (thin disc)
            positions[i3 + 2] = Math.sin(angle) * radius; // z

            // Mix cyan and purple
            const color = Math.random() > 0.5 ? cyanColor : purpleColor;
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Store initial velocity (will increase as it gets closer to center)
            velocities[i] = Math.random() * 0.5 + 0.5;
        }

        return { positions, colors, velocities };
    }, []);

    // Animate particles spiraling inward
    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            const x = positions[i3];
            const y = positions[i3 + 1];
            const z = positions[i3 + 2];

            // Distance from center
            const distance = Math.sqrt(x * x + z * z);

            // Speed increases as particles get closer to center
            const speed = velocities[i] * (1 + (15 - distance) / 15) * 0.003;

            // Spiral angle
            const angle = Math.atan2(z, x);
            const newAngle = angle + speed;

            // Move inward gradually
            const newRadius = distance - speed * 2;

            if (newRadius < 0.5) {
                // Reset particle to outer edge when it reaches center
                const resetAngle = Math.random() * Math.PI * 2;
                const resetRadius = Math.random() * 3 + 14;
                positions[i3] = Math.cos(resetAngle) * resetRadius;
                positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
                positions[i3 + 2] = Math.sin(resetAngle) * resetRadius;
            } else {
                // Spiral inward
                positions[i3] = Math.cos(newAngle) * newRadius;
                positions[i3 + 2] = Math.sin(newAngle) * newRadius;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function BlackHoleBackground() {
    return (
        <div className="fixed inset-0 w-full h-full -z-10">
            <Canvas
                camera={{ position: [0, 10, 8], fov: 75 }}
                style={{ background: '#050505' }}
            >
                <ambientLight intensity={0.5} />
                <ParticleVortex />
            </Canvas>

            {/* Radial gradient overlay for text readability */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, transparent 40%, rgba(5,5,5,0.7) 100%)'
                }}
            />
        </div>
    );
}
