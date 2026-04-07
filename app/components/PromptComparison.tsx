'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface PromptComparisonProps {
    weakPrompt: string;
    strongPrompt: string;
    weakResult?: string;
    strongResult?: string;
}

export default function PromptComparison({ weakPrompt, strongPrompt, weakResult, strongResult }: PromptComparisonProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(strongPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">

            {/* Card 1 - WEAK SIGNAL (Error) */}
            <div
                className="relative p-6 border overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(40, 0, 0, 0.8), rgba(10, 0, 0, 0.9))',
                    borderColor: '#440000'
                }}
            >
                {/* Noise overlay effect */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                        backgroundRepeat: 'repeat'
                    }}
                />

                {/* Header */}
                <div className="mb-4 font-mono text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#FF4444' }}>
                    <span>❌</span>
                    <span>SIGNAL WEAK</span>
                </div>

                {/* Prompt */}
                <div
                    className="relative z-10 p-4 mb-4 font-mono text-sm"
                    style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 0, 0, 0.3)',
                        color: '#FF6B6B'
                    }}
                >
                    &quot;{weakPrompt}&quot;
                </div>

                {/* Result */}
                {weakResult && (
                    <div className="font-mono text-xs" style={{ color: '#999' }}>
                        <span style={{ color: '#FF4444' }}>Result:</span> {weakResult}
                    </div>
                )}
            </div>

            {/* Card 2 - STRONG SIGNAL (Optimized) */}
            <div
                className="relative p-6 border"
                style={{
                    background: 'linear-gradient(135deg, rgba(0, 40, 20, 0.8), rgba(0, 20, 10, 0.9))',
                    borderColor: '#39FF14',
                    boxShadow: '0 0 20px rgba(57, 255, 20, 0.2)'
                }}
            >
                {/* Header */}
                <div className="mb-4 font-mono text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#39FF14' }}>
                    <span>✅</span>
                    <span>SIGNAL OPTIMIZED</span>
                </div>

                {/* Prompt */}
                <div
                    className="relative z-10 p-4 mb-4 font-mono text-sm"
                    style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(57, 255, 20, 0.5)',
                        color: '#00FF88'
                    }}
                >
                    &quot;{strongPrompt}&quot;
                </div>

                {/* Result */}
                {strongResult && (
                    <div className="font-mono text-xs mb-4" style={{ color: '#999' }}>
                        <span style={{ color: '#39FF14' }}>Result:</span> {strongResult}
                    </div>
                )}

                {/* Copy Button */}
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200"
                    style={{
                        background: copied ? 'rgba(57, 255, 20, 0.3)' : 'rgba(57, 255, 20, 0.1)',
                        border: '1px solid rgba(57, 255, 20, 0.5)',
                        color: '#39FF14'
                    }}
                >
                    {copied ? (
                        <>
                            <Check size={14} />
                            <span>COPIED!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>COPY SYNTAX</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
