'use client';

import React, { useState, useEffect, useRef } from 'react';

interface BootLine {
    text: string;
    type: 'system' | 'success' | 'warning' | 'critical';
    delay: number;
    pause?: number;
}

const bootSequence: BootLine[] = [
    { text: '> INITIALIZING NEBUBLOX ENGINE [v1.0]...', type: 'system', delay: 0 },
    { text: '> CONNECTING TO NEBULA CORE...', type: 'system', delay: 100 },
    { text: '> ...', type: 'system', delay: 100 },
    { text: '[SYSTEM]  Parsing Reality Anchors...     [OK]', type: 'success', delay: 200 },
    { text: '[SYSTEM]  Loading Arcane Libraries...    [OK]', type: 'success', delay: 150 },
    { text: '[SYSTEM]  Establishing Void Link...      [OK]', type: 'success', delay: 150 },
    { text: '', type: 'system', delay: 100 },
    { text: 'DETECTING USER...', type: 'system', delay: 200, pause: 500 },
    { text: '', type: 'system', delay: 100 },
    { text: '[WARNING] REALITY BENDING DETECTED.', type: 'warning', delay: 300 },
    { text: '[WARNING] PHYSICS ENGINE UNSTABLE.', type: 'warning', delay: 300 },
    { text: '', type: 'system', delay: 100 },
    { text: 'STABILIZING EVENT HORIZON...', type: 'critical', delay: 300, pause: 1000 },
    { text: '...', type: 'system', delay: 400 },
    { text: '...', type: 'system', delay: 400 },
    { text: '[SUCCESS] NEBULA STABILIZED.', type: 'success', delay: 400 },
    { text: '', type: 'system', delay: 100 },
    { text: 'WELCOME, ARCHITECT.', type: 'critical', delay: 500, pause: 500 },
    { text: 'CONJURE YOUR REALITY.', type: 'critical', delay: 500, pause: 1000 },
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
    const [lines, setLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [isImploding, setIsImploding] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const isAudioUnlockedRef = useRef(false);

    // Initialize shared AudioContext ONCE
    useEffect(() => {
        const unlockAudio = () => {
            if (isAudioUnlockedRef.current) return;

            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext();
            }

            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume().then(() => {
                    isAudioUnlockedRef.current = true;
                });
            } else {
                isAudioUnlockedRef.current = true;
            }
        };

        document.addEventListener('click', unlockAudio, { once: true });
        document.addEventListener('keydown', unlockAudio, { once: true });

        return () => {
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };
    }, []);

    // Typing sound using shared context
    const playClick = () => {
        if (!audioContextRef.current || !isAudioUnlockedRef.current) return;

        try {
            const ctx = audioContextRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3000, ctx.currentTime);

            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.015, ctx.currentTime + 0.05);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {
            // Fail silently
        }
    };

    // Blinking cursor
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 400);
        return () => clearInterval(cursorInterval);
    }, []);

    // Typewriter effect with sound
    useEffect(() => {
        if (currentLineIndex >= bootSequence.length) {
            setTimeout(() => {
                setIsImploding(true);
                setTimeout(() => {
                    onComplete();
                }, 1500);
            }, 500);
            return;
        }

        const currentBootLine = bootSequence[currentLineIndex];
        const targetText = currentBootLine.text;

        if (currentText.length < targetText.length) {
            const timeout = setTimeout(() => {
                const char = targetText[currentText.length];
                if (char && char !== ' ') {
                    playClick();
                }
                setCurrentText(targetText.slice(0, currentText.length + 1));
            }, 30);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setLines(prev => [...prev, currentText]);
                setCurrentText('');
                setCurrentLineIndex(prev => prev + 1);
            }, currentBootLine.pause || 100);
            return () => clearTimeout(timeout);
        }
    }, [currentText, currentLineIndex, onComplete]);

    const getLineColor = (type: string) => {
        switch (type) {
            case 'success':
                return '#00FFFF';
            case 'warning':
                return '#FFAA00';
            case 'critical':
                return '#6A0DAD';
            default:
                return '#E0E0E0';
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-void flex items-center justify-center">
            <div
                className={`w-full max-w-4xl px-8 transition-all duration-1500 ${isImploding ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                    }`}
                style={{
                    transform: isImploding ? 'scale(0)' : 'scale(1)',
                    filter: isImploding ? 'blur(20px)' : 'blur(0px)'
                }}
            >
                <div className="font-mono text-base md:text-lg space-y-2">
                    {lines.map((line, index) => {
                        const bootLine = bootSequence[index];
                        return (
                            <div
                                key={index}
                                style={{ color: getLineColor(bootLine.type) }}
                                className="animate-fadeIn"
                            >
                                {line}
                            </div>
                        );
                    })}

                    {currentLineIndex < bootSequence.length && (
                        <div
                            style={{ color: getLineColor(bootSequence[currentLineIndex].type) }}
                            className="flex items-center"
                        >
                            <span>{currentText}</span>
                            <span
                                className={`ml-1 w-2 h-5 bg-current ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                                style={{ display: 'inline-block' }}
                            >
                                █
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {isImploding && (
                <div
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(106, 13, 173, 0.8) 0%, transparent 70%)',
                        animation: 'explode 1.5s ease-out forwards'
                    }}
                />
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes explode {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
        </div>
    );
}
