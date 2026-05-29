'use client';

import React, { useState, useRef, useEffect } from 'react';
import NextImage from 'next/image';
import { Send, Loader2, Trash2, ExternalLink, TerminalSquare } from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}

const SUGGESTIONS = [
    "What executors work?",
    "How much is Premium?",
    "Link to Discord?",
    "Help me with an error"
];

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
                    text: "System Online. I am DarkMatterV1. I hold the knowledge of Nebublox. How can I assist you with executors, pricing, or the Discord nexus?"
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
                text: "System Online. I am DarkMatterV1. Ready for your inquiries."
            }]);
        }, 800);
    };

    const processAIResponse = async (userText: string) => {
        const text = userText.toLowerCase();
        
        // Simulating network delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));

        if (text.includes("executor") || text.includes("work") || text.includes("support")) {
            return "Currently working executors include: Solara, Wave, AWP, Delta, Codex, Synapse Z, and Nezur.\n\nDetected/Down executors: Hydrogen, Arceus X, Trigon, Fluxus, and KRNL.";
        }
        
        if (text.includes("price") || text.includes("premium") || text.includes("cost") || text.includes("much") || text.includes("buy")) {
            return "We offer a Free Tier which requires the Jnkie key system. \n\nFor unrestricted access, Premium is $7.99/month, or you can purchase Lifetime Premium for $14.99.";
        }
        
        if (text.includes("discord") || text.includes("server") || text.includes("link") || text.includes("community")) {
            return "You can join our communication nexus here: https://discord.gg/nebublox";
        }
        
        if (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("yo")) {
            return "Greetings. I am DarkMatterV1. State your inquiry regarding Nebublox.";
        }

        // Fallback for complex issues, errors, or unknown queries
        return "My core logic cannot process this inquiry. If you have a complex issue, an error, or require direct human support, you must ping the owner 'Nebublox' in our Discord server: https://discord.gg/nebublox";
    };

    const handleSendMessage = async (textOverride?: string) => {
        const textToProcess = textOverride || inputText;
        if (!textToProcess.trim() || isLoading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: textToProcess };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        const botResponse = await processAIResponse(textToProcess);
        
        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: botResponse
        };
        setMessages(prev => [...prev, botMsg]);
        setIsLoading(false);
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
                    className="fixed bottom-44 right-6 w-80 md:w-96 h-[550px] z-50 rounded-lg overflow-hidden flex flex-col"
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
                        className="px-4 py-3 border-b flex items-center justify-between bg-black/40 shrink-0"
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
                                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm font-mono leading-relaxed whitespace-pre-wrap ${msg.sender === 'user'
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
                                    <span className="text-xs text-gray-400 font-mono">Processing Data...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Pre-Answers / Suggestions */}
                    <div className="px-3 pb-2 pt-1 flex flex-wrap gap-2 shrink-0 bg-black/20">
                        {SUGGESTIONS.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(suggestion)}
                                disabled={isLoading}
                                className="text-[10px] font-mono text-gray-300 bg-white/5 border border-white/10 hover:border-singularity hover:text-white px-2.5 py-1.5 rounded transition-all disabled:opacity-50 flex items-center gap-1.5"
                            >
                                <TerminalSquare size={10} className="text-singularity" />
                                {suggestion}
                            </button>
                        ))}
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-4 border-t border-white/10 bg-black/40 shrink-0">
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
                                onClick={() => handleSendMessage()}
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
