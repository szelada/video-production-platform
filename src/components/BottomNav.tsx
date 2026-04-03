"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Briefcase,
    CheckSquare,
    Users,
    MapPin,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Inicio', href: '/', icon: LayoutDashboard },
    { name: 'Proyectos', href: '/projects', icon: Briefcase },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare },
    { name: 'Casting', href: '/casting', icon: Users },
    { name: 'Más', href: '#', icon: Menu }, // Placeholder for extra mobile menu if needed
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 backdrop-blur-md shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.06)] border-t border-slate-100 pb-safe pt-2 px-2">
            <nav className="flex items-center justify-around">
                {navItems.map((item) => {
                    const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '#');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center gap-1 p-2 group w-full relative"
                        >
                            <div className={cn(
                                "p-1.5 rounded-full transition-all duration-300",
                                active ? "bg-indigo-50 text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                            )}>
                                <item.icon size={20} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium transition-colors",
                                active ? "text-indigo-600 font-bold" : "text-slate-400 group-hover:text-slate-600"
                            )}>
                                {item.name}
                            </span>
                            {active && (
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-b-full shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
