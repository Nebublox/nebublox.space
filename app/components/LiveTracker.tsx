'use client';

import React, { useEffect, useState } from 'react';
import { Terminal, Monitor, Smartphone, Apple, MonitorPlay } from 'lucide-react';

interface VersionData {
    windows: string;
    mac: string;
    android: string;
    ios: string;
    updatedAt: string;
}

export default function LiveTracker() {
    const [versions, setVersions] = useState<VersionData>({
        windows: 'version-460909c4fe904aae',
        mac: 'version-789d64d8ac264b79',
        android: '2.721.1108',
        ios: '2.721.1107',
        updatedAt: 'Loading...'
    });

    useEffect(() => {
        // Fix hydration error by setting the date strictly on the client side after mount
        setVersions(v => ({ ...v, updatedAt: new Date().toLocaleString() }));
        
        // Attempt to fetch live data from WEAO or generic proxy (Using dummy mock pattern for safety)
        // If WEAO has a public CORS-friendly endpoint, it would go here. 
        // For now we set state once to establish the UI structure as requested.
        const fetchVersions = async () => {
            try {
                // Mocking API delay
                await new Promise(r => setTimeout(r, 1000));
                // In production, you would fetch from: https://api.weao.xyz/ or similar
            } catch (err) {
                console.error("Failed to fetch live versions", err);
            }
        };
        fetchVersions();
    }, []);

    return (
        <section className="relative w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full border border-[var(--code-cyan)] bg-[var(--code-cyan)]/10 flex items-center gap-2 shrink-0">
                        <Terminal size={14} className="text-[var(--code-cyan)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--code-cyan)]">Live Executor Tracker</span>
                    </div>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter"
                    style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
                    EXECUTORS
                </h1>
                <p className="text-gray-400 font-mono text-sm uppercase tracking-widest mt-2 flex items-center gap-2">
                    Live executor status and Roblox versions
                    <span className="text-[var(--code-cyan)] mx-2">|</span>
                    Powered by <a href="https://whatexpsare.online/" target="_blank" rel="noopener noreferrer" className="text-[#9D00FF] hover:text-[#b033ff] underline underline-offset-4 font-bold transition-colors">WhatExpsAre.Online</a>
                </p>
            </div>

            {/* Version Tracking Cards */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--code-cyan)]/5 via-transparent to-[#9D00FF]/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full border border-white/20 bg-white/5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--code-cyan)] animate-pulse shadow-[0_0_10px_var(--code-cyan)]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Current Roblox Version</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {/* Windows */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-white font-bold tracking-wider">
                                <Monitor size={16} />
                                <span>Windows</span>
                            </div>
                            <div className="bg-black/60 border border-white/5 rounded-lg p-3 text-sm font-mono text-gray-300">
                                {versions.windows}
                            </div>
                        </div>

                        {/* Mac */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-white font-bold tracking-wider">
                                <MonitorPlay size={16} />
                                <span>Mac</span>
                            </div>
                            <div className="bg-black/60 border border-white/5 rounded-lg p-3 text-sm font-mono text-gray-300">
                                {versions.mac}
                            </div>
                        </div>

                        {/* Android */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-white font-bold tracking-wider">
                                <Smartphone size={16} />
                                <span>Android</span>
                            </div>
                            <div className="bg-black/60 border border-white/5 rounded-lg p-3 text-sm font-mono text-gray-300">
                                {versions.android}
                            </div>
                        </div>

                        {/* iOS */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-white font-bold tracking-wider">
                                <Apple size={16} />
                                <span>iOS</span>
                            </div>
                            <div className="bg-black/60 border border-white/5 rounded-lg p-3 text-sm font-mono text-gray-300">
                                {versions.ios}
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pt-4 border-t border-white/5">
                        Last Updated: {versions.updatedAt}
                    </div>
                </div>
            </div>

            {/* Founder Suggestions */}
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-3">
                    <span className="w-[30px] h-px bg-gradient-to-r from-transparent to-[#9D00FF]" />
                    <h3 className="text-xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(157,0,255,0.5)]">
                        Founder's Suggestions
                    </h3>
                    <span className="w-full max-w-[200px] h-px bg-gradient-to-l from-transparent to-[#9D00FF]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Delta (Mobile) */}
                    <a href="https://delta-executor.com" target="_blank" rel="noopener noreferrer" 
                       className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#9D00FF]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(157,0,255,0.1)]">
                        <div className="flex flex-col">
                            <span className="text-[#9D00FF] text-[10px] font-black uppercase tracking-widest mb-1">Mobile Users</span>
                            <span className="text-white font-bold text-lg group-hover:text-[var(--code-cyan)] transition-colors">Delta</span>
                        </div>
                        <Smartphone size={24} className="text-gray-500 group-hover:text-white transition-colors" />
                    </a>

                    {/* Velocity (Free) */}
                    <a href="#" target="_blank" rel="noopener noreferrer" 
                       className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[var(--code-cyan)]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,255,255,0.1)]">
                        <div className="flex flex-col">
                            <span className="text-[var(--code-cyan)] text-[10px] font-black uppercase tracking-widest mb-1">Free Users</span>
                            <span className="text-white font-bold text-lg group-hover:text-[#9D00FF] transition-colors">Velocity</span>
                        </div>
                        <Terminal size={24} className="text-gray-500 group-hover:text-white transition-colors" />
                    </a>

                    {/* Potassium Lifetime (Paid) */}
                    <a href="#" target="_blank" rel="noopener noreferrer" 
                       className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#FF00CC]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,0,204,0.1)]">
                        <div className="flex flex-col">
                            <span className="text-[#FF00CC] text-[10px] font-black uppercase tracking-widest mb-1">Premium Users</span>
                            <span className="text-white font-bold text-lg group-hover:text-white transition-colors">Potassium <span className="font-light text-gray-400">Lifetime</span></span>
                        </div>
                        <MonitorPlay size={24} className="text-gray-500 group-hover:text-white transition-colors" />
                    </a>
                </div>
            </div>
            
        </section>
    );
}
