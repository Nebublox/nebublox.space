'use client';

import React, { useState } from 'react';

const phases = [
    {
        title: 'ESTABLISH UPLINK',
        icon: '🔌',
        description: 'Inject the Nebublox Syntax node into Studio.'
    },
    {
        title: 'AUTHENTICATE',
        icon: '🔐',
        description: 'Sync your neural signature.'
    },
    {
        title: 'DEFINE INTENT',
        icon: '🧠',
        description: 'Speak your vision to the Nebula Engine.'
    },
    {
        title: 'MATERIALIZE',
        icon: '🧊',
        description: 'Assets weave themselves into reality.'
    }
];

export default function ExecutionPipeline() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="w-full py-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-2"
                        style={{ fontFamily: 'Orbitron, sans-serif', color: '#00FFFF' }}
                    >
                        EXECUTION PIPELINE
                    </h2>
                    <p className="text-starlight/60 font-mono text-sm uppercase tracking-widest">
                        FROM THOUGHT TO REALITY
                    </p>
                </div>

                {/* Pipeline Steps */}
                <div className="relative">
                    {/* Connecting Cable */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2" style={{ zIndex: 0 }}>
                        <div
                            className="h-full"
                            style={{
                                background: hoveredIndex !== null
                                    ? 'linear-gradient(90deg, rgba(0, 255, 255, 0.6), rgba(157, 0, 255, 0.6))'
                                    : 'linear-gradient(90deg, rgba(0, 255, 255, 0.2), rgba(157, 0, 255, 0.2))',
                                boxShadow: hoveredIndex !== null
                                    ? '0 0 20px rgba(0, 255, 255, 0.6)'
                                    : '0 0 10px rgba(0, 255, 255, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {/* Data Pulse */}
                            {hoveredIndex !== null && (
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                                        animation: 'data-pulse 1s ease-in-out infinite'
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Phase Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {phases.map((phase, index) => (
                            <div
                                key={index}
                                className="group relative h-full"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Phase Card */}
                                <div
                                    className="p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 h-full flex flex-col"
                                    style={{
                                        background: hoveredIndex === index
                                            ? 'rgba(0, 255, 255, 0.15)'
                                            : 'rgba(10, 10, 15, 0.7)',
                                        border: hoveredIndex === index
                                            ? '2px solid rgba(0, 255, 255, 0.6)'
                                            : '1px solid rgba(106, 13, 173, 0.3)',
                                        boxShadow: hoveredIndex === index
                                            ? '0 0 30px rgba(0, 255, 255, 0.4)'
                                            : 'none'
                                    }}
                                >
                                    {/* Phase Number */}
                                    <div
                                        className="text-xs font-mono mb-3 uppercase tracking-wider"
                                        style={{ color: '#9D00FF' }}
                                    >
                                        PHASE {String(index + 1).padStart(2, '0')}
                                    </div>

                                    {/* Icon */}
                                    <div
                                        className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110"
                                        style={{
                                            filter: hoveredIndex === index
                                                ? 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))'
                                                : 'none'
                                        }}
                                    >
                                        {phase.icon}
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-lg font-bold mb-3 uppercase"
                                        style={{
                                            fontFamily: 'Orbitron, sans-serif',
                                            color: hoveredIndex === index ? '#00FFFF' : '#FFFFFF'
                                        }}
                                    >
                                        {phase.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm font-mono leading-relaxed" style={{ color: '#C0C0C0' }}>
                                        {phase.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <style jsx>{`
        @keyframes data-pulse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
        </div>
    );
}
