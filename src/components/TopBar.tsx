"use client";

import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 h-24 bg-white/50 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-10">
       <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-zinc-900 tracking-tightest">Panel de Control</h1>
       </div>

       <div className="flex items-center gap-6">
          <div className="relative group hidden lg:block">
             <input 
               type="text" 
               placeholder="Buscar todo..." 
               className="bg-white border-zinc-200/50 border rounded-2xl px-8 py-3 text-[11px] font-bold w-64 focus:ring-4 focus:ring-zinc-100 transition-all shadow-sm outline-none placeholder:text-zinc-300"
             />
             <Search size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300" />
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 bg-white border border-gray-100 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all shadow-sm relative">
               <Bell size={18} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
             </button>
             <div className="h-10 w-[1px] bg-gray-100 mx-2" />
             <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                   <p className="text-[11px] font-black text-zinc-900 tracking-tight leading-none">Admin Studio</p>
                   <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">Super User</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border-2 border-white shadow-xl overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" alt="Avatar" className="w-full h-full object-cover" />
                </div>
             </div>
          </div>
       </div>
    </header>
  );
}
