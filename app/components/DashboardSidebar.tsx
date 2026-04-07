'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, Globe, FileCode, Box, LogOut, LayoutDashboard, User } from 'lucide-react';

export default function DashboardSidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname?.startsWith(path);

    // Sidebar items config
    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Architect', path: '/dashboard/architect', icon: Cpu },
        { name: 'World Gen', path: '/dashboard/world', icon: Globe },
        { name: 'Script Gen', path: '/dashboard/script', icon: FileCode },
        { name: 'Resources', path: '/dashboard/resources', icon: Box },
    ];

    return (
        <aside className="w-64 bg-[#0a0a0f]/90 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen sticky top-0">
            {/* Logo Area */}
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="block">
                    <h1 className="text-xl font-black text-white tracking-tighter font-exo2">
                        NEBULA<span className="text-code-pink">.AI</span>
                    </h1>
                    <p className="text-[10px] text-starlight/50 font-mono tracking-widest">DASHBOARD_V1.0</p>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive(item.path) && (item.path !== '/dashboard' || pathname === '/dashboard')
                                ? 'bg-code-pink/10 text-white border-l-2 border-code-pink'
                                : 'text-starlight/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={18} />
                        <span className="font-mono text-sm font-bold tracking-wide">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-white/10">
                <div className="bg-white/5 rounded-lg p-3 mb-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-code-cyan to-code-pink flex items-center justify-center text-white text-xs font-bold">
                        US
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">User</p>
                        <p className="text-[10px] text-starlight/50 truncate">Premium Plan</p>
                    </div>
                </div>

                <button
                    className="w-full flex items-center justify-center gap-2 p-2 rounded text-red-400 hover:bg-red-400/10 transition-colors text-xs font-mono uppercase tracking-widest"
                    onClick={() => {
                        // TODO: Implement Supabase SignOut
                        window.location.href = '/login';
                    }}
                >
                    <LogOut size={14} /> Disconnect
                </button>
            </div>
        </aside>
    );
}
