'use client';

import React, { useState, useEffect } from 'react';
import { Shield, UserCheck, Key, ArrowRight, Fingerprint } from 'lucide-react';
import BlackHoleLogo from '../components/BlackHoleLogo';
import SystemFooter from '../components/SystemFooter';
import HologramAssistant from '../components/HologramAssistant';

export default function VerifyPage() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center">

            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, rgba(157, 0, 255, 0.2) 40%, transparent 70%)',
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
                        Soul <span className="text-code-cyan" style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8))' }}>Binding</span>
                    </h1>

                    <p className="text-gray-400 font-mono tracking-widest text-sm md:text-base max-w-2xl mx-auto mb-12 uppercase">
                        Authenticate your Discord identity to bind your soul to the Nebublox Nexus and unlock all scripts.
                    </p>
                </div>

                {/* Verification Protocol Steps */}
                <div className={`w-full max-w-2xl mb-12 transition-all duration-1000 delay-200 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex items-center gap-4 p-4 rounded" style={{ border: '1px solid rgba(0, 255, 255, 0.2)', backgroundColor: 'rgba(0, 255, 255, 0.03)' }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(0, 255, 255, 0.08)', border: '1px solid rgba(0, 255, 255, 0.3)' }}>
                                <span className="text-code-cyan font-bold text-sm" style={{ fontFamily: 'Orbitron' }}>1</span>
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-xs font-black uppercase tracking-widest text-white">Discord Authentication</h3>
                                <p className="text-[10px] text-gray-500 font-mono uppercase mt-1">Authorize via Discord OAuth to verify your identity</p>
                            </div>
                            <Shield size={18} style={{ color: 'rgba(0, 255, 255, 0.5)' }} className="flex-shrink-0" />
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-center gap-4 p-4 rounded" style={{ border: '1px solid rgba(157, 0, 255, 0.2)', backgroundColor: 'rgba(157, 0, 255, 0.03)' }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(157, 0, 255, 0.08)', border: '1px solid rgba(157, 0, 255, 0.3)' }}>
                                <span className="text-singularity font-bold text-sm" style={{ fontFamily: 'Orbitron' }}>2</span>
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-xs font-black uppercase tracking-widest text-white">Void Walker Binding</h3>
                                <p className="text-[10px] text-gray-500 font-mono uppercase mt-1">Receive the Void Walker 🌑 role in the Command Outpost</p>
                            </div>
                            <UserCheck size={18} style={{ color: 'rgba(157, 0, 255, 0.5)' }} className="flex-shrink-0" />
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-center gap-4 p-4 rounded" style={{ border: '1px solid rgba(255, 0, 204, 0.2)', backgroundColor: 'rgba(255, 0, 204, 0.03)' }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255, 0, 204, 0.08)', border: '1px solid rgba(255, 0, 204, 0.3)' }}>
                                <span className="text-code-pink font-bold text-sm" style={{ fontFamily: 'Orbitron' }}>3</span>
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-xs font-black uppercase tracking-widest text-white">Terminal Access</h3>
                                <p className="text-[10px] text-gray-500 font-mono uppercase mt-1">Sync with Jnkie and retrieve your script access key</p>
                            </div>
                            <Key size={18} style={{ color: 'rgba(255, 0, 204, 0.5)' }} className="flex-shrink-0" />
                        </div>
                    </div>
                </div>

                {/* Main CTA Card */}
                <div
                    className={`w-full max-w-2xl glass-cosmic p-8 md:p-12 relative overflow-hidden transition-all duration-1000 delay-300 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{
                        border: '1px solid rgba(0, 255, 255, 0.3)',
                        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.05)'
                    }}
                >
                    {/* Animated Border Effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-nebula-border" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8" style={{ backgroundColor: 'rgba(0, 255, 255, 0.06)', border: '1px solid rgba(0, 255, 255, 0.25)', boxShadow: '0 0 30px rgba(0, 255, 255, 0.15)' }}>
                            <Fingerprint size={32} className="text-code-cyan animate-pulse" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-4 tracking-wider uppercase" style={{ fontFamily: 'Orbitron' }}>
                            Verification Protocol
                        </h2>

                        <p className="text-gray-400 font-mono text-xs tracking-widest uppercase mb-8 max-w-md">
                            Click below to initiate the binding sequence. You will be redirected to Discord to authorize your identity.
                        </p>

                        {/* CTA Button */}
                        <a
                            href="/api/auth/verify"
                            id="begin-verification-btn"
                            className="text-white font-bold py-4 px-10 rounded uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-300 group relative z-50 cursor-pointer"
                            style={{
                                fontFamily: 'Orbitron',
                                background: 'linear-gradient(135deg, #00FFFF, #6A0DAD)',
                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0, 255, 255, 0.5)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)'; }}
                        >
                            <Shield size={20} />
                            Begin Verification
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </a>

                        <p className="mt-8 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                            Powered by <span className="text-code-cyan">Jnkie</span> Verification Protocol
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
