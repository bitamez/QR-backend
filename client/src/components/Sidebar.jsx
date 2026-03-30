import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, MapPin, Users, FileText, MessageSquare, QrCode, LogOut, Shield } from 'lucide-react';

export function Sidebar({ role, onNavigate }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getLinks = () => {
    switch (role) {
      case 'super_admin':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
          { name: 'Organizations', icon: Building2, path: '/admin/orgs' },
          { name: 'Branches', icon: MapPin, path: '/admin/branches' },
          { name: 'Users', icon: Users, path: '/admin/users' },
          { name: 'Roles', icon: Shield, path: '/admin/roles' },
          { name: 'Reports', icon: FileText, path: '/analytics' },
        ];
      case 'manager':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/manager' },
          { name: 'Feedback', icon: MessageSquare, path: '/manager/feedback' },
          { name: 'My Branch', icon: MapPin, path: '/manager/branch' },
        ];
      case 'coordinator':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/coordinator' },
          { name: 'Assigned Branches', icon: MapPin, path: '/coordinator/branches' },
          { name: 'Reports', icon: FileText, path: '/coordinator/reports' },
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const links = getLinks();
  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : 'ME';

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 h-full flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
          <QrCode className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-100">QR Feedback</p>
          <p className="text-[10px] text-slate-500 capitalize">{role?.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
            return (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 shadow-inner'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  {link.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{user.username || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">{role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
