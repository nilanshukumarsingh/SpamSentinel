import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Inbox,
  Archive,
  UserCheck,
  BarChart3,
  Database,
  ExternalLink
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Spam Detector', path: '/detector', icon: ShieldAlert },
  { name: 'Message History', path: '/history', icon: Inbox },
  { name: 'Spam Archive', path: '/archive', icon: Archive },
  { name: 'Whitelist Rules', path: '/whitelist', icon: UserCheck },
  { name: 'Analytics & ML', path: '/analytics', icon: BarChart3 },
  { name: 'NoSQL Operations', path: '/nosql', icon: Database },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-full bg-white dark:bg-[#09090b] border-r border-slate-200 dark:border-zinc-800/80 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-4">
        {/* Navigation Section Title */}
        <div className="px-3 text-[11px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
          Navigation
        </div>

        {/* Links */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 dark:text-zinc-500'
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

      {/* Bottom Showcase Link */}
      <div className="p-4 border-t border-slate-200 dark:border-zinc-800/80">
        <NavLink
          to="/landing"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-zinc-800 transition-colors group"
        >
          <span>Landing Overview</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </NavLink>
      </div>
    </aside>
  );
};
