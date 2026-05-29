'use client';

import React from 'react';
import Image from 'next/image';

export default function TeamSection() {
    return (
        <section className="w-full max-w-4xl mx-auto py-20 px-6 border-t border-white/5">
            <div className="text-center mb-16">
                <span className="text-singularity font-mono text-sm tracking-widest uppercase mb-2 block">The Architect</span>
                <h2 className="text-4xl font-black text-starlight tracking-tight">
                    Team
                </h2>
            </div>
            
            <div className="flex justify-center">
                <div className="glass-cosmic p-6 rounded-2xl border border-white/10 hover:border-singularity/50 transition-all duration-500 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 group max-w-sm w-full bg-white/5 backdrop-blur-md">
                    <div className="relative w-24 h-24 shrink-0 rounded-full overflow-hidden border-2 border-singularity/30 group-hover:border-singularity transition-colors shadow-[0_0_15px_rgba(157,0,255,0.2)]">
                        <Image
                            src="/nebublox-avatar.png"
                            alt="Nebublox"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:drop-shadow-[0_0_10px_rgba(157,0,255,0.8)] transition-all uppercase tracking-widest">Nebublox</h3>
                        <p className="text-[var(--code-cyan)] text-xs font-mono uppercase tracking-widest mb-3 font-bold">Founder / Owner</p>
                        <div className="flex justify-center sm:justify-start gap-4">
                            <a href="https://discord.gg/nebublox" target="_blank" rel="noreferrer" className="text-white/40 hover:text-code-cyan transition-colors" aria-label="Discord">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" /></svg>
                            </a>
                            <a href="https://youtube.com/@nebublox" target="_blank" rel="noreferrer" className="text-white/40 hover:text-red-500 transition-colors" aria-label="YouTube">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
