'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import Image from 'next/image';
import BootOverlay from './components/BootOverlay';
import CinematicHero from './components/CinematicHero';
import BlackHoleLogo from './components/BlackHoleLogo';
import ScriptsGrid from './components/ScriptsGrid';
import SystemFooter from './components/SystemFooter';
import HologramAssistant from './components/HologramAssistant';

export default function HomePage() {
    const [isBooted, setIsBooted] = useState(false);

    useEffect(() => {
        if (!isBooted) {
            document.body.classList.add('boot-locked');
        } else {
            document.body.classList.remove('boot-locked');
        }
    }, [isBooted]);

    return (
        <div className="min-h-screen w-full relative">

            {/* THE BOOT OVERLAY (The Curtain) */}
            <BootOverlay onBootComplete={() => setIsBooted(true)} />

            {/* Main Content */}
            <main
                className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6"
                style={{ paddingTop: '100px', paddingBottom: '40px' }}
            >

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center max-w-none mb-4 w-full">

                    {/* Large Nebula Logo */}
                    <div
                        className={`absolute opacity-20 pointer-events-none transition-opacity duration-1000 ${isBooted ? 'opacity-20' : 'opacity-0'}`}
                        style={{ marginTop: '-100px' }}
                    >
                        <BlackHoleLogo size={400} />
                    </div>

                    {/* Purple Glow */}
                    <div
                        className={`absolute pointer-events-none transition-opacity duration-1000 ${isBooted ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            width: '800px',
                            height: '400px',
                            background: 'radial-gradient(ellipse at center, rgba(106, 13, 173, 0.6) 0%, rgba(106, 13, 173, 0.3) 30%, transparent 70%)',
                            filter: 'blur(60px)',
                            marginTop: '-50px'
                        }}
                    />

                    {/* Static Hero (Underneath Overlay) */}
                    <div className="relative z-10 w-full" style={{ marginBottom: '40px' }}>
                        <CinematicHero isRevealed={isBooted} />
                    </div>

                </div>

                {/* Rest of the Site - Fades In Upon Boot */}
                <div className={`w-full max-w-7xl mx-auto flex flex-col items-center transition-all duration-1000 ${isBooted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                </div>

            </main>

            {/* System Footer */}
            <SystemFooter />

            {/* Hologram Assistant Widget */}
            <HologramAssistant />

        </div>
    );
}
