'use client';

import React, { useState, useRef, useEffect } from 'react';
import NextImage from 'next/image';
import { Send, Loader2, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}

export default function DarkMatterAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initial Greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 'init',
                    sender: 'bot',
                    text: "System Online. I am DarkMatterV1. For intelligence on Premium access, to broadcast suggestions, or to intercept future giveaways, you must align with the collective. Join the communication nexus."
                }
            ]);
        }
    }, [messages.length]);

    // Auto-scroll to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleClearMemory = () => {
        setMessages([{
            id: Date.now().toString(),
            sender: 'bot',
            text: 'Memory Core purged. Re-initializing protocols...'
        }]);
        setTimeout(() => {
            setMessages([{
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: "System Online. I am DarkMatterV1. Join the Discord for all inquiries."
            }]);
        }, 800);
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        // Simulate processing time
        setTimeout(() => {
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: "My protocols prevent direct data transfer here. Access the Discord server for Premium details, suggestions, and giveaways."
            };
            setMessages(prev => [...prev, botMsg]);
            setIsLoading(false);
        }, 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    return (
        <>
            {/* Floating Assistant Widget */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-6 z-50 group"
                style={{
                    animation: 'float 3s ease-in-out infinite'
                }}
            >
                {/* Hologram Glow Effect */}
                <div
                    className="absolute inset-0 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{
                        background: 'radial-gradient(circle, rgba(157, 0, 255, 0.4) 0%, rgba(0, 0, 0, 0) 70%)',
                        transform: 'scale(1.5)'
                    }}
                />

                {/* Assistant Icon Container */}
                <div
                    className="relative w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:scale-110 overflow-hidden"
                >
                    <NextImage
                        src="/darkmatter-robot.png"
                        alt="Assistant"
                        width={56}
                        height={56}
                        className="w-12 h-12 object-contain"
                    />
                </div>

                {/* Pulsing Ring */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        border: '2px solid rgba(157, 0, 255, 0.3)',
                        animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                    }}
                />
            </button>

            {/* Chat Panel (when open) */}
            {isOpen && (
                <div
                    className="fixed bottom-44 right-6 w-80 md:w-96 h-[500px] z-50 rounded-lg overflow-hidden flex flex-col"
                    style={{
                        animation: 'slideInRight 0.3s ease-out',
                        border: '1px solid rgba(157, 0, 255, 0.3)',
                        background: 'rgba(10, 10, 15, 0.95)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 0 50px rgba(0,0,0,0.8)'
                    }}
                >
                    {/* Header */}
                    <div
                        className="px-4 py-3 border-b flex items-center justify-between bg-black/40"
                        style={{ borderColor: 'rgba(157, 0, 255, 0.2)' }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-singularity/50 bg-black/50 p-1">
                                <NextImage src="/darkmatter-robot.png" alt="Assistant" width={32} height={32} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white font-mono tracking-wider">DarkMatterV1</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">System Online</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Clear Memory Button */}
                            <button
                                onClick={handleClearMemory}
                                className="text-gray-500 hover:text-code-pink transition-colors p-1"
                                title="Purge System"
                            >
                                <Trash2 size={14} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-white transition-colors ml-1"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm font-mono leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-singularity/20 border border-singularity/30 text-white'
                                        : 'bg-white/5 border border-white/10 text-gray-300'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin text-singularity" />
                                    <span className="text-xs text-gray-400 font-mono">Processing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* CTA Footer */}
                    <div className="p-3 bg-singularity/10 border-t border-singularity/20">
                        <Link
                            href="https://discord.gg/nebublox"
                            target="_blank"
                            className="w-full flex items-center justify-center gap-2 py-2 rounded bg-singularity hover:bg-singularity/80 transition-colors text-white text-xs font-bold uppercase tracking-wider"
                        >
                            <ExternalLink size={14} />
                            Join the Community
                        </Link>
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-4 border-t border-white/10 bg-black/40">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Command input..."
                                className="flex-1 bg-black/40 border border-white/20 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-singularity placeholder-gray-600 focus:bg-white/5 transition-colors"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputText.trim()}
                                className="px-3 py-2 bg-singularity/20 border border-singularity/40 rounded hover:bg-singularity/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={14} className="text-singularity" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-10px);
                }
                }

                @keyframes ping {
                75%, 100% {
                    transform: scale(1.4);
                    opacity: 0;
                }
                }

                @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
                }
            `}</style>
        </>
    );
}
