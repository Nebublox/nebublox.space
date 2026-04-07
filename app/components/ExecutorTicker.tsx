'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Executor {
    name: string;
    status: 'working' | 'detected' | 'down';
    website: string;
    discord: string;
}

const EXECUTORS: Executor[] = [
    { name: 'Solara', status: 'working', website: 'https://getsolara.dev', discord: 'https://discord.gg/solara' },
    { name: 'Wave', status: 'working', website: 'https://getwave.gg', discord: 'https://discord.gg/wave' },
    { name: 'Hydrogen', status: 'detected', website: 'https://usehydrogen.com', discord: 'https://discord.gg/hydrogen' },
    { name: 'AWP', status: 'working', website: 'https://awp.gg', discord: 'https://discord.gg/awp' },
    { name: 'Arceus X', status: 'detected', website: 'https://arceusx.net', discord: 'https://discord.gg/arceusx' },
    { name: 'Delta', status: 'working', website: 'https://delta-executor.com', discord: 'https://discord.gg/delta' },
    { name: 'Fluxus', status: 'down', website: 'https://fluxteam.net', discord: 'https://discord.gg/fluxus' },
    { name: 'Codex', status: 'working', website: 'https://codex.lol', discord: 'https://discord.gg/codex' },
    { name: 'Trigon', status: 'detected', website: 'https://trigonevo.fun', discord: 'https://discord.gg/trigon' },
    { name: 'KRNL', status: 'down', website: 'https://krnl.place', discord: 'https://discord.gg/krnl' },
    { name: 'Synapse Z', status: 'working', website: 'https://synapsez.net', discord: 'https://discord.gg/synapsez' },
    { name: 'Nezur', status: 'working', website: 'https://nezur.com', discord: 'https://discord.gg/nezur' },
];

const STATUS_CONFIG = {
    working: { color: 'var(--code-cyan, #00FFFF)', label: 'WORKING', dotClass: 'bg-cyan-400' },
    detected: { color: '#9D00FF', label: 'DETECTED', dotClass: 'bg-purple-500' },
    down: { color: '#FF00CC', label: 'DOWN', dotClass: 'bg-pink-500' },
};

function ExecutorChip({ exec, onClickExec, isActive, popupRef }: {
    exec: Executor;
    onClickExec: () => void;
    isActive: boolean;
    popupRef: React.RefObject<HTMLDivElement | null>;
}) {
    const config = STATUS_CONFIG[exec.status];
    return (
        <div className="relative inline-flex items-center shrink-0">
            <button
                onClick={onClickExec}
                className="flex items-center gap-1.5 px-3 transition-all duration-300 hover:bg-white/5 cursor-pointer group"
                style={{ height: '32px' }}
            >
                <span
                    className={`w-[5px] h-[5px] rounded-full ${config.dotClass} shrink-0`}
                    style={{
                        boxShadow: `0 0 4px ${config.color}, 0 0 8px ${config.color}40`,
                        animation: exec.status === 'working' ? 'ticker-pulse-dot 2s ease-in-out infinite' : 'none',
                    }}
                />
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">
                    {exec.name}
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: config.color }}>
                    {config.label}
                </span>
            </button>
            <span className="text-[8px] text-purple-500/30 select-none">│</span>

            {isActive && (
                <div ref={popupRef as React.RefObject<HTMLDivElement>} className="absolute top-[36px] left-1/2 -translate-x-1/2 z-50 w-[200px]"
                    style={{ animation: 'ticker-fadeIn 0.2s ease-out' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-black/95 border border-purple-500/40 rounded-xl p-3 shadow-[0_0_30px_rgba(157,0,255,0.3)] backdrop-blur-xl">
                        <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-black/95 border-t border-l border-purple-500/40 rotate-45" />
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`w-2 h-2 rounded-full ${config.dotClass}`} style={{ boxShadow: `0 0 8px ${config.color}` }} />
                            <span className="text-white font-bold text-xs uppercase tracking-wider">{exec.name}</span>
                            <span className="text-[8px] font-black uppercase ml-auto" style={{ color: config.color }}>{config.label}</span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mb-2" />
                        <div className="flex flex-col gap-1.5">
                            <a href={exec.website} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                                </svg>
                                <span className="text-[10px] font-mono text-gray-300 uppercase tracking-wider">Website</span>
                            </a>
                            <a href={exec.discord} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#5865F2]/20 transition-colors border border-white/5">
                                <svg className="w-3 h-3 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                </svg>
                                <span className="text-[10px] font-mono text-gray-300 uppercase tracking-wider">Discord</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ExecutorTicker() {
    const [activePopup, setActivePopup] = useState<string | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setActivePopup(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className="fixed top-[60px] left-0 right-0 z-40"
                style={{
                    height: '32px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderBottom: '1px solid rgba(157, 0, 255, 0.2)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                {/* The wrapper that forces the exact same container width/padding as the Navbar */}
                <div className="h-full w-full max-w-7xl mx-auto px-6 flex items-center justify-between pointer-events-none">
                    {/* The left boundary matches the logo start + margins. ML-10 matches the logo's margin-left. */}
                    {/* The right boundary is strictly the end of the flex container (where OPTIMIZED ends).  */}
                    {/* We use overflow-hidden to clip the marquee perfectly to this box. pointer-events-auto restores clicks inside. */}
                    <div className="h-full w-full ml-[40px] overflow-hidden pointer-events-auto relative">
                        {/* 
                        Marquee wrapper: two identical strips side-by-side.
                        The wrapper has `width: max-content` so it is exactly 2x the strip width.
                        We translate -50% to scroll exactly one strip, then it loops seamlessly.
                    */}
                        <div className="ticker-marquee flex items-center h-full" style={{ width: 'max-content' }}>
                            {/* Strip 1 */}
                            <div className="flex items-center shrink-0">
                                {EXECUTORS.map((exec, i) => (
                                    <ExecutorChip
                                        key={`a-${exec.name}`}
                                        exec={exec}
                                        isActive={activePopup === `a-${exec.name}`}
                                        onClickExec={() => setActivePopup(activePopup === `a-${exec.name}` ? null : `a-${exec.name}`)}
                                        popupRef={popupRef as React.RefObject<HTMLDivElement>}
                                    />
                                ))}
                            </div>
                            {/* Strip 2 (identical clone) */}
                            <div className="flex items-center shrink-0">
                                {EXECUTORS.map((exec, i) => (
                                    <ExecutorChip
                                        key={`b-${exec.name}`}
                                        exec={exec}
                                        isActive={activePopup === `b-${exec.name}`}
                                        onClickExec={() => setActivePopup(activePopup === `b-${exec.name}` ? null : `b-${exec.name}`)}
                                        popupRef={popupRef as React.RefObject<HTMLDivElement>}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .ticker-marquee {
                    animation: ticker-scroll 8s linear infinite;
                }

                .ticker-marquee:hover {
                    animation-play-state: paused;
                }

                @keyframes ticker-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                @keyframes ticker-pulse-dot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                @keyframes ticker-fadeIn {
                    from { opacity: 0; transform: translate(-50%, -8px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </>
    );
}
