'use client';

import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import BlackHoleLogo from '../components/BlackHoleLogo';
import SystemFooter from '../components/SystemFooter';
import HologramAssistant from '../components/HologramAssistant';

export default function GetKeyPage() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simple entry animation trigger
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center">

            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(157, 0, 255, 0.4) 0%, transparent 70%)',
                        filter: 'blur(80px)'
                    }}
                />
            </div>

            <main className="relative z-10 w-full max-w-4xl px-6 pt-32 pb-20 flex flex-col items-center text-center">

                {/* Header Section */}
                <div className={`transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="mb-8 flex justify-center">
                        <BlackHoleLogo size={120} />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-[0.2em] uppercase mb-4 text-white" style={{ fontFamily: 'Orbitron' }}>
                        Access <span className="text-singularity drop-shadow-[0_0_15px_rgba(157,0,255,0.8)]">Terminal</span>
                    </h1>

                    <p className="text-gray-400 font-mono tracking-widest text-sm md:text-base max-w-2xl mx-auto mb-12 uppercase">
                        Initialize secure handshake via Jnkie to generate your unique session key.
                    </p>
                </div>

                {/* Main Action Card */}
                <div
                    className={`w-full max-w-2xl glass-cosmic p-8 md:p-12 relative overflow-hidden transition-all duration-1000 delay-300 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{
                        border: '1px solid rgba(88, 28, 135, 0.6)', // Dark purple outline
                        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(88, 28, 135, 0.2)'
                    }}
                >
                    {/* Animated Border Effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-singularity/20 to-transparent animate-nebula-border" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-singularity/10 border border-singularity/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(157,0,255,0.2)]">
                            <Key size={32} className="text-singularity animate-pulse" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-6 tracking-wider uppercase" style={{ fontFamily: 'Orbitron' }}>
                            Nebublox.Official Protocol
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-10 text-left">
                            <div className="bg-white/5 p-4 rounded border border-white/10 flex flex-col items-center text-center">
                                <ShieldCheck size={20} className="text-code-cyan mb-2" />
                                <span className="text-[10px] font-mono uppercase text-gray-400">Secure</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded border border-white/10 flex flex-col items-center text-center">
                                <Zap size={20} className="text-yellow-400 mb-2" />
                                <span className="text-[10px] font-mono uppercase text-gray-400">Instant</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded border border-white/10 flex flex-col items-center text-center">
                                <ExternalLink size={20} className="text-purple-400 mb-2" />
                                <span className="text-[10px] font-mono uppercase text-gray-400">Verified</span>
                            </div>
                        </div>

                        {/* JNKIE CTA */}
                        <a
                            href="https://jnkie.com/get-key/fremium"
                            className="bg-singularity hover:bg-singularity/80 text-white font-bold py-4 px-10 rounded uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(157,0,255,0.6)] group relative z-50 cursor-pointer"
                        >
                            Generate Key
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </a>

                        <p className="mt-8 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                            Current Status: <span className="text-code-cyan">Operational</span> | Handshake Ready
                        </p>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className={`mt-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <a href="/" className="text-gray-400 hover:text-white transition-colors uppercase font-mono text-xs tracking-[0.3em] flex items-center gap-2">
                        ← Return to Terminal
                    </a>
                </div>

            </main>

            <SystemFooter />
            <HologramAssistant />
        </div>
    );
}
