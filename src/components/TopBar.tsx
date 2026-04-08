"use client";

import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 h-24 bg-black/20 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-10">
       <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black text-white tracking-tightest uppercase italic">Control Hub</h1>
       </div>

       <div className="flex items-center gap-6">
          <div className="relative group hidden lg:block">
             <input 
               type="text" 
               placeholder="Buscar todo..." 
               className="bg-white/5 border-white/10 border rounded-2xl px-10 py-3 text-[11px] font-bold w-64 focus:ring-4 focus:ring-white/5 transition-all shadow-xl outline-none placeholder:text-white/20 text-white"
             />
             <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all shadow-xl relative backdrop-blur-sm">
               <Bell size={18} />
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-zinc-900 shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
             </button>
             <div className="h-10 w-[1px] bg-white/5 mx-2" />
             <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                   <p className="text-[11px] font-black text-white tracking-tight leading-none uppercase">Admin Studio</p>
                   <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Super User</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border-2 border-white/10 shadow-2xl overflow-hidden ring-2 ring-indigo-500/20">
                   <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" alt="Avatar" className="w-full h-full object-cover" />
                </div>
             </div>
          </div>
       </div>
    </header>
  );
}
