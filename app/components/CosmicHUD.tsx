'use client';

import React from 'react';
import Link from 'next/link';

export default function CosmicHUD() {
    return (
        <footer
            className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-100 animate-slideUp"
            style={{
                background: 'rgba(10, 5, 20, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(138, 43, 226, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(106, 13, 173, 0.3)'
            }}
        >
            <div className="px-6 py-4 flex items-center justify-between text-sm">

                {/* Left: Status Indicator */}
                <div className="flex items-center gap-3">
                    {/* Pulsing Green Dot */}
                    <div
                        className="w-2.5 h-2.5 rounded-full animate-pulse"
                        style={{
                            backgroundColor: '#39FF14',
                            boxShadow: '0 0 10px rgba(57, 255, 20, 0.8), 0 0 20px rgba(57, 255, 20, 0.4)',
                            animation: 'statusPulse 2s ease-in-out infinite'
                        }}
                    />
                    <span
                        className="font-mono uppercase tracking-wider"
                        style={{ color: '#39FF14', fontSize: '12px' }}
                    >
                        NEBULA CORE: ONLINE
                    </span>
                </div>

                {/* Center: Brand Identity */}
                <div
                    className="hidden md:block font-mono text-center"
                    style={{ color: '#E0E0E0', fontSize: '12px' }}
                >
                    © 2026 NEBUBLOX // ARCHITECT ENGINE
                </div>

                {/* Right: Social Links / "Air Locks" */}
                <div className="flex items-center gap-6">
                    {/* Discord */}
                    <Link
                        href="https://discord.gg/nebublox"
                        target="_blank"
                        className="text-starlight hover:text-code-cyan transition-all duration-300 group"
                        style={{
                            filter: 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))';
                        }}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                    </Link>

                    {/* Docs */}
                    <Link
                        href="/docs"
                        className="text-starlight hover:text-code-cyan transition-all duration-300"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))';
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </Link>

                    {/* Roblox */}
                    <Link
                        href="https://www.roblox.com/communities/331995130/BloxSmith-AI"
                        target="_blank"
                        className="text-starlight hover:text-code-cyan transition-all duration-300"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))';
                        }}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.926 23.998c.414 0 .75-.336.75-.75V.752c0-.414-.336-.75-.75-.75H5.074c-.414 0-.75.336-.75.75v22.496c0 .414.336.75.75.75h13.852zm-2.824-5.148l-7.83-2.02 2.02-7.83 7.83 2.02-2.02 7.83zm-2.253-8.73c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z" />
                        </svg>
                    </Link>
                </div>

            </div>

            {/* Custom Animations */}
            <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes statusPulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(57, 255, 20, 0.8), 0 0 20px rgba(57, 255, 20, 0.4);
            opacity: 1;
          }
          50% {
            box-shadow: 0 0 20px rgba(57, 255, 20, 1), 0 0 30px rgba(57, 255, 20, 0.6);
            opacity: 0.8;
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
      `}</style>
        </footer>
    );
}
