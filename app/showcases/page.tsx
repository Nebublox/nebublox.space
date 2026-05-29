'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlaySquare, Youtube, Award, MessageSquare, Video, Heart, Share2, CheckCircle2 } from 'lucide-react';

export default function Showcases() {
    // State for local likes and share notifications
    const [likes, setLikes] = useState<{ [key: string]: number }>({
        'vid1': 142,
        'vid2': 389
    });
    const [liked, setLiked] = useState<{ [key: string]: boolean }>({
        'vid1': false,
        'vid2': false
    });
    const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

    const handleLike = (videoId: string) => {
        setLiked(prev => ({ ...prev, [videoId]: !prev[videoId] }));
        setLikes(prev => ({
            ...prev,
            [videoId]: liked[videoId] ? prev[videoId] - 1 : prev[videoId] + 1
        }));
    };

    const handleShare = async (videoId: string, url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(prev => ({ ...prev, [videoId]: true }));
            setTimeout(() => {
                setCopied(prev => ({ ...prev, [videoId]: false }));
            }, 2000);
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
                        <PlaySquare size={24} className="text-[#9D00FF]" />
                        <span className="font-black tracking-widest uppercase text-xl">Media Showcases</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col gap-16">
                
                {/* Redesigned Creator Rewards Section */}
                <section className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0f] border border-white/10 shadow-[0_0_80px_rgba(157,0,255,0.15)] group">
                    
                    {/* Abstract glowing background shapes */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#9D00FF]/20 to-[#00E6FF]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none group-hover:opacity-70 transition-opacity" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row p-10 md:p-16 gap-12 items-center">
                        
                        {/* Left Side: Pitch */}
                        <div className="flex-1 flex flex-col items-start text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9D00FF]/20 to-[#00E6FF]/20 border border-white/20 rounded-full mb-6 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-[#00E6FF] animate-pulse" />
                                <span className="font-bold font-mono text-xs uppercase tracking-widest text-white">
                                    Currently Hiring
                                </span>
                            </div>
                            
                            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                                Creator <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D00FF] to-[#00E6FF] drop-shadow-[0_0_20px_rgba(157,0,255,0.4)]">
                                    Rewards Program
                                </span>
                            </h2>
                            
                            <p className="text-2xl font-bold mb-4 text-white">
                                We are looking for active TikTokers & YouTubers!
                            </p>
                            
                            <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
                                <strong className="text-white">Unlock PREMIUM for FREE!</strong> Want our Premium Key without spending a dime? Record a video, upload it, and hit the view milestones to claim your access.
                            </p>

                            <a href="https://discord.gg/nebublox" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#9D00FF] to-[#00E6FF] hover:from-[#b033ff] hover:to-[#33edff] text-white font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(157,0,255,0.5)]">
                                <MessageSquare size={20} />
                                Claim via Discord
                            </a>
                        </div>

                        {/* Right Side: Milestone Cards */}
                        <div className="flex-1 w-full flex flex-col gap-6">
                            
                            {/* TikTok Tier Card */}
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 hover:border-[#00f2fe]/50 rounded-3xl p-6 relative overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,242,254,0.2)] hover:-translate-y-1">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2fe]/10 blur-[40px] rounded-full pointer-events-none" />
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#00f2fe]/20 p-3 rounded-2xl border border-[#00f2fe]/30">
                                            <Video size={24} className="text-[#00f2fe]" />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-wider text-white">TikTok</h3>
                                    </div>
                                    <span className="px-3 py-1 bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        Short Form
                                    </span>
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                        <span className="font-mono text-gray-300 font-bold">3,000 Views</span>
                                        <span className="font-bold text-[#00f2fe] bg-[#00f2fe]/10 px-3 py-1 rounded-lg">7 Day Premium</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-[#9D00FF]/20 hover:border-[#9D00FF]/50 transition-colors shadow-[inset_0_0_20px_rgba(157,0,255,0.05)]">
                                        <span className="font-mono text-gray-200 font-bold">10,000 Views</span>
                                        <span className="font-bold text-[#9D00FF] bg-[#9D00FF]/10 px-3 py-1 rounded-lg shadow-[0_0_10px_rgba(157,0,255,0.2)]">30 Day Premium</span>
                                    </div>
                                </div>
                            </div>

                            {/* YouTube Tier Card */}
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 hover:border-[#ff0000]/50 rounded-3xl p-6 relative overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,0,0,0.2)] hover:-translate-y-1">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff0000]/10 blur-[40px] rounded-full pointer-events-none" />
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#ff0000]/20 p-3 rounded-2xl border border-[#ff0000]/30">
                                            <Youtube size={24} className="text-[#ff0000]" />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-wider text-white">YouTube</h3>
                                    </div>
                                    <span className="px-3 py-1 bg-[#ff0000]/10 border border-[#ff0000]/30 text-[#ff0000] text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        Long & Short Form
                                    </span>
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                        <span className="font-mono text-gray-300 font-bold">1,000 Views</span>
                                        <span className="font-bold text-[#00f2fe] bg-[#00f2fe]/10 px-3 py-1 rounded-lg">7 Day Premium</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-[#9D00FF]/20 hover:border-[#9D00FF]/50 transition-colors shadow-[inset_0_0_20px_rgba(157,0,255,0.05)]">
                                        <span className="font-mono text-gray-200 font-bold">3,000 Views</span>
                                        <span className="font-bold text-[#9D00FF] bg-[#9D00FF]/10 px-3 py-1 rounded-lg shadow-[0_0_10px_rgba(157,0,255,0.2)]">30 Day Premium</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Showcases Grid */}
                <section className="flex flex-col gap-10">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                        <h2 className="text-4xl font-black tracking-widest uppercase">
                            Official Showcases
                        </h2>
                        <a href="https://www.youtube.com/@Nebublox/shorts" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 px-6 py-2 bg-[#ff0000]/10 border border-[#ff0000]/30 hover:bg-[#ff0000]/20 text-[#ff0000] rounded-xl font-bold transition-all text-sm uppercase tracking-widest hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:scale-105">
                            <Youtube size={16} />
                            More Shorts
                        </a>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        
                        {/* Video 1 */}
                        <div className="flex flex-col gap-4">
                            <div className="relative group rounded-2xl overflow-hidden aspect-video border border-white/10 hover:border-[#9D00FF]/50 transition-colors bg-black shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                                <iframe 
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/6gwS303a9ig?rel=0" 
                                    title="Nebublox Showcase" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerPolicy="strict-origin-when-cross-origin" 
                                    allowFullScreen 
                                />
                            </div>
                            
                            {/* Custom Engagement Bar */}
                            <div className="flex items-center justify-between px-2">
                                <button 
                                    onClick={() => handleLike('vid1')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                                        liked['vid1'] 
                                        ? 'bg-[#9D00FF]/20 text-[#9D00FF] border border-[#9D00FF]/50 shadow-[0_0_15px_rgba(157,0,255,0.4)]' 
                                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Heart size={20} className={liked['vid1'] ? 'fill-[#9D00FF]' : ''} />
                                    <span>{likes['vid1']}</span>
                                </button>

                                <button 
                                    onClick={() => handleShare('vid1', 'https://nebublox.space/showcases')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                                        copied['vid1']
                                        ? 'bg-[#00E6FF]/20 text-[#00E6FF] border border-[#00E6FF]/50 shadow-[0_0_15px_rgba(0,230,255,0.4)]'
                                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {copied['vid1'] ? <CheckCircle2 size={20} /> : <Share2 size={20} />}
                                    <span>{copied['vid1'] ? 'Link Copied!' : 'Share'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Video 2 (Latest) */}
                        <div className="flex flex-col gap-4">
                            <div className="relative group rounded-2xl overflow-hidden aspect-video border border-white/10 hover:border-[#9D00FF]/50 transition-colors bg-black shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                                <div className="absolute top-4 right-4 z-10 px-4 py-1 bg-gradient-to-r from-[#9D00FF] to-[#00E6FF] rounded-full text-white font-black font-mono text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(157,0,255,0.6)] pointer-events-none">
                                    Latest Update
                                </div>
                                <iframe 
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/RSCEioH9CeQ?rel=0" 
                                    title="Nebublox Latest Showcase" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerPolicy="strict-origin-when-cross-origin" 
                                    allowFullScreen 
                                />
                            </div>

                            {/* Custom Engagement Bar */}
                            <div className="flex items-center justify-between px-2">
                                <button 
                                    onClick={() => handleLike('vid2')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                                        liked['vid2'] 
                                        ? 'bg-[#9D00FF]/20 text-[#9D00FF] border border-[#9D00FF]/50 shadow-[0_0_15px_rgba(157,0,255,0.4)]' 
                                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Heart size={20} className={liked['vid2'] ? 'fill-[#9D00FF]' : ''} />
                                    <span>{likes['vid2']}</span>
                                </button>

                                <button 
                                    onClick={() => handleShare('vid2', 'https://nebublox.space/showcases')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                                        copied['vid2']
                                        ? 'bg-[#00E6FF]/20 text-[#00E6FF] border border-[#00E6FF]/50 shadow-[0_0_15px_rgba(0,230,255,0.4)]'
                                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {copied['vid2'] ? <CheckCircle2 size={20} /> : <Share2 size={20} />}
                                    <span>{copied['vid2'] ? 'Link Copied!' : 'Share'}</span>
                                </button>
                            </div>
                        </div>

                    </div>
                    
                    <a href="https://www.youtube.com/@Nebublox/shorts" target="_blank" rel="noopener noreferrer" className="sm:hidden flex items-center justify-center gap-2 px-6 py-4 bg-[#ff0000]/10 border border-[#ff0000]/30 hover:bg-[#ff0000]/20 text-[#ff0000] rounded-xl font-bold transition-all uppercase tracking-widest mt-4">
                        <Youtube size={20} />
                        View All Shorts
                    </a>
                </section>

            </main>
        </div>
    );
}
