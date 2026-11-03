import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  ShieldCheck,
  Inbox,
  Archive,
  UserCheck,
  BarChart3,
  Database
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Landing Overview', path: '/landing', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Spam Detector', path: '/detector', icon: ShieldCheck },
  { name: 'Message History', path: '/history', icon: Inbox },
  { name: 'Spam Archive', path: '/archive', icon: Archive },
  { name: 'Whitelist Rules', path: '/whitelist', icon: UserCheck },
  { name: 'Analytics & ML', path: '/analytics', icon: BarChart3 },
  { name: 'NoSQL Operations', path: '/nosql', icon: Database },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] transition-colors">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          Navigation Menu
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

