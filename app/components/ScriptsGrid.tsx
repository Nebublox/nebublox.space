'use client';

import React from 'react';
import Link from 'next/link';
import ScriptCard from './ScriptCard';

// Placeholder scripts - replace with real data later
const SCRIPTS = [
    {
        gameName: 'Anime Ghost',
        scriptName: 'Anime Ghost',
        description: 'The ultimate repository for Anime Ghost enhancement. Curated library of powerful features designed to maximize your gameplay.',
        scriptUrl: 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxLoader.lua"))()',
        features: ['Smart Farm', 'Auto Rebirth', 'Anti-AFK', 'Auto Dungeon'],
        premiumFeatures: [],
        gameIcon: '/games/anime_ghost.png',
        videoUrl: 'https://www.youtube.com/embed/_cvzpeZlY2A'
    },
    {
        gameName: 'Anime Finals',
        scriptName: 'Anime Finals',
        description: 'Advanced automation for Anime Finals. Dominating every pixel of the platform with sleek, efficient code.',
        scriptUrl: 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxLoader.lua"))()',
        features: ['Auto Farm Mobs', 'Auto Boss', 'Skill Rotation', 'World TP'],
        premiumFeatures: [],
        gameIcon: '/games/anime_finals.png',
        videoUrl: 'https://www.youtube.com/embed/example2',
        isDiscontinued: true
    },
    {
        gameName: 'Anime Clash',
        scriptName: 'Anime Clash',
        description: 'Stop playing on default settings. Equip yourself with the most advanced tools for Anime Clash.',
        scriptUrl: 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxLoader.lua"))()',
        features: ['Smart Farm', 'Auto Ability', 'Auto Summon', 'FPS Boost'],
        premiumFeatures: [],
        gameIcon: '/games/anime_clash.png',
        videoUrl: 'https://www.youtube.com/embed/PpTSmzHN1aQ',
        isDiscontinued: true
    },
    {
        gameName: 'Anime Tactical',
        scriptName: 'Anime Tactical',
        description: 'The next generation of anime automation. Sleek, powerful, and built for the tactical edge. Master the grid and dominate the battlefield.',
        scriptUrl: 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxLoader.lua"))()',
        features: ['Auto Farm', 'Auto Skills', 'Tactical AI', 'Anti-AFK'],
        premiumFeatures: ['Elite Targeting', 'Priority Farm', 'Advanced Macros'],
        gameIcon: '/games/anime_tactical_new.png',
        videoUrl: 'https://www.youtube.com/embed/Y4b7JXDl9VQ'
    },
    {
        gameName: 'Anime Ethereal X',
        scriptName: 'Anime Ethereal X',
        description: 'Universal anime automation at its finest. Anime Ethereal X brings high-performance farming and tactical superiority to your fingertips.',
        scriptUrl: 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxLoader.lua"))()',
        features: ['Smart Farm', 'Auto Ability', 'World TP', 'FPS Boost'],
        premiumFeatures: ['Legendary Farm', 'God Mode Bypass', 'Stealth Mode'],
        gameIcon: '/games/anime_ethereal_x.png',
        videoUrl: 'https://www.youtube.com/embed/example3',
        isDiscontinued: true
    },
    {
        gameName: 'Anime Clicker',
        scriptName: 'Anime Clicker',
        description: 'Automate your clicking journey with the most advanced Anime Clicker script. Slay mobs and roll for greatness effortlessly.',
        scriptUrl: 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxLoader.lua"))()',
        features: ['Auto Click', 'Auto Roll', 'Smart Farm', 'Anti-AFK'],
        premiumFeatures: [],
        gameIcon: '/games/anime_clicker.png',
        videoUrl: 'https://www.youtube.com/embed/example4'
    },
    {
        gameName: 'Anime Leveling',
        scriptName: 'Anime Leveling',
        description: 'The ultimate leveling companion for Anime Leveling. Optimized combat automation and character gacha management.',
        scriptUrl: 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxLoader.lua"))()',
        features: ['Auto Kill', 'Auto Gacha', 'Smart Farm', 'World TP'],
        premiumFeatures: [],
        gameIcon: '/games/anime_leveling.png',
        videoUrl: 'https://www.youtube.com/embed/example5'
    },
    {
        gameName: 'Anime Destroyers',
        scriptName: 'Anime Destroyers',
        description: 'Dominate Anime Destroyers with our advanced script, featuring optimized farming capabilities.',
        scriptUrl: 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxLoader.lua"))()',
        features: ['Auto Farm', 'Auto Attack', 'Auto Quest', 'FPS Boost'],
        premiumFeatures: [],
        gameIcon: '/games/anime_destroyers_new.png',
        videoUrl: 'https://www.youtube.com/embed/CYMxvTtxyy4',
        isDiscontinued: true
    },
    {
        gameName: 'Anime Creatures',
        scriptName: 'Anime Creatures',
        description: 'Level up fast in Anime Creatures. Fully automated script for maximum efficiency.',
        scriptUrl: 'loadstring(game:HttpGet("https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxLoader.lua"))()',
        features: ['Auto Farm', 'Auto Hatch', 'Auto Equip', 'Teleports'],
        premiumFeatures: [],
        gameIcon: '/games/anime_creatures.png',
        videoUrl: 'https://www.youtube.com/embed/ewzkEJ0HgzQ',
        isDiscontinued: true
    }
];

export default function ScriptsGrid() {
    const activeScripts = SCRIPTS.filter(s => !(s as any).isDiscontinued);
    const discontinuedScripts = SCRIPTS.filter(s => (s as any).isDiscontinued);

    return (
        <div className="w-full max-w-7xl mx-auto px-6">
            {/* Active Scripts Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-[0.2em] uppercase text-white mb-3" style={{ fontFamily: 'Orbitron' }}>
                    Nebula <span className="text-code-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">Archives</span>
                </h2>
                <p className="text-starlight/50 font-mono text-xs uppercase tracking-[0.3em]">Active Script Library</p>
            </div>

            {/* Active Scripts Grid - 4 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {activeScripts.map((script, index) => (
                    <ScriptCard
                        key={index}
                        gameName={script.gameName}
                        scriptName={script.scriptName}
                        description={script.description}
                        scriptUrl={script.scriptUrl}
                        features={script.features}
                        premiumFeatures={script.premiumFeatures}
                        gameIcon={script.gameIcon}
                        videoUrl={script.videoUrl}
                        isDiscontinued={false}
                    />
                ))}
            </div>

            {/* Discontinued Scripts Section */}
            {discontinuedScripts.length > 0 && (
                <div className="mt-20">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-4 mb-3">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/40" />
                            <h3 className="text-xl font-bold tracking-[0.2em] uppercase text-red-500/70" style={{ fontFamily: 'Orbitron' }}>
                                Discontinued
                            </h3>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/40" />
                        </div>
                        <p className="text-starlight/30 font-mono text-[10px] uppercase tracking-[0.3em]">These scripts are no longer maintained</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {discontinuedScripts.map((script, index) => (
                            <ScriptCard
                                key={`disc-${index}`}
                                gameName={script.gameName}
                                scriptName={script.scriptName}
                                description={script.description}
                                scriptUrl={script.scriptUrl}
                                features={script.features}
                                premiumFeatures={script.premiumFeatures}
                                gameIcon={script.gameIcon}
                                videoUrl={script.videoUrl}
                                isDiscontinued={true}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
