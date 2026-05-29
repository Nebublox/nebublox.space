'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function LoadstringBlock() {
    const [copied, setCopied] = useState(false);
    
    const scriptUrl = 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxLoader.lua"))()';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(scriptUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-12 relative group">
            {/* Glowing background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9D00FF] to-[#00E6FF] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative flex flex-col sm:flex-row items-center justify-between bg-black/80 border border-white/10 p-4 sm:p-6 rounded-2xl backdrop-blur-xl gap-4">
                
                <div className="flex-1 min-w-0 overflow-x-auto custom-scrollbar pr-4">
                    <p className="text-[#00E6FF] font-mono text-xs uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#9D00FF] animate-pulse"></span>
                        Universal Nebublox Script
                    </p>
                    <code className="text-gray-300 font-mono text-sm sm:text-base whitespace-nowrap">
                        {scriptUrl}
                    </code>
                </div>

                <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(157,0,255,0.2)] shrink-0 ${
                        copied 
                        ? 'bg-[#00E6FF]/20 text-[#00E6FF] border border-[#00E6FF]/50' 
                        : 'bg-gradient-to-r from-[#9D00FF] to-[#00E6FF] hover:from-[#b033ff] hover:to-[#33edff] text-white border border-white/10 hover:scale-105'
                    }`}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy Script'}
                </button>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(157, 0, 255, 0.3);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 230, 255, 0.5);
                }
            `}</style>
        </div>
    );
}
