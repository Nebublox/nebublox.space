'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Gamepad2, Search, X, Copy, Check, Terminal } from 'lucide-react';

type ScriptStatus = 'online' | 'discontinued';

interface GameScript {
    name: string;
    lastUpdate: string;
    status: ScriptStatus;
    scriptFile: string;
    robloxUrl: string;
    isDiscontinued?: boolean;
}

const SCRIPTS: GameScript[] = [
    { name: 'World Fighters Nebublox', lastUpdate: 'Recently', status: 'online', scriptFile: 'World_Fighters_Nebublox.lua', robloxUrl: 'https://www.roblox.com/games/95630541662383/EVENT-World-Fighters' },
    { name: 'Anime Astral Nebublox', lastUpdate: 'Recently', status: 'online', scriptFile: 'Anime_Astral_Nebublox.lua', robloxUrl: 'https://www.roblox.com/games/109606232274503/Anime-Astral-Simulator' },
    { name: 'Anime Heroes Nebublox', lastUpdate: 'Unknown', status: 'online', scriptFile: 'Anime_Heroes_Nebublox.lua', robloxUrl: 'https://www.roblox.com/games/74578002631923/JJK-Anime-Heroes', isDiscontinued: true },
    { name: 'Anime Leveling Nebublox', lastUpdate: 'Unknown', status: 'online', scriptFile: 'Anime_Leveling_Nebublox.lua', robloxUrl: 'https://www.roblox.com/games/78754030900809/Anime-Leveling', isDiscontinued: true },
];

export default function GamesLibrary() {
    const [filter, setFilter] = useState<'all' | 'online' | 'discontinued'>('all');
    const [selectedScript, setSelectedScript] = useState<GameScript | null>(null);
    const [copied, setCopied] = useState(false);

    const filteredScripts = SCRIPTS.filter(script => {
        if (filter === 'all') return true;
        return script.status === filter;
    });

    const handleCopy = (filename: string) => {
        // Construct the loadstring using the current origin so it works in any environment
        const loadstring = `loadstring(game:HttpGet("${window.location.origin}/scripts/${filename}"))()`;
        navigator.clipboard.writeText(loadstring);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
            <header className="relative z-10 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-gray-400 hover:text-white transition-colors">
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#9D00FF]/20 border border-white/5 group-hover:border-[#9D00FF]/50 transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-mono text-sm uppercase tracking-widest">Back to Hub</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Gamepad2 size={24} className="text-[#9D00FF]" />
                        <span className="font-black tracking-widest uppercase text-xl">Games Library</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                
                {/* Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10">
                        {(['all', 'online', 'discontinued'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all ${
                                    filter === f 
                                    ? 'bg-[#9D00FF] text-white shadow-[0_0_15px_rgba(157,0,255,0.4)]' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                        Showing <strong className="text-white">{filteredScripts.length}</strong> scripts
                    </div>
                </div>

                {/* Table */}
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-6 font-mono text-xs uppercase tracking-widest text-gray-400">Game</th>
                                    <th className="p-6 font-mono text-xs uppercase tracking-widest text-gray-400">Last Update</th>
                                    <th className="p-6 font-mono text-xs uppercase tracking-widest text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredScripts.map((script, idx) => (
                                    <tr 
                                        key={idx} 
                                        onClick={() => setSelectedScript(script)}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg border transition-colors ${
                                                    script.status === 'online' 
                                                    ? 'bg-[var(--code-cyan)]/10 border-[var(--code-cyan)]/30 text-[var(--code-cyan)] group-hover:bg-[var(--code-cyan)]/20' 
                                                    : 'bg-red-500/10 border-red-500/30 text-red-400 group-hover:bg-red-500/20'
                                                }`}>
                                                    <Terminal size={18} />
                                                </div>
                                                <span className="font-bold text-lg group-hover:text-[#9D00FF] transition-colors">
                                                    {script.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 font-mono text-sm text-gray-400">
                                            {script.lastUpdate}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest rounded-full border ${
                                                script.status === 'online'
                                                ? 'bg-[var(--code-cyan)]/10 border-[var(--code-cyan)]/30 text-[var(--code-cyan)] shadow-[0_0_10px_rgba(0,255,255,0.1)]'
                                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                                            }`}>
                                                {script.status}
                                            </span>
                                            {script.isDiscontinued && (
                                                <span className="ml-2 px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest rounded-full border bg-orange-500/10 border-orange-500/30 text-orange-400">
                                                    Discontinued
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredScripts.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-12 text-center text-gray-500 font-mono text-sm uppercase tracking-widest">
                                            No scripts found for this filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>

            {/* Script Modal */}
            {selectedScript && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedScript(null)}
                    />
                    <div className="relative z-10 w-full max-w-2xl bg-[#0a0a0f] border border-[#9D00FF]/30 rounded-2xl shadow-[0_0_50px_rgba(157,0,255,0.15)] overflow-hidden animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                        
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-xl font-bold">{selectedScript.name}</h2>
                            <button 
                                onClick={() => setSelectedScript(null)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest rounded-full border ${
                                    selectedScript.status === 'online'
                                    ? 'bg-[var(--code-cyan)]/10 border-[var(--code-cyan)]/30 text-[var(--code-cyan)]'
                                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                                }`}>
                                    {selectedScript.status}
                                </span>
                                {selectedScript.isDiscontinued && (
                                    <span className="px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest rounded-full border bg-orange-500/10 border-orange-500/30 text-orange-400">
                                        Discontinued
                                    </span>
                                )}
                                <span className="font-mono text-sm text-gray-400">
                                    Last Updated: {selectedScript.lastUpdate}
                                </span>
                                {selectedScript.robloxUrl !== '#' && (
                                    <a 
                                        href={selectedScript.robloxUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="ml-auto text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors flex items-center gap-2 text-gray-300 hover:text-white"
                                    >
                                        <Gamepad2 size={14} />
                                        View on Roblox
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs uppercase tracking-widest text-gray-500">Loadstring</label>
                                <div className="relative">
                                    <div className="w-full bg-black border border-white/10 rounded-xl p-4 font-mono text-sm text-[#00ffcc] break-all select-all pr-14">
                                        loadstring(game:HttpGet("{typeof window !== 'undefined' ? window.location.origin : ''}/scripts/{selectedScript.scriptFile}"))()
                                    </div>
                                    <button 
                                        onClick={() => handleCopy(selectedScript.scriptFile)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-[#9D00FF]/20 border border-white/5 hover:border-[#9D00FF]/50 transition-colors text-gray-400 hover:text-white"
                                        title="Copy Loadstring"
                                    >
                                        {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            {selectedScript.isDiscontinued && (
                                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3 text-orange-200 text-sm">
                                    <span className="text-orange-400">⚠️</span>
                                    This script is discontinued and is no longer receiving updates, but it is currently online and functional.
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
            )}

        </div>
    );
}
