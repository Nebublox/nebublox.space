'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/*
 * CINEMATIC HERO - REFINED
 * 
 * - Floating Wizard (Levitating)
 * - Typed "SHAPE THE VOID" Title (Immediate start)
 * - Corrected Subtitle (The first AI Architect...)
 * - "SCROLL TO EXPLORE" Hint (pushed down)
 */

interface CinematicHeroProps {
    isRevealed?: boolean;
}

export default function CinematicHero({ isRevealed = false }: CinematicHeroProps) {
    const [titleText, setTitleText] = useState('');
    const fullTitle = "SHAPE THE VOID";

    // Audio Refs
    const audioContextRef = useRef<AudioContext | null>(null);

    // Audio Setup
    useEffect(() => {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
        }
    }, []);

    const playTypingSound = (frequency = 800, type: 'sine' | 'square' = 'sine') => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(frequency / 2, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    };

    // Sequencing Logic
    useEffect(() => {
        if (isRevealed) {
            // Start Title Typing Immediately (since Welcome is gone)
            let tIndex = 0;
            const titleTimer = setInterval(() => {
                if (tIndex < fullTitle.length) {
                    setTitleText(fullTitle.slice(0, tIndex + 1));
                    playTypingSound(150 + Math.random() * 50, 'square'); // Heavy clicks
                    tIndex++;
                } else {
                    clearInterval(titleTimer);
                }
            }, 100); // Slow heavy typing

            return () => {
                clearInterval(titleTimer);
            };
        } else {
            setTitleText('');
        }
    }, [isRevealed]);
    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[50vh] w-full" style={{ marginTop: '60px' }}>

            {/* Hero Glow Effect */}
            <div
                className="absolute pointer-events-none opacity-40 transition-opacity duration-1000"
                style={{
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(ellipse at center, rgba(157, 0, 255, 0.3) 0%, rgba(157, 0, 255, 0.1) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                    zIndex: 10,
                    top: '0%',
                    animation: 'glow-breath 4s ease-in-out infinite'
                }}
            />

            {/* Levitating Wizard */}
            <div
                className="levitating-wizard relative z-20 mb-8 w-[350px] h-[350px] md:w-[500px] md:h-[500px] pointer-events-none"
                style={{
                    animation: 'levitate 6s ease-in-out infinite',
                    marginTop: '260px'
                }}
            >
                <Image
                    src="/nebu-guardian.png"
                    alt="Nebublox Lord"
                    fill
                    className="object-contain drop-shadow-[0_0_50px_rgba(157,0,255,0.8)] relative z-20 -translate-x-64 md:-translate-x-[360px]"
                    priority
                />

                {/* Premium UI Mockup - Hologram Screen (Behind & Right) */}
                <div
                    className="absolute left-[5%] md:left-[10%] top-[30%] md:top-[5%] -translate-y-1/2 w-[380px] md:w-[780px] aspect-[16/10] z-10 transition-all duration-1000 group cursor-pointer"
                    style={{
                        opacity: isRevealed ? 1 : 0,
                        transform: isRevealed
                            ? 'translateY(-50%) perspective(1500px) rotateY(-18deg) rotateX(8deg) rotateZ(-1deg)'
                            : 'translateY(-40%) perspective(1500px) rotateY(0deg) rotateX(0deg)',
                        filter: 'drop-shadow(0 0 60px rgba(0, 255, 255, 0.2)) drop-shadow(0 0 30px rgba(255,0,204,0.15))',
                        animation: 'levitate 8s ease-in-out infinite alternate-reverse'
                    }}
                >
                    <div className="relative w-full h-full p-[2px] rounded-2xl bg-gradient-to-br from-code-cyan via-singularity to-code-pink shadow-[0_0_50px_rgba(0,255,255,0.15)] transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2 group-hover:shadow-[0_0_100px_rgba(0,255,255,0.4)] z-20">
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-md rounded-2xl" />

                        {/* Image Container */}
                        <div className="relative w-full h-full overflow-hidden rounded-xl bg-black">
                            <Image
                                src="/nebublox_ad_hd.png"
                                alt="Nebublox Premium UI"
                                fill
                                className="object-contain relative z-10 p-1 opacity-95 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            {/* Glow pulse inside */}
                            <div className="absolute inset-0 bg-code-cyan/5 animate-pulse z-0 group-hover:bg-code-cyan/15 transition-colors duration-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Redesigned Technical HUD Specs - Now Integrated INSIDE the mockup flow to prevent side-clipping */}
                    <div className="absolute top-[35%] -right-12 md:-right-24 w-[240px] md:w-[320px] z-30 transition-all duration-1000 opacity-90 group-hover:opacity-100 group-hover:translate-x-2">
                        <div className="space-y-4 font-mono pointer-events-none">
                            <div className="flex flex-col gap-1 border-l-2 border-code-cyan pl-4 py-2 bg-black/60 backdrop-blur-md">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-code-cyan animate-pulse" />
                                    <span className="text-code-cyan text-[10px] uppercase tracking-[0.4em] font-black">System Profile</span>
                                </div>
                                <span className="text-starlight text-xs md:text-base font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">NEBULA_ENGINE_V1</span>
                            </div>

                            <div className="space-y-3 pl-4 bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-r-xl">
                                {[
                                    { label: 'Latency', val: '0.004ms', color: 'text-code-cyan', progress: '94%' },
                                    { label: 'Security', val: 'HARDENED', color: 'text-code-pink', progress: '100%' },
                                    { label: 'Network', val: 'SYNCED', color: 'text-singularity', progress: '88%' }
                                ].map((spec, i) => (
                                    <div key={i} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-starlight/60 font-bold">
                                            <span>{spec.label}</span>
                                            <span className={`${spec.color} font-black`}>{spec.val}</span>
                                        </div>
                                        <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-current transition-all duration-1000 ease-out"
                                                style={{
                                                    width: spec.progress,
                                                    color: spec.color.includes('cyan') ? '#00FFFF' : spec.color.includes('pink') ? '#FF00CC' : '#9D00FF',
                                                    boxShadow: `0 0 10px ${spec.color.includes('cyan') ? '#00FFFF' : spec.color.includes('pink') ? '#FF00CC' : '#9D00FF'}`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 pl-4">
                                <div className="flex gap-2 items-center opacity-40 hover:opacity-100 transition-opacity">
                                    <div className="w-1 h-3 bg-code-cyan" />
                                    <span className="text-[9px] text-starlight font-bold tracking-[0.3em] uppercase">Status: Optimal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Title (Central, Massive) */}
            <div className="text-center z-30 flex flex-col items-center min-h-[100px]">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-0"
                    style={{
                        color: '#FF00CC',
                        textShadow: '0 0 20px rgba(255, 0, 204, 0.5), 0 0 40px rgba(157, 0, 255, 0.3)',
                        fontFamily: 'Exo 2, sans-serif'
                    }}
                >
                    {titleText}
                    {/* Blinking Cursor */}
                    {titleText.length < fullTitle.length && (
                        <span className="inline-block w-4 h-12 bg-[#FF00CC] ml-2 animate-pulse align-bottom" style={{ boxShadow: '0 0 20px #FF00CC' }} />
                    )}
                </h1>

                <div
                    className="max-w-[700px] px-4 transition-all duration-1000 ease-out mt-5"
                    style={{
                        opacity: titleText.length === fullTitle.length ? 1 : 0,
                        transform: titleText.length === fullTitle.length ? 'translateY(0)' : 'translateY(10px)',
                        transitionDelay: '300ms'
                    }}
                >
                    <div
                        className="text-sm font-mono leading-relaxed text-center space-y-4"
                        style={{ color: '#CCCCCC' }}
                    >
                        <p className="text-starlight/80 font-mono text-lg uppercase tracking-[0.3em] font-bold mt-4">
                            Your favorite Roblox scripts
                        </p>
                        <p className="text-code-cyan font-bold tracking-widest">❖ INITIALIZING NEBUBLOX ARCHIVES...</p>
                        <p className="text-starlight">[ STATUS: <span className="text-code-cyan">ONLINE</span> ]</p>
                    </div>
                </div>

                {/* 4. Scroll Hint (Pushed Up) */}
                <div
                    className="text-center mt-12 mb-6 transition-opacity duration-1000 flex flex-col items-center gap-4"
                    style={{
                        opacity: titleText.length === fullTitle.length ? 1 : 0,
                        transitionDelay: '600ms'
                    }}
                >
                    <span className="text-[10px] md:text-sm font-mono tracking-[0.4em] text-starlight/60 uppercase flex items-center gap-6">
                        <span className="text-code-cyan animate-pulse">{'>>'}</span>
                        Scroll to Explore
                        <span className="text-code-cyan animate-pulse">{'<<'}</span>
                    </span>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-starlight/50 to-transparent mx-auto mt-2" />

                    {/* Robot Section with Dark Matter Polish */}
                    <div
                        className="mt-4 relative flex flex-col items-center justify-center transition-all duration-500"
                        style={{
                            opacity: titleText.length === fullTitle.length ? 1 : 0,
                            transitionDelay: '800ms'
                        }}
                    >
                        {/* Above Text */}
                        <span className="text-singularity font-bold text-lg tracking-[0.4em] uppercase mb-4 animate-pulse" style={{ fontFamily: 'Orbitron' }}>
                            DarkMatterV1
                        </span>

                        <div className="relative flex items-center justify-center">
                            {/* Robot Glow Effect */}
                            <div
                                className="absolute pointer-events-none opacity-30"
                                style={{
                                    width: '300px',
                                    height: '300px',
                                    background: 'radial-gradient(ellipse at center, rgba(157, 0, 255, 0.4) 0%, transparent 70%)',
                                    filter: 'blur(30px)',
                                    zIndex: 1,
                                    animation: 'glow-breath 4s ease-in-out infinite 1s'
                                }}
                            />
                            <img
                                src="/darkmatter-robot.png"
                                alt="DarkMatter Bot"
                                className="w-48 h-48 object-contain relative z-10 dark-matter-bot"
                            />
                        </div>

                        {/* Under Text */}
                        <p className="mt-6 text-starlight/60 font-mono text-[10px] uppercase tracking-[0.2em] max-w-md text-center">
                            powering nebublox Engine with black matter from the nebula to give you the best scripts possible.
                        </p>
                    </div>

                    {/* Project Description & Social CTAs */}
                    <div
                        className="glass-cosmic max-w-4xl mx-auto mt-16 p-10 space-y-10"
                        style={{
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                        }}
                    >
                        <div className="space-y-6 text-center">
                            <p className="text-starlight/90 leading-relaxed font-mono text-base">
                                Nebublox is a <span className="text-code-cyan">premium Roblox script hub</span> designed to take your gaming experience to the next level. As a solo-developed passion project, every script and feature is crafted with care to ensure top-tier quality and performance. Whether you're looking for powerful new tools or a place to connect with fellow Roblox enthusiasts in our themed channels, Nebublox has you covered.
                            </p>
                        </div>

                        <div className="space-y-8 pt-8 border-t border-white/5">
                            <p className="text-starlight/60 font-mono text-xs uppercase tracking-widest text-center">
                                For support, script updates, or access, make sure to:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Link
                                    href="https://darkmatterv1-1.onrender.com"
                                    className="group flex flex-col items-start gap-2 p-5 rounded border border-code-cyan/50 hover:border-code-cyan bg-code-cyan/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-code-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-2 relative z-10">
                                        <div className="w-2 h-2 rounded-full bg-code-cyan animate-pulse" />
                                        <span className="text-code-cyan font-black text-xs uppercase tracking-[0.3em] group-hover:drop-shadow-[0_0_10px_rgba(0,191,255,0.8)]">ENROLL IN DARKMATTER</span>
                                    </div>
                                    <span className="text-starlight/70 text-[11px] leading-tight text-left relative z-10 font-mono">Gain the [VOID WALKER] role and initiate the celestial verification sequence.</span>
                                </Link>

                                <Link
                                    href="https://youtube.com/@nebublox"
                                    target="_blank"
                                    className="group flex flex-col items-start gap-2 p-5 rounded border border-white/5 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(255,0,0,0.15)] transition-all duration-300 bg-white/5 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-2 relative z-10">
                                        <span className="text-red-500 font-bold text-xs uppercase tracking-wider group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]">Subscribe on YouTube</span>
                                    </div>
                                    <span className="text-starlight/50 text-[11px] leading-tight text-left relative z-10 font-mono">Watch showcases, tutorials, and the latest news on upcoming scripts.</span>
                                </Link>

                                <Link
                                    href="/sloyd"
                                    className="group flex flex-col items-start gap-2 p-5 rounded border border-white/5 hover:border-[#FE43B2]/50 hover:shadow-[0_0_20px_rgba(254,67,178,0.15)] transition-all duration-300 bg-white/5 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FE43B2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#1A98F1]/10 border-l border-b border-[#1A98F1]/20 z-10">
                                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#1A98F1]">Partner</span>
                                    </div>
                                    <div className="flex items-center gap-2 relative z-10">
                                        <span className="text-[#FE43B2] font-bold text-xs uppercase tracking-wider group-hover:drop-shadow-[0_0_10px_rgba(254,67,178,0.6)]">🔨 Build 3D Models with Sloyd</span>
                                    </div>
                                    <span className="text-starlight/50 text-[11px] leading-tight text-left relative z-10 font-mono">Turn ideas into 3D models in seconds with AI — no Blender skills needed. Exclusive 60% OFF for Void Walkers.</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes levitate {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                @keyframes glow-breath {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.1); opacity: 0.5; }
                }

                .dark-matter-bot {
                    filter: drop-shadow(0 0 15px rgba(75, 0, 130, 0.8)) drop-shadow(0 0 30px rgba(148, 0, 211, 0.6));
                    animation: 
                        dark-matter-pulse 2.5s infinite alternate ease-in-out, 
                        bot-hover 4s infinite ease-in-out;
                }

                @keyframes dark-matter-pulse {
                    0% {
                        filter: drop-shadow(0 0 10px rgba(75, 0, 130, 0.5)) drop-shadow(0 0 20px rgba(148, 0, 211, 0.3));
                    }
                    100% {
                        filter: drop-shadow(0 0 25px rgba(75, 0, 130, 1)) drop-shadow(0 0 60px rgba(160, 32, 240, 0.9));
                    }
                }

                @keyframes bot-hover {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
}
