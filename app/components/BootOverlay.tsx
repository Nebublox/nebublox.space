'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

interface BootOverlayProps {
    onBootComplete: () => void;
}

const LUA_SCRIPT = [
    { text: 'print("INITIALIZING NEBUBLOX...")', color: '#00FFFF' },
    { text: 'wait(1)', color: '#9D00FF' },
    { text: 'local Core = require(game.ServerStorage.Nebula)', color: '#00FFFF' },
    { text: '-- BYPASSING REALITY ANCHORS...', color: '#9D00FF' },
    { text: 'Core:Load("User_Auth")', color: '#00FFFF' },
    { text: 'print("SUCCESS.")', color: '#9D00FF' }
];

export default function BootOverlay({ onBootComplete }: BootOverlayProps) {
    const [bootState, setBootState] = useState<'idle' | 'executing' | 'flash' | 'hidden'>('idle');
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/boot_sequence.mp3');
        audioRef.current.preload = 'auto';

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
        }
    }, []);

    const playClick = () => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    };

    const handleRunScript = async () => {
        setBootState('executing');
        for (let i = 0; i < LUA_SCRIPT.length; i++) {
            const line = LUA_SCRIPT[i];
            const fullText = line.text;
            setDisplayedLines(prev => [...prev, '']);
            for (let j = 0; j < fullText.length; j++) {
                setDisplayedLines(prev => {
                    const newLines = [...prev];
                    newLines[i] = fullText.slice(0, j + 1);
                    return newLines;
                });
                playClick();
                await new Promise(r => setTimeout(r, 20));
            }
            await new Promise(r => setTimeout(r, 100)); // Slightly faster
        }
        handleFlash();
    };

    const handleFlash = () => {
        setBootState('flash');

        if (audioRef.current) {
            audioRef.current.volume = 1.0;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }

        setTimeout(() => {
            onBootComplete();
        }, 1200);

        setTimeout(() => {
            setBootState('hidden');
        }, 2500);
    };

    if (bootState === 'hidden') return null;

    return (
        <div
            className="fixed top-0 left-0 w-full h-full z-[9999] overflow-hidden flex flex-col items-center justify-center font-mono selection:bg-singularity/30"
            style={{
                backgroundColor: bootState === 'flash' ? 'transparent' : '#000000',
                pointerEvents: bootState === 'flash' ? 'none' : 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
        >
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
                @keyframes pulse-cyan {
                    0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.4); transform: scale(1); }
                    50% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.7); transform: scale(1.05); }
                }
                .animate-pulse-cyan {
                    animation: pulse-cyan 3s ease-in-out infinite;
                }
            `}</style>

            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                    transition: 'transform 2.5s cubic-bezier(0.7, 0, 0.3, 1), opacity 2.5s ease-in',
                    transform: bootState === 'flash' ? 'scale(30)' : 'scale(1)',
                    opacity: bootState === 'flash' ? 0 : 1,
                    transformOrigin: 'center center'
                }}
            >
                {/* 1. Background Layer (Black) */}
                <div className="absolute inset-0 bg-[#000000] w-full h-full" />

                {/* 2. Nebula Burst Core */}
                <div
                    className="absolute w-[500px] h-[500px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(157,0,255,1) 0%, rgba(0,255,255,0.4) 30%, rgba(157,0,255,0) 70%)',
                        opacity: bootState === 'flash' ? 1 : 0,
                        transition: 'opacity 0.2s'
                    }}
                />

                {/* 3. The Content (Terminal) */}
                <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col items-start bg-black/60 backdrop-blur-md p-8 rounded border border-code-cyan/20 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                    {displayedLines.map((line, index) => (
                        <div key={index} className="text-lg md:text-xl font-mono whitespace-pre-wrap text-left mb-1">
                            <span style={{ color: LUA_SCRIPT[index]?.color === '#00CC66' ? '#00FFFF' : LUA_SCRIPT[index]?.color || '#fff' }}>{line}</span>
                        </div>
                    ))}
                    {/* Fake Cursor */}
                    {displayedLines.length > 0 && bootState !== 'flash' && (
                        <div className="w-2.5 h-6 bg-code-cyan animate-pulse mt-1" />
                    )}
                </div>
            </div>

            {/* IDLE STATE: Play Button */}
            {bootState === 'idle' && (
                <button
                    onClick={handleRunScript}
                    className="relative z-20 flex flex-col items-center gap-4 group transition-all duration-300"
                >
                    <div className="w-24 h-24 rounded-full bg-void border-2 border-code-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.3)] group-hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] transition-all animate-pulse-cyan">
                        <Play size={48} className="text-code-cyan ml-2 fill-code-cyan" />
                    </div>
                    <span className="text-code-cyan font-bold tracking-[0.3em] text-xl drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">RUN SCRIPT</span>
                </button>
            )}
        </div>
    );
}
