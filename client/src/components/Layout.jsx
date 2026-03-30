import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Layout({ role, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">

      {/* ─── Desktop Sidebar (hidden on mobile) ─── */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar role={role} />
      </div>

      {/* ─── Mobile Drawer Overlay ─── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed left-0 top-0 h-full z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="relative">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-[-44px] z-50 bg-slate-800 border border-slate-700 text-slate-300 rounded-full p-2 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar role={role} onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header with mobile hamburger */}
        <header className="bg-slate-900 border-b border-slate-800 h-14 flex items-center justify-between px-4 shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Hamburger – only on mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-base font-bold text-slate-200 truncate">{title}</span>
          </div>
          <Header inline />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 lg:pb-6 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      <MobileBottomNav role={role} />
    </div>
  );
}
