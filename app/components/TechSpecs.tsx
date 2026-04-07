'use client';

import React from 'react';

export default function TechSpecs() {
    return (
        <div
            className="w-full py-3 border-t border-b"
            style={{
                background: 'rgba(0, 0, 0, 0.95)',
                borderColor: 'rgba(157, 0, 255, 0.3)'
            }}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-12 text-center">

                {/* AI (Event Horizon) */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-mono uppercase tracking-wider" style={{ color: '#C0C0C0' }}>
                        AI
                    </span>
                    <span className="text-xs font-mono" style={{ color: '#9D00FF' }}>
                        EVENT HORIZON
                    </span>
                </div>

                {/* Divider */}
                <div className="h-4 w-px" style={{ background: 'linear-gradient(to bottom, transparent, #9D00FF, transparent)' }} />

                {/* MCP (Direct Studio Link) */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-mono uppercase tracking-wider" style={{ color: '#C0C0C0' }}>
                        MCP
                    </span>
                    <span className="text-xs font-mono" style={{ color: '#9D00FF' }}>
                        DIRECT STUDIO LINK
                    </span>
                </div>

                {/* Divider */}
                <div className="h-4 w-px" style={{ background: 'linear-gradient(to bottom, transparent, #9D00FF, transparent)' }} />

                {/* V1 (Nebula Core) */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-mono uppercase tracking-wider" style={{ color: '#C0C0C0' }}>
                        V1
                    </span>
                    <span className="text-xs font-mono" style={{ color: '#9D00FF' }}>
                        NEBULA CORE
                    </span>
                </div>

            </div>
        </div>
    );
}
