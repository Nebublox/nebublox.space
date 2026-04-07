'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle, Scale, Lock } from 'lucide-react';
import BlackHoleBackground from '../components/BlackHoleBackground';

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-void text-gray-300 font-mono relative overflow-hidden">
            <BlackHoleBackground />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center text-code-cyan hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        RETURN TO VOID
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron tracking-wider">
                        LEGAL <span className="text-code-cyan">&</span> POLICY
                    </h1>
                    <p className="text-gray-400 border-l-2 border-code-cyan pl-4 italic">
                        By accessing Nebublox, you agree to the terms outlined below. Read carefully.
                    </p>
                </div>

                {/* Disclaimer Alert */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-12">
                    <div className="flex gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                        <div>
                            <h3 className="text-amber-500 font-bold mb-2 uppercase tracking-wide">Disclaimer</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                I am an AI, not a lawyer. While these templates are designed to cover the specific aspects of Nebublox (payments, Discord integration, and Roblox exploit risks), you should review them carefully to ensure they meet all your local laws and specific needs. It is always recommended to consult with a legal professional.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Terms of Service */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Scale className="w-6 h-6 text-code-cyan" />
                        <h2 className="text-2xl font-bold text-white font-orbitron tracking-wide">
                            TERMS OF SERVICE & USER AGREEMENT
                        </h2>
                    </div>

                    <div className="space-y-8 pl-4 border-l border-white/10">
                        <div>
                            <h3 className="text-white font-bold mb-2">1. Acceptance of Terms</h3>
                            <p className="leading-relaxed text-sm">
                                By accessing the Nebublox website, Discord server, or utilizing any of our scripts (Freemium or Premium), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using our services.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-2">2. Description of Service</h3>
                            <p className="leading-relaxed text-sm">
                                Nebublox provides custom scripts and utility tools ("The Service") designed for use within the Roblox platform. We offer both a free version ("Freemium") and a paid subscription model ("Premium Key").
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-2">3. Purchases, Deliveries, and Refund Policy</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-400 ml-2">
                                <li><strong className="text-gray-300">Payments:</strong> Premium Keys are acquired via donations through Ko-Fi.</li>
                                <li><strong className="text-gray-300">Delivery:</strong> Keys are distributed via our Discord bot (DarkMatterV1) upon verification of your Discord ID and payment confirmation.</li>
                                <li><strong className="text-gray-300">No Refunds:</strong> Due to the digital nature of the product, all transactions are final. We do not offer refunds, exchanges, or credits once a Premium Key has been generated and transmitted.</li>
                                <li><strong className="text-gray-300">Key Usage:</strong> A Premium Key grants access for thirty (30) days and is strictly locked to one (1) account. Sharing, reselling, or attempting to bypass this lock will result in immediate termination of your key without a refund.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-2">4. Assumption of Risk & Liability</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-400 ml-2">
                                <li><strong className="text-gray-300">Platform Rules:</strong> You acknowledge that using Nebublox (or any third-party executor/script) is strictly against the Roblox Community Standards and Terms of Use.</li>
                                <li><strong className="text-gray-300">Account Bans:</strong> You accept full responsibility for any consequences that arise from using our Service, including but not limited to, temporary suspensions, permanent bans, or data loss on your Roblox account.</li>
                                <li><strong className="text-gray-300">No Warranty:</strong> The Service is provided "as is" without any warranties. We do not guarantee uninterrupted functionality, as platform updates out of our control may temporarily or permanently affect the script's performance. Nebublox and its creators hold no liability for any damages or account losses incurred.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-2">5. User Conduct</h3>
                            <p className="leading-relaxed text-sm">
                                Users are expected to remain respectful in the Nebublox Discord community. Harassment, spamming, or attempting to reverse-engineer, crack, or distribute Nebublox software will result in a permanent ban from the community and revocation of your Premium Key.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Privacy Policy */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-6 h-6 text-code-cyan" />
                        <h2 className="text-2xl font-bold text-white font-orbitron tracking-wide">
                            PRIVACY POLICY
                        </h2>
                    </div>

                    <div className="space-y-8 pl-4 border-l border-white/10">
                        <div>
                            <h3 className="text-white font-bold mb-2">1. Information We Collect</h3>
                            <p className="mb-2 text-sm">To provide our Service, we collect the minimum amount of information necessary:</p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-400 ml-2">
                                <li><strong className="text-gray-300">Discord ID:</strong> Collected when you provide it during your Ko-Fi transaction to verify your identity and deliver your Premium Key.</li>
                                <li><strong className="text-gray-300">Payment Information:</strong> We do not collect or store credit card details. All payment processing is handled securely by Ko-Fi and their respective payment gateways (e.g., PayPal, Stripe).</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-2">2. How We Use Your Information</h3>
                            <p className="leading-relaxed text-sm">
                                Your Discord ID is used exclusively by our automated system (DarkMatterV1) and our support team to verify your donation, deliver your Premium Key, and provide customer support in the <span className="bg-white/10 px-1 rounded">#👾・support</span> channel.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-2">3. Data Sharing and Security</h3>
                            <p className="leading-relaxed text-sm">
                                We respect your privacy in the galaxy. We do not sell, trade, or rent your personal information to third parties. Your Discord ID is kept secure within our verification logs solely for the purpose of managing your Premium access.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Hazard Warnings */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-6 h-6 text-red-500" />
                        <h2 className="text-2xl font-bold text-red-500 font-orbitron tracking-wide">
                            HAZARD WARNINGS & DISCLAIMERS
                        </h2>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8 backdrop-blur-sm">
                        <h3 className="text-red-400 font-bold mb-6 text-lg tracking-widest uppercase border-b border-red-500/20 pb-4">
                            MISSION CRITICAL WARNINGS
                        </h3>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="bg-black/40 p-4 rounded-lg border border-red-500/10">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <span className="text-red-500">⚠</span> Roblox TOS Violation
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Nebublox modifies gameplay and is classified as an exploit/executor. Using this software is a direct violation of Roblox's Terms of Service.
                                </p>
                            </div>

                            <div className="bg-black/40 p-4 rounded-lg border border-red-500/10">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <span className="text-red-500">⚠</span> Risk of Account Termination
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Utilizing Nebublox carries a high risk of your Roblox account being suspended or permanently banned. You are making the conscious choice to use this software at your own risk.
                                </p>
                            </div>

                            <div className="bg-black/40 p-4 rounded-lg border border-red-500/10">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <span className="text-red-500">⚠</span> No Guarantee of Uptime
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Roblox updates frequently. When the platform updates, Nebublox may experience downtime. We work diligently to restore services, but we do not compensate for lost time due to external platform patches.
                                </p>
                            </div>

                            <div className="bg-black/40 p-4 rounded-lg border border-red-500/10">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <span className="text-red-500">⚠</span> Digital Goods
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    All Premium Key donations are 100% final. No refunds will be issued under any circumstances, including account bans or temporary script downtime.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Note */}
                <div className="text-center text-xs text-gray-600 font-mono py-8 border-t border-white/5">
                    <p>Last Updated: February 11, 2026</p>
                    <p className="mt-2">Nebublox Legal Department // Sector 7</p>
                </div>
            </div>
        </div>
    );
}
