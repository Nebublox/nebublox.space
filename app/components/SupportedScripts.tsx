'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const SCRIPTS = [
    { 
        name: 'World Fighters', 
        image: 'https://tr.rbxcdn.com/180DAY-5ed6a5c2524955a6e2d9bea09cda62f8/512/512/Image/Png/noFilter', 
        tag: 'ONLINE', 
        isUpdated: true,
        robloxUrl: 'https://www.roblox.com/games/95630541662383/EVENT-World-Fighters'
    },
    { 
        name: 'Anime Heroes', 
        image: 'https://tr.rbxcdn.com/180DAY-41f1624f8ad6d0aa09cb94dc92bf4d14/512/512/Image/Png/noFilter', 
        tag: 'ONLINE', 
        isUpdated: true,
        isDiscontinued: true,
        robloxUrl: 'https://www.roblox.com/games/74578002631923/JJK-Anime-Heroes'
    },
    { 
        name: 'Anime Astral', 
        image: 'https://tr.rbxcdn.com/180DAY-6cc5daaafc9b0d986b3018c4d0f3f706/512/512/Image/Png/noFilter', 
        tag: 'ONLINE', 
        isUpdated: true,
        isDiscontinued: false,
        robloxUrl: 'https://www.roblox.com/games/109606232274503/Anime-Astral-Simulator'
    },
    { 
        name: 'Anime Leveling', 
        image: 'https://tr.rbxcdn.com/180DAY-a795516e3aba82ca4edceb6987f67f6d/512/512/Image/Png/noFilter', 
        tag: 'ONLINE', 
        isUpdated: true,
        isDiscontinued: true,
        robloxUrl: 'https://www.roblox.com/games/78754030900809/Anime-Leveling'
    },
];

export default function SupportedScripts() {
    return (
        <section className="w-full max-w-6xl mx-auto py-20 px-6">
            <div className="text-center mb-16">
                <span className="text-[var(--code-cyan)] font-mono text-sm tracking-widest uppercase mb-2 block">Powered by Nebula</span>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}>
                    Supported Experiences
                </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {SCRIPTS.map((script, idx) => (
                    <a 
                        key={idx} 
                        href={script.robloxUrl}
                        target={script.robloxUrl !== '#' ? "_blank" : undefined}
                        rel={script.robloxUrl !== '#' ? "noopener noreferrer" : undefined}
                        className={`group relative rounded-xl overflow-hidden aspect-[4/3] border ${script.isUpdated ? 'border-white/10 hover:border-white/30' : 'border-red-500/10 hover:border-red-500/30'} transition-all duration-500 cursor-pointer block`}
                    >
                        <div className={`absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500 z-10 ${!script.isUpdated ? 'grayscale opacity-70' : ''}`} />
                        <img
                            src={script.image}
                            alt={script.name}
                            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${!script.isUpdated ? 'grayscale' : ''}`}
                        />
                        <div className="absolute top-3 right-3 z-20">
                            <span className={`px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border text-[10px] font-bold font-mono tracking-wider shadow-lg ${script.isUpdated ? 'border-white/10 text-[var(--code-cyan)] shadow-[0_0_10px_rgba(0,255,255,0.2)]' : 'border-red-500/20 text-red-400'}`}>
                                {script.tag}
                            </span>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className={`text-lg font-bold mb-1 transition-colors flex items-center gap-2 ${script.isUpdated ? 'text-white group-hover:text-[var(--code-cyan)]' : 'text-gray-300'}`}>
                                {script.name}
                            </h3>
                            {script.isDiscontinued && (
                                <span className="text-orange-400 text-[10px] font-mono font-bold tracking-widest uppercase bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 mb-2 inline-block">
                                    Discontinued
                                </span>
                            )}
                            <div className={`w-8 h-1 rounded-full group-hover:w-16 transition-all duration-300 ${script.isUpdated ? 'bg-[var(--code-cyan)] shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'bg-red-500/50'}`} />
                        </div>
                    </a>
                ))}
            </div>

            <div className="flex justify-center">
                <Link href="/games" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:border-[var(--code-cyan)]/50 hover:bg-white/10 rounded-full transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--code-cyan)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                    <span className="font-mono text-sm uppercase tracking-widest text-white group-hover:text-[var(--code-cyan)] transition-colors relative z-10">
                        View Full Library
                    </span>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-[var(--code-cyan)] group-hover:translate-x-1 transition-all relative z-10" />
                </Link>
            </div>
        </section>
    );
}
