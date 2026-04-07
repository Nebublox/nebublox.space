'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';

export default function Navbar() {
    const [railVisible, setRailVisible] = useState(false);

    useEffect(() => {
        // Animate system rail sliding down after mount
        setTimeout(() => setRailVisible(true), 300);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50">

            <div
                className="overflow-hidden transition-all duration-500"
                style={{
                    height: railVisible ? '60px' : '0px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderBottom: '1px solid rgba(157, 0, 255, 0.4)',
                    backdropFilter: 'blur(16px)'
                }}
            >
                <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo Integrated in Rail */}
                    <Link href="/" className="flex items-center group ml-10 transition-transform duration-300">
                        <div className="relative w-36 h-8 flex items-center">
                            {/* Nebula Glow behind logo */}
                            <div className="absolute inset-x-0 h-full bg-[#9D00FF]/40 blur-xl rounded-full scale-150 animate-nebula-pulse pointer-events-none" />
                            <img
                                src="/nebublox-logo.png"
                                alt="NEBUBLOX"
                                className="w-full h-full object-contain object-left drop-shadow-[0_0_20px_rgba(157,0,255,0.6)] relative z-10"
                            />
                        </div>
                    </Link>

                    {/* Divider */}
                    <span className="animate-divider-pulse">|</span>

                    {/* THE CORE */}
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono uppercase tracking-[0.2em]" style={{ color: '#C0C0C0' }}>
                            THE CORE:
                        </span>
                        <span
                            className="text-[12px] font-mono uppercase tracking-[0.2em]"
                            style={{
                                color: 'var(--code-cyan)',
                                textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
                            }}
                        >
                            NEBULA ENGINE
                        </span>
                    </div>

                    {/* Divider */}
                    <span className="animate-divider-pulse">|</span>

                    {/* ENGINE */}
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono uppercase tracking-[0.2em]" style={{ color: '#C0C0C0' }}>
                            ENGINE:
                        </span>
                        <span className="text-[12px] font-mono uppercase tracking-[0.2em]" style={{ color: '#C0C0C0' }}>
                            DARKMATTER V1
                        </span>
                    </div>

                    {/* Divider */}
                    <span className="animate-divider-pulse">|</span>

                    {/* LINK */}
                    <a href="https://discord.gg/nebublox" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="text-[12px] font-mono uppercase tracking-[0.2em]" style={{ color: '#C0C0C0' }}>
                            LINK:
                        </span>
                        <span className="text-[12px] font-mono uppercase tracking-[0.2em]" style={{ color: '#C0C0C0' }}>
                            DISCORD
                        </span>
                    </a>

                    {/* Divider */}
                    <span className="animate-divider-pulse">|</span>

                    {/* GET KEY */}
                    <Link href="/getkey" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="text-[12px] font-mono uppercase tracking-[0.2em]" style={{ color: '#C0C0C0' }}>
                            GET:
                        </span>
                        <span className="text-[12px] font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--code-cyan)' }}>
                            KEY
                        </span>
                    </Link>

                    {/* Divider */}
                    <span className="animate-divider-pulse">|</span>

                    {/* STATUS */}
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono uppercase tracking-[0.2em]" style={{ color: '#C0C0C0' }}>
                            STATUS:
                        </span>
                        <span className="text-[12px] font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--code-cyan)' }}>
                            OPTIMIZED
                        </span>
                    </div>

                </div>
            </div>

            {/* Navbar Styles */}
            <style jsx>{`
                .nav-link:hover {
                    color: #9D00FF !important;
                }
                
                @keyframes flicker {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                @keyframes divider-pulse {
                    0%, 100% { color: rgba(157, 0, 255, 0.4); text-shadow: 0 0 5px rgba(157, 0, 255, 0.2); }
                    33% { color: rgba(0, 255, 255, 0.6); text-shadow: 0 0 8px rgba(0, 255, 255, 0.4); }
                    66% { color: rgba(255, 0, 204, 0.6); text-shadow: 0 0 8px rgba(255, 0, 204, 0.4); }
                }

                .animate-divider-pulse {
                    animation: divider-pulse 4s linear infinite;
                    font-weight: bold;
                }
                
                .prefix {
                    display: inline-block;
                    margin-right: 4px;
                }
                
                .group:hover .prefix {
                    animation: flicker 0.3s ease-in-out 2;
                    color: #9D00FF;
                }

                @keyframes nebula-pulse {
                    0%, 100% { transform: scale(1.5); opacity: 0.2; }
                    50% { transform: scale(1.8); opacity: 0.4; }
                }

                .animate-nebula-pulse {
                    animation: nebula-pulse 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}