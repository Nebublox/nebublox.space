'use client';

import React from 'react';

export default function WarpedGrid() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* 3D Warped Grid Container */}
            <div className="absolute inset-0" style={{ perspective: '800px' }}>
                {/* Grid that warps toward center */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(106, 13, 173, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(106, 13, 173, 0.3) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px',
                        transform: 'rotateX(60deg) translateZ(-200px)',
                        transformOrigin: 'center center',
                        animation: 'gridPulse 4s ease-in-out infinite'
                    }}
                />

                {/* Second layer for depth */}
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(106, 13, 173, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(106, 13, 173, 0.2) 1px, transparent 1px)
            `,
                        backgroundSize: '80px 80px',
                        transform: 'rotateX(65deg) translateZ(-400px)',
                        transformOrigin: 'center center',
                        animation: 'gridPulse 4s ease-in-out infinite 0.5s'
                    }}
                />
            </div>

            {/* Central void fade */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at center, #050505 0%, transparent 40%)',
                    mixBlendMode: 'multiply'
                }}
            />

            <style jsx>{`
        @keyframes gridPulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
        </div>
    );
}
