'use client';
import Link from 'next/link';
import LegalModal from './LegalModal';
import { Twitter, Youtube, Gamepad2, ShoppingCart, Flame, Shield, Book, Home } from 'lucide-react';

export default function Footer() {


    return (
        <>
            <LegalModal />
            <footer className="w-full border-t border-white/5 bg-black/20 backdrop-blur-md mt-auto pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center">

                    {/* Top Grid */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-center md:text-left">

                        {/* Column 1: Brand */}
                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <h3 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
                                DARKMATTER<br />HYPERVISION
                            </h3>
                            <p className="text-sm text-zinc-500 max-w-xs">
                                Forging the next generation of Roblox experiences with arcane algorithms.
                            </p>
                        </div>

                        {/* Column 4: Socials */}
                        <div className="flex flex-col items-center md:items-end space-y-4">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Connect</h4>
                            <div className="flex flex-wrap justify-center md:justify-end gap-3">
                                <a href="https://discord.gg/nebublox" target="_blank" className="p-2 rounded-lg bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition-all">
                                    <Gamepad2 className="w-5 h-5" />
                                </a>
                                <a href="https://www.youtube.com/channel/UCDwKmR0ciTF457K3LyGSoEw" target="_blank" className="p-2 rounded-lg bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all">
                                    <Youtube className="w-5 h-5" />
                                </a>
                                <a href="https://www.roblox.com/communities/331995130/BloxSmith-AI" target="_blank" className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-white hover:text-black transition-all">
                                    <Shield className="w-5 h-5" />
                                </a>
                                <a href="https://ko-fi.com/X7X01ROGY3" target="_blank" className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all">
                                    <Flame className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Utility */}
                    <div className="w-full pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 font-mono">
                        <div>
                            © 2026 DarkMatterHYPERVISION. All rights reserved.
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                            <span>Invision by</span>
                            <a href="https://www.roblox.com/users/4089431753/profile" target="_blank" className="text-amber-500/50 hover:text-amber-500 transition-colors">DarkMatterV1</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}