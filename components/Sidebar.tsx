import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, PlusCircle, LogOut, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const getLinks = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return [
          { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/admin', icon: CheckSquare, label: 'Approvals' }, // Simulating sub-section
          { to: '/admin', icon: Users, label: 'Clubs & Students' },
        ];
      case UserRole.CLUB:
        return [
          { to: '/club', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/club/create-event', icon: PlusCircle, label: 'Create Event' },
        ];
      case UserRole.STUDENT:
        return [
          { to: '/student', icon: Calendar, label: 'Browse Events' },
          { to: '/student', icon: CheckSquare, label: 'My Registrations' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          UniEvent Pro
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{user?.role} Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {getLinks().map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            end={link.to !== '/club/create-event'} // Handle exact match for dashboard home
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <link.icon size={20} />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full bg-slate-700" />
            <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full text-slate-300 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;