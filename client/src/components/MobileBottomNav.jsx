import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Users, FileText, MessageSquare, Settings } from 'lucide-react';

export function MobileBottomNav({ role }) {
  const location = useLocation();

  const getLinks = () => {
    switch (role) {
      case 'super_admin':
        return [
          { name: 'Home', icon: LayoutDashboard, path: '/admin' },
          { name: 'Branches', icon: MapPin, path: '/admin/branches' },
          { name: 'Users', icon: Users, path: '/admin/users' },
          { name: 'Reports', icon: FileText, path: '/analytics' },
          { name: 'Settings', icon: Settings, path: '/admin/settings' },
        ];
      case 'manager':
        return [
          { name: 'Home', icon: LayoutDashboard, path: '/manager' },
          { name: 'Feedback', icon: MessageSquare, path: '/manager/feedback' },
          { name: 'Branch', icon: MapPin, path: '/manager/branch' },
          { name: 'Settings', icon: Settings, path: '/manager/settings' },
        ];
      case 'coordinator':
        return [
          { name: 'Home', icon: LayoutDashboard, path: '/coordinator' },
          { name: 'Branches', icon: MapPin, path: '/coordinator/branches' },
          { name: 'Reports', icon: FileText, path: '/coordinator/reports' },
          { name: 'Settings', icon: Settings, path: '/coordinator/settings' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    /* Only shows on screens smaller than lg (1024px) */
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 
      bg-slate-900/95 backdrop-blur-md border-t border-slate-800 
      flex items-center justify-around
      px-1 pt-2 pb-4
      shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
        return (
          <NavLink
            key={link.name}
            to={link.path}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all min-w-0 flex-1 ${
              isActive ? 'text-blue-400' : 'text-slate-500'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-600/20' : ''}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
            </div>
            <span className="text-[9px] font-semibold tracking-wide truncate w-full text-center">{link.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
