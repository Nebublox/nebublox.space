'use client';

import React, { useEffect, useState } from 'react';

export default function FloatingParticles() {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);

    useEffect(() => {
        // Generate pixel particles across the screen
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100, // Percentage
            y: Math.random() * 100,
            size: Math.random() * 3 + 2, // 2-5px
            duration: Math.random() * 10 + 8 // 8-18s
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="particle absolute opacity-30"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                />
            ))}
        </div>
    );
}
