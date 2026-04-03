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
    <aside className="fixed top-0 left-0 z-50 h-full w-[100px] xl:w-[280px] bg-white border-r border-gray-200/50 flex flex-col py-10 px-6 transition-all duration-500 hidden lg:flex shadow-sm">
      {/* Brand Logo Section */}
      <div className="flex items-center gap-4 mb-14 px-2">
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-black/20 shrink-0">
          <Sparkles size={24} />
        </div>
        <div className="hidden xl:block">
          <h2 className="text-lg font-black tracking-tighter text-zinc-900 leading-none">916 STUDIO</h2>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Production Hub</p>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-[2rem] transition-all group",
                isActive
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200"
                  : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
              )}
            >
              <item.icon 
                size={20} 
                className={cn(
                  "transition-all",
                  isActive ? "text-white" : "group-hover:scale-110"
                )} 
              />
              <span className="hidden xl:block text-xs font-black uppercase tracking-widest">{item.name}</span>
              {item.name === 'Mensajes' && <span className="ml-auto w-5 h-5 bg-indigo-500 rounded-full text-[10px] flex items-center justify-center text-white">3</span>}
            </Link>
          );
        })}
      </nav>

      {/* Premium Plan Card & Settings */}
      <div className="mt-auto pt-10 border-t border-zinc-100 px-2 space-y-4">
        <div className="hidden xl:block bg-gradient-to-br from-[#DFFF00] to-[#BFFF00] p-6 rounded-[2.5rem] shadow-xl shadow-lime-200/50 relative overflow-hidden group mb-4">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <h4 className="text-[10px] font-black text-lime-900 uppercase tracking-widest mb-2 relative z-10">Premium Plan</h4>
          <p className="text-xs font-black text-lime-950 leading-tight mb-4 relative z-10">Desbloquea IA de Scouting</p>
          <button className="w-full py-3 bg-black text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10">Actualizar</button>
        </div>
        
        <Link 
          href="/settings"
          className="w-full flex items-center gap-4 px-5 py-4 text-zinc-400 hover:bg-zinc-50 rounded-[2rem] transition-all"
        >
          <Settings size={20} />
          <span className="hidden xl:block text-xs font-black uppercase tracking-widest">Ajustes</span>
        </Link>
      </div>
    </aside>
  );
}
