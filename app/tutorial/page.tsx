'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';

export default function TutorialPage() {
    const [copied, setCopied] = useState(false);
    const universalScript = 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/Launcher.lua"))()';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(universalScript);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
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
                        <Sparkles size={24} className="text-[#00E6FF]" />
                        <span className="font-black tracking-widest uppercase text-xl">How To Use</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
                {/* Title */}
                <div className="text-center mb-16 max-w-3xl">
                    <span className="text-[#00E6FF] font-mono text-sm tracking-widest uppercase mb-4 block animate-pulse">
                        🚀 Complete Setup Guide 🚀
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter"
                        style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
                        Execute Nebublox
                    </h1>
                    <p className="text-lg text-gray-400">
                        Follow these 3 easy steps to load and execute our Roblox scripts. Run your favorite scripts in minutes!
                    </p>
                </div>

                {/* Steps Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl items-stretch">
                    
                    {/* Step 1: Executor Status (WhatExpsAre.Online) */}
                    <div className="flex flex-col items-center text-center bg-black/15 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl relative group hover:border-green-500/30 transition-all h-full shadow-[0_0_30px_rgba(0,0,0,0.4)]">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-red-600 via-white to-green-600 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                            Step 01
                        </div>

                        <div className="flex flex-col items-center mt-4 mb-6">
                            <div className="w-20 h-20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 relative">
                                {/* Subtle white/red/green glow behind logo */}
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-white to-green-500 opacity-20 blur-xl rounded-full scale-75 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                                <img 
                                    src="https://weao.xyz/Logo.png" 
                                    alt="WhatExpsAre.Online Logo" 
                                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] relative z-10" 
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                            <h3 className="text-2xl font-black tracking-wide mb-3">WhatExpsAre.Online</h3>
                            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                                To run custom scripts in Roblox, you will need a software tool called an <strong>executor</strong> or <strong>injector</strong>.
                            </p>
                        </div>

                        <div className="flex-grow space-y-4 mb-8 max-w-xs">
                            <p className="text-gray-400 text-xs">
                                Check the status page of exploits on WhatExpsAre.Online to find a working executor for your platform.
                            </p>
                            
                            <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-200/90 text-xs leading-normal">
                                <strong className="text-amber-400 block mb-0.5">⚠️ Antivirus Alert:</strong>
                                Executors are often flagged as false positives. You may need to create a folder exclusion or temporarily disable protection to install them.
                            </div>
                        </div>

                        <a 
                            href="https://weao.xyz/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-auto w-full py-4 px-6 rounded-xl font-black uppercase tracking-widest text-center transition-all bg-gradient-to-r from-red-600 via-white to-green-600 text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                        >
                            Visit WEAO
                            <ExternalLink size={16} className="inline ml-1 text-black" />
                        </a>
                    </div>

                    {/* Step 2: Loader Script (Nebublox) */}
                    <div className="flex flex-col items-center text-center bg-black/15 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl relative group hover:border-[#9D00FF]/30 transition-all h-full shadow-[0_0_30px_rgba(0,0,0,0.4)]">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#9D00FF] to-[#00E6FF] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(157,0,255,0.4)]">
                            Step 02
                        </div>

                        <div className="flex flex-col items-center mt-4 mb-6">
                            <div className="w-32 h-20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 relative">
                                {/* Signature gradient glow around logo */}
                                <div className="absolute -inset-2 bg-gradient-to-r from-[#9D00FF] to-[#00E6FF] opacity-35 blur-xl rounded-full scale-75 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
                                <img 
                                    src="/nebublox-logo.png" 
                                    alt="Nebublox Logo" 
                                    className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(157,0,255,0.7)] relative z-10" 
                                />
                            </div>
                            <h3 className="text-2xl font-black tracking-wide mb-3">Run Loader</h3>
                            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                                Launch your game on Roblox, open the executor you installed in Step 1, and press <strong>Attach/Inject</strong>.
                            </p>
                        </div>

                        <div className="flex-grow space-y-4 mb-8 w-full max-w-xs">
                            <p className="text-gray-400 text-xs">
                                Copy our Universal Script Loader below, paste it into your executor's text editor, and click <strong>Execute/Run</strong>.
                            </p>
                            
                            <div className="relative group/code w-full">
                                <div className="w-full bg-black/60 border border-white/10 rounded-xl p-3 font-mono text-[10px] text-[#00ffcc] break-all select-all pr-12 line-clamp-4 h-24 overflow-y-auto text-left">
                                    {universalScript}
                                </div>
                                <button 
                                    onClick={handleCopy}
                                    className="absolute right-2 top-2 p-2 rounded-lg bg-white/5 hover:bg-[#9D00FF]/20 border border-white/5 hover:border-[#9D00FF]/50 transition-colors text-gray-400 hover:text-white"
                                    title="Copy Loader Code"
                                >
                                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={handleCopy}
                            className={`mt-auto w-full py-4 px-6 rounded-xl font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 border border-white/10 hover:scale-[1.02] ${
                                copied 
                                ? 'bg-[#00E6FF]/20 text-[#00E6FF] border-[#00E6FF]/50' 
                                : 'bg-gradient-to-r from-[#9D00FF] to-[#00E6FF] hover:from-[#b033ff] hover:to-[#33edff] text-white shadow-[0_0_20px_rgba(157,0,255,0.2)]'
                            }`}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Loader Copied!' : 'Copy Script Loader'}
                        </button>
                    </div>

                    {/* Step 3: Key Access (Jnkie) */}
                    <div className="flex flex-col items-center text-center bg-black/15 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl relative group hover:border-[#9D00FF]/30 transition-all h-full shadow-[0_0_30px_rgba(0,0,0,0.4)]">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#9D00FF] to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(157,0,255,0.4)]">
                            Step 03
                        </div>

                        <div className="flex flex-col items-center mt-4 mb-6">
                            <div className="w-20 h-20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 relative">
                                {/* Purple glow behind Jnkie logo */}
                                <div className="absolute inset-0 bg-[#9D00FF] opacity-20 blur-xl rounded-full scale-75 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                                <img 
                                    src="https://jnkie.com/favicon.ico" 
                                    alt="Jnkie Logo" 
                                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(157,0,255,0.6)] relative z-10" 
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                            <h3 className="text-2xl font-black tracking-wide mb-3">Get Free Key</h3>
                            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                                Once loaded, the script interface will prompt you to enter a session key.
                            </p>
                        </div>

                        <div className="flex-grow space-y-4 mb-8 max-w-xs">
                            <p className="text-gray-400 text-xs">
                                Click the key generator link below. It will open our secure checkpoint page where you can generate a free 24-hour key.
                            </p>
                            <p className="text-gray-400 text-xs">
                                Copy the generated key from the gateway, paste it into the script window in-game, and press <strong>Verify</strong> to unlock Nebublox features!
                            </p>
                        </div>

                        <a 
                            href="https://jnkie.com/get-key/stardust" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-auto w-full py-4 px-6 rounded-xl font-black uppercase tracking-widest text-center transition-all bg-gradient-to-r from-[#9D00FF] to-indigo-600 hover:from-[#b033ff] hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(157,0,255,0.2)] hover:shadow-[0_0_30px_rgba(157,0,255,0.4)] hover:scale-[1.02]"
                        >
                            Generate Key
                            <ExternalLink size={16} />
                        </a>
                    </div>

                </div>

                {/* Footer Info */}
                <div className="mt-16 text-center max-w-xl">
                    <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-4">
                        Need Additional Help?
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        If you encounter issues during installation or script execution, please join our official Discord server. Our community and support staff are active 24/7 to help troubleshoot errors.
                    </p>
                    <a 
                        href="https://discord.gg/nebublox" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-[#00E6FF] hover:underline font-bold text-sm tracking-wider uppercase"
                    >
                        Join Official Support Discord →
                    </a>
                </div>
            </main>
        </div>
    );
}
