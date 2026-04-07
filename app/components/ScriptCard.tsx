'use client';

import React, { useState } from 'react';
import { Gamepad2, Lock, Unlock } from 'lucide-react';

interface ScriptCardProps {
    gameName: string;
    scriptName: string;
    description: string;
    scriptUrl: string;
    gameIcon?: string;
    features?: string[]; // Treated as "Free" features if premiumFeatures exists
    premiumFeatures?: string[];
    videoUrl?: string;
    isDiscontinued?: boolean;
}

export default function ScriptCard({
    gameName,
    scriptName,
    description,
    scriptUrl,
    gameIcon,
    features = [],
    premiumFeatures = [],
    videoUrl,
    isDiscontinued = false
}: ScriptCardProps) {
    const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');

    const hasPremium = premiumFeatures.length > 0;
    const currentFeatures = activeTab === 'free' ? features : premiumFeatures;

    return (
        <div
            className={`glass-cosmic group relative p-6 transition-all duration-300 flex flex-col h-full overflow-hidden ${isDiscontinued ? 'opacity-60 grayscale-[0.3]' : 'hover:scale-[1.02]'}`}
            style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
        >
            {/* Discontinued Badge */}
            {isDiscontinued && (
                <div className="absolute top-4 right-4 z-30 bg-red-600/80 text-white text-[10px] font-black px-2 py-1 rounded border border-red-500/50 tracking-tighter shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    DISCONTINUED
                </div>
            )}
            {/* Nebula Animated Border */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                <div className="absolute inset-[-2px] bg-gradient-to-r from-singularity via-code-cyan to-singularity animate-nebula-border rounded-lg" />
                <div className="absolute inset-[1px] bg-[#0a0a10] rounded-lg" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Large Game Icon / Preview Image - TOP */}
                <div
                    className="w-full aspect-video rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-white/10 mb-6 group-hover:border-singularity/50 transition-colors duration-300"
                    style={{
                        background: 'linear-gradient(135deg, rgba(157, 0, 255, 0.2) 0%, rgba(255, 0, 204, 0.2) 100%)',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)'
                    }}
                >
                    {gameIcon ? (
                        <img src={gameIcon} alt={gameName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <Gamepad2 className="w-16 h-16 text-white/20" />
                    )}
                </div>

                {/* Header / Title - Under Image */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white tracking-widest uppercase" style={{ fontFamily: 'Orbitron' }}>
                        {scriptName}
                    </h3>
                </div>

                {/* Video Support (If present) */}
                {videoUrl && (
                    <div className="w-full aspect-video mb-6 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-black">
                        <iframe
                            className="w-full h-full"
                            src={videoUrl}
                            title={`${scriptName} Preview`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}

                {/* Feature Tabs (Only if Premium exists) */}
                {hasPremium && (
                    <div className="flex bg-black/40 p-1 rounded-lg mb-4">
                        <button
                            onClick={() => setActiveTab('free')}
                            className={`flex-1 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'free' ? 'bg-code-cyan/20 text-code-cyan' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Unlock size={16} />
                            Free
                        </button>
                        <button
                            onClick={() => setActiveTab('premium')}
                            className={`flex-1 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'premium' ? 'bg-singularity text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Lock size={16} />
                            Premium
                        </button>
                    </div>
                )}

                {/* Features List */}
                <div className="mb-6 bg-black/20 p-3 rounded-lg border border-white/5 min-h-[100px]">
                    <div className="flex flex-wrap gap-2">
                        {currentFeatures.length > 0 ? (
                            currentFeatures.map((feature, index) => (
                                <span
                                    key={index}
                                    className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded border ${activeTab === 'premium'
                                        ? 'bg-purple-900/30 border-purple-500/40 text-purple-200'
                                        : 'bg-cyan-900/20 border-cyan-500/30 text-cyan-100/80'
                                        }`}
                                >
                                    {feature}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-600 italic">No features listed.</span>
                        )}
                    </div>
                </div>


            </div>

            {/* Ambient Background Glow on Hover */}
            <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    boxShadow: '0 0 40px rgba(157, 0, 255, 0.2)'
                }}
            />
        </div>
    );
}
