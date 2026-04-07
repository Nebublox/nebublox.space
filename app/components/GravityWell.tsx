'use client';

import React, { useState, useEffect } from 'react';

interface GravityWellProps {
    isActive: boolean;
    children?: React.ReactNode;
}

export default function GravityWell({ isActive, children }: GravityWellProps) {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

    useEffect(() => {
        if (isActive) {
            // Generate random particles
            const newParticles = Array.from({ length: 20 }, (_, i) => ({
                id: i,
                x: Math.random() * 300 - 150, // Random position around center
                y: Math.random() * 300 - 150,
                delay: Math.random() * 2
            }));
            setParticles(newParticles);
        } else {
            setParticles([]);
        }
    }, [isActive]);

    return (
        <div className="relative w-full h-full flex-center overflow-hidden">
            {/* The Black Hole Center */}
            <div
                className="absolute w-32 h-32 rounded-full bg-black z-10"
                style={{
                    boxShadow: `
            inset 0 0 60px rgba(106, 13, 173, 0.8),
            0 0 100px rgba(106, 13, 173, 0.6),
            0 0 150px rgba(106, 13, 173, 0.3)
          `
                }}
            />

            {/* Accretion Disk */}
            {isActive && (
                <svg
                    className="absolute w-64 h-64 accretion-disk z-5"
                    viewBox="0 0 100 100"
                    style={{ animationDuration: '3s' }}
                >
                    <defs>
                        <linearGradient id="diskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#6A0DAD', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#9d4edd', stopOpacity: 0.8 }} />
                            <stop offset="100%" style={{ stopColor: '#00FFFF', stopOpacity: 0.6 }} />
                        </linearGradient>
                    </defs>

                    <ellipse
                        cx="50"
                        cy="50"
                        rx="48"
                        ry="16"
                        fill="none"
                        stroke="url(#diskGradient)"
                        strokeWidth="4"
                        opacity="0.8"
                    />
                </svg>
            )}

            {/* Floating Particles Being Pulled In */}
            {isActive && particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-singularity rounded-full gravity-well-pulling"
                    style={{
                        left: `calc(50% + ${particle.x}px)`,
                        top: `calc(50% + ${particle.y}px)`,
                        animationDelay: `${particle.delay}s`,
                        boxShadow: '0 0 4px var(--event-horizon)'
                    }}
                />
            ))}

            {/* Content Area - Text that gets pulled in */}
            <div className={`relative z-20 transition-all duration-1000 ${isActive ? 'gravity-well-pulling' : ''
                }`}>
                {children}
            </div>

            {/* Code Ejecting from Poles (when processing complete) */}
            {!isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 code-ejecting">
                    <div className="text-code-cyan font-mono text-xs opacity-80">
                        {'{ ... }'}
                    </div>
                </div>
            )}
        </div>
    );
}
