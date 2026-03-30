import React from 'react';
import { Bell, Settings, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// `inline` prop = renders just the right-side icons (used inside Layout's header)
export function Header({ title, inline }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  let basePath = '/coordinator';
  if (user.role === 'super_admin') basePath = '/admin';
  if (user.role === 'manager') basePath = '/manager';

  // When used inline inside Layout, only render the icons cluster
  if (inline) {
    return (
      <div className="flex items-center gap-3 text-slate-400">
        <Link to={`${basePath}/settings`} className="hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg">
          <Bell className="w-5 h-5" />
        </Link>
        <Link to={`${basePath}/settings`} className="hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg">
          <Settings className="w-5 h-5" />
        </Link>
        <Link to={`${basePath}/settings`} className="hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg">
          <UserCircle className="w-6 h-6" />
        </Link>
      </div>
    );
  }

  // Standalone (legacy) full header
  return (
    <header className="bg-slate-900 border-b border-slate-800 h-14 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-bold text-slate-200">{title}</h1>
      <div className="flex items-center gap-3 text-slate-400">
        <Link to={`${basePath}/settings`} className="hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg">
          <Bell className="w-5 h-5" />
        </Link>
        <Link to={`${basePath}/settings`} className="hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg">
          <Settings className="w-5 h-5" />
        </Link>
        <Link to={`${basePath}/settings`} className="hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg">
          <UserCircle className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
