'use client';

import React from 'react';

export default function LiveTelemetry() {
    return (
        <div className="w-full relative overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
            {/* Scanning Radar Line */}
            <div
                className="absolute top-0 bottom-0 w-1"
                style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.5), transparent)',
                    animation: 'radar-scan 4s linear infinite',
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)'
                }}
            />

            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

                {/* Entities Manifested */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl font-bold font-mono" style={{ color: '#9D00FF', textShadow: '0 0 10px rgba(157, 0, 255, 0.8)' }}>
                        10,000+
                    </span>
                    <span className="text-xs font-mono text-starlight/60 uppercase tracking-wider">
                        ENTITIES MANIFESTED
                    </span>
                </div>

                {/* Architects Linked */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl font-bold font-mono" style={{ color: '#00FFFF', textShadow: '0 0 10px rgba(0, 255, 255, 0.8)' }}>
                        500+
                    </span>
                    <span className="text-xs font-mono text-starlight/60 uppercase tracking-wider">
                        ARCHITECTS LINKED
                    </span>
                </div>

                {/* Core Stability */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl font-bold font-mono" style={{ color: '#39FF14', textShadow: '0 0 10px rgba(57, 255, 20, 0.8)' }}>
                        99.8%
                    </span>
                    <span className="text-xs font-mono text-starlight/60 uppercase tracking-wider">
                        CORE STABILITY
                    </span>
                </div>

            </div>

            <style jsx>{`
        @keyframes radar-scan {
          from {
            left: 0%;
          }
          to {
            left: 100%;
          }
        }
      `}</style>
        </div>
    );
}
