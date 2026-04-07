'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function VerifySuccessPage() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Initializing Verification Check...');
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const err = searchParams.get('error');
        const user = searchParams.get('username');

        if (err) {
            setStatus('error');
            switch (err) {
                case 'access_denied':
                    setMessage('You denied Discord authorization. We cannot link your account.');
                    break;
                case 'no_code':
                    setMessage('Authentication code was missing from the callback.');
                    break;
                case 'auth_failed':
                    setMessage('Failed to exchange authorization code for an access token.');
                    break;
                case 'user_fetch_failed':
                    setMessage('Could not retrieve your user information from Discord.');
                    break;
                case 'internal_error':
                    setMessage('An internal server error occurred during verification.');
                    break;
                default:
                    setMessage(`An unknown error occurred: ${err}`);
            }
        } else if (user) {
            setStatus('success');
            setUsername(user);
            setMessage('Your soul has been bound to the Nebublox Nexus. You have received the Void Walker role.');
        } else {
            // Give it a brief moment to "load" for aesthetic effect before checking
            setTimeout(() => {
                if (!err && !user) {
                    setStatus('error');
                    setMessage('Invalid verification state. Please try again from Discord.');
                }
            }, 1500);
        }
    }, [searchParams]);

    return (
        <main className="min-h-screen bg-[#050510] relative flex items-center justify-center overflow-hidden font-mono text-starlight selection:bg-code-cyan/30">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-singularity/20 rounded-full blur-[120px] mix-blend-screen opacity-50" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-code-cyan/10 rounded-full blur-[100px] mix-blend-screen opacity-40" />
            </div>

            <div className="z-10 relative flex flex-col items-center w-full max-w-lg p-8">
                {/* Status Icon */}
                <div className="mb-8 relative flex items-center justify-center">
                    {status === 'loading' && (
                        <div className="w-24 h-24 border-4 border-code-cyan/30 border-t-code-cyan rounded-full animate-spin shadow-[0_0_30px_rgba(0,255,255,0.3)]"></div>
                    )}
                    {status === 'success' && (
                        <div className="relative">
                            <div className="absolute inset-0 bg-code-cyan/20 blur-2xl rounded-full scale-150 animate-pulse" />
                            <CheckCircle className="w-24 h-24 text-code-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] relative z-10" />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                            <XCircle className="w-24 h-24 text-red-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)] relative z-10" />
                        </div>
                    )}
                </div>

                {/* Main Content Card */}
                <div
                    className="w-full border border-white/10 rounded-xl p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-700 transform"
                    style={{
                        opacity: status === 'loading' ? 0.8 : 1,
                        transform: status === 'loading' ? 'scale(0.98)' : 'scale(1)'
                    }}
                >
                    <h1 className="text-2xl font-bold tracking-[0.2em] uppercase mb-2" style={{ fontFamily: 'Orbitron' }}>
                        {status === 'loading' && 'PROCESSING OAUTH'}
                        {status === 'success' && 'AUTHORIZATION GRANTED'}
                        {status === 'error' && 'AUTHORIZATION FAILED'}
                    </h1>

                    {status === 'success' && username && (
                        <h2 className="text-xl text-code-cyan font-semibold mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                            Welcome, {username}
                        </h2>
                    )}

                    <p className={`text-sm tracking-wide leading-relaxed ${status === 'error' ? 'text-red-400' : 'text-starlight/70'}`}>
                        {message}
                    </p>

                    {/* Verification Dashboard Steps */}
                    <div className="mt-8 space-y-4 text-left">
                        {/* STEP 1: ROLE */}
                        <div className={`p-4 rounded-lg border transition-all duration-500 ${status === 'success' ? 'bg-code-cyan/5 border-code-cyan/30' : 'bg-white/5 border-white/5 opacity-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${status === 'success' ? 'bg-code-cyan text-black' : 'bg-white/10 text-starlight/40'}`}>1</div>
                                <div className="flex-1">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-starlight">Account Binding</h3>
                                    <p className="text-[10px] text-starlight/60">Void Walker role granted in the Command Outpost.</p>
                                </div>
                                {status === 'success' && <CheckCircle className="w-5 h-5 text-code-cyan animate-pulse" />}
                            </div>
                        </div>

                        {/* STEP 2: JUNKIE */}
                        <div className={`p-4 rounded-lg border transition-all duration-500 ${status === 'success' ? 'bg-singularity/5 border-singularity/30' : 'bg-white/5 border-white/5 opacity-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${status === 'success' ? 'bg-singularity text-white' : 'bg-white/10 text-starlight/40'}`}>2</div>
                                <div className="flex-1">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-starlight">Nexus Synchronization</h3>
                                    <p className="text-[10px] text-starlight/60">Link your session with the Junkie verification API.</p>
                                </div>
                            </div>
                            {status === 'success' && (
                                <a
                                    href="https://api.jnkie.com/api/session/discord/callback"
                                    className="mt-3 w-full py-2 flex items-center justify-center gap-2 bg-singularity/20 hover:bg-singularity/40 border border-singularity/50 rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                                >
                                    Sync with Junkie
                                    <ArrowRight className="w-3 h-3" />
                                </a>
                            )}
                        </div>

                        {/* STEP 3: KEY */}
                        <div className={`p-4 rounded-lg border transition-all duration-500 ${status === 'success' ? 'bg-code-pink/5 border-code-pink/30' : 'bg-white/5 border-white/5 opacity-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${status === 'success' ? 'bg-code-pink text-white' : 'bg-white/10 text-starlight/40'}`}>3</div>
                                <div className="flex-1">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-starlight">Terminal Access</h3>
                                    <p className="text-[10px] text-starlight/60">Retrieve your specialized access key and begin.</p>
                                </div>
                            </div>
                            {status === 'success' && (
                                <a
                                    href="https://jnkie.com/get-key/fremium"
                                    className="mt-3 w-full py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-code-cyan to-singularity hover:shadow-[0_0_15px_rgba(157,0,255,0.4)] rounded text-[10px] font-black uppercase tracking-widest transition-all text-white"
                                >
                                    Retrieve Access Key
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
                        {status === 'error' && (
                            <Link
                                href="/"
                                className="group flex items-center justify-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded transition-all duration-300"
                            >
                                <span className="font-semibold tracking-wider text-sm uppercase text-white/80 group-hover:text-white transition-colors">
                                    Initialize Re-Entry
                                </span>
                            </Link>
                        )}
                        <p className="text-[9px] text-starlight/30 uppercase tracking-[0.3em]">Nebublox Architecture v5.6 // DarkMatter Protocol</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
