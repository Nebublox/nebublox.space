'use client';

import React from 'react';

export default function BlackHoleLogo({ size = 100 }: { size?: number }) {
    return (
        <div
            className="relative flex-center"
            style={{ width: size, height: size }}
        >
            {/* The Void - Central Black Hole */}
            <div
                className="absolute rounded-full bg-black"
                style={{
                    width: size * 0.4,
                    height: size * 0.4,
                    boxShadow: `
            inset 0 0 ${size * 0.2}px rgba(106, 13, 173, 0.8),
            0 0 ${size * 0.3}px rgba(106, 13, 173, 0.4)
          `
                }}
            />

            {/* Accretion Disk - Rotating Ring */}
            <svg
                className="absolute accretion-disk"
                width={size}
                height={size}
                viewBox="0 0 100 100"
            >
                <defs>
                    {/* Purple Gradient for Accretion Disk */}
                    <linearGradient id="accretionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#6A0DAD', stopOpacity: 0.8 }} />
                        <stop offset="50%" style={{ stopColor: '#9d4edd', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#3c096c', stopOpacity: 0.6 }} />
                    </linearGradient>

                    {/* Glow Filter */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Outer Ring */}
                <ellipse
                    cx="50"
                    cy="50"
                    rx="45"
                    ry="15"
                    fill="none"
                    stroke="url(#accretionGradient)"
                    strokeWidth="3"
                    opacity="0.6"
                    filter="url(#glow)"
                />

                {/* Middle Ring */}
                <ellipse
                    cx="50"
                    cy="50"
                    rx="38"
                    ry="12"
                    fill="none"
                    stroke="url(#accretionGradient)"
                    strokeWidth="2"
                    opacity="0.8"
                    filter="url(#glow)"
                />

                {/* Inner Ring */}
                <ellipse
                    cx="50"
                    cy="50"
                    rx="30"
                    ry="9"
                    fill="none"
                    stroke="url(#accretionGradient)"
                    strokeWidth="1.5"
                    opacity="1"
                    filter="url(#glow)"
                />
            </svg>

            {/* Event Horizon Glow */}
            <div
                className="absolute rounded-full"
                style={{
                    width: size * 0.6,
                    height: size * 0.6,
                    background: 'radial-gradient(circle, rgba(106, 13, 173, 0.3) 0%, transparent 70%)',
                    animation: 'pulse 3s ease-in-out infinite'
                }}
            />
        </div>
    );
}
