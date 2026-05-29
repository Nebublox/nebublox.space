'use client';

import React from 'react';
import { ShieldAlert, RefreshCw, Users } from 'lucide-react';

export default function FeaturesGrid() {
    return (
        <section className="w-full max-w-6xl mx-auto py-20 px-6">
            <div className="text-center mb-16">
                <span className="text-code-cyan font-mono text-sm tracking-widest uppercase mb-2 block">Why Nebublox?</span>
                <h2 className="text-4xl md:text-5xl font-black text-starlight tracking-tight" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
                    Built for daily use
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-cosmic p-8 rounded-2xl border border-white/10 hover:border-code-cyan/50 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-code-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <ShieldAlert className="w-12 h-12 text-code-cyan mb-6 group-hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] transition-all" />
                    <h3 className="text-xl font-bold text-starlight mb-4">Stable and secure</h3>
                    <p className="text-starlight/60 text-sm leading-relaxed font-mono relative z-10">
                        Built with stability and safety in mind, keeping the experience smooth, reliable and easy to trust.
                    </p>
                </div>
                
                <div className="glass-cosmic p-8 rounded-2xl border border-white/10 hover:border-singularity/50 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-singularity/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <RefreshCw className="w-12 h-12 text-singularity mb-6 group-hover:drop-shadow-[0_0_15px_rgba(157,0,255,0.8)] transition-all" />
                    <h3 className="text-xl font-bold text-starlight mb-4">Weekly improvements</h3>
                    <p className="text-starlight/60 text-sm leading-relaxed font-mono relative z-10">
                        New features, fixes and supported scripts are added frequently so the hub keeps evolving.
                    </p>
                </div>
                
                <div className="glass-cosmic p-8 rounded-2xl border border-white/10 hover:border-code-pink/50 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-code-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Users className="w-12 h-12 text-code-pink mb-6 group-hover:drop-shadow-[0_0_15px_rgba(255,0,204,0.8)] transition-all" />
                    <h3 className="text-xl font-bold text-starlight mb-4">Users come first</h3>
                    <p className="text-starlight/60 text-sm leading-relaxed font-mono relative z-10">
                        Designed around the community, with user needs and suggestions guiding what gets improved next.
                    </p>
                </div>
            </div>
        </section>
    );
}
