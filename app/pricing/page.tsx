'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag, Check, Zap, Crown, Shield } from 'lucide-react';
import LoadstringBlock from '../components/LoadstringBlock';

export default function Pricing() {
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
                        <Tag size={24} className="text-[#9D00FF]" />
                        <span className="font-black tracking-widest uppercase text-xl">Pricing</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
                
                <div className="text-center mb-16 max-w-3xl">
                    <span className="text-[var(--code-cyan)] font-mono text-sm tracking-widest uppercase mb-4 block animate-pulse">
                        ⚠️ Limited Time Deals Active ⚠️
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter"
                        style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-400">
                        Unlock the full potential of Nebublox. Secure your premium access today before the massive discounts expire!
                    </p>
                </div>

                {/* Universal Script Copy Block */}
                <LoadstringBlock />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl items-stretch">
                    
                    {/* Free Tier */}
                    <div className="flex flex-col bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative group hover:border-white/20 transition-all h-full">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gray-500/20 rounded-xl">
                                    <Shield size={24} className="text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-black">Starter</h3>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-black text-white">Free</span>
                            </div>
                            <p className="text-gray-400 mt-4 text-sm">Scripts have a key system you can use to access.</p>
                        </div>

                        <div className="flex-1">
                            <ul className="flex flex-col gap-4">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check size={18} className="text-gray-500" />
                                    <span>Key System Access</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check size={18} className="text-gray-500" />
                                    <span>Ads Included</span>
                                </li>
                            </ul>
                        </div>

                        <a href="https://jnkie.com/get-key/stardust" target="_blank" rel="noopener noreferrer" 
                           className="mt-auto w-full py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-center transition-all bg-white/5 hover:bg-white/10 border border-white/10 text-white">
                            Get Free Key
                        </a>
                    </div>

                    {/* Lifetime Tier (Featured) */}
                    <div className="flex flex-col bg-gradient-to-b from-[#9D00FF]/15 to-[#00E6FF]/5 border border-[#9D00FF]/50 rounded-3xl p-8 backdrop-blur-xl relative group shadow-[0_0_40px_rgba(157,0,255,0.3)] hover:shadow-[0_0_60px_rgba(157,0,255,0.5)] transition-all h-full">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#9D00FF] to-[#00E6FF] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(157,0,255,0.6)]">
                            Ultimate Value
                        </div>

                        <div className="mb-8 mt-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-[#9D00FF]/20 rounded-xl">
                                    <Crown size={24} className="text-[#9D00FF]" />
                                </div>
                                <h3 className="text-2xl font-black">Lifetime</h3>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-lg font-bold text-gray-500 line-through decoration-red-500 decoration-2 opacity-70">$24.99</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#e0c4ff] drop-shadow-[0_0_15px_rgba(157,0,255,0.8)]">$19.99</span>
                                </div>
                            </div>
                            <p className="text-gray-400 mt-4 text-sm">Pay once, own it forever. The ultimate Nebublox experience.</p>
                        </div>

                        <div className="flex-1">
                            <ul className="flex flex-col gap-4">
                                <li className="flex items-center gap-3 text-white font-medium">
                                    <Check size={18} className="text-[#9D00FF]" />
                                    <span>Access all game scripts</span>
                                </li>
                                <li className="flex items-center gap-3 text-white font-medium">
                                    <Check size={18} className="text-[#9D00FF]" />
                                    <span>Premium Discord support</span>
                                </li>
                                <li className="flex items-center gap-3 text-white font-medium">
                                    <Check size={18} className="text-[#9D00FF]" />
                                    <span>No ads ever</span>
                                </li>
                                <li className="flex items-center gap-3 text-white font-medium">
                                    <Check size={18} className="text-[#9D00FF]" />
                                    <span>Priority suggestions</span>
                                </li>
                            </ul>
                        </div>

                        <a href="https://discord.gg/nebublox" target="_blank" rel="noopener noreferrer" 
                           className="mt-auto w-full py-4 px-6 rounded-xl font-black uppercase tracking-widest text-center transition-all bg-gradient-to-r from-[#9D00FF] to-[#00E6FF] hover:from-[#b033ff] hover:to-[#33edff] text-white shadow-[0_0_20px_rgba(157,0,255,0.5)] hover:shadow-[0_0_40px_rgba(0,230,255,0.6)] hover:scale-105">
                            Purchase via Discord
                        </a>
                    </div>

                    {/* Monthly Tier */}
                    <div className="flex flex-col bg-gradient-to-b from-[var(--code-cyan)]/10 to-black border border-[var(--code-cyan)]/50 rounded-3xl p-8 backdrop-blur-xl relative group hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] transition-all h-full">
                        <div className="absolute -top-4 right-8 px-4 py-1 bg-[var(--code-cyan)] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(0,255,255,0.5)]">
                            Most Popular
                        </div>

                        <div className="mb-8 mt-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-[var(--code-cyan)]/20 rounded-xl">
                                    <Zap size={24} className="text-[var(--code-cyan)]" />
                                </div>
                                <h3 className="text-2xl font-black">Monthly</h3>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-lg font-bold text-gray-500 line-through decoration-red-500 decoration-2 opacity-70">$9.99</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#c4ffff] drop-shadow-[0_0_15px_rgba(0,230,255,0.6)]">$7.99</span>
                                    <span className="text-[var(--code-cyan)] mb-1 font-bold">/mo</span>
                                </div>
                            </div>
                            <p className="text-gray-400 mt-4 text-sm">Perfect for trying out our premium features.</p>
                        </div>

                        <div className="flex-1">
                            <ul className="flex flex-col gap-4">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check size={18} className="text-[var(--code-cyan)]" />
                                    <span>Access all game scripts</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check size={18} className="text-[var(--code-cyan)]" />
                                    <span>Discord support</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check size={18} className="text-[var(--code-cyan)]" />
                                    <span>No ads</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check size={18} className="text-[var(--code-cyan)]" />
                                    <span>Priority suggestions</span>
                                </li>
                            </ul>
                        </div>

                        <a href="https://discord.gg/nebublox" target="_blank" rel="noopener noreferrer" 
                           className="mt-auto w-full py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-center transition-all bg-[var(--code-cyan)]/15 hover:bg-[var(--code-cyan)] border border-[var(--code-cyan)] text-[var(--code-cyan)] hover:text-black shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                            Purchase via Discord
                        </a>
                    </div>

                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-400 font-mono text-sm uppercase tracking-widest mb-2">
                        Accepted Payment Methods
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-bold text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]">PayPal</span>
                        <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-bold text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]">Gift Cards</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-4">
                        Please open a ticket on Discord and ping Nebublox to complete your purchase.
                    </p>
                </div>

            </main>
        </div>
    );
}
