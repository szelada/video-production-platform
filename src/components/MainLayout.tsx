"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <main className="min-h-screen bg-background h-screen overflow-hidden">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Configuration for Desktop Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-[100px] xl:pl-[280px] transition-all duration-500 pb-20 lg:pb-0 min-w-0">
        <TopBar />

        <main className="flex-1 w-full relative">
          {children}
        </main>
      </div>

      {/* Configuration for Mobile Navigation */}
      <BottomNav />
    </div>
  );
}
