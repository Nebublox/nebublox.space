'use client';

import React from 'react';

const artifacts = [
    { name: 'PHOTON BLADE', polyCount: '4.2K', material: 'Neon Plasma' },
    { name: 'SENTINEL UNIT', polyCount: '8.7K', material: 'Titanium Mesh' },
    { name: 'VOID CACHE', polyCount: '3.1K', material: 'Dark Matter' }
];

export default function VoidArtifacts() {
    return (
        <div className="w-full py-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <h2
                    className="text-4xl md:text-5xl font-black text-center mb-16 uppercase tracking-wider"
                    style={{ fontFamily: 'Orbitron, sans-serif', color: '#9D00FF' }}
                >
                    MANIFESTED FROM THE VOID
                </h2>

                {/* Artifacts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {artifacts.map((artifact, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center"
                        >
                            {/* Holographic Containment Field */}
                            <div
                                className="relative w-48 h-64 flex items-center justify-center transition-all duration-500"
                                style={{
                                    background: 'linear-gradient(to bottom, transparent, rgba(157, 0, 255, 0.1), transparent)',
                                    border: '1px solid rgba(157, 0, 255, 0.3)',
                                    boxShadow: '0 0 30px rgba(157, 0, 255, 0.2), inset 0 0 30px rgba(157, 0, 255, 0.1)',
                                    borderRadius: '50% 50% 50% 50% / 10% 10% 10% 10%'
                                }}
                            >
                                {/* Artifact Placeholder (emoji for now) */}
                                <div
                                    className="artifact-icon text-6xl group-hover:scale-110 transition-all duration-500"
                                    style={{
                                        animation: 'float-artifact 3s ease-in-out infinite',
                                        animationDelay: `${index * 0.5}s`,
                                        filter: 'grayscale(100%) brightness(80%) sepia(100%) hue-rotate(240deg) saturate(300%) drop-shadow(0 0 5px #9D00FF)',
                                        opacity: 0.85
                                    }}
                                >
                                    {index === 0 && '⚔️'}
                                    {index === 1 && '🤖'}
                                    {index === 2 && '📦'}
                                </div>

                                {/* Hover Stats Overlay */}
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    style={{
                                        background: 'rgba(157, 0, 255, 0.9)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <div className="text-white font-mono text-sm space-y-2 text-center">
                                        <p className="font-bold text-code-cyan">{artifact.name}</p>
                                        <p>Poly Count: {artifact.polyCount}</p>
                                        <p>Material: {artifact.material}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Artifact Name */}
                            <p className="mt-6 text-starlight font-mono text-sm uppercase tracking-wider">
                                {artifact.name}
                            </p>
                        </div>
                    ))}
                </div>

            </div>

            <style jsx>{`
        @keyframes float-artifact {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        
        .group:hover .artifact-icon {
          filter: none !important;
          opacity: 1 !important;
        }
      `}</style>
        </div>
    );
}
