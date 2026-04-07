'use client';

import React from 'react';
import Link from 'next/link';

export default function SecurityClearance() {
    return (
        <div className="w-full py-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <h2
                    className="text-4xl md:text-5xl font-black text-center mb-4 uppercase tracking-wider"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                    SECURITY CLEARANCE LEVELS
                </h2>
                <p className="text-center text-starlight/60 font-mono text-sm mb-16">
                    {/* // SELECT YOUR AUTHORITY TIER */}
                </p>

                {/* Clearance Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* INITIATE CLEARANCE (Free) */}
                    <div
                        className="relative p-8 backdrop-blur-md transition-all duration-300 hover:scale-105"
                        style={{
                            background: 'rgba(10, 10, 15, 0.7)',
                            border: '2px solid rgba(0, 255, 255, 0.4)',
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
                        }}
                    >
                        {/* Geometric Circle Icon */}
                        <div
                            className="w-16 h-16 rounded-full mx-auto mb-6"
                            style={{
                                border: '2px solid rgba(0, 255, 255, 0.6)',
                                background: 'radial-gradient(circle, rgba(0, 255, 255, 0.2), transparent)'
                            }}
                        />

                        <h3 className="text-2xl font-bold text-center mb-2 text-code-cyan uppercase" style={{ fontFamily: 'Orbitron' }}>
                            INITIATE CLEARANCE
                        </h3>

                        <p className="text-center text-4xl font-bold text-white mb-6">$0</p>

                        <ul className="space-y-3 mb-8 text-starlight/80 font-mono text-sm">
                            <li className="flex items-center gap-2">
                                <span className="text-code-cyan">▸</span> Basic Generation Access
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-code-cyan">▸</span> 100 Objects/Month
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-code-cyan">▸</span> Community Support
                            </li>
                        </ul>

                        <Link
                            href="/download"
                            className="block w-full py-3 text-center border-2 border-code-cyan text-code-cyan font-mono uppercase tracking-wider hover:bg-code-cyan/10 transition-all duration-300"
                        >
                            GRANT ACCESS
                        </Link>
                    </div>

                    {/* ARCHITECT CLEARANCE (Pro) */}
                    <div
                        className="relative p-8 backdrop-blur-md transition-all duration-300 hover:scale-105"
                        style={{
                            background: 'rgba(10, 10, 15, 0.8)',
                            border: '2px solid rgba(157, 0, 255, 0.6)',
                            boxShadow: '0 0 30px rgba(157, 0, 255, 0.4)',
                            animation: 'shimmer 3s ease-in-out infinite'
                        }}
                    >
                        {/* UNRESTRICTED ACCESS Badge */}
                        <div
                            className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-wider"
                            style={{
                                background: 'linear-gradient(90deg, rgba(157, 0, 255, 0.9), rgba(106, 13, 173, 0.9))',
                                color: 'white',
                                boxShadow: '0 0 20px rgba(157, 0, 255, 0.6)'
                            }}
                        >
                            UNRESTRICTED ACCESS
                        </div>

                        {/* Geometric Circle Icon - Glowing */}
                        <div
                            className="w-16 h-16 rounded-full mx-auto mb-6 relative"
                            style={{
                                border: '2px solid rgba(157, 0, 255, 0.8)',
                                background: 'radial-gradient(circle, rgba(157, 0, 255, 0.4), transparent)',
                                boxShadow: '0 0 30px rgba(157, 0, 255, 0.6)'
                            }}
                        >
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent, rgba(157, 0, 255, 0.4), transparent)',
                                    animation: 'spin 3s linear infinite'
                                }}
                            />
                        </div>

                        <h3 className="text-2xl font-bold text-center mb-2 uppercase" style={{ fontFamily: 'Orbitron', color: '#9D00FF' }}>
                            ARCHITECT CLEARANCE
                        </h3>

                        <p className="text-center text-4xl font-bold text-white mb-6">$30</p>

                        <ul className="space-y-3 mb-8 text-starlight/80 font-mono text-sm">
                            <li className="flex items-center gap-2">
                                <span style={{ color: '#9D00FF' }}>▸</span> Unlimited Generation
                            </li>
                            <li className="flex items-center gap-2">
                                <span style={{ color: '#9D00FF' }}>▸</span> Priority Processing
                            </li>
                            <li className="flex items-center gap-2">
                                <span style={{ color: '#9D00FF' }}>▸</span> Advanced AI Models
                            </li>
                            <li className="flex items-center gap-2">
                                <span style={{ color: '#9D00FF' }}>▸</span> Direct Studio Integration
                            </li>
                        </ul>

                        <Link
                            href="/download"
                            className="block w-full py-3 text-center text-white font-mono uppercase tracking-wider transition-all duration-300"
                            style={{
                                background: 'linear-gradient(90deg, rgba(157, 0, 255, 0.8), rgba(106, 13, 173, 0.8))',
                                boxShadow: '0 0 20px rgba(157, 0, 255, 0.6)'
                            }}
                        >
                            GRANT ACCESS
                        </Link>
                    </div>

                </div>

            </div>

            <style jsx>{`
        @keyframes shimmer {
          0%, 100% {
            box-shadow: 0 0 30px rgba(157, 0, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 50px rgba(157, 0, 255, 0.8), 0 0 80px rgba(157, 0, 255, 0.4);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
}
