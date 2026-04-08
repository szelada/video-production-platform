"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MapPin,
  Settings,
  Truck,
  ListChecks,
  Camera,
  Home,
  Rocket,
  Info,
  Sparkles,
  Calendar,
  FolderOpen,
  Activity,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const navItems = [
  { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { id: 'projects', name: 'Proyectos', href: '/projects', icon: FolderOpen },
  { id: 'calendar', name: 'Calendario', href: '/calendar', icon: Calendar },
  { id: 'casting', name: 'Talento', href: '/casting', icon: Users },
  { id: 'metrics', name: 'Métricas', href: '/metrics', icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profile) setUserProfile(profile);
      }
    };
    fetchProfile();
  }, []);

  return (
    <aside className="fixed top-0 left-0 z-50 h-full w-[100px] xl:w-[280px] bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col py-10 px-6 transition-all duration-500 hidden lg:flex shadow-2xl">
      {/* Brand Logo Section */}
      <div className="flex items-center gap-4 mb-14 px-2">
        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/10 shrink-0">
          <Sparkles size={24} className="text-white drop-shadow-md" />
        </div>
        <div className="hidden xl:block">
          <h2 className="text-xl font-black tracking-tighter text-white leading-none italic">916 STUDIO</h2>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-1.5">Production Hub</p>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-[2rem] transition-all group relative overflow-hidden",
                isActive
                  ? "bg-white/10 text-white shadow-2xl border border-white/10 shadow-indigo-500/5 ring-1 ring-white/5"
                  : "text-white/30 hover:bg-white/5 hover:text-white/60"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-50" />
              )}
              <item.icon 
                size={20} 
                className={cn(
                  "transition-all relative z-10",
                  isActive ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" : "group-hover:scale-110"
                )} 
              />
              <span className="hidden xl:block text-[11px] font-black uppercase tracking-[0.2em] relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Premium Plan Card & Settings */}
      <div className="mt-auto pt-10 border-t border-white/5 px-2 space-y-4">
        <div className="hidden xl:block bg-gradient-to-br from-zinc-900 to-black p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 relative overflow-hidden group mb-6 border border-white/5 hover:border-indigo-500/20 transition-all">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <Activity size={14} className="text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Tier: Advanced</h4>
            </div>
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-tighter leading-tight mb-5 relative z-10">IA Production Suite</h3>
          <button className="w-full py-4 bg-white text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-zinc-100 active:scale-95 transition-all relative z-10">
            Upgrade Studio
          </button>
        </div>
        
        <Link 
          href="/settings"
          className="w-full flex items-center gap-4 px-6 py-4 text-white/30 hover:bg-white/5 hover:text-white rounded-[2rem] transition-all border border-transparent hover:border-white/5"
        >
          <Settings size={20} className="transition-transform group-hover:rotate-45" />
          <span className="hidden xl:block text-[11px] font-black uppercase tracking-[0.2em]">Ajustes</span>
        </Link>
      </div>
    </aside>
  );
}
