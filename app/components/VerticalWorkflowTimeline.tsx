'use client';

import React from 'react';
import { Plug, Lock, Brain, Box } from 'lucide-react';

export default function VerticalWorkflowTimeline() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-6 mt-12">

            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2" style={{ fontFamily: 'Exo 2' }}>
                    EXECUTION PIPELINE
                </h2>
                <p className="text-starlight/60 font-mono tracking-[0.3em] text-sm uppercase">
                    FROM THOUGHT TO REALITY
                </p>
            </div>

            {/* Grid Layout (4 Columns) - Fits perfectly under Hero */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">

                {/* Phase 01 */}
                <div
                    className="group relative flex flex-col items-center text-center p-8 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]"
                    style={{
                        background: 'rgba(20, 20, 30, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-code-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <span className="text-code-cyan font-mono text-xs tracking-widest mb-4 opacity-70">PHASE 01</span>

                    <div className="w-16 h-16 rounded-full bg-code-cyan/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                        <Plug className="text-code-cyan w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-exo2">ESTABLISH UPLINK</h3>
                    <p className="text-starlight/70 font-mono text-xs leading-relaxed">
                        Inject the Nebublox Syntax node into Studio.
                    </p>
                </div>

                {/* Phase 02 */}
                <div
                    className="group relative flex flex-col items-center text-center p-8 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,0,204,0.2)]"
                    style={{
                        background: 'rgba(20, 20, 30, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-code-pink to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <span className="text-code-pink font-mono text-xs tracking-widest mb-4 opacity-70">PHASE 02</span>

                    <div className="w-16 h-16 rounded-full bg-code-pink/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                        <Lock className="text-code-pink w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-exo2">AUTHENTICATE</h3>
                    <p className="text-starlight/70 font-mono text-xs leading-relaxed">
                        Sync your neural signature.
                    </p>
                </div>

                {/* Phase 03 */}
                <div
                    className="group relative flex flex-col items-center text-center p-8 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(157,0,255,0.2)]"
                    style={{
                        background: 'rgba(20, 20, 30, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-singularity to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <span className="text-singularity font-mono text-xs tracking-widest mb-4 opacity-70">PHASE 03</span>

                    <div className="w-16 h-16 rounded-full bg-singularity/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                        <Brain className="text-singularity w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-exo2">DEFINE INTENT</h3>
                    <p className="text-starlight/70 font-mono text-xs leading-relaxed">
                        Speak your vision to the Nebula Engine.
                    </p>
                </div>

                {/* Phase 04 */}
                <div
                    className="group relative flex flex-col items-center text-center p-8 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]"
                    style={{
                        background: 'rgba(20, 20, 30, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <span className="text-white font-mono text-xs tracking-widest mb-4 opacity-70">PHASE 04</span>

                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                        <Box className="text-white w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-exo2">MATERIALIZE</h3>
                    <p className="text-starlight/70 font-mono text-xs leading-relaxed">
                        Assets weave themselves into reality.
                    </p>
                </div>

            </div>

        </section>
    );
}
