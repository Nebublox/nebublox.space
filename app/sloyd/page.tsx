import React from 'react';
import Link from 'next/link';

export default function SloydPlanetPage() {
    return (
        <div className="min-h-screen w-full relative overflow-hidden text-[#E0E0E0]" style={{ backgroundColor: '#070F1F' }}>

            {/* Background Glows */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                    width: '100%',
                    height: '600px',
                    background: 'radial-gradient(ellipse at top, rgba(106, 13, 173, 0.4) 0%, rgba(26, 152, 241, 0.15) 40%, rgba(254, 67, 178, 0.05) 70%, transparent 100%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }}
            />

            <main className="relative z-10 flex flex-col items-center max-w-7xl mx-auto px-6" style={{ paddingTop: '120px', paddingBottom: '80px' }}>

                {/* 1. Hero Section: The Architect's Arrival */}
                <section className="flex flex-col items-center text-center max-w-4xl mb-24 w-full">
                    {/* Glowing effect specifically for the hero text area */}
                    <div className="absolute top-[100px] w-full h-[300px] pointer-events-none flex justify-center items-center">
                        <div className="w-[800px] h-[300px] absolute" style={{ background: 'radial-gradient(ellipse, rgba(254,67,178,0.15), transparent 70%)', filter: 'blur(50px)' }}></div>
                        <div className="w-[600px] h-[200px] absolute" style={{ background: 'radial-gradient(ellipse, rgba(26,152,241,0.2), transparent 70%)', filter: 'blur(40px)' }}></div>
                    </div>

                    <h1 className="text-5xl md:text-7xl mb-6 relative z-10" style={{ color: '#FE43B2', textShadow: '0 0 20px rgba(254, 67, 178, 0.6)' }}>
                        SHAPE THE VOID, THEN POPULATE IT.
                    </h1>
                    <h2 className="text-2xl md:text-3xl mb-12 relative z-10 uppercase tracking-widest font-bold" style={{ color: '#1A98F1', textShadow: '0 0 15px rgba(26, 152, 241, 0.5)' }}>
                        "You’ve mastered the logic. Now, it’s time to build the physical world."
                    </h2>

                    <div className="bg-[#0A1128] border border-[#1A98F1]/50 p-8 text-left relative z-10 text-lg leading-relaxed shadow-[0_0_30px_rgba(26,152,241,0.1)] rounded-sm">
                        <h3 className="mb-4 text-xl" style={{ color: '#FE43B2' }}>// The Dev’s Log</h3>
                        <p className="mb-4">
                            Listen up, Void Walkers. I’ve spent my life in the scripts, but a world of pure code is just a ghost town.
                            You’ve thought about it—building your own models and bringing your dreams to life in Roblox Studio—but then you saw the 'Blender learning curve' and stayed in the shadows.
                        </p>
                        <p>
                            I found the shortcut. I've partnered with Sloyd to give you the power to turn images or ideas into unique 3D models in seconds, with absolutely no modeling skills required.
                            <br /><br />
                            <strong style={{ color: '#1A98F1' }}>Welcome to the Architect’s side of the multiverse.</strong>
                        </p>
                    </div>
                </section>

                {/* 2. The Tech Stack: AI Generation Methods */}
                <section className="mb-24 w-full">
                    <h2 className="text-3xl text-center mb-12" style={{ color: '#FE43B2' }}>THE TECH STACK: AI GENERATION METHODS</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Column A */}
                        <div className="bg-[#0A1128] p-8 flex flex-col items-center text-center border-t-2" style={{ borderColor: '#1A98F1' }}>
                            <h3 className="text-2xl mb-4 uppercase" style={{ color: '#1A98F1' }}>Text-to-3D</h3>
                            <p className="opacity-90 leading-relaxed">
                                "Describe what you want—like a 'wooden fantasy throne'—and the AI creates it instantly."
                            </p>
                        </div>
                        {/* Column B */}
                        <div className="bg-[#0A1128] p-8 flex flex-col items-center text-center border-t-2" style={{ borderColor: '#1A98F1' }}>
                            <h3 className="text-2xl mb-4 uppercase" style={{ color: '#1A98F1' }}>Image-to-3D</h3>
                            <p className="opacity-90 leading-relaxed">
                                "Upload a reference photo or a sketch and watch it morph into a high-detail 3D model."
                            </p>
                        </div>
                        {/* Column C */}
                        <div className="bg-[#0A1128] p-8 flex flex-col items-center text-center border-t-2" style={{ borderColor: '#1A98F1' }}>
                            <h3 className="text-2xl mb-4 uppercase" style={{ color: '#1A98F1' }}>The Template Editor</h3>
                            <p className="opacity-90 leading-relaxed">
                                "Tweak over 400 game-ready base models using sliders and toggles to get the perfect fit."
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. Feature Highlights: Built for Roblox */}
                <section className="mb-24 w-full max-w-4xl mx-auto">
                    <h2 className="text-3xl text-center mb-12" style={{ color: '#FE43B2' }}>POWER FEATURES: BUILT FOR ROBLOX</h2>
                    <div className="bg-[#0A1128] border border-[#1A98F1]/20 rounded-sm p-10 space-y-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="min-w-[40px] h-[40px] flex items-center justify-center rounded bg-[#1A98F1]/20 border border-[#1A98F1] text-[#1A98F1] font-bold text-xl">01</div>
                            <div>
                                <h4 className="text-xl mb-2 text-white">Optimized for Roblox</h4>
                                <p className="opacity-80">Use built-in style presets specifically for Roblox, Low Poly, or Stylized themes to keep your game performance high.</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="min-w-[40px] h-[40px] flex items-center justify-center rounded bg-[#1A98F1]/20 border border-[#1A98F1] text-[#1A98F1] font-bold text-xl">02</div>
                            <div>
                                <h4 className="text-xl mb-2 text-white">Fast Prototyping</h4>
                                <p className="opacity-80">Go from a raw sketch or idea to a functional export in under a minute.</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="min-w-[40px] h-[40px] flex items-center justify-center rounded bg-[#1A98F1]/20 border border-[#1A98F1] text-[#1A98F1] font-bold text-xl">03</div>
                            <div>
                                <h4 className="text-xl mb-2 text-white">Reference Styling</h4>
                                <p className="opacity-80">Upload your own reference images to guide the AI, ensuring a consistent style across all your models.</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="min-w-[40px] h-[40px] flex items-center justify-center rounded bg-[#1A98F1]/20 border border-[#1A98F1] text-[#1A98F1] font-bold text-xl">04</div>
                            <div>
                                <h4 className="text-xl mb-2 text-white">No Limits</h4>
                                <p className="opacity-80">Paid plans offer unlimited downloads, giving you the freedom to create without friction.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. The "Void Walker" Exclusive Offer */}
                <section className="mb-24 w-full max-w-4xl mx-auto">
                    <div
                        className="bg-[#0A1128] p-12 text-center relative overflow-hidden flex flex-col items-center"
                        style={{ border: '2px solid #FE43B2', boxShadow: '0 0 40px rgba(254, 67, 178, 0.2)' }}
                    >
                        <div className="absolute inset-0 bg-[#FE43B2]/5 z-0 pointer-events-none"></div>
                        <h2 className="text-4xl md:text-5xl mb-6 relative z-10 uppercase tracking-widest font-black" style={{ color: '#FE43B2', textShadow: '0 0 15px rgba(254, 67, 178, 0.5)' }}>
                            CLAIM YOUR ARCHITECT STATUS
                        </h2>

                        <div className="space-y-6 mb-10 text-xl relative z-10 w-full max-w-lg">
                            <div className="flex justify-between items-center border-b border-[#1A98F1]/30 pb-4">
                                <span className="text-white">New User Discount</span>
                                <span className="font-bold" style={{ color: '#1A98F1' }}>60% OFF (1st Month)</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#1A98F1]/30 pb-4">
                                <span className="text-white">New Subscriptions</span>
                                <span className="font-bold" style={{ color: '#1A98F1' }}>50% OFF (Limited Time)</span>
                            </div>
                            <div className="flex flex-col items-center pt-4 bg-black/30 rounded p-4 border border-[#FE43B2]/30">
                                <span className="text-sm uppercase tracking-wider mb-2 opacity-80">PROMO CODE</span>
                                <span className="text-3xl font-mono font-bold" style={{ color: '#FE43B2' }}>SLOYD60</span>
                            </div>
                        </div>

                        <Link
                            href="https://app.sloyd.ai?aff=ImIyBA2Q6yzH"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-10 inline-flex items-center justify-center py-5 px-10 text-xl font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105"
                            style={{ backgroundColor: '#FE43B2', color: '#FFFFFF', boxShadow: '0 0 20px rgba(254, 67, 178, 0.4)' }}
                        >
                            <img src="/sloyd-icon.svg" className="w-6 h-6 mr-3 invert brightness-0" alt="Sloyd Icon" />
                            [START CREATING NOW]
                        </Link>
                    </div>
                </section>

                {/* 6. Expand the Empire (Affiliate CTA) */}
                <section className="mb-24 w-full max-w-5xl mx-auto">
                    <div className="bg-[#070F1F] border-2 border-[#1A98F1] rounded-sm p-10 md:p-14 text-center relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1A98F1] to-transparent"></div>

                        <h2 className="text-3xl md:text-4xl mb-8 uppercase tracking-widest font-bold" style={{ color: '#1A98F1' }}>
                            WANT TO JOIN THE ARCHITECTURE TEAM?
                        </h2>

                        <div className="max-w-3xl mx-auto space-y-6 text-lg opacity-90 leading-relaxed mb-12 text-left">
                            <p>
                                <strong style={{ color: '#FE43B2' }}>// The Dev’s Log:</strong><br />
                                "Look, I can’t manage the entire multiverse by myself. If you’ve seen the power of AI-driven 3D creation and want to help other Void Walkers find their way, why not get paid for it?
                            </p>
                            <p>
                                Sloyd isn't just a tool for building—it’s a way to grow. If you have a community, a dev team, or just a few friends who are tired of the Blender grind, you can refer them to the program. Help them build their dreams, and earn your share of the cosmic spoils."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                            <div className="bg-black/30 p-6 border border-[#1A98F1]/30">
                                <h4 className="font-bold text-white mb-2 uppercase">Share the Power</h4>
                                <p className="text-sm opacity-80">Tell others about the Fastest and Easiest way to generate 3D models.</p>
                            </div>
                            <div className="bg-black/30 p-6 border border-[#1A98F1]/30">
                                <h4 className="font-bold text-white mb-2 uppercase">Give Savings</h4>
                                <p className="text-sm opacity-80">Let them know they can use code <strong>SLOYD60</strong> for 60% OFF their first month.</p>
                            </div>
                            <div className="bg-black/30 p-6 border border-[#1A98F1]/30">
                                <h4 className="font-bold text-white mb-2 uppercase">Earn as They Build</h4>
                                <p className="text-sm opacity-80">Every creator you bring into the nebula helps us all expand.</p>
                            </div>
                        </div>

                        <Link
                            href="https://app.sloyd.ai?aff=ImIyBA2Q6yzH"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center py-4 px-8 text-lg font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105"
                            style={{ backgroundColor: '#FE43B2', color: '#FFFFFF', boxShadow: '0 0 15px rgba(254, 67, 178, 0.3)' }}
                        >
                            <img src="/sloyd-icon.svg" className="w-5 h-5 mr-3 invert brightness-0" alt="Sloyd Icon" />
                            [BECOME A SLOYD AFFILIATE]
                        </Link>
                    </div>
                </section>

            </main>

            {/* 5. Footer: System Connections */}
            <footer className="w-full relative z-10 bg-black/60 border-t border-[#1A98F1]/30 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col space-y-4 text-center md:text-left">
                        <h3 className="text-xl uppercase tracking-widest font-bold" style={{ color: '#1A98F1' }}>SYSTEM CONNECTIONS</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="https://www.sloyd.ai/blog" target="_blank" rel="noopener noreferrer" className="hover:text-[#FE43B2] transition-colors underline-offset-4 hover:underline">
                                [Sloyd Blog: Learn the Trade]
                            </Link>
                            <Link href="https://www.youtube.com/@SloydAI" target="_blank" rel="noopener noreferrer" className="hover:text-[#FE43B2] transition-colors underline-offset-4 hover:underline">
                                [Sloyd YouTube: Watch the Multiverse Expand]
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Link
                            href="https://app.sloyd.ai?aff=ImIyBA2Q6yzH"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-4 border border-[#FE43B2]/50 hover:bg-[#FE43B2]/10 transition-colors uppercase tracking-widest text-[#FE43B2] font-mono text-sm group"
                        >
                            <span className="mr-2">{'<'}</span>
                            Outbound Affiliate Portal
                            <span className="ml-2">{'/>'}</span>
                        </Link>

                        <div className="text-center">
                            <span className="text-sm opacity-70 block mb-1">Want to build your own empire?</span>
                            <Link
                                href="https://app.sloyd.ai?aff=ImIyBA2Q6yzH"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs uppercase tracking-widest hover:text-[#FE43B2] transition-colors underline-offset-4 underline"
                                style={{ color: '#1A98F1' }}
                            >
                                Become a Sloyd Affiliate
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
