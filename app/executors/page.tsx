'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';
import LiveTracker from '../components/LiveTracker';

export default function ExecutorsPage() {
    return (
        <div className="min-h-screen w-full relative bg-[#0a0a0f] text-white selection:bg-[#9D00FF]/30">
            
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(106,13,173,0.15),transparent_70%)]" />
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }} />
            </div>

            {/* Header */}
            <header className="relative z-10 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-gray-400 hover:text-white transition-colors">
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[var(--code-cyan)]/20 border border-white/5 group-hover:border-[var(--code-cyan)]/50 transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-mono text-sm uppercase tracking-widest">Back to Hub</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Terminal size={24} className="text-[var(--code-cyan)]" />
                        <span className="font-black tracking-widest uppercase text-xl">Executors</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 flex flex-col items-center pt-8">
                <LiveTracker />
            </main>
        </div>
    );
}
